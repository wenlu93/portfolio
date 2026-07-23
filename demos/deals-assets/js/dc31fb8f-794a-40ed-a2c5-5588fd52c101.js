/* ============================================================
   OTA Demo — AG-UI 动态意图修正层
   中插组件(payloads) + 场景脚本(scenes) + 步骤描述
   挂载到 window.AGUI_PAYLOADS / window.AGUI_SCENES
   引擎(eng)由 app.jsx 注入
   ============================================================ */

/* ---------- 图片占位（Unsplash，传 src 给真实 Ph） ---------- */
const AG_PHOTO = {
  island:'photo-1502602898657-3e91760cbb34', beach:'photo-1507525428034-b723cf961d3e',
  aquarium:'photo-1544551763-46a013bb70d5', sunset:'photo-1514282401047-d79a71a590e8',
  culture:'photo-1480714378408-67cf0d13bc1b', street:'photo-1533050487297-09b450131914',
  castle:'photo-1493780474015-ba834fd0ce2f', bridge:'photo-1470229722913-7c0e2dbbafd3',
  resort:'photo-1566073771259-6a8506099945', spa:'photo-1571896349842-33c89424de2d',
  food:'photo-1504674900247-0877df9cc836', sanya:'photo-1505228395891-9a51e7e86bf6',
  xiamen:'photo-1559592413-7cec4d0cae2b', phuket:'photo-1537956965359-7573183d1f57',
  tokyo:'photo-1540959733332-eab4deabeeaf', osaka:'photo-1590559899731-a382839e5549',
  kyoto:'photo-1493976040374-85c8e12f0c0e', dali:'photo-1469474968028-56623f02e42e',
  hotelB:'photo-1611892440504-42a792e24d32', hotelC:'photo-1582719478250-c89cae4dc85b',
};
function agUrl(k){ const id = AG_PHOTO[k]||AG_PHOTO.beach; return (window.__resources && window.__resources['ag_'+id]) || `https://images.unsplash.com/${id}?auto=format&fit=crop&w=480&q=72`; }
function AgPh({ k, label, ...rest }){ return <Ph label={label} src={agUrl(k)} {...rest} />; }

/* ---------- 中插外壳 ---------- */
function AgShell({ icon='spark', title, sub, action, flashKey, children }){
  return (
    <div className="reco-card" style={{ position:'relative', borderRadius:16, overflow:'hidden', background:'var(--surface)',
      border:'1px solid color-mix(in srgb,var(--brand) 26%, var(--hairline))', boxShadow:'0 14px 34px rgba(0,0,0,.10)' }}>
      <span style={{ position:'absolute', left:0, top:0, bottom:0, width:4, zIndex:3, background:'linear-gradient(180deg,var(--brand-strong),var(--brand))' }} />
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px 10px 16px', borderBottom:'1px solid var(--hairline)' }}>
        <span className="reco-live-dot" />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:800, color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}><Icon name={icon} size={15} color="var(--brand)" />{title}</div>
          <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:2 }}>{sub}</div>
        </div>
        {action}
      </div>
      <div key={flashKey} className="reco-fade">{children}</div>
    </div>
  );
}
const agGhost = { background:'var(--brand-soft)', color:'var(--brand-strong)', fontWeight:700, fontSize:12.5, borderRadius:999, padding:'5px 11px', border:'1.5px solid color-mix(in srgb,var(--brand) 42%, #fff 58%)', display:'inline-flex', alignItems:'center', gap:4, whiteSpace:'nowrap' };
const agChip = { fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:999, background:'var(--brand-soft)', color:'var(--brand-strong)', border:'1px solid color-mix(in srgb,var(--brand) 20%, transparent)' };
const agChipOn = { ...agChip, background:'var(--brand)', color:'var(--on-brand,#fff)', border:'1px solid transparent' };

/* ============ 1 行程规划 ============ */
function AgTrip({ data, flashKey }){
  return (
    <AgShell icon="cal" title="AI 行程规划" sub="根据你刚才的对话实时生成" flashKey={flashKey}
      action={<button style={agGhost}><Icon name="edit" size={12} color="currentColor" />调整</button>}>
      <div style={{ display:'flex', gap:6, padding:'10px 14px 4px 16px', flexWrap:'wrap' }}>{data.tags.map(t=> <span key={t} style={agChip}>{t}</span>)}</div>
      <div style={{ fontSize:11.5, color:'var(--text-muted)', padding:'2px 14px 8px 16px', lineHeight:1.4 }}>{data.note}</div>
      {data.days.map((d,di)=>(
        <div key={di} style={{ padding:'8px 14px 2px 16px', borderTop: di>0?'1px dashed var(--hairline)':'none' }}>
          <div style={{ fontSize:14, fontWeight:800, color:'var(--text)', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><Icon name="pin" size={13} color="var(--brand)" />{d.t}</div>
          {d.items.map((it,ii)=>(
            <div key={ii} style={{ display:'flex', gap:10, paddingBottom:10 }}>
              <div style={{ flex:'0 0 38px', fontSize:11.5, fontWeight:700, color:'var(--brand-strong)', paddingTop:3 }}>{it.time}</div>
              <AgPh k={it.k} label={it.name} w={44} h={44} r={10} style={{ flex:'0 0 44px' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:'var(--text)' }}>{it.name}</div>
                <span className="tag" style={{ marginTop:4, display:'inline-block' }}>{it.tag}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ display:'flex', gap:9, padding:'4px 14px 14px 16px' }}>
        <button className="btn-ghost" style={{ flex:1 }}>换一批玩法</button>
        <button className="btn" style={{ flex:1.4 }}><Icon name="check" size={14} color="currentColor" />加入我的行程</button>
      </div>
    </AgShell>
  );
}

/* ============ 2 目的地推荐 ============ */
function AgDestRec({ data, flashKey }){
  return (
    <AgShell icon="compass" title="为你推荐目的地" sub={data.summary} flashKey={flashKey}
      action={<button style={agGhost}>换一批</button>}>
      <div style={{ padding:'10px 14px 12px 16px', display:'flex', flexDirection:'column', gap:9 }}>
        {data.list.map((d,i)=>(
          <div key={d.name} style={{ display:'flex', gap:10, padding:8, alignItems:'stretch', border:'1px solid var(--hairline)', borderRadius:12, background:'var(--surface)' }}>
            <div style={{ position:'relative', flex:'0 0 64px' }}>
              <AgPh k={d.k} label={d.name} w={64} h={64} r={10} />
              <span style={{ position:'absolute', top:-6, left:-6, width:20, height:20, borderRadius:99, background:'var(--brand)', color:'var(--on-brand,#fff)', fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{i+1}</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14.5, fontWeight:800, color:'var(--text)' }}>{d.name}</div>
              <div style={{ fontSize:11.5, color:'var(--text-muted)', margin:'2px 0 5px', lineHeight:1.4 }}>{d.reason}</div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>{d.tags.map(t=> <span key={t} className="tag">{t}</span>)}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between', flex:'0 0 auto' }}>
              <Icon name="chevR" size={16} color="var(--text-muted)" />
              <div className="price" style={{ fontSize:15 }}><span className="cur">¥</span>{d.price}<span style={{ fontSize:10.5, fontWeight:600, color:'var(--text-muted)' }}>起</span></div>
            </div>
          </div>
        ))}
      </div>
    </AgShell>
  );
}

/* ============ 3 预算反推 ============ */
function AgBudget({ data, flashKey }){
  const pct = (data.budget - data.min) / (data.max - data.min);
  return (
    <AgShell icon="gauge" title="预算反推 · 帮你找去得起的地方" sub="拖动预算，目的地实时增减" flashKey={0}
      action={<span style={agChipOn}>¥{data.budget}</span>}>
      <div style={{ padding:'10px 18px 2px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-muted)', marginBottom:4 }}><span>¥{data.min}</span><span>预算上限</span><span>¥{data.max}</span></div>
        <div style={{ position:'relative', height:24, display:'flex', alignItems:'center' }}>
          <div style={{ position:'absolute', left:0, right:0, height:6, borderRadius:99, background:'var(--surface-2)' }} />
          <div style={{ position:'absolute', left:0, height:6, borderRadius:99, width:(pct*100)+'%', background:'linear-gradient(90deg,var(--brand-light),var(--brand))', transition:'width .25s ease' }} />
          <div style={{ position:'absolute', left:(pct*100)+'%', width:22, height:22, borderRadius:99, background:'#fff', border:'2px solid var(--brand)', boxShadow:'0 3px 8px rgba(0,0,0,.2)', transform:'translateX(-50%)', transition:'left .25s ease' }} />
        </div>
      </div>
      <div key={flashKey} className="reco-fade" style={{ padding:'6px 16px' }}>
        <div style={{ fontSize:12, color:'var(--brand-strong)', fontWeight:700, marginBottom:8 }}>{data.list.length} 个目的地在你的预算内 👇</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {data.list.map(d=>(
            <div key={d.name} style={{ display:'flex', gap:10, alignItems:'center' }}>
              <AgPh k={d.k} label={d.name} w={48} h={48} r={9} style={{ flex:'0 0 48px' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:800, color:'var(--text)' }}>{d.name}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{d.note}</div>
              </div>
              <div style={{ textAlign:'right' }}><div className="price" style={{ fontSize:15 }}><span className="cur">¥</span>{d.price}</div><div style={{ fontSize:10, color:'#2BA66A', fontWeight:700 }}>预算内</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'4px 14px 14px 16px' }}><button className="btn" style={{ width:'100%' }}>按此预算看完整方案</button></div>
    </AgShell>
  );
}

/* ============ 4 多城连游 ============ */
function AgMultiCity({ data, flashKey }){
  return (
    <AgShell icon="route" title="多城连游 · 路线规划" sub={`共 ${data.cities.length} 城 · 已串成最顺动线`} flashKey={flashKey}
      action={<button style={agGhost}><Icon name="refresh" size={12} color="currentColor" />优化</button>}>
      <div key={flashKey} className="reco-fade" style={{ padding:'10px 14px 6px 16px' }}>
        {data.cities.map((c,i)=>(
          <React.Fragment key={c.name}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ width:22, height:22, borderRadius:99, background:'var(--brand)', color:'var(--on-brand,#fff)', fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto' }}>{i+1}</span>
              <AgPh k={c.k} label={c.name} w={40} h={40} r={9} style={{ flex:'0 0 40px' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:800, color:'var(--text)' }}>{c.name}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>停留 {c.nights} 晚 · {c.hi}</div>
              </div>
              <Icon name="grip" size={18} color="var(--text-muted)" />
            </div>
            {i<data.cities.length-1 && (
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 0 4px 20px', margin:'2px 0' }}>
                <div style={{ width:2, height:18, background:'var(--hairline)', marginLeft:9 }} />
                <span style={{ fontSize:10.5, color:'var(--text-muted)', display:'inline-flex', alignItems:'center', gap:3 }}><Icon name="train" size={11} color="var(--text-muted)" />{c.transit}</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 16px 14px', borderTop:'1px solid var(--hairline)', marginTop:4 }}>
        <span style={{ fontSize:12, color:'var(--text-muted)' }}>总时长 <b style={{ color:'var(--text)' }}>{data.totalDays}天</b> · 交通 <b style={{ color:'var(--price-color)' }}>¥{data.totalCost}</b></span>
        <button className="btn" style={{ padding:'7px 14px', fontSize:13 }}>生成详细路书</button>
      </div>
    </AgShell>
  );
}

/* ============ 5 机酒打包 ============ */
function AgBundle({ data, flashKey }){
  const row = { display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--hairline)' };
  const ic = { width:30, height:30, borderRadius:9, background:'var(--brand-soft)', display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto' };
  return (
    <AgShell icon="bed" title="机 + 酒 打包" sub="按你常飞的时间配了一版" flashKey={flashKey}
      action={<span style={agChipOn}>{data.date}</span>}>
      <div key={flashKey} className="reco-fade" style={{ padding:'4px 16px 0' }}>
        <div style={row}>
          <span style={ic}><Icon name="plane" size={16} color="var(--brand-strong)" /></span>
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13.5, fontWeight:800, color:'var(--text)' }}>{data.flight.dep} ✈ {data.flight.arr}</div><div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{data.flight.info}</div></div>
          <span className="price" style={{ fontSize:15 }}><span className="cur">¥</span>{data.flight.price}</span>
        </div>
        <div style={{ ...row, borderBottom:'none' }}>
          <span style={ic}><Icon name="building" size={16} color="var(--brand-strong)" /></span>
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13.5, fontWeight:800, color:'var(--text)' }}>{data.hotel.name}</div><div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{data.hotel.info}</div></div>
          <span className="price" style={{ fontSize:15 }}><span className="cur">¥</span>{data.hotel.price}</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'2px 16px 14px', padding:'10px 12px', borderRadius:12, background:'var(--brand-soft)' }}>
        <div><span style={{ fontSize:11.5, color:'var(--text-muted)' }}>打包价</span><div style={{ display:'flex', alignItems:'center', gap:8 }}><div className="price" style={{ fontSize:20 }}><span className="cur">¥</span>{data.total}</div><span className="badge-disc">打包省 ¥{data.save}</span></div></div>
        <button className="btn" style={{ padding:'7px 16px' }}>去预订</button>
      </div>
    </AgShell>
  );
}

/* ============ 6 找特价 ============ */
function AgDeals({ data, flashKey }){
  return (
    <AgShell icon="bolt" title="今晚捡漏 · 特价聚合" sub="已按「立省」从高到低排序" flashKey={flashKey}
      action={<span style={agChipOn}><Icon name="fire" size={11} color="currentColor" />实时</span>}>
      <div style={{ padding:'8px 14px 12px 16px', display:'flex', flexDirection:'column', gap:9 }}>
        {data.list.map(d=>(
          <div key={d.title} style={{ display:'flex', gap:10, alignItems:'center' }}>
            <AgPh k={d.k} label={d.title} w={54} h={54} r={9} style={{ flex:'0 0 54px' }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.title}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
                <span className="price" style={{ fontSize:16 }}><span className="cur">¥</span>{d.price}</span><span className="price-origin">¥{d.origin}</span>
                {d.left && <span style={{ fontSize:10, fontWeight:800, color:'#fff', background:'linear-gradient(135deg,#F2643C,#DC3A2A)', padding:'2px 6px', borderRadius:6, display:'inline-flex', alignItems:'center', gap:2 }}><Icon name="clock" size={9} color="currentColor" />仅剩{d.left}</span>}
              </div>
            </div>
            <span style={{ flex:'0 0 auto', background:'linear-gradient(135deg,#F04060,#DC1850)', color:'#fff', fontWeight:800, fontSize:12, padding:'5px 9px', borderRadius:9, textAlign:'center', lineHeight:1.2 }}>立省<br/>¥{d.save}</span>
          </div>
        ))}
      </div>
    </AgShell>
  );
}

/* ============ 7 酒店对比 ============ */
function AgCompare({ data, flashKey }){
  const th = { padding:'8px 7px', borderBottom:'1px solid var(--hairline)', textAlign:'center', fontWeight:800, color:'var(--text)', background:'var(--surface-2)', fontSize:12 };
  const td = { padding:'8px 7px', borderBottom:'1px solid var(--hairline)', textAlign:'center', fontSize:12, verticalAlign:'middle' };
  const tdL = { ...td, textAlign:'left', color:'var(--text-muted)', fontWeight:700, background:'var(--surface)' };
  return (
    <AgShell icon="building" title="酒店横向对比" sub={`正在对比 ${data.hotels.length} 家 · 追问可加维度`} flashKey={0}
      action={<button style={agGhost}>换酒店</button>}>
      <div style={{ padding:'8px 12px 14px' }}>
        <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
          <thead><tr><th style={{ ...th, background:'var(--surface)' }}></th>{data.hotels.map(h=> <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>
            {data.rows.map((r,ri)=>(
              <tr key={r.label} className={r.isNew?'reco-fade':''}>
                <td style={tdL}>{r.label}</td>
                {r.vals.map((v,ci)=>(
                  <td key={ci} style={{ ...td, color: ci===r.bestIdx?'var(--brand-strong)':'var(--text)', fontWeight: ci===r.bestIdx?800:500 }}>
                    {v}{ci===r.bestIdx && r.bestMark && <span style={{ display:'block', fontSize:9.5, color:'var(--brand)' }}>{r.bestMark}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AgShell>
  );
}

/* ============ 8 地面交通（不想坐飞机） ============ */
function AgTransport({ data, flashKey }){
  return (
    <AgShell icon="train" title="到达方式 · 已换地面交通优先" sub="高铁 / 自驾上移，航班保留垫底" flashKey={flashKey}
      action={<span style={agChipOn}>不坐飞机</span>}>
      <div style={{ padding:'4px 14px 12px' }}>
        {data.list.map((o,i)=>(
          <div key={o.title} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 0', borderBottom: i<data.list.length-1?'1px solid var(--hairline)':'none', opacity:o.dim?0.6:1 }}>
            <span style={{ width:34, height:34, borderRadius:10, background:'var(--brand-soft)', display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto' }}><Icon name={o.icon} size={18} color="var(--brand-strong)" /></span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:800, color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}>{o.title}{o.tag && <span className="tag">{o.tag}</span>}</div>
              <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:2 }}>{o.sub}</div>
            </div>
            <span className="price" style={{ fontSize:16 }}><span className="cur">¥</span>{o.price}<span style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)' }}>起</span></span>
          </div>
        ))}
      </div>
    </AgShell>
  );
}

window.AGUI_PAYLOADS = { trip:AgTrip, destRec:AgDestRec, budget:AgBudget, multiCity:AgMultiCity, bundle:AgBundle, deals:AgDeals, compare:AgCompare, transport:AgTransport };
