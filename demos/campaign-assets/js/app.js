
/* ========================= Mock data (would come from MCP) ========================= */
const TEAM_LOCALES = {
  HK: ['en-HK', 'zh-HK'],
  TW: ['zh-TW'],
  SG: ['en-SG'],
  MY: ['en-MY', 'zh-MY', 'ms-MY']
};

function buildLocaleContent(localeList, kind) {
  const out = {};
  localeList.forEach(loc => out[loc] = kind(loc));
  return out;
}

const COLLECTION_NAME = { M4411: 'IBU Mega Sale 2026 Collection' };

const CAMPAIGNS = [
  { collectionId: 'M4411', campaignId: 31571, appId: 1058, team: 'HK',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'HK Mega Sale 2026 · Local',
    theme: 'Mega Sale', grade: 'Tier 1', status: 'live',
    createTime: '2026-04-02 10:24', updateTime: '2026-05-15 18:22',
    creator: 'TR029671', notificationStatus: 'Submitted' },
  { collectionId: 'M4411', campaignId: 31582, appId: 1065, team: 'HK',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'HK Flash Deal · Weekend',
    theme: 'HK_HKMO_destination', grade: 'Tier 2', status: 'upcoming',
    createTime: '2026-04-15 09:11', updateTime: '2026-05-10 16:30',
    creator: 'H00101', notificationStatus: 'Not Submitted' },
  { collectionId: 'M4411', campaignId: 31578, appId: 1114, team: 'TW',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'TW Mega Sale 2026 · Outbound',
    theme: 'Mega Sale', grade: 'Tier 1', status: 'upcoming',
    createTime: '2026-04-08 13:50', updateTime: '2026-05-14 11:05',
    creator: 'TR049732', notificationStatus: 'Submitted' },
  { collectionId: 'M4411', campaignId: 31585, appId: 1120, team: 'TW',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'TW Coupon Carnival',
    theme: 'JP_Branding_campaign', grade: 'Tier 3', status: 'live',
    createTime: '2026-04-21 11:10', updateTime: '2026-05-16 09:42',
    creator: 'S68292', notificationStatus: 'Not Submitted' },
  { collectionId: 'M4411', campaignId: 31599, appId: 981, team: 'SG',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'SG Mega Sale 2026 · Cross-sell',
    theme: 'Mega Sale', grade: 'Tier 2', status: 'live',
    createTime: '2026-04-04 17:32', updateTime: '2026-05-16 09:30',
    creator: 'TR049732', notificationStatus: 'Submitted' },
  { collectionId: 'M4411', campaignId: 31602, appId: 990, team: 'SG',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'SG Member Day',
    theme: 'TH_Branding_campaign', grade: 'Tier 3', status: 'ended',
    createTime: '2026-03-12 14:00', updateTime: '2026-04-30 22:00',
    creator: 'S68292', notificationStatus: 'Not Submitted' },
  { collectionId: 'M4411', campaignId: 31606, appId: 1072, team: 'MY',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'MY Mega Sale 2026 · Local Hotel',
    theme: 'Mega Sale', grade: 'Tier 1', status: 'live',
    createTime: '2026-04-06 09:18', updateTime: '2026-05-15 22:11',
    creator: 'H00101', notificationStatus: 'Submitted' },
  { collectionId: 'M4411', campaignId: 31611, appId: 1080, team: 'MY',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'MY Double Day',
    theme: 'US_Airline_campaign', grade: 'Tier 2', status: 'draft',
    createTime: '2026-05-01 10:05', updateTime: '2026-05-14 15:00',
    creator: 'TR029671', notificationStatus: 'Not Submitted' },
  { collectionId: 'M4411', campaignId: 31618, appId: 1090, team: 'HK',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'HK Summer Getaway · Hotel',
    theme: 'HK_HKMO_destination', grade: 'Tier 2', status: 'live',
    createTime: '2026-04-26 14:30', updateTime: '2026-05-16 11:08',
    creator: 'TR049732', notificationStatus: 'Submitted' },
  { collectionId: 'M4411', campaignId: 31624, appId: 1095, team: 'TW',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'TW Branding · Japan Cherry',
    theme: 'JP_Branding_campaign', grade: 'Tier 1', status: 'upcoming',
    createTime: '2026-04-29 09:00', updateTime: '2026-05-12 17:42',
    creator: 'H00101', notificationStatus: 'Not Submitted' },
  { collectionId: 'M4411', campaignId: 31630, appId: 1102, team: 'SG',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'SG Flight Festival',
    theme: 'US_Airline_campaign', grade: 'Tier 1', status: 'live',
    createTime: '2026-04-18 16:21', updateTime: '2026-05-15 13:11',
    creator: 'S68292', notificationStatus: 'Submitted' },
  { collectionId: 'M4411', campaignId: 31637, appId: 1110, team: 'MY',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'MY Hari Raya Special',
    theme: 'TH_Branding_campaign', grade: 'Tier 2', status: 'ended',
    createTime: '2026-03-22 08:50', updateTime: '2026-04-28 19:00',
    creator: 'TR029671', notificationStatus: 'Not Submitted' },
  { collectionId: 'M4411', campaignId: 31642, appId: 1125, team: 'HK',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'HK Coupon Rush · Bundle',
    theme: 'Mega Sale', grade: 'Tier 3', status: 'draft',
    createTime: '2026-05-04 11:00', updateTime: '2026-05-13 10:24',
    creator: 'S68292', notificationStatus: 'Not Submitted' },
  { collectionId: 'M4411', campaignId: 31649, appId: 1133, team: 'TW',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'TW Member Exclusive · Hotel',
    theme: 'TH_Branding_campaign', grade: 'Tier 2', status: 'live',
    createTime: '2026-04-24 15:42', updateTime: '2026-05-16 08:55',
    creator: 'TR049732', notificationStatus: 'Submitted' },
  { collectionId: 'M4411', campaignId: 31655, appId: 1140, team: 'SG',
    collectionName: COLLECTION_NAME.M4411, campaignName: 'SG Weekend Escape',
    theme: 'HK_HKMO_destination', grade: 'Tier 3', status: 'upcoming',
    createTime: '2026-05-02 12:18', updateTime: '2026-05-14 22:30',
    creator: 'H00101', notificationStatus: 'Not Submitted' }
];

/* Reference-page schema column definitions */
const SUB_COLS = {
  flight: ['Time Zone','Display Period','Selling Period','Dcity','Acity','Airline','ActivityCode/Account Code','Promotion Type','Promotion Info','Currency'],
  hotel:  ['Time Zone','Display Period','Selling Period','Hotel ID','Hotel Name','Room ID','Room Name','Promotion ID','Promotion Type','Promotion Info','Currency','Subsidy Status'],
  tnt:    ['Time Zone','Display Period','Selling Period','Product ID','Product Name','Hook Resource ID','Hook Resource Name','Official Session ID','Promotion Type','Promotion Info','Currency'],
  bundle: ['Time Zone','Display Period','Selling Period','Dcity','Acity','Airline','Hotel ID','Hotel Name','Activity Code','Promotion Type','Promotion Info','Currency']
};
const COUPON_COLS = ['Gift ID','Gift Name','Gift Type','Time Zone','Start Time','End Time'];
const LANDING_FIELDS = ['Landing Page URL','Version','Update Time','Title','Description','Keywords','Terms&Conditions','Share Title','Share Description','Share URL','Share Image','Canonical Url'];
const PROMO_CHANNELS = ['Paid Ads (Facebook, Google UAC, Google Demand Gen)','SEO (SEO Refreshness, SEO Ad Slot, SEO Article)','Kol','Affiliate&Partner'];

const TEAM_TZ = {HK:'Asia/Hong_Kong', TW:'Asia/Taipei', SG:'Asia/Singapore', MY:'Asia/Kuala_Lumpur'};
const TEAM_DCITY = {HK:'HKG', TW:'TPE', SG:'SIN', MY:'KUL'};

/* Hard-coded data extracted from real reference pages (HK 31571, TW 31578, SG 31599, MY 31606) */
const REAL_DATA = {
  31571: {
    nameEN:'3.3 Mega Sale', nameLocal:'3.3 狂賞', theme:'HK_Local_Mega', grade:'Tier 2',
    description:'3.3 Mega Sale to drive incremental orders to the overall site with wow mechanisms and raise awareness of member benefits in the HK market',
    region:'HK', testCampaign:'No', timezone:'Local time',
    launchDate:'2026-02-27 00:00:00', periodType:'Fixed date time',
    startEndDate:'2026-02-27 00:00:00 - 2026-03-06 23:59:59',
    attachment:'Trip.com-20263.3GlobalMegaSaleHotelPitchingDeck-mLyxqik8.pptx',
    playIds:['31571001','31571002','31571003','31571004'],
    flight:[
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-07 00:00:00','2026-03-03 21:00:00 - 2026-03-03 23:29:59','HKG','OSA','HX','HKOP03032026','ONE_PRICE','333','HKD'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-07 00:00:00','2026-03-04 21:00:00 - 2026-03-04 23:29:59','HKG','BKK','EK','HKOP03032026','ONE_PRICE','333','HKD'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-07 00:00:00','2026-03-05 21:00:00 - 2026-03-05 23:29:59','HKG','SEL','OZ','HKOP03032026','ONE_PRICE','333','HKD'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-07 00:00:00','2026-03-06 21:00:00 - 2026-03-06 23:29:59','HKG','SHA','HX','HKOP03032026','ONE_PRICE','333','HKD'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-07 00:00:00','2026-03-06 21:00:00 - 2026-03-06 23:29:59','HKG','HGH','HX','HKOP03032026','ONE_PRICE','333','HKD']
    ],
    hotel:[],
    tnt:[
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-03 21:00:00 - 2026-03-06 23:59:59','104151875','Harbour Plaza Metropolis Buffet','104184102','[Up to Buy 2 Get 1 Free] Tea Buffet','0','BOGO','-','HKD','Active'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-04 21:00:00 - 2026-03-06 23:59:59','55423162','Whaleworld Whale Watching','104211751','Cruise Ticket + Guided Tour BOGO','301708','BOGO','-','HKD','Active'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-06 21:00:00 - 2026-03-06 23:59:59','10539235','HK-Zhuhai-Macao Bridge Tour','104234176','Family ticket (1 adult + 1 child)','0','BOGO','-','HKD','Active'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-05 21:00:00 - 2026-03-06 23:59:59','65876991','Korea eSIM','104010498','7days 10GB','301470','ONE_PRICE','1','HKD','Active'],
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-06 21:00:00 - 2026-03-06 23:59:59','56603834','HK Airport Express e-ticket','89332368','3.3Mega-HK 9.9HKD/ticket','301652','ONE_PRICE','9.9','HKD','Active']
    ],
    bundle:[
      ['Asia/Hong_Kong','2026-02-27 00:00:00 - 2026-03-07 00:00:00','2026-03-04 21:00:00 - 2026-03-06 23:59:59','HKG','TPE','-','1829145','Hotel Midtown Richardson','BSHK0304','ONE_PRICE','1333.000000','HKD']
    ],
    coupons:[
      ['604030589','【营销】Trip-国际租车-IBU营销活动导流-租车92折','PRIVATE_COUPON','Asia/Hong_Kong','2024-11-20 00:00:00','2026-12-31 23:59:59'],
      ['1555614116','【营销】Trip-国际租车-HK-Mega 33 0303-T-All 50% off cap 200 HKD','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1375166044','【营销】Trip-国际租车-HK-Mega 33 0304','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1811383716','【营销】Trip-国际租车-HK-Mega 33 0305','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1144854992','【营销】Trip-国际租车-HK-Mega 33 0306','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1618757163','【营销】Trip-国际接送机-3.3 Mega-5折券(HK)D1','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-23 00:00:00','2026-03-10 23:59:59'],
      ['1192176084','【营销】Trip-国际接送机-3.3 Mega-5折券(HK)D2','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-23 00:00:00','2026-03-10 23:59:59'],
      ['1523453585','【营销】Trip-国际接送机-3.3 Mega-5折券(HK)D3','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-23 00:00:00','2026-03-10 23:59:59'],
      ['1650201893','Trip-MTR-供应商预算3.3MEGA','PUBLIC_COUPON','Asia/Hong_Kong','2026-02-09 00:00:00','2026-03-08 23:59:59'],
      ['1262922595','【T站邮轮】邮轮ALL3%券','PRIVATE_COUPON','Asia/Hong_Kong','2026-02-21 00:00:00','2026-05-20 23:59:59'],
      ['1176505989','2026 HK 3.3 Mega MC - Flight 533','PUBLIC_COUPON','Asia/Hong_Kong','2026-02-14 11:23:06','2026-03-03 23:59:59'],
      ['1980538833','2026 HK 3.3 Mega MC - Hotel 533','PUBLIC_COUPON','Asia/Hong_Kong','2026-02-14 11:30:48','2026-03-03 23:59:59'],
      ['1467847501','2026 HK 3.3 Mega MC - B&S 933','PUBLIC_COUPON','Asia/Hong_Kong','2026-02-14 11:53:04','2026-03-04 23:59:59']
    ],
    promo:{
      paid:{headline:'3.3 Mega Sale | HK',content:'Up to 80% off on flights, hotels and tickets in this 3.3 Mega Sale.'},
      seo:{headline:'3.3 Mega Sale | HK',content:'Up to 80% off on flights, hotels and tickets in this 3.3 Mega Sale.'},
      kol:{headline:'3.3 Mega Sale | HK',content:'Up to 80% off on flights, hotels and tickets in this 3.3 Mega Sale.'},
      affiliate:{headline:'3.3 Mega Sale | HK',content:'Up to 80% off on flights, hotels and tickets in this 3.3 Mega Sale.'}
    },
    kvImages:[
      'https://dimg04.tripcdn.com/images/0a16612000rloakigF4D3.jpg',
      'https://dimg04.tripcdn.com/images/0a14g12000rloag2m1E55.jpg',
      'https://dimg04.tripcdn.com/images/0a10412000rloakts85F9.jpg',
      'https://dimg04.tripcdn.com/images/0a13p12000rloae6dA114.jpg',
      'https://dimg04.tripcdn.com/images/0a16312000rload9aC1E3.png',
      'https://dimg04.tripcdn.com/images/0a13x12000rloadgaDB70.jpg',
      'https://dimg04.tripcdn.com/images/0a14n12000rloalf8494C.jpg'
    ],
    flashImages:[
      'https://dimg04.tripcdn.com/images/0a15g12000rmprwmyB129.png',
      'https://dimg04.tripcdn.com/images/0a15512000rmps9f761C7.png',
      'https://dimg04.tripcdn.com/images/0a11c12000rmps1gmBB1A.png',
      'https://dimg04.tripcdn.com/images/0a14u12000rmps6ii2ABB.png',
      'https://dimg04.tripcdn.com/images/0a10z12000rmps8niF35A.png',
      'https://dimg04.tripcdn.com/images/0a15a12000rmps1v9CD2D.png',
      'https://dimg04.tripcdn.com/images/0a13012000rmps0i183E3.png'
    ],
    supplementary:'Please refer to the detailed mechanism plan in the sheet: https://globalctrip.sharepoint.com/:x:/s/IBURegionalCampaign/IQAsRHlr0q5CRYZSZvszmZ1FAQT_urPriERzc4rQ3IT4n1g?e=VYl4cP'
  },
  31578: {
    nameEN:'TW 3.3 Mega', nameLocal:'3.3 春季旅展', theme:'TW_Local_Mega', grade:'Tier 2',
    description:'TW 3.3 Mega', region:'TW', testCampaign:'No', timezone:'Local time',
    launchDate:'2026-02-28 00:00:00', periodType:'Fixed date time',
    startEndDate:'2026-03-03 00:00:00 - 2026-03-06 23:59:59',
    attachment:'Trip.com-20263.3GlobalMegaSaleHotelPitchingDeck-mLyxqik8.pptx',
    playIds:['31578001','31578002','31578003'],
    flight:[
      ['Asia/Taipei','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 21:30:00 - 2026-03-04 21:29:59','TPE','TYO','-','TWOP03032026','ONE_PRICE','99','TWD'],
      ['Asia/Taipei','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 21:30:00 - 2026-03-04 21:29:59','TPE','OSA','-','TWOP03032026','ONE_PRICE','99','TWD'],
      ['Asia/Taipei','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 21:30:00 - 2026-03-04 21:29:59','TPE','OKA','-','TWOP03032026','ONE_PRICE','99','TWD']
    ],
    hotel:[],
    tnt:[
      ['Asia/Taipei','2026-03-06 12:00:00 - 2026-03-06 23:59:59','2026-03-06 12:00:00 - 2026-03-06 23:59:59','24652835','Seoul Land','102181162','Seoul Land Ticket Adult','-','DISCOUNT','66','TWD','Active'],
      ['Asia/Taipei','2026-03-06 12:00:00 - 2026-03-06 23:59:59','2026-03-06 12:00:00 - 2026-03-06 23:59:59','133903160','Xpark Aquarium','104194136','Xpark Aquarium Ticket','302674','BOGO','-','TWD','Active'],
      ['Asia/Taipei','2026-03-06 12:00:00 - 2026-03-06 23:59:59','2026-03-06 12:00:00 - 2026-03-06 23:59:59','56603834','HK Airport Express e-ticket','93285870','3.3Mega-TW NT$40/ticket','-','ONE_PRICE','40','TWD','Active'],
      ['Asia/Taipei','2026-03-06 12:00:00 - 2026-03-06 23:59:59','2026-03-06 12:00:00 - 2026-03-06 23:59:59','46000611','South Korea 5G eSIM','103933614','7days 5GB','302639','ONE_PRICE','10','TWD','Active']
    ],
    bundle:[],
    coupons:[
      ['1259109545','TW Baggage Coupon 2026.03.03','PRIVATE_COUPON','Asia/Taipei','2026-02-02 15:48:23','2026-03-06 23:59:59'],
      ['1887463355','[TCP] 2026 TW 3.3 Mega - Flight 333','PUBLIC_COUPON','Asia/Taipei','2026-02-09 12:10:57','2026-03-06 23:59:59'],
      ['1406906043','[TCP] 2026 TW 3.3 Mega - Hotel 333','PUBLIC_COUPON','Asia/Taipei','2026-02-09 12:09:46','2026-03-06 23:59:59'],
      ['1597194343','[TCP] 2026 TW 3.3 Mega - Flight 1111','PUBLIC_COUPON','Asia/Taipei','2026-02-04 22:48:22','2026-03-06 23:59:59'],
      ['1891835078','[TCP] 2026 TW 3.3 Mega - Flight 333(2)','PUBLIC_COUPON','Asia/Taipei','2026-02-09 12:16:50','2026-03-06 23:59:59'],
      ['1302334338','[TCP] 2026 TW 3.3 Mega - Hotel 1111(new)','PUBLIC_COUPON','Asia/Taipei','2026-02-09 12:13:39','2026-03-06 23:59:59'],
      ['1916253491','[TCP] 2026 TW 3.3 Mega - Hotel 333(2)','PUBLIC_COUPON','Asia/Taipei','2026-02-09 12:13:09','2026-03-06 23:59:59']
    ],
    promo:{
      paid:{headline:'TW 3.3 Mega Sale Spring Travel Expo',content:'Spring travel expo with up to 90% off on flights, hotels and attractions across Taiwan and overseas.'},
      seo:{headline:'TW 3.3 Mega Sale Spring Travel Expo',content:'Spring travel expo with up to 90% off on flights, hotels and attractions across Taiwan and overseas.'},
      kol:{headline:'TW 3.3 Mega Sale Spring Travel Expo',content:'Spring travel expo with up to 90% off on flights, hotels and attractions across Taiwan and overseas.'},
      affiliate:{headline:'TW 3.3 Mega Sale Spring Travel Expo',content:'Spring travel expo with up to 90% off on flights, hotels and attractions across Taiwan and overseas.'}
    },
    kvImages:[
      'https://dimg04.tripcdn.com/images/0a15f12000richrmwF6BC.png',
      'https://dimg04.tripcdn.com/images/0a12d12000richvgf614E.png',
      'https://dimg04.tripcdn.com/images/0a14i12000rici47yAC44.png',
      'https://dimg04.tripcdn.com/images/0a14j12000rici171FD39.png',
      'https://dimg04.tripcdn.com/images/0a11j12000ricify9EF22.png',
      'https://dimg04.tripcdn.com/images/0a10y12000ricidzt5D64.png',
      'https://dimg04.tripcdn.com/images/0a15p12000rici4yf6DC3.png'
    ],
    flashImages:[
      'https://dimg04.tripcdn.com/images/0a11212000rmejxx5263C.png',
      'https://dimg04.tripcdn.com/images/0a17312000rmek7rx6F3B.png',
      'https://dimg04.tripcdn.com/images/0a12t12000rmekh2rCB98.png',
      'https://dimg04.tripcdn.com/images/0a12r12000riddv60B212.png',
      'https://dimg04.tripcdn.com/images/0a16k12000rmekjqmA39E.png',
      'https://dimg04.tripcdn.com/images/0a15912000rmejx4d3D71.png',
      'https://dimg04.tripcdn.com/images/0a12512000rmekeq4B656.png'
    ],
    supplementary:'- [3.3 Mega] Mechanism Planning & Products (for mkt).xlsx\nhttps://globalctrip.sharepoint.com/:x:/s/IBURegionalCampaign/IQCWxbdcNtvcSJklbbciOoA2AXmanY6tmlD2JZsrYuyQ-90?e=T61ybg\n- Banners\nhttps://globalctrip.sharepoint.com/:f:/s/IBURegionalCampaign/IgDbqq2G2paBSKXlmz7-QjJ2AazGQQPTWP4rr1UN2jT7d6M?e=P8nDqK\n- APP MKT - will upload by Feb 25th'
  },
  31599: {
    nameEN:'[SG] 3.3 Mega Sale', nameLocal:'[SG] 3.3 Mega Sale', theme:'SG_Local_Mega', grade:'Tier 2',
    description:'The first sale of 2026 featuring irresistible product offerings, compelling marketing hooks and lastly, investments on both organic and paid channels. To reinforce Trip.com\u2019s branding as your one-stop travel app for Flights, Hotels, Attractions and Tours, Trains, Airport Transfer, Car Rental, Cruises, Packaged Tours and more!',
    region:'SG', testCampaign:'No', timezone:'Local time',
    launchDate:'2026-02-28 00:00:00', periodType:'Fixed date time',
    startEndDate:'2026-03-03 00:00:00 - 2026-03-06 23:59:59',
    attachment:'Trip.com-20263.3GlobalMegaSaleHotelPitchingDeck-mLyxqik8.pptx',
    playIds:['31599001','31599002','31599003'],
    flight:[
      ['Asia/Singapore','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 10:00:00 - 2026-03-03 23:59:59','SIN','AKL','NZ','SGOP03032026','ONE_PRICE','800','SGD'],
      ['Asia/Singapore','2026-02-25 00:00:00 - 2026-02-28 23:59:59','2026-02-25 10:00:00 - 2026-02-25 10:40:00','SIN','LON','QR','SGOP03032026','ONE_PRICE','800','SGD'],
      ['Asia/Singapore','2026-02-25 00:00:00 - 2026-02-28 23:59:59','2026-02-25 15:00:00 - 2026-02-25 15:40:00','SIN','SYD','SQ','SGOP03032026','ONE_PRICE','800','SGD']
    ],
    hotel:[],
    tnt:[
      ['Asia/Singapore','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 17:00:00 - 2026-03-03 23:59:59','96233513','HAVE FUN IN KANSAI premium ver.','104005611','HAVE FUN IN KANSAI','302065','BOGO','-','SGD','Active'],
      ['Asia/Singapore','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 17:00:00 - 2026-03-03 23:59:59','53873746','China eSIM','104009358','7days 10GB','301981','ONE_PRICE','1','SGD','Active'],
      ['Asia/Singapore','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 17:00:00 - 2026-03-03 23:59:59','45892282','Europe eSIM','104009151','7days 10GB','301967','ONE_PRICE','1','SGD','Active'],
      ['Asia/Singapore','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 17:00:00 - 2026-03-03 23:59:59','100092341','Thailand eSIM','104008007','5days 10GB','301932','ONE_PRICE','1','SGD','Active'],
      ['Asia/Singapore','2026-02-28 00:00:00 - 2026-03-06 23:59:59','2026-03-03 17:00:00 - 2026-03-03 23:59:59','57492468','Japan eSIM','93927883','7days 1GB/day','301953','ONE_PRICE','1','SGD','Active']
    ],
    bundle:[],
    coupons:[
      ['1626005458','sg_1840_flt25_0303/0303_mega3.3_3pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:22:36','2026-03-03 23:59:59'],
      ['1248619772','sg_1840_flt25_0303/0303_mega3.3_6pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:25:06','2026-03-03 23:59:59'],
      ['1478528894','sg_1840_flt25_0303/0303_mega3.3_9pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:26:53','2026-03-03 23:59:59'],
      ['1167763747','sg_1840_htl25_0303/0303_mega3.3_3pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:47:29','2026-03-03 23:59:59'],
      ['1262025482','sg_1840_htl25_0303/0303_mega3.3_6pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:49:24','2026-03-03 23:59:59'],
      ['1717337260','sg_1840_htl35_0303/0303_mega3.3_6pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:50:06','2026-03-03 23:59:59'],
      ['1609195051','sg_1840_htl25_0303/0303_mega3.3_9pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:50:47','2026-03-03 23:59:59'],
      ['1637045977','sg_1840_htl35_0303/0303_mega3.3_9pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 18:51:38','2026-03-03 23:59:59'],
      ['1524072018','Copy - sg_1840_flt20_0304/0306_mega3.3_3pm','PUBLIC_COUPON','Asia/Singapore','2026-02-11 10:42:34','2026-03-06 23:59:59'],
      ['1411743670','sg_1840_htl20_0304/0306_mega3.3_9pm','PUBLIC_COUPON','Asia/Singapore','2026-02-10 19:02:32','2026-03-06 23:59:59']
    ],
    landingTerms:'1. This 3.3 Mega Sale Campaign is held by Trip.com Travel Singapore Pte. Ltd. ("Trip.com"). By entering this Promotion, you accept and agree to these terms.\n2. Promotion period: Singapore Time (GMT+8) 3 - 6 March 2026 (both dates inclusive).\n3. Promotion platforms: Trip.com Singapore website, app and mobile site.\n4. Limited-time offers include daily flash sale, hotel with prepay room-only discounts, tours and tickets, and flight offers.\n5. The quantity of limited-time offers in this Promotion is limited and will be served on a first come first served basis.\n6. The Flash Sale promotion is limited and made available on a first-come-first-served basis.\n... (full T&Cs in original page)',
    promo:{
      paid:{headline:'[SG] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'},
      seo:{headline:'[SG] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'},
      kol:{headline:'[SG] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'},
      affiliate:{headline:'[SG] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'}
    },
    kvImages:[
      'https://dimg04.tripcdn.com/images/0a12f12000rloa27e1AED.png',
      'https://dimg04.tripcdn.com/images/0a12d12000rloa66xF811.png',
      'https://dimg04.tripcdn.com/images/0a10x12000rloais6C8D0.png',
      'https://dimg04.tripcdn.com/images/0a16812000rloa4d469E1.png',
      'https://dimg04.tripcdn.com/images/0a14412000rlo9w9q0F13.png',
      'https://dimg04.tripcdn.com/images/0a14112000rlo9lp02D0E.png',
      'https://dimg04.tripcdn.com/images/0a14x12000rlo9lp17DEB.png'
    ],
    flashImages:[
      'https://dimg04.tripcdn.com/images/0a10q12000rlo7e6x1ACC.png',
      'https://dimg04.tripcdn.com/images/0a16m12000rlo7m9l7AE1.png',
      'https://dimg04.tripcdn.com/images/0a12112000rlo7j7q6B99.png',
      'https://dimg04.tripcdn.com/images/0a11p12000rlo6qtrA395.png',
      'https://dimg04.tripcdn.com/images/0a11c12000rlo6omt1B2B.png',
      'https://dimg04.tripcdn.com/images/0a14112000rlo75ozC6AA.png',
      'https://dimg04.tripcdn.com/images/0a15i12000rlo6si4ABC4.png'
    ],
    supplementary:'https://trip.sg.larkenterprise.com/sheets/ApW1smUMMhGUlktOWDzl4U8pg2b'
  },
  31606: {
    nameEN:'[MY] 3.3 Mega Sale', nameLocal:'[MY] 3.3 Mega Sale', theme:'MY_Local_Mega', grade:'Tier 2',
    description:'The first sale of 2026 featuring irresistible product offerings, compelling marketing hooks and lastly, investments on both organic and paid channels. To reinforce Trip.com\u2019s branding as your one-stop travel app for Flights, Hotels, Attractions and Tours, Trains, Airport Transfer, Car Rental, Cruises, Packaged Tours and more!',
    region:'MY', testCampaign:'No', timezone:'Local time',
    launchDate:'2026-02-28 00:00:00', periodType:'Fixed date time',
    startEndDate:'2026-03-03 00:00:00 - 2026-03-06 23:59:59',
    attachment:'Trip.com-20263.3GlobalMegaSaleHotelPitchingDeck-mLyxqik8.pptx',
    playIds:['31606001','31606002','31606003'],
    flight:[
      ['Asia/Singapore','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-03 12:00:00 - 2026-03-03 23:59:59','KUL','BKK','TG','MYOP03032026','ONE_PRICE','399','MYR'],
      ['Asia/Singapore','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-03 15:00:00 - 2026-03-03 23:59:59','KUL','PER','TR','MYOP03032026','ONE_PRICE','699','MYR'],
      ['Asia/Singapore','2026-02-27 00:00:00 - 2026-03-06 23:59:59','2026-03-03 21:00:00 - 2026-03-03 23:59:59','KUL','TYO','PR','MYOP03032026','ONE_PRICE','899','MYR']
    ],
    hotel:[],
    tnt:[],
    bundle:[],
    coupons:[
      ['1566640845','【营销】Trip-国际租车-MY-Mega 33 0303-T-All 50% off cap 65 MYR','PRIVATE_COUPON','Asia/Kuala_Lumpur','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1703503289','【营销】Trip-国际租车-MY-Mega 33 0304','PRIVATE_COUPON','Asia/Kuala_Lumpur','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1771043567','【营销】Trip-国际租车-MY-Mega 33 0305','PRIVATE_COUPON','Asia/Kuala_Lumpur','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1115751002','【营销】Trip-国际租车-MY-Mega 33 0306','PRIVATE_COUPON','Asia/Kuala_Lumpur','2026-02-09 00:00:00','2026-03-06 23:59:59'],
      ['1182296531','T站【景点玩乐】33+上海迪士尼度假区50元无门槛券','PUBLIC_COUPON','Asia/Kuala_Lumpur','2026-02-06 00:00:00','2027-02-05 23:59:59'],
      ['1650008871','[Trip-TNT]-202-33 mega-USJ Designated Set-RM78 OFF','PUBLIC_COUPON','Asia/Kuala_Lumpur','2026-02-15 12:53:02','2026-03-06 23:59:59'],
      ['1088289432','【门票活动-香港】 香港迪士尼乐园-33超品-Global站点-80HKD','PUBLIC_COUPON','Asia/Kuala_Lumpur','2026-02-06 00:00:00','2026-03-07 23:59:59'],
      ['1289967945','【门票活动-香港】 香港迪士尼乐园-33mega-MY站点-200HKD','PUBLIC_COUPON','Asia/Kuala_Lumpur','2026-02-06 00:00:00','2026-03-10 23:59:59']
    ],
    promo:{
      paid:{headline:'[MY] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'},
      seo:{headline:'[MY] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'},
      kol:{headline:'[MY] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'},
      affiliate:{headline:'[MY] 3.3 Mega Sale Up to 80% Off',content:'Up to 80% off on Flights, Hotels, Tours and Tickets, Trains, Airport Transfers, Cars and more during the 3.3 Mega Sale.'}
    },
    kvImages:[
      'https://dimg04.tripcdn.com/images/0a16q12000rj9511689DF.png',
      'https://dimg04.tripcdn.com/images/0a13o12000rj95a0059A0.png',
      'https://dimg04.tripcdn.com/images/0a14v12000rj94w7u23D2.png',
      'https://dimg04.tripcdn.com/images/0a11v12000rj95exnE620.png',
      'https://dimg04.tripcdn.com/images/0a11m12000rj94u7g9971.png',
      'https://dimg04.tripcdn.com/images/0a11u12000rj95htmF181.png',
      'https://dimg04.tripcdn.com/images/0a10e12000rj95l2a9113.png'
    ],
    flashImages:[
      'https://dimg04.tripcdn.com/images/0a14f12000rkk9lciFF8B.png',
      'https://dimg04.tripcdn.com/images/0a10f12000rkk84eg5ABA.png',
      'https://dimg04.tripcdn.com/images/0a11e12000rkk89onF761.png',
      'https://dimg04.tripcdn.com/images/0a14912000rkk8k0b7E08.png',
      'https://dimg04.tripcdn.com/images/0a14h12000rkk9oqr8B8A.png',
      'https://dimg04.tripcdn.com/images/0a12g12000rkk9qh8D743.png',
      'https://dimg04.tripcdn.com/images/0a15h12000rkk9oro9220.png'
    ],
    supplementary:'Please refer here for the 3.3 Hooks: https://globalctrip.sharepoint.com/:x:/s/IBURegionalCampaign/IQALNMF_CrE_S4609fRx5vmzAdTfO-_nXHxMgQ5paO85aO0?e=2Ifadt'
  }
};

/* Mock data generator: uses REAL_DATA when available; otherwise produces plausible templated data */
function makeDetail(c) {
  const locales = TEAM_LOCALES[c.team];
  const cur = ({HK:'HKD',TW:'TWD',SG:'SGD',MY:'MYR'})[c.team];
  const tz = TEAM_TZ[c.team];
  const dcity = TEAM_DCITY[c.team];

  // Build real or mock content
  let r = REAL_DATA[c.campaignId];
  if (!r) {
    const id = c.campaignId;
    const opCode = `${c.team}OP${String(id).slice(-4)}`;
    r = {
      nameEN: c.campaignName,
      nameLocal: c.campaignName,
      theme: c.theme, grade: c.grade,
      description: `${c.campaignName} - ${c.theme} campaign in ${c.team} market.`,
      region: c.team, testCampaign:'No', timezone:'Local time',
      launchDate: c.createTime + ':00',
      periodType:'Fixed date time',
      startEndDate:`${c.createTime.split(' ')[0]} 00:00:00 - ${c.updateTime.split(' ')[0]} 23:59:59`,
      attachment:`Trip.com-${c.team}-${c.theme.replace(/\s+/g,'')}-PitchingDeck.pptx`,
      flight:[
        [tz, c.createTime+':00', c.updateTime+':00', dcity, 'BKK', '-', opCode, 'ONE_PRICE','199', cur],
        [tz, c.createTime+':00', c.updateTime+':00', dcity, 'TYO', '-', opCode, 'ONE_PRICE','299', cur]
      ],
      hotel:[
        [tz, c.createTime+':00', c.updateTime+':00','HOT'+(id%9000),'Selected '+c.team+' Hotel','RM'+(id%900),'Deluxe Room','PROMO'+(id%9000),'DISCOUNT','30','-',cur,'Active']
      ],
      tnt:[
        [tz, c.createTime+':00', c.updateTime+':00','TNT'+(id%9000),'Selected '+c.team+' Attraction','HRES'+(id%9000),'Adult Ticket','-','BOGO','-',cur,'Active']
      ],
      bundle:[],
      coupons:[
        [`P${id}001`,`[Mkt] ${c.team}-${c.theme}-Flight 10% off`,'PRIVATE_COUPON',tz,c.createTime+':00',c.updateTime+':00'],
        [`P${id}002`,`[Mkt] ${c.team}-${c.theme}-Hotel 50 ${cur} off`,'PUBLIC_COUPON',tz,c.createTime+':00',c.updateTime+':00'],
        [`P${id}003`,`[Mkt] ${c.team}-${c.theme}-TNT BOGO`,'PUBLIC_COUPON',tz,c.createTime+':00',c.updateTime+':00']
      ],
      promo:{
        paid:{headline:`${c.team} ${c.theme} | Limited`,content:`Up to 80% off across all products in ${c.team} during ${c.campaignName}.`},
        seo:{headline:`${c.team} ${c.theme} | Limited`,content:`Up to 80% off across all products in ${c.team} during ${c.campaignName}.`},
        kol:{headline:`${c.team} ${c.theme} | Limited`,content:`Up to 80% off across all products in ${c.team} during ${c.campaignName}.`},
        affiliate:{headline:`${c.team} ${c.theme} | Limited`,content:`Up to 80% off across all products in ${c.team} during ${c.campaignName}.`}
      },
      kvImages:[
        'https://dimg04.tripcdn.com/images/mock-kv-1.jpg',
        'https://dimg04.tripcdn.com/images/mock-kv-2.jpg',
        'https://dimg04.tripcdn.com/images/mock-kv-3.jpg'
      ],
      flashImages:[
        'https://dimg04.tripcdn.com/images/mock-flash-1.png',
        'https://dimg04.tripcdn.com/images/mock-flash-2.png',
        'https://dimg04.tripcdn.com/images/mock-flash-3.png'
      ],
      supplementary:`Mechanism plan available in the campaign sharepoint folder. Owner: ${c.creator}.`
    };
  }

  const collection = {
    collectionId: c.collectionId,
    collectionNameEN: 'Trip 2026 Global Mega 3.3',
    collectionNameLocal: ({HK:'Trip 2026 環球 Mega 3.3',TW:'Trip 2026 全球 Mega 3.3',SG:'Trip 2026 Global Mega 3.3',MY:'Trip 2026 Global Mega 3.3'})[c.team],
    collectionTheme: 'Mega Sale',
    collectionGrade: 'Tier 1',
    collectionDescription: 'Cross-BU Trip 2026 Global Mega 3.3 collection covering HK, TW, SG and MY markets.',
    collectionPeriodType: 'Fixed date time',
    collectionTimeZone: 'GMT+8',
    collectionStartEndDate: '2026-02-27 00:00:00 - 2026-03-10 23:59:59',
    collectionCreator: 'H00077',
    collectionUpdateTime: '2026-02-25 14:30:00'
  };

  const campaign = {
    collectionId: c.collectionId, collectionName: c.collectionName,
    campaignId: c.campaignId, campaignName: c.campaignName,
    marketApplicationId: c.appId, team: c.team,
    theme: c.theme, grade: c.grade, status: c.status,
    creator: c.creator, createTime: c.createTime,
    updater: c.creator, updateTime: c.updateTime,
    auditStatus: c.status==='draft'?'Pending':'Approved',
    nameEN: r.nameEN, nameLocal: r.nameLocal, description: r.description,
    region: r.region, testCampaign: r.testCampaign, timezone: r.timezone,
    launchDate: r.launchDate, periodType: r.periodType, startEndDate: r.startEndDate,
    attachment: r.attachment,
    promotedLines: ['Hotel','ANT','Flight','Bundle','Car Rental','Cruise','Package Tour','Airport Transfer','Train','Global Shopping','Custom Trip'],
    mechanism: ['Flash Sale','Coupon','Mission Task','Coins Back']
  };

  const subsidy = buildLocaleContent(locales, () => ({
    flight: { cols: SUB_COLS.flight, rows: r.flight },
    hotel:  { cols: SUB_COLS.hotel,  rows: r.hotel },
    tnt:    { cols: SUB_COLS.tnt,    rows: r.tnt },
    bundle: { cols: SUB_COLS.bundle, rows: r.bundle }
  }));

  const coupon = buildLocaleContent(locales, () => ({
    cols: COUPON_COLS, rows: r.coupons,
    playIds: r.playIds || [`${c.campaignId}001`, `${c.campaignId}002`]
  }));

  const landing = buildLocaleContent(locales, loc => ({
    url: `https://${c.team.toLowerCase()}.trip.com/sale/mega2026?locale=${loc}`,
    version: c.status === 'draft' ? 'Draft' : 'Live',
    updateTime: c.updateTime + ':00',
    title: `${r.nameEN} | Trip.com ${c.team}`,
    description: r.description,
    keywords: `${c.team} ${c.theme}, Mega Sale, Flight, Hotel, Coupon`,
    terms: r.landingTerms || `Standard ${c.team} promotion T&Cs apply. Subject to availability. ${r.region} time zone.`,
    shareTitle: r.nameEN,
    shareDescription: r.description.slice(0, 120),
    shareUrl: `https://${c.team.toLowerCase()}.trip.com/sale/mega2026/share?locale=${loc}`,
    shareImage: r.kvImages[0] || '-',
    canonicalUrl: `https://${c.team.toLowerCase()}.trip.com/sale/mega2026`
  }));

  const promotion = buildLocaleContent(locales, () => ({
    channels: [
      { channel: PROMO_CHANNELS[0], headline: r.promo.paid.headline,    content: r.promo.paid.content },
      { channel: PROMO_CHANNELS[1], headline: r.promo.seo.headline,     content: r.promo.seo.content },
      { channel: PROMO_CHANNELS[2], headline: r.promo.kol.headline,     content: r.promo.kol.content },
      { channel: PROMO_CHANNELS[3], headline: r.promo.affiliate.headline, content: r.promo.affiliate.content }
    ],
    kvImages: r.kvImages,
    flashImages: r.flashImages
  }));

  const supplementary = buildLocaleContent(locales, () => ({
    text: r.supplementary
  }));

  return { collection, campaign, subsidy, coupon, landing, promotion, supplementary };
}

const DETAILS = {};
CAMPAIGNS.forEach(c => DETAILS[c.campaignId] = makeDetail(c));

const STATUS_LABEL = { live:'Live', upcoming:'Upcoming', ended:'Ended', draft:'Draft' };

const SUBS = {};
/* Change feed: each entry references a real value present in DETAILS for that campaign,
   so clicking the row opens the detail page where the value is actually shown. */
const CHANGES = {
  31571: [
    { type:'coupon',   locale:'zh-HK', time:'2026-05-15 18:22', isNew:true,
      op:'add', scope:'Coupon Info', field:'1176505989',
      after:'Gift 1176505989 · 2026 HK 3.3 Mega MC - Flight 533 (PUBLIC_COUPON)' },
    { type:'subsidy',  locale:'zh-HK', time:'2026-05-13 10:05', isNew:true,
      op:'add', scope:'Subsidy Info / Flight', field:'Flight',
      after:'HKG → OSA · HX · ONE_PRICE 333 HKD · 2026-03-03 21:00 - 23:29' },
    { type:'landing',  locale:'zh-HK', time:'2026-05-10 17:42', isNew:true,
      op:'update', scope:'Landing Page Info', field:'https://hk.trip.com/sale/mega2026?locale=zh-HK',
      before:'Version: Draft', after:'Version: Live' },
    { type:'promotion',locale:'en-HK', time:'2026-05-09 09:00', isNew:false,
      op:'update', scope:'Promotion / Flash Sale Products', field:'Asset of Flash Sale Products',
      before:'5 images', after:'7 images' },
    { type:'campaign', locale:'-',     time:'2026-05-08 11:30', isNew:false,
      op:'update', scope:'Campaign Basic Info', field:'Promoted Product Lines',
      before:'Flight, Hotel', after:'Flight, Hotel, TNT' }
  ],
  31578: [
    { type:'campaign', locale:'-',     time:'2026-05-14 11:05', isNew:true,
      op:'update', scope:'Campaign Basic Info', field:'Start/End Date',
      before:'-', after:'2026-03-03 00:00:00 - 2026-03-06 23:59:59' },
    { type:'coupon',   locale:'zh-TW', time:'2026-05-12 16:40', isNew:true,
      op:'add', scope:'Coupon Info', field:'1259109545',
      after:'Gift 1259109545 · TW Baggage Coupon 2026.03.03 (PRIVATE_COUPON)' },
    { type:'subsidy',  locale:'zh-TW', time:'2026-05-11 09:20', isNew:false,
      op:'remove', scope:'Subsidy Info / Hotel', field:'Hotel',
      before:'TPE Hotel · ONE_PRICE 1500 TWD' }
  ],
  31599: [
    { type:'promotion',locale:'en-SG', time:'2026-05-16 09:30', isNew:true,
      op:'update', scope:'Promotion Channel Info', field:'Paid Ads (Facebook, Google UAC, Google Demand Gen)',
      before:'Headline: [SG] 3.3 Mega Sale Up to 70% Off',
      after:'Headline: [SG] 3.3 Mega Sale Up to 80% Off' },
    { type:'subsidy',  locale:'en-SG', time:'2026-05-15 21:10', isNew:true,
      op:'add', scope:'Subsidy Info / TNT', field:'Subsidy row',
      after:'China eSIM 7days 10GB · ONE_PRICE 1 SGD' },
    { type:'landing',  locale:'en-SG', time:'2026-05-12 14:20', isNew:false,
      op:'update', scope:'Landing Page Info', field:'https://sg.trip.com/sale/mega2026?locale=en-SG',
      before:'Terms & Conditions: (empty)', after:'Terms & Conditions: Finalized for SG 3.3 Mega Sale' },
    { type:'campaign', locale:'-',     time:'2026-05-10 08:50', isNew:false,
      op:'update', scope:'Campaign Basic Info', field:'Campaign Mechanism',
      before:'Coupon Only', after:'Coupon + Subsidy' }
  ],
  31606: [
    { type:'coupon',   locale:'en-MY', time:'2026-05-15 22:11', isNew:true,
      op:'add', scope:'Coupon Info', field:'1566640845',
      after:'Gift 1566640845 · 国际租车 MY-Mega 33 0303 50% off cap 65 MYR' },
    { type:'subsidy',  locale:'en-MY', time:'2026-05-14 14:00', isNew:true,
      op:'add', scope:'Subsidy Info / Flight', field:'Flight',
      after:'KUL → TYO · PR · ONE_PRICE 899 MYR' },
    { type:'supplementary',locale:'en-MY', time:'2026-05-11 16:30', isNew:false,
      op:'update', scope:'Supplementary Info', field:'',
      before:'Remark: (empty)', after:'Remark: Reviewed by BD lead 2026-05-11' }
  ]
};

let currentDetail = null;
let activeMainTab = 'campaign';
let activeSubsidyLine = 'flight';
let activeLocale = 'en-HK';
let pageNum = 1;
let pageSize = 10;
const SELECTED = new Set();
let batchMode = false;

/* Auto-subscribe on Submitted (one-shot, user can still unsubscribe) */
const AUTO_SUB_HANDLED = new Set();
function applyAutoSubscribe(){
  CAMPAIGNS.forEach(c => {
    if(c.notificationStatus === 'Submitted' && !AUTO_SUB_HANDLED.has(c.campaignId)){
      AUTO_SUB_HANDLED.add(c.campaignId);
      if(!SUBS[c.campaignId]){
        SUBS[c.campaignId] = { events:['collection','campaign','subsidy','coupon','landing','promotion','supplementary'], subscribedAt:'2026-05-01 00:00', auto:true };
      }
    }
  });
}

const $ = id => document.getElementById(id);
const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));


/* Global table cell tooltip: applies to all system tables after every render. */
let activeTooltipCell = null;
let cellTooltipEl = null;
function getCellTooltipEl(){
  if(cellTooltipEl) return cellTooltipEl;
  cellTooltipEl = document.createElement('div');
  cellTooltipEl.className = 'cell-tooltip';
  document.body.appendChild(cellTooltipEl);
  return cellTooltipEl;
}
function normalizeCellText(cell){
  return (cell.innerText || '').replace(/\s+/g, ' ').trim();
}
function isCellOverflowed(cell){
  return cell.scrollWidth > cell.clientWidth + 1 || cell.scrollHeight > cell.clientHeight + 1;
}
function isTooltipEligibleCell(cell){
  if(!cell || !cell.closest('table')) return false;
  if(cell.classList.contains('s-chk') || cell.querySelector('input, textarea, select, button')) return false;
  const txt = normalizeCellText(cell);
  if(!txt || txt.length < 2) return false;
  return isCellOverflowed(cell);
}
function placeCellTooltip(e){
  const tip = getCellTooltipEl();
  if(tip.style.display !== 'block') return;
  const pad = 12;
  const x = Math.min(e.clientX + pad, window.innerWidth - tip.offsetWidth - pad);
  const y = Math.min(e.clientY + pad, window.innerHeight - tip.offsetHeight - pad);
  tip.style.left = Math.max(pad, x) + 'px';
  tip.style.top = Math.max(pad, y) + 'px';
}
function showCellTooltip(cell, e){
  const txt = normalizeCellText(cell);
  if(!txt) return;
  activeTooltipCell = cell;
  cell.classList.add('table-cell-overflow');
  const tip = getCellTooltipEl();
  tip.textContent = txt;
  tip.style.display = 'block';
  placeCellTooltip(e);
}
function hideCellTooltip(){
  if(activeTooltipCell) activeTooltipCell.classList.remove('table-cell-overflow');
  activeTooltipCell = null;
  if(cellTooltipEl) cellTooltipEl.style.display = 'none';
}
document.addEventListener('mouseover', e => {
  const cell = e.target.closest && e.target.closest('td,th');
  if(cell === activeTooltipCell) return;
  hideCellTooltip();
  if(isTooltipEligibleCell(cell)) showCellTooltip(cell, e);
});
document.addEventListener('mousemove', e => {
  if(activeTooltipCell) placeCellTooltip(e);
});
document.addEventListener('mouseout', e => {
  if(activeTooltipCell && !activeTooltipCell.contains(e.relatedTarget)) hideCellTooltip();
});
document.addEventListener('scroll', hideCellTooltip, true);
window.addEventListener('resize', hideCellTooltip);
function refreshTableOverflowTooltips(root = document){
  root.querySelectorAll('table td, table th').forEach(cell => {
    if(isCellOverflowed(cell) && normalizeCellText(cell)) cell.classList.add('table-cell-overflow');
    else cell.classList.remove('table-cell-overflow');
  });
}


/* ========================= Cross-platform custom select ========================= */
let activeCustomSelect = null;
let dropdownPointerShieldEl = null;

function ensureDropdownPointerShield(){
  if(dropdownPointerShieldEl) return dropdownPointerShieldEl;
  dropdownPointerShieldEl = document.createElement('div');
  dropdownPointerShieldEl.className = 'dropdown-pointer-shield';
  dropdownPointerShieldEl.setAttribute('aria-hidden', 'true');
  dropdownPointerShieldEl.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
  });
  dropdownPointerShieldEl.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    closeAllFilterDropdowns();
  });
  document.body.appendChild(dropdownPointerShieldEl);
  return dropdownPointerShieldEl;
}

function suspendNativeTitlesForDropdown(activeWrap){
  document.querySelectorAll('[title]').forEach(el => {
    if(activeWrap && activeWrap.contains && activeWrap.contains(el)) return;
    if(!el.hasAttribute('data-dropdown-suspended-title')){
      el.setAttribute('data-dropdown-suspended-title', el.getAttribute('title') || '');
    }
    el.removeAttribute('title');
  });
}

function restoreNativeTitlesAfterDropdown(){
  document.querySelectorAll('[data-dropdown-suspended-title]').forEach(el => {
    const title = el.getAttribute('data-dropdown-suspended-title');
    if(title) el.setAttribute('title', title);
    el.removeAttribute('data-dropdown-suspended-title');
  });
}

function showDropdownPointerShield(activeWrap){
  ensureDropdownPointerShield();
  document.body.classList.add('filter-dropdown-open');
  suspendNativeTitlesForDropdown(activeWrap || null);
}

function hideDropdownPointerShield(){
  document.body.classList.remove('filter-dropdown-open');
  restoreNativeTitlesAfterDropdown();
}

function hasAnyFilterDropdownOpen(){
  return !!(document.querySelector('.filter .custom-select.open') || document.querySelector('.filter .region-dropdown.open') || listRegionDropdownOpen || regionDropdownOpen);
}

function syncDropdownPointerShield(activeWrap){
  if(hasAnyFilterDropdownOpen()) showDropdownPointerShield(activeWrap || document.querySelector('.filter .custom-select.open, .filter .region-dropdown.open'));
  else hideDropdownPointerShield();
}

function closeAllFilterDropdowns(){
  closeCustomSelect();
  let needListRender = false;
  let needSubRender = false;
  if(typeof listRegionDropdownOpen !== 'undefined' && listRegionDropdownOpen){
    listRegionDropdownOpen = false;
    needListRender = true;
  }
  if(typeof regionDropdownOpen !== 'undefined' && regionDropdownOpen){
    regionDropdownOpen = false;
    needSubRender = true;
  }
  if(needListRender) renderListRegionFilter();
  if(needSubRender && document.getElementById('page-sub') && document.getElementById('page-sub').classList.contains('active')) renderSubPage();
  hideDropdownPointerShield();
}

function getFilterDropdownLabel(wrap){
  const textEl = wrap && (wrap.querySelector('.custom-select-label') || wrap.querySelector('.rd-text'));
  return (wrap && wrap.getAttribute('data-full-label')) || (textEl ? textEl.textContent.trim() : '');
}
function isFilterDropdownTextOverflowed(wrap){
  const textEl = wrap && (wrap.querySelector('.custom-select-label') || wrap.querySelector('.rd-text'));
  if(!textEl) return false;
  return textEl.scrollWidth > textEl.clientWidth + 1;
}
function updateFilterDropdownTooltip(wrap, fullLabel){
  if(!wrap) return;
  const textEl = wrap.querySelector('.custom-select-label') || wrap.querySelector('.rd-text');
  const trigger = wrap.querySelector('.custom-select-trigger') || wrap.querySelector('.rd-trigger');
  const label = (fullLabel != null ? String(fullLabel) : getFilterDropdownLabel(wrap)).trim();
  const shouldShow = !!label && label !== 'All' && !wrap.classList.contains('open') && isFilterDropdownTextOverflowed(wrap);
  wrap.classList.toggle('show-value-tooltip', shouldShow);
  if(shouldShow){
    wrap.setAttribute('data-full-label', label);
    if(trigger) trigger.setAttribute('data-full-label', label);
    if(textEl) textEl.removeAttribute('title');
    if(trigger) trigger.removeAttribute('title');
    wrap.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
  } else {
    wrap.classList.remove('show-value-tooltip');
    if(!label || label === 'All') wrap.removeAttribute('data-full-label');
    if(trigger) trigger.removeAttribute('data-full-label');
    if(textEl) textEl.removeAttribute('title');
    if(trigger) trigger.removeAttribute('title');
    wrap.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
  }
}
function scheduleFilterDropdownTooltip(wrap, fullLabel){
  if(!wrap) return;
  const run = () => updateFilterDropdownTooltip(wrap, fullLabel);
  if(window.requestAnimationFrame) requestAnimationFrame(run);
  else setTimeout(run, 0);
}
function refreshFilterDropdownTooltips(root=document){
  root.querySelectorAll('.filter .custom-select, .filter .region-dropdown').forEach(wrap => scheduleFilterDropdownTooltip(wrap));
}

document.addEventListener('mouseenter', e => {
  const wrap = e.target.closest && e.target.closest('.filter .custom-select, .filter .region-dropdown');
  if(wrap) updateFilterDropdownTooltip(wrap);
}, true);
window.addEventListener('resize', () => refreshFilterDropdownTooltips());

function closeCustomSelect(except){
  document.querySelectorAll('.custom-select.open').forEach(wrap => {
    if(wrap !== except){
      const select = wrap._nativeSelect;
      if(select && select.dataset.filterSearchable === 'true') select._customSelectSearch = '';
      wrap.classList.remove('open');
      wrap.classList.remove('searching');
      const trigger = wrap.querySelector('.custom-select-trigger');
      if(trigger) trigger.setAttribute('aria-expanded', 'false');
      if(select) refreshCustomSelect(select);
      else scheduleFilterDropdownTooltip(wrap);
    }
  });
  if(!except) activeCustomSelect = null;
  refreshFilterDropdownTooltips();
  if(except) showDropdownPointerShield(except);
  else syncDropdownPointerShield();
}

function getSelectValues(selectOrId){
  const select = typeof selectOrId === 'string' ? $(selectOrId) : selectOrId;
  if(!select) return [];
  const selected = select.multiple ? Array.from(select.selectedOptions) : [select.options[select.selectedIndex]].filter(Boolean);
  return selected.map(opt => opt.value).filter(v => v !== '');
}

function filterSelectAllows(selectOrId, candidate){
  const values = getSelectValues(selectOrId);
  return !values.length || values.includes(String(candidate));
}

function clearFilterSelect(selectOrId){
  const select = typeof selectOrId === 'string' ? $(selectOrId) : selectOrId;
  if(!select) return;
  Array.from(select.options).forEach((opt, idx) => {
    opt.selected = idx === 0 || opt.value === '';
  });
  select.selectedIndex = 0;
  refreshCustomSelect(select);
}

function getSubFilterValues(k){
  const v = SUB_FILTER[k];
  if(Array.isArray(v)) return v.filter(Boolean);
  return v ? [v] : [];
}

function subFilterAllows(k, candidate){
  const values = getSubFilterValues(k);
  return !values.length || values.includes(String(candidate));
}

function normalizeSubFilterChoice(v){
  if(Array.isArray(v)) return v.filter(Boolean);
  return v || '';
}

function shouldUseFilterMultiSelect(select){
  if(!select || !select.closest('.filter')) return false;
  const nonAllOptions = Array.from(select.options).filter(opt => opt.value !== '' && opt.textContent.trim().toLowerCase() !== 'all');
  return nonAllOptions.length >= 3;
}

function activateFilterMultiSelect(select){
  if(!shouldUseFilterMultiSelect(select)) return false;
  select.dataset.filterMulti = 'true';
  select.multiple = true;
  select.size = 1;
  const selectedSpecific = getSelectValues(select);
  if(!selectedSpecific.length){
    Array.from(select.options).forEach((opt, idx) => {
      opt.selected = idx === 0 || opt.value === '';
    });
  } else {
    Array.from(select.options).forEach(opt => {
      if(opt.value === '') opt.selected = false;
    });
  }
  return true;
}

function isFilterMultiSelect(select){
  return !!(select && select.dataset.filterMulti === 'true');
}

function refreshCustomSelect(select){
  if(!select || !select._customSelect) return;
  activateFilterMultiSelect(select);
  const wrap = select._customSelect;
  const label = wrap.querySelector('.custom-select-label');
  const menu = wrap.querySelector('.custom-select-menu');
  const isMulti = isFilterMultiSelect(select);
  const isSearchable = select.dataset.filterSearchable === 'true';
  const isSearching = isSearchable && wrap.classList.contains('open');
  wrap.classList.toggle('disabled', !!select.disabled);
  wrap.classList.toggle('filter-multi-select', isMulti);
  wrap.classList.toggle('searching', isSearching);
  menu.setAttribute('aria-multiselectable', isMulti ? 'true' : 'false');

  let labelTitle = '';
  if(isMulti){
    const selectedOptions = Array.from(select.options).filter(opt => opt.selected && opt.value !== '');
    labelTitle = selectedOptions.length ? selectedOptions.map(opt => opt.textContent.trim()).join(', ') : 'All';
  } else {
    const selected = select.options[select.selectedIndex] || select.options[0];
    labelTitle = selected ? selected.textContent.trim() : '';
  }

  if(isSearching){
    const rawSearchForInput = select._customSelectSearch || '';
    label.textContent = '';
    const input = document.createElement('input');
    input.className = 'custom-select-inline-search';
    input.type = 'text';
    input.value = rawSearchForInput;
    input.placeholder = 'Search Theme';
    input.setAttribute('aria-label', 'Search Theme');
    input.addEventListener('input', () => handleCustomSelectSearchInput(input));
    input.addEventListener('mousedown', e => e.stopPropagation());
    input.addEventListener('click', e => e.stopPropagation());
    input.addEventListener('keydown', e => {
      e.stopPropagation();
      if(e.key === 'Escape'){
        e.preventDefault();
        closeCustomSelect();
      }
    });
    label.appendChild(input);
  } else {
    label.textContent = labelTitle;
  }

  label.removeAttribute('title');
  const trigger = wrap.querySelector('.custom-select-trigger');
  if(trigger) trigger.removeAttribute('title');
  wrap.classList.remove('show-value-tooltip');
  if(isMulti && labelTitle && labelTitle !== 'All') {
    wrap.setAttribute('data-full-label', labelTitle);
    if(trigger) trigger.setAttribute('data-full-label', labelTitle);
  } else {
    wrap.removeAttribute('data-full-label');
    if(trigger) trigger.removeAttribute('data-full-label');
  }
  wrap.querySelectorAll('[title]').forEach(el => el.removeAttribute('title'));
  if(!isSearching) scheduleFilterDropdownTooltip(wrap, labelTitle);

  const rawSearch = select._customSelectSearch || '';
  const searchTerm = rawSearch.trim().toLowerCase();
  const optionHtml = Array.from(select.options).map((opt, idx) => {
    const optionText = opt.textContent.trim();
    const isAllOption = opt.value === '' || optionText.toLowerCase() === 'all';
    if(isSearchable && searchTerm && !isAllOption && !optionText.toLowerCase().includes(searchTerm)) return '';
    const selectedCls = opt.selected ? ' selected' : '';
    const disabledCls = opt.disabled ? ' disabled' : '';
    const check = isMulti ? '<span class="custom-select-check">✓</span>' : '';
    return `<div class="custom-select-option${selectedCls}${disabledCls}" role="option" aria-selected="${opt.selected?'true':'false'}" data-index="${idx}">${check}<span class="custom-select-option-text">${escape(optionText)}</span></div>`;
  }).join('');
  menu.innerHTML = optionHtml || '<div class="custom-select-empty">No results</div>';
}

function handleCustomSelectSearchInput(input){
  const wrap = input.closest('.custom-select');
  const select = wrap && wrap._nativeSelect;
  if(!select) return;
  const caret = input.selectionStart;
  select._customSelectSearch = input.value;
  refreshCustomSelect(select);
  const nextInput = wrap.querySelector('.custom-select-inline-search, .custom-select-search-input');
  if(nextInput){
    nextInput.focus();
    const pos = Math.min(caret == null ? nextInput.value.length : caret, nextInput.value.length);
    try{ nextInput.setSelectionRange(pos, pos); }catch(e){}
  }
}

function chooseCustomSelectOption(select, index){
  const opt = select.options[index];
  if(!opt || opt.disabled) return;

  if(isFilterMultiSelect(select)){
    const before = getSelectValues(select).join('|');
    if(opt.value === ''){
      Array.from(select.options).forEach((o, idx) => { o.selected = idx === index; });
    } else {
      opt.selected = !opt.selected;
      Array.from(select.options).forEach(o => { if(o.value === '') o.selected = false; });
      if(!getSelectValues(select).length && select.options[0]) select.options[0].selected = true;
    }
    refreshCustomSelect(select);
    const after = getSelectValues(select).join('|');
    if(after !== before){
      select.dispatchEvent(new Event('change', { bubbles:true }));
    }
    return;
  }

  const oldValue = select.value;
  select.selectedIndex = index;
  refreshCustomSelect(select);
  closeCustomSelect();
  if(select.value !== oldValue){
    select.dispatchEvent(new Event('change', { bubbles:true }));
  }
}

function enhanceCustomSelects(scope=document){
  scope.querySelectorAll('select:not([data-native])').forEach(select => {
    activateFilterMultiSelect(select);
    if(select.dataset.customSelectEnhanced === 'true'){
      refreshCustomSelect(select);
      return;
    }
    const wrap = document.createElement('div');
    wrap.className = 'custom-select' + (select.classList.contains('size-select') ? ' size-select-ui' : '') + (isFilterMultiSelect(select) ? ' filter-multi-select' : '');
    wrap.innerHTML = `
      <div class="custom-select-trigger" role="combobox" aria-haspopup="listbox" aria-expanded="false" tabindex="0">
        <span class="custom-select-label"></span>
        <span class="custom-select-arrow" aria-hidden="true"><svg viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </div>
      <div class="custom-select-menu" role="listbox" aria-multiselectable="${isFilterMultiSelect(select) ? 'true' : 'false'}"></div>`;

    select.classList.add('custom-select-source');
    select.dataset.customSelectEnhanced = 'true';
    select.tabIndex = -1;
    select.insertAdjacentElement('afterend', wrap);
    select._customSelect = wrap;
    wrap._nativeSelect = select;
    refreshCustomSelect(select);

    const trigger = wrap.querySelector('.custom-select-trigger');
    const menu = wrap.querySelector('.custom-select-menu');
    const toggle = () => {
      if(select.disabled) return;
      const willOpen = !wrap.classList.contains('open');
      closeCustomSelect(willOpen ? wrap : null);
      wrap.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      activeCustomSelect = willOpen ? wrap : null;
      scheduleFilterDropdownTooltip(wrap);
      if(willOpen) showDropdownPointerShield(wrap);
      else syncDropdownPointerShield();
      if(willOpen){
        refreshCustomSelect(select);
        const searchInput = wrap.querySelector('.custom-select-inline-search, .custom-select-search-input');
        if(searchInput){
          searchInput.focus();
          searchInput.select();
        } else {
          const active = menu.querySelector('.custom-select-option.selected');
          if(active) active.scrollIntoView({ block:'nearest' });
        }
      }
    };
    trigger.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); toggle(); });
    trigger.addEventListener('keydown', e => {
      const max = select.options.length - 1;
      let next = select.selectedIndex;
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); return; }
      if(e.key === 'Escape'){ closeCustomSelect(); return; }
      if(e.key === 'ArrowDown'){ e.preventDefault(); next = Math.min(max, select.selectedIndex + 1); }
      if(e.key === 'ArrowUp'){ e.preventDefault(); next = Math.max(0, select.selectedIndex - 1); }
      if(next !== select.selectedIndex) chooseCustomSelectOption(select, next);
    });
    menu.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    });
    menu.addEventListener('mouseover', e => {
      e.preventDefault();
      e.stopPropagation();
      hideCellTooltip();
      suspendNativeTitlesForDropdown(wrap);
    });
    menu.addEventListener('mousemove', e => {
      e.stopPropagation();
      hideCellTooltip();
    });
    menu.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();
      const item = e.target.closest('.custom-select-option');
      if(!item) return;
      chooseCustomSelectOption(select, Number(item.dataset.index));
    });
  });
}

document.addEventListener('click', () => {
  closeCustomSelect();
  syncDropdownPointerShield();
  if(sincePickerOpen){
    sincePickerOpen = false;
    const subPage = $('page-sub');
    if(subPage && subPage.classList.contains('active')) renderSubPage();
  }
});
document.addEventListener('scroll', () => { closeCustomSelect(); syncDropdownPointerShield(); }, true);

/* ========================= Page switching ========================= */
function switchPage(name){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('page-' + name).classList.add('active');
  document.querySelectorAll('.side a[data-page]').forEach(a => a.classList.toggle('active', a.dataset.page === name));
  if(name === 'sub') renderSubPage();
  if(name === 'digest') renderDigest();
  if(name === 'list' || name === 'sub' || name === 'digest') currentNonDetailPage = name;
  enhanceCustomSelects(document);
}
let currentNonDetailPage = 'digest';

/* ========================= List ========================= */
const LIST_REGION_OPTIONS = ['HK','TW','SG','MY'];
const LIST_REGION_FILTER = new Set();
let listRegionDropdownOpen = false;

function normalizeCampaignRegionList(value){
  return String(value || '')
    .split(/[,/;|\s]+/)
    .map(v => v.trim())
    .filter(Boolean);
}

function getCampaignRegions(c){
  const detailRegion = (REAL_DATA[c.campaignId] && REAL_DATA[c.campaignId].region) || c.region || c.team || '';
  const regions = normalizeCampaignRegionList(detailRegion);
  return regions.length ? regions : (c.team ? [c.team] : []);
}

function passListRegionFilter(c){
  if(!LIST_REGION_FILTER.size) return true;
  return getCampaignRegions(c).some(r => LIST_REGION_FILTER.has(r));
}

function renderListRegionFilter(){
  const el = $('listRegionFilter');
  if(!el) return;
  const label = LIST_REGION_FILTER.size ? [...LIST_REGION_FILTER].join(', ') : 'All';
  el.innerHTML = `<div class="region-dropdown list-region-dropdown ${listRegionDropdownOpen?'open':''}" ${LIST_REGION_FILTER.size?`data-full-label="${escape(label)}"`:''}>
    <div class="rd-trigger" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="${listRegionDropdownOpen?'true':'false'}" aria-label="Filter by campaign region" onclick="toggleListRegionDropdown(event)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleListRegionDropdown(event)}">
      <span class="rd-text ${LIST_REGION_FILTER.size?'':'placeholder'}">${escape(label)}</span>
      <span class="rd-caret" aria-hidden="true"><svg viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </div>
    ${listRegionDropdownOpen ? `<div class="rd-panel" role="listbox" onclick="event.preventDefault();event.stopPropagation()">
      <div class="rd-opt ${LIST_REGION_FILTER.size?'':'is-selected'}" role="option" aria-selected="${LIST_REGION_FILTER.size?'false':'true'}" tabindex="0" onclick="selectAllListRegions()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectAllListRegions()}"><span>All</span><span class="rd-check">✓</span></div>
      ${LIST_REGION_OPTIONS.map(r => `<div class="rd-opt ${LIST_REGION_FILTER.has(r)?'is-selected':''}" role="option" aria-selected="${LIST_REGION_FILTER.has(r)?'true':'false'}" tabindex="0" onclick="toggleListRegion('${r}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleListRegion('${r}')}"><span>${r}</span><span class="rd-check">✓</span></div>`).join('')}
    </div>` : ''}
  </div>`;
  const dropdown = el.querySelector('.region-dropdown');
  scheduleFilterDropdownTooltip(dropdown, label);
  if(listRegionDropdownOpen) showDropdownPointerShield(dropdown);
  else syncDropdownPointerShield();
}

function selectAllListRegions(){
  LIST_REGION_FILTER.clear();
  pageNum = 1;
  renderTable();
}

function toggleListRegion(r){
  // The All option represents an empty region filter. Once a specific value is selected, All is no longer selected.
  if(LIST_REGION_FILTER.has(r)) LIST_REGION_FILTER.delete(r);
  else LIST_REGION_FILTER.add(r);
  pageNum = 1;
  renderTable();
}

function toggleListRegionDropdown(e){
  if(e){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); }
  listRegionDropdownOpen = !listRegionDropdownOpen;
  renderListRegionFilter();
}

function renderTable(){
  applyAutoSubscribe();
  renderListRegionFilter();
  const fCol = $('fCol').value.trim().toLowerCase();
  const fColName = $('fColName').value.trim().toLowerCase();
  const fCmp = $('fCmp').value.trim().toLowerCase();
  const fName= $('fName').value.trim().toLowerCase();
  const fTheme = getSelectValues('fTheme');
  const fGrade = getSelectValues('fGrade');
  const fStatus= getSelectValues('fStatus');
  const fSubStatus = getSelectValues('fSubStatus');
  const fNoti = getSelectValues('fNoti');

  const all = CAMPAIGNS.filter(r => {
    if (fCol  && !String(r.collectionId).toLowerCase().includes(fCol))  return false;
    if (fColName && !String(r.collectionName || '').toLowerCase().includes(fColName)) return false;
    if (fCmp  && !String(r.campaignId).toLowerCase().includes(fCmp))    return false;
    if (fName && !r.campaignName.toLowerCase().includes(fName))         return false;
    if (fTheme.length && !fTheme.includes(r.theme))   return false;
    if (fGrade.length && !fGrade.includes(r.grade))   return false;
    if (!passListRegionFilter(r)) return false;
    if (fStatus.length && !fStatus.includes(r.status)) return false;
    if (fNoti.length && !fNoti.includes(r.notificationStatus)) return false;
    if (fSubStatus.length){
      const sub = !!SUBS[r.campaignId];
      if (fSubStatus.includes('subscribed') && !sub) return false;
      if (fSubStatus.includes('unsubscribed') && sub) return false;
    }
    return true;
  });

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if(pageNum > totalPages) pageNum = totalPages;
  if(pageNum < 1) pageNum = 1;
  const start = (pageNum - 1) * pageSize;
  const rows = all.slice(start, start + pageSize);

  $('tbody').innerHTML = rows.map(r => {
    const subbed = !!SUBS[r.campaignId];
    const checked = SELECTED.has(r.campaignId) ? 'checked' : '';
    const notiCls = r.notificationStatus === 'Submitted' ? 'noti-submitted' : 'noti-not';
    return `<tr>
      <td class="sticky s-chk"><input type="checkbox" aria-label="Select campaign ${r.campaignId}" ${checked} onclick="toggleRow(${r.campaignId}, this.checked)"></td>
      <td class="id-cell sticky s-l1">${r.collectionId}</td>
      <td class="id-cell sticky s-l2">${r.campaignId}</td>
      <td class="sticky s-l3">${escape(r.collectionName)}</td>
      <td class="link-name sticky s-l4" onclick="openDetail(${r.campaignId})">${escape(r.campaignName)}</td>
      <td>${escape(r.theme)}</td>
      <td class="grade">${r.grade}</td>
      <td>${escape(getCampaignRegions(r).join(', '))}</td>
      <td><span class="badge-stage ${r.status}">${STATUS_LABEL[r.status]}</span></td>
      <td>${r.createTime}</td>
      <td>${r.updateTime}</td>
      <td>${r.creator}</td>
      <td><span class="noti-pill ${notiCls}">${r.notificationStatus}</span></td>
      <td class="sticky s-r1">
        <button class="btn btn-link btn-sm ${subbed?'unsub':''}" onclick="toggleSub(${r.campaignId})">${subbed ? 'Unsubscribe' : 'Subscribe'}</button>
      </td>
    </tr>`;
  }).join('');
  $('emptyHint').style.display = rows.length ? 'none' : 'block';
  renderPagination(total, totalPages);
  refreshChkAll(rows);
  enhanceCustomSelects(document);
  refreshTableOverflowTooltips($('page-list'));
  refreshSubBadge();
}

function refreshChkAll(rows){
  const all = $('chkAll'); if(!all) return;
  if(!rows.length){ all.checked = false; all.indeterminate = false; }
  else {
    const sel = rows.filter(r => SELECTED.has(r.campaignId)).length;
    all.checked = sel === rows.length;
    all.indeterminate = sel > 0 && sel < rows.length;
  }
  const hint = $('listSelHint');
  if(hint) hint.textContent = SELECTED.size ? `Selected: ${SELECTED.size}` : '';
}

function toggleRow(id, checked){
  if(checked) SELECTED.add(id); else SELECTED.delete(id);
  refreshChkAll(currentPageRows());
}

function toggleAll(checked){
  // Operate on the currently visible rows (current page) using the same filter pipeline.
  const rows = currentPageRows();
  rows.forEach(r => { if(checked) SELECTED.add(r.campaignId); else SELECTED.delete(r.campaignId); });
  renderTable();
}

let _filterDebounceTimer = null;
function onListFilterInput(){
  clearTimeout(_filterDebounceTimer);
  _filterDebounceTimer = setTimeout(() => { pageNum = 1; renderTable(); }, 200);
}
function onListFilterChange(){ pageNum = 1; renderTable(); }
function onListFilterKey(e){ if(e.key === 'Enter'){ pageNum = 1; renderTable(); } }

function currentPageRows(){
  const fCol = $('fCol').value.trim().toLowerCase();
  const fColName = $('fColName').value.trim().toLowerCase();
  const fCmp = $('fCmp').value.trim().toLowerCase();
  const fName= $('fName').value.trim().toLowerCase();
  const fTheme = getSelectValues('fTheme');
  const fGrade = getSelectValues('fGrade');
  const fStatus= getSelectValues('fStatus');
  const fSubStatus = getSelectValues('fSubStatus');
  const fNoti = getSelectValues('fNoti');
  const all = CAMPAIGNS.filter(r => {
    if (fCol  && !String(r.collectionId).toLowerCase().includes(fCol))  return false;
    if (fColName && !String(r.collectionName || '').toLowerCase().includes(fColName)) return false;
    if (fCmp  && !String(r.campaignId).toLowerCase().includes(fCmp))    return false;
    if (fName && !r.campaignName.toLowerCase().includes(fName))         return false;
    if (fTheme.length && !fTheme.includes(r.theme))   return false;
    if (fGrade.length && !fGrade.includes(r.grade))   return false;
    if (!passListRegionFilter(r)) return false;
    if (fStatus.length && !fStatus.includes(r.status)) return false;
    if (fNoti.length && !fNoti.includes(r.notificationStatus)) return false;
    if (fSubStatus.length){
      const sub = !!SUBS[r.campaignId];
      if (fSubStatus.includes('subscribed') && !sub) return false;
      if (fSubStatus.includes('unsubscribed') && sub) return false;
    }
    return true;
  });
  const start = (pageNum - 1) * pageSize;
  return all.slice(start, start + pageSize);
}

function pageItems(cur, total){
  if(total <= 7) return Array.from({length: total}, (_,i) => i+1);
  const items = [1];
  if(cur > 4) items.push('…');
  const startMid = Math.max(2, cur - 1);
  const endMid = Math.min(total - 1, cur + 1);
  for(let i=startMid; i<=endMid; i++) items.push(i);
  if(cur < total - 3) items.push('…');
  items.push(total);
  return items;
}

function renderPagination(total, totalPages){
  const start = total === 0 ? 0 : (pageNum - 1) * pageSize + 1;
  const end = Math.min(pageNum * pageSize, total);
  const prevDisabled = pageNum <= 1;
  const nextDisabled = pageNum >= totalPages;
  const items = pageItems(pageNum, totalPages);
  const itemsHtml = items.map(it => it === '…'
    ? `<span class="ellip">···</span>`
    : `<span class="pg ${it===pageNum?'active':''}" onclick="goPage(${it})">${it}</span>`
  ).join('');
  $('pagination').innerHTML = `
    <span class="total">${start}-${end} of ${total} items</span>
    <span class="pg ${prevDisabled?'disabled':''}" ${prevDisabled?'':'onclick="goPage('+(pageNum-1)+')"'}>&lsaquo;</span>
    ${itemsHtml}
    <span class="pg ${nextDisabled?'disabled':''}" ${nextDisabled?'':'onclick="goPage('+(pageNum+1)+')"'}>&rsaquo;</span>
    <select class="size-select" onchange="changePageSize(this.value)">
      <option value="10" ${pageSize===10?'selected':''}>10 / page</option>
      <option value="20" ${pageSize===20?'selected':''}>20 / page</option>
      <option value="50" ${pageSize===50?'selected':''}>50 / page</option>
    </select>
  `;
}

function goPage(n){ pageNum = n; renderTable(); }
function changePageSize(v){ pageSize = parseInt(v,10); pageNum = 1; renderTable(); }
function resetFilter(){ ['fCol','fColName','fCmp','fName'].forEach(id => $(id).value = ''); ['fTheme','fGrade','fStatus','fSubStatus','fNoti'].forEach(id => clearFilterSelect(id)); LIST_REGION_FILTER.clear(); listRegionDropdownOpen = false; pageNum = 1; renderTable(); }

/* ========================= Subscribe ========================= */
function campaignKey(id){ return String(id); }
function getCampaignById(id){
  const key = campaignKey(id);
  return CAMPAIGNS.find(c => campaignKey(c.campaignId) === key) || null;
}
function isSubscribed(id){ return !!SUBS[campaignKey(id)]; }
function clearSubscriptionSelection(id){
  const key = campaignKey(id);
  SELECTED.delete(id);
  SELECTED.delete(key);
  SELECTED.delete(Number(key));
  if(typeof SUB_SELECTED !== 'undefined') SUB_SELECTED.delete(key);
  if(typeof EXPANDED !== 'undefined') EXPANDED.delete(key);
}
function syncSubscriptionViews(){
  renderTable();
  if($('page-sub') && $('page-sub').classList.contains('active')) renderSubPage();
  refreshDetailSubBtn();
  refreshSubBadge();
}
function subscribeCampaignIds(ids, events){
  const eventList = Array.isArray(events) ? events.filter(Boolean) : [];
  const done = [];
  ids.forEach(id => {
    const key = campaignKey(id);
    const campaign = getCampaignById(key);
    if(!campaign) return;
    SUBS[key] = { events:[...eventList], subscribedAt: defaultSinceForNewSub(key) };
    done.push(key);
  });
  return done;
}
function unsubscribeCampaignIds(ids){
  const done = [];
  ids.forEach(id => {
    const key = campaignKey(id);
    if(SUBS[key]){
      delete SUBS[key];
      done.push(key);
    }
    clearSubscriptionSelection(key);
  });
  return done;
}
function selectedCampaignIds(){
  return [...SELECTED].map(campaignKey).filter(id => getCampaignById(id));
}

function toggleSub(id){
  const key = campaignKey(id);
  if(isSubscribed(key)){
    const removed = unsubscribeCampaignIds([key]);
    syncSubscriptionViews();
    showToast(removed.length ? 'Unsubscribed' : 'This campaign is not subscribed');
  } else {
    currentDetail = getCampaignById(key);
    if(!currentDetail){ showToast('Campaign not found'); return; }
    openSubscribe();
  }
}
function toggleSubFromDetail(){
  if(!currentDetail) return;
  const key = campaignKey(currentDetail.campaignId);
  if(isSubscribed(key)){
    const removed = unsubscribeCampaignIds([key]);
    syncSubscriptionViews();
    showToast(removed.length ? 'Unsubscribed' : 'This campaign is not subscribed');
  } else openSubscribe();
}
function openSubscribe(){
  if(!currentDetail){ showToast('Please select a campaign first.'); return; }
  batchMode = false;
  const key = campaignKey(currentDetail.campaignId);
  $('subTarget').textContent = `${currentDetail.campaignId} · ${currentDetail.campaignName}`;
  prefillSubEvents(SUBS[key]?.events);
  $('subModal').classList.add('show');
}
function openBatchSubscribe(){
  const ids = selectedCampaignIds();
  if(ids.length === 0){ showToast('Please select at least one campaign.'); return; }
  batchMode = true;
  $('subTarget').textContent = `${ids.length} campaign(s) selected`;
  prefillSubEvents(null);
  $('subModal').classList.add('show');
}
function prefillSubEvents(preset){
  const boxes = $('subEvents').querySelectorAll('input[type="checkbox"]');
  if(preset && preset.length){
    const set = new Set(preset);
    boxes.forEach(cb => { cb.checked = set.has(cb.value); });
  } else {
    boxes.forEach(cb => { cb.checked = true; });
  }
}
function batchUnsubscribe(){
  const ids = selectedCampaignIds();
  if(ids.length === 0){ showToast('Please select at least one campaign.'); return; }
  const removed = unsubscribeCampaignIds(ids);
  SELECTED.clear();
  syncSubscriptionViews();
  showToast(removed.length ? `Unsubscribed ${removed.length} campaign(s)` : 'No subscribed campaigns selected');
}
function closeSubscribe(){ $('subModal').classList.remove('show'); batchMode = false; }
function nowStamp(){
  const d = new Date();
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function defaultSinceForNewSub(id){
  // Use earliest known change time minus a tick so the first overview shows full history.
  const list = CHANGES[id] || [];
  if(!list.length) return nowStamp();
  let min = Infinity;
  list.forEach(ch => { const t = parseTime(ch.time); if(t && t < min) min = t; });
  if(min === Infinity) return nowStamp();
  const d = new Date(min - 60_000);
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function confirmSubscribe(){
  const events = [...$('subEvents').querySelectorAll('input:checked')].map(i=>i.value);
  if(!events.length){ showToast('Please select at least one event type'); return; }
  if(batchMode){
    const ids = selectedCampaignIds();
    const subscribed = subscribeCampaignIds(ids, events);
    SELECTED.clear();
    closeSubscribe();
    syncSubscriptionViews();
    showToast(`Subscribed ${subscribed.length} campaign(s)`);
    return;
  }
  if(!currentDetail){ closeSubscribe(); showToast('Campaign not found'); return; }
  const key = campaignKey(currentDetail.campaignId);
  const subscribed = subscribeCampaignIds([key], events);
  closeSubscribe();
  syncSubscriptionViews();
  showToast(subscribed.length ? `Subscribed to ${currentDetail.campaignId}` : 'Campaign not found');
}
function refreshDetailSubBtn(){
  if(!currentDetail) return;
  const btn = $('dSubBtn');
  if(!btn) return;
  if(isSubscribed(currentDetail.campaignId)){ btn.textContent = 'Unsubscribe'; btn.className = 'btn unsub-btn'; }
  else { btn.textContent = 'Subscribe'; btn.className = 'btn btn-primary'; }
}
function refreshSubBadge(){
  const n = Object.keys(SUBS).length;
  const b = $('subBadge');
  if(n){ b.style.display=''; b.textContent = n; } else { b.style.display='none'; }
}
function showToast(msg){
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(showToast._t); showToast._t = setTimeout(()=>t.classList.remove('show'), 1800);
}

/* ========================= Drawer ========================= */
const TABS = [
  { key:'collection',   label:'Collection Basic Info' },
  { key:'campaign',     label:'Campaign Basic Info' },
  { key:'subsidy',      label:'Subsidy Info' },
  { key:'coupon',       label:'Coupon Info' },
  { key:'landing',      label:'Landing Page Info' },
  { key:'promotion',    label:'Promotion Channel Info' },
  { key:'supplementary',label:'Supplementary Info' }
];
const LOCALE_TABS = ['subsidy','coupon','landing','promotion','supplementary'];

function openDetail(id, opts){
  const c = CAMPAIGNS.find(x => x.campaignId === id);
  if(!c){ showToast('Campaign not found'); return; }
  currentDetail = c;
  activeMainTab = (opts && opts.tab) ? opts.tab : 'collection';
  activeSubsidyLine = 'flight';
  const teamLocales = TEAM_LOCALES[c.team];
  activeLocale = (opts && opts.locale && teamLocales.includes(opts.locale)) ? opts.locale : teamLocales[0];
  switchPage('detail');
  $('dTitle').innerHTML = `${escape(c.campaignName)}
    <span class="badge-stage ${c.status}" style="margin-left:8px;">${STATUS_LABEL[c.status]}</span>
    <span class="badge-tier tier-${(c.grade||'').toLowerCase().replace(/\s+/g,'')}" style="margin-left:4px;">${escape(c.grade)}</span>`;
  renderTabs(); renderTabBody(); refreshDetailSubBtn();
  if(opts && opts.tab){
    setTimeout(() => setMainTab(opts.tab), 0);
  }
}

function renderTabs(){
  $('mainTabs').innerHTML = TABS.map(t => `<div class="tab ${activeMainTab===t.key?'active':''}" role="button" tabindex="0" onclick="setMainTab('${t.key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setMainTab('${t.key}')}" data-key="${t.key}" title="Jump to ${t.label}">${t.label}</div>`).join('');
  syncDetailStickyOffsets();
}
function setMainTab(k){
  activeMainTab = k;
  document.querySelectorAll('#mainTabs .tab').forEach(el => el.classList.toggle('active', el.dataset.key === k));
  updateLocaleBar(k);
  requestAnimationFrame(() => {
    syncDetailStickyOffsets();
    scrollToDetailSection(k, 'smooth');
  });
}

function getDetailScrollHost(){
  const main = document.querySelector('.main');
  // The app uses .main as the only scroll container. Keeping one real scroll host
  // makes CSS sticky reliable for the detail tabs and locale selector on Windows and macOS.
  if(main) return main;
  return window;
}
function getHostScrollTop(host){
  return host === window
    ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)
    : host.scrollTop;
}
function getHostTop(host){
  return host === window ? 0 : host.getBoundingClientRect().top;
}
function setHostScrollTop(host, top, behavior){
  const safeTop = Math.max(0, Math.round(top));
  if(host === window){ window.scrollTo({ top: safeTop, behavior }); }
  else { host.scrollTo({ top: safeTop, behavior }); }
}
const LOCALE_AWARE_TABS = new Set(['subsidy','coupon','landing','promotion','supplementary']);

function getDetailTabsHeight(){
  const tabsEl = document.getElementById('mainTabs');
  return tabsEl ? Math.ceil(tabsEl.getBoundingClientRect().height) : 47;
}
function getDetailLocaleHeight(){
  const localeEl = document.getElementById('detailLocaleRow');
  return localeEl ? Math.ceil(localeEl.getBoundingClientRect().height) : 0;
}
function syncDetailStickyOffsets(){
  const tabsH = getDetailTabsHeight();
  document.documentElement.style.setProperty('--detail-tabs-sticky-height', tabsH + 'px');
}
function getDetailAnchorOffset(key){
  const tabsH = getDetailTabsHeight();
  const localeH = LOCALE_AWARE_TABS.has(key) ? getDetailLocaleHeight() : 0;
  return tabsH + localeH + 12;
}
function scrollToDetailSection(k, behavior = 'smooth'){
  const tgt = document.getElementById('sec-' + k);
  if(!tgt) return;
  syncDetailStickyOffsets();
  const host = getDetailScrollHost();
  const top = tgt.getBoundingClientRect().top - getHostTop(host) + getHostScrollTop(host) - getDetailAnchorOffset(k);
  setHostScrollTop(host, top, behavior);
}

function updateLocaleBar(key){
  // Locale is no longer a sticky header element. It is rendered permanently
  // below Campaign Basic Info so only the content beneath it is locale-aware.
  const bar = $('localeBar');
  if(bar){
    bar.classList.remove('show');
    bar.innerHTML = '';
  }
}

function renderLocaleSelector(){
  if(!currentDetail) return '';
  const locales = TEAM_LOCALES[currentDetail.team] || [];
  if(!locales.length) return '';
  return `<div class="detail-locale-row" id="detailLocaleRow">
    <span class="lb-label">Locale:</span>
    ${locales.map(l => `<span class="lt ${activeLocale===l?'active':''}" role="button" tabindex="0" onclick="setLocale('${l}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setLocale('${l}')}" title="Switch to ${l}">${l}</span>`).join('')}
    <span class="lb-hint">Locale applies to the sections below: Subsidy, Coupon, Landing, Promotion and Supplementary.</span>
  </div>`;
}

function setLocale(l){
  activeLocale = l;
  const host = getDetailScrollHost();
  const oldTop = getHostScrollTop(host);
  renderTabBody();
  // Keep current scroll position; do not jump to a section.
  requestAnimationFrame(() => setHostScrollTop(getDetailScrollHost(), oldTop, 'auto'));
}

function renderTabBody(){
  const d = DETAILS[currentDetail.campaignId];
  const sec = (key, inner) => `<section id="sec-${key}" class="detail-section">${inner}</section>`;
  const html = [
    sec('collection',    renderCollection(d.collection)),
    sec('campaign',      renderCampaign(d.campaign)),
    renderLocaleSelector(),
    sec('subsidy',       renderSubsidy(d.subsidy[activeLocale])),
    sec('coupon',        renderCoupon(d.coupon[activeLocale])),
    sec('landing',       renderLanding(d.landing[activeLocale])),
    sec('promotion',     renderPromotion(d.promotion[activeLocale])),
    sec('supplementary', renderSupplementary(d.supplementary[activeLocale]))
  ].join('');
  $('dBody').innerHTML = html;
  syncDetailStickyOffsets();
  updateLocaleBar(activeMainTab);
  bindScrollSpy();
  refreshTableOverflowTooltips($('dBody'));
}

let detailScrollSpyHost = null;
let detailScrollSpyHandler = null;
function bindScrollSpy(){
  if(detailScrollSpyHost && detailScrollSpyHandler){
    detailScrollSpyHost.removeEventListener('scroll', detailScrollSpyHandler);
  }
  const host = getDetailScrollHost();
  const handler = () => {
    syncDetailStickyOffsets();
    let cur = TABS[0].key;
    const hostTop = getHostTop(host);
    for(const t of TABS){
      const el = document.getElementById('sec-' + t.key);
      if(!el) continue;
      const offset = getDetailAnchorOffset(t.key) + 4;
      if(el.getBoundingClientRect().top - hostTop - offset <= 0) cur = t.key;
    }
    if(cur !== activeMainTab){
      activeMainTab = cur;
      document.querySelectorAll('#mainTabs .tab').forEach(el => el.classList.toggle('active', el.dataset.key === cur));
      updateLocaleBar(cur);
    }
  };
  detailScrollSpyHost = host;
  detailScrollSpyHandler = handler;
  host.addEventListener('scroll', handler, { passive: true });
  requestAnimationFrame(handler);
}

/* Reference-page style: paired KV blocks + plain mini-tables, no decorative bars */
function kvRow(k,v){ return `<div class="k">${k}</div><div class="v">${v}</div>`; }

function renderMiniTable(cols, rows, opts = {}){
  if(!rows || !rows.length) return `<div class="empty-mini">No data</div>`;
  const n = cols.length;
  const useSticky = n >= 7 || !!opts.forceSticky; // long tables and Subsidy tables: pin 3 left + 3 right
  const defaultW = opts.colWidth || 160;
  const widths = Array.from({length:n}, (_, i) => {
    const fromArray = Array.isArray(opts.colWidths) ? opts.colWidths[i] : null;
    return Number(fromArray || defaultW);
  });
  const totalW = widths.reduce((sum, w) => sum + w, 0);
  const leftOffsets = widths.map((_, i) => widths.slice(0, i).reduce((sum, w) => sum + w, 0));
  const rightOffsets = widths.map((_, i) => widths.slice(i + 1).reduce((sum, w) => sum + w, 0));
  const stickyCls = (i) => {
    if(!useSticky || n <= 3) return '';
    if(i < 3) return ` sticky-l sticky-l-${i}`;
    if(i >= Math.max(3, n - 3)) return ` sticky-r sticky-r-${n - 1 - i}`;
    return '';
  };
  const cellStyle = (i) => {
    const w = widths[i];
    let style = `min-width:${w}px;width:${w}px;max-width:${w}px;`;
    if(useSticky && n > 3){
      if(i < 3) style += `left:${leftOffsets[i]}px;`;
      if(i >= Math.max(3, n - 3)) style += `right:${rightOffsets[i]}px;`;
    }
    return ` style="${style}"`;
  };
  const tableClass = opts.tableClass ? ` ${opts.tableClass}` : '';
  const head = `<tr>${cols.map((c,i)=>`<th class="${stickyCls(i).trim()}"${cellStyle(i)}>${escape(c)}</th>`).join('')}</tr>`;
  const normalizedRows = rows.map(r => cols.map((_, i) => Array.isArray(r) && i < r.length ? r[i] : '-'));
  const body = normalizedRows.map(r => `<tr>${r.map((cell,i)=>`<td class="${stickyCls(i).trim()}"${cellStyle(i)}>${escape(cell)}</td>`).join('')}</tr>`).join('');
  return `<div class="mini-table-wrap${useSticky?' has-sticky':''}">
    <table class="mini-table${tableClass}" style="${useSticky?`min-width:${totalW}px;`:''}">
      <thead>${head}</thead>
      <tbody>${body}</tbody>
    </table>
  </div>`;
}

function renderCollection(c){
  return `<div class="panel basic-info-panel">
    <div class="section-title">Collection Basic Info</div>
    <div class="grid-2">
      <div class="kv">
        ${kvRow('Collection ID', c.collectionId)}
        ${kvRow('Collection Name (EN)', escape(c.collectionNameEN))}
        ${kvRow('Collection Name (Local)', escape(c.collectionNameLocal))}
        ${kvRow('Collection Theme', c.collectionTheme)}
        ${kvRow('Collection Grade', c.collectionGrade)}
        ${kvRow('Collection Description', escape(c.collectionDescription))}
      </div>
      <div class="kv">
        ${kvRow('Collection Period Type', c.collectionPeriodType)}
        ${kvRow('Collection Time Zone', c.collectionTimeZone)}
        ${kvRow('Start/End Date', c.collectionStartEndDate)}
        ${kvRow('Creator', c.collectionCreator)}
        ${kvRow('Update Time', c.collectionUpdateTime)}
      </div>
    </div>
  </div>`;
}

function localizedCampaignName(c){
  const loc = activeLocale || '';
  if(/^zh/i.test(loc) || /^ms/i.test(loc)) return c.nameLocal || c.nameEN || c.campaignName;
  return c.nameEN || c.nameLocal || c.campaignName;
}

function renderCampaign(c){
  const attHtml = c.attachment
    ? `<a href="javascript:void(0)" style="color:#3573f5;">${escape(c.attachment)}</a>`
    : '-';
  const linesHtml = c.promotedLines.map(l=>`<span class="chip">${escape(l)}</span>`).join('');
  const mechHtml = c.mechanism.map(m=>`<span class="chip">${escape(m)}</span>`).join('');
  const displayName = c.nameEN || c.campaignName || c.nameLocal || '-';
  return `<div class="panel basic-info-panel">
    <div class="section-title">Campaign Basic Info</div>
    <div class="grid-2">
      <div class="kv">
        ${kvRow('Campaign Display Name', escape(displayName))}
        ${kvRow('Campaign Name (EN)', escape(c.nameEN))}
        ${kvRow('Campaign Name (Local)', escape(c.nameLocal))}
        ${kvRow('Campaign Theme', escape(c.theme))}
        ${kvRow('Campaign Grade', escape(c.grade))}
        ${kvRow('Campaign Description', escape(c.description))}
        ${kvRow('Campaign Region', escape(c.region))}
      </div>
      <div class="kv">
        ${kvRow('Campaign Timezone', escape(c.timezone))}
        ${kvRow('Launch Date', escape(c.launchDate))}
        ${kvRow('Period Type', escape(c.periodType))}
        ${kvRow('Start/End Date', escape(c.startEndDate))}
        ${kvRow('Attachment', attHtml)}
        ${kvRow('Promoted Product Lines', linesHtml)}
        ${kvRow('Campaign Mechanism', mechHtml)}
        ${kvRow('Creator', escape(c.creator))}
        ${kvRow('Update Time', escape(c.updateTime))}
      </div>
    </div>
  </div>`;
}

function renderSubsidy(s){
  const order = [['flight','Flight'],['hotel','Hotel'],['tnt','TNT'],['bundle','Bundle']];
  const sections = order.map(([k,label]) => {
    const block = s && s[k] ? s[k] : { cols:[], rows:[] };
    const rows = block.rows || [];
    const cols = block.cols || [];
    if(!rows.length){
      return `<div class="subsection-block">
        <div class="subsection-title muted">${label} <span class="muted" style="font-size:12px; font-weight:400;">(no data)</span></div>
        <div class="empty-mini">No data</div>
      </div>`;
    }
    return `<div class="subsection-block">
      <div class="subsection-title">${label}</div>
      ${renderMiniTable(cols, rows, { forceSticky: true, tableClass: 'subsidy-mini-table', colWidths: cols.map((col, idx) => {
        if(idx === 0 || col === 'Time Zone') return 148;
        if(idx === 1 || col === 'Display Period') return 320;
        if(idx === 2 || col === 'Selling Period') return 320;
        return 160;
      }) })}
    </div>`;
  }).join('');
  return `<div class="panel subsidy-panel">
    <div class="section-title">Subsidy Info</div>
    ${sections}
  </div>`;
}

function setSubsidyLine(k){ activeSubsidyLine = k; renderTabBody(); }

function renderCoupon(c){
  return `<div class="panel coupon-panel">
    <div class="section-title">Coupon Info</div>
    ${renderMiniTable(c.cols, c.rows)}
  </div>`;
}

function renderLanding(l){
  const linkUrl = l.url ? `<a href="${l.url}" target="_blank" rel="noopener" class="real-link" style="word-break:break-all;">${escape(l.url)}</a>` : '-';
  const shareUrl = l.shareUrl ? `<a href="${l.shareUrl}" target="_blank" rel="noopener" class="real-link" style="word-break:break-all;">${escape(l.shareUrl)}</a>` : '-';
  const canon = l.canonicalUrl ? `<a href="${l.canonicalUrl}" target="_blank" rel="noopener" class="real-link" style="word-break:break-all;">${escape(l.canonicalUrl)}</a>` : '-';
  const shareImg = l.shareImage && l.shareImage !== '-'
    ? `<a href="${l.shareImage}" target="_blank" rel="noopener" class="real-link" style="word-break:break-all;">${escape(l.shareImage)}</a>`
    : '-';
  const termsText = String(l.terms || '');
  const termsLong = termsText.length > 280;
  const termsHtml = termsLong
    ? `<div class="terms-collapsible">
        <div class="terms-content collapsed" style="white-space:pre-wrap;">${escape(termsText)}</div>
        <button class="btn btn-link btn-sm" onclick="this.previousElementSibling.classList.toggle('collapsed'); this.textContent = this.previousElementSibling.classList.contains('collapsed')?'Show more':'Show less'">Show more</button>
      </div>`
    : `<div style="white-space:pre-wrap;">${escape(termsText)}</div>`;
  return `<div class="panel">
    <div class="section-title">Landing Page Info</div>
    <div class="kv-stack">
      ${kvRow('Landing Page URL', linkUrl)}
      ${kvRow('Version', `<span class="chip">${escape(l.version)}</span>`)}
      ${kvRow('Update Time', escape(l.updateTime))}
      ${kvRow('Title', escape(l.title))}
      ${kvRow('Description', escape(l.description))}
      ${kvRow('Keywords', escape(l.keywords))}
      ${kvRow('Terms&amp;Conditions', termsHtml)}
      ${kvRow('Share Title', escape(l.shareTitle))}
      ${kvRow('Share Description', escape(l.shareDescription))}
      ${kvRow('Share URL', shareUrl)}
      ${kvRow('Share Image', shareImg)}
      ${kvRow('Canonical Url', canon)}
    </div>
  </div>`;
}

function renderPromotion(p){
  const channelRows = p.channels.map(ch => [ch.channel, ch.headline, ch.content]);
  const imgGrid = (arr) => arr.length
    ? `<div class="img-grid">${arr.map(u => `<a href="${u}" target="_blank" rel="noopener" class="img-cell real-link"><img src="${u}" alt="Promotion asset" loading="lazy" onerror="this.parentNode.innerHTML='<span class=&quot;img-fallback&quot;>Image unavailable</span>'"></a>`).join('')}</div>`
    : `<div class="empty-mini">No data</div>`;
  return `<div class="panel promotion-panel">
    <div class="section-title">Promotion Channel Info</div>
    ${renderMiniTable(['Channel','Copy Headline','Copy Content'], channelRows)}

    <div class="subsection-block">
      <div class="subsection-title">Asset of Flash Sale Products</div>
      ${imgGrid(p.flashImages)}
    </div>
  </div>`;
}

function renderSupplementary(s){
  const text = s.text || '';
  const linked = escape(text).replace(/(https?:\/\/[^\s]+)/g, u => `<a href="${u}" target="_blank" style="color:#3573f5;">${u}</a>`);
  return `<div class="panel">
    <div class="section-title">Supplementary Info</div>
    <div style="white-space:pre-wrap;line-height:1.7;color:#3a4150;padding:4px 4px 8px;">${linked || '-'}</div>
  </div>`;
}

/* ========================= Excel export ========================= */
function xmlEscape(v){ return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])); }
function sheetFromRows(name, rows){
  const body = rows.map(row => `<Row>${row.map(cell => `<Cell><Data ss:Type="String">${xmlEscape(cell)}</Data></Cell>`).join('')}</Row>`).join('');
  return `<Worksheet ss:Name="${xmlEscape(name).slice(0,31)}"><Table>${body}</Table></Worksheet>`;
}
function downloadDetailExcel(){
  if(!currentDetail) return;
  const c = currentDetail;
  const d = DETAILS[c.campaignId];
  const locales = TEAM_LOCALES[c.team];
  const sheets = [];

  // Sheet: Collection Details
  const col = d.collection;
  sheets.push(sheetFromRows('Collection Details', [
    ['Field','Value'],
    ['Collection ID', col.collectionId],
    ['Collection Name (EN)', col.collectionNameEN],
    ['Collection Name (Local)', col.collectionNameLocal],
    ['Collection Theme', col.collectionTheme],
    ['Collection Grade', col.collectionGrade],
    ['Collection Description', col.collectionDescription],
    ['Collection Period Type', col.collectionPeriodType],
    ['Collection Time Zone', col.collectionTimeZone],
    ['Start/End Date', col.collectionStartEndDate],
    ['Creator', col.collectionCreator],
    ['Update Time', col.collectionUpdateTime]
  ]));

  // Sheet: Campaign Details
  const cd = d.campaign;
  sheets.push(sheetFromRows('Campaign Details', [
    ['Field','Value'],
    ['Campaign ID', cd.campaignId],
    ['Campaign Name (EN)', cd.nameEN],
    ['Campaign Name (Local)', cd.nameLocal],
    ['Campaign Theme', cd.theme],
    ['Campaign Grade', cd.grade],
    ['Campaign Description', cd.description],
    ['Campaign Region', cd.region],
    ['Campaign Timezone', cd.timezone],
    ['Launch Date', cd.launchDate],
    ['Period Type', cd.periodType],
    ['Start/End Date', cd.startEndDate],
    ['Attachment', cd.attachment],
    ['Promoted Product Lines', cd.promotedLines.join(', ')],
    ['Campaign Mechanism', cd.mechanism.join(', ')],
    ['Status', STATUS_LABEL[cd.status]],
    ['Audit Status', cd.auditStatus],
    ['Creator', cd.creator],
    ['Create Time', cd.createTime],
    ['Update Time', cd.updateTime]
  ]));

  // Sheet: Subsidy (per locale, all 4 lines, table rows expanded)
  const subsidyRows = [];
  locales.forEach(loc => {
    const s = d.subsidy[loc];
    ['flight','hotel','tnt','bundle'].forEach(k => {
      subsidyRows.push([`Locale: ${loc} | Line: ${k.toUpperCase()}`]);
      subsidyRows.push(['#', ...s[k].cols]);
      if(!s[k].rows.length){
        subsidyRows.push(['No data']);
      } else {
        s[k].rows.forEach((r,i) => subsidyRows.push([i+1, ...r]));
      }
      subsidyRows.push([]);
    });
  });
  sheets.push(sheetFromRows('Subsidy Info', subsidyRows));

  // Sheet: Coupon (per locale)
  const couponRows = [];
  locales.forEach(loc => {
    const cp = d.coupon[loc];
    couponRows.push([`Locale: ${loc}`]);
    couponRows.push(['#', ...cp.cols]);
    if(!cp.rows.length) couponRows.push(['No data']);
    else cp.rows.forEach((r,i) => couponRows.push([i+1, ...r]));
    couponRows.push([]);
  });
  sheets.push(sheetFromRows('Coupon Info', couponRows));

  // Sheet: Landing Page (per locale)
  const landingRows = [['Locale', ...LANDING_FIELDS]];
  locales.forEach(loc => {
    const l = d.landing[loc];
    landingRows.push([loc, l.url, l.version, l.updateTime, l.title, l.description, l.keywords, l.terms, l.shareTitle, l.shareDescription, l.shareUrl, l.shareImage, l.canonicalUrl]);
  });
  sheets.push(sheetFromRows('Landing Page Info', landingRows));

  // Sheet: Promotion (per locale, channels expanded + assets)
  const promoRows = [];
  locales.forEach(loc => {
    const p = d.promotion[loc];
    promoRows.push([`Locale: ${loc} | Channels`]);
    promoRows.push(['Channel','Copy Headline','Copy Content']);
    p.channels.forEach(ch => promoRows.push([ch.channel, ch.headline, ch.content]));
    promoRows.push([]);
    promoRows.push([`Locale: ${loc} | Asset of Flash Sale Products`]);
    p.flashImages.forEach((u,i) => promoRows.push([`Flash ${i+1}`, u]));
    promoRows.push([]);
  });
  sheets.push(sheetFromRows('Promotion', promoRows));

  // Sheet: Supplementary (per locale, free text)
  const supRows = [['Locale','Supplementary Info']];
  locales.forEach(loc => supRows.push([loc, d.supplementary[loc].text]));
  sheets.push(sheetFromRows('Supplementary', supRows));

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
${sheets.join('\n')}
</Workbook>`;

  const blob = new Blob([xml], {type:'application/vnd.ms-excel'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campaign_${c.campaignId}_${c.team}.xls`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Excel exported');
}

/* ========================= My Subscriptions ========================= */
const EVENT_DEFS = [
  { key:'collection', label:'Collection Basic Info', tab:'collection' },
  { key:'campaign', label:'Campaign Basic Info', tab:'campaign' },
  { key:'subsidy', label:'Subsidy Info', tab:'subsidy' },
  { key:'coupon', label:'Coupon Info', tab:'coupon' },
  { key:'landing', label:'Landing Page Info', tab:'landing' },
  { key:'promotion', label:'Promotion Channel Info', tab:'promotion' },
  { key:'supplementary', label:'Supplementary Info', tab:'supplementary' }
];
const ALL_EVENTS = EVENT_DEFS.map(e => e.key);

/* Demo seed data for My Subscriptions: keep enough rows for front-end style checks. */
const DEMO_SUB_EVENTS = ['collection','campaign','subsidy','coupon','landing','promotion','supplementary'];
function demoChange(type, locale, time, op, scope, field, before, after, isNew=true){
  const ch = { type, locale, time, isNew, op, scope, field };
  if(before !== undefined && before !== null) ch.before = before;
  if(after !== undefined && after !== null) ch.after = after;
  return ch;
}
function buildPrimaryDemoChanges(campaignId, region){
  const loc = region === 'HK' ? 'zh-HK' : region === 'TW' ? 'zh-TW' : region === 'SG' ? 'en-SG' : region === 'MY' ? 'en-MY' : '-';
  const currency = region === 'TW' ? 'TWD' : region === 'SG' ? 'SGD' : region === 'MY' ? 'MYR' : 'HKD';
  return [
    demoChange('collection','-','2026-05-16 19:10','update','Collection Basic Info','Collection Name','IBU Mega Sale 2026 Collection','IBU Mega Sale 2026 Collection · Regional',true),
    demoChange('campaign','-','2026-05-16 18:42','update','Campaign Basic Info','Campaign Region',region,`${region}, ${region === 'HK' ? 'MO' : region}`,true),
    demoChange('subsidy',loc,'2026-05-16 17:35','add','Subsidy Info / Flight','Flight',null,`${region} flight flash deal · ONE_PRICE 333 ${currency}`,true),
    demoChange('subsidy',loc,'2026-05-16 16:20','update','Subsidy Info / Hotel','Hotel','Status: Pending','Status: Active',true),
    demoChange('subsidy',loc,'2026-05-16 15:05','add','Subsidy Info / TNT','TNT',null,`${region} attraction ticket · BOGO · ${currency}`,true),
    demoChange('subsidy',loc,'2026-05-16 14:18','add','Subsidy Info / Bundle','Bundle',null,`${region} flight + hotel package · ONE_PRICE`,true),
    demoChange('coupon',loc,'2026-05-16 13:33','add','Coupon Info',`${campaignId}01`,null,`Gift ${campaignId}01 · Member exclusive coupon`,true),
    demoChange('coupon',loc,'2026-05-16 12:26','update','Coupon Info',`${campaignId}001`,`Gift: ${campaignId}001`,`Gift: ${campaignId}001, ${campaignId}002`,true),
    demoChange('landing',loc,'2026-05-16 11:12','update','Landing Page Info',`https://${region.toLowerCase()}.trip.com/sale/mega2026?locale=${loc}`,'Share Title: Mega Sale','Share Title: Mega Sale · Limited Time Deals',true),
    demoChange('promotion',loc,'2026-05-16 10:05','update','Promotion Channel Info','Asset of Flash Sale Products','5 images','8 images',true),
    demoChange('promotion',loc,'2026-05-16 09:30','add','Promotion Channel Info','Asset of Flash Sale Products',null,'3 new flash sale product banners',false),
    demoChange('supplementary',loc,'2026-05-16 08:45','update','Supplementary Info','','Remark: Pending BD review','Remark: Reviewed by campaign owner',false)
  ];
}
function buildGenericDemoChanges(c, idx){
  const loc = c.team === 'HK' ? 'zh-HK' : c.team === 'TW' ? 'zh-TW' : c.team === 'SG' ? 'en-SG' : c.team === 'MY' ? 'en-MY' : '-';
  const day = String(15 - (idx % 5)).padStart(2,'0');
  return [
    demoChange('campaign','-',`2026-05-${day} 18:0${idx%10}`,'update','Campaign Basic Info','Campaign Status','Draft',STATUS_LABEL[c.status] || c.status,true),
    demoChange('coupon',loc,`2026-05-${day} 16:2${idx%10}`,'add','Coupon Info',`${c.campaignId}99`,null,`Gift ${c.campaignId}99 · ${c.campaignName} coupon`,idx % 2 === 0),
    demoChange('promotion',loc,`2026-05-${day} 14:4${idx%10}`,'update','Promotion Channel Info','Kol','Headline: Old headline',`Headline: ${c.campaignName} headline`,false)
  ];
}
function seedDemoSubscriptions(){
  const seedCampaigns = CAMPAIGNS.slice(0, 13);
  seedCampaigns.forEach((c, idx) => {
    const id = String(c.campaignId);
    if(!SUBS[id]){
      SUBS[id] = {
        events: DEMO_SUB_EVENTS.slice(),
        subscribedAt: `2026-05-${String((idx % 9) + 1).padStart(2,'0')} 09:00`,
        demo:true
      };
    } else if(!Array.isArray(SUBS[id].events)){
      SUBS[id].events = DEMO_SUB_EVENTS.slice();
    }
  });
  CHANGES[31571] = buildPrimaryDemoChanges(31571, 'HK');
  CHANGES[31578] = buildPrimaryDemoChanges(31578, 'TW');
  seedCampaigns.forEach((c, idx) => {
    const id = String(c.campaignId);
    if(!CHANGES[id] || !CHANGES[id].length){
      CHANGES[id] = buildGenericDemoChanges(c, idx);
    }
  });
}

const SUB_FILTER_LS_KEY = 'campaignPortal.subFilter.remembered.v1';
const SUB_FILTER = (function(){
  const def = {
    fCol:'', fColName:'', fCmp:'', fName:'', fTheme:'', fGrade:'',
    regions:new Set(),
    fStatus:'',
    events:new Set(ALL_EVENTS),
    unreadOnly:false,
    sinceMode:'subscribedAt',
    sinceCustom:''
  };
  try{
    const raw = localStorage.getItem(SUB_FILTER_LS_KEY);
    if(raw){
      const o = JSON.parse(raw);
      def.fCol = o.fCol || '';
      def.fColName = o.fColName || '';
      def.fCmp = o.fCmp || '';
      def.fName = o.fName || '';
      def.fTheme = normalizeSubFilterChoice(o.fTheme);
      def.fGrade = normalizeSubFilterChoice(o.fGrade);
      def.fStatus = normalizeSubFilterChoice(o.fStatus);
      def.regions = new Set(Array.isArray(o.regions) ? o.regions : []);
      const savedEvents = Array.isArray(o.events) ? o.events.filter(e => ALL_EVENTS.includes(e)) : ALL_EVENTS;
      def.events = new Set(savedEvents.length ? savedEvents : ALL_EVENTS);
      def.unreadOnly = !!o.unreadOnly;
      def.sinceMode = o.sinceMode === 'custom' ? 'custom' : 'subscribedAt';
      def.sinceCustom = o.sinceCustom || '';
    }
  }catch(e){}
  return def;
})();
function subFilterSnapshot(){
  return {
    fCol:SUB_FILTER.fCol, fColName:SUB_FILTER.fColName,
    fCmp:SUB_FILTER.fCmp, fName:SUB_FILTER.fName,
    fTheme:normalizeSubFilterChoice(SUB_FILTER.fTheme), fGrade:normalizeSubFilterChoice(SUB_FILTER.fGrade), fStatus:normalizeSubFilterChoice(SUB_FILTER.fStatus),
    regions:[...SUB_FILTER.regions], events:[...SUB_FILTER.events],
    unreadOnly:SUB_FILTER.unreadOnly, sinceMode:SUB_FILTER.sinceMode,
    sinceCustom:SUB_FILTER.sinceCustom
  };
}
function persistSubFilter(){
  // Intentionally no-op: filter values are remembered only when the user clicks "Remember filters".
}
function rememberSubFilter(){
  try{
    localStorage.setItem(SUB_FILTER_LS_KEY, JSON.stringify(subFilterSnapshot()));
    showToast('Filters remembered');
  }catch(e){
    showToast('Unable to remember filters');
  }
}
const READ = new Set();
const UNREAD_OVERRIDE = new Set();
const EXPANDED = new Set();
const SUB_SELECTED = new Set();
let subPageNum = 1;
let subPageSize = 10;
let regionDropdownOpen = false;
let sincePickerOpen = false;
let sincePickerView = null;
let subOpenFilterKey = null;

function changeKey(id, ch){
  // Stable per-change key — use the change object's unique signature, but
  // encode each part to avoid collisions / injection through pipe / quote chars.
  const enc = v => encodeURIComponent(String(v ?? ''));
  return `${id}|${enc(ch.type)}|${enc(ch.time)}|${enc(ch.scope)}|${enc(ch.field)}|${enc(ch.op)}`;
}

function parseTime(s){
  if(!s) return 0;
  if(typeof s === 'number') return s; // already an epoch-ms value (e.g. group.latest in sort tie-breaks)
  // Accept "YYYY-MM-DD HH:mm[:ss]" or ISO with 'T'
  const t = Date.parse(s.includes('T') ? s : s.replace(' ', 'T'));
  return isNaN(t) ? 0 : t;
}

function getSinceFor(id){
  if(SUB_FILTER.sinceMode === 'custom' && SUB_FILTER.sinceCustom){
    return normalizeSinceCustomInput(SUB_FILTER.sinceCustom).replace('T',' ') || SUB_FILTER.sinceCustom.replace('T',' ');
  }
  return (SUBS[id] && SUBS[id].subscribedAt) || '1970-01-01 00:00';
}

function changesForCampaign(id){
  const sub = SUBS[id]; if(!sub) return [];
  const sinceMs = parseTime(getSinceFor(id));
  const subEvents = Array.isArray(sub.events) ? sub.events : ALL_EVENTS;
  return (CHANGES[id] || []).filter(ch => {
    if(!subEvents.includes(ch.type)) return false;
    if(parseTime(ch.time) < sinceMs) return false;
    if(!SUB_FILTER.events.has(ch.type)) return false;
    return true;
  }).sort((a,b) => parseTime(b.time) - parseTime(a.time));
}

function isUnread(id, ch){
  const k = changeKey(id, ch);
  if(UNREAD_OVERRIDE.has(k)) return true;
  return ch.isNew && !READ.has(k);
}

function passCampaignFilter(c){
  const F = SUB_FILTER;
  if(F.fCol && !String(c.collectionId).toLowerCase().includes(F.fCol.toLowerCase())) return false;
  if(F.fColName && !String(c.collectionName || '').toLowerCase().includes(F.fColName.toLowerCase())) return false;
  if(F.fCmp && !String(c.campaignId).toLowerCase().includes(F.fCmp.toLowerCase())) return false;
  if(F.fName && !c.campaignName.toLowerCase().includes(F.fName.toLowerCase())) return false;
  if(F.regions.size && !getCampaignRegions(c).some(r => F.regions.has(r))) return false;
  if(!subFilterAllows('fTheme', c.theme)) return false;
  if(!subFilterAllows('fGrade', c.grade)) return false;
  if(!subFilterAllows('fStatus', c.status)) return false;
  return true;
}

const TYPE_LABEL = EVENT_DEFS.reduce((m,e) => (m[e.key] = e.label, m), {});
const TYPE_TO_TAB = EVENT_DEFS.reduce((m,e) => (m[e.key] = e.tab, m), {});
const OP_LABEL = { add:'Added', update:'Updated', remove:'Removed' };
const EN_MONTHS = [
  ['01','Jan'],['02','Feb'],['03','Mar'],['04','Apr'],['05','May'],['06','Jun'],
  ['07','Jul'],['08','Aug'],['09','Sep'],['10','Oct'],['11','Nov'],['12','Dec']
];
const EN_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const EN_WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function pad2(v){ return String(v).padStart(2, '0'); }
function parseSinceCustomParts(value){
  const m = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:T|\s)(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if(!m) return {year:'', month:'', day:'', hour:'', minute:'', second:''};
  return {year:m[1], month:m[2], day:m[3], hour:m[4], minute:m[5], second:m[6] || '00'};
}
function daysInMonth(year, month){
  const y = parseInt(year, 10) || 2026;
  const m = parseInt(month, 10) || 1;
  return new Date(y, m, 0).getDate();
}
function normalizeSinceCustomInput(value){
  const p = parseSinceCustomParts(value);
  if(!(p.year && p.month && p.day && p.hour && p.minute)) return '';
  const maxDay = daysInMonth(p.year, p.month);
  const safeDay = pad2(Math.min(parseInt(p.day,10), maxDay));
  return `${p.year}-${p.month}-${safeDay}T${p.hour}:${p.minute}:${p.second || '00'}`;
}
function formatSinceDisplay(value){
  const normalized = normalizeSinceCustomInput(value);
  return (normalized || String(value || '')).replace('T',' ');
}
function pickerBaseDate(){
  const p = parseSinceCustomParts(SUB_FILTER.sinceCustom);
  if(p.year && p.month) return {year:parseInt(p.year,10), month:parseInt(p.month,10)};
  const d = new Date();
  return {year:d.getFullYear(), month:d.getMonth()+1};
}
function setSincePickerViewFromValue(){
  const base = pickerBaseDate();
  sincePickerView = `${base.year}-${pad2(base.month)}`;
}
function renderCalendarGrid(year, month, selectedDate){
  const first = new Date(year, month - 1, 1);
  const days = daysInMonth(year, month);
  const blanks = first.getDay();
  const cells = [];
  for(let i=0;i<blanks;i++) cells.push('<button class="dt-day-btn muted" type="button" disabled></button>');
  for(let d=1; d<=days; d++){
    const date = `${year}-${pad2(month)}-${pad2(d)}`;
    cells.push(`<button class="dt-day-btn ${selectedDate===date?'selected':''}" type="button" onclick="selectSinceDate('${date}')">${d}</button>`);
  }
  return cells.join('');
}
function renderEnglishDateTimePicker(value, enabled){
  const normalized = normalizeSinceCustomInput(value);
  const displayValue = formatSinceDisplay(value);
  const parsed = parseSinceCustomParts(normalized || value);
  const base = sincePickerView
    ? {year:parseInt(sincePickerView.slice(0,4),10), month:parseInt(sincePickerView.slice(5,7),10)}
    : pickerBaseDate();
  const selectedDate = parsed.year && parsed.month && parsed.day ? `${parsed.year}-${parsed.month}-${parsed.day}` : '';
  const selectedTime = parsed.hour ? `${parsed.hour}:${parsed.minute}:${parsed.second || '00'}` : '00:00:00';
  const disabled = enabled ? '' : 'disabled';
  const panel = enabled && sincePickerOpen ? `<div class="dt-panel" onclick="event.preventDefault();event.stopPropagation()">
    <div class="dt-panel-head">
      <button class="dt-nav" type="button" onclick="shiftSincePickerMonth(-1)">‹</button>
      <span>${EN_MONTH_NAMES[base.month-1]} ${base.year}</span>
      <button class="dt-nav" type="button" onclick="shiftSincePickerMonth(1)">›</button>
    </div>
    <div class="dt-week">${EN_WEEKDAYS.map(d=>`<span>${d}</span>`).join('')}</div>
    <div class="dt-grid">${renderCalendarGrid(base.year, base.month, selectedDate)}</div>
    <div class="dt-foot">
      <span class="muted">Time</span>
      <input id="sincePopupTime" class="dt-time-input" value="${escape(selectedTime)}" placeholder="HH:mm:ss" oninput="setSinceTimeOnly(this.value)" onkeydown="if(event.key==='Enter')applySinceCustomInput($('sinceCustomInput').value)">
      <span style="flex:1"></span>
      <button class="btn btn-sm" type="button" onclick="setSinceNow()">Now</button>
      <button class="btn btn-primary btn-sm" type="button" onclick="applySinceCustomInput($('sinceCustomInput').value)">Apply</button>
    </div>
  </div>` : '';
  return `<span class="datetime-combo ${enabled?'':'disabled'}" onclick="event.preventDefault();event.stopPropagation()" aria-label="Custom date time filter">
    <input id="sinceCustomInput" class="dt-input" ${disabled} value="${escape(displayValue)}" placeholder="YYYY-MM-DD HH:mm:ss" oninput="setSinceCustomRaw(this.value)" onchange="applySinceCustomInput(this.value)" onkeydown="if(event.key==='Enter')applySinceCustomInput(this.value)">
    <button class="dt-icon" type="button" ${disabled} aria-label="Open English date time picker" onclick="openSincePicker(event)">▦</button>
    ${panel}
  </span>`;
}

function renderSubPage(){
  const ids = Object.keys(SUBS);
  const box = $('subListBox');
  const stats = $('subStats');
  if(!ids.length){
    if(stats) stats.innerHTML = '';
    box.innerHTML = `<div class="page-card"><div class="empty">No subscriptions yet. Click "Subscribe" on the campaign list to start.</div></div>`;
    enhanceCustomSelects(document);
    refreshTableOverflowTooltips($('page-sub'));
  requestAnimationFrame(updateSubStickyHeaders);
}

  // Per-campaign rows: filter campaigns + count unread within `since`
  const rows = ids.map(id => {
    const c = CAMPAIGNS.find(x => String(x.campaignId) === id);
    if(!c) return null;
    if(!passCampaignFilter(c)) return null;
    const list = changesForCampaign(id);
    const unread = list.filter(ch => isUnread(id, ch)).length;
    if(SUB_FILTER.unreadOnly && unread === 0) return null;
    return { id, c, list, unread };
  }).filter(Boolean);

  const totalUnread = rows.reduce((s,r) => s + r.unread, 0);
  const visibleSelectedCount = rows.filter(r => SUB_SELECTED.has(r.id)).length;
  if(stats){
    stats.innerHTML = `<span class="muted">${ids.length} campaign(s) subscribed</span> · <span class="muted">${rows.length} shown</span>${totalUnread?` · <span class="badge-new">${totalUnread} unread</span>`:''}`;
  }

  // Build filter bar — match list page (.filter / .field)
  const F = SUB_FILTER;
  const eventChips = EVENT_DEFS
    .map(e => `<div class="filter-chip ${F.events.has(e.key)?'active':''}" onclick="toggleSubEvent('${e.key}')">${e.label}</div>`).join('');

  const themes = ['US_Airline_campaign','HK_HKMO_destination','JP_Branding_campaign','TH_Branding_campaign','Mega Sale'];
  const regions = ['HK','TW','SG','MY'];
  const grades = ['Tier 1','Tier 2','Tier 3'];
  const statuses = [['live','Live'],['upcoming','Upcoming'],['ended','Ended'],['draft','Draft']];

  const regionLabel = F.regions.size ? [...F.regions].join(', ') : 'All';
  const regionDropdown = `<div class="region-dropdown ${regionDropdownOpen?'open':''}" ${F.regions.size?`data-full-label="${escape(regionLabel)}"`:''}>
    <div class="rd-trigger" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="${regionDropdownOpen?'true':'false'}" aria-label="Filter by region" onclick="toggleRegionDropdown(event)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleRegionDropdown(event)}">
      <span class="rd-text ${F.regions.size?'':'placeholder'}">${escape(regionLabel)}</span>
      <span class="rd-caret" aria-hidden="true"><svg viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </div>
    ${regionDropdownOpen ? `<div class="rd-panel" role="listbox" onclick="event.preventDefault();event.stopPropagation()">
      <div class="rd-opt ${F.regions.size?'':'is-selected'}" role="option" aria-selected="${F.regions.size?'false':'true'}" onclick="selectAllSubRegions()"><span>All</span><span class="rd-check">✓</span></div>
      ${regions.map(r => `<div class="rd-opt ${F.regions.has(r)?'is-selected':''}" role="option" aria-selected="${F.regions.has(r)?'true':'false'}" onclick="toggleSubRegion('${r}')"><span>${r}</span><span class="rd-check">✓</span></div>`).join('')}
    </div>` : ''}
  </div>`;

  const filterBar = `<div class="page-card sub-filter-card">
    <div class="filter sub-filter-row">
      <div class="field"><label>Collection ID:</label><input id="subFCol" value="${escape(F.fCol || '')}" oninput="setSubFilterDebounced('fCol', this.value)" onkeydown="if(event.key==='Enter')flushSubFilter()" /></div>
      <div class="field"><label>Collection Name:</label><input id="subFColName" value="${escape(F.fColName || '')}" oninput="setSubFilterDebounced('fColName', this.value)" onkeydown="if(event.key==='Enter')flushSubFilter()" /></div>
      <div class="field"><label>Campaign ID:</label><input id="subFCmp" value="${escape(F.fCmp)}" oninput="setSubFilterDebounced('fCmp', this.value)" onkeydown="if(event.key==='Enter')flushSubFilter()" /></div>
      <div class="field"><label>Campaign Name:</label><input id="subFName" value="${escape(F.fName)}" oninput="setSubFilterDebounced('fName', this.value)" onkeydown="if(event.key==='Enter')flushSubFilter()" /></div>
      <div class="field"><label>Theme:</label>
        <select data-sub-filter-key="fTheme" data-filter-searchable="true" multiple onchange="setSubFilter('fTheme', getSelectValues(this))">
          <option value="" ${getSubFilterValues('fTheme').length?'':'selected'}>All</option>${themes.map(t=>`<option value="${escape(t)}" ${getSubFilterValues('fTheme').includes(t)?'selected':''}>${escape(t)}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Grade:</label>
        <select data-sub-filter-key="fGrade" multiple onchange="setSubFilter('fGrade', getSelectValues(this))">
          <option value="" ${getSubFilterValues('fGrade').length?'':'selected'}>All</option>${grades.map(g=>`<option value="${escape(g)}" ${getSubFilterValues('fGrade').includes(g)?'selected':''}>${escape(g)}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Campaign Region:</label>${regionDropdown}</div>
      <div class="field"><label>Campaign Status:</label>
        <select data-sub-filter-key="fStatus" multiple onchange="setSubFilter('fStatus', getSelectValues(this))">
          <option value="" ${getSubFilterValues('fStatus').length?'':'selected'}>All</option>${statuses.map(([v,l])=>`<option value="${v}" ${getSubFilterValues('fStatus').includes(v)?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="ff-row sub-events-row">
      <span class="ff-label">Subscribed Event:</span>
      <div class="ff-chips">${eventChips}</div>
    </div>
    <div class="ff-row sub-since-row">
      <span class="ff-label">Info changes since:</span>
      <label class="ff-toggle"><input type="radio" name="sinceMode" ${F.sinceMode==='subscribedAt'?'checked':''} onchange="setSinceMode('subscribedAt')"> Subscription start</label>
      <label class="ff-toggle"><input type="radio" name="sinceMode" ${F.sinceMode==='custom'?'checked':''} onchange="setSinceMode('custom')"> Custom</label>
      ${renderEnglishDateTimePicker(F.sinceCustom, F.sinceMode==='custom')}
      <span class="muted" style="font-size:12px;">to current time</span>
      <label class="ff-toggle"><input type="checkbox" ${F.unreadOnly?'checked':''} onchange="setSubFilter('unreadOnly', this.checked)"> Unread only</label>
    </div>
    <div class="ff-row sub-filter-button-row">
      <button class="btn btn-link sub-mark-all-read-btn" onclick="markAllRead()" ${totalUnread?'':'disabled'}>Mark all as read</button>
      <button class="btn btn-remember" onclick="rememberSubFilter()">Remember filters</button>
      <button class="btn" onclick="resetSubFilter()">Reset</button>
    </div>
  </div>
  <div class="ff-row sub-action-row">
    <span class="muted" style="font-size:12px;">${visibleSelectedCount?`Selected: ${visibleSelectedCount}`:''}</span>
    <span style="flex:1;"></span>
    <button class="btn btn-batch-danger" onclick="batchUnsubscribeFromSub()" ${visibleSelectedCount?'':'disabled'}>Unsubscribe in batch</button>
  </div>`;

  // Overview rows (collapsible) — paginated
  const totalRows = rows.length;
  const totalSubPages = Math.max(1, Math.ceil(totalRows / subPageSize));
  if(subPageNum > totalSubPages) subPageNum = totalSubPages;
  const subStart = (subPageNum - 1) * subPageSize;
  const pageRows = rows.slice(subStart, subStart + subPageSize);
  const headerChecked = pageRows.length && pageRows.every(r => SUB_SELECTED.has(r.id));
  let body;
  if(!rows.length){
    body = `<div class="page-card"><div class="empty">No subscriptions match the current filters.</div></div>`;
  } else {
    const subColgroup = `<colgroup>
        <col style="width:44px;">
        <col style="width:44px;">
        <col style="width:90px;">
        <col style="width:360px;">
        <col style="width:160px;">
        <col style="width:80px;">
        <col style="width:120px;">
        <col style="width:120px;">
        <col style="width:140px;">
        <col style="width:76px;">
        <col style="width:240px;">
      </colgroup>`;
    const subTableHead = `<table class="sub-table sub-table-head" aria-hidden="false">
      ${subColgroup}
      <thead><tr>
        <th><input type="checkbox" aria-label="Select all subscribed campaigns on this page" ${headerChecked?'checked':''} onchange="toggleSubSelectAll(this.checked)" /></th>
        <th></th>
        <th>Campaign ID</th>
        <th>Campaign Name</th>
        <th>Theme</th>
        <th>Grade</th>
        <th>Campaign Region</th>
        <th>Campaign Status</th>
        <th>Subscribed at</th>
        <th>Unread</th>
        <th class="action-col">Action</th>
      </tr></thead>
    </table>`;
    body = `<div class="page-card overview-card">
      <div class="sub-table-head-wrap">${subTableHead}</div>
      <div class="sub-table-wrap" onscroll="syncSubParentHeader(this)">
      <table class="sub-table sub-table-body">
        ${subColgroup}
        <tbody>${pageRows.map(r => renderOverviewRow(r)).join('')}</tbody>
      </table>
      </div>
      <div class="pagination" id="subPagination">${renderSubPaginationHtml(totalRows, totalSubPages)}</div>
    </div>`;
  }

  box.innerHTML = filterBar + body;
  enhanceCustomSelects(document);
  refreshFilterDropdownTooltips(box);
  if(subOpenFilterKey){
    const reopenedSelect = box.querySelector(`select[data-sub-filter-key="${subOpenFilterKey}"]`);
    const reopenedWrap = reopenedSelect && reopenedSelect._customSelect;
    if(reopenedWrap){
      closeCustomSelect(reopenedWrap);
      reopenedWrap.classList.add('open');
      const trigger = reopenedWrap.querySelector('.custom-select-trigger');
      if(trigger) trigger.setAttribute('aria-expanded', 'true');
      refreshCustomSelect(reopenedSelect);
      activeCustomSelect = reopenedWrap;
    }
    subOpenFilterKey = null;
  }
  // Restore focus & caret in text filters after re-render
  try {
    const saved = subInputFocus;
    if(saved){
      const el = $(saved.id);
      if(el){
        el.focus();
        if(typeof saved.start === 'number') el.setSelectionRange(saved.start, saved.end);
      }
    }
    // header checkbox indeterminate
    const headerCb = box.querySelector('table.sub-table-head thead input[type="checkbox"]');
    if(headerCb){
      const sel = pageRows.filter(r => SUB_SELECTED.has(r.id)).length;
      headerCb.indeterminate = sel > 0 && sel < pageRows.length;
    }
  } catch(e){}
  refreshTableOverflowTooltips($('page-sub'));
  requestAnimationFrame(() => { syncSubExpandWidths(); updateSubStickyHeaders(); });
}
let subInputFocus = null;
function captureSubInputFocus(){
  const el = document.activeElement;
  if(el && ['subFCol','subFColName','subFCmp','subFName'].includes(el.id)){
    subInputFocus = { id: el.id, start: el.selectionStart, end: el.selectionEnd };
  } else {
    subInputFocus = null;
  }
}
let _subFilterDebounce = null;
function setSubFilterDebounced(k, v){
  SUB_FILTER[k] = v;
  captureSubInputFocus();
  clearTimeout(_subFilterDebounce);
  _subFilterDebounce = setTimeout(() => {
    subPageNum = 1; persistSubFilter(); renderSubPage();
  }, 220);
}
function flushSubFilter(){
  clearTimeout(_subFilterDebounce);
  subPageNum = 1; persistSubFilter(); renderSubPage();
}

function changeTableColgroup(){
  return `<colgroup>
    <col style="width:44px;">
    <col style="width:150px;">
    <col style="width:150px;">
    <col style="width:200px;">
    <col style="width:400px;">
    <col style="width:90px;">
    <col style="width:150px;">
    <col style="width:240px;">
  </colgroup>`;
}
function changeTableHeader(){
  return `<thead><tr>
    <th></th>
    <th>Operation</th>
    <th>Subscribed Event</th>
    <th>Field</th>
    <th>Change</th>
    <th>Locale</th>
    <th>Update Time</th>
    <th>Action</th>
  </tr></thead>`;
}
function syncChangeTableScroll(scroller){
  const grid = scroller.closest('.changes-grid');
  if(!grid) return;
  const head = grid.querySelector('.changes-head-scroll');
  if(head) head.scrollLeft = scroller.scrollLeft;
}

function syncSubParentHeader(scroller){
  const card = scroller.closest('.overview-card');
  if(!card) return;
  const head = card.querySelector('.sub-table-head-wrap');
  if(head) head.scrollLeft = scroller.scrollLeft;
}

function renderOverviewRow(r){
  const expanded = EXPANDED.has(r.id);
  const checked = SUB_SELECTED.has(r.id);
  const sub = SUBS[r.id];
  const tierCls = (r.c.grade||'').toLowerCase().replace(/\s+/g,'');
  const head = `<tr class="ov-head ${expanded?'expanded':''}">
    <td><input type="checkbox" aria-label="Select campaign ${r.id}" ${checked?'checked':''} onclick="event.stopPropagation();" onchange="toggleSubSelect('${r.id}', this.checked)" /></td>
    <td><span class="ov-caret" role="button" tabindex="0" aria-label="${expanded?'Collapse':'Expand'}" onclick="toggleExpand('${r.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleExpand('${r.id}')}">${expanded?'▾':'▸'}</span></td>
    <td>${r.id}</td>
    <td><span class="link-name" onclick="openDetail(${r.id})">${escape(r.c.campaignName)}</span></td>
    <td>${escape(r.c.theme||'-')}</td>
    <td>${r.c.grade ? `<span class="badge-tier tier-${tierCls}">${r.c.grade}</span>` : '<span class="muted">-</span>'}</td>
    <td>${r.c.team}</td>
    <td><span class="badge-stage ${r.c.status}">${STATUS_LABEL[r.c.status]}</span></td>
    <td class="muted" style="font-size:12px;">${sub.subscribedAt||'-'}</td>
    <td>${r.unread ? `<span class="badge-new">${r.unread}</span>` : '<span class="muted">—</span>'}</td>
    <td class="ov-actions"><div class="ov-actions-inner">
      ${r.unread ? `<button class="btn btn-link btn-sm mark-read-btn" title="Mark all unread changes as read" onclick="markCampaignRead('${r.id}')">Mark read</button>` : `<button class="btn btn-link btn-sm mark-read-btn mark-unread-btn" title="Mark all changes as unread" onclick="markCampaignUnread('${r.id}')">Mark unread</button>`}
      <button class="btn btn-link btn-sm unsub" onclick="unsubFromList('${r.id}')">Unsubscribe</button>
    </div></td>
  </tr>`;
  if(!expanded) return head;
  const changesBody = r.list.length
    ? renderChangesSplitGrid(r.id, r.list)
    : `<div class="empty-mini">No changes in the selected time range.</div>`;
  const expandRow = `<tr class="ov-expand"><td class="ov-expand-cell" colspan="11"><div class="ov-expand-inner">${changesBody}</div></td></tr>`;
  return head + expandRow;
}


function syncSplitChangeScroll(scroller){
  const grid = scroller.closest('.changes-split-grid');
  if(!grid) return;
  const head = grid.querySelector('.chg-mid-head-scroll');
  if(head) head.scrollLeft = scroller.scrollLeft;
  const top = scroller.scrollTop;
  const leftBody = grid.querySelector('.chg-left-body');
  const rightBody = grid.querySelector('.chg-right-body');
  if(leftBody) leftBody.scrollTop = top;
  if(rightBody) rightBody.scrollTop = top;
}

function renderChangesSplitGrid(id, list){
  const leftRows = list.map(ch => renderChangeSplitLeftRow(id, ch)).join('');
  const midRows = list.map(ch => renderChangeSplitMiddleRow(id, ch)).join('');
  const rightRows = list.map(ch => renderChangeSplitActionRow(id, ch)).join('');
  return `<div class="changes-split-grid changes-split-grid-v30" role="region" aria-label="Change records for campaign ${id}">
    <div class="chg-head-row">
      <div class="chg-fixed-left chg-left-head">
        <div class="chg-cell chg-dot-cell"></div>
        <div class="chg-cell chg-op-cell">Operation</div>
      </div>
      <div class="chg-scroll-mid chg-mid-head-scroll">
        <div class="chg-mid-head">
          <div class="chg-cell chg-event-cell">Subscribed Event</div>
          <div class="chg-cell chg-field-cell">Field</div>
          <div class="chg-cell chg-change-cell">Change</div>
          <div class="chg-cell chg-locale-cell">Locale</div>
          <div class="chg-cell chg-time-cell">Update Time</div>
        </div>
      </div>
      <div class="chg-fixed-right chg-right-head">
        <div class="chg-cell chg-action-cell">Action</div>
      </div>
    </div>
    <div class="chg-body-outer-scroll">
      <div class="chg-body-row-grid">
        <div class="chg-fixed-left chg-left-body">${leftRows}</div>
        <div class="chg-scroll-mid chg-mid-body-scroll" onscroll="syncSplitChangeScroll(this)">${midRows}</div>
        <div class="chg-fixed-right chg-right-body">${rightRows}</div>
      </div>
    </div>
  </div>`;
}

function renderChangeSplitLeftRow(id, ch){
  const unread = isUnread(id, ch);
  return `<div class="chg-row ${unread?'ch-unread':''}">
    <div class="chg-cell chg-dot-cell">${unread?'<span class="ir-dot" style="background:#ff5722;display:inline-block;width:8px;height:8px;border-radius:50%;"></span>':''}</div>
    <div class="chg-cell chg-op-cell"><span class="op-pill op-${ch.op}">${OP_LABEL[ch.op]}</span></div>
  </div>`;
}

function renderChangeSplitMiddleRow(id, ch){
  const unread = isUnread(id, ch);
  let changeCell = '';
  if(ch.op === 'add'){
    changeCell = `<span class="diff-add">+ ${escape(ch.after)}</span>`;
  } else if(ch.op === 'remove'){
    changeCell = `<span class="diff-remove">− ${escape(ch.before)}</span>`;
  } else {
    changeCell = `<span class="diff-old">${escape(ch.before)}</span> <span class="diff-arrow">→</span> <span class="diff-new">${escape(ch.after)}</span>`;
  }
  const localeChip = ch.locale && ch.locale !== '-' ? `<span class="chip mini">${ch.locale}</span>` : '<span class="muted">-</span>';
  return `<div class="chg-row ${unread?'ch-unread':''}">
    <div class="chg-cell chg-event-cell" title="${escape(TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope))}">${escape(TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope))}</div>
    <div class="chg-cell chg-field-cell" title="${escape(ch.field)}">${escape(ch.field)}</div>
    <div class="chg-cell chg-change-cell">${changeCell}</div>
    <div class="chg-cell chg-locale-cell">${localeChip}</div>
    <div class="chg-cell chg-time-cell muted" style="font-size:12px;" title="${escape(ch.time)}">${ch.time}</div>
  </div>`;
}

function renderChangeSplitActionRow(id, ch){
  const unread = isUnread(id, ch);
  const k = changeKey(id, ch);
  const toggleBtn = unread
    ? `<button class="btn btn-link btn-sm" title="Mark as read" onclick="markChangeRead('${id}','${k}')">Mark read</button>`
    : `<button class="btn btn-link btn-sm mark-unread-btn" title="Mark as unread" onclick="markChangeUnread('${id}','${k}')">Mark unread</button>`;
  return `<div class="chg-row ${unread?'ch-unread':''}">
    <div class="chg-cell chg-action-cell ch-actions">
      <button class="btn btn-link btn-sm" onclick="jumpToChange('${id}','${ch.type}','${ch.locale||''}','${k}')">View Detail</button>
      ${toggleBtn}
    </div>
  </div>`;
}

function getSubscribedEventFromScope(scope){
  const s = String(scope || '');
  if(s.includes('Collection')) return 'Collection Basic Info';
  if(s.includes('Campaign')) return 'Campaign Basic Info';
  if(s.includes('Subsidy')) return 'Subsidy Info';
  if(s.includes('Coupon')) return 'Coupon Info';
  if(s.includes('Landing')) return 'Landing Page Info';
  if(s.includes('Promotion')) return 'Promotion Channel Info';
  if(s.includes('Supplementary')) return 'Supplementary Info';
  return s.split('/')[0].trim() || '-';
}

function renderChangeRow(id, ch){
  const unread = isUnread(id, ch);
  const k = changeKey(id, ch);
  let changeCell = '';
  if(ch.op === 'add'){
    changeCell = `<span class="diff-add">+ ${escape(ch.after)}</span>`;
  } else if(ch.op === 'remove'){
    changeCell = `<span class="diff-remove">− ${escape(ch.before)}</span>`;
  } else {
    changeCell = `<span class="diff-old">${escape(ch.before)}</span> <span class="diff-arrow">→</span> <span class="diff-new">${escape(ch.after)}</span>`;
  }
  const localeChip = ch.locale && ch.locale !== '-' ? `<span class="chip mini">${ch.locale}</span>` : '<span class="muted">-</span>';
  const toggleBtn = unread
    ? `<button class="btn btn-link btn-sm" title="Mark as read" onclick="markChangeRead('${id}','${k}')">Mark read</button>`
    : `<button class="btn btn-link btn-sm mark-unread-btn" title="Mark as unread" onclick="markChangeUnread('${id}','${k}')">Mark unread</button>`;
  return `<tr class="${unread?'ch-unread':''}">
    <td>${unread?'<span class="ir-dot" style="background:#ff5722;display:inline-block;width:8px;height:8px;border-radius:50%;"></span>':''}</td>
    <td><span class="op-pill op-${ch.op}">${OP_LABEL[ch.op]}</span></td>
    <td>${escape(TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope))}</td>
    <td>${escape(ch.field)}</td>
    <td>${changeCell}</td>
    <td>${localeChip}</td>
    <td class="muted" style="font-size:12px;">${ch.time}</td>
    <td><div class="ch-actions">
      <button class="btn btn-link btn-sm" onclick="jumpToChange('${id}','${ch.type}','${ch.locale||''}','${k}')">View Detail</button>
      ${toggleBtn}
    </div></td>
  </tr>`;
}

function markChangeUnread(id, key){
  UNREAD_OVERRIDE.add(key);
  READ.delete(key);
  renderSubPage();
}
function markChangeRead(id, key){
  UNREAD_OVERRIDE.delete(key);
  READ.add(key);
  renderSubPage();
}
function markCampaignUnread(id){
  (CHANGES[id] || []).forEach(ch => {
    if(!ch.isNew) return;
    const k = changeKey(id, ch);
    UNREAD_OVERRIDE.add(k);
    READ.delete(k);
  });
  renderSubPage();
  showToast('Marked unread');
}

function setSubFilter(k, v){ SUB_FILTER[k] = normalizeSubFilterChoice(v); if(['fTheme','fGrade','fStatus'].includes(k)) subOpenFilterKey = k; subPageNum = 1; persistSubFilter(); renderSubPage(); }
function toggleSubEvent(t){
  if(SUB_FILTER.events.has(t)) SUB_FILTER.events.delete(t);
  else SUB_FILTER.events.add(t);
  subPageNum = 1; persistSubFilter(); renderSubPage();
}
function selectAllSubRegions(){
  SUB_FILTER.regions.clear();
  subPageNum = 1; persistSubFilter(); renderSubPage();
}

function toggleSubRegion(r){
  // The All option represents an empty region filter. Once a specific value is selected, All is no longer selected.
  if(SUB_FILTER.regions.has(r)) SUB_FILTER.regions.delete(r);
  else SUB_FILTER.regions.add(r);
  subPageNum = 1; persistSubFilter(); renderSubPage();
}
function toggleRegionDropdown(e){
  if(e){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); }
  regionDropdownOpen = !regionDropdownOpen;
  renderSubPage();
  syncDropdownPointerShield(document.querySelector('#page-sub .filter .region-dropdown.open'));
}
function openSincePicker(e){
  if(e) e.stopPropagation();
  if(SUB_FILTER.sinceMode !== 'custom') SUB_FILTER.sinceMode = 'custom';
  if(!sincePickerOpen) setSincePickerViewFromValue();
  sincePickerOpen = !sincePickerOpen;
  subPageNum = 1;
  renderSubPage();
}
function shiftSincePickerMonth(delta){
  if(!sincePickerView) setSincePickerViewFromValue();
  const y = parseInt(sincePickerView.slice(0,4), 10);
  const m = parseInt(sincePickerView.slice(5,7), 10) - 1;
  const d = new Date(y, m + delta, 1);
  sincePickerView = `${d.getFullYear()}-${pad2(d.getMonth()+1)}`;
  sincePickerOpen = true;
  renderSubPage();
}
function setSinceCustomRaw(v){
  SUB_FILTER.sinceMode = 'custom';
  SUB_FILTER.sinceCustom = v;
}
function applySinceCustomInput(v){
  SUB_FILTER.sinceMode = 'custom';
  const normalized = normalizeSinceCustomInput(v);
  SUB_FILTER.sinceCustom = normalized || String(v || '').trim();
  sincePickerOpen = false;
  subPageNum = 1;
  persistSubFilter();
  renderSubPage();
}
function setSinceTimeOnly(v){
  const time = String(v || '').trim();
  const ok = time.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if(!ok) return;
  const p = parseSinceCustomParts(normalizeSinceCustomInput(SUB_FILTER.sinceCustom) || SUB_FILTER.sinceCustom);
  const base = p.year && p.month && p.day ? `${p.year}-${p.month}-${p.day}` : (() => {
    const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  })();
  SUB_FILTER.sinceMode = 'custom';
  SUB_FILTER.sinceCustom = `${base}T${ok[1]}:${ok[2]}:${ok[3] || '00'}`;
  const input = $('sinceCustomInput');
  if(input) input.value = formatSinceDisplay(SUB_FILTER.sinceCustom);
}
function selectSinceDate(dateStr){
  const p = parseSinceCustomParts(normalizeSinceCustomInput(SUB_FILTER.sinceCustom) || SUB_FILTER.sinceCustom);
  const time = p.hour ? `${p.hour}:${p.minute}:${p.second || '00'}` : '00:00:00';
  SUB_FILTER.sinceMode = 'custom';
  SUB_FILTER.sinceCustom = `${dateStr}T${time}`;
  sincePickerOpen = true;
  renderSubPage();
}
function setSinceNow(){
  const d = new Date();
  SUB_FILTER.sinceMode = 'custom';
  SUB_FILTER.sinceCustom = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  sincePickerOpen = false;
  subPageNum = 1;
  persistSubFilter();
  renderSubPage();
}
function setSinceMode(m){
  SUB_FILTER.sinceMode = m;
  if(m === 'custom' && !SUB_FILTER.sinceCustom){
    const d = new Date();
    SUB_FILTER.sinceCustom = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T00:00:00`;
  }
  sincePickerOpen = false;
  subPageNum = 1; persistSubFilter(); renderSubPage();
}
function setSinceCustom(v){
  SUB_FILTER.sinceCustom = normalizeSinceCustomInput(v) || v;
  if(v) SUB_FILTER.sinceMode = 'custom';
  sincePickerOpen = false;
  subPageNum = 1; persistSubFilter(); renderSubPage();
}
function resetSubFilter(){
  SUB_FILTER.fCol=''; SUB_FILTER.fColName='';
  SUB_FILTER.fCmp=''; SUB_FILTER.fName='';
  SUB_FILTER.fTheme=''; SUB_FILTER.fGrade=''; SUB_FILTER.fStatus='';
  SUB_FILTER.regions.clear();
  SUB_FILTER.events = new Set(ALL_EVENTS);
  SUB_FILTER.unreadOnly = false;
  SUB_FILTER.sinceMode = 'subscribedAt';
  SUB_FILTER.sinceCustom = '';
  sincePickerOpen = false;
  sincePickerView = null;
  subPageNum = 1;
  try{ localStorage.removeItem(SUB_FILTER_LS_KEY); }catch(e){}
  renderSubPage();
}
function goSubPage(n){ subPageNum = n; renderSubPage(); }
function changeSubPageSize(v){ subPageSize = parseInt(v,10); subPageNum = 1; renderSubPage(); }
function renderSubPaginationHtml(total, totalPages){
  const start = total === 0 ? 0 : (subPageNum - 1) * subPageSize + 1;
  const end = Math.min(subPageNum * subPageSize, total);
  const prevDisabled = subPageNum <= 1;
  const nextDisabled = subPageNum >= totalPages;
  const items = pageItems(subPageNum, totalPages);
  const itemsHtml = items.map(it => it === '…'
    ? `<span class="ellip">···</span>`
    : `<span class="pg ${it===subPageNum?'active':''}" onclick="goSubPage(${it})">${it}</span>`
  ).join('');
  return `
    <span class="total">${start}-${end} of ${total} items</span>
    <span class="pg ${prevDisabled?'disabled':''}" ${prevDisabled?'':'onclick="goSubPage('+(subPageNum-1)+')"'}>&lsaquo;</span>
    ${itemsHtml}
    <span class="pg ${nextDisabled?'disabled':''}" ${nextDisabled?'':'onclick="goSubPage('+(subPageNum+1)+')"'}>&rsaquo;</span>
    <select class="size-select" onchange="changeSubPageSize(this.value)">
      <option value="10" ${subPageSize===10?'selected':''}>10 / page</option>
      <option value="20" ${subPageSize===20?'selected':''}>20 / page</option>
      <option value="50" ${subPageSize===50?'selected':''}>50 / page</option>
    </select>
  `;
}
function toggleExpand(id){
  if(EXPANDED.has(id)) EXPANDED.delete(id);
  else EXPANDED.add(id);
  renderSubPage();
}
function markCampaignRead(id){
  changesForCampaign(id).forEach(ch => {
    if(isUnread(id, ch)){
      const k = changeKey(id, ch);
      READ.add(k);
      UNREAD_OVERRIDE.delete(k);
    }
  });
  renderSubPage();
  showToast('Marked as read');
}
function toggleSubSelect(id, checked){
  if(checked) SUB_SELECTED.add(id);
  else SUB_SELECTED.delete(id);
  renderSubPage();
}
function getSubRowIds(){
  return Object.keys(SUBS).map(id => {
    const c = CAMPAIGNS.find(x => String(x.campaignId) === id);
    if(!c || !passCampaignFilter(c)) return null;
    const list = changesForCampaign(id);
    const unread = list.filter(ch => isUnread(id, ch)).length;
    if(SUB_FILTER.unreadOnly && unread === 0) return null;
    return id;
  }).filter(Boolean);
}
function toggleSubSelectAll(checked){
  const ids = getSubRowIds();
  const start = (subPageNum - 1) * subPageSize;
  const pageIds = ids.slice(start, start + subPageSize);
  if(checked) pageIds.forEach(id => SUB_SELECTED.add(id));
  else pageIds.forEach(id => SUB_SELECTED.delete(id));
  renderSubPage();
}
function batchUnsubscribeFromSub(){
  const visibleIds = new Set(getSubRowIds().map(campaignKey));
  const targets = [...SUB_SELECTED].map(campaignKey).filter(id => visibleIds.has(id));
  if(!targets.length) return;
  const removed = unsubscribeCampaignIds(targets);
  syncSubscriptionViews();
  showToast(`Unsubscribed ${removed.length} campaign(s)`);
}
function markAllRead(){
  getSubRowIds().forEach(id => {
    changesForCampaign(id).forEach(ch => {
      if(isUnread(id, ch)){
        const k = changeKey(id, ch);
        READ.add(k);
        UNREAD_OVERRIDE.delete(k);
      }
    });
  });
  renderSubPage();
  showToast('All updates marked as read');
}
function jumpToChange(id, type, locale, key){
  READ.add(key);
  UNREAD_OVERRIDE.delete(key);
  const tab = TYPE_TO_TAB[type] || 'campaign';
  openDetail(Number(id), { tab, locale: locale || null });
}
function unsubFromList(id){
  const removed = unsubscribeCampaignIds([id]);
  syncSubscriptionViews();
  showToast(removed.length ? 'Unsubscribed' : 'This campaign is not subscribed');
}

document.addEventListener('click', (e) => {
  if(listRegionDropdownOpen && !e.target.closest('.list-region-dropdown')){
    listRegionDropdownOpen = false;
    renderListRegionFilter();
  }
  if(regionDropdownOpen && !e.target.closest('.region-dropdown')){
    regionDropdownOpen = false;
    if(document.getElementById('page-sub').classList.contains('active')) renderSubPage();
  }
  syncDropdownPointerShield();
});

/* ========================= Daily Report (new first-level page, additive) ========================= */
const DIGEST_GROUP_EXPANDED = new Set();
const DIGEST_PREVIEW_COUNT = 3;
const DIGEST_WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DIGEST_STATUS_CARDS = [
  { key:'',         label:'All Campaigns', cls:'all',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
  { key:'live',     label:'Live', cls:'live',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="10,8.5 16,12 10,15.5" fill="currentColor" stroke="none"/></svg>' },
  { key:'upcoming', label:'Upcoming', cls:'upcoming',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>' }
];

function digestDateStr(){
  let max = 0;
  Object.keys(CHANGES).forEach(id => (CHANGES[id] || []).forEach(ch => {
    const t = parseTime(ch.time); if(t > max) max = t;
  }));
  const d = max ? new Date(max) : new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function digestDateLabel(){
  const day = digestDateStr();
  const d = new Date(day.replace(/-/g, '/'));
  return `${DIGEST_WEEKDAYS[d.getDay()]}, ${EN_MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* Changes visible to the current user's subscription of a campaign (independent of My Subscriptions page filters) */
function digestSubscribedChanges(id){
  const sub = SUBS[id]; if(!sub) return [];
  const sinceMs = parseTime(sub.subscribedAt || '1970-01-01 00:00');
  const evs = Array.isArray(sub.events) ? sub.events : ALL_EVENTS;
  return (CHANGES[id] || []).filter(ch => evs.includes(ch.type) && parseTime(ch.time) >= sinceMs);
}
function digestUnreadTotal(){
  let n = 0;
  Object.keys(SUBS).forEach(id => { n += digestSubscribedChanges(id).filter(ch => isUnread(id, ch)).length; });
  return n;
}
function digestHighlights(){
  const day = digestDateStr();
  const groups = [];
  Object.keys(CHANGES).forEach(id => {
    const c = getCampaignById(id); if(!c) return;
    const list = (CHANGES[id] || [])
      .filter(ch => String(ch.time).slice(0, 10) === day)
      .sort((a, b) => parseTime(b.time) - parseTime(a.time));
    if(!list.length) return;
    const subscribed = !!SUBS[id];
    const unread = subscribed ? list.filter(ch => isUnread(id, ch)).length : 0;
    groups.push({ id:String(id), c, list, unread, subscribed, latest:parseTime(list[0].time) });
  });
  const statusPriority = { live:0, upcoming:1, draft:2, ended:3 };
  groups.sort((a, b) => {
    const pa = statusPriority[a.c.status] ?? 9;
    const pb = statusPriority[b.c.status] ?? 9;
    return (pa - pb) || (b.unread - a.unread) || (b.latest - a.latest);
  });
  return { day, groups };
}
function digestStatusCounts(){
  const counts = { '':CAMPAIGNS.length, live:0, upcoming:0, ended:0, draft:0 };
  CAMPAIGNS.forEach(c => { if(counts[c.status] != null) counts[c.status]++; });
  return counts;
}
function digestRegionCounts(){
  const counts = {};
  LIST_REGION_OPTIONS.forEach(r => counts[r] = 0);
  CAMPAIGNS.forEach(c => getCampaignRegions(c).forEach(r => { if(counts[r] != null) counts[r]++; }));
  return counts;
}

/* ---- Linkage into the Campaign List page: reset its filters, apply the requested ones, then switch ---- */
function digestSetFilterSelect(id, value){
  const sel = $(id); if(!sel) return;
  const opts = Array.from(sel.options);
  if(value === '' || value == null){
    opts.forEach(o => o.selected = (o.value === ''));
    if(!sel.multiple) sel.value = '';
  } else {
    opts.forEach(o => o.selected = (o.value === value));
    if(!sel.multiple) sel.value = value;
  }
  if(typeof refreshCustomSelect === 'function' && sel._customSelect) refreshCustomSelect(sel);
}
function digestOpenList(opts){
  opts = opts || {};
  ['fCol','fColName','fCmp','fName'].forEach(id => { const el = $(id); if(el) el.value = ''; });
  ['fTheme','fGrade','fStatus','fSubStatus','fNoti'].forEach(id => digestSetFilterSelect(id, ''));
  LIST_REGION_FILTER.clear();
  listRegionDropdownOpen = false;
  if(opts.status) digestSetFilterSelect('fStatus', opts.status);
  if(opts.subStatus) digestSetFilterSelect('fSubStatus', opts.subStatus);
  if(opts.region) LIST_REGION_FILTER.add(opts.region);
  if(opts.campaignId != null){ const el = $('fCmp'); if(el) el.value = String(opts.campaignId); }
  pageNum = 1;
  renderTable();
  switchPage('list');
  const main = document.querySelector('.main'); if(main) main.scrollTop = 0;
  if(opts.toast) showToast(opts.toast);
}
function digestJump(id, type, locale, key){
  jumpToChange(id, type, locale, key);
  refreshDigestBadge();
}
function toggleDigestGroup(id){
  if(DIGEST_GROUP_EXPANDED.has(id)) DIGEST_GROUP_EXPANDED.delete(id);
  else DIGEST_GROUP_EXPANDED.add(id);
  renderDigest();
}
function digestTodayUnread(){
  return digestHighlights().groups.reduce((s, g) => s + g.unread, 0);
}
function refreshDigestBadge(){
  const b = $('digestBadge'); if(!b) return;
  const n = digestTodayUnread();
  if(n){ b.style.display = ''; b.textContent = n > 99 ? '99+' : n; }
  else b.style.display = 'none';
}

/* ---- Rendering ---- */
function digestRenderChange(id, ch){
  const unread = !!SUBS[id] && isUnread(id, ch);
  let diff;
  if(ch.op === 'add') diff = `<span class="diff-add">+ ${escape(ch.after)}</span>`;
  else if(ch.op === 'remove') diff = `<span class="diff-remove">− ${escape(ch.before)}</span>`;
  else diff = `<span class="diff-old">${escape(ch.before)}</span> <span class="diff-arrow">→</span> <span class="diff-new">${escape(ch.after)}</span>`;
  const k = changeKey(id, ch);
  const t = String(ch.time).slice(11, 16);
  const evt = TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope);
  return `<div class="dg-change ${unread ? 'is-unread' : ''}" role="button" tabindex="0"
      onclick="digestJump('${id}','${ch.type}','${ch.locale || ''}','${k}')"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();digestJump('${id}','${ch.type}','${ch.locale || ''}','${k}')}"
      title="Open ${escape(evt)} in campaign detail">
    <span class="dg-dot" aria-hidden="true"></span>
    <span class="op-pill op-${ch.op}">${OP_LABEL[ch.op]}</span>
    <span class="dg-field" title="${escape(ch.scope)} · ${escape(ch.field)}">${escape(ch.field)}</span>
    <span class="dg-diff">${diff}</span>
    <span class="dg-time">${t}</span>
    <span class="dg-go" aria-hidden="true">→</span>
  </div>`;
}
function digestRenderGroup(g){
  const expanded = DIGEST_GROUP_EXPANDED.has(g.id);
  const shown = expanded ? g.list : g.list.slice(0, DIGEST_PREVIEW_COUNT);
  const more = g.list.length - DIGEST_PREVIEW_COUNT;
  const regions = getCampaignRegions(g.c).join(', ');
  return `<article class="dg-group ${g.unread ? 'has-unread' : ''}">
    <header class="dg-group-head">
      <div class="dg-group-title">
        <span class="link-name" role="button" tabindex="0" onclick="openDetail(${Number(g.id)})" onkeydown="if(event.key==='Enter'){openDetail(${Number(g.id)})}" title="Open campaign detail">${escape(g.c.campaignName)}</span>
        <span class="badge-stage ${g.c.status}">${STATUS_LABEL[g.c.status]}</span>
        <span class="chip mini">${escape(regions)}</span>

      </div>
      <div class="dg-group-meta">
        <span class="dg-count">${g.list.length} update${g.list.length > 1 ? 's' : ''}</span>
        ${g.unread ? `<span class="badge-new">${g.unread} unread</span>` : ''}
      </div>
    </header>
    <div class="dg-changes">${shown.map(ch => digestRenderChange(g.id, ch)).join('')}</div>
    ${more > 0 ? `<button class="dg-more" onclick="toggleDigestGroup('${g.id}')">${expanded ? 'Show less' : `Show all ${g.list.length} updates`}</button>` : ''}
  </article>`;
}
function mapTopText(map, limit){
  const arr = Object.entries(map || {}).filter(([,v]) => v > 0).sort((a,b) => b[1] - a[1]);
  if(!arr.length) return '暂无集中项';
  return arr.slice(0, limit || 3).map(([k,v]) => `${k} ${v} 条`).join('、');
}
function buildDigestAISummary(groups, totalChanges, unreadToday){
  if(!groups.length){
    return '今天暂未发现新的活动变动信息，活动整体保持稳定。可以继续关注 Live 和 Upcoming 活动，确认后续是否有补贴、券、落地页或推广素材更新。';
  }
  const eventMap = {}, opMap = {}, regionMap = {}, statusMap = {};
  groups.forEach(g => {
    getCampaignRegions(g.c).forEach(r => { regionMap[r] = (regionMap[r] || 0) + g.list.length; });
    statusMap[STATUS_LABEL[g.c.status] || g.c.status] = (statusMap[STATUS_LABEL[g.c.status] || g.c.status] || 0) + 1;
    g.list.forEach(ch => {
      const eventName = TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope);
      eventMap[eventName] = (eventMap[eventName] || 0) + 1;
      opMap[OP_LABEL[ch.op] || ch.op] = (opMap[OP_LABEL[ch.op] || ch.op] || 0) + 1;
    });
  });
  const focusCampaigns = groups.slice(0, 3).map(g => `${g.c.campaignName}（${g.list.length} 条${g.unread ? `，${g.unread} 条未读` : ''}）`).join('、');
  const unreadText = unreadToday ? `其中 ${unreadToday} 条仍未读，建议优先处理` : '当前没有未读变动，可作为当天变更回顾';
  return `今天共有 ${totalChanges} 条活动变动，涉及 ${groups.length} 个活动。变动主要集中在 ${mapTopText(eventMap, 3)}，操作类型以 ${mapTopText(opMap, 3)} 为主；受影响市场包括 ${mapTopText(regionMap, 4)}，活动状态分布为 ${mapTopText(statusMap, 4)}。${unreadText}，重点关注 ${focusCampaigns}。`;
}

function renderDigest(){
  const box = $('digestBody'); if(!box) return;
  const { groups } = digestHighlights();
  const totalChanges = groups.reduce((s, g) => s + g.list.length, 0);
  const unreadToday = groups.reduce((s, g) => s + g.unread, 0);
  const counts = digestStatusCounts();
  const regionCounts = digestRegionCounts();
  const regionMax = Math.max(1, ...Object.values(regionCounts));
  const subCount = Object.keys(SUBS).length;
  const unreadAll = digestUnreadTotal();

  const hero = `<div class="page-card dg-hero">
    <div class="dg-hero-main">
      <div>
        <h2>Campaign Notification Daily Report</h2>
        <div class="dg-date">${digestDateLabel()}</div>
      </div>
    </div>
    <div class="dg-hero-summary">
      <b>${totalChanges}</b> update${totalChanges === 1 ? '' : 's'} across <b>${groups.length}</b> campaign${groups.length === 1 ? '' : 's'} today
      ${unreadToday ? ` · <span class="dg-unread-inline">${unreadToday} unread</span>` : ' · all caught up'}
    </div>
  </div>`;

  const kpis = `<div class="dg-kpis">${DIGEST_STATUS_CARDS.map(card => {
    const n = counts[card.key] || 0;
    const arg = card.key ? `{status:'${card.key}', toast:'Campaign list filtered: ${card.label}'}` : `{toast:'Showing all campaigns'}`;
    return `<button class="dg-kpi kpi-${card.cls}" onclick="digestOpenList(${arg})" title="Open the campaign list${card.key ? ` filtered to ${card.label}` : ''}">
      <span class="dg-kpi-icon" aria-hidden="true">${card.icon}</span>
      <span class="dg-kpi-num">${n}</span>
      <span class="dg-kpi-label">${card.label}</span>
      <span class="dg-kpi-go">View in list →</span>
    </button>`;
  }).join('')}</div>`;

  const highlightsBody = groups.length
    ? groups.map(g => digestRenderGroup(g)).join('')
    : `<div class="dg-empty">
        <div class="dg-empty-art" aria-hidden="true">✓</div>
        <div class="dg-empty-title">No updates today</div>
        <div class="dg-empty-text">All campaigns are steady. Browse the full list to explore details.</div>
        <button class="btn btn-primary" onclick="digestOpenList({})">Open Campaign List</button>
      </div>`;

  const aiSummary = `<div class="page-card dg-card dg-ai-summary">
    <div class="dg-card-head"><h3>AI Summary</h3><span class="dg-card-sub">Generated from today’s changes</span></div>
    <p>${escape(buildDigestAISummary(groups, totalChanges, unreadToday))}</p>
  </div>`;

  const highlights = `<div class="page-card dg-card dg-highlights">
    <div class="dg-card-head">
      <h3>Change Record</h3>
      <span class="dg-card-sub">${groups.length ? 'Newest and unread first' : ''}</span>
    </div>
    ${highlightsBody}
  </div>`;

  const regionRows = LIST_REGION_OPTIONS.map(r => {
    const n = regionCounts[r] || 0;
    return `<button class="dg-region-row" onclick="digestOpenList({region:'${r}', toast:'Campaign list filtered: ${r}'})" title="Open the campaign list filtered to ${r}">
      <span class="dg-region-name">${r}</span>
      <span class="dg-region-bar"><span class="dg-region-fill" style="width:${Math.round(n / regionMax * 100)}%;"></span></span>
      <span class="dg-region-num">${n}</span>
    </button>`;
  }).join('');

  const rail = `<div class="dg-rail dg-rail-top">
    <div class="page-card dg-card dg-region-summary">
      <div class="dg-card-head"><h3>By Region</h3><span class="dg-card-sub">Campaigns</span></div>
      <div class="dg-region-list">${regionRows}</div>
    </div>
  </div>`;

  box.innerHTML = `${hero}<div class="dg-summary-row">${kpis}${rail}</div>${aiSummary}${highlights}`;
  refreshDigestBadge();
}



/* ========================= Campaign-only merged page overrides =========================
   The main Campaign page now owns the change-record expansion behavior. Subscription,
   notification filters, read/unread and My Subscriptions actions are intentionally unused.
===================================================================================== */
currentNonDetailPage = 'digest';
const CAMPAIGN_EXPANDED = new Set();
function refreshSubBadge(){}
function refreshDigestBadge(){}
function applyAutoSubscribe(){}

function campaignChangeList(id){
  const key = String(id);
  const c = getCampaignById(key);
  let list = (CHANGES[key] || CHANGES[Number(key)] || []).slice();
  if(!list.length && c && typeof buildGenericDemoChanges === 'function'){
    const idx = CAMPAIGNS.findIndex(x => String(x.campaignId) === key);
    list = buildGenericDemoChanges(c, idx < 0 ? 0 : idx);
    CHANGES[key] = list;
  }
  return list.sort((a,b) => parseTime(b.time) - parseTime(a.time));
}

function campaignChangeEventName(ch){
  return TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope) || ch.scope || '-';
}

function campaignChangeDiffHtml(ch){
  if(ch.op === 'add') return `<span class="diff-add">+ ${escape(ch.after || '')}</span>`;
  if(ch.op === 'remove') return `<span class="diff-remove">− ${escape(ch.before || '')}</span>`;
  return `<span class="diff-old">${escape(ch.before || '')}</span> <span class="diff-arrow">→</span> <span class="diff-new">${escape(ch.after || '')}</span>`;
}

function renderCampaignChangePanel(id){
  const list = campaignChangeList(id);
  if(!list.length){
    return `<div class="campaign-change-panel"><div class="campaign-no-change">No change records for this campaign.</div></div>`;
  }
  return `<div class="campaign-change-panel">
    <div class="campaign-change-title">Change Records <span class="campaign-change-count">${list.length} update${list.length > 1 ? 's' : ''}</span></div>
    <div class="campaign-changes-scroll">
      <table class="campaign-changes-table">
        <thead><tr>
          <th>Operation</th>
          <th>Change Section</th>
          <th>Field</th>
          <th>Change</th>
          <th>Locale</th>
          <th>Update Time</th>
        </tr></thead>
        <tbody>${list.map(ch => `<tr>
          <td><span class="op-pill op-${ch.op}">${OP_LABEL[ch.op] || ch.op || '-'}</span></td>
          <td title="${escape(campaignChangeEventName(ch))}">${escape(campaignChangeEventName(ch))}</td>
          <td title="${escape(ch.field || '-')}">${escape(ch.field || '-')}</td>
          <td>${campaignChangeDiffHtml(ch)}</td>
          <td>${ch.locale && ch.locale !== '-' ? `<span class="chip mini">${escape(ch.locale)}</span>` : '<span class="muted">-</span>'}</td>
          <td class="muted" title="${escape(ch.time || '-')}">${escape(ch.time || '-')}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
  </div>`;
}

function toggleCampaignExpand(id){
  const key = String(id);
  if(CAMPAIGN_EXPANDED.has(key)) CAMPAIGN_EXPANDED.delete(key);
  else CAMPAIGN_EXPANDED.add(key);
  renderTable();
}

function getFilteredCampaignRows(){
  const fCol = $('fCol') ? $('fCol').value.trim().toLowerCase() : '';
  const fColName = $('fColName') ? $('fColName').value.trim().toLowerCase() : '';
  const fCmp = $('fCmp') ? $('fCmp').value.trim().toLowerCase() : '';
  const fName = $('fName') ? $('fName').value.trim().toLowerCase() : '';
  const fTheme = getSelectValues('fTheme');
  const fGrade = getSelectValues('fGrade');
  const fStatus = getSelectValues('fStatus');
  return CAMPAIGNS.filter(r => {
    if(fCol && !String(r.collectionId).toLowerCase().includes(fCol)) return false;
    if(fColName && !String(r.collectionName || '').toLowerCase().includes(fColName)) return false;
    if(fCmp && !String(r.campaignId).toLowerCase().includes(fCmp)) return false;
    if(fName && !r.campaignName.toLowerCase().includes(fName)) return false;
    if(fTheme.length && !fTheme.includes(r.theme)) return false;
    if(fGrade.length && !fGrade.includes(r.grade)) return false;
    if(!passListRegionFilter(r)) return false;
    if(fStatus.length && !fStatus.includes(r.status)) return false;
    return true;
  });
}

function renderTable(){
  renderListRegionFilter();
  const all = getFilteredCampaignRows();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if(pageNum > totalPages) pageNum = totalPages;
  if(pageNum < 1) pageNum = 1;
  const start = (pageNum - 1) * pageSize;
  const rows = all.slice(start, start + pageSize);
  const tbody = $('tbody');
  if(!tbody) return;
  tbody.innerHTML = rows.map(r => {
    const expanded = CAMPAIGN_EXPANDED.has(String(r.campaignId));
    const parent = `<tr class="campaign-parent-row ${expanded ? 'expanded' : ''}">
      <td class="sticky s-chk"><button class="campaign-expand-btn" aria-label="${expanded ? 'Collapse' : 'Expand'} campaign ${r.campaignId}" onclick="toggleCampaignExpand(${r.campaignId})">${expanded ? '▾' : '▸'}</button></td>
      <td class="id-cell sticky s-l1">${r.collectionId}</td>
      <td class="id-cell sticky s-l2">${r.campaignId}</td>
      <td class="sticky s-l3">${escape(r.collectionName)}</td>
      <td class="link-name sticky s-l4" onclick="openDetail(${r.campaignId})">${escape(r.campaignName)}</td>
      <td>${escape(r.theme)}</td>
      <td class="grade">${r.grade}</td>
      <td>${escape(getCampaignRegions(r).join(', '))}</td>
      <td><span class="badge-stage ${r.status}">${STATUS_LABEL[r.status]}</span></td>
      <td>${r.createTime}</td>
      <td>${r.updateTime}</td>
      <td>${r.creator}</td>
    </tr>`;
    return expanded ? parent + `<tr class="campaign-change-row"><td colspan="12">${renderCampaignChangePanel(r.campaignId)}</td></tr>` : parent;
  }).join('');
  const empty = $('emptyHint');
  if(empty) empty.style.display = rows.length ? 'none' : 'block';
  renderPagination(total, totalPages);
  enhanceCustomSelects(document);
  refreshTableOverflowTooltips($('page-list'));
}

function currentPageRows(){
  const all = getFilteredCampaignRows();
  const start = (pageNum - 1) * pageSize;
  return all.slice(start, start + pageSize);
}

function resetFilter(){
  ['fCol','fColName','fCmp','fName'].forEach(id => { if($(id)) $(id).value = ''; });
  ['fTheme','fGrade','fStatus'].forEach(id => clearFilterSelect(id));
  LIST_REGION_FILTER.clear();
  listRegionDropdownOpen = false;
  pageNum = 1;
  renderTable();
}

function switchPage(name){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = $('page-' + name) || $('page-digest') || $('page-list');
  if(target) target.classList.add('active');
  document.querySelectorAll('.side a[data-page]').forEach(a => a.classList.toggle('active', a.dataset.page === name));
  if(name === 'digest' && typeof renderDigest === 'function') renderDigest();
  if(name === 'list' && typeof renderTable === 'function') renderTable();
  if(name === 'list' || name === 'digest') currentNonDetailPage = name;
  enhanceCustomSelects(document);
}

function toggleSub(){}
function toggleSubFromDetail(){}
function openSubscribe(){}
function openBatchSubscribe(){}
function batchUnsubscribe(){}
function confirmSubscribe(){}
function closeSubscribe(){}
function batchUnsubscribeFromSub(){}
function unsubFromList(){}
function markCampaignRead(){}
function markCampaignUnread(){}
function markAllRead(){}
function markChangeRead(){}
function markChangeUnread(){}
function jumpToChange(id, type, locale, key){ openDetail(Number(id), { tab: TYPE_TO_TAB[type] || 'campaign', locale: locale || null }); }

/* Keep the digest nav badge fresh after read/subscription changes elsewhere (additive wrappers, same pattern as v55 below) */
const __renderSubPage_digestHook = renderSubPage;
renderSubPage = function(){ __renderSubPage_digestHook.apply(this, arguments); refreshDigestBadge(); };
const __renderTable_digestHook = renderTable;
renderTable = function(){ __renderTable_digestHook.apply(this, arguments); refreshDigestBadge(); };

applyAutoSubscribe();
seedDemoSubscriptions();
renderTable();
renderDigest();

/* v32: My Subscription child sticky header helper — scoped to #page-sub only */
function updateSubStickyHeaders(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')) return;
  const main = document.querySelector('.main');
  if(!main) return;
  const mainRect = main.getBoundingClientRect();
  const parentHead = page.querySelector('.sub-table-head-wrap');
  const parentHeight = parentHead ? Math.round(parentHead.getBoundingClientRect().height || 40) : 40;
  const stickyTop = Math.round(mainRect.top + parentHeight);
  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    const head = grid.querySelector('.chg-head-row');
    if(!head) return;
    const rect = grid.getBoundingClientRect();
    const headHeight = Math.round(head.getBoundingClientRect().height || 36);
    const shouldStick = rect.top < stickyTop && rect.bottom > stickyTop + headHeight + 20;
    if(shouldStick){
      grid.classList.add('child-head-fixed');
      head.classList.add('child-fixed');
      head.style.setProperty('--child-head-left', `${Math.round(rect.left)}px`);
      head.style.setProperty('--child-head-top', `${stickyTop}px`);
      head.style.setProperty('--child-head-width', `${Math.round(rect.width)}px`);
    } else {
      grid.classList.remove('child-head-fixed');
      head.classList.remove('child-fixed');
      head.style.removeProperty('--child-head-left');
      head.style.removeProperty('--child-head-top');
      head.style.removeProperty('--child-head-width');
    }
  });
}
(function bindSubStickyHeaders(){
  const bind = () => {
    const main = document.querySelector('.main');
    if(main && !main.dataset.subStickyBound){
      main.addEventListener('scroll', updateSubStickyHeaders, {passive:true});
      main.dataset.subStickyBound = '1';
    }
  };
  bind();
  window.addEventListener('resize', updateSubStickyHeaders, {passive:true});
  document.addEventListener('DOMContentLoaded', bind);
})();


/* v33: My Subscriptions only — compute child sticky header below the real parent sticky header */
function updateSubStickyHeaders(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')) return;
  const main = document.querySelector('.main');
  if(!main) return;
  const mainRect = main.getBoundingClientRect();
  const parentHead = page.querySelector('.sub-table-head-wrap');
  const parentRect = parentHead ? parentHead.getBoundingClientRect() : null;
  const parentHeight = parentRect ? Math.round(parentRect.height || 40) : 40;
  const parentStickyTop = Math.round(mainRect.top);
  const childStickyTop = parentRect
    ? Math.max(Math.round(parentRect.bottom), parentStickyTop + parentHeight)
    : parentStickyTop + parentHeight;

  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    const head = grid.querySelector('.chg-head-row');
    if(!head) return;
    const rect = grid.getBoundingClientRect();
    const headHeight = Math.round(head.getBoundingClientRect().height || 36);
    const shouldStick = rect.top < childStickyTop && rect.bottom > childStickyTop + headHeight + 20;
    if(shouldStick){
      grid.classList.add('child-head-fixed');
      head.classList.add('child-fixed');
      head.style.setProperty('--child-head-left', `${Math.round(rect.left)}px`);
      head.style.setProperty('--child-head-top', `${childStickyTop}px`);
      head.style.setProperty('--child-head-width', `${Math.round(rect.width)}px`);
    } else {
      grid.classList.remove('child-head-fixed');
      head.classList.remove('child-fixed');
      head.style.removeProperty('--child-head-left');
      head.style.removeProperty('--child-head-top');
      head.style.removeProperty('--child-head-width');
    }
  });
}


/* v34: My Subscriptions only — keep current parent row sticky together with child header */
function getSubParentColgroupHtml(){
  return `<colgroup>
    <col style="width:44px;">
    <col style="width:44px;">
    <col style="width:90px;">
    <col style="width:360px;">
    <col style="width:160px;">
    <col style="width:80px;">
    <col style="width:120px;">
    <col style="width:120px;">
    <col style="width:140px;">
    <col style="width:76px;">
    <col style="width:240px;">
  </colgroup>`;
}
function ensureSubParentStickyClone(){
  const page = document.getElementById('page-sub');
  if(!page) return null;
  let clone = page.querySelector('.sub-parent-row-sticky-clone');
  if(!clone){
    clone = document.createElement('div');
    clone.className = 'sub-parent-row-sticky-clone';
    clone.innerHTML = `<div class="sub-parent-row-clone-scroll"><table class="sub-table sub-table-body"><tbody></tbody></table></div>`;
    page.appendChild(clone);
  }
  return clone;
}
function hideSubParentStickyClone(){
  const page = document.getElementById('page-sub');
  const clone = page && page.querySelector('.sub-parent-row-sticky-clone');
  if(clone){
    clone.classList.remove('show');
    clone.removeAttribute('data-row-id');
  }
}
function updateSubParentStickyClone(row, top, left, width, scrollLeft){
  const clone = ensureSubParentStickyClone();
  if(!clone || !row) return;
  const rowId = row.querySelector('td:nth-child(3)')?.textContent?.trim() || '';
  const table = clone.querySelector('table');
  const tbody = clone.querySelector('tbody');
  if(clone.getAttribute('data-row-id') !== rowId){
    table.innerHTML = getSubParentColgroupHtml() + `<tbody>${row.outerHTML}</tbody>`;
    const clonedRow = table.querySelector('tr.ov-head');
    if(clonedRow){
      clonedRow.classList.add('expanded');
      clonedRow.removeAttribute('id');
      clonedRow.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    }
    clone.setAttribute('data-row-id', rowId);
  }
  clone.style.setProperty('--sub-parent-clone-left', `${Math.round(left)}px`);
  clone.style.setProperty('--sub-parent-clone-top', `${Math.round(top)}px`);
  clone.style.setProperty('--sub-parent-clone-width', `${Math.round(width)}px`);
  clone.classList.add('show');
  const scroller = clone.querySelector('.sub-parent-row-clone-scroll');
  if(scroller) scroller.scrollLeft = scrollLeft || 0;
}
function syncSubParentHeader(scroller){
  const card = scroller.closest('.overview-card');
  if(!card) return;
  const head = card.querySelector('.sub-table-head-wrap');
  if(head) head.scrollLeft = scroller.scrollLeft;
  const cloneScroller = document.querySelector('#page-sub .sub-parent-row-sticky-clone.show .sub-parent-row-clone-scroll');
  if(cloneScroller) cloneScroller.scrollLeft = scroller.scrollLeft;
}
function updateSubStickyHeaders(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')){
    hideSubParentStickyClone();
    return;
  }
  const main = document.querySelector('.main');
  if(!main) return;
  const parentHead = page.querySelector('.sub-table-head-wrap');
  const parentRect = parentHead ? parentHead.getBoundingClientRect() : null;
  const parentHeight = parentRect ? Math.round(parentRect.height || 40) : 40;
  const baseTop = parentRect ? Math.round(parentRect.bottom) : Math.round(main.getBoundingClientRect().top + parentHeight);
  let active = null;
  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    const head = grid.querySelector('.chg-head-row');
    const expandRow = grid.closest('tr.ov-expand');
    const parentRow = expandRow ? expandRow.previousElementSibling : null;
    if(!head || !parentRow) return;
    const rect = grid.getBoundingClientRect();
    const headHeight = Math.round(head.getBoundingClientRect().height || 36);
    const rowHeight = Math.round(parentRow.getBoundingClientRect().height || 44);
    const threshold = baseTop + rowHeight;
    const shouldStick = rect.top < threshold && rect.bottom > threshold + headHeight + 20;
    if(shouldStick){
      const score = Math.abs(rect.top - threshold);
      if(!active || score < active.score) active = {grid, head, parentRow, rect, rowHeight, headHeight, score};
    }
  });
  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    const head = grid.querySelector('.chg-head-row');
    if(grid !== (active && active.grid)){
      grid.classList.remove('child-head-fixed');
      if(head){
        head.classList.remove('child-fixed');
        head.style.removeProperty('--child-head-left');
        head.style.removeProperty('--child-head-top');
        head.style.removeProperty('--child-head-width');
      }
    }
  });
  if(!active){
    hideSubParentStickyClone();
    return;
  }
  const card = active.grid.closest('.overview-card');
  const wrap = card ? card.querySelector('.sub-table-wrap') : null;
  const wrapRect = wrap ? wrap.getBoundingClientRect() : active.rect;
  const scrollLeft = wrap ? wrap.scrollLeft : 0;
  updateSubParentStickyClone(active.parentRow, baseTop, wrapRect.left, wrapRect.width, scrollLeft);
  active.grid.classList.add('child-head-fixed');
  active.head.classList.add('child-fixed');
  active.head.style.setProperty('--child-head-left', `${Math.round(active.rect.left)}px`);
  active.head.style.setProperty('--child-head-top', `${baseTop + active.rowHeight}px`);
  active.head.style.setProperty('--child-head-width', `${Math.round(active.rect.width)}px`);
}





/* v36: My Subscriptions only — keep expanded child list exactly as wide as the visible parent list viewport */
function syncSubExpandWidths(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')) return;
  const wrap = page.querySelector('.sub-table-wrap');
  if(!wrap) return;
  const width = Math.max(320, Math.floor(wrap.clientWidth || wrap.getBoundingClientRect().width || 0));
  page.querySelectorAll('.ov-expand-inner').forEach(inner => {
    inner.style.setProperty('--sub-expand-width', `${width}px`);
  });
}

/* v35: My Subscriptions only — keep parent header, active parent row, and child header as one sticky stack */
function getSubParentColgroupHtml(){
  return `<colgroup>
    <col style="width:44px;">
    <col style="width:44px;">
    <col style="width:90px;">
    <col style="width:360px;">
    <col style="width:160px;">
    <col style="width:80px;">
    <col style="width:120px;">
    <col style="width:120px;">
    <col style="width:140px;">
    <col style="width:76px;">
    <col style="width:240px;">
  </colgroup>`;
}

function syncSubParentHeader(scroller){
  const card = scroller && scroller.closest ? scroller.closest('.overview-card') : null;
  if(!card) return;
  const scrollLeft = scroller.scrollLeft || 0;
  const head = card.querySelector('.sub-table-head-wrap');
  if(head && head.scrollLeft !== scrollLeft) head.scrollLeft = scrollLeft;
  const cloneScroller = document.querySelector('#page-sub .sub-parent-row-sticky-clone.show .sub-parent-row-clone-scroll');
  if(cloneScroller && cloneScroller.scrollLeft !== scrollLeft) cloneScroller.scrollLeft = scrollLeft;
  syncSubExpandWidths();
  requestAnimationFrame(updateSubStickyHeaders);
}

function updateSubParentStickyClone(row, top, left, width, scrollLeft){
  const clone = ensureSubParentStickyClone();
  if(!clone || !row) return;
  const rowId = row.querySelector('td:nth-child(3)')?.textContent?.trim() || '';
  const table = clone.querySelector('table');
  if(clone.getAttribute('data-row-id') !== rowId){
    table.innerHTML = getSubParentColgroupHtml() + `<tbody>${row.outerHTML}</tbody>`;
    const clonedRow = table.querySelector('tr.ov-head');
    if(clonedRow){
      clonedRow.classList.add('expanded');
      clonedRow.removeAttribute('id');
      clonedRow.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      clonedRow.querySelectorAll('[onclick],[onchange],[onkeydown]').forEach(el => {
        el.removeAttribute('onclick');
        el.removeAttribute('onchange');
        el.removeAttribute('onkeydown');
      });
    }
    clone.setAttribute('data-row-id', rowId);
  }
  clone.style.setProperty('--sub-parent-clone-left', `${Math.round(left)}px`);
  clone.style.setProperty('--sub-parent-clone-top', `${Math.round(top)}px`);
  clone.style.setProperty('--sub-parent-clone-width', `${Math.round(width)}px`);
  clone.classList.add('show');
  const scroller = clone.querySelector('.sub-parent-row-clone-scroll');
  if(scroller && scroller.scrollLeft !== (scrollLeft || 0)) scroller.scrollLeft = scrollLeft || 0;
}

function clearSubChildSticky(grid){
  if(!grid) return;
  const head = grid.querySelector('.chg-head-row');
  grid.classList.remove('child-head-fixed');
  if(head){
    head.classList.remove('child-fixed');
    head.style.removeProperty('--child-head-left');
    head.style.removeProperty('--child-head-top');
    head.style.removeProperty('--child-head-width');
  }
}

function updateSubStickyHeaders(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')){
    hideSubParentStickyClone();
    return;
  }
  const card = page.querySelector('.overview-card');
  const wrap = card ? card.querySelector('.sub-table-wrap') : null;
  const parentHead = card ? card.querySelector('.sub-table-head-wrap') : null;
  if(!card || !wrap || !parentHead){
    hideSubParentStickyClone();
    return;
  }

  syncSubExpandWidths();
  const scrollLeft = wrap.scrollLeft || 0;
  if(parentHead.scrollLeft !== scrollLeft) parentHead.scrollLeft = scrollLeft;

  const parentRect = parentHead.getBoundingClientRect();
  const parentHeadH = Math.round(parentRect.height || 40);
  const rowH = 44;
  // Overlap by 1px so the stacked rows visually attach with no hairline gap.
  const rowTop = Math.round(parentRect.bottom) - 1;
  const childTop = rowTop + rowH - 1;
  const wrapRect = wrap.getBoundingClientRect();

  let active = null;
  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    const head = grid.querySelector('.chg-head-row');
    const expandRow = grid.closest('tr.ov-expand');
    const parentRow = expandRow ? expandRow.previousElementSibling : null;
    if(!head || !parentRow) return;
    const rect = grid.getBoundingClientRect();
    const headH = Math.round(head.getBoundingClientRect().height || 36);
    // Stick only after the child header would pass under the active parent row.
    const shouldStick = rect.top < childTop && rect.bottom > childTop + headH + 24;
    if(shouldStick){
      const score = Math.abs(rect.top - childTop);
      if(!active || score < active.score){
        active = {grid, head, parentRow, rect, headH, score};
      }
    }
  });

  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    if(!active || grid !== active.grid) clearSubChildSticky(grid);
  });

  if(!active){
    hideSubParentStickyClone();
    return;
  }

  updateSubParentStickyClone(active.parentRow, rowTop, wrapRect.left, wrapRect.width, scrollLeft);

  active.grid.classList.add('child-head-fixed');
  active.head.classList.add('child-fixed');
  active.head.style.setProperty('--child-head-left', `${Math.round(wrapRect.left)}px`);
  active.head.style.setProperty('--child-head-top', `${childTop}px`);
  active.head.style.setProperty('--child-head-width', `${Math.round(wrapRect.width)}px`);

  const midBody = active.grid.querySelector('.chg-mid-body-scroll');
  const midHead = active.grid.querySelector('.chg-mid-head-scroll');
  if(midBody && midHead && midHead.scrollLeft !== midBody.scrollLeft){
    midHead.scrollLeft = midBody.scrollLeft;
  }
}


/* v36: refresh the expanded child width on viewport changes without touching other pages */
window.addEventListener('resize', () => {
  syncSubExpandWidths();
  requestAnimationFrame(updateSubStickyHeaders);
}, {passive:true});



/* v37: My Subscriptions only — recompute expanded child width/action boundary from the parent table viewport. */
function syncSubExpandWidths(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')) return;
  const wrap = page.querySelector('.sub-table-wrap');
  if(!wrap) return;
  const wrapWidth = Math.max(320, Math.floor(wrap.clientWidth || wrap.getBoundingClientRect().width || 0));
  const actionCell = page.querySelector('.sub-table-head th.action-col') || page.querySelector('.sub-table td.ov-actions');
  const actionWidth = Math.max(150, Math.round(actionCell ? actionCell.getBoundingClientRect().width : 170));
  const leftWidth = 194;
  page.style.setProperty('--sub-child-action-w', `${actionWidth}px`);
  page.style.setProperty('--sub-child-left-w', `${leftWidth}px`);
  page.querySelectorAll('.ov-expand-inner').forEach(inner => {
    inner.style.setProperty('--sub-expand-width', `${wrapWidth}px`);
    inner.style.width = `${wrapWidth}px`;
    inner.style.maxWidth = `${wrapWidth}px`;
  });
  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    grid.style.setProperty('--sub-expand-width', `${wrapWidth}px`);
    grid.style.setProperty('--sub-child-action-w', `${actionWidth}px`);
    grid.style.setProperty('--sub-child-left-w', `${leftWidth}px`);
    grid.style.width = `${wrapWidth}px`;
    grid.style.maxWidth = `${wrapWidth}px`;
    const midBody = grid.querySelector('.chg-mid-body-scroll');
    const midHead = grid.querySelector('.chg-mid-head-scroll');
    if(midBody && midHead && midHead.scrollLeft !== midBody.scrollLeft){
      midHead.scrollLeft = midBody.scrollLeft;
    }
  });
}

function syncSplitChangeScroll(scroller){
  const grid = scroller && scroller.closest ? scroller.closest('.changes-split-grid') : null;
  if(!grid) return;
  const head = grid.querySelector('.chg-mid-head-scroll');
  if(head && head.scrollLeft !== scroller.scrollLeft) head.scrollLeft = scroller.scrollLeft;
  const top = scroller.scrollTop || 0;
  const leftBody = grid.querySelector('.chg-left-body');
  const rightBody = grid.querySelector('.chg-right-body');
  if(leftBody && leftBody.scrollTop !== top) leftBody.scrollTop = top;
  if(rightBody && rightBody.scrollTop !== top) rightBody.scrollTop = top;
  syncSubExpandWidths();
}


/* v38: keep child body rows and sticky header on the exact same column geometry. */
function syncSubChildGridGeometryV38(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')) return;
  const wrap = page.querySelector('.sub-table-wrap');
  if(!wrap) return;
  const wrapWidth = Math.max(320, Math.floor(wrap.clientWidth || wrap.getBoundingClientRect().width || 0));
  const actionCell = page.querySelector('.sub-table-head th.action-col') || page.querySelector('.sub-table td.ov-actions');
  const actionWidth = Math.max(150, Math.round(actionCell ? actionCell.getBoundingClientRect().width : 170));
  const leftWidth = 194;
  page.style.setProperty('--sub-child-action-w', `${actionWidth}px`);
  page.style.setProperty('--sub-child-left-w', `${leftWidth}px`);
  page.querySelectorAll('.changes-split-grid-v30').forEach(grid => {
    grid.style.setProperty('--sub-expand-width', `${wrapWidth}px`);
    grid.style.setProperty('--sub-child-action-w', `${actionWidth}px`);
    grid.style.setProperty('--sub-child-left-w', `${leftWidth}px`);
    grid.style.width = `${wrapWidth}px`;
    grid.style.maxWidth = `${wrapWidth}px`;
    grid.querySelectorAll('.chg-head-row,.chg-body-row-grid').forEach(row => {
      row.style.gridTemplateColumns = `${leftWidth}px minmax(0px, 1fr) ${actionWidth}px`;
      row.style.width = '100%';
      row.style.maxWidth = '100%';
    });
    grid.querySelectorAll('.chg-right-head,.chg-right-body,.chg-right-body .chg-row').forEach(el => {
      el.style.width = `${actionWidth}px`;
      el.style.minWidth = `${actionWidth}px`;
      el.style.maxWidth = `${actionWidth}px`;
    });
    grid.querySelectorAll('.chg-right-head,.chg-right-body .chg-row').forEach(el => {
      el.style.gridTemplateColumns = `${actionWidth}px`;
    });
    grid.querySelectorAll('.chg-action-cell').forEach(el => {
      el.style.width = `${actionWidth}px`;
      el.style.maxWidth = `${actionWidth}px`;
    });
    const midBody = grid.querySelector('.chg-mid-body-scroll');
    const midHead = grid.querySelector('.chg-mid-head-scroll');
    if(midBody && midHead && midHead.scrollLeft !== midBody.scrollLeft){
      midHead.scrollLeft = midBody.scrollLeft;
    }
  });
}

const __syncSubExpandWidths_v37 = syncSubExpandWidths;
syncSubExpandWidths = function(){
  if(typeof __syncSubExpandWidths_v37 === 'function') __syncSubExpandWidths_v37();
  syncSubChildGridGeometryV38();
};

const __syncSplitChangeScroll_v37 = syncSplitChangeScroll;
syncSplitChangeScroll = function(scroller){
  if(typeof __syncSplitChangeScroll_v37 === 'function') __syncSplitChangeScroll_v37(scroller);
  syncSubChildGridGeometryV38();
};

window.addEventListener('resize', syncSubChildGridGeometryV38, {passive:true});


/* v39: My Subscriptions child list root fix — one real sticky table instead of split fake fixed columns. */
function renderChangesSplitGrid(id, list){
  const rows = list.map(ch => renderChangeV39Row(id, ch)).join('');
  return `<div class="changes-v39-grid" role="region" aria-label="Change records for campaign ${id}">
    <div class="changes-v39-scroll" onscroll="syncChangeV39Scroll(this)">
      <table class="changes-v39-table">
        <colgroup>
          <col style="width:44px;">
          <col style="width:150px;">
          <col style="width:150px;">
          <col style="width:200px;">
          <col style="width:400px;">
          <col style="width:90px;">
          <col style="width:150px;">
          <col style="width:210px;">
        </colgroup>
        <thead><tr>
          <th></th>
          <th>Operation</th>
          <th>Subscribed Event</th>
          <th>Field</th>
          <th>Change</th>
          <th>Locale</th>
          <th>Update Time</th>
          <th>Action</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}
function renderChangeV39Row(id, ch){
  const unread = isUnread(id, ch);
  const k = changeKey(id, ch);
  let changeCell = '';
  if(ch.op === 'add'){
    changeCell = `<span class="diff-add">+ ${escape(ch.after)}</span>`;
  } else if(ch.op === 'remove'){
    changeCell = `<span class="diff-remove">− ${escape(ch.before)}</span>`;
  } else {
    changeCell = `<span class="diff-old">${escape(ch.before)}</span> <span class="diff-arrow">→</span> <span class="diff-new">${escape(ch.after)}</span>`;
  }
  const localeChip = ch.locale && ch.locale !== '-' ? `<span class="chip mini">${ch.locale}</span>` : '<span class="muted">-</span>';
  const toggleBtn = unread
    ? `<button class="btn btn-link btn-sm" title="Mark as read" onclick="markChangeRead('${id}','${k}')">Mark read</button>`
    : `<button class="btn btn-link btn-sm mark-unread-btn" title="Mark as unread" onclick="markChangeUnread('${id}','${k}')">Mark unread</button>`;
  return `<tr class="${unread?'ch-unread':''}">
    <td>${unread?'<span class="ir-dot" style="background:#ff5722;display:inline-block;width:8px;height:8px;border-radius:50%;"></span>':''}</td>
    <td><span class="op-pill op-${ch.op}">${OP_LABEL[ch.op]}</span></td>
    <td title="${escape(TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope))}">${escape(TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope))}</td>
    <td title="${escape(ch.field)}">${escape(ch.field)}</td>
    <td>${changeCell}</td>
    <td>${localeChip}</td>
    <td class="muted" style="font-size:12px;" title="${escape(ch.time)}">${ch.time}</td>
    <td><div class="ch-actions">
      <button class="btn btn-link btn-sm" onclick="jumpToChange('${id}','${ch.type}','${ch.locale||''}','${k}')">View Detail</button>
      ${toggleBtn}
    </div></td>
  </tr>`;
}
function syncChangeV39Scroll(scroller){
  // Intentionally empty: header, unread dot, Operation, and Action live in the same scroll container and are fixed by native sticky.
}
function syncSubExpandWidths(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')) return;
  const wrap = page.querySelector('.sub-table-wrap');
  if(!wrap) return;
  const wrapWidth = Math.max(320, Math.floor(wrap.clientWidth || wrap.getBoundingClientRect().width || 0));
  const parentScroll = Math.round(wrap.scrollLeft || 0);
  page.querySelectorAll('.ov-expand-inner').forEach(inner => {
    inner.style.setProperty('--sub-expand-width', `${wrapWidth}px`);
    inner.style.setProperty('--sub-parent-scroll-x', `${parentScroll}px`);
    inner.style.width = `${wrapWidth}px`;
    inner.style.maxWidth = `${wrapWidth}px`;
  });
}
function syncSubParentHeader(scroller){
  const card = scroller && scroller.closest ? scroller.closest('.overview-card') : null;
  if(!card) return;
  const scrollLeft = scroller.scrollLeft || 0;
  const head = card.querySelector('.sub-table-head-wrap');
  if(head && head.scrollLeft !== scrollLeft) head.scrollLeft = scrollLeft;
  const cloneScroller = document.querySelector('#page-sub .sub-parent-row-sticky-clone.show .sub-parent-row-clone-scroll');
  if(cloneScroller && cloneScroller.scrollLeft !== scrollLeft) cloneScroller.scrollLeft = scrollLeft;
  syncSubExpandWidths();
  requestAnimationFrame(updateSubStickyHeaders);
}



/* v40: My Subscriptions only — restore three-layer sticky for v39 child list without changing its single-table sticky columns. */
function ensureSubChildHeadStickyClone(){
  const page = document.getElementById('page-sub');
  if(!page) return null;
  let clone = page.querySelector('.sub-child-head-sticky-clone');
  if(!clone){
    clone = document.createElement('div');
    clone.className = 'sub-child-head-sticky-clone';
    clone.innerHTML = `<div class="sub-child-head-clone-scroll"><table class="changes-v39-table"></table></div>`;
    page.appendChild(clone);
  }
  return clone;
}
function hideSubChildHeadStickyClone(){
  const page = document.getElementById('page-sub');
  const clone = page && page.querySelector('.sub-child-head-sticky-clone');
  if(clone){
    clone.classList.remove('show');
    clone.removeAttribute('data-child-id');
  }
  if(page){
    page.querySelectorAll('.changes-v39-grid.v40-child-head-active').forEach(grid => grid.classList.remove('v40-child-head-active'));
  }
}
function updateSubChildHeadStickyClone(grid, top, left, width){
  const clone = ensureSubChildHeadStickyClone();
  if(!clone || !grid) return;
  const table = grid.querySelector('.changes-v39-table');
  const scroller = grid.querySelector('.changes-v39-scroll');
  const sourceColgroup = table && table.querySelector('colgroup');
  const sourceThead = table && table.querySelector('thead');
  if(!table || !scroller || !sourceThead) return;
  const expandRow = grid.closest('tr.ov-expand');
  const parentRow = expandRow ? expandRow.previousElementSibling : null;
  const childId = (parentRow && parentRow.querySelector('td:nth-child(3)')?.textContent?.trim()) || '';
  const cloneTable = clone.querySelector('table');
  if(clone.getAttribute('data-child-id') !== childId){
    cloneTable.innerHTML = `${sourceColgroup ? sourceColgroup.outerHTML : ''}${sourceThead.outerHTML}`;
    clone.setAttribute('data-child-id', childId);
  }
  const tableWidth = Math.max(table.scrollWidth || 0, table.getBoundingClientRect().width || 0, 1394);
  cloneTable.style.width = `${Math.round(tableWidth)}px`;
  cloneTable.style.minWidth = `${Math.round(tableWidth)}px`;
  clone.style.setProperty('--sub-child-head-left', `${Math.round(left)}px`);
  clone.style.setProperty('--sub-child-head-top', `${Math.round(top)}px`);
  clone.style.setProperty('--sub-child-head-width', `${Math.round(width)}px`);
  clone.classList.add('show');
  grid.classList.add('v40-child-head-active');
  const cloneScroller = clone.querySelector('.sub-child-head-clone-scroll');
  if(cloneScroller && cloneScroller.scrollLeft !== scroller.scrollLeft){
    cloneScroller.scrollLeft = scroller.scrollLeft || 0;
  }
}
function syncChangeV39Scroll(scroller){
  const grid = scroller && scroller.closest ? scroller.closest('.changes-v39-grid') : null;
  const clone = document.querySelector('#page-sub .sub-child-head-sticky-clone.show .sub-child-head-clone-scroll');
  if(grid && grid.classList.contains('v40-child-head-active') && clone && clone.scrollLeft !== scroller.scrollLeft){
    clone.scrollLeft = scroller.scrollLeft || 0;
  }
  requestAnimationFrame(updateSubStickyHeaders);
}
function updateSubStickyHeaders(){
  const page = document.getElementById('page-sub');
  if(!page || !page.classList.contains('active')){
    hideSubParentStickyClone();
    hideSubChildHeadStickyClone();
    return;
  }
  const card = page.querySelector('.overview-card');
  const wrap = card ? card.querySelector('.sub-table-wrap') : null;
  const parentHead = card ? card.querySelector('.sub-table-head-wrap') : null;
  if(!card || !wrap || !parentHead){
    hideSubParentStickyClone();
    hideSubChildHeadStickyClone();
    return;
  }
  syncSubExpandWidths();
  const parentScrollLeft = wrap.scrollLeft || 0;
  if(parentHead.scrollLeft !== parentScrollLeft) parentHead.scrollLeft = parentScrollLeft;
  const parentRect = parentHead.getBoundingClientRect();
  const parentHeadH = Math.round(parentRect.height || 40);
  const parentRowH = 44;
  const parentRowTop = Math.round(parentRect.bottom) - 1;
  const childHeadTop = parentRowTop + parentRowH - 1;
  const wrapRect = wrap.getBoundingClientRect();
  let active = null;
  page.querySelectorAll('.changes-v39-grid').forEach(grid => {
    const expandRow = grid.closest('tr.ov-expand');
    const parentRow = expandRow ? expandRow.previousElementSibling : null;
    const childHead = grid.querySelector('.changes-v39-table thead');
    if(!parentRow || !childHead) return;
    const rect = grid.getBoundingClientRect();
    const headH = Math.round(childHead.getBoundingClientRect().height || 36);
    const shouldStick = rect.top < childHeadTop && rect.bottom > childHeadTop + headH + 24;
    if(shouldStick){
      const score = Math.abs(rect.top - childHeadTop);
      if(!active || score < active.score){
        active = {grid, parentRow, rect, headH, score};
      }
    }
  });
  page.querySelectorAll('.changes-v39-grid').forEach(grid => {
    if(!active || grid !== active.grid){
      grid.classList.remove('v40-child-head-active');
    }
  });
  if(!active){
    hideSubParentStickyClone();
    hideSubChildHeadStickyClone();
    return;
  }
  updateSubParentStickyClone(active.parentRow, parentRowTop, wrapRect.left, wrapRect.width, parentScrollLeft);
  updateSubChildHeadStickyClone(active.grid, childHeadTop, wrapRect.left, wrapRect.width);
}
(function setupSubStickyV40(){
  const main = document.querySelector('.main');
  if(main) main.addEventListener('scroll', updateSubStickyHeaders, {passive:true});
  window.addEventListener('scroll', updateSubStickyHeaders, {passive:true});
  window.addEventListener('resize', () => { syncSubExpandWidths(); updateSubStickyHeaders(); }, {passive:true});
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(updateSubStickyHeaders));
})();



/* v49: keep the child sticky-header clone on the exact same viewport width as the child scroll body. */
const __updateSubChildHeadStickyClone_v49 = updateSubChildHeadStickyClone;
updateSubChildHeadStickyClone = function(grid, top, left, width){
  if(!grid) return;
  const scroller = grid.querySelector('.changes-v39-scroll');
  if(!scroller){
    return __updateSubChildHeadStickyClone_v49(grid, top, left, width);
  }
  const rect = scroller.getBoundingClientRect();
  const visibleWidth = Math.max(240, Math.floor(scroller.clientWidth || rect.width || width || 0));
  __updateSubChildHeadStickyClone_v49(grid, top, rect.left, visibleWidth);
  const clone = document.querySelector('#page-sub .sub-child-head-sticky-clone.show');
  if(!clone) return;
  const cloneScroll = clone.querySelector('.sub-child-head-clone-scroll');
  const sourceTable = grid.querySelector('.changes-v39-table');
  const cloneTable = clone.querySelector('.changes-v39-table');
  if(cloneScroll){
    cloneScroll.style.width = visibleWidth + 'px';
    cloneScroll.scrollLeft = scroller.scrollLeft || 0;
  }
  if(sourceTable && cloneTable){
    const tableWidth = Math.max(sourceTable.scrollWidth || 0, sourceTable.getBoundingClientRect().width || 0, 1394);
    cloneTable.style.width = Math.round(tableWidth) + 'px';
    cloneTable.style.minWidth = Math.round(tableWidth) + 'px';
  }
};


/* v55: keep the three-layer sticky parent row clone aligned to the live parent table. */
function getSubParentColgroupHtml(){
  const liveColgroup = document.querySelector('#page-sub .sub-table-head colgroup') || document.querySelector('#page-sub .sub-table-body colgroup');
  if(liveColgroup) return liveColgroup.outerHTML;
  return `<colgroup>
    <col style="width:44px;">
    <col style="width:44px;">
    <col style="width:90px;">
    <col style="width:360px;">
    <col style="width:160px;">
    <col style="width:80px;">
    <col style="width:120px;">
    <col style="width:120px;">
    <col style="width:140px;">
    <col style="width:76px;">
    <col style="width:240px;">
  </colgroup>`;
}
const __updateSubParentStickyClone_v55 = updateSubParentStickyClone;
updateSubParentStickyClone = function(row, top, left, width, scrollLeft){
  if(typeof __updateSubParentStickyClone_v55 === 'function'){
    __updateSubParentStickyClone_v55(row, top, left, width, scrollLeft);
  }
  const page = document.getElementById('page-sub');
  const clone = page && page.querySelector('.sub-parent-row-sticky-clone');
  const cloneTable = clone && clone.querySelector('.sub-table');
  const cloneScroller = clone && clone.querySelector('.sub-parent-row-clone-scroll');
  const liveTable = page && (page.querySelector('.sub-table-head') || page.querySelector('.sub-table-body'));
  const wrap = page && page.querySelector('.sub-table-wrap');
  const head = page && page.querySelector('.sub-table-head-wrap');
  if(!clone || !cloneTable) return;
  const liveWidth = Math.max(
    1474,
    liveTable ? Math.round(liveTable.scrollWidth || 0) : 0,
    liveTable ? Math.round(liveTable.getBoundingClientRect().width || 0) : 0
  );
  cloneTable.style.width = `${liveWidth}px`;
  cloneTable.style.minWidth = `${liveWidth}px`;
  cloneTable.style.tableLayout = 'fixed';
  const parentScrollLeft = Math.round((wrap && wrap.scrollLeft) || scrollLeft || 0);
  if(cloneScroller && cloneScroller.scrollLeft !== parentScrollLeft) cloneScroller.scrollLeft = parentScrollLeft;
  if(head && head.scrollLeft !== parentScrollLeft) head.scrollLeft = parentScrollLeft;
};


;

(function(){
  function byId(id){ return document.getElementById(id); }
  function safe(fn){ try { return fn(); } catch(e) { console.warn('[remove read/unread]', e); } }
  document.body.classList.add('no-read-unread');

  if (typeof SUB_FILTER !== 'undefined') SUB_FILTER.unreadOnly = false;
  if (typeof isUnread === 'function') isUnread = function(){ return false; };
  if (typeof markChangeUnread === 'function') markChangeUnread = function(){};
  if (typeof markChangeRead === 'function') markChangeRead = function(){};
  if (typeof markCampaignUnread === 'function') markCampaignUnread = function(){};
  if (typeof markCampaignRead === 'function') markCampaignRead = function(){};
  if (typeof markAllRead === 'function') markAllRead = function(){};
  if (typeof refreshDigestBadge === 'function') refreshDigestBadge = function(){ const b = byId('digestBadge'); if(b){ b.style.display = 'none'; b.textContent = ''; b.removeAttribute('title'); } };
  if (typeof digestTodayUnread === 'function') digestTodayUnread = function(){ return 0; };
  if (typeof digestUnreadTotal === 'function') digestUnreadTotal = function(){ return 0; };
  if (typeof jumpToChange === 'function') jumpToChange = function(id, type, locale){ const tab = TYPE_TO_TAB[type] || 'campaign'; openDetail(Number(id), { tab, locale: locale || null }); };
  if (typeof digestJump === 'function') digestJump = function(id, type, locale, key){ jumpToChange(id, type, locale, key); };

  if (typeof digestHighlights === 'function') digestHighlights = function(){
    const day = digestDateStr();
    const groups = [];
    Object.keys(CHANGES).forEach(id => {
      const c = getCampaignById(id); if(!c) return;
      const list = (CHANGES[id] || [])
        .filter(ch => String(ch.time).slice(0, 10) === day)
        .sort((a, b) => parseTime(b.time) - parseTime(a.time));
      if(!list.length) return;
      groups.push({ id:String(id), c, list, subscribed: !!SUBS[id], latest:parseTime(list[0].time) });
    });
    const statusPriority = { live:0, upcoming:1, draft:2, ended:3 };
    groups.sort((a, b) => ((statusPriority[a.c.status] ?? 9) - (statusPriority[b.c.status] ?? 9)) || (b.latest - a.latest));
    return { day, groups };
  };

  if (typeof digestRenderChange === 'function') digestRenderChange = function(id, ch){
    let diff;
    if(ch.op === 'add') diff = `<span class="diff-add">+ ${escape(ch.after)}</span>`;
    else if(ch.op === 'remove') diff = `<span class="diff-remove">− ${escape(ch.before)}</span>`;
    else diff = `<span class="diff-old">${escape(ch.before)}</span> <span class="diff-arrow">→</span> <span class="diff-new">${escape(ch.after)}</span>`;
    const t = String(ch.time).slice(11, 16);
    const evt = TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope);
    return `<div class="dg-change" role="button" tabindex="0"
        onclick="digestJump('${id}','${ch.type}','${ch.locale || ''}','')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();digestJump('${id}','${ch.type}','${ch.locale || ''}','')}"
        title="Open ${escape(evt)} in campaign detail">
      <span class="op-pill op-${ch.op}">${OP_LABEL[ch.op]}</span>
      <span class="dg-field" title="${escape(ch.scope)} · ${escape(ch.field)}">${escape(ch.field)}</span>
      <span class="dg-diff">${diff}</span>
      <span class="dg-time">${t}</span>
      <span class="dg-go" aria-hidden="true">→</span>
    </div>`;
  };

  if (typeof digestRenderGroup === 'function') digestRenderGroup = function(g){
    const expanded = DIGEST_GROUP_EXPANDED.has(g.id);
    const shown = expanded ? g.list : g.list.slice(0, DIGEST_PREVIEW_COUNT);
    const more = g.list.length - DIGEST_PREVIEW_COUNT;
    const regions = getCampaignRegions(g.c).join(', ');
    return `<article class="dg-group">
      <header class="dg-group-head">
        <div class="dg-group-title">
          <span class="link-name" role="button" tabindex="0" onclick="openDetail(${Number(g.id)})" onkeydown="if(event.key==='Enter'){openDetail(${Number(g.id)})}" title="Open campaign detail">${escape(g.c.campaignName)}</span>
          <span class="badge-stage ${g.c.status}">${STATUS_LABEL[g.c.status]}</span>
          <span class="chip mini">${escape(regions)}</span>

        </div>
        <div class="dg-group-meta"><span class="dg-count">${g.list.length} update${g.list.length > 1 ? 's' : ''}</span></div>
      </header>
      <div class="dg-changes">${shown.map(ch => digestRenderChange(g.id, ch)).join('')}</div>
      ${more > 0 ? `<button class="dg-more" onclick="toggleDigestGroup('${g.id}')">${expanded ? 'Show less' : `Show all ${g.list.length} updates`}</button>` : ''}
    </article>`;
  };

  if (typeof buildDigestAISummary === 'function') buildDigestAISummary = function(groups, totalChanges){
    if(!groups.length){
      return '今天暂未发现新的活动变动信息，活动整体保持稳定。可以继续关注 Live 和 Upcoming 活动，确认后续是否有补贴、券、落地页或推广素材更新。';
    }
    const eventMap = {}, opMap = {}, regionMap = {}, statusMap = {};
    groups.forEach(g => {
      getCampaignRegions(g.c).forEach(r => { regionMap[r] = (regionMap[r] || 0) + g.list.length; });
      statusMap[STATUS_LABEL[g.c.status] || g.c.status] = (statusMap[STATUS_LABEL[g.c.status] || g.c.status] || 0) + 1;
      g.list.forEach(ch => {
        const eventName = TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope);
        eventMap[eventName] = (eventMap[eventName] || 0) + 1;
        opMap[OP_LABEL[ch.op] || ch.op] = (opMap[OP_LABEL[ch.op] || ch.op] || 0) + 1;
      });
    });
    const focusCampaigns = groups.slice(0, 3).map(g => `${g.c.campaignName}（${g.list.length} 条）`).join('、');
    return `今天共有 ${totalChanges} 条活动变动，涉及 ${groups.length} 个活动。变动主要集中在 ${mapTopText(eventMap, 3)}，操作类型以 ${mapTopText(opMap, 3)} 为主；受影响市场包括 ${mapTopText(regionMap, 4)}，活动状态分布为 ${mapTopText(statusMap, 4)}。建议重点关注 ${focusCampaigns}。`;
  };

  if (typeof renderDigest === 'function') renderDigest = function(){
    const box = byId('digestBody'); if(!box) return;
    const { groups } = digestHighlights();
    const totalChanges = groups.reduce((s, g) => s + g.list.length, 0);
    const counts = digestStatusCounts();
    const regionCounts = digestRegionCounts();
    const regionMax = Math.max(1, ...Object.values(regionCounts));
    const hero = `<div class="page-card dg-hero">
      <div class="dg-hero-main"><div><h2>Campaign Notification Daily Report</h2><div class="dg-date">${digestDateLabel()}</div></div></div>
      <div class="dg-hero-summary"><b>${totalChanges}</b> update${totalChanges === 1 ? '' : 's'} across <b>${groups.length}</b> campaign${groups.length === 1 ? '' : 's'} today</div>
    </div>`;
    const kpis = `<div class="dg-kpis">${DIGEST_STATUS_CARDS.map(card => {
      const n = counts[card.key] || 0;
      const arg = card.key ? `{status:'${card.key}', toast:'Campaign list filtered: ${card.label}'}` : `{toast:'Showing all campaigns'}`;
      return `<button class="dg-kpi kpi-${card.cls}" onclick="digestOpenList(${arg})" title="Open the campaign list${card.key ? ` filtered to ${card.label}` : ''}">
        <span class="dg-kpi-icon" aria-hidden="true">${card.icon}</span><span class="dg-kpi-num">${n}</span><span class="dg-kpi-label">${card.label}</span><span class="dg-kpi-go">View in list →</span>
      </button>`;
    }).join('')}</div>`;
    const highlightsBody = groups.length ? groups.map(g => digestRenderGroup(g)).join('') : `<div class="dg-empty"><div class="dg-empty-art" aria-hidden="true">✓</div><div class="dg-empty-title">No updates today</div><div class="dg-empty-text">All campaigns are steady. Browse the full list to explore details.</div><button class="btn btn-primary" onclick="digestOpenList({})">Open Campaign List</button></div>`;
    const aiSummary = `<div class="page-card dg-card dg-ai-summary"><div class="dg-card-head"><h3>AI Summary</h3><span class="dg-card-sub">Generated from today’s changes</span></div><p>${escape(buildDigestAISummary(groups, totalChanges))}</p></div>`;
    const highlights = `<div class="page-card dg-card dg-highlights"><div class="dg-card-head"><h3>Change Record</h3><span class="dg-card-sub">Newest updates first</span></div>${highlightsBody}</div>`;
    const regionRows = LIST_REGION_OPTIONS.map(r => {
      const n = regionCounts[r] || 0;
      return `<button class="dg-region-row" onclick="digestOpenList({region:'${r}', toast:'Campaign list filtered: ${r}'})" title="Open the campaign list filtered to ${r}"><span class="dg-region-name">${r}</span><span class="dg-region-bar"><span class="dg-region-fill" style="width:${Math.round(n / regionMax * 100)}%;"></span></span><span class="dg-region-num">${n}</span></button>`;
    }).join('');
    const rail = `<div class="dg-rail dg-rail-top"><div class="page-card dg-card dg-region-summary"><div class="dg-card-head"><h3>By Region</h3><span class="dg-card-sub">Campaigns</span></div><div class="dg-region-list">${regionRows}</div></div></div>`;
    box.innerHTML = `${hero}<div class="dg-summary-row">${kpis}${rail}</div>${aiSummary}${highlights}`;
    refreshDigestBadge();
  };

  if (typeof renderOverviewRow === 'function') renderOverviewRow = function(r){
    const expanded = EXPANDED.has(r.id);
    const checked = SUB_SELECTED.has(r.id);
    const sub = SUBS[r.id];
    const tierCls = (r.c.grade||'').toLowerCase().replace(/\s+/g,'');
    const head = `<tr class="ov-head ${expanded?'expanded':''}">
      <td><input type="checkbox" aria-label="Select campaign ${r.id}" ${checked?'checked':''} onclick="event.stopPropagation();" onchange="toggleSubSelect('${r.id}', this.checked)" /></td>
      <td><span class="ov-caret" role="button" tabindex="0" aria-label="${expanded?'Collapse':'Expand'}" onclick="toggleExpand('${r.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleExpand('${r.id}')}">${expanded?'▾':'▸'}</span></td>
      <td>${r.id}</td>
      <td><span class="link-name" onclick="openDetail(${r.id})">${escape(r.c.campaignName)}</span></td>
      <td>${escape(r.c.theme||'-')}</td>
      <td>${r.c.grade ? `<span class="badge-tier tier-${tierCls}">${r.c.grade}</span>` : '<span class="muted">-</span>'}</td>
      <td>${r.c.team}</td>
      <td><span class="badge-stage ${r.c.status}">${STATUS_LABEL[r.c.status]}</span></td>
      <td class="muted" style="font-size:12px;">${sub.subscribedAt||'-'}</td>
      <td class="ov-actions"><div class="ov-actions-inner"><button class="btn btn-link btn-sm unsub" onclick="unsubFromList('${r.id}')">Unsubscribe</button></div></td>
    </tr>`;
    if(!expanded) return head;
    const changesBody = r.list.length ? renderChangesSplitGrid(r.id, r.list) : `<div class="empty-mini">No changes in the selected time range.</div>`;
    return head + `<tr class="ov-expand"><td class="ov-expand-cell" colspan="10"><div class="ov-expand-inner">${changesBody}</div></td></tr>`;
  };

  if (typeof renderChangesSplitGrid === 'function') renderChangesSplitGrid = function(id, list){
    const rows = list.map(ch => renderChangeV39Row(id, ch)).join('');
    return `<div class="changes-v39-grid" role="region" aria-label="Change records for campaign ${id}">
      <div class="changes-v39-scroll" onscroll="syncChangeV39Scroll(this)">
        <table class="changes-v39-table">
          <colgroup><col style="width:150px;"><col style="width:150px;"><col style="width:200px;"><col style="width:400px;"><col style="width:90px;"><col style="width:150px;"><col style="width:210px;"></colgroup>
          <thead><tr><th>Operation</th><th>Subscribed Event</th><th>Field</th><th>Change</th><th>Locale</th><th>Update Time</th><th>Action</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
  };

  if (typeof renderChangeV39Row === 'function') renderChangeV39Row = function(id, ch){
    let changeCell = '';
    if(ch.op === 'add') changeCell = `<span class="diff-add">+ ${escape(ch.after)}</span>`;
    else if(ch.op === 'remove') changeCell = `<span class="diff-remove">− ${escape(ch.before)}</span>`;
    else changeCell = `<span class="diff-old">${escape(ch.before)}</span> <span class="diff-arrow">→</span> <span class="diff-new">${escape(ch.after)}</span>`;
    const localeChip = ch.locale && ch.locale !== '-' ? `<span class="chip mini">${ch.locale}</span>` : '<span class="muted">-</span>';
    return `<tr>
      <td><span class="op-pill op-${ch.op}">${OP_LABEL[ch.op]}</span></td>
      <td title="${escape(TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope))}">${escape(TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope))}</td>
      <td title="${escape(ch.field)}">${escape(ch.field)}</td>
      <td>${changeCell}</td>
      <td>${localeChip}</td>
      <td class="muted" style="font-size:12px;" title="${escape(ch.time)}">${ch.time}</td>
      <td><div class="ch-actions"><button class="btn btn-link btn-sm" onclick="jumpToChange('${id}','${ch.type}','${ch.locale||''}','')">View Detail</button></div></td>
    </tr>`;
  };

  if (typeof getSubParentColgroupHtml === 'function') getSubParentColgroupHtml = function(){
    return `<colgroup><col style="width:44px;"><col style="width:44px;"><col style="width:90px;"><col style="width:360px;"><col style="width:160px;"><col style="width:80px;"><col style="width:120px;"><col style="width:120px;"><col style="width:140px;"><col style="width:240px;"></colgroup>`;
  };

  function cleanReadUnreadDOM(){
    safe(() => { const b = byId('digestBadge'); if(b){ b.style.display='none'; b.textContent=''; b.removeAttribute('title'); } });
    document.querySelectorAll('#page-sub .sub-since-row .ff-toggle').forEach(el => { if(/Unread\s*only/i.test(el.textContent || '')) el.remove(); });
    document.querySelectorAll('#page-sub .sub-mark-all-read-btn, #page-sub .mark-read-btn, #page-sub .mark-unread-btn').forEach(el => el.remove());
    document.querySelectorAll('#page-sub .sub-table colgroup').forEach(cg => { const cols = cg.querySelectorAll('col'); if(cols.length === 11) cols[9].remove(); });
    document.querySelectorAll('#page-sub .sub-table thead tr').forEach(tr => {
      Array.from(tr.children).forEach(th => { if(/^\s*Unread\s*$/i.test(th.textContent || '')) th.remove(); });
    });
    document.querySelectorAll('#page-sub .ov-expand-cell').forEach(td => td.setAttribute('colspan', '10'));
    document.querySelectorAll('#page-sub .sub-table').forEach(tbl => { tbl.style.width='1398px'; tbl.style.minWidth='1398px'; });
    document.querySelectorAll('#page-sub .changes-v39-table').forEach(tbl => { tbl.style.width='1350px'; tbl.style.minWidth='1350px'; });
    refreshDigestBadge();
  }

  if (typeof renderSubPage === 'function') {
    const originalRenderSubPageNoRead = renderSubPage;
    renderSubPage = function(){ if (typeof SUB_FILTER !== 'undefined') SUB_FILTER.unreadOnly = false; originalRenderSubPageNoRead.apply(this, arguments); cleanReadUnreadDOM(); };
  }
  if (typeof updateSubParentStickyClone === 'function') {
    const originalUpdateParentCloneNoRead = updateSubParentStickyClone;
    updateSubParentStickyClone = function(row, top, left, width, scrollLeft){
      originalUpdateParentCloneNoRead.apply(this, arguments);
      const page = byId('page-sub');
      const clone = page && page.querySelector('.sub-parent-row-sticky-clone');
      const cloneTable = clone && clone.querySelector('.sub-table');
      if(cloneTable){ cloneTable.style.width='1398px'; cloneTable.style.minWidth='1398px'; }
      cleanReadUnreadDOM();
    };
  }
  if (typeof updateSubChildHeadStickyClone === 'function') {
    const originalUpdateChildCloneNoRead = updateSubChildHeadStickyClone;
    updateSubChildHeadStickyClone = function(grid, top, left, width){
      originalUpdateChildCloneNoRead.apply(this, arguments);
      const cloneTable = document.querySelector('#page-sub .sub-child-head-sticky-clone .changes-v39-table');
      if(cloneTable){ cloneTable.style.width='1350px'; cloneTable.style.minWidth='1350px'; }
    };
  }

  safe(() => { renderDigest(); });
  safe(() => { if(byId('page-sub') && byId('page-sub').classList.contains('active')) renderSubPage(); });
  safe(() => { cleanReadUnreadDOM(); });
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function e(s){ return (typeof escape === 'function') ? escape(s == null ? '' : s) : String(s == null ? '' : s); }
  function getDetail(id){ return (typeof DETAILS !== 'undefined') ? (DETAILS[id] || DETAILS[Number(id)] || DETAILS[String(id)] || null) : null; }
  function mechanismValuesForCampaign(id){
    const detail = getDetail(id);
    const raw = detail && detail.campaign ? detail.campaign.mechanism : null;
    if(Array.isArray(raw)) return raw.map(v => String(v == null ? '' : v).trim()).filter(Boolean);
    if(typeof raw === 'string') return raw.split(/[,;|/、，]+/).map(v => v.trim()).filter(Boolean);
    return [];
  }
  function mechanismMetaForCampaign(id){
    const values = mechanismValuesForCampaign(id);
    return {
      hasMechanism: values.length > 0,
      values,
      label: values.length > 0 ? 'Campaign with mechanism' : 'Campaign without mechanism',
      title: values.length > 0 ? values.join(', ') : 'Campaign Mechanism is empty'
    };
  }
  window.campaignMechanismValuesForDigest = mechanismValuesForCampaign;

  function mechanismStats(groups){
    const stats = { withCampaigns:0, withoutCampaigns:0, withUpdates:0, withoutUpdates:0 };
    (groups || []).forEach(g => {
      const meta = g.hasOwnProperty('hasMechanism') ? g : mechanismMetaForCampaign(g.id || (g.c && g.c.campaignId));
      const has = meta.hasMechanism === true;
      const updates = (g.list || []).length;
      if(has){ stats.withCampaigns += 1; stats.withUpdates += updates; }
      else { stats.withoutCampaigns += 1; stats.withoutUpdates += updates; }
    });
    return stats;
  }

  digestHighlights = function(){
    const day = digestDateStr();
    const groups = [];
    Object.keys(CHANGES || {}).forEach(id => {
      const c = getCampaignById(id); if(!c) return;
      const list = (CHANGES[id] || CHANGES[Number(id)] || [])
        .filter(ch => String(ch.time).slice(0, 10) === day)
        .sort((a, b) => parseTime(b.time) - parseTime(a.time));
      if(!list.length) return;
      const meta = mechanismMetaForCampaign(id);
      groups.push({ id:String(id), c, list, latest:parseTime(list[0].time), hasMechanism:meta.hasMechanism, mechanismValues:meta.values, mechanismLabel:meta.label, mechanismTitle:meta.title });
    });
    const statusPriority = { live:0, upcoming:1, draft:2, ended:3 };
    groups.sort((a, b) => {
      if(a.hasMechanism !== b.hasMechanism) return a.hasMechanism ? -1 : 1;
      return ((statusPriority[a.c.status] ?? 9) - (statusPriority[b.c.status] ?? 9)) || (b.latest - a.latest);
    });
    return { day, groups };
  };

  digestRenderGroup = function(g){
    const meta = mechanismMetaForCampaign(g.id);
    g.hasMechanism = meta.hasMechanism;
    g.mechanismValues = meta.values;
    const expanded = DIGEST_GROUP_EXPANDED.has(g.id);
    const shown = expanded ? g.list : g.list.slice(0, DIGEST_PREVIEW_COUNT);
    const more = g.list.length - DIGEST_PREVIEW_COUNT;
    const regions = getCampaignRegions(g.c).join(', ');
    const chipCls = meta.hasMechanism ? 'with' : 'without';
    return `<article class="dg-group ${meta.hasMechanism ? 'dg-group-with-mechanism' : 'dg-group-without-mechanism'}">
      <header class="dg-group-head">
        <div class="dg-group-title">
          <span class="link-name" role="button" tabindex="0" onclick="openDetail(${Number(g.id)})" onkeydown="if(event.key==='Enter'){openDetail(${Number(g.id)})}" title="Open campaign detail">${e(g.c.campaignName)}</span>
          <span class="badge-stage ${g.c.status}">${STATUS_LABEL[g.c.status]}</span>
          <span class="chip mini">${e(regions)}</span>
          <span class="dg-mech-chip ${chipCls}" title="${e(meta.title)}">${meta.label}</span>
        </div>
        <div class="dg-group-meta"><span class="dg-count">${g.list.length} update${g.list.length > 1 ? 's' : ''}</span></div>
      </header>
      <div class="dg-changes">${shown.map(ch => digestRenderChange(g.id, ch)).join('')}</div>
      ${more > 0 ? `<button class="dg-more" onclick="toggleDigestGroup('${g.id}')">${expanded ? 'Show less' : `Show all ${g.list.length} updates`}</button>` : ''}
    </article>`;
  };

  function renderMechanismSummary(groups){
    const s = mechanismStats(groups);
    return `<div class="page-card dg-card dg-mechanism-summary">
      <div class="dg-card-head"><h3>Changed Campaigns by Mechanism</h3><span class="dg-card-sub">Based on Campaign Mechanism</span></div>
      <div class="dg-mech-stats">
        <div class="dg-mech-card with">
          <div class="dg-mech-card-title"><span class="dg-mech-dot"></span>Campaign with mechanism</div>
          <div class="dg-mech-num">${s.withCampaigns}</div>
          <div class="dg-mech-sub">${s.withUpdates} update${s.withUpdates === 1 ? '' : 's'} today · shown first in Change Record</div>
        </div>
        <div class="dg-mech-card without">
          <div class="dg-mech-card-title"><span class="dg-mech-dot"></span>Campaign without mechanism</div>
          <div class="dg-mech-num">${s.withoutCampaigns}</div>
          <div class="dg-mech-sub">${s.withoutUpdates} update${s.withoutUpdates === 1 ? '' : 's'} today · Campaign Mechanism is empty</div>
        </div>
      </div>
    </div>`;
  }

  function renderGroupedHighlights(groups){
    if(!groups.length){
      return `<div class="dg-empty"><div class="dg-empty-art" aria-hidden="true">✓</div><div class="dg-empty-title">No updates today</div><div class="dg-empty-text">All campaigns are steady. Browse the full list to explore details.</div><button class="btn btn-primary" onclick="digestOpenList({})">Open Campaign List</button></div>`;
    }
    const withGroups = groups.filter(g => g.hasMechanism);
    const withoutGroups = groups.filter(g => !g.hasMechanism);
    const section = (label, arr, note) => arr.length ? `<div class="dg-mech-section"><div class="dg-mech-section-title"><span>${label}</span><span class="count">${arr.length} campaign${arr.length > 1 ? 's' : ''} · ${arr.reduce((s,g)=>s+(g.list||[]).length,0)} update${arr.reduce((s,g)=>s+(g.list||[]).length,0) === 1 ? '' : 's'}${note ? ' · ' + note : ''}</span></div>${arr.map(g => digestRenderGroup(g)).join('')}</div>` : '';
    return section('Campaign with mechanism', withGroups, 'priority') + section('Campaign without mechanism', withoutGroups, 'Campaign Mechanism is empty');
  }

  buildDigestAISummary = function(groups, totalChanges){
    if(!groups.length){
      return '今天暂未发现新的活动变动信息，活动整体保持稳定。可以继续关注 Live 和 Upcoming 活动，确认后续是否有补贴、券、落地页或推广素材更新。';
    }
    const eventMap = {}, opMap = {}, regionMap = {}, statusMap = {};
    groups.forEach(g => {
      getCampaignRegions(g.c).forEach(r => { regionMap[r] = (regionMap[r] || 0) + g.list.length; });
      statusMap[STATUS_LABEL[g.c.status] || g.c.status] = (statusMap[STATUS_LABEL[g.c.status] || g.c.status] || 0) + 1;
      g.list.forEach(ch => {
        const eventName = TYPE_LABEL[ch.type] || getSubscribedEventFromScope(ch.scope);
        eventMap[eventName] = (eventMap[eventName] || 0) + 1;
        opMap[OP_LABEL[ch.op] || ch.op] = (opMap[OP_LABEL[ch.op] || ch.op] || 0) + 1;
      });
    });
    const s = mechanismStats(groups);
    const focusCampaigns = groups.filter(g => g.hasMechanism).slice(0, 3).map(g => `${g.c.campaignName}（${g.list.length} 条）`).join('、') || groups.slice(0, 3).map(g => `${g.c.campaignName}（${g.list.length} 条）`).join('、');
    return `今天共有 ${totalChanges} 条活动变动，涉及 ${groups.length} 个活动；其中 ${s.withCampaigns} 个活动属于 Campaign with mechanism，${s.withoutCampaigns} 个活动属于 Campaign without mechanism。Report 已优先展示有玩法/机制活动的变更。变动主要集中在 ${mapTopText(eventMap, 3)}，操作类型以 ${mapTopText(opMap, 3)} 为主；受影响市场包括 ${mapTopText(regionMap, 4)}，活动状态分布为 ${mapTopText(statusMap, 4)}。建议重点关注 ${focusCampaigns}。`;
  };

  renderDigest = function(){
    const box = byId('digestBody'); if(!box) return;
    const { groups } = digestHighlights();
    const totalChanges = groups.reduce((s, g) => s + g.list.length, 0);
    const counts = digestStatusCounts();
    const regionCounts = digestRegionCounts();
    const regionMax = Math.max(1, ...Object.values(regionCounts));
    const hero = `<div class="page-card dg-hero">
      <div class="dg-hero-main"><div><h2>Campaign Notification Daily Report</h2><div class="dg-date">${digestDateLabel()}</div></div></div>
      <div class="dg-hero-summary"><b>${totalChanges}</b> update${totalChanges === 1 ? '' : 's'} across <b>${groups.length}</b> changed campaign${groups.length === 1 ? '' : 's'} today</div>
    </div>`;
    const kpis = `<div class="dg-kpis">${DIGEST_STATUS_CARDS.map(card => {
      const n = counts[card.key] || 0;
      const arg = card.key ? `{status:'${card.key}', toast:'Campaign list filtered: ${card.label}'}` : `{toast:'Showing all campaigns'}`;
      return `<button class="dg-kpi kpi-${card.cls}" onclick="digestOpenList(${arg})" title="Open the campaign list${card.key ? ` filtered to ${card.label}` : ''}"><span class="dg-kpi-icon" aria-hidden="true">${card.icon}</span><span class="dg-kpi-num">${n}</span><span class="dg-kpi-label">${card.label}</span><span class="dg-kpi-go">View in list →</span></button>`;
    }).join('')}</div>`;
    const aiSummary = `<div class="page-card dg-card dg-ai-summary"><div class="dg-card-head"><h3>AI Summary</h3><span class="dg-card-sub">Generated from today’s changes</span></div><p>${e(buildDigestAISummary(groups, totalChanges))}</p></div>`;
    const highlights = `<div class="page-card dg-card dg-highlights"><div class="dg-card-head"><h3>Change Record</h3></div>${renderGroupedHighlights(groups)}</div>`;
    const regionRows = LIST_REGION_OPTIONS.map(r => {
      const n = regionCounts[r] || 0;
      return `<button class="dg-region-row" onclick="digestOpenList({region:'${r}', toast:'Campaign list filtered: ${r}'})" title="Open the campaign list filtered to ${r}"><span class="dg-region-name">${r}</span><span class="dg-region-bar"><span class="dg-region-fill" style="width:${Math.round(n / regionMax * 100)}%;"></span></span><span class="dg-region-num">${n}</span></button>`;
    }).join('');
    const rail = `<div class="dg-rail dg-rail-top"><div class="page-card dg-card dg-region-summary"><div class="dg-card-head"><h3>By Region</h3><span class="dg-card-sub">Campaigns</span></div><div class="dg-region-list">${regionRows}</div></div></div>`;
    box.innerHTML = `${hero}<div class="dg-summary-row">${kpis}${rail}</div>${renderMechanismSummary(groups)}${aiSummary}${highlights}`;
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
  };

  try { renderDigest(); } catch(err) { console.warn('[digest mechanism patch]', err); }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function safeEscape(v){ return (typeof escape === 'function') ? escape(v == null ? '' : v) : String(v == null ? '' : v); }
  function listDetailTabs(){
    return (typeof TABS !== 'undefined' ? TABS : []).filter(t => t.key !== 'collection');
  }
  function normalizeActiveDetailTab(){
    const tabs = listDetailTabs();
    if(!tabs.some(t => t.key === activeMainTab)) activeMainTab = 'campaign';
  }

  // Detail: hide Collection Basic Info tab / section.
  renderTabs = function(){
    normalizeActiveDetailTab();
    const tabs = listDetailTabs();
    const el = byId('mainTabs');
    if(!el) return;
    el.innerHTML = tabs.map(t => `<div class="tab ${activeMainTab===t.key?'active':''}" role="button" tabindex="0" onclick="setMainTab('${t.key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();setMainTab('${t.key}')}" data-key="${t.key}" title="Jump to ${t.label}">${t.label}</div>`).join('');
    if(typeof syncDetailStickyOffsets === 'function') syncDetailStickyOffsets();
  };

  bindScrollSpy = function(){
    if(typeof detailScrollSpyHost !== 'undefined' && detailScrollSpyHost && typeof detailScrollSpyHandler !== 'undefined' && detailScrollSpyHandler){
      detailScrollSpyHost.removeEventListener('scroll', detailScrollSpyHandler);
    }
    const host = getDetailScrollHost();
    const tabs = listDetailTabs();
    const handler = () => {
      if(typeof syncDetailStickyOffsets === 'function') syncDetailStickyOffsets();
      let cur = 'campaign';
      const hostTop = getHostTop(host);
      for(const t of tabs){
        const el = document.getElementById('sec-' + t.key);
        if(!el) continue;
        const offset = getDetailAnchorOffset(t.key) + 4;
        if(el.getBoundingClientRect().top - hostTop - offset <= 0) cur = t.key;
      }
      if(cur !== activeMainTab){
        activeMainTab = cur;
        document.querySelectorAll('#mainTabs .tab').forEach(el => el.classList.toggle('active', el.dataset.key === cur));
        if(typeof updateLocaleBar === 'function') updateLocaleBar(cur);
      }
    };
    detailScrollSpyHost = host;
    detailScrollSpyHandler = handler;
    host.addEventListener('scroll', handler, { passive: true });
    requestAnimationFrame(handler);
  };

  renderTabBody = function(){
    if(!currentDetail) return;
    normalizeActiveDetailTab();
    const d = DETAILS[currentDetail.campaignId];
    const sec = (key, inner) => `<section id="sec-${key}" class="detail-section">${inner}</section>`;
    const html = [
      sec('campaign',      renderCampaign(d.campaign)),
      renderLocaleSelector(),
      sec('subsidy',       renderSubsidy(d.subsidy[activeLocale])),
      sec('coupon',        renderCoupon(d.coupon[activeLocale])),
      sec('landing',       renderLanding(d.landing[activeLocale])),
      sec('promotion',     renderPromotion(d.promotion[activeLocale])),
      sec('supplementary', renderSupplementary(d.supplementary[activeLocale]))
    ].join('');
    const body = byId('dBody');
    if(body) body.innerHTML = html;
    if(typeof syncDetailStickyOffsets === 'function') syncDetailStickyOffsets();
    if(typeof updateLocaleBar === 'function') updateLocaleBar(activeMainTab);
    bindScrollSpy();
    if(typeof refreshTableOverflowTooltips === 'function') refreshTableOverflowTooltips(body || document);
  };

  // Detail: remove Asset of Flash Sale Products block; keep Promotion Channel Info table only.
  renderPromotion = function(p){
    const channelRows = (p.channels || []).map(ch => [ch.channel, ch.headline, ch.content]);
    return `<div class="panel promotion-panel">
      <div class="section-title">Promotion Channel Info</div>
      ${renderMiniTable(['Channel','Copy Headline','Copy Content'], channelRows)}
    </div>`;
  };

  // Campaign list: no Collection ID / Campaign ID / Collection Name filters.
  getFilteredCampaignRows = function(){
    const fName = byId('fName') ? byId('fName').value.trim().toLowerCase() : '';
    const fTheme = getSelectValues('fTheme');
    const fGrade = getSelectValues('fGrade');
    const fStatus = getSelectValues('fStatus');
    return CAMPAIGNS.filter(r => {
      if(fName && !r.campaignName.toLowerCase().includes(fName)) return false;
      if(fTheme.length && !fTheme.includes(r.theme)) return false;
      if(fGrade.length && !fGrade.includes(r.grade)) return false;
      if(!passListRegionFilter(r)) return false;
      if(fStatus.length && !fStatus.includes(r.status)) return false;
      return true;
    });
  };

  renderTable = function(){
    if(typeof renderListRegionFilter === 'function') renderListRegionFilter();
    const all = getFilteredCampaignRows();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if(pageNum > totalPages) pageNum = totalPages;
    if(pageNum < 1) pageNum = 1;
    const start = (pageNum - 1) * pageSize;
    const rows = all.slice(start, start + pageSize);
    const tbody = byId('tbody');
    if(!tbody) return;
    tbody.innerHTML = rows.map(r => {
      const expanded = CAMPAIGN_EXPANDED.has(String(r.campaignId));
      const parent = `<tr class="campaign-parent-row ${expanded ? 'expanded' : ''}">
        <td class="sticky s-chk"><button class="campaign-expand-btn" aria-label="${expanded ? 'Collapse' : 'Expand'} campaign ${r.campaignId}" onclick="toggleCampaignExpand(${r.campaignId})">${expanded ? '▾' : '▸'}</button></td>
        <td class="link-name sticky s-l4" onclick="openDetail(${r.campaignId})">${safeEscape(r.campaignName)}</td>
        <td>${safeEscape(r.theme)}</td>
        <td class="grade">${safeEscape(r.grade)}</td>
        <td>${safeEscape(getCampaignRegions(r).join(', '))}</td>
        <td><span class="badge-stage ${r.status}">${STATUS_LABEL[r.status]}</span></td>
        <td>${safeEscape(r.createTime)}</td>
        <td>${safeEscape(r.updateTime)}</td>
        <td>${safeEscape(r.creator)}</td>
      </tr>`;
      return expanded ? parent + `<tr class="campaign-change-row"><td colspan="9">${renderCampaignChangePanel(r.campaignId)}</td></tr>` : parent;
    }).join('');
    const empty = byId('emptyHint');
    if(empty) empty.style.display = rows.length ? 'none' : 'block';
    renderPagination(total, totalPages);
    if(typeof enhanceCustomSelects === 'function') enhanceCustomSelects(document);
    if(typeof refreshTableOverflowTooltips === 'function') refreshTableOverflowTooltips(byId('page-list'));
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
  };

  currentPageRows = function(){
    const all = getFilteredCampaignRows();
    const start = (pageNum - 1) * pageSize;
    return all.slice(start, start + pageSize);
  };

  resetFilter = function(){
    ['fName'].forEach(id => { if(byId(id)) byId(id).value = ''; });
    ['fTheme','fGrade','fStatus'].forEach(id => clearFilterSelect(id));
    LIST_REGION_FILTER.clear();
    listRegionDropdownOpen = false;
    pageNum = 1;
    renderTable();
  };

  digestOpenList = function(opts){
    opts = opts || {};
    const nameInput = byId('fName');
    if(nameInput) nameInput.value = '';
    ['fTheme','fGrade','fStatus'].forEach(id => digestSetFilterSelect(id, ''));
    LIST_REGION_FILTER.clear();
    listRegionDropdownOpen = false;
    if(opts.status) digestSetFilterSelect('fStatus', opts.status);
    if(opts.region) LIST_REGION_FILTER.add(opts.region);
    pageNum = 1;
    renderTable();
    switchPage('list');
    const main = document.querySelector('.main'); if(main) main.scrollTop = 0;
    if(opts.toast) showToast(opts.toast);
  };

  // Clicking a removed Collection change falls back to Campaign Basic Info.
  jumpToChange = function(id, type, locale, key){
    const tab = type === 'collection' ? 'campaign' : (TYPE_TO_TAB[type] || 'campaign');
    openDetail(Number(id), { tab, locale: locale || null });
  };

  // Patch static table header if the page was loaded before the override runs.
  const theadRow = document.querySelector('#page-list table thead tr');
  if(theadRow){
    theadRow.innerHTML = `<th class="sticky s-chk"></th>
      <th class="sticky s-l4">Campaign Name</th>
      <th>Theme</th>
      <th>Grade</th>
      <th>Campaign Region</th>
      <th>Campaign Status</th>
      <th>Create Time</th>
      <th>Update Time</th>
      <th>Creator</th>`;
  }
  ['fCol','fColName','fCmp'].forEach(id => {
    const el = byId(id);
    const field = el && el.closest('.field');
    if(field) field.remove();
  });

  try { renderTable(); } catch(err) { console.warn('[campaign slim patch] renderTable', err); }
  try { if(byId('page-detail') && byId('page-detail').classList.contains('active')) { renderTabs(); renderTabBody(); } } catch(err) {}
})();

;

(function(){
  function removedSectionChange(ch){
    const scope = String((ch && ch.scope) || '');
    const field = String((ch && ch.field) || '');
    return ch && (ch.type === 'collection' || /Collection Basic Info/i.test(scope) || /Asset of Flash Sale Products/i.test(scope) || /Asset of Flash Sale Products/i.test(field));
  }
  function visibleChangesForCampaign(id){
    const raw = (typeof changesOf === 'function') ? changesOf(id) : ((CHANGES[id] || CHANGES[Number(id)] || []).slice().sort((a,b)=>parseTime(b.time)-parseTime(a.time)));
    return raw.filter(ch => !removedSectionChange(ch));
  }
  function mechanismMeta(id){
    const values = (window.campaignMechanismValuesForDigest ? window.campaignMechanismValuesForDigest(id) : []);
    return { hasMechanism: values.length > 0, values, label: values.length > 0 ? 'Campaign with mechanism' : 'Campaign without mechanism', title: values.length > 0 ? values.join(', ') : 'Campaign Mechanism is empty' };
  }
  digestHighlights = function(){
    const day = digestDateStr();
    const groups = [];
    Object.keys(CHANGES || {}).forEach(id => {
      const c = getCampaignById(id); if(!c) return;
      const list = visibleChangesForCampaign(id)
        .filter(ch => String(ch.time).slice(0, 10) === day)
        .sort((a, b) => parseTime(b.time) - parseTime(a.time));
      if(!list.length) return;
      const meta = mechanismMeta(id);
      groups.push({ id:String(id), c, list, latest:parseTime(list[0].time), hasMechanism:meta.hasMechanism, mechanismValues:meta.values, mechanismLabel:meta.label, mechanismTitle:meta.title });
    });
    const statusPriority = { live:0, upcoming:1, draft:2, ended:3 };
    groups.sort((a, b) => {
      if(a.hasMechanism !== b.hasMechanism) return a.hasMechanism ? -1 : 1;
      return ((statusPriority[a.c.status] ?? 9) - (statusPriority[b.c.status] ?? 9)) || (b.latest - a.latest);
    });
    return { day, groups };
  };
  renderCampaignChangePanel = function(id){
    const list = visibleChangesForCampaign(id);
    if(!list.length){
      return `<div class="campaign-change-panel"><div class="campaign-no-change">No change records for this campaign.</div></div>`;
    }
    return `<div class="campaign-change-panel">
      <div class="campaign-change-title">Change Records <span class="campaign-change-count">${list.length} update${list.length > 1 ? 's' : ''}</span></div>
      <div class="campaign-changes-scroll">
        <table class="campaign-changes-table">
          <thead><tr>
            <th>Operation</th>
            <th>Change Section</th>
            <th>Field</th>
            <th>Change</th>
            <th>Locale</th>
            <th>Update Time</th>
          </tr></thead>
          <tbody>${list.map(ch => `<tr>
            <td><span class="op-pill op-${ch.op}">${OP_LABEL[ch.op] || ch.op || '-'}</span></td>
            <td title="${escape(campaignChangeEventName(ch))}">${escape(campaignChangeEventName(ch))}</td>
            <td title="${escape(ch.field || '-')}">${escape(ch.field || '-')}</td>
            <td>${campaignChangeDiffHtml(ch)}</td>
            <td>${ch.locale && ch.locale !== '-' ? `<span class="chip mini">${escape(ch.locale)}</span>` : '<span class="muted">-</span>'}</td>
            <td class="muted" title="${escape(ch.time || '-')}">${escape(ch.time || '-')}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;
  };
  try { renderDigest(); renderTable(); } catch(err) { console.warn('[campaign slim change filter]', err); }
})();

;

(function(){
  function injectChangeRecordsColgroup(html){
    if(typeof html !== 'string' || html.indexOf('campaign-changes-table') < 0) return html;
    if(html.indexOf('campaign-changes-responsive-colgroup') >= 0) return html;
    return html.replace(
      '<table class="campaign-changes-table">',
      '<table class="campaign-changes-table"><colgroup class="campaign-changes-responsive-colgroup"><col><col><col><col><col><col></colgroup>'
    );
  }
  if(typeof renderCampaignChangePanel === 'function'){
    const previousRenderCampaignChangePanel = renderCampaignChangePanel;
    renderCampaignChangePanel = function(id){
      return injectChangeRecordsColgroup(previousRenderCampaignChangePanel.apply(this, arguments));
    };
  }
  try{
    if(typeof renderTable === 'function') renderTable();
  }catch(err){
    console.warn('[change records responsive patch]', err);
  }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function e(v){ return (typeof escape === 'function') ? escape(v == null ? '' : v) : String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]; }); }
  function pTime(s){ return (typeof parseTime === 'function') ? parseTime(s) : Date.parse(String(s || '').replace(' ', 'T')) || 0; }
  function parseDateLike(value){
    if(!value) return 0;
    let s = String(value).trim();
    if(!s || s === '/' || s.toLowerCase() === 'null') return 0;
    // Strip display timezone suffix such as "Asia/Hong_Kong"; campaign period dates are local market time in this demo.
    s = s.replace(/\s+Asia\/[A-Za-z_]+\s*$/,'');
    const m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/);
    if(m){
      const dt = m[1] + 'T' + (m[2] || '00:00:00');
      const t = Date.parse(dt);
      return isNaN(t) ? 0 : t;
    }
    const t = Date.parse(s.replace(' ', 'T'));
    return isNaN(t) ? 0 : t;
  }
  function getRawDetail(c){
    const id = c && c.campaignId;
    return (typeof DETAILS !== 'undefined' && (DETAILS[id] || DETAILS[Number(id)])) || null;
  }
  function getCampaignTiming(c){
    const d = getRawDetail(c);
    const campaign = d && d.campaign ? d.campaign : {};
    const launch = parseDateLike(campaign.launchDate || c.launchDate || c.createTime);
    const period = campaign.startEndDate || c.startEndDate || '';
    let end = 0;
    if(period && String(period).includes(' - ')){
      const parts = String(period).split(' - ');
      end = parseDateLike(parts[parts.length - 1]);
    }
    return { launch, end };
  }
  window.getComputedCampaignStatus = function(c){
    const now = Date.now();
    const t = getCampaignTiming(c);
    if(t.launch && now < t.launch) return 'upcoming';
    if(t.end && now > t.end) return 'ended';
    if(t.launch || t.end) return 'ongoing';
    // Fallback for incomplete data.
    if(c && c.status === 'ended') return 'ended';
    if(c && (c.status === 'live' || c.status === 'ongoing')) return 'ongoing';
    return 'upcoming';
  };
  window.getComputedCampaignStatusLabel = function(c){
    const st = getComputedCampaignStatus(c);
    return st === 'ongoing' ? 'Ongoing' : st === 'upcoming' ? 'Upcoming' : 'Ended';
  };
  if(typeof STATUS_LABEL !== 'undefined'){
    STATUS_LABEL.ongoing = 'Ongoing';
    STATUS_LABEL.upcoming = 'Upcoming';
    STATUS_LABEL.ended = 'Ended';
  }
  function mechanismValues(c){
    if(window.campaignMechanismValuesForDigest) return window.campaignMechanismValuesForDigest(c.campaignId || c);
    const d = getRawDetail(c) || {};
    const mech = d.campaign && d.campaign.mechanism;
    const arr = Array.isArray(mech) ? mech : String(mech || '').split(/[,;|]/);
    return arr.map(v => String(v || '').trim()).filter(v => v && v !== '/' && v.toLowerCase() !== 'null' && v.toLowerCase() !== 'none');
  }
  function campaignHasMechanism(c){ return mechanismValues(c).length > 0; }
  function removedSectionChange(ch){
    const scope = String((ch && ch.scope) || '');
    const field = String((ch && ch.field) || '');
    return ch && (ch.type === 'collection' || /Collection Basic Info/i.test(scope) || /Asset of Flash Sale Products/i.test(scope) || /Asset of Flash Sale Products/i.test(field));
  }
  function visibleChanges(id){
    const raw = (typeof CHANGES !== 'undefined' && (CHANGES[id] || CHANGES[Number(id)] || [])) || [];
    return raw.slice().filter(ch => !removedSectionChange(ch)).sort((a,b) => pTime(b.time) - pTime(a.time));
  }
  function digestDay(){
    let max = 0;
    Object.keys(CHANGES || {}).forEach(id => visibleChanges(id).forEach(ch => { const t = pTime(ch.time); if(t > max) max = t; }));
    if(max){
      const d = new Date(max), pad = n => String(n).padStart(2,'0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
    return (typeof digestDateStr === 'function') ? digestDateStr() : '';
  }
  digestHighlights = function(){
    const day = digestDay();
    const groups = [];
    Object.keys(CHANGES || {}).forEach(id => {
      const c = (typeof getCampaignById === 'function') ? getCampaignById(id) : (CAMPAIGNS || []).find(x => String(x.campaignId) === String(id));
      if(!c) return;
      const list = visibleChanges(id).filter(ch => String(ch.time).slice(0,10) === day).sort((a,b) => pTime(b.time) - pTime(a.time));
      if(!list.length) return;
      const hasMech = campaignHasMechanism(c);
      groups.push({ id:String(id), c, list, latest:pTime(list[0].time), hasMechanism:hasMech, mechanismValues:mechanismValues(c), computedStatus:getComputedCampaignStatus(c) });
    });
    const statusPriority = { ongoing:0, upcoming:1, ended:2 };
    groups.sort((a,b) => {
      if(a.hasMechanism !== b.hasMechanism) return a.hasMechanism ? -1 : 1;
      return ((statusPriority[a.computedStatus] ?? 9) - (statusPriority[b.computedStatus] ?? 9)) || (b.latest - a.latest);
    });
    return { day, groups };
  };
  digestStatusCounts = function(){
    const counts = { total:0, nonEnded:0, upcoming:0, ongoing:0, ended:0 };
    (CAMPAIGNS || []).forEach(c => {
      const st = getComputedCampaignStatus(c);
      counts.total++;
      counts[st] = (counts[st] || 0) + 1;
      if(st !== 'ended') counts.nonEnded++;
    });
    counts[''] = counts.total;
    return counts;
  };
  function mechanismOverviewStats(groups){
    const stats = { withTotal:0, withoutTotal:0, withChangedCampaigns:0, withoutChangedCampaigns:0, withChangeRecords:0, withoutChangeRecords:0 };
    (CAMPAIGNS || []).forEach(c => { if(campaignHasMechanism(c)) stats.withTotal++; else stats.withoutTotal++; });
    groups.forEach(g => {
      if(g.hasMechanism){ stats.withChangedCampaigns++; stats.withChangeRecords += (g.list || []).length; }
      else { stats.withoutChangedCampaigns++; stats.withoutChangeRecords += (g.list || []).length; }
    });
    return stats;
  }
  function renderOverview(groups){
    const status = digestStatusCounts();
    const mech = mechanismOverviewStats(groups);
    return `<div class="dg-overview-grid">
      <div class="dg-overview-card non-ended">
        <div class="dg-overview-label">Current non-ended campaigns</div>
        <div class="dg-overview-num">${status.nonEnded}</div>
      </div>
      <div class="dg-overview-card upcoming">
        <div class="dg-overview-label">Upcoming campaigns</div>
        <div class="dg-overview-num">${status.upcoming || 0}</div>
      </div>
      <div class="dg-overview-card ongoing">
        <div class="dg-overview-label">Ongoing campaigns</div>
        <div class="dg-overview-num">${status.ongoing || 0}</div>
      </div>
      <div class="dg-overview-card feature with-mechanism">
        <div class="dg-overview-label">Campaign with mechanism</div>
        <div class="dg-overview-num">${mech.withTotal}</div>
        <div class="dg-overview-sub"><b>${mech.withChangedCampaigns}</b> changed campaign${mech.withChangedCampaigns === 1 ? '' : 's'} · <b>${mech.withChangeRecords}</b> change record${mech.withChangeRecords === 1 ? '' : 's'}</div>
      </div>
      <div class="dg-overview-card feature without-mechanism">
        <div class="dg-overview-label">Campaign without mechanism</div>
        <div class="dg-overview-num">${mech.withoutTotal}</div>
        <div class="dg-overview-sub"><b>${mech.withoutChangedCampaigns}</b> changed campaign${mech.withoutChangedCampaigns === 1 ? '' : 's'} · <b>${mech.withoutChangeRecords}</b> change record${mech.withoutChangeRecords === 1 ? '' : 's'}</div>
      </div>
    </div>`;
  }
  function renderDigestGroupV2(g){
    const expanded = DIGEST_GROUP_EXPANDED.has(g.id);
    const shown = expanded ? g.list : g.list.slice(0, DIGEST_PREVIEW_COUNT);
    const more = g.list.length - DIGEST_PREVIEW_COUNT;
    const regions = (typeof getCampaignRegions === 'function') ? getCampaignRegions(g.c).join(', ') : '';
    const chipCls = g.hasMechanism ? 'with' : 'without';
    const mechTitle = g.hasMechanism ? (g.mechanismValues || []).join(', ') : 'Campaign Mechanism is empty';
    const status = g.computedStatus || getComputedCampaignStatus(g.c);
    const statusLabel = getComputedCampaignStatusLabel(g.c);
    return `<article class="dg-group ${g.hasMechanism ? 'dg-group-with-mechanism' : 'dg-group-without-mechanism'}">
      <header class="dg-group-head">
        <div class="dg-group-title">
          <span class="link-name" role="button" tabindex="0" onclick="openDetail(${Number(g.id)})" onkeydown="if(event.key==='Enter'){openDetail(${Number(g.id)})}" title="Open campaign detail">${e(g.c.campaignName)}</span>
          <span class="badge-stage ${status}">${statusLabel}</span>
          <span class="chip mini">${e(regions)}</span>
          <span class="dg-mech-chip ${chipCls}" title="${e(mechTitle)}">${g.hasMechanism ? 'Campaign with mechanism' : 'Campaign without mechanism'}</span>
        </div>
        <div class="dg-group-meta"><span class="dg-count">${g.list.length} update${g.list.length > 1 ? 's' : ''}</span></div>
      </header>
      <div class="dg-changes">${shown.map(ch => digestRenderChange(g.id, ch)).join('')}</div>
      ${more > 0 ? `<button class="dg-more" onclick="toggleDigestGroup('${g.id}')">${expanded ? 'Show less' : `Show all ${g.list.length} updates`}</button>` : ''}
    </article>`;
  }
  function renderGroupedHighlightsV2(groups){
    const withGroups = (groups || []).filter(g => g.hasMechanism);
    const withoutGroups = (groups || []).filter(g => !g.hasMechanism);
    const section = (label, arr) => {
      const updateCount = arr.reduce((sum, g) => sum + ((g.list || []).length), 0);
      const body = arr.length
        ? arr.map(g => renderDigestGroupV2(g)).join('')
        : `<div class="dg-empty dg-empty-inline"><div class="dg-empty-title">No changes today</div></div>`;
      return `<div class="dg-mech-section"><div class="dg-mech-section-title"><span>${label}</span><span class="count">${arr.length} campaign${arr.length === 1 ? '' : 's'} · ${updateCount} update${updateCount === 1 ? '' : 's'}</span></div>${body}</div>`;
    };
    return section('Campaign with mechanism', withGroups) + section('Campaign without mechanism', withoutGroups);
  }
  function renderDigestV2(){
    const box = byId('digestBody'); if(!box) return;
    const result = digestHighlights();
    const groups = result.groups || [];
    const totalChanges = groups.reduce((s,g) => s + (g.list || []).length, 0);
    const hero = `<div class="page-card dg-hero">
      <div class="dg-hero-main"><div><h2>Campaign Notification Daily Report</h2><div class="dg-date">${typeof digestDateLabel === 'function' ? digestDateLabel() : ''}</div></div></div>
      <div class="dg-hero-summary"><b>${totalChanges}</b> update${totalChanges === 1 ? '' : 's'} across <b>${groups.length}</b> changed campaign${groups.length === 1 ? '' : 's'} today</div>
    </div>`;
    const highlightsBody = renderGroupedHighlightsV2(groups);
    const highlights = `<div class="page-card dg-card dg-highlights">${highlightsBody}</div>`;
    box.innerHTML = `${hero}<div class="dg-section-title">Overview</div>${renderOverview(groups)}<div class="dg-section-title">Change Record</div>${highlights}`;
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
  }
  renderDigest = renderDigestV2;

  // Keep Campaign page status filter/display aligned with the same date-based status logic.
  function patchStatusFilter(){
    const sel = byId('fStatus');
    if(!sel) return;
    const selected = (typeof getSelectValues === 'function') ? getSelectValues(sel) : [];
    sel.innerHTML = '<option value="">All</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="ended">Ended</option>';
    Array.from(sel.options).forEach(o => { o.selected = selected.includes(o.value) || (!selected.length && o.value === ''); });
    if(typeof refreshCustomSelect === 'function' && sel._customSelect) refreshCustomSelect(sel);
  }
  patchStatusFilter();
  if(typeof getFilteredCampaignRows === 'function'){
    const oldPassListRegionFilter = (typeof passListRegionFilter === 'function') ? passListRegionFilter : function(){ return true; };
    getFilteredCampaignRows = function(){
      const fName = byId('fName') ? byId('fName').value.trim().toLowerCase() : '';
      const fTheme = (typeof getSelectValues === 'function') ? getSelectValues('fTheme') : [];
      const fGrade = (typeof getSelectValues === 'function') ? getSelectValues('fGrade') : [];
      const fStatus = (typeof getSelectValues === 'function') ? getSelectValues('fStatus') : [];
      return (CAMPAIGNS || []).filter(r => {
        if(fName && !String(r.campaignName || '').toLowerCase().includes(fName)) return false;
        if(fTheme.length && !fTheme.includes(r.theme)) return false;
        if(fGrade.length && !fGrade.includes(r.grade)) return false;
        if(!oldPassListRegionFilter(r)) return false;
        if(fStatus.length && !fStatus.includes(getComputedCampaignStatus(r))) return false;
        return true;
      });
    };
  }
  if(typeof renderTable === 'function'){
    const previousRenderTable = renderTable;
    renderTable = function(){
      previousRenderTable.apply(this, arguments);
      patchStatusFilter();
      const rows = document.querySelectorAll('#page-list .campaign-parent-row');
      rows.forEach(row => {
        const nameEl = row.querySelector('td.s-l4');
        if(!nameEl) return;
        const name = nameEl.textContent.trim();
        const c = (CAMPAIGNS || []).find(x => String(x.campaignName || '').trim() === name);
        if(!c) return;
        const statusCell = row.querySelector('td:nth-child(6)');
        if(!statusCell) return;
        const st = getComputedCampaignStatus(c);
        statusCell.innerHTML = `<span class="badge-stage ${st}">${getComputedCampaignStatusLabel(c)}</span>`;
      });
    };
  }
  try{ if(typeof renderDigest === 'function') renderDigest(); }catch(err){ console.warn('[digest overview status patch] renderDigest', err); }
  try{ if(typeof renderTable === 'function') renderTable(); }catch(err){ console.warn('[digest overview status patch] renderTable', err); }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function e(v){ return (typeof escape === 'function') ? escape(v == null ? '' : v) : String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]; }); }
  function parseDateLikeV3(value){
    if(!value) return 0;
    var s = String(value).trim();
    if(!s || s === '/' || s.toLowerCase() === 'null') return 0;
    s = s.replace(/\s+Asia\/[A-Za-z_]+\s*$/,'');
    var m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/);
    if(m){
      var t = Date.parse(m[1] + 'T' + (m[2] || '00:00:00'));
      return isNaN(t) ? 0 : t;
    }
    var t2 = Date.parse(s.replace(' ', 'T'));
    return isNaN(t2) ? 0 : t2;
  }
  function rawDetailV3(c){
    var id = c && c.campaignId;
    return (typeof DETAILS !== 'undefined' && (DETAILS[id] || DETAILS[Number(id)] || DETAILS[String(id)])) || null;
  }
  function timingV3(c){
    var d = rawDetailV3(c);
    var campaign = d && d.campaign ? d.campaign : {};
    var launch = parseDateLikeV3(campaign.launchDate || c.launchDate || c.createTime);
    var period = campaign.startEndDate || c.startEndDate || '';
    var end = 0;
    if(period && String(period).indexOf(' - ') >= 0){
      var parts = String(period).split(' - ');
      end = parseDateLikeV3(parts[parts.length - 1]);
    }
    return { launch:launch, end:end };
  }
  function statusAtV3(c, refTime){
    var t = timingV3(c);
    if(t.launch && refTime < t.launch) return 'upcoming';
    if(t.end && refTime > t.end) return 'ended';
    if(t.launch || t.end) return 'ongoing';
    if(c && c.status === 'ended') return 'ended';
    if(c && (c.status === 'live' || c.status === 'ongoing')) return 'ongoing';
    return 'upcoming';
  }
  function statusCountsAtV3(refTime){
    var counts = { total:0, nonEnded:0, upcoming:0, ongoing:0, ended:0 };
    (CAMPAIGNS || []).forEach(function(c){
      var st = statusAtV3(c, refTime);
      counts.total++;
      counts[st] = (counts[st] || 0) + 1;
      if(st !== 'ended') counts.nonEnded++;
    });
    return counts;
  }
  function deltaHtmlV3(delta){
    var cls = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    var sign = delta > 0 ? '+' : '';
    return '<span class="dg-delta '+cls+'">'+sign+delta+' vs yesterday</span>';
  }
  function renderCampaignOverviewV3(){
    var now = Date.now();
    var yesterday = now - 24 * 60 * 60 * 1000;
    var today = statusCountsAtV3(now);
    var prev = statusCountsAtV3(yesterday);
    var cards = [
      { cls:'non-ended', label:'Total campaigns', value:today.nonEnded || 0, delta:(today.nonEnded || 0) - (prev.nonEnded || 0) },
      { cls:'upcoming', label:'Upcoming campaigns', value:today.upcoming || 0, delta:(today.upcoming || 0) - (prev.upcoming || 0) },
      { cls:'ongoing', label:'Ongoing campaigns', value:today.ongoing || 0, delta:(today.ongoing || 0) - (prev.ongoing || 0) }
    ];
    return '<div class="dg-overview-grid dg-overview-grid-v3">' + cards.map(function(card){
      return '<div class="dg-overview-card '+card.cls+'">'
        + '<div class="dg-overview-label">'+e(card.label)+'</div>'
        + '<div class="dg-overview-num-row"><div class="dg-overview-num">'+card.value+'</div>'+deltaHtmlV3(card.delta)+'</div>'
        + '</div>';
    }).join('') + '</div>';
  }
  function renderChangeRecordSummaryV3(groups){
    groups = groups || [];
    var withGroups = groups.filter(function(g){ return !!g.hasMechanism; });
    var withoutGroups = groups.filter(function(g){ return !g.hasMechanism; });
    var withRecords = withGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    var withoutRecords = withoutGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    return '<div class="dg-change-record-summary">'
      + '<div class="dg-change-record-summary-card total"><div class="dg-change-record-summary-label">Changed campaigns today</div><div class="dg-change-record-summary-num">'+groups.length+'</div></div>'
      + '<div class="dg-change-record-summary-card with"><div class="dg-change-record-summary-label">Campaign with mechanism</div><div class="dg-change-record-summary-num">'+withGroups.length+'</div><div class="dg-change-record-summary-sub"><b>'+withRecords+'</b> change record'+(withRecords === 1 ? '' : 's')+'</div></div>'
      + '<div class="dg-change-record-summary-card without"><div class="dg-change-record-summary-label">Campaign without mechanism</div><div class="dg-change-record-summary-num">'+withoutGroups.length+'</div><div class="dg-change-record-summary-sub"><b>'+withoutRecords+'</b> change record'+(withoutRecords === 1 ? '' : 's')+'</div></div>'
      + '</div>';
  }
  function renderDigestGroupV3(g){
    var expanded = (typeof DIGEST_GROUP_EXPANDED !== 'undefined' && DIGEST_GROUP_EXPANDED.has(g.id));
    var previewCount = (typeof DIGEST_PREVIEW_COUNT !== 'undefined') ? DIGEST_PREVIEW_COUNT : 3;
    var list = g.list || [];
    var shown = expanded ? list : list.slice(0, previewCount);
    var more = list.length - previewCount;
    var regions = (typeof getCampaignRegions === 'function') ? getCampaignRegions(g.c).join(', ') : (g.c && g.c.team ? g.c.team : '');
    var status = g.computedStatus || (typeof getComputedCampaignStatus === 'function' ? getComputedCampaignStatus(g.c) : statusAtV3(g.c, Date.now()));
    var statusLabel = (typeof getComputedCampaignStatusLabel === 'function') ? getComputedCampaignStatusLabel(g.c) : (status === 'ongoing' ? 'Ongoing' : status === 'upcoming' ? 'Upcoming' : 'Ended');
    var mechTitle = g.hasMechanism ? ((g.mechanismValues || []).join(', ') || 'Campaign Mechanism') : 'Campaign Mechanism is empty';
    var changeHtml = shown.map(function(ch){ return (typeof digestRenderChange === 'function') ? digestRenderChange(g.id, ch) : ''; }).join('');
    return '<article class="dg-group '+(g.hasMechanism ? 'dg-group-with-mechanism' : 'dg-group-without-mechanism')+'">'
      + '<header class="dg-group-head"><div class="dg-group-title">'
      + '<span class="link-name" role="button" tabindex="0" onclick="openDetail('+Number(g.id)+')" onkeydown="if(event.key===\'Enter\'){openDetail('+Number(g.id)+')}" title="Open campaign detail">'+e(g.c && g.c.campaignName)+'</span>'
      + '<span class="badge-stage '+e(status)+'">'+e(statusLabel)+'</span>'
      + '<span class="chip mini">'+e(regions)+'</span>'
      + '<span class="dg-mech-chip '+(g.hasMechanism ? 'with' : 'without')+'" title="'+e(mechTitle)+'">'+(g.hasMechanism ? 'Campaign with mechanism' : 'Campaign without mechanism')+'</span>'
      + '</div><div class="dg-group-meta"><span class="dg-count">'+list.length+' update'+(list.length === 1 ? '' : 's')+'</span></div></header>'
      + '<div class="dg-changes">'+changeHtml+'</div>'
      + (more > 0 ? '<button class="dg-more" onclick="toggleDigestGroup(\''+e(g.id)+'\')">'+(expanded ? 'Show less' : 'Show all '+list.length+' updates')+'</button>' : '')
      + '</article>';
  }
  function renderGroupedHighlightsV3(groups){
    groups = groups || [];
    var withGroups = groups.filter(function(g){ return !!g.hasMechanism; });
    var withoutGroups = groups.filter(function(g){ return !g.hasMechanism; });
    function section(label, arr){
      var updateCount = arr.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
      var body = arr.length ? arr.map(renderDigestGroupV3).join('') : '<div class="dg-empty dg-empty-inline"><div class="dg-empty-title">No changes today</div></div>';
      return '<div class="dg-mech-section"><div class="dg-mech-section-title"><span>'+e(label)+'</span><span class="count">'+arr.length+' campaign'+(arr.length === 1 ? '' : 's')+' · '+updateCount+' update'+(updateCount === 1 ? '' : 's')+'</span></div>'+body+'</div>';
    }
    return section('Campaign with mechanism', withGroups) + section('Campaign without mechanism', withoutGroups);
  }
  function renderDigestV3(){
    var box = byId('digestBody');
    if(!box) return;
    var result = (typeof digestHighlights === 'function') ? digestHighlights() : { groups:[] };
    var groups = result.groups || [];
    var totalChanges = groups.reduce(function(s,g){ return s + ((g.list || []).length); }, 0);
    var dateLabel = (typeof digestDateLabel === 'function') ? digestDateLabel() : '';
    var hero = '<div class="page-card dg-hero">'
      + '<div class="dg-hero-main"><div><h2>Campaign Notification Daily Report</h2><div class="dg-date">'+e(dateLabel)+'</div></div></div>'
      + '<div class="dg-hero-summary"><b>'+totalChanges+'</b> update'+(totalChanges === 1 ? '' : 's')+' across <b>'+groups.length+'</b> changed campaign'+(groups.length === 1 ? '' : 's')+' today</div>'
      + '</div>';
    var highlightsBody = renderGroupedHighlightsV3(groups);
    var highlights = '<div class="page-card dg-card dg-highlights">'+renderChangeRecordSummaryV3(groups)+highlightsBody+'</div>';
    box.innerHTML = hero + '<div class="dg-section-title">Campaign Overview</div>' + renderCampaignOverviewV3() + '<div class="dg-section-title">Change Record</div>' + highlights;
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
  }
  window.renderDigest = renderDigestV3;
  try { renderDigestV3(); } catch(err) { console.warn('[digest overview change counts patch]', err); }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function e(v){
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function pTimeV4(value){
    if(typeof parseTime === 'function') return parseTime(value);
    var t = Date.parse(String(value || '').replace(' ', 'T'));
    return isNaN(t) ? 0 : t;
  }
  function parseDateLikeV4(value){
    if(!value) return 0;
    var s = String(value).trim();
    if(!s || s === '/' || s.toLowerCase() === 'null') return 0;
    s = s.replace(/\s+Asia\/[A-Za-z_]+\s*$/,'');
    var m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/);
    if(m){
      var t = Date.parse(m[1] + 'T' + (m[2] || '00:00:00'));
      return isNaN(t) ? 0 : t;
    }
    var t2 = Date.parse(s.replace(' ', 'T'));
    return isNaN(t2) ? 0 : t2;
  }
  function detailForCampaignV4(c){
    var id = c && c.campaignId;
    return (typeof DETAILS !== 'undefined' && (DETAILS[id] || DETAILS[Number(id)] || DETAILS[String(id)])) || null;
  }
  function campaignTimingV4(c){
    var d = detailForCampaignV4(c);
    var campaign = d && d.campaign ? d.campaign : {};
    var launch = parseDateLikeV4(campaign.launchDate || (c && c.launchDate) || (c && c.createTime));
    var period = campaign.startEndDate || (c && c.startEndDate) || '';
    var end = 0;
    if(period && String(period).indexOf(' - ') >= 0){
      var parts = String(period).split(' - ');
      end = parseDateLikeV4(parts[parts.length - 1]);
    }
    return { launch:launch, end:end };
  }
  function computedStatusAtV4(c, refTime){
    var t = campaignTimingV4(c);
    if(t.launch && refTime < t.launch) return 'upcoming';
    if(t.end && refTime > t.end) return 'ended';
    if(t.launch || t.end) return 'ongoing';
    if(c && c.status === 'ended') return 'ended';
    if(c && (c.status === 'live' || c.status === 'ongoing')) return 'ongoing';
    return 'upcoming';
  }
  function statusCountsAtV4(refTime){
    var counts = { total:0, nonEnded:0, upcoming:0, ongoing:0, ended:0 };
    (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).forEach(function(c){
      var st = computedStatusAtV4(c, refTime);
      counts.total += 1;
      counts[st] = (counts[st] || 0) + 1;
      if(st !== 'ended') counts.nonEnded += 1;
    });
    return counts;
  }
  function deltaHtmlV4(delta){
    if(delta === 0) return '<span class="dg-delta flat">no changes vs yesterday</span>';
    var cls = delta > 0 ? 'up' : 'down';
    var sign = delta > 0 ? '+' : '';
    return '<span class="dg-delta '+cls+'">'+sign+delta+' vs yesterday</span>';
  }
  function recordTextV4(n){ return n + ' change record' + (n === 1 ? '' : 's'); }
  function updateTextV4(n){ return n + ' update' + (n === 1 ? '' : 's'); }
  function opKeyV4(op){
    op = String(op || '').toLowerCase();
    if(op === 'added') return 'add';
    if(op === 'updated') return 'update';
    if(op === 'removed' || op === 'delete' || op === 'deleted') return 'remove';
    return op || 'other';
  }
  function opRankV4(op){
    var key = opKeyV4(op);
    if(key === 'add') return 0;
    if(key === 'update') return 1;
    if(key === 'remove') return 2;
    return 9;
  }
  function opLabelV4(op){
    var key = opKeyV4(op);
    if(typeof OP_LABEL !== 'undefined' && OP_LABEL[key]) return OP_LABEL[key];
    if(key === 'add') return 'Added';
    if(key === 'update') return 'Updated';
    if(key === 'remove') return 'Removed';
    return key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Other';
  }
  function changeDateRankV4(ch){
    var raw = ch && ch.time ? String(ch.time).slice(0, 10) : '';
    var t = raw ? Date.parse(raw + 'T00:00:00') : 0;
    return isNaN(t) ? 0 : t;
  }
  function sortChangesByOperationV4(list){
    return (list || []).slice().sort(function(a,b){
      // Primary: latest Update Time date first.
      var dateDiff = changeDateRankV4(b) - changeDateRankV4(a);
      if(dateDiff) return dateDiff;
      // Same date: finish Added first, then Updated, then Removed/other.
      var opDiff = opRankV4(a && a.op) - opRankV4(b && b.op);
      if(opDiff) return opDiff;
      // Same date and same Operation: newest exact Update Time first.
      return pTimeV4(b && b.time) - pTimeV4(a && a.time);
    });
  }
  function groupedByOperationV4(list){
    var sorted = sortChangesByOperationV4(list);
    var order = ['add','update','remove','other'];
    var map = { add:[], update:[], remove:[], other:[] };
    sorted.forEach(function(ch){
      var key = opKeyV4(ch && ch.op);
      if(!map[key]) key = 'other';
      map[key].push(ch);
    });
    return order.map(function(key){ return { key:key, label:opLabelV4(key), list:map[key] || [] }; }).filter(function(g){ return g.list.length; });
  }
  function removedSectionChangeV4(ch){
    var scope = String((ch && ch.scope) || '');
    var field = String((ch && ch.field) || '');
    return !!(ch && (ch.type === 'collection' || /Collection Basic Info/i.test(scope) || /Asset of Flash Sale Products/i.test(scope) || /Asset of Flash Sale Products/i.test(field)));
  }
  function visibleChangesForCampaignV4(id){
    var list = [];
    if(typeof campaignChangeList === 'function') list = campaignChangeList(id) || [];
    else if(typeof CHANGES !== 'undefined') list = (CHANGES[id] || CHANGES[Number(id)] || CHANGES[String(id)] || []).slice();
    return (list || []).filter(function(ch){ return !removedSectionChangeV4(ch); });
  }
  function diffHtmlV4(ch){
    if(typeof campaignChangeDiffHtml === 'function') return campaignChangeDiffHtml(ch);
    if(ch && ch.op === 'add') return '<span class="diff-add">+ '+e(ch.after || '')+'</span>';
    if(ch && ch.op === 'remove') return '<span class="diff-remove">− '+e(ch.before || '')+'</span>';
    return '<span class="diff-old">'+e(ch && ch.before || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+e(ch && ch.after || '')+'</span>';
  }
  function changeEventNameV4(ch){
    if(typeof campaignChangeEventName === 'function') return campaignChangeEventName(ch);
    return (typeof TYPE_LABEL !== 'undefined' && TYPE_LABEL[ch && ch.type]) || (ch && (ch.scope || ch.type)) || '-';
  }

  function renderCampaignOverviewV4(){
    var now = Date.now();
    var yesterday = now - 24 * 60 * 60 * 1000;
    var today = statusCountsAtV4(now);
    var prev = statusCountsAtV4(yesterday);
    var cards = [
      { cls:'non-ended', label:'Total campaigns', value:today.nonEnded || 0, delta:(today.nonEnded || 0) - (prev.nonEnded || 0) },
      { cls:'upcoming', label:'Upcoming campaigns', value:today.upcoming || 0, delta:(today.upcoming || 0) - (prev.upcoming || 0) },
      { cls:'ongoing', label:'Ongoing campaigns', value:today.ongoing || 0, delta:(today.ongoing || 0) - (prev.ongoing || 0) }
    ];
    return '<div class="dg-overview-grid dg-overview-grid-v3">' + cards.map(function(card){
      return '<div class="dg-overview-card '+card.cls+'">'
        + '<div class="dg-overview-label">'+e(card.label)+'</div>'
        + '<div class="dg-overview-num-row"><div class="dg-overview-num">'+card.value+'</div>'+deltaHtmlV4(card.delta)+'</div>'
        + '</div>';
    }).join('') + '</div>';
  }
  function renderChangeRecordSummaryV4(groups){
    groups = groups || [];
    var withGroups = groups.filter(function(g){ return !!g.hasMechanism; });
    var withoutGroups = groups.filter(function(g){ return !g.hasMechanism; });
    var withRecords = withGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    var withoutRecords = withoutGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    return '<div class="dg-change-record-summary">'
      + '<div class="dg-change-record-summary-card total"><div class="dg-change-record-summary-label">Changed campaigns today</div><div class="dg-change-record-summary-num">'+groups.length+'</div></div>'
      + '<div class="dg-change-record-summary-card with"><div class="dg-change-record-summary-label">Campaign with mechanism</div><div class="dg-change-record-num-row"><div class="dg-change-record-summary-num">'+withGroups.length+'</div><span class="dg-record-delta">'+recordTextV4(withRecords)+'</span></div></div>'
      + '<div class="dg-change-record-summary-card without"><div class="dg-change-record-summary-label">Campaign without mechanism</div><div class="dg-change-record-num-row"><div class="dg-change-record-summary-num">'+withoutGroups.length+'</div><span class="dg-record-delta">'+recordTextV4(withoutRecords)+'</span></div></div>'
      + '</div>';
  }
  function renderDigestOperationGroupsV4(id, list){
    // No extra Added / Updated section headers; keep Operation-based ordering only.
    var sorted = sortChangesByOperationV4(list);
    return sorted.map(function(ch){
      return (typeof digestRenderChange === 'function') ? digestRenderChange(id, ch) : '';
    }).join('');
  }
  window.DIGEST_GROUP_COLLAPSED = window.DIGEST_GROUP_COLLAPSED || new Set();
  window.toggleDigestGroup = function(id){
    var key = String(id);
    if(window.DIGEST_GROUP_COLLAPSED.has(key)) window.DIGEST_GROUP_COLLAPSED.delete(key);
    else window.DIGEST_GROUP_COLLAPSED.add(key);
    if(typeof renderDigest === 'function') renderDigest();
  };
  try { toggleDigestGroup = window.toggleDigestGroup; } catch(err) {}

  function renderDigestGroupV4(g){
    var sortedList = sortChangesByOperationV4(g.list || []);
    var regions = (typeof getCampaignRegions === 'function') ? getCampaignRegions(g.c).join(', ') : ((g.c && g.c.team) || '');
    var status = g.computedStatus || (typeof getComputedCampaignStatus === 'function' ? getComputedCampaignStatus(g.c) : computedStatusAtV4(g.c, Date.now()));
    var statusLabel = (typeof getComputedCampaignStatusLabel === 'function') ? getComputedCampaignStatusLabel(g.c) : (status === 'ongoing' ? 'Ongoing' : status === 'upcoming' ? 'Upcoming' : 'Ended');
    return '<article class="dg-group '+(g.hasMechanism ? 'dg-group-with-mechanism' : 'dg-group-without-mechanism')+'">'
      + '<header class="dg-group-head"><div class="dg-group-title">'
      + '<span class="link-name" role="button" tabindex="0" onclick="openDetail('+Number(g.id)+')" onkeydown="if(event.key===\'Enter\'){openDetail('+Number(g.id)+')}" title="Open campaign detail">'+e(g.c && g.c.campaignName)+'</span>'
      + '<span class="badge-stage '+e(status)+'">'+e(statusLabel)+'</span>'
      + '<span class="chip mini">'+e(regions)+'</span>'
      + '</div><div class="dg-group-meta"><span class="dg-count">'+updateTextV4(sortedList.length)+'</span></div></header>'
      + '<div class="dg-changes">'+renderDigestOperationGroupsV4(g.id, sortedList)+'</div>'
      + '</article>';
  }
  function renderGroupedHighlightsV4(groups){
    groups = groups || [];
    var withGroups = groups.filter(function(g){ return !!g.hasMechanism; });
    var withoutGroups = groups.filter(function(g){ return !g.hasMechanism; });
    function section(label, arr){
      var body = arr.length ? arr.map(renderDigestGroupV4).join('') : '<div class="dg-empty dg-empty-inline"><div class="dg-empty-title">No changes today</div></div>';
      return '<div class="dg-mech-section"><div class="dg-mech-section-title"><span>'+e(label)+'</span></div>'+body+'</div>';
    }
    return section('Campaign with mechanism', withGroups) + section('Campaign without mechanism', withoutGroups);
  }
  function renderDigestV4(){
    var box = byId('digestBody');
    if(!box) return;
    var result = (typeof digestHighlights === 'function') ? digestHighlights() : { groups:[] };
    var groups = result.groups || [];
    var dateLabel = (typeof digestDateLabel === 'function') ? digestDateLabel() : '';
    var hero = '<div class="page-card dg-hero dg-hero-v4">'
      + '<div class="dg-hero-main dg-hero-title-stack"><div class="dg-hero-title-row"><h2>Campaign Notification Daily Report</h2><div class="dg-date dg-date-right">'+e(dateLabel)+'</div></div>'
      + '<p class="page-intro dg-page-intro">Use this page to monitor campaign status and today’s information changes. <strong>Campaign Overview</strong> shows total, upcoming, and ongoing campaign counts with changes vs yesterday. <strong>Change Record</strong> shows changed campaigns and detailed records, split by campaigns with and without mechanism.</p></div>'
      + '</div>';
    var highlights = '<div class="dg-highlights dg-highlights-flat">' + renderChangeRecordSummaryV4(groups) + renderGroupedHighlightsV4(groups) + '</div>';
    box.innerHTML = hero + '<div class="dg-section-title">Campaign Overview</div>' + renderCampaignOverviewV4() + '<div class="dg-section-title">Change Record</div>' + highlights;
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
  }
  window.renderDigest = renderDigestV4;
  try { renderDigest = renderDigestV4; } catch(err) {}

  function renderCampaignChangeRowsV4(list){
    return sortChangesByOperationV4(list).map(function(ch){
      var locale = ch.locale && ch.locale !== '-' ? '<span class="chip mini">'+e(ch.locale)+'</span>' : '<span class="muted">-</span>';
      return '<tr>'
        + '<td><span class="op-pill op-'+e(opKeyV4(ch.op))+'">'+e(opLabelV4(ch.op))+'</span></td>'
        + '<td title="'+e(changeEventNameV4(ch))+'">'+e(changeEventNameV4(ch))+'</td>'
        + '<td title="'+e(ch.field || '-')+'">'+e(ch.field || '-')+'</td>'
        + '<td>'+diffHtmlV4(ch)+'</td>'
        + '<td>'+locale+'</td>'
        + '<td class="muted" title="'+e(ch.time || '-')+'">'+e(ch.time || '-')+'</td>'
        + '</tr>';
    }).join('');
  }
  window.renderCampaignChangePanel = function(id){
    var list = visibleChangesForCampaignV4(id);
    if(!list.length){
      return '<div class="campaign-change-panel"><div class="campaign-no-change">No change records for this campaign.</div></div>';
    }
    return '<div class="campaign-change-panel">'
      + '<div class="campaign-change-title">Change Records <span class="campaign-change-count">'+updateTextV4(list.length)+'</span></div>'
      + '<div class="campaign-changes-scroll">'
      + '<table class="campaign-changes-table"><colgroup class="campaign-changes-responsive-colgroup"><col><col><col><col><col><col></colgroup>'
      + '<thead><tr><th>Operation</th><th>Change Section</th><th>Field</th><th>Change</th><th>Locale</th><th>Update Time</th></tr></thead>'
      + '<tbody>'+renderCampaignChangeRowsV4(list)+'</tbody>'
      + '</table></div></div>';
  };
  try { renderCampaignChangePanel = window.renderCampaignChangePanel; } catch(err) {}

  try { renderDigestV4(); } catch(err) { console.warn('[digest refined patch] renderDigest', err); }
  try { if(typeof renderTable === 'function') renderTable(); } catch(err) { console.warn('[digest refined patch] renderTable', err); }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function esc(v){
    if(typeof escape === 'function') return escape(v == null ? '' : v);
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); });
  }
  function getValue(){
    var el = byId('fChangeRecordSince');
    return el ? String(el.value || '').trim() : '';
  }
  function parseDateStart(value){
    var m = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m) return 0;
    var year = Number(m[1]), month = Number(m[2]), day = Number(m[3]);
    var date = new Date(year, month - 1, day, 0, 0, 0, 0);
    if(date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return 0;
    var t = date.getTime();
    return isNaN(t) ? 0 : t;
  }
  function parseChangeTime(ch){
    if(typeof parseTime === 'function') return parseTime(ch && ch.time);
    var raw = String((ch && ch.time) || '').replace(' ', 'T');
    var t = Date.parse(raw);
    return isNaN(t) ? 0 : t;
  }
  function opKey(op){
    var key = String(op || '').toLowerCase();
    if(key === 'added') key = 'add';
    if(key === 'updated') key = 'update';
    if(key === 'removed' || key === 'delete' || key === 'deleted') key = 'remove';
    return key || 'other';
  }
  function opLabel(op){
    var key = opKey(op);
    if(typeof OP_LABEL !== 'undefined' && OP_LABEL[key]) return OP_LABEL[key];
    if(key === 'add') return 'Added';
    if(key === 'update') return 'Updated';
    if(key === 'remove') return 'Removed';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  function opRank(op){
    var key = opKey(op);
    if(key === 'add') return 0;
    if(key === 'update') return 1;
    if(key === 'remove') return 2;
    return 9;
  }
  function changeDateRank(ch){
    var raw = ch && ch.time ? String(ch.time).slice(0, 10) : '';
    var t = raw ? Date.parse(raw + 'T00:00:00') : 0;
    return isNaN(t) ? 0 : t;
  }
  function sortChanges(list){
    return (list || []).slice().sort(function(a,b){
      var dateDiff = changeDateRank(b) - changeDateRank(a);
      if(dateDiff) return dateDiff;
      var opDiff = opRank(a && a.op) - opRank(b && b.op);
      if(opDiff) return opDiff;
      return parseChangeTime(b) - parseChangeTime(a);
    });
  }
  function removedSectionChange(ch){
    var scope = String((ch && ch.scope) || '');
    var field = String((ch && ch.field) || '');
    return !!(ch && (ch.type === 'collection' || /Collection Basic Info/i.test(scope) || /Asset of Flash Sale Products/i.test(scope) || /Asset of Flash Sale Products/i.test(field)));
  }
  function baseVisibleChanges(id){
    var list = [];
    if(typeof campaignChangeList === 'function') list = campaignChangeList(id) || [];
    else if(typeof CHANGES !== 'undefined') list = (CHANGES[id] || CHANGES[Number(id)] || CHANGES[String(id)] || []).slice();
    return sortChanges((list || []).filter(function(ch){ return !removedSectionChange(ch); }));
  }
  window.campaignChangeRecordSinceFilterValue = getValue;
  window.campaignVisibleChangesByRecordSince = function(id){
    var since = parseDateStart(getValue());
    return baseVisibleChanges(id).filter(function(ch){
      var t = parseChangeTime(ch);
      if(!t) return false;
      if(since && t < since) return false;
      return true;
    });
  };
  function updateText(count){ return count + ' update' + (count === 1 ? '' : 's'); }
  function filterNote(){
    var v = getValue();
    return (v && parseDateStart(v)) ? 'since ' + v : '';
  }
  function changeEventName(ch){
    if(typeof campaignChangeEventName === 'function') return campaignChangeEventName(ch);
    if(typeof TYPE_LABEL !== 'undefined' && ch && TYPE_LABEL[ch.type]) return TYPE_LABEL[ch.type];
    return (ch && (ch.scope || ch.type)) || '-';
  }
  function diffHtml(ch){
    if(typeof campaignChangeDiffHtml === 'function') return campaignChangeDiffHtml(ch);
    if(ch && opKey(ch.op) === 'add') return '<span class="diff-add">+ '+esc(ch.after || '')+'</span>';
    if(ch && opKey(ch.op) === 'remove') return '<span class="diff-remove">− '+esc(ch.before || '')+'</span>';
    return '<span class="diff-old">'+esc((ch && ch.before) || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+esc((ch && ch.after) || '')+'</span>';
  }
  function renderChangeRows(list){
    return sortChanges(list).map(function(ch){
      var locale = ch.locale && ch.locale !== '-' ? '<span class="chip mini">'+esc(ch.locale)+'</span>' : '<span class="muted">-</span>';
      return '<tr>'
        + '<td><span class="op-pill op-'+esc(opKey(ch && ch.op))+'">'+esc(opLabel(ch && ch.op))+'</span></td>'
        + '<td title="'+esc(changeEventName(ch))+'">'+esc(changeEventName(ch))+'</td>'
        + '<td title="'+esc((ch && ch.field) || '-')+'">'+esc((ch && ch.field) || '-')+'</td>'
        + '<td>'+diffHtml(ch)+'</td>'
        + '<td>'+locale+'</td>'
        + '<td class="muted" title="'+esc((ch && ch.time) || '-')+'">'+esc((ch && ch.time) || '-')+'</td>'
        + '</tr>';
    }).join('');
  }
  window.handleChangeRecordSinceInput = function(input){
    if(!input) return;
    var raw = String(input.value || '').replace(/[^0-9]/g, '').slice(0, 8);
    var formatted = raw;
    if(raw.length > 4) formatted = raw.slice(0, 4) + '-' + raw.slice(4);
    if(raw.length > 6) formatted = raw.slice(0, 4) + '-' + raw.slice(4, 6) + '-' + raw.slice(6);
    if(input.value !== formatted) input.value = formatted;
  };
  function ensureFilter(){
    var filter = document.querySelector('#page-list .filter');
    if(!filter || byId('fChangeRecordSince')) return;
    var field = document.createElement('div');
    field.className = 'field change-record-since-field';
    field.innerHTML = '<label>Change Record Since:</label><span class="change-record-since-wrap"><input id="fChangeRecordSince" class="change-record-since-input" type="text" inputmode="numeric" maxlength="10" placeholder="YYYY-MM-DD" aria-label="Filter change records by Update Time from this date to now" autocomplete="off" oninput="handleChangeRecordSinceInput(this); onListFilterInput();" onkeydown="if(event.key===\'Enter\'){ onListFilterChange(); }" onchange="onListFilterChange()" /></span>';
    var actions = filter.querySelector('.filter-actions');
    if(actions) filter.insertBefore(field, actions);
    else filter.appendChild(field);
  }
  ensureFilter();

  if(typeof getFilteredCampaignRows === 'function' && !window.__changeRecordSinceRowsPatched){
    window.__changeRecordSinceRowsPatched = true;
    var previousGetFilteredCampaignRows = getFilteredCampaignRows;
    getFilteredCampaignRows = function(){
      var rows = previousGetFilteredCampaignRows.apply(this, arguments) || [];
      var v = getValue();
      if(!v || !parseDateStart(v)) return rows;
      return rows.filter(function(r){ return window.campaignVisibleChangesByRecordSince(r.campaignId).length > 0; });
    };
  }

  window.renderCampaignChangePanel = function(id){
    var list = window.campaignVisibleChangesByRecordSince(id);
    var note = filterNote();
    if(!list.length){
      return '<div class="campaign-change-panel"><div class="campaign-no-change">No change records'+(note ? ' '+esc(note) : '')+' for this campaign.</div></div>';
    }
    return '<div class="campaign-change-panel">'
      + '<div class="campaign-change-title">Change Records <span class="campaign-change-count">'+updateText(list.length)+'</span>'+(note ? '<span class="campaign-change-filter-note">'+esc(note)+'</span>' : '')+'</div>'
      + '<div class="campaign-changes-scroll">'
      + '<table class="campaign-changes-table"><colgroup class="campaign-changes-responsive-colgroup"><col><col><col><col><col><col></colgroup>'
      + '<thead><tr><th>Operation</th><th>Change Section</th><th>Field</th><th>Change</th><th>Locale</th><th>Update Time</th></tr></thead>'
      + '<tbody>'+renderChangeRows(list)+'</tbody>'
      + '</table></div></div>';
  };
  try { renderCampaignChangePanel = window.renderCampaignChangePanel; } catch(err) {}

  if(typeof resetFilter === 'function' && !window.__changeRecordSinceResetPatched){
    window.__changeRecordSinceResetPatched = true;
    var previousResetFilter = resetFilter;
    resetFilter = function(){
      var el = byId('fChangeRecordSince');
      if(el) el.value = '';
      previousResetFilter.apply(this, arguments);
    };
  }
  if(typeof digestOpenList === 'function' && !window.__changeRecordSinceDigestOpenPatched){
    window.__changeRecordSinceDigestOpenPatched = true;
    var previousDigestOpenList = digestOpenList;
    digestOpenList = function(){
      var el = byId('fChangeRecordSince');
      if(el) el.value = '';
      return previousDigestOpenList.apply(this, arguments);
    };
  }
  if(typeof switchPage === 'function' && !window.__changeRecordSinceSwitchPatched){
    window.__changeRecordSinceSwitchPatched = true;
    var previousSwitchPage = switchPage;
    switchPage = function(name){
      var result = previousSwitchPage.apply(this, arguments);
      if(name === 'list') ensureFilter();
      return result;
    };
  }
  try { if(typeof renderTable === 'function') renderTable(); } catch(err) { console.warn('[change record since patch]', err); }
})();

;

(function(){
  var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var viewYear = null;
  var viewMonth = null; // 0-based
  var isOpen = false;

  function byId(id){ return document.getElementById(id); }
  function pad2(n){ return String(n).padStart(2, '0'); }
  function validDateString(value){
    var m = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m) return '';
    var y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    var date = new Date(y, mo - 1, d);
    if(date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return '';
    return m[1] + '-' + m[2] + '-' + m[3];
  }
  function dateToStr(d){ return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function parseDate(value){
    var v = validDateString(value);
    if(!v) return null;
    return new Date(Number(v.slice(0,4)), Number(v.slice(5,7)) - 1, Number(v.slice(8,10)));
  }
  function defaultViewDate(){
    var selected = parseDate(getInputValue());
    if(selected) return selected;
    var latest = 0;
    try{
      if(typeof CHANGES !== 'undefined'){
        Object.keys(CHANGES).forEach(function(id){
          (CHANGES[id] || []).forEach(function(ch){
            var t = typeof parseTime === 'function' ? parseTime(ch && ch.time) : Date.parse(String((ch && ch.time) || '').replace(' ', 'T'));
            if(t && !isNaN(t) && t > latest) latest = t;
          });
        });
      }
    }catch(e){}
    return latest ? new Date(latest) : new Date();
  }
  function getInput(){ return byId('fChangeRecordSince'); }
  function getInputValue(){ var input = getInput(); return input ? String(input.value || '').trim() : ''; }
  function triggerFilter(){
    if(typeof onListFilterChange === 'function') onListFilterChange();
    else if(typeof renderTable === 'function') renderTable();
  }
  function ensureCalendarControls(){
    var input = getInput();
    if(!input) return null;
    var wrap = input.closest('.change-record-since-wrap');
    if(!wrap) return null;
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('placeholder', 'YYYY-MM-DD');
    input.setAttribute('aria-haspopup', 'dialog');
    input.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if(!wrap.querySelector('.change-record-since-icon')){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'change-record-since-icon';
      btn.setAttribute('aria-label', 'Open calendar');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>';
      wrap.appendChild(btn);
      btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); toggleCalendar(); });
    }
    if(!input.dataset.changeRecordCalendarBound){
      input.dataset.changeRecordCalendarBound = '1';
      input.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); openCalendar(); });
      input.addEventListener('focus', function(e){ e.stopPropagation(); openCalendar(); });
      input.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){ e.preventDefault(); closeCalendar(); }
        if(e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown'){
          e.preventDefault(); e.stopPropagation(); openCalendar();
        }
      });
    }
    return wrap;
  }
  function renderCalendar(){
    var wrap = ensureCalendarControls();
    if(!wrap || !isOpen) return;
    var input = getInput();
    var selected = parseDate(input && input.value);
    if(viewYear == null || viewMonth == null){
      var d = defaultViewDate();
      viewYear = d.getFullYear();
      viewMonth = d.getMonth();
    }
    var existing = wrap.querySelector('.change-record-calendar-panel');
    if(existing) existing.remove();
    var first = new Date(viewYear, viewMonth, 1);
    var days = new Date(viewYear, viewMonth + 1, 0).getDate();
    var today = new Date();
    var todayStr = dateToStr(today);
    var selectedStr = selected ? dateToStr(selected) : '';
    var html = '<div class="change-record-calendar-head">'
      + '<button class="change-record-calendar-nav" type="button" data-nav="prev" aria-label="Previous month">‹</button>'
      + '<div class="change-record-calendar-title">' + MONTH_NAMES[viewMonth] + ' ' + viewYear + '</div>'
      + '<button class="change-record-calendar-nav" type="button" data-nav="next" aria-label="Next month">›</button>'
      + '</div>';
    html += '<div class="change-record-calendar-week">' + WEEKDAYS.map(function(d){ return '<span>' + d + '</span>'; }).join('') + '</div>';
    html += '<div class="change-record-calendar-grid">';
    for(var i=0; i<first.getDay(); i++) html += '<button class="change-record-calendar-day blank" type="button" tabindex="-1"></button>';
    for(var day=1; day<=days; day++){
      var value = viewYear + '-' + pad2(viewMonth + 1) + '-' + pad2(day);
      var cls = 'change-record-calendar-day' + (value === selectedStr ? ' selected' : '') + (value === todayStr ? ' today' : '');
      html += '<button class="' + cls + '" type="button" data-date="' + value + '">' + day + '</button>';
    }
    html += '</div>';
    html += '<div class="change-record-calendar-foot"><span class="change-record-calendar-hint">Select a start date</span><span style="display:flex;gap:6px;"><button class="btn" type="button" data-action="clear">Clear</button><button class="btn" type="button" data-action="today">Today</button></span></div>';
    var panel = document.createElement('div');
    panel.className = 'change-record-calendar-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Change Record Since calendar');
    panel.innerHTML = html;
    wrap.appendChild(panel);
    panel.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var nav = e.target.closest('[data-nav]');
      if(nav){
        var delta = nav.getAttribute('data-nav') === 'prev' ? -1 : 1;
        var next = new Date(viewYear, viewMonth + delta, 1);
        viewYear = next.getFullYear();
        viewMonth = next.getMonth();
        renderCalendar();
        return;
      }
      var dayBtn = e.target.closest('[data-date]');
      if(dayBtn){
        setValue(dayBtn.getAttribute('data-date'));
        closeCalendar();
        triggerFilter();
        return;
      }
      var action = e.target.closest('[data-action]');
      if(action){
        var name = action.getAttribute('data-action');
        if(name === 'clear') setValue('');
        if(name === 'today') setValue(todayStr);
        closeCalendar();
        triggerFilter();
      }
    });
  }
  function setValue(value){
    var input = getInput();
    if(!input) return;
    input.value = value || '';
  }
  function openCalendar(){
    try{
      if(typeof closeAllFilterDropdowns === 'function') closeAllFilterDropdowns();
      else if(typeof closeCustomSelect === 'function') closeCustomSelect();
    }catch(e){}
    var wrap = ensureCalendarControls();
    if(!wrap) return;
    if(!isOpen){
      var d = defaultViewDate();
      viewYear = d.getFullYear();
      viewMonth = d.getMonth();
    }
    isOpen = true;
    wrap.classList.add('open');
    var input = getInput();
    if(input){
      input.classList.add('is-open');
      input.setAttribute('aria-expanded', 'true');
    }
    renderCalendar();
  }
  function closeCalendar(){
    isOpen = false;
    var input = getInput();
    var wrap = input && input.closest('.change-record-since-wrap');
    if(wrap){
      wrap.classList.remove('open');
      var panel = wrap.querySelector('.change-record-calendar-panel');
      if(panel) panel.remove();
    }
    if(input){
      input.classList.remove('is-open');
      input.setAttribute('aria-expanded', 'false');
    }
  }
  function toggleCalendar(){ isOpen ? closeCalendar() : openCalendar(); }
  function init(){ ensureCalendarControls(); }

  document.addEventListener('click', function(e){
    var wrap = document.querySelector('#page-list .change-record-since-wrap');
    if(wrap && !wrap.contains(e.target)) closeCalendar();
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeCalendar(); });

  if(typeof switchPage === 'function' && !window.__changeRecordSinceCalendarSwitchPatched){
    window.__changeRecordSinceCalendarSwitchPatched = true;
    var previousSwitchPageForCalendar = switchPage;
    switchPage = function(name){
      var result = previousSwitchPageForCalendar.apply(this, arguments);
      if(name === 'list') setTimeout(init, 0);
      else closeCalendar();
      return result;
    };
  }
  if(typeof resetFilter === 'function' && !window.__changeRecordSinceCalendarResetPatched){
    window.__changeRecordSinceCalendarResetPatched = true;
    var previousResetFilterForCalendar = resetFilter;
    resetFilter = function(){
      closeCalendar();
      var result = previousResetFilterForCalendar.apply(this, arguments);
      setTimeout(init, 0);
      return result;
    };
  }
  init();
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function e(v){
    if(typeof escape === 'function') return escape(v == null ? '' : v);
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]; });
  }
  function pTime(value){
    if(typeof parseTime === 'function') return parseTime(value);
    var t = Date.parse(String(value || '').replace(' ', 'T'));
    return isNaN(t) ? 0 : t;
  }
  function opKey(op){
    var key = String(op || '').toLowerCase();
    if(key === 'added') key = 'add';
    if(key === 'updated') key = 'update';
    if(key === 'removed' || key === 'delete' || key === 'deleted') key = 'remove';
    return key || 'other';
  }
  function opLabel(op){
    var key = opKey(op);
    if(typeof OP_LABEL !== 'undefined' && OP_LABEL[key]) return OP_LABEL[key];
    return key === 'add' ? 'Added' : key === 'update' ? 'Updated' : key === 'remove' ? 'Removed' : key.charAt(0).toUpperCase() + key.slice(1);
  }
  function opRank(op){
    var key = opKey(op);
    return key === 'add' ? 0 : key === 'update' ? 1 : key === 'remove' ? 2 : 9;
  }
  function dateRank(ch){
    var raw = ch && ch.time ? String(ch.time).slice(0,10) : '';
    var t = raw ? Date.parse(raw + 'T00:00:00') : 0;
    return isNaN(t) ? 0 : t;
  }
  function sortChangeRecords(list){
    return (list || []).slice().sort(function(a,b){
      var d = dateRank(b) - dateRank(a);
      if(d) return d;
      var o = opRank(a && a.op) - opRank(b && b.op);
      if(o) return o;
      return pTime(b && b.time) - pTime(a && a.time);
    });
  }
  function localeLabel(ch){
    var loc = ch && ch.locale ? String(ch.locale) : '';
    return (loc && loc !== '-') ? loc : 'Global';
  }
  function localeChip(ch){
    var label = localeLabel(ch);
    var cls = label === 'Global' ? 'chip mini change-locale-global' : 'chip mini';
    var title = label === 'Global' ? 'Global / all locales' : label;
    return '<span class="'+cls+'" title="'+e(title)+'">'+e(label)+'</span>';
  }
  function changeEventName(ch){
    if(typeof campaignChangeEventName === 'function') return campaignChangeEventName(ch);
    if(typeof TYPE_LABEL !== 'undefined' && ch && TYPE_LABEL[ch.type]) return TYPE_LABEL[ch.type];
    if(typeof getSubscribedEventFromScope === 'function') return getSubscribedEventFromScope(ch && ch.scope);
    return (ch && (ch.scope || ch.type)) || '-';
  }
  function diffHtml(ch){
    if(typeof campaignChangeDiffHtml === 'function') return campaignChangeDiffHtml(ch);
    if(opKey(ch && ch.op) === 'add') return '<span class="diff-add">+ '+e((ch && ch.after) || '')+'</span>';
    if(opKey(ch && ch.op) === 'remove') return '<span class="diff-remove">− '+e((ch && ch.before) || '')+'</span>';
    return '<span class="diff-old">'+e((ch && ch.before) || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+e((ch && ch.after) || '')+'</span>';
  }
  function changeRecordSinceValue(){
    var el = byId('fChangeRecordSince');
    return el ? String(el.value || '').trim() : '';
  }
  function validSince(value){
    var m = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m) return '';
    var y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    var date = new Date(y, mo - 1, d, 0, 0, 0, 0);
    if(date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return '';
    return m[1] + '-' + m[2] + '-' + m[3];
  }
  function sinceStartMs(){
    var v = validSince(changeRecordSinceValue());
    if(!v) return 0;
    return Date.parse(v + 'T00:00:00') || 0;
  }
  function removedSectionChange(ch){
    var scope = String((ch && ch.scope) || '');
    var field = String((ch && ch.field) || '');
    return !!(ch && (ch.type === 'collection' || /Collection Basic Info/i.test(scope) || /Asset of Flash Sale Products/i.test(scope) || /Asset of Flash Sale Products/i.test(field)));
  }
  function rawVisibleChanges(id){
    var list = [];
    try{
      if(typeof CHANGES !== 'undefined') list = (CHANGES[id] || CHANGES[Number(id)] || CHANGES[String(id)] || []).slice();
    }catch(err){}
    return sortChangeRecords(list.filter(function(ch){ return !removedSectionChange(ch); }));
  }
  window.campaignVisibleChangesByRecordSince = function(id){
    var start = sinceStartMs();
    return rawVisibleChanges(id).filter(function(ch){
      var t = pTime(ch && ch.time);
      return !!t && (!start || t >= start);
    });
  };
  function updateText(count){ return count + ' update' + (count === 1 ? '' : 's'); }
  function filterNote(){
    var v = validSince(changeRecordSinceValue());
    return v ? 'since ' + v : '';
  }
  function renderCampaignChangeRows(list){
    return sortChangeRecords(list).map(function(ch){
      return '<tr>'
        + '<td>'+localeChip(ch)+'</td>'
        + '<td><span class="op-pill op-'+e(opKey(ch && ch.op))+'">'+e(opLabel(ch && ch.op))+'</span></td>'
        + '<td title="'+e(changeEventName(ch))+'">'+e(changeEventName(ch))+'</td>'
        + '<td title="'+e((ch && ch.field) || '-')+'">'+e((ch && ch.field) || '-')+'</td>'
        + '<td>'+diffHtml(ch)+'</td>'
        + '<td class="muted" title="'+e((ch && ch.time) || '-')+'">'+e((ch && ch.time) || '-')+'</td>'
        + '</tr>';
    }).join('');
  }
  window.renderCampaignChangePanel = function(id){
    var list = window.campaignVisibleChangesByRecordSince(id);
    var note = filterNote();
    if(!list.length){
      return '<div class="campaign-change-panel"><div class="campaign-no-change">No change records'+(note ? ' '+e(note) : '')+' for this campaign.</div></div>';
    }
    return '<div class="campaign-change-panel">'
      + '<div class="campaign-change-title">Change Records <span class="campaign-change-count">'+updateText(list.length)+'</span>'+(note ? '<span class="campaign-change-filter-note">'+e(note)+'</span>' : '')+'</div>'
      + '<div class="campaign-changes-scroll">'
      + '<table class="campaign-changes-table"><colgroup class="campaign-changes-responsive-colgroup"><col><col><col><col><col><col></colgroup>'
      + '<thead><tr><th>Locale</th><th>Operation</th><th>Change Section</th><th>Field</th><th>Change</th><th>Update Time</th></tr></thead>'
      + '<tbody>'+renderCampaignChangeRows(list)+'</tbody>'
      + '</table></div></div>';
  };
  try { renderCampaignChangePanel = window.renderCampaignChangePanel; } catch(err) {}

  // Change Record Since only filters expanded change records. It must not filter Campaign rows.
  window.getFilteredCampaignRows = function(){
    var nameEl = byId('fName');
    var fName = nameEl ? nameEl.value.trim().toLowerCase() : '';
    var fTheme = (typeof getSelectValues === 'function') ? getSelectValues('fTheme') : [];
    var fGrade = (typeof getSelectValues === 'function') ? getSelectValues('fGrade') : [];
    var fStatus = (typeof getSelectValues === 'function') ? getSelectValues('fStatus') : [];
    return (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).filter(function(r){
      if(fName && !String(r.campaignName || '').toLowerCase().includes(fName)) return false;
      if(fTheme.length && fTheme.indexOf(r.theme) < 0) return false;
      if(fGrade.length && fGrade.indexOf(r.grade) < 0) return false;
      if(typeof passListRegionFilter === 'function' && !passListRegionFilter(r)) return false;
      var status = (typeof getComputedCampaignStatus === 'function') ? getComputedCampaignStatus(r) : r.status;
      if(fStatus.length && fStatus.indexOf(status) < 0) return false;
      return true;
    });
  };
  try { getFilteredCampaignRows = window.getFilteredCampaignRows; } catch(err) {}

  window.digestRenderChange = function(id, ch){
    var d;
    if(opKey(ch && ch.op) === 'add') d = '<span class="diff-add">+ '+e((ch && ch.after) || '')+'</span>';
    else if(opKey(ch && ch.op) === 'remove') d = '<span class="diff-remove">− '+e((ch && ch.before) || '')+'</span>';
    else d = '<span class="diff-old">'+e((ch && ch.before) || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+e((ch && ch.after) || '')+'</span>';
    var t = String((ch && ch.time) || '').slice(11, 16);
    var evt = (typeof TYPE_LABEL !== 'undefined' && ch && TYPE_LABEL[ch.type]) || (typeof getSubscribedEventFromScope === 'function' ? getSubscribedEventFromScope(ch && ch.scope) : ((ch && ch.scope) || ''));
    return '<div class="dg-change" role="button" tabindex="0" onclick="digestJump(\''+e(id)+'\',\''+e(ch && ch.type)+'\',\''+e((ch && ch.locale) || '')+'\',\'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();digestJump(\''+e(id)+'\',\''+e(ch && ch.type)+'\',\''+e((ch && ch.locale) || '')+'\',\'\')}" title="Open '+e(evt)+' in campaign detail">'
      + '<span class="dg-locale-cell">'+localeChip(ch)+'</span>'
      + '<span class="op-pill op-'+e(opKey(ch && ch.op))+'">'+e(opLabel(ch && ch.op))+'</span>'
      + '<span class="dg-field" title="'+e((ch && ch.scope) || '')+' · '+e((ch && ch.field) || '')+'">'+e((ch && ch.field) || '-')+'</span>'
      + '<span class="dg-diff">'+d+'</span>'
      + '<span class="dg-time">'+e(t)+'</span>'
      + '<span class="dg-go" aria-hidden="true">→</span>'
      + '</div>';
  };
  try { digestRenderChange = window.digestRenderChange; } catch(err) {}

  try { if(typeof renderTable === 'function') renderTable(); } catch(err) { console.warn('[locale-before-operation final] renderTable', err); }
  try { if(typeof renderDigest === 'function') renderDigest(); } catch(err) { console.warn('[locale-before-operation final] renderDigest', err); }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function e(v){
    if(typeof escape === 'function') return escape(v == null ? '' : v);
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]; });
  }
  function pTime(value){
    if(typeof value === 'number') return isFinite(value) ? value : 0;
    if(typeof parseTime === 'function') return parseTime(value);
    var t = Date.parse(String(value || '').replace(' ', 'T'));
    return isNaN(t) ? 0 : t;
  }
  function parseDateLike(value){
    if(!value) return 0;
    var s = String(value).trim();
    if(!s || s === '/' || s.toLowerCase() === 'null') return 0;
    s = s.replace(/\s+Asia\/[A-Za-z_]+\s*$/,'');
    var m = s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/);
    if(m){
      var t = Date.parse(m[1] + 'T' + (m[2] || '00:00:00'));
      return isNaN(t) ? 0 : t;
    }
    var t2 = Date.parse(s.replace(' ', 'T'));
    return isNaN(t2) ? 0 : t2;
  }
  function detailForCampaign(c){
    var id = c && c.campaignId;
    return (typeof DETAILS !== 'undefined' && (DETAILS[id] || DETAILS[Number(id)] || DETAILS[String(id)])) || null;
  }
  function campaignTiming(c){
    var d = detailForCampaign(c);
    var campaign = d && d.campaign ? d.campaign : {};
    var launch = parseDateLike(campaign.launchDate || (c && c.launchDate) || (c && c.createTime));
    var period = campaign.startEndDate || (c && c.startEndDate) || '';
    var end = 0;
    if(period && String(period).indexOf(' - ') >= 0){
      var parts = String(period).split(' - ');
      end = parseDateLike(parts[parts.length - 1]);
    }
    return { launch:launch, end:end };
  }
  function statusAt(c, refTime){
    var t = campaignTiming(c || {});
    if(t.launch && refTime < t.launch) return 'upcoming';
    if(t.end && refTime > t.end) return 'ended';
    if(t.launch || t.end) return 'ongoing';
    var st = String((c && c.status) || '').toLowerCase();
    if(st === 'live') return 'ongoing';
    if(st === 'upcoming' || st === 'ongoing' || st === 'ended' || st === 'draft') return st;
    return 'upcoming';
  }
  function groupStatus(g){
    // Sort and display the Report activity groups by the campaign Status field.
    // In this UI, Live is shown as Ongoing.
    var raw = String((g && g.c && g.c.status) || '').toLowerCase();
    if(raw === 'live') return 'ongoing';
    if(raw === 'upcoming' || raw === 'ongoing' || raw === 'ended' || raw === 'draft') return raw;
    if(g && g.computedStatus) return String(g.computedStatus).toLowerCase();
    if(typeof getComputedCampaignStatus === 'function'){
      try { return String(getComputedCampaignStatus(g && g.c)).toLowerCase(); } catch(err) {}
    }
    return statusAt(g && g.c, Date.now());
  }
  function statusLabel(st){
    st = String(st || '').toLowerCase();
    if(typeof STATUS_LABEL !== 'undefined' && STATUS_LABEL[st]) return STATUS_LABEL[st];
    if(st === 'live' || st === 'ongoing') return 'Ongoing';
    if(st === 'upcoming') return 'Upcoming';
    if(st === 'ended') return 'Ended';
    if(st === 'draft') return 'Draft';
    return st ? st.charAt(0).toUpperCase() + st.slice(1) : '-';
  }
  function statusRank(st){
    st = String(st || '').toLowerCase();
    if(st === 'upcoming') return 0;
    if(st === 'ongoing' || st === 'live') return 1;
    if(st === 'draft') return 2;
    if(st === 'ended') return 3;
    return 9;
  }
  function gradeRank(grade){
    var g = String(grade || '').toLowerCase().replace(/\s+/g, '');
    if(g === 'tier1') return 0;
    if(g === 'tier2') return 1;
    if(g === 'tier3') return 2;
    return 9;
  }
  function gradeBadge(grade){
    var label = String(grade || '').trim() || '-';
    var cls = label.toLowerCase().replace(/\s+/g,'');
    return '<span class="badge-tier tier-'+e(cls)+'">'+e(label)+'</span>';
  }
  function sortReportGroups(groups){
    return (groups || []).slice().sort(function(a,b){
      var sd = statusRank(groupStatus(a)) - statusRank(groupStatus(b));
      if(sd) return sd;
      var gd = gradeRank(a && a.c && a.c.grade) - gradeRank(b && b.c && b.c.grade);
      if(gd) return gd;
      return pTime(b && b.latest) - pTime(a && a.latest);
    });
  }
  function countStatusAt(refTime){
    var counts = { total:0, nonEnded:0, upcoming:0, ongoing:0, ended:0, draft:0 };
    (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).forEach(function(c){
      var st = statusAt(c, refTime);
      counts.total += 1;
      counts[st] = (counts[st] || 0) + 1;
      if(st !== 'ended') counts.nonEnded += 1;
    });
    return counts;
  }
  function deltaHtml(delta){
    if(delta === 0) return '<span class="dg-delta flat">no changes vs yesterday</span>';
    var cls = delta > 0 ? 'up' : 'down';
    var sign = delta > 0 ? '+' : '';
    return '<span class="dg-delta '+cls+'">'+sign+delta+' vs yesterday</span>';
  }
  function renderCampaignOverview(){
    var now = Date.now();
    var yesterday = now - 24 * 60 * 60 * 1000;
    var today = countStatusAt(now);
    var prev = countStatusAt(yesterday);
    var cards = [
      { cls:'non-ended', label:'Total campaigns', value:today.nonEnded || 0, delta:(today.nonEnded || 0) - (prev.nonEnded || 0) },
      { cls:'upcoming', label:'Upcoming campaigns', value:today.upcoming || 0, delta:(today.upcoming || 0) - (prev.upcoming || 0) },
      { cls:'ongoing', label:'Ongoing campaigns', value:today.ongoing || 0, delta:(today.ongoing || 0) - (prev.ongoing || 0) }
    ];
    return '<div class="dg-overview-grid dg-overview-grid-v3">' + cards.map(function(card){
      return '<div class="dg-overview-card '+card.cls+'">'
        + '<div class="dg-overview-label">'+e(card.label)+'</div>'
        + '<div class="dg-overview-num-row"><div class="dg-overview-num">'+card.value+'</div>'+deltaHtml(card.delta)+'</div>'
        + '</div>';
    }).join('') + '</div>';
  }
  function opKey(op){
    op = String(op || '').toLowerCase();
    if(op === 'added') return 'add';
    if(op === 'updated') return 'update';
    if(op === 'removed' || op === 'delete' || op === 'deleted') return 'remove';
    return op || 'other';
  }
  function opRank(op){
    var key = opKey(op);
    if(key === 'add') return 0;
    if(key === 'update') return 1;
    if(key === 'remove') return 2;
    return 9;
  }
  function changeDateRank(ch){
    var raw = ch && ch.time ? String(ch.time).slice(0, 10) : '';
    var t = raw ? Date.parse(raw + 'T00:00:00') : 0;
    return isNaN(t) ? 0 : t;
  }
  function sortChanges(list){
    return (list || []).slice().sort(function(a,b){
      var dateDiff = changeDateRank(b) - changeDateRank(a);
      if(dateDiff) return dateDiff;
      var opDiff = opRank(a && a.op) - opRank(b && b.op);
      if(opDiff) return opDiff;
      return pTime(b && b.time) - pTime(a && a.time);
    });
  }
  function renderUpdatesText(n){ return n + ' update' + (n === 1 ? '' : 's'); }
  function renderRecordText(n){ return n + ' change record' + (n === 1 ? '' : 's'); }
  function renderChangeRecordSummary(groups){
    groups = groups || [];
    var withGroups = groups.filter(function(g){ return !!g.hasMechanism; });
    var withoutGroups = groups.filter(function(g){ return !g.hasMechanism; });
    var withRecords = withGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    var withoutRecords = withoutGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    return '<div class="dg-change-record-summary">'
      + '<div class="dg-change-record-summary-card total"><div class="dg-change-record-summary-label">Changed campaigns today</div><div class="dg-change-record-summary-num">'+groups.length+'</div></div>'
      + '<div class="dg-change-record-summary-card with"><div class="dg-change-record-summary-label">Campaign with mechanism</div><div class="dg-change-record-num-row"><div class="dg-change-record-summary-num">'+withGroups.length+'</div><span class="dg-record-delta">'+renderRecordText(withRecords)+'</span></div></div>'
      + '<div class="dg-change-record-summary-card without"><div class="dg-change-record-summary-label">Campaign without mechanism</div><div class="dg-change-record-num-row"><div class="dg-change-record-summary-num">'+withoutGroups.length+'</div><span class="dg-record-delta">'+renderRecordText(withoutRecords)+'</span></div></div>'
      + '</div>';
  }
  function renderDigestGroup(g){
    var sortedList = sortChanges(g && g.list);
    var st = groupStatus(g);
    var badgeClass = st === 'live' ? 'ongoing' : st;
    return '<article class="dg-group '+(g && g.hasMechanism ? 'dg-group-with-mechanism' : 'dg-group-without-mechanism')+'">'
      + '<header class="dg-group-head"><div class="dg-group-title">'
      + '<span class="link-name" role="button" tabindex="0" onclick="openDetail('+Number(g && g.id)+')" onkeydown="if(event.key===\'Enter\'){openDetail('+Number(g && g.id)+')}" title="Open campaign detail">'+e(g && g.c && g.c.campaignName)+'</span>'
      + '<span class="badge-stage '+e(badgeClass)+'">'+e(statusLabel(st))+'</span>'
      + gradeBadge(g && g.c && g.c.grade)
      + '</div><div class="dg-group-meta"><span class="dg-count">'+renderUpdatesText(sortedList.length)+'</span></div></header>'
      + '<div class="dg-changes">'+sortedList.map(function(ch){ return (typeof digestRenderChange === 'function') ? digestRenderChange(g.id, ch) : ''; }).join('')+'</div>'
      + '</article>';
  }
  function renderGroupedHighlights(groups){
    groups = groups || [];
    var withGroups = sortReportGroups(groups.filter(function(g){ return !!g.hasMechanism; }));
    var withoutGroups = sortReportGroups(groups.filter(function(g){ return !g.hasMechanism; }));
    function section(label, arr){
      var body = arr.length ? arr.map(renderDigestGroup).join('') : '<div class="dg-empty dg-empty-inline"><div class="dg-empty-title">No changes today</div></div>';
      return '<div class="dg-mech-section"><div class="dg-mech-section-title"><span>'+e(label)+'</span></div>'+body+'</div>';
    }
    return section('Campaign with mechanism', withGroups) + section('Campaign without mechanism', withoutGroups);
  }
  var previousDigestHighlights = (typeof digestHighlights === 'function') ? digestHighlights : null;
  if(previousDigestHighlights){
    window.digestHighlights = function(){
      var result = previousDigestHighlights.apply(this, arguments) || { groups:[] };
      // Keep the two mechanism groups separate. Sorting inside each group is done in renderGroupedHighlights.
      return result;
    };
    try { digestHighlights = window.digestHighlights; } catch(err) {}
  }
  window.renderDigest = function(){
    var box = byId('digestBody');
    if(!box) return;
    var result = (typeof digestHighlights === 'function') ? digestHighlights() : { groups:[] };
    var groups = result.groups || [];
    var dateLabel = (typeof digestDateLabel === 'function') ? digestDateLabel() : '';
    var hero = '<div class="page-card dg-hero dg-hero-v4">'
      + '<div class="dg-hero-main dg-hero-title-stack"><div class="dg-hero-title-row"><h2>Campaign Notification Daily Report</h2><div class="dg-date dg-date-right">'+e(dateLabel)+'</div></div>'
      + '<p class="page-intro dg-page-intro">Use this page to monitor campaign status and today’s information changes. <strong>Campaign Overview</strong> shows total, upcoming, and ongoing campaign counts with changes vs yesterday. <strong>Change Record</strong> shows changed campaigns and detailed records, split by campaigns with and without mechanism.</p></div>'
      + '</div>';
    var highlights = '<div class="dg-highlights dg-highlights-flat">' + renderChangeRecordSummary(groups) + renderGroupedHighlights(groups) + '</div>';
    box.innerHTML = hero + '<div class="dg-section-title">Campaign Overview</div>' + renderCampaignOverview() + '<div class="dg-section-title">Change Record</div>' + highlights;
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
  };
  try { renderDigest = window.renderDigest; } catch(err) {}

  function removeCampaignSearchButton(){
    document.querySelectorAll('#page-list .filter-actions .btn-primary').forEach(function(btn){ btn.remove(); });
  }
  removeCampaignSearchButton();
  try { window.renderDigest(); } catch(err) { console.warn('[report sort grade no search] renderDigest', err); }
  try { if(typeof renderTable === 'function') renderTable(); } catch(err) { console.warn('[report sort grade no search] renderTable', err); }
  removeCampaignSearchButton();
})();

;

(function(){
  function html(v){
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function opKey(op){
    var key = String(op || '').toLowerCase();
    if(key === 'added') key = 'add';
    if(key === 'updated') key = 'update';
    if(key === 'removed' || key === 'delete' || key === 'deleted') key = 'remove';
    return key || 'other';
  }
  function opLabel(op){
    var key = opKey(op);
    if(typeof OP_LABEL !== 'undefined' && OP_LABEL[key]) return OP_LABEL[key];
    if(key === 'add') return 'Added';
    if(key === 'update') return 'Updated';
    if(key === 'remove') return 'Removed';
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  function localeLabel(ch){
    var loc = ch && ch.locale ? String(ch.locale) : '';
    return (loc && loc !== '-') ? loc : 'Global';
  }
  function localeChip(ch){
    var label = localeLabel(ch);
    var cls = label === 'Global' ? 'chip mini change-locale-global' : 'chip mini';
    var title = label === 'Global' ? 'Global / all locales' : label;
    return '<span class="'+cls+'" title="'+html(title)+'">'+html(label)+'</span>';
  }
  function changeSection(ch){
    if(typeof campaignChangeEventName === 'function') return campaignChangeEventName(ch);
    if(typeof TYPE_LABEL !== 'undefined' && ch && TYPE_LABEL[ch.type]) return TYPE_LABEL[ch.type];
    if(typeof getSubscribedEventFromScope === 'function') return getSubscribedEventFromScope(ch && ch.scope);
    return (ch && (ch.scope || ch.type)) || '-';
  }
  function diffHtml(ch){
    var key = opKey(ch && ch.op);
    if(key === 'add') return '<span class="diff-add">+ '+html((ch && ch.after) || '')+'</span>';
    if(key === 'remove') return '<span class="diff-remove">− '+html((ch && ch.before) || '')+'</span>';
    return '<span class="diff-old">'+html((ch && ch.before) || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+html((ch && ch.after) || '')+'</span>';
  }
  window.digestRenderChange = function(id, ch){
    var t = String((ch && ch.time) || '').slice(11, 16);
    var section = changeSection(ch);
    return '<div class="dg-change" role="button" tabindex="0" onclick="digestJump(\''+html(id)+'\',\''+html(ch && ch.type)+'\',\''+html((ch && ch.locale) || '')+'\',\'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();digestJump(\''+html(id)+'\',\''+html(ch && ch.type)+'\',\''+html((ch && ch.locale) || '')+'\',\'\')}" title="Open '+html(section)+' in campaign detail">'
      + '<span class="dg-locale-cell">'+localeChip(ch)+'</span>'
      + '<span class="op-pill op-'+html(opKey(ch && ch.op))+'">'+html(opLabel(ch && ch.op))+'</span>'
      + '<span class="dg-section-cell" title="'+html(section)+'">'+html(section)+'</span>'
      + '<span class="dg-field" title="'+html((ch && ch.scope) || '')+' · '+html((ch && ch.field) || '')+'">'+html((ch && ch.field) || '-')+'</span>'
      + '<span class="dg-diff">'+diffHtml(ch)+'</span>'
      + '<span class="dg-time">'+html(t)+'</span>'
      + '<span class="dg-go" aria-hidden="true">→</span>'
      + '</div>';
  };
  try { digestRenderChange = window.digestRenderChange; } catch(err) {}
  try { if(typeof renderDigest === 'function') renderDigest(); } catch(err) { console.warn('[report change section column] renderDigest', err); }
})();

;

(function(){
  function h(v){
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function js(v){
    return String(v == null ? '' : v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'');
  }
  function s(v){ return String(v == null ? '' : v).trim(); }
  function lower(v){ return s(v).toLowerCase(); }
  function opKey(op){
    var key = lower(op);
    if(key === 'added') key = 'add';
    if(key === 'updated') key = 'update';
    if(key === 'removed' || key === 'delete' || key === 'deleted') key = 'remove';
    return key || 'other';
  }
  function opLabel(op){
    var key = opKey(op);
    if(typeof OP_LABEL !== 'undefined' && OP_LABEL[key]) return OP_LABEL[key];
    return key === 'add' ? 'Added' : key === 'update' ? 'Updated' : key === 'remove' ? 'Removed' : key.charAt(0).toUpperCase() + key.slice(1);
  }
  function opRank(op){
    var key = opKey(op);
    return key === 'add' ? 0 : key === 'update' ? 1 : key === 'remove' ? 2 : 9;
  }
  function pTime(value){
    if(typeof parseTime === 'function') return parseTime(value);
    var t = Date.parse(String(value || '').replace(' ', 'T'));
    return isNaN(t) ? 0 : t;
  }
  function dateRank(ch){
    var raw = ch && ch.time ? String(ch.time).slice(0,10) : '';
    var t = raw ? Date.parse(raw + 'T00:00:00') : 0;
    return isNaN(t) ? 0 : t;
  }
  function sortChangeRecords(list){
    return (list || []).slice().sort(function(a,b){
      var d = dateRank(b) - dateRank(a);
      if(d) return d;
      var o = opRank(a && a.op) - opRank(b && b.op);
      if(o) return o;
      return pTime(b && b.time) - pTime(a && a.time);
    });
  }
  function localeLabel(ch){
    var loc = ch && ch.locale ? String(ch.locale) : '';
    return (loc && loc !== '-') ? loc : 'Global';
  }
  function localeChip(ch){
    var label = localeLabel(ch);
    var cls = label === 'Global' ? 'chip mini change-locale-global' : 'chip mini';
    var title = label === 'Global' ? 'Global / all locales' : label;
    return '<span class="'+cls+'" title="'+h(title)+'">'+h(label)+'</span>';
  }
  function changeSection(ch){
    if(typeof campaignChangeEventName === 'function') return campaignChangeEventName(ch);
    if(typeof TYPE_LABEL !== 'undefined' && ch && TYPE_LABEL[ch.type]) return TYPE_LABEL[ch.type];
    if(typeof getSubscribedEventFromScope === 'function') return getSubscribedEventFromScope(ch && ch.scope);
    return (ch && (ch.scope || ch.type)) || '-';
  }
  function diffHtml(ch){
    if(typeof campaignChangeDiffHtml === 'function') return campaignChangeDiffHtml(ch);
    var key = opKey(ch && ch.op);
    if(key === 'add') return '<span class="diff-add">+ '+h((ch && ch.after) || '')+'</span>';
    if(key === 'remove') return '<span class="diff-remove">− '+h((ch && ch.before) || '')+'</span>';
    return '<span class="diff-old">'+h((ch && ch.before) || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+h((ch && ch.after) || '')+'</span>';
  }

  // Display-only normalization for Change Record > Field.
  // Values are mapped to the field labels or table headers shown on the Campaign Detail page.
  window.getChangeRecordDisplayField = function(ch){
    var field = s(ch && ch.field);
    var scope = s(ch && ch.scope);
    var type = lower(ch && ch.type);
    var f = lower(field);
    var sc = lower(scope);

    // Coupon Info table headers: Gift ID, Gift Name, Gift Type, Time Zone, Start Time, End Time.
    if(type === 'coupon' || /coupon info/.test(sc)){
      if(/gift\s*type/.test(f)) return 'Gift Type';
      if(/time\s*zone/.test(f)) return 'Time Zone';
      if(/start\s*time/.test(f)) return 'Start Time';
      if(/end\s*time/.test(f)) return 'End Time';
      if(/gift\s*name/.test(f)) return 'Gift Name';
      // A row-level coupon add/remove is represented by its primary table key.
      if(/coupon\s*row|row/.test(f) || !field) return 'Gift ID';
      return field;
    }

    // Subsidy Info table headers vary by product line. Use the concrete detail-table header
    // that identifies the changed value instead of generic labels such as "Subsidy row".
    if(type === 'subsidy' || /subsidy info/.test(sc)){
      if(/subsidy\s*status|hotel subsidy status/.test(f)) return 'Subsidy Status';
      if(/hotel/.test(sc)) return /row/.test(f) ? 'Hotel Name' : field;
      if(/tnt/.test(sc)) return /row/.test(f) ? 'Product Name' : field;
      if(/bundle/.test(sc)) return /row/.test(f) ? 'Promotion Type' : field;
      if(/flight/.test(sc)) return /row/.test(f) ? 'Dcity / Acity' : field;
      return /row/.test(f) ? 'Promotion Info' : field;
    }

    // Landing Page Info field labels.
    if(type === 'landing' || /landing page info/.test(sc)){
      if(/terms\s*&\s*conditions|terms&conditions/.test(f)) return 'Terms&Conditions';
      if(/landing\s*page\s*url/.test(f)) return 'Landing Page URL';
      if(/share\s*url/.test(f)) return 'Share URL';
      if(/share\s*image/.test(f)) return 'Share Image';
      if(/canonical\s*url/.test(f)) return 'Canonical Url';
      if(/share\s*title/.test(f)) return 'Share Title';
      if(/share\s*description/.test(f)) return 'Share Description';
      if(/description/.test(f)) return 'Description';
      if(/keywords/.test(f)) return 'Keywords';
      if(/title/.test(f)) return 'Title';
      if(/version/.test(f)) return 'Version';
      if(/update\s*time/.test(f)) return 'Update Time';
      return field;
    }

    // Promotion Channel Info table headers: Channel, Copy Headline, Copy Content.
    if(type === 'promotion' || /promotion/.test(sc)){
      if(/headline/.test(f)) return 'Copy Headline';
      if(/copy\s*content|content/.test(f)) return 'Copy Content';
      if(/channel/.test(f)) return 'Channel';
      return field;
    }

    // Supplementary Info block label.
    if(type === 'supplementary' || /supplementary info/.test(sc)){
      if(/remark|note|supplementary/.test(f) || !field) return 'Supplementary Info';
      return field;
    }

    // Campaign Basic Info labels.
    if(type === 'campaign' || /campaign basic info/.test(sc)){
      if(/start\/?end\s*date|start\s*end\s*date/.test(f)) return 'Start/End Date';
      if(/promoted\s*product\s*lines/.test(f)) return 'Promoted Product Lines';
      if(/campaign\s*mechanism/.test(f)) return 'Campaign Mechanism';
      if(/campaign\s*region/.test(f)) return 'Campaign Region';
      if(/campaign\s*theme/.test(f)) return 'Campaign Theme';
      if(/campaign\s*grade/.test(f)) return 'Campaign Grade';
      if(/campaign\s*description/.test(f)) return 'Campaign Description';
      if(/campaign\s*timezone/.test(f)) return 'Campaign Timezone';
      if(/launch\s*date/.test(f)) return 'Launch Date';
      if(/period\s*type/.test(f)) return 'Period Type';
      if(/campaign\s*status|status/.test(f)) return 'Campaign Status';
      if(/creator/.test(f)) return 'Creator';
      if(/update\s*time/.test(f)) return 'Update Time';
      return field || '-';
    }

    return field || '-';
  };
  function fieldLabel(ch){
    return window.getChangeRecordDisplayField ? window.getChangeRecordDisplayField(ch) : ((ch && ch.field) || '-');
  }

  function validSince(value){
    var m = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m) return '';
    var y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
    var date = new Date(y, mo - 1, d, 0, 0, 0, 0);
    if(date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return '';
    return m[1] + '-' + m[2] + '-' + m[3];
  }
  function filterNote(){
    var el = document.getElementById('fChangeRecordSince');
    var v = el ? validSince(el.value) : '';
    return v ? 'since ' + v : '';
  }
  function visibleCampaignChanges(id){
    var list = [];
    if(typeof window.campaignVisibleChangesByRecordSince === 'function') list = window.campaignVisibleChangesByRecordSince(id) || [];
    else if(typeof campaignChangeList === 'function') list = campaignChangeList(id) || [];
    else if(typeof CHANGES !== 'undefined') list = (CHANGES[id] || CHANGES[Number(id)] || CHANGES[String(id)] || []).slice();
    return sortChangeRecords(list);
  }
  function renderCampaignRows(list){
    return sortChangeRecords(list).map(function(ch){
      var field = fieldLabel(ch);
      return '<tr>'
        + '<td>'+localeChip(ch)+'</td>'
        + '<td><span class="op-pill op-'+h(opKey(ch && ch.op))+'">'+h(opLabel(ch && ch.op))+'</span></td>'
        + '<td title="'+h(changeSection(ch))+'">'+h(changeSection(ch))+'</td>'
        + '<td title="'+h(field)+'">'+h(field)+'</td>'
        + '<td>'+diffHtml(ch)+'</td>'
        + '<td class="muted" title="'+h((ch && ch.time) || '-')+'">'+h((ch && ch.time) || '-')+'</td>'
        + '</tr>';
    }).join('');
  }
  window.renderCampaignChangePanel = function(id){
    var list = visibleCampaignChanges(id);
    var note = filterNote();
    if(!list.length){
      return '<div class="campaign-change-panel"><div class="campaign-no-change">No change records'+(note ? ' '+h(note) : '')+' for this campaign.</div></div>';
    }
    return '<div class="campaign-change-panel">'
      + '<div class="campaign-change-title">Change Records <span class="campaign-change-count">'+h(list.length + ' update' + (list.length === 1 ? '' : 's'))+'</span>'+(note ? '<span class="campaign-change-filter-note">'+h(note)+'</span>' : '')+'</div>'
      + '<div class="campaign-changes-scroll">'
      + '<table class="campaign-changes-table"><colgroup class="campaign-changes-responsive-colgroup"><col><col><col><col><col><col></colgroup>'
      + '<thead><tr><th>Locale</th><th>Operation</th><th>Change Section</th><th>Field</th><th>Change</th><th>Update Time</th></tr></thead>'
      + '<tbody>'+renderCampaignRows(list)+'</tbody>'
      + '</table></div></div>';
  };
  try { renderCampaignChangePanel = window.renderCampaignChangePanel; } catch(err) {}

  window.digestRenderChange = function(id, ch){
    var t = String((ch && ch.time) || '').slice(11, 16);
    var section = changeSection(ch);
    var field = fieldLabel(ch);
    return '<div class="dg-change" role="button" tabindex="0" onclick="digestJump(\''+js(id)+'\',\''+js(ch && ch.type)+'\',\''+js((ch && ch.locale) || '')+'\',\'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();digestJump(\''+js(id)+'\',\''+js(ch && ch.type)+'\',\''+js((ch && ch.locale) || '')+'\',\'\')}" title="Open '+h(section)+' in campaign detail">'
      + '<span class="dg-locale-cell">'+localeChip(ch)+'</span>'
      + '<span class="op-pill op-'+h(opKey(ch && ch.op))+'">'+h(opLabel(ch && ch.op))+'</span>'
      + '<span class="dg-section-cell" title="'+h(section)+'">'+h(section)+'</span>'
      + '<span class="dg-field" title="'+h((ch && ch.scope) || '')+' · '+h(field)+'">'+h(field)+'</span>'
      + '<span class="dg-diff">'+diffHtml(ch)+'</span>'
      + '<span class="dg-time">'+h(t)+'</span>'
      + '<span class="dg-go" aria-hidden="true">→</span>'
      + '</div>';
  };
  try { digestRenderChange = window.digestRenderChange; } catch(err) {}

  try { if(typeof renderTable === 'function') renderTable(); } catch(err) { console.warn('[field display fix] renderTable', err); }
  try { if(typeof renderDigest === 'function') renderDigest(); } catch(err) { console.warn('[field display fix] renderDigest', err); }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function h(v){
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function pTime(value){
    if(typeof parseTime === 'function'){
      var parsed = parseTime(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    var t = Date.parse(String(value || '').replace(' ', 'T'));
    return isNaN(t) ? 0 : t;
  }
  function dayOf(value){
    var s = String(value || '').trim();
    var m = s.match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : '';
  }
  function reportDay(){
    if(typeof digestDateStr === 'function'){
      var d = digestDateStr();
      if(d) return d;
    }
    var max = 0;
    if(typeof CHANGES !== 'undefined'){
      Object.keys(CHANGES || {}).forEach(function(id){
        (CHANGES[id] || []).forEach(function(ch){ var t = pTime(ch && ch.time); if(t > max) max = t; });
      });
    }
    if(typeof CAMPAIGNS !== 'undefined'){
      CAMPAIGNS.forEach(function(c){ var t = pTime(c && c.createTime); if(t > max) max = t; });
    }
    if(max){
      var dt = new Date(max), pad = function(n){ return String(n).padStart(2, '0'); };
      return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
    }
    var now = new Date(), padNow = function(n){ return String(n).padStart(2, '0'); };
    return now.getFullYear() + '-' + padNow(now.getMonth() + 1) + '-' + padNow(now.getDate());
  }
  function reportDateLabel(day){
    if(typeof digestDateLabel === 'function') return digestDateLabel();
    var names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var d = new Date(String(day || '').replace(/-/g, '/'));
    if(isNaN(d.getTime())) return h(day || '');
    return weekdays[d.getDay()] + ', ' + names[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function getCampaign(id){
    if(typeof getCampaignById === 'function') return getCampaignById(id);
    var key = String(id);
    return (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).find(function(c){ return String(c && c.campaignId) === key; }) || null;
  }
  function getDetail(id){
    return (typeof DETAILS !== 'undefined') ? (DETAILS[id] || DETAILS[Number(id)] || DETAILS[String(id)] || null) : null;
  }
  function rawChanges(id){
    if(typeof CHANGES === 'undefined') return [];
    return (CHANGES[id] || CHANGES[Number(id)] || CHANGES[String(id)] || []).slice();
  }
  function opKey(op){
    var key = String(op || '').toLowerCase();
    if(key === 'added') key = 'add';
    if(key === 'updated') key = 'update';
    if(key === 'removed' || key === 'delete' || key === 'deleted') key = 'remove';
    return key || 'other';
  }
  function opRank(op){
    var key = opKey(op);
    return key === 'add' ? 0 : key === 'update' ? 1 : key === 'remove' ? 2 : 9;
  }
  function sortChanges(list){
    return (list || []).slice().sort(function(a,b){
      var dateA = Date.parse((dayOf(a && a.time) || '1970-01-01') + 'T00:00:00');
      var dateB = Date.parse((dayOf(b && b.time) || '1970-01-01') + 'T00:00:00');
      var dd = (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      if(dd) return dd;
      var od = opRank(a && a.op) - opRank(b && b.op);
      if(od) return od;
      return pTime(b && b.time) - pTime(a && a.time);
    });
  }
  function changesOnDay(id, day){
    return sortChanges(rawChanges(id).filter(function(ch){ return dayOf(ch && ch.time) === day; }));
  }
  function mechanismValues(id){
    if(window.campaignMechanismValuesForDigest){
      try { return window.campaignMechanismValuesForDigest(id) || []; } catch(err) {}
    }
    var d = getDetail(id);
    var raw = d && d.campaign ? d.campaign.mechanism : null;
    var arr = Array.isArray(raw) ? raw : String(raw || '').split(/[,;|/、，]+/);
    return arr.map(function(v){ return String(v == null ? '' : v).trim(); })
      .filter(function(v){ var low = v.toLowerCase(); return !!v && v !== '/' && low !== 'null' && low !== 'none' && low !== 'n/a'; });
  }
  function hasMechanism(id){ return mechanismValues(id).length > 0; }
  function gradeLabel(c){ return String((c && c.grade) || '').trim() || '-'; }
  function tierCounts(list){
    var out = {'Tier 1':0,'Tier 2':0,'Tier 3':0};
    (list || []).forEach(function(c){
      var g = gradeLabel(c).toLowerCase().replace(/\s+/g, '');
      if(g === 'tier1') out['Tier 1'] += 1;
      if(g === 'tier2') out['Tier 2'] += 1;
      if(g === 'tier3') out['Tier 3'] += 1;
    });
    return out;
  }
  function campaignStatus(c){
    var raw = String((c && c.status) || '').toLowerCase();
    if(raw === 'live' || raw === 'ongoing') return 'ongoing';
    if(raw === 'upcoming' || raw === 'ended' || raw === 'draft') return raw;
    return raw || 'upcoming';
  }
  function statusLabel(st){
    st = String(st || '').toLowerCase();
    if(st === 'ongoing' || st === 'live') return 'Ongoing';
    if(st === 'upcoming') return 'Upcoming';
    if(st === 'ended') return 'Ended';
    if(st === 'draft') return 'Draft';
    return st ? st.charAt(0).toUpperCase() + st.slice(1) : '-';
  }
  function statusClass(st){ return st === 'ongoing' ? 'ongoing' : st; }
  function statusRank(st){
    st = String(st || '').toLowerCase();
    if(st === 'upcoming') return 0;
    if(st === 'ongoing' || st === 'live') return 1;
    if(st === 'draft') return 2;
    if(st === 'ended') return 3;
    return 9;
  }
  function gradeRank(grade){
    var g = String(grade || '').toLowerCase().replace(/\s+/g, '');
    if(g === 'tier1') return 0;
    if(g === 'tier2') return 1;
    if(g === 'tier3') return 2;
    return 9;
  }
  function sortGroups(groups){
    return (groups || []).slice().sort(function(a,b){
      var sd = statusRank(campaignStatus(a && a.c)) - statusRank(campaignStatus(b && b.c));
      if(sd) return sd;
      var gd = gradeRank(a && a.c && a.c.grade) - gradeRank(b && b.c && b.c.grade);
      if(gd) return gd;
      return pTime(b && b.latest) - pTime(a && a.latest);
    });
  }
  function isCampaignAddChange(ch){
    if(opKey(ch && ch.op) !== 'add') return false;
    var text = [ch && ch.type, ch && ch.scope, ch && ch.field].join(' ').toLowerCase();
    if(!/campaign/.test(text)) return false;
    if(/coupon|subsidy|landing|promotion|supplementary/.test(text)) return false;
    return true;
  }
  function newCampaigns(day){
    var ids = {};
    (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).forEach(function(c){
      if(dayOf(c && c.createTime) === day) ids[String(c.campaignId)] = true;
    });
    if(typeof CHANGES !== 'undefined'){
      Object.keys(CHANGES || {}).forEach(function(id){
        if(changesOnDay(id, day).some(isCampaignAddChange)) ids[String(id)] = true;
      });
    }
    return Object.keys(ids).map(getCampaign).filter(Boolean).sort(function(a,b){ return pTime(b.createTime) - pTime(a.createTime); });
  }
  function subsidyCouponChanged(g){
    return (g && g.list || []).some(function(ch){
      var text = [ch && ch.type, ch && ch.scope].join(' ').toLowerCase();
      return /subsidy/.test(text) || /coupon/.test(text);
    });
  }
  function fallbackDigestGroups(day){
    var groups = [];
    if(typeof CHANGES === 'undefined') return groups;
    Object.keys(CHANGES || {}).forEach(function(id){
      var c = getCampaign(id); if(!c) return;
      var list = changesOnDay(id, day);
      if(!list.length) return;
      groups.push({ id:String(id), c:c, list:list, latest:pTime(list[0] && list[0].time), hasMechanism:hasMechanism(id), mechanismValues:mechanismValues(id) });
    });
    return sortGroups(groups);
  }
  function getDigestGroups(day){
    var groups = [];
    if(typeof digestHighlights === 'function'){
      try {
        var result = digestHighlights() || {};
        groups = result.groups || [];
        if(result.day && result.day !== day) day = result.day;
      } catch(err) { groups = []; }
    }
    if(!groups.length) groups = fallbackDigestGroups(day);
    return sortGroups(groups.map(function(g){
      var id = String(g.id || (g.c && g.c.campaignId));
      var c = g.c || getCampaign(id);
      return {
        id:id,
        c:c,
        list:sortChanges(g.list || changesOnDay(id, day)),
        latest:g.latest || pTime((g.list || [])[0] && (g.list || [])[0].time),
        hasMechanism:(typeof g.hasMechanism === 'boolean') ? g.hasMechanism : hasMechanism(id),
        mechanismValues:g.mechanismValues || mechanismValues(id)
      };
    }).filter(function(g){ return !!g.c && g.list.length; }));
  }
  function hasSubsidyCouponMechanism(id){
    var d = getDetail(id);
    var hasRows = false;
    function scanSubsidy(subsidy){
      Object.keys(subsidy || {}).forEach(function(locale){
        var localeBlock = subsidy[locale] || {};
        ['flight','hotel','tnt','bundle'].forEach(function(line){
          var block = localeBlock[line] || {};
          if(Array.isArray(block.rows) && block.rows.length) hasRows = true;
        });
      });
    }
    function scanCoupon(coupon){
      Object.keys(coupon || {}).forEach(function(locale){
        var block = coupon[locale] || {};
        if(Array.isArray(block.rows) && block.rows.length) hasRows = true;
      });
    }
    if(d){ scanSubsidy(d.subsidy); scanCoupon(d.coupon); }
    if(hasRows) return true;
    if(rawChanges(id).some(function(ch){
      var text = [ch && ch.type, ch && ch.scope, ch && ch.field].join(' ').toLowerCase();
      return /subsidy|coupon/.test(text);
    })) return true;
    return hasMechanism(id);
  }
  function tierRankForCampaign(c){
    if(typeof gradeRank === 'function') return gradeRank(c && c.grade);
    var g = String((c && c.grade) || '').toLowerCase().replace(/\s+/g, '');
    if(g === 'tier1') return 0;
    if(g === 'tier2') return 1;
    if(g === 'tier3') return 2;
    return 9;
  }
  function sortedSummaryItems(items){
    return (items || []).map(function(item, idx){
      var c = item.c || item;
      return { item:item, c:c, idx:idx };
    }).sort(function(a,b){
      var tr = tierRankForCampaign(a.c) - tierRankForCampaign(b.c);
      if(tr) return tr;
      return a.idx - b.idx;
    }).map(function(x){ return x.item; });
  }
  function tierBadge(c){
    var label = gradeLabel(c);
    var cls = label.toLowerCase().replace(/\s+/g,'');
    return '<span class="badge-tier tier-'+h(cls)+'">'+h(label)+'</span>';
  }
  function summaryCampaignList(items){
    items = sortedSummaryItems(items || []);
    if(!items.length) return '<div class="dg-summary-empty">None</div>';
    return '<ul class="dg-summary-list">' + items.map(function(item){
      var c = item.c || item;
      var id = item.id || c.campaignId;
      return '<li class="dg-summary-campaign-item" role="button" tabindex="0" onclick="openDetail('+Number(id)+')" onkeydown="if(event.key===&quot;Enter&quot;||event.key===&quot; &quot;){event.preventDefault();openDetail('+Number(id)+')}" title="Open campaign detail"><span class="dg-summary-campaign-name" title="'+h(c.campaignName)+'">'+h(c.campaignName)+'</span><span class="dg-summary-campaign-id">Campaign ID: '+h(id)+'</span>'+tierBadge(c)+'</li>';
    }).join('') + '</ul>';
  }
  function plural(n, word){ return n + ' ' + word + (n === 1 ? '' : 's'); }
  function renderSummary(day, groups){
    var newList = sortedSummaryItems(newCampaigns(day));
    var newIdMap = {};
    newList.forEach(function(c){ newIdMap[String(c.campaignId)] = true; });
    var existingGroups = (groups || []).filter(function(g){ return !newIdMap[String(g.id)]; });
    var newWithMech = newList.filter(function(c){ return hasSubsidyCouponMechanism(c.campaignId); }).length;
    var subsidyCouponGroups = sortedSummaryItems(existingGroups.filter(subsidyCouponChanged));
    return '<div class="dg-summary-layout">'
      + '<section class="dg-summary-card priority">'
      + '<div class="dg-summary-head"><h3>New Campaigns</h3></div>'
      + '<p class="dg-summary-sentence"><b>'+newList.length+'</b> new '+(newList.length === 1 ? 'campaign was' : 'campaigns were')+' added, including <span class="dg-summary-mechanism-phrase">'+newWithMech+' '+(newWithMech === 1 ? 'campaign' : 'campaigns')+' with mechanism (Subsidy Info / Coupon Info)</span>.</p>'
      + '<div class="dg-summary-list-title">Campaign List</div>'
      + summaryCampaignList(newList)
      + '</section>'
      + '<section class="dg-summary-card priority">'
      + '<div class="dg-summary-head"><h3>Existing Campaign (unended) Changes</h3></div>'
      + '<p class="dg-summary-sentence"><b>'+existingGroups.length+'</b> existing '+(existingGroups.length === 1 ? 'campaign' : 'campaigns')+' changed, including <span class="dg-summary-mechanism-phrase">'+subsidyCouponGroups.length+' '+(subsidyCouponGroups.length === 1 ? 'campaign' : 'campaigns')+' with mechanism (Subsidy Info / Coupon Info) changes</span>.</p>'
      + '<div class="dg-summary-list-title">Campaign List</div>'
      + summaryCampaignList(existingGroups)
      + '</section>'
      + '</div>';
  }

  function recordText(n){ return n + ' change record' + (n === 1 ? '' : 's'); }
  function renderChangeRecordSummary(groups){
    var withGroups = (groups || []).filter(function(g){ return !!g.hasMechanism; });
    var withoutGroups = (groups || []).filter(function(g){ return !g.hasMechanism; });
    var withRecords = withGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    var withoutRecords = withoutGroups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    return '<div class="dg-change-record-summary">'
      + '<div class="dg-change-record-summary-card total"><div class="dg-change-record-summary-label">Changed campaigns today</div><div class="dg-change-record-summary-num">'+groups.length+'</div></div>'
      + '<div class="dg-change-record-summary-card with"><div class="dg-change-record-summary-label">Campaign with mechanism</div><div class="dg-change-record-num-row"><div class="dg-change-record-summary-num">'+withGroups.length+'</div><span class="dg-record-delta">'+recordText(withRecords)+'</span></div></div>'
      + '<div class="dg-change-record-summary-card without"><div class="dg-change-record-summary-label">Campaign without mechanism</div><div class="dg-change-record-num-row"><div class="dg-change-record-summary-num">'+withoutGroups.length+'</div><span class="dg-record-delta">'+recordText(withoutRecords)+'</span></div></div>'
      + '</div>';
  }
  function renderUpdatesText(n){ return n + ' update' + (n === 1 ? '' : 's'); }
  function gradeBadge(grade){
    var label = String(grade || '').trim() || '-';
    var cls = label.toLowerCase().replace(/\s+/g,'');
    return '<span class="badge-tier tier-'+h(cls)+'">'+h(label)+'</span>';
  }
  function renderDigestGroupForRecord(g){
    var sortedList = sortChanges(g && g.list);
    var st = campaignStatus(g && g.c);
    return '<article class="dg-group '+(g && g.hasMechanism ? 'dg-group-with-mechanism' : 'dg-group-without-mechanism')+'">'
      + '<header class="dg-group-head"><div class="dg-group-title">'
      + '<span class="link-name" role="button" tabindex="0" onclick="openDetail('+Number(g && g.id)+')" onkeydown="if(event.key===\'Enter\'){openDetail('+Number(g && g.id)+')}" title="Open campaign detail">'+h(g && g.c && g.c.campaignName)+'</span>'
      + '<span class="badge-stage '+h(statusClass(st))+'">'+h(statusLabel(st))+'</span>'
      + gradeBadge(g && g.c && g.c.grade)
      + '</div><div class="dg-group-meta"><span class="dg-count">'+renderUpdatesText(sortedList.length)+'</span></div></header>'
      + '<div class="dg-changes">'+sortedList.map(function(ch){ return (typeof digestRenderChange === 'function') ? digestRenderChange(g.id, ch) : ''; }).join('')+'</div>'
      + '</article>';
  }
  function renderGroupedHighlights(groups){
    groups = groups || [];
    if(!groups.length){
      return '<div class="dg-empty"><div class="dg-empty-art" aria-hidden="true">✓</div><div class="dg-empty-title">No changes today</div><div class="dg-empty-text">All campaigns are steady.</div></div>';
    }
    var withGroups = sortGroups(groups.filter(function(g){ return !!g.hasMechanism; }));
    var withoutGroups = sortGroups(groups.filter(function(g){ return !g.hasMechanism; }));
    function section(label, arr){
      var updateCount = (arr || []).reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
      var stat = arr.length + ' campaign' + (arr.length === 1 ? '' : 's') + ' · ' + updateCount + ' update' + (updateCount === 1 ? '' : 's');
      var body = arr.length ? arr.map(renderDigestGroupForRecord).join('') : '<div class="dg-empty dg-empty-inline"><div class="dg-empty-title">No changes today</div></div>';
      return '<div class="dg-mech-section"><div class="dg-mech-section-title"><span>'+h(label)+'</span><span class="dg-mech-title-stat">'+h(stat)+'</span></div>'+body+'</div>';
    }
    return section('Campaign with mechanism', withGroups) + section('Campaign without mechanism', withoutGroups);
  }
  window.renderDigest = function(){
    var box = byId('digestBody');
    if(!box) return;
    var day = reportDay();
    var groups = getDigestGroups(day);
    var totalChanges = groups.reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
    var hero = '<div class="page-card dg-hero dg-hero-v4">'
      + '<div class="dg-hero-main dg-hero-title-stack"><div class="dg-report-title-row"><div><h2>Campaign Notification Daily Report</h2><p class="page-intro dg-page-intro">This page is used for reviewing today\'s new campaigns and existing campaign changes, with key focus on campaign mechanism (Subsidy Info / Coupon Info) changes.</p></div><span class="dg-report-date-pill">'+h(reportDateLabel(day))+'</span></div></div>'
      + '</div>';
    var changeRecord = '<div class="dg-highlights dg-highlights-flat">' + renderGroupedHighlights(groups) + '</div>';
    box.innerHTML = hero + '<div class="dg-section-title">Summary</div>' + renderSummary(day, groups) + '<div class="dg-section-title">Change Record</div>' + changeRecord;
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
    if(typeof refreshTableOverflowTooltips === 'function') refreshTableOverflowTooltips(box);
  };
  try { renderDigest = window.renderDigest; } catch(err) {}
  try { window.renderDigest(); } catch(err) { console.warn('[daily report summary/change record patch]', err); }
})();

;

(function(){
  function h(v){
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function js(v){
    return String(v == null ? '' : v)
      .replace(/\\/g,'\\\\')
      .replace(/'/g,"\\'")
      .replace(/\n/g,'\\n')
      .replace(/\r/g,'');
  }
  function pTime(value){
    if(typeof parseTime === 'function') return parseTime(value);
    var t = Date.parse(String(value || '').replace(' ', 'T'));
    return isNaN(t) ? 0 : t;
  }
  function reportDay(){
    if(typeof digestDateStr === 'function'){
      try { var d = digestDateStr(); if(d) return d; } catch(err) {}
    }
    var max = 0;
    try{
      if(typeof CHANGES !== 'undefined'){
        Object.keys(CHANGES || {}).forEach(function(id){
          (CHANGES[id] || []).forEach(function(ch){ var t = pTime(ch && ch.time); if(t > max) max = t; });
        });
      }
      if(typeof CAMPAIGNS !== 'undefined'){
        CAMPAIGNS.forEach(function(c){ var t = pTime(c && c.createTime); if(t > max) max = t; });
      }
    }catch(err){}
    var dt = max ? new Date(max) : new Date();
    var pad = function(n){ return String(n).padStart(2, '0'); };
    return dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate());
  }
  function reportDateLabel(day){
    if(typeof digestDateLabel === 'function'){
      try { return digestDateLabel(); } catch(err) {}
    }
    var names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var d = new Date(String(day || '').replace(/-/g, '/'));
    if(isNaN(d.getTime())) return h(day || '');
    return weekdays[d.getDay()] + ', ' + names[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function dayOf(value){
    var s = String(value || '');
    var m = s.match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : '';
  }
  function getCampaign(id){
    if(typeof getCampaignById === 'function'){
      try { return getCampaignById(id); } catch(err) {}
    }
    var key = String(id);
    return (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).find(function(c){ return String(c && c.campaignId) === key; }) || null;
  }
  function getDetail(id){
    return (typeof DETAILS !== 'undefined') ? (DETAILS[id] || DETAILS[Number(id)] || DETAILS[String(id)] || null) : null;
  }
  function rawChanges(id){
    if(typeof CHANGES === 'undefined') return [];
    return (CHANGES[id] || CHANGES[Number(id)] || CHANGES[String(id)] || []).slice();
  }
  function opKey(op){
    var key = String(op || '').toLowerCase();
    if(key === 'added') key = 'add';
    if(key === 'updated') key = 'update';
    if(key === 'removed' || key === 'delete' || key === 'deleted') key = 'remove';
    return key || 'other';
  }
  function opLabel(op){
    var key = opKey(op);
    if(typeof OP_LABEL !== 'undefined' && OP_LABEL[key]) return OP_LABEL[key];
    return key === 'add' ? 'Added' : key === 'update' ? 'Updated' : key === 'remove' ? 'Removed' : key.charAt(0).toUpperCase() + key.slice(1);
  }
  function opRank(op){
    var key = opKey(op);
    return key === 'add' ? 0 : key === 'update' ? 1 : key === 'remove' ? 2 : 9;
  }
  function localeLabel(ch){
    var loc = ch && ch.locale ? String(ch.locale).trim() : '';
    return (loc && loc !== '-') ? loc : 'Global';
  }
  function localeRank(label, c){
    label = String(label || 'Global');
    var team = c && c.team;
    var locales = (typeof TEAM_LOCALES !== 'undefined' && team && TEAM_LOCALES[team]) ? TEAM_LOCALES[team] : [];
    var idx = locales.indexOf(label);
    if(idx >= 0) return idx;
    if(label === 'Global') return locales.length + 100;
    return locales.length + 200 + label.toLowerCase().charCodeAt(0);
  }
  function dateRank(ch){
    var raw = dayOf(ch && ch.time);
    var t = raw ? Date.parse(raw + 'T00:00:00') : 0;
    return isNaN(t) ? 0 : t;
  }
  function sortChangesByLocaleThenOperation(list, c){
    return (list || []).slice().sort(function(a,b){
      var d = dateRank(b) - dateRank(a);
      if(d) return d;
      var lr = localeRank(localeLabel(a), c) - localeRank(localeLabel(b), c);
      if(lr) return lr;
      var o = opRank(a && a.op) - opRank(b && b.op);
      if(o) return o;
      return pTime(b && b.time) - pTime(a && a.time);
    });
  }
  function groupedByLocale(list, c){
    var sorted = sortChangesByLocaleThenOperation(list || [], c);
    var groups = [];
    sorted.forEach(function(ch){
      var label = localeLabel(ch);
      var last = groups[groups.length - 1];
      if(!last || last.label !== label) groups.push({ label:label, items:[] });
      groups[groups.length - 1].items.push(ch);
    });
    return groups;
  }
  function mechanismValues(id){
    if(window.campaignMechanismValuesForDigest){
      try { return window.campaignMechanismValuesForDigest(id) || []; } catch(err) {}
    }
    var d = getDetail(id);
    var raw = d && d.campaign ? d.campaign.mechanism : null;
    var arr = Array.isArray(raw) ? raw : String(raw || '').split(/[,;|/、，]+/);
    return arr.map(function(v){ return String(v == null ? '' : v).trim(); }).filter(function(v){
      var low = v.toLowerCase();
      return !!v && v !== '/' && low !== 'null' && low !== 'none' && low !== 'n/a';
    });
  }
  function hasMechanism(id){ return mechanismValues(id).length > 0; }
  function hasSubsidyCouponMechanism(id){
    var d = getDetail(id);
    var hasRows = false;
    function scanSubsidy(subsidy){
      Object.keys(subsidy || {}).forEach(function(locale){
        var localeBlock = subsidy[locale] || {};
        ['flight','hotel','tnt','bundle'].forEach(function(line){
          var block = localeBlock[line] || {};
          if(Array.isArray(block.rows) && block.rows.length) hasRows = true;
        });
      });
    }
    function scanCoupon(coupon){
      Object.keys(coupon || {}).forEach(function(locale){
        var block = coupon[locale] || {};
        if(Array.isArray(block.rows) && block.rows.length) hasRows = true;
      });
    }
    if(d){ scanSubsidy(d.subsidy); scanCoupon(d.coupon); }
    if(hasRows) return true;
    if(rawChanges(id).some(function(ch){
      var text = [ch && ch.type, ch && ch.scope, ch && ch.field].join(' ').toLowerCase();
      return /subsidy|coupon/.test(text);
    })) return true;
    return hasMechanism(id);
  }
  function gradeLabel(c){ return String((c && c.grade) || '').trim() || '-'; }
  function gradeRank(grade){
    var g = String(grade || '').toLowerCase().replace(/\s+/g, '');
    return g === 'tier1' ? 0 : g === 'tier2' ? 1 : g === 'tier3' ? 2 : 9;
  }
  function gradeBadge(grade){
    var label = String(grade || '').trim() || '-';
    var cls = label.toLowerCase().replace(/\s+/g,'');
    return '<span class="badge-tier tier-'+h(cls)+'">'+h(label)+'</span>';
  }
  function tierRankForCampaign(c){ return gradeRank(c && c.grade); }
  function sortedSummaryItems(items){
    return (items || []).map(function(item, idx){ var c = item.c || item; return {item:item, c:c, idx:idx}; })
      .sort(function(a,b){ var tr = tierRankForCampaign(a.c) - tierRankForCampaign(b.c); return tr || (a.idx - b.idx); })
      .map(function(x){ return x.item; });
  }
  function tierBadge(c){ return gradeBadge(c && c.grade); }
  function statusRaw(c){
    var raw = String((c && c.status) || '').toLowerCase();
    if(raw === 'live' || raw === 'ongoing') return 'ongoing';
    if(raw === 'upcoming' || raw === 'ended' || raw === 'draft') return raw;
    return raw || 'upcoming';
  }
  function statusLabel(st){
    st = String(st || '').toLowerCase();
    if(st === 'ongoing' || st === 'live') return 'Ongoing';
    if(st === 'upcoming') return 'Upcoming';
    if(st === 'ended') return 'Ended';
    if(st === 'draft') return 'Draft';
    return st ? st.charAt(0).toUpperCase() + st.slice(1) : '-';
  }
  function statusClass(st){ return st === 'ongoing' ? 'ongoing' : st; }
  function statusRank(st){
    st = String(st || '').toLowerCase();
    if(st === 'upcoming') return 0;
    if(st === 'ongoing' || st === 'live') return 1;
    if(st === 'draft') return 2;
    if(st === 'ended') return 3;
    return 9;
  }
  function sortGroups(groups){
    return (groups || []).slice().sort(function(a,b){
      var sd = statusRank(statusRaw(a && a.c)) - statusRank(statusRaw(b && b.c));
      if(sd) return sd;
      var gd = gradeRank(a && a.c && a.c.grade) - gradeRank(b && b.c && b.c.grade);
      if(gd) return gd;
      return pTime(b && b.latest) - pTime(a && a.latest);
    });
  }
  function isCampaignAddChange(ch){
    if(opKey(ch && ch.op) !== 'add') return false;
    var text = [ch && ch.type, ch && ch.scope, ch && ch.field].join(' ').toLowerCase();
    if(!/campaign/.test(text)) return false;
    if(/coupon|subsidy|landing|promotion|supplementary/.test(text)) return false;
    return true;
  }
  function newCampaigns(day){
    var ids = {};
    (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).forEach(function(c){
      if(dayOf(c && c.createTime) === day) ids[String(c.campaignId)] = true;
    });
    if(typeof CHANGES !== 'undefined'){
      Object.keys(CHANGES || {}).forEach(function(id){
        var list = rawChanges(id).filter(function(ch){ return dayOf(ch && ch.time) === day; });
        if(list.some(isCampaignAddChange)) ids[String(id)] = true;
      });
    }
    return Object.keys(ids).map(getCampaign).filter(Boolean).sort(function(a,b){ return pTime(b.createTime) - pTime(a.createTime); });
  }
  function subsidyCouponChanged(g){
    return (g && g.list || []).some(function(ch){
      var text = [ch && ch.type, ch && ch.scope].join(' ').toLowerCase();
      return /subsidy/.test(text) || /coupon/.test(text);
    });
  }
  function changesOnDay(id, day){
    return rawChanges(id).filter(function(ch){ return dayOf(ch && ch.time) === day; });
  }
  function getDigestGroups(day){
    var groups = [];
    if(typeof digestHighlights === 'function'){
      try{
        var result = digestHighlights() || {};
        if(result.day && result.day !== day) day = result.day;
        groups = result.groups || [];
      }catch(err){ groups = []; }
    }
    if(!groups.length && typeof CHANGES !== 'undefined'){
      Object.keys(CHANGES || {}).forEach(function(id){
        var c = getCampaign(id); if(!c) return;
        var list = changesOnDay(id, day);
        if(!list.length) return;
        groups.push({id:String(id), c:c, list:list, latest:pTime(list[0] && list[0].time)});
      });
    }
    return sortGroups(groups.map(function(g){
      var id = String(g.id || (g.c && g.c.campaignId));
      var c = g.c || getCampaign(id);
      var list = changesOnDay(id, day);
      if(g.list && g.list.length){
        list = (g.list || []).filter(function(ch){ return !day || !dayOf(ch && ch.time) || dayOf(ch && ch.time) === day; });
      }
      list = sortChangesByLocaleThenOperation(list, c);
      return {
        id:id,
        c:c,
        list:list,
        latest:g.latest || pTime((list || [])[0] && (list || [])[0].time),
        hasMechanism:(typeof g.hasMechanism === 'boolean') ? g.hasMechanism : hasMechanism(id),
        mechanismValues:g.mechanismValues || mechanismValues(id)
      };
    }).filter(function(g){ return !!g.c && g.list.length; }));
  }
  function plural(n, word){ return n + ' ' + word + (n === 1 ? '' : 's'); }
  function summaryCampaignList(items){
    items = sortedSummaryItems(items || []);
    if(!items.length) return '<div class="dg-summary-empty">None</div>';
    return '<ul class="dg-summary-list">' + items.map(function(item){
      var c = item.c || item;
      var id = item.id || c.campaignId;
      return '<li class="dg-summary-campaign-item" role="button" tabindex="0" onclick="openDetail('+Number(id)+')" onkeydown="if(event.key===&quot;Enter&quot;||event.key===&quot; &quot;){event.preventDefault();openDetail('+Number(id)+')}" title="Open campaign detail"><span class="dg-summary-campaign-name" title="'+h(c.campaignName)+'">'+h(c.campaignName)+'</span><span class="dg-summary-campaign-id">Campaign ID: '+h(id)+'</span>'+tierBadge(c)+'</li>';
    }).join('') + '</ul>';
  }
  function renderSummary(day, groups){
    var newList = sortedSummaryItems(newCampaigns(day));
    var newIdMap = {};
    newList.forEach(function(c){ newIdMap[String(c.campaignId)] = true; });
    var existingGroups = (groups || []).filter(function(g){ return !newIdMap[String(g.id)]; });
    var newWithMech = newList.filter(function(c){ return hasSubsidyCouponMechanism(c.campaignId); }).length;
    var subsidyCouponGroups = sortedSummaryItems(existingGroups.filter(subsidyCouponChanged));
    return '<div class="dg-summary-layout">'
      + '<section class="dg-summary-card priority">'
      + '<div class="dg-summary-head"><h3>New Campaigns</h3></div>'
      + '<p class="dg-summary-sentence"><b>'+newList.length+'</b> new '+(newList.length === 1 ? 'campaign was' : 'campaigns were')+' added, including <span class="dg-summary-mechanism-phrase">'+newWithMech+' '+(newWithMech === 1 ? 'campaign' : 'campaigns')+' with mechanism (Subsidy Info / Coupon Info)</span>.</p>'
      + '<div class="dg-summary-list-title">Campaign List</div>'
      + summaryCampaignList(newList)
      + '</section>'
      + '<section class="dg-summary-card priority">'
      + '<div class="dg-summary-head"><h3>Existing Campaign (unended) Changes</h3></div>'
      + '<p class="dg-summary-sentence"><b>'+existingGroups.length+'</b> existing '+(existingGroups.length === 1 ? 'campaign' : 'campaigns')+' changed, including <span class="dg-summary-mechanism-phrase">'+subsidyCouponGroups.length+' '+(subsidyCouponGroups.length === 1 ? 'campaign' : 'campaigns')+' with mechanism (Subsidy Info / Coupon Info) changes</span>.</p>'
      + '<div class="dg-summary-list-title">Campaign List</div>'
      + summaryCampaignList(existingGroups)
      + '</section>'
      + '</div>';
  }
  function renderUpdatesText(n){ return n + ' update' + (n === 1 ? '' : 's'); }
  function diffHtml(ch){
    if(typeof campaignChangeDiffHtml === 'function') return campaignChangeDiffHtml(ch);
    var key = opKey(ch && ch.op);
    if(key === 'add') return '<span class="diff-add">+ '+h((ch && ch.after) || '')+'</span>';
    if(key === 'remove') return '<span class="diff-remove">− '+h((ch && ch.before) || '')+'</span>';
    return '<span class="diff-old">'+h((ch && ch.before) || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+h((ch && ch.after) || '')+'</span>';
  }
  function changeSection(ch){
    if(typeof campaignChangeEventName === 'function') return campaignChangeEventName(ch);
    if(typeof TYPE_LABEL !== 'undefined' && ch && TYPE_LABEL[ch.type]) return TYPE_LABEL[ch.type];
    if(typeof getSubscribedEventFromScope === 'function') return getSubscribedEventFromScope(ch && ch.scope);
    return (ch && (ch.scope || ch.type)) || '-';
  }
  function fieldLabel(ch){
    if(window.getChangeRecordDisplayField) return window.getChangeRecordDisplayField(ch);
    return (ch && ch.field) || '-';
  }
  window.digestRenderChange = function(id, ch){
    var t = String((ch && ch.time) || '').slice(11, 16);
    var section = changeSection(ch);
    var field = fieldLabel(ch);
    return '<div class="dg-change" role="button" tabindex="0" onclick="digestJump(\''+js(id)+'\',\''+js(ch && ch.type)+'\',\''+js((ch && ch.locale) || '')+'\',\'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();digestJump(\''+js(id)+'\',\''+js(ch && ch.type)+'\',\''+js((ch && ch.locale) || '')+'\',\'\')}" title="Open '+h(section)+' in campaign detail">'
      + '<span class="dg-locale-cell"><span class="dg-locale-text" title="'+h(localeLabel(ch))+'">'+h(localeLabel(ch))+'</span></span>'
      + '<span class="op-pill op-'+h(opKey(ch && ch.op))+'">'+h(opLabel(ch && ch.op))+'</span>'
      + '<span class="dg-section-cell" title="'+h(section)+'">'+h(section)+'</span>'
      + '<span class="dg-field" title="'+h((ch && ch.scope) || '')+' · '+h(field)+'">'+h(field)+'</span>'
      + '<span class="dg-diff">'+diffHtml(ch)+'</span>'
      + '<span class="dg-time">'+h(t)+'</span>'
      + '<span class="dg-go" aria-hidden="true">→</span>'
      + '</div>';
  };
  try { digestRenderChange = window.digestRenderChange; } catch(err) {}
  function renderLocaleGroupedChanges(g){
    return sortChangesByLocaleThenOperation((g && g.list) || [], g && g.c)
      .map(function(ch){ return window.digestRenderChange(g.id, ch); })
      .join('');
  }
  function renderDigestGroupForRecord(g){
    var sortedList = sortChangesByLocaleThenOperation(g && g.list, g && g.c);
    var st = statusRaw(g && g.c);
    return '<article class="dg-group '+(g && g.hasMechanism ? 'dg-group-with-mechanism' : 'dg-group-without-mechanism')+'">'
      + '<header class="dg-group-head"><div class="dg-group-title">'
      + '<span class="link-name" role="button" tabindex="0" onclick="openDetail('+Number(g && g.id)+')" onkeydown="if(event.key===\'Enter\'){openDetail('+Number(g && g.id)+')}" title="Open campaign detail">'+h(g && g.c && g.c.campaignName)+'</span>'
      + '<span class="badge-stage '+h(statusClass(st))+'">'+h(statusLabel(st))+'</span>'
      + gradeBadge(g && g.c && g.c.grade)
      + '</div><div class="dg-group-meta"><span class="dg-count">'+renderUpdatesText(sortedList.length)+'</span></div></header>'
      + '<div class="dg-changes">'+renderLocaleGroupedChanges({id:g.id, c:g.c, list:sortedList})+'</div>'
      + '</article>';
  }
  function renderGroupedHighlights(groups){
    groups = groups || [];
    if(!groups.length){
      return '<div class="dg-empty"><div class="dg-empty-art" aria-hidden="true">✓</div><div class="dg-empty-title">No changes today</div><div class="dg-empty-text">All campaigns are steady.</div></div>';
    }
    var withGroups = sortGroups(groups.filter(function(g){ return !!g.hasMechanism; }));
    var withoutGroups = sortGroups(groups.filter(function(g){ return !g.hasMechanism; }));
    function section(label, arr){
      var updateCount = (arr || []).reduce(function(sum, g){ return sum + ((g.list || []).length); }, 0);
      var stat = arr.length + ' campaign' + (arr.length === 1 ? '' : 's') + ' · ' + updateCount + ' update' + (updateCount === 1 ? '' : 's');
      var body = arr.length ? arr.map(renderDigestGroupForRecord).join('') : '<div class="dg-empty dg-empty-inline"><div class="dg-empty-title">No changes today</div></div>';
      return '<div class="dg-mech-section"><div class="dg-mech-section-title"><span>'+h(label)+'</span><span class="dg-mech-title-stat">'+h(stat)+'</span></div>'+body+'</div>';
    }
    return section('Campaign with mechanism', withGroups) + section('Campaign without mechanism', withoutGroups);
  }
  window.renderDigest = function(){
    var box = document.getElementById('digestBody');
    if(!box) return;
    var day = reportDay();
    var groups = getDigestGroups(day);
    var hero = '<div class="page-card dg-hero dg-hero-v4">'
      + '<div class="dg-hero-main dg-hero-title-stack"><div class="dg-report-title-row"><div><h2>Campaign Notification Daily Report</h2><p class="page-intro dg-page-intro">This page is used for reviewing today\'s new campaigns and existing campaign changes, with key focus on campaign mechanism (Subsidy Info / Coupon Info) changes.</p></div><span class="dg-report-date-pill">'+h(reportDateLabel(day))+'</span></div></div>'
      + '</div>';
    var changeRecord = '<div class="dg-highlights dg-highlights-flat">' + renderGroupedHighlights(groups) + '</div>';
    box.innerHTML = hero + '<div class="dg-section-title">Summary</div>' + renderSummary(day, groups) + '<div class="dg-section-title">Change Record</div>' + changeRecord;
    if(typeof refreshDigestBadge === 'function') refreshDigestBadge();
    if(typeof refreshTableOverflowTooltips === 'function') refreshTableOverflowTooltips(box);
  };
  try { renderDigest = window.renderDigest; } catch(err) {}
  try { window.renderDigest(); } catch(err) { console.warn('[report locale plain/sorted change record]', err); }
})();

;

(function(){
  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function getCampaignIdFromLink(link){
    if(!link) return '';
    var onclick = link.getAttribute('onclick') || '';
    var m = onclick.match(/openDetail\((\d+)\)/);
    if(m) return m[1];
    var name = (link.textContent || '').trim();
    if(typeof CAMPAIGNS !== 'undefined' && name){
      var c = (CAMPAIGNS || []).find(function(item){ return String(item && item.campaignName || '').trim() === name; });
      if(c) return String(c.campaignId);
    }
    return '';
  }
  function appendSummaryNotes(root){
    var cards = root.querySelectorAll('.dg-summary-card');
    if(cards[0]){
      var firstSentence = cards[0].querySelector('.dg-summary-sentence');
      if(firstSentence && !firstSentence.querySelector('.dg-summary-note')){
        firstSentence.insertAdjacentHTML('beforeend', ' <span class="dg-summary-note">Check all information of any campaign by clicking campaign name below.</span>');
      }
    }
    if(cards[1]){
      var secondSentence = cards[1].querySelector('.dg-summary-sentence');
      if(secondSentence && !secondSentence.querySelector('.dg-summary-note')){
        secondSentence.insertAdjacentHTML('beforeend', ' <span class="dg-summary-note">Please find all change details in next section of &quot;Change Record&quot; by campaign.</span>');
      }
    }
  }
  function addCampaignIds(root){
    root.querySelectorAll('.dg-mech-section .dg-group-title .link-name').forEach(function(link){
      var id = getCampaignIdFromLink(link);
      if(!id) return;
      var next = link.nextElementSibling;
      if(next && next.classList && next.classList.contains('dg-change-campaign-id')){
        next.textContent = '(Campaign ID: ' + id + ')';
        return;
      }
      link.insertAdjacentHTML('afterend', '<span class="dg-change-campaign-id">(Campaign ID: '+esc(id)+')</span>');
    });
  }
  function addHighPriorityTag(root){
    root.querySelectorAll('.dg-mech-section-title').forEach(function(title){
      var first = title.querySelector('span');
      if(!first) return;
      if((first.textContent || '').trim() !== 'Campaign with mechanism') return;
      if(title.querySelector('.dg-high-priority-tag')) return;
      first.insertAdjacentHTML('afterend', '<span class="dg-high-priority-tag">High priority</span>');
    });
  }
  function postProcessReport(){
    var root = document.getElementById('page-digest');
    if(!root) return;
    appendSummaryNotes(root);
    addCampaignIds(root);
    addHighPriorityTag(root);
    if(typeof refreshTableOverflowTooltips === 'function'){
      try { refreshTableOverflowTooltips(root); } catch(err) {}
    }
  }
  window.postProcessReportCampaignIdPriority = postProcessReport;
  var previousRender = window.renderDigest || (typeof renderDigest === 'function' ? renderDigest : null);
  if(previousRender && !previousRender.__campaignIdPriorityWrapped){
    var wrapped = function(){
      var result = previousRender.apply(this, arguments);
      try { postProcessReport(); } catch(err) { console.warn('[report campaign id / priority patch]', err); }
      return result;
    };
    wrapped.__campaignIdPriorityWrapped = true;
    window.renderDigest = wrapped;
    try { renderDigest = wrapped; } catch(err) {}
  }
  try { postProcessReport(); } catch(err) { console.warn('[report campaign id / priority patch]', err); }
})();

;

(function(){
  function fixReportTitleDateLayout(){
    var root = document.getElementById('page-digest');
    if(!root) return;
    var row = root.querySelector('.dg-report-title-row');
    if(!row || row.querySelector('.dg-report-heading-line')) return;
    var first = row.children && row.children.length ? row.children[0] : null;
    var date = row.querySelector(':scope > .dg-report-date-pill') || row.querySelector('.dg-report-date-pill');
    if(!first || !date) return;
    var title = first.querySelector('h2');
    var intro = first.querySelector('.dg-page-intro');
    if(!title || !intro) return;
    var line = document.createElement('div');
    line.className = 'dg-report-heading-line';
    first.insertBefore(line, intro);
    line.appendChild(title);
    line.appendChild(date);
  }
  window.fixReportTitleDateLayout = fixReportTitleDateLayout;
  var previousRender = window.renderDigest || (typeof renderDigest === 'function' ? renderDigest : null);
  if(previousRender && !previousRender.__responsiveHeadingLineWrapped){
    var wrapped = function(){
      var result = previousRender.apply(this, arguments);
      try { fixReportTitleDateLayout(); } catch(err) { console.warn('[report responsive heading line]', err); }
      return result;
    };
    wrapped.__responsiveHeadingLineWrapped = true;
    window.renderDigest = wrapped;
    try { renderDigest = wrapped; } catch(err) {}
  }
  try { fixReportTitleDateLayout(); } catch(err) { console.warn('[report responsive heading line]', err); }
})();

;

(function(){
  /* Portfolio demo data: bring the report day (2026-05-16) closer to a real
     production day — campaigns launched today, a mix of campaigns with and
     without mechanism configured, and copy / schedule-only updates alongside
     the big Tier 1 mechanism changes. Data-only patch: rendering untouched. */
  function campaign(id){
    var hit = null;
    (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).forEach(function(c){
      if(String(c.campaignId) === String(id)) hit = c;
    });
    return hit;
  }
  function detail(id){
    if(typeof DETAILS === 'undefined') return null;
    return DETAILS[id] || DETAILS[String(id)] || DETAILS[Number(id)] || null;
  }
  function setTimes(id, createTime, updateTime){
    var c = campaign(id);
    if(c){ c.createTime = createTime; c.updateTime = updateTime; }
    var d = detail(id);
    if(d && d.campaign){ d.campaign.createTime = createTime; d.campaign.updateTime = updateTime; }
  }
  function prependChanges(id, list){
    if(typeof CHANGES === 'undefined' || typeof demoChange !== 'function') return;
    var key = String(id);
    CHANGES[key] = list.concat(CHANGES[key] || CHANGES[Number(id)] || []);
  }

  /* 1. Two campaigns were created today. */
  setTimes(31642, '2026-05-16 09:30', '2026-05-16 09:30'); /* HK Coupon Rush · Bundle (draft) */
  setTimes(31655, '2026-05-16 11:12', '2026-05-16 11:12'); /* SG Weekend Escape (upcoming) */

  /* 2. Not every campaign runs a mechanism: branding / member / brand-new
        content campaigns have no Subsidy Info & Coupon Info configured. */
  [31624, 31649, 31655].forEach(function(id){
    var d = detail(id);
    if(d && d.campaign) d.campaign.mechanism = [];
  });
  /* The brand-new 31655 has empty Subsidy / Coupon tables as well. */
  (function(){
    var d = detail(31655);
    if(!d) return;
    Object.keys(d.subsidy || {}).forEach(function(locale){
      var lb = d.subsidy[locale] || {};
      ['flight','hotel','tnt','bundle'].forEach(function(line){
        if(lb[line] && Array.isArray(lb[line].rows)) lb[line].rows = [];
      });
    });
    Object.keys(d.coupon || {}).forEach(function(locale){
      var lb = d.coupon[locale] || {};
      if(Array.isArray(lb.rows)) lb.rows = [];
    });
  })();

  /* 3. Today's changes beyond the two Tier 1 Mega Sales. */
  if(typeof demoChange === 'function'){
    prependChanges(31630, [ /* SG Flight Festival · Tier 1 · mechanism changed */
      demoChange('coupon','en-SG','2026-05-16 17:02','update','Coupon Info','P31630001','Coupon Name: [Mkt] SG-Mega Sale-Flight 8% off','Coupon Name: [Mkt] SG-Mega Sale-Flight 10% off',true),
      demoChange('subsidy','en-SG','2026-05-16 16:31','add','Subsidy Info / Flight','Flight',null,'SIN → TYO · SQ · ONE_PRICE 88 SGD',true)
    ]);
    prependChanges(31618, [ /* HK Summer Getaway · copy & schedule only */
      demoChange('landing','zh-HK','2026-05-16 16:05','update','Landing Page Info','https://hk.trip.com/sale/mega2026?locale=zh-HK','Title: HK Summer Getaway · Hotel | Trip.com HK','Title: HK Summer Getaway · Hotel Sale | Trip.com HK',true),
      demoChange('landing','zh-HK','2026-05-16 15:40','update','Landing Page Info','https://hk.trip.com/sale/mega2026?locale=zh-HK','Share Image: mock-kv-1.jpg','Share Image: summer_kv_v3.png',true),
      demoChange('campaign','-','2026-05-16 14:20','update','Campaign Basic Info','Start/End Date','2026-05-01 - 2026-06-15','2026-05-01 - 2026-06-30',true)
    ]);
    prependChanges(31649, [ /* TW Member Exclusive · no mechanism configured */
      demoChange('landing','zh-TW','2026-05-16 13:18','update','Landing Page Info','https://tw.trip.com/sale/mega2026?locale=zh-TW','Description: Members save 8% on selected hotels','Description: Members save 10% on selected hotels',true),
      demoChange('promotion','zh-TW','2026-05-16 12:55','update','Promotion Channel Info','Kol','Headline: Hotel deals for members','Headline: Hotel deals up to 10% off',true)
    ]);
    prependChanges(31624, [ /* TW Branding · Japan Cherry · no mechanism configured */
      demoChange('landing','zh-TW','2026-05-16 10:46','update','Landing Page Info','https://tw.trip.com/sale/mega2026?locale=zh-TW','Share Image: sakura_kv_teaser.png','Share Image: sakura_kv_final.png',true)
    ]);
  }
})();

;

(function(){
  /* The custom-select trigger stops click propagation, so the Since
     calendar's document-level "click outside closes me" handler never runs
     when the user opens a dropdown — leaving BOTH popovers open at once.
     Listen in the capture phase (unaffected by stopPropagation) and, when a
     dropdown is being interacted with while the calendar is open, dispatch a
     synthetic document click so the calendar closes through its own handler
     (keeping its internal isOpen state in sync). */
  document.addEventListener('click', function(e){
    if(!e.isTrusted) return; /* ignore our own synthetic click */
    var t = e.target;
    if(!t || !t.closest) return;
    var inDropdown = t.closest('#page-list .filter .custom-select, #page-list .filter .region-dropdown');
    if(!inDropdown) return;
    if(t.closest('#page-list .change-record-since-wrap')) return;
    var openCal = document.querySelector('#page-list .change-record-since-wrap.open');
    if(!openCal) return;
    try {
      document.dispatchEvent(new MouseEvent('click', { bubbles:false }));
    } catch(err) {
      /* very old engines: replicate the close directly */
      openCal.classList.remove('open');
      var p = openCal.querySelector('.change-record-calendar-panel');
      if(p) p.remove();
      var i = openCal.querySelector('input.change-record-since-input');
      if(i){ i.classList.remove('is-open'); i.setAttribute('aria-expanded','false'); }
    }
  }, true);
})();

;

(function(){
  /* Portfolio demo stability (carried over from the 2026-07-04 portfolio build):
     derive campaign status from the static demo Status field instead of the
     browser clock, so the page renders identically whenever it is opened.
     The report date needs no pin here — digestDateStr() already derives the
     report day from the change data itself, independent of the clock. */
  function statusForReport(c){
    var s = String((c && c.status) || '').toLowerCase();
    if(s === 'live' || s === 'ongoing') return 'ongoing';
    if(s === 'upcoming') return 'upcoming';
    if(s === 'ended') return 'ended';
    if(s === 'draft') return 'draft';
    return 'upcoming';
  }
  function statusLabelForReport(c){
    var s = statusForReport(c);
    if(s === 'ongoing') return 'Ongoing';
    if(s === 'upcoming') return 'Upcoming';
    if(s === 'ended') return 'Ended';
    if(s === 'draft') return 'Draft';
    return '-';
  }
  window.getComputedCampaignStatus = function(c){ return statusForReport(c); };
  window.getComputedCampaignStatusLabel = function(c){ return statusLabelForReport(c); };
  try { getComputedCampaignStatus = window.getComputedCampaignStatus; } catch(err) {}
  try { getComputedCampaignStatusLabel = window.getComputedCampaignStatusLabel; } catch(err) {}
  if(typeof STATUS_LABEL !== 'undefined'){
    STATUS_LABEL.ongoing = 'Ongoing';
    STATUS_LABEL.live = 'Ongoing';
    STATUS_LABEL.upcoming = 'Upcoming';
    STATUS_LABEL.ended = 'Ended';
    STATUS_LABEL.draft = 'Draft';
  }
  try { if(typeof renderDigest === 'function') renderDigest(); } catch(err) { console.warn('[portfolio demo static status] renderDigest', err); }
  try { if(typeof renderTable === 'function') renderTable(); } catch(err) { console.warn('[portfolio demo static status] renderTable', err); }
})();

;

(function(){
  /* AI Summary brief v2 — generated from the same day/groups data that feeds
     the Summary cards and Change Record. Reader-first structure: what to
     check today, in which order, and why it matters. */
  function h(v){
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pTime(v){
    if(!v) return 0;
    var t = Date.parse(String(v).replace(/-/g, '/'));
    return isNaN(t) ? 0 : t;
  }
  function dayOf(v){
    var m = String(v || '').match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : '';
  }
  function getCampaign(id){
    var hit = null;
    (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).forEach(function(c){
      if(String(c.campaignId) === String(id)) hit = c;
    });
    return hit;
  }
  function opNorm(op){
    var key = String(op || '').toLowerCase();
    if(key === 'added' || key === 'create' || key === 'created') key = 'add';
    if(key === 'updated') key = 'update';
    if(key === 'removed' || key === 'deleted' || key === 'delete') key = 'remove';
    return key || 'other';
  }
  function hiddenDigestChange(ch){
    var type = String((ch && ch.type) || '').toLowerCase();
    if(type === 'collection') return true;
    var text = [ch && ch.scope, ch && ch.field].join(' ');
    if(/Collection Basic Info/i.test(text)) return true;
    if(/Asset of Flash Sale Products/i.test(text)) return true;
    return false;
  }
  function reportDay(){
    if(typeof digestDateStr === 'function'){
      try { var v = digestDateStr(); if(v) return v; } catch(err) {}
    }
    var max = 0;
    if(typeof CHANGES !== 'undefined'){
      Object.keys(CHANGES || {}).forEach(function(id){
        (CHANGES[id] || []).forEach(function(ch){
          var t = pTime(ch && ch.time);
          if(t > max) max = t;
        });
      });
    }
    return max ? dayOf(new Date(max).getFullYear() + '-' + String(new Date(max).getMonth() + 1).padStart(2, '0') + '-' + String(new Date(max).getDate()).padStart(2, '0')) : '';
  }
  function dayGroups(day){
    var groups = [];
    if(typeof digestHighlights === 'function'){
      try {
        var res = digestHighlights() || {};
        if(res.groups && res.groups.length){
          return res.groups.map(function(g){
            var id = String(g.id || (g.c && g.c.campaignId));
            return { id:id, c:g.c || getCampaign(id), list:(g.list || []).slice() };
          }).filter(function(g){ return !!g.c && g.list.length; });
        }
      } catch(err) {}
    }
    if(typeof CHANGES !== 'undefined'){
      Object.keys(CHANGES || {}).forEach(function(id){
        var c = getCampaign(id);
        if(!c) return;
        var list = (CHANGES[id] || []).filter(function(ch){
          return dayOf(ch && ch.time) === day && !hiddenDigestChange(ch);
        });
        if(list.length) groups.push({ id:String(id), c:c, list:list });
      });
    }
    return groups;
  }
  function isCampaignAddChange(ch){
    if(opNorm(ch && ch.op) !== 'add') return false;
    var text = [ch && ch.type, ch && ch.scope, ch && ch.field].join(' ').toLowerCase();
    if(!/campaign/.test(text)) return false;
    if(/coupon|subsidy|landing|promotion|supplementary/.test(text)) return false;
    return true;
  }
  function newCampaigns(day){
    var ids = {};
    (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).forEach(function(c){
      if(dayOf(c && c.createTime) === day) ids[String(c.campaignId)] = true;
    });
    if(typeof CHANGES !== 'undefined'){
      Object.keys(CHANGES || {}).forEach(function(id){
        if((CHANGES[id] || []).some(function(ch){ return dayOf(ch && ch.time) === day && isCampaignAddChange(ch); })) ids[String(id)] = true;
      });
    }
    return Object.keys(ids).map(getCampaign).filter(Boolean).sort(function(a,b){ return pTime(b.createTime) - pTime(a.createTime); });
  }
  function mechConfigured(id){
    if(window.campaignMechanismValuesForDigest){
      try { return (window.campaignMechanismValuesForDigest(id) || []).length > 0; } catch(err) {}
    }
    return null; /* unknown */
  }
  function gradeOf(c){ return String((c && c.grade) || '').trim(); }
  function tierRank(c){
    var g = gradeOf(c).toLowerCase().replace(/\s+/g, '');
    return g === 'tier1' ? 0 : g === 'tier2' ? 1 : g === 'tier3' ? 2 : 9;
  }
  function statusKey(c){
    var raw = String((c && c.status) || '').toLowerCase();
    if(raw === 'live' || raw === 'ongoing') return 'ongoing';
    if(raw === 'upcoming' || raw === 'ended' || raw === 'draft') return raw;
    return 'upcoming';
  }
  function plural(n, word){ return n + ' ' + word + (n === 1 ? '' : 's'); }
  function trunc(s, n){
    s = String(s == null ? '' : s);
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }
  function splitLabeled(v){
    var m = String(v == null ? '' : v).match(/^([A-Za-z][\w &()\/.-]{0,40}):\s+([\s\S]*)$/);
    return m ? { label: m[1], value: m[2] } : { label: '', value: String(v == null ? '' : v) };
  }
  function nameHtml(c){ return '<span class="dg-ai-brief-name">' + h(c && c.campaignName) + '</span>'; }
  function nameTierHtml(c){
    var g = gradeOf(c);
    return nameHtml(c) + (g ? ' (' + h(g) + ')' : '');
  }
  function joinNames(parts){
    if(parts.length <= 1) return parts.join('');
    return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
  }
  function analyzeGroup(g){
    var st = { mech:false, subAdd:0, subUpd:0, subRem:0, couAdd:0, couUpd:0, couRem:0, records:(g.list || []).length, locales:[] };
    var locSeen = {};
    (g.list || []).forEach(function(ch){
      var type = String((ch && ch.type) || '').toLowerCase();
      var scope = String((ch && ch.scope) || '');
      var op = opNorm(ch && ch.op);
      var loc = String((ch && ch.locale) || '').trim();
      if(loc && loc !== '-' && !locSeen[loc]){ locSeen[loc] = 1; st.locales.push(loc); }
      if(type === 'subsidy' || /subsidy/i.test(scope)){
        st.mech = true;
        if(op === 'add') st.subAdd++; else if(op === 'remove') st.subRem++; else st.subUpd++;
      } else if(type === 'coupon' || /coupon/i.test(scope)){
        st.mech = true;
        if(op === 'add') st.couAdd++; else if(op === 'remove') st.couRem++; else st.couUpd++;
      }
    });
    return st;
  }
  function statusReasons(camps){
    var ongoing = [], upcoming = [], draft = [];
    camps.forEach(function(c){
      var k = statusKey(c);
      if(k === 'ongoing') ongoing.push(nameHtml(c));
      else if(k === 'upcoming') upcoming.push(nameHtml(c));
      else if(k === 'draft') draft.push(nameHtml(c));
    });
    var parts = [];
    if(ongoing.length) parts.push(joinNames(ongoing) + ' ' + (ongoing.length === 1 ? 'is' : 'are') + ' already live — errors are user-visible now');
    if(upcoming.length) parts.push(joinNames(upcoming) + ' ' + (upcoming.length === 1 ? 'launches' : 'launch') + ' soon — this is the last pre-launch check');
    if(draft.length) parts.push(joinNames(draft) + ' ' + (draft.length === 1 ? 'is' : 'are') + ' still in draft');
    return parts.join('; ');
  }
  function looksAsset(v){ return /\.(png|jpe?g|gif|webp|svg|mp4)(\?|$)/i.test(String(v || '')); }
  function looksCopyField(f){ return /headline|title|copy|subtitle|content|description|benefit/i.test(String(f || '')); }
  function pickNotable(groups, skipIds){
    var best = null, bestScore = 99;
    groups.forEach(function(g){
      (g.list || []).forEach(function(ch){
        var type = String((ch && ch.type) || '').toLowerCase();
        if(type !== 'promotion' && type !== 'landing') return;
        if(opNorm(ch && ch.op) !== 'update') return;
        if(ch.before == null || ch.after == null) return;
        var score = tierRank(g.c);
        if(looksAsset(ch.before) || looksAsset(ch.after)) score += 6; /* asset swaps are rarely the story */
        if(!looksCopyField(ch.field) && !looksCopyField(splitLabeled(ch.before).label || splitLabeled(ch.after).label)) score += 2;
        if(skipIds[String(g.id)]) score += 3; /* prefer campaigns not already featured */
        if(score < bestScore){ bestScore = score; best = { g:g, ch:ch }; }
      });
    });
    return best;
  }
  function buildHtml(){
    var day = reportDay();
    var groups = dayGroups(day);
    var newList = newCampaigns(day);
    var newIds = {};
    newList.forEach(function(c){ newIds[String(c.campaignId)] = true; });
    var existing = groups.filter(function(g){ return !newIds[String(g.id)]; });

    if(!groups.length && !newList.length){
      return '<p class="dg-ai-brief-lead">No campaign information changed today — nothing needs review: no new campaigns, and no mechanism (Subsidy Info / Coupon Info), copy or schedule movement on existing campaigns.</p>';
    }

    var analyzed = existing.map(function(g){ return { g:g, st:analyzeGroup(g) }; });
    var mech = analyzed.filter(function(x){ return x.st.mech; })
      .sort(function(a,b){
        var tr = tierRank(a.g.c) - tierRank(b.g.c);
        if(tr) return tr;
        return b.st.records - a.st.records;
      });
    var copyOnly = analyzed.filter(function(x){ return !x.st.mech; });
    var out = [];

    /* Lead: the single most important thing today, and why. */
    if(mech.length){
      var mechNames = joinNames(mech.map(function(x){ return nameTierHtml(x.g.c); }));
      out.push('<p class="dg-ai-brief-lead"><b>What matters today:</b> ' + plural(mech.length, 'campaign') + ' changed Subsidy / Coupon mechanism — ' + mechNames + '. Mechanism changes decide the prices and benefits users actually get, so they carry the highest risk on this page.</p>');
    } else if(newList.length){
      out.push('<p class="dg-ai-brief-lead"><b>What matters today:</b> no mechanism changes — the day is about ' + plural(newList.length, 'newly created campaign') + '. The main risk is incomplete initial setup rather than a wrong change.</p>');
    } else {
      out.push('<p class="dg-ai-brief-lead"><b>What matters today:</b> no Subsidy / Coupon mechanism was touched — ' + (existing.length === 1 ? 'the single changed campaign' : 'all ' + plural(existing.length, 'changed campaign')) + ' stayed at copy, visual or schedule level, which is low risk.</p>');
    }

    var items = [];

    /* 1. Mechanism verification — the concrete ask plus per-campaign urgency. */
    if(mech.length){
      var totalAdds = 0, totalUpds = 0, totalRems = 0, locSeen = {}, locs = [];
      mech.forEach(function(x){
        totalAdds += x.st.subAdd + x.st.couAdd;
        totalUpds += x.st.subUpd + x.st.couUpd;
        totalRems += x.st.subRem + x.st.couRem;
        x.st.locales.forEach(function(l){ if(!locSeen[l]){ locSeen[l] = 1; locs.push(l); } });
      });
      var volume = [];
      if(totalAdds) volume.push(plural(totalAdds, 'new subsidy / coupon row'));
      if(totalUpds) volume.push(plural(totalUpds, 'updated record'));
      if(totalRems) volume.push(plural(totalRems, 'removed record'));
      var reasons = statusReasons(mech.slice(0, 3).map(function(x){ return x.g.c; }));
      items.push('<li><b>First, verify the mechanism changes</b> — ' + (volume.length ? volume.join(', ') + ' in total: ' : '') + 'check amounts, validity windows and locale coverage' + (locs.length ? ' (' + h(locs.join(' / ')) + ')' : '') + '.' + (reasons ? ' ' + reasons + '.' : '') + '</li>');
    }

    /* 2. New campaigns — completeness, not correctness. */
    if(newList.length){
      var newNames = joinNames(newList.slice(0, 3).map(nameHtml)) + (newList.length > 3 ? ' and ' + (newList.length - 3) + ' more' : '');
      var noMech = newList.filter(function(c){ return mechConfigured(c.campaignId) === false; });
      var noMechNote = noMech.length ? ' Note ' + joinNames(noMech.map(nameHtml)) + ' ' + (noMech.length === 1 ? 'has' : 'have') + ' no mechanism configured yet — confirm that is intentional.' : '';
      items.push('<li><b>' + (mech.length ? 'Then sanity-check' : 'Sanity-check') + ' the ' + plural(newList.length, 'new campaign') + '</b> created today (' + newNames + '): new setups most often miss coupon linkage or locale variants, so do a quick completeness pass.' + noMechNote + '</li>');
    }

    /* 3. One notable customer-facing copy change, with the reason to care. */
    var skip = {};
    mech.slice(0, 2).forEach(function(x){ skip[String(x.g.id)] = true; });
    var notable = pickNotable(groups, skip);
    if(notable){
      var bl = splitLabeled(notable.ch.before), al = splitLabeled(notable.ch.after);
      var what = (bl.label && bl.label === al.label) ? bl.label : (notable.ch.field || 'copy');
      var claimLike = /%|\boff\b|save|discount|free/i.test(String(al.value || ''));
      var why = claimLike
        ? '— confirm the actual offer backs the stronger claim before users see it.'
        : '— double-check the live page shows the new copy as intended.';
      items.push('<li><b>Customer-facing copy:</b> ' + nameHtml(notable.g.c) + ' changed ' + h(what) + ' from \u201C' + h(trunc(bl.value, 44)) + '\u201D to \u201C' + h(trunc(al.value, 44)) + '\u201D ' + why + '</li>');
    }

    /* 4. Everything else is low risk — say so explicitly. */
    var lowRisk = copyOnly.filter(function(x){ return !notable || String(x.g.id) !== String(notable.g.id); });
    if(lowRisk.length){
      var lowNames = joinNames(lowRisk.slice(0, 3).map(function(x){ return nameHtml(x.g.c); })) + (lowRisk.length > 3 ? ' and ' + (lowRisk.length - 3) + ' more' : '');
      items.push('<li><b>Low risk, skim only:</b> ' + plural(lowRisk.length, 'campaign') + ' (' + lowNames + ') had copy / visual / schedule updates with no mechanism touched — a quick accuracy skim is enough.</li>');
    }

    if(items.length) out.push('<ul class="dg-ai-brief-points">' + items.join('') + '</ul>');
    return out.join('');
  }
  function briefHtml(){
    return '<section class="page-card dg-card dg-ai-brief" aria-label="AI summary of today\u2019s campaign changes">'
      + '<h3><span class="dg-ai-brief-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="#5b6cff"/><path d="M18.6 3.2l.75 1.95 1.95.75-1.95.75-.75 1.95-.75-1.95-1.95-.75 1.95-.75.75-1.95z" fill="#8b9bff"/><path d="M6.2 15.4l.65 1.7 1.7.65-1.7.65-.65 1.7-.65-1.7-1.7-.65 1.7-.65.65-1.7z" fill="#a9b5ff"/></svg></span>AI Summary</h3>'
      + buildHtml()
      + '</section>';
  }
  function insertBrief(){
    var box = document.getElementById('digestBody');
    if(!box) return;
    var old = box.querySelector('.dg-ai-brief');
    if(old) old.remove();
    var layout = box.querySelector('.dg-summary-layout');
    if(!layout) return;
    layout.insertAdjacentHTML('beforebegin', briefHtml());
  }
  window.buildReportAiBriefHtml = buildHtml;
  window.renderReportAiBrief = insertBrief;
  var prev = (typeof renderDigest === 'function') ? renderDigest : (window.renderDigest || null);
  if(prev && !prev.__aiBriefWrapped){
    var wrapped = function(){
      var result = prev.apply(this, arguments);
      try { insertBrief(); } catch(err) { console.warn('[ai brief] insert', err); }
      return result;
    };
    wrapped.__aiBriefWrapped = true;
    window.renderDigest = wrapped;
    try { renderDigest = wrapped; } catch(err) {}
  }
  try { insertBrief(); } catch(err) { console.warn('[ai brief] initial insert', err); }
})();

;

(function(){
  function byId(id){ return document.getElementById(id); }
  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function statusValue(c){
    try{
      if(typeof getComputedCampaignStatus === 'function') return getComputedCampaignStatus(c);
    }catch(err){}
    var raw = String((c && c.status) || '').toLowerCase();
    return raw === 'live' ? 'ongoing' : raw;
  }
  function statusText(c){
    try{
      if(typeof getComputedCampaignStatusLabel === 'function') return getComputedCampaignStatusLabel(c);
    }catch(err){}
    var st = statusValue(c);
    if(st === 'ongoing') return 'Ongoing';
    if(st === 'upcoming') return 'Upcoming';
    if(st === 'ended') return 'Ended';
    if(st === 'draft') return 'Draft';
    return st || '-';
  }

  function syncCampaignListTableWidth(){
    var page = byId('page-list');
    var wrap = page && page.querySelector('.tbl-wrap');
    var table = wrap && wrap.querySelector(':scope > table');
    if(!page || !wrap || !table) return 1330;
    var width = Math.max(1330, Math.floor(wrap.clientWidth || wrap.getBoundingClientRect().width || 0));
    page.style.setProperty('--campaign-list-table-width', width+'px');
    page.style.setProperty('--campaign-list-viewport-width', Math.max(0, Math.floor(wrap.clientWidth || wrap.getBoundingClientRect().width || 0))+'px');
    table.style.width = width+'px';
    table.style.minWidth = width+'px';
    table.style.maxWidth = 'none';
    return width;
  }

  /* Parent list and expanded Change Record use independent horizontal scroll positions. */
  window.syncCampaignChangeRecordScroll = function(){
    /* Intentionally empty: scrolling a child list must not move the parent list. */
  };
  try{ syncCampaignChangeRecordScroll = window.syncCampaignChangeRecordScroll; }catch(err){}

  function bindCampaignListScrollSync(){
    /* Intentionally do not bind parent/child scroll synchronization. */
  }

  function alignCampaignChangeScrollers(){
    /* Intentionally empty: resizing must preserve independent scroll positions. */
  }

  function ensureCampaignIdFilter(){
    var nameInput = byId('fName');
    if(!nameInput) return;
    var nameField = nameInput.closest('.field');
    if(!nameField) return;
    var idInput = byId('fCmp');
    var idField = idInput && idInput.closest('.field');
    if(!idInput){
      idField = document.createElement('div');
      idField.className = 'field campaign-id-filter-field';
      idField.innerHTML = '<label for="fCmp">Campaign ID:</label><input id="fCmp" inputmode="numeric" autocomplete="off" aria-label="Search by Campaign ID" oninput="onListFilterInput()" onkeydown="onListFilterKey(event)" />';
      nameField.parentNode.insertBefore(idField, nameField);
      idInput = byId('fCmp');
    }else{
      idField.classList.add('campaign-id-filter-field');
      idInput.setAttribute('inputmode','numeric');
      idInput.setAttribute('autocomplete','off');
      idInput.setAttribute('aria-label','Search by Campaign ID');
      idInput.setAttribute('oninput','onListFilterInput()');
      idInput.setAttribute('onkeydown','onListFilterKey(event)');
      if(idField.nextElementSibling !== nameField) nameField.parentNode.insertBefore(idField, nameField);
    }
  }

  function ensureCampaignListHeader(){
    var row = document.querySelector('#page-list .tbl-wrap table thead tr');
    if(!row) return;
    row.innerHTML = '<th class="sticky s-chk"></th>'
      + '<th class="sticky s-campaign-id">Campaign ID</th>'
      + '<th class="sticky s-l4">Campaign Name</th>'
      + '<th>Theme</th>'
      + '<th>Grade</th>'
      + '<th>Campaign Region</th>'
      + '<th>Campaign Status</th>'
      + '<th>Create Time</th>'
      + '<th>Update Time</th>'
      + '<th>Creator</th>';
  }

  function selectedValues(id){
    try{ if(typeof getSelectValues === 'function') return getSelectValues(id); }catch(err){}
    var select = byId(id);
    if(!select) return [];
    return Array.from(select.selectedOptions || []).map(function(opt){ return opt.value; }).filter(Boolean);
  }

  window.getFilteredCampaignRows = function(){
    var idInput = byId('fCmp');
    var nameInput = byId('fName');
    var fCmp = idInput ? String(idInput.value || '').trim().toLowerCase() : '';
    var fName = nameInput ? String(nameInput.value || '').trim().toLowerCase() : '';
    var fTheme = selectedValues('fTheme');
    var fGrade = selectedValues('fGrade');
    var fStatus = selectedValues('fStatus');
    return (typeof CAMPAIGNS !== 'undefined' ? CAMPAIGNS : []).filter(function(c){
      if(fCmp && String(c.campaignId == null ? '' : c.campaignId).toLowerCase().indexOf(fCmp) < 0) return false;
      if(fName && String(c.campaignName || '').toLowerCase().indexOf(fName) < 0) return false;
      if(fTheme.length && fTheme.indexOf(c.theme) < 0) return false;
      if(fGrade.length && fGrade.indexOf(c.grade) < 0) return false;
      if(typeof passListRegionFilter === 'function' && !passListRegionFilter(c)) return false;
      if(fStatus.length && fStatus.indexOf(statusValue(c)) < 0) return false;
      return true;
    });
  };
  try{ getFilteredCampaignRows = window.getFilteredCampaignRows; }catch(err){}

  function renderCampaignParentRow(c, expanded){
    var regions = (typeof getCampaignRegions === 'function') ? getCampaignRegions(c).join(', ') : (c.team || '');
    var st = statusValue(c);
    return '<tr class="campaign-parent-row '+(expanded ? 'expanded' : '')+'">'
      + '<td class="sticky s-chk"><button class="campaign-expand-btn" aria-label="'+(expanded ? 'Collapse' : 'Expand')+' campaign '+esc(c.campaignId)+'" onclick="toggleCampaignExpand('+Number(c.campaignId)+')">'+(expanded ? '▾' : '▸')+'</button></td>'
      + '<td class="id-cell campaign-id-cell sticky s-campaign-id" title="Campaign ID '+esc(c.campaignId)+'">'+esc(c.campaignId)+'</td>'
      + '<td class="link-name sticky s-l4" onclick="openDetail('+Number(c.campaignId)+')" title="'+esc(c.campaignName)+'">'+esc(c.campaignName)+'</td>'
      + '<td>'+esc(c.theme)+'</td>'
      + '<td class="grade">'+esc(c.grade)+'</td>'
      + '<td>'+esc(regions)+'</td>'
      + '<td class="campaign-status-cell"><span class="badge-stage '+esc(st)+'">'+esc(statusText(c))+'</span></td>'
      + '<td>'+esc(c.createTime)+'</td>'
      + '<td>'+esc(c.updateTime)+'</td>'
      + '<td>'+esc(c.creator)+'</td>'
      + '</tr>';
  }

  window.renderTable = function(){
    ensureCampaignIdFilter();
    ensureCampaignListHeader();
    syncCampaignListTableWidth();
    if(typeof renderListRegionFilter === 'function') renderListRegionFilter();
    var all = window.getFilteredCampaignRows();
    var total = all.length;
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    if(pageNum > totalPages) pageNum = totalPages;
    if(pageNum < 1) pageNum = 1;
    var start = (pageNum - 1) * pageSize;
    var rows = all.slice(start, start + pageSize);
    var tbody = byId('tbody');
    if(!tbody) return;
    tbody.innerHTML = rows.map(function(c){
      var expanded = CAMPAIGN_EXPANDED.has(String(c.campaignId));
      var parent = renderCampaignParentRow(c, expanded);
      return expanded
        ? parent + '<tr class="campaign-change-row"><td colspan="10">'+renderCampaignChangePanel(c.campaignId)+'</td></tr>'
        : parent;
    }).join('');
    syncCampaignListTableWidth();
    bindCampaignListScrollSync();
    alignCampaignChangeScrollers();
    var empty = byId('emptyHint');
    if(empty) empty.style.display = rows.length ? 'none' : 'block';
    if(typeof renderPagination === 'function') renderPagination(total, totalPages);
    if(typeof enhanceCustomSelects === 'function') enhanceCustomSelects(document);
    if(typeof refreshFilterDropdownTooltips === 'function') refreshFilterDropdownTooltips(byId('page-list') || document);
    if(typeof refreshTableOverflowTooltips === 'function') refreshTableOverflowTooltips(byId('page-list') || document);
  };
  try{ renderTable = window.renderTable; }catch(err){}

  window.currentPageRows = function(){
    var all = window.getFilteredCampaignRows();
    var start = (pageNum - 1) * pageSize;
    return all.slice(start, start + pageSize);
  };
  try{ currentPageRows = window.currentPageRows; }catch(err){}

  /* Preserve the existing calendar-reset behavior, adding Campaign ID to it. */
  if(typeof resetFilter === 'function'){
    var previousResetFilterFinal = resetFilter;
    window.resetFilter = function(){
      var idInput = byId('fCmp');
      if(idInput) idInput.value = '';
      return previousResetFilterFinal.apply(this, arguments);
    };
    try{ resetFilter = window.resetFilter; }catch(err){}
  }

  /* Report-to-list navigation can also target Campaign ID. */
  if(typeof digestOpenList === 'function'){
    var previousDigestOpenListFinal = digestOpenList;
    window.digestOpenList = function(opts){
      opts = opts || {};
      var result = previousDigestOpenListFinal.apply(this, arguments);
      var idInput = byId('fCmp');
      if(idInput){
        idInput.value = opts.campaignId == null ? '' : String(opts.campaignId);
        if(opts.campaignId != null){ pageNum = 1; window.renderTable(); }
      }
      return result;
    };
    try{ digestOpenList = window.digestOpenList; }catch(err){}
  }

  function opKey(op){
    var key = String(op || '').toLowerCase();
    if(key === 'added') return 'add';
    if(key === 'updated') return 'update';
    if(key === 'removed' || key === 'delete' || key === 'deleted') return 'remove';
    return key || 'other';
  }
  function opText(op){
    var key = opKey(op);
    if(typeof OP_LABEL !== 'undefined' && OP_LABEL[key]) return OP_LABEL[key];
    if(key === 'add') return 'Added';
    if(key === 'update') return 'Updated';
    if(key === 'remove') return 'Removed';
    return String(op || '-');
  }
  function timeValue(value){
    try{ if(typeof parseTime === 'function') return parseTime(value); }catch(err){}
    var parsed = Date.parse(String(value || '').replace(' ', 'T'));
    return isNaN(parsed) ? 0 : parsed;
  }
  function operationRank(op){
    var key = opKey(op);
    return key === 'add' ? 0 : key === 'update' ? 1 : key === 'remove' ? 2 : 9;
  }
  function visibleChanges(id){
    var list = [];
    try{
      if(typeof window.campaignVisibleChangesByRecordSince === 'function') list = window.campaignVisibleChangesByRecordSince(id) || [];
      else if(typeof campaignChangeList === 'function') list = campaignChangeList(id) || [];
      else if(typeof CHANGES !== 'undefined') list = (CHANGES[id] || CHANGES[Number(id)] || CHANGES[String(id)] || []).slice();
    }catch(err){}
    return list.slice().sort(function(a,b){
      var dayA = String((a && a.time) || '').slice(0,10);
      var dayB = String((b && b.time) || '').slice(0,10);
      var dayDiff = timeValue(dayB ? dayB + ' 00:00:00' : '') - timeValue(dayA ? dayA + ' 00:00:00' : '');
      if(dayDiff) return dayDiff;
      var opDiff = operationRank(a && a.op) - operationRank(b && b.op);
      if(opDiff) return opDiff;
      return timeValue(b && b.time) - timeValue(a && a.time);
    });
  }
  function localeText(ch){
    var value = ch && ch.locale ? String(ch.locale) : '';
    return value && value !== '-' ? value : 'Global';
  }
  function sectionText(ch){
    try{ if(typeof campaignChangeEventName === 'function') return campaignChangeEventName(ch); }catch(err){}
    try{ if(typeof TYPE_LABEL !== 'undefined' && ch && TYPE_LABEL[ch.type]) return TYPE_LABEL[ch.type]; }catch(err){}
    try{ if(typeof getSubscribedEventFromScope === 'function') return getSubscribedEventFromScope(ch && ch.scope); }catch(err){}
    return (ch && (ch.scope || ch.type)) || '-';
  }
  function fieldText(ch){
    try{ if(typeof window.getChangeRecordDisplayField === 'function') return window.getChangeRecordDisplayField(ch); }catch(err){}
    return (ch && ch.field) || '-';
  }
  function diffMarkup(ch){
    try{ if(typeof campaignChangeDiffHtml === 'function') return campaignChangeDiffHtml(ch); }catch(err){}
    var key = opKey(ch && ch.op);
    if(key === 'add') return '<span class="diff-add">+ '+esc((ch && ch.after) || '')+'</span>';
    if(key === 'remove') return '<span class="diff-remove">− '+esc((ch && ch.before) || '')+'</span>';
    return '<span class="diff-old">'+esc((ch && ch.before) || '')+'</span> <span class="diff-arrow">→</span> <span class="diff-new">'+esc((ch && ch.after) || '')+'</span>';
  }
  function validSince(value){
    var match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!match) return '';
    var date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if(date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) return '';
    return match[1]+'-'+match[2]+'-'+match[3];
  }
  function sinceNote(){
    var input = byId('fChangeRecordSince');
    var value = input ? validSince(input.value) : '';
    return value ? 'since '+value : '';
  }

  window.renderCampaignChangePanel = function(id){
    var list = visibleChanges(id);
    var note = sinceNote();
    if(!list.length){
      return '<div class="campaign-change-panel"><div class="campaign-no-change">No change records'+(note ? ' '+esc(note) : '')+' for this campaign.</div></div>';
    }
    var body = list.map(function(ch){
      var locale = localeText(ch);
      var section = sectionText(ch);
      var field = fieldText(ch);
      return '<tr>'
        + '<td><span class="campaign-change-locale-text" title="'+esc(locale === 'Global' ? 'Global / all locales' : locale)+'">'+esc(locale)+'</span></td>'
        + '<td><span class="op-pill op-'+esc(opKey(ch && ch.op))+'">'+esc(opText(ch && ch.op))+'</span></td>'
        + '<td title="'+esc(section)+'">'+esc(section)+'</td>'
        + '<td title="'+esc(field)+'">'+esc(field)+'</td>'
        + '<td>'+diffMarkup(ch)+'</td>'
        + '<td class="muted" title="'+esc((ch && ch.time) || '-')+'">'+esc((ch && ch.time) || '-')+'</td>'
        + '</tr>';
    }).join('');
    return '<div class="campaign-change-panel">'
      + '<div class="campaign-change-title">Change Records <span class="campaign-change-count">'+esc(list.length+' update'+(list.length === 1 ? '' : 's'))+'</span>'+(note ? '<span class="campaign-change-filter-note">'+esc(note)+'</span>' : '')+'</div>'
      + '<div class="campaign-changes-scroll">'
      + '<table class="campaign-changes-table"><colgroup class="campaign-changes-responsive-colgroup"><col><col><col><col><col><col></colgroup>'
      + '<thead><tr><th>Locale</th><th>Operation</th><th>Change Section</th><th>Field</th><th>Change</th><th>Update Time</th></tr></thead>'
      + '<tbody>'+body+'</tbody></table></div></div>';
  };
  try{ renderCampaignChangePanel = window.renderCampaignChangePanel; }catch(err){}

  /* Filter popovers are mutually exclusive. This also fixes the zoomed layout
     case where Region stayed open underneath Theme/Grade. */
  if(typeof closeCustomSelect === 'function'){
    var previousCloseCustomSelectFinal = closeCustomSelect;
    window.closeCustomSelect = function(except){
      if(except && typeof listRegionDropdownOpen !== 'undefined' && listRegionDropdownOpen){
        listRegionDropdownOpen = false;
        if(typeof renderListRegionFilter === 'function') renderListRegionFilter();
      }
      return previousCloseCustomSelectFinal.apply(this, arguments);
    };
    try{ closeCustomSelect = window.closeCustomSelect; }catch(err){}
  }

  window.toggleListRegionDropdown = function(event){
    if(event){
      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    }
    var willOpen = !listRegionDropdownOpen;
    if(willOpen){
      if(typeof closeCustomSelect === 'function') closeCustomSelect();
      /* Close the Change Record Since calendar through its existing outside-click handler. */
      var openCalendar = document.querySelector('#page-list .change-record-since-wrap.open');
      if(openCalendar){
        try{ document.dispatchEvent(new MouseEvent('click', { bubbles:false })); }catch(err){}
      }
    }
    listRegionDropdownOpen = willOpen;
    if(typeof renderListRegionFilter === 'function') renderListRegionFilter();
  };
  try{ toggleListRegionDropdown = window.toggleListRegionDropdown; }catch(err){}

  window.addEventListener('resize', function(){
    syncCampaignListTableWidth();
    alignCampaignChangeScrollers();
  }, { passive:true });

  ensureCampaignIdFilter();
  ensureCampaignListHeader();
  syncCampaignListTableWidth();
  bindCampaignListScrollSync();
  try{ window.renderTable(); }catch(err){ console.warn('[campaign list requested fixes] render', err); }
})();

;

(function(){
  function applyRequestedPage(){
    if (window.location.hash === '#list' && typeof window.switchPage === 'function') {
      try { window.switchPage('list'); } catch(e) {}
    }
  }
  document.addEventListener('DOMContentLoaded', function(){
    [0, 120, 500, 1200, 2500].forEach(function(delay){ setTimeout(applyRequestedPage, delay); });
  });
  window.addEventListener('load', function(){
    [0, 300, 1000, 2200].forEach(function(delay){ setTimeout(applyRequestedPage, delay); });
  });
})();
