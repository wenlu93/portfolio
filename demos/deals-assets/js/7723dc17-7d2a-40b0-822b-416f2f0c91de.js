/* ============================================================
   OTA Demo — 核心模块 A
   Coupon / FlashSale / Feeds / SceneGuide
   ============================================================ */
const { useState, useEffect, useRef, useLayoutEffect } = React;

/* ---------------- 5.1 优惠券 ---------------- */
function Coupon({ props, bus }){
  const raw = (props.tier==='premium' ? window.DATA.coupons.premium : window.DATA.coupons.value);
  // 展演 / 商务 模式下，优惠券模块改名为「优惠代码权益」
  const couponTitle = (props.identity==='event' || props.identity==='biz') ? '优惠代码权益' : '每月优惠权益';
  const [claimed, setClaimed] = useState({});
  const TABS = [{id:'hotel',label:'酒店'},{id:'flight',label:'机票'},{id:'ticket',label:'门票'}];
  const [cat, setCat] = useState(TABS[0].id);
  useEffect(()=>{ setCat(TABS[0].id); }, [props.identity, props.tier]);

  const TYPE_ICON = { hotel:'bed', flight:'planeGlyph', ticket:'ticket', category:'ticket' };
  const TYPE_LABEL = { hotel:'酒店', flight:'机票', ticket:'门票', category:'门票' };

  // 排序优先级：可领(0) → 已领(1) → 抢光置灰(2)，保证置灰券始终排最后
  const rank = c => (c.stock<=0 ? 2 : (c.status==='claimed' ? 1 : 0));
  const listBase = raw.filter(c=> c.type===cat || (cat==='ticket' && c.type==='category'));
  // 直接展示去重后的真实券，不再用取模补位（避免一行三张相同券）
  const list = [...listBase].sort((a,b)=> rank(a)-rank(b)).map((item,i)=>({ ...item, _k:`${item.id}_${cat}_${i}` }));

  function claim(c){
    if(c.stock<=0 || claimed[c.id]) return;
    setClaimed(s=>({ ...s, [c.id]:true }));
    bus.toast(`已领取「${c.face}」优惠券`);
  }

  function renderCard(c, notchBg){
    const isClaimed = claimed[c.id] || c.status==='claimed';
    const sold = c.stock<=0;
    const isDisc = !(c.amount>0);
    return (
      <div key={c._k||c.id} className="cpx-tk" style={{ opacity:sold?.6:1 }}>
        <div className="cpx-fill"></div>
        <svg className="cpx-svg" viewBox="0 0 250 88">
          <path className="cpx-edge" vectorEffect="non-scaling-stroke" d="M14 0 H77 A7 7 0 0 0 91 0 H236 A14 14 0 0 1 250 14 V74 A14 14 0 0 1 236 88 H91 A7 7 0 0 0 77 88 H14 A14 14 0 0 1 0 74 V14 A14 14 0 0 1 14 0 Z" />
          <path className="cpx-dash" vectorEffect="non-scaling-stroke" d="M84 9 V79" />
        </svg>
        <div className="cpx-amt">
          {isDisc
            ? <><div className="cpx-big">95<span className="cpx-unit">折</span></div><div className="cpx-thr">会员专享</div></>
            : <><div className="cpx-big"><span className="cpx-cur">¥</span>{c.amount}</div><div className="cpx-thr">满{c.threshold}可用</div></>}
        </div>
        <div className="cpx-main">
          <div className="cpx-ttl">{c.sell || c.scope}</div>
          <button className={isClaimed?'btn-ghost':'btn'} disabled={sold} onClick={()=>claim(c)}
            style={{ flex:'0 0 auto', alignSelf:'center', padding:'6px 14px', fontSize:12.5, whiteSpace:'nowrap', boxShadow:'none', filter:'none' }}>
            {sold?'已抢光':(isClaimed?'去使用':'领取')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="floor floor-enter">
      <div className="floor-head">
        <h2 className="floor-title"><Icon name="gift" size={15} color="var(--brand)" />{couponTitle}</h2>
        <span className="floor-more">查看全部 <Icon name="chevR" size={13} /></span>
      </div>
      <div style={{ margin:'0 14px 2px', padding:'2px 0 4px', position:'relative' }}>
        <div style={{ display:'flex', gap:5, marginBottom:8, paddingRight:34, position:'relative', zIndex:1 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setCat(t.id)} style={{
              padding:'4px 11px', borderRadius:999, fontSize:12.5, fontWeight:700, cursor:'pointer',
              background: cat===t.id ? 'var(--surface)' : 'transparent',
              color: cat===t.id ? 'var(--brand-strong)' : 'var(--text-muted)',
              border: cat===t.id ? '1.5px solid var(--brand)' : '1.5px solid var(--hairline)',
              transition:'all .15s ease',
            }}>{t.label}</button>
          ))}
        </div>
        <div className="hscroll cpx-row" style={{ margin:'0 -9px', padding:'1px 9px 4px', gap:9 }}>
          {list.map(c => renderCard(c))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5.2 秒杀 ---------------- */
const CAT_LABEL = { flight:'机票', hotel:'酒店', ticket:'门票' };
const SALE_DATES = ['6月1日','6月7日','6月14日'];

/* 秒杀商品「目的地化」：城市 tab 下商品归属当前城市；机票出发地统一、酒店展示酒店名、门票展示景点名 */
function cityizeFlash(it, cat, city){
  if(cat==='flight'){
    // 出发城市统一为 defaultDepartCity（与 Feeds 机票筛选 / 卡片一致）
    const dep = window.defaultDepartCity(city || '冲绳');
    let dest = city;
    if(!dest){
      const m = it.title.match(/[→\-]\s*(\S+?)(?:\s|$)/);
      dest = m ? m[1] : '三亚';
    }
    return { ...it, title:`${dep} → ${dest}`, img:`机票 ${dest}` };
  }
  if(!city) return it;
  const h = (it.id + city).split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
  if(cat==='hotel'){
    const brands = window.DATA.hotelBrands;
    return { ...it, title:`${city}·${brands[h % brands.length]}`, img:`${city} 酒店` };
  }
  // 门票：标题展示景点名称
  const d = window.DATA.destDB && window.DATA.destDB[city];
  const spots = (d && d.spots) || [];
  const name = spots.length ? spots[h % spots.length].name : `${city}热门景点`;
  return { ...it, title:`${name}`, img:`${city} 景点` };
}

function FlashSale({ props, bus, ctx }){
  const cats = ['flight','hotel','ticket'];
  const [cat, setCat] = useState(cats[0]);
  const [saleDate, setSaleDate] = useState(SALE_DATES[0]);
  useEffect(()=>{ setCat(cats[0]); setSaleDate(SALE_DATES[0]); }, [props.identity, props.tier]);
  // 非「探索」tab：秒杀商品全部归属当前城市（与页面 tab 标题同源，默认冲绳）
  const city = (ctx && ctx.tab !== 'explore') ? ((ctx.city) || window.fallbackCity(props.identity)) : null;
  // 展演 / 商务 模式下，秒杀模块改名为「限时秒杀」
  const flashTitle = (props.identity==='event' || props.identity==='biz') ? '限时秒杀' : '每周秒杀';
  let items = (window.DATA.flash[cat] || []).map(it=> cityizeFlash(it, cat, city));
  if(props.identity==='family') items = [...items].sort((a,b)=> (b.kid?1:0)-(a.kid?1:0));
  items = [...items].sort((a,b)=> ((a.stock<=0)?1:0)-((b.stock<=0)?1:0));

  return (
    <FloorShell title={<span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="bolt" size={15} color="var(--brand)" fill="var(--brand)" />{flashTitle}</span>} dot={false}>
      <div className="hscroll" style={{ paddingBottom:2, gap:6, marginBottom:1 }}>
        {SALE_DATES.map(d=>(
          <button key={d} onClick={()=>setSaleDate(d)} style={{
            padding:'4px 13px', borderRadius:999, fontWeight:700, fontSize:13,
            background: saleDate===d ? 'var(--brand)' : 'var(--surface-2)',
            color: saleDate===d ? (props.tier==='premium'?'#1A1505':'#fff') : 'var(--text-muted)',
            border: saleDate===d ? 'none' : '1px solid var(--hairline)',
          }}>{d}</button>
        ))}
      </div>
      <div style={{ display:'flex', paddingTop:1, gap:16, borderBottom:'1px solid var(--hairline)', margin:'0 14px 3px', overflowX:'auto', overflowY:'hidden', scrollbarWidth:'none' }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{
            position:'relative', padding:'0 0 11px', borderRadius:0, fontWeight:cat===c?800:700, fontSize:14,
            background:'transparent', flex:'0 0 auto',
            color: cat===c ? 'var(--text)' : 'var(--text-muted)',
            lineHeight:1.1
          }}>{CAT_LABEL[c]}
            {cat===c && <span style={{ position:'absolute', left:0, right:0, bottom:0, height:3, borderRadius:3, background:'var(--text)' }} />}
          </button>
        ))}
      </div>
      <div className="hscroll flash-hscroll" style={{ paddingTop:4, paddingBottom:8 }}>
        {items.map(it=> <FlashCard key={it.id} it={it} tier={props.tier} bus={bus} family={props.identity==='family'} />)}
      </div>
    </FloorShell>
  );
}

function FlashCard({ it, tier, bus, family }){
  const isSold = it.stock<=0;
  const coinAmt = (tier==='value' && !isSold) ? window.coinsFor(it.price) : 0;
  return (
    <div className="card flash-card" style={{ width:family?178:170, overflow:'hidden', position:'relative', boxShadow:'0 8px 18px rgba(26,24,33,.07)' }}>
      <Ph label={it.img} photo h={family?94:90} r={0} />

      <div style={{ padding:'7px 8px 8px' }}>
        <div style={{ fontSize:12.5, fontWeight:700, color:'var(--text)', lineHeight:1.32, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.title}</div>
        {coinAmt > 0 && (
          <div style={{ marginTop:5, display:'flex', alignItems:'center', gap:3, fontSize:10.5, color:'var(--text-muted)' }}>
            <span style={{ width:14, height:14, borderRadius:999, background:'#F4BE2A', color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, flexShrink:0 }}>T</span>
            <span>赚</span>
            <strong style={{ color:'var(--coin-color)' }}>{coinAmt}</strong>
            <span>豆</span>
          </div>
        )}
        {/* 价格+按钮：同行底部对齐，卡片已加宽不会重叠 */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:6, marginTop:5 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:2, minWidth:0 }}>
            <span style={{ fontSize:10.5, fontWeight:800, color:'var(--brand-strong)', background:'var(--brand-soft)', padding:'1px 5px', borderRadius:5, lineHeight:1.25 }}>{it.discount}</span>
            <div style={{ display:'flex', alignItems:'baseline', gap:2 }}>
              <span className="price" style={{ fontSize:17 }}><span className="cur">¥</span>{it.price}</span>
              <span className="price-origin">¥{it.origin}</span>
            </div>
          </div>
          <button className="btn flash-btn" disabled={isSold} onClick={()=>bus.toast(isSold?'该场次已售罄':`已加入「${it.title}」抢购`)} style={{ padding:'5px 14px', fontSize:12.5, opacity:isSold?.48:1, boxShadow:'none', border:'1px solid rgba(255,255,255,.18)', filter:'none', flexShrink:0 }}>{isSold?'已售罄':'立即抢'}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 5.2c Trip Coins 返赠 ---------------- */
/* 金色「T」Trip Coins token —— 与 feeds 商品卡同源的视觉 */
function CoinToken({ size=20 }){
  return (
    <span style={{ width:size, height:size, borderRadius:999, flexShrink:0,
      background:'radial-gradient(circle at 32% 28%, #FFE08A 0%, #F4BE2A 52%, #E0A412 100%)',
      color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center',
      fontSize:size*0.56, fontWeight:900, fontFamily:'Georgia, serif',
      boxShadow:'inset 0 1px 1px rgba(255,255,255,.6), 0 1px 3px rgba(176,120,12,.4)' }}>T</span>
  );
}

/* 还原参考图的三步图标：点按手势 / 酒店建筑 / 金币 */
function StepTap(){
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <g stroke="var(--brand)" strokeWidth="1.3" strokeLinecap="round" opacity=".6">
        <path d="M5.4 6 4.4 5M11 4.5V3.2M16.6 6l1-1" />
      </g>
      <path fill="var(--brand)" d="M10 13.1V9.1a1.35 1.35 0 0 1 2.7 0v3.05l1.85.36c1.4.27 2.35 1.16 2.35 2.62v2.3c0 1.2-.9 2.07-2.2 2.07h-3.25c-.9 0-1.55-.36-2.08-1.1l-2.4-3.35c-.42-.58-.28-1.32.33-1.68.5-.3 1.13-.2 1.57.24l1.1 1.1Z" />
    </svg>
  );
}
/* 层叠金币 + 闪光，对齐参考图 */
function CoinStack({ size=30 }){
  const id = 'tcg-'+size;
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <defs>
        <radialGradient id={id} cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFE89A" />
          <stop offset="55%" stopColor="#F4BE2A" />
          <stop offset="100%" stopColor="#E0A412" />
        </radialGradient>
      </defs>
      <circle cx="20.5" cy="16.5" r="8" fill="#E8A91B" />
      <circle cx="20.5" cy="16.5" r="8" fill="#fff" opacity=".12" />
      <circle cx="12.8" cy="17" r="9" fill={`url(#${id})`} />
      <text x="12.8" y="20.9" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="900" fontSize="11.5" fill="#fff">T</text>
      <path d="M6 1.4c.35 3 .55 3.2 3.4 3.55C6.55 5.3 6.35 5.5 6 8.5c-.35-3-.55-3.2-3.4-3.55C5.45 4.6 5.65 4.4 6 1.4Z" fill="#FFDA66" />
    </svg>
  );
}
function StepHotel(){
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path fill="var(--brand)" d="M4.5 21V6.2l7.5-3.4 7.5 3.4V21h-4.3v-4.1H8.8V21z" />
      <g fill="#fff" opacity=".92">
        <rect x="7.6" y="8.2" width="2.2" height="2.2" rx=".5" />
        <rect x="14.2" y="8.2" width="2.2" height="2.2" rx=".5" />
        <rect x="7.6" y="12" width="2.2" height="2.2" rx=".5" />
        <rect x="14.2" y="12" width="2.2" height="2.2" rx=".5" />
      </g>
    </svg>
  );
}

function RebateStep({ node, gold, bare, label, last }){
  return (
    <div style={{ display:'flex', alignItems:'flex-start', flex:1, minWidth:0 }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flex:1, minWidth:0 }}>
        <span style={{ width:34, height:34, borderRadius:999,
          background: bare ? 'transparent' : (gold ? 'rgba(244,190,42,.16)' : 'var(--brand-soft)'),
          display:'inline-flex', alignItems:'center', justifyContent:'center' }}>
          {node}
        </span>
        <span style={{ fontSize:11, lineHeight:1.3, color:'var(--text-muted)', textAlign:'center' }}>{label}</span>
      </div>
      {!last && (
        <span style={{ flex:'0 0 auto', marginTop:10 }}>
          <Icon name="chevR" size={14} color="var(--brand)" stroke={2.4} style={{ opacity:.55 }} />
        </span>
      )}
    </div>
  );
}

function CoinsRebate({ props, bus }){
  const [joined, setJoined] = useState(false);
  const join = ()=>{
    if(joined){ bus.toast('已参与活动 · 去完成酒店预订吧'); return; }
    setJoined(true);
    bus.toast('参与成功！活动期内完成预订，行程结束即返 Trip Coins');
  };
  return (
    <FloorShell
      title={<span style={{ display:'flex', alignItems:'center', gap:6 }}><Icon name="coinT" size={15} color="var(--brand)" />Trip Coins 返赠</span>}
      dot={false}
      more="规则"
    >
      <div style={{ padding:'0 14px' }}>
        <div className="card" style={{ borderRadius:16, overflow:'hidden', position:'relative',
          boxShadow:'0 8px 18px rgba(26,24,33,.07)', border:'1px solid var(--hairline)' }}>

          {/* 活动期条带 */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            padding:'6px 12px', background:'var(--brand-soft)', color:'var(--brand-strong)',
            fontSize:12, fontWeight:700, letterSpacing:.2 }}>
            <Icon name="clock" size={12} color="var(--brand-strong)" stroke={2.2} />
            活动期 6月1日 00:00 – 6月30日 23:59
          </div>

          <div style={{ padding:'12px 14px 13px', position:'relative' }}>
            {/* 标题行 */}
            <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
              <span style={{ width:20, height:20, borderRadius:6, background:'var(--brand-soft)',
                display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name="bed" size={12} color="var(--brand)" stroke={2.2} />
              </span>
              <span style={{ fontSize:13.5, fontWeight:800, color:'var(--text)' }}>酒店预订</span>
              <span style={{ width:1, height:12, background:'var(--hairline)' }} />
              <span style={{ fontSize:13.5, fontWeight:900, color:'var(--brand-strong)' }}>最高 7%</span>
              <span style={{ fontSize:12.5, fontWeight:700, color:'var(--text)' }}>Trip Coins 返赠</span>
            </div>

            {/* 描述 + 详情（与标题文字左对齐，详情靠右） */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:3 }}>
              <p style={{ margin:'0 0 0 27px', fontSize:12, lineHeight:1.45, color:'var(--text-muted)', flex:1, textWrap:'pretty' }}>
                完成订单行程后即可领取，每位用户最高可返 <strong style={{ color:'var(--text)' }}>100 Trip Coins</strong>（1 Trip Coin = $1，约 ¥720）。
              </p>
              <button onClick={()=>bus.toast('查看活动详情：完成行程后 7 天内自动到账 Trip Coins')}
                style={{ flexShrink:0, fontSize:11, fontWeight:700, color:'var(--text-muted)', background:'none',
                  display:'inline-flex', alignItems:'center', gap:1 }}>
                详情 <Icon name="chevR" size={11} color="var(--text-muted)" />
              </button>
            </div>

            {/* 下单前提示气泡 */}
            {!joined && (
              <div style={{ display:'flex', justifyContent:'center', marginTop:12, marginBottom:-3 }}>
                <span style={{ position:'relative', background:'#FFF1CC', color:'#9A7414', fontSize:12,
                  fontWeight:800, padding:'5px 12px', borderRadius:999, border:'1px solid #FBE3A6' }}>
                  下单前先点这里领取资格
                  <span style={{ position:'absolute', left:'50%', bottom:-4.5, width:8, height:8, background:'#FFF1CC',
                    borderRight:'1px solid #FBE3A6', borderBottom:'1px solid #FBE3A6',
                    transform:'translateX(-50%) rotate(45deg)' }} />
                </span>
              </div>
            )}

            {/* 主 CTA */}
            <button className="btn btn-block rebate-cta" onClick={join} style={{ marginTop:10, padding:'8px 16px',
              fontSize:14, fontWeight:800, borderRadius:12, opacity:joined?.92:1,
              display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              {joined && <Icon name="check" size={14} color="#fff" stroke={2.6} />}
              {joined ? '已参与 · 去预订' : '立即参与'}
            </button>

            {/* 三步流程 —— 还原参考图 */}
            <div style={{ display:'flex', alignItems:'flex-start', marginTop:13 }}>
              <RebateStep node={<StepTap />}   label={<>点击「立即参与」</>} />
              <RebateStep node={<StepHotel />} label={<>活动期内<br/>完成预订</>} />
              <RebateStep node={<CoinStack size={24} />} gold label={<>行程结束<br/>领Trip Coins</>} last />
            </div>
          </div>
        </div>

        {/* 我的 Trip Coins 入口（左） + 条款（右）—— 弱化、与页面协调 */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
          <button onClick={()=>bus.toast('我的 Trip Coins：当前余额 186（1 Trip Coin = $1）')}
            style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'7px 14px', borderRadius:999,
              background:'var(--brand-soft)', color:'var(--brand-strong)', fontSize:11, fontWeight:700 }}>
            查看我的 Trip Coins <Icon name="chevR" size={11} color="var(--brand-strong)" />
          </button>
          <button onClick={()=>bus.toast('活动条款与细则')} style={{ display:'inline-flex', alignItems:'center', gap:2,
            fontSize:11, fontWeight:600, color:'var(--text-muted)', background:'none' }}>
            活动条款 <Icon name="chevR" size={11} color="var(--text-muted)" />
          </button>
        </div>

        {/* 说明 */}
        <p style={{ margin:'1px 2px 0', fontSize:11, lineHeight:1.5, color:'var(--text-muted)', textAlign:'center', textWrap:'pretty' }}>
          * Trip Coins 返赠不适用于「机票+酒店」打包产品及到店付订单。
        </p>
      </div>
    </FloorShell>
  );
}

/* ---------------- 5.2b 亲子秒杀列表卡 ---------------- */
/* ---------------- 5.2b 亲子秒杀列表卡已合并为横滑 FlashCard ---------------- */

/* ---------------- 5.3 Feeds 流 ---------------- */
const LINE_LABEL = { rec:'推荐', hotel:'酒店', flight:'机票', ticket:'门票', play:'玩乐', vacation:'度假' };
const LINE_SUB = {
  rec:['为你推荐','附近热门'],
  hotel:['目的地','入住日期','价格带','星级','商圈'],
  flight:['出发城市','到达城市','出发日期','舱等','直飞'],
  ticket:['城市','品类','日期'],
  play:['城市','主题','时长'],
  vacation:['目的地','天数','预算'],
};

// 目的地推荐理由：结合当前选中目的地 + 用户身份，创写 2-3 句话
function feedsDestReco(city, identity){
  const db = window.DATA.destDB && window.DATA.destDB[city];
  const base = db ? (identity==='family' ? (db.reasonFamily || db.reason) : db.reason) : '';
  const intro = {
    family: `带娃来${city}，省心又出片。`,
    solo:   `一个人的${city}，自在随心、说走就走。`,
    biz:    `${city}差旅，节奏高效又不将就。`,
    event:  `为一场演出奔赴${city}，顺道把城市也玩一遍。`,
  }[identity] || `关于${city}，这些理由值得一去。`;
  return intro + (base ? ' ' + base : '');
}

/* ---------- Feeds 业务线筛选条：每条业务线提供不同筛选项 ---------- */
function FeedFilterChip({ children, active, onClick, caret=true }){
  return (
    <button onClick={onClick} style={{
      flex:'0 0 auto', display:'flex', alignItems:'center', gap:3,
      padding:'5px 10px', borderRadius:8, fontSize:12, whiteSpace:'nowrap',
      border:'1px solid '+(active?'var(--brand)':'var(--hairline)'),
      background: active ? 'color-mix(in srgb,var(--brand-soft) 86%, #fff 14%)' : 'var(--surface)',
      color: active ? 'var(--brand-strong)' : 'var(--text)', fontWeight: active?700:600,
    }}>
      {children}{caret && <Icon name="chevD" size={10} color={active?'var(--brand)':'var(--text-muted)'} />}
    </button>
  );
}
function FeedStaticTag({ children }){
  return (
    <span style={{
      flex:'0 0 auto', display:'flex', alignItems:'center', gap:3,
      padding:'5px 11px', borderRadius:999, fontSize:12, fontWeight:700, whiteSpace:'nowrap',
      border:'1px solid var(--hairline)', background:'var(--surface)', color:'var(--text-muted)',
    }}>
      {children}
    </span>
  );
}
function HotelOccupancyPill({ family, onClick }){
  const seg = { display:'flex', alignItems:'center', gap:2.5 };
  return (
    <button onClick={onClick} style={{
      flex:'0 0 auto', display:'flex', alignItems:'center', gap:9, padding:'5px 11px', borderRadius:10,
      border:'1px solid var(--hairline)', background:'var(--surface)', fontSize:12.5, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap',
    }}>
      <span style={{ display:'flex', alignItems:'center', gap:5 }}>
        <Icon name="cal" size={13} color="var(--brand)" />6月4日 - 6月5日
        <Icon name="chevD" size={10} color="var(--text-muted)" />
      </span>
      <span style={{ width:1, height:14, background:'var(--hairline)' }} />
      <span style={{ display:'flex', alignItems:'center', gap:8, color:'var(--text-muted)' }}>
        <span style={seg}><Icon name="bed" size={13} color="var(--text-muted)" />1</span>
        <span style={seg}><Icon name="user" size={13} color="var(--text-muted)" />1</span>
        {family && <span style={seg}><Icon name="child" size={13} color="var(--text-muted)" />2</span>}
      </span>
    </button>
  );
}
function FeedFilters({ line, activeCity, family, trip, cabin, onTrip, onCabin, bus }){
  const departCity = window.defaultDepartCity ? window.defaultDepartCity(activeCity) : '上海';
  const tap = (l)=> bus && bus.toast && bus.toast(`筛选：${l}`);
  const cycleTrip = ()=> onTrip && onTrip(trip==='往返'?'单程':'往返');
  const cycleCabin = ()=> onCabin && onCabin(cabin==='经济舱'?'商务舱':cabin==='商务舱'?'头等舱':'经济舱');

  let content;
  if(line === 'hotel'){
    content = (<>
      <HotelOccupancyPill family={family} onClick={()=>tap('入住/离店 · 房间与人数')} />
      <FeedFilterChip onClick={()=>tap('位置')}>位置</FeedFilterChip>
      <FeedFilterChip onClick={()=>tap('星级')}>星级</FeedFilterChip>
      <FeedFilterChip onClick={()=>tap('评分')}>评分</FeedFilterChip>
      <FeedStaticTag>免费取消</FeedStaticTag>
    </>);
  } else if(line === 'flight'){
    content = (<>
      <FeedFilterChip onClick={()=>tap('出发城市')}>出发：{departCity}</FeedFilterChip>
      <FeedFilterChip onClick={()=>tap('到达城市')}>到达：{activeCity}</FeedFilterChip>
      <FeedFilterChip onClick={()=>tap('飞行日期')}>飞行日期</FeedFilterChip>
      <FeedFilterChip onClick={cycleTrip}>{trip}</FeedFilterChip>
      <FeedFilterChip onClick={cycleCabin}>{cabin}</FeedFilterChip>
      {window.hasDirectFlight(activeCity) && <FeedStaticTag>直飞</FeedStaticTag>}
    </>);
  } else { // ticket / play
    content = (<>
      <FeedFilterChip onClick={()=>tap('主题')}>主题</FeedFilterChip>
      <FeedFilterChip onClick={()=>tap('评分')}>评分</FeedFilterChip>
      <FeedStaticTag>免费取消</FeedStaticTag>
    </>);
  }
  return (
    <div className="hscroll" {...(line==='flight' && cabin!=='经济舱' ? { 'data-tier':'premium' } : {})}
      style={{ gap:6, paddingTop:6, paddingBottom:5,
        ...(line==='flight' && cabin!=='经济舱'
          ? { background:'radial-gradient(120% 130% at 50% 130%, color-mix(in srgb, var(--brand-light) 28%, transparent), transparent 60%), var(--bg)', borderTop:'1px solid var(--hairline)' }
          : {}) }}>
      {content}
    </div>
  );
}

/* ---------- 机票航司徽标（占位 monogram，非真实 logo） ---------- */
function AirlineBadge({ al, size=18 }){
  return (
    <span style={{ flexShrink:0, width:size, height:size, borderRadius:5, background:al.color, color:'#fff',
      display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:size*0.5, fontWeight:800, letterSpacing:'-.5px' }}>
      {al.code}
    </span>
  );
}

/* ---------- 机票时段卡片（颜色全部走 CSS 变量；商务/头等时外层切 data-tier=premium 自动套高端皮肤） ---------- */
const FLIGHT_DEP_DATE = '2026-06-04', FLIGHT_RET_DATE = '2026-06-07';
function FlightTimeCard({ dep, dest, trip, cabin, c, bus }){
  const round = trip === '往返';
  const depDT = `${FLIGHT_DEP_DATE} ${c.depart}`;
  const retDT = `${FLIGHT_RET_DATE} ${c.ret}`;
  return (
    <div className="card" style={{ padding:'10px 12px', cursor:'pointer' }}
      onClick={()=>bus.toast(`查看「${c.airline.name} ${dep}${round?'⇄':'→'}${dest}」`)}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:8 }}>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ fontSize:15, fontWeight:800, color:'var(--text)' }}>{dep} {round?'⇄':'→'} {dest}</div>
          {round ? (
            <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{trip} · 去 {depDT} · 返 {retDT}</div>
          ) : (
            <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:3, whiteSpace:'nowrap' }}>{trip} · {depDT} 起飞</div>
          )}
          {/* 两个差异化标签：放在 单程/往返 下方 */}
          <div style={{ display:'flex', gap:5, marginTop:6, flexWrap:'wrap' }}>
            {(c.tags||[]).map((t,i)=> <span key={i} className="tag" style={{ fontSize:10.5, padding:'2px 7px', borderRadius:6 }}>{t}</span>)}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:7 }}>
            <AirlineBadge al={c.airline} />
            <span style={{ fontSize:12.5, color:'var(--text)', fontWeight:600 }}>{c.airline.name}</span>
            <span style={{ fontSize:11.5, color:'var(--brand-strong)', fontWeight:700 }}>· {cabin}</span>
          </div>
        </div>
        <span style={{ flexShrink:0 }}>
          <PriceBlock price={c.price} seed={c.airline.name + dest + c.depart} rate={0.63} size={17} side="right" />
        </span>
      </div>
    </div>
  );
}

const FLIGHT_PERIOD_ICON = { morning:'spark', afternoon:'compass', evening:'bolt', dawn:'clock' };
function FlightPeriods({ dep, dest, trip, cabin, identity, bus }){
  const periods = window.buildFlightPeriods ? window.buildFlightPeriods(dep, dest, trip, cabin, identity) : [];
  const lux = cabin !== '经济舱';
  // 商务/头等：整段切到「高端模式」皮肤（data-tier=premium 让子树复用高端 CSS 变量），满铺填满两侧
  const wrapProps = lux ? { 'data-tier':'premium' } : {};
  const wrapStyle = lux
    ? { padding:'12px 14px 16px 16px', margin:'0 0 2px', borderRadius:0, display:'flex', flexDirection:'column', gap:16,
        background:'radial-gradient(120% 56% at 50% -8%, color-mix(in srgb, var(--brand-light) 30%, transparent), transparent 62%), var(--bg)',
        borderBottom:'1px solid var(--hairline)' }
    : { padding:'4px 14px 2px 16px', display:'flex', flexDirection:'column', gap:16 };
  const reasonBox = { padding:'8px 11px', borderRadius:'var(--radius)', background:'var(--brand-soft)', border:'1px solid color-mix(in srgb,var(--brand) 14%, transparent)', marginBottom:8 };
  return (
    <div {...wrapProps} style={wrapStyle}>
      {lux && (
        <div style={{ display:'flex', alignItems:'center', gap:7, paddingBottom:2 }}>
          <span style={{ fontSize:13.5, fontWeight:800, color:'var(--brand-strong)', letterSpacing:'.3px' }}>{cabin} · 臻选直飞</span>
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>宽适座椅 · 贵宾礼遇</span>
        </div>
      )}
      {periods.map(p=>(
        <div key={p.key}>
          <div style={{ display:'flex', alignItems:'baseline', gap:7, marginBottom:6 }}>
            <span style={{ fontSize:15, fontWeight:800, color:'var(--text)' }}>{p.label}</span>
            <span style={{ fontSize:11.5, color:'var(--text-muted)' }}>{p.range}</span>
          </div>
          <div style={reasonBox}>
            {p.reasons.map((r,i)=>(
              <div key={i} style={{ display:'flex', gap:5, fontSize:12, lineHeight:1.5, color:'var(--text)', textWrap:'pretty' }}>
                <span style={{ color:'var(--brand)', flexShrink:0 }}>·</span>{r}
              </div>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {p.cards.map((c,i)=> <FlightTimeCard key={i} dep={dep} dest={dest} trip={trip} cabin={cabin} c={c} bus={bus} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Feeds({ props, bus, ctx }){
  const showDestGroup = !ctx || ctx.tab === 'explore';   // 仅「探索目的地」tab 展示目的地分组
  const lines = ['hotel','flight','ticket','play'];
  const DEST_LIST = ['三亚','厦门','成都','北京','上海','普吉','冲绳','东京','深圳','香港','澳门','北海道','马代','西双版纳','不丹'];
  const [line, setLine] = useState(lines[0]);
  const [destFilter, setDestFilter] = useState(DEST_LIST[0] || null);
  const [fav, setFav] = useState({});
  const [flightTrip, setFlightTrip] = useState('往返');
  const [flightCabin, setFlightCabin] = useState(props.tier==='premium' ? '头等舱' : '经济舱');
  useEffect(()=>{ setLine(lines[0]); setDestFilter(DEST_LIST[0] || null); }, [props.identity, props.tier, props.city]);
  useEffect(()=>{ setFlightTrip('往返'); setFlightCabin(props.tier==='premium' ? '头等舱' : '经济舱'); }, [line, props.identity, props.city, props.tier]);

  // 当前生效城市：探索 tab 用分组选择，城市 tab 用 ctx.city（与页面 tab 标题同源，默认冲绳）
  const activeCity = !showDestGroup ? ((ctx && ctx.city) || window.fallbackCity((ctx && ctx.identity) || props.identity)) : (destFilter || DEST_LIST[0]);

  // 商品卡片严格按 城市 + 业务线 生成，切换分组即刷新且一一对应
  let items = (window.buildFeedCards ? window.buildFeedCards(activeCity, line, props.tier) : []);
  if(props.tier==='premium') items = items.slice().sort((a,b)=> b.price-a.price);
  const display = items.map((f,i)=> ({ ...f, _k: activeCity+'|'+line+'|'+i }));

  /* ---------- Feeds 内插：滑动 3 下未点击 → 视觉中心插入「为你推荐」横滑卡 ---------- */
  const recoStrips = (window.buildRecoStrips ? window.buildRecoStrips(activeCity, line, props.tier) : []);
  const [inserts, setInserts] = useState([]);            // [{afterIndex, variant, id}]
  const gridRef = useRef(null);
  const groupBarRef = useRef(null);          // 业务线分组吸顶栏
  const destBarRef = useRef(null);           // 目的地分组吸顶栏
  const DEST_BAR_H = 40;                      // 目的地分组栏固定高度（常量，杜绝吸顶位置抖动）
  const destScrollRef = useRef(null);        // 目的地分组横滑容器
  const destBtnRefs = useRef({});            // 各目的地按钮
  const accumRef = useRef(0);     // 累计下滑距离（像素），稳健识别「滑动了几下」
  const clickedRef = useRef(false);
  const insertsRef = useRef([]);
  const shownRef = useRef({});                 // 已「弹入」过的中插 id（滚进视野即标记，避免重播/闪动）
  const [, bumpShown] = useState(0);
  const displayRef = useRef(display);
  displayRef.current = display;
  insertsRef.current = inserts;

  // 切换城市 / 业务线 → 重新计算中插位置：第 8 个商品卡片后开始，每隔 8 个插入一个
  useEffect(()=>{
    const last = displayRef.current.length - 1;
    const positions = [];
    for(let after = 5; after <= last && positions.length < 3; after += 8){ positions.push(after); }
    const ins = positions.map((afterIndex, i)=> ({
      afterIndex, variant: i % Math.max(1, recoStrips.length), id:'ins-'+activeCity+'-'+line+'-'+i,
    }));
    insertsRef.current = ins; setInserts(ins);
    accumRef.current = 0; clickedRef.current = false; shownRef.current = {};
  }, [activeCity, line]);

  function gridInView(sc){
    const g = gridRef.current; if(!g) return false;
    const gr = g.getBoundingClientRect(); const sr = sc.getBoundingClientRect();
    return gr.top < sr.bottom - 60 && gr.bottom > sr.top + 60;
  }

  // 点击目的地 / 业务线分组 → 回到「目的地分组栏」位置（标题滚出视野，分组栏吸顶到顶部）
  function scrollFeedsTop(){
    const ch = document.getElementById('channel');
    const mod = ch && ch.querySelector('[data-mod="feeds"]');
    const head = mod && mod.querySelector('.floor-head');
    if(!ch || !head) return;
    requestAnimationFrame(()=>{
      // floor-head（猜你喜欢标题）非吸顶，其底部即分组栏顶部；滚到这里=标题刚好滚出、分组栏到顶
      const target = ch.scrollTop + (head.getBoundingClientRect().bottom - ch.getBoundingClientRect().top);
      ch.scrollTo({ top: Math.max(0, target), behavior:'smooth' });
    });
  }

  // 点击目的地分组 → 把被点击的目的地横向滑到视觉中心
  function centerDest(d){
    const row = destScrollRef.current, node = destBtnRefs.current[d];
    if(!row || !node) return;
    requestAnimationFrame(()=>{
      const rRect = row.getBoundingClientRect(), nRect = node.getBoundingClientRect();
      const delta = (nRect.left - rRect.left) - (row.clientWidth - nRect.width)/2;
      row.scrollTo({ left: Math.max(0, row.scrollLeft + delta), behavior:'smooth' });
    });
  }

  // 滚进视野那一刻才给中插加 .reco-in 触发「弹入」动效（用页面自身的 scroll 监听，可靠且只播一次）
  // 经典折叠展开：显式从 0px 过渡到实际像素高度，结束后设回 auto —— 所有浏览器都平滑可见
  function expandInsert(el, dur){
    const full = el.scrollHeight || (el.firstChild && el.firstChild.scrollHeight) || 0;
    if(!full){ el.style.height = 'auto'; el.style.overflow = 'visible'; return; }
    const d = dur || 580;
    el.style.transition = 'none';
    el.style.height = '0px';
    el.style.overflow = 'hidden';
    void el.offsetHeight;                  // 提交 0 高度
    requestAnimationFrame(()=>{
      el.style.transition = 'height ' + d + 'ms cubic-bezier(.22,1,.36,1)';
      el.style.height = full + 'px';
      const done = (e)=>{
        if(e && e.propertyName && e.propertyName !== 'height') return;
        el.style.height = 'auto'; el.style.overflow = 'visible'; el.style.transition = '';
        el.removeEventListener('transitionend', done);
      };
      el.addEventListener('transitionend', done);
      setTimeout(done, d + 180);           // 兜底，防 transitionend 未触发
    });
  }

  function revealEntered(sc){
    const g = gridRef.current; if(!g) return;
    const scRect = sc.getBoundingClientRect();
    // 触发点设在屏幕中部：中插（此刻高度为 0 的细线）随滚动升到视野中央时才展开，
    // 这样展开发生在视线正中、把下方卡片推开，清晰可见，而不是在屏幕边缘一闪而过。
    const triggerY = scRect.top + scRect.height * 0.52;
    g.querySelectorAll('.reco-insert').forEach(el=>{
      const id = el.getAttribute('data-insid');
      if(!id || shownRef.current[id]) return;
      const r = el.getBoundingClientRect();
      if(r.top <= triggerY){   // 升到屏幕中部（或更高，兜底快速滚动）→ 展开
        shownRef.current[id] = true;
        expandInsert(el);
      }
    });
  }

  function doInsert(sc){ /* 已改为静态中插位置（第 8 个卡片后，每 8 个一个），保留空函数兼容旧调用 */ }

  // 中插「滚进视野即从 0 高度展开、把下方卡片顶开」——用 rAF 轮询位置触发，不依赖滚动事件，绝对可靠；全部展开后自停
  useEffect(()=>{
    const ch = document.getElementById('channel');
    const grid = gridRef.current;
    if(!ch || !grid) return;
    let raf = 0;
    function tick(){
      const cr = ch.getBoundingClientRect();
      let remaining = 0;
      grid.querySelectorAll('.reco-insert').forEach(el=>{
        if(el.dataset.expanded){ return; }
        const r = el.getBoundingClientRect();
        // 折叠的细线随滚动升到视野中部（约 62% 处）才展开，让「展开顶开卡片」的过程清晰可见
        if(r.top < cr.top + cr.height*0.62 && r.bottom > cr.top){
          el.dataset.expanded = '1';
          expandInsert(el);
        } else {
          remaining++;
        }
      });
      if(remaining > 0) raf = requestAnimationFrame(tick);
      else raf = 0;
    }
    raf = requestAnimationFrame(tick);
    return ()=>{ if(raf) cancelAnimationFrame(raf); };
  }, [activeCity, line, inserts.length]);

  // 「演示中插插入」：供场景控制台一键触发 —— 把第一条中插滚到视野中部，单独放慢展开
  useEffect(()=>{
    window.__omRecoDemo = function(){
      const sc = document.getElementById('channel');
      const g = gridRef.current;
      if(!sc || !g) return;
      const el = g.querySelector('.reco-insert');
      if(!el) return;
      el.dataset.expanded = '';
      el.style.height = '0px'; el.style.overflow = 'hidden';
      const target = sc.scrollTop + (el.getBoundingClientRect().top - sc.getBoundingClientRect().top) - sc.clientHeight*0.45;
      sc.scrollTo({ top: Math.max(0, target), behavior:'smooth' });
      setTimeout(()=>{ el.dataset.expanded = '1'; expandInsert(el, 720); }, 480);
    };
    return ()=>{ if(window.__omRecoDemo) try{ delete window.__omRecoDemo; }catch(e){ window.__omRecoDemo = null; } };
  }, [activeCity, line]);

  function removeInsert(id){
    const next = insertsRef.current.filter(x=> x.id !== id);
    insertsRef.current = next; setInserts(next);
  }

  function RecoStrip({ ins, anchor }){
    const strip = recoStrips[ins.variant] || recoStrips[0];
    if(!strip) return null;
    return (
      <div className="reco-insert" data-insid={ins.id} style={{ gridColumn:'1 / -1', margin:'2px 0 8px', minWidth:0, maxWidth:'100%' }}>
        <div className="reco-inner" style={{ borderRadius:18, position:'relative', overflow:'hidden',
          background:'linear-gradient(180deg, color-mix(in srgb,var(--brand-soft) 70%, #fff 30%), var(--surface) 82%)',
          border:'1px solid color-mix(in srgb,var(--brand) 30%, transparent)',
          boxShadow:'0 12px 28px color-mix(in srgb,var(--brand-strong) 14%, transparent), 0 2px 6px rgba(0,0,0,.04)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:9, padding:'11px 12px 8px 16px' }}>
          <span style={{ flexShrink:0, width:26, height:26, borderRadius:999, background:'var(--brand)',
            display:'flex', alignItems:'center', justifyContent:'center', marginTop:1,
            boxShadow:'0 3px 8px color-mix(in srgb,var(--brand) 36%, transparent)' }}>
            <Icon name={strip.icon || 'spark'} size={15} color="#fff" fill="#fff" />
          </span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3, flexWrap:'wrap' }}>
              <span style={{ fontSize:10.5, fontWeight:800, color:'var(--brand-strong)', background:'color-mix(in srgb,var(--brand-soft) 80%, #fff 20%)', padding:'1.5px 6px', borderRadius:6 }}>{strip.tag}</span>
              <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:10.5, fontWeight:600, color:'var(--text-muted)' }}>
                <span className="reco-live-dot" />{strip.live}
              </span>
            </div>
            <div style={{ fontSize:14, fontWeight:800, color:'var(--text)', lineHeight:1.32 }}>{strip.headline}</div>
          </div>
          <button aria-label="不感兴趣" onClick={(e)=>{ e.stopPropagation(); removeInsert(ins.id); }}
            style={{ flexShrink:0, width:24, height:24, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>
            <Icon name="close" size={14} color="var(--text-muted)" />
          </button>
        </div>
        <div className="hscroll reco-hscroll" style={{ gap:9, padding:'0 12px 12px 16px' }}>
          {strip.items.map((it, k)=>{
            const promoRateMap = { hotel:0.72, ticket:0.67, flight:0.63, play:0.69 };
            const rate = promoRateMap[it.line] || 0.72;
            const origin = Math.max(it.price + 20, Math.round((it.price / rate) / 10) * 10);
            const discountText = (it.price / origin * 10).toFixed(1) + '折';
            const h = (it.title||'').split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
            const score = (4.4 + (h % 6) / 10).toFixed(1);
            const sold = it.sold || ['月售'+(2+h%9)+'00+', '月售'+(1+h%5)+'k+', '月售'+(3+h%7)+'00+'][h%3];
            return (
              <div key={strip.id+'-'+k} onClick={()=> bus.toast(`查看推荐「${it.title}」`)}
                style={{ width:132, flex:'0 0 auto', background:'var(--surface)', borderRadius:13, overflow:'hidden', border:'1px solid var(--hairline)', boxShadow:'0 4px 12px rgba(0,0,0,.05)' }}>
                <Ph label={it.img} photo h={88} r={0} />
                <div style={{ padding:'7px 8px 9px' }}>
                  <div className="feed-title-2" style={{ fontSize:12, fontWeight:600, lineHeight:1.32, color:'var(--text)' }}>{it.title}</div>
                  {/* 评分 + 售卖数量 */}
                  <div style={{ display:'flex', alignItems:'baseline', gap:5, marginTop:5 }}>
                    <span style={{ display:'inline-flex', alignItems:'baseline', gap:2, fontSize:11.5, fontWeight:800, color:'var(--text)' }}>
                      {score}<span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)' }}>/ 5</span>
                    </span>
                    <span style={{ fontSize:10, color:'var(--text-muted)' }}>{sold}</span>
                  </div>
                  {/* 价格区：卡片右下角 —— 折扣在卖价上方，划线价在卖价左侧，底部对齐 */}
                  <div style={{ marginTop:6, display:'flex', justifyContent:'flex-end' }}>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:4 }}>
                      <span className="price-origin" style={{ fontSize:10, lineHeight:1.1 }}>¥{origin}</span>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
                        <span style={{ fontSize:10, fontWeight:800, color:'var(--brand-strong)', background:'var(--brand-soft)', padding:'1px 5px', borderRadius:5, lineHeight:1.2 }}>{discountText}</span>
                        <span className="price" style={{ fontSize:15, lineHeight:1 }}><span className="cur">¥</span>{it.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    );
  }

  function renderCard(f, i){
    const coinAmt = props.tier==='value' ? window.coinsFor(f.price) : 0;
    const promoRateMap = { hotel:0.72, ticket:0.67, flight:0.63, play:0.69, vacation:0.76 };
    const rate = promoRateMap[f.line] || 0.74;
    const origin = Math.max(f.price + 20, Math.round((f.price / rate) / 10) * 10);
    const discountText = (f.price / origin * 10).toFixed(1) + '折';

    // 机票卡片标题：仅保留「出发 → 到达」城市，去掉「含税往返」等后缀
    let displayTitle = f.title;
    if(f.line==='flight'){
      const m = f.title.match(/^\s*(\S+?)\s*[→\-]\s*(\S+?)(?:\s|$)/);
      if(m) displayTitle = m[1] + ' → ' + m[2];
    }

    // 榜单信息：仅在「酒店 / 门票」业务线分组下，每隔 2 张商卡出现一次（i%3===0）
    const h = (f.title||'').split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
    const showRanking = (line==='hotel' || line==='ticket') && (i % 3 === 0);
    const rankNamePool = line==='ticket'
      ? ['当地热门门票','亲子乐园人气','网红打卡','本周热销景点']
      : ['当地奢华酒店','亲子酒店人气','海景房好评','度假酒店热销'];
    const rankText = `${rankNamePool[h % rankNamePool.length]} 第${(h % 3) + 1}名`;

    // 设施 / 服务标签（无榜单信息时，在标签下补 2 个纯文字标签）
    const facilityPool = {
      hotel:['免费WiFi','含早餐','24h前台','行李寄存','健身房','室外泳池'],
      ticket:['电子票入园','随买随用','免预约','支持改期','中文服务','亲子设施'],
      flight:['含手提行李','可选座','机上餐食','准点率高','含托运额'],
      play:['中文向导','含保险','免预约','支持改期','即时确认'],
      vacation:['一价全包','专属管家','接送机','含三餐','私人沙滩'],
    };
    const facPool = facilityPool[f.line] || ['品质保障','放心预订','极速退款'];
    const facTags = [facPool[h % facPool.length], facPool[(h + 2) % facPool.length]];

    return (
      <div key={f._k} data-feedcard={i} className="card" style={{ display:'flex', alignItems:'stretch', overflow:'hidden' }}
        onClick={()=>{ clickedRef.current = true; bus.toast(`查看「${f.title}」`); }}>
        <div style={{ position:'relative', flex:'0 0 118px', alignSelf:'stretch', minHeight:92, overflow:'hidden', borderRadius:11 }}>
          <Ph label={f.img} photo r={11} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
            <button className={`fav-btn ${fav[f._k] ? 'is-fav' : ''}`} aria-label={fav[f._k]?'取消收藏':'收藏商品'}
              onClick={(e)=>{
                e.stopPropagation();
                setFav(s=>({ ...s, [f._k]: !s[f._k] }));
                bus.toast(`${fav[f._k]?'已取消收藏':'已收藏'}「${f.title}」`);
              }}
              style={{ position:'absolute', right:6, top:6, width:27, height:27, borderRadius:999,
                background:'rgba(255,255,255,.88)', display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 4px 12px rgba(0,0,0,.12)', fontSize:16, color:fav[f._k]?'#E24A6A':'rgba(25,25,25,.62)',
                border:'1px solid rgba(255,255,255,.58)', backdropFilter:'blur(7px)', zIndex:2 }}>
              <span style={{ display:'block', lineHeight:1, transform:fav[f._k]?'scale(1.10)':'scale(1)', transition:'transform .18s cubic-bezier(.2,1,.3,1)' }}>{fav[f._k]?'♥':'♡'}</span>
            </button>
          </Ph>
        </div>
        <div style={{ flex:1, minWidth:0, padding:'9px 11px 9px 11px', display:'flex', flexDirection:'column' }}>
          <div className="feed-title-2" style={{ fontSize:14, fontWeight:600, lineHeight:1.34, color:'var(--text)' }}>{displayTitle}</div>
          {f.line==='flight' && f.depart && (
            <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:3 }}>{f.depart}</div>
          )}

          {/* 评分（4.5 / 5）+ 月售量 */}
          <div style={{ display:'flex', alignItems:'baseline', gap:7, marginTop:4 }}>
            <span style={{ display:'inline-flex', alignItems:'baseline', gap:3, fontSize:13.5, fontWeight:800, color:'var(--text)' }}>
              {Number(f.score).toFixed(1)}<span style={{ fontSize:11.5, fontWeight:600, color:'var(--text-muted)' }}>/ 5</span>
            </span>
            <span style={{ fontSize:11.5, color:'var(--text-muted)' }}>{f.sold}</span>
          </div>

          {/* 榜单信息（评分下面，酒店/门票分组每隔 2 张出现一次）—— 纯文字、质感哑光金 */}
          {showRanking && (
            <div style={{ marginTop:4, fontSize:11.5, fontWeight:700, color:'#A8862F', letterSpacing:'.2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{rankText}</div>
          )}

          {/* 标签（放在评分下面） */}
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:4, maxHeight:18, overflow:'hidden' }}>
            {f.tags.map(t=> <span key={t} className="tag">{t}</span>)}
          </div>

          {/* 无榜单信息时：在标签下补 2 个纯文字设施 / 服务标签（无小圆点） */}
          {!showRanking && (
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:4, maxHeight:16, overflow:'hidden' }}>
              {facTags.map((t,fi)=>(
                <span key={fi} style={{ fontSize:11, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{t}</span>
              ))}
            </div>
          )}

          {/* 价格区：卡片右下角 —— 折扣在卖价上方，划线价在卖价左侧，赚豆在卖价下方右对齐 */}
          <div style={{ marginTop:'auto', paddingTop:4, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
            <div style={{ display:'flex', alignItems:'flex-end', gap:5 }}>
              <span className="price-origin" style={{ lineHeight:1.1 }}>¥{origin}</span>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
                <span style={{ fontSize:11, fontWeight:800, color:'var(--brand-strong)', background:'var(--brand-soft)', padding:'1.5px 6px', borderRadius:5, lineHeight:1.2 }}>{discountText}</span>
                <span className="price" style={{ fontSize:19, lineHeight:1 }}><span className="cur">¥</span>{f.price}</span>
              </div>
            </div>
            {coinAmt > 0 && (
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                <span style={{ width:13, height:13, borderRadius:999, background:'#F4BE2A', color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9.5, fontWeight:900, flexShrink:0 }}>T</span>
                <span>赚取</span>
                <strong style={{ color:'var(--coin-color)' }}>{coinAmt}</strong>
                <span>Trip Coins</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const recoByAfter = {};
  inserts.forEach(ins=>{ (recoByAfter[ins.afterIndex] = recoByAfter[ins.afterIndex] || []).push(ins); });

  return (
    <FloorShell title={<span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="heart" size={15} color="var(--brand)" fill="var(--brand-soft)" />猜你喜欢</span>} dot={false}>
      {/* 目的地分组（吸顶 top:0，固定高度避免吸顶位置抖动；行内 flex 居中，使分组与右侧 🔍 水平对齐） */}
      {showDestGroup && (
        <div ref={destBarRef} style={{ position:'sticky', top:0, zIndex:17, background:'var(--bg)', height:DEST_BAR_H, boxSizing:'border-box' }}>
          <div style={{ position:'relative', height:'100%', display:'flex', alignItems:'center' }}>
            <div ref={destScrollRef} className="hscroll" style={{ gap:6, paddingTop:0, paddingBottom:0, marginBottom:0, paddingRight:58, flex:1, minWidth:0, alignItems:'center' }}>
            {DEST_LIST.map(d=>(
              <button key={d} ref={el=> (destBtnRefs.current[d]=el)} onClick={()=>{ setDestFilter(d); centerDest(d); scrollFeedsTop(); }} style={{
                padding:'5px 12px', borderRadius:999, fontSize:12.5,
                fontWeight: destFilter===d ? 800 : 650,
                background: destFilter===d ? 'var(--brand)' : 'var(--surface-2)',
                color: destFilter===d ? '#fff' : 'var(--text-muted)',
                border: destFilter===d ? '1px solid var(--brand)' : '1px solid var(--hairline)',
                boxShadow: destFilter===d ? '0 3px 10px color-mix(in srgb,var(--brand) 38%, transparent)' : 'none',
                transition:'background .18s, color .18s',
                display:'flex', alignItems:'center', gap:4
              }}>{destFilter===d && <span style={{ fontSize:12 }}>📍</span>}{d}</button>
            ))}
            </div>
            <div style={{ position:'absolute', right:0, top:0, bottom:0, width:58, background:'linear-gradient(90deg,transparent,var(--bg) 38%)', pointerEvents:'none' }} />
            <button onClick={()=>bus.openCityPicker&&bus.openCityPicker()} style={{
              position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', width:32, height:28, borderRadius:999, fontSize:15,
              background:'var(--surface)', border:'1px solid var(--hairline)', boxShadow:'0 3px 10px rgba(0,0,0,.06)',
              display:'flex', alignItems:'center', justifyContent:'center', zIndex:2,
            }}>🔍</button>
          </div>
        </div>
      )}

      {/* 目的地亮点：位于目的地分组下方、业务线分组上方；不吸顶（吸顶时滚到目的地分组背后） */}
      {showDestGroup && destFilter && (
        <div style={{ margin:'8px 14px 4px', padding:'8px 11px', borderRadius:'var(--radius)', background:'var(--brand-soft)', border:'1px solid color-mix(in srgb,var(--brand) 12%, transparent)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
            <Icon name="spark" size={13} color="var(--brand)" fill="var(--brand)" />
            <span style={{ fontSize:13, fontWeight:800, color:'var(--brand-strong)' }}>目的地亮点</span>
          </div>
          <div style={{ fontSize:12.5, lineHeight:1.6, color:'var(--text)', textWrap:'pretty', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{feedsDestReco(destFilter, (ctx && ctx.identity) || props.identity)}</div>
        </div>
      )}

      {/* 业务线分组：吸顶于目的地分组正下方（两组一起吸顶，理由滚到背后）
          top 取 destBarH-1：与上方目的地分组栏重叠 1px（本栏 z 更低、被其遮住），
          彻底消除两栏接缝处的 1px 透出 / 滚动抖动 */}
      <div ref={groupBarRef} style={{ position:'sticky', top: showDestGroup ? (DEST_BAR_H - 1) : 0, zIndex:16, background: props.tier==='premium' ? 'color-mix(in srgb, var(--bg) 90%, #fff 10%)' : 'var(--bg)', padding:'5px 0 0' }}>
        <div style={{ margin:'0 14px', display:'flex', gap:18, overflowX:'auto', overflowY:'hidden', scrollbarWidth:'none', borderBottom:'1px solid var(--hairline)', padding:'0 2px' }}>
          {lines.map(l=>(
            <button key={l} onClick={()=>{ setLine(l); scrollFeedsTop(); }} style={{
              position:'relative', padding:'0 0 8px', borderRadius:0, fontSize:13.8, fontWeight:line===l?800:700,
              background:'transparent',
              color: line===l?'var(--text)':'var(--text-muted)',
              flex:'0 0 auto'
            }}>{LINE_LABEL[l]}
              {line===l && <span style={{ position:'absolute', left:0, right:0, bottom:0, height:3, borderRadius:3, background:'var(--brand)' }} />}
            </button>
          ))}
        </div>
      </div>

      <FeedFilters line={line} activeCity={activeCity} family={(ctx && ctx.identity)==='family' || props.identity==='family'}
        trip={flightTrip} cabin={flightCabin} onTrip={setFlightTrip} onCabin={setFlightCabin} bus={bus} />

      {line==='flight' ? (
        <FlightPeriods dep={window.defaultDepartCity(activeCity)} dest={activeCity} trip={flightTrip} cabin={flightCabin} identity={(ctx && ctx.identity) || props.identity} bus={bus} />
      ) : (
      <div ref={gridRef} style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr)', gap:10, padding:'4px 14px 2px' }}>
        {display.map((f, i)=>(
          <React.Fragment key={f._k}>
            {renderCard(f, i)}
            {ctx && ctx.agFeed && i===Math.min(2, display.length-1) && ctx.agFeed}
            {recoByAfter[i] && recoByAfter[i].map(ins=> <RecoStrip key={ins.id} ins={ins} anchor={f} />)}
          </React.Fragment>
        ))}
      </div>
      )}
      <div style={{ textAlign:'center', padding:'14px 12px 8px', fontSize:11.5, color:'var(--text-muted)' }}>—— 已为你精选 {activeCity} 的{LINE_LABEL[line]}好物 ——</div>
    </FloorShell>
  );
}

Object.assign(window, { Coupon, FlashSale, CoinsRebate, Feeds });
