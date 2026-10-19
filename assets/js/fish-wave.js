// 顶部静态鱼群波带（终版）：淡蓝色调（与动态版同色系），置于页头背景层，
// 市场名称与日期/天气之下，不拦截鼠标；形态参考"波浪带状鱼群"图。
const PALETTE = ['#8FBCE2', '#6FA3D4', '#A9CFEA', '#5E97C9', '#7FB4DC'];
const NS = 'http://www.w3.org/2000/svg';
export function mountFishWave(host) {
  if (!host || host.querySelector('.fish-wave')) return;
  const W = 1200, H = 300, MID = 150;
  // 波浪基线：左低 → 中部隆起 → 右侧再起，仿参考图 S 形
  const curve = t => MID - 58 * Math.sin(t * Math.PI * 2.15 + 0.75) - 14 * Math.sin(t * Math.PI * 4.4 + 2.2);
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.classList.add('fish-wave');
  svg.setAttribute('aria-hidden', 'true');
  const el = (n, at) => { const e = document.createElementNS(NS, n); for (const k in at) e.setAttribute(k, at[k]); return e; };
  // 确定性伪随机（每次加载形态一致）
  let seed = 7;
  const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  // 1) 流线（沿波浪的细丝）
  for (let i = 0; i < 6; i++) {
    const off = (i - 2.5) * 16, amp = 5 + rnd() * 7, o = .14 + Math.abs(i - 2.5) * .05;
    let d = '';
    for (let s = 0; s <= 24; s++) {
      const t = s / 24, x = -20 + t * (W + 40);
      const y = curve(t) + off + Math.sin(t * 9 + i * 1.9) * amp;
      d += (s ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    svg.append(el('path', { d, fill: 'none', stroke: '#9DC3E6', 'stroke-width': 1.1, opacity: o.toFixed(2) }));
  }
  // 2) 鱼群：沿波浪分布，中部稍大、两端渐小
  const N = 36;
  for (let i = 0; i < N; i++) {
    const t = .02 + .96 * (i / (N - 1)) + (rnd() - .5) * .04;
    const band = Math.sin(t * Math.PI);                 // 中部密、两端稀
    const s = (7 + rnd() * 17) * (.55 + .55 * band);
    const x = t * W, y = curve(t) + (rnd() - .5) * 58;
    const dy = curve(Math.min(1, t + .01)) - curve(Math.max(0, t - .01));
    const ang = Math.atan2(dy, .02 * W) * 180 / Math.PI;
    const col = PALETTE[i % PALETTE.length];
    const g = el('g', {
      transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`,
      opacity: (.4 + rnd() * .45).toFixed(2),
    });
    const body = `M ${s.toFixed(1)},0 Q ${(s * .3).toFixed(1)},${(-s * .42).toFixed(1)} ${(-s * .7).toFixed(1)},0 Q ${(s * .3).toFixed(1)},${(s * .42).toFixed(1)} ${s.toFixed(1)},0`;
    g.append(el('path', { d: body, fill: col }));
    g.append(el('path', { d: `M ${(-s * .62).toFixed(1)},0 L ${(-s * 1.12).toFixed(1)},${(-s * .34).toFixed(1)} L ${(-s * 1.12).toFixed(1)},${(s * .34).toFixed(1)} Z`, fill: col, opacity: .85 }));
    g.append(el('ellipse', { cx: (-s * .08).toFixed(1), cy: 0, rx: (s * .2).toFixed(1), ry: (s * .11).toFixed(1), fill: '#EAF3FC', opacity: .5 }));
    g.append(el('circle', { cx: (s * .55).toFixed(1), cy: (-s * .08).toFixed(1), r: Math.max(1.1, s * .07).toFixed(1), fill: '#F4F9FE' }));
    svg.append(g);
  }
  // 3) 气泡
  for (let i = 0; i < 14; i++) {
    const x = rnd() * W, t = x / W;
    svg.append(el('circle', {
      cx: x.toFixed(1), cy: (curve(t) + (rnd() - .5) * 170).toFixed(1),
      r: (1.5 + rnd() * 3.5).toFixed(1), fill: 'none', stroke: '#A9CFEA',
      'stroke-width': 1, opacity: (.2 + rnd() * .3).toFixed(2),
    }));
  }
  // 4) 星点（四角闪光）
  for (let i = 0; i < 11; i++) {
    const s = 3 + rnd() * 7, x = rnd() * W, y = rnd() * H;
    svg.append(el('path', {
      d: `M0,${-s} L${s * .22},${-s * .22} L${s},0 L${s * .22},${s * .22} L0,${s} L${-s * .22},${s * .22} L${-s},0 L${-s * .22},${-s * .22} Z`,
      fill: '#D8EAF9', opacity: (.35 + rnd() * .45).toFixed(2),
      transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
    }));
  }
  host.prepend(svg);
}
