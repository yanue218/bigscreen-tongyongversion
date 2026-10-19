// Public market data only. Approval, publishing and stall devices belong to the backend.
const allowedMime = new Set(['image/png', 'image/jpeg', 'image/webp']);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const strings = (row, fields) => fields.every(key => typeof row[key] === 'string');
const unique = rows => new Set(rows.map(row => row.id)).size === rows.length;
export function validateSnapshot(s, marketId) {
  const fail = () => { throw new Error('市场展示资料格式无效'); };
  if (!object(s) || s.schemaVersion !== '1.0' || !object(s.market) || s.market.id !== marketId || !Number.isInteger(s.revision) || s.revision < 0) fail();
  for (const key of ['categories','stalls','floors','encyclopedia']) if (!Array.isArray(s[key]) || s[key].some(row => !object(row) || typeof row.id !== 'string') || !unique(s[key])) fail();
  if (s.categories.length > 30 || s.stalls.length > 1000 || s.floors.length > 10 || s.encyclopedia.length > 100) fail();
  const cats = new Set(s.categories.map(c => c.id));
  for (const c of s.categories) if (!strings(c,['name','nameEn'])) fail();
  for (const row of s.stalls) {
    if (!strings(row,['name','code','nameEn','intro','introEn','message','messageEn','categoryId','floorId','zoneId']) || !cats.has(row.categoryId) || !Array.isArray(row.goods) || !row.goods.every(g => typeof g === 'string') || !Array.isArray(row.photos) || row.photos.length > 2) fail();
    for (const a of row.photos) if (!object(a) || !strings(a,['id','url','sha256','mimeType']) || !allowedMime.has(a.mimeType) || !/^[a-f0-9]{64}$/i.test(a.sha256)) fail();
  }
  for (const f of s.floors) {
    if (!strings(f,['name','nameEn']) || !Number.isFinite(f.width) || f.width <= 0 || !Number.isFinite(f.height) || f.height <= 0 || !Array.isArray(f.zones) || !unique(f.zones) || f.zones.length > 300) fail();
    for (const z of f.zones) {
      if (!object(z) || !strings(z,['id','categoryId','title','titleEn','description','descriptionEn']) || !['x','y','width','height'].every(k => Number.isFinite(z[k])) || z.x < 0 || z.y < 0 || z.width <= 0 || z.height <= 0 || z.x+z.width > f.width || z.y+z.height > f.height) fail();
    }
  }
  for (const k of s.encyclopedia) if (!strings(k,['name','nameEn','origin','features','cooking'])) fail();
  return s;
}
export const contentFingerprint = snapshot => JSON.stringify(snapshot,(key,value) => ['url','serverTime'].includes(key) ? undefined : value);
export async function hash(blob) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))].map(v=>v.toString(16).padStart(2,'0')).join(''); }
function database() { return new Promise((resolve,reject) => { const req=indexedDB.open('market-entrance-v1',1); req.onupgradeneeded=()=>req.result.createObjectStore('snapshots'); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); }); }
async function cache(mode,key,value) {
  const db=await database();
  try { return await new Promise((resolve,reject)=> { const tx=db.transaction('snapshots',mode), store=tx.objectStore('snapshots'); const req=mode==='readonly'?store.get(key):store.put(value,key); let result; req.onsuccess=()=>{result=req.result;}; tx.oncomplete=()=>resolve(result); tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error); }); } finally { db.close(); }
}
export function createMarketClient({apiBase='',marketId,onData,onStatus,fetcher=fetch}) {
  const base=apiBase.replace(/\/$/,''), endpoint=`${base}/api/public/markets/${encodeURIComponent(marketId)}/entrance`;
  let previous, fingerprint='', urls=[], timer, stopped=false, syncing=false, controller;
  async function prepare(snapshot,existing={}) {
    validateSnapshot(snapshot,marketId); const blobs={};
    for(const row of snapshot.stalls) for(const asset of row.photos) {
      if(blobs[asset.sha256]) continue;
      if(existing[asset.sha256]) { blobs[asset.sha256]=existing[asset.sha256]; continue; }
      const address=new URL(asset.url,base?new URL(base,location.href):location.origin);
      if(!['http:','https:'].includes(address.protocol)) throw new Error('图片地址无效');
      const response=await fetcher(address,{credentials:'omit',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(15000)])});
      if(!response.ok) throw new Error('图片暂时无法读取');
      const blob=await response.blob(); if(!allowedMime.has(blob.type)||await hash(blob)!==asset.sha256) throw new Error('图片校验失败');
      await createImageBitmap(blob).then(b=>b.close()); blobs[asset.sha256]=blob;
    }
    return {snapshot,blobs};
  }
  function apply(value) {
    const next=contentFingerprint(value.snapshot); previous=value;
    if(next===fingerprint||stopped)return;
    const old=urls; urls=[]; const data=structuredClone(value.snapshot);
    for(const row of data.stalls)for(const a of row.photos){a.localUrl=URL.createObjectURL(value.blobs[a.sha256]);urls.push(a.localUrl);}
    onData(data); fingerprint=next; old.forEach(u=>URL.revokeObjectURL(u));
  }
  async function sync() {
    if(syncing||stopped)return; syncing=true; clearTimeout(timer); controller=new AbortController();
    try {
      const response=await fetcher(endpoint,{cache:'no-store',credentials:'omit',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(15000)])});
      const envelope=await response.json(); if(!response.ok||envelope.code!==0)throw new Error('市场资料暂时无法读取');
      const next=await prepare(envelope.data,previous?.blobs); if(stopped)return;
      let persisted=true; try{await cache('readwrite',endpoint,next);}catch{persisted=false;}
      apply(next); onStatus(next.snapshot.revision?`已更新 Updated · 版本 v${next.snapshot.revision}${persisted?'':' · 本机缓存不可用 no local cache'}`:'暂无已发布资料 Nothing published yet','ready');
    } catch(error) { if(!stopped)onStatus(previous?`暂时离线 Offline · 显示缓存版本 v${previous.snapshot.revision}`:'暂时无法连接 Connection failed · 尚无缓存资料 no cached info','offline'); }
    finally{syncing=false;if(!stopped)timer=setTimeout(sync,60000);}
  }
  return {
    async start(){
      try {const saved=await cache('readonly',endpoint);if(saved){validateSnapshot(saved.snapshot,marketId);for(const row of saved.snapshot.stalls)for(const a of row.photos){const blob=saved.blobs?.[a.sha256];if(!blob||await hash(blob)!==a.sha256)throw new Error('缓存图片校验失败');}apply(saved);onStatus(`缓存版本 v${saved.snapshot.revision} Cached · 正在更新 Updating`,'cached');}}catch{/* Network can repair missing or invalid cache. */}
      await sync();
    }, refresh:sync,
    stop(){stopped=true;clearTimeout(timer);controller?.abort();urls.forEach(u=>URL.revokeObjectURL(u));}
  };
}
