/* ============================================================
   OTA Demo — 模块 C
   DestRec：单目的地推荐（探索目的地 tab）
   SceneGuide：目的地灵感（主题 → 目的地分组 → 复用单目的地推荐详情）
   DestDetail：选中目的地后的共享详情（推荐理由 + 4 个上图下文横滑模块）
   ============================================================ */
const { useState, useRef } = React;

const DEST_SECTIONS = [
  { key:'spots',  title:'必访景点',     icon:'pin'   },
  { key:'stays',  title:'热门住宿区域', icon:'bed'   },
  { key:'foods',  title:'人气美食',     icon:'heart' },
  { key:'guides', title:'旅游攻略',     icon:'book'  },
];

// 主题封面：按主题语义匹配 4K 高清实拍图（随消费档自动切到尊贵图集）
const THEME_IMG_KW = {
  kids:'亲子海滩沙滩', parks:'迪士尼乐园城堡', nature:'雨林森林植物园', fun:'海岛度假村',
  food:'美食餐厅', culture:'故宫古城人文', business:'都市江景商务', luxury:'马代私岛无边泳池',
  snow:'雪山滑雪粉雪', show:'演唱会展演',
};
function themeCoverImg(key, kw){
  return window.IMG(THEME_IMG_KW[key] || kw || key, { tier: window.__tier, w: 1100 });
}
// 目的地详情分组配图：优先用数据里已策展的 img 关键词，并按分组补语义 hint，确保图文匹配
function destCatImg(key, seed){
  const s = String(seed || '');
  let q = s;
  if(key === 'stays' && !/酒店|度假|海景|江景|湾|岛|温泉|别墅|庄/.test(s)) q = s + ' 酒店';
  else if(key === 'foods' && !/面|饭|烤|锅|寿司|饺|包|鸡|鱼|汤|茶|蛋|甜|食|菜|挞|奶|粉|煎/.test(s)) q = s + ' 美食';
  else if(key === 'spots' && !/海|山|湖|岛|寺|庙|城|园|塔|乐园|馆|林|谷|滩|桥|宫|楼|街/.test(s)) q = s + ' 景点';
  return window.IMG(q, { tier: window.__tier, w: 900 });
}

// 找到可滚动的父容器（频道滚动区）
function destScrollerOf(el){
  let n = el ? el.parentElement : null;
  while(n){
    const oy = getComputedStyle(n).overflowY;
    if((oy==='auto'||oy==='scroll') && n.scrollHeight - n.clientHeight > 5) return n;
    n = n.parentElement;
  }
  return null;
}
// 横向把某卡片滑到视觉中心
function destCenterX(row, node){
  if(node && row){
    const target = node.offsetLeft - (row.clientWidth - node.clientWidth)/2;
    row.scrollTo({ left: Math.max(0, target), behavior:'smooth' });
  }
}

/* 补齐到 4 张卡（结合城市生成占位条目；池子扩充 + 按城市 hash 打散，避免各城雷同） */
function padSection(items, key, city){
  items = items ? items.slice() : [];
  const T = {
    spots: [
      {name:`${city}城市观景台`, tag:'打卡', r:'登高俯瞰城市天际线，日落尤其美'},
      {name:`${city}老城漫步区`, tag:'慢游', r:'街巷小店林立，适合悠闲压马路'},
      {name:`${city}滨水公园`, tag:'遛娃', r:'开阔草坪与步道，亲子放电好去处'},
      {name:`${city}人文博物馆`, tag:'研学', r:'室内场馆，雨天也能逛得尽兴'},
      {name:`${city}艺术街区`, tag:'拍照', r:'潮流涂鸦与小店，随手出片'},
      {name:`${city}地标观景塔`, tag:'夜景', r:'俯瞰全城灯火，夜景尤其惊艳'},
      {name:`${city}近郊绿道`, tag:'骑行', r:'沿途风景开阔，骑行慢游正好'},
      {name:`${city}夜游码头`, tag:'夜游', r:'登船夜游，两岸灯火尽收眼底'},
    ],
    foods: [
      {name:`${city}招牌小吃街`, tag:'必吃', r:'本地人气摊档集中，一站吃个够'},
      {name:`${city}特色海鲜`, tag:'尝鲜', r:'当日鲜货现做，肉质弹嫩'},
      {name:`${city}人气甜品`, tag:'孩子爱', r:'清爽消暑，逛累来一份续命'},
      {name:`${city}夜市大排档`, tag:'烟火气', r:'入夜更热闹，性价比拉满'},
      {name:`${city}老字号面馆`, tag:'本地', r:'街坊几十年的味道，一碗见真章'},
      {name:`${city}融合料理`, tag:'网红', r:'中西混搭新意足，出片又好吃'},
      {name:`${city}地道汤锅`, tag:'暖身', r:'慢炖好汤底，全家都合口'},
      {name:`${city}手作茶饮`, tag:'解腻', r:'现泡现做，逛累来一杯'},
    ],
    guides: [
      {title:`${city}经典3天路线`, meta:'热门攻略', r:'景点连线顺路不折返，照着走就行'},
      {title:`${city}亲子省力攻略`, meta:'高收藏', r:'母婴设施 + 错峰时段全标好'},
      {title:`${city}美食地图`, meta:'本地推荐', r:'按区域整理，边逛边吃不踩雷'},
      {title:`${city}交通住宿贴士`, meta:'实用', r:'机场到市区 + 选区指南一篇搞定'},
      {title:`${city}小众玩法清单`, meta:'收藏多', r:'避开人潮的隐藏玩法合集'},
      {title:`${city}周末2日速游`, meta:'省时', r:'时间紧也能玩出精华'},
      {title:`${city}雨天备选方案`, meta:'实用', r:'室内场馆与玩法一篇搞定'},
      {title:`${city}拍照机位合集`, meta:'出片', r:'热门机位与时段全标好'},
    ],
  };
  const pool = T[key] || [];
  let h=0; const s=String(city); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
  const start = pool.length ? (h % pool.length) : 0;
  let pi = 0;
  while(items.length < 4 && pi < pool.length){
    const cand = pool[(start + pi) % pool.length]; pi++;
    const idk = cand.name || cand.title;
    if(!items.some(x=> (x.name||x.title)===idk)) items.push(cand);
  }
  return items.slice(0, 4);
}

/* 住宿区域推荐理由：结合身份 + 主题 + 目的地 + 区域 */
function areaReason(city, area, identity, themeTitle){
  const who = { family:'亲子家庭', solo:'一个人', biz:'因公出差', event:'看演出的旅客' }[identity] || '旅客';
  const t = themeTitle ? `主打「${themeTitle}」` : '';
  return `${who}来${city}${t}，住${area.name}最合适——${area.r || '位置便利、配套成熟，去哪都顺路'}。`;
}

/* 住宿区域分组至少 2 个（不足时用通用区域补齐） */
function padAreas(stays, city){
  const base = (stays && stays.length) ? stays.slice() : [];
  const pool = [
    { name:'市中心',     tag:'便利',   r:'交通枢纽、配套成熟，去哪都顺路' },
    { name:'景区周边',   tag:'近景点', r:'抬脚就到核心景点，省去通勤奔波' },
    { name:'老城商圈',   tag:'好逛',   r:'美食小店云集，夜生活丰富热闹' },
    { name:'滨水度假区', tag:'度假感', r:'环境静谧、风景好，适合慢下来' },
    { name:'交通枢纽区', tag:'好出行', r:'车站机场可直达，赶行程最省心' },
    { name:'高人气住宿带', tag:'口碑好', r:'回头客集中，配套与服务都靠谱' },
  ];
  let h=0; const s=String(city); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
  let pi=0;
  while(base.length < 2 && pi < pool.length){
    const cand = pool[(h + pi) % pool.length]; pi++;
    if(!base.some(a=> a.name === cand.name)) base.push(cand);
  }
  return base;
}

/* ---------- 共享：选中目的地后的详情 ---------- */
function DestDetail({ dest, isFamily, identity, tier, themeTitle, themeReason, bus, showReason=true }){
  const [selArea, setSelArea] = useState(0);
  if(!dest) return null;
  const hotelPool = (window.buildFeedCards ? window.buildFeedCards(dest.city, 'hotel', tier) : []);
  return (
    <div className="floor-enter" style={{ padding:'0 14px', marginTop:10 }}>
      {/* 推荐理由（附近目的地卡片已展示理由时可隐藏） */}
      {showReason && (
      <div className="card" style={{ padding:12, background:'var(--brand-soft)', boxShadow:'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
          <Icon name="spark" size={14} color="var(--brand)" fill="var(--brand)" />
          <span style={{ fontSize:13.5, fontWeight:800, color:'var(--brand-strong)' }}>
            {isFamily ? `为什么${dest.city}适合你的家庭` : `为什么推荐${dest.city}`}
          </span>
        </div>
        <div style={{ fontSize:13, lineHeight:1.6, color:'var(--text)' }}>
          {themeReason ? themeReason : (isFamily ? (dest.reasonFamily || dest.reason) : dest.reason)}
        </div>
      </div>
      )}

      {/* 子模块 · 始终展开 */}
      <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:14 }}>
        {DEST_SECTIONS.map(s => {
          const SectionHead = (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 0 8px' }}>
              <span style={{ width:26, height:26, borderRadius:8, background:'var(--brand-soft)', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon name={s.icon} size={14} color="var(--brand)" />
              </span>
              <span style={{ flex:1, fontSize:14.5, fontWeight:800, color:'var(--text)' }}>{s.title}</span>
            </div>
          );

          /* 热门住宿区域：区域分组 tab → xx%旅客选择 + 理由 → 酒店商品卡横滑 */
          if(s.key === 'stays'){
            const areas = padAreas(dest.stays, dest.city);
            const ai = Math.min(selArea, areas.length - 1);
            const area = areas[ai];
            const h = (area.name + dest.city).split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
            const pct = 30 + (h % 23);
            // 切换区域分组 → 酒店卡片跟着切换：按区域名 hash 取不同的酒店窗口
            const off = hotelPool.length ? (h % hotelPool.length) : 0;
            const hotels = hotelPool.length ? hotelPool.slice(off).concat(hotelPool).slice(0, 4) : [];
            const HOTEL_REASON = ['步行可达地铁，去哪都顺','含双早，性价比高','亲子设施齐全，遛娃省心','近景区与商圈，吃住都方便','高层景观房，视野开阔','口碑好评，回头客多'];
            return (
              <div key={s.key}>
                {SectionHead}
                <div className="hscroll" style={{ margin:'0 -14px', padding:'1px 14px 9px', gap:7 }}>
                  {areas.map((a, idx)=>{
                    const on = idx === ai;
                    return (
                      <button key={idx} onClick={()=>setSelArea(idx)} style={{
                        flex:'0 0 auto', padding:'6px 13px', borderRadius:999, fontSize:13, fontWeight:on?800:600,
                        background:on?'var(--brand)':'var(--surface-2)', color:on?'var(--on-brand,#fff)':'var(--text-muted)',
                        border:on?'none':'1px solid var(--hairline)', transition:'all .15s ease', whiteSpace:'nowrap' }}>{a.name}</button>
                    );
                  })}
                </div>
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:800, color:'var(--brand-strong)', marginBottom:4 }}>
                    <Icon name="family" size={13} color="var(--brand)" />{pct}% 旅客选择住这里
                  </div>
                  <div style={{ fontSize:12.5, lineHeight:1.6, color:'var(--text-muted)', textWrap:'pretty' }}>
                    {areaReason(dest.city, area, identity, themeTitle)}
                  </div>
                </div>
                <div className="hscroll" style={{ margin:'0 -14px', padding:'1px 14px 3px', gap:10, alignItems:'stretch' }}>
                  {hotels.map((ht, hi)=>{
                    const hh = (ht.title + area.name).split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
                    const rc = 2200 + (hh * 53 % 46000);
                    const reviews = rc >= 10000 ? (rc/10000).toFixed(1)+'万条评价' : rc.toLocaleString()+'条评价';
                    const reason = HOTEL_REASON[hh % HOTEL_REASON.length];
                    return (
                      <div key={hi} className="card" onClick={()=>bus.toast(`查看「${ht.title}」`)} style={{ flex:'0 0 158px', width:158, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                        <Ph label={ht.img} photo h={92} r={0} />
                        <div style={{ padding:'7px 9px 9px', display:'flex', flexDirection:'column', flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', lineHeight:1.25, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ht.title}</div>
                          {/* 评分 + 评价数 */}
                          <div style={{ display:'flex', alignItems:'baseline', gap:5, marginTop:5 }}>
                            <span style={{ fontSize:12.5, fontWeight:800, color:'var(--text)' }}>{Number(ht.score).toFixed(1)}<span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)' }}> / 5</span></span>
                            <span style={{ fontSize:10.5, color:'var(--text-muted)' }}>{reviews}</span>
                          </div>
                          {/* 简短推荐理由（最多 2 行，超出打点） */}
                          <div style={{ fontSize:11, color:'var(--brand-strong)', fontWeight:600, marginTop:4, lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', textWrap:'pretty' }}>{reason}</div>
                          {/* 卖价 + 折扣整体置于卡片右下角；折扣标签与卖价居中对齐 */}
                          <div style={{ marginTop:'auto', paddingTop:6 }}>
                            <PriceBlock price={ht.price} seed={ht.title + area.name} rate={0.72} size={15} side="right" colAlign="center" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          /* 必访景点 / 人气美食 / 旅游攻略：补齐 4 张，收窄底部留白 */
          const items = padSection(dest[s.key], s.key, dest.city);

          /* 必访景点：名称 → 评分 + 评价数（并排）→ 右下角卖价「xxx起」，不展示划线价 */
          if(s.key === 'spots'){
            return (
              <div key={s.key}>
                {SectionHead}
                <div className="hscroll" style={{ margin:'0 -14px', padding:'1px 14px 3px', gap:10, alignItems:'stretch' }}>
                  {items.map((it, i) => {
                    const hh = (it.name || '').split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
                    const score = (4.3 + (hh % 7) / 10).toFixed(1);
                    const rc = 1600 + (hh * 37 % 42000);
                    const reviews = rc >= 10000 ? (rc/10000).toFixed(1)+'万条评价' : rc.toLocaleString()+'条评价';
                    const price = 40 + (hh * 17 % 360);
                    return (
                      <div key={i} className="card" onClick={()=>bus.toast(`查看「${it.name}」`)}
                        style={{ flex:'0 0 150px', width:150, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                        <Ph src={destCatImg('spots', it.img || it.name)} label={it.name} h={92} r={0} />
                        <div style={{ padding:'7px 9px 9px', display:'flex', flexDirection:'column', flex:1 }}>
                          <div style={{ fontSize:13.5, fontWeight:700, color:'var(--text)', lineHeight:1.25, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.name}</div>
                          {/* 评分 + 评价数 并排 */}
                          <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:5 }}>
                            <span style={{ fontSize:12.5, fontWeight:800, color:'var(--text)' }}>{score}<span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)' }}> / 5</span></span>
                            <span style={{ fontSize:10.5, color:'var(--text-muted)' }}>{reviews}</span>
                          </div>
                          {/* 一句话亮点推荐理由（最多 2 行，超出打点） */}
                          {it.r && (
                            <div style={{ fontSize:11, color:'var(--brand-strong)', marginTop:4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.35, fontWeight:600, textWrap:'pretty' }}>{it.r}</div>
                          )}
                          {/* 卖价 + 折扣整体置于卡片右下角；折扣标签与卖价居中对齐 */}
                          <div style={{ marginTop:'auto', paddingTop:7 }}>
                            <PriceBlock price={price} seed={it.name} rate={0.67} size={15} side="right" colAlign="center" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          /* 人气美食：在原标签基础上多展示一个标签 */
          return (
            <div key={s.key}>
              {SectionHead}
              <div className="hscroll" style={{ margin:'0 -14px', padding:'1px 14px 3px', gap:10, alignItems:'stretch' }}>
                {items.map((it, i) => {
                  const isFoods = s.key === 'foods';
                  return (
                  <div key={i} className="card" onClick={()=>bus.toast(`查看「${it.name || it.title}」`)}
                    style={{ flex:'0 0 144px', width:144, overflow:'hidden' }}>
                    <Ph src={destCatImg(s.key, it.img || it.name || it.title)} label={it.name || it.title} h={92} r={0} />
                    <div style={{ padding:'7px 9px 8px' }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:'var(--text)', lineHeight:1.25,
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.name || it.title}</div>
                      {/* 人气美食去掉营销标签；其它分组保留标签 */}
                      {!isFoods && (it.tag || it.meta) && (
                        <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:5, flexWrap:'wrap' }}>
                          {it.tag && <span className="tag">{it.tag}</span>}
                          {it.meta && <span style={{ fontSize:10, color:'var(--brand)', fontWeight:700 }}>{it.meta}</span>}
                        </div>
                      )}
                      <div style={{ fontSize:11.5, color: isFoods ? 'var(--brand-strong)' : 'var(--text-muted)', fontWeight: isFoods ? 600 : 400, marginTop:5, lineHeight:1.45,
                        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{it.r || ''}</div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 单目的地推荐 ---------- */
function DestRec({ props, bus, ctx }){
  const isFamily = ctx.identity === 'family';
  const cfg = window.DATA.destRec;
  const head = isFamily ? cfg.head.family : cfg.head.default;
  const list = cfg.list;

  const [sel, setSel] = useState(null);
  const rowRef = useRef(null);
  const sectionRef = useRef(null);
  const cardRefs = useRef({});

  const selDest = list.find(d => d.city === sel);

  function pick(city){
    if(sel === city){
      // 收起：先瞬时把视口锚定到本楼层顶部，再卸载详情 —— 锚点不动，杜绝详情卸载造成的闪动
      const sec = sectionRef.current, sc = destScrollerOf(sec);
      if(sec && sc){
        const prev = sc.style.scrollBehavior;
        sc.style.scrollBehavior = 'auto';
        const top = sc.scrollTop + (sec.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 8;
        sc.scrollTop = Math.max(0, top);
        sc.style.scrollBehavior = prev || '';
      }
      setSel(null);
      return;
    }
    setSel(city);
    requestAnimationFrame(()=> destCenterX(rowRef.current, cardRefs.current[city]));
  }

  return (
    <section ref={sectionRef} className="floor floor-enter">
      <div className="floor-head">
        <h2 className="floor-title"><Icon name="compass" size={15} color="var(--brand)" />{head.title}</h2>
      </div>

      {/* 横滑目的地卡片（展开后吸顶，直到整个模块滑出再松开） */}
      <div ref={rowRef} className="hscroll"
        style={ sel
          ? { paddingTop:7, paddingBottom:8, position:'sticky', top:0, zIndex:20,
              background:'var(--bg)' }
          : { paddingTop:2 } }>
        {list.map(d => {
          const on = d.city === sel;
          return (
            <button key={d.city} ref={el => (cardRefs.current[d.city] = el)}
              onClick={()=>pick(d.city)}
              style={{ flex:'0 0 auto', width:168, padding:0, borderRadius:'var(--radius)', overflow:'hidden',
                position:'relative', background:'var(--surface)', transition:'transform .2s ease, box-shadow .2s ease',
                border:'none', outline:'2px solid transparent', outlineOffset:'-2px',
                boxShadow: on ? '0 0 0 2px var(--brand)' : '0 0 0 1px rgba(26,24,33,.06)',
                transform: on ? 'translateY(-2px)' : 'none' }}>
              <Ph label={d.img} photo h={84} r={0}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 34%,rgba(0,0,0,.7))',
                  display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'7px 9px' }}>
                  <div style={{ color:'#fff', fontSize:15.5, fontWeight:800, lineHeight:1.1 }}>{d.city}</div>
                  <div style={{ color:'rgba(255,255,255,.9)', fontSize:11, marginTop:1,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{isFamily ? d.theme : (d.themeSolo || d.theme)}</div>
                </div>
              </Ph>
              <PeekCTA on={on} />
            </button>
          );
        })}
      </div>

      {selDest && <DestDetail key={selDest.city} dest={selDest} isFamily={isFamily} identity={ctx.identity} tier={ctx.tier} bus={bus} />}
    </section>
  );
}


/* ---------- 发现低价目的地（探索目的地 tab，仅个人/亲子） ---------- */
const LOW_PRICE_DEST_COPY = {
  value: {
    solo: {
      tag:'AI低价雷达',
      sub:'AI已根据降幅、余量和近30日均价锁定目的地，优先露出机票+酒店同降的低价窗口。',
      mode:'限时低价',
      cta:'抢购'
    },
    family: {
      tag:'亲子省心低价',
      sub:'AI优先筛选航班价格回落、亲子酒店有余量的目的地，帮你把带娃短途成本先压下来。',
      mode:'亲子特惠',
      cta:'抢购'
    },
  },
  premium: {
    solo: {
      tag:'尊享低价',
      sub:'AI优先筛选舒适航班与高星酒店同时进入礼遇价窗口的目的地，质感不降级。',
      mode:'礼遇价',
      cta:'抢购'
    },
    family: {
      tag:'家庭尊享低价',
      sub:'AI把舒适航班、亲子房和儿童权益一起比价，优先露出近期可抢的家庭礼遇价。',
      mode:'家庭礼遇',
      cta:'抢购'
    },
  }
};

const LOW_PRICE_DESTS = {
  value: {
    solo: [
      {
        city:'厦门', theme:'躺平不累的海岛之旅', img:'厦门 海边 文艺', badge:'周末低价窗',
        deals:{
          flight:{ label:'机票', icon:'flight', price:699, origin:1320, discount:'直降47%' },
          hotel:{ label:'酒店', icon:'bed', price:268, origin:480, discount:'5.6折' },
          ticket:{ label:'门票', icon:'ticket', price:79, origin:128, discount:'6.2折' },
        },
        reasonFlightHotel:'AI捕捉到周末低价窗口：直飞比近30日高点低47%，环岛路酒店同步回落；晚去早回仍有余量，现在抢比临近出发更稳。',
        reasonHotelTicket:'环岛路酒店周中低至5.6折，鼓浪屿/海底世界票价低于景区门口价，适合到店后轻松加玩法。'
      },
      {
        city:'重庆', theme:'夜景火锅的周末低价局', img:'重庆 夜景 火锅', badge:'夜航直降',
        deals:{
          flight:{ label:'机票', icon:'flight', price:599, origin:1120, discount:'直降46%' },
          hotel:{ label:'酒店', icon:'bed', price:229, origin:430, discount:'5.3折' },
          ticket:{ label:'门票', icon:'ticket', price:68, origin:118, discount:'5.8折' },
        },
        reasonFlightHotel:'夜航价格突然下探，直飞较高点直降46%；解放碑酒店低价房集中释放，住在核心区，火锅夜景少打车，整体更省。',
        reasonHotelTicket:'核心商圈酒店低至¥229，长江索道/两江夜游套票低于周末均价，行程中临时加购也划算。'
      },
      {
        city:'澳门', theme:'轻松过关的微度假', img:'澳门 度假村 夜景', badge:'跨境闪降',
        deals:{
          flight:{ label:'机票', icon:'flight', price:799, origin:1490, discount:'直降46%' },
          hotel:{ label:'酒店', icon:'bed', price:499, origin:890, discount:'5.6折' },
          ticket:{ label:'门票', icon:'ticket', price:178, origin:280, discount:'6.4折' },
        },
        reasonFlightHotel:'跨境航线进入闪降段，机票较近30日高点低46%；周中度假村酒店同步降价，老城和美食动线短，短假低价可抢。',
        reasonHotelTicket:'度假村酒店低至5.6折，塔景/演艺体验票有余量，适合抵达后按天气灵活抢购。'
      },
      {
        city:'西双版纳', theme:'热带夜市短假', img:'版纳 雨林 夜市', badge:'短假抄底',
        deals:{
          flight:{ label:'机票', icon:'flight', price:899, origin:1580, discount:'直降43%' },
          hotel:{ label:'酒店', icon:'bed', price:318, origin:620, discount:'5.1折' },
          ticket:{ label:'门票', icon:'ticket', price:128, origin:220, discount:'5.8折' },
        },
        reasonFlightHotel:'AI发现短假抄底价：直飞降幅43%，告庄酒店低价库存集中；雨林+夜市玩法密度高，一个人出行也能把预算压住。',
        reasonHotelTicket:'告庄酒店低至¥318，植物园/野象谷门票低于近7日均价，行程中加一天雨林玩法正合适。'
      },
    ],
    family: [
      {
        city:'珠海', theme:'乐园+海边的一站式遛娃', img:'珠海 海洋 乐园 亲子', badge:'亲子票酒省',
        deals:{
          flight:{ label:'机票', icon:'flight', price:499, origin:980, discount:'直降49%' },
          hotel:{ label:'酒店', icon:'bed', price:399, origin:760, discount:'5.3折' },
          ticket:{ label:'门票', icon:'ticket', price:268, origin:450, discount:'6.0折' },
        },
        reasonFlightHotel:'亲子低价信号很强：直飞较近30日高点直降49%，亲子酒店周末仍有低价房；乐园+海边一站式，带娃少折腾。',
        reasonHotelTicket:'亲子房低至5.3折，海洋王国门票低于周末均价，酒店+门票一起抢比临时买更稳。'
      },
      {
        city:'厦门', theme:'第一次带娃看海', img:'厦门 海滩 亲子', badge:'带娃低价窗',
        deals:{
          flight:{ label:'机票', icon:'flight', price:629, origin:1180, discount:'直降47%' },
          hotel:{ label:'酒店', icon:'bed', price:329, origin:620, discount:'5.3折' },
          ticket:{ label:'门票', icon:'ticket', price:88, origin:150, discount:'5.9折' },
        },
        reasonFlightHotel:'机酒同降适合提前锁：直飞降幅47%，亲子友好酒店周中低价集中；沙滩、海底世界、老城距离近，推车党更省心。',
        reasonHotelTicket:'亲子酒店低至¥329，海底世界/鼓浪屿组合票较门市价更低，行程前锁票更省排队时间。'
      },
      {
        city:'成都', theme:'熊猫+美食轻松遛娃', img:'成都 熊猫 亲子', badge:'早场省心价',
        deals:{
          flight:{ label:'机票', icon:'flight', price:559, origin:1050, discount:'直降47%' },
          hotel:{ label:'酒店', icon:'bed', price:299, origin:560, discount:'5.3折' },
          ticket:{ label:'门票', icon:'ticket', price:52, origin:88, discount:'5.9折' },
        },
        reasonFlightHotel:'AI识别到熊猫早场低价组合：直飞降幅47%，春熙路亲子酒店价格回落；住核心区少转场，省钱也省体力。',
        reasonHotelTicket:'市中心酒店低至5.3折，熊猫基地门票低于高峰均价，适合行程前提前锁早场。'
      },
      {
        city:'冲绳', theme:'推车友好的海岛亲子游', img:'冲绳 海景 亲子', badge:'海岛亲子降',
        deals:{
          flight:{ label:'机票', icon:'flight', price:1199, origin:2100, discount:'直降43%' },
          hotel:{ label:'酒店', icon:'bed', price:699, origin:1180, discount:'5.9折' },
          ticket:{ label:'门票', icon:'ticket', price:118, origin:198, discount:'6.0折' },
        },
        reasonFlightHotel:'含行李直飞出现海岛亲子降价，较高点低43%；海景亲子酒店有低价窗口，水族馆+浅海湾动线轻，适合先抢机酒。',
        reasonHotelTicket:'海景亲子酒店低至¥699，水族馆/亲子体验票有折扣，适合行程中按宝宝状态灵活加购。'
      },
    ],
  },
  premium: {
    solo: [
      {
        city:'香港', theme:'维港质感周末礼遇', img:'香港 维港 高端 酒店', badge:'维港礼遇价',
        deals:{
          flight:{ label:'机票', icon:'flight', price:1280, origin:2400, discount:'直降47%' },
          hotel:{ label:'酒店', icon:'bed', price:1680, origin:2800, discount:'6.0折' },
          ticket:{ label:'门票', icon:'ticket', price:318, origin:520, discount:'6.1折' },
        },
        reasonFlightHotel:'维港礼遇价刚释放：优选直飞较高点低47%，景观房低于近30日均价；航班时间舒适，适合高质量短住。',
        reasonHotelTicket:'维港高星酒店低至6.0折，观景/文化体验票有礼遇价，品质不降级，行程中加购更从容。'
      },
      {
        city:'东京', theme:'银座美食与城市漫游', img:'东京 银座 高端 餐厅', badge:'银座低价窗',
        deals:{
          flight:{ label:'机票', icon:'flight', price:1980, origin:3600, discount:'直降45%' },
          hotel:{ label:'酒店', icon:'bed', price:2280, origin:3900, discount:'5.8折' },
          ticket:{ label:'门票', icon:'ticket', price:420, origin:680, discount:'6.2折' },
        },
        reasonFlightHotel:'银座低价窗口可抢：优选航班降幅45%，高星酒店低于近30日均价；购物、美食、展馆动线集中，质感不降级。',
        reasonHotelTicket:'高星酒店低至5.8折，TeamLab/展馆票有余量，适合到达后按天气安排室内体验。'
      },
      {
        city:'普吉', theme:'海岛私享躺平假期', img:'普吉 私岛 无边泳池', badge:'私享闪惠',
        deals:{
          flight:{ label:'机票', icon:'flight', price:1680, origin:3000, discount:'直降44%' },
          hotel:{ label:'酒店', icon:'bed', price:2480, origin:4200, discount:'5.9折' },
          ticket:{ label:'门票', icon:'ticket', price:520, origin:880, discount:'5.9折' },
        },
        reasonFlightHotel:'私享海岛闪惠出现：舒适航班较高点低44%，海景度假村套房进入礼遇价；预算更多留给景观、早餐和SPA。',
        reasonHotelTicket:'海景套房低至5.9折，出海/SPA体验票较近7日低，行程中临时升级也有尊享感。'
      },
      {
        city:'澳门', theme:'度假村微奢短假', img:'澳门 度假村 高端', badge:'套房礼遇',
        deals:{
          flight:{ label:'机票', icon:'flight', price:880, origin:1600, discount:'直降45%' },
          hotel:{ label:'酒店', icon:'bed', price:1580, origin:2600, discount:'6.1折' },
          ticket:{ label:'门票', icon:'ticket', price:399, origin:680, discount:'5.9折' },
        },
        reasonFlightHotel:'套房礼遇价库存稳定：航班降幅45%，度假村高星房低于周末常规价；美食、秀场、购物同动线，微奢短假更划算。',
        reasonHotelTicket:'度假村酒店低至6.1折，演艺/观景体验票低于周末均价，适合行程中顺手升级体验。'
      },
    ],
    family: [
      {
        city:'三亚', theme:'亲子度假村尊享礼遇', img:'三亚 高端 亲子 度假村', badge:'亲子套房惠',
        deals:{
          flight:{ label:'机票', icon:'flight', price:1180, origin:2200, discount:'直降46%' },
          hotel:{ label:'酒店', icon:'bed', price:2380, origin:3900, discount:'6.1折' },
          ticket:{ label:'门票', icon:'ticket', price:399, origin:680, discount:'5.9折' },
        },
        reasonFlightHotel:'亲子套房礼遇价正在释放：舒适直飞降幅46%，海棠湾酒店含早和儿童活动权益更完整，现在锁机酒比临近更稳。',
        reasonHotelTicket:'亲子套房低至6.1折，水世界/亲子体验票低于近7日均价，适合行程前锁定热门时段。'
      },
      {
        city:'澳门', theme:'度假村+演艺亲子周末', img:'澳门 度假村 亲子 秀场', badge:'演艺家庭礼遇',
        deals:{
          flight:{ label:'机票', icon:'flight', price:980, origin:1800, discount:'直降46%' },
          hotel:{ label:'酒店', icon:'bed', price:1880, origin:3100, discount:'6.1折' },
          ticket:{ label:'门票', icon:'ticket', price:458, origin:760, discount:'6.0折' },
        },
        reasonFlightHotel:'家庭礼遇价命中：舒适航班较高点低46%，度假村亲子房同步降；乐园、秀场、餐厅连廊可达，带娃少走冤枉路。',
        reasonHotelTicket:'亲子房低至6.1折，演艺/亲子体验票有库存，行程中下雨也能无缝切室内玩法。'
      },
      {
        city:'冲绳', theme:'零时差海岛家庭慢游', img:'冲绳 海景 度假村 亲子', badge:'海景房降价',
        deals:{
          flight:{ label:'机票', icon:'flight', price:1480, origin:2600, discount:'直降43%' },
          hotel:{ label:'酒店', icon:'bed', price:1980, origin:3200, discount:'6.2折' },
          ticket:{ label:'门票', icon:'ticket', price:260, origin:420, discount:'6.2折' },
        },
        reasonFlightHotel:'海景房进入降价段：直飞降幅43%，亲子度假村礼遇价释放；零时差+浅海湾+水族馆，适合家庭慢游先抢机酒。',
        reasonHotelTicket:'海景亲子酒店低至6.2折，水族馆/亲子体验票有礼遇价，适合行程中按天气灵活安排。'
      },
      {
        city:'东京', theme:'双乐园省心亲子礼遇', img:'东京 迪士尼 高端 酒店', badge:'乐园酒店惠',
        deals:{
          flight:{ label:'机票', icon:'flight', price:2180, origin:3900, discount:'直降44%' },
          hotel:{ label:'酒店', icon:'bed', price:3200, origin:5200, discount:'6.2折' },
          ticket:{ label:'门票', icon:'ticket', price:520, origin:820, discount:'6.3折' },
        },
        reasonFlightHotel:'双乐园机酒低价窗口出现：舒适航班降幅44%，乐园周边高星酒店礼遇价释放；含接驳/早餐的组合更值得先锁。',
        reasonHotelTicket:'乐园酒店低至6.2折，门票/快速入园权益余量稳定，行程前抢能减少现场排队成本。'
      },
    ],
  }
};

function lowPriceProductKeys(){
  return ['flight','hotel'];
}
function lowPriceModeCopy(identity, tier){
  const bucket = LOW_PRICE_DEST_COPY[tier] || LOW_PRICE_DEST_COPY.value;
  return bucket[identity] || bucket.solo;
}
function lowPriceItems(identity, tier){
  const bucket = LOW_PRICE_DESTS[tier] || LOW_PRICE_DESTS.value;
  return (bucket[identity] || bucket.solo || []).slice(0, 4);
}
function LowPriceDealRow({ deal, tier }){
  if(!deal) return null;
  const isPremium = tier === 'premium';
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, padding:'7px 0', borderBottom:'1px dashed color-mix(in srgb,var(--hairline) 82%, transparent)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
        <span style={{ width:24, height:24, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          background:isPremium?'rgba(184,163,106,.13)':'var(--brand-soft)' }}>
          <Icon name={deal.icon} size={13} color="var(--brand)" />
        </span>
        <span style={{ fontSize:12.5, fontWeight:800, color:'var(--text)' }}>{deal.label}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
        <span style={{ fontSize:10.5, fontWeight:900, color:'var(--brand-strong)', background:isPremium?'rgba(184,163,106,.16)':'var(--brand-soft)', padding:'2px 5px', borderRadius:6, lineHeight:1.1 }}>{deal.discount}</span>
        <span className="price" style={{ fontSize:17, lineHeight:1, letterSpacing:-.2 }}><span className="cur">¥</span>{deal.price}<span style={{ fontSize:10, fontWeight:700, marginLeft:1 }}>起</span></span>
        <span className="price-origin" style={{ marginLeft:0, fontSize:10.5 }}>¥{deal.origin}</span>
      </div>
    </div>
  );
}
function LowPriceDest({ props, bus, ctx }){
  const identity = (ctx && ctx.identity) || (props && props.identity) || 'solo';
  if(identity !== 'solo' && identity !== 'family') return null;
  const tier = (ctx && ctx.tier) || (props && props.tier) || 'value';
  const isPremium = tier === 'premium';
  const isFamily = identity === 'family';
  const productKeys = lowPriceProductKeys();
  const copy = lowPriceModeCopy(identity, tier);
  const list = lowPriceItems(identity, tier);
  const ctaText = copy.cta || '抢购';
  const scrollRef = useRef(null);

  React.useEffect(()=>{
    const el = scrollRef.current;
    if(!el) return;
    const reset = ()=>{
      if(!scrollRef.current) return;
      scrollRef.current.scrollLeft = 0;
      if(typeof scrollRef.current.scrollTo === 'function') scrollRef.current.scrollTo({ left:0, behavior:'auto' });
    };
    reset();
    requestAnimationFrame(reset);
    setTimeout(reset, 60);
  }, [identity, tier]);

  return (
    <section className="floor floor-enter">
      <div className="floor-head">
        <h2 className="floor-title"><Icon name={isPremium?'spark':'bolt'} size={15} color="var(--brand)" fill={isPremium?'var(--brand)':'none'} />发现低价目的地</h2>
      </div>
      <div style={{ margin:'-3px 14px 8px', padding:isPremium?'9px 11px':'8px 10px', borderRadius:14,
        background:isPremium?'linear-gradient(135deg,rgba(255,255,255,.78),rgba(240,235,221,.82))':'var(--brand-soft)',
        border:isPremium?'1px solid rgba(184,163,106,.24)':'1px solid color-mix(in srgb,var(--brand) 12%, transparent)' }}>
        <div style={{ fontSize:12.5, fontWeight:900, color:'var(--brand-strong)', marginBottom:2 }}>{copy.tag}</div>
        <div style={{ fontSize:12, lineHeight:1.5, color:'var(--text-muted)', textWrap:'pretty' }}>{copy.sub}</div>
      </div>
      <div key={`low-price-scroll-${identity}-${tier}`} ref={scrollRef} className="hscroll" style={{ paddingTop:2, paddingBottom:4, gap:10, alignItems:'stretch', scrollBehavior:'auto' }}>
        {list.map((d, idx)=>{
          const reason = d.reasonFlightHotel;
          return (
            <div key={d.city} className="card low-price-dest-card" style={{ flex:'0 0 auto', width:252, overflow:'hidden', cursor:'default',
              background:isPremium?'linear-gradient(180deg,#FFFDF8 0%,#F8F4E9 100%)':'var(--surface)',
              border:isPremium?'1px solid rgba(184,163,106,.22)':'none', display:'flex', flexDirection:'column' }}>
              <Ph label={d.img} photo h={104} r={0}>
                <div style={{ position:'absolute', inset:0, background:isPremium
                  ? 'linear-gradient(180deg,rgba(255,255,255,.04) 0%,rgba(46,38,20,.72) 100%)'
                  : 'linear-gradient(180deg,rgba(0,0,0,.04) 20%,rgba(0,0,0,.72) 100%)' }} />
                <span style={{ position:'absolute', left:10, top:9, display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:999,
                  fontSize:10.5, fontWeight:900, color:isPremium?'#6F541B':'#fff', background:isPremium?'rgba(255,250,235,.94)':'rgba(238,73,38,.94)', boxShadow:'0 4px 12px rgba(0,0,0,.16)' }}>
                  <Icon name={isPremium?'gift':'bolt'} size={10} color="currentColor" fill={isPremium?'none':'currentColor'} stroke={2.4} />{d.badge || copy.mode}
                </span>
                <div style={{ position:'absolute', left:11, right:11, bottom:10 }}>
                  <div style={{ color:'#fff', fontSize:17.5, fontWeight:900, lineHeight:1.1 }}>{d.city}</div>
                  <div style={{ color:'rgba(255,255,255,.91)', fontSize:12.3, marginTop:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.theme}</div>
                </div>
              </Ph>
              <div style={{ padding:'9px 11px 11px', display:'flex', flexDirection:'column', flex:1 }}>
                <div style={{ padding:'8px 9px', borderRadius:12, background:isPremium?'rgba(184,163,106,.10)':'color-mix(in srgb,var(--brand-soft) 78%, #fff 22%)',
                  border:'1px solid color-mix(in srgb,var(--brand) 12%, transparent)', minHeight:78 }}>
                  <div style={{ marginBottom:4, color:'var(--brand-strong)', fontSize:11.5, fontWeight:900 }}>
                    推荐理由
                  </div>
                  <div style={{ color:'var(--text)', fontSize:12, lineHeight:1.48, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', textWrap:'pretty' }}>{reason}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', marginTop:8 }}>
                  {productKeys.map(k => <LowPriceDealRow key={k} deal={d.deals[k]} tier={tier} />)}
                </div>
                <button className={isFamily?'btn':''} onClick={(e)=>{ e.stopPropagation(); bus.toast(`已为你锁定「${d.city}」低价库存`); }}
                  style={isFamily ? { marginTop:10, alignSelf:'flex-end', padding:'6px 14px', fontSize:12.5, whiteSpace:'nowrap', boxShadow:'none', filter:'none' }
                    : { marginTop:10, width:'100%', height:34, borderRadius:999, background:'var(--cta-grad)', color:isPremium?'#2E2A1C':'var(--on-brand,#fff)',
                      fontSize:13.5, fontWeight:900, boxShadow:'var(--btn-shadow)', letterSpacing:.2 }}>
                  {ctaText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- 目的地灵感（主题聚合多个单目的地推荐） ---------- */
function SceneGuide({ props, bus, ctx }){
  const isFamily = ctx.identity === 'family';
  const themes = window.DATA.themes;
  const db = window.DATA.destDB;
  const THEME_SETS = {
    family: ['kids','parks','nature','fun','food','snow','culture'],
    solo:   ['fun','food','nature','culture','snow','show','luxury'],
    biz:    ['business','food','culture','luxury','fun','nature'],
    event:  ['show','fun','food','culture','nature'],
  };
  let ORDER = THEME_SETS[ctx.identity] || THEME_SETS.solo;
  if(ctx.tier === 'premium') ORDER = ['luxury','snow', ...ORDER.filter(k=> k!=='luxury' && k!=='snow')];

  const [selTheme, setSelTheme] = useState(null);
  const [selCity, setSelCity] = useState(null);
  const sectionRef = useRef(null);
  const themeRowRef = useRef(null);
  const themeCardRefs = useRef({});
  const destRowRef = useRef(null);
  const destTabRefs = useRef({});

  const onBrand = ctx.tier === 'premium' ? '#1A1505' : '#fff';

  function pickTheme(k){
    if(selTheme === k){
      // 收起：先瞬时把视口锚定到本楼层顶部，再卸载详情 —— 锚点不动，杜绝详情卸载造成的闪动
      const sec = sectionRef.current, sc = destScrollerOf(sec);
      if(sec && sc){
        const prev = sc.style.scrollBehavior;
        sc.style.scrollBehavior = 'auto';
        const top = sc.scrollTop + (sec.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 8;
        sc.scrollTop = Math.max(0, top);
        sc.style.scrollBehavior = prev || '';
      }
      setSelTheme(null); setSelCity(null);
      return;
    }
    setSelTheme(k);
    setSelCity(themes[k].dests[0].city);   // 锚定到第一个目的地
    requestAnimationFrame(()=> destCenterX(themeRowRef.current, themeCardRefs.current[k]));
  }
  function pickCity(city){
    setSelCity(city);
    requestAnimationFrame(()=> destCenterX(destRowRef.current, destTabRefs.current[city]));
    // 切换目的地后回到卡片位置，确保推荐理由可见
    setTimeout(()=>{
      const sec = sectionRef.current, sc = destScrollerOf(sec);
      if(sec && sc){
        const top = sc.scrollTop + (sec.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 8;
        sc.scrollTo({ top: Math.max(0, top), behavior:'smooth' });
      }
    }, 20);
  }

  const theme = selTheme ? themes[selTheme] : null;
  const dest = selCity ? db[selCity] : null;

  return (
    <section ref={sectionRef} className="floor floor-enter">
      <div className="floor-head">
        <h2 className="floor-title"><Icon name="spark" size={15} color="var(--brand)" fill="var(--brand)" />目的地灵感</h2>
      </div>

      {/* 主题卡片 + 目的地分组：选中主题后一起吸顶 */}
      <div style={ selTheme
        ? { position:'sticky', top:0, zIndex:20, background:'var(--bg)' }
        : undefined }>
      <div ref={themeRowRef} className="hscroll" style={{ paddingTop:6, paddingBottom:6, scrollSnapType:'none' }}>
        {ORDER.map(k => {
          const t = themes[k]; if(!t) return null;
          const on = k === selTheme;
          return (
            <button key={k} ref={el => (themeCardRefs.current[k] = el)} onClick={()=>pickTheme(k)}
              style={{ flex:'0 0 auto', width:230, padding:0, borderRadius:'var(--radius)', overflow:'hidden', position:'relative',
                background:'var(--surface)', textAlign:'left', transition:'transform .2s ease, box-shadow .2s ease',
                border:'none', outline:'2px solid transparent', outlineOffset:'-2px',
                boxShadow: on ? '0 0 0 2px var(--brand)' : '0 0 0 1px rgba(26,24,33,.06)', transform: on ? 'translateY(-2px)' : 'none' }}>
              <Ph src={themeCoverImg(k, t.kw)} label={t.title} h={120} r={0}>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 38%,rgba(0,0,0,.62))',
                  display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:12 }}>
                  <div style={{ color:'#fff', fontSize:16, fontWeight:800, lineHeight:1.2 }}>{t.title}</div>
                  <div style={{ color:'rgba(255,255,255,.86)', fontSize:12, marginTop:2 }}>{t.sub}</div>
                </div>
                <PeekCTA on={on} />
              </Ph>
              <div style={{ display:'flex', alignItems:'center', gap:4, padding:'9px 11px 11px' }}>
                <Icon name="pin" size={11} color="var(--brand-strong)" style={{ flexShrink:0 }} />
                <span style={{ flex:1, minWidth:0, fontSize:12, color:'var(--text-muted)',
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {t.dests.map(d => d.city).join(' · ')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 目的地分组 tab（与主题卡片一起吸顶） */}
        {theme && (
          <div ref={destRowRef} className="hscroll" style={{ paddingTop:2, paddingBottom:9, gap:7 }}>
            {theme.dests.map(d => {
              const on = d.city === selCity;
              return (
                <button key={d.city} ref={el => (destTabRefs.current[d.city] = el)} onClick={()=>pickCity(d.city)}
                  style={{ flex:'0 0 auto', padding:'7px 14px', borderRadius:999, fontSize:13.5, fontWeight: on ? 800 : 600,
                    display:'flex', alignItems:'center', gap:3, transition:'all .15s ease',
                    background: on ? 'var(--brand)' : 'var(--surface-2)', color: on ? onBrand : 'var(--text-muted)',
                    border: on ? 'none' : '1px solid var(--hairline)' }}>
                  <Icon name="pin" size={11} color={on ? onBrand : 'var(--brand-strong)'} />{d.city}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 详情：与单目的地推荐完全一致 */}
      {theme && <DestDetail key={selCity} dest={dest} isFamily={isFamily} identity={ctx.identity} tier={ctx.tier} themeTitle={theme.title} themeReason={window.themedDestReason(selTheme, selCity, isFamily)} bus={bus} />}
    </section>
  );
}

/* ============================================================
   刚刚浏览过的（以酒店为例）—— 默认置于 Feeds 流正上方
   还原「最近浏览」心智：横滑回顾刚看过的酒店，一键订阅降价提醒。
   以「降价订阅」为核心 CTA：浏览过 = 有兴趣 → 降价第一时间触达。
   ============================================================ */
const RV_TIME = ['刚刚', '3分钟前', '12分钟前', '1小时前', '今天 10:24', '昨天'];
const RV_REASONS = ['近地铁口，出行很方便', '步行直达核心商圈', '早餐丰富、出品稳定', '新装修，房间干净敞亮', '前台服务响应很快', '楼层安静，睡得好'];
function rvHash(s){ let h=0; s=String(s); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
function rvReason(it, h){
  const s = (it.title||'') + (it.tags ? it.tags.join('') : '');
  if(/海景|海岛|度假/.test(s)) return '推窗即海，看日出绝佳';
  if(/亲子|家庭/.test(s))     return '亲子设施齐全，溜娃省心';
  if(/温泉|汤/.test(s))       return '房内泡汤，泡完直接睡';
  if(/江景|高层|景观/.test(s)) return '高层视野通透，夜景很赞';
  if(/泳池|别墅/.test(s))     return '私享泳池，度假感拉满';
  return RV_REASONS[h % RV_REASONS.length];
}
function rvReviews(h){
  const rc = 1600 + (h % 44000);
  return rc >= 10000 ? (rc/10000).toFixed(1)+'万条评价' : rc.toLocaleString()+'条评价';
}

function RecentlyViewed({ props, bus, ctx }){
  const city = (ctx && ctx.city) || (props && props.city) || '三亚';
  const tier = (ctx && ctx.tier) || (props && props.tier) || 'value';

  // 最近浏览的酒店：按 城市+档位 稳定生成（与 Feeds 同源，保证图文/价格一致）
  const seed = React.useMemo(()=>{
    const built = (window.buildFeedCards ? window.buildFeedCards(city, 'hotel', tier) : []).slice(0, 6);
    return built.length ? built : (window.DATA.feeds.filter(f=> f.line==='hotel').slice(0, 5));
  }, [city, tier]);

  const [list, setList] = useState(seed);
  const [subs, setSubs] = useState({});   // { [key]: true } 已订阅降价
  React.useEffect(()=>{ setList(seed); setSubs({}); }, [seed]);

  if(!list.length) return null;

  const subCount = Object.values(subs).filter(Boolean).length;

  const toggleSub = (it, key)=>{
    setSubs(s=>{
      const next = { ...s, [key]: !s[key] };
      if(next[key]) bus.toast(`已订阅「${it.title}」降价提醒，降价立即通知你`);
      else bus.toast('已关闭该酒店的降价提醒');
      return next;
    });
  };
  const subscribeAll = ()=>{
    const all = {}; list.forEach((it,i)=> all[(it.id||it.title)+'-'+i] = true);
    setSubs(all);
    bus.toast(`已为 ${list.length} 家刚浏览的酒店开启降价提醒`);
  };

  return (
    <section className="floor floor-enter">
      <div className="floor-head">
        <h2 className="floor-title" style={{ gap:6 }}>
          <Icon name="clock" size={15} color="var(--brand)" />刚刚浏览过的酒店
        </h2>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={subscribeAll} className="floor-more" style={{ background:'none', color:'var(--brand-strong)', fontWeight:700, display:'flex', alignItems:'center', gap:3 }}>
            <Icon name="bell" size={12} color="currentColor" stroke={2.2} />一键订阅降价
          </button>
        </div>
      </div>

      {subCount>0 && (
        <div style={{ margin:'-2px 14px 6px', display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--brand-strong)' }}>
          <Icon name="check" size={12} color="currentColor" stroke={2.6} />
          已订阅 {subCount} 家酒店的降价提醒，降价会第一时间通知你
        </div>
      )}

      <div className="hscroll" style={{ gap:10 }}>
        {list.map((it, i)=>{
          const key = (it.id || it.title) + '-' + i;
          const subbed = !!subs[key];
          const h = rvHash((it.id||'') + (it.title||''));
          const reviews = rvReviews(h);
          const reason = rvReason(it, h);
          // 较浏览时已降的金额（每张稳定生成；仅已订阅卡片展示）
          const dropped = Math.max(20, Math.round((it.price * (0.05 + (h % 6)/100)) / 10) * 10);
          // 划线价 + 折扣
          const rate = 0.66 + (h % 16)/100;
          const origin = Math.max(it.price + 30, Math.round((it.price / rate) / 10) * 10);
          const disc = (it.price / origin * 10).toFixed(1) + '折';
          return (
            <div key={key} className="card" style={{ width:320, borderRadius:16, overflow:'hidden', display:'flex' }}>
              {/* 左图：上/下/左与卡片边框重合，仅右侧留间距；左角随卡片圆角、右角小圆角 */}
              <div style={{ position:'relative', width:116, flexShrink:0, alignSelf:'stretch' }}>
                <Ph label={it.img} photo style={{ position:'absolute', top:0, left:0, bottom:0, right:8, borderRadius:'16px 12px 12px 16px' }} />
                <span style={{ position:'absolute', left:8, top:8, padding:'2px 7px', borderRadius:999,
                  background:'rgba(0,0,0,.45)', color:'#fff', fontSize:10.5, fontWeight:700,
                  display:'flex', alignItems:'center', gap:3 }}>
                  <Icon name="clock" size={10} color="#fff" stroke={2.4} />{RV_TIME[i % RV_TIME.length]}
                </span>
              </div>
              {/* 右文 */}
              <div style={{ flex:1, minWidth:0, padding:'9px 11px 10px', display:'flex', flexDirection:'column' }}>
                <div className="feed-title-2" style={{ fontSize:13, fontWeight:700, lineHeight:1.3, color:'var(--text)' }}>{it.title}</div>
                {/* 评分 + 评价数（样式对齐场景导购 / feeds 酒店卡） */}
                <div style={{ display:'flex', alignItems:'baseline', gap:5, marginTop:5 }}>
                  <span style={{ fontSize:12.5, fontWeight:800, color:'var(--text)' }}>{Number(it.score || 4.7).toFixed(1)}<span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)' }}> / 5</span></span>
                  <span style={{ fontSize:10.5, color:'var(--text-muted)' }}>{reviews}</span>
                </div>
                {/* 一句短推荐理由 */}
                <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:5, fontSize:11.5, lineHeight:1.4, color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  <Icon name="thumb" size={10} color="var(--brand)" style={{ flexShrink:0 }} />
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{reason}</span>
                </div>

                <div style={{ flex:1, minHeight:6 }} />

                {/* 折扣标签（卖价上方，左对齐） */}
                <div style={{ display:'flex', marginBottom:0 }}>
                  <span style={{ fontSize:10.5, fontWeight:800, color:'var(--brand-strong)', background:'var(--brand-soft)', padding:'1px 5px', borderRadius:5, lineHeight:1.2 }}>{disc}</span>
                </div>

                {/* 卖价与「订阅降价」按钮水平对齐于同一行 */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:5, minWidth:0 }}>
                    <span className="price" style={{ fontSize:17, lineHeight:1, whiteSpace:'nowrap' }}><span className="cur" style={{ fontSize:12 }}>¥</span>{it.price}</span>
                    <span className="price-origin" style={{ lineHeight:1, whiteSpace:'nowrap' }}>¥{origin}</span>
                  </div>
                  <button onClick={()=> toggleSub(it, key)} aria-label={subbed ? '已订阅降价' : '订阅降价'}
                    style={{ flex:'0 0 auto', padding:'6px 12px', borderRadius:999, fontSize:11.5, fontWeight:800, whiteSpace:'nowrap',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:3, transition:'all .16s ease',
                      border: subbed ? '1px solid var(--hairline)' : '1px solid color-mix(in srgb,var(--brand) 42%, transparent)',
                      background: subbed ? 'var(--surface-2)' : 'color-mix(in srgb,var(--brand-soft) 82%, #fff 18%)',
                      color: subbed ? 'var(--text-muted)' : 'var(--brand-strong)' }}>
                    <Icon name={subbed ? 'check' : 'bell'} size={11} color="currentColor" stroke={subbed ? 2.6 : 2} />
                    {subbed ? '已订阅' : '订阅降价'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

Object.assign(window, { DestRec, SceneGuide, DestDetail, LowPriceDest, RecentlyViewed });
