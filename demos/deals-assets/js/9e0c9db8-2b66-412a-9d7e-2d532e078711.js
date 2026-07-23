/* ============================================================
   OTA Demo — AG-UI 10 个场景脚本 + 步骤描述
   run(eng) 由 app.jsx 注入引擎
   ============================================================ */

/* ---------------- 数据 ---------------- */
const AGD = {
  tripRelax:{ tags:['3 天','亲子','轻松'], note:'节奏轻松 · 每天 2 个核心安排，午后留白给娃休息', days:[
    { t:'Day 1 · 海岸初见', items:[ { time:'14:00', name:'美丽海水族馆', tag:'遛娃首选', k:'aquarium' }, { time:'18:30', name:'濑长岛海景晚餐', tag:'日落', k:'sunset' } ] },
    { t:'Day 2 · 玩沙踏浪', items:[ { time:'10:00', name:'残波岬浅水海滩', tag:'安全戏水', k:'beach' }, { time:'15:00', name:'文化王国手作体验', tag:'亲子手作', k:'culture' } ] },
    { t:'Day 3 · 城市慢逛', items:[ { time:'10:30', name:'国际通伴手礼街', tag:'逛吃', k:'street' }, { time:'14:00', name:'首里城公园', tag:'世界遗产', k:'castle' } ] },
  ] },
  tripCompact:{ tags:['2 天','亲子','紧凑'], note:'已压缩为 2 天 · 每天 3 个安排，按就近动线串联，少走回头路', days:[
    { t:'Day 1 · 北部海岸一日', items:[ { time:'09:30', name:'美丽海水族馆', tag:'开馆即玩', k:'aquarium' }, { time:'13:00', name:'古宇利岛大桥', tag:'网红打卡', k:'bridge' }, { time:'17:30', name:'万座毛看日落', tag:'日落', k:'sunset' } ] },
    { t:'Day 2 · 南部文化一日', items:[ { time:'09:30', name:'首里城公园', tag:'世界遗产', k:'castle' }, { time:'12:30', name:'国际通午餐 + 购物', tag:'逛吃', k:'street' }, { time:'15:30', name:'濑长岛 outlet', tag:'亲子', k:'culture' } ] },
  ] },
  tripEasy:{ tags:['3 天','亲子','慢节奏'], note:'已进一步放慢 · 每天只排 1–2 个核心，午后全部留白给娃午休', days:[
    { t:'Day 1 · 睡到自然醒', items:[ { time:'10:30', name:'美丽海水族馆', tag:'遛娃首选', k:'aquarium' }, { time:'16:30', name:'濑长岛海景晚餐', tag:'看日落', k:'sunset' } ] },
    { t:'Day 2 · 只玩一片海', items:[ { time:'10:30', name:'残波岬浅水海滩', tag:'安全戏水', k:'beach' } ] },
    { t:'Day 3 · 慢逛回程', items:[ { time:'11:00', name:'国际通伴手礼街', tag:'逛吃', k:'street' } ] },
  ] },
  destFar:{ summary:'海岛 · 亲子 · 中等预算', list:[
    { k:'island', name:'冲绳', reason:'直飞 3h，水族馆+浅水沙滩，亲子友好度最高', price:1680, tags:['免签','适合娃'] },
    { k:'phuket', name:'普吉岛', reason:'无边泳池度假村多，海鲜便宜，飞行约 4.5h', price:1980, tags:['泳池','落地签'] },
    { k:'beach', name:'长滩岛', reason:'白沙滩平缓适合小童戏水，节奏慢', price:2280, tags:['白沙滩'] },
  ] },
  destNear:{ summary:'近距离海岛 · 亲子 · 飞行更短', list:[
    { k:'sanya', name:'三亚', reason:'国内直飞，亚龙湾浅水沙滩，免出境更省心', price:1280, tags:['国内','椰风'] },
    { k:'xiamen', name:'厦门', reason:'高铁可达，鼓浪屿+海边亲子，飞行 1.5h', price:980, tags:['高铁可达'] },
    { k:'beach', name:'北海涠洲岛', reason:'火山岛地质奇观，人少水清，适合放电', price:1180, tags:['人少'] },
  ] },
  budget3000:{ budget:3000, min:1500, max:8000, list:[
    { k:'sanya', name:'三亚 3 天 2 晚', note:'机+酒打包 · 含早', price:2680 },
    { k:'dali', name:'大理 4 天', note:'高铁 + 洱海民宿', price:2380 },
    { k:'xiamen', name:'厦门周末游', note:'高铁 1.5h 直达', price:1980 },
  ] },
  budget5000:{ budget:5000, min:1500, max:8000, list:[
    { k:'sanya', name:'三亚 4 天 3 晚', note:'升级海景房', price:3880 },
    { k:'island', name:'冲绳 4 天', note:'直飞 + 水族馆', price:4680 },
    { k:'phuket', name:'普吉岛 5 天', note:'无边泳池度假村', price:4980 },
    { k:'dali', name:'大理深度 5 天', note:'苍山洱海慢游', price:2980 },
  ] },
  routeA:{ totalDays:5, totalCost:1180, cities:[
    { k:'tokyo', name:'东京', nights:2, hi:'购物+迪士尼', transit:'新干线 → 大阪 约 2.5h' },
    { k:'osaka', name:'大阪', nights:2, hi:'环球影城+美食', transit:'电车 → 京都 约 45min' },
    { k:'kyoto', name:'京都', nights:1, hi:'古寺+和服', transit:'' },
  ] },
  routeB:{ totalDays:5, totalCost:980, cities:[
    { k:'tokyo', name:'东京', nights:2, hi:'购物+迪士尼', transit:'新干线 → 京都 约 2.2h' },
    { k:'kyoto', name:'京都', nights:1, hi:'古寺+和服', transit:'电车 → 大阪 约 45min' },
    { k:'osaka', name:'大阪', nights:2, hi:'环球影城+美食', transit:'' },
  ] },
  bundleWed:{ date:'周三出发', flight:{ dep:'上海', arr:'冲绳', price:980, info:'周三 09:20 直飞 · 约 3h' }, hotel:{ name:'那霸丽思海景酒店', price:2560, info:'高级海景房 × 2 晚' }, total:3240, save:300 },
  bundleFri:{ date:'周五出发', flight:{ dep:'上海', arr:'冲绳', price:1180, info:'周五 10:05 直飞 · 约 3h' }, hotel:{ name:'那霸丽思海景酒店', price:2780, info:'高级海景房 × 2 晚' }, total:3580, save:380 },
  cmpA:{ hotels:['丽思海景','万豪Spa','都市精选'], rows:[
    { label:'每晚价格', vals:['¥1280','¥1580','¥680'], bestIdx:2, bestMark:'最低' },
    { label:'评分', vals:['4.8','4.7','4.5'], bestIdx:0, bestMark:'最高' },
    { label:'位置', vals:['国际通','恩纳沙滩','单轨站'], bestIdx:0 },
    { label:'早餐', vals:['含','含','另付'], bestIdx:0 },
    { label:'泳池', vals:['室外','无边+儿童','无'], bestIdx:1, bestMark:'最优' },
  ] },
  cmpB:{ hotels:['丽思海景','万豪Spa','都市精选'], rows:[
    { label:'每晚价格', vals:['¥1280','¥1580','¥680'], bestIdx:2, bestMark:'最低' },
    { label:'评分', vals:['4.8','4.7','4.5'], bestIdx:0, bestMark:'最高' },
    { label:'位置', vals:['国际通','恩纳沙滩','单轨站'], bestIdx:0 },
    { label:'早餐', vals:['含','含','另付'], bestIdx:0 },
    { label:'泳池', vals:['室外','无边+儿童','无'], bestIdx:1, bestMark:'最优' },
    { label:'免费取消', vals:['入住前1天','入住前3天','不可取消'], bestIdx:1, bestMark:'最灵活', isNew:true },
  ] },
  deals:{ list:[
    { k:'resort', title:'丽思海景房 今夜特价', price:780, origin:1280, save:500, left:'3间' },
    { k:'food', title:'和牛自助 双人 限时', price:198, origin:398, save:200, left:'8份' },
    { k:'island', title:'美之海一日游 尾票', price:228, origin:328, save:100, left:'' },
    { k:'spa', title:'海景温泉 今晚可订', price:138, origin:288, save:150, left:'5位' },
  ] },
  transGround:{ list:[
    { icon:'train', title:'高铁 + 轮渡联运', sub:'全程约 8h · 沿海风景线', price:540, tag:'推荐' },
    { icon:'car', title:'自驾 + 跨海大桥', sub:'灵活停靠 · 约 9h', price:430, tag:'自由' },
    { icon:'plane', title:'保留：直飞航班', sub:'约 3h', price:980, tag:'', dim:true },
  ] },
};

/* ---------------- 场景 ---------------- */
const AGUI_SCENES = [
  { no:'01', title:'目的地推荐', tags:['G 摘要待命','A 中插展开','B 原地刷新'],
    steps:['灵感阶段用户没怎么浏览，直接问 AI「推荐个目的地」','AI 反问偏好（海岛/预算/同行人），用户一句话确认','在当前位置中插「目的地推荐」摘要卡并展开，3 个候选待交互','用户追问「近一点的」，同一组件原地刷新为近距离海岛'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S1', city:null });
      await e.scrollTop(); await e.sleep(700);
      await e.chat(true);
      await e.say('user','假期还没定，给我推荐个目的地吧');
      await e.think(900); await e.say('ai','想要海岛 / 城市 / 山野？预算和同行人大概是？');
      await e.sleep(700); await e.say('user','海岛，带娃，预算中等就好');
      await e.think(1000); await e.say('ai','好，先给你 3 个海岛亲子目的地的精简推荐 👇');
      await e.sleep(600); await e.chat(false); await e.sleep(450);
      await e.setInsert('destRec', AGD.destFar, 'top'); await e.expand();
      await e.sleep(1900);
      await e.chat(true); await e.sleep(300); await e.say('user','更想要近一点、飞行时间短的');
      await e.think(900); await e.say('ai','懂，换成近距离海岛，已原地更新～');
      await e.sleep(600); await e.chat(false); await e.sleep(450); await e.refresh(AGD.destNear);
    } },

  { no:'02', title:'预算反推', tags:['F 可调控件','B 原地刷新'],
    steps:['用户以预算发起：「我只有 3000 块能去哪」','中插「预算反推」控件：滑杆 + 预算内目的地列表','拖动预算滑杆，目的地实时增减','用户说「加到五千」，滑杆与列表原地更新'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S1', city:null });
      await e.scrollTop(); await e.sleep(700);
      await e.chat(true); await e.say('user','我只有 3000 块，能去哪玩？');
      await e.think(900); await e.say('ai','好，按 3000 元帮你反推，拖动预算还能调～');
      await e.sleep(600); await e.chat(false); await e.sleep(450);
      await e.setInsert('budget', AGD.budget3000, 'top'); await e.expand();
      await e.sleep(1600);
      await e.chat(true); await e.sleep(300); await e.say('user','预算能到五千，看看能多去哪');
      await e.think(800); await e.say('ai','好的，已把预算拉到 5000，结果实时变多了 👇');
      await e.sleep(600); await e.chat(false); await e.sleep(400);
      await e.update({ ...AGD.budget3000, budget:3900 }); await e.sleep(450);
      await e.update({ ...AGD.budget3000, budget:4500, list:AGD.budget5000.list.slice(0,3) }); await e.sleep(450);
      await e.refresh(AGD.budget5000);
    } },

  { no:'03', title:'行程规划', tags:['A 中插展开','B 原地刷新'], chip:'行程规划',
    steps:['决策中的用户在 feeds 浏览到一半，点底部「行程规划」气泡','AI 反问玩几天、什么偏好，用户一句话确认','在当前浏览位置中插行程组件，高度 0→展开','用户追问「压缩成 2 天」，同一组件原地刷新，不重新插入'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S2', city:'冲绳' });
      await e.scrollModule('feeds'); await e.sleep(700);
      await e.chat(true); await e.say('user','帮我规划一下行程');
      await e.think(900); await e.say('ai','好的～想玩几天？有什么偏好（亲子 / 美食 / 轻松节奏）？');
      await e.sleep(700); await e.say('user','3 天，带孩子，节奏轻松点');
      await e.think(1000); await e.say('ai','明白，已按「3 天 · 亲子 · 轻松」生成，正在你浏览的位置展开 👇');
      await e.sleep(700); await e.chat(false); await e.sleep(450);
      await e.setInsert('trip', AGD.tripRelax, 'feeds'); await e.expand();
      await e.sleep(1300); await e.browse(); await e.sleep(500);
      await e.chat(true); await e.sleep(300); await e.say('user','感觉有点松，压缩成 2 天吧');
      await e.think(900); await e.say('ai','好的，已就近重排为「2 天 · 紧凑版」，组件原地更新～');
      await e.sleep(600); await e.chat(false); await e.sleep(450); await e.refresh(AGD.tripCompact);
    } },

  { no:'04', title:'多城连游', tags:['A 中插展开','F 可拖重排'],
    steps:['用户想「一次连游 3 个城市」','中插多城连线路书，城市节点 + 段间交通，可拖动调整顺序','用户调整城市顺序，路线与总时长/交通费实时重算'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S1', city:null });
      await e.scrollTop(); await e.sleep(700);
      await e.chat(true); await e.say('user','这趟想一次连游 3 个城市');
      await e.think(900); await e.say('ai','好的，帮你把东京·大阪·京都串成最顺的动线 👇');
      await e.sleep(600); await e.chat(false); await e.sleep(450);
      await e.setInsert('multiCity', AGD.routeA, 'top'); await e.expand();
      await e.sleep(1800);
      await e.chat(true); await e.sleep(300); await e.say('user','把京都放中间，最后留大阪逛吃');
      await e.think(900); await e.say('ai','已重排顺序并重算交通，这样更顺、还省了 ¥200 👇');
      await e.sleep(600); await e.chat(false); await e.sleep(450); await e.refresh(AGD.routeB);
    } },

  { no:'05', title:'机酒打包', tags:['A 中插展开','B 原地刷新'],
    steps:['用户「帮我把机票 + 酒店配成打包价」','中插「机+酒打包器」，含去返程、酒店、打包总价','用户改出发日，航班时间与打包价原地刷新'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S2', city:'冲绳' });
      await e.scrollModule('feeds'); await e.sleep(700);
      await e.chat(true); await e.say('user','帮我把机票和酒店配成一个打包价');
      await e.think(900); await e.say('ai','按你常飞的周三出发配了一版，机+酒打包更省 👇');
      await e.sleep(600); await e.chat(false); await e.sleep(450);
      await e.setInsert('bundle', AGD.bundleWed, 'feeds'); await e.expand();
      await e.sleep(1800);
      await e.chat(true); await e.sleep(300); await e.say('user','改成周五出发');
      await e.think(900); await e.say('ai','好的，已换周五航班，打包价已更新～');
      await e.sleep(600); await e.chat(false); await e.sleep(450); await e.refresh(AGD.bundleFri);
    } },

  { no:'06', title:'不想坐飞机', tags:['C 楼层重排','A 中插展开'],
    steps:['用户「不想坐飞机，有别的方式吗」','把「到达方式」重排：高铁 / 自驾上移置顶','原航班方案降级保留，方案列表平滑切换'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S2', city:'冲绳' });
      await e.scrollModule('feeds'); await e.sleep(700);
      await e.chat(true); await e.say('user','不想坐飞机，有别的方式吗？');
      await e.think(900); await e.say('ai','好的，已把「到达方式」换成高铁 / 自驾优先，航班保留垫底 👇');
      await e.sleep(600); await e.chat(false); await e.sleep(450);
      await e.setInsert('transport', AGD.transGround, 'feeds'); await e.expand();
      await e.sleep(1200);
    } },

  { no:'07', title:'比较酒店', tags:['E 对比视图','B 加行刷新'], chip:'比较酒店',
    steps:['用户「帮我比较这几家酒店」','中插横向对比表（价格/评分/位置/早餐/泳池）','用户追加维度「能否免费取消」，对比表即时加一行'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S2', city:'冲绳' });
      await e.scrollModule('feeds'); await e.sleep(700);
      await e.chat(true); await e.say('user','帮我把这几家酒店做个对比');
      await e.think(900); await e.say('ai','好，拉了 3 家做横向对比，最优项已高亮 👇');
      await e.sleep(600); await e.chat(false); await e.sleep(450);
      await e.setInsert('compare', AGD.cmpA, 'feeds'); await e.expand();
      await e.sleep(2000);
      await e.chat(true); await e.sleep(300); await e.say('user','再加一行「能否免费取消」');
      await e.think(900); await e.say('ai','已加上「免费取消」这一行，方便你权衡～');
      await e.sleep(600); await e.chat(false); await e.sleep(450); await e.refresh(AGD.cmpB);
    } },

  { no:'08', title:'找特价', tags:['A 中插展开','C 切性价比档'], chip:'找特价',
    steps:['用户「有没有今晚能捡漏的特价」','切到性价比档（页面重渲染），并定位到秒杀楼层','中插特价聚合，按「立省」从高到低排序'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'premium', state:'S2', city:'冲绳' });
      await e.scrollTop(); await e.sleep(700);
      await e.chat(true); await e.say('user','有没有今晚能捡漏的特价？');
      await e.think(900); await e.say('ai','已为你切到性价比档，按立省排序聚合特价 👇');
      await e.sleep(500); await e.setCtx({ tier:'value' }); await e.sleep(500);
      await e.scrollModule('flashSale'); await e.sleep(420);   // 先平滑定位到秒杀楼层（到达当前浏览位置）
      await e.chat(false); await e.sleep(450);
      await e.setInsert('deals', AGD.deals, 'flashSale'); await e.expand();
      await e.sleep(1200);
    } },

  { no:'09', title:'带孩子适配', tags:['C 重渲染','A 中插展开'],
    steps:['用户「带 5 岁小孩，哪些适合」','切到亲子模式，页面整体按亲子重渲染','中插「亲子精选」行程摘要，待进一步交互'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S2', city:'冲绳' });
      await e.scrollTop(); await e.sleep(700);
      await e.chat(true); await e.say('user','带 5 岁小孩，哪些适合？');
      await e.think(900); await e.say('ai','已切到亲子模式重渲染页面，并给你一份适龄精选 👇');
      await e.sleep(500); await e.setCtx({ identity:'family' }); await e.sleep(600);
      await e.chat(false); await e.sleep(450);
      await e.setInsert('trip', AGD.tripRelax, 'top'); await e.expand(); await e.sleep(1200);
    } },

  { no:'10', title:'一家四口', tags:['C 重渲染','B 原地刷新'],
    steps:['用户「我们一家四口，2 大 2 小」','切到亲子模式并打开家庭档案，页面按 4 人重渲染','中插行程按家庭节奏生成，可继续追问刷新'],
    run: async (e)=>{
      await e.reset({ identity:'solo', tier:'value', state:'S2', city:'冲绳' });
      await e.scrollTop(); await e.sleep(700);
      await e.chat(true); await e.say('user','我们一家四口，2 大 2 小');
      await e.think(900); await e.say('ai','已切亲子模式、按 4 人入住重渲染，并给你一版家庭行程 👇');
      await e.sleep(500); await e.setCtx({ identity:'family' }); await e.sleep(600);
      await e.chat(false); await e.sleep(450);
      await e.setInsert('trip', AGD.tripRelax, 'top'); await e.expand(); await e.sleep(1000);
      await e.chat(true); await e.sleep(300); await e.say('user','孩子小，行程别太赶');
      await e.think(900); await e.say('ai','好的，已进一步放慢节奏、午后多留白给娃休息～');
      await e.sleep(600); await e.chat(false); await e.sleep(450); await e.refresh(AGD.tripEasy);
    } },
];

window.AGUI_SCENES = AGUI_SCENES;
