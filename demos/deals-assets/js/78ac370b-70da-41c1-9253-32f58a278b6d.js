/* ============================================================
   OTA Demo — 主应用：编排渲染 + 实时意图 + 场景控制台
   ============================================================ */
const { useState:uS, useEffect:uE, useRef:uR } = React;

const REG = {
  coupon:Coupon, flashSale:FlashSale, coinsRebate:CoinsRebate, feeds:Feeds, sceneGuide:SceneGuide,
  cityHero:CityHero, aiEntry:AIEntry, ranking:Ranking, posts:Posts, tripCard:TripCard,
  tripPlan:TripPlan, familyProfile:FamilyProfile, bizTravel:BizTravel, eventBundle:EventBundle,
  memberBenefits:MemberBenefits,
  airlinePremium:AirlinePremium, hotelPremium:HotelPremium, ticketVIP:TicketVIP,
  destRec:DestRec, lowPriceDest:LowPriceDest, nearbyDest:NearbyDest, adLanding:AdLanding,
  recentViewed:RecentlyViewed,
};
const MOD_NAME = {
  coupon:'优惠券', flashSale:'秒杀', coinsRebate:'Trip Coins 返赠', feeds:'Feeds 流', sceneGuide:'场景导购',
  cityHero:'城市头图', aiEntry:'AI入口', ranking:'榜单', posts:'帖子', tripCard:'行程卡片',
  tripPlan:'行程规划', familyProfile:'家庭档案', bizTravel:'差旅助手', eventBundle:'展演打包',
  memberBenefits:'高端会籍',
  airlinePremium:'航司尊享', hotelPremium:'酒店尊享', ticketVIP:'门票VIP',
  destRec:'目的地推荐', lowPriceDest:'发现低价目的地', nearbyDest:'附近目的地', adLanding:'外投中插',
  recentViewed:'刚刚浏览过的',
};

const CITY_WORDS = ['三亚','上海','北京','成都','普吉','冲绳','东京','马代','深圳','广州','香港','澳门'];

function App(){
  const [ctx, setCtx] = uS({ identity:'solo', tier:'value', state:'S1', city:null, family: { ...window.DATA.familyDefault } });
  // 让图片解析器(window.IMG)能感知当前消费档：高端档自动切到尊贵图集
  window.__tier = ctx.tier;
  const [tab, setTab] = uS('explore');
  const [toast, setToast] = uS(null);
  const [familyOpen, setFamilyOpen] = uS(false);
  const [cityPickerOpen, setCityPickerOpen] = uS(false);
  const [aiOpen, setAiOpen] = uS(false);
  const [aiMsgs, setAiMsgs] = uS([]);
  const [consoleOpen, setConsoleOpen] = uS(false);
  const [scriptRunning, setScriptRunning] = uS(false);
  const [showBackTop, setShowBackTop] = uS(false);
  const [dockTrayOpen, setDockTrayOpen] = uS(false);
  const [subscribed, setSubscribed] = uS(false);
  const [subscribeOpen, setSubscribeOpen] = uS(false);
  const [unsubOpen, setUnsubOpen] = uS(false);
  const [shareOpen, setShareOpen] = uS(false);
  const [adSource, setAdSource] = uS(null);   // 外投渠道来源：{ kind:'coupon'|'hotel'|'flight'|'ticket' }
  const [agi, setAgi] = uS({ open:false, kind:null, data:null, anchor:'feeds', flashKey:0, h:0, anim:false }); // AG-UI 中插
  const [activeScene, setActiveScene] = uS(null);  // 当前播放的场景 no
  const scrollRef = uR(null);
  const toastTimer = uR(null);
  const undoRef = uR(null);
  const insertRef = uR(null);
  const innerRef = uR(null);
  const skipAnchor = uR(false);   // 城市选择等用户动作锚定 tab 后，跳过一次默认 tab 重锚定

  // 切状态/身份时同步默认 tab：S1/S2/S5 锚定到「探索目的地」；S3/S4 锚定「目的地」（探索退居第二位）；商旅/展演无探索 tab
  uE(()=>{
    if(skipAnchor.current){ skipAnchor.current = false; return; }
    if(ctx.identity==='biz' || ctx.identity==='event'){ setTab('city'); return; }
    const exploreDefault = (ctx.state==='S1' || ctx.state==='S2' || ctx.state==='S5');
    setTab(exploreDefault ? 'explore' : 'city');
  }, [ctx.state, ctx.identity]);

  // 外投 landing：插入广告中插后回到页面顶部（即时跳转，避免平滑滚动被图片重排打断）
  uE(()=>{
    if(adSource){
      const jump = ()=>{ if(scrollRef.current){ scrollRef.current.style.scrollBehavior='auto'; scrollRef.current.scrollTop=0; } };
      jump();
      const t1 = setTimeout(jump, 80);
      const t2 = setTimeout(jump, 200);
      return ()=>{ clearTimeout(t1); clearTimeout(t2); };
    }
  }, [adSource]);

  /* ---------- bus ---------- */
  function showToast(msg, undoFn){
    if(toastTimer.current) clearTimeout(toastTimer.current);
    undoRef.current = undoFn || null;
    setToast({ msg, undo: !!undoFn });
    toastTimer.current = setTimeout(()=> setToast(null), undoFn ? 4200 : 2200);
  }
  function doUndo(){
    if(undoRef.current) undoRef.current();
    setToast(null);
  }
  function patchCtx(patch){ setCtx(c=>({ ...c, ...patch })); }

  const bus = {
    toast: (m,u)=> showToast(m,u),
    openFamily: ()=> setFamilyOpen(true),
    openAI: ()=>{ setAiOpen(true); },
    openCityPicker: ()=> setCityPickerOpen(true),
  };

  function saveFamily(fam){
    setCtx(c=>({ ...c, family: fam, identity:'family' }));
    setFamilyOpen(false);
    showToast(`已为 ${fam.children.map(c=>c.age===0?'<1岁':c.age+'岁').join('、')} 宝宝优化推荐`);
    // 保存后停留在原页面，仅基于家庭档案刷新内容，不再自动跳到 Feeds
  }

  /* ---------- 滚动锚定 ---------- */
  function topOf(el){
    const ch = scrollRef.current; if(!ch || !el) return 0;
    return el.getBoundingClientRect().top - ch.getBoundingClientRect().top + ch.scrollTop;
  }
  // 可视区顶部被吸顶栏占据的高度（组件置顶时预留）。
  // 关键：按吸顶栏「吸住后」的高度（CSS top + 自身高度）计算，而不是其当前位置——
  // 否则置顶前吸顶栏还没贴到顶，预留量被低估，组件会顶进吸顶栏下方、标题被遮，随后再校正就成了抖动。
  // 且只统计「位于插入组件之前（其上方）」的吸顶栏，避免给顶部中插（上方没有吸顶栏）误留空白。
  function stickyGap(){
    const ch = scrollRef.current; if(!ch) return 56;
    const ins = insertRef.current;
    let g = 8;
    ch.querySelectorAll('*').forEach(e=>{
      const cs = getComputedStyle(e);
      if(cs.position!=='sticky') return;
      const topPx = parseFloat(cs.top) || 0;
      if(topPx > 80) return;                       // 只算吸附在顶部区域的栏
      // 仅统计排在插入组件之前的吸顶栏（它们才会叠在组件上方）
      if(ins && !(e.compareDocumentPosition(ins) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      const stuckBottom = topPx + e.offsetHeight;  // 吸住后该栏底部距容器顶的距离
      if(stuckBottom > g && stuckBottom < 200) g = stuckBottom;
    });
    return g + 10;
  }
  /* rAF 自定义缓动滚动：时长可控、与原生 smooth / scroll-behavior 无关，
     用直接赋值 scrollTop 实现，避免大距离时过快、或被原生平滑滚动中途打断 */
  function animateScroll(ch, to, dur){
    return new Promise(res=>{
      const start = ch.scrollTop;
      const end   = Math.max(0, to);
      const delta = end - start;
      if(Math.abs(delta) < 1){ ch.scrollTop = end; res(); return; }
      const prevBehav = ch.style.scrollBehavior;
      ch.style.scrollBehavior = 'auto';
      const t0 = performance.now();
      const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; // easeInOutCubic
      function step(now){
        const t = Math.min(1, (now - t0) / dur);
        ch.scrollTop = start + delta * ease(t);
        if(t < 1){ requestAnimationFrame(step); }
        else { ch.style.scrollBehavior = prevBehav; res(); }
      }
      requestAnimationFrame(step);
    });
  }
  /* 统一驱动「展开 + 置顶」：在同一条缓动曲线、同一帧时钟里同时改 height 与 scrollTop，
     彻底消除「CSS 高度过渡」与「JS 滚动」两条动画异步交接造成的卡顿 */
  async function unfurlAndPin(H, dur){
    const ch = scrollRef.current, el = insertRef.current; if(!ch || !el) return;
    const target = ()=> Math.max(0, topOf(el) - stickyGap());
    const startScroll = ch.scrollTop;
    const startH = el.offsetHeight;
    const goScroll = target();          // 内容坐标系下的目标，随高度增长保持稳定
    const dScroll = goScroll - startScroll;
    const dH = H - startH;
    const D = dur || 600;
    // easeInOutCubic：起止都缓，避免 easeOut 起步过猛带来的「窜一下」
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    const prevBehav = ch.style.scrollBehavior;
    ch.style.scrollBehavior = 'auto';   // 确保逐帧赋值即时生效，不被原生平滑滚动接管
    el.style.transition = 'none';       // 关闭 CSS 过渡，全程由 rAF 命令式驱动
    await new Promise(res=>{
      const t0 = performance.now();
      function step(now){
        const t = Math.min(1, (now - t0) / D);
        const e = ease(t);
        el.style.height = (startH + dH * e) + 'px';
        ch.scrollTop    = startScroll + dScroll * e;
        if(t < 1) requestAnimationFrame(step); else res();
      }
      requestAnimationFrame(step);
    });
    el.style.height = H + 'px';
    ch.scrollTop = target();
    // 落定后若上方懒加载图片造成漂移，做一次极短的同向平滑校正（极少触发，不硬跳）
    if(Math.abs(ch.scrollTop - target()) > 2) await animateScroll(ch, target(), 200);
    ch.style.scrollBehavior = prevBehav;
  }
  function scrollToModule(name){
    const el = scrollRef.current && scrollRef.current.querySelector(`[data-mod="${name}"]`);
    if(el && scrollRef.current){
      const top = el.offsetTop - 120;
      scrollRef.current.scrollTo({ top: Math.max(0,top), behavior:'smooth' });
    }
  }

  /* ---------- 实时意图解析 ---------- */
  function applyIntent(text){
    const prev = { ...ctx };
    let patch = {}; let notes = []; let scrollTarget = null; let openFam = false;
    const t = text;
    if(/(带|和).*(孩子|娃|宝宝|小孩)|亲子|遛娃/.test(t)){ patch.identity='family'; notes.push('亲子模式'); scrollTarget='familyProfile'; openFam=false; }
    if(/出差|商务|差旅|开会|会议/.test(t)){ patch.identity='biz'; notes.push('商务模式'); }
    if(/演唱会|演出|音乐节|livehouse|话剧|展演|赛事/.test(t)){ patch.identity='event'; notes.push('展演模式'); }
    if(/特价|便宜|省钱|划算|实惠|平价/.test(t)){ patch.tier='value'; notes.push('性价比档'); scrollTarget=scrollTarget||'flashSale'; }
    if(/好一?点|高端|商务舱|五星|奢华|尊享|头等|豪华/.test(t)){ patch.tier='premium'; notes.push('高端档'); scrollTarget='hotelPremium'; }
    const city = CITY_WORDS.find(c=> t.includes(c));
    if(city){ patch.city=city; if(ctx.state==='S1'||ctx.state==='S5') patch.state='S2'; notes.push('定位'+city); scrollTarget=scrollTarget||'cityHero'; }
    if(/出发|周末|下个?月|出游|旅行|去玩/.test(t) && !city && (ctx.state==='S1')){ /* 维持 */ }

    if(Object.keys(patch).length===0){
      return { reply:'我可以帮你切换出行身份、价格档位或定位目的地～试试「带孩子去三亚」「住好一点的酒店」。', applied:false };
    }
    setCtx(c=>({ ...c, ...patch }));
    if(openFam) setTimeout(()=> setFamilyOpen(true), 500);
    if(scrollTarget) setTimeout(()=> scrollToModule(scrollTarget), 480);
    const undoFn = ()=> setCtx(c=>({ ...prev }));
    showToast(`已根据你的需求调整：${notes.join(' · ')}`, undoFn);
    return { reply:`好的，已为你${notes.join('、')}，页面已实时刷新（会话态调整，不影响长期画像）。`, applied:true };
  }

  function sendAI(text){
    setAiMsgs(m=>[...m, { role:'user', text }]);
    setTimeout(()=>{
      const res = applyIntent(text);
      setAiMsgs(m=>[...m, { role:'ai', text: res.reply }]);
    }, 420);
  }

  /* ---------- AI 演示脚本 ---------- */
  function sleep(ms){ return new Promise(r=> setTimeout(r, Math.round(ms*1.55))); }

  async function runScriptA(){
    if(scriptRunning) return; setScriptRunning(true);
    setConsoleOpen(false);
    setCtx({ identity:'solo', tier:'value', state:'S1', city:null, family:{ ...window.DATA.familyDefault } });
    setAiMsgs([]); setAiOpen(true);
    await sleep(700);
    setAiMsgs([{ role:'user', text:'帮我安排一个两天周末带孩子出行的方案' }]);
    await sleep(900);
    setAiMsgs(m=>[...m, { role:'ai', text:'好的，给你一个亲子周末方案～先完善下宝宝信息，推荐更准。' }]);
    await sleep(700);
    const prev = { identity:'solo', tier:'value', state:'S1', city:null };
    setCtx(c=>({ ...c, identity:'family' }));
    showToast('已识别「带孩子」，为你切到亲子模式', ()=> setCtx(c=>({ ...c, ...prev })));
    await sleep(1100);
    setAiOpen(false);
    await sleep(300);
    scrollToModule('familyProfile');
    await sleep(900);
    setScriptRunning(false);
  }

  async function runScriptB(){
    if(scriptRunning) return; setScriptRunning(true);
    setConsoleOpen(false);
    setCtx({ identity:'biz', tier:'value', state:'S1', city:null, family:{ ...window.DATA.familyDefault } });
    setAiMsgs([]); setAiOpen(true);
    await sleep(700);
    setAiMsgs([{ role:'user', text:'下个月去上海，住好一点的酒店' }]);
    await sleep(900);
    setAiMsgs(m=>[...m, { role:'ai', text:'为你定位上海，已切到高端，附上行政酒廊等尊享服务。' }]);
    await sleep(700);
    const prev = { identity:'biz', tier:'value', state:'S1', city:null };
    setCtx(c=>({ ...c, state:'S2', city:'上海' }));
    await sleep(700);
    setCtx(c=>({ ...c, tier:'premium' }));
    showToast('已定位上海 · 已切高端', ()=> setCtx(c=>({ ...c, ...prev })));
    await sleep(1100);
    setAiOpen(false);
    await sleep(300);
    scrollToModule('hotelPremium');
    await sleep(900);
    setScriptRunning(false);
  }

  /* ---------- AG-UI 引擎（动态意图修正层） ---------- */
  const raf2 = ()=> new Promise(r=> requestAnimationFrame(()=> requestAnimationFrame(r)));
  const eng = {
    sleep,
    toast: (m)=> showToast(m),
    async reset(base){
      setAgi({ open:false, kind:null, data:null, anchor:'feeds', flashKey:0, h:0, anim:false });
      setAiMsgs([]); setAiOpen(false);
      setCtx(c=>({ ...c, ...base, family:{ ...window.DATA.familyDefault } }));
      await sleep(80);
      if(scrollRef.current){ scrollRef.current.style.scrollBehavior='auto'; scrollRef.current.scrollTop=0; }
      await sleep(260);
    },
    setCtx: (patch)=> setCtx(c=>({ ...c, ...patch })),
    async scrollTop(){ if(scrollRef.current) scrollRef.current.scrollTo({ top:0, behavior:'smooth' }); await sleep(420); },
    async scrollModule(name){ scrollToModule(name); await sleep(480); },
    async chat(open){ setAiOpen(open); await sleep(open?460:360); },
    async say(role, text){ setAiMsgs(m=>[...m, { role, text }]); await sleep(role==='user'?280:340); },
    async think(ms){ await sleep(ms); },
    async setInsert(kind, data, anchor){ setAgi({ open:false, kind, data, anchor:anchor||'feeds', flashKey:0, h:0, anim:false }); await sleep(90); },
    async expand(){
      setAgi(a=>({ ...a, open:true, h:0, anim:false }));
      await raf2(); await raf2();
      const inner=innerRef.current; const H = inner ? inner.scrollHeight : 320;
      await unfurlAndPin(H, 640);          // 展开与置顶合为一段同步连续动作
      setAgi(a=>({ ...a, h:H, anim:false }));
    },
    async _change(data, fade){
      setAgi(a=>({ ...a, data, flashKey: fade? a.flashKey+1 : a.flashKey, anim:false }));
      await raf2(); await raf2();
      const inner=innerRef.current; const H = inner ? inner.scrollHeight : 320;
      await unfurlAndPin(H, 560);          // 刷新：高度变化与置顶同步
      setAgi(a=>({ ...a, h:H, anim:false }));
    },
    refresh(data){ return eng._change(data, true); },
    update(data){ return eng._change(data, false); },
    async browse(){
      const ch=scrollRef.current, ins=insertRef.current; if(!ch||!ins) return;
      const topPos = Math.max(0, topOf(ins) - stickyGap());
      const viewH  = ch.clientHeight;
      // 轻量浏览：温和下滑一小段（最多约 1/3 屏，且不超过「露出组件底部」所需距离），
      // 用可控时长的缓动滑动，避免原生 smooth 在大距离时过猛、太突然
      const needReveal = Math.max(0, ins.offsetHeight - (viewH - stickyGap()) + 72);
      const down = topPos + Math.min(viewH * 0.34, needReveal);
      await animateScroll(ch, down, 1000); await sleep(640);
      await animateScroll(ch, topPos, 900);
    },
  };
  async function playScene(scene){
    if(scriptRunning) return; setScriptRunning(true); setActiveScene(scene.no);
    try{ await scene.run(eng); }catch(err){ console.error('[AGUI]', scene.no, err); }
    setScriptRunning(false);
  }


  /* ---------- portfolio bridge: external scene console -> original phone demo ---------- */
  uE(()=>{
    const detailOf = (nextCtx, nextChannel, nextScene)=>({
      ...(nextCtx || ctx),
      channel: nextChannel !== undefined ? nextChannel : (adSource ? adSource.kind : null),
      activeScene: nextScene !== undefined ? nextScene : activeScene,
    });
    const emit = (nextCtx, nextChannel, nextScene)=>{
      const detail = detailOf(nextCtx, nextChannel, nextScene);
      setTimeout(()=>{
        window.dispatchEvent(new CustomEvent('deals:ctx', { detail }));
        try{
          if(window.parent && window.parent !== window){
            window.parent.postMessage({ type:'deals:ctx', detail }, '*');
          }
        }catch(e){}
      }, 0);
    };
    const resetToInitial = ()=>{
      const base = { identity:'solo', tier:'value', state:'S1', city:null, family:{ ...window.DATA.familyDefault } };
      setAgi({ open:false, kind:null, data:null, anchor:'feeds', flashKey:0, h:0, anim:false });
      setAiMsgs([]); setAiOpen(false); setDockTrayOpen(false);
      setActiveScene(null); setScriptRunning(false); setAdSource(null);
      setCtx(base);
      if(scrollRef.current){ scrollRef.current.style.scrollBehavior='auto'; scrollRef.current.scrollTop=0; }
      emit(base, null, null);
    };
    const api = {
      getCtx(){ return { ...ctx, channel: adSource ? adSource.kind : null, activeScene }; },
      setCtx(patch){
        setCtx(c=>{
          const clean = { ...(patch || {}) };
          Object.keys(clean).forEach(k=>{ if(clean[k] === undefined) delete clean[k]; });
          const next = { ...c, ...clean };
          if(clean.state === 'S1' && !Object.prototype.hasOwnProperty.call(clean, 'city')) next.city = null;
          emit(next);
          return next;
        });
      },
      setChannel(kind){
        const normalized = kind || null;
        setAdSource(normalized ? { kind: normalized } : null);
        emit(ctx, normalized, activeScene);
      },
      async playScene(no){
        const key = String(no && no.no ? no.no : no).padStart(2, '0');
        const scene = (window.AGUI_SCENES || []).find(s=>s.no===key);
        if(scene) await playScene(scene);
      },
      reset: resetToInitial,
      hello(){ emit(); },
    };
    window.__deals = api;
    const onMessage = (event)=>{
      const data = event && event.data;
      if(!data || data.type !== 'deals:cmd') return;
      if(data.cmd === 'setCtx') api.setCtx(data.patch || {});
      else if(data.cmd === 'setChannel') api.setChannel(data.kind || null);
      else if(data.cmd === 'playScene') api.playScene(data.no);
      else if(data.cmd === 'reset') api.reset();
      else if(data.cmd === 'hello') api.hello();
    };
    window.addEventListener('message', onMessage);
    emit();
    return ()=> window.removeEventListener('message', onMessage);
  }, [ctx, adSource, activeScene, scriptRunning]);


  /* ---------- 构建楼层 ---------- */
  const allFloors = window.buildFloors(ctx);
  const hasTripPlan = allFloors.some(f=> f.module==='tripPlan');
  let floors = [...allFloors];
  // 旅行攻略（帖子）不直接上墙，改为底部 AI 对话框气泡；行程规划同理
  floors = floors.filter(f=> f.module!=='posts');
  if(tab==='explore'){
    // 探索目的地 tab：隐藏原目的地推荐(destRec) / 目的地灵感(sceneGuide)，在原顶部位置仅展示发现低价目的地(lowPriceDest)
    floors = floors.filter(f=> f.module!=='cityHero' && f.module!=='tripPlan' && !(f.module==='ranking' && ctx.tier!=='premium') && f.module!=='nearbyDest'
      && f.module!=='sceneGuide' && f.module!=='destRec');
    const fam  = floors.filter(f=> f.module==='familyProfile');
    const tops = floors.filter(f=> f.module==='lowPriceDest');
    const rest = floors.filter(f=> f.module!=='familyProfile' && f.module!=='lowPriceDest');
    floors = [...fam, ...tops, ...rest];
  } else {
    // 目的地 tab：不展示单目的地推荐(destRec) 与 场景化导购(sceneGuide)
    floors = floors.filter(f=> f.module!=='cityHero' && f.module!=='sceneGuide' && f.module!=='destRec' && f.module!=='lowPriceDest' && f.module!=='tripPlan');
    // 附近目的地推荐：非「探索目的地」tab 下仅在行程前/中/后(S3/S4/S5)出现，且置于「刚刚浏览过的」组件下方
    const inTrip = ctx.state==='S3' || ctx.state==='S4' || ctx.state==='S5';
    const nd = floors.find(f=> f.module==='nearbyDest');
    floors = floors.filter(f=> f.module!=='nearbyDest');
    if(inTrip && nd){
      const rvIdx = floors.findIndex(f=> f.module==='recentViewed');
      if(rvIdx >= 0){
        floors.splice(rvIdx + 1, 0, nd);
      } else {
        const fIdx = floors.findIndex(f=> f.module==='feeds');
        if(fIdx >= 0) floors.splice(fIdx, 0, nd); else floors.push(nd);
      }
    }
  }
  // 外投渠道 landing：还原站外广告内容
  //  - 亲子：放在家庭档案下方
  //  - 商务出行：放在差旅助手下方
  //  - 展演出行：放在展演卡片下方
  //  - 其余：页面顶部中插
  if(adSource){
    const adFloor = { module:'adLanding', props:{ ad:adSource } };
    floors = floors.filter(f=> f.module!=='adLanding');
    let anchorIdx = -1;
    if(ctx.identity==='family')      anchorIdx = floors.findIndex(f=> f.module==='familyProfile');
    else if(ctx.identity==='biz')    anchorIdx = floors.findIndex(f=> f.module==='bizTravel');
    else if(ctx.identity==='event')  anchorIdx = floors.findIndex(f=> f.module==='eventBundle');
    if(anchorIdx >= 0){
      floors.splice(anchorIdx + 1, 0, adFloor);
    } else {
      floors = [adFloor, ...floors];
    }
  }
  // 高端模式：会员权益模块固定置于页面最顶部（展示当前会员等级与可享权益）
  if(ctx.tier==='premium'){
    floors = floors.filter(f=> f.module!=='memberBenefits');
    floors = [{ module:'memberBenefits', props:{} }, ...floors];
  }
  // 行程规划 / 旅行攻略 / 找特价 等：以底部 AI 对话框上方的气泡形式展示
  const actionChips = [];
  if(ctx.state === 'S1' || hasTripPlan) actionChips.push({ label:'行程规划', icon:'cal', onClick:()=>{ setAiOpen(true); sendAI('帮我安排行程规划'); } });
  actionChips.push({ label:'旅行攻略', icon:'book',    onClick:()=>{ setAiOpen(true); sendAI('给我一份目的地旅行攻略'); } });
  actionChips.push({ label:'找特价',  icon:'bolt',    onClick:()=>{ setAiOpen(true); sendAI('帮我找最近的特价好货'); } });
  actionChips.push({ label:'比较酒店', icon:'bed',     onClick:()=>{ setAiOpen(true); sendAI('帮我比较几家酒店'); } });

  const aiSuggest = ['带孩子去三亚','想找特价机票','下个月去上海出差','看看好点的商务舱','演唱会周边住宿'];

  /* ---------- AG-UI 中插元素与位置 ---------- */
  const AgComp = (agi.open && agi.kind) ? (window.AGUI_PAYLOADS||{})[agi.kind] : null;
  let agInsIdx = -1;
  if(agi.open){
    if(agi.anchor==='feeds') agInsIdx = -2;          // 交由 Feeds 模块在卡片之间渲染
    else if(agi.anchor==='top') agInsIdx = 0;
    else { const i = floors.findIndex(f=> f.module===agi.anchor); agInsIdx = i>=0 ? i+1 : Math.min(2, floors.length); }
  }
  window.__agi = agi;
  const agInsertEl = AgComp ? (
    <div key="ag-insert" ref={insertRef} style={{ overflow:'hidden', padding: agi.anchor==='feeds' ? '0' : '0 14px', marginTop: agInsIdx===0 ? 14 : 0, marginBottom:10, height: agi.h, transition: agi.anim ? 'height .55s cubic-bezier(.22,1,.36,1)' : 'none' }}>
      <div className="reco-inner" ref={innerRef}>
        <AgComp data={agi.data} flashKey={agi.flashKey} />
      </div>
    </div>
  ) : null;

  return (
    <div data-identity={ctx.identity} data-tier={ctx.tier} data-state={ctx.state}
      style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--bg)', position:'relative', overflow:'hidden', isolation:'isolate',
        transition:'background-color var(--t-slow) var(--ease), color var(--t-slow) var(--ease)' }}>
      {/* 状态栏 */}
      <div style={{ flex:'0 0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 22px 4px', fontSize:15, fontWeight:700, color:'var(--text)', background:'var(--bg)', transition:'background-color var(--t-slow)' }}>
        <span>9:41</span>
        <span style={{ display:'flex', gap:5, alignItems:'center', fontSize:13 }}>•••• 5G ▮▮▮</span>
      </div>

      <TopNav ctx={ctx} subscribed={subscribed}
        onSubscribe={()=>{ subscribed ? setUnsubOpen(true) : setSubscribeOpen(true); }}
        onShare={()=> setShareOpen(true)}
        onMode={(id)=>{
        const prev = ctx.identity;
        setCtx(c=>({ ...c, identity:id }));
        showToast(`已切换到「${MODES.find(m=>m.id===id).label}」模式`, ()=> setCtx(c=>({ ...c, identity:prev })));
      }} />
      <PageTabs ctx={ctx} tab={tab} cityFirst={ctx.state==='S3' || ctx.state==='S4'} onTab={(t)=>{
        // 仅切换视图，不改动场景控制台配置
        if(t==='city' && tab==='city'){ setCityPickerOpen(true); return; }
        setTab(t);
      }} />

      {/* 频道滚动区 */}
      <div id="channel" ref={scrollRef} onScroll={e=>setShowBackTop(e.currentTarget.scrollTop > 8)} style={{ flex:1, overflowY:'auto', overflowX:'hidden', paddingBottom:150 }}>
        {floors.map((f,idx)=>{
          const Comp = REG[f.module];
          const floorEl = Comp ? (
            <div key={f.module + (f.module==='ranking' ? '-'+(f.props.style||'') : '')} data-mod={f.module} style={{ marginBottom:10, marginTop: idx===0 ? 14 : 0 }}>
              <Comp props={f.props} bus={bus} ctx={{ ...ctx, tab, agFeed: (agi.open && agi.anchor==='feeds') ? agInsertEl : null }} />
            </div>
          ) : null;
          if(agi.open && idx===agInsIdx) return <React.Fragment key={'agwrap-'+idx}>{agInsertEl}{floorEl}</React.Fragment>;
          return floorEl;
        })}
        {agi.open && agInsIdx>=floors.length && agInsertEl}
        <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:12, padding:'20px 0 40px' }}>
          — 状态 {ctx.state} · {MODES.find(m=>m.id===ctx.identity).label} · {ctx.tier==='premium'?'高端':'性价比'} · 共 {floors.length} 个楼层 —
        </div>
      </div>

      {showBackTop && !aiOpen && !dockTrayOpen && !shareOpen && (
        <button aria-label="返回顶部" title="返回顶部" onClick={()=>scrollRef.current && scrollRef.current.scrollTo({ top:0, behavior:'smooth' })} style={{ position:'absolute', right:18, bottom:112, zIndex:'calc(var(--z-console) + 1)', width:38, height:38, borderRadius:999, background:'transparent', border:'none', boxShadow:'none', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--brand)', filter:'drop-shadow(0 1px 4px rgba(0,0,0,.32))' }}>
          <Icon name="chevD" size={20} color="currentColor" stroke={2.5} style={{ transform:'rotate(180deg)' }} />
        </button>
      )}

      <AIDock suggestions={aiSuggest} onSend={sendAI} onOpen={()=> setAiOpen(true)} actionChips={actionChips} onTrayChange={setDockTrayOpen} />
      <Toast toast={toast} onUndo={doUndo} />

      <FamilySheet open={familyOpen} family={ctx.family} onClose={()=>setFamilyOpen(false)} onSave={saveFamily} />
      <CitySwitcher open={cityPickerOpen} current={ctx.city||'冲绳'} onClose={()=>setCityPickerOpen(false)}
        onPick={(city)=>{
          skipAnchor.current = true;   // 用户主动选城市：锚定到目的地 tab，跳过默认 tab 重置
          setCtx(c=>({ ...c, city, state:(c.state==='S1'||c.state==='S5')?'S2':c.state }));
          setTab('city');
          setCityPickerOpen(false);
          showToast(`已定位「${city}」`);
        }} />
      <AIPanel open={aiOpen} onClose={()=>setAiOpen(false)} messages={aiMsgs} onSend={sendAI} suggestions={aiSuggest} />

      <SubscribeSheet open={subscribeOpen} onClose={()=>setSubscribeOpen(false)}
        onConfirm={(sel)=>{
          setSubscribed(true);
          setSubscribeOpen(false);
          const n = Object.values(sel).filter(Boolean).length;
          showToast(`已订阅优惠频道 · 已开启 ${n} 类消息推送`);
        }} />
      <ConfirmDialog open={unsubOpen} title="取消订阅优惠频道？"
        desc="取消后将不再收到专属优惠、活动与内容推送，已领取的优惠不受影响。"
        confirmText="确认取消" cancelText="再想想"
        onClose={()=>setUnsubOpen(false)}
        onConfirm={()=>{ setSubscribed(false); setUnsubOpen(false); showToast('已取消订阅优惠频道'); }} />
      <ShareSheet open={shareOpen} onClose={()=>setShareOpen(false)}
        onPick={(c)=>{
          setShareOpen(false);
          showToast(c.id==='copy' ? '链接已复制到剪贴板' : `已分享到 ${c.label}`);
        }} />

      {false && ReactDOM.createPortal(
        <ConsolePanel ctx={ctx} setCtx={setCtx} open={consoleOpen} setOpen={setConsoleOpen}
          showToast={showToast}
          adSource={adSource}
          scenes={window.AGUI_SCENES} onPlayScene={playScene} activeScene={activeScene} running={scriptRunning}
          onLand={(kind)=>{ setAdSource({ kind }); showToast('已模拟外投渠道 landing'); }}
          onClearAd={()=>{ setAdSource(null); showToast('已恢复自然流量'); }}
          onReset={()=>{
            setAgi({ open:false, kind:null, data:null, anchor:'feeds', flashKey:0, h:0, anim:false });
            setAiMsgs([]); setAiOpen(false); setDockTrayOpen(false);
            setActiveScene(null); setScriptRunning(false); setAdSource(null);
            setCtx({ identity:'solo', tier:'value', state:'S1', city:null, family:{ ...window.DATA.familyDefault } });
            if(scrollRef.current){ scrollRef.current.style.scrollBehavior='auto'; scrollRef.current.scrollTop=0; }
            showToast('已清除 AI 演示，回到初始页面');
          }} />,
        document.body)}
    </div>
  );
}

/* ---------------- 场景切换控制台 ⭐ ---------------- */
const STATES = [
  {id:'S1', t:'灵感（无意图目的地且未下单）'},
  {id:'S2', t:'决策（有意图目的地但未下单）'},
  {id:'S3', t:'行程前'},
  {id:'S4', t:'行程中'},
  {id:'S5', t:'行程后'},
];
const CHANNELS = [
  {k:null,     t:'自然流量'},
  {k:'coupon', t:'优惠券投放'},
  {k:'hotel',  t:'酒店秒杀投放'},
  {k:'flight', t:'机票秒杀投放'},
  {k:'ticket', t:'门票秒杀投放'},
];
const PURPOSES = [
  {id:'solo',  t:'个人出行'},
  {id:'family',t:'亲子出行'},
  {id:'event', t:'展演出行'},
  {id:'biz',   t:'商务出行'},
];
function ConsolePanel({ ctx, setCtx, open, setOpen, showToast, adSource, onLand, onClearAd, onReset, scenes, onPlayScene, activeScene, running }){
  const Section = ({ n, title, children }) => (
    <div style={{ marginBottom:17 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <span style={{ width:22, height:22, borderRadius:7, background:'rgba(0,0,0,.07)', color:'#3a3a42', fontSize:14, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{n}</span>
        <span style={{ fontSize:16.5, fontWeight:800, color:'#16161c', letterSpacing:.2 }}>{title}</span>
      </div>
      {children}
    </div>
  );
  const Row = ({ label, children }) => (
    <div style={{ marginBottom:9 }}>
      {label && <div style={{ fontSize:11.5, color:'#82828e', marginBottom:5, paddingLeft:1 }}>{label}</div>}
      <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>{children}</div>
    </div>
  );
  const Chip = ({ on, onClick, children }) => (
    <button onClick={onClick} style={{ padding:'6px 11px', borderRadius:8, fontSize:13, fontWeight:on?800:600,
      background:on?'var(--brand,#D87D91)':'#f1f1f4', color:on?'#fff':'#41414a', border:'1px solid '+(on?'var(--brand,#D87D91)':'#e4e4ea'), textAlign:'left', lineHeight:1.3 }}>{children}</button>
  );

  if(!open){
    return (
      <button onClick={()=>setOpen(true)} style={{ position:'fixed', right:14, bottom:24, zIndex:'var(--z-console)',
        background:'#fff', color:'#16161c', borderRadius:14, padding:'12px 16px', fontSize:14, fontWeight:800, boxShadow:'0 8px 24px rgba(0,0,0,.22)', border:'1px solid rgba(0,0,0,.08)', display:'flex', alignItems:'center', gap:7 }}>
        <Icon name="dice" size={18} color="#16161c" /> 场景控制台
      </button>
    );
  }

  const curChannel = adSource ? adSource.kind : null;

  return (
    <div style={{ position:'fixed', right:14, bottom:24, width:440, maxHeight:'calc(100vh - 48px)', overflowY:'auto', zIndex:'var(--z-console)',
      background:'#FFFFFF', borderRadius:18, padding:'16px 18px',
      color:'#16161c', boxShadow:'0 16px 50px rgba(0,0,0,.22)', border:'1px solid rgba(0,0,0,.08)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <span style={{ fontSize:17, fontWeight:900, display:'flex', alignItems:'center', gap:6, color:'#16161c' }}><Icon name="dice" size={18} color="#16161c" />场景切换控制台</span>
        <button onClick={()=>setOpen(false)}><Icon name="close" size={18} color="#9a9aa5" /></button>
      </div>

      <Section n="1" title="用户渠道来源">
        <Row>
          {CHANNELS.map(c=>(
            <Chip key={c.k||'natural'} on={curChannel===c.k}
              onClick={()=> c.k ? (onLand && onLand(c.k)) : (onClearAd && onClearAd())}>{c.t}</Chip>
          ))}
        </Row>
      </Section>

      <Section n="2" title="用户初始意图识别（初始页面）">
        <Row label="出行目的">
          {PURPOSES.map(p=> <Chip key={p.id} on={ctx.identity===p.id} onClick={()=>setCtx(c=>({...c, identity:p.id}))}>{p.t}</Chip>)}
        </Row>
        <Row label="行程状态">
          {STATES.map(s=> <Chip key={s.id} on={ctx.state===s.id} onClick={()=>setCtx(c=>({...c, state:s.id, city:(s.id==='S1')?null:c.city }))}>{s.t}</Chip>)}
        </Row>
        <Row label="消费能力">
          <Chip on={ctx.tier==='value'} onClick={()=>setCtx(c=>({...c, tier:'value'}))}>性价比</Chip>
          <Chip on={ctx.tier==='premium'} onClick={()=>setCtx(c=>({...c, tier:'premium'}))}>高端</Chip>
        </Row>
      </Section>

      <Section n="3" title="用户实时意图修正（动态页面）">
        <button onClick={onReset}
          style={{ marginBottom:11, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
            padding:'11px 12px', borderRadius:11, border:'1px solid rgba(0,0,0,.14)', background:'#F4F4F6',
            color:'#1a1a1f', fontSize:13.5, fontWeight:800, cursor:'pointer' }}>
          <Icon name="undo" size={15} color="#1a1a1f" />回到初始页面 · 清除 AI 演示
        </button>
        <div style={{ fontSize:11.5, color:'#82828e', margin:'-3px 0 9px', lineHeight:1.5 }}>点任一场景 ▶，手机端实时演示「提问 → AI 回复 → 页面中插 / 刷新 / 重排」</div>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          {(scenes||[]).map(sc=>{
            const on = activeScene===sc.no;
            return (
              <div key={sc.no} style={{ border:'1px solid '+(on?'rgba(216,125,145,.55)':'rgba(0,0,0,.09)'), borderRadius:11, background:on?'rgba(216,125,145,.10)':'#fafafb', transition:'all .2s' }}>
                <button onClick={()=> onPlayScene(sc)} disabled={running && !on}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:9, padding:'9px 10px', textAlign:'left', background:'transparent', cursor: running&&!on?'default':'pointer', opacity: running&&!on?0.45:1 }}>
                  <span style={{ width:24, height:24, borderRadius:7, background:on?'var(--brand,#D87D91)':'#ececf0', color:on?'#fff':'#55555f', fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{sc.no}</span>
                  <span style={{ flex:1, minWidth:0 }}>
                    <span style={{ display:'block', fontSize:14, fontWeight:800, color:'#1a1a1f' }}>{sc.title}{on && running && <span style={{ marginLeft:6, fontSize:10, color:'#1F9D57', fontWeight:800 }}>● 播放中</span>}</span>
                    <span style={{ display:'flex', gap:4, marginTop:4, flexWrap:'wrap' }}>{sc.tags.map(t=> <span key={t} style={{ fontSize:9.5, fontWeight:800, padding:'1.5px 6px', borderRadius:5, background:'#ececf0', color:'#5a5a64' }}>{t}</span>)}</span>
                  </span>
                  <span style={{ width:26, height:26, borderRadius:99, background:'var(--brand,#D87D91)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 10px rgba(184,94,116,.4)' }}><Icon name="play" size={11} color="#fff" /></span>
                </button>
                <div style={{ padding:'0 10px 10px 43px', display:'flex', flexDirection:'column', gap:5 }}>
                  {sc.steps.map((s,i)=>(
                    <div key={i} style={{ display:'flex', gap:7, fontSize:12, color:'#56565f', lineHeight:1.5 }}>
                      <span style={{ flexShrink:0, width:15, height:15, borderRadius:4, background:'#ececf0', color:'#88888f', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>{i+1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
