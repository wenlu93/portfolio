/* ============================================================
   OTA Demo — 数据层 + 编排内核
   window.DATA  : Mock 数据
   window.GRAD  : 占位图渐变生成
   window.buildFloors(ctx) : 三维标签 → 有序楼层 DSL
   ============================================================ */
(function(){
  /* ---------- 占位图：按 seed 生成稳定的旅行风渐变 ---------- */
  const GRADS = [
    ['#A9CDEB','#5F8FBE'], ['#F6C28C','#C78552'], ['#9BD6C7','#5C9B8B'],
    ['#C4B2EA','#806CB8'], ['#F0AAB8','#B86A7E'], ['#B9D9EF','#6CA5CB'],
    ['#E5CB8F','#A5854E'], ['#B8D8B5','#6B9C6A'], ['#F0C2A0','#B87A58'],
    ['#BFC7F0','#7480C0'], ['#E8A8BD','#A86682'], ['#A6D9DC','#5A9EA5']
  ];
  function hash(str){ let h=0; str=String(str); for(let i=0;i<str.length;i++){ h=(h*31+str.charCodeAt(i))>>>0; } return h; }
  window.GRAD = function(seed){
    const g = GRADS[hash(seed)%GRADS.length];
    const ang = 120 + (hash(seed+'a')%80);
    return `linear-gradient(${ang}deg, ${g[0]}, ${g[1]})`;
  };

  /* ---------- 真实图片：按「关键词 + 消费档」匹配 4K 高清实拍图 ----------
     - 细粒度命中：具体菜品 / 景观 / 城市目的地，越具体越优先
     - 高端档(premium)自动切到更具尊贵感的图集（无边泳池水上别墅 / 套房 / 城市夜景天际线 / 米其林餐厅），
       与性价比档(value)形成清晰区分
     - 机票卡片：带目的地城市时优先展示该城市风光，仅在无城市时回退到舷窗云海
     - 失败回退到 GRAD 渐变（Ph 组件 onError 处理）
     所有图集 id 均已逐张核对内容，确保色彩鲜艳、有质感、能激发旅行欲
  */
  window.IMG = function(seed, opts){
    const s = String(seed||'');
    opts = opts || {};
    const tier = opts.tier || window.__tier || 'value';
    const w = opts.w || 900;
    const U = id => (window.__resources && window.__resources['ph_'+id]) || `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

    /* —— 已核对内容的高清图集 —— */
    const B = {
      beach:    ['1507525428034-b723cf961d3e','1505228395891-9a51e7e86bf6','1537956965359-7573183d1f57','1505881502353-a1986add3762'],
      luxisland:['1514282401047-d79a71a590e8','1573843981267-be1999ff37cd','1544550581-5f7ceaf7f992','1571896349842-33c89424de2d','1571003123894-1f0594d2b5d9','1540541338287-41700207dee6'],
      resort:   ['1582719508461-905c673771fd','1542314831-068cd1dbfeeb','1551882547-ff40c63fe5fa','1564501049412-61c2a3083791'],
      cityDay:  ['1480714378408-67cf0d13bc1b','1474181487882-5abf3f0ba6c2'],
      cityNight:['1536599018102-9f803c140fc1','1538970272646-f61fabb3a8a2','1474181487882-5abf3f0ba6c2'],
      tokyo:    ['1540959733332-eab4deabeeaf','1533050487297-09b450131914'],
      nightlife:['1533050487297-09b450131914','1540959733332-eab4deabeeaf'],
      temple:   ['1508804185872-d7badad00f7d','1493976040374-85c8e12f0c0e','1590559899731-a382839e5549'],
      mountain: ['1469474968028-56623f02e42e','1506744038136-46273834b3fb','1545569341-9eb8b30979d9'],
      forest:   ['1448375240586-882707db888b','1511497584788-876760111969'],
      snow:     ['1551524559-8af4e6624178','1418985991508-e47386d96a71'],
      flower:   ['1522383225653-ed111181a951','1511497584788-876760111969'],
      panda:    ['1527118732049-c88155f2107c'],
      amuse:    ['1597466599360-3b9775841aec'],
      concert:  ['1470229722913-7c0e2dbbafd3','1533050487297-09b450131914'],
      flight:   ['1436491865332-7a61a109cc05'],
      diving:   ['1544551763-46a013bb70d5'],
      hotel:    ['1582719478250-c89cae4dc85b','1566073771259-6a8506099945','1611892440504-42a792e24d32'],
      spa:      ['1545569341-9eb8b30979d9','1611892440504-42a792e24d32'],
      /* 美食（细分菜系） */
      sushi:    ['1579871494447-9811cf80d66c'],
      ramen:    ['1569718212165-3a8278d5f624'],
      noodle:   ['1473093295043-cdd812d0e601','1569718212165-3a8278d5f624'],
      dumpling: ['1496116218417-1a781b1c416c'],
      roast:    ['1518492104633-130d0cc84637'],
      soup:     ['1455619452474-d2be8b1e70cd'],
      rice:     ['1559847844-5315695dadae'],
      foodGen:  ['1504674900247-0877df9cc836','1502602898657-3e91760cbb34','1559847844-5315695dadae','1432139555190-58524dae6a55'],
      fineDine: ['1517248135467-4c7edcad34c4','1611892440504-42a792e24d32'],
      biz:      ['1560472354-b33ff0c44a43','1497366216548-37526070297c'],
    };
    /* 高端档：高影响位切到尊贵图集，凸显高端与性价比的区分 */
    const PREM = { beach:'luxisland', cityDay:'cityNight', hotel:'resort', foodGen:'fineDine', diving:'luxisland' };
    function out(b){
      if(tier==='premium' && PREM[b]) b = PREM[b];
      const arr = B[b]; if(!arr || !arr.length) return U('1506744038136-46273834b3fb');
      return U(arr[hash(s+tier) % arr.length]);
    }

    /* 1) 具体菜品（最优先，命中美食名称） */
    const FOOD = [
      [/寿司|刺身|生鱼|鱼生|海鲜丼|丼/, 'sushi'],
      [/拉面|拉麵|乌冬|担担/, 'ramen'],
      [/沙茶面|炸酱面|蟹粉面|云吞面|冲绳面|阳春面|牛肉面|拌面|河粉|米线|面线/, 'noodle'],
      [/饺|小笼|生煎|汤包|烧麦|蒸饺|抄手|馄饨/, 'dumpling'],
      [/烤鸭|文昌鸡|烧烤|烤鱼|烤肉|脆皮|乳鸽|盐焗|猪扒|海蛎煎|烤串|bbq/i, 'roast'],
      [/火锅|椰子鸡|冬阴功|.锅|煲|羊蝎子|老火汤|汤底/, 'soup'],
      [/海南鸡饭|鸡饭|炒饭|焖饭|菠萝饭|糯米饭|红米饭|盖饭|咖喱|椰子鸡饭/, 'rice'],
      [/蛋挞|布甸|布丁|双皮奶|甜品|甜点|糖水|清补凉|三大炮|糯叽|冰淇淋|雪糕|奶茶|可丽饼|班戟|木糠|红芋挞|甜/, 'foodGen'],
      [/美食|餐厅|大排档|小吃|食肆|料理|宴|肠粉|早茶|茶餐厅|菠萝包|土笋冻|海葡萄|辣椒奶酪|酥油茶|焦圈|沙茶/, 'foodGen'],
    ];
    for(const [re,b] of FOOD){ if(re.test(s)) return out(b); }

    /* 2) 景观（细粒度，优先于城市名） */
    const SC = [
      [/马代|马尔代夫|私岛|水上别墅|无边泳池|私人沙滩|海底餐厅|蜜月岛/, 'luxisland'],
      [/潜水|浮潜|水族馆|海洋馆|海底|海豚|鲸|珊瑚/, 'diving'],
      [/海岛|海滩|沙滩|海边|海景|滨海|跳岛|皮皮|蜈支洲|亚龙湾|海棠湾|巽寮|分界洲|椰风|环岛路|白沙/, 'beach'],
      [/度假村|度假区|resort|庄园|villa/i, 'resort'],
      [/温泉|泡汤|私汤|地狱谷|会席/, 'spa'],
      [/滑雪|雪场|粉雪|二世谷|雪山|崇礼|冰雪|雪国/, 'snow'],
      [/雨林|森林|植物园|望天树|竹海|茶山|呀诺达|绿道|原始林|苍翠/, 'forest'],
      [/花海|薰衣草|樱花|油菜花|赏花|花田|花季/, 'flower'],
      [/熊猫/, 'panda'],
      [/迪士尼|乐园|主题乐园|欢乐谷|乐高|海洋公园|水世界|teamlab|游乐|城堡|环球影城/i, 'amuse'],
      [/演唱会|演出|音乐节|livehouse|赛事|展演|看台|内场|海报|话剧|秀场|剧场|音乐会|巡演/i, 'concert'],
      [/夜市|夜游|集市|庙会|老街|不夜城|霓虹|星光/, 'nightlife'],
      [/都市|江景|陆家嘴|国贸|天际线|高楼|高空|cbd/i, 'cityDay'],
      [/故宫|长城|寺|庙|宗堡|古城|古镇|园林|外滩|地标|城楼|首里城|大三巴|牌坊|宫殿|博物馆|世遗|历史|骑楼/, 'temple'],
      [/雪山|苍山|洱海|.山|峡谷|山谷|大佛|湖|河谷|瀑布|梯田|草原|高原|溪/, 'mountain'],
      [/商务舱|公务舱|头等舱|平躺|登机|候机|贵宾室|酒廊/, tier==='premium'?'resort':'flight'],
    ];
    for(const [re,b] of SC){ if(re.test(s)) return out(b); }

    /* 3) 城市目的地（机票/酒店/攻略默认展示目的地城市风光） */
    const CITY = [
      [/上海/, 'cityDay'],
      [/香港|维港|尖沙咀|中环/, 'cityNight'],
      [/澳门|重庆/, 'cityNight'],
      [/北京/, 'temple'],
      [/东京|大阪|新宿|浅草|涩谷|银座|横滨|名古屋/, 'tokyo'],
      [/三亚|普吉|冲绳|厦门|鼓浪屿|珠海|秦皇岛|北戴河|镰仓|石垣|宫古|海口|陵水|万宁|琼海|惠州|那霸|恩纳|古宇利/, 'beach'],
      [/北海道|札幌|小樽|函馆|登别|洞爷/, 'snow'],
      [/版纳|西双版纳|大理|丽江|桂林|普洱|勐腊|阆中|凤凰/, 'forest'],
      [/不丹/, 'mountain'],
      [/苏州|乌镇|南京|西安|洛阳|泉州|漳州|平遥|南靖/, 'temple'],
      [/杭州|无锡|黄山|峨眉|乐山|青城|都江堰|武夷|张家界|九寨|承德|箱根|日光|富士|河口湖/, 'mountain'],
      [/成都|深圳|广州|天津|武汉|长沙|青岛|大连|宁波|佛山|保定|张家口/, 'cityDay'],
      [/昆明|富良野/, 'flower'],
    ];
    for(const [re,b] of CITY){ if(re.test(s)) return out(b); }

    /* 4) 住宿（无城市/景观线索时） */
    if(/酒店|套房|大床|客房|入住|行政|公寓|民宿|住宿|房型|.房($| )|度假/.test(s)) return out('hotel');
    /* 5) 机票/交通（无目的地城市时回退舷窗云海；火车/高铁给城市图） */
    if(/机票|航班|飞|登机|高铁|动车|火车|车票|班次/.test(s)) return out(/高铁|动车|火车|班次/.test(s) ? 'cityDay' : 'flight');
    /* 6) 泛美食 / 商务 / 兜底 */
    if(/食|餐|菜|味/.test(s)) return out('foodGen');
    if(/商务|差旅|出差|会议|办公/.test(s)) return out('biz');
    return out(tier==='premium' ? 'resort' : 'mountain');
  };

  /* ---------- Mock 数据库 ---------- */
  const DATA = {};

  /* 目的地（地图 / 主题） */
  DATA.destinations = [
    { city:'三亚', lowPrice:1280, reason:'避寒首选 · 椰风海岸', x:62, y:78, kid:true },
    { city:'普吉', lowPrice:1680, reason:'亲子沙滩 + 无边泳池', x:40, y:88, kid:true },
    { city:'冲绳', lowPrice:2100, reason:'直飞3h · 水族馆遛娃', x:78, y:48, kid:true },
    { city:'上海', lowPrice:480,  reason:'都市差旅 · 高效通达', x:72, y:40, kid:false },
    { city:'北京', lowPrice:560,  reason:'故宫文化 · 长知识', x:70, y:28, kid:true },
    { city:'成都', lowPrice:620,  reason:'美食 + 熊猫基地', x:52, y:42, kid:true },
    { city:'马代', lowPrice:6800, reason:'私岛秘境 · 一价全包', x:30, y:70, kid:false },
    { city:'东京', lowPrice:1980, reason:'潮玩血拼 · 迪士尼', x:82, y:38, kid:true },
  ];

  /* 优惠券 —— 每类至少 3 张差异化券（面额/门槛/卖点各不相同）；高端档面额更大、付款门槛也更高 */
  DATA.coupons = {
    value: [
      // 机票
      { id:'c1', type:'flight', face:'满1000减200', amount:200, threshold:1000, scope:'国内机票', sell:'机票立减出行无忧', expire:'06-30', status:'unclaimed', stock:120 },
      { id:'c1b', type:'flight', face:'满2000减350', amount:350, threshold:2000, scope:'国内机票·往返', sell:'往返机票更省', expire:'06-30', status:'unclaimed', stock:62 },
      { id:'c1c', type:'flight', face:'满600减60',  amount:60,  threshold:600,  scope:'特价机票', sell:'短途特价随手领', expire:'06-15', status:'unclaimed', stock:0 },
      // 酒店
      { id:'c2', type:'hotel',  face:'满800减120',  amount:120, threshold:800,  scope:'酒店通用', sell:'酒店连住更划算', expire:'06-30', status:'unclaimed', stock:88 },
      { id:'c2b', type:'hotel', face:'满1500减260', amount:260, threshold:1500, scope:'度假酒店', sell:'度假连住立减', expire:'06-30', status:'unclaimed', stock:40 },
      { id:'c2c', type:'hotel', face:'满400减50',   amount:50,  threshold:400,  scope:'今夜特价', sell:'今夜特价房直减', expire:'06-20', status:'claimed', stock:56 },
      // 门票 / 玩乐
      { id:'c3', type:'ticket', face:'满200减30',   amount:30,  threshold:200,  scope:'景点门票', sell:'景点门票优惠', expire:'06-15', status:'unclaimed', stock:0 },
      { id:'c4', type:'category', face:'满500减60', amount:60,  threshold:500,  scope:'当地玩乐', sell:'当地玩乐随心选', expire:'06-20', status:'claimed',  stock:60 },
      { id:'c4b', type:'ticket', face:'满300减45',  amount:45,  threshold:300,  scope:'门票通用', sell:'乐园门票即领即用', expire:'06-25', status:'unclaimed', stock:110 },
    ],
    premium: [
      // 国际机票·商务舱（面额与门槛同步抬高）
      { id:'p1', type:'flight', face:'满8000减1500', amount:1500, threshold:8000, scope:'国际机票·商务舱', sell:'国际商务舱直减', expire:'07-31', status:'unclaimed', stock:30, invoice:true },
      { id:'p1b', type:'flight', face:'满15000减3200', amount:3200, threshold:15000, scope:'国际头等舱', sell:'头等舱专享立减', expire:'07-31', status:'unclaimed', stock:12, invoice:true },
      { id:'p1c', type:'flight', face:'满5000减800',  amount:800,  threshold:5000,  scope:'国际机票', sell:'长线机票大额减', expire:'07-15', status:'unclaimed', stock:48, invoice:true },
      // 高奢酒店
      { id:'p2', type:'hotel',  face:'满3000减500',  amount:500,  threshold:3000, scope:'高奢酒店', sell:'高奢酒店尊享礼遇', expire:'07-31', status:'unclaimed', stock:24, invoice:true },
      { id:'p2b', type:'hotel', face:'满8000减1600', amount:1600, threshold:8000, scope:'奢华度假村', sell:'奢华连住超值减', expire:'07-31', status:'unclaimed', stock:10, invoice:true },
      { id:'p2c', type:'hotel', face:'满2000减300',  amount:300,  threshold:2000, scope:'精选五星', sell:'五星酒店即享', expire:'07-20', status:'claimed', stock:36, invoice:true },
      // 门票 / 观演 / 全品类
      { id:'p3', type:'category', face:'尊享会员95折', amount:0,  threshold:0,    scope:'全品类 · 可叠加', sell:'全品类会员折扣', expire:'长期', status:'unclaimed', stock:200 },
      { id:'p3b', type:'ticket', face:'满2000减400', amount:400, threshold:2000, scope:'VIP观演·门票', sell:'内场VIP票立减', expire:'07-31', status:'unclaimed', stock:28, invoice:true },
      { id:'p3c', type:'ticket', face:'满1000减180', amount:180, threshold:1000, scope:'高端玩乐', sell:'臻选玩乐尊享减', expire:'07-25', status:'unclaimed', stock:54, invoice:true },
    ],
  };

  /* 秒杀 */
  DATA.flash = {
    flight: [
      { id:'f1', cat:'flight', img:'秒杀·机票', title:'上海虹桥→三亚 往返直飞', price:480, origin:980, discount:'4.9折', stock:6, sold:94, mins:42 },
      { id:'f2', cat:'flight', img:'秒杀·机票', title:'北京→成都 单程经济舱', price:399, origin:760, discount:'5.3折', stock:0, sold:100, mins:0 },
      { id:'f3', cat:'flight', img:'秒杀·机票', title:'广州→普吉 含税往返', price:1099, origin:1880, discount:'5.8折', stock:18, sold:62, mins:120 },
    ],
    hotel: [
      { id:'h1', cat:'hotel', img:'秒杀·三亚套餐', title:'三亚3晚亲子套餐 含早+乐园', price:1299, origin:2099, discount:'6.2折', stock:8, sold:92, mins:38, kid:true },
      { id:'h2', cat:'hotel', img:'秒杀·酒店', title:'上海外滩江景大床房', price:680, origin:1280, discount:'5.3折', stock:12, sold:74, mins:200 },
      { id:'h3', cat:'hotel', img:'秒杀·度假', title:'普吉无边泳池别墅2晚', price:1880, origin:3200, discount:'5.9折', stock:3, sold:88, mins:15, kid:true },
    ],
    ticket: [
      { id:'t1', cat:'ticket', img:'秒杀·迪士尼', title:'上海迪士尼乐园1日票', price:399, origin:599, discount:'6.7折', stock:0, sold:100, mins:0, kid:true },
      { id:'t2', cat:'ticket', img:'秒杀·演出', title:'演唱会内场预售票', price:880, origin:1280, discount:'6.9折', stock:22, sold:55, mins:300, event:true },
      { id:'t3', cat:'ticket', img:'秒杀·海洋馆', title:'海昌海洋公园亲子票', price:280, origin:460, discount:'6.1折', stock:30, sold:48, mins:480, kid:true },
    ],
  };

  /* Feeds 多产线 */
  DATA.feeds = [
    { id:'fd1', line:'hotel',  img:'亚特兰蒂斯', title:'三亚·亚特兰蒂斯海景房 含水世界', tags:['亲子友好','含早'], price:1880, score:4.8, sold:'月售2k+' },
    { id:'fd2', line:'ticket', img:'迪士尼门票', title:'上海迪士尼乐园 标准日票', tags:['网红','可改期'], price:399, score:4.9, sold:'月售5w+' },
    { id:'fd3', line:'flight', img:'特价机票', title:'上海→东京 含税往返', tags:['限时','直飞'], price:1980, score:4.6, sold:'月售800+' },
    { id:'fd4', line:'play',   img:'海岛浮潜', title:'普吉皮皮岛一日游 含接送', tags:['亲子友好','网红'], price:268, score:4.7, sold:'月售3k+' },
    { id:'fd5', line:'hotel',  img:'外滩酒店', title:'上海外滩W酒店 行政套房', tags:['商务','可开发票'], price:2680, score:4.9, sold:'月售600+' },
    { id:'fd6', line:'vacation', img:'马代一价全包', title:'马尔代夫私岛5天4晚一价全包', tags:['高端','蜜月'], price:12800, score:5.0, sold:'月售120+' },
    { id:'fd7', line:'ticket', img:'乐高乐园', title:'乐高乐园 双日联票', tags:['亲子友好','热销'], price:435, score:4.6, sold:'月售1k+' },
    { id:'fd8', line:'flight', img:'商务舱', title:'上海→伦敦 商务舱特惠', tags:['商务舱','平躺座'], price:18800, score:4.9, sold:'月售60+' },
    { id:'fd9', line:'play',   img:'温泉SPA', title:'杭州临安温泉度假1日', tags:['放松','情侣'], price:198, score:4.5, sold:'月售2k+' },
    { id:'fd10', line:'hotel', img:'亲子酒店', title:'广州长隆亲子主题房', tags:['亲子友好','含早'], price:980, score:4.8, sold:'月售1.5k+' },
    { id:'fd11', line:'vacation', img:'邮轮', title:'日本邮轮5晚 阳台房', tags:['全家','一价全包'], price:4980, score:4.7, sold:'月售300+' },
    { id:'fd12', line:'play',  img:'潜水考证', title:'三亚PADI潜水体验', tags:['探险','网红'], price:380, score:4.6, sold:'月售900+' },
  ];

  /* 场景主题 */
  DATA.themes = {
    kids:    { title:'陪娃看海，躺平不累', sub:'适龄 · 安全 · 好遛娃', kw:'family,beach',        dests:[{city:'三亚'},{city:'冲绳'},{city:'东京'},{city:'上海'},{city:'成都'},{city:'厦门'}] },
    parks:   { title:'亲子乐园打卡',       sub:'一站玩遍主题乐园',    kw:'amusement,park',       dests:[{city:'上海'},{city:'香港'},{city:'东京'},{city:'澳门'},{city:'深圳'},{city:'成都'}] },
    nature:  { title:'自然研学之旅',       sub:'在山海间长见识',      kw:'forest,nature',        dests:[{city:'西双版纳'},{city:'成都'},{city:'北海道'},{city:'冲绳'},{city:'三亚'},{city:'北京'}] },
    fun:     { title:'躺平不累的海滨度假', sub:'把度假还给度假',      kw:'beach,resort',         dests:[{city:'普吉'},{city:'冲绳'},{city:'三亚'},{city:'厦门'},{city:'马代'},{city:'澳门'}] },
    food:    { title:'寻味美食之城',       sub:'为一口吃的奔赴',      kw:'food,streetfood',      dests:[{city:'成都'},{city:'厦门'},{city:'香港'},{city:'澳门'},{city:'上海'},{city:'北京'}] },
    culture: { title:'古都人文漫步',       sub:'把历史走一遍',        kw:'temple,architecture',  dests:[{city:'北京'},{city:'成都'},{city:'上海'},{city:'香港'},{city:'澳门'},{city:'东京'}] },
    business:{ title:'高效商务短途',       sub:'当天往返不耽误会议',  kw:'city,skyline',         dests:[{city:'北京'},{city:'深圳'},{city:'香港'},{city:'上海'},{city:'成都'},{city:'东京'}] },
    luxury:  { title:'私享秘境',           sub:'包船 · 管家 · 不被打扰', kw:'luxury,resort',     dests:[{city:'马代'},{city:'不丹'},{city:'北海道'},{city:'东京'},{city:'普吉'},{city:'香港'}] },
    snow:    { title:'雪国温泉会席',       sub:'滑雪泡汤一条龙',      kw:'snow,winter',          dests:[{city:'北海道'},{city:'东京'},{city:'北京'},{city:'成都'},{city:'不丹'}] },
    show:    { title:'演出周边住宿全攻略', sub:'看完演出走回酒店',    kw:'concert,stage',        dests:[{city:'上海'},{city:'北京'},{city:'澳门'},{city:'深圳'},{city:'香港'},{city:'成都'}] },
  };

  /* 榜单 */
  DATA.rankings = {
    'kids-bright': { name:'亲子人气榜', groups:{
      '酒店':[
        {rank:1,name:'三亚·亚特兰蒂斯',score:4.8,price:1880,reason:'水世界+宝宝专属泳池'},
        {rank:2,name:'广州长隆熊猫酒店',score:4.7,price:980,reason:'乐园直通·主题客房'},
        {rank:3,name:'上海迪士尼乐园酒店',score:4.6,price:1680,reason:'园内入住·享优先入园'},
      ],
      '门票':[
        {rank:1,name:'上海迪士尼乐园',score:4.9,price:399,reason:'亲子必刷·全年热销首选'},
        {rank:2,name:'海昌海洋公园',score:4.6,price:280,reason:'海洋动物近距离互动'},
        {rank:3,name:'乐高乐园',score:4.6,price:435,reason:'6岁以上最爱·可玩一整天'},
      ],
      '餐厅':[
        {rank:1,name:'亲子主题自助餐厅',score:4.5,price:188,reason:'儿童小食台·边吃边玩'},
        {rank:2,name:'海洋馆景观餐厅',score:4.4,price:220,reason:'鱼缸全景·独特沉浸体验'},
      ],
    }},
    'luxe-blackgold': { name:'尊享臻选榜', groups:{
      '酒店':[
        {rank:1,name:'三亚·亚特兰蒂斯',score:4.9,price:2680,reason:'标志性度假地·无可替代'},
        {rank:2,name:'上海四季酒店',score:4.9,price:3280,reason:'陆家嘴核心·私人管家'},
        {rank:3,name:'丽思卡尔顿·行政套房',score:4.8,price:4180,reason:'行政酒廊·私享无边泳池'},
      ],
      '门票':[
        {rank:1,name:'故宫VIP专属导览',score:4.9,price:680,reason:'资深讲解·免排队入场'},
        {rank:2,name:'演唱会VIP观演区',score:4.8,price:1280,reason:'内场前区视角·专属休息区'},
      ],
      '餐厅':[
        {rank:1,name:'米其林三星·私厨',score:4.9,price:1880,reason:'预约制·主厨到台前介绍'},
        {rank:2,name:'江景高空法餐',score:4.8,price:980,reason:'360° 俯瞰城市·精致摆盘'},
      ],
    }},
    'default': { name:'Trip. Best', groups:{
      '酒店':[
        {rank:1,name:'上海外滩W酒店',score:4.8,price:1280,reason:'地标江景·设计感网红'},
        {rank:2,name:'成都太古里精品酒店',score:4.7,price:760,reason:'步行宽窄巷·文艺氛围'},
        {rank:3,name:'三亚海棠湾度假村',score:4.7,price:1180,reason:'私沙滩·全包式度假'},
      ],
      '门票':[
        {rank:1,name:'上海迪士尼乐园',score:4.9,price:399,reason:'年度必刷·全球顶级乐园'},
        {rank:2,name:'成都大熊猫基地',score:4.8,price:55,reason:'萌系体验·性价比超高'},
      ],
      '餐厅':[
        {rank:1,name:'城市人气火锅',score:4.6,price:120,reason:'排队2小时都值得的麻辣锅'},
        {rank:2,name:'海鲜大排档',score:4.5,price:160,reason:'当日鲜捕·价格透明公道'},
      ],
    }},
  };

  /* 目的地筛选列表（供猜你喜欢使用） */
  DATA.destList = ['三亚','普吉','冲绳','上海','北京','成都','东京','马代','香港','大理'];

  /* 帖子 */
  DATA.posts = [
    { id:'ps1', cover:'三亚亲子5天', title:'带3岁宝宝玩转三亚5天，攻略全在这', author:'豆豆妈呀', likes:328, tags:['亲子','攻略'] },
    { id:'ps2', cover:'商务出差', title:'商务出差也能住出度假感｜上海篇', author:'差旅老炮', likes:156, tags:['商旅','住宿'] },
    { id:'ps3', cover:'演唱会周边', title:'演唱会周边住宿全攻略，散场5分钟到房', author:'追星少女', likes:521, tags:['展演','住宿'] },
    { id:'ps4', cover:'马代蜜月', title:'马代私岛蜜月，人均1w的神仙体验', author:'环球旅人', likes:892, tags:['高端','蜜月'] },
    { id:'ps5', cover:'普吉自由行', title:'普吉自由行7天，海岛跳岛玩法合集', author:'背包客小林', likes:204, tags:['海岛','自由行'] },
  ];

  /* 行程卡片 */
  DATA.trip = {
    from:'上海', to:'三亚', departText:'3天后出发', flightNo:'MU5301', departTime:'08:20',
    hotel:'亚特兰蒂斯酒店 · 3晚', segs:[
      {type:'flight', label:'MU5301 上海虹桥→三亚凤凰', time:'06-04 08:20', status:'upcoming'},
      {type:'hotel',  label:'亚特兰蒂斯·海景房 入住', time:'06-04 14:00', status:'upcoming'},
    ],
  };
  DATA.tripBiz = {
    from:'上海', to:'北京', departText:'3天后出发', flightNo:'MU5101', departTime:'07:30',
    hotel:'国贸大酒店 · 2晚', segs:[
      {type:'flight', label:'MU5101 上海虹桥→北京首都', time:'06-04 07:30', status:'upcoming'},
      {type:'hotel',  label:'国贸大酒店·行政房 入住', time:'06-04 12:00', status:'upcoming'},
      {type:'meeting',label:'客户会议 · 国贸三期', time:'06-04 15:00', status:'upcoming'},
    ],
  };

  /* 高端服务 */
  const SVC_IMG = id => (window.__resources && window.__resources['svc_'+id]) || `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
  DATA.airlinePremium = {
    banners:[
      {icon:'seat',    src:SVC_IMG('1530521954074-e64f6810b32d'), title:'平躺座椅', desc:'180° 平躺，安睡如家'},
      {icon:'board',   src:SVC_IMG('1542296332-2e4473faf563'),   title:'优先登机', desc:'专属通道，无需久候'},
      {icon:'lounge',  src:SVC_IMG('1559508551-44bff1de756b'),   title:'机场贵宾室', desc:'免费餐饮 · WiFi · 休憩'},
      {icon:'service', src:SVC_IMG('1521791136064-7986c2920216'),title:'7×24 专属管家', desc:'改单、选座、预订休息室一句话搞定'},
    ],
    cabins:[ {route:'上海 → 伦敦', cabin:'商务舱', price:18800, perks:['平躺座','贵宾室','双行李额']},
             {route:'上海 → 北京', cabin:'公务舱', price:2980, perks:['优先登机','宽座','快速安检']} ],
  };
  DATA.hotelPremium = {
    banners:[
      {icon:'lounge', src:SVC_IMG('1517248135467-4c7edcad34c4'),title:'行政酒廊', desc:'全天点心与鸡尾酒时光'},
      {icon:'car',    src:SVC_IMG('1503376780353-7e6692767b70'),title:'专车接送机', desc:'豪华车型 · 司机待命'},
      {icon:'upgrade',src:SVC_IMG('1611892440504-42a792e24d32'),title:'免费升房', desc:'空房即升 · 延迟退房'},
      {icon:'butler', src:SVC_IMG('1540555700478-4be289fbecef'),title:'私人管家', desc:'24h 管家与 SPA 礼遇'},
    ],
    hotels:[ {name:'四季酒店 · 海景套房', price:4680, perks:['免费升房','接送机','私人管家']},
             {name:'丽思卡尔顿 · 行政房', price:3280, perks:['行政酒廊','延迟退房']} ],
  };
  DATA.ticketVIP = {
    perks:['免排队快速通道','专属导览讲解','VIP 观演区','正品保障','专人服务'],
    tickets:[ {name:'故宫 VIP 专属导览', price:680, perks:['快速通道','深度讲解']},
              {name:'演唱会 VIP 内场+包厢', price:1880, perks:['VIP观演区','专属休息区']} ],
  };

  /* 差旅助手 */
  DATA.bizTravel = {
    companyAddr:'陆家嘴', budget:800,
    hotels:[
      {name:'浦东香格里拉', dist:'步行 8 分钟', price:760, tags:['可开发票','协议价']},
      {name:'东方明珠亚朵', dist:'步行 12 分钟', price:620, tags:['可开发票','会员价']},
      {name:'金茂君悦大酒店', dist:'车程 6 分钟', price:980, tags:['行政酒廊','可改签']},
    ],
  };

  /* ---------- 高端会籍（高端模式顶部固定展示） ---------- */
  DATA.memberBenefits = {
    tierName:'黑钻会员',
    eyebrow:'尊享会籍',
    // 会籍阶梯（当前等级高亮）
    ladder:['普卡','银卡','金卡','铂金','黑钻'],
    current:4,                     // 当前等级索引（黑钻 = 顶级）
    coins:'12,860',               // Trip Coins 余额
    valid:'2026.12.31 到期',
    summary:'本年度已解锁 8 项专属权益',
    // 可享受的会员权益
    perks:[
      { icon:'coinT', title:'积分加赠 150%', sub:'消费返 Trip Coins' },
      { icon:'ticket',title:'免费景点门票', sub:'每月 1 张 · ×1' },
      { icon:'spark', title:'机场贵宾厅',   sub:'全年畅享 · ×3' },
      { icon:'bell',  title:'专属一对一客服', sub:'7×24 优先响应' },
      { icon:'car',   title:'接送机升舱',   sub:'车型免费升级' },
      { icon:'train', title:'火车退票免手续费', sub:'全年 4 次' },
      { icon:'bed',   title:'酒店会员价',   sub:'专享会员底价' },
      { icon:'check', title:'行程取消保障', sub:'机票+酒店无忧退' },
    ],
  };

  /* 展演打包 */
  DATA.eventBundle = {
    show:{ name:'盛夏巡回演唱会 · 上海站', venue:'梅赛德斯奔驰文化中心', date:'2026-06-04 19:30', poster:'演唱会海报' },
    bundles:[
      {hotel:'距场馆 500m · 五星酒店', ticket:'内场看台票', total:2380},
      {hotel:'距场馆 800m · 精品酒店', ticket:'VIP 内场票', total:3680},
    ],
  };

  DATA.familyDefault = { adults:2, children:[{age:3}], filled:false };

  /* ---------- 单目的地推荐（探索目的地 tab） ---------- */
  DATA.destRec = {
    head: {
      family:  { title:'热门遛娃地', sub:'最适合孩子出行的目的地' },
      default: { title:'热门目的地', sub:'为你精选的灵感目的地' },
    },
    list: [
      {
        city:'西双版纳', theme:'带娃和大象散步', themeSolo:'雨林秘境慢旅', img:'版纳 雨林', hot:true,
        reason:'热带雨林秘境，傣族风情浓郁。野象谷、热带植物园、告庄星光夜市一站集齐，四季如夏，随时出发。',
        reasonFamily:'雨林就是孩子的自然课堂——近距离看亚洲象、追蝴蝶、认热带植物；告庄夜市体验泼水与傣味，路线短、节奏慢，遛娃不赶路。',
        spots:[
          {name:'中科院热带植物园', tag:'自然科普', img:'版纳 雨林 绿', r:'万种热带植物，孩子的天然课堂'},
          {name:'野象谷', tag:'近距离看象', img:'野象谷 雨林', r:'空中走廊偶遇野生亚洲象'},
          {name:'告庄西双景·星光夜市', tag:'夜游', img:'告庄 夜市 乐园', r:'东南亚风情，逛吃拍一站集齐'},
        ],
        stays:[
          {name:'告庄景洪片区', tag:'夜市旁 · 配套全', img:'告庄 酒店', r:'下楼即夜市，亲子出行最省心'},
          {name:'万达文华度假区', tag:'带乐园 · 适合亲子', img:'版纳 度假村', r:'园区直通乐园，遛娃不用打车'},
        ],
        foods:[
          {name:'傣味烧烤', tag:'必吃', img:'傣味烧烤 美食', r:'香茅柠檬入味，酸辣开胃'},
          {name:'香茅草烤鱼', tag:'招牌', img:'烤鱼 美食', r:'外焦里嫩，孩子也爱吃'},
          {name:'菠萝饭', tag:'孩子爱', img:'菠萝饭 美食', r:'酸甜软糯，颜值味道都在线'},
        ],
        guides:[
          {title:'版纳3天2晚雨林亲子路线', meta:'1.2万浏览', img:'雨林 攻略', r:'懒人可直接抄，节奏松不赶路'},
          {title:'告庄夜市怎么逛不踩雷', meta:'8千收藏', img:'夜市 美食', r:'必吃摊位 + 避坑清单全收录'},
        ],
      },
      {
        city:'厦门', theme:'清新海边城市', themeSolo:'文艺海岛漫游', img:'厦门 海岛', hot:false,
        reason:'海风文艺小城，鼓浪屿万国建筑、环岛路骑行、沙滩日落，慢节奏里满是松弛感。',
        reasonFamily:'沙滩堆沙、海底世界看鱼、小火车环岛，景点集中步行可达；街巷平缓推车友好，第一次带娃看海的省心之选。',
        spots:[
          {name:'鼓浪屿', tag:'世遗 · 步行岛', img:'鼓浪屿 海岛', r:'万国建筑 + 海岛慢生活'},
          {name:'厦门海底世界', tag:'室内遛娃', img:'海底世界 海洋 乐园', r:'近距离看鱼，下雨天也能玩'},
          {name:'环岛路·椰风寨', tag:'看海骑行', img:'环岛路 海滩', r:'一边沙滩一边骑行，超出片'},
        ],
        stays:[
          {name:'环岛路沿线', tag:'一线海景', img:'厦门 海景 度假村', r:'推窗即海，看日出最方便'},
          {name:'中山路老城', tag:'近地铁 · 好逛', img:'中山路 城市', r:'地铁直达，逛吃买一站搞定'},
        ],
        foods:[
          {name:'沙茶面', tag:'必吃', img:'沙茶面 美食', r:'浓郁沙茶汤底，娃也喝光'},
          {name:'海蛎煎', tag:'招牌', img:'海蛎煎 美食', r:'外酥里嫩，海味十足'},
          {name:'土笋冻', tag:'本地特色', img:'土笋冻 美食', r:'闽南限定，海味弹嫩有惊喜'},
        ],
        guides:[
          {title:'厦门亲子4天慢游攻略', meta:'2.3万浏览', img:'厦门 海岛 攻略', r:'景点连线，少走回头路'},
          {title:'鼓浪屿一日不踩雷路线', meta:'1.1万收藏', img:'鼓浪屿 海岛', r:'避开人潮的隐藏玩法'},
        ],
      },
      {
        city:'成都', theme:'熊猫与美食之旅', themeSolo:'美食与慢生活', img:'成都 熊猫', hot:false,
        reason:'天府之国，巴适安逸。熊猫基地、宽窄巷子、川剧变脸，火锅与盖碗茶配齐市井烟火。',
        reasonFamily:'看大熊猫永远是孩子的高光时刻，基地大巴代步不累；都市乐园与博物馆丰富，微辣餐食也好安排，老人小孩都合适。',
        spots:[
          {name:'成都大熊猫基地', tag:'必访 · 早去', img:'熊猫 基地', r:'清晨最活跃，娃看了挪不动腿'},
          {name:'东郊记忆', tag:'潮玩拍照', img:'东郊记忆 城市', r:'工业风街区，随手出大片'},
          {name:'宽窄巷子', tag:'市井体验', img:'宽窄巷子 成都', r:'盖碗茶 + 掏耳朵，巴适得很'},
        ],
        stays:[
          {name:'春熙路·太古里', tag:'最繁华 · 好逛', img:'太古里 城市', r:'吃喝玩乐购，步行全覆盖'},
          {name:'熊猫基地周边', tag:'看熊猫近', img:'成都 酒店', r:'睡到自然醒也能赶早场熊猫'},
        ],
        foods:[
          {name:'微辣火锅', tag:'招牌', img:'火锅 美食', r:'可点鸳鸯锅，全家都照顾到'},
          {name:'钟水饺', tag:'孩子友好', img:'水饺 美食', r:'红油微甜不辣，娃能吃一盘'},
          {name:'三大炮', tag:'甜点', img:'三大炮 美食 甜', r:'糯叽叽裹黄豆粉，现打现吃'},
        ],
        guides:[
          {title:'成都亲子3天遛娃路线', meta:'3.1万浏览', img:'成都 攻略', r:'熊猫 + 乐园 + 美食一条龙'},
          {title:'熊猫基地几点去人最少', meta:'1.8万收藏', img:'熊猫', r:'错峰时段表，少排两小时'},
        ],
      },
      {
        city:'北京', theme:'亲子研学游', themeSolo:'古都人文漫步', img:'北京 故宫', hot:false,
        reason:'千年古都，文脉深厚。故宫、长城、中轴线，把历史课本立体地走一遍。',
        reasonFamily:'故宫、科技馆、自然博物馆是天然研学场；地铁通达、讲解丰富，边走边学，孩子的好奇心一路被点亮。',
        spots:[
          {name:'故宫博物院', tag:'必访 · 预约', img:'故宫 北京', r:'把历史课本走一遍'},
          {name:'中国科技馆', tag:'动手研学', img:'科技馆 乐园', r:'上百件展品可动手，娃玩疯'},
          {name:'八达岭长城', tag:'登高', img:'长城 北京', r:'登一次好汉坡，成就感拉满'},
        ],
        stays:[
          {name:'王府井·东城', tag:'近故宫 · 好逛', img:'王府井 城市', r:'步行到故宫，逛吃都方便'},
          {name:'奥林匹克公园', tag:'近科技馆', img:'鸟巢 城市', r:'紧邻科技馆，遛娃空间大'},
        ],
        foods:[
          {name:'烤鸭', tag:'必吃', img:'烤鸭 美食', r:'皮脆肉嫩，卷饼蘸酱真香'},
          {name:'炸酱面', tag:'本地', img:'炸酱面 美食', r:'八碟菜码拌一拌，娃也爱'},
          {name:'豆汁焦圈', tag:'尝鲜', img:'焦圈 美食', r:'老北京的地道味，配焦圈最对味'},
        ],
        guides:[
          {title:'北京研学5天经典路线', meta:'4.2万浏览', img:'北京 攻略', r:'故宫长城博物馆排得明明白白'},
          {title:'故宫怎么逛娃不累', meta:'2.6万收藏', img:'故宫', r:'省力动线 + 讲解亮点提示'},
        ],
      },
      {
        city:'三亚', theme:'阳光沙滩亲子游', themeSolo:'阳光海岛度假', img:'三亚 海滩', hot:false,
        reason:'热带海岛度假地，蓝天碧海椰林。亚龙湾、海棠湾、免税购物，冬季避寒的首选。',
        reasonFamily:'一价全包度假酒店省心，亲子泳池、沙滩、水世界够玩一整天；直飞航班多、不倒时差，带娃看海最轻松。',
        spots:[
          {name:'亚龙湾沙滩', tag:'细沙 · 浅水', img:'亚龙湾 海滩', r:'细沙缓坡，娃戏水很安心'},
          {name:'亚特兰蒂斯水世界', tag:'亲子必玩', img:'水世界 海洋 乐园', r:'水滑梯 + 水族馆，玩足一天'},
          {name:'蜈支洲岛', tag:'浮潜看鱼', img:'蜈支洲岛 海岛', r:'海水透亮，浮潜见成群热带鱼'},
        ],
        stays:[
          {name:'海棠湾', tag:'高端度假村', img:'海棠湾 度假村', r:'一价全包，下楼就是海'},
          {name:'亚龙湾', tag:'一线沙滩', img:'亚龙湾 海景 酒店', r:'老牌度假湾，亲子设施齐'},
        ],
        foods:[
          {name:'清补凉', tag:'消暑', img:'清补凉 美食 甜', r:'椰奶冰爽，暑天来一碗最舒爽'},
          {name:'海南鸡饭', tag:'孩子爱', img:'鸡饭 美食', r:'鸡香饭润，清淡好入口'},
          {name:'文昌鸡', tag:'招牌', img:'文昌鸡 美食', r:'皮黄肉嫩，海南名片菜'},
        ],
        guides:[
          {title:'三亚亲子5天度假攻略', meta:'5.6万浏览', img:'三亚 攻略 海滩', r:'酒店泡池 + 海岛连线不踩雷'},
          {title:'三亚一价全包酒店怎么选', meta:'3.4万收藏', img:'三亚 度假村', r:'按娃龄选酒店，省心又划算'},
        ],
      },
      {
        city:'上海', theme:'都市乐园之旅', themeSolo:'都市潮流漫游', img:'上海 城市', hot:false,
        reason:'魔都繁华，新潮与经典并存。迪士尼、外滩、科技馆，都市与童话一次满足。',
        reasonFamily:'迪士尼、海昌海洋公园、自然博物馆乐园云集；公共交通方便、母婴设施齐全，带娃逛城市最从容。',
        spots:[
          {name:'上海迪士尼乐园', tag:'必玩 · 早入园', img:'迪士尼 乐园', r:'童话照进现实，娃的梦中场景'},
          {name:'上海自然博物馆', tag:'室内研学', img:'博物馆 乐园', r:'恐龙化石互动，下雨也尽兴'},
          {name:'外滩·陆家嘴', tag:'看夜景', img:'外滩 城市', r:'万国建筑 + 摩天楼夜景同框'},
        ],
        stays:[
          {name:'迪士尼度假区', tag:'入园最近', img:'迪士尼 酒店', r:'提前入园，玩到最后一刻'},
          {name:'人民广场·南京路', tag:'交通枢纽', img:'南京路 城市', r:'多线地铁交汇，去哪都顺'},
        ],
        foods:[
          {name:'小笼包', tag:'必吃', img:'小笼包 美食', r:'皮薄汤多，先咬口再吸汤'},
          {name:'生煎', tag:'孩子爱', img:'生煎 美食', r:'底脆汁足，撒葱花芝麻香'},
          {name:'蟹粉面', tag:'招牌', img:'蟹粉面 美食', r:'满满蟹黄，鲜到舔碗'},
        ],
        guides:[
          {title:'上海亲子4天乐园路线', meta:'6.1万浏览', img:'上海 攻略 乐园', r:'乐园 + 都市混搭不累娃'},
          {title:'迪士尼带娃省力攻略', meta:'4.5万收藏', img:'迪士尼', r:'快速通行 + 排队时段避雷'},
        ],
      },
    ],
  };

  window.DATA = DATA;

  /* ---------- 目的地详情库（city → 完整详情，供「目的地灵感」复用单目的地推荐的详情） ---------- */
  DATA.destDB = {};
  DATA.destRec.list.forEach(d => { DATA.destDB[d.city] = d; });
  Object.assign(DATA.destDB, {
    '普吉': {
      city:'普吉',
      reason:'安达曼海的度假天堂，跳岛浮潜、悬崖无边泳池、泰式 SPA，海岛玩法一应俱全。',
      reasonFamily:'浅滩沙滩适合堆沙戏水，跳岛船程短；亲子度假村泳池滑梯齐全，泰式按摩还能让爸妈喘口气。',
      spots:[
        {name:'皮皮岛', tag:'跳岛浮潜', img:'皮皮岛 海岛', r:'透亮海水成群热带鱼'},
        {name:'神仙半岛', tag:'看落日', img:'神仙半岛 海滩', r:'安达曼海最美日落点'},
        {name:'普吉老城', tag:'文艺', img:'普吉老城 城市', r:'彩色骑楼随手出片'},
      ],
      stays:[
        {name:'卡塔/卡伦海滩', tag:'一线沙滩', img:'卡塔 海景 度假村', r:'下楼即沙滩，亲子友好'},
        {name:'芭东海滩', tag:'热闹便利', img:'芭东 海岛', r:'夜市商圈近，吃喝方便'},
      ],
      foods:[
        {name:'冬阴功汤', tag:'必喝', img:'冬阴功 美食', r:'酸辣开胃，海鲜满满'},
        {name:'芒果糯米饭', tag:'孩子爱', img:'芒果糯米饭 美食 甜', r:'香甜软糯，甜品担当'},
        {name:'泰式炒河粉', tag:'招牌', img:'泰式炒河粉 美食', r:'微甜不辣，老少咸宜'},
      ],
      guides:[
        {title:'普吉跳岛5天自由行攻略', meta:'3.2万浏览', img:'普吉 海岛 攻略', r:'船票顺序 + 避坑全在这'},
        {title:'亲子度假村怎么选', meta:'1.5万收藏', img:'普吉 度假村', r:'按娃龄挑泳池滑梯'},
      ],
    },
    '冲绳': {
      city:'冲绳',
      reason:'日本最南端的碧海岛屿，美丽海水族馆、古宇利跨海大桥、琉球文化，直飞约 3 小时。',
      reasonFamily:'美丽海水族馆的鲸鲨让孩子挪不开眼，海水浅而清；自驾环岛轻松、母婴设施完善，零时差不折腾。',
      spots:[
        {name:'美丽海水族馆', tag:'必访', img:'水族馆 海洋', r:'巨型鲸鲨同框，娃看疯'},
        {name:'古宇利岛', tag:'跨海大桥', img:'古宇利 海岛', r:'心形礁石 + 翡翠海'},
        {name:'首里城', tag:'琉球文化', img:'首里城 城市', r:'走进琉球王国历史'},
      ],
      stays:[
        {name:'恩纳村', tag:'度假酒店带', img:'恩纳 海景 度假村', r:'一线海景，亲子设施齐'},
        {name:'那霸国际通', tag:'好逛近机场', img:'那霸 城市', r:'购物吃饭交通都方便'},
      ],
      foods:[
        {name:'冲绳面', tag:'必吃', img:'冲绳面 美食', r:'清爽汤头，孩子好入口'},
        {name:'海葡萄', tag:'限定', img:'海葡萄 美食', r:'爆珠口感，海岛限定'},
        {name:'红芋挞', tag:'伴手礼', img:'红芋挞 美食 甜', r:'香甜不腻，伴手首选'},
      ],
      guides:[
        {title:'冲绳自驾4天经典路线', meta:'2.7万浏览', img:'冲绳 海岛 攻略', r:'环岛动线 + 租车贴士'},
        {title:'水族馆怎么逛不排队', meta:'1.2万收藏', img:'水族馆', r:'错峰时段 + 必看场次'},
      ],
    },
    '东京': {
      city:'东京',
      reason:'潮流与传统交融的国际都会，迪士尼、teamLab、浅草寺、银座血拼，玩法层出不穷。',
      reasonFamily:'迪士尼与海洋、teamLab、上野动物园串成乐园路线；地铁母婴友好、整洁安全，遛娃血拼两不误。',
      spots:[
        {name:'东京迪士尼', tag:'必玩', img:'东京 迪士尼', r:'童话照进现实'},
        {name:'teamLab', tag:'沉浸艺术', img:'teamLab 乐园', r:'光影互动，娃玩到忘时间'},
        {name:'浅草寺', tag:'传统', img:'浅草寺 东京', r:'雷门 + 仲见世逛吃'},
      ],
      stays:[
        {name:'舞滨', tag:'迪士尼旁', img:'东京 迪士尼 酒店', r:'提前入园不奔波'},
        {name:'新宿', tag:'交通枢纽', img:'新宿 城市', r:'多线交汇，去哪都顺'},
      ],
      foods:[
        {name:'寿司', tag:'必吃', img:'寿司 美食', r:'新鲜直送，入口即化'},
        {name:'一兰拉面', tag:'招牌', img:'拉面 美食', r:'浓汤细面，深夜必备'},
        {name:'可丽饼', tag:'孩子爱', img:'可丽饼 美食 甜', r:'原宿街头甜蜜担当'},
      ],
      guides:[
        {title:'东京亲子5天乐园路线', meta:'5.3万浏览', img:'东京 攻略', r:'乐园 + 都市混搭不累娃'},
        {title:'迪士尼快速通行攻略', meta:'3.1万收藏', img:'东京 迪士尼', r:'排队时段避雷表'},
      ],
    },
    '深圳': {
      city:'深圳',
      reason:'年轻的科技之城，平安金融中心、欢乐海岸、世界之窗，繁华高效又有活力。',
      reasonFamily:'欢乐谷、小梅沙海洋世界、科技馆主题丰富；地铁通达、设施新，带娃玩科技看海两不误。',
      spots:[
        {name:'欢乐谷', tag:'亲子必玩', img:'欢乐谷 乐园', r:'机动游戏老少通吃'},
        {name:'世界之窗', tag:'微缩景观', img:'世界之窗 城市', r:'一天环游世界地标'},
        {name:'莲花山公园', tag:'看城景', img:'莲花山 城市', r:'山顶俯瞰深圳天际线'},
      ],
      stays:[
        {name:'福田 CBD', tag:'商务核心', img:'深圳 城市', r:'地铁枢纽，出行高效'},
        {name:'南山海岸城', tag:'近海好逛', img:'深圳 海景', r:'海滨商圈，吃逛一体'},
      ],
      foods:[
        {name:'椰子鸡', tag:'招牌', img:'椰子鸡 美食', r:'清甜锅底，孩子能喝'},
        {name:'肠粉', tag:'早茶', img:'肠粉 美食', r:'滑嫩米香，早餐首选'},
        {name:'双皮奶', tag:'甜品', img:'双皮奶 美食 甜', r:'软滑奶香，餐后必点'},
      ],
      guides:[
        {title:'深圳亲子3天玩乐攻略', meta:'1.9万浏览', img:'深圳 攻略', r:'乐园 + 海岸线连游'},
        {title:'欢乐谷玩乐顺序', meta:'9千收藏', img:'欢乐谷 乐园', r:'热门项目错峰表'},
      ],
    },
    '香港': {
      city:'香港',
      reason:'东西交汇的购物天堂，维港夜景、太平山顶、双乐园，美食与潮牌密集。',
      reasonFamily:'迪士尼 + 海洋公园双乐园，叮叮车与天星小轮本身就好玩；茶餐厅口味温和，带娃 city walk 很轻松。',
      spots:[
        {name:'香港迪士尼', tag:'必玩', img:'香港 迪士尼 乐园', r:'全球最迷你也最精致'},
        {name:'海洋公园', tag:'亲子', img:'海洋公园 海洋', r:'看熊猫海豚 + 缆车'},
        {name:'太平山顶', tag:'夜景', img:'太平山 香港 城市', r:'维港夜景最佳机位'},
      ],
      stays:[
        {name:'尖沙咀', tag:'维港畔', img:'尖沙咀 城市 海景', r:'看夜景逛街都方便'},
        {name:'中环', tag:'交通核心', img:'中环 城市', r:'地铁机场快线交汇'},
      ],
      foods:[
        {name:'港式茶餐厅', tag:'必吃', img:'茶餐厅 美食', r:'丝袜奶茶配菠萝油'},
        {name:'菠萝包', tag:'孩子爱', img:'菠萝包 美食', r:'酥皮松软，下午茶担当'},
        {name:'云吞面', tag:'招牌', img:'云吞面 美食', r:'弹牙虾云吞，汤底鲜'},
      ],
      guides:[
        {title:'香港亲子4天双乐园攻略', meta:'4.1万浏览', img:'香港 攻略', r:'两园分天玩不累'},
        {title:'维港夜景机位攻略', meta:'2.2万收藏', img:'香港 城市', r:'幻彩咏香江最佳点位'},
      ],
    },
    '马代': {
      city:'马代',
      reason:'印度洋上的私岛秘境，水上别墅、一价全包、世界级浮潜，蜜月与度假的天花板。',
      reasonFamily:'一价全包最省心，儿童乐园与浅水泻湖安全；玻璃船看鱼、喂魟鱼，是孩子的海洋启蒙岛。',
      spots:[
        {name:'私人沙滩浮潜', tag:'必体验', img:'马代 私岛 海岛', r:'下水即珊瑚礁鱼群'},
        {name:'海底餐厅', tag:'打卡', img:'马代 海底餐厅', r:'被鱼群环绕的一餐'},
        {name:'出海看海豚', tag:'体验', img:'海豚 海洋', r:'落日巡航偶遇海豚群'},
      ],
      stays:[
        {name:'水上别墅', tag:'经典', img:'马代 水上别墅', r:'推门入海，私享泻湖'},
        {name:'沙滩别墅', tag:'适合亲子', img:'马代 沙滩别墅', r:'带娃下楼就是沙滩'},
      ],
      foods:[
        {name:'海鲜 BBQ', tag:'招牌', img:'海鲜烧烤 美食', r:'当日现捕，沙滩开吃'},
        {name:'马尔代夫咖喱', tag:'特色', img:'咖喱 美食', r:'椰香浓郁，配米饭绝'},
        {name:'热带水果', tag:'畅吃', img:'热带水果 美食 甜', r:'一价全包随心取'},
      ],
      guides:[
        {title:'马代选岛全攻略', meta:'6.8万浏览', img:'马代 私岛', r:'按预算亲子选对岛'},
        {title:'一价全包都含哪些', meta:'4.0万收藏', img:'马代 海岛', r:'餐饮与水上项目一文看懂'},
      ],
    },
    '不丹': {
      city:'不丹',
      reason:'喜马拉雅山脚的幸福国度，虎穴寺、宗堡建筑、纯净自然，深度而宁静。',
      reasonFamily:'节奏慢、空气好，适合大童研学了解异域文化；专车深度游不赶路，长辈也能从容同行。',
      spots:[
        {name:'虎穴寺', tag:'必访', img:'不丹 雪山 山', r:'悬崖上的不丹地标'},
        {name:'廷布宗堡', tag:'建筑', img:'不丹 宗堡 城市', r:'白墙金顶的宗教中心'},
        {name:'普纳卡河谷', tag:'自然', img:'普纳卡 山 绿', r:'双河交汇的翠绿宗堡'},
      ],
      stays:[
        {name:'廷布', tag:'首都便利', img:'廷布 城市', r:'城内通达，配套齐'},
        {name:'帕罗', tag:'近机场', img:'帕罗 山', r:'静谧河谷，登虎穴寺近'},
      ],
      foods:[
        {name:'辣椒奶酪', tag:'国菜', img:'辣椒奶酪 美食', r:'不丹餐桌的灵魂'},
        {name:'红米饭', tag:'主食', img:'红米饭 美食', r:'高原红米，嚼劲香'},
        {name:'酥油茶', tag:'暖身', img:'酥油茶 美食', r:'高原必备暖身饮'},
      ],
      guides:[
        {title:'不丹深度7天经典路线', meta:'1.1万浏览', img:'不丹 山 攻略', r:'宗堡 + 徒步全串联'},
        {title:'虎穴寺徒步贴士', meta:'7千收藏', img:'不丹 雪山', r:'体力分配 + 装备清单'},
      ],
    },
    '北海道': {
      city:'北海道',
      reason:'四季分明的北国，冬季滑雪与私汤、夏季花海与海鲜，自然与会席料理俱佳。',
      reasonFamily:'雪场设儿童雪具与教学，温泉酒店亲子房舒适；薰衣草花海与牧场体验，全家都能找到乐趣。',
      spots:[
        {name:'二世谷雪场', tag:'滑雪', img:'北海道 雪 山', r:'粉雪天堂，亲子雪具全'},
        {name:'小樽运河', tag:'浪漫', img:'小樽 城市 雪', r:'运河玻璃馆夜景超美'},
        {name:'富良野花海', tag:'夏季', img:'富良野 花海 绿', r:'薰衣草铺成紫色地毯'},
      ],
      stays:[
        {name:'二世谷', tag:'雪场私汤', img:'北海道 温泉 雪', r:'滑完雪泡汤一条龙'},
        {name:'札幌', tag:'交通枢纽', img:'札幌 城市', r:'美食购物交通核心'},
      ],
      foods:[
        {name:'海鲜丼', tag:'必吃', img:'海鲜丼 美食', r:'蟹籽三文鱼铺满碗'},
        {name:'汤咖喱', tag:'招牌', img:'汤咖喱 美食', r:'札幌限定，暖身开胃'},
        {name:'北海道牛奶冰', tag:'孩子爱', img:'牛奶冰淇淋 美食 甜', r:'浓醇奶香，娃必点'},
      ],
      guides:[
        {title:'北海道亲子滑雪5天', meta:'3.6万浏览', img:'北海道 雪 攻略', r:'雪场 + 温泉亲子线'},
        {title:'温泉会席礼仪贴士', meta:'1.4万收藏', img:'北海道 温泉', r:'泡汤规矩 + 着装'},
      ],
    },
    '澳门': {
      city:'澳门',
      reason:'中西合璧的度假之城，大三巴、巴黎人、新濠影汇，演艺秀场与美食云集。',
      reasonFamily:'综合度假村里水上乐园、室内过山车、海豚剧场一站玩；步行天桥连通各馆，带娃不暴晒不奔波。',
      spots:[
        {name:'新濠影汇水上乐园', tag:'亲子必玩', img:'澳门 水上乐园', r:'室内外水世界一整天'},
        {name:'巴黎人铁塔', tag:'打卡', img:'澳门 巴黎人 城市', r:'半比例铁塔超出片'},
        {name:'大三巴牌坊', tag:'历史', img:'大三巴 澳门', r:'澳门最经典地标'},
      ],
      stays:[
        {name:'路氹金光大道', tag:'度假村群', img:'澳门 度假村 城市', r:'连廊串联各乐园'},
        {name:'澳门半岛', tag:'近大三巴', img:'澳门 城市', r:'老城好逛，美食密'},
      ],
      foods:[
        {name:'葡式蛋挞', tag:'必吃', img:'葡式蛋挞 美食 甜', r:'焦香酥脆，现烤最佳'},
        {name:'猪扒包', tag:'招牌', img:'猪扒包 美食', r:'外脆里嫩，分量足'},
        {name:'木糠布甸', tag:'甜品', img:'木糠布甸 美食 甜', r:'葡式甜点，绵密好吃'},
      ],
      guides:[
        {title:'澳门亲子2天度假村攻略', meta:'2.0万浏览', img:'澳门 攻略', r:'乐园 + 秀场不暴走'},
        {title:'演艺秀怎么选', meta:'8千收藏', img:'澳门 城市', r:'各场馆秀场对比'},
      ],
    },
  });

  /* ---------- 附近目的地推荐（展演/商旅：周边短程热门，含车程+理由） ---------- */
  DATA.nearbyDest = {
    '上海': [
      { city:'苏州', pct:28, time:'23分钟', days:'2-4天', img:'苏州 园林', reason:'园林古镇高铁直达，沪上周边最经典的短途选择' },
      { city:'杭州', pct:23, time:'42分钟', days:'2-4天', img:'杭州 西湖', reason:'西湖龙井宋韵风雅，周末两日松弛短途首选' },
      { city:'乌镇', pct:15, time:'1小时', days:'1-2天', img:'乌镇 水乡', reason:'枕水人家夜游灯火，江南水乡的代表打卡地' },
      { city:'南京', pct:13, time:'1小时', days:'2-3天', img:'南京 城市', reason:'六朝古都人文厚重，景点集中美食云集' },
      { city:'无锡', pct:11, time:'30分钟', days:'1-2天', img:'无锡 太湖', reason:'鼋头渚赏太湖、灵山礼佛，性价比高' },
      { city:'黄山', pct:10, time:'2.5小时', days:'2-3天', img:'黄山 山', reason:'奇松云海日出，登高揽胜的经典名山' },
    ],
    '北京': [
      { city:'天津', pct:30, time:'30分钟', days:'1-2天', img:'天津 城市', reason:'近代风情五大道，相声茶馆市井烟火' },
      { city:'承德', pct:18, time:'40分钟', days:'2-3天', img:'承德 山', reason:'避暑山庄皇家园林，夏日清凉好去处' },
      { city:'秦皇岛', pct:16, time:'1小时', days:'2-3天', img:'秦皇岛 海滩', reason:'北戴河看海赶海，亲子避暑遛娃' },
      { city:'张家口', pct:14, time:'50分钟', days:'2-3天', img:'张家口 雪', reason:'崇礼冬奥同款雪场，滑雪胜地' },
      { city:'保定', pct:12, time:'40分钟', days:'1-2天', img:'保定 城市', reason:'白洋淀芦苇泛舟，驴肉火烧地道' },
    ],
    '成都': [
      { city:'乐山', pct:26, time:'1小时', days:'1-2天', img:'乐山 大佛 山', reason:'乐山大佛+峨眉金顶，山水人文连游' },
      { city:'都江堰', pct:22, time:'30分钟', days:'1-2天', img:'都江堰 山 绿', reason:'千年水利青城问道，避暑慢活' },
      { city:'峨眉山', pct:18, time:'1.5小时', days:'2-3天', img:'峨眉山 山', reason:'佛国仙山云海日出，猴趣盎然' },
      { city:'重庆', pct:16, time:'1.5小时', days:'2-3天', img:'重庆 城市', reason:'8D魔幻夜景，火锅江湖必体验' },
      { city:'阆中', pct:10, time:'2小时', days:'1-2天', img:'阆中 古城', reason:'保存完好的古城，张飞牛肉醋香' },
    ],
    '深圳': [
      { city:'广州', pct:28, time:'30分钟', days:'1-2天', img:'广州 城市', reason:'早茶醒狮岭南风，老城新潮一站逛' },
      { city:'珠海', pct:22, time:'1小时', days:'2-3天', img:'珠海 海滩', reason:'情侣路+长隆海洋，浪漫海滨遛娃' },
      { city:'香港', pct:20, time:'40分钟', days:'1-2天', img:'香港 城市', reason:'购物乐园双城游，维港夜景醉人' },
      { city:'佛山', pct:16, time:'40分钟', days:'1天', img:'佛山 城市', reason:'功夫之乡岭南古镇，美食扎实' },
      { city:'惠州', pct:10, time:'40分钟', days:'2天', img:'惠州 海滩', reason:'巽寮湾踏浪赶海，周末轻度假' },
    ],
    '冲绳': [
      { city:'宫古岛', pct:30, time:'飞行50分钟', days:'2-3天', img:'宫古岛 海岛', reason:'东洋第一白沙滩，海色梦幻' },
      { city:'石垣岛', pct:24, time:'飞行1小时', days:'2-3天', img:'石垣岛 海岛', reason:'八重山跳岛浮潜，星空绝美' },
      { city:'久米岛', pct:18, time:'飞行35分钟', days:'1-2天', img:'久米岛 海岛', reason:'叠石海岸与天堂海滩，浮潜清透' },
      { city:'庆良间群岛', pct:16, time:'高速船1小时', days:'1-2天', img:'庆良间 海岛', reason:'世界级「庆良间蓝」，跳岛浮潜梦幻' },
      { city:'奄美大岛', pct:12, time:'飞行1小时', days:'2-3天', img:'奄美 海岛', reason:'原生红树林独木舟，海岛慢生活' },
    ],
    '三亚': [
      { city:'陵水', pct:30, time:'25分钟', days:'1-2天', img:'陵水 海岛', reason:'分界洲岛潜水看海龟，清水湾细沙' },
      { city:'海口', pct:22, time:'1.5小时', days:'1-2天', img:'海口 城市', reason:'骑楼老街+火山口，椰城慢生活' },
      { city:'万宁', pct:18, time:'50分钟', days:'1-2天', img:'万宁 海滩', reason:'日月湾冲浪胜地，兴隆咖啡飘香' },
      { city:'保亭', pct:16, time:'车程1小时', days:'1-2天', img:'保亭 山 绿', reason:'呀诺达雨林+温泉，避世养生' },
      { city:'琼海', pct:10, time:'1小时', days:'1-2天', img:'琼海 海滩', reason:'博鳌玉带滩，三江入海奇观' },
    ],
    '东京': [
      { city:'横滨', pct:28, time:'30分钟', days:'1天', img:'横滨 城市', reason:'港未来海湾夜景，中华街吃到撑' },
      { city:'镰仓', pct:24, time:'1小时', days:'1天', img:'镰仓 海边', reason:'湘南海岸+大佛江电，文艺海滨小城' },
      { city:'箱根', pct:20, time:'1.5小时', days:'1-2天', img:'箱根 温泉 山', reason:'温泉旅馆+芦之湖，远眺富士山' },
      { city:'河口湖', pct:16, time:'车程2小时', days:'1-2天', img:'富士山 山', reason:'富士山下的湖景，逆富士绝佳机位' },
      { city:'日光', pct:12, time:'2小时', days:'1-2天', img:'日光 山 绿', reason:'世遗东照宫+华严瀑布，自然人文兼得' },
    ],
    '北海道': [
      { city:'小樽', pct:30, time:'40分钟', days:'1天', img:'小樽 城市 雪', reason:'运河玻璃馆音乐堂，浪漫雪国小镇' },
      { city:'登别', pct:22, time:'车程1.5小时', days:'1-2天', img:'登别 温泉 雪', reason:'地狱谷名汤，北海道温泉代表' },
      { city:'富良野', pct:18, time:'车程2小时', days:'1-2天', img:'富良野 花海 绿', reason:'夏季薰衣草花海，冬季粉雪雪场' },
      { city:'函馆', pct:16, time:'1小时', days:'1-2天', img:'函馆 城市 雪', reason:'百万夜景+朝市海鲜，缆车登山顶' },
      { city:'洞爷湖', pct:14, time:'车程2小时', days:'1-2天', img:'洞爷湖 山 绿', reason:'火山湖温泉，夏夜花火大会' },
    ],
    '厦门': [
      { city:'鼓浪屿', pct:32, time:'轮渡10分钟', days:'1天', img:'鼓浪屿 海岛', reason:'世遗琴岛万国建筑，步行慢游' },
      { city:'泉州', pct:24, time:'30分钟', days:'1-2天', img:'泉州 古城', reason:'宋元海丝起点，开元寺与古城烟火' },
      { city:'漳州', pct:18, time:'30分钟', days:'1天', img:'漳州 城市', reason:'古城与花海，海蛎美食扎实' },
      { city:'南靖土楼', pct:16, time:'车程2小时', days:'1-2天', img:'南靖 土楼 山', reason:'世遗客家土楼，山间田园风光' },
      { city:'武夷山', pct:10, time:'动车3小时', days:'2-3天', img:'武夷山 山 绿', reason:'丹霞九曲溪竹筏，岩茶飘香' },
    ],
    '西双版纳': [
      { city:'普洱', pct:30, time:'车程2小时', days:'1-2天', img:'普洱 山 绿', reason:'茶马古道源头，古茶山与雨林' },
      { city:'昆明', pct:24, time:'飞行50分钟', days:'1-2天', img:'昆明 城市', reason:'春城气候宜人，滇池翠湖慢生活' },
      { city:'大理', pct:20, time:'飞行1小时', days:'2-3天', img:'大理 苍山 洱海', reason:'苍山洱海风花雪月，古城慢游' },
      { city:'景洪', pct:16, time:'市内', days:'1天', img:'告庄 夜市 乐园', reason:'告庄星光夜市，傣味与泼水风情' },
      { city:'勐腊', pct:10, time:'车程1.5小时', days:'1-2天', img:'勐腊 雨林 绿', reason:'望天树雨林空中走廊，近边境' },
    ],
  };

  window.buildNearbyDest = function(city){
    if(DATA.nearbyDest[city]) return DATA.nearbyDest[city];
    // 兜底池：中性、国内外通用的描述（不绑定高铁/水乡等本土表述）
    const pool = [
      { name:'近郊自然风光', time:'车程1小时', days:'1-2天', kw:'山 绿', reason:'登高赏景亲近自然，周末轻松短途' },
      { name:'周边特色小城', time:'车程1.5小时', days:'1-2天', kw:'城市', reason:'街区风情与地道美食，慢游半日好惬意' },
      { name:'温泉度假地', time:'车程1.5小时', days:'2天', kw:'温泉', reason:'泡汤养生放松身心，四季皆宜' },
      { name:'海滨小城', time:'车程1小时', days:'2-3天', kw:'海滩', reason:'看海吹海风，亲子遛娃好去处' },
      { name:'历史古城', time:'车程2小时', days:'2天', kw:'古城', reason:'历史街区人文厚重，深度慢游' },
    ];
    return pool.map((p,i)=>({
      city: p.name, pct: 30 - i*4, time: p.time, days: p.days,
      img: city + ' ' + p.kw, reason: p.reason,
    }));
  };

  /* ============================================================
     编排内核 buildFloors(ctx) → 有序楼层
     ctx = { state:'S1', identity:'family', tier:'value', city:null }
     返回 [{module, props}]（已按 priority 降序）
     ============================================================ */
  function themeStyleFor(identity, tier){
    if(tier==='premium') return 'luxury';
    return ({solo:'fun', family:'kids', biz:'business', event:'show'})[identity] || 'fun';
  }
  function rankStyleFor(identity, tier){
    if(tier==='premium') return 'luxe-blackgold';
    if(identity==='family') return 'kids-bright';
    return 'default';
  }
  function feedWeights(identity){
    return ({
      solo:   { hotel:2, ticket:2, flight:2, play:2, vacation:1 },
      family: { ticket:3, play:3, hotel:2, flight:1, vacation:1 },
      biz:    { flight:3, hotel:3, ticket:1, play:1, vacation:1 },
      event:  { ticket:3, hotel:3, play:1, flight:1, vacation:1 },
    })[identity] || { hotel:2, ticket:2, flight:2, play:2, vacation:1 };
  }

  /* 酒店品牌（通用命名，非真实商标）—— 扩充至 24 个，降低单列表重复；卡片标题始终展示「酒店名称」 */
  DATA.hotelBrands = ['云栖度假酒店','君逸大酒店','海湾景观酒店','栖墅精选酒店','漫雅酒店','星樾度假村','和颐设计酒店','澜庭酒店','中心智选酒店','江岸大酒店','雅澜服务公寓','栖溪温泉酒店','名都大酒店','悦山居度假酒店','观澜半岛酒店','锦庐精品酒店','云顶山居','屿见海景酒店','沐光设计酒店','棠悦酒店','远山温泉酒店','城芯轻奢酒店','栖月公寓','晴澜湾度假村'];

  /* ---------- 兜底目的地：休闲场景默认海岛(冲绳)，商务场景默认商务枢纽(上海) ---------- */
  window.fallbackCity = function(identity){
    return identity === 'biz' ? '上海' : '冲绳';
  };

  /* ---------- 直飞可达性：个别目的地无直飞航班（如不丹需中转），机票文案据此调整 ---------- */
  DATA.noDirectCities = ['不丹'];
  window.hasDirectFlight = function(city){
    return !DATA.noDirectCities.includes(city);
  };

  /* ---------- Feeds 商品卡片：严格按 城市 + 业务线 生成，保证与分组一一对应 ---------- */
  window.buildFeedCards = function(city, line, tier){
    const db = window.DATA.destDB || {};
    const d = db[city];
    /* 价格区间按消费档分层：
       - value(性价比)：价格更亲民、上限更低，避免推荐过贵的商品；
       - premium(高端)：下限更高、整体更贵，避免推荐过于低廉的商品；
       - 其余调用方沿用默认中间区间。 */
    const PRICE_RANGES = {
      value:   { hotel:[320,1080],  flight:[320,1180],  ticket:[58,380],   play:[88,420]   },
      premium: { hotel:[1280,5600], flight:[1200,4800], ticket:[280,1280], play:[360,1680] },
      default: { hotel:[480,2600],  flight:[380,2600],  ticket:[80,680],   play:[120,680]  },
    };
    const RG = PRICE_RANGES[tier] || PRICE_RANGES.default;
    const hash = s => { let h=0; s=String(s); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; };
    const pr = (seed, lo, hi) => lo + Math.round((hash(seed) % 1000) / 1000 * (hi - lo));
    const SOLD = ['月售2k+','月售5k+','月售800+','月售1.2k+','月售3k+','月售600+','月售1.5k+'];
    const cards = [];
    const push = o => cards.push({
      city, line,
      score: (4.5 + (hash(o.title) % 5) / 10).toFixed(1),
      sold: SOLD[hash(o.title) % SOLD.length],
      ...o,
    });

    if(line === 'hotel'){
      const stays = (d && d.stays) || [{ name:'市中心', tag:'近地铁' }, { name:'热门商圈', tag:'好逛' }];
      const roomTypes = tier==='premium' ? [
        { rt:'行政海景套房', tag:'行政酒廊' },
        { rt:'无边泳池别墅', tag:'私人泳池' },
        { rt:'高层江景套房', tag:'落地全景' },
        { rt:'温泉汤泉套房', tag:'房内私汤' },
        { rt:'顶层全景套房', tag:'管家服务' },
        { rt:'庭院泳池别墅', tag:'独栋私享' },
        { rt:'臻选设计套房', tag:'设计名家' },
        { rt:'行政景观大床房', tag:'延迟退房' },
        { rt:'海岛水上别墅', tag:'推窗入海' },
        { rt:'尊享亲子套房', tag:'亲子礼遇' },
      ] : [
        { rt:'豪华大床房', tag:'含双早' },
        { rt:'高层海景房', tag:'一线海景' },
        { rt:'亲子主题套房', tag:'亲子友好' },
        { rt:'行政景观房', tag:'行政礼遇' },
        { rt:'家庭三人房', tag:'适合带娃' },
        { rt:'温泉双床房', tag:'房内泡汤' },
        { rt:'轻奢设计大床房', tag:'设计师款' },
        { rt:'江景双床房', tag:'高楼层' },
        { rt:'连住特惠房', tag:'连住更省' },
        { rt:'私享庭院房', tag:'独立空间' },
      ];
      // 酒店品牌（通用命名，非真实商标）—— 卡片标题始终展示「酒店名称」；按城市 hash 打散起点，避免跨城雷同
      const hotelBrands = window.DATA.hotelBrands;
      const boff = hash(city) % hotelBrands.length;
      // 配图按房型语义轮换，单列表呈现多张不同实拍图（酒店内景/都市江景/海景度假/温泉）
      const hotelImgKw = rt => /海景|度假/.test(rt) ? '海景度假村'
                              : /江景|景观|高层/.test(rt) ? '都市江景'
                              : /温泉/.test(rt) ? '温泉酒店' : '酒店';
      for(let i=0; i<30; i++){
        const s = stays[i % stays.length];
        const r = roomTypes[i % roomTypes.length];
        const brand = hotelBrands[(i + boff) % hotelBrands.length];
        push({
          title:brand,
          tags:[r.rt, s.tag || '热门'],
          price:pr(city + s.name + r.rt + i, RG.hotel[0], RG.hotel[1]),
          img:`${city} ${hotelImgKw(r.rt)} ${i}`,
        });
      }
    } else if(line === 'flight'){
      const dep = window.defaultDepartCity(city);
      const direct = window.hasDirectFlight(city);
      const AL = window.DATA.airlines;
      const times = ['07:30','09:50','12:10','15:40','19:20'];
      times.forEach((tm,i)=>{
        const al = AL[(hash(city) + i) % AL.length];
        push({
          title:`${dep} → ${city}`,
          depart:`${al.name} ${tm} 起飞 · ${direct ? '直飞' : '经停1次'}`,
          tags: direct ? ['直飞','可改签'] : ['中转','可改签'],
          price:pr(dep+city+tm, RG.flight[0], RG.flight[1]),
          img:`机票 ${city} ${i}`,
        });
      });
    } else if(line === 'ticket'){
      const spots = (d && d.spots) || [{ name:`${city}热门景点`, tag:'必访' }, { name:`${city}亲子乐园`, tag:'遛娃' }];
      const ticketTypes = tier==='premium' ? [
        { tt:'VIP免排队票', tag:'快速通道' },
        { tt:'专属导览票', tag:'专人讲解' },
        { tt:'贵宾观景票', tag:'最佳视角' },
        { tt:'含正餐尊享票', tag:'含臻选餐' },
        { tt:'私享包场体验', tag:'专属时段' },
        { tt:'含专车接送票', tag:'专车直达' },
        { tt:'双人臻选套票', tag:'2人同享' },
        { tt:'亲子尊享家庭票', tag:'亲子礼遇' },
        { tt:'两日联票', tag:'连玩2天' },
        { tt:'夜场尊享票', tag:'夜游专属' },
      ] : [
        { tt:'标准日票', tag:'可改期' },
        { tt:'双人优惠套票', tag:'2人同行' },
        { tt:'亲子家庭票', tag:'亲子友好' },
        { tt:'夜场票', tag:'夜游' },
        { tt:'早鸟特惠票', tag:'早订更省' },
        { tt:'含往返交通票', tag:'省心接驳' },
        { tt:'两日联票', tag:'连玩2天' },
        { tt:'VIP免排队票', tag:'快速通道' },
        { tt:'学生优惠票', tag:'凭证特惠' },
        { tt:'含餐尊享票', tag:'含正餐' },
      ];
      // 配图按 4 类语义轮换，避免整列同图
      const ticketImgKw = ['景点','城市地标','山水','海洋'];
      for(let i=0; i<30; i++){
        const s = spots[i % spots.length];
        const t = ticketTypes[i % ticketTypes.length];
        push({
          // 标题 = 景点名称 + 票种，保证 30 张互不重复
          title:`${s.name}·${t.tt}`,
          tags:[t.tag, s.tag || '必玩'],
          price:pr(city + s.name + t.tt + i, RG.ticket[0], RG.ticket[1]),
          img:`${city} ${ticketImgKw[i % ticketImgKw.length]} ${i}`,
        });
      }
    } else { // play
      const spots = (d && d.spots) || [];
      const foods = (d && d.foods) || [];
      const playImgKw = ['玩乐','山水','海洋','城市地标'];
      spots.forEach((s,i) => push({ title:`${city}·${s.name} 一日游`, tags:['网红', s.tag || '玩乐'], price:pr(city+s.name+'游', RG.play[0], RG.play[1]), img:`${city} ${playImgKw[i % playImgKw.length]} ${i}` }));
      if(foods[0]) push({ title:`${city} 地道美食漫游`, tags:['美食', '本地'], price:pr(city+'美食游', RG.play[0], Math.round((RG.play[0]+RG.play[1])/2)), img:`${city} 美食` });
      if(cards.length === 0) push({ title:`${city} 经典一日游`, tags:['网红', '玩乐'], price:pr(city+'经典游', RG.play[0], RG.play[1]), img:`${city} 玩乐` });
    }
    return cards;
  };

  /* ---------- Feeds 流内插：基于不同召回逻辑的优质货品（酒店/门票各 3 个示例） ---------- */
  window.buildRecoStrips = function(city, line, tier){
    const rot = (arr, n) => (arr.length ? arr.slice(n % arr.length).concat(arr.slice(0, n % arr.length)) : arr);
    const pick = (arr, n, count) => rot(arr, n).slice(0, count);
    const hotelPool  = window.buildFeedCards(city, 'hotel', tier);
    const ticketPool = window.buildFeedCards(city, 'ticket', tier);
    const playPool   = window.buildFeedCards(city, 'play', tier);
    const byPriceAsc = a => a.slice().sort((x, y) => x.price - y.price);

    /* 高端档：换一套克制、强调品质/同级/稀缺/礼遇的话术，不沿用「更划算/飙升榜/错过等一年」 */
    if(tier === 'premium'){
      if(line === 'hotel'){
        return [
          { id:'h-similar', tag:'同级臻选', icon:'spark',
            headline:`和你刚看的海景套房同级，这几家更值得托付`,
            live:'顺着你刚看的海景套房',
            items: pick(hotelPool, 3, 8) },
          { id:'h-cf', tag:'贵宾之选', icon:'heart',
            headline:`看过这些酒店的贵宾，最后都选了它们`,
            live:'同样品味的旅客也在看',
            items: pick(hotelPool, 12, 8) },
          { id:'h-rare', tag:'稀缺房型', icon:'bolt',
            headline:`${city} 同级酒店，这几家此刻仍有臻选房型`,
            live:'刚为你扫了同级在售房型',
            items: pick(hotelPool, 20, 8) },
        ];
      }
      if(line === 'ticket'){
        return [
          { id:'t-bundle', tag:'尊享加程', icon:'spark',
            headline:`门票配上这些臻选体验，一天更从容`,
            live:'为你的门票配一段私享体验',
            items: pick(playPool.concat(ticketPool), 1, 8) },
          { id:'t-peer', tag:'同好之选', icon:'heart',
            headline:`和你品味相近的旅客，都在 ${city} 体验这些`,
            live:'同好旅客近期都在玩',
            items: pick(ticketPool.concat(playPool), 5, 8) },
          { id:'t-curated', tag:'本季臻选', icon:'bolt',
            headline:`${city} 本季高人气体验，名额有限`,
            live:'刚更新的本地臻选体验',
            items: pick(ticketPool, 3, 8) },
        ];
      }
      return [
        { id:'x-rec', tag:'为你臻选', icon:'spark',
          headline:`逛到这儿，这几个最近最受青睐`,
          live:'顺着你刚刚的浏览',
          items: pick(playPool.concat(hotelPool), 2, 8) },
      ];
    }

    if(line === 'hotel'){
      return [
        { id:'h-similar', tag:'猜你想住', icon:'spark',
          headline:`和你刚看的海景房同款，这几家更划算`,
          live:'顺着你刚翻的几家海景房',
          items: pick(hotelPool, 3, 8) },
        { id:'h-cf', tag:'看了又看', icon:'heart',
          headline:`看过这些酒店的人，最后都订了它们`,
          live:'刚看的这几家，旅客也在订',
          items: pick(hotelPool, 12, 8) },
        { id:'h-price', tag:'同城好价', icon:'bolt',
          headline:`${city} 同段位酒店，这几家此刻更划算`,
          live:'刚帮你扫了同商圈的价',
          items: byPriceAsc(pick(hotelPool, 20, 9)).slice(0, 8) },
      ];
    }
    if(line === 'ticket'){
      return [
        { id:'t-bundle', tag:'顺路加玩', icon:'spark',
          headline:`门票配上这些玩乐，一天玩得更尽兴`,
          live:'配合你刚点的门票凑一程',
          items: pick(playPool.concat(ticketPool), 1, 8) },
        { id:'t-crowd', tag:'家庭热选', icon:'family',
          headline:`和你一样的家庭，都在 ${city} 玩这些`,
          live:'同行家庭最近都在玩',
          items: pick(ticketPool.concat(playPool), 5, 8) },
        { id:'t-trend', tag:'本周飙升', icon:'bolt',
          headline:`${city} 本周玩乐人气飙升榜，错过等一年`,
          live:'刚刷新的本地玩乐热度',
          items: pick(ticketPool, 3, 8) },
      ];
    }
    return [
      { id:'x-rec', tag:'为你精选', icon:'spark',
        headline:`逛到这儿，这几个最近最受欢迎`,
        live:'顺着你刚刚的浏览',
        items: pick(playPool.concat(hotelPool), 2, 8) },
    ];
  };

  /* ---------- 展演事件（按目的地映射，使头图事件名与所选城市对应） ---------- */
  DATA.eventShows = {
    '上海': { name:'盛夏巡回演唱会 · 上海站', venue:'梅赛德斯奔驰文化中心' },
    '北京': { name:'国民歌手世界巡演 · 北京站', venue:'国家体育场·鸟巢' },
    '广州': { name:'流行音乐节 · 广州站', venue:'天河体育中心' },
    '深圳': { name:'湾区音乐嘉年华 · 深圳站', venue:'深圳湾体育中心' },
    '成都': { name:'Live 现场巡演 · 成都站', venue:'东安湖体育公园' },
    '香港': { name:'红馆世界巡演 · 香港站', venue:'香港红磡体育馆' },
    '澳门': { name:'金光综艺馆演唱会 · 澳门站', venue:'澳门银河综艺馆' },
    '冲绳': { name:'海岛音乐祭 · 冲绳站', venue:'冲绳综合运动公园' },
    '三亚': { name:'海岸电音节 · 三亚站', venue:'三亚国际体育中心' },
    '东京': { name:'亚洲巡回演唱会 · 东京站', venue:'东京巨蛋 Tokyo Dome' },
  };
  window.eventShowFor = function(city){
    const c = city || '冲绳';
    const s = DATA.eventShows[c];
    if(s) return { name:s.name, venue:s.venue, date:'2026-06-04 19:30', poster:`${c} 演唱会海报` };
    return { name:`热门演出巡演 · ${c}站`, venue:`${c}文化体育中心`, date:'2026-06-04 19:30', poster:`${c} 演唱会海报` };
  };

  /* ---------- 机票默认出发城市（feeds 筛选 & 卡片 & 差旅助手共用，保证一致） ---------- */
  window.defaultDepartCity = function(city){
    return ['上海','北京','广州','成都','深圳','杭州'].filter(o=> o!==city)[0] || '上海';
  };

  /* ---------- 行程卡片：随当前目的地动态生成（出发地/到达地/酒店/航班/会议都跟随城市） ---------- */
  window.buildTrip = function(city, identity, phase){
    const c = city || window.fallbackCity(identity);
    const dep = window.defaultDepartCity(c);
    let h=0; const s='trip'+c+(identity||''); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
    const brand = DATA.hotelBrands[h % DATA.hotelBrands.length];
    const al = DATA.airlines[h % DATA.airlines.length];
    const flightNo = al.code + (300 + (h % 600));
    const nights = identity==='biz' ? 2 : 3;
    const direct = window.hasDirectFlight(c);
    const roomType = identity==='biz' ? '行政房' : (identity==='event' ? '大床房' : '海景房');
    const segs = [
      { type:'flight', label:`${flightNo} ${dep}→${c}${direct?'':'（中转）'}`, time:'06-04 08:20', status:'upcoming' },
      { type:'hotel',  label:`${brand}·${roomType} 入住`, time:'06-04 14:00', status:'upcoming' },
    ];
    if(identity==='biz') segs.push({ type:'meeting', label:`客户会议 · ${c}商务区`, time:'06-04 15:00', status:'upcoming' });
    return { from:dep, to:c, departText:'3天后出发', flightNo, departTime:'08:20', hotel:`${brand} · ${nights}晚`, segs };
  };

  /* ---------- 差旅助手出差地点（默认具体地址，精确到「路」） ---------- */
  DATA.bizAddrByCity = {
    '上海':'上海 · 浦东新区 世纪大道 100 号',
    '北京':'北京 · 朝阳区 建国路 88 号',
    '广州':'广州 · 天河区 珠江新城华夏路 8 号',
    '深圳':'深圳 · 福田区 中心四路 1 号',
    '成都':'成都 · 高新区 天府大道北段 1700 号',
    '杭州':'杭州 · 上城区 钱江路 58 号',
    '冲绳':'冲绳 · 那霸市 国际通 1-1',
    '三亚':'三亚 · 海棠区 海棠北路 16 号',
    '北海道':'札幌 · 中央区 大通西 4 丁目',
    '东京':'东京 · 千代田区 丸之内 1 丁目',
  };
  window.bizAddrFor = function(city){
    return DATA.bizAddrByCity[city] || `${city||'市中心'} · 人民中路 1 号`;
  };

  /* ---------- 差旅助手主力机票（去程 / 返程各 2 个时段，填满 4 张；标题为城市名 + 起飞时间） ---------- */
  window.buildBizFlights = function(city){
    const dep = window.defaultDepartCity(city);
    let h=0; const seed='bf'+dep+city; for(let i=0;i<seed.length;i++) h=(h*31+seed.charCodeAt(i))>>>0;
    const base = 620 + (h % 880);
    const dtag = window.hasDirectFlight(city) ? '直飞' : '中转';
    return [
      { title:`${dep} → ${city}`, sub:`去程 · 06-04 周四 08:20 起飞`, tags:[dtag,'可改签'], price: base,                 img:`机票 ${city}`, line:'flight' },
      { title:`${dep} → ${city}`, sub:`去程 · 06-04 周四 12:10 起飞`, tags:[dtag,'公务优选'], price: Math.round(base*1.08), img:`机票 ${city}`, line:'flight' },
      { title:`${city} → ${dep}`, sub:`返程 · 06-07 周日 19:40 起飞`, tags:[dtag,'含行李'], price: Math.round(base*0.92), img:`机票 ${city}`, line:'flight' },
      { title:`${city} → ${dep}`, sub:`返程 · 06-07 周日 21:30 起飞`, tags:[dtag,'红眼特价'], price: Math.round(base*0.84), img:`机票 ${city}`, line:'flight' },
    ];
  };

  /* ---------- 差旅助手：周边目的地交通（机票 / 火车票，按车程类型选择） ---------- */
  window.bizNearbyTransport = function(city, nearby){
    if(!nearby) return [];
    const isFlight = /飞行|飞机|航班|乘机/.test(String(nearby.time||''));
    let h=0; const seed=city+nearby.city; for(let i=0;i<seed.length;i++) h=(h*31+seed.charCodeAt(i))>>>0;
    const base = 60 + (h % 180);
    if(isFlight){
      return [
        { title:`${city} → ${nearby.city} 直飞`, tags:['直飞','可改签'], price: base+360, img:`机票 ${nearby.city}` },
        { title:`${city} → ${nearby.city} 含税`, tags:['特价','经济舱'], price: base+250, img:`机票 ${nearby.city}` },
      ];
    }
    return [
      { title:`${city} → ${nearby.city} 高铁`, tags:['高铁直达','灵活退'], price: base, img:`${nearby.city} 高铁` },
      { title:`${city} → ${nearby.city} 动车`, tags:['班次多','可改签'], price: Math.max(40, Math.round(base*0.8)), img:`${nearby.city} 高铁` },
    ];
  };

  /* ---------- 差旅助手：按行程阶段推荐不同货品 ---------- */
  window.buildBizSections = function(city, phase, budget){
    const FC = window.buildFeedCards;
    if(!FC) return [];
    const take = (line, n, c)=> (FC(c||city, line)||[]).slice(0, n);
    const cheapHotels = (n, c)=>{
      let hs = (FC(c||city,'hotel')||[]).slice().sort((a,b)=> a.price-b.price);
      if(budget){ const f = hs.filter(h=> h.price <= budget+600); if(f.length>=n) hs=f; }
      return hs.slice(0, n);
    };
    const nearby = (window.buildNearbyDest(city)||[])[0];
    const sec = [];
    if(phase==='S1' || phase==='S2' || phase==='S5'){
      sec.push({ key:'flight', title:'到达机票', icon:'plane', items: window.buildBizFlights(city) });
      sec.push({ key:'hotel',  title:'差旅酒店', icon:'bed',   items: cheapHotels(4) });
    } else if(phase==='S3'){
      sec.push({ key:'hotel', title:'差旅酒店 · 即将出行', icon:'bed', items: cheapHotels(4) });
    } else if(phase==='S4'){
      /* 行程中：差旅助手仅展示当地门票产品，周边交通/酒店改由附近目的地推荐组件承载 */
      sec.push({ key:'ticket', title:`${city} · 商务之余`, icon:'ticket', items: take('ticket',4) });
    }
    return sec;
  };

  /* ---------- Feeds 机票业务线：按时段（早/午/晚/凌晨）推荐，每段 2 张差异化低价票 ---------- */
  DATA.airlines = [
    { code:'MU', name:'东方航空', color:'#13449A' },
    { code:'CA', name:'中国国航', color:'#B5122E' },
    { code:'CZ', name:'南方航空', color:'#0A6CB4' },
    { code:'HU', name:'海南航空', color:'#C2142F' },
    { code:'HO', name:'吉祥航空', color:'#15589E' },
    { code:'9C', name:'春秋航空', color:'#1AA35A' },
    { code:'MF', name:'厦门航空', color:'#0E7D5A' },
  ];
  window.buildFlightPeriods = function(dep, dest, trip, cabin, identity){
    const AL = DATA.airlines;
    const isRound = trip === '往返';
    const cabinMul = cabin==='头等舱' ? 4.2 : cabin==='商务舱' ? 2.8 : 1;
    const tripMul = isRound ? 1.9 : 1;
    let hh=0; const seed='fp'+dep+dest; for(let i=0;i<seed.length;i++) hh=(hh*31+seed.charCodeAt(i))>>>0;
    const base = 420 + (hh % 700);   // 单程经济基准价
    const econ = cabin === '经济舱';

    /* 推荐理由按出行身份分流：商务讲效率会议，亲子讲娃的节奏，展演贴演出当天，休闲讲玩满省心 */
    const aud = identity==='biz' ? 'biz' : identity==='family' ? 'family' : identity==='event' ? 'event' : 'leisure';
    const REASONS = {
      morning: {
        biz:    ['早班机准点率最高，落地正好赶上上午会议。','错峰出行运价更友好，时间利用率拉满。'],
        family: ['上午落地娃还精神，直接开启第一站。','早班机准点率高，带娃出行少等待、少折腾。'],
        event:  ['白天先落地安顿好，晚上看演出不慌张。','早到留足时间取票、踩点场馆周边。'],
        leisure:['一早落地，整个白天都能用来玩。','错峰时段运价更友好，省下的多玩一程。'],
      },
      afternoon: {
        biz:    ['午后出发不赶早，上午还能处理完手头工作。','航班班次最多，可挑的低价座位也更充裕。'],
        family: ['午后出发，上午在家收拾娃的行李更从容。','班次最多，挑个娃午睡的点上飞机最省心。'],
        event:  ['午后到达，先吃顿好的再从容去场馆。','班次多、可选座足，挑个准点的稳赶演出。'],
        leisure:['午后出发不必赶早，睡到自然醒再从容出门。','航班班次最多，可挑的低价座位也更充裕。'],
      },
      evening: {
        biz:    ['下班后直飞，白天工作一点不耽误。','到店即可休息，第二天满血开工。'],
        family: ['玩到傍晚再登机，白天行程一点不浪费。','到酒店就能哄睡，娃不闹腾。'],
        event:  ['看完演出当晚不走，次日傍晚航班从容返程。','傍晚出发避开白天奔波，到店好好歇。'],
        leisure:['白天玩满再走，傍晚航班不浪费一天。','到店即休息，第二天一早接着出发。'],
      },
      dawn: {
        biz:    ['红眼航班运价触底，预算敏感的首选。','落地即清晨，无缝衔接当天会议不浪费。'],
        family: ['红眼班机较折腾，带小宝宝建议优先白天航班。','孩子较大时，落地清晨可无缝衔接首日行程。'],
        event:  ['红眼运价最低，预算留给好票。','凌晨落地清晨，看演出前先回酒店补觉。'],
        leisure:['红眼航班运价触底，把预算留给目的地。','落地即清晨，整个第一天都能尽情玩。'],
      },
    };

    const periods = [
      { key:'morning', label:'早上', range:'06:00–12:00', pf:0.96,
        reasons:REASONS.morning[aud], deps:['07:30','09:50'], rets:['20:15','18:40'] },
      { key:'afternoon', label:'下午', range:'12:00–18:00', pf:0.90,
        reasons:REASONS.afternoon[aud], deps:['13:20','15:40'], rets:['21:30','19:10'] },
      { key:'evening', label:'晚上', range:'18:00–24:00', pf:0.85,
        reasons:REASONS.evening[aud], deps:['19:20','21:35'], rets:['22:50','20:05'] },
      { key:'dawn', label:'凌晨', range:'00:00–06:00', pf:0.72,
        reasons:REASONS.dawn[aud], deps:['01:15','04:40'], rets:['23:30','06:20'] },
    ];

    return periods.map((p, pi)=>{
      const fareDefs = econ
        ? [{ tags:['含23kg托运','可改签'], ff:1.0 }, { tags:['仅手提 · 特价','限时立减'], ff:0.82 }]
        : [{ tags:['含双倍行李额','贵宾休息室'], ff:1.0 }, { tags:['灵活改签','优先登机'], ff:0.9 }];
      const cards = fareDefs.map((fd, ci)=>{
        const al = AL[(hh + pi*2 + ci*3) % AL.length];
        const price = Math.round(base * cabinMul * tripMul * p.pf * fd.ff / 10) * 10;
        return {
          airline: al, depart: p.deps[ci], ret: p.rets[ci],
          tags: fd.tags, price,
        };
      }).sort((a,b)=> a.price - b.price);   // 低价在前
      return { key:p.key, label:p.label, range:p.range, reasons:p.reasons, cards };
    });
  };

  /* ---------- 目的地灵感：把「主题」与「目的地本体理由」缝合，使展开详情与上层主题呼应 ---------- */
  DATA.themeLead = {
    kids:    '遛娃动线成熟、节奏不赶',
    parks:   '主题乐园是这里的亲子高光',
    nature:  '在山海之间就是天然课堂',
    fun:     '主打海滨度假的松弛感',
    food:    '为一口地道吃食值得专程',
    culture: '人文古迹值得放慢脚步细品',
    business:'商务出行高效通达、不将就',
    luxury:  '适合低调私享的高端体验',
    snow:    '冬季滑雪泡汤正当时',
    show:    '看完演出顺道把城市也玩一遍',
  };
  window.themedDestReason = function(themeKey, city, isFamily){
    const db = DATA.destDB && DATA.destDB[city];
    const base = db ? (isFamily ? (db.reasonFamily || db.reason) : db.reason) : '';
    const lead = DATA.themeLead[themeKey];
    if(!lead) return base;
    return `${city}${lead}。${base}`;
  };

  /* Trip Coins 价值：1 Trip Coin = $1 USD ≈ ¥7.2。
     赚取 = 订单金额(¥) × 返赠比例 ÷ 汇率，向下取整、至少 1，避免出现「离谱」的大额数字。 */
  window.RMB_PER_COIN = 7.2;
  window.coinsFor = function(rmb, rate){
    rate = rate || 0.05;
    return Math.max(1, Math.floor((Number(rmb)||0) * rate / window.RMB_PER_COIN));
  };

  window.buildFloors = function(ctx){
    const { state, identity, tier, city } = ctx;
    const F = [];
    const add = (module, priority, props={}) => F.push({ module, priority, props });
    const premium = tier === 'premium';
    const themeStyle = themeStyleFor(identity, tier);
    /* 亲子 · 探索 tab 的专属楼层排序 */
    const famExplore = identity==='family' && (state==='S1'||state==='S5');

    /* 行程卡片 */
    if(state==='S3') add('tripCard', 100, { phase:'pre' });
    if(state==='S4') add('tripCard', 100, { phase:'onway' });
    /* 行程后(S5)：不展示行程卡片 */

    /* 城市头图（event 用展演头图替代，不在此出） */
    if(['S2','S3','S4'].includes(state) && identity!=='event') add('cityHero', 95, { city: city || window.fallbackCity(identity), state, tier });

    /* 家庭档案（亲子身份始终展示，置于页面最顶部） */
    if(identity==='family') add('familyProfile', 120);

    /* 单目的地推荐（决策态 S2 展示单目的地推荐模块） */
    if(state==='S2') add('destRec', 115, { identity });

    /* 场景化导购 / 目的地灵感（探索目的地 tab 专属内容，全阶段提供；城市 tab 中会被过滤掉） */
    add('sceneGuide', 74, { themeStyle });

    /* 发现低价目的地：仅个人/亲子出行，在探索目的地 tab 替换原目的地灵感/目的地推荐位置；统一展示机票+酒店低价 */
    if(identity==='solo' || identity==='family') add('lowPriceDest', 73, { identity, tier, state });

    /* 商旅差旅助手（商务身份始终展示，置于页面最顶部，按行程阶段推荐不同货品） */
    if(identity==='biz') add('bizTravel', 120, { phase: state });

    /* 展演周边打包（展演身份始终展示，置于页面最顶部） */
    if(identity==='event') add('eventBundle', 120);

    /* 行程规划 */
    if(['S2','S3','S4'].includes(state)) add('tripPlan', 69, { identity });
    else if(famExplore) add('tripPlan', 60, { identity });

    /* 高端服务（航司尊享 / 酒店尊享）：默认置于「刚刚浏览过的」下方、feeds 流上方 */
    if(premium && state!=='S5'){
      if(identity==='event'){ add('hotelPremium', 5.3); }
      else if(identity==='biz'){ add('airlinePremium', 5.4); add('hotelPremium', 5.3); }
      else { add('airlinePremium', 5.4); add('hotelPremium', 5.3); }
    } else if(premium && state==='S5'){
      /* 行程后：航司尊享服务也展示，置于酒店尊享服务上方 */
      add('airlinePremium', 5.4);
      add('hotelPremium', 5.3);
    }

    /* 优惠券（S2/S3 临门，靠前；亲子探索置于次位） */
    let cP = 60;
    if(state==='S2') cP = 80;
    if(state==='S3') cP = 64;
    if(famExplore) cP = 88;
    add('coupon', cP, { tier, identity, tone: state==='S1'?'seed':(state==='S3'||state==='S4')?'imminent':state==='S5'?'return':'normal' });

    /* 秒杀（高端模式不直接展示秒杀组件；商旅下沉；S3◔ S4/S5⬇） */
    if(!premium){
      let fP = 58;
      if(state==='S2') fP = 78;
      if(state==='S3') fP = 44;
      if(state==='S4' || state==='S5') fP = 20;
      if(identity==='biz') fP = Math.min(fP, 18);
      if(famExplore) fP = 82;
      add('flashSale', fP, { identity });
      /* Trip Coins 返赠：有秒杀时，紧贴秒杀下方 */
      add('coinsRebate', fP - 1, { identity, tier });
    } else {
      /* 高端模式无秒杀：Trip Coins 返赠每个场景都展示，默认置于优惠券下方 */
      add('coinsRebate', cP - 0.5, { identity, tier });
    }

    /* 附近目的地推荐（周边短途热门，仅在非「探索目的地」tab 展示，且始终置于 feeds 流上方）
       - 行程前/中/后(S3/S4/S5)：紧贴行程卡片下方（商旅/展演的差旅助手/展演卡片在更上方）
       - 灵感/决策(S1/S2)：置于 feeds 流上方
       - 商务出行 · 灵感/决策(S1/S2)：紧贴 feeds 流正上方（在秒杀/返赠之下） */
    let ndP = 52;
    if(state==='S3' || state==='S4' || state==='S5') ndP = 99;
    if(identity==='biz' && (state==='S1' || state==='S2')) ndP = 6;
    add('nearbyDest', ndP, { city: city||'冲绳' });

    /* 榜单：暂时不在页面上展示任何榜单组件（含亲子人气榜 / 尊享臻选榜） */
    /* （如需恢复，可在此按 rankStyleFor(identity,tier) 重新 add('ranking', 6, {...})） */

    /* 帖子（高端下沉） */
    add('posts', premium ? 14 : (state==='S5' ? 50 : 34), { s5: state==='S5' });

    /* 刚刚浏览过的（以酒店为例）：默认置于 Feeds 流正上方，支持订阅降价 */
    add('recentViewed', 5.5, { city: city||'三亚', tier });

    /* Feeds 永远兜底 */
    add('feeds', 5, { weights: feedWeights(identity), tier });

    return F.sort((a,b)=> b.priority - a.priority);
  };

  /* tab 默认值 */
  window.defaultTab = function(state){
    return (state==='S1' || state==='S5') ? 'explore' : 'city';
  };
})();
