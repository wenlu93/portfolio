/* ============================================================
   OTA Demo — 全局框架
   TopNav / ModeSwitcher / PageTabs / Toast / FamilySheet
   AIPanel / AIDock / Console
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------------- 身份枚举 ---------------- */
const MODES = [
  {id:'solo',  label:'个人', icon:'user'},
  {id:'family',label:'亲子', icon:'family3'},
  {id:'event', label:'展演', icon:'stub'},
  {id:'biz',   label:'商务', icon:'case'},
];

/* ---------------- 顶部导航 ---------------- */
function TopNav({ ctx, onMode, subscribed, onSubscribe, onShare }){
  const [open, setOpen] = useState(false);
  const cur = MODES.find(m=> m.id===ctx.identity);
  const onBrandText = ctx.tier==='premium' ? 'var(--bg)' : '#fff';
  return (
    <div style={{ position:'relative', zIndex:'var(--z-nav)', background:'var(--bg)',
      transition:'background-color var(--t-slow) var(--ease)', padding:'7px 12px',
      display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid var(--hairline)' }}>
      <Icon name="back" size={22} color="var(--text)" />
      {/* 优惠标题（最大字号 · 第一层级） */}
      <span style={{ display:'flex', alignItems:'flex-end', fontSize:22, fontWeight:900, color:'var(--text)', fontFamily:'var(--font-title)' }}>
        优惠<span style={{ width:5, height:5, borderRadius:99, background:'var(--brand)', marginLeft:2, marginBottom:6 }} />
      </span>
      {/* 身份胶囊 */}
      <div style={{ position:'relative' }}>
        <button onClick={()=>setOpen(o=>!o)} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:999,
          background:'var(--brand)', color:onBrandText, fontWeight:800, fontSize:13, transition:'background-color var(--t-base)' }}>
          <Icon name={cur.icon} size={13} color="currentColor" />{cur.label + '出行'}
          <Icon name="chevD" size={12} color="currentColor" style={{ transform:open?'rotate(180deg)':'none', transition:'transform var(--t-base)' }} />
        </button>
        {open && (
          <>
            <div onClick={()=>setOpen(false)} style={{ position:'fixed', inset:0, zIndex:1 }} />
            <div style={{ position:'absolute', top:'calc(100% + 5px)', left:0, zIndex:2, minWidth:132,
              background:'var(--surface)', borderRadius:13, boxShadow:'0 10px 30px rgba(0,0,0,.22)', padding:5, animation:'floorIn .18s ease' }}>
              {MODES.map(m=>{
                const on = m.id===ctx.identity;
                return (
                  <button key={m.id} onClick={()=>{ onMode(m.id); setOpen(false); }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%',
                    padding:'8px 9px', borderRadius:8, fontSize:14, fontWeight:on?800:500, color:'var(--text)',
                    background:on?'var(--brand-soft)':'transparent' }}>
                    <Icon name={m.icon} size={15} color={on?'var(--brand-strong)':'var(--text-muted)'} />
                    <span style={{ flex:1, textAlign:'left' }}>{m.label}出行</span>
                    {on && <Icon name="back" size={13} color="var(--brand-strong)" style={{ transform:'rotate(-90deg) scaleY(-1)' }} />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div style={{ flex:1 }} />
      <button onClick={onSubscribe} aria-label={subscribed?'已订阅':'订阅频道'}
        style={{ display:'flex', alignItems:'center', gap:3, padding:'5px 11px 5px 9px', borderRadius:999, fontSize:12.5, fontWeight:800,
          background: subscribed ? 'var(--surface-2)' : 'color-mix(in srgb,var(--brand-soft) 84%, #fff 16%)',
          color: subscribed ? 'var(--text-muted)' : 'var(--brand-strong)',
          border: subscribed ? '1px solid var(--hairline)' : '1px solid color-mix(in srgb,var(--brand) 38%, transparent)' }}>
        <Icon name={subscribed?'check':'bell'} size={13} color="currentColor" stroke={subscribed?2.6:2} />
        {subscribed ? '已订阅' : '订阅'}
      </button>
      <button onClick={onShare} aria-label="分享" style={{ display:'flex', alignItems:'center', padding:'3px' }}>
        <Icon name="share" size={20} color="color-mix(in srgb, var(--brand-strong) 62%, var(--text) 38%)" stroke={2} />
      </button>
    </div>
  );
}

/* ---------------- 页面 Tab — 商旅/展演隐藏探索 ---------------- */
function PageTabs({ ctx, tab, onTab, cityFirst }){
  const cityName = ctx.city || '冲绳';
  // 商旅、展演不显示探索 tab
  const showExplore = ctx.identity !== 'biz' && ctx.identity !== 'event';

  const TabBtn = ({ id, children }) => {
    const on = tab===id;
    return (
      <button onClick={()=>onTab(id)} style={{ position:'relative', display:'flex', alignItems:'center', gap:4, padding:'7px 0 11px', fontSize:15,
        fontWeight:on?800:500, color:on?'var(--text)':'var(--text-muted)' }}>
        {children}
        {on && <span style={{ position:'absolute', bottom:-1, left:'50%', transform:'translateX(-50%)', width:20, height:3, borderRadius:99, background:'var(--brand)' }} />}
      </button>
    );
  };
  const exploreTab = showExplore ? <TabBtn key="explore" id="explore">探索目的地</TabBtn> : null;
  const cityTab = (
    <TabBtn key="city" id="city">
      <Icon name="pin" size={14} color={tab==='city'?'var(--brand)':'var(--text-muted)'} />
      {cityName}
      <Icon name="chevD" size={12} color={tab==='city'?'var(--brand)':'var(--text-muted)'} />
    </TabBtn>
  );
  // 决策(S2)/灵感(S1)/行程后(S5)：探索目的地 在第 1 位；行程前/中(S3/S4)：目的地 在第 1 位，探索退居第 2 位
  const ordered = cityFirst ? [cityTab, exploreTab] : [exploreTab, cityTab];
  return (
    <div style={{ position:'relative', zIndex:'var(--z-tab)', background:'var(--bg)',
      transition:'background-color var(--t-slow) var(--ease)', display:'flex', gap:22, padding:'3px 16px 0',
      borderBottom:'1px solid var(--hairline)' }}>
      {ordered}
    </div>
  );
}

/* ---------------- Toast ---------------- */
function Toast({ toast, onUndo }){
  if(!toast) return null;
  return (
    <div style={{ position:'absolute', top:13, left:'50%', transform:'translateX(-50%)', zIndex:'var(--z-toast)',
      background:'rgba(20,20,24,.94)', color:'#fff', borderRadius:11, padding:'9px 13px', display:'flex', alignItems:'center', gap:10,
      boxShadow:'0 8px 28px rgba(0,0,0,.4)', maxWidth:'88%', animation:'floorIn .3s ease' }}>
      <Icon name="spark" size={14} color="#FFD27A" fill="#FFD27A" />
      <span style={{ fontSize:13.5, lineHeight:1.4 }}>{toast.msg}</span>
      {toast.undo && <button onClick={onUndo} style={{ display:'flex', alignItems:'center', gap:2, color:'#7FB4FF', fontSize:13.5, fontWeight:700, whiteSpace:'nowrap' }}><Icon name="undo" size={13} color="#7FB4FF" />撤销</button>}
    </div>
  );
}

/* ---------------- 家庭档案 sheet ---------------- */
function FamilySheet({ open, family, onClose, onSave }){
  const [adults, setAdults] = useState(family.adults);
  const [kids, setKids] = useState(family.children.length || 1);
  const [ages, setAges] = useState(family.children.map(c=>c.age));
  useEffect(()=>{ if(open){ setAdults(family.adults); setKids(family.children.length||1); setAges(family.children.map(c=>c.age)); } }, [open]);
  const AGE_OPTS = [{ v:0, label:'<1岁' }].concat(Array.from({length:17}).map((_,i)=>({ v:i+1, label:(i+1)+'岁' })));
  function setAge(i,a){ setAges(p=>{ const n=[...p]; n[i]=a; return n; }); }
  function save(){
    const children = Array.from({length:kids}).map((_,i)=>({ age: ages[i]!=null?ages[i]:3 }));
    onSave({ adults, children, filled:true });
  }
  return (
    <Sheet open={open} onClose={onClose} title="我的家庭档案">
      <div style={{ padding:'4px 16px 20px' }}>
        <Stepper label="成人数" value={adults} min={1} max={6} onChange={setAdults} />
        <Stepper label="儿童数" value={kids} min={1} max={4} onChange={setKids} />
        <div style={{ height:1, background:'var(--hairline)', margin:'12px 0' }} />
        {Array.from({length:kids}).map((_,i)=>(
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', marginBottom:7 }}>孩子 {i+1} 的年龄</div>
            <div style={{ position:'relative' }}>
              <select value={ages[i]!=null?ages[i]:3} onChange={e=>setAge(i, Number(e.target.value))}
                style={{ width:'100%', appearance:'none', WebkitAppearance:'none', MozAppearance:'none',
                  padding:'11px 38px 11px 14px', borderRadius:10, border:'1.5px solid var(--hairline)',
                  background:'var(--surface)', fontSize:15, fontWeight:600, color:'var(--text)',
                  fontFamily:'inherit', outline:'none', cursor:'pointer' }}>
                {AGE_OPTS.map(o=> <option key={o.v} value={o.v}>{o.label}</option>)}
              </select>
              <span style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', display:'flex' }}>
                <Icon name="chevD" size={16} color="var(--text-muted)" />
              </span>
            </div>
          </div>
        ))}
        <button className="btn btn-block" onClick={save} style={{ marginTop:8, padding:'13px' }}>保存档案 · 优化推荐</button>
      </div>
    </Sheet>
  );
}

function Stepper({ label, value, min, max, onChange }){
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0' }}>
      <span style={{ fontSize:15, color:'var(--text)' }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button onClick={()=> onChange(Math.max(min,value-1))} style={{ width:28, height:28, borderRadius:99, border:'1.5px solid var(--hairline)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="minus" size={14} color="var(--text)" /></button>
        <span style={{ fontSize:16, fontWeight:700, minWidth:16, textAlign:'center', color:'var(--text)' }}>{value}</span>
        <button onClick={()=> onChange(Math.min(max,value+1))} style={{ width:28, height:28, borderRadius:99, background:'var(--brand)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="plus" size={14} color="#fff" /></button>
      </div>
    </div>
  );
}

/* ---------------- 城市选择浮层 ---------------- */
const HOT_CITIES = [
  { city:'冲绳', lowPrice:2100, reason:'直飞3h · 水族馆遛娃' },
  { city:'三亚', lowPrice:1280, reason:'避寒首选 · 椰风海岸' },
  { city:'上海', lowPrice:480,  reason:'都市差旅 · 高效通达' },
  { city:'东京', lowPrice:1980, reason:'潮玩血拼 · 迪士尼' },
  { city:'普吉', lowPrice:1680, reason:'亲子沙滩 + 无边泳池' },
  { city:'成都', lowPrice:620,  reason:'美食 + 熊猫基地' },
  { city:'北京', lowPrice:560,  reason:'故宫文化 · 长知识' },
  { city:'马代', lowPrice:6800, reason:'私岛秘境 · 一价全包' },
  { city:'香港', lowPrice:680,  reason:'购物天堂 · 维港夜景' },
  { city:'厦门', lowPrice:520,  reason:'文艺海岛 · 鼓浪屿' },
  { city:'大理', lowPrice:740,  reason:'苍山洱海 · 慢生活' },
  { city:'重庆', lowPrice:560,  reason:'8D魔幻 · 火锅之都' },
];
function CitySwitcher({ open, current, onClose, onPick }){
  const [q, setQ] = useState('');
  useEffect(()=>{ if(open) setQ(''); }, [open]);
  const nearby = HOT_CITIES.slice(0, 6);
  const longhaul = HOT_CITIES.slice(6);
  const list = q.trim() ? HOT_CITIES.filter(c=> c.city.includes(q.trim())) : HOT_CITIES;
  // 分组标题吸顶位置 = 搜索头实际高度，避免标题躲在搜索头后面只露出一条白色缝隙
  const headRef = useRef(null);
  const [stickTop, setStickTop] = useState(126);
  useEffect(()=>{
    const el = headRef.current;
    if(!el) return;
    const update = ()=> setStickTop(48 + el.offsetHeight);
    update();
    let ro;
    if(typeof ResizeObserver!=='undefined'){ ro = new ResizeObserver(update); ro.observe(el); }
    const raf = requestAnimationFrame(update);
    return ()=>{ if(ro) ro.disconnect(); cancelAnimationFrame(raf); };
  }, [open, q]);
  // 「当前位置」展示用户所在的出发城市，与 feeds 机票出发城市同源（defaultDepartCity）
  const located = (window.defaultDepartCity ? window.defaultDepartCity(current) : current);

  function SectionTitle({ children }){
    return (
      <div style={{ position:'sticky', top:stickTop, zIndex:34, background:'var(--surface)', padding:'8px 2px 6px', margin:'0 -2px', boxShadow:'0 6px 10px rgba(0,0,0,.025)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13.5, fontWeight:800, color:'var(--text)' }}>
          <Icon name="spark" size={13} color="var(--brand)" fill="var(--brand)" />{children}
        </div>
      </div>
    );
  }

  function renderCityCard(c){
    const on = c.city===located;
    return (
      <button key={c.city} onClick={()=>onPick(c.city)} className="card" style={{ overflow:'hidden', textAlign:'left', padding:0, border: on?'2px solid var(--brand)':'1px solid var(--hairline)', borderRadius:13, boxShadow:'none' }}>
        <Ph label={c.city} photo h={64} r={0}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(255,255,255,.04),rgba(0,0,0,.18) 45%,rgba(0,0,0,.50)), linear-gradient(135deg,color-mix(in srgb,var(--brand) 24%,transparent),transparent 62%)', display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'6px 8px' }}>
            <span style={{ color:'#fff', fontSize:14.5, fontWeight:800, display:'flex', alignItems:'center', gap:2 }}><Icon name="pin" size={11.5} color="#fff" />{c.city}</span>
            {on && <span style={{ background:'linear-gradient(135deg,var(--brand-light,#F4ADB5),var(--brand,#D87D91) 58%,var(--brand-strong,#B85E74))', color:'var(--on-brand)', fontSize:10, fontWeight:800, padding:'1.5px 5px', borderRadius:99 }}>当前</span>}
          </div>
        </Ph>
        <div style={{ padding:'4px 8px 5px', borderTop:'1px solid rgba(255,255,255,.04)' }}>
          <div style={{ fontSize:'10.3px', color:'var(--text-muted)', lineHeight:1.22, minHeight:22, overflow:'hidden', marginBottom:1 }}>{c.reason}</div>
        </div>
      </button>
    );
  }

  return (
    <Sheet open={open} onClose={onClose} title="选择目的地" height="84%">
      <div ref={headRef} style={{ position:'sticky', top:48, zIndex:60, background:'var(--surface)', padding:'9px 14px 9px', boxShadow:'none', borderBottom:'1px solid var(--hairline)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, background:'var(--bg)', border:'1.5px solid var(--brand-soft)', borderRadius:999, padding:'8px 13px' }}>
          <Icon name="search" size={16} color="var(--brand)" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索城市 / 国家 / 目的地"
            style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:14.5, color:'var(--text)' }} />
          {q && <button onClick={()=>setQ('')}><Icon name="close" size={15} color="var(--text-muted)" /></button>}
        </div>
        {!q.trim() && (
          <button onClick={()=>onPick(located)} style={{ marginTop:7, width:'100%', display:'flex', alignItems:'center', gap:8, background:'transparent', border:'none', borderRadius:12, padding:'7px 4px' }}>
            <span style={{ width:24, height:24, borderRadius:999, background:'var(--brand-soft)', color:'var(--brand)', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon name="pin" size={12} color="var(--brand)" fill="var(--brand-soft)" />
            </span>
            <span style={{ textAlign:'left' }}>
              <span style={{ display:'block', fontSize:12.5, color:'var(--text)', fontWeight:700 }}>当前位置</span>
              <span style={{ display:'block', fontSize:11.5, color:'var(--text-muted)' }}>已为你定位：{located}</span>
            </span>
          </button>
        )}
      </div>
      <div style={{ padding:'4px 14px 26px', background:'var(--surface)', position:'relative', zIndex:1 }}>
        {q.trim() ? (
          <>
            <div style={{ position:'sticky', top:stickTop, zIndex:34, background:'var(--surface)', padding:'8px 2px 7px', margin:'0 -2px', fontSize:13.5, fontWeight:800, color:'var(--text)', display:'flex', alignItems:'center', gap:5, boxShadow:'0 6px 10px rgba(0,0,0,.035)' }}>
              <Icon name="spark" size={13} color="var(--brand)" fill="var(--brand)" />搜索结果
            </div>
            {list.length===0 ? (
              <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:14, padding:'36px 0' }}>没有找到「{q}」相关目的地</div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, paddingBottom:8 }}>
                {list.map(c=> renderCityCard(c))}
              </div>
            )}
          </>
        ) : (
          <>
            <SectionTitle>周边热门城市</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, paddingBottom:12 }}>
              {nearby.map(c=> renderCityCard(c))}
            </div>
            <SectionTitle>长途热门城市</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {longhaul.map(c=> renderCityCard(c))}
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}

/* ---------------- 通用底部 sheet ---------------- */
function Sheet({ open, onClose, title, children, height }){
  return (
    <>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', zIndex:'var(--z-sheet)',
        opacity:open?1:0, pointerEvents:open?'auto':'none', transition:'opacity var(--t-base)' }} />
      <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:'calc(var(--z-sheet) + 1)', background:'var(--surface)',
        borderRadius:'18px 18px 0 0', maxHeight: height||'82%', overflowY:'auto',
        transform:open?'translateY(0)':'translateY(100%)', transition:'transform var(--t-base) var(--ease)', boxShadow: open ? '0 -8px 36px rgba(0,0,0,.3)' : 'none' }}>
        <div style={{ position:'sticky', top:0, zIndex:80, background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 9px', borderBottom:'1px solid var(--hairline)', boxShadow:'0 7px 12px rgba(0,0,0,.04)' }}>
          <button onClick={onClose}><Icon name="close" size={20} color="var(--text)" /></button>
          <span style={{ fontSize:16, fontWeight:800, color:'var(--text)' }}>{title}</span>
          <span style={{ width:20 }} />
        </div>
        {children}
      </div>
    </>
  );
}

/* ---------------- AI 对话面板 ---------------- */
function AIPanel({ open, onClose, messages, onSend, suggestions }){
  const [val, setVal] = useState('');
  const bodyRef = useRef(null);
  useEffect(()=>{ if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [messages, open]);
  return (
    <Sheet open={open} onClose={onClose} title="问一问 · AI 助手" height="76%">
      <div ref={bodyRef} style={{ padding:'12px 14px', minHeight:240, maxHeight:'48vh', overflowY:'auto' }}>
        {messages.length===0 && (
          <div style={{ color:'var(--text-muted)', fontSize:13.5, textAlign:'center', padding:'28px 0' }}>
            告诉我你的出行想法，我帮你实时调整页面 ✨<br/>试试下面的快捷指令 👇
          </div>
        )}
        {messages.map((m,i)=>(
          <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', marginBottom:9 }}>
            <div style={{ maxWidth:'78%', padding:'9px 12px', borderRadius:13, fontSize:14, lineHeight:1.5,
              background: m.role==='user'?'var(--brand)':'var(--surface-2)', color: m.role==='user'?'#fff':'var(--text)',
              borderBottomRightRadius: m.role==='user'?4:13, borderBottomLeftRadius: m.role==='user'?13:4 }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:'7px 13px 5px', display:'flex', gap:6, flexWrap:'wrap' }}>
        {suggestions.map(s=>(
          <button key={s} onClick={()=>onSend(s)} style={{ fontSize:13, padding:'6px 11px', borderRadius:999, border:'1px solid var(--brand)', color:'var(--brand)', background:'var(--brand-soft)' }}>{s}</button>
        ))}
      </div>
      <div style={{ position:'sticky', bottom:0, background:'var(--surface)', padding:'9px 13px calc(13px + env(safe-area-inset-bottom))', display:'flex', gap:7, borderTop:'1px solid var(--hairline)' }}>
        <input value={val} onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'&&val.trim()){ onSend(val.trim()); setVal(''); } }}
          placeholder="说说你的出行想法…"
          style={{ flex:1, border:'1px solid var(--hairline)', borderRadius:999, padding:'9px 14px', fontSize:14.5, background:'var(--bg)', color:'var(--text)', outline:'none' }} />
        <button className="btn" onClick={()=>{ if(val.trim()){ onSend(val.trim()); setVal(''); } }} style={{ padding:'9px 16px' }}>发送</button>
      </div>
    </Sheet>
  );
}

/* ---------------- 底部 AI 对话栏（固定底部区域：气泡 + 输入框，参考样式） ---------------- */
function AIDock({ suggestions, onSend, onOpen, actionChips, onTrayChange }){
  const [voice, setVoice] = useState(false);
  const [rec, setRec] = useState(false);
  const recRef = useRef(false);
  function startRec(e){ if(e&&e.preventDefault) e.preventDefault(); recRef.current=true; setRec(true); }
  function endRec(){ if(!recRef.current) return; recRef.current=false; setRec(false); onOpen(); onSend(suggestions[0]); }
  function cancelRec(){ recRef.current=false; setRec(false); }
  useEffect(()=>{ onTrayChange && onTrayChange(false); }, []);

  // 顶部只保留原「行程规划入口」等动作气泡，不再展示预制问题
  const chips = (actionChips||[]).map(c=>({ key:'act-'+c.label, label:c.label, icon:c.icon || 'cal', onClick:c.onClick }));

  const roundBtn = {
    flex:'0 0 auto', width:34, height:34, borderRadius:999, display:'flex',
    alignItems:'center', justifyContent:'center', background:'var(--surface-2)',
    border:'1px solid var(--hairline)', color:'var(--text)',
  };

  return (
    <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:'var(--z-aibar)' }}>
      {/* 固定底部区域（顶部不加圆角；底部两角跟随屏幕圆角，自身裁切即可，不依赖祖先 overflow，彻底避免穿模） */}
      <div style={{ background:'var(--surface)', borderTop:'1px solid var(--hairline)',
        borderRadius:'0 0 var(--screen-radius,42px) var(--screen-radius,42px)', boxShadow:'none',
        padding:'7px 0 calc(16px + env(safe-area-inset-bottom))' }}>

        {/* 行程规划入口等动作气泡（无则不展示） */}
        {chips.length > 0 && (
        <div className="hscroll" style={{ gap:8, padding:'1px 12px 7px' }}>
          {chips.map(c=>(
            <button key={c.key} onClick={c.onClick} style={{
              flex:'0 0 auto', display:'flex', alignItems:'center', gap:5,
              padding:'7px 13px', borderRadius:999, fontSize:13.5, fontWeight:700, whiteSpace:'nowrap',
              background:'var(--surface)', border:'1px solid color-mix(in srgb,var(--brand) 45%, transparent)', color:'var(--brand)',
              boxShadow:'0 1px 5px rgba(0,0,0,.07)' }}>
              <Icon name={c.icon} size={13} color="var(--brand)" />{c.label}
            </button>
          ))}
        </div>
        )}

        {/* 输入框（明显边框 + 阴影；语音 / 文字切换为独立按钮，互不干扰，丝滑退出语音态） */}
        <div style={{ padding:'0 14px', display:'flex', alignItems:'center', gap:8 }}>
          {voice ? (
            <>
              <button
                onPointerDown={startRec} onPointerUp={endRec} onPointerLeave={endRec} onPointerCancel={cancelRec}
                className={rec?'btn':''}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  background: rec?undefined:'var(--surface)', borderRadius:24,
                  border: rec?'none':'1.5px solid color-mix(in srgb,var(--text) 16%, var(--hairline))',
                  boxShadow: rec?'none':'0 1px 4px rgba(0,0,0,.05)',
                  padding:'9px 14px', color: rec?undefined:'var(--text)', fontSize:14.5, fontWeight:rec?800:600,
                  userSelect:'none', WebkitUserSelect:'none', touchAction:'none', transition:'background var(--t-fast)' }}>
                <span style={{ position:'relative', display:'flex', alignItems:'center' }}>
                  <Icon name="mic" size={17} color={rec?'currentColor':'var(--brand)'} fill={rec?'currentColor':'none'} />
                  {rec && <span style={{ position:'absolute', inset:-5, borderRadius:99, border:'2px solid currentColor', opacity:.5, animation:'breathe 1.1s infinite' }} />}
                </span>
                {rec ? '正在聆听… 松开发送' : '按住 说话'}
              </button>
              <button onClick={()=>{ cancelRec(); setVoice(false); }} aria-label="切回文字输入" style={roundBtn}>
                <Icon name="keyboard" size={18} color="var(--text)" />
              </button>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'var(--surface)',
              border:'1.5px solid color-mix(in srgb,var(--text) 16%, var(--hairline))', borderRadius:24,
              padding:'5px 7px 5px 12px',
              boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
              <button aria-label="AI 问答" onClick={()=>onOpen()} style={{ flex:'0 0 auto', display:'flex', alignItems:'center', padding:2 }}>
                <Icon name="spark" size={21} color="var(--brand)" fill="var(--brand)" />
              </button>
              <button onClick={()=>onOpen()} style={{ flex:1, minWidth:0, textAlign:'left', background:'transparent',
                color:'var(--text-muted)', fontSize:14.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                问一问：想去哪、找特价、带娃出行…
              </button>
              <button aria-label="语音输入" onClick={()=>setVoice(true)} style={roundBtn}>
                <Icon name="wave" size={18} color="var(--text)" stroke={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 订阅频道 sheet ---------------- */
function ShareBrandIcon({ id, size=30 }){
  switch(id){
    case 'wechat': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <ellipse cx="9" cy="9.7" rx="6.4" ry="5.4" fill="white"/>
        <path d="M4.7 13.4l-1.6 2.6 3.2-1.4z" fill="white"/>
        <ellipse cx="16.3" cy="15" rx="5.3" ry="4.4" fill="white"/>
        <path d="M19.5 18.2l1.5 2.1-2.6-1z" fill="white"/>
        <circle cx="7" cy="9.1" r="0.95" fill="#07C160"/>
        <circle cx="11" cy="9.1" r="0.95" fill="#07C160"/>
        <circle cx="14.9" cy="14.6" r="0.85" fill="#07C160"/>
        <circle cx="17.8" cy="14.6" r="0.85" fill="#07C160"/>
      </svg>
    );
    case 'instagram': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5.4" stroke="white" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="2"/>
        <circle cx="17.2" cy="6.8" r="1.35" fill="white"/>
      </svg>
    );
    case 'facebook': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
        <path d="M13.4 21v-7h2.4l.4-3.1h-2.8V8.9c0-.9.26-1.5 1.55-1.5H16.4V4.65c-.28-.04-1.25-.13-2.38-.13-2.36 0-3.97 1.44-3.97 4.08v2.28H7.6V14h2.45v7z"/>
      </svg>
    );
    case 'line': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3.6C7 3.6 3 6.9 3 10.95c0 3.62 3.16 6.66 7.43 7.24.29.06.68.19.78.43.09.22.06.56.03.78l-.12.74c-.04.22-.18.86.76.47.93-.39 5.02-2.96 6.85-5.07h0C19.27 14.1 21 12.7 21 10.95c0-4.05-4-7.35-9-7.35z" fill="white"/>
        <rect x="7.4" y="9.7" width="1.25" height="3.7" rx="0.6" fill="#06C755"/>
        <rect x="10.2" y="9.7" width="1.25" height="3.7" rx="0.6" fill="#06C755"/>
        <rect x="13" y="9.7" width="1.25" height="3.7" rx="0.6" fill="#06C755"/>
        <rect x="15.4" y="9.7" width="1.25" height="3.7" rx="0.6" fill="#06C755"/>
      </svg>
    );
    case 'whatsapp': return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 3C8.8 3 3 8.8 3 16c0 2.5.7 4.9 1.9 7L3 29l6.2-1.6c2 1.1 4.4 1.7 6.8 1.7 7.2 0 13-5.8 13-13S23.2 3 16 3z" fill="white"/>
        <path d="M12.2 9.9c-.25-.55-.5-.56-.74-.57h-.63c-.22 0-.58.08-.88.4-.3.32-1.16 1.13-1.16 2.76 0 1.63 1.19 3.2 1.35 3.42.17.22 2.3 3.68 5.68 5.02 2.82 1.11 3.4.89 4 .83.6-.05 1.95-.8 2.22-1.56.27-.77.27-1.42.19-1.56-.08-.13-.3-.22-.63-.38-.33-.16-1.95-.96-2.25-1.07-.3-.11-.52-.16-.74.17-.22.32-.85 1.06-1.04 1.28-.19.22-.38.25-.71.08-.33-.16-1.39-.51-2.65-1.63-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.5.14-.67.15-.15.33-.38.49-.58.16-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.16-.73-1.79-1.02-2.45z" fill="#25D366"/>
      </svg>
    );
    case 'x': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
        <path d="M17.2 3.5h2.9l-6.36 7.27L21.5 20.5h-5.86l-4.6-6-5.25 6H2.88l6.8-7.78L2.6 3.5h6l4.15 5.49zm-1.02 15.2h1.62L7.9 5.2H6.16z"/>
      </svg>
    );
    default: return null;
  }
}

function SubscribeSheet({ open, onClose, onConfirm }){
  const TYPES = [
    { id:'promo',   label:'优惠或活动通知', desc:'限时折扣、大促、秒杀开抢提醒', icon:'bolt'   },
    { id:'benefit', label:'权益上新',       desc:'新优惠券、会员权益第一时间知道', icon:'gift'   },
    { id:'content', label:'旅行内容推送',   desc:'目的地灵感、攻略与热门榜单',     icon:'book'   },
  ];
  const [sel, setSel] = useState({ promo:true, benefit:true, content:true });
  useEffect(()=>{ if(open) setSel({ promo:true, benefit:true, content:true }); }, [open]);
  const toggle = id => setSel(s=>({ ...s, [id]: !s[id] }));
  return (
    <Sheet open={open} onClose={onClose} title="订阅优惠频道">
      <div style={{ padding:'10px 16px 24px' }}>
        <div style={{ fontSize:13.5, color:'var(--text-muted)', marginBottom:14, lineHeight:1.5 }}>
          选择你希望收到的消息类型，订阅后随时可调整
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {TYPES.map(t=>{
            const on = sel[t.id];
            return (
              <button key={t.id} onClick={()=>toggle(t.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 4px', textAlign:'left', width:'100%',
                background:'transparent', border:'none',
                transition:'all .16s ease' }}>
                {/* 左侧 icon */}
                <span style={{ width:36, height:36, borderRadius:11, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                  background: on ? 'var(--brand)' : 'var(--surface-2)',
                  transition:'all .16s ease' }}>
                  <Icon name={t.icon} size={16} color={on?'var(--on-brand,#fff)':'var(--text-muted)'} fill={on?'var(--on-brand,#fff)':'none'} />
                </span>
                {/* 文案 */}
                <span style={{ flex:1, minWidth:0 }}>
                  <span style={{ display:'block', fontSize:14.5, fontWeight:on?800:700, color:'var(--text)', lineHeight:1.2 }}>{t.label}</span>
                  <span style={{ display:'block', fontSize:11.5, color:'var(--text-muted)', marginTop:2 }}>{t.desc}</span>
                </span>
                {/* 圆形勾选指示 */}
                <span style={{ width:22, height:22, borderRadius:999, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                  background: on ? 'var(--brand)' : 'transparent',
                  border:'1.5px solid '+(on ? 'var(--brand)' : 'var(--hairline)'),
                  transition:'all .16s ease' }}>
                  {on && <Icon name="check" size={12} color="var(--on-brand,#fff)" stroke={3}/>}
                </span>
              </button>
            );
          })}
        </div>
        <button className="btn btn-block" onClick={()=>onConfirm(sel)} style={{ marginTop:18, padding:'13px' }}>确认订阅</button>
        <div style={{ fontSize:11.5, color:'var(--text-muted)', textAlign:'center', marginTop:9 }}>可随时在频道页取消订阅</div>
      </div>
    </Sheet>
  );
}

/* ---------------- 分享浮层 ---------------- */
function ShareSheet({ open, onClose, onPick }){
  const CHANNELS = [
    { id:'wechat',    label:'微信',       bg:'#07C160', brand:true },
    { id:'instagram', label:'Instagram',  bg:'linear-gradient(45deg,#F58529,#DD2A7B 52%,#8134AF)', brand:true },
    { id:'facebook',  label:'Facebook',   bg:'#1877F2', brand:true },
    { id:'line',      label:'LINE',       bg:'#06C755', brand:true },
    { id:'whatsapp',  label:'WhatsApp',   bg:'#25D366', brand:true },
    { id:'x',         label:'X',          bg:'#111', brand:true },
    { id:'copy',      label:'复制链接',   bg:'var(--surface-2)', icon:'link', fg:'var(--text)' },
    { id:'more',      label:'更多',       bg:'var(--surface-2)', icon:'more', fg:'var(--text)' },
  ];
  return (
    <Sheet open={open} onClose={onClose} title="分享到">
      <div style={{ padding:'14px 14px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'18px 6px' }}>
          {CHANNELS.map(c=>(
            <button key={c.id} onClick={()=>onPick(c)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, padding:'2px' }}>
              <span style={{ width:54, height:54, borderRadius:16, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 5px 14px rgba(0,0,0,.14)', border: !c.brand ? '1px solid var(--hairline)' : 'none' }}>
                {c.brand
                  ? <ShareBrandIcon id={c.id} size={31} />
                  : <Icon name={c.icon} size={25} color={c.fg||'var(--text)'} stroke={1.9} />}
              </span>
              <span style={{ fontSize:11.5, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{c.label}</span>
            </button>
          ))}
        </div>
        <button className="btn-ghost btn-block" onClick={onClose} style={{ marginTop:20, padding:'12px' }}>取消</button>
      </div>
    </Sheet>
  );
}

/* ---------------- 通用居中确认弹窗 ---------------- */
function ConfirmDialog({ open, title, desc, confirmText, cancelText, onConfirm, onClose }){
  if(!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', zIndex:'var(--z-sheet)' }} />
      <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', zIndex:'calc(var(--z-sheet) + 2)', width:'78%', maxWidth:300,
        background:'var(--surface)', borderRadius:16, padding:'20px 18px 16px', boxShadow:'0 18px 50px rgba(0,0,0,.42)', textAlign:'center', animation:'floorIn .2s ease' }}>
        <div style={{ fontSize:16.5, fontWeight:800, color:'var(--text)', marginBottom:7 }}>{title}</div>
        <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.55, marginBottom:18 }}>{desc}</div>
        <div style={{ display:'flex', gap:9 }}>
          <button className="btn-ghost btn-block" onClick={onClose} style={{ padding:'10px' }}>{cancelText||'取消'}</button>
          <button className="btn btn-block" onClick={onConfirm} style={{ padding:'10px' }}>{confirmText||'确认'}</button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { TopNav, PageTabs, Toast, FamilySheet, Sheet, AIPanel, AIDock, CitySwitcher, MODES, SubscribeSheet, ShareSheet, ConfirmDialog });
