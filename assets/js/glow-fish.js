// 海鲜图鉴卡片框背景：深海流光·发光鱼群（终版动效原样移植）
// 背景底色改为淡蓝（原深海深色 → 淡蓝水彩），鱼群/虾蟹鱿贝星/流光/星点气泡不变。
import oceanWcUrl from '../images/ocean-wc.jpg';

let styleInjected = false;
const CSS = `
.gf-stage{position:absolute;inset:0;overflow:hidden;isolation:isolate}
.gf-bg{position:absolute;inset:0;background:#cfe6f6 url('${oceanWcUrl}') center 40% / cover no-repeat}
.gf-bg::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(214,236,250,.88) 0%,rgba(186,220,242,.82) 55%,rgba(168,209,238,.86) 100%)}
.gf-bg::after{content:'';position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 40%,rgba(255,255,255,.28) 0%,transparent 55%)}
.gf-sparkles{position:absolute;inset:0;pointer-events:none}
.gf-star{position:absolute;width:var(--s);height:var(--s);animation:gf-sparkle var(--d) ease-in-out var(--delay) infinite}
.gf-star svg{display:block;width:100%;height:100%}
@keyframes gf-sparkle{0%,100%{opacity:.10;transform:scale(.7)}50%{opacity:.9;transform:scale(1.12)}}
.gf-ring{position:absolute;width:var(--s);height:var(--s);border-radius:50%;border:1px solid rgba(120,170,210,.45);animation:gf-ringfade var(--d) ease-in-out var(--delay) infinite}
@keyframes gf-ringfade{0%,100%{opacity:.05;transform:scale(.85)}50%{opacity:.5;transform:scale(1)}}
.gf-ocean{position:absolute;inset:0;pointer-events:none}
.gf-school{position:absolute;left:100%;top:0;animation:gf-drift linear infinite;will-change:transform;backface-visibility:hidden}
@keyframes gf-drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(calc(-1 * var(--travel)),0,0)}}
.gf-trails{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.gf-fish{position:absolute;will-change:transform;animation:gf-glide var(--gd) ease-in-out var(--gdelay) infinite alternate}
@keyframes gf-glide{from{transform:translate3d(-6px,-4px,0) rotate(-1.4deg)}to{transform:translate3d(6px,4px,0) rotate(1.4deg)}}
.gf-fish svg{display:block;width:100%;height:auto;overflow:visible;transform:scaleX(-1);filter:drop-shadow(0 0 5px rgba(215,242,255,.9)) drop-shadow(0 0 16px rgba(130,190,235,.5))}
.gf-fish.big svg{filter:drop-shadow(0 0 7px rgba(228,248,255,.95)) drop-shadow(0 0 22px rgba(140,205,250,.6)) drop-shadow(0 0 46px rgba(90,170,235,.32))}
.gf-fish.dim svg{filter:drop-shadow(0 0 3px rgba(190,225,250,.5))}
@media (prefers-reduced-motion: reduce){.gf-star,.gf-ring{animation:none}.gf-school{animation-duration:110s !important}.gf-fish{animation:none}}
`;
function injectStyle() {
  if (styleInjected) return;
  styleInjected = true;
  const tag = document.createElement('style');
  tag.textContent = CSS;
  document.head.append(tag);
}

let uid = 0;
function fishSVG(tone) {
  const id = 'gf' + (++uid), vId = 'gv' + uid, cId = 'gc' + uid;
  const hi = tone === 'deep' ? '#8fc8ea' : '#e9f6ff';
  const mid = tone === 'deep' ? '#5ea9d6' : '#bfe2f6';
  const lo = tone === 'deep' ? '#2f7bb0' : '#7fbde2';
  const body = 'M36 25C36 17 52 11.5 78 10.5 110 9 150 13.5 180 23c2.5 1 2.5 3 0 4C150 36.5 110 41 78 39.5 52 38.5 36 33 36 25Z';
  return '<svg viewBox="0 0 192 52" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
    '<linearGradient id="' + id + '" x1="0" y1="0.1" x2="0.9" y2="0.95"><stop offset="0" stop-color="' + hi + '"/><stop offset="0.5" stop-color="' + mid + '"/><stop offset="0.85" stop-color="' + lo + '"/><stop offset="1" stop-color="' + lo + '" stop-opacity=".55"/></linearGradient>' +
    '<linearGradient id="' + vId + '" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="0.35" stop-color="#ffffff" stop-opacity=".18"/><stop offset="0.8" stop-color="#0a3a5c" stop-opacity=".16"/><stop offset="1" stop-color="#0a3a5c" stop-opacity=".42"/></linearGradient>' +
    '<clipPath id="' + cId + '"><path d="' + body + '"/></clipPath>' +
    '</defs>' +
    '<path d="M36 25C28 19 19 13 9 8.5c6.5 9.5 6.5 23.5 0 33 10-4.5 19-10.5 27-16.5Z" fill="' + mid + '" opacity=".78"/>' +
    '<path d="M36 25C29 21 22 17 14 12.5c5.5 7.5 5.5 18.5 0 25 8-4 15-8 22-12.5Z" fill="' + hi + '" opacity=".4"/>' +
    '<path d="' + body + '" fill="url(#' + id + ')"/>' +
    '<g clip-path="url(#' + cId + ')"><rect x="0" y="0" width="192" height="52" fill="url(#' + vId + ')"/></g>' +
    '<path d="M90 10.5c3-7 12-10 19.5-7.5-6 2-11 5.5-14.5 10Z" fill="' + hi + '" opacity=".7"/>' +
    '<path d="M92 39.5c4 6 12 8 17.5 6-6-2-10.5-4-13.5-7Z" fill="' + hi + '" opacity=".5"/>' +
    '<path d="M112 31c7 5 14 7 18.5 5-6-3-11-5-14.5-8Z" fill="#ffffff" opacity=".5"/>' +
    '<path d="M46 17.5C80 10 126 11 160 19.5" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".75"/>' +
    '<path d="M126 15c-3 7-3 13 0 20" stroke="#2e6f9c" stroke-width="1.1" fill="none" opacity=".45" stroke-linecap="round"/>' +
    '<circle cx="153" cy="22" r="3" fill="#f6fdff"/><circle cx="153.6" cy="22" r="1.7" fill="#0d2c42"/>' +
    '</svg>';
}
function creatureSVG(type) {
  const id = 'cr' + (++uid);
  const gDef = '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef9ff"/><stop offset="0.55" stop-color="#c9e6f8"/><stop offset="1" stop-color="#8fc4e6" stop-opacity=".78"/></linearGradient>';
  const g = 'url(#' + id + ')';
  const line = 'stroke="#a9d2ec" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"';
  let vb, b;
  if (type === 'shrimp') {
    vb = '0 0 110 70';
    b = '<path d="M14 38C18 14 54 6 76 17 92 25 94 45 79 53 68 58 56 53 57 44" fill="' + g + '"/>' +
      '<path d="M14 38 4 30 8 40 3 48 16 46Z" fill="' + g + '" opacity=".85"/>' +
      '<path d="M36 13C33 24 33 36 38 49" ' + line + '/><path d="M52 10C50 22 51 36 56 50" ' + line + '/>' +
      '<path d="M78 18C92 10 102 12 108 7" ' + line + '/><path d="M80 24C94 20 104 22 110 18" ' + line + '/>' +
      '<path d="M52 54 48 64" ' + line + '/><path d="M62 55 60 65" ' + line + '/><path d="M72 52 72 62" ' + line + '/>' +
      '<circle cx="72" cy="26" r="2.4" fill="#123048"/>';
  } else if (type === 'squid') {
    vb = '0 0 110 60';
    b = '<path d="M10 30C10 16 32 8 54 10L54 50C32 52 10 44 10 30Z" fill="' + g + '"/>' +
      '<path d="M10 22 1 13 5 30 1 47 10 38Z" fill="' + g + '" opacity=".8"/>' +
      '<path d="M54 16C70 12 84 14 96 10" ' + line + '/><path d="M54 24C72 22 86 26 100 24" ' + line + '/>' +
      '<path d="M54 34C72 36 84 40 98 42" ' + line + '/><path d="M54 42C68 46 80 50 92 52" ' + line + '/>' +
      '<circle cx="44" cy="26" r="2.4" fill="#123048"/>';
  } else if (type === 'crab') {
    vb = '0 0 110 70';
    b = '<path d="M40 46 24 60" ' + line + '/><path d="M44 50 32 64" ' + line + '/><path d="M50 52 44 64" ' + line + '/>' +
      '<path d="M70 46 86 60" ' + line + '/><path d="M66 50 78 64" ' + line + '/><path d="M60 52 66 64" ' + line + '/>' +
      '<path d="M40 34C32 30 28 28 24 26" ' + line + '/><path d="M70 34C78 30 82 28 86 26" ' + line + '/>' +
      '<circle cx="22" cy="22" r="8" fill="' + g + '"/><path d="M16 18 26 24" stroke="#7fb0d4" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>' +
      '<circle cx="88" cy="22" r="8" fill="' + g + '"/><path d="M94 18 84 24" stroke="#7fb0d4" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>' +
      '<ellipse cx="55" cy="38" rx="19" ry="13" fill="' + g + '"/>' +
      '<circle cx="50" cy="28" r="2" fill="#123048"/><circle cx="60" cy="28" r="2" fill="#123048"/>';
  } else if (type === 'octopus') {
    vb = '0 0 100 80';
    b = '<path d="M30 32C30 12 70 12 70 32 70 43 62 48 50 48 38 48 30 43 30 32Z" fill="' + g + '"/>' +
      '<path d="M36 47C30 58 20 60 15 70" stroke="#cfe7f7" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<path d="M44 49C42 60 37 66 39 76" stroke="#cfe7f7" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<path d="M56 49C58 60 63 66 61 76" stroke="#cfe7f7" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<path d="M64 47C70 58 80 60 85 70" stroke="#cfe7f7" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>' +
      '<circle cx="43" cy="32" r="2.2" fill="#123048"/><circle cx="57" cy="32" r="2.2" fill="#123048"/>';
  } else if (type === 'scallop') {
    vb = '0 0 90 72';
    b = '<path d="M45 64C22 64 8 46 10 26 24 34 34 30 45 12 56 30 66 34 80 26 82 46 68 64 45 64Z" fill="' + g + '"/>' +
      '<path d="M45 62 20 32" stroke="#a9d2ec" stroke-width="1" opacity=".7"/><path d="M45 62 32 24" stroke="#a9d2ec" stroke-width="1" opacity=".7"/>' +
      '<path d="M45 62 45 16" stroke="#a9d2ec" stroke-width="1" opacity=".7"/><path d="M45 62 58 24" stroke="#a9d2ec" stroke-width="1" opacity=".7"/>' +
      '<path d="M45 62 70 32" stroke="#a9d2ec" stroke-width="1" opacity=".7"/>';
  } else {
    vb = '0 0 80 80';
    b = '<path d="M40 6 48 30 74 32 53 46 60 72 40 57 20 72 27 46 6 32 32 30Z" fill="' + g + '"/><circle cx="40" cy="38" r="2" fill="#7fb0d4" opacity=".8"/>';
  }
  return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg"><defs>' + gDef + '</defs>' + b + '</svg>';
}
const CREATURES = [
  { t: 'shrimp', w: 92 }, { t: 'squid', w: 98 }, { t: 'crab', w: 86 },
  { t: 'octopus', w: 80 }, { t: 'scallop', w: 68 }, { t: 'star', w: 60 },
];
let SW = 720, SH = 320;
const bandY = (x, amp, phase) => SH / 2 + Math.sin(x / 105 + phase) * amp;
function trailLayer() {
  let shapes = '', dots = '';
  const conf = [
    { amp: .27, phase: 0, op: .40, w: 2.4, from: .02, to: 1, pow: 1.1 },
    { amp: .34, phase: .5, op: .24, w: 1.9, from: .06, to: .98, pow: 1.35 },
    { amp: .19, phase: -.6, op: .18, w: 1.5, from: .10, to: .94, pow: 1.2 },
    { amp: .39, phase: 1.1, op: .13, w: 2.1, from: -.5, to: 1.6, pow: .85 },
  ];
  for (let k = 0; k < conf.length; k++) {
    const c = conf[k];
    let top = '', bot = '', dC = '';
    const steps = 46, x0 = SW * c.from, x1 = SW * c.to;
    for (let s = 0; s <= steps; s++) {
      const u = s / steps, x = x0 + (x1 - x0) * u, y = bandY(x, SH * c.amp, c.phase);
      const w2 = c.w * Math.pow(Math.sin(Math.PI * u), c.pow);
      top += (s ? ' L ' : 'M ') + x.toFixed(1) + ' ' + (y - w2).toFixed(1);
      bot = ' L ' + x.toFixed(1) + ' ' + (y + w2).toFixed(1) + bot;
      dC += (s ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
      if (k < 2 && Math.random() < .14) {
        dots += '<circle cx="' + x.toFixed(1) + '" cy="' + (y + (Math.random() - .5) * 26).toFixed(1) + '" r="' + (.7 + Math.random() * 1.5).toFixed(2) + '" fill="#dff4ff" opacity="' + (.2 + Math.random() * .5).toFixed(2) + '"/>';
      }
    }
    shapes += '<path d="' + top + bot + ' Z" fill="#e2f5ff" opacity="' + c.op + '"/>' +
      '<path d="' + dC + '" stroke="#f2fcff" stroke-width="0.8" fill="none" opacity="' + (c.op * .9) + '" stroke-linecap="round"/>';
  }
  return '<svg class="gf-trails" viewBox="0 0 ' + SW + ' ' + SH + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' + shapes + dots + '</svg>';
}
function buildSchool(spec) {
  const elm = document.createElement('div');
  elm.className = 'gf-school';
  elm.style.width = SW + 'px';
  elm.style.height = SH + 'px';
  elm.style.top = spec.top + 'px';
  elm.style.animationDuration = spec.dur + 's';
  elm.style.animationDelay = spec.delay + 's';
  elm.style.setProperty('--travel', spec.travel + 'px');
  elm.style.opacity = spec.opacity;
  elm.innerHTML = trailLayer();
  const n = spec.count, amp = SH * .27, phase = (Math.random() - .5) * .5;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = 20 + t * (SW - 110) + (Math.random() - .5) * 130;
    const jitter = ((Math.random() + Math.random() + Math.random()) / 3 - .5) * 2;
    const y = bandY(x, amp + (Math.random() - .5) * 26, phase) + jitter * SH * .30;
    const r = Math.random();
    let scale, dim;
    if (r < .13) { scale = 1.5 + Math.random() * .8; dim = false; }
    else if (r < .5) { scale = .55 + Math.random() * .4; dim = false; }
    else { scale = .26 + Math.random() * .3; dim = Math.random() < .6; }
    let inner, w;
    if (Math.random() < .16) {
      const cr = CREATURES[(Math.random() * CREATURES.length) | 0];
      w = Math.round(cr.w * (.55 + Math.random() * .5) * spec.sizeMul);
      inner = creatureSVG(cr.t);
      dim = Math.random() < .35;
    } else {
      w = Math.round(158 * scale * spec.sizeMul);
      inner = fishSVG(Math.random() < .42 ? 'deep' : 'light');
    }
    const f = document.createElement('div');
    f.className = 'gf-fish' + (scale > 1.4 ? ' big' : '') + (dim ? ' dim' : '');
    f.style.left = x.toFixed(1) + 'px';
    f.style.top = y.toFixed(1) + 'px';
    f.style.width = w + 'px';
    f.style.opacity = (dim ? .45 + Math.random() * .3 : .8 + Math.random() * .2).toFixed(2);
    f.style.setProperty('--gd', (3.2 + Math.random() * 2.6).toFixed(2) + 's');
    f.style.setProperty('--gdelay', (-Math.random() * 4).toFixed(2) + 's');
    f.innerHTML = inner;
    elm.appendChild(f);
  }
  return elm;
}
const STAR = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0.6c.5 5.4 3.5 9.4 11.4 11.4C15.5 14 12.5 18 12 23.4 11.5 18 8.5 14 .6 12 8.5 10 11.5 6 12 .6Z" fill="#f2fcff"/></svg>';
function buildSparkles(host) {
  for (let i = 0; i < 22; i++) {
    const d = document.createElement('div');
    d.className = 'gf-star';
    d.style.left = (Math.random() * 100).toFixed(2) + '%';
    d.style.top = (Math.random() * 100).toFixed(2) + '%';
    d.style.setProperty('--s', (4 + Math.random() * 9).toFixed(1) + 'px');
    d.style.setProperty('--d', (3 + Math.random() * 4).toFixed(1) + 's');
    d.style.setProperty('--delay', (-Math.random() * 6).toFixed(1) + 's');
    d.innerHTML = STAR;
    host.appendChild(d);
  }
  for (let i = 0; i < 11; i++) {
    const d = document.createElement('div');
    d.className = 'gf-ring';
    d.style.left = (Math.random() * 100).toFixed(2) + '%';
    d.style.top = (Math.random() * 100).toFixed(2) + '%';
    d.style.setProperty('--s', (6 + Math.random() * 16).toFixed(0) + 'px');
    d.style.setProperty('--d', (5 + Math.random() * 5).toFixed(1) + 's');
    d.style.setProperty('--delay', (-Math.random() * 8).toFixed(1) + 's');
    host.appendChild(d);
  }
}
// 挂载：返回背景层元素（含淡蓝底 + 原样鱼群动效），加入 DOM 后自动布局
export function mountGlowFish() {
  injectStyle();
  const layer = document.createElement('div');
  layer.className = 'gf-stage';
  layer.setAttribute('aria-hidden', 'true');
  const bg = document.createElement('div'); bg.className = 'gf-bg'; layer.append(bg);
  const spark = document.createElement('div'); spark.className = 'gf-sparkles'; layer.append(spark);
  const ocean = document.createElement('div'); ocean.className = 'gf-ocean'; layer.append(ocean);
  buildSparkles(spark);
  let rt = 0;
  const populate = () => {
    ocean.innerHTML = '';
    const Wp = ocean.clientWidth || layer.clientWidth || 800;
    const Hp = ocean.clientHeight || layer.clientHeight || 400;
    SW = Math.max(430, Math.min(760, Wp * .86));
    SH = Math.round(Math.min(SW * .44, Hp * .85));
    const scaleAll = Math.max(.5, Math.min(1, Wp / 1200));
    const groups = Wp < 680 ? 3 : 4;
    for (let i = 0; i < groups; i++) {
      const slot = (i + .5) / groups;
      let top = Hp * (.16 + slot * .62) + (Math.random() - .5) * Hp * .06 - SH / 2;
      top = Math.max(-SH * .28, Math.min(Hp - SH * .55, top));
      const dur = 46 + Math.random() * 26;
      const delay = -((i + .15 + Math.random() * .7) / groups) * dur;
      ocean.appendChild(buildSchool({
        top, dur, delay,
        travel: Wp + SW + 120,
        opacity: (.78 + Math.random() * .2).toFixed(2),
        count: 16 + Math.floor(Math.random() * 8),
        sizeMul: scaleAll,
      }));
    }
  };
  const start = () => { populate(); };
  if (document.readyState === 'complete') setTimeout(start, 60);
  else addEventListener('load', () => setTimeout(start, 60), { once: true });
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(populate, 260); });
  return layer;
}
