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
    const U = id => {
      const resources = window.__resources || {};
      const primary = resources['ph_'+id];
      if (primary) return primary;
      let mobileHost = false;
      try {
        mobileHost = window.parent !== window ? window.parent.innerWidth <= 700 : window.innerWidth <= 700;
      } catch (e) {
        mobileHost = window.innerWidth <= 700;
      }
      if (mobileHost) {
        return resources['ag_photo-'+id] || resources['svc_'+id] || `deals-assets/images/mobile-unsplash/${id}.jpg`;
      }
      return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
    };

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


/* 7ab4dcb6-04f5-4044-842d-88d7ec062c08.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* ============================================================
   OTA Demo — 共享 UI 原子组件 (导出到 window)
   ============================================================ */
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useCallback = _React.useCallback;

/* ---------- 占位图（支持真实图片） ---------- */
function Ph(_ref) {
  var label = _ref.label,
    w = _ref.w,
    h = _ref.h,
    r = _ref.r,
    style = _ref.style,
    className = _ref.className,
    children = _ref.children,
    photo = _ref.photo,
    src = _ref.src;
  var url = src || (photo ? window.IMG && window.IMG(label) : null);
  return /*#__PURE__*/React.createElement("div", {
    className: 'ph ' + (className || ''),
    "data-label": url ? '' : label || '',
    style: _objectSpread({
      background: window.GRAD(label || 'x'),
      width: w,
      height: h,
      borderRadius: r != null ? r : 8
    }, style)
  }, url && /*#__PURE__*/React.createElement("img", {
    src: url,
    alt: "",
    loading: "lazy",
    onError: function onError(e) {
      e.currentTarget.style.display = 'none';
    },
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), children);
}

/* ---------- 评分钻石 ---------- */
function Stars(_ref2) {
  var _ref2$n = _ref2.n,
    n = _ref2$n === void 0 ? 5 : _ref2$n;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 1,
      color: 'var(--accent, #FFB000)'
    }
  }, Array.from({
    length: n
  }).map(function (_, i) {
    return /*#__PURE__*/React.createElement("svg", {
      key: i,
      width: "13",
      height: "13",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 7L12 17.8 5.8 21l1.2-7-5-4.9 7.1-1z"
    }));
  }));
}

/* ---------- 图标库（线性，简单形状） ---------- */
var I = {
  back: /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }),
  bell: /*#__PURE__*/React.createElement("path", {
    d: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"
  }),
  share: /*#__PURE__*/React.createElement("path", {
    d: "M13.5 4 L21.5 11 L13.5 18 V14.2 C8.5 14.2 5 15.8 2.8 19.2 C2.8 11.6 7 8.4 13.5 7.9 V4 Z"
  }),
  search: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 21l-4.3-4.3"
  })),
  pin: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  clock: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  })),
  plane: /*#__PURE__*/React.createElement("path", {
    d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
  }),
  flight: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M10.5 21l1.5-6.5 8-2.5-8-2.5L10.5 3 8 9.2 3 11v2l5 1.8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 14.5l-2.8 4.2M12 9.5L9.2 5.3"
  })),
  bed: /*#__PURE__*/React.createElement("path", {
    d: "M3 7v11M3 12h18v6M21 18v-4a3 3 0 00-3-3H7"
  }),
  ticket: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 6v12",
    strokeDasharray: "2 2"
  })),
  chevR: /*#__PURE__*/React.createElement("path", {
    d: "M9 18l6-6-6-6"
  }),
  chevD: /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }),
  bolt: /*#__PURE__*/React.createElement("path", {
    d: "M13 2L4.5 13.5H11l-1 8.5L18.5 10.5H12z"
  }),
  coin: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8.5l3 3.7 3-3.7M12 12.2V16M9.7 13h4.6M9.7 14.9h4.6"
  })),
  coinT: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.2 9.3h7.6M12 9.3V16"
  })),
  user: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 21c0-4 4-6 8-6s8 2 8 6"
  })),
  family: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "7",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "7",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 20c0-3 2.5-5 5-5s5 2 5 5M13 20c0-2.5 2-4 4.5-4S22 17.5 22 20"
  })),
  "case": /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "7",
    width: "18",
    height: "13",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
  })),
  stub: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 5v14",
    strokeDasharray: "2 2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "12",
    r: "1.4",
    fill: "currentColor"
  })),
  spark: /*#__PURE__*/React.createElement("path", {
    d: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"
  }),
  edit: /*#__PURE__*/React.createElement("path", {
    d: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"
  }),
  ai: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 12h.01M12 12h.01M16 12h.01"
  })),
  undo: /*#__PURE__*/React.createElement("path", {
    d: "M3 7v6h6M3 13a9 9 0 1 0 3-7"
  }),
  close: /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  }),
  minus: /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }),
  plus: /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  }),
  dice: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "16",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.3",
    fill: "currentColor"
  })),
  walk: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "13",
    cy: "4",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 22l1-7-2-3 1-5 3 3 3 1M9 22l2-5"
  })),
  invoice: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M6 2h9l3 3v17l-3-2-3 2-3-2-3 2V2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8h6M9 12h6M9 16h3"
  })),
  gift: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "8",
    width: "18",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 13v8h14v-8M12 8v13M12 8C12 5 10.5 3 8.5 3S6 6 8 7.2C9 7.8 12 8 12 8zM12 8c0-3 1.5-5 3.5-5S18 6 16 7.2C15 7.8 12 8 12 8z"
  })),
  trophy: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v4a5 5 0 01-10 0V4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3M9 20h6M12 13v7"
  })),
  book: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M4 5a2 2 0 012-2h13v15H6a2 2 0 00-2 2V5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 7h6M9 11h4"
  })),
  heart: /*#__PURE__*/React.createElement("path", {
    d: "M12 21s-7-4.6-9.4-9A5 5 0 0112 5a5 5 0 019.4 7c-2.4 4.4-9.4 9-9.4 9z"
  }),
  compass: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15.5 8.5l-2 5.5-5.5 2 2-5.5z"
  })),
  gauge: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M4 19a8 8 0 1116 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 19l4-5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "1.3",
    fill: "currentColor"
  })),
  route: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "2.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "2.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 6h7a3 3 0 010 6H9a3 3 0 000 6h7"
  })),
  grip: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "6",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "6",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "12",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "12",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "18",
    r: "1.3",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "18",
    r: "1.3",
    fill: "currentColor"
  })),
  building: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "3",
    width: "14",
    height: "18",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"
  })),
  fire: /*#__PURE__*/React.createElement("path", {
    d: "M12 2s5 4 5 9a5 5 0 01-10 0c0-1.5.5-2.5.5-2.5S6 11 6 13a6 6 0 1012 0c0-6-6-11-6-11z"
  }),
  play: /*#__PURE__*/React.createElement("path", {
    d: "M6 4l14 8-14 8z"
  }),
  mic: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "3",
    width: "6",
    height: "11",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 11a7 7 0 0014 0M12 18v3M8 21h8"
  })),
  keyboard: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "6",
    width: "19",
    height: "12",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"
  })),
  cal: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4.5",
    width: "18",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9.5h18M8 2.5v4M16 2.5v4M8 14h3"
  })),
  car: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M5 11l1.5-4.2A2 2 0 018.4 5.4h7.2a2 2 0 011.9 1.4L19 11M4 11h16v5H4zM4 16v2M20 16v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7.5",
    cy: "13.5",
    r: "1.1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.5",
    cy: "13.5",
    r: "1.1",
    fill: "currentColor"
  })),
  camera: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M3 8.5A1.5 1.5 0 014.5 7H7l1.3-2h7.4L17 7h2.5A1.5 1.5 0 0121 8.5V18a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "13",
    r: "3.4"
  })),
  wave: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M5 9v6M9 5v14M15 7v10M19 10v4"
  })),
  check: /*#__PURE__*/React.createElement("path", {
    d: "M5 12.5l5 5L20 6.5"
  }),
  link: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M9.5 14.5l5-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 6.5l1.2-1.2a4 4 0 015.6 5.6l-2 2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 17.5l-1.2 1.2a4 4 0 01-5.6-5.6l2-2"
  })),
  more: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "12",
    r: "1.4",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.4",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "12",
    r: "1.4",
    fill: "currentColor"
  })),
  thumb: /*#__PURE__*/React.createElement("path", {
    d: "M7 22V11l5-8a2 2 0 012 2v4h4.5a2 2 0 012 2.3l-1.2 7A2 2 0 0119.3 22H7zm0 0H4a1 1 0 01-1-1v-9a1 1 0 011-1h3"
  }),
  train: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "3",
    width: "12",
    height: "13",
    rx: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 11h12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 19.5l-2 2.5M15 19.5l2 2.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "13.5",
    r: "1",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14.5",
    cy: "13.5",
    r: "1",
    fill: "currentColor"
  })),
  child: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "5",
    r: "2.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.4v6M8.5 10.5h7M9.6 20l2.4-4 2.4 4"
  })),
  family3: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "6.5",
    r: "2.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "6.5",
    r: "2.3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10.2",
    r: "1.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.2 20c0-3.2 1.5-5 3.3-5s3.3 1.8 3.3 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.2 20c0-3.2 1.5-5 3.3-5s3.3 1.8 3.3 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.6 20.6c0-2.2 1.1-3.5 2.4-3.5s2.4 1.3 2.4 3.5"
  })),
  star: /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 16.8 6.5 19.7l1.3-6.1L3.2 9.4l6.2-.7z"
  })
};
function Icon(_ref3) {
  var name = _ref3.name,
    _ref3$size = _ref3.size,
    size = _ref3$size === void 0 ? 22 : _ref3$size,
    _ref3$stroke = _ref3.stroke,
    stroke = _ref3$stroke === void 0 ? 2 : _ref3$stroke,
    _ref3$color = _ref3.color,
    color = _ref3$color === void 0 ? 'currentColor' : _ref3$color,
    _ref3$fill = _ref3.fill,
    fill = _ref3$fill === void 0 ? 'none' : _ref3$fill,
    style = _ref3.style;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: fill,
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: style
  }, I[name]);
}

/* ---------- 秒杀倒计时 hook ---------- */
function useCountdown(initialMins) {
  var _useState = useState(Math.max(0, Math.round(initialMins * 60))),
    _useState2 = _slicedToArray(_useState, 2),
    sec = _useState2[0],
    setSec = _useState2[1];
  useEffect(function () {
    setSec(Math.max(0, Math.round(initialMins * 60)));
  }, [initialMins]);
  useEffect(function () {
    if (sec <= 0) return;
    var id = setInterval(function () {
      return setSec(function (s) {
        return s > 0 ? s - 1 : 0;
      });
    }, 1000);
    return function () {
      return clearInterval(id);
    };
  }, [sec > 0]);
  var h = Math.floor(sec / 3600),
    m = Math.floor(sec % 3600 / 60),
    s = sec % 60;
  var pad = function pad(n) {
    return String(n).padStart(2, '0');
  };
  return {
    sec: sec,
    text: "".concat(pad(h), ":").concat(pad(m), ":").concat(pad(s))
  };
}

/* ---------- 楼层包裹（带进入动画 + 标题） ---------- */
function FloorShell(_ref4) {
  var title = _ref4.title,
    more = _ref4.more,
    _ref4$dot = _ref4.dot,
    dot = _ref4$dot === void 0 ? true : _ref4$dot,
    children = _ref4.children,
    style = _ref4.style;
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter",
    style: style
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "floor-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "floor-title"
  }, dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), title), more && /*#__PURE__*/React.createElement("span", {
    className: "floor-more"
  }, more, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 13
  }))), children);
}

/* ---------- 进度条 ---------- */
function ProgressBar(_ref5) {
  var pct = _ref5.pct;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 99,
      background: 'rgba(0,0,0,.12)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      borderRadius: 99,
      background: 'linear-gradient(90deg,var(--brand),var(--brand-strong))',
      transition: 'width .4s ease'
    }
  }));
}

/* ---------- 卡片展开 CTA：未展开显示「查看」，展开后只显示「收起」 ----------
   绝对定位在卡片右上角；pointer-events:none 保证整张卡片都是点击热区 */
function PeekCTA(_ref6) {
  var on = _ref6.on,
    _ref6$label = _ref6.label,
    label = _ref6$label === void 0 ? '查看' : _ref6$label;
  var base = {
    position: 'absolute',
    right: 7,
    top: 7,
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px 3px 10px',
    borderRadius: 999,
    zIndex: 6,
    pointerEvents: 'none'
  };
  return on ? /*#__PURE__*/React.createElement("span", {
    style: _objectSpread(_objectSpread({}, base), {}, {
      background: 'rgba(0,0,0,.55)',
      color: '#fff',
      backdropFilter: 'blur(4px)'
    })
  }, "\u6536\u8D77", /*#__PURE__*/React.createElement(Icon, {
    name: "chevD",
    size: 11,
    color: "#fff",
    style: {
      transform: 'rotate(180deg)'
    }
  })) : /*#__PURE__*/React.createElement("span", {
    style: _objectSpread(_objectSpread({}, base), {}, {
      background: 'var(--brand)',
      color: 'var(--on-brand,#fff)',
      boxShadow: '0 2px 8px rgba(0,0,0,.20)'
    })
  }, label, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 11,
    color: "currentColor",
    stroke: 2.4
  }));
}

/* ---------- 统一价格区：划线价与卖价同排水平对齐，折扣标签在卖价上方 ----------
   side: left | right | center（整体对齐）；swap=true 时卖价在左、划线价在右 */
function _phash(s) {
  var h = 0;
  s = String(s);
  for (var i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
  return h;
}
function PriceBlock(_ref7) {
  var price = _ref7.price,
    origin = _ref7.origin,
    disc = _ref7.disc,
    rate = _ref7.rate,
    seed = _ref7.seed,
    _ref7$size = _ref7.size,
    size = _ref7$size === void 0 ? 15 : _ref7$size,
    _ref7$side = _ref7.side,
    side = _ref7$side === void 0 ? 'right' : _ref7$side,
    _ref7$swap = _ref7.swap,
    swap = _ref7$swap === void 0 ? false : _ref7$swap,
    colAlign = _ref7.colAlign;
  size = size + 1; // 整体放大一个字号（卖价跟随）
  if (origin == null) {
    var rr = rate || 0.66 + _phash(seed != null ? seed : price) % 16 / 100;
    origin = Math.max(price + 30, Math.round(price / rr / 10) * 10);
  }
  if (disc == null) disc = (price / origin * 10).toFixed(1) + '折';
  var justify = side === 'center' ? 'center' : side === 'left' ? 'flex-start' : 'flex-end';
  // colAlign 默认跟随 side；可单独传入（如整体靠右、但折扣标签与卖价内部居中对齐）
  colAlign = colAlign || (side === 'center' ? 'center' : side === 'left' ? 'flex-start' : 'flex-end');
  var originEl = /*#__PURE__*/React.createElement("span", {
    className: "price-origin",
    style: {
      lineHeight: 1.1,
      whiteSpace: 'nowrap'
    }
  }, "\xA5", origin);
  var colEl = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: colAlign,
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: 'var(--brand-strong)',
      background: 'var(--brand-soft)',
      padding: '1px 5px',
      borderRadius: 5,
      lineHeight: 1.2,
      whiteSpace: 'nowrap'
    }
  }, disc), /*#__PURE__*/React.createElement("span", {
    className: "price",
    style: {
      fontSize: size,
      lineHeight: 1,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur",
    style: {
      fontSize: Math.round(size * 0.66)
    }
  }, "\xA5"), price));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 5,
      justifyContent: justify,
      minWidth: 0
    }
  }, swap ? /*#__PURE__*/React.createElement(React.Fragment, null, colEl, originEl) : /*#__PURE__*/React.createElement(React.Fragment, null, originEl, colEl));
}
Object.assign(window, {
  Ph: Ph,
  Stars: Stars,
  Icon: Icon,
  useCountdown: useCountdown,
  FloorShell: FloorShell,
  ProgressBar: ProgressBar,
  PeekCTA: PeekCTA,
  PriceBlock: PriceBlock
});

/* 7723dc17-7d2a-40b0-822b-416f2f0c91de.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* ============================================================
   OTA Demo — 核心模块 A
   Coupon / FlashSale / Feeds / SceneGuide
   ============================================================ */
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useLayoutEffect = _React.useLayoutEffect;

/* ---------------- 5.1 优惠券 ---------------- */
function Coupon(_ref) {
  var props = _ref.props,
    bus = _ref.bus;
  var raw = props.tier === 'premium' ? window.DATA.coupons.premium : window.DATA.coupons.value;
  // 展演 / 商务 模式下，优惠券模块改名为「优惠代码权益」
  var couponTitle = props.identity === 'event' || props.identity === 'biz' ? '优惠代码权益' : '每月优惠权益';
  var _useState = useState({}),
    _useState2 = _slicedToArray(_useState, 2),
    claimed = _useState2[0],
    setClaimed = _useState2[1];
  var TABS = [{
    id: 'hotel',
    label: '酒店'
  }, {
    id: 'flight',
    label: '机票'
  }, {
    id: 'ticket',
    label: '门票'
  }];
  var _useState3 = useState(TABS[0].id),
    _useState4 = _slicedToArray(_useState3, 2),
    cat = _useState4[0],
    setCat = _useState4[1];
  useEffect(function () {
    setCat(TABS[0].id);
  }, [props.identity, props.tier]);
  var TYPE_ICON = {
    hotel: 'bed',
    flight: 'planeGlyph',
    ticket: 'ticket',
    category: 'ticket'
  };
  var TYPE_LABEL = {
    hotel: '酒店',
    flight: '机票',
    ticket: '门票',
    category: '门票'
  };

  // 排序优先级：可领(0) → 已领(1) → 抢光置灰(2)，保证置灰券始终排最后
  var rank = function rank(c) {
    return c.stock <= 0 ? 2 : c.status === 'claimed' ? 1 : 0;
  };
  var listBase = raw.filter(function (c) {
    return c.type === cat || cat === 'ticket' && c.type === 'category';
  });
  // 直接展示去重后的真实券，不再用取模补位（避免一行三张相同券）
  var list = _toConsumableArray(listBase).sort(function (a, b) {
    return rank(a) - rank(b);
  }).map(function (item, i) {
    return _objectSpread(_objectSpread({}, item), {}, {
      _k: "".concat(item.id, "_").concat(cat, "_").concat(i)
    });
  });
  function claim(c) {
    if (c.stock <= 0 || claimed[c.id]) return;
    setClaimed(function (s) {
      return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, c.id, true));
    });
    bus.toast("\u5DF2\u9886\u53D6\u300C".concat(c.face, "\u300D\u4F18\u60E0\u5238"));
  }
  function renderCard(c, notchBg) {
    var isClaimed = claimed[c.id] || c.status === 'claimed';
    var sold = c.stock <= 0;
    var isDisc = !(c.amount > 0);
    return /*#__PURE__*/React.createElement("div", {
      key: c._k || c.id,
      className: "cpx-tk",
      style: {
        opacity: sold ? .6 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cpx-fill"
    }), /*#__PURE__*/React.createElement("svg", {
      className: "cpx-svg",
      viewBox: "0 0 250 88"
    }, /*#__PURE__*/React.createElement("path", {
      className: "cpx-edge",
      vectorEffect: "non-scaling-stroke",
      d: "M14 0 H77 A7 7 0 0 0 91 0 H236 A14 14 0 0 1 250 14 V74 A14 14 0 0 1 236 88 H91 A7 7 0 0 0 77 88 H14 A14 14 0 0 1 0 74 V14 A14 14 0 0 1 14 0 Z"
    }), /*#__PURE__*/React.createElement("path", {
      className: "cpx-dash",
      vectorEffect: "non-scaling-stroke",
      d: "M84 9 V79"
    })), /*#__PURE__*/React.createElement("div", {
      className: "cpx-amt"
    }, isDisc ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "cpx-big"
    }, "95", /*#__PURE__*/React.createElement("span", {
      className: "cpx-unit"
    }, "\u6298")), /*#__PURE__*/React.createElement("div", {
      className: "cpx-thr"
    }, "\u4F1A\u5458\u4E13\u4EAB")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "cpx-big"
    }, /*#__PURE__*/React.createElement("span", {
      className: "cpx-cur"
    }, "\xA5"), c.amount), /*#__PURE__*/React.createElement("div", {
      className: "cpx-thr"
    }, "\u6EE1", c.threshold, "\u53EF\u7528"))), /*#__PURE__*/React.createElement("div", {
      className: "cpx-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cpx-ttl"
    }, c.sell || c.scope), /*#__PURE__*/React.createElement("button", {
      className: isClaimed ? 'btn-ghost' : 'btn',
      disabled: sold,
      onClick: function onClick() {
        return claim(c);
      },
      style: {
        flex: '0 0 auto',
        alignSelf: 'center',
        padding: '6px 14px',
        fontSize: 12.5,
        whiteSpace: 'nowrap',
        boxShadow: 'none',
        filter: 'none'
      }
    }, sold ? '已抢光' : isClaimed ? '去使用' : '领取')));
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "floor-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "floor-title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gift",
    size: 15,
    color: "var(--brand)"
  }), couponTitle), /*#__PURE__*/React.createElement("span", {
    className: "floor-more"
  }, "\u67E5\u770B\u5168\u90E8 ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 13
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 14px 2px',
      padding: '2px 0 4px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginBottom: 8,
      paddingRight: 34,
      position: 'relative',
      zIndex: 1
    }
  }, TABS.map(function (t) {
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return setCat(t.id);
      },
      style: {
        padding: '4px 11px',
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer',
        background: cat === t.id ? 'var(--surface)' : 'transparent',
        color: cat === t.id ? 'var(--brand-strong)' : 'var(--text-muted)',
        border: cat === t.id ? '1.5px solid var(--brand)' : '1.5px solid var(--hairline)',
        transition: 'all .15s ease'
      }
    }, t.label);
  })), /*#__PURE__*/React.createElement("div", {
    className: "hscroll cpx-row",
    style: {
      margin: '0 -9px',
      padding: '1px 9px 4px',
      gap: 9
    }
  }, list.map(function (c) {
    return renderCard(c);
  }))));
}

/* ---------------- 5.2 秒杀 ---------------- */
var CAT_LABEL = {
  flight: '机票',
  hotel: '酒店',
  ticket: '门票'
};
var SALE_DATES = ['6月1日', '6月7日', '6月14日'];

/* 秒杀商品「目的地化」：城市 tab 下商品归属当前城市；机票出发地统一、酒店展示酒店名、门票展示景点名 */
function cityizeFlash(it, cat, city) {
  if (cat === 'flight') {
    // 出发城市统一为 defaultDepartCity（与 Feeds 机票筛选 / 卡片一致）
    var dep = window.defaultDepartCity(city || '冲绳');
    var dest = city;
    if (!dest) {
      var m = it.title.match(/[→\-]\s*(\S+?)(?:\s|$)/);
      dest = m ? m[1] : '三亚';
    }
    return _objectSpread(_objectSpread({}, it), {}, {
      title: "".concat(dep, " \u2192 ").concat(dest),
      img: "\u673A\u7968 ".concat(dest)
    });
  }
  if (!city) return it;
  var h = (it.id + city).split('').reduce(function (a, c) {
    return a + c.charCodeAt(0);
  }, 0);
  if (cat === 'hotel') {
    var brands = window.DATA.hotelBrands;
    return _objectSpread(_objectSpread({}, it), {}, {
      title: "".concat(city, "\xB7").concat(brands[h % brands.length]),
      img: "".concat(city, " \u9152\u5E97")
    });
  }
  // 门票：标题展示景点名称
  var d = window.DATA.destDB && window.DATA.destDB[city];
  var spots = d && d.spots || [];
  var name = spots.length ? spots[h % spots.length].name : "".concat(city, "\u70ED\u95E8\u666F\u70B9");
  return _objectSpread(_objectSpread({}, it), {}, {
    title: "".concat(name),
    img: "".concat(city, " \u666F\u70B9")
  });
}
function FlashSale(_ref2) {
  var props = _ref2.props,
    bus = _ref2.bus,
    ctx = _ref2.ctx;
  var cats = ['flight', 'hotel', 'ticket'];
  var _useState5 = useState(cats[0]),
    _useState6 = _slicedToArray(_useState5, 2),
    cat = _useState6[0],
    setCat = _useState6[1];
  var _useState7 = useState(SALE_DATES[0]),
    _useState8 = _slicedToArray(_useState7, 2),
    saleDate = _useState8[0],
    setSaleDate = _useState8[1];
  useEffect(function () {
    setCat(cats[0]);
    setSaleDate(SALE_DATES[0]);
  }, [props.identity, props.tier]);
  // 非「探索」tab：秒杀商品全部归属当前城市（与页面 tab 标题同源，默认冲绳）
  var city = ctx && ctx.tab !== 'explore' ? ctx.city || window.fallbackCity(props.identity) : null;
  // 展演 / 商务 模式下，秒杀模块改名为「限时秒杀」
  var flashTitle = props.identity === 'event' || props.identity === 'biz' ? '限时秒杀' : '每周秒杀';
  var items = (window.DATA.flash[cat] || []).map(function (it) {
    return cityizeFlash(it, cat, city);
  });
  if (props.identity === 'family') items = _toConsumableArray(items).sort(function (a, b) {
    return (b.kid ? 1 : 0) - (a.kid ? 1 : 0);
  });
  items = _toConsumableArray(items).sort(function (a, b) {
    return (a.stock <= 0 ? 1 : 0) - (b.stock <= 0 ? 1 : 0);
  });
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bolt",
      size: 15,
      color: "var(--brand)",
      fill: "var(--brand)"
    }), flashTitle),
    dot: false
  }, /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      paddingBottom: 2,
      gap: 6,
      marginBottom: 1
    }
  }, SALE_DATES.map(function (d) {
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: function onClick() {
        return setSaleDate(d);
      },
      style: {
        padding: '4px 13px',
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 13,
        background: saleDate === d ? 'var(--brand)' : 'var(--surface-2)',
        color: saleDate === d ? props.tier === 'premium' ? '#1A1505' : '#fff' : 'var(--text-muted)',
        border: saleDate === d ? 'none' : '1px solid var(--hairline)'
      }
    }, d);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      paddingTop: 1,
      gap: 16,
      borderBottom: '1px solid var(--hairline)',
      margin: '0 14px 3px',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollbarWidth: 'none'
    }
  }, cats.map(function (c) {
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: function onClick() {
        return setCat(c);
      },
      style: {
        position: 'relative',
        padding: '0 0 11px',
        borderRadius: 0,
        fontWeight: cat === c ? 800 : 700,
        fontSize: 14,
        background: 'transparent',
        flex: '0 0 auto',
        color: cat === c ? 'var(--text)' : 'var(--text-muted)',
        lineHeight: 1.1
      }
    }, CAT_LABEL[c], cat === c && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        borderRadius: 3,
        background: 'var(--text)'
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "hscroll flash-hscroll",
    style: {
      paddingTop: 4,
      paddingBottom: 8
    }
  }, items.map(function (it) {
    return /*#__PURE__*/React.createElement(FlashCard, {
      key: it.id,
      it: it,
      tier: props.tier,
      bus: bus,
      family: props.identity === 'family'
    });
  })));
}
function FlashCard(_ref3) {
  var it = _ref3.it,
    tier = _ref3.tier,
    bus = _ref3.bus,
    family = _ref3.family;
  var isSold = it.stock <= 0;
  var coinAmt = tier === 'value' && !isSold ? window.coinsFor(it.price) : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "card flash-card",
    style: {
      width: family ? 178 : 170,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 8px 18px rgba(26,24,33,.07)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    label: it.img,
    photo: true,
    h: family ? 94 : 90,
    r: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '7px 8px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: 'var(--text)',
      lineHeight: 1.32,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, it.title), coinAmt > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 10.5,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: 999,
      background: '#F4BE2A',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 900,
      flexShrink: 0
    }
  }, "T"), /*#__PURE__*/React.createElement("span", null, "\u8D5A"), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--coin-color)'
    }
  }, coinAmt), /*#__PURE__*/React.createElement("span", null, "\u8C46")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 6,
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: 'var(--brand-strong)',
      background: 'var(--brand-soft)',
      padding: '1px 5px',
      borderRadius: 5,
      lineHeight: 1.25
    }
  }, it.discount), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "price",
    style: {
      fontSize: 17
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, "\xA5"), it.price), /*#__PURE__*/React.createElement("span", {
    className: "price-origin"
  }, "\xA5", it.origin))), /*#__PURE__*/React.createElement("button", {
    className: "btn flash-btn",
    disabled: isSold,
    onClick: function onClick() {
      return bus.toast(isSold ? '该场次已售罄' : "\u5DF2\u52A0\u5165\u300C".concat(it.title, "\u300D\u62A2\u8D2D"));
    },
    style: {
      padding: '5px 14px',
      fontSize: 12.5,
      opacity: isSold ? .48 : 1,
      boxShadow: 'none',
      border: '1px solid rgba(255,255,255,.18)',
      filter: 'none',
      flexShrink: 0
    }
  }, isSold ? '已售罄' : '立即抢'))));
}

/* ---------------- 5.2c Trip Coins 返赠 ---------------- */
/* 金色「T」Trip Coins token —— 与 feeds 商品卡同源的视觉 */
function CoinToken(_ref4) {
  var _ref4$size = _ref4.size,
    size = _ref4$size === void 0 ? 20 : _ref4$size;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 999,
      flexShrink: 0,
      background: 'radial-gradient(circle at 32% 28%, #FFE08A 0%, #F4BE2A 52%, #E0A412 100%)',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.56,
      fontWeight: 900,
      fontFamily: 'Georgia, serif',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,.6), 0 1px 3px rgba(176,120,12,.4)'
    }
  }, "T");
}

/* 还原参考图的三步图标：点按手势 / 酒店建筑 / 金币 */
function StepTap() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("g", {
    stroke: "var(--brand)",
    strokeWidth: "1.3",
    strokeLinecap: "round",
    opacity: ".6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5.4 6 4.4 5M11 4.5V3.2M16.6 6l1-1"
  })), /*#__PURE__*/React.createElement("path", {
    fill: "var(--brand)",
    d: "M10 13.1V9.1a1.35 1.35 0 0 1 2.7 0v3.05l1.85.36c1.4.27 2.35 1.16 2.35 2.62v2.3c0 1.2-.9 2.07-2.2 2.07h-3.25c-.9 0-1.55-.36-2.08-1.1l-2.4-3.35c-.42-.58-.28-1.32.33-1.68.5-.3 1.13-.2 1.57.24l1.1 1.1Z"
  }));
}
/* 层叠金币 + 闪光，对齐参考图 */
function CoinStack(_ref5) {
  var _ref5$size = _ref5.size,
    size = _ref5$size === void 0 ? 30 : _ref5$size;
  var id = 'tcg-' + size;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 30 30",
    fill: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: id,
    cx: "36%",
    cy: "30%",
    r: "75%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#FFE89A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "55%",
    stopColor: "#F4BE2A"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#E0A412"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "20.5",
    cy: "16.5",
    r: "8",
    fill: "#E8A91B"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "20.5",
    cy: "16.5",
    r: "8",
    fill: "#fff",
    opacity: ".12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12.8",
    cy: "17",
    r: "9",
    fill: "url(#".concat(id, ")")
  }), /*#__PURE__*/React.createElement("text", {
    x: "12.8",
    y: "20.9",
    textAnchor: "middle",
    fontFamily: "Georgia, serif",
    fontWeight: "900",
    fontSize: "11.5",
    fill: "#fff"
  }, "T"), /*#__PURE__*/React.createElement("path", {
    d: "M6 1.4c.35 3 .55 3.2 3.4 3.55C6.55 5.3 6.35 5.5 6 8.5c-.35-3-.55-3.2-3.4-3.55C5.45 4.6 5.65 4.4 6 1.4Z",
    fill: "#FFDA66"
  }));
}
function StepHotel() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "var(--brand)",
    d: "M4.5 21V6.2l7.5-3.4 7.5 3.4V21h-4.3v-4.1H8.8V21z"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#fff",
    opacity: ".92"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "7.6",
    y: "8.2",
    width: "2.2",
    height: "2.2",
    rx: ".5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.2",
    y: "8.2",
    width: "2.2",
    height: "2.2",
    rx: ".5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "7.6",
    y: "12",
    width: "2.2",
    height: "2.2",
    rx: ".5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.2",
    y: "12",
    width: "2.2",
    height: "2.2",
    rx: ".5"
  })));
}
function RebateStep(_ref6) {
  var node = _ref6.node,
    gold = _ref6.gold,
    bare = _ref6.bare,
    label = _ref6.label,
    last = _ref6.last;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 999,
      background: bare ? 'transparent' : gold ? 'rgba(244,190,42,.16)' : 'var(--brand-soft)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, node), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      lineHeight: 1.3,
      color: 'var(--text-muted)',
      textAlign: 'center'
    }
  }, label)), !last && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 14,
    color: "var(--brand)",
    stroke: 2.4,
    style: {
      opacity: .55
    }
  })));
}
function CoinsRebate(_ref7) {
  var props = _ref7.props,
    bus = _ref7.bus;
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    joined = _useState0[0],
    setJoined = _useState0[1];
  var join = function join() {
    if (joined) {
      bus.toast('已参与活动 · 去完成酒店预订吧');
      return;
    }
    setJoined(true);
    bus.toast('参与成功！活动期内完成预订，行程结束即返 Trip Coins');
  };
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "coinT",
      size: 15,
      color: "var(--brand)"
    }), "Trip Coins \u8FD4\u8D60"),
    dot: false,
    more: "\u89C4\u5219"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 8px 18px rgba(26,24,33,.07)',
      border: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '6px 12px',
      background: 'var(--brand-soft)',
      color: 'var(--brand-strong)',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: .2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 12,
    color: "var(--brand-strong)",
    stroke: 2.2
  }), "\u6D3B\u52A8\u671F 6\u67081\u65E5 00:00 \u2013 6\u670830\u65E5 23:59"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px 13px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 6,
      background: 'var(--brand-soft)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bed",
    size: 12,
    color: "var(--brand)",
    stroke: 2.2
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, "\u9152\u5E97\u9884\u8BA2"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 12,
      background: 'var(--hairline)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 900,
      color: 'var(--brand-strong)'
    }
  }, "\u6700\u9AD8 7%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 700,
      color: 'var(--text)'
    }
  }, "Trip Coins \u8FD4\u8D60")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 0 27px',
      fontSize: 12,
      lineHeight: 1.45,
      color: 'var(--text-muted)',
      flex: 1,
      textWrap: 'pretty'
    }
  }, "\u5B8C\u6210\u8BA2\u5355\u884C\u7A0B\u540E\u5373\u53EF\u9886\u53D6\uFF0C\u6BCF\u4F4D\u7528\u6237\u6700\u9AD8\u53EF\u8FD4 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text)'
    }
  }, "100 Trip Coins"), "\uFF081 Trip Coin = $1\uFF0C\u7EA6 \xA5720\uFF09\u3002"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return bus.toast('查看活动详情：完成行程后 7 天内自动到账 Trip Coins');
    },
    style: {
      flexShrink: 0,
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--text-muted)',
      background: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1
    }
  }, "\u8BE6\u60C5 ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 11,
    color: "var(--text-muted)"
  }))), !joined && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 12,
      marginBottom: -3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      background: '#FFF1CC',
      color: '#9A7414',
      fontSize: 12,
      fontWeight: 800,
      padding: '5px 12px',
      borderRadius: 999,
      border: '1px solid #FBE3A6'
    }
  }, "\u4E0B\u5355\u524D\u5148\u70B9\u8FD9\u91CC\u9886\u53D6\u8D44\u683C", /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: -4.5,
      width: 8,
      height: 8,
      background: '#FFF1CC',
      borderRight: '1px solid #FBE3A6',
      borderBottom: '1px solid #FBE3A6',
      transform: 'translateX(-50%) rotate(45deg)'
    }
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-block rebate-cta",
    onClick: join,
    style: {
      marginTop: 10,
      padding: '8px 16px',
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 12,
      opacity: joined ? .92 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, joined && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    color: "#fff",
    stroke: 2.6
  }), joined ? '已参与 · 去预订' : '立即参与'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement(RebateStep, {
    node: /*#__PURE__*/React.createElement(StepTap, null),
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "\u70B9\u51FB\u300C\u7ACB\u5373\u53C2\u4E0E\u300D")
  }), /*#__PURE__*/React.createElement(RebateStep, {
    node: /*#__PURE__*/React.createElement(StepHotel, null),
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "\u6D3B\u52A8\u671F\u5185", /*#__PURE__*/React.createElement("br", null), "\u5B8C\u6210\u9884\u8BA2")
  }), /*#__PURE__*/React.createElement(RebateStep, {
    node: /*#__PURE__*/React.createElement(CoinStack, {
      size: 24
    }),
    gold: true,
    label: /*#__PURE__*/React.createElement(React.Fragment, null, "\u884C\u7A0B\u7ED3\u675F", /*#__PURE__*/React.createElement("br", null), "\u9886Trip Coins"),
    last: true
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return bus.toast('我的 Trip Coins：当前余额 186（1 Trip Coin = $1）');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      padding: '7px 14px',
      borderRadius: 999,
      background: 'var(--brand-soft)',
      color: 'var(--brand-strong)',
      fontSize: 11,
      fontWeight: 700
    }
  }, "\u67E5\u770B\u6211\u7684 Trip Coins ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 11,
    color: "var(--brand-strong)"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return bus.toast('活动条款与细则');
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-muted)',
      background: 'none'
    }
  }, "\u6D3B\u52A8\u6761\u6B3E ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 11,
    color: "var(--text-muted)"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '1px 2px 0',
      fontSize: 11,
      lineHeight: 1.5,
      color: 'var(--text-muted)',
      textAlign: 'center',
      textWrap: 'pretty'
    }
  }, "* Trip Coins \u8FD4\u8D60\u4E0D\u9002\u7528\u4E8E\u300C\u673A\u7968+\u9152\u5E97\u300D\u6253\u5305\u4EA7\u54C1\u53CA\u5230\u5E97\u4ED8\u8BA2\u5355\u3002")));
}

/* ---------------- 5.2b 亲子秒杀列表卡 ---------------- */
/* ---------------- 5.2b 亲子秒杀列表卡已合并为横滑 FlashCard ---------------- */

/* ---------------- 5.3 Feeds 流 ---------------- */
var LINE_LABEL = {
  rec: '推荐',
  hotel: '酒店',
  flight: '机票',
  ticket: '门票',
  play: '玩乐',
  vacation: '度假'
};
var LINE_SUB = {
  rec: ['为你推荐', '附近热门'],
  hotel: ['目的地', '入住日期', '价格带', '星级', '商圈'],
  flight: ['出发城市', '到达城市', '出发日期', '舱等', '直飞'],
  ticket: ['城市', '品类', '日期'],
  play: ['城市', '主题', '时长'],
  vacation: ['目的地', '天数', '预算']
};

// 目的地推荐理由：结合当前选中目的地 + 用户身份，创写 2-3 句话
function feedsDestReco(city, identity) {
  var db = window.DATA.destDB && window.DATA.destDB[city];
  var base = db ? identity === 'family' ? db.reasonFamily || db.reason : db.reason : '';
  var intro = {
    family: "\u5E26\u5A03\u6765".concat(city, "\uFF0C\u7701\u5FC3\u53C8\u51FA\u7247\u3002"),
    solo: "\u4E00\u4E2A\u4EBA\u7684".concat(city, "\uFF0C\u81EA\u5728\u968F\u5FC3\u3001\u8BF4\u8D70\u5C31\u8D70\u3002"),
    biz: "".concat(city, "\u5DEE\u65C5\uFF0C\u8282\u594F\u9AD8\u6548\u53C8\u4E0D\u5C06\u5C31\u3002"),
    event: "\u4E3A\u4E00\u573A\u6F14\u51FA\u5954\u8D74".concat(city, "\uFF0C\u987A\u9053\u628A\u57CE\u5E02\u4E5F\u73A9\u4E00\u904D\u3002")
  }[identity] || "\u5173\u4E8E".concat(city, "\uFF0C\u8FD9\u4E9B\u7406\u7531\u503C\u5F97\u4E00\u53BB\u3002");
  return intro + (base ? ' ' + base : '');
}

/* ---------- Feeds 业务线筛选条：每条业务线提供不同筛选项 ---------- */
function FeedFilterChip(_ref8) {
  var children = _ref8.children,
    active = _ref8.active,
    onClick = _ref8.onClick,
    _ref8$caret = _ref8.caret,
    caret = _ref8$caret === void 0 ? true : _ref8$caret;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      padding: '5px 10px',
      borderRadius: 8,
      fontSize: 12,
      whiteSpace: 'nowrap',
      border: '1px solid ' + (active ? 'var(--brand)' : 'var(--hairline)'),
      background: active ? 'color-mix(in srgb,var(--brand-soft) 86%, #fff 14%)' : 'var(--surface)',
      color: active ? 'var(--brand-strong)' : 'var(--text)',
      fontWeight: active ? 700 : 600
    }
  }, children, caret && /*#__PURE__*/React.createElement(Icon, {
    name: "chevD",
    size: 10,
    color: active ? 'var(--brand)' : 'var(--text-muted)'
  }));
}
function FeedStaticTag(_ref9) {
  var children = _ref9.children;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      padding: '5px 11px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      border: '1px solid var(--hairline)',
      background: 'var(--surface)',
      color: 'var(--text-muted)'
    }
  }, children);
}
function HotelOccupancyPill(_ref0) {
  var family = _ref0.family,
    onClick = _ref0.onClick;
  var seg = {
    display: 'flex',
    alignItems: 'center',
    gap: 2.5
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '5px 11px',
      borderRadius: 10,
      border: '1px solid var(--hairline)',
      background: 'var(--surface)',
      fontSize: 12.5,
      fontWeight: 700,
      color: 'var(--text)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cal",
    size: 13,
    color: "var(--brand)"
  }), "6\u67084\u65E5 - 6\u67085\u65E5", /*#__PURE__*/React.createElement(Icon, {
    name: "chevD",
    size: 10,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 14,
      background: 'var(--hairline)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: seg
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bed",
    size: 13,
    color: "var(--text-muted)"
  }), "1"), /*#__PURE__*/React.createElement("span", {
    style: seg
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 13,
    color: "var(--text-muted)"
  }), "1"), family && /*#__PURE__*/React.createElement("span", {
    style: seg
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "child",
    size: 13,
    color: "var(--text-muted)"
  }), "2")));
}
function FeedFilters(_ref1) {
  var line = _ref1.line,
    activeCity = _ref1.activeCity,
    family = _ref1.family,
    trip = _ref1.trip,
    cabin = _ref1.cabin,
    onTrip = _ref1.onTrip,
    onCabin = _ref1.onCabin,
    bus = _ref1.bus;
  var departCity = window.defaultDepartCity ? window.defaultDepartCity(activeCity) : '上海';
  var tap = function tap(l) {
    return bus && bus.toast && bus.toast("\u7B5B\u9009\uFF1A".concat(l));
  };
  var cycleTrip = function cycleTrip() {
    return onTrip && onTrip(trip === '往返' ? '单程' : '往返');
  };
  var cycleCabin = function cycleCabin() {
    return onCabin && onCabin(cabin === '经济舱' ? '商务舱' : cabin === '商务舱' ? '头等舱' : '经济舱');
  };
  var content;
  if (line === 'hotel') {
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HotelOccupancyPill, {
      family: family,
      onClick: function onClick() {
        return tap('入住/离店 · 房间与人数');
      }
    }), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('位置');
      }
    }, "\u4F4D\u7F6E"), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('星级');
      }
    }, "\u661F\u7EA7"), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('评分');
      }
    }, "\u8BC4\u5206"), /*#__PURE__*/React.createElement(FeedStaticTag, null, "\u514D\u8D39\u53D6\u6D88"));
  } else if (line === 'flight') {
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('出发城市');
      }
    }, "\u51FA\u53D1\uFF1A", departCity), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('到达城市');
      }
    }, "\u5230\u8FBE\uFF1A", activeCity), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('飞行日期');
      }
    }, "\u98DE\u884C\u65E5\u671F"), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: cycleTrip
    }, trip), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: cycleCabin
    }, cabin), window.hasDirectFlight(activeCity) && /*#__PURE__*/React.createElement(FeedStaticTag, null, "\u76F4\u98DE"));
  } else {
    // ticket / play
    content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('主题');
      }
    }, "\u4E3B\u9898"), /*#__PURE__*/React.createElement(FeedFilterChip, {
      onClick: function onClick() {
        return tap('评分');
      }
    }, "\u8BC4\u5206"), /*#__PURE__*/React.createElement(FeedStaticTag, null, "\u514D\u8D39\u53D6\u6D88"));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "hscroll"
  }, line === 'flight' && cabin !== '经济舱' ? {
    'data-tier': 'premium'
  } : {}, {
    style: _objectSpread({
      gap: 6,
      paddingTop: 6,
      paddingBottom: 5
    }, line === 'flight' && cabin !== '经济舱' ? {
      background: 'radial-gradient(120% 130% at 50% 130%, color-mix(in srgb, var(--brand-light) 28%, transparent), transparent 60%), var(--bg)',
      borderTop: '1px solid var(--hairline)'
    } : {})
  }), content);
}

/* ---------- 机票航司徽标（占位 monogram，非真实 logo） ---------- */
function AirlineBadge(_ref10) {
  var al = _ref10.al,
    _ref10$size = _ref10.size,
    size = _ref10$size === void 0 ? 18 : _ref10$size;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: 5,
      background: al.color,
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.5,
      fontWeight: 800,
      letterSpacing: '-.5px'
    }
  }, al.code);
}

/* ---------- 机票时段卡片（颜色全部走 CSS 变量；商务/头等时外层切 data-tier=premium 自动套高端皮肤） ---------- */
var FLIGHT_DEP_DATE = '2026-06-04',
  FLIGHT_RET_DATE = '2026-06-07';
function FlightTimeCard(_ref11) {
  var dep = _ref11.dep,
    dest = _ref11.dest,
    trip = _ref11.trip,
    cabin = _ref11.cabin,
    c = _ref11.c,
    bus = _ref11.bus;
  var round = trip === '往返';
  var depDT = "".concat(FLIGHT_DEP_DATE, " ").concat(c.depart);
  var retDT = "".concat(FLIGHT_RET_DATE, " ").concat(c.ret);
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: '10px 12px',
      cursor: 'pointer'
    },
    onClick: function onClick() {
      return bus.toast("\u67E5\u770B\u300C".concat(c.airline.name, " ").concat(dep).concat(round ? '⇄' : '→').concat(dest, "\u300D"));
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, dep, " ", round ? '⇄' : '→', " ", dest), round ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)',
      marginTop: 3,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, trip, " \xB7 \u53BB ", depDT, " \xB7 \u8FD4 ", retDT) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)',
      marginTop: 3,
      whiteSpace: 'nowrap'
    }
  }, trip, " \xB7 ", depDT, " \u8D77\u98DE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginTop: 6,
      flexWrap: 'wrap'
    }
  }, (c.tags || []).map(function (t, i) {
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: "tag",
      style: {
        fontSize: 10.5,
        padding: '2px 7px',
        borderRadius: 6
      }
    }, t);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 7
    }
  }, /*#__PURE__*/React.createElement(AirlineBadge, {
    al: c.airline
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text)',
      fontWeight: 600
    }
  }, c.airline.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--brand-strong)',
      fontWeight: 700
    }
  }, "\xB7 ", cabin))), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(PriceBlock, {
    price: c.price,
    seed: c.airline.name + dest + c.depart,
    rate: 0.63,
    size: 17,
    side: "right"
  }))));
}
var FLIGHT_PERIOD_ICON = {
  morning: 'spark',
  afternoon: 'compass',
  evening: 'bolt',
  dawn: 'clock'
};
function FlightPeriods(_ref12) {
  var dep = _ref12.dep,
    dest = _ref12.dest,
    trip = _ref12.trip,
    cabin = _ref12.cabin,
    identity = _ref12.identity,
    bus = _ref12.bus;
  var periods = window.buildFlightPeriods ? window.buildFlightPeriods(dep, dest, trip, cabin, identity) : [];
  var lux = cabin !== '经济舱';
  // 商务/头等：整段切到「高端模式」皮肤（data-tier=premium 让子树复用高端 CSS 变量），满铺填满两侧
  var wrapProps = lux ? {
    'data-tier': 'premium'
  } : {};
  var wrapStyle = lux ? {
    padding: '12px 14px 16px 16px',
    margin: '0 0 2px',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    background: 'radial-gradient(120% 56% at 50% -8%, color-mix(in srgb, var(--brand-light) 30%, transparent), transparent 62%), var(--bg)',
    borderBottom: '1px solid var(--hairline)'
  } : {
    padding: '4px 14px 2px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  };
  var reasonBox = {
    padding: '8px 11px',
    borderRadius: 'var(--radius)',
    background: 'var(--brand-soft)',
    border: '1px solid color-mix(in srgb,var(--brand) 14%, transparent)',
    marginBottom: 8
  };
  return /*#__PURE__*/React.createElement("div", _extends({}, wrapProps, {
    style: wrapStyle
  }), lux && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      paddingBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      color: 'var(--brand-strong)',
      letterSpacing: '.3px'
    }
  }, cabin, " \xB7 \u81FB\u9009\u76F4\u98DE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "\u5BBD\u9002\u5EA7\u6905 \xB7 \u8D35\u5BBE\u793C\u9047")), periods.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.key
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 7,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, p.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)'
      }
    }, p.range)), /*#__PURE__*/React.createElement("div", {
      style: reasonBox
    }, p.reasons.map(function (r, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 5,
          fontSize: 12,
          lineHeight: 1.5,
          color: 'var(--text)',
          textWrap: 'pretty'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--brand)',
          flexShrink: 0
        }
      }, "\xB7"), r);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, p.cards.map(function (c, i) {
      return /*#__PURE__*/React.createElement(FlightTimeCard, {
        key: i,
        dep: dep,
        dest: dest,
        trip: trip,
        cabin: cabin,
        c: c,
        bus: bus
      });
    })));
  }));
}
function Feeds(_ref13) {
  var props = _ref13.props,
    bus = _ref13.bus,
    ctx = _ref13.ctx;
  var showDestGroup = !ctx || ctx.tab === 'explore'; // 仅「探索目的地」tab 展示目的地分组
  var lines = ['hotel', 'flight', 'ticket', 'play'];
  var DEST_LIST = ['三亚', '厦门', '成都', '北京', '上海', '普吉', '冲绳', '东京', '深圳', '香港', '澳门', '北海道', '马代', '西双版纳', '不丹'];
  var _useState1 = useState(lines[0]),
    _useState10 = _slicedToArray(_useState1, 2),
    line = _useState10[0],
    setLine = _useState10[1];
  var _useState11 = useState(DEST_LIST[0] || null),
    _useState12 = _slicedToArray(_useState11, 2),
    destFilter = _useState12[0],
    setDestFilter = _useState12[1];
  var _useState13 = useState({}),
    _useState14 = _slicedToArray(_useState13, 2),
    fav = _useState14[0],
    setFav = _useState14[1];
  var _useState15 = useState('往返'),
    _useState16 = _slicedToArray(_useState15, 2),
    flightTrip = _useState16[0],
    setFlightTrip = _useState16[1];
  var _useState17 = useState(props.tier === 'premium' ? '头等舱' : '经济舱'),
    _useState18 = _slicedToArray(_useState17, 2),
    flightCabin = _useState18[0],
    setFlightCabin = _useState18[1];
  useEffect(function () {
    setLine(lines[0]);
    setDestFilter(DEST_LIST[0] || null);
  }, [props.identity, props.tier, props.city]);
  useEffect(function () {
    setFlightTrip('往返');
    setFlightCabin(props.tier === 'premium' ? '头等舱' : '经济舱');
  }, [line, props.identity, props.city, props.tier]);

  // 当前生效城市：探索 tab 用分组选择，城市 tab 用 ctx.city（与页面 tab 标题同源，默认冲绳）
  var activeCity = !showDestGroup ? ctx && ctx.city || window.fallbackCity(ctx && ctx.identity || props.identity) : destFilter || DEST_LIST[0];

  // 商品卡片严格按 城市 + 业务线 生成，切换分组即刷新且一一对应
  var items = window.buildFeedCards ? window.buildFeedCards(activeCity, line, props.tier) : [];
  if (props.tier === 'premium') items = items.slice().sort(function (a, b) {
    return b.price - a.price;
  });
  var display = items.map(function (f, i) {
    return _objectSpread(_objectSpread({}, f), {}, {
      _k: activeCity + '|' + line + '|' + i
    });
  });

  /* ---------- Feeds 内插：滑动 3 下未点击 → 视觉中心插入「为你推荐」横滑卡 ---------- */
  var recoStrips = window.buildRecoStrips ? window.buildRecoStrips(activeCity, line, props.tier) : [];
  var _useState19 = useState([]),
    _useState20 = _slicedToArray(_useState19, 2),
    inserts = _useState20[0],
    setInserts = _useState20[1]; // [{afterIndex, variant, id}]
  var gridRef = useRef(null);
  var groupBarRef = useRef(null); // 业务线分组吸顶栏
  var destBarRef = useRef(null); // 目的地分组吸顶栏
  var DEST_BAR_H = 40; // 目的地分组栏固定高度（常量，杜绝吸顶位置抖动）
  var destScrollRef = useRef(null); // 目的地分组横滑容器
  var destBtnRefs = useRef({}); // 各目的地按钮
  var accumRef = useRef(0); // 累计下滑距离（像素），稳健识别「滑动了几下」
  var clickedRef = useRef(false);
  var insertsRef = useRef([]);
  var shownRef = useRef({}); // 已「弹入」过的中插 id（滚进视野即标记，避免重播/闪动）
  var _useState21 = useState(0),
    _useState22 = _slicedToArray(_useState21, 2),
    bumpShown = _useState22[1];
  var displayRef = useRef(display);
  displayRef.current = display;
  insertsRef.current = inserts;

  // 切换城市 / 业务线 → 重新计算中插位置：第 8 个商品卡片后开始，每隔 8 个插入一个
  useEffect(function () {
    var last = displayRef.current.length - 1;
    var positions = [];
    for (var after = 5; after <= last && positions.length < 3; after += 8) {
      positions.push(after);
    }
    var ins = positions.map(function (afterIndex, i) {
      return {
        afterIndex: afterIndex,
        variant: i % Math.max(1, recoStrips.length),
        id: 'ins-' + activeCity + '-' + line + '-' + i
      };
    });
    insertsRef.current = ins;
    setInserts(ins);
    accumRef.current = 0;
    clickedRef.current = false;
    shownRef.current = {};
  }, [activeCity, line]);
  function gridInView(sc) {
    var g = gridRef.current;
    if (!g) return false;
    var gr = g.getBoundingClientRect();
    var sr = sc.getBoundingClientRect();
    return gr.top < sr.bottom - 60 && gr.bottom > sr.top + 60;
  }

  // 点击目的地 / 业务线分组 → 回到「目的地分组栏」位置（标题滚出视野，分组栏吸顶到顶部）
  function scrollFeedsTop() {
    var ch = document.getElementById('channel');
    var mod = ch && ch.querySelector('[data-mod="feeds"]');
    var head = mod && mod.querySelector('.floor-head');
    if (!ch || !head) return;
    requestAnimationFrame(function () {
      // floor-head（猜你喜欢标题）非吸顶，其底部即分组栏顶部；滚到这里=标题刚好滚出、分组栏到顶
      var target = ch.scrollTop + (head.getBoundingClientRect().bottom - ch.getBoundingClientRect().top);
      ch.scrollTo({
        top: Math.max(0, target),
        behavior: 'smooth'
      });
    });
  }

  // 点击目的地分组 → 把被点击的目的地横向滑到视觉中心
  function centerDest(d) {
    var row = destScrollRef.current,
      node = destBtnRefs.current[d];
    if (!row || !node) return;
    requestAnimationFrame(function () {
      var rRect = row.getBoundingClientRect(),
        nRect = node.getBoundingClientRect();
      var delta = nRect.left - rRect.left - (row.clientWidth - nRect.width) / 2;
      row.scrollTo({
        left: Math.max(0, row.scrollLeft + delta),
        behavior: 'smooth'
      });
    });
  }

  // 滚进视野那一刻才给中插加 .reco-in 触发「弹入」动效（用页面自身的 scroll 监听，可靠且只播一次）
  // 经典折叠展开：显式从 0px 过渡到实际像素高度，结束后设回 auto —— 所有浏览器都平滑可见
  function expandInsert(el, dur) {
    var full = el.scrollHeight || el.firstChild && el.firstChild.scrollHeight || 0;
    if (!full) {
      el.style.height = 'auto';
      el.style.overflow = 'visible';
      return;
    }
    var d = dur || 580;
    el.style.transition = 'none';
    el.style.height = '0px';
    el.style.overflow = 'hidden';
    void el.offsetHeight; // 提交 0 高度
    requestAnimationFrame(function () {
      el.style.transition = 'height ' + d + 'ms cubic-bezier(.22,1,.36,1)';
      el.style.height = full + 'px';
      var _done = function done(e) {
        if (e && e.propertyName && e.propertyName !== 'height') return;
        el.style.height = 'auto';
        el.style.overflow = 'visible';
        el.style.transition = '';
        el.removeEventListener('transitionend', _done);
      };
      el.addEventListener('transitionend', _done);
      setTimeout(_done, d + 180); // 兜底，防 transitionend 未触发
    });
  }
  function revealEntered(sc) {
    var g = gridRef.current;
    if (!g) return;
    var scRect = sc.getBoundingClientRect();
    // 触发点设在屏幕中部：中插（此刻高度为 0 的细线）随滚动升到视野中央时才展开，
    // 这样展开发生在视线正中、把下方卡片推开，清晰可见，而不是在屏幕边缘一闪而过。
    var triggerY = scRect.top + scRect.height * 0.52;
    g.querySelectorAll('.reco-insert').forEach(function (el) {
      var id = el.getAttribute('data-insid');
      if (!id || shownRef.current[id]) return;
      var r = el.getBoundingClientRect();
      if (r.top <= triggerY) {
        // 升到屏幕中部（或更高，兜底快速滚动）→ 展开
        shownRef.current[id] = true;
        expandInsert(el);
      }
    });
  }
  function doInsert(sc) {/* 已改为静态中插位置（第 8 个卡片后，每 8 个一个），保留空函数兼容旧调用 */}

  // 中插「滚进视野即从 0 高度展开、把下方卡片顶开」——用 rAF 轮询位置触发，不依赖滚动事件，绝对可靠；全部展开后自停
  useEffect(function () {
    var ch = document.getElementById('channel');
    var grid = gridRef.current;
    if (!ch || !grid) return;
    var raf = 0;
    function tick() {
      var cr = ch.getBoundingClientRect();
      var remaining = 0;
      grid.querySelectorAll('.reco-insert').forEach(function (el) {
        if (el.dataset.expanded) {
          return;
        }
        var r = el.getBoundingClientRect();
        // 折叠的细线随滚动升到视野中部（约 62% 处）才展开，让「展开顶开卡片」的过程清晰可见
        if (r.top < cr.top + cr.height * 0.62 && r.bottom > cr.top) {
          el.dataset.expanded = '1';
          expandInsert(el);
        } else {
          remaining++;
        }
      });
      if (remaining > 0) raf = requestAnimationFrame(tick);else raf = 0;
    }
    raf = requestAnimationFrame(tick);
    return function () {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [activeCity, line, inserts.length]);

  // 「演示中插插入」：供场景控制台一键触发 —— 把第一条中插滚到视野中部，单独放慢展开
  useEffect(function () {
    window.__omRecoDemo = function () {
      var sc = document.getElementById('channel');
      var g = gridRef.current;
      if (!sc || !g) return;
      var el = g.querySelector('.reco-insert');
      if (!el) return;
      el.dataset.expanded = '';
      el.style.height = '0px';
      el.style.overflow = 'hidden';
      var target = sc.scrollTop + (el.getBoundingClientRect().top - sc.getBoundingClientRect().top) - sc.clientHeight * 0.45;
      sc.scrollTo({
        top: Math.max(0, target),
        behavior: 'smooth'
      });
      setTimeout(function () {
        el.dataset.expanded = '1';
        expandInsert(el, 720);
      }, 480);
    };
    return function () {
      if (window.__omRecoDemo) try {
        delete window.__omRecoDemo;
      } catch (e) {
        window.__omRecoDemo = null;
      }
    };
  }, [activeCity, line]);
  function removeInsert(id) {
    var next = insertsRef.current.filter(function (x) {
      return x.id !== id;
    });
    insertsRef.current = next;
    setInserts(next);
  }
  function RecoStrip(_ref14) {
    var ins = _ref14.ins,
      anchor = _ref14.anchor;
    var strip = recoStrips[ins.variant] || recoStrips[0];
    if (!strip) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "reco-insert",
      "data-insid": ins.id,
      style: {
        gridColumn: '1 / -1',
        margin: '2px 0 8px',
        minWidth: 0,
        maxWidth: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "reco-inner",
      style: {
        borderRadius: 18,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, color-mix(in srgb,var(--brand-soft) 70%, #fff 30%), var(--surface) 82%)',
        border: '1px solid color-mix(in srgb,var(--brand) 30%, transparent)',
        boxShadow: '0 12px 28px color-mix(in srgb,var(--brand-strong) 14%, transparent), 0 2px 6px rgba(0,0,0,.04)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 9,
        padding: '11px 12px 8px 16px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 26,
        height: 26,
        borderRadius: 999,
        background: 'var(--brand)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        boxShadow: '0 3px 8px color-mix(in srgb,var(--brand) 36%, transparent)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: strip.icon || 'spark',
      size: 15,
      color: "#fff",
      fill: "#fff"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 3,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 800,
        color: 'var(--brand-strong)',
        background: 'color-mix(in srgb,var(--brand-soft) 80%, #fff 20%)',
        padding: '1.5px 6px',
        borderRadius: 6
      }
    }, strip.tag), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10.5,
        fontWeight: 600,
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "reco-live-dot"
    }), strip.live)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: 'var(--text)',
        lineHeight: 1.32
      }
    }, strip.headline)), /*#__PURE__*/React.createElement("button", {
      "aria-label": "\u4E0D\u611F\u5174\u8DA3",
      onClick: function onClick(e) {
        e.stopPropagation();
        removeInsert(ins.id);
      },
      style: {
        flexShrink: 0,
        width: 24,
        height: 24,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "close",
      size: 14,
      color: "var(--text-muted)"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "hscroll reco-hscroll",
      style: {
        gap: 9,
        padding: '0 12px 12px 16px'
      }
    }, strip.items.map(function (it, k) {
      var promoRateMap = {
        hotel: 0.72,
        ticket: 0.67,
        flight: 0.63,
        play: 0.69
      };
      var rate = promoRateMap[it.line] || 0.72;
      var origin = Math.max(it.price + 20, Math.round(it.price / rate / 10) * 10);
      var discountText = (it.price / origin * 10).toFixed(1) + '折';
      var h = (it.title || '').split('').reduce(function (a, c) {
        return a + c.charCodeAt(0);
      }, 0);
      var score = (4.4 + h % 6 / 10).toFixed(1);
      var sold = it.sold || ['月售' + (2 + h % 9) + '00+', '月售' + (1 + h % 5) + 'k+', '月售' + (3 + h % 7) + '00+'][h % 3];
      return /*#__PURE__*/React.createElement("div", {
        key: strip.id + '-' + k,
        onClick: function onClick() {
          return bus.toast("\u67E5\u770B\u63A8\u8350\u300C".concat(it.title, "\u300D"));
        },
        style: {
          width: 132,
          flex: '0 0 auto',
          background: 'var(--surface)',
          borderRadius: 13,
          overflow: 'hidden',
          border: '1px solid var(--hairline)',
          boxShadow: '0 4px 12px rgba(0,0,0,.05)'
        }
      }, /*#__PURE__*/React.createElement(Ph, {
        label: it.img,
        photo: true,
        h: 88,
        r: 0
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '7px 8px 9px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "feed-title-2",
        style: {
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.32,
          color: 'var(--text)'
        }
      }, it.title), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 5,
          marginTop: 5
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 2,
          fontSize: 11.5,
          fontWeight: 800,
          color: 'var(--text)'
        }
      }, score, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-muted)'
        }
      }, "/ 5")), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: 'var(--text-muted)'
        }
      }, sold)), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 6,
          display: 'flex',
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'flex-end',
          gap: 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "price-origin",
        style: {
          fontSize: 10,
          lineHeight: 1.1
        }
      }, "\xA5", origin), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: 800,
          color: 'var(--brand-strong)',
          background: 'var(--brand-soft)',
          padding: '1px 5px',
          borderRadius: 5,
          lineHeight: 1.2
        }
      }, discountText), /*#__PURE__*/React.createElement("span", {
        className: "price",
        style: {
          fontSize: 15,
          lineHeight: 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "cur"
      }, "\xA5"), it.price))))));
    }))));
  }
  function renderCard(f, i) {
    var coinAmt = props.tier === 'value' ? window.coinsFor(f.price) : 0;
    var promoRateMap = {
      hotel: 0.72,
      ticket: 0.67,
      flight: 0.63,
      play: 0.69,
      vacation: 0.76
    };
    var rate = promoRateMap[f.line] || 0.74;
    var origin = Math.max(f.price + 20, Math.round(f.price / rate / 10) * 10);
    var discountText = (f.price / origin * 10).toFixed(1) + '折';

    // 机票卡片标题：仅保留「出发 → 到达」城市，去掉「含税往返」等后缀
    var displayTitle = f.title;
    if (f.line === 'flight') {
      var m = f.title.match(/^\s*(\S+?)\s*[→\-]\s*(\S+?)(?:\s|$)/);
      if (m) displayTitle = m[1] + ' → ' + m[2];
    }

    // 榜单信息：仅在「酒店 / 门票」业务线分组下，每隔 2 张商卡出现一次（i%3===0）
    var h = (f.title || '').split('').reduce(function (a, c) {
      return a + c.charCodeAt(0);
    }, 0);
    var showRanking = (line === 'hotel' || line === 'ticket') && i % 3 === 0;
    var rankNamePool = line === 'ticket' ? ['当地热门门票', '亲子乐园人气', '网红打卡', '本周热销景点'] : ['当地奢华酒店', '亲子酒店人气', '海景房好评', '度假酒店热销'];
    var rankText = "".concat(rankNamePool[h % rankNamePool.length], " \u7B2C").concat(h % 3 + 1, "\u540D");

    // 设施 / 服务标签（无榜单信息时，在标签下补 2 个纯文字标签）
    var facilityPool = {
      hotel: ['免费WiFi', '含早餐', '24h前台', '行李寄存', '健身房', '室外泳池'],
      ticket: ['电子票入园', '随买随用', '免预约', '支持改期', '中文服务', '亲子设施'],
      flight: ['含手提行李', '可选座', '机上餐食', '准点率高', '含托运额'],
      play: ['中文向导', '含保险', '免预约', '支持改期', '即时确认'],
      vacation: ['一价全包', '专属管家', '接送机', '含三餐', '私人沙滩']
    };
    var facPool = facilityPool[f.line] || ['品质保障', '放心预订', '极速退款'];
    var facTags = [facPool[h % facPool.length], facPool[(h + 2) % facPool.length]];
    return /*#__PURE__*/React.createElement("div", {
      key: f._k,
      "data-feedcard": i,
      className: "card",
      style: {
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden'
      },
      onClick: function onClick() {
        clickedRef.current = true;
        bus.toast("\u67E5\u770B\u300C".concat(f.title, "\u300D"));
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flex: '0 0 118px',
        alignSelf: 'stretch',
        minHeight: 92,
        overflow: 'hidden',
        borderRadius: 11
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: f.img,
      photo: true,
      r: 11,
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "fav-btn ".concat(fav[f._k] ? 'is-fav' : ''),
      "aria-label": fav[f._k] ? '取消收藏' : '收藏商品',
      onClick: function onClick(e) {
        e.stopPropagation();
        setFav(function (s) {
          return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, f._k, !s[f._k]));
        });
        bus.toast("".concat(fav[f._k] ? '已取消收藏' : '已收藏', "\u300C").concat(f.title, "\u300D"));
      },
      style: {
        position: 'absolute',
        right: 6,
        top: 6,
        width: 27,
        height: 27,
        borderRadius: 999,
        background: 'rgba(255,255,255,.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,.12)',
        fontSize: 16,
        color: fav[f._k] ? '#E24A6A' : 'rgba(25,25,25,.62)',
        border: '1px solid rgba(255,255,255,.58)',
        backdropFilter: 'blur(7px)',
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        lineHeight: 1,
        transform: fav[f._k] ? 'scale(1.10)' : 'scale(1)',
        transition: 'transform .18s cubic-bezier(.2,1,.3,1)'
      }
    }, fav[f._k] ? '♥' : '♡')))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        padding: '9px 11px 9px 11px',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "feed-title-2",
      style: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.34,
        color: 'var(--text)'
      }
    }, displayTitle), f.line === 'flight' && f.depart && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)',
        marginTop: 3
      }
    }, f.depart), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 7,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 3,
        fontSize: 13.5,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, Number(f.score).toFixed(1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 600,
        color: 'var(--text-muted)'
      }
    }, "/ 5")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)'
      }
    }, f.sold)), showRanking && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 11.5,
        fontWeight: 700,
        color: '#A8862F',
        letterSpacing: '.2px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, rankText), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap',
        marginTop: 4,
        maxHeight: 18,
        overflow: 'hidden'
      }
    }, f.tags.map(function (t) {
      return /*#__PURE__*/React.createElement("span", {
        key: t,
        className: "tag"
      }, t);
    })), !showRanking && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        marginTop: 4,
        maxHeight: 16,
        overflow: 'hidden'
      }
    }, facTags.map(function (t, fi) {
      return /*#__PURE__*/React.createElement("span", {
        key: fi,
        style: {
          fontSize: 11,
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap'
        }
      }, t);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "price-origin",
      style: {
        lineHeight: 1.1
      }
    }, "\xA5", origin), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: 'var(--brand-strong)',
        background: 'var(--brand-soft)',
        padding: '1.5px 6px',
        borderRadius: 5,
        lineHeight: 1.2
      }
    }, discountText), /*#__PURE__*/React.createElement("span", {
      className: "price",
      style: {
        fontSize: 19,
        lineHeight: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), f.price))), coinAmt > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 13,
        height: 13,
        borderRadius: 999,
        background: '#F4BE2A',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9.5,
        fontWeight: 900,
        flexShrink: 0
      }
    }, "T"), /*#__PURE__*/React.createElement("span", null, "\u8D5A\u53D6"), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--coin-color)'
      }
    }, coinAmt), /*#__PURE__*/React.createElement("span", null, "Trip Coins")))));
  }
  var recoByAfter = {};
  inserts.forEach(function (ins) {
    (recoByAfter[ins.afterIndex] = recoByAfter[ins.afterIndex] || []).push(ins);
  });
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 15,
      color: "var(--brand)",
      fill: "var(--brand-soft)"
    }), "\u731C\u4F60\u559C\u6B22"),
    dot: false
  }, showDestGroup && /*#__PURE__*/React.createElement("div", {
    ref: destBarRef,
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 17,
      background: 'var(--bg)',
      height: DEST_BAR_H,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: destScrollRef,
    className: "hscroll",
    style: {
      gap: 6,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: 0,
      paddingRight: 58,
      flex: 1,
      minWidth: 0,
      alignItems: 'center'
    }
  }, DEST_LIST.map(function (d) {
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      ref: function ref(el) {
        return destBtnRefs.current[d] = el;
      },
      onClick: function onClick() {
        setDestFilter(d);
        centerDest(d);
        scrollFeedsTop();
      },
      style: {
        padding: '5px 12px',
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: destFilter === d ? 800 : 650,
        background: destFilter === d ? 'var(--brand)' : 'var(--surface-2)',
        color: destFilter === d ? '#fff' : 'var(--text-muted)',
        border: destFilter === d ? '1px solid var(--brand)' : '1px solid var(--hairline)',
        boxShadow: destFilter === d ? '0 3px 10px color-mix(in srgb,var(--brand) 38%, transparent)' : 'none',
        transition: 'background .18s, color .18s',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, destFilter === d && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12
      }
    }, "\uD83D\uDCCD"), d);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 58,
      background: 'linear-gradient(90deg,transparent,var(--bg) 38%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return bus.openCityPicker && bus.openCityPicker();
    },
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 32,
      height: 28,
      borderRadius: 999,
      fontSize: 15,
      background: 'var(--surface)',
      border: '1px solid var(--hairline)',
      boxShadow: '0 3px 10px rgba(0,0,0,.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2
    }
  }, "\uD83D\uDD0D"))), showDestGroup && destFilter && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '8px 14px 4px',
      padding: '8px 11px',
      borderRadius: 'var(--radius)',
      background: 'var(--brand-soft)',
      border: '1px solid color-mix(in srgb,var(--brand) 12%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 13,
    color: "var(--brand)",
    fill: "var(--brand)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 800,
      color: 'var(--brand-strong)'
    }
  }, "\u76EE\u7684\u5730\u4EAE\u70B9")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      lineHeight: 1.6,
      color: 'var(--text)',
      textWrap: 'pretty',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, feedsDestReco(destFilter, ctx && ctx.identity || props.identity))), /*#__PURE__*/React.createElement("div", {
    ref: groupBarRef,
    style: {
      position: 'sticky',
      top: showDestGroup ? DEST_BAR_H - 1 : 0,
      zIndex: 16,
      background: props.tier === 'premium' ? 'color-mix(in srgb, var(--bg) 90%, #fff 10%)' : 'var(--bg)',
      padding: '5px 0 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 14px',
      display: 'flex',
      gap: 18,
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollbarWidth: 'none',
      borderBottom: '1px solid var(--hairline)',
      padding: '0 2px'
    }
  }, lines.map(function (l) {
    return /*#__PURE__*/React.createElement("button", {
      key: l,
      onClick: function onClick() {
        setLine(l);
        scrollFeedsTop();
      },
      style: {
        position: 'relative',
        padding: '0 0 8px',
        borderRadius: 0,
        fontSize: 13.8,
        fontWeight: line === l ? 800 : 700,
        background: 'transparent',
        color: line === l ? 'var(--text)' : 'var(--text-muted)',
        flex: '0 0 auto'
      }
    }, LINE_LABEL[l], line === l && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        borderRadius: 3,
        background: 'var(--brand)'
      }
    }));
  }))), /*#__PURE__*/React.createElement(FeedFilters, {
    line: line,
    activeCity: activeCity,
    family: (ctx && ctx.identity) === 'family' || props.identity === 'family',
    trip: flightTrip,
    cabin: flightCabin,
    onTrip: setFlightTrip,
    onCabin: setFlightCabin,
    bus: bus
  }), line === 'flight' ? /*#__PURE__*/React.createElement(FlightPeriods, {
    dep: window.defaultDepartCity(activeCity),
    dest: activeCity,
    trip: flightTrip,
    cabin: flightCabin,
    identity: ctx && ctx.identity || props.identity,
    bus: bus
  }) : /*#__PURE__*/React.createElement("div", {
    ref: gridRef,
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr)',
      gap: 10,
      padding: '4px 14px 2px'
    }
  }, display.map(function (f, i) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: f._k
    }, renderCard(f, i), ctx && ctx.agFeed && i === Math.min(2, display.length - 1) && ctx.agFeed, recoByAfter[i] && recoByAfter[i].map(function (ins) {
      return /*#__PURE__*/React.createElement(RecoStrip, {
        key: ins.id,
        ins: ins,
        anchor: f
      });
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '14px 12px 8px',
      fontSize: 11.5,
      color: 'var(--text-muted)'
    }
  }, "\u2014\u2014 \u5DF2\u4E3A\u4F60\u7CBE\u9009 ", activeCity, " \u7684", LINE_LABEL[line], "\u597D\u7269 \u2014\u2014"));
}
Object.assign(window, {
  Coupon: Coupon,
  FlashSale: FlashSale,
  CoinsRebate: CoinsRebate,
  Feeds: Feeds
});

/* 6814aea1-84ec-400e-a3cc-e48e2989afcc.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* ============================================================
   OTA Demo — 模块 B
   CityHero / AIEntry / Ranking / Posts / TripCard / TripPlan
   FamilyProfile / BizTravel / EventBundle / Airline·Hotel·Ticket VIP
   ============================================================ */
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef;

/* ---------------- 4.4 城市头图 ---------------- */
function CityHero(_ref) {
  var props = _ref.props;
  var city = props.city || '上海';
  var sub = props.state === 'S4' ? '行程进行中 · 玩转当地' : props.state === 'S3' ? '出发在即 · 行程已就绪' : props.tier === 'premium' ? '此刻启程，正当其时' : '此刻出发，最划算的时机';
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter",
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    label: city + ' city',
    photo: true,
    h: 136,
    r: 'var(--radius)'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.22) 44%,rgba(0,0,0,.54)), linear-gradient(135deg,color-mix(in srgb,var(--brand) 34%,transparent),transparent 58%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fff',
      fontSize: 21,
      fontWeight: 900
    }
  }, city), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'rgba(255,255,255,.88)',
      fontSize: 12,
      marginTop: 2
    }
  }, sub))));
}

/* ---------------- 4.5 AI 搜索入口 ---------------- */
function AIEntry(_ref2) {
  var props = _ref2.props,
    bus = _ref2.bus,
    ctx = _ref2.ctx;
  var ph = ctx.state === 'S1' ? '想去哪？问问 AI 帮你规划行程' : ctx.state === 'S3' ? '补充当地玩乐？问问 AI' : '搜索目的地 / 酒店 / 机票，或问一问';
  var prominent = ctx.state === 'S1';
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter",
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return bus.openAI();
    },
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      background: 'var(--surface)',
      borderRadius: 999,
      padding: prominent ? '12px 14px' : '10px 14px',
      boxShadow: 'var(--shadow)',
      border: '1.5px solid var(--brand-soft)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 18,
    color: "var(--brand)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'left',
      color: 'var(--text-muted)',
      fontSize: prominent ? 14 : 13
    }
  }, ph), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      background: 'var(--cta-grad,var(--brand-grad,var(--brand)))',
      color: ctx.tier === 'premium' ? '#1A1505' : 'var(--on-cta,#fff)',
      borderRadius: 999,
      padding: '5px 11px',
      fontSize: 13,
      fontWeight: 700,
      boxShadow: 'var(--cta-shadow,var(--btn-shadow))'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 13,
    fill: "currentColor",
    color: "currentColor"
  }), "\u95EE\u4E00\u95EE")));
}

/* ---------------- 5.6 榜单 — 3列横滑 + 收起展开 ---------------- */
function Ranking(_ref3) {
  var props = _ref3.props,
    bus = _ref3.bus;
  var r = window.DATA.rankings[props.style] || window.DATA.rankings['default'];
  var groups = Object.keys(r.groups);
  var _useState = useState({}),
    _useState2 = _slicedToArray(_useState, 2),
    visible = _useState2[0],
    setVisible = _useState2[1];
  var luxe = props.style === 'luxe-blackgold';
  var hdrBg = luxe ? 'linear-gradient(120deg,#1A1710,#2C2410)' : 'var(--ranking-grad,var(--brand-grad))';
  var hdrColor = 'var(--ranking-on,var(--hero-title, #fff))';
  var fillPool = {
    '酒店': ['城市精选酒店', '海景度假酒店', '市中心高分酒店', '亲子主题酒店', '高层景观酒店', '温泉度假酒店'],
    '门票': ['热门乐园门票', '城市观光通票', '海洋世界家庭票', '网红展览门票', '地标观景台票', '亲子科普馆票'],
    '餐厅': ['本地人气餐厅', '景观亲子餐厅', '特色海鲜餐厅', '米其林推荐餐厅', '老字号名店', '网红打卡餐厅']
  };
  var fillReason = ['近期热度上升', '更多用户收藏', '本周预订飙升', '高分好评如潮', '回头客最多'];
  function normalizeItems(g, source) {
    var arr = _toConsumableArray(source);
    var pool = fillPool[g] || ['精选榜单', '热门选择', '高分推荐', '人气优选', '口碑之选', '新晋热门'];
    var pi = 0;
    var _loop = function _loop() {
      var name = pool[pi % pool.length];
      pi++;
      if (arr.some(function (x) {
        return x.name === name;
      })) return 1; // continue
      // 去重，避免补位与真实项 / 彼此重名
      var idx = arr.length;
      arr.push({
        rank: idx + 1,
        name: name,
        score: (4.8 - idx * 0.04).toFixed(1),
        reason: fillReason[idx % fillReason.length]
      });
    };
    while (arr.length < 6 && pi < pool.length * 2) {
      if (_loop()) continue;
    }
    return arr.map(function (it, i) {
      return _objectSpread(_objectSpread({}, it), {}, {
        rank: i + 1
      });
    });
  }
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trophy",
      size: 15,
      color: "var(--brand)"
    }), /*#__PURE__*/React.createElement("span", null, r.name)),
    dot: false,
    more: "\u66F4\u591A\u699C\u5355"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      gap: 10,
      alignItems: 'flex-start',
      paddingBottom: 12
    }
  }, groups.map(function (g) {
    var items = normalizeItems(g, r.groups[g]);
    var count = visible[g] || 3;
    var shown = items.slice(0, count);
    return /*#__PURE__*/React.createElement("div", {
      key: g,
      className: "card",
      style: {
        width: 240,
        overflow: 'hidden',
        flex: '0 0 240px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '9px 13px 7px',
        background: hdrBg
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 800,
        color: hdrColor
      }
    }, g === '门票' ? '景点' : g, "\u699C")), shown.map(function (item, idx) {
      return /*#__PURE__*/React.createElement("div", {
        key: "".concat(g, "_").concat(item.rank, "_").concat(idx),
        onClick: function onClick() {
          return bus.toast("\u67E5\u770B\u300C".concat(item.name, "\u300D"));
        },
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 11px',
          borderBottom: idx < shown.length - 1 ? '1px solid var(--hairline)' : 'none',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 16,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 900,
          fontStyle: 'italic',
          color: item.rank <= 3 ? 'var(--brand)' : 'var(--text-muted)',
          flex: '0 0 16px'
        }
      }, item.rank), /*#__PURE__*/React.createElement(Ph, {
        label: item.name,
        photo: true,
        w: 40,
        h: 40,
        r: 7
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12.5,
          fontWeight: 700,
          color: 'var(--text)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, item.name), item.reason && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: 'var(--brand-strong)',
          marginTop: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, item.reason), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          color: 'var(--text-muted)',
          marginTop: 1
        }
      }, "\u2605 ", item.score)));
    }), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        var cur = visible[g] || 3;
        if (cur < items.length) setVisible(function (e) {
          return _objectSpread(_objectSpread({}, e), {}, _defineProperty({}, g, Math.min(cur + 3, items.length)));
        });else setVisible(function (e) {
          return _objectSpread(_objectSpread({}, e), {}, _defineProperty({}, g, 3));
        });
      },
      style: {
        width: '100%',
        padding: '8px',
        fontSize: 12.5,
        fontWeight: 800,
        color: 'var(--brand)',
        borderTop: '1px solid var(--hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        background: 'var(--surface-2)'
      }
    }, shown.length < items.length ? '展开' : '收起', " ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevD",
      size: 11,
      color: "var(--brand)",
      style: {
        transform: shown.length < items.length ? 'none' : 'rotate(180deg)'
      }
    })));
  })));
}

/* ---------------- 5.7 旅游帖子 ---------------- */
function Posts(_ref4) {
  var props = _ref4.props,
    bus = _ref4.bus;
  var list = window.DATA.posts;
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "book",
      size: 15,
      color: "var(--brand)"
    }), "\u65C5\u884C\u653B\u7565"),
    dot: false,
    more: "\u66F4\u591A"
  }, props.s5 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 22,
    color: "var(--brand)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, "\u6652\u884C\u7A0B\uFF0C\u5F97\u6743\u76CA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "\u53D1\u5E03\u6E38\u8BB0\u6700\u9AD8\u5F97 200 \u79EF\u5206")), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: function onClick() {
      return bus.toast('打开发帖编辑器');
    },
    style: {
      padding: '6px 13px',
      fontSize: 13
    }
  }, "\u53BB\u53D1\u5E16"))), /*#__PURE__*/React.createElement("div", {
    className: "hscroll"
  }, list.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "card",
      style: {
        width: 156,
        overflow: 'hidden'
      },
      onClick: function onClick() {
        return bus.toast("\u9605\u8BFB\u300C".concat(p.title, "\u300D"));
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: p.cover,
      photo: true,
      h: 108,
      r: 0
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '7px 9px 9px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.35,
        height: 32,
        overflow: 'hidden',
        color: 'var(--text)'
      }
    }, p.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: p.author,
      w: 16,
      h: 16,
      r: 8
    }), " ", p.author), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, "\u2661 ", p.likes))));
  })));
}

/* ---------------- 5.8 行程卡片 (Change 7) ---------------- */
/* 行程卡片底部：按行程阶段推荐的商品卡片（仅非商务出行） */
/* line: hotel | flight | ticket —— 机票卡片不展示评分/月售 */
function TripRecoCard(_ref5) {
  var it = _ref5.it,
    bus = _ref5.bus,
    line = _ref5.line;
  var isFlight = line === 'flight' || it.line === 'flight';
  var h = (it.title || '').split('').reduce(function (a, c) {
    return a + c.charCodeAt(0);
  }, 0);
  var score = Number(it.score || 4.4 + h % 6 / 10).toFixed(1);
  var rate = 0.66 + h % 16 / 100;
  var origin = Math.max(it.price + 30, Math.round(it.price / rate / 10) * 10);
  var disc = (it.price / origin * 10).toFixed(1) + '折';
  return /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return bus.toast("\u67E5\u770B\u300C".concat(it.title, "\u300D"));
    },
    style: {
      width: 132,
      flex: '0 0 auto',
      background: 'var(--surface)',
      borderRadius: 11,
      overflow: 'hidden',
      border: '1px solid var(--hairline)',
      boxShadow: '0 3px 10px rgba(0,0,0,.05)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    label: it.img,
    photo: true,
    h: 84,
    r: 0
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '7px 8px 8px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "feed-title-2",
    style: {
      fontSize: 11.5,
      fontWeight: 600,
      lineHeight: 1.3,
      color: 'var(--text)'
    }
  }, it.title), !isFlight && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, score, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9.5,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, " / 5")), it.sold && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, it.sold)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(PriceBlock, {
    price: it.price,
    origin: origin,
    disc: disc,
    size: 14,
    side: "right",
    colAlign: "center"
  }))));
}

/* 业务线分组：多于 1 条业务线时用 tab 切换（如「机票」「酒店」） */
var RECO_LINE_LABEL = {
  hotel: '酒店',
  flight: '机票',
  ticket: '门票',
  play: '玩乐'
};
function RecoLineTabs(_ref6) {
  var groups = _ref6.groups,
    bus = _ref6.bus,
    variant = _ref6.variant;
  var _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    active = _useState4[0],
    setActive = _useState4[1];
  if (!groups.length) return null;
  var ai = Math.min(active, groups.length - 1);
  var g = groups[ai];
  var multi = groups.length > 1;
  var coupon = variant === 'coupon'; // 与优惠券组件业务线 tab 选中样式一致：象牙底 + 品牌色描边
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--hairline)',
      paddingTop: 10
    }
  }, multi ?
  /*#__PURE__*/
  /* 多业务线：pill tab 切换 */
  React.createElement("div", {
    className: "hscroll",
    style: {
      gap: 7,
      padding: '0 14px 9px'
    }
  }, groups.map(function (x, i) {
    var on = i === ai;
    if (coupon) {
      return /*#__PURE__*/React.createElement("button", {
        key: x.key,
        onClick: function onClick() {
          return setActive(i);
        },
        style: {
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 12px',
          borderRadius: 999,
          fontSize: 12.5,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'all .15s ease',
          background: on ? 'var(--surface)' : 'transparent',
          color: on ? 'var(--brand-strong)' : 'var(--text-muted)',
          border: on ? '1.5px solid var(--brand)' : '1.5px solid var(--hairline)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: x.icon,
        size: 13,
        color: on ? 'var(--brand-strong)' : 'var(--text-muted)'
      }), x.label);
    }
    return /*#__PURE__*/React.createElement("button", {
      key: x.key,
      onClick: function onClick() {
        return setActive(i);
      },
      style: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 13px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: on ? 800 : 600,
        whiteSpace: 'nowrap',
        transition: 'all .15s ease',
        background: on ? 'var(--brand)' : 'var(--surface-2)',
        color: on ? 'var(--on-brand,#fff)' : 'var(--text-muted)',
        border: on ? 'none' : '1px solid var(--hairline)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: x.icon,
      size: 13,
      color: on ? 'var(--on-brand,#fff)' : 'var(--brand)'
    }), x.label);
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      padding: '0 14px 8px',
      fontSize: 13.5,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: g.icon,
    size: 14,
    color: "var(--brand)"
  }), g.title || g.label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, "\xB7 \u4E3A\u4F60\u7684\u884C\u7A0B\u7CBE\u9009")), /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      gap: 9,
      padding: '0 14px 10px'
    }
  }, g.items.map(function (it, k) {
    return /*#__PURE__*/React.createElement(TripRecoCard, {
      key: (it.title || '') + k,
      it: it,
      bus: bus,
      line: g.key
    });
  })));
}

/* 填满 4 张：不足时从同业务线货品池补齐（去重） */
function recoFillTo4(items, line, city, tier) {
  var out = (items || []).slice(0, 4);
  if (out.length >= 4) return out;
  var pool = (window.buildFeedCards ? window.buildFeedCards(city, line, tier) : []) || [];
  var _loop2 = function _loop2() {
    var c = pool[i];
    if (!out.some(function (x) {
      return (x.title || '') === (c.title || '');
    })) out.push(c);
  };
  for (var i = 0; i < pool.length && out.length < 4; i++) {
    _loop2();
  }
  return out.slice(0, 4);
}
function TripCard(_ref7) {
  var props = _ref7.props,
    bus = _ref7.bus,
    ctx = _ref7.ctx;
  var t = window.buildTrip(ctx && ctx.city, ctx && ctx.identity, props.phase);
  var phase = props.phase;
  var head = phase === 'onway' ? '行程进行中 · 在途' : phase === 'done' ? '欢迎回家 · 行程回顾' : t.departText;
  // 行程阶段推荐（非商务出行）：行程前→酒店；行程中→门票；行程后→机票+酒店
  var identity = ctx && ctx.identity;
  var recoCity = ctx && ctx.city || window.fallbackCity(identity);
  var recoTier = ctx && ctx.tier || 'value';
  var recoBlocks = identity === 'biz' ? [] : phase === 'pre' ? [{
    line: 'hotel',
    label: '推荐酒店',
    icon: 'bed'
  }] : phase === 'onway' ? [{
    line: 'ticket',
    label: '推荐门票',
    icon: 'ticket'
  }] : phase === 'done' ? [{
    line: 'flight',
    label: '推荐机票',
    icon: 'plane'
  }, {
    line: 'hotel',
    label: '推荐酒店',
    icon: 'bed'
  }] : [];
  // 业务线分组：填满 4 张；多业务线（如行程后机票+酒店）以 tab 切换
  var recoGroups = recoBlocks.map(function (b) {
    return {
      key: b.line,
      label: RECO_LINE_LABEL[b.line] || b.label,
      title: b.label,
      icon: b.icon,
      items: recoFillTo4(window.buildFeedCards ? window.buildFeedCards(recoCity, b.line, recoTier) : [], b.line, recoCity, recoTier)
    };
  }).filter(function (g) {
    return g.items.length;
  });
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter",
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 14px',
      background: 'color-mix(in srgb, var(--brand) 38%, #fff)',
      color: 'var(--brand-strong)',
      display: 'flex',
      alignItems: 'baseline',
      gap: 9,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-h1)',
      fontWeight: 900,
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, t.from, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "plane",
    size: 15,
    color: "currentColor"
  }), " ", t.to), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      opacity: .85
    }
  }, head)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px'
    }
  }, t.segs.map(function (s, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '5px 0'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.type === 'flight' ? 'plane' : s.type === 'hotel' ? 'bed' : 'case',
      size: 15,
      color: phase === 'onway' && i === 0 ? 'var(--brand)' : 'var(--text-muted)'
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 13,
        color: 'var(--text)',
        fontWeight: phase === 'onway' && i === 0 ? 700 : 400
      }
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)'
      }
    }, s.time));
  })), recoGroups.length > 0 && /*#__PURE__*/React.createElement(RecoLineTabs, {
    groups: recoGroups,
    bus: bus,
    variant: "coupon"
  })));
}

/* ---------------- 5.9 行程规划 ---------------- */
function TripPlan(_ref8) {
  var props = _ref8.props,
    bus = _ref8.bus;
  var tipByIdentity = {
    biz: '已为差旅插入「会议动线 + 酒店动线」',
    family: '已为亲子插入「适龄活动」建议',
    event: '已为展演插入「演出当天动线」',
    solo: 'AI 可一键补齐玩乐与餐厅'
  };
  var days = [{
    day: 'Day 1',
    items: ['抵达 · 酒店入住', props.identity === 'biz' ? '客户会议' : '热门玩乐']
  }, {
    day: 'Day 2',
    items: [props.identity === 'family' ? '亲子乐园' : '城市探索', '当地美食']
  }];
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "cal",
      size: 15,
      color: "var(--brand)"
    }), "\u884C\u7A0B\u89C4\u5212"),
    dot: false,
    more: "AI \u5E2E\u6211\u6392"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--brand-strong)',
      marginBottom: 9
    }
  }, tipByIdentity[props.identity] || tipByIdentity.solo), days.map(function (d, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 10,
        paddingBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 99,
        background: 'var(--brand)'
      }
    }), i < days.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        width: 2,
        background: 'var(--hairline)',
        margin: '2px 0'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, d.day), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 5,
        flexWrap: 'wrap'
      }
    }, d.items.map(function (it) {
      return /*#__PURE__*/React.createElement("span", {
        key: it,
        style: {
          fontSize: 12.5,
          padding: '4px 9px',
          borderRadius: 7,
          background: 'var(--surface-2)',
          color: 'var(--text)'
        }
      }, it);
    }), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return bus.toast('添加玩乐/门票/餐厅');
      },
      style: {
        fontSize: 12.5,
        padding: '4px 9px',
        borderRadius: 7,
        border: '1px dashed var(--brand)',
        color: 'var(--brand)'
      }
    }, "+ \u6DFB\u52A0"))));
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-block",
    onClick: function onClick() {
      return bus.toast('AI 正在为你生成完整行程…');
    }
  }, "AI \u4E00\u952E\u751F\u6210\u884C\u7A0B"))));
}

/* ---------------- 5.10 家庭档案 ---------------- */
function FamilyProfile(_ref9) {
  var props = _ref9.props,
    bus = _ref9.bus,
    ctx = _ref9.ctx;
  var fam = ctx.family;
  if (fam.filled) {
    var chipStyle = {
      padding: '5px 12px',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
      background: 'rgba(255,252,244,.62)',
      border: '1px solid rgba(176,138,52,.34)',
      color: '#1A1208',
      flexShrink: 0,
      whiteSpace: 'nowrap'
    };
    return /*#__PURE__*/React.createElement("section", {
      className: "floor floor-enter"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '10px 14px 0',
        borderRadius: 6,
        background: 'linear-gradient(150deg, #FDEDCE 0%, #FBE4B6 100%)',
        border: '1.5px solid #F0D592',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "family3",
      size: 22,
      color: "#F5921E",
      style: {
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        flex: 1,
        scrollbarWidth: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: chipStyle
    }, fam.adults, "\u4F4D\u6210\u4EBA"), fam.children.length > 0 && /*#__PURE__*/React.createElement("span", {
      style: chipStyle
    }, fam.children.length, "\u4F4D\u513F\u7AE5"), fam.children.map(function (c, i) {
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        style: chipStyle
      }, c.age === 0 ? '<1岁' : c.age + '岁');
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return bus.openFamily();
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        padding: '2px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevR",
      size: 18,
      color: "#8A6A2A"
    }))));
  }
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "family3",
      size: 15,
      color: "var(--brand)"
    }), "\u6211\u7684\u5BB6\u5EAD\u6863\u6848"),
    dot: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 12,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, "\u586B\u5199\u6211\u7684\u5BB6\u5EAD\u6863\u6848"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      marginTop: 2,
      lineHeight: 1.4
    }
  }, "\u89E3\u9501\u66F4\u61C2\u5A03\u7684\u63A8\u8350\uFF0C\u9886\u53D6\u4E13\u5C5E\u4EB2\u5B50\u793C\u5305")), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: function onClick() {
      return bus.openFamily();
    },
    style: {
      textAlign: 'center',
      minWidth: 96,
      flexShrink: 0
    }
  }, "\u53BB\u586B\u5199")))));
}

/* ---------------- 5.11 商旅差旅助手 ---------------- */
function BizProductRow(_ref0) {
  var it = _ref0.it,
    bus = _ref0.bus;
  var tags = (it.tags || []).slice(0, 2);
  var sub = it.sub;
  return /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return bus.toast("\u67E5\u770B\u300C".concat(it.title, "\u300D"));
    },
    style: {
      display: 'flex',
      gap: 10,
      padding: '9px 0',
      borderBottom: '1px solid var(--hairline)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    label: it.img || it.title,
    photo: true,
    w: 52,
    h: 52,
    r: 9,
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: 'var(--text)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, it.title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8,
      marginTop: 'auto',
      paddingTop: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flexWrap: 'wrap',
      minWidth: 0
    }
  }, tags.map(function (t) {
    return /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "tag"
    }, t);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(PriceBlock, {
    price: it.price,
    seed: it.title,
    rate: 0.7,
    size: 15,
    side: "right"
  })))));
}
function BizTravel(_ref1) {
  var props = _ref1.props,
    bus = _ref1.bus,
    ctx = _ref1.ctx;
  var d = window.DATA.bizTravel;
  var recCity = ctx && ctx.city || window.fallbackCity('biz');
  var phase = props && props.phase || ctx && ctx.state || 'S2';
  var _useState5 = useState(window.bizAddrFor(recCity)),
    _useState6 = _slicedToArray(_useState5, 2),
    addr = _useState6[0],
    setAddr = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    editing = _useState8[0],
    setEditing = _useState8[1];
  var _useState9 = useState(d.budget),
    _useState0 = _slicedToArray(_useState9, 2),
    budget = _useState0[0],
    setBudget = _useState0[1];
  useEffect(function () {
    setAddr(window.bizAddrFor(recCity));
  }, [recCity]);
  var sections = window.buildBizSections(recCity, phase, budget) || [];
  var tier = ctx && ctx.tier || 'value';
  // 业务线分组：每条业务线填满 4 张；多业务线以 tab 切换（机票 / 酒店…）
  var groups = sections.map(function (sec) {
    return {
      key: sec.key,
      label: RECO_LINE_LABEL[sec.key] || sec.title,
      title: sec.title,
      icon: sec.icon,
      items: recoFillTo4(sec.items, sec.key, recCity, tier)
    };
  }).filter(function (g) {
    return g.items.length;
  });
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "case",
      size: 15,
      color: "var(--brand)"
    }), "\u5DEE\u65C5\u52A9\u624B"),
    dot: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      paddingTop: 12,
      paddingBottom: 2,
      paddingLeft: 0,
      paddingRight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      marginBottom: 10,
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 0',
      minWidth: 0,
      background: 'var(--surface-2)',
      borderRadius: 9,
      padding: '7px 11px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "\u51FA\u5DEE\u5730\u70B9"), editing ? /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: addr,
    onChange: function onChange(e) {
      return setAddr(e.target.value);
    },
    onBlur: function onBlur() {
      return setEditing(false);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter') setEditing(false);
    },
    style: {
      width: '100%',
      border: 'none',
      borderBottom: '1.5px solid var(--brand)',
      background: 'transparent',
      fontSize: 13.5,
      fontWeight: 700,
      color: 'var(--text)',
      outline: 'none',
      padding: '1px 0'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: 'var(--text)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flex: 1,
      minWidth: 0
    }
  }, addr), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setEditing(true);
    },
    "aria-label": "\u7F16\u8F91\u51FA\u5DEE\u5730\u70B9",
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: 0,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "edit",
    size: 12,
    color: "var(--brand)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 96px',
      background: 'var(--surface-2)',
      borderRadius: 9,
      padding: '7px 11px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, "\u9884\u7B97 / \u665A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text)'
    }
  }, "\xA5", budget))), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "500",
    max: "1200",
    step: "20",
    value: budget,
    onChange: function onChange(e) {
      return setBudget(+e.target.value);
    },
    style: {
      width: '100%',
      accentColor: 'var(--brand)',
      marginBottom: 10
    }
  })), groups.length > 0 && /*#__PURE__*/React.createElement(RecoLineTabs, {
    groups: groups,
    bus: bus
  }))));
}

/* ---------------- 5.12 展演周边打包 ---------------- */
function EventBundle(_ref10) {
  var props = _ref10.props,
    bus = _ref10.bus,
    ctx = _ref10.ctx;
  var city = ctx && ctx.city || window.fallbackCity('event');
  var e = _objectSpread(_objectSpread({}, window.DATA.eventBundle), {}, {
    show: window.eventShowFor(city)
  });
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter",
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    label: e.show.poster,
    photo: true,
    h: 100,
    r: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg,rgba(18,14,34,.82) 0%,rgba(18,14,34,.42) 56%,rgba(18,14,34,.12) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fff',
      fontSize: 17,
      fontWeight: 900,
      textShadow: 'var(--neon, none)',
      lineHeight: 1.2
    }
  }, e.show.name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'rgba(255,255,255,.84)',
      fontSize: 12,
      marginTop: 3
    }
  }, e.show.venue, " \xB7 ", e.show.date))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 13px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: 'var(--text)',
      marginBottom: 3
    }
  }, "\u770B\u5B8C\u6F14\u51FA\u8D70\u56DE\u9152\u5E97 \xB7 \u5468\u8FB9\u6253\u5305"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      marginBottom: 8
    }
  }, "\u9152\u5E97 + \u95E8\u7968 + \u63A5\u9A73\uFF0C\u4E00\u952E\u641E\u5B9A"), e.bundles.map(function (b, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: function onClick() {
        return bus.toast('预订该打包方案');
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '9px',
        borderRadius: 'var(--radius)',
        background: 'var(--surface-2)',
        marginBottom: 7
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "stub",
      size: 22,
      color: "var(--brand)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--text)'
      }
    }, b.hotel), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-muted)',
        marginTop: 1
      }
    }, b.ticket, " \xB7 \u542B\u573A\u9986\u63A5\u9A73")), /*#__PURE__*/React.createElement("div", {
      className: "price",
      style: {
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), b.total));
  }))));
}

/* ---------------- 5.13b 高端会籍（固定置顶 · 会员等级 + 权益） ---------------- */
// 会籍阶梯图标（还原 Trip REWARDS 各等级徽记）：深色六边形 + 彩色 “T”
// 普卡蓝 / 银卡金 / 金卡青 / 铂金紫 / 黑钻前一级靛蓝
var HEX_CLIP = 'polygon(50% 1%,93% 25.5%,93% 74.5%,50% 99%,7% 74.5%,7% 25.5%)';
var MB_TIERS = ['#3E9BF5',
// 蓝
'#F4A623',
// 金
'#16BEC4',
// 青
'#9B5CF0',
// 紫
'#5B6CF0' // 靛蓝
];
// 单个等级六边形徽记：深紫底 + 彩色描边 + 同色 “T”
function MBHex(_ref11) {
  var color = _ref11.color,
    _ref11$size = _ref11.size,
    size = _ref11$size === void 0 ? 26 : _ref11$size;
  var s = size;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: s,
      height: s,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -s * 0.18,
      borderRadius: '50%',
      background: "radial-gradient(circle, ".concat(color, "33, transparent 70%)"),
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      clipPath: HEX_CLIP,
      background: "linear-gradient(160deg, ".concat(color, ", ").concat(color, "99)")
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: s * 0.085,
      clipPath: HEX_CLIP,
      background: 'linear-gradient(165deg,#3a3656 0%,#262340 55%,#1c1930 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.16)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: s * 0.5,
      fontWeight: 800,
      fontFamily: 'var(--serif)',
      color: color,
      lineHeight: 1,
      textShadow: "0 0 6px ".concat(color, "66")
    }
  }, "T")));
}
// 黑钻徽记（向下明亮式切面 · 干净对称 SVG）；ring=阶梯里的金圈版
var __gemUid = 0;
function GemDiamond(_ref12) {
  var d = _ref12.d;
  var big = d >= 38;
  var uid = React.useMemo(function () {
    return 'gem' + ++__gemUid;
  }, []);
  var bw = Math.max(1, d * 0.038);
  // 干净对称几何：顶边 20–80，最宽腰线 y26（4–96），收至底尖 (50,97)
  var F = [{
    p: '20,8 50,8 50,26 4,26',
    g: ['#e6e4ee', '#b4b2c0'],
    a: 135
  },
  // 左冠（亮）
  {
    p: '50,8 80,8 96,26 50,26',
    g: ['#d6d4e0', '#a3a1b0'],
    a: 225
  },
  // 右冠
  {
    p: '4,26 27,26 50,97',
    g: ['#9b99a5', '#4a4854'],
    a: 120
  },
  // 远左亭（亮）
  {
    p: '27,26 50,26 50,97',
    g: ['#5c5a66', '#1e1c28'],
    a: 90
  },
  // 近左亭（暗）
  {
    p: '50,26 73,26 50,97',
    g: ['#524f5b', '#1a1822'],
    a: 90
  },
  // 近右亭（暗）
  {
    p: '73,26 96,26 50,97',
    g: ['#a6a3b0', '#54515d'],
    a: 240
  } // 远右亭（亮）
  ];
  var OUT = '20,8 80,8 96,26 50,97 4,26';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: d,
      height: d
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: d,
    height: d,
    style: {
      overflow: 'visible',
      display: 'block',
      filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.45))'
    }
  }, /*#__PURE__*/React.createElement("defs", null, F.map(function (f, i) {
    return /*#__PURE__*/React.createElement("linearGradient", {
      key: i,
      id: "".concat(uid, "-").concat(i),
      gradientTransform: "rotate(".concat(f.a, " .5 .5)")
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: f.g[0]
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: f.g[1]
    }));
  }), /*#__PURE__*/React.createElement("radialGradient", {
    id: "".concat(uid, "-tbl"),
    cx: "0.5",
    cy: "0.1",
    r: "0.7"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "rgba(255,255,255,.7)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.55",
    stopColor: "rgba(255,255,255,.12)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "rgba(255,255,255,0)"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "".concat(uid, "-rim"),
    x1: "0.5",
    y1: "0",
    x2: "0.5",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "rgba(255,255,255,.7)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "0.5",
    stopColor: "rgba(255,255,255,.1)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "rgba(255,255,255,0)"
  }))), F.map(function (f, i) {
    return /*#__PURE__*/React.createElement("polygon", {
      key: i,
      points: f.p,
      fill: "url(#".concat(uid, "-").concat(i, ")")
    });
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "20,8 80,8 96,26 4,26",
    fill: "url(#".concat(uid, "-tbl)")
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(255,255,255,.28)",
    strokeWidth: "0.5",
    fill: "none",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4,26 96,26"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M27,26 50,97",
    opacity: ".4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M73,26 50,97",
    opacity: ".4"
  })), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(0,0,0,.22)",
    strokeWidth: "0.5",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M50,26 50,97"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M50,8 50,26",
    opacity: ".5"
  })), /*#__PURE__*/React.createElement("polygon", {
    points: OUT,
    fill: "none",
    stroke: "url(#".concat(uid, "-rim)"),
    strokeWidth: "1",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "36",
    cy: "13",
    rx: "9",
    ry: "2.4",
    fill: "rgba(255,255,255,.6)",
    transform: "rotate(-12 36 13)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "22",
    r: "1.5",
    fill: "#fff",
    opacity: ".85"
  })), big ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: d * 0.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: d * 0.35,
      height: d * 0.12,
      borderRadius: Math.max(2, d * 0.035),
      border: "".concat(bw, "px solid #CBA258"),
      background: 'linear-gradient(180deg,#d2d0dc,#8d8b96)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.65), 0 1px 2px rgba(0,0,0,.4)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: d * 0.135,
      height: d * 0.26,
      marginTop: -bw,
      borderTop: 'none',
      border: "".concat(bw, "px solid #CBA258"),
      background: 'linear-gradient(180deg,#b0aeba,#62606b)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.45), 0 1px 2px rgba(0,0,0,.4)'
    }
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: d * 0.02
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: d * 0.4,
      fontWeight: 800,
      fontFamily: 'var(--serif)',
      lineHeight: 1,
      background: 'linear-gradient(180deg,#F4DCA0,#C8A24E)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 1px 0 rgba(0,0,0,.5))'
    }
  }, "T")));
}
function MBGem(_ref13) {
  var _ref13$size = _ref13.size,
    size = _ref13$size === void 0 ? 64 : _ref13$size,
    _ref13$glow = _ref13.glow,
    glow = _ref13$glow === void 0 ? true : _ref13$glow,
    _ref13$ring = _ref13.ring,
    ring = _ref13$ring === void 0 ? false : _ref13$ring;
  var s = size;
  if (ring) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: s,
        height: s,
        flex: '0 0 auto'
      }
    }, glow && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: -s * 0.26,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(214,184,120,.4), transparent 70%)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 36%, #2c2536, #15111d)',
        border: "".concat(Math.max(1.2, s * 0.05), "px solid #CBA258"),
        boxShadow: '0 0 0 1px rgba(0,0,0,.35), 0 2px 5px rgba(0,0,0,.4)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(GemDiamond, {
      d: s * 0.62
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: s,
      height: s,
      flex: '0 0 auto'
    }
  }, glow && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -s * 0.36,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(198,190,222,.4), rgba(150,140,180,.12) 48%, transparent 72%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '22%',
      bottom: -s * 0.02,
      width: '56%',
      height: s * 0.09,
      borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%)',
      filter: 'blur(1px)'
    }
  }), /*#__PURE__*/React.createElement(GemDiamond, {
    d: s
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: s * 0.08,
      right: s * 0.2,
      width: s * 0.15,
      height: s * 0.15,
      borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(255,250,240,.7),transparent 66%)',
      filter: 'blur(.5px)',
      pointerEvents: 'none'
    }
  }));
}
function MemberBenefits(_ref14) {
  var props = _ref14.props,
    bus = _ref14.bus;
  var d = window.DATA.memberBenefits;
  var onPerk = function onPerk(p) {
    return bus && bus.toast && bus.toast("\u300C".concat(p.title, "\u300D\u5C0A\u4EAB\u6743\u76CA"));
  };
  var ladder = [].concat(MB_TIERS, ['gem']); // 5 等级徽记 + 黑钻
  var current = ladder.length - 1; // 黑钻为当前等级
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter",
    style: {
      padding: '0 14px'
    },
    "data-mod-inner": "memberBenefits"
  }, /*#__PURE__*/React.createElement("div", {
    className: "member-card",
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius)',
      background: 'var(--surface)',
      border: '1px solid color-mix(in srgb,var(--brand) 24%, transparent)',
      boxShadow: '0 2px 6px rgba(90,82,52,.08), 0 16px 34px rgba(60,52,82,.16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: '10px 16px 9px',
      background: 'linear-gradient(150deg, #2c2114 0%, #211910 40%, #191108 72%, #140d07 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -90,
      right: -50,
      width: 260,
      height: 260,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(214,176,98,.5) 0%, rgba(184,142,70,.2) 40%, transparent 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: -70,
      left: -30,
      width: 220,
      height: 160,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(150,112,52,.22), transparent 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -30,
      left: '12%',
      width: 3,
      height: 240,
      transform: 'rotate(26deg)',
      background: 'linear-gradient(180deg, transparent, rgba(244,214,140,.22), transparent)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -30,
      left: '28%',
      width: 2,
      height: 240,
      transform: 'rotate(26deg)',
      background: 'linear-gradient(180deg, transparent, rgba(244,214,140,.12), transparent)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      lineHeight: 1.02,
      fontWeight: 700,
      fontFamily: 'var(--serif)',
      background: 'linear-gradient(176deg,#FFF7E6 0%,#F2DCA8 46%,#D8B36A 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.35))'
    }
  }, d.tierName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#C9B58C',
      marginTop: 3
    }
  }, d.summary)), /*#__PURE__*/React.createElement(MBGem, {
    size: 64
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      marginTop: 9,
      padding: '0 2px'
    }
  }, ladder.map(function (item, i) {
    var isGem = item === 'gem';
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        position: 'relative',
        zIndex: 2
      }
    }, isGem ? /*#__PURE__*/React.createElement(MBGem, {
      size: 26,
      ring: true,
      glow: true
    }) : /*#__PURE__*/React.createElement(MBHex, {
      color: item,
      size: 20
    })), i < ladder.length - 1 && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 2,
        borderRadius: 2,
        margin: '0 1px',
        background: 'linear-gradient(90deg, rgba(224,192,131,.42), rgba(224,192,131,.22))'
      }
    }));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 0 9px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px 6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, "\u4E13\u5C5E\u4F1A\u5458\u6743\u76CA"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      fontSize: 11,
      color: 'var(--brand-strong)'
    }
  }, "\u5168\u90E8 ", d.perks.length, " \u9879", /*#__PURE__*/React.createElement(Icon, {
    name: "chevR",
    size: 11,
    color: "var(--brand-strong)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      gap: 9,
      padding: '1px 16px 2px'
    }
  }, d.perks.map(function (p) {
    return /*#__PURE__*/React.createElement("button", {
      key: p.title,
      onClick: function onClick() {
        return onPerk(p);
      },
      style: {
        flex: '0 0 auto',
        width: 118,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '9px 8px 9px',
        borderRadius: 12,
        background: 'var(--surface)',
        border: '1px solid color-mix(in srgb,var(--brand) 16%, transparent)',
        boxShadow: '0 1px 4px rgba(90,82,52,.05)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#F3EDD8,#E3D5AE)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: p.icon,
      size: 17,
      color: "#6E6147"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        fontWeight: 700,
        color: 'var(--text)',
        lineHeight: 1.2,
        whiteSpace: 'nowrap'
      }
    }, p.title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        color: 'var(--text-muted)',
        lineHeight: 1.15,
        whiteSpace: 'nowrap'
      }
    }, p.sub));
  })))));
}

/* ---------------- 5.13/5.14 高端 Banner ---------------- */
var BANNER_ICON = {
  seat: 'bed',
  board: 'plane',
  lounge: 'spark',
  service: 'bell',
  car: 'car',
  upgrade: 'plus',
  butler: 'user'
};
function PremiumService(_ref15) {
  var title = _ref15.title,
    data = _ref15.data,
    items = _ref15.items,
    bus = _ref15.bus;
  var _useState1 = useState(0),
    _useState10 = _slicedToArray(_useState1, 2),
    i = _useState10[0],
    setI = _useState10[1];
  var ref = useRef(null);
  var b = data.banners;
  function onScroll() {
    var el = ref.current;
    if (!el) return;
    setI(Math.max(0, Math.min(b.length - 1, Math.round(el.scrollLeft / (el.clientWidth || 1)))));
  }
  function go(idx) {
    var el = ref.current;
    if (!el) return;
    el.scrollTo({
      left: idx * el.clientWidth,
      behavior: 'smooth'
    });
  }
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-h1)',
        fontFamily: 'var(--font-title)'
      }
    }, title)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: onScroll,
    style: {
      display: 'flex',
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch'
    }
  }, b.map(function (x, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      style: {
        flex: '0 0 100%',
        scrollSnapAlign: 'start',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: x.img || x.title,
      src: x.src,
      photo: true,
      h: 118,
      r: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg,rgba(10,9,6,.88) 0%,rgba(10,9,6,.5) 52%,rgba(10,9,6,.1) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 20px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: 'rgba(201,162,75,.14)',
        border: '1px solid var(--brand)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: BANNER_ICON[x.icon] || 'spark',
      size: 14,
      color: "var(--brand)"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--brand)',
        letterSpacing: 1.5
      }
    }, "\u5C0A\u4EAB\u670D\u52A1 0", idx + 1)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 21,
        fontWeight: 600,
        fontFamily: 'var(--serif)',
        color: '#F6F1E6',
        textShadow: '0 2px 8px rgba(0,0,0,.4)'
      }
    }, x.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'rgba(246,241,230,.82)',
        marginTop: 5,
        maxWidth: '78%'
      }
    }, x.desc))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      display: 'flex',
      gap: 5
    }
  }, b.map(function (_, idx) {
    return /*#__PURE__*/React.createElement("button", {
      key: idx,
      onClick: function onClick() {
        return go(idx);
      },
      style: {
        padding: 0,
        width: i === idx ? 16 : 6,
        height: 6,
        borderRadius: 99,
        background: i === idx ? 'var(--brand)' : 'rgba(201,162,75,.4)',
        transition: 'width .3s, background .3s'
      }
    });
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 13px'
    }
  }, items.map(function (c, idx) {
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      onClick: function onClick() {
        return bus.toast("\u9884\u8BA2\u300C".concat(c.name || c.route, "\u300D"));
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderBottom: idx < items.length - 1 ? '1px solid var(--hairline)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'var(--serif)',
        color: 'var(--text)'
      }
    }, c.name || c.route), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, c.cabin ? c.cabin + ' · ' : '', c.perks.join(' / '))), /*#__PURE__*/React.createElement("div", {
      className: "price",
      style: {
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), c.price));
  })))));
}
function AirlinePremium(_ref16) {
  var bus = _ref16.bus;
  var d = window.DATA.airlinePremium;
  return /*#__PURE__*/React.createElement(PremiumService, {
    title: "\u822A\u53F8\u5C0A\u4EAB\u670D\u52A1",
    data: d,
    items: d.cabins,
    bus: bus
  });
}
function HotelPremium(_ref17) {
  var bus = _ref17.bus;
  var d = window.DATA.hotelPremium;
  return /*#__PURE__*/React.createElement(PremiumService, {
    title: "\u9152\u5E97\u5C0A\u4EAB\u670D\u52A1",
    data: d,
    items: d.hotels,
    bus: bus
  });
}
function TicketVIP(_ref18) {
  var bus = _ref18.bus;
  var d = window.DATA.ticketVIP;
  return /*#__PURE__*/React.createElement(FloorShell, {
    title: "\u95E8\u7968 VIP \u6743\u76CA"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: '11px 13px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 10
    }
  }, d.perks.map(function (p) {
    return /*#__PURE__*/React.createElement("span", {
      key: p,
      className: "tag",
      style: {
        fontSize: 12,
        padding: '3px 8px'
      }
    }, "\u2713 ", p);
  })), d.tickets.map(function (t, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: function onClick() {
        return bus.toast("\u9884\u8BA2\u300C".concat(t.name, "\u300D"));
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderTop: '1px solid var(--hairline)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "stub",
      size: 20,
      color: "var(--brand)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'var(--serif)',
        color: 'var(--text)'
      }
    }, t.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, t.perks.join(' / '))), /*#__PURE__*/React.createElement("div", {
      className: "price",
      style: {
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), t.price));
  }))));
}

/* ---------------- 旅行豆酒店 (solo·value 专属) ---------------- */
function CoinHotels(_ref19) {
  var props = _ref19.props,
    bus = _ref19.bus;
  var hotels = window.DATA.feeds.filter(function (f) {
    return f.line === 'hotel';
  }).slice(0, 5);
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 14px',
      borderRadius: 'var(--radius) var(--radius) 0 0',
      background: 'linear-gradient(118deg, #F0BE78 0%, #D98C4C 100%)',
      padding: '11px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 999,
      background: 'rgba(255,255,255,.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      color: '#fff',
      letterSpacing: -.5
    }
  }, "T")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      fontWeight: 900,
      color: '#fff'
    }
  }, "\u65C5\u884C\u8C46\u9152\u5E97\uFF1A"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      fontWeight: 900,
      color: '#FFF0A0'
    }
  }, "\u8D5A\u53D6 5% \u65C5\u884C\u8C46")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 999,
      background: 'rgba(255,255,255,.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: 21,
      fontWeight: 900,
      color: 'rgba(255,255,255,.8)',
      lineHeight: 1
    }
  }, "\u203A"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -18,
      top: -18,
      width: 88,
      height: 88,
      borderRadius: 999,
      background: 'rgba(255,255,255,.07)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 22,
      bottom: -30,
      width: 64,
      height: 64,
      borderRadius: 999,
      background: 'rgba(255,255,255,.05)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-2)',
      borderRadius: '0 0 var(--radius) var(--radius)',
      margin: '0 14px 2px',
      padding: '0 0 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      padding: '10px 14px 2px'
    }
  }, hotels.map(function (h, idx) {
    var coinAmt = Math.round(h.price * 0.05 * 10);
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "card",
      style: {
        width: 188,
        overflow: 'hidden',
        flexShrink: 0
      },
      onClick: function onClick() {
        return bus.toast("\u67E5\u770B\u300C".concat(h.title, "\u300D"));
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: h.img,
      photo: true,
      h: 112,
      r: 0
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 9px 10px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: 'var(--text)',
        lineHeight: 1.3,
        height: 30,
        overflow: 'hidden'
      }
    }, h.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
        margin: '4px 0 5px'
      }
    }, h.tags.slice(0, 2).map(function (t) {
      return /*#__PURE__*/React.createElement("span", {
        key: t,
        className: "tag"
      }, t);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "price",
      style: {
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), h.price), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        color: 'var(--price-color)',
        fontWeight: 700
      }
    }, h.score)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10.5,
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 14,
        height: 14,
        borderRadius: 999,
        background: '#F4BE2A',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 900,
        flexShrink: 0
      }
    }, "T"), /*#__PURE__*/React.createElement("span", null, "\u8D5A\u53D6"), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--coin-color)'
      }
    }, coinAmt), /*#__PURE__*/React.createElement("span", null, "Trip Coins"))));
  }))));
}

/* ---------------- 附近目的地推荐（展演/商务：周边短途，可左右滑动 + 点击展开详情） ---------------- */
// 交通工具 icon 与描述对应：飞行→飞机，车程/市内→汽车，其余（高铁/动车）→火车
function nearbyTransportIcon(time) {
  var t = String(time || '');
  if (/飞行|飞机|航班|乘机|空运/.test(t)) return 'plane';
  if (/车程|自驾|驾车|大巴|班车|巴士|打车|包车|市内|步行/.test(t)) return 'car';
  if (/船|渡轮|轮渡|游船/.test(t)) return 'car';
  return 'train';
}
function NearbyDest(_ref20) {
  var props = _ref20.props,
    bus = _ref20.bus,
    ctx = _ref20.ctx;
  var city = ctx && ctx.city || props.city || window.fallbackCity(ctx && ctx.identity);
  var list = window.buildNearbyDest(city);
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    sel = _useState12[0],
    setSel = _useState12[1];
  var rowRef = useRef(null);
  var sectionRef = useRef(null);
  var anchorRef = useRef(null); // 紧贴卡片行上方的非吸顶锚点，用于精确回到「卡片行」位置
  var cardRefs = useRef({});
  useEffect(function () {
    setSel(null);
  }, [city]);
  var selDest = list.find(function (d) {
    return d.city === sel;
  });
  var isFamily = (ctx && ctx.identity) === 'family';
  var DestDetail = window.DestDetail;
  function findScroller(el) {
    var n = el ? el.parentElement : null;
    while (n) {
      var oy = getComputedStyle(n).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight - n.clientHeight > 5) return n;
      n = n.parentElement;
    }
    return null;
  }
  function centerX(node) {
    var row = rowRef.current;
    if (!row || !node) return;
    var target = node.offsetLeft - (row.clientWidth - node.clientWidth) / 2;
    row.scrollTo({
      left: Math.max(0, target),
      behavior: 'smooth'
    });
  }
  // 把卡片行（锚点）滚到滚动区顶部；instant=true 用于收起时先锚定，杜绝详情卸载导致的闪动
  function rowToTop(instant) {
    var sc = findScroller(sectionRef.current),
      anchor = anchorRef.current;
    if (!sc || !anchor) return;
    var top = sc.scrollTop + (anchor.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 6;
    if (instant) {
      var prev = sc.style.scrollBehavior;
      sc.style.scrollBehavior = 'auto';
      sc.scrollTop = Math.max(0, top);
      sc.style.scrollBehavior = prev || '';
    } else {
      sc.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });
    }
  }
  function pick(c) {
    if (sel === c) {
      // 收起：先把视口锚定到卡片行（瞬时），再卸载详情 —— 视口锚点不动，无闪动
      rowToTop(true);
      setSel(null);
      return;
    }
    // 切换/展开：无论当前浏览到哪，都先回到顶部卡片行位置。
    // 用瞬时锚定（详情切换会重挂载、打断平滑滚动，故不用 smooth），锚点位置只取决于卡片行上方内容，可靠。
    setSel(c);
    rowToTop(true);
    requestAnimationFrame(function () {
      return centerX(cardRefs.current[c]);
    });
  }
  return /*#__PURE__*/React.createElement("section", {
    ref: sectionRef,
    className: "floor floor-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "floor-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "floor-title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "compass",
    size: 15,
    color: "var(--brand)"
  }), "\u9644\u8FD1\u76EE\u7684\u5730\u63A8\u8350")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px',
      marginTop: -2,
      marginBottom: 8,
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "\u4ECE ", city, " \u51FA\u53D1\uFF0C\u5468\u8FB9\u77ED\u9014\u70ED\u95E8\u76EE\u7684\u5730"), /*#__PURE__*/React.createElement("div", {
    ref: anchorRef,
    "aria-hidden": "true",
    style: {
      height: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: rowRef,
    className: "hscroll",
    style: sel ? {
      paddingTop: 2,
      paddingBottom: 8,
      gap: 10,
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'var(--bg)'
    } : {
      paddingTop: 2,
      paddingBottom: 8,
      gap: 10
    }
  }, list.map(function (d) {
    var on = d.city === sel;
    return /*#__PURE__*/React.createElement("button", {
      key: d.city,
      ref: function ref(el) {
        return cardRefs.current[d.city] = el;
      },
      onClick: function onClick() {
        return pick(d.city);
      },
      style: {
        flex: '0 0 auto',
        width: 214,
        padding: 0,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--surface)',
        textAlign: 'left',
        transition: 'transform .2s ease, box-shadow .2s ease',
        border: 'none',
        boxShadow: on ? '0 3px 10px rgba(0,0,0,.10)' : '0 0 0 1px rgba(26,24,33,.06)',
        transform: on ? 'translateY(-2px)' : 'none'
      }
    }, on && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        border: '2px solid var(--brand)',
        borderRadius: 'var(--radius)',
        pointerEvents: 'none',
        zIndex: 5,
        boxSizing: 'border-box'
      }
    }), /*#__PURE__*/React.createElement(Ph, {
      label: d.img,
      photo: true,
      h: 96,
      r: 0
    }, /*#__PURE__*/React.createElement(PeekCTA, {
      on: on
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '9px 11px 11px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 7,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        fontWeight: 800,
        color: 'var(--text)',
        flexShrink: 0
      }
    }, d.city), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 11.5,
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "thumb",
      size: 11,
      color: "var(--brand)"
    }), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--brand-strong)'
      }
    }, d.pct, "%"), " \u65C5\u5BA2\u9009\u62E9")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: nearbyTransportIcon(d.time),
      size: 12,
      color: "var(--brand)"
    }), /*#__PURE__*/React.createElement("span", null, "\u8DDD ", city, " ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text)'
      }
    }, d.time))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        color: 'var(--text-muted)',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "cal",
      size: 12,
      color: "var(--brand)"
    }), /*#__PURE__*/React.createElement("span", null, "\u5EFA\u8BAE\u73A9 ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text)'
      }
    }, d.days))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        lineHeight: 1.5,
        color: 'var(--text)',
        textWrap: 'pretty',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, d.reason)));
  })), selDest && DestDetail && /*#__PURE__*/React.createElement(DestDetail, {
    key: selDest.city,
    dest: selDest,
    isFamily: isFamily,
    identity: ctx && ctx.identity || 'solo',
    tier: ctx && ctx.tier,
    showReason: false,
    bus: bus
  }));
}

/* ---------------- 外投广告中插（站外广告内容还原，保证体验一致） ---------------- */
function AdLanding(_ref21) {
  var props = _ref21.props,
    bus = _ref21.bus,
    ctx = _ref21.ctx;
  var kind = props.ad && props.ad.kind || 'coupon';
  var tier = ctx && ctx.tier || 'value';
  var onBrand = tier === 'premium' ? '#1A1505' : 'var(--on-brand,#fff)';
  var body;
  if (kind === 'coupon') {
    var amount = tier === 'premium' ? 1500 : 500;
    var threshold = tier === 'premium' ? 8000 : 3000;
    var scope = tier === 'premium' ? '国际机票 · 商务舱' : '高奢酒店通用';
    body = /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--surface)',
        border: '1.5px solid var(--hairline)',
        boxShadow: '0 2px 8px rgba(0,0,0,.06)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 92px',
        alignSelf: 'stretch',
        background: 'var(--coupon-grad,var(--brand-grad,var(--brand)))',
        color: onBrand,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '9px 6px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 25,
        fontWeight: 900,
        lineHeight: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, "\xA5"), amount), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        marginTop: 3,
        opacity: .92
      }
    }, "\u6EE1", threshold, "\u53EF\u7528")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '8px 10px',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, scope, "\u5927\u989D\u5238"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "\u9650\u65F6\u9886\u53D6 \xB7 \u6709\u6548\u671F 7 \u5929")), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: function onClick() {
        return bus.toast('已领取广告同款大额券');
      },
      style: {
        marginRight: 10,
        padding: '7px 16px',
        fontSize: 13,
        flexShrink: 0
      }
    }, "\u9886\u53D6"));
  } else {
    var it = (window.DATA.flash[kind] || window.DATA.flash.hotel)[0];
    var CAT = {
      hotel: '酒店',
      flight: '机票',
      ticket: '门票'
    }[kind] || '好物';
    var title = it.title;
    if (kind === 'flight') {
      // 出发城市与 Feeds / 秒杀机票统一为 defaultDepartCity(当前目的地)
      var destCity = ctx && ctx.city || window.fallbackCity(ctx && ctx.identity);
      var dep = window.defaultDepartCity(destCity);
      title = "".concat(dep, " \u2192 ").concat(destCity);
    }
    body = /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        display: 'flex',
        alignItems: 'stretch',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1.5px solid var(--hairline)',
        boxShadow: '0 2px 8px rgba(0,0,0,.06)'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: it.img,
      photo: true,
      w: 90,
      h: 90,
      r: 0,
      style: {
        flexShrink: 0,
        alignSelf: 'stretch'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        padding: '9px 10px',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--text)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: 'var(--brand-strong)',
        background: 'var(--brand-soft)',
        padding: '0.5px 5px',
        borderRadius: 4,
        lineHeight: 1.3
      }
    }, it.discount), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "price",
      style: {
        fontSize: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), it.price), /*#__PURE__*/React.createElement("span", {
      className: "price-origin"
    }, "\xA5", it.origin))), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: function onClick() {
        return bus.toast("\u5DF2\u52A0\u5165\u300C".concat(title, "\u300D\u62A2\u8D2D"));
      },
      style: {
        padding: '6px 14px',
        fontSize: 12.5,
        flexShrink: 0
      }
    }, "\u7ACB\u5373\u62A2"))));
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter",
    style: {
      padding: '0 14px',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      overflow: 'hidden',
      border: '1.5px solid color-mix(in srgb,var(--brand) 48%, transparent)',
      boxShadow: '0 12px 30px color-mix(in srgb,var(--brand-strong) 22%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '9px 12px',
      background: 'var(--brand-grad,var(--brand))',
      color: onBrand
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bolt",
    size: 15,
    color: onBrand,
    fill: onBrand
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      flex: 1,
      letterSpacing: '.2px'
    }
  }, kind === 'coupon' ? '为你保留 · 专属优惠' : '你刚刚浏览过')), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 11px',
      background: 'linear-gradient(180deg, color-mix(in srgb,var(--brand-soft) 72%, #fff 28%), var(--surface) 84%)',
      overflow: 'hidden'
    }
  }, body)));
}
Object.assign(window, {
  CityHero: CityHero,
  AIEntry: AIEntry,
  Ranking: Ranking,
  Posts: Posts,
  TripCard: TripCard,
  TripPlan: TripPlan,
  FamilyProfile: FamilyProfile,
  BizTravel: BizTravel,
  EventBundle: EventBundle,
  MemberBenefits: MemberBenefits,
  AirlinePremium: AirlinePremium,
  HotelPremium: HotelPremium,
  TicketVIP: TicketVIP,
  CoinHotels: CoinHotels,
  NearbyDest: NearbyDest,
  AdLanding: AdLanding,
  MBGem: MBGem,
  MBHex: MBHex,
  GemDiamond: GemDiamond
});

/* 0eb6d90b-72d3-44d8-8bd0-2584de6f37f7.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* ============================================================
   OTA Demo — 模块 C
   DestRec：单目的地推荐（探索目的地 tab）
   SceneGuide：目的地灵感（主题 → 目的地分组 → 复用单目的地推荐详情）
   DestDetail：选中目的地后的共享详情（推荐理由 + 4 个上图下文横滑模块）
   ============================================================ */
var _React = React,
  useState = _React.useState,
  useRef = _React.useRef;
var DEST_SECTIONS = [{
  key: 'spots',
  title: '必访景点',
  icon: 'pin'
}, {
  key: 'stays',
  title: '热门住宿区域',
  icon: 'bed'
}, {
  key: 'foods',
  title: '人气美食',
  icon: 'heart'
}, {
  key: 'guides',
  title: '旅游攻略',
  icon: 'book'
}];

// 主题封面：按主题语义匹配 4K 高清实拍图（随消费档自动切到尊贵图集）
var THEME_IMG_KW = {
  kids: '亲子海滩沙滩',
  parks: '迪士尼乐园城堡',
  nature: '雨林森林植物园',
  fun: '海岛度假村',
  food: '美食餐厅',
  culture: '故宫古城人文',
  business: '都市江景商务',
  luxury: '马代私岛无边泳池',
  snow: '雪山滑雪粉雪',
  show: '演唱会展演'
};
function themeCoverImg(key, kw) {
  return window.IMG(THEME_IMG_KW[key] || kw || key, {
    tier: window.__tier,
    w: 1100
  });
}
// 目的地详情分组配图：优先用数据里已策展的 img 关键词，并按分组补语义 hint，确保图文匹配
function destCatImg(key, seed) {
  var s = String(seed || '');
  var q = s;
  if (key === 'stays' && !/酒店|度假|海景|江景|湾|岛|温泉|别墅|庄/.test(s)) q = s + ' 酒店';else if (key === 'foods' && !/面|饭|烤|锅|寿司|饺|包|鸡|鱼|汤|茶|蛋|甜|食|菜|挞|奶|粉|煎/.test(s)) q = s + ' 美食';else if (key === 'spots' && !/海|山|湖|岛|寺|庙|城|园|塔|乐园|馆|林|谷|滩|桥|宫|楼|街/.test(s)) q = s + ' 景点';
  return window.IMG(q, {
    tier: window.__tier,
    w: 900
  });
}

// 找到可滚动的父容器（频道滚动区）
function destScrollerOf(el) {
  var n = el ? el.parentElement : null;
  while (n) {
    var oy = getComputedStyle(n).overflowY;
    if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight - n.clientHeight > 5) return n;
    n = n.parentElement;
  }
  return null;
}
// 横向把某卡片滑到视觉中心
function destCenterX(row, node) {
  if (node && row) {
    var target = node.offsetLeft - (row.clientWidth - node.clientWidth) / 2;
    row.scrollTo({
      left: Math.max(0, target),
      behavior: 'smooth'
    });
  }
}

/* 补齐到 4 张卡（结合城市生成占位条目；池子扩充 + 按城市 hash 打散，避免各城雷同） */
function padSection(items, key, city) {
  items = items ? items.slice() : [];
  var T = {
    spots: [{
      name: "".concat(city, "\u57CE\u5E02\u89C2\u666F\u53F0"),
      tag: '打卡',
      r: '登高俯瞰城市天际线，日落尤其美'
    }, {
      name: "".concat(city, "\u8001\u57CE\u6F2B\u6B65\u533A"),
      tag: '慢游',
      r: '街巷小店林立，适合悠闲压马路'
    }, {
      name: "".concat(city, "\u6EE8\u6C34\u516C\u56ED"),
      tag: '遛娃',
      r: '开阔草坪与步道，亲子放电好去处'
    }, {
      name: "".concat(city, "\u4EBA\u6587\u535A\u7269\u9986"),
      tag: '研学',
      r: '室内场馆，雨天也能逛得尽兴'
    }, {
      name: "".concat(city, "\u827A\u672F\u8857\u533A"),
      tag: '拍照',
      r: '潮流涂鸦与小店，随手出片'
    }, {
      name: "".concat(city, "\u5730\u6807\u89C2\u666F\u5854"),
      tag: '夜景',
      r: '俯瞰全城灯火，夜景尤其惊艳'
    }, {
      name: "".concat(city, "\u8FD1\u90CA\u7EFF\u9053"),
      tag: '骑行',
      r: '沿途风景开阔，骑行慢游正好'
    }, {
      name: "".concat(city, "\u591C\u6E38\u7801\u5934"),
      tag: '夜游',
      r: '登船夜游，两岸灯火尽收眼底'
    }],
    foods: [{
      name: "".concat(city, "\u62DB\u724C\u5C0F\u5403\u8857"),
      tag: '必吃',
      r: '本地人气摊档集中，一站吃个够'
    }, {
      name: "".concat(city, "\u7279\u8272\u6D77\u9C9C"),
      tag: '尝鲜',
      r: '当日鲜货现做，肉质弹嫩'
    }, {
      name: "".concat(city, "\u4EBA\u6C14\u751C\u54C1"),
      tag: '孩子爱',
      r: '清爽消暑，逛累来一份续命'
    }, {
      name: "".concat(city, "\u591C\u5E02\u5927\u6392\u6863"),
      tag: '烟火气',
      r: '入夜更热闹，性价比拉满'
    }, {
      name: "".concat(city, "\u8001\u5B57\u53F7\u9762\u9986"),
      tag: '本地',
      r: '街坊几十年的味道，一碗见真章'
    }, {
      name: "".concat(city, "\u878D\u5408\u6599\u7406"),
      tag: '网红',
      r: '中西混搭新意足，出片又好吃'
    }, {
      name: "".concat(city, "\u5730\u9053\u6C64\u9505"),
      tag: '暖身',
      r: '慢炖好汤底，全家都合口'
    }, {
      name: "".concat(city, "\u624B\u4F5C\u8336\u996E"),
      tag: '解腻',
      r: '现泡现做，逛累来一杯'
    }],
    guides: [{
      title: "".concat(city, "\u7ECF\u51783\u5929\u8DEF\u7EBF"),
      meta: '热门攻略',
      r: '景点连线顺路不折返，照着走就行'
    }, {
      title: "".concat(city, "\u4EB2\u5B50\u7701\u529B\u653B\u7565"),
      meta: '高收藏',
      r: '母婴设施 + 错峰时段全标好'
    }, {
      title: "".concat(city, "\u7F8E\u98DF\u5730\u56FE"),
      meta: '本地推荐',
      r: '按区域整理，边逛边吃不踩雷'
    }, {
      title: "".concat(city, "\u4EA4\u901A\u4F4F\u5BBF\u8D34\u58EB"),
      meta: '实用',
      r: '机场到市区 + 选区指南一篇搞定'
    }, {
      title: "".concat(city, "\u5C0F\u4F17\u73A9\u6CD5\u6E05\u5355"),
      meta: '收藏多',
      r: '避开人潮的隐藏玩法合集'
    }, {
      title: "".concat(city, "\u5468\u672B2\u65E5\u901F\u6E38"),
      meta: '省时',
      r: '时间紧也能玩出精华'
    }, {
      title: "".concat(city, "\u96E8\u5929\u5907\u9009\u65B9\u6848"),
      meta: '实用',
      r: '室内场馆与玩法一篇搞定'
    }, {
      title: "".concat(city, "\u62CD\u7167\u673A\u4F4D\u5408\u96C6"),
      meta: '出片',
      r: '热门机位与时段全标好'
    }]
  };
  var pool = T[key] || [];
  var h = 0;
  var s = String(city);
  for (var i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
  var start = pool.length ? h % pool.length : 0;
  var pi = 0;
  var _loop = function _loop() {
    var cand = pool[(start + pi) % pool.length];
    pi++;
    var idk = cand.name || cand.title;
    if (!items.some(function (x) {
      return (x.name || x.title) === idk;
    })) items.push(cand);
  };
  while (items.length < 4 && pi < pool.length) {
    _loop();
  }
  return items.slice(0, 4);
}

/* 住宿区域推荐理由：结合身份 + 主题 + 目的地 + 区域 */
function areaReason(city, area, identity, themeTitle) {
  var who = {
    family: '亲子家庭',
    solo: '一个人',
    biz: '因公出差',
    event: '看演出的旅客'
  }[identity] || '旅客';
  var t = themeTitle ? "\u4E3B\u6253\u300C".concat(themeTitle, "\u300D") : '';
  return "".concat(who, "\u6765").concat(city).concat(t, "\uFF0C\u4F4F").concat(area.name, "\u6700\u5408\u9002\u2014\u2014").concat(area.r || '位置便利、配套成熟，去哪都顺路', "\u3002");
}

/* 住宿区域分组至少 2 个（不足时用通用区域补齐） */
function padAreas(stays, city) {
  var base = stays && stays.length ? stays.slice() : [];
  var pool = [{
    name: '市中心',
    tag: '便利',
    r: '交通枢纽、配套成熟，去哪都顺路'
  }, {
    name: '景区周边',
    tag: '近景点',
    r: '抬脚就到核心景点，省去通勤奔波'
  }, {
    name: '老城商圈',
    tag: '好逛',
    r: '美食小店云集，夜生活丰富热闹'
  }, {
    name: '滨水度假区',
    tag: '度假感',
    r: '环境静谧、风景好，适合慢下来'
  }, {
    name: '交通枢纽区',
    tag: '好出行',
    r: '车站机场可直达，赶行程最省心'
  }, {
    name: '高人气住宿带',
    tag: '口碑好',
    r: '回头客集中，配套与服务都靠谱'
  }];
  var h = 0;
  var s = String(city);
  for (var i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
  var pi = 0;
  var _loop2 = function _loop2() {
    var cand = pool[(h + pi) % pool.length];
    pi++;
    if (!base.some(function (a) {
      return a.name === cand.name;
    })) base.push(cand);
  };
  while (base.length < 2 && pi < pool.length) {
    _loop2();
  }
  return base;
}

/* ---------- 共享：选中目的地后的详情 ---------- */
function DestDetail(_ref) {
  var dest = _ref.dest,
    isFamily = _ref.isFamily,
    identity = _ref.identity,
    tier = _ref.tier,
    themeTitle = _ref.themeTitle,
    themeReason = _ref.themeReason,
    bus = _ref.bus,
    _ref$showReason = _ref.showReason,
    showReason = _ref$showReason === void 0 ? true : _ref$showReason;
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    selArea = _useState2[0],
    setSelArea = _useState2[1];
  if (!dest) return null;
  var hotelPool = window.buildFeedCards ? window.buildFeedCards(dest.city, 'hotel', tier) : [];
  return /*#__PURE__*/React.createElement("div", {
    className: "floor-enter",
    style: {
      padding: '0 14px',
      marginTop: 10
    }
  }, showReason && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 12,
      background: 'var(--brand-soft)',
      boxShadow: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 14,
    color: "var(--brand)",
    fill: "var(--brand)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      color: 'var(--brand-strong)'
    }
  }, isFamily ? "\u4E3A\u4EC0\u4E48".concat(dest.city, "\u9002\u5408\u4F60\u7684\u5BB6\u5EAD") : "\u4E3A\u4EC0\u4E48\u63A8\u8350".concat(dest.city))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      color: 'var(--text)'
    }
  }, themeReason ? themeReason : isFamily ? dest.reasonFamily || dest.reason : dest.reason)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, DEST_SECTIONS.map(function (s) {
    var SectionHead = /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 0 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 8,
        background: 'var(--brand-soft)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 14,
      color: "var(--brand)"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 14.5,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, s.title));

    /* 热门住宿区域：区域分组 tab → xx%旅客选择 + 理由 → 酒店商品卡横滑 */
    if (s.key === 'stays') {
      var areas = padAreas(dest.stays, dest.city);
      var ai = Math.min(selArea, areas.length - 1);
      var area = areas[ai];
      var h = (area.name + dest.city).split('').reduce(function (a, c) {
        return a + c.charCodeAt(0);
      }, 0);
      var pct = 30 + h % 23;
      // 切换区域分组 → 酒店卡片跟着切换：按区域名 hash 取不同的酒店窗口
      var off = hotelPool.length ? h % hotelPool.length : 0;
      var hotels = hotelPool.length ? hotelPool.slice(off).concat(hotelPool).slice(0, 4) : [];
      var HOTEL_REASON = ['步行可达地铁，去哪都顺', '含双早，性价比高', '亲子设施齐全，遛娃省心', '近景区与商圈，吃住都方便', '高层景观房，视野开阔', '口碑好评，回头客多'];
      return /*#__PURE__*/React.createElement("div", {
        key: s.key
      }, SectionHead, /*#__PURE__*/React.createElement("div", {
        className: "hscroll",
        style: {
          margin: '0 -14px',
          padding: '1px 14px 9px',
          gap: 7
        }
      }, areas.map(function (a, idx) {
        var on = idx === ai;
        return /*#__PURE__*/React.createElement("button", {
          key: idx,
          onClick: function onClick() {
            return setSelArea(idx);
          },
          style: {
            flex: '0 0 auto',
            padding: '6px 13px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: on ? 800 : 600,
            background: on ? 'var(--brand)' : 'var(--surface-2)',
            color: on ? 'var(--on-brand,#fff)' : 'var(--text-muted)',
            border: on ? 'none' : '1px solid var(--hairline)',
            transition: 'all .15s ease',
            whiteSpace: 'nowrap'
          }
        }, a.name);
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 13,
          fontWeight: 800,
          color: 'var(--brand-strong)',
          marginBottom: 4
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "family",
        size: 13,
        color: "var(--brand)"
      }), pct, "% \u65C5\u5BA2\u9009\u62E9\u4F4F\u8FD9\u91CC"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12.5,
          lineHeight: 1.6,
          color: 'var(--text-muted)',
          textWrap: 'pretty'
        }
      }, areaReason(dest.city, area, identity, themeTitle))), /*#__PURE__*/React.createElement("div", {
        className: "hscroll",
        style: {
          margin: '0 -14px',
          padding: '1px 14px 3px',
          gap: 10,
          alignItems: 'stretch'
        }
      }, hotels.map(function (ht, hi) {
        var hh = (ht.title + area.name).split('').reduce(function (a, c) {
          return a + c.charCodeAt(0);
        }, 0);
        var rc = 2200 + hh * 53 % 46000;
        var reviews = rc >= 10000 ? (rc / 10000).toFixed(1) + '万条评价' : rc.toLocaleString() + '条评价';
        var reason = HOTEL_REASON[hh % HOTEL_REASON.length];
        return /*#__PURE__*/React.createElement("div", {
          key: hi,
          className: "card",
          onClick: function onClick() {
            return bus.toast("\u67E5\u770B\u300C".concat(ht.title, "\u300D"));
          },
          style: {
            flex: '0 0 158px',
            width: 158,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }, /*#__PURE__*/React.createElement(Ph, {
          label: ht.img,
          photo: true,
          h: 92,
          r: 0
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '7px 9px 9px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }, ht.title), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'baseline',
            gap: 5,
            marginTop: 5
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 12.5,
            fontWeight: 800,
            color: 'var(--text)'
          }
        }, Number(ht.score).toFixed(1), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-muted)'
          }
        }, " / 5")), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10.5,
            color: 'var(--text-muted)'
          }
        }, reviews)), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: 'var(--brand-strong)',
            fontWeight: 600,
            marginTop: 4,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textWrap: 'pretty'
          }
        }, reason), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 'auto',
            paddingTop: 6
          }
        }, /*#__PURE__*/React.createElement(PriceBlock, {
          price: ht.price,
          seed: ht.title + area.name,
          rate: 0.72,
          size: 15,
          side: "right",
          colAlign: "center"
        }))));
      })));
    }

    /* 必访景点 / 人气美食 / 旅游攻略：补齐 4 张，收窄底部留白 */
    var items = padSection(dest[s.key], s.key, dest.city);

    /* 必访景点：名称 → 评分 + 评价数（并排）→ 右下角卖价「xxx起」，不展示划线价 */
    if (s.key === 'spots') {
      return /*#__PURE__*/React.createElement("div", {
        key: s.key
      }, SectionHead, /*#__PURE__*/React.createElement("div", {
        className: "hscroll",
        style: {
          margin: '0 -14px',
          padding: '1px 14px 3px',
          gap: 10,
          alignItems: 'stretch'
        }
      }, items.map(function (it, i) {
        var hh = (it.name || '').split('').reduce(function (a, c) {
          return a + c.charCodeAt(0);
        }, 0);
        var score = (4.3 + hh % 7 / 10).toFixed(1);
        var rc = 1600 + hh * 37 % 42000;
        var reviews = rc >= 10000 ? (rc / 10000).toFixed(1) + '万条评价' : rc.toLocaleString() + '条评价';
        var price = 40 + hh * 17 % 360;
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          className: "card",
          onClick: function onClick() {
            return bus.toast("\u67E5\u770B\u300C".concat(it.name, "\u300D"));
          },
          style: {
            flex: '0 0 150px',
            width: 150,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }, /*#__PURE__*/React.createElement(Ph, {
          src: destCatImg('spots', it.img || it.name),
          label: it.name,
          h: 92,
          r: 0
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '7px 9px 9px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13.5,
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }, it.name), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            marginTop: 5
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 12.5,
            fontWeight: 800,
            color: 'var(--text)'
          }
        }, score, /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-muted)'
          }
        }, " / 5")), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 10.5,
            color: 'var(--text-muted)'
          }
        }, reviews)), it.r && /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: 'var(--brand-strong)',
            marginTop: 4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.35,
            fontWeight: 600,
            textWrap: 'pretty'
          }
        }, it.r), /*#__PURE__*/React.createElement("div", {
          style: {
            marginTop: 'auto',
            paddingTop: 7
          }
        }, /*#__PURE__*/React.createElement(PriceBlock, {
          price: price,
          seed: it.name,
          rate: 0.67,
          size: 15,
          side: "right",
          colAlign: "center"
        }))));
      })));
    }

    /* 人气美食：在原标签基础上多展示一个标签 */
    return /*#__PURE__*/React.createElement("div", {
      key: s.key
    }, SectionHead, /*#__PURE__*/React.createElement("div", {
      className: "hscroll",
      style: {
        margin: '0 -14px',
        padding: '1px 14px 3px',
        gap: 10,
        alignItems: 'stretch'
      }
    }, items.map(function (it, i) {
      var isFoods = s.key === 'foods';
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: "card",
        onClick: function onClick() {
          return bus.toast("\u67E5\u770B\u300C".concat(it.name || it.title, "\u300D"));
        },
        style: {
          flex: '0 0 144px',
          width: 144,
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement(Ph, {
        src: destCatImg(s.key, it.img || it.name || it.title),
        label: it.name || it.title,
        h: 92,
        r: 0
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '7px 9px 8px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, it.name || it.title), !isFoods && (it.tag || it.meta) && /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          marginTop: 5,
          flexWrap: 'wrap'
        }
      }, it.tag && /*#__PURE__*/React.createElement("span", {
        className: "tag"
      }, it.tag), it.meta && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: 'var(--brand)',
          fontWeight: 700
        }
      }, it.meta)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          color: isFoods ? 'var(--brand-strong)' : 'var(--text-muted)',
          fontWeight: isFoods ? 600 : 400,
          marginTop: 5,
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }
      }, it.r || '')));
    })));
  })));
}

/* ---------- 单目的地推荐 ---------- */
function DestRec(_ref2) {
  var props = _ref2.props,
    bus = _ref2.bus,
    ctx = _ref2.ctx;
  var isFamily = ctx.identity === 'family';
  var cfg = window.DATA.destRec;
  var head = isFamily ? cfg.head.family : cfg.head["default"];
  var list = cfg.list;
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    sel = _useState4[0],
    setSel = _useState4[1];
  var rowRef = useRef(null);
  var sectionRef = useRef(null);
  var cardRefs = useRef({});
  var selDest = list.find(function (d) {
    return d.city === sel;
  });
  function pick(city) {
    if (sel === city) {
      // 收起：先瞬时把视口锚定到本楼层顶部，再卸载详情 —— 锚点不动，杜绝详情卸载造成的闪动
      var sec = sectionRef.current,
        sc = destScrollerOf(sec);
      if (sec && sc) {
        var prev = sc.style.scrollBehavior;
        sc.style.scrollBehavior = 'auto';
        var top = sc.scrollTop + (sec.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 8;
        sc.scrollTop = Math.max(0, top);
        sc.style.scrollBehavior = prev || '';
      }
      setSel(null);
      return;
    }
    setSel(city);
    requestAnimationFrame(function () {
      return destCenterX(rowRef.current, cardRefs.current[city]);
    });
  }
  return /*#__PURE__*/React.createElement("section", {
    ref: sectionRef,
    className: "floor floor-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "floor-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "floor-title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "compass",
    size: 15,
    color: "var(--brand)"
  }), head.title)), /*#__PURE__*/React.createElement("div", {
    ref: rowRef,
    className: "hscroll",
    style: sel ? {
      paddingTop: 7,
      paddingBottom: 8,
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'var(--bg)'
    } : {
      paddingTop: 2
    }
  }, list.map(function (d) {
    var on = d.city === sel;
    return /*#__PURE__*/React.createElement("button", {
      key: d.city,
      ref: function ref(el) {
        return cardRefs.current[d.city] = el;
      },
      onClick: function onClick() {
        return pick(d.city);
      },
      style: {
        flex: '0 0 auto',
        width: 168,
        padding: 0,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--surface)',
        transition: 'transform .2s ease, box-shadow .2s ease',
        border: 'none',
        outline: '2px solid transparent',
        outlineOffset: '-2px',
        boxShadow: on ? '0 0 0 2px var(--brand)' : '0 0 0 1px rgba(26,24,33,.06)',
        transform: on ? 'translateY(-2px)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: d.img,
      photo: true,
      h: 84,
      r: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg,transparent 34%,rgba(0,0,0,.7))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '7px 9px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#fff',
        fontSize: 15.5,
        fontWeight: 800,
        lineHeight: 1.1
      }
    }, d.city), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'rgba(255,255,255,.9)',
        fontSize: 11,
        marginTop: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, isFamily ? d.theme : d.themeSolo || d.theme))), /*#__PURE__*/React.createElement(PeekCTA, {
      on: on
    }));
  })), selDest && /*#__PURE__*/React.createElement(DestDetail, {
    key: selDest.city,
    dest: selDest,
    isFamily: isFamily,
    identity: ctx.identity,
    tier: ctx.tier,
    bus: bus
  }));
}

/* ---------- 发现低价目的地（探索目的地 tab，仅个人/亲子） ---------- */
var LOW_PRICE_DEST_COPY = {
  value: {
    solo: {
      tag: 'AI低价雷达',
      sub: 'AI已根据降幅、余量和近30日均价锁定目的地，优先露出机票+酒店同降的低价窗口。',
      mode: '限时低价',
      cta: '抢购'
    },
    family: {
      tag: '亲子省心低价',
      sub: 'AI优先筛选航班价格回落、亲子酒店有余量的目的地，帮你把带娃短途成本先压下来。',
      mode: '亲子特惠',
      cta: '抢购'
    }
  },
  premium: {
    solo: {
      tag: '尊享低价',
      sub: 'AI优先筛选舒适航班与高星酒店同时进入礼遇价窗口的目的地，质感不降级。',
      mode: '礼遇价',
      cta: '抢购'
    },
    family: {
      tag: '家庭尊享低价',
      sub: 'AI把舒适航班、亲子房和儿童权益一起比价，优先露出近期可抢的家庭礼遇价。',
      mode: '家庭礼遇',
      cta: '抢购'
    }
  }
};
var LOW_PRICE_DESTS = {
  value: {
    solo: [{
      city: '厦门',
      theme: '躺平不累的海岛之旅',
      img: '厦门 海边 文艺',
      badge: '周末低价窗',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 699,
          origin: 1320,
          discount: '直降47%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 268,
          origin: 480,
          discount: '5.6折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 79,
          origin: 128,
          discount: '6.2折'
        }
      },
      reasonFlightHotel: 'AI捕捉到周末低价窗口：直飞比近30日高点低47%，环岛路酒店同步回落；晚去早回仍有余量，现在抢比临近出发更稳。',
      reasonHotelTicket: '环岛路酒店周中低至5.6折，鼓浪屿/海底世界票价低于景区门口价，适合到店后轻松加玩法。'
    }, {
      city: '重庆',
      theme: '夜景火锅的周末低价局',
      img: '重庆 夜景 火锅',
      badge: '夜航直降',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 599,
          origin: 1120,
          discount: '直降46%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 229,
          origin: 430,
          discount: '5.3折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 68,
          origin: 118,
          discount: '5.8折'
        }
      },
      reasonFlightHotel: '夜航价格突然下探，直飞较高点直降46%；解放碑酒店低价房集中释放，住在核心区，火锅夜景少打车，整体更省。',
      reasonHotelTicket: '核心商圈酒店低至¥229，长江索道/两江夜游套票低于周末均价，行程中临时加购也划算。'
    }, {
      city: '澳门',
      theme: '轻松过关的微度假',
      img: '澳门 度假村 夜景',
      badge: '跨境闪降',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 799,
          origin: 1490,
          discount: '直降46%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 499,
          origin: 890,
          discount: '5.6折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 178,
          origin: 280,
          discount: '6.4折'
        }
      },
      reasonFlightHotel: '跨境航线进入闪降段，机票较近30日高点低46%；周中度假村酒店同步降价，老城和美食动线短，短假低价可抢。',
      reasonHotelTicket: '度假村酒店低至5.6折，塔景/演艺体验票有余量，适合抵达后按天气灵活抢购。'
    }, {
      city: '西双版纳',
      theme: '热带夜市短假',
      img: '版纳 雨林 夜市',
      badge: '短假抄底',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 899,
          origin: 1580,
          discount: '直降43%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 318,
          origin: 620,
          discount: '5.1折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 128,
          origin: 220,
          discount: '5.8折'
        }
      },
      reasonFlightHotel: 'AI发现短假抄底价：直飞降幅43%，告庄酒店低价库存集中；雨林+夜市玩法密度高，一个人出行也能把预算压住。',
      reasonHotelTicket: '告庄酒店低至¥318，植物园/野象谷门票低于近7日均价，行程中加一天雨林玩法正合适。'
    }],
    family: [{
      city: '珠海',
      theme: '乐园+海边的一站式遛娃',
      img: '珠海 海洋 乐园 亲子',
      badge: '亲子票酒省',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 499,
          origin: 980,
          discount: '直降49%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 399,
          origin: 760,
          discount: '5.3折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 268,
          origin: 450,
          discount: '6.0折'
        }
      },
      reasonFlightHotel: '亲子低价信号很强：直飞较近30日高点直降49%，亲子酒店周末仍有低价房；乐园+海边一站式，带娃少折腾。',
      reasonHotelTicket: '亲子房低至5.3折，海洋王国门票低于周末均价，酒店+门票一起抢比临时买更稳。'
    }, {
      city: '厦门',
      theme: '第一次带娃看海',
      img: '厦门 海滩 亲子',
      badge: '带娃低价窗',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 629,
          origin: 1180,
          discount: '直降47%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 329,
          origin: 620,
          discount: '5.3折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 88,
          origin: 150,
          discount: '5.9折'
        }
      },
      reasonFlightHotel: '机酒同降适合提前锁：直飞降幅47%，亲子友好酒店周中低价集中；沙滩、海底世界、老城距离近，推车党更省心。',
      reasonHotelTicket: '亲子酒店低至¥329，海底世界/鼓浪屿组合票较门市价更低，行程前锁票更省排队时间。'
    }, {
      city: '成都',
      theme: '熊猫+美食轻松遛娃',
      img: '成都 熊猫 亲子',
      badge: '早场省心价',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 559,
          origin: 1050,
          discount: '直降47%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 299,
          origin: 560,
          discount: '5.3折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 52,
          origin: 88,
          discount: '5.9折'
        }
      },
      reasonFlightHotel: 'AI识别到熊猫早场低价组合：直飞降幅47%，春熙路亲子酒店价格回落；住核心区少转场，省钱也省体力。',
      reasonHotelTicket: '市中心酒店低至5.3折，熊猫基地门票低于高峰均价，适合行程前提前锁早场。'
    }, {
      city: '冲绳',
      theme: '推车友好的海岛亲子游',
      img: '冲绳 海景 亲子',
      badge: '海岛亲子降',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 1199,
          origin: 2100,
          discount: '直降43%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 699,
          origin: 1180,
          discount: '5.9折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 118,
          origin: 198,
          discount: '6.0折'
        }
      },
      reasonFlightHotel: '含行李直飞出现海岛亲子降价，较高点低43%；海景亲子酒店有低价窗口，水族馆+浅海湾动线轻，适合先抢机酒。',
      reasonHotelTicket: '海景亲子酒店低至¥699，水族馆/亲子体验票有折扣，适合行程中按宝宝状态灵活加购。'
    }]
  },
  premium: {
    solo: [{
      city: '香港',
      theme: '维港质感周末礼遇',
      img: '香港 维港 高端 酒店',
      badge: '维港礼遇价',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 1280,
          origin: 2400,
          discount: '直降47%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 1680,
          origin: 2800,
          discount: '6.0折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 318,
          origin: 520,
          discount: '6.1折'
        }
      },
      reasonFlightHotel: '维港礼遇价刚释放：优选直飞较高点低47%，景观房低于近30日均价；航班时间舒适，适合高质量短住。',
      reasonHotelTicket: '维港高星酒店低至6.0折，观景/文化体验票有礼遇价，品质不降级，行程中加购更从容。'
    }, {
      city: '东京',
      theme: '银座美食与城市漫游',
      img: '东京 银座 高端 餐厅',
      badge: '银座低价窗',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 1980,
          origin: 3600,
          discount: '直降45%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 2280,
          origin: 3900,
          discount: '5.8折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 420,
          origin: 680,
          discount: '6.2折'
        }
      },
      reasonFlightHotel: '银座低价窗口可抢：优选航班降幅45%，高星酒店低于近30日均价；购物、美食、展馆动线集中，质感不降级。',
      reasonHotelTicket: '高星酒店低至5.8折，TeamLab/展馆票有余量，适合到达后按天气安排室内体验。'
    }, {
      city: '普吉',
      theme: '海岛私享躺平假期',
      img: '普吉 私岛 无边泳池',
      badge: '私享闪惠',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 1680,
          origin: 3000,
          discount: '直降44%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 2480,
          origin: 4200,
          discount: '5.9折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 520,
          origin: 880,
          discount: '5.9折'
        }
      },
      reasonFlightHotel: '私享海岛闪惠出现：舒适航班较高点低44%，海景度假村套房进入礼遇价；预算更多留给景观、早餐和SPA。',
      reasonHotelTicket: '海景套房低至5.9折，出海/SPA体验票较近7日低，行程中临时升级也有尊享感。'
    }, {
      city: '澳门',
      theme: '度假村微奢短假',
      img: '澳门 度假村 高端',
      badge: '套房礼遇',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 880,
          origin: 1600,
          discount: '直降45%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 1580,
          origin: 2600,
          discount: '6.1折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 399,
          origin: 680,
          discount: '5.9折'
        }
      },
      reasonFlightHotel: '套房礼遇价库存稳定：航班降幅45%，度假村高星房低于周末常规价；美食、秀场、购物同动线，微奢短假更划算。',
      reasonHotelTicket: '度假村酒店低至6.1折，演艺/观景体验票低于周末均价，适合行程中顺手升级体验。'
    }],
    family: [{
      city: '三亚',
      theme: '亲子度假村尊享礼遇',
      img: '三亚 高端 亲子 度假村',
      badge: '亲子套房惠',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 1180,
          origin: 2200,
          discount: '直降46%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 2380,
          origin: 3900,
          discount: '6.1折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 399,
          origin: 680,
          discount: '5.9折'
        }
      },
      reasonFlightHotel: '亲子套房礼遇价正在释放：舒适直飞降幅46%，海棠湾酒店含早和儿童活动权益更完整，现在锁机酒比临近更稳。',
      reasonHotelTicket: '亲子套房低至6.1折，水世界/亲子体验票低于近7日均价，适合行程前锁定热门时段。'
    }, {
      city: '澳门',
      theme: '度假村+演艺亲子周末',
      img: '澳门 度假村 亲子 秀场',
      badge: '演艺家庭礼遇',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 980,
          origin: 1800,
          discount: '直降46%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 1880,
          origin: 3100,
          discount: '6.1折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 458,
          origin: 760,
          discount: '6.0折'
        }
      },
      reasonFlightHotel: '家庭礼遇价命中：舒适航班较高点低46%，度假村亲子房同步降；乐园、秀场、餐厅连廊可达，带娃少走冤枉路。',
      reasonHotelTicket: '亲子房低至6.1折，演艺/亲子体验票有库存，行程中下雨也能无缝切室内玩法。'
    }, {
      city: '冲绳',
      theme: '零时差海岛家庭慢游',
      img: '冲绳 海景 度假村 亲子',
      badge: '海景房降价',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 1480,
          origin: 2600,
          discount: '直降43%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 1980,
          origin: 3200,
          discount: '6.2折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 260,
          origin: 420,
          discount: '6.2折'
        }
      },
      reasonFlightHotel: '海景房进入降价段：直飞降幅43%，亲子度假村礼遇价释放；零时差+浅海湾+水族馆，适合家庭慢游先抢机酒。',
      reasonHotelTicket: '海景亲子酒店低至6.2折，水族馆/亲子体验票有礼遇价，适合行程中按天气灵活安排。'
    }, {
      city: '东京',
      theme: '双乐园省心亲子礼遇',
      img: '东京 迪士尼 高端 酒店',
      badge: '乐园酒店惠',
      deals: {
        flight: {
          label: '机票',
          icon: 'flight',
          price: 2180,
          origin: 3900,
          discount: '直降44%'
        },
        hotel: {
          label: '酒店',
          icon: 'bed',
          price: 3200,
          origin: 5200,
          discount: '6.2折'
        },
        ticket: {
          label: '门票',
          icon: 'ticket',
          price: 520,
          origin: 820,
          discount: '6.3折'
        }
      },
      reasonFlightHotel: '双乐园机酒低价窗口出现：舒适航班降幅44%，乐园周边高星酒店礼遇价释放；含接驳/早餐的组合更值得先锁。',
      reasonHotelTicket: '乐园酒店低至6.2折，门票/快速入园权益余量稳定，行程前抢能减少现场排队成本。'
    }]
  }
};
function lowPriceProductKeys() {
  return ['flight', 'hotel'];
}
function lowPriceModeCopy(identity, tier) {
  var bucket = LOW_PRICE_DEST_COPY[tier] || LOW_PRICE_DEST_COPY.value;
  return bucket[identity] || bucket.solo;
}
function lowPriceItems(identity, tier) {
  var bucket = LOW_PRICE_DESTS[tier] || LOW_PRICE_DESTS.value;
  return (bucket[identity] || bucket.solo || []).slice(0, 4);
}
function LowPriceDealRow(_ref3) {
  var deal = _ref3.deal,
    tier = _ref3.tier;
  if (!deal) return null;
  var isPremium = tier === 'premium';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      padding: '7px 0',
      borderBottom: '1px dashed color-mix(in srgb,var(--hairline) 82%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      background: isPremium ? 'rgba(184,163,106,.13)' : 'var(--brand-soft)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: deal.icon,
    size: 13,
    color: "var(--brand)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, deal.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      fontWeight: 900,
      color: 'var(--brand-strong)',
      background: isPremium ? 'rgba(184,163,106,.16)' : 'var(--brand-soft)',
      padding: '2px 5px',
      borderRadius: 6,
      lineHeight: 1.1
    }
  }, deal.discount), /*#__PURE__*/React.createElement("span", {
    className: "price",
    style: {
      fontSize: 17,
      lineHeight: 1,
      letterSpacing: -.2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, "\xA5"), deal.price, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      marginLeft: 1
    }
  }, "\u8D77")), /*#__PURE__*/React.createElement("span", {
    className: "price-origin",
    style: {
      marginLeft: 0,
      fontSize: 10.5
    }
  }, "\xA5", deal.origin)));
}
function LowPriceDest(_ref4) {
  var props = _ref4.props,
    bus = _ref4.bus,
    ctx = _ref4.ctx;
  var identity = ctx && ctx.identity || props && props.identity || 'solo';
  if (identity !== 'solo' && identity !== 'family') return null;
  var tier = ctx && ctx.tier || props && props.tier || 'value';
  var isPremium = tier === 'premium';
  var isFamily = identity === 'family';
  var productKeys = lowPriceProductKeys();
  var copy = lowPriceModeCopy(identity, tier);
  var list = lowPriceItems(identity, tier);
  var ctaText = copy.cta || '抢购';
  var scrollRef = useRef(null);
  React.useEffect(function () {
    var el = scrollRef.current;
    if (!el) return;
    var reset = function reset() {
      if (!scrollRef.current) return;
      scrollRef.current.scrollLeft = 0;
      if (typeof scrollRef.current.scrollTo === 'function') scrollRef.current.scrollTo({
        left: 0,
        behavior: 'auto'
      });
    };
    reset();
    requestAnimationFrame(reset);
    setTimeout(reset, 60);
  }, [identity, tier]);
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "floor-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "floor-title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isPremium ? 'spark' : 'bolt',
    size: 15,
    color: "var(--brand)",
    fill: isPremium ? 'var(--brand)' : 'none'
  }), "\u53D1\u73B0\u4F4E\u4EF7\u76EE\u7684\u5730")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '-3px 14px 8px',
      padding: isPremium ? '9px 11px' : '8px 10px',
      borderRadius: 14,
      background: isPremium ? 'linear-gradient(135deg,rgba(255,255,255,.78),rgba(240,235,221,.82))' : 'var(--brand-soft)',
      border: isPremium ? '1px solid rgba(184,163,106,.24)' : '1px solid color-mix(in srgb,var(--brand) 12%, transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 900,
      color: 'var(--brand-strong)',
      marginBottom: 2
    }
  }, copy.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--text-muted)',
      textWrap: 'pretty'
    }
  }, copy.sub)), /*#__PURE__*/React.createElement("div", {
    key: "low-price-scroll-".concat(identity, "-").concat(tier),
    ref: scrollRef,
    className: "hscroll",
    style: {
      paddingTop: 2,
      paddingBottom: 4,
      gap: 10,
      alignItems: 'stretch',
      scrollBehavior: 'auto'
    }
  }, list.map(function (d, idx) {
    var reason = d.reasonFlightHotel;
    return /*#__PURE__*/React.createElement("div", {
      key: d.city,
      className: "card low-price-dest-card",
      style: {
        flex: '0 0 auto',
        width: 252,
        overflow: 'hidden',
        cursor: 'default',
        background: isPremium ? 'linear-gradient(180deg,#FFFDF8 0%,#F8F4E9 100%)' : 'var(--surface)',
        border: isPremium ? '1px solid rgba(184,163,106,.22)' : 'none',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: d.img,
      photo: true,
      h: 104,
      r: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: isPremium ? 'linear-gradient(180deg,rgba(255,255,255,.04) 0%,rgba(46,38,20,.72) 100%)' : 'linear-gradient(180deg,rgba(0,0,0,.04) 20%,rgba(0,0,0,.72) 100%)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 10,
        top: 9,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 999,
        fontSize: 10.5,
        fontWeight: 900,
        color: isPremium ? '#6F541B' : '#fff',
        background: isPremium ? 'rgba(255,250,235,.94)' : 'rgba(238,73,38,.94)',
        boxShadow: '0 4px 12px rgba(0,0,0,.16)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: isPremium ? 'gift' : 'bolt',
      size: 10,
      color: "currentColor",
      fill: isPremium ? 'none' : 'currentColor',
      stroke: 2.4
    }), d.badge || copy.mode), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 11,
        right: 11,
        bottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#fff',
        fontSize: 17.5,
        fontWeight: 900,
        lineHeight: 1.1
      }
    }, d.city), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'rgba(255,255,255,.91)',
        fontSize: 12.3,
        marginTop: 3,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, d.theme))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '9px 11px 11px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 9px',
        borderRadius: 12,
        background: isPremium ? 'rgba(184,163,106,.10)' : 'color-mix(in srgb,var(--brand-soft) 78%, #fff 22%)',
        border: '1px solid color-mix(in srgb,var(--brand) 12%, transparent)',
        minHeight: 78
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 4,
        color: 'var(--brand-strong)',
        fontSize: 11.5,
        fontWeight: 900
      }
    }, "\u63A8\u8350\u7406\u7531"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--text)',
        fontSize: 12,
        lineHeight: 1.48,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textWrap: 'pretty'
      }
    }, reason)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8
      }
    }, productKeys.map(function (k) {
      return /*#__PURE__*/React.createElement(LowPriceDealRow, {
        key: k,
        deal: d.deals[k],
        tier: tier
      });
    })), /*#__PURE__*/React.createElement("button", {
      className: isFamily ? 'btn' : '',
      onClick: function onClick(e) {
        e.stopPropagation();
        bus.toast("\u5DF2\u4E3A\u4F60\u9501\u5B9A\u300C".concat(d.city, "\u300D\u4F4E\u4EF7\u5E93\u5B58"));
      },
      style: isFamily ? {
        marginTop: 10,
        alignSelf: 'flex-end',
        padding: '6px 14px',
        fontSize: 12.5,
        whiteSpace: 'nowrap',
        boxShadow: 'none',
        filter: 'none'
      } : {
        marginTop: 10,
        width: '100%',
        height: 34,
        borderRadius: 999,
        background: 'var(--cta-grad)',
        color: isPremium ? '#2E2A1C' : 'var(--on-brand,#fff)',
        fontSize: 13.5,
        fontWeight: 900,
        boxShadow: 'var(--btn-shadow)',
        letterSpacing: .2
      }
    }, ctaText)));
  })));
}

/* ---------- 目的地灵感（主题聚合多个单目的地推荐） ---------- */
function SceneGuide(_ref5) {
  var props = _ref5.props,
    bus = _ref5.bus,
    ctx = _ref5.ctx;
  var isFamily = ctx.identity === 'family';
  var themes = window.DATA.themes;
  var db = window.DATA.destDB;
  var THEME_SETS = {
    family: ['kids', 'parks', 'nature', 'fun', 'food', 'snow', 'culture'],
    solo: ['fun', 'food', 'nature', 'culture', 'snow', 'show', 'luxury'],
    biz: ['business', 'food', 'culture', 'luxury', 'fun', 'nature'],
    event: ['show', 'fun', 'food', 'culture', 'nature']
  };
  var ORDER = THEME_SETS[ctx.identity] || THEME_SETS.solo;
  if (ctx.tier === 'premium') ORDER = ['luxury', 'snow'].concat(_toConsumableArray(ORDER.filter(function (k) {
    return k !== 'luxury' && k !== 'snow';
  })));
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    selTheme = _useState6[0],
    setSelTheme = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    selCity = _useState8[0],
    setSelCity = _useState8[1];
  var sectionRef = useRef(null);
  var themeRowRef = useRef(null);
  var themeCardRefs = useRef({});
  var destRowRef = useRef(null);
  var destTabRefs = useRef({});
  var onBrand = ctx.tier === 'premium' ? '#1A1505' : '#fff';
  function pickTheme(k) {
    if (selTheme === k) {
      // 收起：先瞬时把视口锚定到本楼层顶部，再卸载详情 —— 锚点不动，杜绝详情卸载造成的闪动
      var sec = sectionRef.current,
        sc = destScrollerOf(sec);
      if (sec && sc) {
        var prev = sc.style.scrollBehavior;
        sc.style.scrollBehavior = 'auto';
        var top = sc.scrollTop + (sec.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 8;
        sc.scrollTop = Math.max(0, top);
        sc.style.scrollBehavior = prev || '';
      }
      setSelTheme(null);
      setSelCity(null);
      return;
    }
    setSelTheme(k);
    setSelCity(themes[k].dests[0].city); // 锚定到第一个目的地
    requestAnimationFrame(function () {
      return destCenterX(themeRowRef.current, themeCardRefs.current[k]);
    });
  }
  function pickCity(city) {
    setSelCity(city);
    requestAnimationFrame(function () {
      return destCenterX(destRowRef.current, destTabRefs.current[city]);
    });
    // 切换目的地后回到卡片位置，确保推荐理由可见
    setTimeout(function () {
      var sec = sectionRef.current,
        sc = destScrollerOf(sec);
      if (sec && sc) {
        var top = sc.scrollTop + (sec.getBoundingClientRect().top - sc.getBoundingClientRect().top) - 8;
        sc.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth'
        });
      }
    }, 20);
  }
  var theme = selTheme ? themes[selTheme] : null;
  var dest = selCity ? db[selCity] : null;
  return /*#__PURE__*/React.createElement("section", {
    ref: sectionRef,
    className: "floor floor-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "floor-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "floor-title"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 15,
    color: "var(--brand)",
    fill: "var(--brand)"
  }), "\u76EE\u7684\u5730\u7075\u611F")), /*#__PURE__*/React.createElement("div", {
    style: selTheme ? {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'var(--bg)'
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    ref: themeRowRef,
    className: "hscroll",
    style: {
      paddingTop: 6,
      paddingBottom: 6,
      scrollSnapType: 'none'
    }
  }, ORDER.map(function (k) {
    var t = themes[k];
    if (!t) return null;
    var on = k === selTheme;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      ref: function ref(el) {
        return themeCardRefs.current[k] = el;
      },
      onClick: function onClick() {
        return pickTheme(k);
      },
      style: {
        flex: '0 0 auto',
        width: 230,
        padding: 0,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--surface)',
        textAlign: 'left',
        transition: 'transform .2s ease, box-shadow .2s ease',
        border: 'none',
        outline: '2px solid transparent',
        outlineOffset: '-2px',
        boxShadow: on ? '0 0 0 2px var(--brand)' : '0 0 0 1px rgba(26,24,33,.06)',
        transform: on ? 'translateY(-2px)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      src: themeCoverImg(k, t.kw),
      label: t.title,
      h: 120,
      r: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg,transparent 38%,rgba(0,0,0,.62))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 800,
        lineHeight: 1.2
      }
    }, t.title), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'rgba(255,255,255,.86)',
        fontSize: 12,
        marginTop: 2
      }
    }, t.sub)), /*#__PURE__*/React.createElement(PeekCTA, {
      on: on
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '9px 11px 11px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 11,
      color: "var(--brand-strong)",
      style: {
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 12,
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, t.dests.map(function (d) {
      return d.city;
    }).join(' · '))));
  })), theme && /*#__PURE__*/React.createElement("div", {
    ref: destRowRef,
    className: "hscroll",
    style: {
      paddingTop: 2,
      paddingBottom: 9,
      gap: 7
    }
  }, theme.dests.map(function (d) {
    var on = d.city === selCity;
    return /*#__PURE__*/React.createElement("button", {
      key: d.city,
      ref: function ref(el) {
        return destTabRefs.current[d.city] = el;
      },
      onClick: function onClick() {
        return pickCity(d.city);
      },
      style: {
        flex: '0 0 auto',
        padding: '7px 14px',
        borderRadius: 999,
        fontSize: 13.5,
        fontWeight: on ? 800 : 600,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        transition: 'all .15s ease',
        background: on ? 'var(--brand)' : 'var(--surface-2)',
        color: on ? onBrand : 'var(--text-muted)',
        border: on ? 'none' : '1px solid var(--hairline)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 11,
      color: on ? onBrand : 'var(--brand-strong)'
    }), d.city);
  }))), theme && /*#__PURE__*/React.createElement(DestDetail, {
    key: selCity,
    dest: dest,
    isFamily: isFamily,
    identity: ctx.identity,
    tier: ctx.tier,
    themeTitle: theme.title,
    themeReason: window.themedDestReason(selTheme, selCity, isFamily),
    bus: bus
  }));
}

/* ============================================================
   刚刚浏览过的（以酒店为例）—— 默认置于 Feeds 流正上方
   还原「最近浏览」心智：横滑回顾刚看过的酒店，一键订阅降价提醒。
   以「降价订阅」为核心 CTA：浏览过 = 有兴趣 → 降价第一时间触达。
   ============================================================ */
var RV_TIME = ['刚刚', '3分钟前', '12分钟前', '1小时前', '今天 10:24', '昨天'];
var RV_REASONS = ['近地铁口，出行很方便', '步行直达核心商圈', '早餐丰富、出品稳定', '新装修，房间干净敞亮', '前台服务响应很快', '楼层安静，睡得好'];
function rvHash(s) {
  var h = 0;
  s = String(s);
  for (var i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
  return h;
}
function rvReason(it, h) {
  var s = (it.title || '') + (it.tags ? it.tags.join('') : '');
  if (/海景|海岛|度假/.test(s)) return '推窗即海，看日出绝佳';
  if (/亲子|家庭/.test(s)) return '亲子设施齐全，溜娃省心';
  if (/温泉|汤/.test(s)) return '房内泡汤，泡完直接睡';
  if (/江景|高层|景观/.test(s)) return '高层视野通透，夜景很赞';
  if (/泳池|别墅/.test(s)) return '私享泳池，度假感拉满';
  return RV_REASONS[h % RV_REASONS.length];
}
function rvReviews(h) {
  var rc = 1600 + h % 44000;
  return rc >= 10000 ? (rc / 10000).toFixed(1) + '万条评价' : rc.toLocaleString() + '条评价';
}
function RecentlyViewed(_ref6) {
  var props = _ref6.props,
    bus = _ref6.bus,
    ctx = _ref6.ctx;
  var city = ctx && ctx.city || props && props.city || '三亚';
  var tier = ctx && ctx.tier || props && props.tier || 'value';

  // 最近浏览的酒店：按 城市+档位 稳定生成（与 Feeds 同源，保证图文/价格一致）
  var seed = React.useMemo(function () {
    var built = (window.buildFeedCards ? window.buildFeedCards(city, 'hotel', tier) : []).slice(0, 6);
    return built.length ? built : window.DATA.feeds.filter(function (f) {
      return f.line === 'hotel';
    }).slice(0, 5);
  }, [city, tier]);
  var _useState9 = useState(seed),
    _useState0 = _slicedToArray(_useState9, 2),
    list = _useState0[0],
    setList = _useState0[1];
  var _useState1 = useState({}),
    _useState10 = _slicedToArray(_useState1, 2),
    subs = _useState10[0],
    setSubs = _useState10[1]; // { [key]: true } 已订阅降价
  React.useEffect(function () {
    setList(seed);
    setSubs({});
  }, [seed]);
  if (!list.length) return null;
  var subCount = Object.values(subs).filter(Boolean).length;
  var toggleSub = function toggleSub(it, key) {
    setSubs(function (s) {
      var next = _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, key, !s[key]));
      if (next[key]) bus.toast("\u5DF2\u8BA2\u9605\u300C".concat(it.title, "\u300D\u964D\u4EF7\u63D0\u9192\uFF0C\u964D\u4EF7\u7ACB\u5373\u901A\u77E5\u4F60"));else bus.toast('已关闭该酒店的降价提醒');
      return next;
    });
  };
  var subscribeAll = function subscribeAll() {
    var all = {};
    list.forEach(function (it, i) {
      return all[(it.id || it.title) + '-' + i] = true;
    });
    setSubs(all);
    bus.toast("\u5DF2\u4E3A ".concat(list.length, " \u5BB6\u521A\u6D4F\u89C8\u7684\u9152\u5E97\u5F00\u542F\u964D\u4EF7\u63D0\u9192"));
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "floor floor-enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "floor-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "floor-title",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 15,
    color: "var(--brand)"
  }), "\u521A\u521A\u6D4F\u89C8\u8FC7\u7684\u9152\u5E97"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: subscribeAll,
    className: "floor-more",
    style: {
      background: 'none',
      color: 'var(--brand-strong)',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 12,
    color: "currentColor",
    stroke: 2.2
  }), "\u4E00\u952E\u8BA2\u9605\u964D\u4EF7"))), subCount > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '-2px 14px 6px',
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 11.5,
      color: 'var(--brand-strong)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12,
    color: "currentColor",
    stroke: 2.6
  }), "\u5DF2\u8BA2\u9605 ", subCount, " \u5BB6\u9152\u5E97\u7684\u964D\u4EF7\u63D0\u9192\uFF0C\u964D\u4EF7\u4F1A\u7B2C\u4E00\u65F6\u95F4\u901A\u77E5\u4F60"), /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      gap: 10
    }
  }, list.map(function (it, i) {
    var key = (it.id || it.title) + '-' + i;
    var subbed = !!subs[key];
    var h = rvHash((it.id || '') + (it.title || ''));
    var reviews = rvReviews(h);
    var reason = rvReason(it, h);
    // 较浏览时已降的金额（每张稳定生成；仅已订阅卡片展示）
    var dropped = Math.max(20, Math.round(it.price * (0.05 + h % 6 / 100) / 10) * 10);
    // 划线价 + 折扣
    var rate = 0.66 + h % 16 / 100;
    var origin = Math.max(it.price + 30, Math.round(it.price / rate / 10) * 10);
    var disc = (it.price / origin * 10).toFixed(1) + '折';
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      className: "card",
      style: {
        width: 320,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 116,
        flexShrink: 0,
        alignSelf: 'stretch'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: it.img,
      photo: true,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 8,
        borderRadius: '16px 12px 12px 16px'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 8,
        top: 8,
        padding: '2px 7px',
        borderRadius: 999,
        background: 'rgba(0,0,0,.45)',
        color: '#fff',
        fontSize: 10.5,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 10,
      color: "#fff",
      stroke: 2.4
    }), RV_TIME[i % RV_TIME.length])), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        padding: '9px 11px 10px',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "feed-title-2",
      style: {
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.3,
        color: 'var(--text)'
      }
    }, it.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 5,
        marginTop: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, Number(it.score || 4.7).toFixed(1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--text-muted)'
      }
    }, " / 5")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        color: 'var(--text-muted)'
      }
    }, reviews)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        marginTop: 5,
        fontSize: 11.5,
        lineHeight: 1.4,
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "thumb",
      size: 10,
      color: "var(--brand)",
      style: {
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, reason)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 6
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        marginBottom: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 800,
        color: 'var(--brand-strong)',
        background: 'var(--brand-soft)',
        padding: '1px 5px',
        borderRadius: 5,
        lineHeight: 1.2
      }
    }, disc)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 5,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "price",
      style: {
        fontSize: 17,
        lineHeight: 1,
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur",
      style: {
        fontSize: 12
      }
    }, "\xA5"), it.price), /*#__PURE__*/React.createElement("span", {
      className: "price-origin",
      style: {
        lineHeight: 1,
        whiteSpace: 'nowrap'
      }
    }, "\xA5", origin)), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return toggleSub(it, key);
      },
      "aria-label": subbed ? '已订阅降价' : '订阅降价',
      style: {
        flex: '0 0 auto',
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        transition: 'all .16s ease',
        border: subbed ? '1px solid var(--hairline)' : '1px solid color-mix(in srgb,var(--brand) 42%, transparent)',
        background: subbed ? 'var(--surface-2)' : 'color-mix(in srgb,var(--brand-soft) 82%, #fff 18%)',
        color: subbed ? 'var(--text-muted)' : 'var(--brand-strong)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: subbed ? 'check' : 'bell',
      size: 11,
      color: "currentColor",
      stroke: subbed ? 2.6 : 2
    }), subbed ? '已订阅' : '订阅降价'))));
  })));
}
Object.assign(window, {
  DestRec: DestRec,
  SceneGuide: SceneGuide,
  DestDetail: DestDetail,
  LowPriceDest: LowPriceDest,
  RecentlyViewed: RecentlyViewed
});

/* 692ce29a-ea01-4ad8-98f7-4a72c2338be1.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* ============================================================
   OTA Demo — 全局框架
   TopNav / ModeSwitcher / PageTabs / Toast / FamilySheet
   AIPanel / AIDock / Console
   ============================================================ */
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef;

/* ---------------- 身份枚举 ---------------- */
var MODES = [{
  id: 'solo',
  label: '个人',
  icon: 'user'
}, {
  id: 'family',
  label: '亲子',
  icon: 'family3'
}, {
  id: 'event',
  label: '展演',
  icon: 'stub'
}, {
  id: 'biz',
  label: '商务',
  icon: 'case'
}];

/* ---------------- 顶部导航 ---------------- */
function TopNav(_ref) {
  var ctx = _ref.ctx,
    onMode = _ref.onMode,
    subscribed = _ref.subscribed,
    onSubscribe = _ref.onSubscribe,
    onShare = _ref.onShare;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    open = _useState2[0],
    setOpen = _useState2[1];
  var cur = MODES.find(function (m) {
    return m.id === ctx.identity;
  });
  var onBrandText = ctx.tier === 'premium' ? 'var(--bg)' : '#fff';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 'var(--z-nav)',
      background: 'var(--bg)',
      transition: 'background-color var(--t-slow) var(--ease)',
      padding: '7px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 22,
    color: "var(--text)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      fontSize: 22,
      fontWeight: 900,
      color: 'var(--text)',
      fontFamily: 'var(--font-title)'
    }
  }, "\u4F18\u60E0", /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: 99,
      background: 'var(--brand)',
      marginLeft: 2,
      marginBottom: 6
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setOpen(function (o) {
        return !o;
      });
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 9px',
      borderRadius: 999,
      background: 'var(--brand)',
      color: onBrandText,
      fontWeight: 800,
      fontSize: 13,
      transition: 'background-color var(--t-base)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: cur.icon,
    size: 13,
    color: "currentColor"
  }), cur.label + '出行', /*#__PURE__*/React.createElement(Icon, {
    name: "chevD",
    size: 12,
    color: "currentColor",
    style: {
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--t-base)'
    }
  })), open && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return setOpen(false);
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 5px)',
      left: 0,
      zIndex: 2,
      minWidth: 132,
      background: 'var(--surface)',
      borderRadius: 13,
      boxShadow: '0 10px 30px rgba(0,0,0,.22)',
      padding: 5,
      animation: 'floorIn .18s ease'
    }
  }, MODES.map(function (m) {
    var on = m.id === ctx.identity;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: function onClick() {
        onMode(m.id);
        setOpen(false);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 9px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: on ? 800 : 500,
        color: 'var(--text)',
        background: on ? 'var(--brand-soft)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: m.icon,
      size: 15,
      color: on ? 'var(--brand-strong)' : 'var(--text-muted)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        textAlign: 'left'
      }
    }, m.label, "\u51FA\u884C"), on && /*#__PURE__*/React.createElement(Icon, {
      name: "back",
      size: 13,
      color: "var(--brand-strong)",
      style: {
        transform: 'rotate(-90deg) scaleY(-1)'
      }
    }));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onSubscribe,
    "aria-label": subscribed ? '已订阅' : '订阅频道',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      padding: '5px 11px 5px 9px',
      borderRadius: 999,
      fontSize: 12.5,
      fontWeight: 800,
      background: subscribed ? 'var(--surface-2)' : 'color-mix(in srgb,var(--brand-soft) 84%, #fff 16%)',
      color: subscribed ? 'var(--text-muted)' : 'var(--brand-strong)',
      border: subscribed ? '1px solid var(--hairline)' : '1px solid color-mix(in srgb,var(--brand) 38%, transparent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: subscribed ? 'check' : 'bell',
    size: 13,
    color: "currentColor",
    stroke: subscribed ? 2.6 : 2
  }), subscribed ? '已订阅' : '订阅'), /*#__PURE__*/React.createElement("button", {
    onClick: onShare,
    "aria-label": "\u5206\u4EAB",
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '3px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 20,
    color: "color-mix(in srgb, var(--brand-strong) 62%, var(--text) 38%)",
    stroke: 2
  })));
}

/* ---------------- 页面 Tab — 商旅/展演隐藏探索 ---------------- */
function PageTabs(_ref2) {
  var ctx = _ref2.ctx,
    tab = _ref2.tab,
    onTab = _ref2.onTab,
    cityFirst = _ref2.cityFirst;
  var cityName = ctx.city || '冲绳';
  // 商旅、展演不显示探索 tab
  var showExplore = ctx.identity !== 'biz' && ctx.identity !== 'event';
  var TabBtn = function TabBtn(_ref3) {
    var id = _ref3.id,
      children = _ref3.children;
    var on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTab(id);
      },
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '7px 0 11px',
        fontSize: 15,
        fontWeight: on ? 800 : 500,
        color: on ? 'var(--text)' : 'var(--text-muted)'
      }
    }, children, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: -1,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 20,
        height: 3,
        borderRadius: 99,
        background: 'var(--brand)'
      }
    }));
  };
  var exploreTab = showExplore ? /*#__PURE__*/React.createElement(TabBtn, {
    key: "explore",
    id: "explore"
  }, "\u63A2\u7D22\u76EE\u7684\u5730") : null;
  var cityTab = /*#__PURE__*/React.createElement(TabBtn, {
    key: "city",
    id: "city"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 14,
    color: tab === 'city' ? 'var(--brand)' : 'var(--text-muted)'
  }), cityName, /*#__PURE__*/React.createElement(Icon, {
    name: "chevD",
    size: 12,
    color: tab === 'city' ? 'var(--brand)' : 'var(--text-muted)'
  }));
  // 决策(S2)/灵感(S1)/行程后(S5)：探索目的地 在第 1 位；行程前/中(S3/S4)：目的地 在第 1 位，探索退居第 2 位
  var ordered = cityFirst ? [cityTab, exploreTab] : [exploreTab, cityTab];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 'var(--z-tab)',
      background: 'var(--bg)',
      transition: 'background-color var(--t-slow) var(--ease)',
      display: 'flex',
      gap: 22,
      padding: '3px 16px 0',
      borderBottom: '1px solid var(--hairline)'
    }
  }, ordered);
}

/* ---------------- Toast ---------------- */
function Toast(_ref4) {
  var toast = _ref4.toast,
    onUndo = _ref4.onUndo;
  if (!toast) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 13,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 'var(--z-toast)',
      background: 'rgba(20,20,24,.94)',
      color: '#fff',
      borderRadius: 11,
      padding: '9px 13px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 8px 28px rgba(0,0,0,.4)',
      maxWidth: '88%',
      animation: 'floorIn .3s ease'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 14,
    color: "#FFD27A",
    fill: "#FFD27A"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.4
    }
  }, toast.msg), toast.undo && /*#__PURE__*/React.createElement("button", {
    onClick: onUndo,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      color: '#7FB4FF',
      fontSize: 13.5,
      fontWeight: 700,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "undo",
    size: 13,
    color: "#7FB4FF"
  }), "\u64A4\u9500"));
}

/* ---------------- 家庭档案 sheet ---------------- */
function FamilySheet(_ref5) {
  var open = _ref5.open,
    family = _ref5.family,
    onClose = _ref5.onClose,
    onSave = _ref5.onSave;
  var _useState3 = useState(family.adults),
    _useState4 = _slicedToArray(_useState3, 2),
    adults = _useState4[0],
    setAdults = _useState4[1];
  var _useState5 = useState(family.children.length || 1),
    _useState6 = _slicedToArray(_useState5, 2),
    kids = _useState6[0],
    setKids = _useState6[1];
  var _useState7 = useState(family.children.map(function (c) {
      return c.age;
    })),
    _useState8 = _slicedToArray(_useState7, 2),
    ages = _useState8[0],
    setAges = _useState8[1];
  useEffect(function () {
    if (open) {
      setAdults(family.adults);
      setKids(family.children.length || 1);
      setAges(family.children.map(function (c) {
        return c.age;
      }));
    }
  }, [open]);
  var AGE_OPTS = [{
    v: 0,
    label: '<1岁'
  }].concat(Array.from({
    length: 17
  }).map(function (_, i) {
    return {
      v: i + 1,
      label: i + 1 + '岁'
    };
  }));
  function setAge(i, a) {
    setAges(function (p) {
      var n = _toConsumableArray(p);
      n[i] = a;
      return n;
    });
  }
  function save() {
    var children = Array.from({
      length: kids
    }).map(function (_, i) {
      return {
        age: ages[i] != null ? ages[i] : 3
      };
    });
    onSave({
      adults: adults,
      children: children,
      filled: true
    });
  }
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "\u6211\u7684\u5BB6\u5EAD\u6863\u6848"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 20px'
    }
  }, /*#__PURE__*/React.createElement(Stepper, {
    label: "\u6210\u4EBA\u6570",
    value: adults,
    min: 1,
    max: 6,
    onChange: setAdults
  }), /*#__PURE__*/React.createElement(Stepper, {
    label: "\u513F\u7AE5\u6570",
    value: kids,
    min: 1,
    max: 4,
    onChange: setKids
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--hairline)',
      margin: '12px 0'
    }
  }), Array.from({
    length: kids
  }).map(function (_, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: 7
      }
    }, "\u5B69\u5B50 ", i + 1, " \u7684\u5E74\u9F84"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("select", {
      value: ages[i] != null ? ages[i] : 3,
      onChange: function onChange(e) {
        return setAge(i, Number(e.target.value));
      },
      style: {
        width: '100%',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        padding: '11px 38px 11px 14px',
        borderRadius: 10,
        border: '1.5px solid var(--hairline)',
        background: 'var(--surface)',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--text)',
        fontFamily: 'inherit',
        outline: 'none',
        cursor: 'pointer'
      }
    }, AGE_OPTS.map(function (o) {
      return /*#__PURE__*/React.createElement("option", {
        key: o.v,
        value: o.v
      }, o.label);
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: 13,
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevD",
      size: 16,
      color: "var(--text-muted)"
    }))));
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-block",
    onClick: save,
    style: {
      marginTop: 8,
      padding: '13px'
    }
  }, "\u4FDD\u5B58\u6863\u6848 \xB7 \u4F18\u5316\u63A8\u8350")));
}
function Stepper(_ref6) {
  var label = _ref6.label,
    value = _ref6.value,
    min = _ref6.min,
    max = _ref6.max,
    onChange = _ref6.onChange;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '9px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onChange(Math.max(min, value - 1));
    },
    style: {
      width: 28,
      height: 28,
      borderRadius: 99,
      border: '1.5px solid var(--hairline)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 14,
    color: "var(--text)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      minWidth: 16,
      textAlign: 'center',
      color: 'var(--text)'
    }
  }, value), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onChange(Math.min(max, value + 1));
    },
    style: {
      width: 28,
      height: 28,
      borderRadius: 99,
      background: 'var(--brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14,
    color: "#fff"
  }))));
}

/* ---------------- 城市选择浮层 ---------------- */
var HOT_CITIES = [{
  city: '冲绳',
  lowPrice: 2100,
  reason: '直飞3h · 水族馆遛娃'
}, {
  city: '三亚',
  lowPrice: 1280,
  reason: '避寒首选 · 椰风海岸'
}, {
  city: '上海',
  lowPrice: 480,
  reason: '都市差旅 · 高效通达'
}, {
  city: '东京',
  lowPrice: 1980,
  reason: '潮玩血拼 · 迪士尼'
}, {
  city: '普吉',
  lowPrice: 1680,
  reason: '亲子沙滩 + 无边泳池'
}, {
  city: '成都',
  lowPrice: 620,
  reason: '美食 + 熊猫基地'
}, {
  city: '北京',
  lowPrice: 560,
  reason: '故宫文化 · 长知识'
}, {
  city: '马代',
  lowPrice: 6800,
  reason: '私岛秘境 · 一价全包'
}, {
  city: '香港',
  lowPrice: 680,
  reason: '购物天堂 · 维港夜景'
}, {
  city: '厦门',
  lowPrice: 520,
  reason: '文艺海岛 · 鼓浪屿'
}, {
  city: '大理',
  lowPrice: 740,
  reason: '苍山洱海 · 慢生活'
}, {
  city: '重庆',
  lowPrice: 560,
  reason: '8D魔幻 · 火锅之都'
}];
function CitySwitcher(_ref7) {
  var open = _ref7.open,
    current = _ref7.current,
    onClose = _ref7.onClose,
    onPick = _ref7.onPick;
  var _useState9 = useState(''),
    _useState0 = _slicedToArray(_useState9, 2),
    q = _useState0[0],
    setQ = _useState0[1];
  useEffect(function () {
    if (open) setQ('');
  }, [open]);
  var nearby = HOT_CITIES.slice(0, 6);
  var longhaul = HOT_CITIES.slice(6);
  var list = q.trim() ? HOT_CITIES.filter(function (c) {
    return c.city.includes(q.trim());
  }) : HOT_CITIES;
  // 分组标题吸顶位置 = 搜索头实际高度，避免标题躲在搜索头后面只露出一条白色缝隙
  var headRef = useRef(null);
  var _useState1 = useState(126),
    _useState10 = _slicedToArray(_useState1, 2),
    stickTop = _useState10[0],
    setStickTop = _useState10[1];
  useEffect(function () {
    var el = headRef.current;
    if (!el) return;
    var update = function update() {
      return setStickTop(48 + el.offsetHeight);
    };
    update();
    var ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }
    var raf = requestAnimationFrame(update);
    return function () {
      if (ro) ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [open, q]);
  // 「当前位置」展示用户所在的出发城市，与 feeds 机票出发城市同源（defaultDepartCity）
  var located = window.defaultDepartCity ? window.defaultDepartCity(current) : current;
  function SectionTitle(_ref8) {
    var children = _ref8.children;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: stickTop,
        zIndex: 34,
        background: 'var(--surface)',
        padding: '8px 2px 6px',
        margin: '0 -2px',
        boxShadow: '0 6px 10px rgba(0,0,0,.025)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 13.5,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "spark",
      size: 13,
      color: "var(--brand)",
      fill: "var(--brand)"
    }), children));
  }
  function renderCityCard(c) {
    var on = c.city === located;
    return /*#__PURE__*/React.createElement("button", {
      key: c.city,
      onClick: function onClick() {
        return onPick(c.city);
      },
      className: "card",
      style: {
        overflow: 'hidden',
        textAlign: 'left',
        padding: 0,
        border: on ? '2px solid var(--brand)' : '1px solid var(--hairline)',
        borderRadius: 13,
        boxShadow: 'none'
      }
    }, /*#__PURE__*/React.createElement(Ph, {
      label: c.city,
      photo: true,
      h: 64,
      r: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg,rgba(255,255,255,.04),rgba(0,0,0,.18) 45%,rgba(0,0,0,.50)), linear-gradient(135deg,color-mix(in srgb,var(--brand) 24%,transparent),transparent 62%)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '6px 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#fff',
        fontSize: 14.5,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 11.5,
      color: "#fff"
    }), c.city), on && /*#__PURE__*/React.createElement("span", {
      style: {
        background: 'linear-gradient(135deg,var(--brand-light,#F4ADB5),var(--brand,#D87D91) 58%,var(--brand-strong,#B85E74))',
        color: 'var(--on-brand)',
        fontSize: 10,
        fontWeight: 800,
        padding: '1.5px 5px',
        borderRadius: 99
      }
    }, "\u5F53\u524D"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 8px 5px',
        borderTop: '1px solid rgba(255,255,255,.04)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '10.3px',
        color: 'var(--text-muted)',
        lineHeight: 1.22,
        minHeight: 22,
        overflow: 'hidden',
        marginBottom: 1
      }
    }, c.reason)));
  }
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "\u9009\u62E9\u76EE\u7684\u5730",
    height: "84%"
  }, /*#__PURE__*/React.createElement("div", {
    ref: headRef,
    style: {
      position: 'sticky',
      top: 48,
      zIndex: 60,
      background: 'var(--surface)',
      padding: '9px 14px 9px',
      boxShadow: 'none',
      borderBottom: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      background: 'var(--bg)',
      border: '1.5px solid var(--brand-soft)',
      borderRadius: 999,
      padding: '8px 13px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    color: "var(--brand)"
  }), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: function onChange(e) {
      return setQ(e.target.value);
    },
    placeholder: "\u641C\u7D22\u57CE\u5E02 / \u56FD\u5BB6 / \u76EE\u7684\u5730",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: 14.5,
      color: 'var(--text)'
    }
  }), q && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setQ('');
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 15,
    color: "var(--text-muted)"
  }))), !q.trim() && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onPick(located);
    },
    style: {
      marginTop: 7,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      border: 'none',
      borderRadius: 12,
      padding: '7px 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 999,
      background: 'var(--brand-soft)',
      color: 'var(--brand)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 12,
    color: "var(--brand)",
    fill: "var(--brand-soft)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 12.5,
      color: 'var(--text)',
      fontWeight: 700
    }
  }, "\u5F53\u524D\u4F4D\u7F6E"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 11.5,
      color: 'var(--text-muted)'
    }
  }, "\u5DF2\u4E3A\u4F60\u5B9A\u4F4D\uFF1A", located)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 14px 26px',
      background: 'var(--surface)',
      position: 'relative',
      zIndex: 1
    }
  }, q.trim() ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: stickTop,
      zIndex: 34,
      background: 'var(--surface)',
      padding: '8px 2px 7px',
      margin: '0 -2px',
      fontSize: 13.5,
      fontWeight: 800,
      color: 'var(--text)',
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      boxShadow: '0 6px 10px rgba(0,0,0,.035)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 13,
    color: "var(--brand)",
    fill: "var(--brand)"
  }), "\u641C\u7D22\u7ED3\u679C"), list.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: 14,
      padding: '36px 0'
    }
  }, "\u6CA1\u6709\u627E\u5230\u300C", q, "\u300D\u76F8\u5173\u76EE\u7684\u5730") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      paddingBottom: 8
    }
  }, list.map(function (c) {
    return renderCityCard(c);
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, null, "\u5468\u8FB9\u70ED\u95E8\u57CE\u5E02"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      paddingBottom: 12
    }
  }, nearby.map(function (c) {
    return renderCityCard(c);
  })), /*#__PURE__*/React.createElement(SectionTitle, null, "\u957F\u9014\u70ED\u95E8\u57CE\u5E02"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8
    }
  }, longhaul.map(function (c) {
    return renderCityCard(c);
  })))));
}

/* ---------------- 通用底部 sheet ---------------- */
function Sheet(_ref9) {
  var open = _ref9.open,
    onClose = _ref9.onClose,
    title = _ref9.title,
    children = _ref9.children,
    height = _ref9.height;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,.45)',
      zIndex: 'var(--z-sheet)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--t-base)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 'calc(var(--z-sheet) + 1)',
      background: 'var(--surface)',
      borderRadius: '18px 18px 0 0',
      maxHeight: height || '82%',
      overflowY: 'auto',
      transform: open ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform var(--t-base) var(--ease)',
      boxShadow: open ? '0 -8px 36px rgba(0,0,0,.3)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 80,
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px 9px',
      borderBottom: '1px solid var(--hairline)',
      boxShadow: '0 7px 12px rgba(0,0,0,.04)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 20,
    color: "var(--text)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20
    }
  })), children));
}

/* ---------------- AI 对话面板 ---------------- */
function AIPanel(_ref0) {
  var open = _ref0.open,
    onClose = _ref0.onClose,
    messages = _ref0.messages,
    onSend = _ref0.onSend,
    suggestions = _ref0.suggestions;
  var _useState11 = useState(''),
    _useState12 = _slicedToArray(_useState11, 2),
    val = _useState12[0],
    setVal = _useState12[1];
  var bodyRef = useRef(null);
  useEffect(function () {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "\u95EE\u4E00\u95EE \xB7 AI \u52A9\u624B",
    height: "76%"
  }, /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    style: {
      padding: '12px 14px',
      minHeight: 240,
      maxHeight: '48vh',
      overflowY: 'auto'
    }
  }, messages.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: 13.5,
      textAlign: 'center',
      padding: '28px 0'
    }
  }, "\u544A\u8BC9\u6211\u4F60\u7684\u51FA\u884C\u60F3\u6CD5\uFF0C\u6211\u5E2E\u4F60\u5B9E\u65F6\u8C03\u6574\u9875\u9762 \u2728", /*#__PURE__*/React.createElement("br", null), "\u8BD5\u8BD5\u4E0B\u9762\u7684\u5FEB\u6377\u6307\u4EE4 \uD83D\uDC47"), messages.map(function (m, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: '78%',
        padding: '9px 12px',
        borderRadius: 13,
        fontSize: 14,
        lineHeight: 1.5,
        background: m.role === 'user' ? 'var(--brand)' : 'var(--surface-2)',
        color: m.role === 'user' ? '#fff' : 'var(--text)',
        borderBottomRightRadius: m.role === 'user' ? 4 : 13,
        borderBottomLeftRadius: m.role === 'user' ? 13 : 4
      }
    }, m.text));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '7px 13px 5px',
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, suggestions.map(function (s) {
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      onClick: function onClick() {
        return onSend(s);
      },
      style: {
        fontSize: 13,
        padding: '6px 11px',
        borderRadius: 999,
        border: '1px solid var(--brand)',
        color: 'var(--brand)',
        background: 'var(--brand-soft)'
      }
    }, s);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      background: 'var(--surface)',
      padding: '9px 13px calc(13px + env(safe-area-inset-bottom))',
      display: 'flex',
      gap: 7,
      borderTop: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: val,
    onChange: function onChange(e) {
      return setVal(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter' && val.trim()) {
        onSend(val.trim());
        setVal('');
      }
    },
    placeholder: "\u8BF4\u8BF4\u4F60\u7684\u51FA\u884C\u60F3\u6CD5\u2026",
    style: {
      flex: 1,
      border: '1px solid var(--hairline)',
      borderRadius: 999,
      padding: '9px 14px',
      fontSize: 14.5,
      background: 'var(--bg)',
      color: 'var(--text)',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: function onClick() {
      if (val.trim()) {
        onSend(val.trim());
        setVal('');
      }
    },
    style: {
      padding: '9px 16px'
    }
  }, "\u53D1\u9001")));
}

/* ---------------- 底部 AI 对话栏（固定底部区域：气泡 + 输入框，参考样式） ---------------- */
function AIDock(_ref1) {
  var suggestions = _ref1.suggestions,
    onSend = _ref1.onSend,
    onOpen = _ref1.onOpen,
    actionChips = _ref1.actionChips,
    onTrayChange = _ref1.onTrayChange;
  var _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    voice = _useState14[0],
    setVoice = _useState14[1];
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    rec = _useState16[0],
    setRec = _useState16[1];
  var recRef = useRef(false);
  function startRec(e) {
    if (e && e.preventDefault) e.preventDefault();
    recRef.current = true;
    setRec(true);
  }
  function endRec() {
    if (!recRef.current) return;
    recRef.current = false;
    setRec(false);
    onOpen();
    onSend(suggestions[0]);
  }
  function cancelRec() {
    recRef.current = false;
    setRec(false);
  }
  useEffect(function () {
    onTrayChange && onTrayChange(false);
  }, []);

  // 顶部只保留原「行程规划入口」等动作气泡，不再展示预制问题
  var chips = (actionChips || []).map(function (c) {
    return {
      key: 'act-' + c.label,
      label: c.label,
      icon: c.icon || 'cal',
      onClick: c.onClick
    };
  });
  var roundBtn = {
    flex: '0 0 auto',
    width: 34,
    height: 34,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface-2)',
    border: '1px solid var(--hairline)',
    color: 'var(--text)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 'var(--z-aibar)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderTop: '1px solid var(--hairline)',
      borderRadius: '0 0 var(--screen-radius,42px) var(--screen-radius,42px)',
      boxShadow: 'none',
      padding: '7px 0 calc(16px + env(safe-area-inset-bottom))'
    }
  }, chips.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      gap: 8,
      padding: '1px 12px 7px'
    }
  }, chips.map(function (c) {
    return /*#__PURE__*/React.createElement("button", {
      key: c.key,
      onClick: c.onClick,
      style: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 13px',
        borderRadius: 999,
        fontSize: 13.5,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        background: 'var(--surface)',
        border: '1px solid color-mix(in srgb,var(--brand) 45%, transparent)',
        color: 'var(--brand)',
        boxShadow: '0 1px 5px rgba(0,0,0,.07)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 13,
      color: "var(--brand)"
    }), c.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, voice ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onPointerDown: startRec,
    onPointerUp: endRec,
    onPointerLeave: endRec,
    onPointerCancel: cancelRec,
    className: rec ? 'btn' : '',
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      background: rec ? undefined : 'var(--surface)',
      borderRadius: 24,
      border: rec ? 'none' : '1.5px solid color-mix(in srgb,var(--text) 16%, var(--hairline))',
      boxShadow: rec ? 'none' : '0 1px 4px rgba(0,0,0,.05)',
      padding: '9px 14px',
      color: rec ? undefined : 'var(--text)',
      fontSize: 14.5,
      fontWeight: rec ? 800 : 600,
      userSelect: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'none',
      transition: 'background var(--t-fast)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mic",
    size: 17,
    color: rec ? 'currentColor' : 'var(--brand)',
    fill: rec ? 'currentColor' : 'none'
  }), rec && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: -5,
      borderRadius: 99,
      border: '2px solid currentColor',
      opacity: .5,
      animation: 'breathe 1.1s infinite'
    }
  })), rec ? '正在聆听… 松开发送' : '按住 说话'), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      cancelRec();
      setVoice(false);
    },
    "aria-label": "\u5207\u56DE\u6587\u5B57\u8F93\u5165",
    style: roundBtn
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "keyboard",
    size: 18,
    color: "var(--text)"
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface)',
      border: '1.5px solid color-mix(in srgb,var(--text) 16%, var(--hairline))',
      borderRadius: 24,
      padding: '5px 7px 5px 12px',
      boxShadow: '0 1px 4px rgba(0,0,0,.05)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "AI \u95EE\u7B54",
    onClick: function onClick() {
      return onOpen();
    },
    style: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 21,
    color: "var(--brand)",
    fill: "var(--brand)"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return onOpen();
    },
    style: {
      flex: 1,
      minWidth: 0,
      textAlign: 'left',
      background: 'transparent',
      color: 'var(--text-muted)',
      fontSize: 14.5,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "\u95EE\u4E00\u95EE\uFF1A\u60F3\u53BB\u54EA\u3001\u627E\u7279\u4EF7\u3001\u5E26\u5A03\u51FA\u884C\u2026"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u8BED\u97F3\u8F93\u5165",
    onClick: function onClick() {
      return setVoice(true);
    },
    style: roundBtn
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "wave",
    size: 18,
    color: "var(--text)",
    stroke: 2
  }))))));
}

/* ---------------- 订阅频道 sheet ---------------- */
function ShareBrandIcon(_ref10) {
  var id = _ref10.id,
    _ref10$size = _ref10.size,
    size = _ref10$size === void 0 ? 30 : _ref10$size;
  switch (id) {
    case 'wechat':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none"
      }, /*#__PURE__*/React.createElement("ellipse", {
        cx: "9",
        cy: "9.7",
        rx: "6.4",
        ry: "5.4",
        fill: "white"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4.7 13.4l-1.6 2.6 3.2-1.4z",
        fill: "white"
      }), /*#__PURE__*/React.createElement("ellipse", {
        cx: "16.3",
        cy: "15",
        rx: "5.3",
        ry: "4.4",
        fill: "white"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19.5 18.2l1.5 2.1-2.6-1z",
        fill: "white"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7",
        cy: "9.1",
        r: "0.95",
        fill: "#07C160"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "9.1",
        r: "0.95",
        fill: "#07C160"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "14.9",
        cy: "14.6",
        r: "0.85",
        fill: "#07C160"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17.8",
        cy: "14.6",
        r: "0.85",
        fill: "#07C160"
      }));
    case 'instagram':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "5.4",
        stroke: "white",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4.2",
        stroke: "white",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17.2",
        cy: "6.8",
        r: "1.35",
        fill: "white"
      }));
    case 'facebook':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "white"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M13.4 21v-7h2.4l.4-3.1h-2.8V8.9c0-.9.26-1.5 1.55-1.5H16.4V4.65c-.28-.04-1.25-.13-2.38-.13-2.36 0-3.97 1.44-3.97 4.08v2.28H7.6V14h2.45v7z"
      }));
    case 'line':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 3.6C7 3.6 3 6.9 3 10.95c0 3.62 3.16 6.66 7.43 7.24.29.06.68.19.78.43.09.22.06.56.03.78l-.12.74c-.04.22-.18.86.76.47.93-.39 5.02-2.96 6.85-5.07h0C19.27 14.1 21 12.7 21 10.95c0-4.05-4-7.35-9-7.35z",
        fill: "white"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "7.4",
        y: "9.7",
        width: "1.25",
        height: "3.7",
        rx: "0.6",
        fill: "#06C755"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "10.2",
        y: "9.7",
        width: "1.25",
        height: "3.7",
        rx: "0.6",
        fill: "#06C755"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "13",
        y: "9.7",
        width: "1.25",
        height: "3.7",
        rx: "0.6",
        fill: "#06C755"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "15.4",
        y: "9.7",
        width: "1.25",
        height: "3.7",
        rx: "0.6",
        fill: "#06C755"
      }));
    case 'whatsapp':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32",
        fill: "none"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M16 3C8.8 3 3 8.8 3 16c0 2.5.7 4.9 1.9 7L3 29l6.2-1.6c2 1.1 4.4 1.7 6.8 1.7 7.2 0 13-5.8 13-13S23.2 3 16 3z",
        fill: "white"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12.2 9.9c-.25-.55-.5-.56-.74-.57h-.63c-.22 0-.58.08-.88.4-.3.32-1.16 1.13-1.16 2.76 0 1.63 1.19 3.2 1.35 3.42.17.22 2.3 3.68 5.68 5.02 2.82 1.11 3.4.89 4 .83.6-.05 1.95-.8 2.22-1.56.27-.77.27-1.42.19-1.56-.08-.13-.3-.22-.63-.38-.33-.16-1.95-.96-2.25-1.07-.3-.11-.52-.16-.74.17-.22.32-.85 1.06-1.04 1.28-.19.22-.38.25-.71.08-.33-.16-1.39-.51-2.65-1.63-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.5.14-.67.15-.15.33-.38.49-.58.16-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.16-.73-1.79-1.02-2.45z",
        fill: "#25D366"
      }));
    case 'x':
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "white"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M17.2 3.5h2.9l-6.36 7.27L21.5 20.5h-5.86l-4.6-6-5.25 6H2.88l6.8-7.78L2.6 3.5h6l4.15 5.49zm-1.02 15.2h1.62L7.9 5.2H6.16z"
      }));
    default:
      return null;
  }
}
function SubscribeSheet(_ref11) {
  var open = _ref11.open,
    onClose = _ref11.onClose,
    onConfirm = _ref11.onConfirm;
  var TYPES = [{
    id: 'promo',
    label: '优惠或活动通知',
    desc: '限时折扣、大促、秒杀开抢提醒',
    icon: 'bolt'
  }, {
    id: 'benefit',
    label: '权益上新',
    desc: '新优惠券、会员权益第一时间知道',
    icon: 'gift'
  }, {
    id: 'content',
    label: '旅行内容推送',
    desc: '目的地灵感、攻略与热门榜单',
    icon: 'book'
  }];
  var _useState17 = useState({
      promo: true,
      benefit: true,
      content: true
    }),
    _useState18 = _slicedToArray(_useState17, 2),
    sel = _useState18[0],
    setSel = _useState18[1];
  useEffect(function () {
    if (open) setSel({
      promo: true,
      benefit: true,
      content: true
    });
  }, [open]);
  var toggle = function toggle(id) {
    return setSel(function (s) {
      return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, id, !s[id]));
    });
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "\u8BA2\u9605\u4F18\u60E0\u9891\u9053"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 16px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginBottom: 14,
      lineHeight: 1.5
    }
  }, "\u9009\u62E9\u4F60\u5E0C\u671B\u6536\u5230\u7684\u6D88\u606F\u7C7B\u578B\uFF0C\u8BA2\u9605\u540E\u968F\u65F6\u53EF\u8C03\u6574"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, TYPES.map(function (t) {
    var on = sel[t.id];
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: function onClick() {
        return toggle(t.id);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 4px',
        textAlign: 'left',
        width: '100%',
        background: 'transparent',
        border: 'none',
        transition: 'all .16s ease'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 11,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: on ? 'var(--brand)' : 'var(--surface-2)',
        transition: 'all .16s ease'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 16,
      color: on ? 'var(--on-brand,#fff)' : 'var(--text-muted)',
      fill: on ? 'var(--on-brand,#fff)' : 'none'
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 14.5,
        fontWeight: on ? 800 : 700,
        color: 'var(--text)',
        lineHeight: 1.2
      }
    }, t.label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 11.5,
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, t.desc)), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 999,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: on ? 'var(--brand)' : 'transparent',
        border: '1.5px solid ' + (on ? 'var(--brand)' : 'var(--hairline)'),
        transition: 'all .16s ease'
      }
    }, on && /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      color: "var(--on-brand,#fff)",
      stroke: 3
    })));
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-block",
    onClick: function onClick() {
      return onConfirm(sel);
    },
    style: {
      marginTop: 18,
      padding: '13px'
    }
  }, "\u786E\u8BA4\u8BA2\u9605"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)',
      textAlign: 'center',
      marginTop: 9
    }
  }, "\u53EF\u968F\u65F6\u5728\u9891\u9053\u9875\u53D6\u6D88\u8BA2\u9605")));
}

/* ---------------- 分享浮层 ---------------- */
function ShareSheet(_ref12) {
  var open = _ref12.open,
    onClose = _ref12.onClose,
    onPick = _ref12.onPick;
  var CHANNELS = [{
    id: 'wechat',
    label: '微信',
    bg: '#07C160',
    brand: true
  }, {
    id: 'instagram',
    label: 'Instagram',
    bg: 'linear-gradient(45deg,#F58529,#DD2A7B 52%,#8134AF)',
    brand: true
  }, {
    id: 'facebook',
    label: 'Facebook',
    bg: '#1877F2',
    brand: true
  }, {
    id: 'line',
    label: 'LINE',
    bg: '#06C755',
    brand: true
  }, {
    id: 'whatsapp',
    label: 'WhatsApp',
    bg: '#25D366',
    brand: true
  }, {
    id: 'x',
    label: 'X',
    bg: '#111',
    brand: true
  }, {
    id: 'copy',
    label: '复制链接',
    bg: 'var(--surface-2)',
    icon: 'link',
    fg: 'var(--text)'
  }, {
    id: 'more',
    label: '更多',
    bg: 'var(--surface-2)',
    icon: 'more',
    fg: 'var(--text)'
  }];
  return /*#__PURE__*/React.createElement(Sheet, {
    open: open,
    onClose: onClose,
    title: "\u5206\u4EAB\u5230"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 14px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: '18px 6px'
    }
  }, CHANNELS.map(function (c) {
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: function onClick() {
        return onPick(c);
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7,
        padding: '2px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 54,
        height: 54,
        borderRadius: 16,
        background: c.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 14px rgba(0,0,0,.14)',
        border: !c.brand ? '1px solid var(--hairline)' : 'none'
      }
    }, c.brand ? /*#__PURE__*/React.createElement(ShareBrandIcon, {
      id: c.id,
      size: 31
    }) : /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 25,
      color: c.fg || 'var(--text)',
      stroke: 1.9
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap'
      }
    }, c.label));
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-block",
    onClick: onClose,
    style: {
      marginTop: 20,
      padding: '12px'
    }
  }, "\u53D6\u6D88")));
}

/* ---------------- 通用居中确认弹窗 ---------------- */
function ConfirmDialog(_ref13) {
  var open = _ref13.open,
    title = _ref13.title,
    desc = _ref13.desc,
    confirmText = _ref13.confirmText,
    cancelText = _ref13.cancelText,
    onConfirm = _ref13.onConfirm,
    onClose = _ref13.onClose;
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,.45)',
      zIndex: 'var(--z-sheet)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: 'calc(var(--z-sheet) + 2)',
      width: '78%',
      maxWidth: 300,
      background: 'var(--surface)',
      borderRadius: 16,
      padding: '20px 18px 16px',
      boxShadow: '0 18px 50px rgba(0,0,0,.42)',
      textAlign: 'center',
      animation: 'floorIn .2s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16.5,
      fontWeight: 800,
      color: 'var(--text)',
      marginBottom: 7
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      lineHeight: 1.55,
      marginBottom: 18
    }
  }, desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn-block",
    onClick: onClose,
    style: {
      padding: '10px'
    }
  }, cancelText || '取消'), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-block",
    onClick: onConfirm,
    style: {
      padding: '10px'
    }
  }, confirmText || '确认'))));
}
Object.assign(window, {
  TopNav: TopNav,
  PageTabs: PageTabs,
  Toast: Toast,
  FamilySheet: FamilySheet,
  Sheet: Sheet,
  AIPanel: AIPanel,
  AIDock: AIDock,
  CitySwitcher: CitySwitcher,
  MODES: MODES,
  SubscribeSheet: SubscribeSheet,
  ShareSheet: ShareSheet,
  ConfirmDialog: ConfirmDialog
});

/* dc31fb8f-794a-40ed-a2c5-5588fd52c101.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["k", "label"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/* ============================================================
   OTA Demo — AG-UI 动态意图修正层
   中插组件(payloads) + 场景脚本(scenes) + 步骤描述
   挂载到 window.AGUI_PAYLOADS / window.AGUI_SCENES
   引擎(eng)由 app.jsx 注入
   ============================================================ */

/* ---------- 图片占位（Unsplash，传 src 给真实 Ph） ---------- */
var AG_PHOTO = {
  island: 'photo-1502602898657-3e91760cbb34',
  beach: 'photo-1507525428034-b723cf961d3e',
  aquarium: 'photo-1544551763-46a013bb70d5',
  sunset: 'photo-1514282401047-d79a71a590e8',
  culture: 'photo-1480714378408-67cf0d13bc1b',
  street: 'photo-1533050487297-09b450131914',
  castle: 'photo-1493780474015-ba834fd0ce2f',
  bridge: 'photo-1470229722913-7c0e2dbbafd3',
  resort: 'photo-1566073771259-6a8506099945',
  spa: 'photo-1571896349842-33c89424de2d',
  food: 'photo-1504674900247-0877df9cc836',
  sanya: 'photo-1505228395891-9a51e7e86bf6',
  xiamen: 'photo-1559592413-7cec4d0cae2b',
  phuket: 'photo-1537956965359-7573183d1f57',
  tokyo: 'photo-1540959733332-eab4deabeeaf',
  osaka: 'photo-1590559899731-a382839e5549',
  kyoto: 'photo-1493976040374-85c8e12f0c0e',
  dali: 'photo-1469474968028-56623f02e42e',
  hotelB: 'photo-1611892440504-42a792e24d32',
  hotelC: 'photo-1582719478250-c89cae4dc85b'
};
function agUrl(k) {
  var id = AG_PHOTO[k] || AG_PHOTO.beach;
  return window.__resources && window.__resources['ag_' + id] || "https://images.unsplash.com/".concat(id, "?auto=format&fit=crop&w=480&q=72");
}
function AgPh(_ref) {
  var k = _ref.k,
    label = _ref.label,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(Ph, _extends({
    label: label,
    src: agUrl(k)
  }, rest));
}

/* ---------- 中插外壳 ---------- */
function AgShell(_ref2) {
  var _ref2$icon = _ref2.icon,
    icon = _ref2$icon === void 0 ? 'spark' : _ref2$icon,
    title = _ref2.title,
    sub = _ref2.sub,
    action = _ref2.action,
    flashKey = _ref2.flashKey,
    children = _ref2.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "reco-card",
    style: {
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      background: 'var(--surface)',
      border: '1px solid color-mix(in srgb,var(--brand) 26%, var(--hairline))',
      boxShadow: '0 14px 34px rgba(0,0,0,.10)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      zIndex: 3,
      background: 'linear-gradient(180deg,var(--brand-strong),var(--brand))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 14px 10px 16px',
      borderBottom: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "reco-live-dot"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 800,
      color: 'var(--text)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15,
    color: "var(--brand)"
  }), title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, sub)), action), /*#__PURE__*/React.createElement("div", {
    key: flashKey,
    className: "reco-fade"
  }, children));
}
var agGhost = {
  background: 'var(--brand-soft)',
  color: 'var(--brand-strong)',
  fontWeight: 700,
  fontSize: 12.5,
  borderRadius: 999,
  padding: '5px 11px',
  border: '1.5px solid color-mix(in srgb,var(--brand) 42%, #fff 58%)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  whiteSpace: 'nowrap'
};
var agChip = {
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: 999,
  background: 'var(--brand-soft)',
  color: 'var(--brand-strong)',
  border: '1px solid color-mix(in srgb,var(--brand) 20%, transparent)'
};
var agChipOn = _objectSpread(_objectSpread({}, agChip), {}, {
  background: 'var(--brand)',
  color: 'var(--on-brand,#fff)',
  border: '1px solid transparent'
});

/* ============ 1 行程规划 ============ */
function AgTrip(_ref3) {
  var data = _ref3.data,
    flashKey = _ref3.flashKey;
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "cal",
    title: "AI \u884C\u7A0B\u89C4\u5212",
    sub: "\u6839\u636E\u4F60\u521A\u624D\u7684\u5BF9\u8BDD\u5B9E\u65F6\u751F\u6210",
    flashKey: flashKey,
    action: /*#__PURE__*/React.createElement("button", {
      style: agGhost
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "edit",
      size: 12,
      color: "currentColor"
    }), "\u8C03\u6574")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      padding: '10px 14px 4px 16px',
      flexWrap: 'wrap'
    }
  }, data.tags.map(function (t) {
    return /*#__PURE__*/React.createElement("span", {
      key: t,
      style: agChip
    }, t);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)',
      padding: '2px 14px 8px 16px',
      lineHeight: 1.4
    }
  }, data.note), data.days.map(function (d, di) {
    return /*#__PURE__*/React.createElement("div", {
      key: di,
      style: {
        padding: '8px 14px 2px 16px',
        borderTop: di > 0 ? '1px dashed var(--hairline)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: 'var(--text)',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 13,
      color: "var(--brand)"
    }), d.t), d.items.map(function (it, ii) {
      return /*#__PURE__*/React.createElement("div", {
        key: ii,
        style: {
          display: 'flex',
          gap: 10,
          paddingBottom: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: '0 0 38px',
          fontSize: 11.5,
          fontWeight: 700,
          color: 'var(--brand-strong)',
          paddingTop: 3
        }
      }, it.time), /*#__PURE__*/React.createElement(AgPh, {
        k: it.k,
        label: it.name,
        w: 44,
        h: 44,
        r: 10,
        style: {
          flex: '0 0 44px'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 700,
          color: 'var(--text)'
        }
      }, it.name), /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          marginTop: 4,
          display: 'inline-block'
        }
      }, it.tag)));
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 9,
      padding: '4px 14px 14px 16px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      flex: 1
    }
  }, "\u6362\u4E00\u6279\u73A9\u6CD5"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      flex: 1.4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    color: "currentColor"
  }), "\u52A0\u5165\u6211\u7684\u884C\u7A0B")));
}

/* ============ 2 目的地推荐 ============ */
function AgDestRec(_ref4) {
  var data = _ref4.data,
    flashKey = _ref4.flashKey;
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "compass",
    title: "\u4E3A\u4F60\u63A8\u8350\u76EE\u7684\u5730",
    sub: data.summary,
    flashKey: flashKey,
    action: /*#__PURE__*/React.createElement("button", {
      style: agGhost
    }, "\u6362\u4E00\u6279")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px 12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, data.list.map(function (d, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: d.name,
      style: {
        display: 'flex',
        gap: 10,
        padding: 8,
        alignItems: 'stretch',
        border: '1px solid var(--hairline)',
        borderRadius: 12,
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flex: '0 0 64px'
      }
    }, /*#__PURE__*/React.createElement(AgPh, {
      k: d.k,
      label: d.name,
      w: 64,
      h: 64,
      r: 10
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -6,
        left: -6,
        width: 20,
        height: 20,
        borderRadius: 99,
        background: 'var(--brand)',
        color: 'var(--on-brand,#fff)',
        fontSize: 12,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, i + 1)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, d.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)',
        margin: '2px 0 5px',
        lineHeight: 1.4
      }
    }, d.reason), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        flexWrap: 'wrap'
      }
    }, d.tags.map(function (t) {
      return /*#__PURE__*/React.createElement("span", {
        key: t,
        className: "tag"
      }, t);
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flex: '0 0 auto'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevR",
      size: 16,
      color: "var(--text-muted)"
    }), /*#__PURE__*/React.createElement("div", {
      className: "price",
      style: {
        fontSize: 15
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), d.price, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 600,
        color: 'var(--text-muted)'
      }
    }, "\u8D77"))));
  })));
}

/* ============ 3 预算反推 ============ */
function AgBudget(_ref5) {
  var data = _ref5.data,
    flashKey = _ref5.flashKey;
  var pct = (data.budget - data.min) / (data.max - data.min);
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "gauge",
    title: "\u9884\u7B97\u53CD\u63A8 \xB7 \u5E2E\u4F60\u627E\u53BB\u5F97\u8D77\u7684\u5730\u65B9",
    sub: "\u62D6\u52A8\u9884\u7B97\uFF0C\u76EE\u7684\u5730\u5B9E\u65F6\u589E\u51CF",
    flashKey: 0,
    action: /*#__PURE__*/React.createElement("span", {
      style: agChipOn
    }, "\xA5", data.budget)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 18px 2px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      color: 'var(--text-muted)',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA5", data.min), /*#__PURE__*/React.createElement("span", null, "\u9884\u7B97\u4E0A\u9650"), /*#__PURE__*/React.createElement("span", null, "\xA5", data.max)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 24,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 6,
      borderRadius: 99,
      background: 'var(--surface-2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      height: 6,
      borderRadius: 99,
      width: pct * 100 + '%',
      background: 'linear-gradient(90deg,var(--brand-light),var(--brand))',
      transition: 'width .25s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: pct * 100 + '%',
      width: 22,
      height: 22,
      borderRadius: 99,
      background: '#fff',
      border: '2px solid var(--brand)',
      boxShadow: '0 3px 8px rgba(0,0,0,.2)',
      transform: 'translateX(-50%)',
      transition: 'left .25s ease'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    key: flashKey,
    className: "reco-fade",
    style: {
      padding: '6px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--brand-strong)',
      fontWeight: 700,
      marginBottom: 8
    }
  }, data.list.length, " \u4E2A\u76EE\u7684\u5730\u5728\u4F60\u7684\u9884\u7B97\u5185 \uD83D\uDC47"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, data.list.map(function (d) {
    return /*#__PURE__*/React.createElement("div", {
      key: d.name,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(AgPh, {
      k: d.k,
      label: d.name,
      w: 48,
      h: 48,
      r: 9,
      style: {
        flex: '0 0 48px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, d.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, d.note)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "price",
      style: {
        fontSize: 15
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), d.price), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#2BA66A',
        fontWeight: 700
      }
    }, "\u9884\u7B97\u5185")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 14px 14px 16px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      width: '100%'
    }
  }, "\u6309\u6B64\u9884\u7B97\u770B\u5B8C\u6574\u65B9\u6848")));
}

/* ============ 4 多城连游 ============ */
function AgMultiCity(_ref6) {
  var data = _ref6.data,
    flashKey = _ref6.flashKey;
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "route",
    title: "\u591A\u57CE\u8FDE\u6E38 \xB7 \u8DEF\u7EBF\u89C4\u5212",
    sub: "\u5171 ".concat(data.cities.length, " \u57CE \xB7 \u5DF2\u4E32\u6210\u6700\u987A\u52A8\u7EBF"),
    flashKey: flashKey,
    action: /*#__PURE__*/React.createElement("button", {
      style: agGhost
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "refresh",
      size: 12,
      color: "currentColor"
    }), "\u4F18\u5316")
  }, /*#__PURE__*/React.createElement("div", {
    key: flashKey,
    className: "reco-fade",
    style: {
      padding: '10px 14px 6px 16px'
    }
  }, data.cities.map(function (c, i) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: c.name
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 99,
        background: 'var(--brand)',
        color: 'var(--on-brand,#fff)',
        fontSize: 12,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto'
      }
    }, i + 1), /*#__PURE__*/React.createElement(AgPh, {
      k: c.k,
      label: c.name,
      w: 40,
      h: 40,
      r: 9,
      style: {
        flex: '0 0 40px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 800,
        color: 'var(--text)'
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, "\u505C\u7559 ", c.nights, " \u665A \xB7 ", c.hi)), /*#__PURE__*/React.createElement(Icon, {
      name: "grip",
      size: 18,
      color: "var(--text-muted)"
    })), i < data.cities.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 0 4px 20px',
        margin: '2px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 2,
        height: 18,
        background: 'var(--hairline)',
        marginLeft: 9
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        color: 'var(--text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "train",
      size: 11,
      color: "var(--text-muted)"
    }), c.transit)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 16px 14px',
      borderTop: '1px solid var(--hairline)',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "\u603B\u65F6\u957F ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text)'
    }
  }, data.totalDays, "\u5929"), " \xB7 \u4EA4\u901A ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--price-color)'
    }
  }, "\xA5", data.totalCost)), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      padding: '7px 14px',
      fontSize: 13
    }
  }, "\u751F\u6210\u8BE6\u7EC6\u8DEF\u4E66")));
}

/* ============ 5 机酒打包 ============ */
function AgBundle(_ref7) {
  var data = _ref7.data,
    flashKey = _ref7.flashKey;
  var row = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    borderBottom: '1px solid var(--hairline)'
  };
  var ic = {
    width: 30,
    height: 30,
    borderRadius: 9,
    background: 'var(--brand-soft)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto'
  };
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "bed",
    title: "\u673A + \u9152 \u6253\u5305",
    sub: "\u6309\u4F60\u5E38\u98DE\u7684\u65F6\u95F4\u914D\u4E86\u4E00\u7248",
    flashKey: flashKey,
    action: /*#__PURE__*/React.createElement("span", {
      style: agChipOn
    }, data.date)
  }, /*#__PURE__*/React.createElement("div", {
    key: flashKey,
    className: "reco-fade",
    style: {
      padding: '4px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: row
  }, /*#__PURE__*/React.createElement("span", {
    style: ic
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plane",
    size: 16,
    color: "var(--brand-strong)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, data.flight.dep, " \u2708 ", data.flight.arr), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 1
    }
  }, data.flight.info)), /*#__PURE__*/React.createElement("span", {
    className: "price",
    style: {
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, "\xA5"), data.flight.price)), /*#__PURE__*/React.createElement("div", {
    style: _objectSpread(_objectSpread({}, row), {}, {
      borderBottom: 'none'
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: ic
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "building",
    size: 16,
    color: "var(--brand-strong)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 800,
      color: 'var(--text)'
    }
  }, data.hotel.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 1
    }
  }, data.hotel.info)), /*#__PURE__*/React.createElement("span", {
    className: "price",
    style: {
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, "\xA5"), data.hotel.price))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '2px 16px 14px',
      padding: '10px 12px',
      borderRadius: 12,
      background: 'var(--brand-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)'
    }
  }, "\u6253\u5305\u4EF7"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "price",
    style: {
      fontSize: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cur"
  }, "\xA5"), data.total), /*#__PURE__*/React.createElement("span", {
    className: "badge-disc"
  }, "\u6253\u5305\u7701 \xA5", data.save))), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      padding: '7px 16px'
    }
  }, "\u53BB\u9884\u8BA2")));
}

/* ============ 6 找特价 ============ */
function AgDeals(_ref8) {
  var data = _ref8.data,
    flashKey = _ref8.flashKey;
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "bolt",
    title: "\u4ECA\u665A\u6361\u6F0F \xB7 \u7279\u4EF7\u805A\u5408",
    sub: "\u5DF2\u6309\u300C\u7ACB\u7701\u300D\u4ECE\u9AD8\u5230\u4F4E\u6392\u5E8F",
    flashKey: flashKey,
    action: /*#__PURE__*/React.createElement("span", {
      style: agChipOn
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "fire",
      size: 11,
      color: "currentColor"
    }), "\u5B9E\u65F6")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 14px 12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, data.list.map(function (d) {
    return /*#__PURE__*/React.createElement("div", {
      key: d.title,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(AgPh, {
      k: d.k,
      label: d.title,
      w: 54,
      h: 54,
      r: 9,
      style: {
        flex: '0 0 54px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--text)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, d.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "price",
      style: {
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), d.price), /*#__PURE__*/React.createElement("span", {
      className: "price-origin"
    }, "\xA5", d.origin), d.left && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: '#fff',
        background: 'linear-gradient(135deg,#F2643C,#DC3A2A)',
        padding: '2px 6px',
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 9,
      color: "currentColor"
    }), "\u4EC5\u5269", d.left))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: '0 0 auto',
        background: 'linear-gradient(135deg,#F04060,#DC1850)',
        color: '#fff',
        fontWeight: 800,
        fontSize: 12,
        padding: '5px 9px',
        borderRadius: 9,
        textAlign: 'center',
        lineHeight: 1.2
      }
    }, "\u7ACB\u7701", /*#__PURE__*/React.createElement("br", null), "\xA5", d.save));
  })));
}

/* ============ 7 酒店对比 ============ */
function AgCompare(_ref9) {
  var data = _ref9.data,
    flashKey = _ref9.flashKey;
  var th = {
    padding: '8px 7px',
    borderBottom: '1px solid var(--hairline)',
    textAlign: 'center',
    fontWeight: 800,
    color: 'var(--text)',
    background: 'var(--surface-2)',
    fontSize: 12
  };
  var td = {
    padding: '8px 7px',
    borderBottom: '1px solid var(--hairline)',
    textAlign: 'center',
    fontSize: 12,
    verticalAlign: 'middle'
  };
  var tdL = _objectSpread(_objectSpread({}, td), {}, {
    textAlign: 'left',
    color: 'var(--text-muted)',
    fontWeight: 700,
    background: 'var(--surface)'
  });
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "building",
    title: "\u9152\u5E97\u6A2A\u5411\u5BF9\u6BD4",
    sub: "\u6B63\u5728\u5BF9\u6BD4 ".concat(data.hotels.length, " \u5BB6 \xB7 \u8FFD\u95EE\u53EF\u52A0\u7EF4\u5EA6"),
    flashKey: 0,
    action: /*#__PURE__*/React.createElement("button", {
      style: agGhost
    }, "\u6362\u9152\u5E97")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px 14px'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: _objectSpread(_objectSpread({}, th), {}, {
      background: 'var(--surface)'
    })
  }), data.hotels.map(function (h) {
    return /*#__PURE__*/React.createElement("th", {
      key: h,
      style: th
    }, h);
  }))), /*#__PURE__*/React.createElement("tbody", null, data.rows.map(function (r, ri) {
    return /*#__PURE__*/React.createElement("tr", {
      key: r.label,
      className: r.isNew ? 'reco-fade' : ''
    }, /*#__PURE__*/React.createElement("td", {
      style: tdL
    }, r.label), r.vals.map(function (v, ci) {
      return /*#__PURE__*/React.createElement("td", {
        key: ci,
        style: _objectSpread(_objectSpread({}, td), {}, {
          color: ci === r.bestIdx ? 'var(--brand-strong)' : 'var(--text)',
          fontWeight: ci === r.bestIdx ? 800 : 500
        })
      }, v, ci === r.bestIdx && r.bestMark && /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'block',
          fontSize: 9.5,
          color: 'var(--brand)'
        }
      }, r.bestMark));
    }));
  })))));
}

/* ============ 8 地面交通（不想坐飞机） ============ */
function AgTransport(_ref0) {
  var data = _ref0.data,
    flashKey = _ref0.flashKey;
  return /*#__PURE__*/React.createElement(AgShell, {
    icon: "train",
    title: "\u5230\u8FBE\u65B9\u5F0F \xB7 \u5DF2\u6362\u5730\u9762\u4EA4\u901A\u4F18\u5148",
    sub: "\u9AD8\u94C1 / \u81EA\u9A7E\u4E0A\u79FB\uFF0C\u822A\u73ED\u4FDD\u7559\u57AB\u5E95",
    flashKey: flashKey,
    action: /*#__PURE__*/React.createElement("span", {
      style: agChipOn
    }, "\u4E0D\u5750\u98DE\u673A")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 14px 12px'
    }
  }, data.list.map(function (o, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: o.title,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '10px 0',
        borderBottom: i < data.list.length - 1 ? '1px solid var(--hairline)' : 'none',
        opacity: o.dim ? 0.6 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        background: 'var(--brand-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: o.icon,
      size: 18,
      color: "var(--brand-strong)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 800,
        color: 'var(--text)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, o.title, o.tag && /*#__PURE__*/React.createElement("span", {
      className: "tag"
    }, o.tag)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, o.sub)), /*#__PURE__*/React.createElement("span", {
      className: "price",
      style: {
        fontSize: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "cur"
    }, "\xA5"), o.price, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)'
      }
    }, "\u8D77")));
  })));
}
window.AGUI_PAYLOADS = {
  trip: AgTrip,
  destRec: AgDestRec,
  budget: AgBudget,
  multiCity: AgMultiCity,
  bundle: AgBundle,
  deals: AgDeals,
  compare: AgCompare,
  transport: AgTransport
};

/* 9e0c9db8-2b66-412a-9d7e-2d532e078711.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* ============================================================
   OTA Demo — AG-UI 10 个场景脚本 + 步骤描述
   run(eng) 由 app.jsx 注入引擎
   ============================================================ */

/* ---------------- 数据 ---------------- */
var AGD = {
  tripRelax: {
    tags: ['3 天', '亲子', '轻松'],
    note: '节奏轻松 · 每天 2 个核心安排，午后留白给娃休息',
    days: [{
      t: 'Day 1 · 海岸初见',
      items: [{
        time: '14:00',
        name: '美丽海水族馆',
        tag: '遛娃首选',
        k: 'aquarium'
      }, {
        time: '18:30',
        name: '濑长岛海景晚餐',
        tag: '日落',
        k: 'sunset'
      }]
    }, {
      t: 'Day 2 · 玩沙踏浪',
      items: [{
        time: '10:00',
        name: '残波岬浅水海滩',
        tag: '安全戏水',
        k: 'beach'
      }, {
        time: '15:00',
        name: '文化王国手作体验',
        tag: '亲子手作',
        k: 'culture'
      }]
    }, {
      t: 'Day 3 · 城市慢逛',
      items: [{
        time: '10:30',
        name: '国际通伴手礼街',
        tag: '逛吃',
        k: 'street'
      }, {
        time: '14:00',
        name: '首里城公园',
        tag: '世界遗产',
        k: 'castle'
      }]
    }]
  },
  tripCompact: {
    tags: ['2 天', '亲子', '紧凑'],
    note: '已压缩为 2 天 · 每天 3 个安排，按就近动线串联，少走回头路',
    days: [{
      t: 'Day 1 · 北部海岸一日',
      items: [{
        time: '09:30',
        name: '美丽海水族馆',
        tag: '开馆即玩',
        k: 'aquarium'
      }, {
        time: '13:00',
        name: '古宇利岛大桥',
        tag: '网红打卡',
        k: 'bridge'
      }, {
        time: '17:30',
        name: '万座毛看日落',
        tag: '日落',
        k: 'sunset'
      }]
    }, {
      t: 'Day 2 · 南部文化一日',
      items: [{
        time: '09:30',
        name: '首里城公园',
        tag: '世界遗产',
        k: 'castle'
      }, {
        time: '12:30',
        name: '国际通午餐 + 购物',
        tag: '逛吃',
        k: 'street'
      }, {
        time: '15:30',
        name: '濑长岛 outlet',
        tag: '亲子',
        k: 'culture'
      }]
    }]
  },
  tripEasy: {
    tags: ['3 天', '亲子', '慢节奏'],
    note: '已进一步放慢 · 每天只排 1–2 个核心，午后全部留白给娃午休',
    days: [{
      t: 'Day 1 · 睡到自然醒',
      items: [{
        time: '10:30',
        name: '美丽海水族馆',
        tag: '遛娃首选',
        k: 'aquarium'
      }, {
        time: '16:30',
        name: '濑长岛海景晚餐',
        tag: '看日落',
        k: 'sunset'
      }]
    }, {
      t: 'Day 2 · 只玩一片海',
      items: [{
        time: '10:30',
        name: '残波岬浅水海滩',
        tag: '安全戏水',
        k: 'beach'
      }]
    }, {
      t: 'Day 3 · 慢逛回程',
      items: [{
        time: '11:00',
        name: '国际通伴手礼街',
        tag: '逛吃',
        k: 'street'
      }]
    }]
  },
  destFar: {
    summary: '海岛 · 亲子 · 中等预算',
    list: [{
      k: 'island',
      name: '冲绳',
      reason: '直飞 3h，水族馆+浅水沙滩，亲子友好度最高',
      price: 1680,
      tags: ['免签', '适合娃']
    }, {
      k: 'phuket',
      name: '普吉岛',
      reason: '无边泳池度假村多，海鲜便宜，飞行约 4.5h',
      price: 1980,
      tags: ['泳池', '落地签']
    }, {
      k: 'beach',
      name: '长滩岛',
      reason: '白沙滩平缓适合小童戏水，节奏慢',
      price: 2280,
      tags: ['白沙滩']
    }]
  },
  destNear: {
    summary: '近距离海岛 · 亲子 · 飞行更短',
    list: [{
      k: 'sanya',
      name: '三亚',
      reason: '国内直飞，亚龙湾浅水沙滩，免出境更省心',
      price: 1280,
      tags: ['国内', '椰风']
    }, {
      k: 'xiamen',
      name: '厦门',
      reason: '高铁可达，鼓浪屿+海边亲子，飞行 1.5h',
      price: 980,
      tags: ['高铁可达']
    }, {
      k: 'beach',
      name: '北海涠洲岛',
      reason: '火山岛地质奇观，人少水清，适合放电',
      price: 1180,
      tags: ['人少']
    }]
  },
  budget3000: {
    budget: 3000,
    min: 1500,
    max: 8000,
    list: [{
      k: 'sanya',
      name: '三亚 3 天 2 晚',
      note: '机+酒打包 · 含早',
      price: 2680
    }, {
      k: 'dali',
      name: '大理 4 天',
      note: '高铁 + 洱海民宿',
      price: 2380
    }, {
      k: 'xiamen',
      name: '厦门周末游',
      note: '高铁 1.5h 直达',
      price: 1980
    }]
  },
  budget5000: {
    budget: 5000,
    min: 1500,
    max: 8000,
    list: [{
      k: 'sanya',
      name: '三亚 4 天 3 晚',
      note: '升级海景房',
      price: 3880
    }, {
      k: 'island',
      name: '冲绳 4 天',
      note: '直飞 + 水族馆',
      price: 4680
    }, {
      k: 'phuket',
      name: '普吉岛 5 天',
      note: '无边泳池度假村',
      price: 4980
    }, {
      k: 'dali',
      name: '大理深度 5 天',
      note: '苍山洱海慢游',
      price: 2980
    }]
  },
  routeA: {
    totalDays: 5,
    totalCost: 1180,
    cities: [{
      k: 'tokyo',
      name: '东京',
      nights: 2,
      hi: '购物+迪士尼',
      transit: '新干线 → 大阪 约 2.5h'
    }, {
      k: 'osaka',
      name: '大阪',
      nights: 2,
      hi: '环球影城+美食',
      transit: '电车 → 京都 约 45min'
    }, {
      k: 'kyoto',
      name: '京都',
      nights: 1,
      hi: '古寺+和服',
      transit: ''
    }]
  },
  routeB: {
    totalDays: 5,
    totalCost: 980,
    cities: [{
      k: 'tokyo',
      name: '东京',
      nights: 2,
      hi: '购物+迪士尼',
      transit: '新干线 → 京都 约 2.2h'
    }, {
      k: 'kyoto',
      name: '京都',
      nights: 1,
      hi: '古寺+和服',
      transit: '电车 → 大阪 约 45min'
    }, {
      k: 'osaka',
      name: '大阪',
      nights: 2,
      hi: '环球影城+美食',
      transit: ''
    }]
  },
  bundleWed: {
    date: '周三出发',
    flight: {
      dep: '上海',
      arr: '冲绳',
      price: 980,
      info: '周三 09:20 直飞 · 约 3h'
    },
    hotel: {
      name: '那霸丽思海景酒店',
      price: 2560,
      info: '高级海景房 × 2 晚'
    },
    total: 3240,
    save: 300
  },
  bundleFri: {
    date: '周五出发',
    flight: {
      dep: '上海',
      arr: '冲绳',
      price: 1180,
      info: '周五 10:05 直飞 · 约 3h'
    },
    hotel: {
      name: '那霸丽思海景酒店',
      price: 2780,
      info: '高级海景房 × 2 晚'
    },
    total: 3580,
    save: 380
  },
  cmpA: {
    hotels: ['丽思海景', '万豪Spa', '都市精选'],
    rows: [{
      label: '每晚价格',
      vals: ['¥1280', '¥1580', '¥680'],
      bestIdx: 2,
      bestMark: '最低'
    }, {
      label: '评分',
      vals: ['4.8', '4.7', '4.5'],
      bestIdx: 0,
      bestMark: '最高'
    }, {
      label: '位置',
      vals: ['国际通', '恩纳沙滩', '单轨站'],
      bestIdx: 0
    }, {
      label: '早餐',
      vals: ['含', '含', '另付'],
      bestIdx: 0
    }, {
      label: '泳池',
      vals: ['室外', '无边+儿童', '无'],
      bestIdx: 1,
      bestMark: '最优'
    }]
  },
  cmpB: {
    hotels: ['丽思海景', '万豪Spa', '都市精选'],
    rows: [{
      label: '每晚价格',
      vals: ['¥1280', '¥1580', '¥680'],
      bestIdx: 2,
      bestMark: '最低'
    }, {
      label: '评分',
      vals: ['4.8', '4.7', '4.5'],
      bestIdx: 0,
      bestMark: '最高'
    }, {
      label: '位置',
      vals: ['国际通', '恩纳沙滩', '单轨站'],
      bestIdx: 0
    }, {
      label: '早餐',
      vals: ['含', '含', '另付'],
      bestIdx: 0
    }, {
      label: '泳池',
      vals: ['室外', '无边+儿童', '无'],
      bestIdx: 1,
      bestMark: '最优'
    }, {
      label: '免费取消',
      vals: ['入住前1天', '入住前3天', '不可取消'],
      bestIdx: 1,
      bestMark: '最灵活',
      isNew: true
    }]
  },
  deals: {
    list: [{
      k: 'resort',
      title: '丽思海景房 今夜特价',
      price: 780,
      origin: 1280,
      save: 500,
      left: '3间'
    }, {
      k: 'food',
      title: '和牛自助 双人 限时',
      price: 198,
      origin: 398,
      save: 200,
      left: '8份'
    }, {
      k: 'island',
      title: '美之海一日游 尾票',
      price: 228,
      origin: 328,
      save: 100,
      left: ''
    }, {
      k: 'spa',
      title: '海景温泉 今晚可订',
      price: 138,
      origin: 288,
      save: 150,
      left: '5位'
    }]
  },
  transGround: {
    list: [{
      icon: 'train',
      title: '高铁 + 轮渡联运',
      sub: '全程约 8h · 沿海风景线',
      price: 540,
      tag: '推荐'
    }, {
      icon: 'car',
      title: '自驾 + 跨海大桥',
      sub: '灵活停靠 · 约 9h',
      price: 430,
      tag: '自由'
    }, {
      icon: 'plane',
      title: '保留：直飞航班',
      sub: '约 3h',
      price: 980,
      tag: '',
      dim: true
    }]
  }
};

/* ---------------- 场景 ---------------- */
var AGUI_SCENES = [{
  no: '01',
  title: '目的地推荐',
  tags: ['G 摘要待命', 'A 中插展开', 'B 原地刷新'],
  steps: ['灵感阶段用户没怎么浏览，直接问 AI「推荐个目的地」', 'AI 反问偏好（海岛/预算/同行人），用户一句话确认', '在当前位置中插「目的地推荐」摘要卡并展开，3 个候选待交互', '用户追问「近一点的」，同一组件原地刷新为近距离海岛'],
  run: function () {
    var _run = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S1',
              city: null
            });
          case 1:
            _context.n = 2;
            return e.scrollTop();
          case 2:
            _context.n = 3;
            return e.sleep(700);
          case 3:
            _context.n = 4;
            return e.chat(true);
          case 4:
            _context.n = 5;
            return e.say('user', '假期还没定，给我推荐个目的地吧');
          case 5:
            _context.n = 6;
            return e.think(900);
          case 6:
            _context.n = 7;
            return e.say('ai', '想要海岛 / 城市 / 山野？预算和同行人大概是？');
          case 7:
            _context.n = 8;
            return e.sleep(700);
          case 8:
            _context.n = 9;
            return e.say('user', '海岛，带娃，预算中等就好');
          case 9:
            _context.n = 10;
            return e.think(1000);
          case 10:
            _context.n = 11;
            return e.say('ai', '好，先给你 3 个海岛亲子目的地的精简推荐 👇');
          case 11:
            _context.n = 12;
            return e.sleep(600);
          case 12:
            _context.n = 13;
            return e.chat(false);
          case 13:
            _context.n = 14;
            return e.sleep(450);
          case 14:
            _context.n = 15;
            return e.setInsert('destRec', AGD.destFar, 'top');
          case 15:
            _context.n = 16;
            return e.expand();
          case 16:
            _context.n = 17;
            return e.sleep(1900);
          case 17:
            _context.n = 18;
            return e.chat(true);
          case 18:
            _context.n = 19;
            return e.sleep(300);
          case 19:
            _context.n = 20;
            return e.say('user', '更想要近一点、飞行时间短的');
          case 20:
            _context.n = 21;
            return e.think(900);
          case 21:
            _context.n = 22;
            return e.say('ai', '懂，换成近距离海岛，已原地更新～');
          case 22:
            _context.n = 23;
            return e.sleep(600);
          case 23:
            _context.n = 24;
            return e.chat(false);
          case 24:
            _context.n = 25;
            return e.sleep(450);
          case 25:
            _context.n = 26;
            return e.refresh(AGD.destNear);
          case 26:
            return _context.a(2);
        }
      }, _callee);
    }));
    function run(_x) {
      return _run.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '02',
  title: '预算反推',
  tags: ['F 可调控件', 'B 原地刷新'],
  steps: ['用户以预算发起：「我只有 3000 块能去哪」', '中插「预算反推」控件：滑杆 + 预算内目的地列表', '拖动预算滑杆，目的地实时增减', '用户说「加到五千」，滑杆与列表原地更新'],
  run: function () {
    var _run2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S1',
              city: null
            });
          case 1:
            _context2.n = 2;
            return e.scrollTop();
          case 2:
            _context2.n = 3;
            return e.sleep(700);
          case 3:
            _context2.n = 4;
            return e.chat(true);
          case 4:
            _context2.n = 5;
            return e.say('user', '我只有 3000 块，能去哪玩？');
          case 5:
            _context2.n = 6;
            return e.think(900);
          case 6:
            _context2.n = 7;
            return e.say('ai', '好，按 3000 元帮你反推，拖动预算还能调～');
          case 7:
            _context2.n = 8;
            return e.sleep(600);
          case 8:
            _context2.n = 9;
            return e.chat(false);
          case 9:
            _context2.n = 10;
            return e.sleep(450);
          case 10:
            _context2.n = 11;
            return e.setInsert('budget', AGD.budget3000, 'top');
          case 11:
            _context2.n = 12;
            return e.expand();
          case 12:
            _context2.n = 13;
            return e.sleep(1600);
          case 13:
            _context2.n = 14;
            return e.chat(true);
          case 14:
            _context2.n = 15;
            return e.sleep(300);
          case 15:
            _context2.n = 16;
            return e.say('user', '预算能到五千，看看能多去哪');
          case 16:
            _context2.n = 17;
            return e.think(800);
          case 17:
            _context2.n = 18;
            return e.say('ai', '好的，已把预算拉到 5000，结果实时变多了 👇');
          case 18:
            _context2.n = 19;
            return e.sleep(600);
          case 19:
            _context2.n = 20;
            return e.chat(false);
          case 20:
            _context2.n = 21;
            return e.sleep(400);
          case 21:
            _context2.n = 22;
            return e.update(_objectSpread(_objectSpread({}, AGD.budget3000), {}, {
              budget: 3900
            }));
          case 22:
            _context2.n = 23;
            return e.sleep(450);
          case 23:
            _context2.n = 24;
            return e.update(_objectSpread(_objectSpread({}, AGD.budget3000), {}, {
              budget: 4500,
              list: AGD.budget5000.list.slice(0, 3)
            }));
          case 24:
            _context2.n = 25;
            return e.sleep(450);
          case 25:
            _context2.n = 26;
            return e.refresh(AGD.budget5000);
          case 26:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    function run(_x2) {
      return _run2.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '03',
  title: '行程规划',
  tags: ['A 中插展开', 'B 原地刷新'],
  chip: '行程规划',
  steps: ['决策中的用户在 feeds 浏览到一半，点底部「行程规划」气泡', 'AI 反问玩几天、什么偏好，用户一句话确认', '在当前浏览位置中插行程组件，高度 0→展开', '用户追问「压缩成 2 天」，同一组件原地刷新，不重新插入'],
  run: function () {
    var _run3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S2',
              city: '冲绳'
            });
          case 1:
            _context3.n = 2;
            return e.scrollModule('feeds');
          case 2:
            _context3.n = 3;
            return e.sleep(700);
          case 3:
            _context3.n = 4;
            return e.chat(true);
          case 4:
            _context3.n = 5;
            return e.say('user', '帮我规划一下行程');
          case 5:
            _context3.n = 6;
            return e.think(900);
          case 6:
            _context3.n = 7;
            return e.say('ai', '好的～想玩几天？有什么偏好（亲子 / 美食 / 轻松节奏）？');
          case 7:
            _context3.n = 8;
            return e.sleep(700);
          case 8:
            _context3.n = 9;
            return e.say('user', '3 天，带孩子，节奏轻松点');
          case 9:
            _context3.n = 10;
            return e.think(1000);
          case 10:
            _context3.n = 11;
            return e.say('ai', '明白，已按「3 天 · 亲子 · 轻松」生成，正在你浏览的位置展开 👇');
          case 11:
            _context3.n = 12;
            return e.sleep(700);
          case 12:
            _context3.n = 13;
            return e.chat(false);
          case 13:
            _context3.n = 14;
            return e.sleep(450);
          case 14:
            _context3.n = 15;
            return e.setInsert('trip', AGD.tripRelax, 'feeds');
          case 15:
            _context3.n = 16;
            return e.expand();
          case 16:
            _context3.n = 17;
            return e.sleep(1300);
          case 17:
            _context3.n = 18;
            return e.browse();
          case 18:
            _context3.n = 19;
            return e.sleep(500);
          case 19:
            _context3.n = 20;
            return e.chat(true);
          case 20:
            _context3.n = 21;
            return e.sleep(300);
          case 21:
            _context3.n = 22;
            return e.say('user', '感觉有点松，压缩成 2 天吧');
          case 22:
            _context3.n = 23;
            return e.think(900);
          case 23:
            _context3.n = 24;
            return e.say('ai', '好的，已就近重排为「2 天 · 紧凑版」，组件原地更新～');
          case 24:
            _context3.n = 25;
            return e.sleep(600);
          case 25:
            _context3.n = 26;
            return e.chat(false);
          case 26:
            _context3.n = 27;
            return e.sleep(450);
          case 27:
            _context3.n = 28;
            return e.refresh(AGD.tripCompact);
          case 28:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    function run(_x3) {
      return _run3.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '04',
  title: '多城连游',
  tags: ['A 中插展开', 'F 可拖重排'],
  steps: ['用户想「一次连游 3 个城市」', '中插多城连线路书，城市节点 + 段间交通，可拖动调整顺序', '用户调整城市顺序，路线与总时长/交通费实时重算'],
  run: function () {
    var _run4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(e) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S1',
              city: null
            });
          case 1:
            _context4.n = 2;
            return e.scrollTop();
          case 2:
            _context4.n = 3;
            return e.sleep(700);
          case 3:
            _context4.n = 4;
            return e.chat(true);
          case 4:
            _context4.n = 5;
            return e.say('user', '这趟想一次连游 3 个城市');
          case 5:
            _context4.n = 6;
            return e.think(900);
          case 6:
            _context4.n = 7;
            return e.say('ai', '好的，帮你把东京·大阪·京都串成最顺的动线 👇');
          case 7:
            _context4.n = 8;
            return e.sleep(600);
          case 8:
            _context4.n = 9;
            return e.chat(false);
          case 9:
            _context4.n = 10;
            return e.sleep(450);
          case 10:
            _context4.n = 11;
            return e.setInsert('multiCity', AGD.routeA, 'top');
          case 11:
            _context4.n = 12;
            return e.expand();
          case 12:
            _context4.n = 13;
            return e.sleep(1800);
          case 13:
            _context4.n = 14;
            return e.chat(true);
          case 14:
            _context4.n = 15;
            return e.sleep(300);
          case 15:
            _context4.n = 16;
            return e.say('user', '把京都放中间，最后留大阪逛吃');
          case 16:
            _context4.n = 17;
            return e.think(900);
          case 17:
            _context4.n = 18;
            return e.say('ai', '已重排顺序并重算交通，这样更顺、还省了 ¥200 👇');
          case 18:
            _context4.n = 19;
            return e.sleep(600);
          case 19:
            _context4.n = 20;
            return e.chat(false);
          case 20:
            _context4.n = 21;
            return e.sleep(450);
          case 21:
            _context4.n = 22;
            return e.refresh(AGD.routeB);
          case 22:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    function run(_x4) {
      return _run4.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '05',
  title: '机酒打包',
  tags: ['A 中插展开', 'B 原地刷新'],
  steps: ['用户「帮我把机票 + 酒店配成打包价」', '中插「机+酒打包器」，含去返程、酒店、打包总价', '用户改出发日，航班时间与打包价原地刷新'],
  run: function () {
    var _run5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(e) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S2',
              city: '冲绳'
            });
          case 1:
            _context5.n = 2;
            return e.scrollModule('feeds');
          case 2:
            _context5.n = 3;
            return e.sleep(700);
          case 3:
            _context5.n = 4;
            return e.chat(true);
          case 4:
            _context5.n = 5;
            return e.say('user', '帮我把机票和酒店配成一个打包价');
          case 5:
            _context5.n = 6;
            return e.think(900);
          case 6:
            _context5.n = 7;
            return e.say('ai', '按你常飞的周三出发配了一版，机+酒打包更省 👇');
          case 7:
            _context5.n = 8;
            return e.sleep(600);
          case 8:
            _context5.n = 9;
            return e.chat(false);
          case 9:
            _context5.n = 10;
            return e.sleep(450);
          case 10:
            _context5.n = 11;
            return e.setInsert('bundle', AGD.bundleWed, 'feeds');
          case 11:
            _context5.n = 12;
            return e.expand();
          case 12:
            _context5.n = 13;
            return e.sleep(1800);
          case 13:
            _context5.n = 14;
            return e.chat(true);
          case 14:
            _context5.n = 15;
            return e.sleep(300);
          case 15:
            _context5.n = 16;
            return e.say('user', '改成周五出发');
          case 16:
            _context5.n = 17;
            return e.think(900);
          case 17:
            _context5.n = 18;
            return e.say('ai', '好的，已换周五航班，打包价已更新～');
          case 18:
            _context5.n = 19;
            return e.sleep(600);
          case 19:
            _context5.n = 20;
            return e.chat(false);
          case 20:
            _context5.n = 21;
            return e.sleep(450);
          case 21:
            _context5.n = 22;
            return e.refresh(AGD.bundleFri);
          case 22:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    function run(_x5) {
      return _run5.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '06',
  title: '不想坐飞机',
  tags: ['C 楼层重排', 'A 中插展开'],
  steps: ['用户「不想坐飞机，有别的方式吗」', '把「到达方式」重排：高铁 / 自驾上移置顶', '原航班方案降级保留，方案列表平滑切换'],
  run: function () {
    var _run6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(e) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S2',
              city: '冲绳'
            });
          case 1:
            _context6.n = 2;
            return e.scrollModule('feeds');
          case 2:
            _context6.n = 3;
            return e.sleep(700);
          case 3:
            _context6.n = 4;
            return e.chat(true);
          case 4:
            _context6.n = 5;
            return e.say('user', '不想坐飞机，有别的方式吗？');
          case 5:
            _context6.n = 6;
            return e.think(900);
          case 6:
            _context6.n = 7;
            return e.say('ai', '好的，已把「到达方式」换成高铁 / 自驾优先，航班保留垫底 👇');
          case 7:
            _context6.n = 8;
            return e.sleep(600);
          case 8:
            _context6.n = 9;
            return e.chat(false);
          case 9:
            _context6.n = 10;
            return e.sleep(450);
          case 10:
            _context6.n = 11;
            return e.setInsert('transport', AGD.transGround, 'feeds');
          case 11:
            _context6.n = 12;
            return e.expand();
          case 12:
            _context6.n = 13;
            return e.sleep(1200);
          case 13:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    function run(_x6) {
      return _run6.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '07',
  title: '比较酒店',
  tags: ['E 对比视图', 'B 加行刷新'],
  chip: '比较酒店',
  steps: ['用户「帮我比较这几家酒店」', '中插横向对比表（价格/评分/位置/早餐/泳池）', '用户追加维度「能否免费取消」，对比表即时加一行'],
  run: function () {
    var _run7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(e) {
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            _context7.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S2',
              city: '冲绳'
            });
          case 1:
            _context7.n = 2;
            return e.scrollModule('feeds');
          case 2:
            _context7.n = 3;
            return e.sleep(700);
          case 3:
            _context7.n = 4;
            return e.chat(true);
          case 4:
            _context7.n = 5;
            return e.say('user', '帮我把这几家酒店做个对比');
          case 5:
            _context7.n = 6;
            return e.think(900);
          case 6:
            _context7.n = 7;
            return e.say('ai', '好，拉了 3 家做横向对比，最优项已高亮 👇');
          case 7:
            _context7.n = 8;
            return e.sleep(600);
          case 8:
            _context7.n = 9;
            return e.chat(false);
          case 9:
            _context7.n = 10;
            return e.sleep(450);
          case 10:
            _context7.n = 11;
            return e.setInsert('compare', AGD.cmpA, 'feeds');
          case 11:
            _context7.n = 12;
            return e.expand();
          case 12:
            _context7.n = 13;
            return e.sleep(2000);
          case 13:
            _context7.n = 14;
            return e.chat(true);
          case 14:
            _context7.n = 15;
            return e.sleep(300);
          case 15:
            _context7.n = 16;
            return e.say('user', '再加一行「能否免费取消」');
          case 16:
            _context7.n = 17;
            return e.think(900);
          case 17:
            _context7.n = 18;
            return e.say('ai', '已加上「免费取消」这一行，方便你权衡～');
          case 18:
            _context7.n = 19;
            return e.sleep(600);
          case 19:
            _context7.n = 20;
            return e.chat(false);
          case 20:
            _context7.n = 21;
            return e.sleep(450);
          case 21:
            _context7.n = 22;
            return e.refresh(AGD.cmpB);
          case 22:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    function run(_x7) {
      return _run7.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '08',
  title: '找特价',
  tags: ['A 中插展开', 'C 切性价比档'],
  chip: '找特价',
  steps: ['用户「有没有今晚能捡漏的特价」', '切到性价比档（页面重渲染），并定位到秒杀楼层', '中插特价聚合，按「立省」从高到低排序'],
  run: function () {
    var _run8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(e) {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            _context8.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'premium',
              state: 'S2',
              city: '冲绳'
            });
          case 1:
            _context8.n = 2;
            return e.scrollTop();
          case 2:
            _context8.n = 3;
            return e.sleep(700);
          case 3:
            _context8.n = 4;
            return e.chat(true);
          case 4:
            _context8.n = 5;
            return e.say('user', '有没有今晚能捡漏的特价？');
          case 5:
            _context8.n = 6;
            return e.think(900);
          case 6:
            _context8.n = 7;
            return e.say('ai', '已为你切到性价比档，按立省排序聚合特价 👇');
          case 7:
            _context8.n = 8;
            return e.sleep(500);
          case 8:
            _context8.n = 9;
            return e.setCtx({
              tier: 'value'
            });
          case 9:
            _context8.n = 10;
            return e.sleep(500);
          case 10:
            _context8.n = 11;
            return e.scrollModule('flashSale');
          case 11:
            _context8.n = 12;
            return e.sleep(420);
          case 12:
            _context8.n = 13;
            return e.chat(false);
          case 13:
            _context8.n = 14;
            return e.sleep(450);
          case 14:
            _context8.n = 15;
            return e.setInsert('deals', AGD.deals, 'flashSale');
          case 15:
            _context8.n = 16;
            return e.expand();
          case 16:
            _context8.n = 17;
            return e.sleep(1200);
          case 17:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    function run(_x8) {
      return _run8.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '09',
  title: '带孩子适配',
  tags: ['C 重渲染', 'A 中插展开'],
  steps: ['用户「带 5 岁小孩，哪些适合」', '切到亲子模式，页面整体按亲子重渲染', '中插「亲子精选」行程摘要，待进一步交互'],
  run: function () {
    var _run9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(e) {
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            _context9.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S2',
              city: '冲绳'
            });
          case 1:
            _context9.n = 2;
            return e.scrollTop();
          case 2:
            _context9.n = 3;
            return e.sleep(700);
          case 3:
            _context9.n = 4;
            return e.chat(true);
          case 4:
            _context9.n = 5;
            return e.say('user', '带 5 岁小孩，哪些适合？');
          case 5:
            _context9.n = 6;
            return e.think(900);
          case 6:
            _context9.n = 7;
            return e.say('ai', '已切到亲子模式重渲染页面，并给你一份适龄精选 👇');
          case 7:
            _context9.n = 8;
            return e.sleep(500);
          case 8:
            _context9.n = 9;
            return e.setCtx({
              identity: 'family'
            });
          case 9:
            _context9.n = 10;
            return e.sleep(600);
          case 10:
            _context9.n = 11;
            return e.chat(false);
          case 11:
            _context9.n = 12;
            return e.sleep(450);
          case 12:
            _context9.n = 13;
            return e.setInsert('trip', AGD.tripRelax, 'top');
          case 13:
            _context9.n = 14;
            return e.expand();
          case 14:
            _context9.n = 15;
            return e.sleep(1200);
          case 15:
            return _context9.a(2);
        }
      }, _callee9);
    }));
    function run(_x9) {
      return _run9.apply(this, arguments);
    }
    return run;
  }()
}, {
  no: '10',
  title: '一家四口',
  tags: ['C 重渲染', 'B 原地刷新'],
  steps: ['用户「我们一家四口，2 大 2 小」', '切到亲子模式并打开家庭档案，页面按 4 人重渲染', '中插行程按家庭节奏生成，可继续追问刷新'],
  run: function () {
    var _run0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(e) {
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            _context0.n = 1;
            return e.reset({
              identity: 'solo',
              tier: 'value',
              state: 'S2',
              city: '冲绳'
            });
          case 1:
            _context0.n = 2;
            return e.scrollTop();
          case 2:
            _context0.n = 3;
            return e.sleep(700);
          case 3:
            _context0.n = 4;
            return e.chat(true);
          case 4:
            _context0.n = 5;
            return e.say('user', '我们一家四口，2 大 2 小');
          case 5:
            _context0.n = 6;
            return e.think(900);
          case 6:
            _context0.n = 7;
            return e.say('ai', '已切亲子模式、按 4 人入住重渲染，并给你一版家庭行程 👇');
          case 7:
            _context0.n = 8;
            return e.sleep(500);
          case 8:
            _context0.n = 9;
            return e.setCtx({
              identity: 'family'
            });
          case 9:
            _context0.n = 10;
            return e.sleep(600);
          case 10:
            _context0.n = 11;
            return e.chat(false);
          case 11:
            _context0.n = 12;
            return e.sleep(450);
          case 12:
            _context0.n = 13;
            return e.setInsert('trip', AGD.tripRelax, 'top');
          case 13:
            _context0.n = 14;
            return e.expand();
          case 14:
            _context0.n = 15;
            return e.sleep(1000);
          case 15:
            _context0.n = 16;
            return e.chat(true);
          case 16:
            _context0.n = 17;
            return e.sleep(300);
          case 17:
            _context0.n = 18;
            return e.say('user', '孩子小，行程别太赶');
          case 18:
            _context0.n = 19;
            return e.think(900);
          case 19:
            _context0.n = 20;
            return e.say('ai', '好的，已进一步放慢节奏、午后多留白给娃休息～');
          case 20:
            _context0.n = 21;
            return e.sleep(600);
          case 21:
            _context0.n = 22;
            return e.chat(false);
          case 22:
            _context0.n = 23;
            return e.sleep(450);
          case 23:
            _context0.n = 24;
            return e.refresh(AGD.tripEasy);
          case 24:
            return _context0.a(2);
        }
      }, _callee0);
    }));
    function run(_x0) {
      return _run0.apply(this, arguments);
    }
    return run;
  }()
}];
window.AGUI_SCENES = AGUI_SCENES;

/* 78ac370b-70da-41c1-9253-32f58a278b6d.js */
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* ============================================================
   OTA Demo — 主应用：编排渲染 + 实时意图 + 场景控制台
   ============================================================ */
var _React = React,
  uS = _React.useState,
  uE = _React.useEffect,
  uR = _React.useRef;
var REG = {
  coupon: Coupon,
  flashSale: FlashSale,
  coinsRebate: CoinsRebate,
  feeds: Feeds,
  sceneGuide: SceneGuide,
  cityHero: CityHero,
  aiEntry: AIEntry,
  ranking: Ranking,
  posts: Posts,
  tripCard: TripCard,
  tripPlan: TripPlan,
  familyProfile: FamilyProfile,
  bizTravel: BizTravel,
  eventBundle: EventBundle,
  memberBenefits: MemberBenefits,
  airlinePremium: AirlinePremium,
  hotelPremium: HotelPremium,
  ticketVIP: TicketVIP,
  destRec: DestRec,
  lowPriceDest: LowPriceDest,
  nearbyDest: NearbyDest,
  adLanding: AdLanding,
  recentViewed: RecentlyViewed
};
var MOD_NAME = {
  coupon: '优惠券',
  flashSale: '秒杀',
  coinsRebate: 'Trip Coins 返赠',
  feeds: 'Feeds 流',
  sceneGuide: '场景导购',
  cityHero: '城市头图',
  aiEntry: 'AI入口',
  ranking: '榜单',
  posts: '帖子',
  tripCard: '行程卡片',
  tripPlan: '行程规划',
  familyProfile: '家庭档案',
  bizTravel: '差旅助手',
  eventBundle: '展演打包',
  memberBenefits: '高端会籍',
  airlinePremium: '航司尊享',
  hotelPremium: '酒店尊享',
  ticketVIP: '门票VIP',
  destRec: '目的地推荐',
  lowPriceDest: '发现低价目的地',
  nearbyDest: '附近目的地',
  adLanding: '外投中插',
  recentViewed: '刚刚浏览过的'
};
var CITY_WORDS = ['三亚', '上海', '北京', '成都', '普吉', '冲绳', '东京', '马代', '深圳', '广州', '香港', '澳门'];
function App() {
  var _uS = uS({
      identity: 'solo',
      tier: 'value',
      state: 'S1',
      city: null,
      family: _objectSpread({}, window.DATA.familyDefault)
    }),
    _uS2 = _slicedToArray(_uS, 2),
    ctx = _uS2[0],
    _setCtx = _uS2[1];
  // 让图片解析器(window.IMG)能感知当前消费档：高端档自动切到尊贵图集
  window.__tier = ctx.tier;
  var _uS3 = uS('explore'),
    _uS4 = _slicedToArray(_uS3, 2),
    tab = _uS4[0],
    setTab = _uS4[1];
  var _uS5 = uS(null),
    _uS6 = _slicedToArray(_uS5, 2),
    toast = _uS6[0],
    setToast = _uS6[1];
  var _uS7 = uS(false),
    _uS8 = _slicedToArray(_uS7, 2),
    familyOpen = _uS8[0],
    setFamilyOpen = _uS8[1];
  var _uS9 = uS(false),
    _uS0 = _slicedToArray(_uS9, 2),
    cityPickerOpen = _uS0[0],
    setCityPickerOpen = _uS0[1];
  var _uS1 = uS(false),
    _uS10 = _slicedToArray(_uS1, 2),
    aiOpen = _uS10[0],
    setAiOpen = _uS10[1];
  var _uS11 = uS([]),
    _uS12 = _slicedToArray(_uS11, 2),
    aiMsgs = _uS12[0],
    setAiMsgs = _uS12[1];
  var _uS13 = uS(false),
    _uS14 = _slicedToArray(_uS13, 2),
    consoleOpen = _uS14[0],
    setConsoleOpen = _uS14[1];
  var _uS15 = uS(false),
    _uS16 = _slicedToArray(_uS15, 2),
    scriptRunning = _uS16[0],
    setScriptRunning = _uS16[1];
  var _uS17 = uS(false),
    _uS18 = _slicedToArray(_uS17, 2),
    showBackTop = _uS18[0],
    setShowBackTop = _uS18[1];
  var _uS19 = uS(false),
    _uS20 = _slicedToArray(_uS19, 2),
    dockTrayOpen = _uS20[0],
    setDockTrayOpen = _uS20[1];
  var _uS21 = uS(false),
    _uS22 = _slicedToArray(_uS21, 2),
    subscribed = _uS22[0],
    setSubscribed = _uS22[1];
  var _uS23 = uS(false),
    _uS24 = _slicedToArray(_uS23, 2),
    subscribeOpen = _uS24[0],
    setSubscribeOpen = _uS24[1];
  var _uS25 = uS(false),
    _uS26 = _slicedToArray(_uS25, 2),
    unsubOpen = _uS26[0],
    setUnsubOpen = _uS26[1];
  var _uS27 = uS(false),
    _uS28 = _slicedToArray(_uS27, 2),
    shareOpen = _uS28[0],
    setShareOpen = _uS28[1];
  var _uS29 = uS(null),
    _uS30 = _slicedToArray(_uS29, 2),
    adSource = _uS30[0],
    setAdSource = _uS30[1]; // 外投渠道来源：{ kind:'coupon'|'hotel'|'flight'|'ticket' }
  var _uS31 = uS({
      open: false,
      kind: null,
      data: null,
      anchor: 'feeds',
      flashKey: 0,
      h: 0,
      anim: false
    }),
    _uS32 = _slicedToArray(_uS31, 2),
    agi = _uS32[0],
    setAgi = _uS32[1]; // AG-UI 中插
  var _uS33 = uS(null),
    _uS34 = _slicedToArray(_uS33, 2),
    activeScene = _uS34[0],
    setActiveScene = _uS34[1]; // 当前播放的场景 no
  var scrollRef = uR(null);
  var toastTimer = uR(null);
  var undoRef = uR(null);
  var insertRef = uR(null);
  var innerRef = uR(null);
  var skipAnchor = uR(false); // 城市选择等用户动作锚定 tab 后，跳过一次默认 tab 重锚定

  // 切状态/身份时同步默认 tab：S1/S2/S5 锚定到「探索目的地」；S3/S4 锚定「目的地」（探索退居第二位）；商旅/展演无探索 tab
  uE(function () {
    if (skipAnchor.current) {
      skipAnchor.current = false;
      return;
    }
    if (ctx.identity === 'biz' || ctx.identity === 'event') {
      setTab('city');
      return;
    }
    var exploreDefault = ctx.state === 'S1' || ctx.state === 'S2' || ctx.state === 'S5';
    setTab(exploreDefault ? 'explore' : 'city');
  }, [ctx.state, ctx.identity]);

  // 外投 landing：插入广告中插后回到页面顶部（即时跳转，避免平滑滚动被图片重排打断）
  uE(function () {
    if (adSource) {
      var jump = function jump() {
        if (scrollRef.current) {
          scrollRef.current.style.scrollBehavior = 'auto';
          scrollRef.current.scrollTop = 0;
        }
      };
      jump();
      var t1 = setTimeout(jump, 80);
      var t2 = setTimeout(jump, 200);
      return function () {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [adSource]);

  /* ---------- bus ---------- */
  function showToast(msg, undoFn) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    undoRef.current = undoFn || null;
    setToast({
      msg: msg,
      undo: !!undoFn
    });
    toastTimer.current = setTimeout(function () {
      return setToast(null);
    }, undoFn ? 4200 : 2200);
  }
  function doUndo() {
    if (undoRef.current) undoRef.current();
    setToast(null);
  }
  function patchCtx(patch) {
    _setCtx(function (c) {
      return _objectSpread(_objectSpread({}, c), patch);
    });
  }
  var bus = {
    toast: function toast(m, u) {
      return showToast(m, u);
    },
    openFamily: function openFamily() {
      return setFamilyOpen(true);
    },
    openAI: function openAI() {
      setAiOpen(true);
    },
    openCityPicker: function openCityPicker() {
      return setCityPickerOpen(true);
    }
  };
  function saveFamily(fam) {
    _setCtx(function (c) {
      return _objectSpread(_objectSpread({}, c), {}, {
        family: fam,
        identity: 'family'
      });
    });
    setFamilyOpen(false);
    showToast("\u5DF2\u4E3A ".concat(fam.children.map(function (c) {
      return c.age === 0 ? '<1岁' : c.age + '岁';
    }).join('、'), " \u5B9D\u5B9D\u4F18\u5316\u63A8\u8350"));
    // 保存后停留在原页面，仅基于家庭档案刷新内容，不再自动跳到 Feeds
  }

  /* ---------- 滚动锚定 ---------- */
  function topOf(el) {
    var ch = scrollRef.current;
    if (!ch || !el) return 0;
    return el.getBoundingClientRect().top - ch.getBoundingClientRect().top + ch.scrollTop;
  }
  // 可视区顶部被吸顶栏占据的高度（组件置顶时预留）。
  // 关键：按吸顶栏「吸住后」的高度（CSS top + 自身高度）计算，而不是其当前位置——
  // 否则置顶前吸顶栏还没贴到顶，预留量被低估，组件会顶进吸顶栏下方、标题被遮，随后再校正就成了抖动。
  // 且只统计「位于插入组件之前（其上方）」的吸顶栏，避免给顶部中插（上方没有吸顶栏）误留空白。
  function stickyGap() {
    var ch = scrollRef.current;
    if (!ch) return 56;
    var ins = insertRef.current;
    var g = 8;
    ch.querySelectorAll('*').forEach(function (e) {
      var cs = getComputedStyle(e);
      if (cs.position !== 'sticky') return;
      var topPx = parseFloat(cs.top) || 0;
      if (topPx > 80) return; // 只算吸附在顶部区域的栏
      // 仅统计排在插入组件之前的吸顶栏（它们才会叠在组件上方）
      if (ins && !(e.compareDocumentPosition(ins) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
      var stuckBottom = topPx + e.offsetHeight; // 吸住后该栏底部距容器顶的距离
      if (stuckBottom > g && stuckBottom < 200) g = stuckBottom;
    });
    return g + 10;
  }
  /* rAF 自定义缓动滚动：时长可控、与原生 smooth / scroll-behavior 无关，
     用直接赋值 scrollTop 实现，避免大距离时过快、或被原生平滑滚动中途打断 */
  function animateScroll(ch, to, dur) {
    return new Promise(function (res) {
      var start = ch.scrollTop;
      var end = Math.max(0, to);
      var delta = end - start;
      if (Math.abs(delta) < 1) {
        ch.scrollTop = end;
        res();
        return;
      }
      var prevBehav = ch.style.scrollBehavior;
      ch.style.scrollBehavior = 'auto';
      var t0 = performance.now();
      var ease = function ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }; // easeInOutCubic
      function step(now) {
        var t = Math.min(1, (now - t0) / dur);
        ch.scrollTop = start + delta * ease(t);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          ch.style.scrollBehavior = prevBehav;
          res();
        }
      }
      requestAnimationFrame(step);
    });
  }
  /* 统一驱动「展开 + 置顶」：在同一条缓动曲线、同一帧时钟里同时改 height 与 scrollTop，
     彻底消除「CSS 高度过渡」与「JS 滚动」两条动画异步交接造成的卡顿 */
  function unfurlAndPin(_x, _x2) {
    return _unfurlAndPin.apply(this, arguments);
  }
  function _unfurlAndPin() {
    _unfurlAndPin = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(H, dur) {
      var ch, el, target, startScroll, startH, goScroll, dScroll, dH, D, ease, prevBehav;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            ch = scrollRef.current, el = insertRef.current;
            if (!(!ch || !el)) {
              _context10.n = 1;
              break;
            }
            return _context10.a(2);
          case 1:
            target = function target() {
              return Math.max(0, topOf(el) - stickyGap());
            };
            startScroll = ch.scrollTop;
            startH = el.offsetHeight;
            goScroll = target(); // 内容坐标系下的目标，随高度增长保持稳定
            dScroll = goScroll - startScroll;
            dH = H - startH;
            D = dur || 600; // easeInOutCubic：起止都缓，避免 easeOut 起步过猛带来的「窜一下」
            ease = function ease(t) {
              return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };
            prevBehav = ch.style.scrollBehavior;
            ch.style.scrollBehavior = 'auto'; // 确保逐帧赋值即时生效，不被原生平滑滚动接管
            el.style.transition = 'none'; // 关闭 CSS 过渡，全程由 rAF 命令式驱动
            _context10.n = 2;
            return new Promise(function (res) {
              var t0 = performance.now();
              function step(now) {
                var t = Math.min(1, (now - t0) / D);
                var e = ease(t);
                el.style.height = startH + dH * e + 'px';
                ch.scrollTop = startScroll + dScroll * e;
                if (t < 1) requestAnimationFrame(step);else res();
              }
              requestAnimationFrame(step);
            });
          case 2:
            el.style.height = H + 'px';
            ch.scrollTop = target();
            // 落定后若上方懒加载图片造成漂移，做一次极短的同向平滑校正（极少触发，不硬跳）
            if (!(Math.abs(ch.scrollTop - target()) > 2)) {
              _context10.n = 3;
              break;
            }
            _context10.n = 3;
            return animateScroll(ch, target(), 200);
          case 3:
            ch.style.scrollBehavior = prevBehav;
          case 4:
            return _context10.a(2);
        }
      }, _callee10);
    }));
    return _unfurlAndPin.apply(this, arguments);
  }
  function scrollToModule(name) {
    var el = scrollRef.current && scrollRef.current.querySelector("[data-mod=\"".concat(name, "\"]"));
    if (el && scrollRef.current) {
      var top = el.offsetTop - 120;
      scrollRef.current.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });
    }
  }

  /* ---------- 实时意图解析 ---------- */
  function applyIntent(text) {
    var prev = _objectSpread({}, ctx);
    var patch = {};
    var notes = [];
    var scrollTarget = null;
    var openFam = false;
    var t = text;
    if (/(带|和).*(孩子|娃|宝宝|小孩)|亲子|遛娃/.test(t)) {
      patch.identity = 'family';
      notes.push('亲子模式');
      scrollTarget = 'familyProfile';
      openFam = false;
    }
    if (/出差|商务|差旅|开会|会议/.test(t)) {
      patch.identity = 'biz';
      notes.push('商务模式');
    }
    if (/演唱会|演出|音乐节|livehouse|话剧|展演|赛事/.test(t)) {
      patch.identity = 'event';
      notes.push('展演模式');
    }
    if (/特价|便宜|省钱|划算|实惠|平价/.test(t)) {
      patch.tier = 'value';
      notes.push('性价比档');
      scrollTarget = scrollTarget || 'flashSale';
    }
    if (/好一?点|高端|商务舱|五星|奢华|尊享|头等|豪华/.test(t)) {
      patch.tier = 'premium';
      notes.push('高端档');
      scrollTarget = 'hotelPremium';
    }
    var city = CITY_WORDS.find(function (c) {
      return t.includes(c);
    });
    if (city) {
      patch.city = city;
      if (ctx.state === 'S1' || ctx.state === 'S5') patch.state = 'S2';
      notes.push('定位' + city);
      scrollTarget = scrollTarget || 'cityHero';
    }
    if (/出发|周末|下个?月|出游|旅行|去玩/.test(t) && !city && ctx.state === 'S1') {/* 维持 */}
    if (Object.keys(patch).length === 0) {
      return {
        reply: '我可以帮你切换出行身份、价格档位或定位目的地～试试「带孩子去三亚」「住好一点的酒店」。',
        applied: false
      };
    }
    _setCtx(function (c) {
      return _objectSpread(_objectSpread({}, c), patch);
    });
    if (openFam) setTimeout(function () {
      return setFamilyOpen(true);
    }, 500);
    if (scrollTarget) setTimeout(function () {
      return scrollToModule(scrollTarget);
    }, 480);
    var undoFn = function undoFn() {
      return _setCtx(function (c) {
        return _objectSpread({}, prev);
      });
    };
    showToast("\u5DF2\u6839\u636E\u4F60\u7684\u9700\u6C42\u8C03\u6574\uFF1A".concat(notes.join(' · ')), undoFn);
    return {
      reply: "\u597D\u7684\uFF0C\u5DF2\u4E3A\u4F60".concat(notes.join('、'), "\uFF0C\u9875\u9762\u5DF2\u5B9E\u65F6\u5237\u65B0\uFF08\u4F1A\u8BDD\u6001\u8C03\u6574\uFF0C\u4E0D\u5F71\u54CD\u957F\u671F\u753B\u50CF\uFF09\u3002"),
      applied: true
    };
  }
  function sendAI(text) {
    setAiMsgs(function (m) {
      return [].concat(_toConsumableArray(m), [{
        role: 'user',
        text: text
      }]);
    });
    setTimeout(function () {
      var res = applyIntent(text);
      setAiMsgs(function (m) {
        return [].concat(_toConsumableArray(m), [{
          role: 'ai',
          text: res.reply
        }]);
      });
    }, 420);
  }

  /* ---------- AI 演示脚本 ---------- */
  function sleep(ms) {
    return new Promise(function (r) {
      return setTimeout(r, Math.round(ms * 1.55));
    });
  }
  function runScriptA() {
    return _runScriptA.apply(this, arguments);
  }
  function _runScriptA() {
    _runScriptA = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
      var prev;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            if (!scriptRunning) {
              _context11.n = 1;
              break;
            }
            return _context11.a(2);
          case 1:
            setScriptRunning(true);
            setConsoleOpen(false);
            _setCtx({
              identity: 'solo',
              tier: 'value',
              state: 'S1',
              city: null,
              family: _objectSpread({}, window.DATA.familyDefault)
            });
            setAiMsgs([]);
            setAiOpen(true);
            _context11.n = 2;
            return sleep(700);
          case 2:
            setAiMsgs([{
              role: 'user',
              text: '帮我安排一个两天周末带孩子出行的方案'
            }]);
            _context11.n = 3;
            return sleep(900);
          case 3:
            setAiMsgs(function (m) {
              return [].concat(_toConsumableArray(m), [{
                role: 'ai',
                text: '好的，给你一个亲子周末方案～先完善下宝宝信息，推荐更准。'
              }]);
            });
            _context11.n = 4;
            return sleep(700);
          case 4:
            prev = {
              identity: 'solo',
              tier: 'value',
              state: 'S1',
              city: null
            };
            _setCtx(function (c) {
              return _objectSpread(_objectSpread({}, c), {}, {
                identity: 'family'
              });
            });
            showToast('已识别「带孩子」，为你切到亲子模式', function () {
              return _setCtx(function (c) {
                return _objectSpread(_objectSpread({}, c), prev);
              });
            });
            _context11.n = 5;
            return sleep(1100);
          case 5:
            setAiOpen(false);
            _context11.n = 6;
            return sleep(300);
          case 6:
            scrollToModule('familyProfile');
            _context11.n = 7;
            return sleep(900);
          case 7:
            setScriptRunning(false);
          case 8:
            return _context11.a(2);
        }
      }, _callee11);
    }));
    return _runScriptA.apply(this, arguments);
  }
  function runScriptB() {
    return _runScriptB.apply(this, arguments);
  }
  /* ---------- AG-UI 引擎（动态意图修正层） ---------- */
  function _runScriptB() {
    _runScriptB = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      var prev;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            if (!scriptRunning) {
              _context12.n = 1;
              break;
            }
            return _context12.a(2);
          case 1:
            setScriptRunning(true);
            setConsoleOpen(false);
            _setCtx({
              identity: 'biz',
              tier: 'value',
              state: 'S1',
              city: null,
              family: _objectSpread({}, window.DATA.familyDefault)
            });
            setAiMsgs([]);
            setAiOpen(true);
            _context12.n = 2;
            return sleep(700);
          case 2:
            setAiMsgs([{
              role: 'user',
              text: '下个月去上海，住好一点的酒店'
            }]);
            _context12.n = 3;
            return sleep(900);
          case 3:
            setAiMsgs(function (m) {
              return [].concat(_toConsumableArray(m), [{
                role: 'ai',
                text: '为你定位上海，已切到高端，附上行政酒廊等尊享服务。'
              }]);
            });
            _context12.n = 4;
            return sleep(700);
          case 4:
            prev = {
              identity: 'biz',
              tier: 'value',
              state: 'S1',
              city: null
            };
            _setCtx(function (c) {
              return _objectSpread(_objectSpread({}, c), {}, {
                state: 'S2',
                city: '上海'
              });
            });
            _context12.n = 5;
            return sleep(700);
          case 5:
            _setCtx(function (c) {
              return _objectSpread(_objectSpread({}, c), {}, {
                tier: 'premium'
              });
            });
            showToast('已定位上海 · 已切高端', function () {
              return _setCtx(function (c) {
                return _objectSpread(_objectSpread({}, c), prev);
              });
            });
            _context12.n = 6;
            return sleep(1100);
          case 6:
            setAiOpen(false);
            _context12.n = 7;
            return sleep(300);
          case 7:
            scrollToModule('hotelPremium');
            _context12.n = 8;
            return sleep(900);
          case 8:
            setScriptRunning(false);
          case 9:
            return _context12.a(2);
        }
      }, _callee12);
    }));
    return _runScriptB.apply(this, arguments);
  }
  var raf2 = function raf2() {
    return new Promise(function (r) {
      return requestAnimationFrame(function () {
        return requestAnimationFrame(r);
      });
    });
  };
  var eng = {
    sleep: sleep,
    toast: function toast(m) {
      return showToast(m);
    },
    reset: function reset(base) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              setAgi({
                open: false,
                kind: null,
                data: null,
                anchor: 'feeds',
                flashKey: 0,
                h: 0,
                anim: false
              });
              setAiMsgs([]);
              setAiOpen(false);
              _setCtx(function (c) {
                return _objectSpread(_objectSpread(_objectSpread({}, c), base), {}, {
                  family: _objectSpread({}, window.DATA.familyDefault)
                });
              });
              _context.n = 1;
              return sleep(80);
            case 1:
              if (scrollRef.current) {
                scrollRef.current.style.scrollBehavior = 'auto';
                scrollRef.current.scrollTop = 0;
              }
              _context.n = 2;
              return sleep(260);
            case 2:
              return _context.a(2);
          }
        }, _callee);
      }))();
    },
    setCtx: function setCtx(patch) {
      return _setCtx(function (c) {
        return _objectSpread(_objectSpread({}, c), patch);
      });
    },
    scrollTop: function scrollTop() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              if (scrollRef.current) scrollRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
              _context2.n = 1;
              return sleep(420);
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }))();
    },
    scrollModule: function scrollModule(name) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              scrollToModule(name);
              _context3.n = 1;
              return sleep(480);
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }))();
    },
    chat: function chat(open) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              setAiOpen(open);
              _context4.n = 1;
              return sleep(open ? 460 : 360);
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      }))();
    },
    say: function say(role, text) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              setAiMsgs(function (m) {
                return [].concat(_toConsumableArray(m), [{
                  role: role,
                  text: text
                }]);
              });
              _context5.n = 1;
              return sleep(role === 'user' ? 280 : 340);
            case 1:
              return _context5.a(2);
          }
        }, _callee5);
      }))();
    },
    think: function think(ms) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return sleep(ms);
            case 1:
              return _context6.a(2);
          }
        }, _callee6);
      }))();
    },
    setInsert: function setInsert(kind, data, anchor) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              setAgi({
                open: false,
                kind: kind,
                data: data,
                anchor: anchor || 'feeds',
                flashKey: 0,
                h: 0,
                anim: false
              });
              _context7.n = 1;
              return sleep(90);
            case 1:
              return _context7.a(2);
          }
        }, _callee7);
      }))();
    },
    expand: function expand() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var inner, H;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              setAgi(function (a) {
                return _objectSpread(_objectSpread({}, a), {}, {
                  open: true,
                  h: 0,
                  anim: false
                });
              });
              _context8.n = 1;
              return raf2();
            case 1:
              _context8.n = 2;
              return raf2();
            case 2:
              inner = innerRef.current;
              H = inner ? inner.scrollHeight : 320;
              _context8.n = 3;
              return unfurlAndPin(H, 640);
            case 3:
              // 展开与置顶合为一段同步连续动作
              setAgi(function (a) {
                return _objectSpread(_objectSpread({}, a), {}, {
                  h: H,
                  anim: false
                });
              });
            case 4:
              return _context8.a(2);
          }
        }, _callee8);
      }))();
    },
    _change: function _change(data, fade) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var inner, H;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              setAgi(function (a) {
                return _objectSpread(_objectSpread({}, a), {}, {
                  data: data,
                  flashKey: fade ? a.flashKey + 1 : a.flashKey,
                  anim: false
                });
              });
              _context9.n = 1;
              return raf2();
            case 1:
              _context9.n = 2;
              return raf2();
            case 2:
              inner = innerRef.current;
              H = inner ? inner.scrollHeight : 320;
              _context9.n = 3;
              return unfurlAndPin(H, 560);
            case 3:
              // 刷新：高度变化与置顶同步
              setAgi(function (a) {
                return _objectSpread(_objectSpread({}, a), {}, {
                  h: H,
                  anim: false
                });
              });
            case 4:
              return _context9.a(2);
          }
        }, _callee9);
      }))();
    },
    refresh: function refresh(data) {
      return eng._change(data, true);
    },
    update: function update(data) {
      return eng._change(data, false);
    },
    browse: function browse() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var ch, ins, topPos, viewH, needReveal, down;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              ch = scrollRef.current, ins = insertRef.current;
              if (!(!ch || !ins)) {
                _context0.n = 1;
                break;
              }
              return _context0.a(2);
            case 1:
              topPos = Math.max(0, topOf(ins) - stickyGap());
              viewH = ch.clientHeight; // 轻量浏览：温和下滑一小段（最多约 1/3 屏，且不超过「露出组件底部」所需距离），
              // 用可控时长的缓动滑动，避免原生 smooth 在大距离时过猛、太突然
              needReveal = Math.max(0, ins.offsetHeight - (viewH - stickyGap()) + 72);
              down = topPos + Math.min(viewH * 0.34, needReveal);
              _context0.n = 2;
              return animateScroll(ch, down, 1000);
            case 2:
              _context0.n = 3;
              return sleep(640);
            case 3:
              _context0.n = 4;
              return animateScroll(ch, topPos, 900);
            case 4:
              return _context0.a(2);
          }
        }, _callee0);
      }))();
    }
  };
  function _playScene2(_x3) {
    return _playScene.apply(this, arguments);
  }
  /* ---------- portfolio bridge: external scene console -> original phone demo ---------- */
  function _playScene() {
    _playScene = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(scene) {
      var _t;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.p = _context13.n) {
          case 0:
            if (!scriptRunning) {
              _context13.n = 1;
              break;
            }
            return _context13.a(2);
          case 1:
            setScriptRunning(true);
            setActiveScene(scene.no);
            _context13.p = 2;
            _context13.n = 3;
            return scene.run(eng);
          case 3:
            _context13.n = 5;
            break;
          case 4:
            _context13.p = 4;
            _t = _context13.v;
            console.error('[AGUI]', scene.no, _t);
          case 5:
            setScriptRunning(false);
          case 6:
            return _context13.a(2);
        }
      }, _callee13, null, [[2, 4]]);
    }));
    return _playScene.apply(this, arguments);
  }
  uE(function () {
    var detailOf = function detailOf(nextCtx, nextChannel, nextScene) {
      return _objectSpread(_objectSpread({}, nextCtx || ctx), {}, {
        channel: nextChannel !== undefined ? nextChannel : adSource ? adSource.kind : null,
        activeScene: nextScene !== undefined ? nextScene : activeScene
      });
    };
    var emit = function emit(nextCtx, nextChannel, nextScene) {
      var detail = detailOf(nextCtx, nextChannel, nextScene);
      setTimeout(function () {
        window.dispatchEvent(new CustomEvent('deals:ctx', {
          detail: detail
        }));
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'deals:ctx',
              detail: detail
            }, '*');
          }
        } catch (e) {}
      }, 0);
    };
    var resetToInitial = function resetToInitial() {
      var base = {
        identity: 'solo',
        tier: 'value',
        state: 'S1',
        city: null,
        family: _objectSpread({}, window.DATA.familyDefault)
      };
      setAgi({
        open: false,
        kind: null,
        data: null,
        anchor: 'feeds',
        flashKey: 0,
        h: 0,
        anim: false
      });
      setAiMsgs([]);
      setAiOpen(false);
      setDockTrayOpen(false);
      setActiveScene(null);
      setScriptRunning(false);
      setAdSource(null);
      _setCtx(base);
      if (scrollRef.current) {
        scrollRef.current.style.scrollBehavior = 'auto';
        scrollRef.current.scrollTop = 0;
      }
      emit(base, null, null);
    };
    var api = {
      getCtx: function getCtx() {
        return _objectSpread(_objectSpread({}, ctx), {}, {
          channel: adSource ? adSource.kind : null,
          activeScene: activeScene
        });
      },
      setCtx: function setCtx(patch) {
        _setCtx(function (c) {
          var clean = _objectSpread({}, patch || {});
          Object.keys(clean).forEach(function (k) {
            if (clean[k] === undefined) delete clean[k];
          });
          var next = _objectSpread(_objectSpread({}, c), clean);
          if (clean.state === 'S1' && !Object.prototype.hasOwnProperty.call(clean, 'city')) next.city = null;
          emit(next);
          return next;
        });
      },
      setChannel: function setChannel(kind) {
        var normalized = kind || null;
        setAdSource(normalized ? {
          kind: normalized
        } : null);
        emit(ctx, normalized, activeScene);
      },
      playScene: function playScene(no) {
        return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
          var key, scene;
          return _regenerator().w(function (_context1) {
            while (1) switch (_context1.n) {
              case 0:
                key = String(no && no.no ? no.no : no).padStart(2, '0');
                scene = (window.AGUI_SCENES || []).find(function (s) {
                  return s.no === key;
                });
                if (!scene) {
                  _context1.n = 1;
                  break;
                }
                _context1.n = 1;
                return _playScene2(scene);
              case 1:
                return _context1.a(2);
            }
          }, _callee1);
        }))();
      },
      reset: resetToInitial,
      hello: function hello() {
        emit();
      }
    };
    window.__deals = api;
    var onMessage = function onMessage(event) {
      var data = event && event.data;
      if (!data || data.type !== 'deals:cmd') return;
      if (data.cmd === 'setCtx') api.setCtx(data.patch || {});else if (data.cmd === 'setChannel') api.setChannel(data.kind || null);else if (data.cmd === 'playScene') api.playScene(data.no);else if (data.cmd === 'reset') api.reset();else if (data.cmd === 'hello') api.hello();
    };
    window.addEventListener('message', onMessage);
    emit();
    return function () {
      return window.removeEventListener('message', onMessage);
    };
  }, [ctx, adSource, activeScene, scriptRunning]);

  /* ---------- 构建楼层 ---------- */
  var allFloors = window.buildFloors(ctx);
  var hasTripPlan = allFloors.some(function (f) {
    return f.module === 'tripPlan';
  });
  var floors = _toConsumableArray(allFloors);
  // 旅行攻略（帖子）不直接上墙，改为底部 AI 对话框气泡；行程规划同理
  floors = floors.filter(function (f) {
    return f.module !== 'posts';
  });
  if (tab === 'explore') {
    // 探索目的地 tab：隐藏原目的地推荐(destRec) / 目的地灵感(sceneGuide)，在原顶部位置仅展示发现低价目的地(lowPriceDest)
    floors = floors.filter(function (f) {
      return f.module !== 'cityHero' && f.module !== 'tripPlan' && !(f.module === 'ranking' && ctx.tier !== 'premium') && f.module !== 'nearbyDest' && f.module !== 'sceneGuide' && f.module !== 'destRec';
    });
    var fam = floors.filter(function (f) {
      return f.module === 'familyProfile';
    });
    var tops = floors.filter(function (f) {
      return f.module === 'lowPriceDest';
    });
    var rest = floors.filter(function (f) {
      return f.module !== 'familyProfile' && f.module !== 'lowPriceDest';
    });
    floors = [].concat(_toConsumableArray(fam), _toConsumableArray(tops), _toConsumableArray(rest));
  } else {
    // 目的地 tab：不展示单目的地推荐(destRec) 与 场景化导购(sceneGuide)
    floors = floors.filter(function (f) {
      return f.module !== 'cityHero' && f.module !== 'sceneGuide' && f.module !== 'destRec' && f.module !== 'lowPriceDest' && f.module !== 'tripPlan';
    });
    // 附近目的地推荐：非「探索目的地」tab 下仅在行程前/中/后(S3/S4/S5)出现，且置于「刚刚浏览过的」组件下方
    var inTrip = ctx.state === 'S3' || ctx.state === 'S4' || ctx.state === 'S5';
    var nd = floors.find(function (f) {
      return f.module === 'nearbyDest';
    });
    floors = floors.filter(function (f) {
      return f.module !== 'nearbyDest';
    });
    if (inTrip && nd) {
      var rvIdx = floors.findIndex(function (f) {
        return f.module === 'recentViewed';
      });
      if (rvIdx >= 0) {
        floors.splice(rvIdx + 1, 0, nd);
      } else {
        var fIdx = floors.findIndex(function (f) {
          return f.module === 'feeds';
        });
        if (fIdx >= 0) floors.splice(fIdx, 0, nd);else floors.push(nd);
      }
    }
  }
  // 外投渠道 landing：还原站外广告内容
  //  - 亲子：放在家庭档案下方
  //  - 商务出行：放在差旅助手下方
  //  - 展演出行：放在展演卡片下方
  //  - 其余：页面顶部中插
  if (adSource) {
    var adFloor = {
      module: 'adLanding',
      props: {
        ad: adSource
      }
    };
    floors = floors.filter(function (f) {
      return f.module !== 'adLanding';
    });
    var anchorIdx = -1;
    if (ctx.identity === 'family') anchorIdx = floors.findIndex(function (f) {
      return f.module === 'familyProfile';
    });else if (ctx.identity === 'biz') anchorIdx = floors.findIndex(function (f) {
      return f.module === 'bizTravel';
    });else if (ctx.identity === 'event') anchorIdx = floors.findIndex(function (f) {
      return f.module === 'eventBundle';
    });
    if (anchorIdx >= 0) {
      floors.splice(anchorIdx + 1, 0, adFloor);
    } else {
      floors = [adFloor].concat(_toConsumableArray(floors));
    }
  }
  // 高端模式：会员权益模块固定置于页面最顶部（展示当前会员等级与可享权益）
  if (ctx.tier === 'premium') {
    floors = floors.filter(function (f) {
      return f.module !== 'memberBenefits';
    });
    floors = [{
      module: 'memberBenefits',
      props: {}
    }].concat(_toConsumableArray(floors));
  }
  // 行程规划 / 旅行攻略 / 找特价 等：以底部 AI 对话框上方的气泡形式展示
  var actionChips = [];
  if (ctx.state === 'S1' || hasTripPlan) actionChips.push({
    label: '行程规划',
    icon: 'cal',
    onClick: function onClick() {
      setAiOpen(true);
      sendAI('帮我安排行程规划');
    }
  });
  actionChips.push({
    label: '旅行攻略',
    icon: 'book',
    onClick: function onClick() {
      setAiOpen(true);
      sendAI('给我一份目的地旅行攻略');
    }
  });
  actionChips.push({
    label: '找特价',
    icon: 'bolt',
    onClick: function onClick() {
      setAiOpen(true);
      sendAI('帮我找最近的特价好货');
    }
  });
  actionChips.push({
    label: '比较酒店',
    icon: 'bed',
    onClick: function onClick() {
      setAiOpen(true);
      sendAI('帮我比较几家酒店');
    }
  });
  var aiSuggest = ['带孩子去三亚', '想找特价机票', '下个月去上海出差', '看看好点的商务舱', '演唱会周边住宿'];

  /* ---------- AG-UI 中插元素与位置 ---------- */
  var AgComp = agi.open && agi.kind ? (window.AGUI_PAYLOADS || {})[agi.kind] : null;
  var agInsIdx = -1;
  if (agi.open) {
    if (agi.anchor === 'feeds') agInsIdx = -2; // 交由 Feeds 模块在卡片之间渲染
    else if (agi.anchor === 'top') agInsIdx = 0;else {
      var i = floors.findIndex(function (f) {
        return f.module === agi.anchor;
      });
      agInsIdx = i >= 0 ? i + 1 : Math.min(2, floors.length);
    }
  }
  window.__agi = agi;
  var agInsertEl = AgComp ? /*#__PURE__*/React.createElement("div", {
    key: "ag-insert",
    ref: insertRef,
    style: {
      overflow: 'hidden',
      padding: agi.anchor === 'feeds' ? '0' : '0 14px',
      marginTop: agInsIdx === 0 ? 14 : 0,
      marginBottom: 10,
      height: agi.h,
      transition: agi.anim ? 'height .55s cubic-bezier(.22,1,.36,1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reco-inner",
    ref: innerRef
  }, /*#__PURE__*/React.createElement(AgComp, {
    data: agi.data,
    flashKey: agi.flashKey
  }))) : null;
  return /*#__PURE__*/React.createElement("div", {
    "data-identity": ctx.identity,
    "data-tier": ctx.tier,
    "data-state": ctx.state,
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
      transition: 'background-color var(--t-slow) var(--ease), color var(--t-slow) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 22px 4px',
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--text)',
      background: 'var(--bg)',
      transition: 'background-color var(--t-slow)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'center',
      fontSize: 13
    }
  }, "\u2022\u2022\u2022\u2022 5G \u25AE\u25AE\u25AE")), /*#__PURE__*/React.createElement(TopNav, {
    ctx: ctx,
    subscribed: subscribed,
    onSubscribe: function onSubscribe() {
      subscribed ? setUnsubOpen(true) : setSubscribeOpen(true);
    },
    onShare: function onShare() {
      return setShareOpen(true);
    },
    onMode: function onMode(id) {
      var prev = ctx.identity;
      _setCtx(function (c) {
        return _objectSpread(_objectSpread({}, c), {}, {
          identity: id
        });
      });
      showToast("\u5DF2\u5207\u6362\u5230\u300C".concat(MODES.find(function (m) {
        return m.id === id;
      }).label, "\u300D\u6A21\u5F0F"), function () {
        return _setCtx(function (c) {
          return _objectSpread(_objectSpread({}, c), {}, {
            identity: prev
          });
        });
      });
    }
  }), /*#__PURE__*/React.createElement(PageTabs, {
    ctx: ctx,
    tab: tab,
    cityFirst: ctx.state === 'S3' || ctx.state === 'S4',
    onTab: function onTab(t) {
      // 仅切换视图，不改动场景控制台配置
      if (t === 'city' && tab === 'city') {
        setCityPickerOpen(true);
        return;
      }
      setTab(t);
    }
  }), /*#__PURE__*/React.createElement("div", {
    id: "channel",
    ref: scrollRef,
    onScroll: function onScroll(e) {
      return setShowBackTop(e.currentTarget.scrollTop > 8);
    },
    style: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: 150
    }
  }, floors.map(function (f, idx) {
    var Comp = REG[f.module];
    var floorEl = Comp ? /*#__PURE__*/React.createElement("div", {
      key: f.module + (f.module === 'ranking' ? '-' + (f.props.style || '') : ''),
      "data-mod": f.module,
      style: {
        marginBottom: 10,
        marginTop: idx === 0 ? 14 : 0
      }
    }, /*#__PURE__*/React.createElement(Comp, {
      props: f.props,
      bus: bus,
      ctx: _objectSpread(_objectSpread({}, ctx), {}, {
        tab: tab,
        agFeed: agi.open && agi.anchor === 'feeds' ? agInsertEl : null
      })
    })) : null;
    if (agi.open && idx === agInsIdx) return /*#__PURE__*/React.createElement(React.Fragment, {
      key: 'agwrap-' + idx
    }, agInsertEl, floorEl);
    return floorEl;
  }), agi.open && agInsIdx >= floors.length && agInsertEl, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: 12,
      padding: '20px 0 40px'
    }
  }, "\u2014 \u72B6\u6001 ", ctx.state, " \xB7 ", MODES.find(function (m) {
    return m.id === ctx.identity;
  }).label, " \xB7 ", ctx.tier === 'premium' ? '高端' : '性价比', " \xB7 \u5171 ", floors.length, " \u4E2A\u697C\u5C42 \u2014")), showBackTop && !aiOpen && !dockTrayOpen && !shareOpen && /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u8FD4\u56DE\u9876\u90E8",
    title: "\u8FD4\u56DE\u9876\u90E8",
    onClick: function onClick() {
      return scrollRef.current && scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    style: {
      position: 'absolute',
      right: 18,
      bottom: 112,
      zIndex: 'calc(var(--z-console) + 1)',
      width: 38,
      height: 38,
      borderRadius: 999,
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand)',
      filter: 'drop-shadow(0 1px 4px rgba(0,0,0,.32))'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevD",
    size: 20,
    color: "currentColor",
    stroke: 2.5,
    style: {
      transform: 'rotate(180deg)'
    }
  })), /*#__PURE__*/React.createElement(AIDock, {
    suggestions: aiSuggest,
    onSend: sendAI,
    onOpen: function onOpen() {
      return setAiOpen(true);
    },
    actionChips: actionChips,
    onTrayChange: setDockTrayOpen
  }), /*#__PURE__*/React.createElement(Toast, {
    toast: toast,
    onUndo: doUndo
  }), /*#__PURE__*/React.createElement(FamilySheet, {
    open: familyOpen,
    family: ctx.family,
    onClose: function onClose() {
      return setFamilyOpen(false);
    },
    onSave: saveFamily
  }), /*#__PURE__*/React.createElement(CitySwitcher, {
    open: cityPickerOpen,
    current: ctx.city || '冲绳',
    onClose: function onClose() {
      return setCityPickerOpen(false);
    },
    onPick: function onPick(city) {
      skipAnchor.current = true; // 用户主动选城市：锚定到目的地 tab，跳过默认 tab 重置
      _setCtx(function (c) {
        return _objectSpread(_objectSpread({}, c), {}, {
          city: city,
          state: c.state === 'S1' || c.state === 'S5' ? 'S2' : c.state
        });
      });
      setTab('city');
      setCityPickerOpen(false);
      showToast("\u5DF2\u5B9A\u4F4D\u300C".concat(city, "\u300D"));
    }
  }), /*#__PURE__*/React.createElement(AIPanel, {
    open: aiOpen,
    onClose: function onClose() {
      return setAiOpen(false);
    },
    messages: aiMsgs,
    onSend: sendAI,
    suggestions: aiSuggest
  }), /*#__PURE__*/React.createElement(SubscribeSheet, {
    open: subscribeOpen,
    onClose: function onClose() {
      return setSubscribeOpen(false);
    },
    onConfirm: function onConfirm(sel) {
      setSubscribed(true);
      setSubscribeOpen(false);
      var n = Object.values(sel).filter(Boolean).length;
      showToast("\u5DF2\u8BA2\u9605\u4F18\u60E0\u9891\u9053 \xB7 \u5DF2\u5F00\u542F ".concat(n, " \u7C7B\u6D88\u606F\u63A8\u9001"));
    }
  }), /*#__PURE__*/React.createElement(ConfirmDialog, {
    open: unsubOpen,
    title: "\u53D6\u6D88\u8BA2\u9605\u4F18\u60E0\u9891\u9053\uFF1F",
    desc: "\u53D6\u6D88\u540E\u5C06\u4E0D\u518D\u6536\u5230\u4E13\u5C5E\u4F18\u60E0\u3001\u6D3B\u52A8\u4E0E\u5185\u5BB9\u63A8\u9001\uFF0C\u5DF2\u9886\u53D6\u7684\u4F18\u60E0\u4E0D\u53D7\u5F71\u54CD\u3002",
    confirmText: "\u786E\u8BA4\u53D6\u6D88",
    cancelText: "\u518D\u60F3\u60F3",
    onClose: function onClose() {
      return setUnsubOpen(false);
    },
    onConfirm: function onConfirm() {
      setSubscribed(false);
      setUnsubOpen(false);
      showToast('已取消订阅优惠频道');
    }
  }), /*#__PURE__*/React.createElement(ShareSheet, {
    open: shareOpen,
    onClose: function onClose() {
      return setShareOpen(false);
    },
    onPick: function onPick(c) {
      setShareOpen(false);
      showToast(c.id === 'copy' ? '链接已复制到剪贴板' : "\u5DF2\u5206\u4EAB\u5230 ".concat(c.label));
    }
  }), false && ReactDOM.createPortal(/*#__PURE__*/React.createElement(ConsolePanel, {
    ctx: ctx,
    setCtx: _setCtx,
    open: consoleOpen,
    setOpen: setConsoleOpen,
    showToast: showToast,
    adSource: adSource,
    scenes: window.AGUI_SCENES,
    onPlayScene: _playScene2,
    activeScene: activeScene,
    running: scriptRunning,
    onLand: function onLand(kind) {
      setAdSource({
        kind: kind
      });
      showToast('已模拟外投渠道 landing');
    },
    onClearAd: function onClearAd() {
      setAdSource(null);
      showToast('已恢复自然流量');
    },
    onReset: function onReset() {
      setAgi({
        open: false,
        kind: null,
        data: null,
        anchor: 'feeds',
        flashKey: 0,
        h: 0,
        anim: false
      });
      setAiMsgs([]);
      setAiOpen(false);
      setDockTrayOpen(false);
      setActiveScene(null);
      setScriptRunning(false);
      setAdSource(null);
      _setCtx({
        identity: 'solo',
        tier: 'value',
        state: 'S1',
        city: null,
        family: _objectSpread({}, window.DATA.familyDefault)
      });
      if (scrollRef.current) {
        scrollRef.current.style.scrollBehavior = 'auto';
        scrollRef.current.scrollTop = 0;
      }
      showToast('已清除 AI 演示，回到初始页面');
    }
  }), document.body));
}

/* ---------------- 场景切换控制台 ⭐ ---------------- */
var STATES = [{
  id: 'S1',
  t: '灵感（无意图目的地且未下单）'
}, {
  id: 'S2',
  t: '决策（有意图目的地但未下单）'
}, {
  id: 'S3',
  t: '行程前'
}, {
  id: 'S4',
  t: '行程中'
}, {
  id: 'S5',
  t: '行程后'
}];
var CHANNELS = [{
  k: null,
  t: '自然流量'
}, {
  k: 'coupon',
  t: '优惠券投放'
}, {
  k: 'hotel',
  t: '酒店秒杀投放'
}, {
  k: 'flight',
  t: '机票秒杀投放'
}, {
  k: 'ticket',
  t: '门票秒杀投放'
}];
var PURPOSES = [{
  id: 'solo',
  t: '个人出行'
}, {
  id: 'family',
  t: '亲子出行'
}, {
  id: 'event',
  t: '展演出行'
}, {
  id: 'biz',
  t: '商务出行'
}];
function ConsolePanel(_ref) {
  var ctx = _ref.ctx,
    setCtx = _ref.setCtx,
    open = _ref.open,
    setOpen = _ref.setOpen,
    showToast = _ref.showToast,
    adSource = _ref.adSource,
    onLand = _ref.onLand,
    onClearAd = _ref.onClearAd,
    onReset = _ref.onReset,
    scenes = _ref.scenes,
    onPlayScene = _ref.onPlayScene,
    activeScene = _ref.activeScene,
    running = _ref.running;
  var Section = function Section(_ref2) {
    var n = _ref2.n,
      title = _ref2.title,
      children = _ref2.children;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 17
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 7,
        background: 'rgba(0,0,0,.07)',
        color: '#3a3a42',
        fontSize: 14,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16.5,
        fontWeight: 800,
        color: '#16161c',
        letterSpacing: .2
      }
    }, title)), children);
  };
  var Row = function Row(_ref3) {
    var label = _ref3.label,
      children = _ref3.children;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 9
      }
    }, label && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#82828e',
        marginBottom: 5,
        paddingLeft: 1
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5,
        flexWrap: 'wrap'
      }
    }, children));
  };
  var Chip = function Chip(_ref4) {
    var on = _ref4.on,
      onClick = _ref4.onClick,
      children = _ref4.children;
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      style: {
        padding: '6px 11px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: on ? 800 : 600,
        background: on ? 'var(--brand,#D87D91)' : '#f1f1f4',
        color: on ? '#fff' : '#41414a',
        border: '1px solid ' + (on ? 'var(--brand,#D87D91)' : '#e4e4ea'),
        textAlign: 'left',
        lineHeight: 1.3
      }
    }, children);
  };
  if (!open) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setOpen(true);
      },
      style: {
        position: 'fixed',
        right: 14,
        bottom: 24,
        zIndex: 'var(--z-console)',
        background: '#fff',
        color: '#16161c',
        borderRadius: 14,
        padding: '12px 16px',
        fontSize: 14,
        fontWeight: 800,
        boxShadow: '0 8px 24px rgba(0,0,0,.22)',
        border: '1px solid rgba(0,0,0,.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "dice",
      size: 18,
      color: "#16161c"
    }), " \u573A\u666F\u63A7\u5236\u53F0");
  }
  var curChannel = adSource ? adSource.kind : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 14,
      bottom: 24,
      width: 440,
      maxHeight: 'calc(100vh - 48px)',
      overflowY: 'auto',
      zIndex: 'var(--z-console)',
      background: '#FFFFFF',
      borderRadius: 18,
      padding: '16px 18px',
      color: '#16161c',
      boxShadow: '0 16px 50px rgba(0,0,0,.22)',
      border: '1px solid rgba(0,0,0,.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17,
      fontWeight: 900,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: '#16161c'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dice",
    size: 18,
    color: "#16161c"
  }), "\u573A\u666F\u5207\u6362\u63A7\u5236\u53F0"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setOpen(false);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "close",
    size: 18,
    color: "#9a9aa5"
  }))), /*#__PURE__*/React.createElement(Section, {
    n: "1",
    title: "\u7528\u6237\u6E20\u9053\u6765\u6E90"
  }, /*#__PURE__*/React.createElement(Row, null, CHANNELS.map(function (c) {
    return /*#__PURE__*/React.createElement(Chip, {
      key: c.k || 'natural',
      on: curChannel === c.k,
      onClick: function onClick() {
        return c.k ? onLand && onLand(c.k) : onClearAd && onClearAd();
      }
    }, c.t);
  }))), /*#__PURE__*/React.createElement(Section, {
    n: "2",
    title: "\u7528\u6237\u521D\u59CB\u610F\u56FE\u8BC6\u522B\uFF08\u521D\u59CB\u9875\u9762\uFF09"
  }, /*#__PURE__*/React.createElement(Row, {
    label: "\u51FA\u884C\u76EE\u7684"
  }, PURPOSES.map(function (p) {
    return /*#__PURE__*/React.createElement(Chip, {
      key: p.id,
      on: ctx.identity === p.id,
      onClick: function onClick() {
        return setCtx(function (c) {
          return _objectSpread(_objectSpread({}, c), {}, {
            identity: p.id
          });
        });
      }
    }, p.t);
  })), /*#__PURE__*/React.createElement(Row, {
    label: "\u884C\u7A0B\u72B6\u6001"
  }, STATES.map(function (s) {
    return /*#__PURE__*/React.createElement(Chip, {
      key: s.id,
      on: ctx.state === s.id,
      onClick: function onClick() {
        return setCtx(function (c) {
          return _objectSpread(_objectSpread({}, c), {}, {
            state: s.id,
            city: s.id === 'S1' ? null : c.city
          });
        });
      }
    }, s.t);
  })), /*#__PURE__*/React.createElement(Row, {
    label: "\u6D88\u8D39\u80FD\u529B"
  }, /*#__PURE__*/React.createElement(Chip, {
    on: ctx.tier === 'value',
    onClick: function onClick() {
      return setCtx(function (c) {
        return _objectSpread(_objectSpread({}, c), {}, {
          tier: 'value'
        });
      });
    }
  }, "\u6027\u4EF7\u6BD4"), /*#__PURE__*/React.createElement(Chip, {
    on: ctx.tier === 'premium',
    onClick: function onClick() {
      return setCtx(function (c) {
        return _objectSpread(_objectSpread({}, c), {}, {
          tier: 'premium'
        });
      });
    }
  }, "\u9AD8\u7AEF"))), /*#__PURE__*/React.createElement(Section, {
    n: "3",
    title: "\u7528\u6237\u5B9E\u65F6\u610F\u56FE\u4FEE\u6B63\uFF08\u52A8\u6001\u9875\u9762\uFF09"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onReset,
    style: {
      marginBottom: 11,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: '11px 12px',
      borderRadius: 11,
      border: '1px solid rgba(0,0,0,.14)',
      background: '#F4F4F6',
      color: '#1a1a1f',
      fontSize: 13.5,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "undo",
    size: 15,
    color: "#1a1a1f"
  }), "\u56DE\u5230\u521D\u59CB\u9875\u9762 \xB7 \u6E05\u9664 AI \u6F14\u793A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: '#82828e',
      margin: '-3px 0 9px',
      lineHeight: 1.5
    }
  }, "\u70B9\u4EFB\u4E00\u573A\u666F \u25B6\uFF0C\u624B\u673A\u7AEF\u5B9E\u65F6\u6F14\u793A\u300C\u63D0\u95EE \u2192 AI \u56DE\u590D \u2192 \u9875\u9762\u4E2D\u63D2 / \u5237\u65B0 / \u91CD\u6392\u300D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, (scenes || []).map(function (sc) {
    var on = activeScene === sc.no;
    return /*#__PURE__*/React.createElement("div", {
      key: sc.no,
      style: {
        border: '1px solid ' + (on ? 'rgba(216,125,145,.55)' : 'rgba(0,0,0,.09)'),
        borderRadius: 11,
        background: on ? 'rgba(216,125,145,.10)' : '#fafafb',
        transition: 'all .2s'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onPlayScene(sc);
      },
      disabled: running && !on,
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '9px 10px',
        textAlign: 'left',
        background: 'transparent',
        cursor: running && !on ? 'default' : 'pointer',
        opacity: running && !on ? 0.45 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: 7,
        background: on ? 'var(--brand,#D87D91)' : '#ececf0',
        color: on ? '#fff' : '#55555f',
        fontSize: 12,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, sc.no), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: 14,
        fontWeight: 800,
        color: '#1a1a1f'
      }
    }, sc.title, on && running && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        fontSize: 10,
        color: '#1F9D57',
        fontWeight: 800
      }
    }, "\u25CF \u64AD\u653E\u4E2D")), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 4,
        marginTop: 4,
        flexWrap: 'wrap'
      }
    }, sc.tags.map(function (t) {
      return /*#__PURE__*/React.createElement("span", {
        key: t,
        style: {
          fontSize: 9.5,
          fontWeight: 800,
          padding: '1.5px 6px',
          borderRadius: 5,
          background: '#ececf0',
          color: '#5a5a64'
        }
      }, t);
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 99,
        background: 'var(--brand,#D87D91)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 10px rgba(184,94,116,.4)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 11,
      color: "#fff"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 10px 10px 43px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }
    }, sc.steps.map(function (s, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 7,
          fontSize: 12,
          color: '#56565f',
          lineHeight: 1.5
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          flexShrink: 0,
          width: 15,
          height: 15,
          borderRadius: 4,
          background: '#ececf0',
          color: '#88888f',
          fontSize: 10,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1
        }
      }, i + 1), /*#__PURE__*/React.createElement("span", null, s));
    })));
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));