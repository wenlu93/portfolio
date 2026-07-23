/* ============================================================
   OTA Demo — 模块 B
   CityHero / AIEntry / Ranking / Posts / TripCard / TripPlan
   FamilyProfile / BizTravel / EventBundle / Airline·Hotel·Ticket VIP
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---------------- 4.4 城市头图 ---------------- */
function CityHero({ props }){
  const city = props.city || '上海';
  const sub = props.state==='S4' ? '行程进行中 · 玩转当地'
            : props.state==='S3' ? '出发在即 · 行程已就绪'
            : props.tier==='premium' ? '此刻启程，正当其时'
            : '此刻出发，最划算的时机';
  return (
    <section className="floor floor-enter" style={{ padding:'0 14px' }}>
      <Ph label={city+' city'} photo h={136} r={'var(--radius)'}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.22) 44%,rgba(0,0,0,.54)), linear-gradient(135deg,color-mix(in srgb,var(--brand) 34%,transparent),transparent 58%)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:14 }}>
          <div style={{ color:'#fff', fontSize:21, fontWeight:900 }}>{city}</div>
          <div style={{ color:'rgba(255,255,255,.88)', fontSize:12, marginTop:2 }}>{sub}</div>
        </div>
      </Ph>
    </section>
  );
}

/* ---------------- 4.5 AI 搜索入口 ---------------- */
function AIEntry({ props, bus, ctx }){
  const ph = ctx.state==='S1' ? '想去哪？问问 AI 帮你规划行程'
           : ctx.state==='S3' ? '补充当地玩乐？问问 AI'
           : '搜索目的地 / 酒店 / 机票，或问一问';
  const prominent = ctx.state==='S1';
  return (
    <section className="floor floor-enter" style={{ padding:'0 14px' }}>
      <button onClick={()=>bus.openAI()} style={{ width:'100%', display:'flex', alignItems:'center', gap:9,
        background:'var(--surface)', borderRadius:999, padding: prominent?'12px 14px':'10px 14px', boxShadow:'var(--shadow)',
        border:'1.5px solid var(--brand-soft)' }}>
        <Icon name="search" size={18} color="var(--brand)" />
        <span style={{ flex:1, textAlign:'left', color:'var(--text-muted)', fontSize: prominent?14:13 }}>{ph}</span>
        <span style={{ display:'flex', alignItems:'center', gap:4, background:'var(--cta-grad,var(--brand-grad,var(--brand)))', color: ctx.tier==='premium'?'#1A1505':'var(--on-cta,#fff)', borderRadius:999, padding:'5px 11px', fontSize:13, fontWeight:700, boxShadow:'var(--cta-shadow,var(--btn-shadow))' }}>
          <Icon name="spark" size={13} fill="currentColor" color="currentColor" />问一问
        </span>
      </button>
    </section>
  );
}

/* ---------------- 5.6 榜单 — 3列横滑 + 收起展开 ---------------- */
function Ranking({ props, bus }){
  const r = window.DATA.rankings[props.style] || window.DATA.rankings['default'];
  const groups = Object.keys(r.groups);
  const [visible, setVisible] = useState({});
  const luxe = props.style === 'luxe-blackgold';

  const hdrBg = luxe
    ? 'linear-gradient(120deg,#1A1710,#2C2410)'
    : 'var(--ranking-grad,var(--brand-grad))';
  const hdrColor = 'var(--ranking-on,var(--hero-title, #fff))';
  const fillPool = {
    '酒店':['城市精选酒店','海景度假酒店','市中心高分酒店','亲子主题酒店','高层景观酒店','温泉度假酒店'],
    '门票':['热门乐园门票','城市观光通票','海洋世界家庭票','网红展览门票','地标观景台票','亲子科普馆票'],
    '餐厅':['本地人气餐厅','景观亲子餐厅','特色海鲜餐厅','米其林推荐餐厅','老字号名店','网红打卡餐厅'],
  };
  const fillReason = ['近期热度上升','更多用户收藏','本周预订飙升','高分好评如潮','回头客最多'];
  function normalizeItems(g, source){
    const arr = [...source];
    const pool = fillPool[g] || ['精选榜单','热门选择','高分推荐','人气优选','口碑之选','新晋热门'];
    let pi = 0;
    while(arr.length < 6 && pi < pool.length*2){
      const name = pool[pi % pool.length]; pi++;
      if(arr.some(x=> x.name === name)) continue;   // 去重，避免补位与真实项 / 彼此重名
      const idx = arr.length;
      arr.push({ rank:idx+1, name, score:(4.8 - idx*0.04).toFixed(1), reason:fillReason[idx % fillReason.length] });
    }
    return arr.map((it,i)=>({ ...it, rank:i+1 }));
  }

  return (
    <FloorShell
      title={
        <span style={{ display:'flex', alignItems:'center', gap:6 }}>
          <Icon name="trophy" size={15} color="var(--brand)" />
          <span>
            {r.name}
          </span>
        </span>
      }
      dot={false} more="更多榜单"
    >
      <div className="hscroll" style={{ gap:10, alignItems:'flex-start', paddingBottom:12 }}>
        {groups.map(g => {
          const items = normalizeItems(g, r.groups[g]);
          const count = visible[g] || 3;
          const shown = items.slice(0, count);
          return (
            <div key={g} className="card" style={{ width:240, overflow:'hidden', flex:'0 0 240px' }}>
              <div style={{ padding:'9px 13px 7px', background:hdrBg }}>
                <div style={{ fontSize:13.5, fontWeight:800, color:hdrColor }}>{g==='门票'?'景点':g}榜</div>
              </div>
              {shown.map((item, idx) => (
                <div key={`${g}_${item.rank}_${idx}`} onClick={() => bus.toast(`查看「${item.name}」`)}
                  style={{
                    display:'flex', alignItems:'center', gap:8, padding:'8px 11px',
                    borderBottom: idx < shown.length - 1 ? '1px solid var(--hairline)' : 'none',
                    cursor:'pointer',
                  }}>
                  <div style={{ width:16, textAlign:'center', fontSize:14, fontWeight:900, fontStyle:'italic',
                    color: item.rank <= 3 ? 'var(--brand)' : 'var(--text-muted)', flex:'0 0 16px' }}>
                    {item.rank}
                  </div>
                  <Ph label={item.name} photo w={40} h={40} r={7} />
                  <div style={{ flex:1, overflow:'hidden' }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {item.name}
                    </div>
                    {item.reason && (
                      <div style={{ fontSize:11, color:'var(--brand-strong)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {item.reason}
                      </div>
                    )}
                    <div style={{ fontSize:10.5, color:'var(--text-muted)', marginTop:1 }}>★ {item.score}</div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const cur = visible[g] || 3;
                  if(cur < items.length) setVisible(e => ({ ...e, [g]: Math.min(cur + 3, items.length) }));
                  else setVisible(e => ({ ...e, [g]: 3 }));
                }}
                style={{
                  width:'100%', padding:'8px', fontSize:12.5, fontWeight:800, color:'var(--brand)',
                  borderTop:'1px solid var(--hairline)', display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                  background:'var(--surface-2)'
                }}
              >
                {(shown.length < items.length) ? '展开' : '收起'} <Icon name="chevD" size={11} color="var(--brand)" style={{ transform: shown.length < items.length ? 'none' : 'rotate(180deg)' }} />
              </button>
            </div>
          );
        })}
      </div>
    </FloorShell>
  );
}

/* ---------------- 5.7 旅游帖子 ---------------- */
function Posts({ props, bus }){
  const list = window.DATA.posts;
  return (
    <FloorShell title={<span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="book" size={15} color="var(--brand)" />旅行攻略</span>} dot={false} more="更多">
      {props.s5 && (
        <div style={{ padding:'0 14px', marginBottom:8 }}>
          <div className="card" style={{ display:'flex', alignItems:'center', gap:10, padding:12 }}>
            <Icon name="edit" size={22} color="var(--brand)" />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:'var(--text)' }}>晒行程，得权益</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>发布游记最高得 200 积分</div>
            </div>
            <button className="btn" onClick={()=>bus.toast('打开发帖编辑器')} style={{ padding:'6px 13px', fontSize:13 }}>去发帖</button>
          </div>
        </div>
      )}
      <div className="hscroll">
        {list.map(p=>(
          <div key={p.id} className="card" style={{ width:156, overflow:'hidden' }} onClick={()=>bus.toast(`阅读「${p.title}」`)}>
            <Ph label={p.cover} photo h={108} r={0} />
            <div style={{ padding:'7px 9px 9px' }}>
              <div style={{ fontSize:12.5, fontWeight:600, lineHeight:1.35, height:32, overflow:'hidden', color:'var(--text)' }}>{p.title}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--text-muted)' }}>
                  <Ph label={p.author} w={16} h={16} r={8} /> {p.author}
                </span>
                <span style={{ fontSize:11, color:'var(--text-muted)' }}>♡ {p.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FloorShell>
  );
}

/* ---------------- 5.8 行程卡片 (Change 7) ---------------- */
/* 行程卡片底部：按行程阶段推荐的商品卡片（仅非商务出行） */
/* line: hotel | flight | ticket —— 机票卡片不展示评分/月售 */
function TripRecoCard({ it, bus, line }){
  const isFlight = line === 'flight' || it.line === 'flight';
  const h = (it.title||'').split('').reduce((a,c)=>a + c.charCodeAt(0), 0);
  const score = Number(it.score || (4.4 + (h % 6)/10)).toFixed(1);
  const rate = 0.66 + (h % 16)/100;
  const origin = Math.max(it.price + 30, Math.round((it.price / rate) / 10) * 10);
  const disc = (it.price / origin * 10).toFixed(1) + '折';
  return (
    <div onClick={()=>bus.toast(`查看「${it.title}」`)}
      style={{ width:132, flex:'0 0 auto', background:'var(--surface)', borderRadius:11, overflow:'hidden',
        border:'1px solid var(--hairline)', boxShadow:'0 3px 10px rgba(0,0,0,.05)', cursor:'pointer',
        display:'flex', flexDirection:'column' }}>
      <Ph label={it.img} photo h={84} r={0} />
      {/* 一/二/三行信息：间距收窄且一致（统一 4px） */}
      <div style={{ padding:'7px 8px 8px', display:'flex', flexDirection:'column' }}>
        <div className="feed-title-2" style={{ fontSize:11.5, fontWeight:600, lineHeight:1.3, color:'var(--text)' }}>{it.title}</div>
        {/* 评分 + 售卖数（机票不展示） */}
        {!isFlight && (
          <div style={{ display:'flex', alignItems:'baseline', gap:4, marginTop:4 }}>
            <span style={{ fontSize:11.5, fontWeight:800, color:'var(--text)' }}>{score}<span style={{ fontSize:9.5, fontWeight:600, color:'var(--text-muted)' }}> / 5</span></span>
            {it.sold && <span style={{ fontSize:10, color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.sold}</span>}
          </div>
        )}
        {/* 价格区右对齐；折扣标签与卖价内部居中对齐。与上一行保持一致间距 */}
        <div style={{ marginTop:4 }}>
          <PriceBlock price={it.price} origin={origin} disc={disc} size={14} side="right" colAlign="center" />
        </div>
      </div>
    </div>
  );
}

/* 业务线分组：多于 1 条业务线时用 tab 切换（如「机票」「酒店」） */
const RECO_LINE_LABEL = { hotel:'酒店', flight:'机票', ticket:'门票', play:'玩乐' };
function RecoLineTabs({ groups, bus, variant }){
  const [active, setActive] = useState(0);
  if(!groups.length) return null;
  const ai = Math.min(active, groups.length - 1);
  const g = groups[ai];
  const multi = groups.length > 1;
  const coupon = variant==='coupon';   // 与优惠券组件业务线 tab 选中样式一致：象牙底 + 品牌色描边
  return (
    <div style={{ borderTop:'1px solid var(--hairline)', paddingTop:10 }}>
      {multi ? (
        /* 多业务线：pill tab 切换 */
        <div className="hscroll" style={{ gap:7, padding:'0 14px 9px' }}>
          {groups.map((x, i)=>{
            const on = i === ai;
            if(coupon){
              return (
                <button key={x.key} onClick={()=>setActive(i)} style={{
                  flex:'0 0 auto', display:'flex', alignItems:'center', gap:4, padding:'4px 12px', borderRadius:999,
                  fontSize:12.5, fontWeight:700, whiteSpace:'nowrap', cursor:'pointer', transition:'all .15s ease',
                  background:on?'var(--surface)':'transparent',
                  color:on?'var(--brand-strong)':'var(--text-muted)',
                  border:on?'1.5px solid var(--brand)':'1.5px solid var(--hairline)' }}>
                  <Icon name={x.icon} size={13} color={on?'var(--brand-strong)':'var(--text-muted)'} />{x.label}
                </button>
              );
            }
            return (
              <button key={x.key} onClick={()=>setActive(i)} style={{
                flex:'0 0 auto', display:'flex', alignItems:'center', gap:4, padding:'6px 13px', borderRadius:999,
                fontSize:13, fontWeight:on?800:600, whiteSpace:'nowrap', transition:'all .15s ease',
                background:on?'var(--brand)':'var(--surface-2)', color:on?'var(--on-brand,#fff)':'var(--text-muted)',
                border:on?'none':'1px solid var(--hairline)' }}>
                <Icon name={x.icon} size={13} color={on?'var(--on-brand,#fff)':'var(--brand)'} />{x.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'0 14px 8px', fontSize:13.5, fontWeight:800, color:'var(--text)' }}>
          <Icon name={g.icon} size={14} color="var(--brand)" />{g.title || g.label}
          <span style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)' }}>· 为你的行程精选</span>
        </div>
      )}
      {/* 当前业务线对应商品（始终填满 4 张） */}
      <div className="hscroll" style={{ gap:9, padding:'0 14px 10px' }}>
        {g.items.map((it,k)=> <TripRecoCard key={(it.title||'')+k} it={it} bus={bus} line={g.key} />)}
      </div>
    </div>
  );
}

/* 填满 4 张：不足时从同业务线货品池补齐（去重） */
function recoFillTo4(items, line, city, tier){
  const out = (items || []).slice(0, 4);
  if(out.length >= 4) return out;
  const pool = (window.buildFeedCards ? window.buildFeedCards(city, line, tier) : []) || [];
  for(let i=0; i<pool.length && out.length<4; i++){
    const c = pool[i];
    if(!out.some(x=> (x.title||'') === (c.title||''))) out.push(c);
  }
  return out.slice(0, 4);
}

function TripCard({ props, bus, ctx }){
  const t = window.buildTrip((ctx && ctx.city), (ctx && ctx.identity), props.phase);
  const phase = props.phase;
  const head = phase==='onway' ? '行程进行中 · 在途'
             : phase==='done'  ? '欢迎回家 · 行程回顾'
             : t.departText;
  // 行程阶段推荐（非商务出行）：行程前→酒店；行程中→门票；行程后→机票+酒店
  const identity = (ctx && ctx.identity);
  const recoCity = (ctx && ctx.city) || window.fallbackCity(identity);
  const recoTier = (ctx && ctx.tier) || 'value';
  const recoBlocks = identity==='biz' ? []
    : phase==='pre'   ? [{ line:'hotel',  label:'推荐酒店', icon:'bed' }]
    : phase==='onway' ? [{ line:'ticket', label:'推荐门票', icon:'ticket' }]
    : phase==='done'  ? [{ line:'flight', label:'推荐机票', icon:'plane' }, { line:'hotel', label:'推荐酒店', icon:'bed' }]
    : [];
  // 业务线分组：填满 4 张；多业务线（如行程后机票+酒店）以 tab 切换
  const recoGroups = recoBlocks.map(b=>({
    key: b.line,
    label: RECO_LINE_LABEL[b.line] || b.label,
    title: b.label,
    icon: b.icon,
    items: recoFillTo4((window.buildFeedCards ? window.buildFeedCards(recoCity, b.line, recoTier) : []), b.line, recoCity, recoTier),
  })).filter(g=> g.items.length);
  return (
    <section className="floor floor-enter" style={{ padding:'0 14px' }}>
      <div className="card" style={{ overflow:'hidden' }}>
        {/* 顶部色块 — 仅显示路线，不放航班号（浅色品牌色块，不用渐变） */}
        <div style={{ padding:'9px 14px', background:'color-mix(in srgb, var(--brand) 38%, #fff)', color:'var(--brand-strong)', display:'flex', alignItems:'baseline', gap:9, flexWrap:'wrap' }}>
          <div style={{ fontSize:'var(--fs-h1)', fontWeight:900, display:'flex', alignItems:'center', gap:7 }}>
            {t.from} <Icon name="plane" size={15} color="currentColor" /> {t.to}
          </div>
          <div style={{ fontSize:11.5, opacity:.85 }}>{head}</div>
        </div>
        {/* 行程段 */}
        <div style={{ padding:'10px 14px' }}>
          {t.segs.map((s,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'5px 0' }}>
              <Icon name={s.type==='flight'?'plane':s.type==='hotel'?'bed':'case'} size={15}
                color={phase==='onway'&&i===0?'var(--brand)':'var(--text-muted)'} />
              <div style={{ flex:1, fontSize:13, color:'var(--text)', fontWeight: phase==='onway'&&i===0?700:400 }}>{s.label}</div>
              <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{s.time}</div>
            </div>
          ))}
        </div>
        {/* 行程阶段推荐商品（非商务出行）：插入在行程卡片底部 */}
        {recoGroups.length > 0 && <RecoLineTabs groups={recoGroups} bus={bus} variant="coupon" />}
      </div>
    </section>
  );
}

/* ---------------- 5.9 行程规划 ---------------- */
function TripPlan({ props, bus }){
  const tipByIdentity = {
    biz:'已为差旅插入「会议动线 + 酒店动线」',
    family:'已为亲子插入「适龄活动」建议',
    event:'已为展演插入「演出当天动线」',
    solo:'AI 可一键补齐玩乐与餐厅',
  };
  const days = [
    { day:'Day 1', items:['抵达 · 酒店入住', props.identity==='biz'?'客户会议':'热门玩乐'] },
    { day:'Day 2', items:[props.identity==='family'?'亲子乐园':'城市探索', '当地美食'] },
  ];
  return (
    <FloorShell title={<span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="cal" size={15} color="var(--brand)" />行程规划</span>} dot={false} more="AI 帮我排">
      <div style={{ padding:'0 14px' }}>
        <div className="card" style={{ padding:12 }}>
          <div style={{ fontSize:12, color:'var(--brand-strong)', marginBottom:9 }}>{tipByIdentity[props.identity]||tipByIdentity.solo}</div>
          {days.map((d,i)=>(
            <div key={i} style={{ display:'flex', gap:10, paddingBottom:10 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ width:7, height:7, borderRadius:99, background:'var(--brand)' }} />
                {i<days.length-1 && <div style={{ flex:1, width:2, background:'var(--hairline)', margin:'2px 0' }} />}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:800, color:'var(--text)' }}>{d.day}</div>
                <div style={{ display:'flex', gap:6, marginTop:5, flexWrap:'wrap' }}>
                  {d.items.map(it=> <span key={it} style={{ fontSize:12.5, padding:'4px 9px', borderRadius:7, background:'var(--surface-2)', color:'var(--text)' }}>{it}</span>)}
                  <button onClick={()=>bus.toast('添加玩乐/门票/餐厅')} style={{ fontSize:12.5, padding:'4px 9px', borderRadius:7, border:'1px dashed var(--brand)', color:'var(--brand)' }}>+ 添加</button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-block" onClick={()=>bus.toast('AI 正在为你生成完整行程…')}>AI 一键生成行程</button>
        </div>
      </div>
    </FloorShell>
  );
}

/* ---------------- 5.10 家庭档案 ---------------- */
function FamilyProfile({ props, bus, ctx }){
  const fam = ctx.family;
  if(fam.filled){
    const chipStyle = {
      padding:'5px 12px', borderRadius:999, fontSize:13, fontWeight:600,
      background:'rgba(255,252,244,.62)', border:'1px solid rgba(176,138,52,.34)', color:'#1A1208',
      flexShrink:0, whiteSpace:'nowrap',
    };
    return (
      <section className="floor floor-enter">
        <div style={{ margin:'10px 14px 0', borderRadius:6,
          background:'linear-gradient(150deg, #FDEDCE 0%, #FBE4B6 100%)',
          border:'1.5px solid #F0D592',
          padding:'10px 12px', display:'flex', alignItems:'center', gap:8 }}>
          <Icon name="family3" size={22} color="#F5921E" style={{ flexShrink:0 }} />
          <div style={{ display:'flex', gap:6, overflowX:'auto', flex:1, scrollbarWidth:'none' }}>
            <span style={chipStyle}>{fam.adults}位成人</span>
            {fam.children.length > 0 && <span style={chipStyle}>{fam.children.length}位儿童</span>}
            {fam.children.map((c,i)=> <span key={i} style={chipStyle}>{c.age===0?'<1岁':c.age+'岁'}</span>)}
          </div>
          <button onClick={()=>bus.openFamily()} style={{ display:'flex', alignItems:'center', flexShrink:0, padding:'2px' }}>
            <Icon name="chevR" size={18} color="#8A6A2A" />
          </button>
        </div>
      </section>
    );
  }
  return (
    <FloorShell title={<span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="family3" size={15} color="var(--brand)" />我的家庭档案</span>} dot={false}>
      <div style={{ padding:'0 14px' }}>
        <div className="card" style={{ padding:12, position:'relative', overflow:'hidden', borderRadius:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'var(--text)' }}>填写我的家庭档案</div>
              <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2, lineHeight:1.4 }}>解锁更懂娃的推荐，领取专属亲子礼包</div>
            </div>
            <button className="btn" onClick={()=>bus.openFamily()} style={{ textAlign:'center', minWidth:96, flexShrink:0 }}>去填写</button>
          </div>
        </div>
      </div>
    </FloorShell>
  );
}

/* ---------------- 5.11 商旅差旅助手 ---------------- */
function BizProductRow({ it, bus }){
  const tags = (it.tags || []).slice(0, 2);
  const sub = it.sub;
  return (
    <div onClick={()=>bus.toast(`查看「${it.title}」`)} style={{ display:'flex', gap:10, padding:'9px 0', borderBottom:'1px solid var(--hairline)', cursor:'pointer' }}>
      <Ph label={it.img || it.title} photo w={52} h={52} r={9} style={{ flexShrink:0 }} />
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize:13.5, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
        {sub && <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:2 }}>{sub}</div>}
        {/* 价格与左侧营销标签底部对齐：划线价在卖价左、折扣在卖价上方 */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:8, marginTop:'auto', paddingTop:5 }}>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', minWidth:0 }}>
            {tags.map(t=> <span key={t} className="tag">{t}</span>)}
          </div>
          <div style={{ flexShrink:0 }}>
            <PriceBlock price={it.price} seed={it.title} rate={0.7} size={15} side="right" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BizTravel({ props, bus, ctx }){
  const d = window.DATA.bizTravel;
  const recCity = (ctx && ctx.city) || window.fallbackCity('biz');
  const phase = (props && props.phase) || (ctx && ctx.state) || 'S2';
  const [addr, setAddr] = useState(window.bizAddrFor(recCity));
  const [editing, setEditing] = useState(false);
  const [budget, setBudget] = useState(d.budget);
  useEffect(()=>{ setAddr(window.bizAddrFor(recCity)); }, [recCity]);

  const sections = window.buildBizSections(recCity, phase, budget) || [];
  const tier = (ctx && ctx.tier) || 'value';
  // 业务线分组：每条业务线填满 4 张；多业务线以 tab 切换（机票 / 酒店…）
  const groups = sections.map(sec=>({
    key: sec.key,
    label: RECO_LINE_LABEL[sec.key] || sec.title,
    title: sec.title,
    icon: sec.icon,
    items: recoFillTo4(sec.items, sec.key, recCity, tier),
  })).filter(g=> g.items.length);

  return (
    <FloorShell title={<span style={{display:'flex',alignItems:'center',gap:6}}><Icon name="case" size={15} color="var(--brand)" />差旅助手</span>} dot={false}>
      <div style={{ padding:'0 14px' }}>
        <div className="card" style={{ paddingTop:12, paddingBottom:2, paddingLeft:0, paddingRight:0 }}>
          <div style={{ padding:'0 14px' }}>
            <div style={{ display:'flex', gap:7, marginBottom:10, alignItems:'stretch' }}>
              <div style={{ flex:'1 1 0', minWidth:0, background:'var(--surface-2)', borderRadius:9, padding:'7px 11px' }}>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>出差地点</div>
                {editing ? (
                  <input autoFocus value={addr} onChange={e=>setAddr(e.target.value)}
                    onBlur={()=>setEditing(false)}
                    onKeyDown={e=>{ if(e.key==='Enter') setEditing(false); }}
                    style={{ width:'100%', border:'none', borderBottom:'1.5px solid var(--brand)', background:'transparent', fontSize:13.5, fontWeight:700, color:'var(--text)', outline:'none', padding:'1px 0' }} />
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ fontSize:13.5, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', flex:1, minWidth:0 }}>{addr}</span>
                    <button onClick={()=>setEditing(true)} aria-label="编辑出差地点" style={{ display:'flex', alignItems:'center', padding:0, flexShrink:0 }}>
                      <Icon name="edit" size={12} color="var(--brand)" />
                    </button>
                  </div>
                )}
              </div>
              <div style={{ flex:'0 0 96px', background:'var(--surface-2)', borderRadius:9, padding:'7px 11px' }}>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>预算 / 晚</div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>¥{budget}</div>
              </div>
            </div>
            <input type="range" min="500" max="1200" step="20" value={budget} onChange={e=>setBudget(+e.target.value)} style={{ width:'100%', accentColor:'var(--brand)', marginBottom:10 }} />
          </div>
          {/* 业务线货品：单业务线显示标题，多业务线显示 tab */}
          {groups.length > 0 && <RecoLineTabs groups={groups} bus={bus} />}
        </div>
      </div>
    </FloorShell>
  );
}

/* ---------------- 5.12 展演周边打包 ---------------- */
function EventBundle({ props, bus, ctx }){
  const city = (ctx && ctx.city) || window.fallbackCity('event');
  const e = { ...window.DATA.eventBundle, show: window.eventShowFor(city) };
  return (
    <section className="floor floor-enter" style={{ padding:'0 14px' }}>
      <div className="card" style={{ overflow:'hidden' }}>
        <Ph label={e.show.poster} photo h={100} r={0}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(18,14,34,.82) 0%,rgba(18,14,34,.42) 56%,rgba(18,14,34,.12) 100%)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 16px' }}>
            <div style={{ color:'#fff', fontSize:17, fontWeight:900, textShadow:'var(--neon, none)', lineHeight:1.2 }}>{e.show.name}</div>
            <div style={{ color:'rgba(255,255,255,.84)', fontSize:12, marginTop:3 }}>{e.show.venue} · {e.show.date}</div>
          </div>
        </Ph>
        <div style={{ padding:'11px 13px' }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:3 }}>看完演出走回酒店 · 周边打包</div>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>酒店 + 门票 + 接驳，一键搞定</div>
          {e.bundles.map((b,i)=>(
            <div key={i} onClick={()=>bus.toast('预订该打包方案')} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px', borderRadius:'var(--radius)', background:'var(--surface-2)', marginBottom:7 }}>
              <Icon name="stub" size={22} color="var(--brand)" />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:'var(--text)' }}>{b.hotel}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:1 }}>{b.ticket} · 含场馆接驳</div>
              </div>
              <div className="price" style={{ fontSize:16 }}><span className="cur">¥</span>{b.total}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5.13b 高端会籍（固定置顶 · 会员等级 + 权益） ---------------- */
// 会籍阶梯图标（还原 Trip REWARDS 各等级徽记）：深色六边形 + 彩色 “T”
// 普卡蓝 / 银卡金 / 金卡青 / 铂金紫 / 黑钻前一级靛蓝
const HEX_CLIP = 'polygon(50% 1%,93% 25.5%,93% 74.5%,50% 99%,7% 74.5%,7% 25.5%)';
const MB_TIERS = [
  '#3E9BF5',  // 蓝
  '#F4A623',  // 金
  '#16BEC4',  // 青
  '#9B5CF0',  // 紫
  '#5B6CF0',  // 靛蓝
];
// 单个等级六边形徽记：深紫底 + 彩色描边 + 同色 “T”
function MBHex({ color, size=26 }){
  const s = size;
  return (
    <div style={{ position:'relative', width:s, height:s, flex:'0 0 auto' }}>
      {/* 彩色光晕 */}
      <div style={{ position:'absolute', inset:-s*0.18, borderRadius:'50%',
        background:`radial-gradient(circle, ${color}33, transparent 70%)`, pointerEvents:'none' }} />
      {/* 彩色描边层 */}
      <div style={{ position:'absolute', inset:0, clipPath:HEX_CLIP,
        background:`linear-gradient(160deg, ${color}, ${color}99)` }} />
      {/* 深色内胆 */}
      <div style={{ position:'absolute', inset:s*0.085, clipPath:HEX_CLIP,
        background:'linear-gradient(165deg,#3a3656 0%,#262340 55%,#1c1930 100%)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,.16)' }} />
      {/* T 标记 */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:s*0.5, fontWeight:800, fontFamily:'var(--serif)', color, lineHeight:1,
          textShadow:`0 0 6px ${color}66` }}>T</span>
      </div>
    </div>
  );
}
// 黑钻徽记（向下明亮式切面 · 干净对称 SVG）；ring=阶梯里的金圈版
let __gemUid = 0;
function GemDiamond({ d }){
  const big = d >= 38;
  const uid = React.useMemo(()=> 'gem'+(++__gemUid), []);
  const bw = Math.max(1, d*0.038);
  // 干净对称几何：顶边 20–80，最宽腰线 y26（4–96），收至底尖 (50,97)
  const F = [
    { p:'20,8 50,8 50,26 4,26',   g:['#e6e4ee','#b4b2c0'], a:135 },   // 左冠（亮）
    { p:'50,8 80,8 96,26 50,26',  g:['#d6d4e0','#a3a1b0'], a:225 },  // 右冠
    { p:'4,26 27,26 50,97',       g:['#9b99a5','#4a4854'], a:120 },   // 远左亭（亮）
    { p:'27,26 50,26 50,97',      g:['#5c5a66','#1e1c28'], a:90 },    // 近左亭（暗）
    { p:'50,26 73,26 50,97',      g:['#524f5b','#1a1822'], a:90 },    // 近右亭（暗）
    { p:'73,26 96,26 50,97',      g:['#a6a3b0','#54515d'], a:240 },   // 远右亭（亮）
  ];
  const OUT = '20,8 80,8 96,26 50,97 4,26';
  return (
    <div style={{ position:'relative', width:d, height:d }}>
      <svg viewBox="0 0 100 100" width={d} height={d} style={{ overflow:'visible', display:'block',
        filter:'drop-shadow(0 3px 4px rgba(0,0,0,.45))' }}>
        <defs>
          {F.map((f,i)=>(
            <linearGradient key={i} id={`${uid}-${i}`} gradientTransform={`rotate(${f.a} .5 .5)`}>
              <stop offset="0" stopColor={f.g[0]} />
              <stop offset="1" stopColor={f.g[1]} />
            </linearGradient>
          ))}
          <radialGradient id={`${uid}-tbl`} cx="0.5" cy="0.1" r="0.7">
            <stop offset="0" stopColor="rgba(255,255,255,.7)" />
            <stop offset="0.55" stopColor="rgba(255,255,255,.12)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id={`${uid}-rim`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,.7)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,.1)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {F.map((f,i)=>(
          <polygon key={i} points={f.p} fill={`url(#${uid}-${i})`} />
        ))}
        {/* 顶台柔光 */}
        <polygon points="20,8 80,8 96,26 4,26" fill={`url(#${uid}-tbl)`} />
        {/* 主切面接缝（极淡，增加立体感） */}
        <g stroke="rgba(255,255,255,.28)" strokeWidth="0.5" fill="none" strokeLinecap="round">
          <path d="M4,26 96,26" />
          <path d="M27,26 50,97" opacity=".4" />
          <path d="M73,26 50,97" opacity=".4" />
        </g>
        <g stroke="rgba(0,0,0,.22)" strokeWidth="0.5" fill="none">
          <path d="M50,26 50,97" />
          <path d="M50,8 50,26" opacity=".5" />
        </g>
        {/* 外缘亮边 */}
        <polygon points={OUT} fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="1" strokeLinejoin="round" />
        {/* 顶部弧光高光 */}
        <ellipse cx="36" cy="13" rx="9" ry="2.4" fill="rgba(255,255,255,.6)" transform="rotate(-12 36 13)" />
        <circle cx="80" cy="22" r="1.5" fill="#fff" opacity=".85" />
      </svg>
      {/* 金边 T 徽标 */}
      {big ? (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:d*0.2 }}>
          <div style={{ width:d*0.35, height:d*0.12, borderRadius:Math.max(2,d*0.035),
            border:`${bw}px solid #CBA258`, background:'linear-gradient(180deg,#d2d0dc,#8d8b96)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.65), 0 1px 2px rgba(0,0,0,.4)' }} />
          <div style={{ width:d*0.135, height:d*0.26, marginTop:-bw, borderTop:'none',
            border:`${bw}px solid #CBA258`, background:'linear-gradient(180deg,#b0aeba,#62606b)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.45), 0 1px 2px rgba(0,0,0,.4)' }} />
        </div>
      ) : (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', paddingTop:d*0.02 }}>
          <span style={{ fontSize:d*0.4, fontWeight:800, fontFamily:'var(--serif)', lineHeight:1,
            background:'linear-gradient(180deg,#F4DCA0,#C8A24E)', WebkitBackgroundClip:'text', backgroundClip:'text',
            WebkitTextFillColor:'transparent', filter:'drop-shadow(0 1px 0 rgba(0,0,0,.5))' }}>T</span>
        </div>
      )}
    </div>
  );
}
function MBGem({ size=64, glow=true, ring=false }){
  const s = size;
  if(ring){
    return (
      <div style={{ position:'relative', width:s, height:s, flex:'0 0 auto' }}>
        {glow && <div style={{ position:'absolute', inset:-s*0.26, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(214,184,120,.4), transparent 70%)', pointerEvents:'none' }} />}
        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
          background:'radial-gradient(circle at 50% 36%, #2c2536, #15111d)',
          border:`${Math.max(1.2,s*0.05)}px solid #CBA258`,
          boxShadow:'0 0 0 1px rgba(0,0,0,.35), 0 2px 5px rgba(0,0,0,.4)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <GemDiamond d={s*0.62} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ position:'relative', width:s, height:s, flex:'0 0 auto' }}>
      {glow && <div style={{ position:'absolute', inset:-s*0.36, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(198,190,222,.4), rgba(150,140,180,.12) 48%, transparent 72%)', pointerEvents:'none' }} />}
      {/* 底部投影 */}
      <div style={{ position:'absolute', left:'22%', bottom:-s*0.02, width:'56%', height:s*0.09, borderRadius:'50%',
        background:'radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%)', filter:'blur(1px)' }} />
      <GemDiamond d={s} />
      {/* 高光点 */}
      <div style={{ position:'absolute', top:s*0.08, right:s*0.2, width:s*0.15, height:s*0.15, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(255,250,240,.7),transparent 66%)', filter:'blur(.5px)', pointerEvents:'none' }} />
    </div>
  );
}
function MemberBenefits({ props, bus }){
  const d = window.DATA.memberBenefits;
  const onPerk = (p)=> bus && bus.toast && bus.toast(`「${p.title}」尊享权益`);
  const ladder = [...MB_TIERS, 'gem'];          // 5 等级徽记 + 黑钻
  const current = ladder.length - 1;            // 黑钻为当前等级
  return (
    <section className="floor floor-enter" style={{ padding:'0 14px' }} data-mod-inner="memberBenefits">
      <div className="member-card" style={{ position:'relative', overflow:'hidden', borderRadius:'var(--radius)',
        background:'var(--surface)', border:'1px solid color-mix(in srgb,var(--brand) 24%, transparent)',
        boxShadow:'0 2px 6px rgba(90,82,52,.08), 0 16px 34px rgba(60,52,82,.16)' }}>

        {/* —— 黑钻会籍头部（深黑金色 · 非纯黑） —— */}
        <div style={{ position:'relative', overflow:'hidden', padding:'10px 16px 9px',
          background:'linear-gradient(150deg, #2c2114 0%, #211910 40%, #191108 72%, #140d07 100%)' }}>
          {/* 右上金色柔光 */}
          <div style={{ position:'absolute', top:-90, right:-50, width:260, height:260, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(214,176,98,.5) 0%, rgba(184,142,70,.2) 40%, transparent 70%)', pointerEvents:'none' }} />
          {/* 底部暖色回光，使过渡更柔和 */}
          <div style={{ position:'absolute', bottom:-70, left:-30, width:220, height:160, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(150,112,52,.22), transparent 70%)', pointerEvents:'none' }} />
          {/* 斜向光带（金） */}
          <div style={{ position:'absolute', top:-30, left:'12%', width:3, height:240, transform:'rotate(26deg)',
            background:'linear-gradient(180deg, transparent, rgba(244,214,140,.22), transparent)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:-30, left:'28%', width:2, height:240, transform:'rotate(26deg)',
            background:'linear-gradient(180deg, transparent, rgba(244,214,140,.12), transparent)', pointerEvents:'none' }} />

          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:22, lineHeight:1.02, fontWeight:700, fontFamily:'var(--serif)',
                background:'linear-gradient(176deg,#FFF7E6 0%,#F2DCA8 46%,#D8B36A 100%)',
                WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
                filter:'drop-shadow(0 1px 1px rgba(0,0,0,.35))' }}>{d.tierName}</div>
              <div style={{ fontSize:11, color:'#C9B58C', marginTop:3 }}>{d.summary}</div>
            </div>
            {/* 黑钻徽记 */}
            <MBGem size={64} />
          </div>

          {/* 会籍阶梯（仅图标，无文字） */}
          <div style={{ position:'relative', display:'flex', alignItems:'center', marginTop:9, padding:'0 2px' }}>
            {ladder.map((item, i)=>{
              const isGem = item === 'gem';
              return (
                <React.Fragment key={i}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto',
                    position:'relative', zIndex:2 }}>
                    {isGem
                      ? <MBGem size={26} ring={true} glow={true} />
                      : <MBHex color={item} size={20} />}
                  </div>
                  {i < ladder.length-1 && (
                    <span style={{ flex:1, height:2, borderRadius:2, margin:'0 1px',
                      background:'linear-gradient(90deg, rgba(224,192,131,.42), rgba(224,192,131,.22))' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* —— 会员权益（保持原浅色调） —— */}
        <div style={{ padding:'8px 0 9px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 6px' }}>
            <span style={{ fontSize:12, fontWeight:800, color:'var(--text)' }}>专属会员权益</span>
            <span style={{ display:'flex', alignItems:'center', gap:2, fontSize:11, color:'var(--brand-strong)' }}>
              全部 {d.perks.length} 项<Icon name="chevR" size={11} color="var(--brand-strong)" />
            </span>
          </div>
          <div className="hscroll" style={{ gap:9, padding:'1px 16px 2px' }}>
            {d.perks.map((p)=>(
              <button key={p.title} onClick={()=>onPerk(p)} style={{ flex:'0 0 auto', width:118, textAlign:'center',
                display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'9px 8px 9px',
                borderRadius:12, background:'var(--surface)', border:'1px solid color-mix(in srgb,var(--brand) 16%, transparent)',
                boxShadow:'0 1px 4px rgba(90,82,52,.05)' }}>
                <span style={{ width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
                  background:'linear-gradient(135deg,#F3EDD8,#E3D5AE)', boxShadow:'inset 0 1px 0 rgba(255,255,255,.6)' }}>
                  <Icon name={p.icon} size={17} color="#6E6147" />
                </span>
                <span style={{ fontSize:11.5, fontWeight:700, color:'var(--text)', lineHeight:1.2, whiteSpace:'nowrap' }}>{p.title}</span>
                <span style={{ fontSize:9.5, color:'var(--text-muted)', lineHeight:1.15, whiteSpace:'nowrap' }}>{p.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 5.13/5.14 高端 Banner ---------------- */
const BANNER_ICON = { seat:'bed', board:'plane', lounge:'spark', service:'bell', car:'car', upgrade:'plus', butler:'user' };
function PremiumService({ title, data, items, bus }){
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const b = data.banners;
  function onScroll(){
    const el = ref.current; if(!el) return;
    setI(Math.max(0, Math.min(b.length-1, Math.round(el.scrollLeft / (el.clientWidth||1)))));
  }
  function go(idx){
    const el = ref.current; if(!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior:'smooth' });
  }
  return (
    <FloorShell title={<span style={{fontSize:'var(--fs-h1)',fontFamily:'var(--font-title)'}}>{title}</span>}>
      <div style={{ padding:'0 14px' }}>
        <div className="card" style={{ overflow:'hidden' }}>
          <div style={{ position:'relative' }}>
            <div ref={ref} onScroll={onScroll} style={{ display:'flex', overflowX:'auto', scrollSnapType:'x mandatory', scrollbarWidth:'none', msOverflowStyle:'none', WebkitOverflowScrolling:'touch' }}>
              {b.map((x,idx)=>(
                <div key={idx} style={{ flex:'0 0 100%', scrollSnapAlign:'start', position:'relative' }}>
                  <Ph label={x.img || x.title} src={x.src} photo h={118} r={0}>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg,rgba(10,9,6,.88) 0%,rgba(10,9,6,.5) 52%,rgba(10,9,6,.1) 100%)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                        <span style={{ width:28, height:28, borderRadius:8, background:'rgba(201,162,75,.14)', border:'1px solid var(--brand)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <Icon name={BANNER_ICON[x.icon]||'spark'} size={14} color="var(--brand)" />
                        </span>
                        <span style={{ fontSize:11, color:'var(--brand)', letterSpacing:1.5 }}>尊享服务 0{idx+1}</span>
                      </div>
                      <div style={{ fontSize:21, fontWeight:600, fontFamily:'var(--serif)', color:'#F6F1E6', textShadow:'0 2px 8px rgba(0,0,0,.4)' }}>{x.title}</div>
                      <div style={{ fontSize:13, color:'rgba(246,241,230,.82)', marginTop:5, maxWidth:'78%' }}>{x.desc}</div>
                    </div>
                  </Ph>
                </div>
              ))}
            </div>
            <div style={{ position:'absolute', bottom:10, left:20, display:'flex', gap:5 }}>
              {b.map((_,idx)=>(
                <button key={idx} onClick={()=>go(idx)} style={{ padding:0, width:i===idx?16:6, height:6, borderRadius:99, background:i===idx?'var(--brand)':'rgba(201,162,75,.4)', transition:'width .3s, background .3s' }} />
              ))}
            </div>
          </div>
          <div style={{ padding:'11px 13px' }}>
            {items.map((c,idx)=>(
              <div key={idx} onClick={()=>bus.toast(`预订「${c.name||c.route}」`)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom: idx<items.length-1?'1px solid var(--hairline)':'none' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:600, fontFamily:'var(--serif)', color:'var(--text)' }}>{c.name || c.route}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{c.cabin ? c.cabin+' · ' : ''}{c.perks.join(' / ')}</div>
                </div>
                <div className="price" style={{ fontSize:16 }}><span className="cur">¥</span>{c.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FloorShell>
  );
}
function AirlinePremium({ bus }){ const d=window.DATA.airlinePremium; return <PremiumService title="航司尊享服务" data={d} items={d.cabins} bus={bus} />; }
function HotelPremium({ bus }){ const d=window.DATA.hotelPremium; return <PremiumService title="酒店尊享服务" data={d} items={d.hotels} bus={bus} />; }
function TicketVIP({ bus }){
  const d = window.DATA.ticketVIP;
  return (
    <FloorShell title="门票 VIP 权益">
      <div style={{ padding:'0 14px' }}>
        <div className="card" style={{ padding:'11px 13px' }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
            {d.perks.map(p=> <span key={p} className="tag" style={{ fontSize:12, padding:'3px 8px' }}>✓ {p}</span>)}
          </div>
          {d.tickets.map((t,i)=>(
            <div key={i} onClick={()=>bus.toast(`预订「${t.name}」`)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderTop:'1px solid var(--hairline)' }}>
              <Icon name="stub" size={20} color="var(--brand)" />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600, fontFamily:'var(--serif)', color:'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{t.perks.join(' / ')}</div>
              </div>
              <div className="price" style={{ fontSize:16 }}><span className="cur">¥</span>{t.price}</div>
            </div>
          ))}
        </div>
      </div>
    </FloorShell>
  );
}

/* ---------------- 旅行豆酒店 (solo·value 专属) ---------------- */
function CoinHotels({ props, bus }){
  const hotels = window.DATA.feeds.filter(f => f.line==='hotel').slice(0, 5);
  return (
    <section className="floor floor-enter">
      {/* 琥珀渐变标题栏 */}
      <div style={{
        margin:'0 14px', borderRadius:'var(--radius) var(--radius) 0 0',
        background:'linear-gradient(118deg, #F0BE78 0%, #D98C4C 100%)',
        padding:'11px 14px', display:'flex', alignItems:'center', gap:8,
        position:'relative', overflow:'hidden',
      }}>
        {/* T 徽章 */}
        <div style={{ width:28, height:28, borderRadius:999, background:'rgba(255,255,255,.25)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:14, fontWeight:900, color:'#fff', letterSpacing:-.5 }}>T</span>
        </div>
        <div style={{ flex:1 }}>
          <span style={{ fontSize:14.5, fontWeight:900, color:'#fff' }}>旅行豆酒店：</span>
          <span style={{ fontSize:14.5, fontWeight:900, color:'#FFF0A0' }}>赚取 5% 旅行豆</span>
        </div>
        {/* 右侧箭头圆 */}
        <div style={{ width:38, height:38, borderRadius:999, background:'rgba(255,255,255,.18)',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          fontSize:21, fontWeight:900, color:'rgba(255,255,255,.8)', lineHeight:1 }}>›</div>
        {/* 背景装饰圆 */}
        <div style={{ position:'absolute', right:-18, top:-18, width:88, height:88, borderRadius:999, background:'rgba(255,255,255,.07)' }} />
        <div style={{ position:'absolute', right:22, bottom:-30, width:64, height:64, borderRadius:999, background:'rgba(255,255,255,.05)' }} />
      </div>
      {/* 酒店卡片横滑区 */}
      <div style={{ background:'var(--surface-2)', borderRadius:'0 0 var(--radius) var(--radius)',
        margin:'0 14px 2px', padding:'0 0 12px' }}>
        <div className="hscroll" style={{ padding:'10px 14px 2px' }}>
          {hotels.map((h, idx) => {
            const coinAmt = Math.round(h.price * 0.05 * 10);
            return (
              <div key={idx} className="card" style={{ width:188, overflow:'hidden', flexShrink:0 }}
                onClick={()=>bus.toast(`查看「${h.title}」`)}>
                <Ph label={h.img} photo h={112} r={0} />
                <div style={{ padding:'8px 9px 10px' }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:'var(--text)', lineHeight:1.3, height:30, overflow:'hidden' }}>{h.title}</div>
                  <div style={{ display:'flex', gap:3, flexWrap:'wrap', margin:'4px 0 5px' }}>
                    {h.tags.slice(0,2).map(t=> <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <span className="price" style={{ fontSize:16 }}><span className="cur">¥</span>{h.price}</span>
                    <span style={{ fontSize:10.5, color:'var(--price-color)', fontWeight:700 }}>{h.score}</span>
                  </div>
                  <div style={{ marginTop:4, display:'flex', alignItems:'center', gap:4, fontSize:10.5, color:'var(--text-muted)' }}>
                    <span style={{ width:14, height:14, borderRadius:999, background:'#F4BE2A', color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, flexShrink:0 }}>T</span>
                    <span>赚取</span>
                    <strong style={{color:'var(--coin-color)'}}>{coinAmt}</strong>
                    <span>Trip Coins</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 附近目的地推荐（展演/商务：周边短途，可左右滑动 + 点击展开详情） ---------------- */
// 交通工具 icon 与描述对应：飞行→飞机，车程/市内→汽车，其余（高铁/动车）→火车
function nearbyTransportIcon(time){
  const t = String(time || '');
  if(/飞行|飞机|航班|乘机|空运/.test(t)) return 'plane';
  if(/车程|自驾|驾车|大巴|班车|巴士|打车|包车|市内|步行/.test(t)) return 'car';
  if(/船|渡轮|轮渡|游船/.test(t)) return 'car';
  return 'train';
}
function NearbyDest({ props, bus, ctx }){
  const city = (ctx && ctx.city) || props.city || window.fallbackCity((ctx && ctx.identity));
  const list = window.buildNearbyDest(city);
  const [sel, setSel] = useState(null);
  const rowRef = useRef(null);
  const sectionRef = useRef(null);
  const anchorRef = useRef(null);          // 紧贴卡片行上方的非吸顶锚点，用于精确回到「卡片行」位置
  const cardRefs = useRef({});
  useEffect(()=>{ setSel(null); }, [city]);

  const selDest = list.find(d => d.city === sel);
  const isFamily = (ctx && ctx.identity) === 'family';
  const DestDetail = window.DestDetail;

  function findScroller(el){
    let n = el ? el.parentElement : null;
    while(n){
      const oy = getComputedStyle(n).overflowY;
      if((oy==='auto'||oy==='scroll') && n.scrollHeight - n.clientHeight > 5) return n;
      n = n.parentElement;
    }
    return null;
  }
  function centerX(node){
    const row = rowRef.current; if(!row || !node) return;
    const target = node.offsetLeft - (row.clientWidth - node.clientWidth)/2;
    row.scrollTo({ left: Math.max(0, target), behavior:'smooth' });
  }
  // 把卡片行（锚点）滚到滚动区顶部；instant=true 用于收起时先锚定，杜绝详情卸载导致的闪动
  function rowToTop(instant){
    const sc = findScroller(sectionRef.current), anchor = anchorRef.current;
    if(!sc || !anchor) return;
    const top = sc.scrollTop + (anchor.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 6;
    if(instant){
      const prev = sc.style.scrollBehavior;
      sc.style.scrollBehavior = 'auto';
      sc.scrollTop = Math.max(0, top);
      sc.style.scrollBehavior = prev || '';
    } else {
      sc.scrollTo({ top: Math.max(0, top), behavior:'smooth' });
    }
  }
  function pick(c){
    if(sel === c){
      // 收起：先把视口锚定到卡片行（瞬时），再卸载详情 —— 视口锚点不动，无闪动
      rowToTop(true);
      setSel(null);
      return;
    }
    // 切换/展开：无论当前浏览到哪，都先回到顶部卡片行位置。
    // 用瞬时锚定（详情切换会重挂载、打断平滑滚动，故不用 smooth），锚点位置只取决于卡片行上方内容，可靠。
    setSel(c);
    rowToTop(true);
    requestAnimationFrame(()=> centerX(cardRefs.current[c]));
  }

  return (
    <section ref={sectionRef} className="floor floor-enter">
      <div className="floor-head">
        <h2 className="floor-title"><Icon name="compass" size={15} color="var(--brand)" />附近目的地推荐</h2>
      </div>
      <div style={{ padding:'0 14px', marginTop:-2, marginBottom:8, fontSize:12, color:'var(--text-muted)' }}>从 {city} 出发，周边短途热门目的地</div>

      <div ref={anchorRef} aria-hidden="true" style={{ height:0 }} />
      {/* 横滑目的地卡片（展开后吸顶，直到整个模块滑出再松开） */}
      <div ref={rowRef} className="hscroll"
        style={ sel
          ? { paddingTop:2, paddingBottom:8, gap:10, position:'sticky', top:0, zIndex:20,
              background:'var(--bg)' }
          : { paddingTop:2, paddingBottom:8, gap:10 } }>
        {list.map(d => {
          const on = d.city === sel;
          return (
            <button key={d.city} ref={el => (cardRefs.current[d.city] = el)} onClick={()=>pick(d.city)}
              style={{ flex:'0 0 auto', width:214, padding:0, borderRadius:'var(--radius)', overflow:'hidden',
                position:'relative', background:'var(--surface)', textAlign:'left',
                transition:'transform .2s ease, box-shadow .2s ease',
                border:'none',
                boxShadow: on ? '0 3px 10px rgba(0,0,0,.10)' : '0 0 0 1px rgba(26,24,33,.06)',
                transform: on ? 'translateY(-2px)' : 'none' }}>
              {/* 选中描边：覆盖整张卡片的圆角描边层（置于图文之上、随卡片圆角裁切，完整框住整张卡片） */}
              {on && (
                <div style={{ position:'absolute', inset:0, border:'2px solid var(--brand)', borderRadius:'var(--radius)',
                  pointerEvents:'none', zIndex:5, boxSizing:'border-box' }} />
              )}
              <Ph label={d.img} photo h={96} r={0}>
                <PeekCTA on={on} />
              </Ph>
              <div style={{ padding:'9px 11px 11px' }}>
                {/* 城市标题 + xx%旅客选择（并排） */}
                <div style={{ display:'flex', alignItems:'baseline', gap:7, marginBottom:6 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:'var(--text)', flexShrink:0 }}>{d.city}</span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11.5, color:'var(--text-muted)', whiteSpace:'nowrap' }}>
                    <Icon name="thumb" size={11} color="var(--brand)" /><strong style={{ color:'var(--brand-strong)' }}>{d.pct}%</strong> 旅客选择
                  </span>
                </div>
                {/* 距离（交通工具 icon 与描述对应）+ 建议游玩天数 */}
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-muted)', marginBottom:4 }}>
                  <Icon name={nearbyTransportIcon(d.time)} size={12} color="var(--brand)" /><span>距 {city} <strong style={{ color:'var(--text)' }}>{d.time}</strong></span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>
                  <Icon name="cal" size={12} color="var(--brand)" /><span>建议玩 <strong style={{ color:'var(--text)' }}>{d.days}</strong></span>
                </div>
                {/* 推荐理由（上移，放在建议游玩天数下面） */}
                <div style={{ fontSize:12, lineHeight:1.5, color:'var(--text)', textWrap:'pretty',
                  display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{d.reason}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 点击展开：与单目的地推荐一致的 4 段详情（卡片已展示推荐理由，详情里不再单独展示） */}
      {selDest && DestDetail && <DestDetail key={selDest.city} dest={selDest} isFamily={isFamily} identity={(ctx && ctx.identity) || 'solo'} tier={ctx && ctx.tier} showReason={false} bus={bus} />}
    </section>
  );
}

/* ---------------- 外投广告中插（站外广告内容还原，保证体验一致） ---------------- */
function AdLanding({ props, bus, ctx }){
  const kind = (props.ad && props.ad.kind) || 'coupon';
  const tier = (ctx && ctx.tier) || 'value';
  const onBrand = tier==='premium' ? '#1A1505' : 'var(--on-brand,#fff)';

  let body;
  if(kind === 'coupon'){
    const amount = tier==='premium' ? 1500 : 500;
    const threshold = tier==='premium' ? 8000 : 3000;
    const scope = tier==='premium' ? '国际机票 · 商务舱' : '高奢酒店通用';
    body = (
      <div style={{ display:'flex', alignItems:'center', borderRadius:12, overflow:'hidden', background:'var(--surface)', border:'1.5px solid var(--hairline)', boxShadow:'0 2px 8px rgba(0,0,0,.06)' }}>
        <div style={{ flex:'0 0 92px', alignSelf:'stretch', background:'var(--coupon-grad,var(--brand-grad,var(--brand)))', color:onBrand, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'9px 6px' }}>
          <div style={{ fontSize:25, fontWeight:900, lineHeight:1 }}><span style={{fontSize:14}}>¥</span>{amount}</div>
          <div style={{ fontSize:10.5, marginTop:3, opacity:.92 }}>满{threshold}可用</div>
        </div>
        <div style={{ flex:1, padding:'8px 10px', minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--text)' }}>{scope}大额券</div>
          <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:2 }}>限时领取 · 有效期 7 天</div>
        </div>
        <button className="btn" onClick={()=>bus.toast('已领取广告同款大额券')} style={{ marginRight:10, padding:'7px 16px', fontSize:13, flexShrink:0 }}>领取</button>
      </div>
    );
  } else {
    const it = (window.DATA.flash[kind] || window.DATA.flash.hotel)[0];
    const CAT = { hotel:'酒店', flight:'机票', ticket:'门票' }[kind] || '好物';
    let title = it.title;
    if(kind === 'flight'){
      // 出发城市与 Feeds / 秒杀机票统一为 defaultDepartCity(当前目的地)
      const destCity = (ctx && ctx.city) || window.fallbackCity((ctx && ctx.identity));
      const dep = window.defaultDepartCity(destCity);
      title = `${dep} → ${destCity}`;
    }
    body = (
      <div className="card" style={{ display:'flex', alignItems:'stretch', borderRadius:12, overflow:'hidden', border:'1.5px solid var(--hairline)', boxShadow:'0 2px 8px rgba(0,0,0,.06)' }}>
        <Ph label={it.img} photo w={90} h={90} r={0} style={{ flexShrink:0, alignSelf:'stretch' }} />
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:5, padding:'9px 10px', justifyContent:'center' }}>
          <span style={{ fontSize:13.5, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{title}</span>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:6 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:1 }}>
              <span style={{ fontSize:10, fontWeight:800, color:'var(--brand-strong)', background:'var(--brand-soft)', padding:'0.5px 5px', borderRadius:4, lineHeight:1.3 }}>{it.discount}</span>
              <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                <span className="price" style={{ fontSize:18 }}><span className="cur">¥</span>{it.price}</span>
                <span className="price-origin">¥{it.origin}</span>
              </div>
            </div>
            <button className="btn" onClick={()=>bus.toast(`已加入「${title}」抢购`)} style={{ padding:'6px 14px', fontSize:12.5, flexShrink:0 }}>立即抢</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="floor floor-enter" style={{ padding:'0 14px', marginTop:6 }}>
      <div style={{ borderRadius:16, overflow:'hidden', border:'1.5px solid color-mix(in srgb,var(--brand) 48%, transparent)', boxShadow:'0 12px 30px color-mix(in srgb,var(--brand-strong) 22%, transparent)' }}>
        {/* 强营销头条：突出区分于其它模块 */}
        <div style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 12px', background:'var(--brand-grad,var(--brand))', color:onBrand }}>
          <Icon name="bolt" size={15} color={onBrand} fill={onBrand} />
          <span style={{ fontSize:13.5, fontWeight:800, flex:1, letterSpacing:'.2px' }}>{kind==='coupon' ? '为你保留 · 专属优惠' : '你刚刚浏览过'}</span>
        </div>
        <div style={{ padding:'10px 11px', background:'linear-gradient(180deg, color-mix(in srgb,var(--brand-soft) 72%, #fff 28%), var(--surface) 84%)', overflow:'hidden' }}>{body}</div>
      </div>
    </section>
  );
}

Object.assign(window, { CityHero, AIEntry, Ranking, Posts, TripCard, TripPlan, FamilyProfile, BizTravel, EventBundle, MemberBenefits, AirlinePremium, HotelPremium, TicketVIP, CoinHotels, NearbyDest, AdLanding, MBGem, MBHex, GemDiamond });
