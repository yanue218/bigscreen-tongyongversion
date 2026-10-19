import {defineConfig} from 'vite';
import {copyFileSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=dirname(fileURLToPath(import.meta.url));
export default defineConfig({
 base:'./',publicDir:false,
 plugins:[{name:'market-offline-shell',writeBundle(output,bundle){
  const out=output.dir||resolve(root,'dist');copyFileSync(resolve(root,'config.js'),resolve(out,'config.js'));
  const assets=Object.keys(bundle).filter(name=>name!=='index.html'&&!name.endsWith('.map'));
  const version=createHash('sha256').update(Object.values(bundle).map(file=>file.type==='chunk'?file.code:String(file.source)).join('')).update(readFileSync(resolve(root,'config.js'))).digest('hex').slice(0,16);
  writeFileSync(resolve(out,'sw.js'),readFileSync(resolve(root,'sw.js'),'utf8').replace('BUILD_VERSION',version).replace('/* BUILD_ASSETS */ []',JSON.stringify(['config.js',...assets])));
 }}],server:{proxy:{'/api':process.env.MARKET_API_PROXY||'http://127.0.0.1:18088'}},preview:{proxy:{'/api':process.env.MARKET_API_PROXY||'http://127.0.0.1:18088'}}
});
