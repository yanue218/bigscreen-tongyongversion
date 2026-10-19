const ROOT=new URL('./',self.location.href),NAME='market-entrance-shell-BUILD_VERSION:'+ROOT.pathname;
const ASSETS=/* BUILD_ASSETS */ [];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(NAME),response=await fetch(ROOT,{cache:'no-store'});
 if(!response.ok)throw new Error('Market shell unavailable');
 const html=await response.clone().text();
 const paths=ASSETS.length?ASSETS:[...html.matchAll(/(?:src|href)="([^\"]+)"/g)].map(m=>m[1]);
 const urls=paths.map(p=>new URL(p,ROOT)).filter(u=>u.origin===ROOT.origin&&u.pathname.startsWith(ROOT.pathname));
 await cache.addAll(urls);await cache.put(ROOT.href,response);await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await self.clients.claim();for(const name of await caches.keys())if(name!==NAME&&name.startsWith('market-entrance-shell-')&&name.endsWith(':'+ROOT.pathname))await caches.delete(name);})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname)||url.pathname.includes('/api/')||url.pathname.includes('/files/'))return;
 event.respondWith((async()=>{const cache=await caches.open(NAME);try{const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}catch(error){const saved=await cache.match(request)||(request.mode==='navigate'?await cache.match(ROOT.href):undefined);if(saved)return saved;throw error;}})());
});
