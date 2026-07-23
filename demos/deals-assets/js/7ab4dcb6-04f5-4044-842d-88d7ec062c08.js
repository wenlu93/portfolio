/* ============================================================
   OTA Demo — 共享 UI 原子组件 (导出到 window)
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- 占位图（支持真实图片） ---------- */
function Ph({ label, w, h, r, style, className, children, photo, src }){
  const url = src || (photo ? (window.IMG && window.IMG(label)) : null);
  return (
    <div
      className={'ph ' + (className||'')}
      data-label={url ? '' : (label||'')}
      style={{ background: window.GRAD(label||'x'), width:w, height:h, borderRadius:(r!=null?r:8), ...style }}
    >
      {url && <img src={url} alt="" loading="lazy"
        onError={e=>{ e.currentTarget.style.display='none'; }}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />}
      {children}
    </div>
  );
}

/* ---------- 评分钻石 ---------- */
function Stars({ n=5 }){
  return (
    <span style={{ display:'inline-flex', gap:1, color:'var(--accent, #FFB000)' }}>
      {Array.from({length:n}).map((_,i)=>(
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 7L12 17.8 5.8 21l1.2-7-5-4.9 7.1-1z"/></svg>
      ))}
    </span>
  );
}

/* ---------- 图标库（线性，简单形状） ---------- */
const I = {
  back:   <path d="M15 18l-6-6 6-6" />,
  bell:   <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />,
  share:  <path d="M13.5 4 L21.5 11 L13.5 18 V14.2 C8.5 14.2 5 15.8 2.8 19.2 C2.8 11.6 7 8.4 13.5 7.9 V4 Z" />,
  search: <g><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></g>,
  pin:    <g><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/></g>,
  clock:  <g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>,
  plane:  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  flight: <g><path d="M10.5 21l1.5-6.5 8-2.5-8-2.5L10.5 3 8 9.2 3 11v2l5 1.8z"/><path d="M12 14.5l-2.8 4.2M12 9.5L9.2 5.3"/></g>,
  bed:    <path d="M3 7v11M3 12h18v6M21 18v-4a3 3 0 00-3-3H7" />,
  ticket: <g><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4z"/><path d="M14 6v12" strokeDasharray="2 2"/></g>,
  chevR:  <path d="M9 18l6-6-6-6" />,
  chevD:  <path d="M6 9l6 6 6-6" />,
  bolt:   <path d="M13 2L4.5 13.5H11l-1 8.5L18.5 10.5H12z" />,
  coin:   <g><circle cx="12" cy="12" r="9"/><path d="M9 8.5l3 3.7 3-3.7M12 12.2V16M9.7 13h4.6M9.7 14.9h4.6" /></g>,
  coinT:  <g><circle cx="12" cy="12" r="9"/><path d="M8.2 9.3h7.6M12 9.3V16" /></g>,
  user:   <g><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></g>,
  family: <g><circle cx="8" cy="7" r="2.6"/><circle cx="16" cy="7" r="2.6"/><path d="M3 20c0-3 2.5-5 5-5s5 2 5 5M13 20c0-2.5 2-4 4.5-4S22 17.5 22 20"/></g>,
  case:   <g><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></g>,
  stub:   <g><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 5v14" strokeDasharray="2 2"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/></g>,
  spark:  <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  edit:   <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />,
  ai:     <g><circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></g>,
  undo:   <path d="M3 7v6h6M3 13a9 9 0 1 0 3-7" />,
  close:  <path d="M6 6l12 12M18 6L6 18" />,
  minus:  <path d="M5 12h14" />,
  plus:   <path d="M12 5v14M5 12h14" />,
  dice:   <g><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="16" cy="16" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></g>,
  walk:   <g><circle cx="13" cy="4" r="2"/><path d="M11 22l1-7-2-3 1-5 3 3 3 1M9 22l2-5"/></g>,
  invoice:<g><path d="M6 2h9l3 3v17l-3-2-3 2-3-2-3 2V2z"/><path d="M9 8h6M9 12h6M9 16h3"/></g>,
  gift:   <g><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8C12 5 10.5 3 8.5 3S6 6 8 7.2C9 7.8 12 8 12 8zM12 8c0-3 1.5-5 3.5-5S18 6 16 7.2C15 7.8 12 8 12 8z"/></g>,
  trophy: <g><path d="M7 4h10v4a5 5 0 01-10 0V4z"/><path d="M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 20h6M12 13v7"/></g>,
  book:   <g><path d="M4 5a2 2 0 012-2h13v15H6a2 2 0 00-2 2V5z"/><path d="M9 7h6M9 11h4"/></g>,
  heart:  <path d="M12 21s-7-4.6-9.4-9A5 5 0 0112 5a5 5 0 019.4 7c-2.4 4.4-9.4 9-9.4 9z" />,
  compass:<g><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5.5-5.5 2 2-5.5z"/></g>,
  gauge:  <g><path d="M4 19a8 8 0 1116 0"/><path d="M12 19l4-5"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/></g>,
  route:  <g><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8 6h7a3 3 0 010 6H9a3 3 0 000 6h7"/></g>,
  grip:   <g><circle cx="9" cy="6" r="1.3" fill="currentColor"/><circle cx="15" cy="6" r="1.3" fill="currentColor"/><circle cx="9" cy="12" r="1.3" fill="currentColor"/><circle cx="15" cy="12" r="1.3" fill="currentColor"/><circle cx="9" cy="18" r="1.3" fill="currentColor"/><circle cx="15" cy="18" r="1.3" fill="currentColor"/></g>,
  building:<g><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></g>,
  fire:   <path d="M12 2s5 4 5 9a5 5 0 01-10 0c0-1.5.5-2.5.5-2.5S6 11 6 13a6 6 0 1012 0c0-6-6-11-6-11z" />,
  play:   <path d="M6 4l14 8-14 8z" />,
  mic:    <g><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M8 21h8"/></g>,
  keyboard:<g><rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></g>,
  cal:    <g><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 14h3"/></g>,
  car:    <g><path d="M5 11l1.5-4.2A2 2 0 018.4 5.4h7.2a2 2 0 011.9 1.4L19 11M4 11h16v5H4zM4 16v2M20 16v2"/><circle cx="7.5" cy="13.5" r="1.1" fill="currentColor"/><circle cx="16.5" cy="13.5" r="1.1" fill="currentColor"/></g>,
  camera: <g><path d="M3 8.5A1.5 1.5 0 014.5 7H7l1.3-2h7.4L17 7h2.5A1.5 1.5 0 0121 8.5V18a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18z"/><circle cx="12" cy="13" r="3.4"/></g>,
  wave:   <g><path d="M5 9v6M9 5v14M15 7v10M19 10v4"/></g>,
  check:  <path d="M5 12.5l5 5L20 6.5" />,
  link:   <g><path d="M9.5 14.5l5-5"/><path d="M11 6.5l1.2-1.2a4 4 0 015.6 5.6l-2 2"/><path d="M13 17.5l-1.2 1.2a4 4 0 01-5.6-5.6l2-2"/></g>,
  more:   <g><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></g>,
  thumb:  <path d="M7 22V11l5-8a2 2 0 012 2v4h4.5a2 2 0 012 2.3l-1.2 7A2 2 0 0119.3 22H7zm0 0H4a1 1 0 01-1-1v-9a1 1 0 011-1h3" />,
  train:  <g><rect x="6" y="3" width="12" height="13" rx="2.5"/><path d="M6 11h12"/><path d="M9 19.5l-2 2.5M15 19.5l2 2.5"/><circle cx="9.5" cy="13.5" r="1" fill="currentColor"/><circle cx="14.5" cy="13.5" r="1" fill="currentColor"/></g>,
  child:  <g><circle cx="12" cy="5" r="2.2"/><path d="M12 7.4v6M8.5 10.5h7M9.6 20l2.4-4 2.4 4"/></g>,
  family3:<g><circle cx="6.5" cy="6.5" r="2.3"/><circle cx="17.5" cy="6.5" r="2.3"/><circle cx="12" cy="10.2" r="1.7"/><path d="M3.2 20c0-3.2 1.5-5 3.3-5s3.3 1.8 3.3 5"/><path d="M14.2 20c0-3.2 1.5-5 3.3-5s3.3 1.8 3.3 5"/><path d="M9.6 20.6c0-2.2 1.1-3.5 2.4-3.5s2.4 1.3 2.4 3.5"/></g>,
  star:   <path d="M12 3l2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 16.8 6.5 19.7l1.3-6.1L3.2 9.4l6.2-.7z" />,
};
function Icon({ name, size=22, stroke=2, color='currentColor', fill='none', style }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {I[name]}
    </svg>
  );
}

/* ---------- 秒杀倒计时 hook ---------- */
function useCountdown(initialMins){
  const [sec, setSec] = useState(Math.max(0, Math.round(initialMins*60)));
  useEffect(()=>{ setSec(Math.max(0, Math.round(initialMins*60))); }, [initialMins]);
  useEffect(()=>{
    if(sec<=0) return;
    const id = setInterval(()=> setSec(s=> s>0 ? s-1 : 0), 1000);
    return ()=> clearInterval(id);
  }, [sec>0]);
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  const pad = n => String(n).padStart(2,'0');
  return { sec, text: `${pad(h)}:${pad(m)}:${pad(s)}` };
}

/* ---------- 楼层包裹（带进入动画 + 标题） ---------- */
function FloorShell({ title, more, dot=true, children, style }){
  return (
    <section className="floor floor-enter" style={style}>
      {title && (
        <div className="floor-head">
          <h2 className="floor-title">{dot && <span className="dot" />}{title}</h2>
          {more && <span className="floor-more">{more} <Icon name="chevR" size={13} /></span>}
        </div>
      )}
      {children}
    </section>
  );
}

/* ---------- 进度条 ---------- */
function ProgressBar({ pct }){
  return (
    <div style={{ height:6, borderRadius:99, background:'rgba(0,0,0,.12)', overflow:'hidden' }}>
      <div style={{ width:pct+'%', height:'100%', borderRadius:99,
        background:'linear-gradient(90deg,var(--brand),var(--brand-strong))',
        transition:'width .4s ease' }} />
    </div>
  );
}

/* ---------- 卡片展开 CTA：未展开显示「查看」，展开后只显示「收起」 ----------
   绝对定位在卡片右上角；pointer-events:none 保证整张卡片都是点击热区 */
function PeekCTA({ on, label='查看' }){
  const base = { position:'absolute', right:7, top:7, display:'flex', alignItems:'center', gap:3,
    fontSize:11, fontWeight:700, padding:'3px 8px 3px 10px', borderRadius:999, zIndex:6, pointerEvents:'none' };
  return on ? (
    <span style={{ ...base, background:'rgba(0,0,0,.55)', color:'#fff', backdropFilter:'blur(4px)' }}>
      收起<Icon name="chevD" size={11} color="#fff" style={{ transform:'rotate(180deg)' }} />
    </span>
  ) : (
    <span style={{ ...base, background:'var(--brand)', color:'var(--on-brand,#fff)', boxShadow:'0 2px 8px rgba(0,0,0,.20)' }}>
      {label}<Icon name="chevR" size={11} color="currentColor" stroke={2.4} />
    </span>
  );
}

/* ---------- 统一价格区：划线价与卖价同排水平对齐，折扣标签在卖价上方 ----------
   side: left | right | center（整体对齐）；swap=true 时卖价在左、划线价在右 */
function _phash(s){ let h=0; s=String(s); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
function PriceBlock({ price, origin, disc, rate, seed, size=15, side='right', swap=false, colAlign }){
  size = size + 1;   // 整体放大一个字号（卖价跟随）
  if(origin==null){
    const rr = rate || (0.66 + (_phash(seed!=null?seed:price) % 16)/100);
    origin = Math.max(price + 30, Math.round((price/rr)/10)*10);
  }
  if(disc==null) disc = (price/origin*10).toFixed(1) + '折';
  const justify = side==='center' ? 'center' : (side==='left' ? 'flex-start' : 'flex-end');
  // colAlign 默认跟随 side；可单独传入（如整体靠右、但折扣标签与卖价内部居中对齐）
  colAlign = colAlign || (side==='center' ? 'center' : (side==='left' ? 'flex-start' : 'flex-end'));
  const originEl = <span className="price-origin" style={{ lineHeight:1.1, whiteSpace:'nowrap' }}>¥{origin}</span>;
  const colEl = (
    <div style={{ display:'flex', flexDirection:'column', alignItems: colAlign, gap:2 }}>
      <span style={{ fontSize:10.5, fontWeight:800, color:'var(--brand-strong)', background:'var(--brand-soft)', padding:'1px 5px', borderRadius:5, lineHeight:1.2, whiteSpace:'nowrap' }}>{disc}</span>
      <span className="price" style={{ fontSize:size, lineHeight:1, whiteSpace:'nowrap' }}><span className="cur" style={{ fontSize: Math.round(size*0.66) }}>¥</span>{price}</span>
    </div>
  );
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:5, justifyContent: justify, minWidth:0 }}>
      {swap ? <>{colEl}{originEl}</> : <>{originEl}{colEl}</>}
    </div>
  );
}

Object.assign(window, { Ph, Stars, Icon, useCountdown, FloorShell, ProgressBar, PeekCTA, PriceBlock });
