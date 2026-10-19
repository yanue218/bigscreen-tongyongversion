import {spotlightGroups,currentMerchant,nextMerchant} from './spotlight.js';
import {createMarketClient} from './market-data.js';
import {floorPlan1F} from './floor-plan-data.js';
import {mountFishWave} from './fish-wave.js';
import {mountGlowFish} from './glow-fish.js';
import planCropUrl from '../images/floor-plan-1f-crop.jpg';
const moduleFiles=import.meta.glob('../images/modules/*.jpg',{eager:true,query:'?url',import:'default'});
const iconFiles=import.meta.glob('../icons/*.svg',{eager:true,query:'?url',import:'default'});
const artFiles=import.meta.glob('../images/icon-p-*.png',{eager:true,query:'?url',import:'default'});
const $=id=>document.getElementById(id);
const el=(tag,value='',className='')=>{const node=document.createElement(tag);node.textContent=value;node.className=className;return node;};
const bi=(zh,en,cls='')=>{const node=el('span','','bi'+(cls?' '+cls:''));node.append(el('span',zh));if(en)node.append(el('span',en,'en'));return node;};
const attach=(node,value)=>{if(typeof value==='string')node.textContent=value;else node.append(value);return node;};
function icon(name,extra=''){const img=el('img','','icon '+extra);if(name.startsWith('pair:'))img.src=iconFiles[`../icons/pair-${name.slice(5)}.svg`];else if(name.startsWith('art:')){const art=artFiles[`../images/icon-${name.slice(4)}.png`];if(art)img.classList.add('art-icon');img.src=art;}else img.src=iconFiles[`../icons/${name}.svg`]||iconFiles['../icons/store.svg'];img.alt='';img.setAttribute('aria-hidden','true');return img;}
function button(label,callback,cls='quiet-button',symbol){const b=el('button','',cls);b.type='button';if(symbol)b.append(icon(symbol));b.append(typeof label==='string'?el('span',label):label);b.addEventListener('click',callback);return b;}
function empty(title,description,symbol='store'){const box=el('div','','empty-state');box.append(icon(symbol),attach(el('h3'),title),attach(el('p'),description));return box;}
let data={categories:[],stalls:[],floors:[],encyclopedia:[]},view='home',category='',selected='',floor='',zone='',query='',lastAction=Date.now(),client,loadState='loading',detailReturn='shops';
const isPreview=import.meta.env.DEV && new URLSearchParams(location.search).get('preview')==='design';
const ROTATION_MS=3000;
const spotlightMerchants=new Map();
let rotationTimer, rotating=false;
function featureCard(group,stall){
 const node=card(stall,true);
 node.dataset.categoryId=group.category.id;
 const label=node.querySelector('.sample-tag')||el('span','','sample-tag');
 label.textContent=displayName(group.category.name)+(group.category.nameEn?' · '+group.category.nameEn:'')+(isPreview?' · 示意 Sample':'');
 if(!label.isConnected)node.append(label);
 return node;
}
/* 照片标签展示名：品类名统一加「特色」前缀（特色水产、特色蔬果、特色肉禽…） */
function displayName(name){if(/水产|海鲜/.test(name))return '特色水产';if(/蔬|果/.test(name))return '特色蔬果';if(/肉|禽|蛋/.test(name))return '特色肉禽';if(/粮|油|干货/.test(name))return '特色粮油干货';if(/副食|调料|熟食/.test(name))return '特色副食';return name;}
function scheduleRotation(){
 clearTimeout(rotationTimer);
 if(view==='home'&&spotlightGroups(data).some(group=>group.stalls.length>1)&&!document.hidden)
  rotationTimer=setTimeout(()=>rotateSpotlight(),ROTATION_MS);
}
async function rotateSpotlight(){
 const features=$('main').querySelector('.spotlight');
 if(!features||rotating)return;
 if(features.matches(':hover')||features.contains(document.activeElement)){scheduleRotation();return;}
 clearTimeout(rotationTimer);rotating=true;
 const snapshot=data;
 const changes=spotlightGroups(data).filter(group=>group.stalls.length>1).map(group=>{
  const old=[...features.children].find(node=>node.dataset.categoryId===group.category.id);
  const stall=nextMerchant(group,spotlightMerchants.get(group.category.id));
  return {group,old,stall,next:featureCard(group,stall)};
 }).filter(change=>change.old);
 const animate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 try{
  // Decode the next photos before fading the currently readable merchant away.
  await Promise.all(changes.map(({next})=>next.querySelector('.shop-photo')?.decode().catch(()=>{})));
  if(!features.isConnected||view!=='home'||data!==snapshot)return;
  if(animate)await Promise.all(changes.map(({old})=>old.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-in',fill:'forwards'}).finished));
  if(!features.isConnected||view!=='home'||data!==snapshot)return;
  for(const {group,old,stall,next} of changes){
   spotlightMerchants.set(group.category.id,stall.id);
   old.replaceWith(next);
  }
  if(animate)await Promise.all(changes.map(({next})=>next.animate([{opacity:0},{opacity:1}],{duration:360,easing:'ease-out'}).finished));
 }finally{rotating=false;scheduleRotation();}
}
document.addEventListener('visibilitychange',scheduleRotation);
function categoryIcons(c){const name=c.name;if(/虾|蟹|贝|螺/.test(name))return ['shell'];if(/水产|海鲜/.test(name))return ['shell'];if(/蔬|果/.test(name))return ['leaf'];if(/肉|禽|蛋/.test(name))return ['meat'];if(/粮|油|干货/.test(name))return ['wheat'];if(/副食|调料|熟食/.test(name))return ['milk'];return ['store'];}
function photo(asset,name){if(!asset?.localUrl){const p=el('div','','photo-empty');p.append(icon('storefront'),bi('暂无门店照片','No photo yet'));return p;}const img=el('img','','shop-photo');img.src=asset.localUrl;img.alt=(isPreview?'设计示意：':'')+name+'门店照片';img.addEventListener('error',()=>img.replaceWith(photo(null,name)),{once:true});return img;}
function navigate(next,options={}){if(next==='detail'&&view!=='detail')detailReturn=view==='home'?'home':view==='map'?'map':'shops';view=next;if(options.category!==undefined){category=options.category;query='';}if(options.selected!==undefined)selected=options.selected;if(options.floor!==undefined){floor=options.floor;zone='';}if(options.zone!==undefined)zone=options.zone;lastAction=Date.now();render();$('main').focus({preventScroll:true});}
function renderBar(){const bar=$('categoryBar');bar.replaceChildren();if(!data.categories.length){bar.append(bi('商户分类将在资料发布后显示','Categories will appear once published','category-placeholder'));return;}for(const c of data.categories){const b=el('button','','category-item'+(view==='shops'&&category===c.id?' selected':''));b.type='button';const icons=categoryIcons(c);if(icons.length===1)b.append(icon(icons[0]));else{const wrap=el('span','','category-icons');for(const ic of icons)wrap.append(icon(ic));b.append(wrap);}b.append(c.nameEn?bi(c.name,c.nameEn):c.name);b.setAttribute('aria-label',`查看${c.name}商户`);b.setAttribute('aria-pressed',String(view==='shops'&&category===c.id));b.onclick=()=>navigate('shops',{category:c.id});bar.append(b);}}
function card(stall,feature=false){const b=el('button','',feature?'shop-feature':'shop-card');b.type='button';b.setAttribute('aria-label',`查看${stall.name}详情`);b.append(photo(stall.photos[0],stall.name));const copy=el('div','',feature?'feature-copy':'card-copy');copy.append(el('h3',stall.name));if(!feature&&stall.code)copy.append(el('span',stall.code,'stall-code'));copy.append(el('p',stall.intro||'暂无店铺介绍 No shop intro yet'));if(feature)copy.append(icon('arrow-right'));b.append(copy);if(isPreview&&feature)b.append(el('span','示意','sample-tag'));b.onclick=()=>navigate('detail',{selected:stall.id});return b;}
function action(zhT,enT,zhS,enS,symbol,callback,primary=false){const b=el('button','','wayfinding'+(primary?' primary':''));b.type='button';b.append(icon(symbol));const copy=el('span','','action-copy');const title=el('span','','action-title');title.append(bi(zhT,enT));const sub=el('span','','action-sub');sub.append(bi(zhS,enS));copy.append(title,sub);b.append(copy,icon('arrow-right','arrow'));b.onclick=callback;return b;}
function home(){const layout=el('div','','home-layout'),container=el('div','','spotlight-container'),features=el('div','','spotlight');
 const groups=spotlightGroups(data);
 if(groups.length){
  for(const group of groups){const stall=currentMerchant(group,spotlightMerchants.get(group.category.id));spotlightMerchants.set(group.category.id,stall.id);features.append(featureCard(group,stall));}
  container.append(features);

 }
 else{const T=loadState==='loading'?['正在准备市场资料','Preparing market info']:loadState==='offline'?['市场资料暂未连接','Market info unavailable']:['期待认识这里的每一家','Every stall awaits you here'];const H=loadState==='offline'?['暂时无法获取已发布资料，请稍后再试。','Published info is temporarily unreachable. Please try again later.']:['管理处发布商户资料后，门店介绍和照片会在这里与你见面。','Shop stories and photos will appear here once published by the market office.'];container.append(empty(bi(...T),bi(...H)));}
 const welcome=el('section','','welcome'),heading=el('div');const h2=el('h2');h2.textContent='逛市场，从这里开始';heading.append(h2);const actions=el('div','','welcome-actions');actions.append(action('海鲜图鉴','Seafood guide','特色水产 · 时令挑选','Featured seafood','fish',()=>navigate('knowledge'),true),action('看地图','Market map','查看市场区域导览','Explore zones on the map','map',()=>navigate('map')));welcome.append(heading,actions);if(data.encyclopedia.length)welcome.append(button(bi('逛逛海鲜图鉴','Browse the seafood guide'),()=>navigate('knowledge'),'secondary-link'));layout.append(container,welcome);return layout;}
function section(title,back=()=>navigate('home'),en=''){const root=el('section','','section-view'),head=el('div','','section-heading'),h2=el('h2');h2.append(bi(title,en));head.append(h2);root.append(head);const actions=el('div','','page-actions');actions.append(button(bi('返回上一级','Back'),back,'nav-button','caret-left'),button(bi('主页','Home'),()=>navigate('home'),'nav-button','house'));root.append(actions);return {root,head,actions};}
function filteredStalls(){const term=query.trim().toLocaleLowerCase();return data.stalls.filter(s=>(!category||s.categoryId===category)&&(!term||[s.name,s.nameEn,s.code,s.intro,...s.goods].some(v=>v.toLocaleLowerCase().includes(term))));}
function shopList(){const cat=data.categories.find(c=>c.id===category);const {root,head,actions}=section(cat?.name||'全部商户',undefined,cat?.nameEn||'All shops');if(category)head.append(button(bi('全部商户','All shops'),()=>navigate('shops',{category:''})));const search=el('label','','search');search.append(icon('magnifying-glass'));const input=el('input');input.type='search';input.placeholder='搜索店名、编号或品类 Search name / code / goods';input.setAttribute('aria-label','搜索店名、编号或品类');input.value=query;search.append(input);actions.insertBefore(search,actions.children[1]);const grid=el('div','','shop-grid');function results(){grid.replaceChildren();const rows=filteredStalls();if(rows.length)grid.append(...rows.map(s=>card(s)));else grid.append(empty(bi(query?'没有找到相关商户':'暂无已发布商户',query?'No matching shops':'No published shops yet'),bi(query?'试试其他店名、摊位编号或经营品类。':'该分类有新的公开资料后，会显示在这里。',query?'Try another name, stall code or category.':'Listings will appear here once new public info is released.')));}input.oninput=()=>{query=input.value;lastAction=Date.now();results();};results();root.append(grid);return root;}
function details(){
 const s=data.stalls.find(x=>x.id===selected);
 if(!s){view='shops';return shopList();}
 const {root,head}=section(s.name,()=>navigate(detailReturn),s.nameEn||'');
 if(s.code)head.append(el('span',`摊位编号 ${s.code}`,'stall-code'));
 const content=el('div','','detail-content'),photos=el('div','','detail-photos');
 const publishedPhotos=s.photos.slice(0,2);
 photos.dataset.count=String(Math.max(1,publishedPhotos.length));
 if(publishedPhotos.length)for(const asset of publishedPhotos)photos.append(photo(asset,s.name));
 else photos.append(photo(null,s.name));
 const side=el('div','','detail-side');
 const business=el('section','','detail-block');
 const bizTitle=el('h3');bizTitle.append(bi('今日售卖','Today’s goods'));business.append(bizTitle);
 const goods=el('div','','goods');
 goods.append(...(s.goods.length?s.goods:['暂无已发布品类 No published goods yet']).map(g=>el('span',g)));
 business.append(goods);
 side.append(business);
 const f=data.floors.find(x=>x.id===s.floorId),z=f?.zones.find(x=>x.id===s.zoneId);
 if(f){const locationButton=button(bi(`查看位置 · ${f.name}${z?' / '+z.title:''}`,'View location'),()=>{floor=f.id;zone=z?.id||'';navigate('map');},'quiet-button','map');locationButton.classList.add('detail-location');side.append(locationButton);}
 const intro=el('section','','detail-block detail-intro');
 const about=el('h3');about.append(bi('摊位介绍','About this stall'));
 if(s.nameEn)intro.append(el('p',s.nameEn,'en'));
 intro.append(about,el('p',s.intro||'暂无已发布介绍 No published intro yet'));
 if(s.introEn)intro.append(el('p',s.introEn,'en'));
 content.append(photos,side,intro);root.append(content);return root;
}
function marketMap(){
 const {root}=section('市场导览',undefined,'Market map');
 const layout=el('div','','map-layout'),area=el('div','','map-area'),tabs=el('div','','floor-tabs');
 const canvas=el('div','','map-canvas'),board=el('div','','map-board');
 const planImg=el('img','plan-img');planImg.src=planCropUrl;planImg.alt='蛇口市场一楼平面布局图';
 const cap=el('p','','map-caption');
 const floors=data.floors.length?data.floors:[floorPlan1F];
 for(const item of floors)tabs.append(button(item.nameEn?bi(item.name,item.nameEn):item.name,()=>navigate('map',{floor:item.id}),'quiet-button'+(floor===item.id?' active':'')));
 const f=floors.find(x=>x.id===floor)||floors[0];floor=f.id;
 board.style.setProperty('--ratio',`${f.width}/${f.height}`);
 const popupHost=el('div','','map-popup-host');
 for(const z of f.zones){
  const b=el('button','','module'+(zone===z.id?' selected':''));b.type='button';
  b.setAttribute('aria-label',`${z.title} ${z.titleEn||''}`);
  b.setAttribute('aria-pressed',String(zone===z.id));
  for(const [key,value] of Object.entries({x:z.x,y:z.y,w:z.width,h:z.height}))b.style.setProperty('--'+key,value+'%');
  const mi=el('img','module-img');const murl=moduleFiles[`../images/modules/${z.module}`];if(murl)mi.src=murl;mi.alt='';mi.setAttribute('aria-hidden','true');mi.draggable=false;
  b.append(mi);
  b.onclick=()=>{zone=z.id;lastAction=Date.now();
   for(const other of board.querySelectorAll('.module')){other.classList.toggle('selected',other===b);other.setAttribute('aria-pressed',String(other===b));}
   openZonePopup(popupHost,f,z);};
  board.append(b);
 }
 canvas.append(board,popupHost);
 cap.append(bi(f.schematic?'蛇口市场一楼平面布局 · 点击档口模块弹出该区域详情':'已发布市场布局 · 点击板块弹出摊位详情','Floor plan · Tap a stall module for zone details'));
 const fit=()=>{const c=canvas.getBoundingClientRect();if(!c.width||!c.height)return;const k=f.width/f.height;const w=Math.min(c.width,c.height*k);board.style.width=`${Math.floor(w)}px`;};
 if(planImg.complete)fit();else planImg.addEventListener('load',fit,{once:true});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(fit).observe(canvas);
 area.append(tabs,canvas,cap);
 layout.append(area);
 root.append(layout);
 return root;
}
function openZonePopup(host,f,z){
 host.replaceChildren();
 const close=()=>{host.replaceChildren();host.classList.remove('open');};
 const backdrop=el('div','','map-popup-backdrop');backdrop.onclick=close;
 const card=el('div','','map-popup');card.setAttribute('role','dialog');card.setAttribute('aria-label',z.title);
 const head=el('div','','map-popup-head');const h3=el('h3');h3.append(bi(z.title,z.titleEn||''));
 const closeBtn=button(bi('关闭','Close'),close,'nav-button map-popup-close','x');
 head.append(h3,closeBtn);card.append(head);
 if(z.description||z.descriptionEn){const desc=el('p','','map-popup-desc');desc.append(bi(z.description||'',z.descriptionEn||''));card.append(desc);}
 const rows=data.stalls.filter(s=>s.floorId===f.id&&s.zoneId===z.id);
 if(rows.length){
  for(const s of rows){
   const item=el('button','','map-popup-stall');item.type='button';
   item.setAttribute('aria-label',`查看${s.name}详情`);
   const ph=s.photos[0]?photo(s.photos[0],s.name):photo(null,s.name);
   const info=el('div','','map-popup-stall-info');const nm=el('h4');nm.append(bi(s.name,s.nameEn||''));info.append(nm);
   if(s.code)info.append(el('span',s.code,'stall-code'));
   const gd=el('p',s.goods.length?s.goods.slice(0,4).join(' · '):'暂无已发布品类');
   info.append(gd);
   item.append(ph,info,icon('caret-right'));
   item.onclick=()=>{close();navigate('detail',{selected:s.id});};
   card.append(item);
  }
 }else{
  const none=el('p','','map-popup-empty');none.append(bi('该板块暂无已发布商户资料','No published stall info in this zone yet'));card.append(none);
 }
 host.append(backdrop,card);host.classList.add('open');
}
function knowledge(){const {root}=section('海鲜图鉴',undefined,'Seafood guide');root.dataset.glow='1';requestAnimationFrame(()=>{const main=document.querySelector('.main-surface');if(main&&main.contains(root)&&root.dataset.glow){main.classList.add('gf-on');if(!main.querySelector(':scope > .gf-stage'))main.prepend(mountGlowFish());}});const stage=el('div','','knowledge-stage');const list=el('div','','knowledge-list');const labels=[['产地','Origin'],['特点','Features'],['推荐做法','Cooking ideas']];for(const k of data.encyclopedia){const item=el('article','','knowledge-item');const h3=el('h3');h3.append(bi(k.name,k.nameEn||''));item.append(h3);for(const [label,en,key]of labels){const h4=el('h4');h4.append(bi(label,en));item.append(h4,el('p',k[key]||'暂无资料 No info yet'));}list.append(item);}if(!list.children.length)list.append(empty(bi('图鉴资料待完善','Seafood guide coming soon'),bi('发布后将在这里展示时令水产知识。','Seafood knowledge will appear here once published.'),'books'));stage.append(list);root.append(stage);return root;}
function render(){clearTimeout(rotationTimer);const mainEl=document.querySelector('.main-surface');if(mainEl){mainEl.classList.remove('gf-on');const oldGlow=mainEl.querySelector(':scope > .gf-stage');if(oldGlow)oldGlow.remove();}document.querySelector('.market-app').dataset.view=view;const active=document.activeElement;const searchFocused=active?.tagName==='INPUT';const cursor=searchFocused?active.selectionStart:null;$('marketName').textContent=data.market?.name||'蛇口市场';$('main').replaceChildren(({home,shops:shopList,detail:details,map:marketMap,knowledge}[view]||home)());renderBar();if(searchFocused&&view==='shops'){const input=$('main').querySelector('input');input.focus();if(input.type==='text')input.setSelectionRange(cursor,cursor);}scheduleRotation();}
$('brandHome').onclick=()=>navigate('home');for(const event of ['pointerdown','keydown','wheel'])document.addEventListener(event,()=>{lastAction=Date.now();},{passive:true});
function clock(){const now=new Date();$('dateText').dateTime=now.toISOString();const zh=now.toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'});const en=now.toLocaleDateString('en-US',{timeZone:'Asia/Shanghai',month:'short',day:'numeric',weekday:'short'});$('dateText').replaceChildren(el('span',zh),' · ',el('span',en,'en'));if(view!=='home'&&Date.now()-lastAction>120000)navigate('home');}clock();setInterval(clock,1000);
const weatherText=$('weatherText');
const WMO={0:'晴',1:'晴',2:'多云',3:'阴',45:'雾',48:'雾',51:'毛毛雨',53:'毛毛雨',55:'毛毛雨',61:'小雨',63:'中雨',65:'大雨',66:'冻雨',67:'冻雨',71:'小雪',73:'中雪',75:'大雪',77:'雪粒',80:'阵雨',81:'阵雨',82:'强阵雨',85:'阵雪',86:'阵雪',95:'雷雨',96:'雷雨',99:'雷雨'};
let weatherTimer;
async function refreshWeather(){
 if(!weatherText)return;
 weatherText.dataset.state='loading';
 try{
  const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.478&longitude=113.915&current=temperature_2m,weather_code&timezone=Asia%2FShanghai',{signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('weather unavailable');
  const payload=await response.json(),current=payload?.current;
  if(typeof current?.temperature_2m!=='number')throw new Error('weather shape invalid');
  const summary=`${Math.round(current.temperature_2m)}° ${WMO[current.weather_code]??''}`.trim();
  weatherText.replaceChildren(el('span',summary),el('span',' · Shekou','en'));
  weatherText.dataset.state='ready';
 }catch{weatherText.dataset.state='error';}
 finally{clearTimeout(weatherTimer);weatherTimer=setTimeout(refreshWeather,1800000);}
}
void refreshWeather();
render();
mountFishWave(document.querySelector('.masthead'));
if(isPreview){$('previewNotice').hidden=false;const {previewData}=await import('./design-preview.js');data=previewData;loadState='ready';$('syncStatus').textContent='设计示意 Design preview · 非真实商户资料 Not real merchants';render();}
else {const config=window.ENTRANCE_CONFIG||{};client=createMarketClient({apiBase:config.apiBase||'',marketId:config.marketId||'mkt_001',onData(next){data=next;loadState='ready';render();},onStatus(message,state){loadState=state;$('syncStatus').textContent=message;if(view==='home'&&!data.stalls.length)render();}});void client.start();window.addEventListener('online',()=>client.refresh());window.addEventListener('pagehide',event=>{if(!event.persisted)client.stop();});if('serviceWorker'in navigator&&!import.meta.env.DEV)navigator.serviceWorker.register(new URL('sw.js',document.baseURI)).catch(()=>{$('syncStatus').textContent+=' · 离线页面缓存不可用';});}
