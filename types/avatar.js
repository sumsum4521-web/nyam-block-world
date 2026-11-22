/* TYPES 캐릭터 꾸미기 — 아바타 그리기 + 아이템 목록
   window.TAV = { BODIES, ITEMS, CATS, SLOTS, render(state,opts), defaultState(), rarity(price) } */
(function(){
'use strict';
let OL='none';const SEAM='rgba(70,50,90,.2)', SKIN='#f8d33a', SKIN_D='#e9bf22';
let UID=0;

// ---------- 체형 2개 (무료) ----------
const BODIES={
 round:{name:'기본 뉴비',hr:13,hx:50,hy:24,hh:13,tx1:36,tx2:64,ty1:38,bx1:36,bx2:64,ty2:66,tp:66,arm:13.5,sh:38,ax:[[22,35.6],[64.4,78]],hand:[[28.8,64],[71.2,64]],legs:[[36,49.8],[50.2,64]],ly1:66,ly2:95},
 slim: {name:'키다리 뉴비',hr:12,hx:50,hy:21,hh:12,tx1:38.5,tx2:61.5,ty1:34,bx1:38.5,bx2:61.5,ty2:63,tp:63,arm:11.5,sh:34,ax:[[26.5,38.1],[61.9,73.5]],hand:[[32.3,61],[67.7,61]],legs:[[38.5,49.8],[50.2,61.5]],ly1:63,ly2:97}
};

// ---------- 특별 색 (그라데이션) ----------
const GR={rainbow:'url(#tav-rainbow)',fire:'url(#tav-fire)',candy:'url(#tav-candy)',mermaid:'url(#tav-mermaid)',galaxy:'url(#tav-galaxy)',gold:'url(#tav-gold)',silver:'url(#tav-silver)',glass:'url(#tav-glass)',sky:'url(#tav-sky)',sunset:'url(#tav-sunset)'};
function defsSvg(){
 const lg=(id,stops,v)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${v?0:1}" y2="${v?1:0}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 return `<svg width="0" height="0" style="position:absolute"><defs>
 ${lg('tav-rainbow',['#ff6b6b','#ffa94d','#ffe066','#69db7c','#4dabf7','#9775fa'],1)}
 ${lg('tav-fire',['#ffe066','#ff922b','#f03e3e'],1)}
 ${lg('tav-candy',['#ffc9e3','#d0bfff','#a5d8ff'],1)}
 ${lg('tav-mermaid',['#63e6be','#4dabf7','#b197fc'],1)}
 ${lg('tav-galaxy',['#5f3dc4','#3b5bdb','#862e9c','#1b1f3a'],1)}
 ${lg('tav-gold',['#fff3bf','#fcc419','#e8a200'],1)}
 ${lg('tav-silver',['#ffffff','#dee2e6','#adb5bd'],1)}
 ${lg('tav-glass',['#e7f5ff','#a5d8ff','#d0ebff'],1)}
 ${lg('tav-sky',['#d0ebff','#74c0fc','#4dabf7'],1)}
 ${lg('tav-sunset',['#ffd8a8','#ff8787','#b197fc'],1)}
 <linearGradient id="tav-iris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b5fe0"/><stop offset="1" stop-color="#a5a8ff"/></linearGradient><radialGradient id="tav-blush"><stop offset="0" stop-color="#ff8fab" stop-opacity=".55"/><stop offset="1" stop-color="#ff8fab" stop-opacity="0"/></radialGradient><linearGradient id="tav-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
 ${[['purple','#5b5fe0','#a5a8ff'],['brown','#6b3f22','#c08a5a'],['blue','#1864ab','#74c0fc'],['green','#2b8a3e','#8ce99a'],['pink','#c2255c','#ffa8c5'],['gold','#c77c00','#ffe066'],['red','#a61e1e','#ff8787'],['mint','#087f5b','#96f2d7'],['gray','#343a40','#adb5bd']].map(([n,a,b])=>lg('tav-ir-'+n,[a,b],1)).join('')}
 <radialGradient id="tav-glow"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
 </defs></svg>`;}

// ---------- 아이템 ----------
// p=가격, s=모양, c=색, c2=둘째 색, fx=반짝이
const H=(id,n,s,c,p,fx)=>({id,cat:'hair',n,s,c,p,fx});
const T=(id,n,s,c,c2,p,fx)=>({id,cat:'top',n,s,c,c2,p,fx});
const B=(id,n,s,c,c2,p,fx)=>({id,cat:'bottom',n,s,c,c2,p,fx});
const S=(id,n,s,c,c2,p,fx)=>({id,cat:'shoes',n,s,c,c2,p,fx});
const A=(id,n,slot,s,c,c2,p,fx)=>({id,cat:'acc',slot,n,s,c,c2,p,fx});
const BODY=[{id:'body_round',cat:'body',n:'기본 뉴비',body:'round',p:0},{id:'body_slim',cat:'body',n:'키다리 뉴비',body:'slim',p:0}];
const HAIR=[
 H('h_ys','노란 짧은 머리','short','#f0a81e',0),H('h_yl','노란 긴 머리','long','#f0a81e',0),
 H('h_bs','갈색 짧은 머리','short','#a0673a',10),H('h_ks','까만 짧은 머리','short','#3a3040',10),
 H('h_bl','갈색 긴 머리','long','#a0673a',10),H('h_kl','까만 긴 머리','long','#3a3040',10),
 H('h_rp','빨간 포니테일','pony','#e8590c',15),H('h_bp','밤색 포니테일','pony','#7a4a2a',15),
 H('h_ot','주황 양갈래','twin','#ff922b',15),H('h_kt','까만 양갈래','twin','#3a3040',15),
 H('h_pb','분홍 똥머리','bun','#f783ac',20),H('h_sb','하늘 똥머리','bun','#74c0fc',20),
 H('h_bc','갈색 곱슬머리','curly','#a0673a',20),H('h_kk','까만 삐죽 머리','spiky','#3a3040',20),
 H('h_gs','초록 옆가르마','side','#51cf66',25),H('h_bb','갈색 땋은 머리','braid','#a0673a',25),
 H('h_yb','금발 땋은 머리','braid','#f0a81e',30),H('h_bk','파란 삐죽 머리','spiky','#4dabf7',30),
 H('h_vw','보라 웨이브','wavy','#9775fa',40),H('h_mw','민트 웨이브','wavy','#63e6be',40),
 H('h_po','분홍 양쪽 똥머리','odango','#f783ac',45),H('h_so','하늘 양쪽 똥머리','odango','#74c0fc',45),
 H('h_sl','은빛 긴 머리','long',GR.silver,60),H('h_fs','불꽃 삐죽 머리','spiky',GR.fire,80),
 H('h_cc','솜사탕 곱슬머리','curly',GR.candy,90),H('h_gp','공주님 금빛 머리','princess',GR.gold,100,1),
 H('h_mm','인어공주 웨이브','wavy',GR.mermaid,120,1),H('h_rb','무지개 포니테일','pony',GR.rainbow,150,1),
 H('h_st','별빛 양갈래','twin',GR.sky,170,1),H('h_gx','은하수 공주 머리','princess',GR.galaxy,200,1)
];
const TOPS=[
 T('t_gray','회색 티셔츠','tee','#c9cdd4','',0),
 T('t_white','하얀 티셔츠','tee','#ffffff','',8),T('t_red','빨간 티셔츠','tee','#ff6b6b','',8),T('t_yel','노란 티셔츠','tee','#ffe066','',8),
 T('t_grn','초록 티셔츠','tee','#69db7c','',10),T('t_bst','파랑 줄무늬 티','stripe','#ffffff','#4dabf7',15),T('t_rst','빨강 줄무늬 티','stripe','#ffffff','#ff6b6b',15),
 T('t_tank','민트 민소매','tank','#63e6be','',12),T('t_hpk','분홍 후드티','hoodie','#f783ac','',25),T('t_hgr','회색 후드티','hoodie','#adb5bd','',25),
 T('t_swh','하트 스웨터','sweater','#ffd8a8','#ff6b6b',30),T('t_sws','별 스웨터','sweater','#a5d8ff','#fcc419',30),
 T('t_shirt','하늘 셔츠','shirt','#d0ebff','',25),T('t_dots','물방울 티셔츠','dots','#fff0f6','#f783ac',20),
 T('t_jean','청재킷','jacket','#4c6ef5','#ffffff',40),T('t_lea','까만 재킷','jacket','#343a40','#ff6b6b',45),
 T('t_sail','세일러 교복','sailor','#ffffff','#364fc7',45),T('t_star','별무늬 티셔츠','stars','#5c7cfa','#ffe066',35),
 T('t_hrt','하트무늬 티셔츠','hearts','#fff0f6','#ff6b6b',35),T('t_rain','노란 우비','rain','#ffd43b','',40),
 T('t_drs','분홍 원피스','dress','#faa2c1','#ffffff',55),T('t_drb','하늘 원피스','dress','#a5d8ff','#ffffff',55),
 T('t_hb','색동 한복 저고리','hanbok','#ffffff','#ff6b6b',70),T('t_tux','멋쟁이 턱시도','tux','#212529','#ffffff',80),
 T('t_space','우주비행사 옷','space','#f1f3f5','#4dabf7',100),T('t_rbt','무지개 티셔츠','tee',GR.rainbow,'',90,1),
 T('t_prn','공주님 드레스','princess','#fcc2d7','#fff0f6',120,1),T('t_glx','은하수 후드티','hoodie',GR.galaxy,'',140,1),
 T('t_gold','황금 왕자 옷','tux',GR.gold,'#ffffff',160,1),T('t_mer','인어공주 드레스','princess',GR.mermaid,'#e6fcf5',200,1)
];
const BOTS=[
 B('b_blue','파란 바지','pants','#4dabf7','',0),
 B('b_navy','남색 바지','pants','#364fc7','',8),B('b_blk','까만 바지','pants','#343a40','',8),B('b_beige','베이지 바지','pants','#e9d8a6','',8),
 B('b_jean','청바지','jeans','#5c7cfa','',15),B('b_jog','운동복 바지','jog','#495057','#ffffff',15),B('b_sred','빨간 반바지','shorts','#ff6b6b','',10),
 B('b_sgrn','초록 반바지','shorts','#51cf66','',10),B('b_sjean','청반바지','shorts','#748ffc','',12),B('b_pk','분홍 치마','skirt','#f783ac','',15),
 B('b_yk','노란 치마','skirt','#ffd43b','',15),B('b_pl','체크 주름치마','pleat','#e03131','#ffd8a8',25),B('b_plb','남색 주름치마','pleat','#364fc7','#d0ebff',25),
 B('b_dot','물방울 치마','dotskirt','#fff0f6','#f783ac',25),B('b_cargo','카키 건빵바지','cargo','#8f9a6b','',30),B('b_lsk','하늘 긴 치마','long','#a5d8ff','',35),
 B('b_lsp','보라 긴 치마','long','#b197fc','',35),B('b_tutu','분홍 발레 치마','tutu','#fcc2d7','',45),B('b_tutuw','하얀 발레 치마','tutu','#ffffff','',45),
 B('b_ovr','멜빵바지','overall','#4c6ef5','#ffd43b',50),B('b_star','별무늬 바지','starpants','#3b5bdb','#ffe066',55),
 B('b_hb','한복 치마','long','#f783ac','#ffd8a8',70),B('b_cloud','구름 치마','cloud','#ffffff','#a5d8ff',75,1),
 B('b_rbs','무지개 치마','skirt',GR.rainbow,'',90,1),B('b_rbp','무지개 바지','pants',GR.rainbow,'',90,1),B('b_gold','황금 바지','pants',GR.gold,'',110,1),
 B('b_glx','은하수 바지','starpants',GR.galaxy,'#ffffff',130,1),B('b_cnd','솜사탕 발레 치마','tutu',GR.candy,'',140,1),
 B('b_sun','노을빛 긴 치마','long',GR.sunset,'',150,1),B('b_mer','인어 꼬리','mermaid',GR.mermaid,'#e6fcf5',200,1)
];
const SHOES=[
 S('s_white','하얀 운동화','sneak','#ffffff','#ced4da',0),
 S('s_red','빨간 운동화','sneak','#ff6b6b','#ffffff',8),S('s_blue','파란 운동화','sneak','#4dabf7','#ffffff',8),S('s_blk','까만 운동화','sneak','#343a40','#ffffff',8),
 S('s_pink','분홍 운동화','sneak','#f783ac','#ffffff',10),S('s_sand','여름 샌들','sandal','#a0673a','',12),S('s_mj','빨간 구두','mary','#e03131','',20),
 S('s_mjb','까만 구두','mary','#343a40','',20),S('s_rain','노란 장화','rainboot','#ffd43b','',20),S('s_boot','갈색 부츠','boot','#8d5a32','',30),
 S('s_bootw','하얀 털부츠','furboot','#ffffff','#e9ecef',35),S('s_skate','롤러스케이트','skate','#ff8787','#ffd43b',50),S('s_light','반짝 운동화','light','#ffffff','',60,1),
 S('s_gld','황금 구두','mary',GR.gold,'',80,1),S('s_rbs','무지개 운동화','sneak',GR.rainbow,'#ffffff',80,1),S('s_cloud','구름 신발','cloud','#ffffff','#a5d8ff',100,1),
 S('s_wing','날개 운동화','wing','#ffffff','#ffd43b',120,1),S('s_glass','유리 구두','mary',GR.glass,'',150,1),S('s_rocket','로켓 부츠','rocket','#adb5bd','#ff6b6b',180,1),
 S('s_star','별빛 부츠','boot',GR.galaxy,'#ffe066',160,1)
];
const ACCS=[
 // 모자·머리
 A('a_capr','빨간 야구모자','hat','cap','#ff6b6b','',10),A('a_capb','파란 야구모자','hat','cap','#4dabf7','',10),A('a_party','파티 고깔모자','hat','party','#ffd43b','#f783ac',15),
 A('a_beanie','털모자','hat','beanie','#ff922b','#ffffff',15),A('a_ribbon','리본 머리띠','hat','ribbon','#ff6b6b','',15),A('a_straw','밀짚모자','hat','straw','#ffe8a3','#ff6b6b',20),
 A('a_chef','요리사 모자','hat','chef','#ffffff','',25),A('a_cat','고양이 귀','hat','catear','#ffd8a8','#ffc9c9',30),A('a_bun','토끼 귀','hat','bunny','#ffffff','#ffc9e3',30),
 A('a_bear','곰돌이 귀','hat','bear','#a0673a','#e0b088',30),A('a_fox','여우 귀','hat','fox','#ff922b','#ffffff',40),A('a_flw','꽃 화관','hat','flower','#ff8fab','#69db7c',45),
 A('a_head','헤드폰','hat','phones','#845ef7','#343a40',50),A('a_wiz','별 마법사 모자','hat','wizard','#5f3dc4','#ffe066',60),A('a_halo','천사 링','hat','halo','#ffe066','',100,1),
 A('a_uni','유니콘 뿔','hat','unicorn',GR.rainbow,'#ffffff',110,1),A('a_tiara','반짝 티아라','hat','tiara','#e9ecef','#74c0fc',120,1),A('a_crown','황금 왕관','hat','crown',GR.gold,'#ff6b6b',150,1),
 // 얼굴
 A('a_blush','하트 볼 스티커','face','blushheart','#ff6b6b','',10),A('a_whisk','고양이 수염','face','whisker','#3b3355','',12),A('a_round','동그란 안경','face','glasses','#3b3355','',15),
 A('a_stg','별 선글라스','face','starglass','#fcc419','#3b3355',30),A('a_htg','하트 선글라스','face','heartglass','#ff6b6b','#3b3355',30),A('a_mono','멋쟁이 외눈 안경','face','mono',GR.gold,'',40),
 // 목
 A('a_scarf','빨간 목도리','neck','scarf','#ff6b6b','#ffffff',15),A('a_bow','나비넥타이','neck','bowtie','#e03131','',15),A('a_hneck','하트 목걸이','neck','heartneck','#ff6b6b','#fcc419',40),
 A('a_rscarf','무지개 목도리','neck','scarf',GR.rainbow,'#ffffff',50),A('a_pearl','진주 목걸이','neck','pearl','#ffffff','',60),A('a_medal','금메달','neck','medal',GR.gold,'#4dabf7',70,1),
 // 등
 A('a_bag','노란 책가방','back','bag','#ffd43b','#ff922b',20),A('a_bbag','곰돌이 가방','back','bearbag','#a0673a','#e0b088',35),A('a_cape','빨간 망토','back','cape','#e03131','',50),
 A('a_bat','꼬마 박쥐 날개','back','batwing','#7048e8','',60),A('a_fairy','요정 날개','back','fairy','#c5f6fa','#99e9f2',90,1),A('a_bfly','나비 날개','back','butterfly','#ffa8a8','#ffd43b',100,1),
 A('a_angel','천사 날개','back','angel','#ffffff','#e7f5ff',120,1),A('a_rcape','무지개 망토','back','cape',GR.rainbow,'',130,1),A('a_dragon','아기 용 날개','back','dragon','#51cf66','#ffe066',160,1),
 // 꼬리
 A('a_ctail','고양이 꼬리','tail','cattail','#ffd8a8','',30),A('a_ftail','여우 꼬리','tail','foxtail','#ff922b','#ffffff',50),
 // 손
 A('a_candy','막대사탕','hand','lolli','#ff6b6b','#ffffff',15),A('a_ice','아이스크림','hand','icecream','#fcc2d7','#e0b088',20),A('a_bal','빨간 풍선','hand','balloon','#ff6b6b','',20),
 A('a_umb','하늘 우산','hand','umbrella','#74c0fc','#ffffff',25),A('a_flb','꽃다발','hand','bouquet','#ff8fab','#69db7c',30),A('a_hbal','하트 풍선','hand','heartballoon','#f783ac','',35),
 A('a_wand','별 요술봉','hand','wand','#ffe066','#f783ac',70,1),
 // 오라
 A('a_spark','반짝이 오라','aura','sparkle','#ffe066','',120,1),A('a_haura','하트 오라','aura','hearts','#ff8fab','',150,1),A('a_raura','무지개 오라','aura','rainbow',GR.rainbow,'',200,1),
 A('a_meteor','별똥별 오라','aura','meteor','#ffe066','#a5d8ff',250,1),
 // 펫
 A('a_chick','어깨 위 병아리','pet','chick','#ffe066','#ff922b',60),A('a_kitty','어깨 위 아기 고양이','pet','kitty','#ffd8a8','#ff922b',80),A('a_baby','어깨 위 아기 용','pet','babydragon','#69db7c','#ffe066',300,1)
];
const F=(id,cat,n,s,c,p)=>({id,cat,grp:'face',n,s,c,p});
const FACE=[
 F('e_round','eyes','동그란 눈','round','',0),F('e_manga','eyes','순정만화 눈','manga','',0),
 F('e_smile','eyes','웃는 눈','smile','',10),F('e_droop','eyes','순한 눈','droop','',10),F('e_sleepy','eyes','졸린 눈','sleepy','',10),
 F('e_cat','eyes','고양이 눈매','cat','',15),F('e_wink','eyes','윙크','wink','',20),F('e_big','eyes','왕방울 눈','big','',20),
 F('e_cool','eyes','시크한 눈','cool','',25),F('e_star','eyes','별 눈','star','',40),F('e_heart','eyes','하트 눈','heart','',40),
 F('e_spark','eyes','반짝반짝 눈','sparkle','',60),F('e_galaxy','eyes','은하수 눈','galaxy','',100),
 F('ec_purple','eyec','보라 눈동자','','purple',0),F('ec_brown','eyec','갈색 눈동자','','brown',0),F('ec_blue','eyec','파란 눈동자','','blue',5),
 F('ec_green','eyec','초록 눈동자','','green',5),F('ec_gray','eyec','회색 눈동자','','gray',5),F('ec_mint','eyec','민트 눈동자','','mint',10),
 F('ec_pink','eyec','분홍 눈동자','','pink',10),F('ec_red','eyec','빨간 눈동자','','red',15),F('ec_gold','eyec','황금 눈동자','','gold',20),
 F('m_smile','mouth','방긋 입','smile','',0),F('m_grin','mouth','활짝 웃는 입','grin','',5),F('m_o','mouth','깜짝 놀란 입','o','',5),
 F('m_shy','mouth','수줍은 입','shy','',8),F('m_cat','mouth','고양이 입','cat','',10),F('m_tongue','mouth','메롱','tongue','',10),
 F('m_teeth','mouth','이 보이는 웃음','teeth','',12),F('m_kiss','mouth','뽀뽀 입','kiss','',15)
];
const ITEMS=[...BODY,...FACE,...HAIR,...TOPS,...BOTS,...SHOES,...ACCS];
const BY={};ITEMS.forEach(i=>BY[i.id]=i);
const CATS=[{k:'body',n:'체형',e:'🧍'},{k:'face',n:'얼굴',e:'😊'},{k:'hair',n:'머리',e:'💇'},{k:'top',n:'상의',e:'👕'},{k:'bottom',n:'하의',e:'👖'},{k:'shoes',n:'신발',e:'👟'},{k:'acc',n:'장신구',e:'💍'}];
const SLOTS={hat:'모자·머리',face:'얼굴',neck:'목',back:'등',tail:'꼬리',hand:'손',aura:'오라',pet:'펫'};
function rarity(p){return p<=0?{k:0,n:'기본',c:'#868e96'}:p<=20?{k:1,n:'일반',c:'#2b8a3e'}:p<=60?{k:2,n:'희귀',c:'#1971c2'}:p<=120?{k:3,n:'영웅',c:'#7048e8'}:{k:4,n:'전설',c:'#e8590c'};}
function defaultState(){return {v:1,body:'round',eq:{hair:'h_ys',top:'t_gray',bottom:'b_blue',shoes:'s_white',eyes:'e_round',eyec:'ec_purple',mouth:'m_smile',acc:{}},own:[],spent:0};}
const FREE=ITEMS.filter(i=>i.p===0).map(i=>i.id);

// ---------- 그리기 도우미 ----------
const f2=n=>(+n).toFixed(1);
function cap(x1,y1,x2,y2,w,c){return `<line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${OL}" stroke-width="${f2(w+1.6)}" stroke-linecap="round"/><line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${c}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;}
const P=(d,c,extra='')=>`<path d="${d}" fill="${c}" stroke="${OL}" stroke-width="1" stroke-linejoin="round" ${extra}/>`;
const PN=(d,c,extra='')=>`<path d="${d}" fill="${c}" ${extra}/>`;
const C=(x,y,r,c,extra='')=>`<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${c}" stroke="${OL}" stroke-width="1" ${extra}/>`;
const CN=(x,y,r,c,extra='')=>`<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${c}" ${extra}/>`;
const E=(x,y,rx,ry,c,extra='')=>`<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${c}" stroke="${OL}" stroke-width="1" ${extra}/>`;
function star(x,y,r,c,ol){let d='';for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;d+=(i?'L':'M')+f2(x+Math.cos(a)*rr)+' '+f2(y+Math.sin(a)*rr);}return ol?P(d+'Z',c):PN(d+'Z',c);}
function heart(x,y,s,c,ol){const d=`M${f2(x)} ${f2(y+s*.9)}C${f2(x-s*1.3)} ${f2(y+s*.1)} ${f2(x-s*.9)} ${f2(y-s*.9)} ${f2(x)} ${f2(y-s*.3)}C${f2(x+s*.9)} ${f2(y-s*.9)} ${f2(x+s*1.3)} ${f2(y+s*.1)} ${f2(x)} ${f2(y+s*.9)}Z`;return ol?P(d,c):PN(d,c);}
function twinkle(x,y,r,c='#fff'){return `<path d="M${f2(x)} ${f2(y-r)}Q${f2(x)} ${f2(y)} ${f2(x+r)} ${f2(y)}Q${f2(x)} ${f2(y)} ${f2(x)} ${f2(y+r)}Q${f2(x)} ${f2(y)} ${f2(x-r)} ${f2(y)}Q${f2(x)} ${f2(y)} ${f2(x)} ${f2(y-r)}Z" fill="${c}"/>`;}
function torsoPath(M,ext=0,fl=0){const a=M.tx1,b=M.tx2,t=M.ty1,u=M.ty2+ext,A=a-fl,B=b+fl,r=2;
 return `M${a+r} ${t}L${b-r} ${t}Q${b} ${t} ${b} ${t+r}L${B} ${u-r}Q${B} ${u} ${B-r} ${u}L${A+r} ${u}Q${A} ${u} ${A} ${u-r}L${a} ${t+r}Q${a} ${t} ${a+r} ${t}Z`;}
// ---------- 머리카락 ----------
function bangs(M,c,kind){const {hx:x,hy:y,hr:r}=M;
 if(kind==='spiky'){let d=`M${x-r-1} ${y+3}`;const pts=[[-1.1,-.2],[-1.2,-.9],[-.7,-.75],[-.6,-1.45],[-.15,-1.05],[.2,-1.6],[.45,-1.05],[.95,-1.35],[.85,-.7],[1.25,-.7],[1.05,-.1]];pts.forEach(([a,b])=>d+=`L${f2(x+a*r)} ${f2(y+b*r)}`);d+=`L${x+r+1} ${y+3}L${x+r-2} ${y-r*.2}Q${x} ${y-r*.5} ${x-r+2} ${y-r*.2}Z`;return P(d,c);}
 if(kind==='curly'){let s='';for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;s+=C(x+Math.cos(a)*r*.92,y-r*.12+Math.sin(a)*r*.92,r*.36,c);}return s;}
 const pts=kind==='side'?[[.8,-.18],[.55,-.08],[.3,-.3],[0,-.04],[-.3,.02],[-.6,.06],[-.8,-.12]]:[[.8,-.18],[.6,-.02],[.42,-.32],[.21,.02],[0,-.36],[-.21,.01],[-.42,-.32],[-.6,-.03],[-.8,-.18]];
 let d=`M${f2(x-r-1.5)} ${f2(y+r*.5)}C${f2(x-r-3)} ${f2(y-r*.6)} ${f2(x-r*.6)} ${f2(y-r-6)} ${x} ${f2(y-r-5.5)}C${f2(x+r*.6)} ${f2(y-r-6)} ${f2(x+r+3)} ${f2(y-r*.6)} ${f2(x+r+1.5)} ${f2(y+r*.5)}Q${f2(x+r*.92)} ${f2(y+r*.18)} ${f2(x+pts[0][0]*r)} ${f2(y+pts[0][1]*r)}`;
 for(let i=1;i<pts.length;i++){const [px,py]=pts[i-1],[qx,qy]=pts[i];const down=qy>py;const cx=down?px-(px-qx)*.25:qx+(px-qx)*.25,cy=down?qy-.12:py-.04;d+=`Q${f2(x+cx*r)} ${f2(y+cy*r)} ${f2(x+qx*r)} ${f2(y+qy*r)}`;}
 d+=`Q${f2(x-r*.92)} ${f2(y+r*.18)} ${f2(x-r-1.5)} ${f2(y+r*.5)}Z`;
 let s=P(d,c);
 // 머릿결 + 윤기
 s+=`<path d="M${f2(x-r*.62)} ${f2(y-r*.62)}Q${x} ${f2(y-r*.98)} ${f2(x+r*.62)} ${f2(y-r*.62)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f2(r*.09)}" stroke-linecap="round"/>`;
 for(const k of [-.5,-.2,.15,.45])s+=`<path d="M${f2(x+k*r*.3)} ${f2(y-r-4)}Q${f2(x+k*r*1.1)} ${f2(y-r*.5)} ${f2(x+k*r*1.2)} ${f2(y-r*.05)}" fill="none" stroke="#000" stroke-opacity=".08" stroke-width=".7"/>`;
 return s;}
function puff(M,c,len=0){const {hx:x,hy:y,hr:r}=M;const L=len;
 return P(`M${x-r-2} ${y}C${x-r-3} ${y-r-12} ${x+r+3} ${y-r-12} ${x+r+2} ${y}C${x+r+3} ${f2(y+r*.4+L*.5)} ${x+r+2} ${f2(y+r*.7+L)} ${x+r+5} ${f2(y+r*.88+L)}Q${x+r} ${f2(y+r*1.02+L)} ${f2(x+r*.6)} ${f2(y+r*.8+L)}L${f2(x-r*.6)} ${f2(y+r*.8+L)}Q${x-r} ${f2(y+r*1.02+L)} ${x-r-5} ${f2(y+r*.88+L)}C${x-r-2} ${f2(y+r*.7+L)} ${x-r-3} ${f2(y+r*.4+L*.5)} ${x-r-2} ${y}Z`,c);}
function blk(x,y,w,h,c,r=2){return P(`M${f2(x+r)} ${f2(y)}L${f2(x+w-r)} ${f2(y)}Q${f2(x+w)} ${f2(y)} ${f2(x+w)} ${f2(y+r)}L${f2(x+w)} ${f2(y+h-r)}Q${f2(x+w)} ${f2(y+h)} ${f2(x+w-r)} ${f2(y+h)}L${f2(x+r)} ${f2(y+h)}Q${f2(x)} ${f2(y+h)} ${f2(x)} ${f2(y+h-r)}L${f2(x)} ${f2(y+r)}Q${f2(x)} ${f2(y)} ${f2(x+r)} ${f2(y)}Z`,c);}
function hairBack(M,it){const {hx:x,hy:y,hr:r,hh:h}=M,c=it.c,T=y-h,L=x-r;const W=2*r;switch(it.s){
 case 'long':return blk(L-1.5,T-1.5,W+3,2*h+18,c);
 case 'wavy':{let d=`M${L-1.5} ${T+2}`;for(let i=0;i<5;i++)d+=`Q${L-4.5+(i%2)*3} ${T+6+i*7} ${L-1.5} ${T+9+i*7}`;d+=`L${x+r+1.5} ${T+44}`;for(let i=4;i>=0;i--)d+=`Q${x+r+4.5-(i%2)*3} ${T+6+i*7} ${x+r+1.5} ${T+2+i*7}`;return P(d+`Q${x+r+1.5} ${T-1.5} ${x+r-2} ${T-1.5}L${L+2} ${T-1.5}Q${L-1.5} ${T-1.5} ${L-1.5} ${T+2}Z`,c);}
 case 'princess':return P(`M${L-1.5} ${T+2}Q${L-1.5} ${T-1.5} ${L+2} ${T-1.5}L${x+r-2} ${T-1.5}Q${x+r+1.5} ${T-1.5} ${x+r+1.5} ${T+2}L${x+r+5} ${T+2*h+22}L${L-5} ${T+2*h+22}Z`,c)+[0,1,2,3].map(i=>C(L-3+i*(W+6)/3,T+2*h+22,3.2,c)).join('');
 case 'pony':return blk(x+r-2,T+2,7,h+16,c,3)+blk(L-1.5,T-1.5,W+3,h+4,c);
 case 'twin':return blk(L-6,T+5,6,h+16,c,3)+blk(x+r,T+5,6,h+16,c,3)+blk(L-1.5,T-1.5,W+3,h+4,c)+blk(L-5,T+4,4,3,'#ff8fab',1)+blk(x+r+1,T+4,4,3,'#ff8fab',1);
 case 'braid':{let q=blk(L-1.5,T-1.5,W+3,h+4,c);for(const sd of [0,1])for(let i=0;i<5;i++)q+=blk(sd?x+r-1:L-4,T+h+i*4.6,5,4.4,c,1.5);return q;}
 case 'curly':{let q='';for(let i=0;i<8;i++)q+=C(L-1+i*(W+2)/7,T+1,4.2,c);for(let i=0;i<4;i++){q+=C(L-1.5,T+5+i*5,4,c)+C(x+r+1.5,T+5+i*5,4,c);}return q;}
 case 'bun':return blk(x-5,T-9,10,9,c,3)+blk(L-1.5,T-1.5,W+3,h+4,c);
 case 'odango':return blk(L-1,T-8,9,9,c,3)+blk(x+r-8,T-8,9,9,c,3)+blk(L-1.5,T-1.5,W+3,h+4,c);
 default:return blk(L-1.5,T-1.5,W+3,h+4,c);}}
function hairFront(M,it){const {hx:x,hy:y,hr:r,hh:h}=M,c=it.c,T=y-h,L=x-r,W=2*r;let s='';
 if(it.s==='spiky'){let d=`M${L-1.5} ${T+9}`;[[0,-5],[.12,2],[.25,-7],[.38,1],[.5,-9],[.62,1],[.75,-7],[.88,2],[1,-5]].forEach(([fx,dy])=>d+=`L${f2(L-1.5+fx*(W+3))} ${f2(T+dy)}`);return P(d+`L${x+r+1.5} ${T+9}Z`,c);}
 if(it.s==='curly'){for(let i=0;i<6;i++)s+=C(L+1+i*(W-2)/5,T+3,3.4,c);return s;}
 // 앞머리 + 옆머리
 const side=['long','wavy','princess'].includes(it.s)?h+14:it.s==='short'||it.s==='side'?h*.95:h*.55;
 s+=blk(L-1.5,T-1.5,4,side+1.5,c,1.5)+blk(x+r-2.5,T-1.5,4,side+1.5,c,1.5);
 if(it.s==='side')s+=P(`M${L-1.5} ${T+2}Q${L-1.5} ${T-1.5} ${L+2} ${T-1.5}L${x+r-2} ${T-1.5}Q${x+r+1.5} ${T-1.5} ${x+r+1.5} ${T+2}L${x+r+1.5} ${T+5}L${L+4} ${T+10}L${L-1.5} ${T+9}Z`,c);
 else{let d=`M${L-1.5} ${T+2}Q${L-1.5} ${T-1.5} ${L+2} ${T-1.5}L${x+r-2} ${T-1.5}Q${x+r+1.5} ${T-1.5} ${x+r+1.5} ${T+2}L${x+r+1.5} ${T+7}`;const n=5;for(let i=n;i>0;i--){const x2=L-1.5+(i-1)*(W+3)/n,xm=L-1.5+(i-.5)*(W+3)/n;d+=`L${f2(xm)} ${T+(i%2?8.5:7.5)}L${f2(x2)} ${T+6}`;}s+=P(d+'Z',c);}
 s+=`<rect x="${L+2}" y="${T+.5}" width="${W-4}" height="1.6" rx=".8" fill="#fff" opacity=".35"/>`;
 return s;}
// ---------- 몸 ----------
function armD(sx,sy,hx,hy,w0,w1){const dx=hx-sx,dy=hy-sy,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
 const p=(x,y)=>f2(x)+' '+f2(y);
 return `M${p(sx+nx*w0/2,sy+ny*w0/2)}L${p(hx+nx*w1/2,hy+ny*w1/2)}A${f2(w1/2)} ${f2(w1/2)} 0 0 1 ${p(hx-nx*w1/2,hy-ny*w1/2)}L${p(sx-nx*w0/2,sy-ny*w0/2)}A${f2(w0/2)} ${f2(w0/2)} 0 0 1 ${p(sx+nx*w0/2,sy+ny*w0/2)}Z`;}
function armPts(M){const y=M.ty1+M.arm*.5+1;return M.hand.map(([hx,hy],i)=>[i?M.tx2-2.5:M.tx1+2.5,y,hx,hy]);}
function armRect(M,i,y1,y2,c,pad=0){const [a,b]=M.ax[i];const r=1.6;return P(`M${a-pad+r} ${y1}L${b+pad-r} ${y1}Q${b+pad} ${y1} ${b+pad} ${y1+r}L${b+pad} ${y2-r}Q${b+pad} ${y2} ${b+pad-r} ${y2}L${a-pad+r} ${y2}Q${a-pad} ${y2} ${a-pad} ${y2-r}L${a-pad} ${y1+r}Q${a-pad} ${y1} ${a-pad+r} ${y1}Z`,c);}
function armsSkin(M){return armRect(M,0,M.ty1,M.ty2,SKIN)+armRect(M,1,M.ty1,M.ty2,SKIN);}
function handsSkin(M){return '';}
function arms(M,top){const sl=top?(['tank','dress','princess'].includes(top.s)?(top.s==='princess'?1:0):['tee','stripe','dots','stars','hearts','sailor','space'].includes(top.s)?1:2):1;
 if(!top||!sl)return '';const h=M.ty2-M.ty1,y2=M.ty1+h*(sl===1?.38:.82);let s='';
 for(const i of [0,1]){s+=armRect(M,i,M.ty1,y2,top.c,.4);if(top.s==='princess'){const [a,b]=M.ax[i];s+=E((a+b)/2,M.ty1+3,(b-a)*.62,4.5,top.c2||'#fff');}}
 if(top.s==='hanbok'){const cols=['#ff6b6b','#ffd43b','#69db7c','#4dabf7','#9775fa'];for(const i of [0,1]){const [a,b]=M.ax[i];cols.forEach((c,k)=>{s+=`<rect x="${a-.4}" y="${f2(M.ty1+3+k*(y2-M.ty1-3)/5)}" width="${f2(b-a+.8)}" height="${f2((y2-M.ty1-3)/5)}" fill="${c}"/>`;});}}
 return s;}
function legD(M,i){const [a,b]=M.legs[i],t=M.ty2-3,u=M.ly2,r=1.6;return `M${a} ${t}L${b} ${t}L${b} ${u-r}Q${b} ${u} ${b-r} ${u}L${a+r} ${u}Q${a} ${u} ${a} ${u-r}Z`;}
function mir(M,x){return `<g transform="matrix(-1 0 0 1 ${2*M.hx} 0)">${x}</g>`;}
function legs(M){const l=P(legD(M,0),SKIN);return l+mir(M,l);}
function torsoTop(M,it,uid){const c=it.c,c2=it.c2,t=M.ty1,u=M.ty2,cx=M.hx,a=M.bx1,b=M.bx2,w=b-a,ta=M.tx1,tb=M.tx2;
 let ext=0,fl=0;if(it.s==='dress'){ext=10;fl=6;}if(it.s==='princess'){ext=16;fl=11;}if(it.s==='rain'){ext=3;fl=2;}
 const tp=torsoPath(M,ext,fl);let d='';
 const sp=(n,fn)=>[...Array(n)].map((_,i)=>fn(a+3+(i%4)*(w-4)/3+(Math.floor(i/4)%2)*3,t+6+Math.floor(i/4)*11)).join('');
 switch(it.s){
 case 'stripe':d=[0,1,2,3,4,5,6,7].map(i=>`<rect x="${a-4}" y="${t+3+i*7}" width="${w+8}" height="3.4" fill="${c2}"/>`).join('');break;
 case 'dots':d=sp(16,(x,y)=>CN(x,y,2.2,c2));break;
 case 'stars':d=sp(16,(x,y)=>star(x,y,3,c2));break;
 case 'hearts':d=sp(16,(x,y)=>heart(x,y,2.6,c2));break;
 case 'tank':d=PN(`M${ta-2} ${t-2}L${ta+3} ${t-2}Q${cx} ${t+12} ${tb-3} ${t-2}L${tb+2} ${t-2}L${tb+2} ${t+4}L${ta-2} ${t+4}Z`,SKIN);break;
 case 'dress':d=P(`M${a-12} ${u-1}L${b+12} ${u-1}`,'none')+CN(cx,u-1,2.4,c2);break;
 case 'princess':d=`<rect x="${a-20}" y="${u-2}" width="${w+40}" height="5" fill="${c2}"/>`+[0,1,2,3,4,5].map(i=>CN(a-12+i*(w+24)/5,u+ext+3,4,c2)).join('')+heart(cx,t+9,3,'#ff6b6b');break;
 case 'hoodie':d=P(`M${cx-9} ${u-14}L${cx+9} ${u-14}L${cx+11} ${u-4}L${cx-11} ${u-4}Z`,c)+cap(cx-3,t+3,cx-3,t+13,.8,'#fff')+cap(cx+3,t+3,cx+3,t+13,.8,'#fff');
  if(c.startsWith('url'))d+=star(a+7,t+12,2.2,'#fff')+star(b-8,t+22,1.6,'#fff')+star(cx+5,u-9,1.4,'#fff');break;
 case 'sweater':d=`<rect x="${a-4}" y="${u-4}" width="${w+8}" height="20" fill="${c}" stroke="${OL}" stroke-width="1"/>`+(it.id==='t_sws'?star(cx,t+17,7,c2,1):heart(cx,t+17,6,c2,1));break;
 case 'shirt':d=P(`M${cx} ${t+1}L${cx-8} ${t-1}L${cx-6} ${t+6}Z`,'#fff')+P(`M${cx} ${t+1}L${cx+8} ${t-1}L${cx+6} ${t+6}Z`,'#fff')+[0,1,2,3,4].map(i=>CN(cx,t+8+i*7,1.2,OL)).join('');break;
 case 'jacket':d=`<rect x="${cx-4.5}" y="${t-2}" width="9" height="${u-t+20}" fill="${c2}"/><path d="M${cx-4.5} ${t}L${cx-4.5} ${u+20}M${cx+4.5} ${t}L${cx+4.5} ${u+20}" stroke="${OL}" stroke-width="1.2"/>`;break;
 case 'sailor':d=P(`M${ta-4} ${t-1}L${cx} ${t+14}L${tb+4} ${t-1}L${tb+4} ${t+10}L${cx} ${t+21}L${ta-4} ${t+10}Z`,c2)+P(`M${cx-6} ${t+19}L${cx} ${t+16}L${cx+6} ${t+19}L${cx+5} ${t+25}L${cx} ${t+22}L${cx-5} ${t+25}Z`,'#ff6b6b');break;
 case 'rain':d=[0,1,2].map(i=>C(cx,t+9+i*9,1.7,'#fff')).join('');break;
 case 'hanbok':d=`<rect x="${a-4}" y="${u-8}" width="${w+8}" height="30" fill="${c2}" opacity=".0"/>`+P(`M${cx-6} ${t}L${cx+8} ${t+18}`,'none')+P(`M${cx-1} ${t+16}Q${cx-8} ${t+30} ${cx-4} ${t+33}L${cx-1} ${t+19}Q${cx+4} ${t+32} ${cx+1} ${t+34}Q${cx+5} ${t+24} ${cx-1} ${t+16}Z`,c2);break;
 case 'tux':d=P(`M${cx-6} ${t-2}L${cx} ${t+17}L${cx+6} ${t-2}Z`,c2)+P(`M${cx-6} ${t+3}L${cx} ${t+5}L${cx+6} ${t+3}L${cx+6} ${t+8}L${cx} ${t+6}L${cx-6} ${t+8}Z`,'#e03131')+[0,1].map(i=>CN(cx,t+21+i*6,1.3,'#fff')).join('');break;
 case 'space':d=`<rect x="${a-4}" y="${u-10}" width="${w+8}" height="5" fill="#adb5bd" stroke="${OL}" stroke-width="1"/>`+C(cx-7,t+12,4.5,c2)+star(cx-7,t+12,2.6,'#fff')+`<rect x="${cx+2}" y="${t+9}" width="8" height="6" rx="1.5" fill="#ff6b6b" stroke="${OL}" stroke-width="1"/>`;break;
 }
 const col=['tank','hoodie','shirt','sailor','tux','rain'].includes(it.s)?'':P(`M${cx-6} ${t-.5}Q${cx} ${t+5} ${cx+6} ${t-.5}`,'none');
 let pre='';if(it.s==='hoodie'||it.s==='rain')pre=P(`M${cx-12} ${t+2}Q${cx} ${t-6} ${cx+12} ${t+2}Q${cx} ${t+9} ${cx-12} ${t+2}Z`,c);
 return pre+PN(tp,c)+`<clipPath id="tc${uid}"><path d="${tp}"/></clipPath><g clip-path="url(#tc${uid})">${d}</g>`+P(tp,'none')+col;}
function sleevesHanbok(M,top){return '';
 function _old(){if(!top||top.s!=='hanbok')return '';const cols=['#ff6b6b','#ffd43b','#69db7c','#4dabf7','#9775fa'];let s='';
 M.hand.forEach(([hx,hy],i)=>{const sx=i?M.tx2-2:M.tx1+2;const y=M.ty1+M.arm*.55+1.5;for(let k=0;k<5;k++){const t0=.12+k*.15,t1=t0+.15;s+=`<line x1="${f2(sx+(hx-sx)*t0)}" y1="${f2(y+(hy-y)*t0)}" x2="${f2(sx+(hx-sx)*t1)}" y2="${f2(y+(hy-y)*t1)}" stroke="${cols[k]}" stroke-width="${M.arm+1.2}"/>`;}});return s;}}
function bottom(M,it,uid){const c=it.c,c2=it.c2,[[la,lb],[ra,rb]]=M.legs,top=M.ty2-6,y1=M.ly1,y2=M.ly2+3,cx=(la+rb)/2;let s='';
 const pants=(end)=>{end=Math.min(end,M.ly2+2);return `<clipPath id="pc${uid}"><rect x="-20" y="${top-30}" width="140" height="${end-top+30}"/></clipPath><g clip-path="url(#pc${uid})">${P(legD(M,0),c)+mir(M,P(legD(M,0),c))}<path d="M${f2(la+(lb-la)*.2)} ${top-2}L${f2(rb-(rb-ra)*.2)} ${top-2}L${f2(rb-(rb-ra)*.2)} ${top+8}L${f2(la+(lb-la)*.2)} ${top+8}Z" fill="${c}"/></g>`+(end<M.ly2-1?`<path d="M${la-1.5} ${end}L${lb-1} ${end}M${ra+1} ${end}L${rb+1.5} ${end}" stroke="${OL}" stroke-width="1"/>`:'');};
 const skirt=(len,fl)=>P(`M${la} ${top}L${rb} ${top}L${rb+fl} ${y1+len}Q${cx} ${y1+len+3} ${la-fl} ${y1+len}Z`,c);
 switch(it.s){
 case 'shorts':s+=pants(y1+9);break;
 case 'jeans':s+=pants(y2-4)+cap(la+3,y1+3,la+3,y2-6,.01,'#3b5bdb')+cap(rb-3,y1+3,rb-3,y2-6,.01,'#3b5bdb')+P(`M${la+1} ${top+3}Q${la+5} ${top+8} ${la+8} ${top+3}`,'none');break;
 case 'jog':s+=pants(y2-4)+`<rect x="${la-1}" y="${top+3}" width="2.6" height="${y2-top-8}" fill="${c2}"/><rect x="${rb-1.6}" y="${top+3}" width="2.6" height="${y2-top-8}" fill="${c2}"/>`+`<rect x="${la-1}" y="${y2-7}" width="${lb-la+1.5}" height="3" fill="${c}" stroke="${OL}" stroke-width="1"/><rect x="${ra-.5}" y="${y2-7}" width="${rb-ra+1.5}" height="3" fill="${c}" stroke="${OL}" stroke-width="1"/>`;break;
 case 'cargo':s+=pants(y2-4)+`<rect x="${la}" y="${y1+8}" width="6" height="7" rx="1" fill="${c}" stroke="${OL}" stroke-width="1"/><rect x="${rb-6}" y="${y1+8}" width="6" height="7" rx="1" fill="${c}" stroke="${OL}" stroke-width="1"/>`;break;
 case 'starpants':s+=pants(y2-4)+`<clipPath id="bc${uid}"><path d="M${la-1} ${top}L${rb+1} ${top}L${rb+1} ${y2-4}L${la-1} ${y2-4}Z"/></clipPath><g clip-path="url(#bc${uid})">`+[...Array(8)].map((_,i)=>star(la+2+(i%2)*(rb-la-4)+(Math.floor(i/2)%2?3:0)*(i%2?-1:1),top+5+Math.floor(i/2)*9,2.2,c2)).join('')+'</g>';break;
 case 'overall':s+=pants(y2-4)+P(`M${cx-8} ${top-12}L${cx+8} ${top-12}L${cx+8} ${top+2}L${cx-8} ${top+2}Z`,c)+cap(cx-7,top-12,M.tx1+5,M.ty1+1,1.4,c)+cap(cx+7,top-12,M.tx2-5,M.ty1+1,1.4,c)+C(cx-5,top-9,1.4,c2)+C(cx+5,top-9,1.4,c2);break;
 case 'skirt':s+=skirt(10,4);break;
 case 'pleat':s+=skirt(11,4)+`<clipPath id="bc${uid}"><path d="M${la} ${top}L${rb} ${top}L${rb+4} ${y1+11}L${la-4} ${y1+11}Z"/></clipPath><g clip-path="url(#bc${uid})">`+[0,1,2,3,4].map(i=>`<rect x="${la-4+i*(rb-la+8)/5}" y="${top}" width="1.2" height="20" fill="${OL}" opacity=".35"/>`).join('')+`<rect x="${la-6}" y="${top+6}" width="${rb-la+12}" height="1.8" fill="${c2}"/><rect x="${la-6}" y="${top+12}" width="${rb-la+12}" height="1.8" fill="${c2}"/></g>`+skirt(11,4).replace(`fill="${c}"`,'fill="none"');break;
 case 'dotskirt':s+=skirt(11,5)+[...Array(7)].map((_,i)=>CN(la+(i%4)*(rb-la)/3,top+5+Math.floor(i/4)*8+(i%2),1.8,c2)).join('');break;
 case 'long':s+=P(`M${la} ${top}L${rb} ${top}L${rb+7} ${y2-3}Q${cx} ${y2} ${la-7} ${y2-3}Z`,c);if(c2)s+=`<rect x="${la-1}" y="${top}" width="${rb-la+2}" height="4" fill="${c2}" stroke="${OL}" stroke-width="1"/>`;break;
 case 'tutu':for(let k=2;k>=0;k--){let d=`M${la-2-k*3} ${top+4+k*3}`;const n=6;for(let i=0;i<=n;i++){const x=la-2-k*3+i*(rb-la+4+k*6)/n;d+=`Q${x-2} ${y1+8+k*2} ${x} ${top+4+k*3}`;}s+=P(d+'Z',c,k?'opacity=".9"':'');}s+=`<rect x="${la}" y="${top}" width="${rb-la}" height="5" rx="2" fill="${c}" stroke="${OL}" stroke-width="1.2"/>`;break;
 case 'cloud':s+=skirt(8,4);for(let i=0;i<6;i++)s+=C(la-3+i*(rb-la+6)/5,y1+9,3.6,c);s+=CN(la+5,top+5,2,c2)+CN(rb-6,top+8,1.6,c2);break;
 case 'mermaid':s+=P(`M${la-1} ${top}L${rb+1} ${top}Q${rb+2} ${y1+12} ${cx+4} ${y2-4}L${cx+13} ${y2+6}Q${cx} ${y2+1} ${cx-13} ${y2+6}L${cx-4} ${y2-4}Q${la-2} ${y1+12} ${la-1} ${top}Z`,c)+[0,1,2].map(i=>P(`M${cx-6+i*3} ${y1+i*7}Q${cx-3+i*3} ${y1+3+i*7} ${cx+i*3} ${y1+i*7}`,'none','opacity=".5"')).join('');break;
 default:s+=pants(y2-4);}
 return s;}
function shoes(M,it,bot){if(bot&&bot.s==='mermaid')return '';const c=it.c,c2=it.c2;let s='';
 [M.legs[0]].forEach(([a0,b0],i)=>{const w0=b0-a0,a=i?a0+w0*.18:a0+w0*.12,b=i?b0-w0*.12:b0-w0*.18,y=M.ly2-1,cx=(a+b)/2,w=b-a+3;const s0=s.length;
 switch(it.s){
 case 'sandal':s+=`<rect x="${a-1.5}" y="${y-1}" width="${w}" height="3" rx="1.5" fill="${c}" stroke="${OL}" stroke-width="1.1"/>`+cap(a+1,y-3,b-1,y-1,1.2,c);break;
 case 'mary':s+=P(`M${a-1.5} ${y-3}Q${a-1.5} ${y+3} ${cx} ${y+3}Q${b+1.5} ${y+3} ${b+1.5} ${y-3}Z`,c)+cap(a,y-4.5,b,y-4.5,1,c)+CN(cx-2,y,1,'#fff','opacity=".8"');break;
 case 'rainboot':s+=P(`M${a-1} ${y-11}L${b+1} ${y-11}L${b+1} ${y-1}Q${b+3} ${y+3} ${cx} ${y+3}L${a-1.5} ${y+3}Z`,c);break;
 case 'boot':s+=P(`M${a-1} ${y-9}L${b+1} ${y-9}L${b+1} ${y}Q${b+3} ${y+3} ${cx} ${y+3}L${a-1.5} ${y+3}Z`,c)+(c2?star(cx,y-4,2.4,c2):'');break;
 case 'furboot':s+=P(`M${a-1} ${y-8}L${b+1} ${y-8}L${b+1} ${y}Q${b+3} ${y+3} ${cx} ${y+3}L${a-1.5} ${y+3}Z`,c)+[0,1,2].map(k=>C(a+k*(b-a)/2,y-8,2,c2)).join('');break;
 case 'skate':s+=P(`M${a-1.5} ${y-4}L${b+1.5} ${y-4}L${b+2} ${y+1}L${a-2} ${y+1}Z`,c)+C(a+.5,y+3.4,1.8,c2)+C(b-.5,y+3.4,1.8,c2);break;
 case 'cloud':for(let k=0;k<3;k++)s+=C(a+k*(b-a)/2,y+1,2.8,c);s+=CN(cx,y,1.2,c2);break;
 case 'wing':s+=P(`M${a-1.5} ${y-3}Q${a-1.5} ${y+3} ${cx} ${y+3}Q${b+1.5} ${y+3} ${b+1.5} ${y-3}Z`,c)+P(i?`M${b+1} ${y-2}Q${b+8} ${y-8} ${b+7} ${y-1}Q${b+5} ${y} ${b+1} ${y}Z`:`M${a-1} ${y-2}Q${a-8} ${y-8} ${a-7} ${y-1}Q${a-5} ${y} ${a-1} ${y}Z`,c2);break;
 case 'rocket':s+=P(`M${a-1} ${y-8}L${b+1} ${y-8}L${b+1.5} ${y+2}L${a-1.5} ${y+2}Z`,c)+`<rect x="${a-1}" y="${y-5}" width="${b-a+2}" height="2" fill="${c2}"/>`+P(`M${a+.5} ${y+2.5}Q${cx} ${y+12} ${b-.5} ${y+2.5}Z`,'url(#tav-fire)','stroke="none"');break;
 case 'light':s+=P(`M${a-1.5} ${y-3}Q${a-1.5} ${y+3} ${cx} ${y+3}Q${b+1.5} ${y+3} ${b+1.5} ${y-3}Z`,c)+`<rect x="${a-1}" y="${y+1}" width="${w-1}" height="2.2" rx="1" fill="url(#tav-rainbow)"/>`;break;
 default:s+=P(`M${a-1.5} ${y-3}Q${a-1.5} ${y+3.2} ${cx} ${y+3.2}Q${b+2} ${y+3.2} ${b+2} ${y-3}Z`,c)+`<rect x="${a-1.3}" y="${y+1.2}" width="${w-.4}" height="1.8" rx=".9" fill="${c2||'#fff'}"/>`+CN(cx,y-1,.7,OL)+CN(cx+2,y-1,.7,OL);}
 s=s.slice(0,s0)+`<g transform="translate(${f2(cx)} ${f2(y-2)}) scale(1.12) translate(${f2(-cx)} ${f2(-y+2)})">`+s.slice(s0)+'</g>';});
 s=s+mir(M,s);
 return s;}
function face(M,eq){const {hx:x,hy:y,hr:r}=M;eq=eq||{};const es=(BY[eq.eyes]||BY.e_round).s,ic=(BY[eq.eyec]||BY.ec_purple).c,ms=(BY[eq.mouth]||BY.m_smile).s;
 const IR=`url(#tav-ir-${ic})`,DK='#3a2f4f';let s='';const ey=y+r*.2;
 const st=(d,w)=>`<path d="${d}" fill="none" stroke="${DK}" stroke-width="${f2(r*w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const p=(a,b)=>f2(a)+' '+f2(b);
 for(const k of [-1,1])s+=`<ellipse cx="${f2(x+k*r*.63)}" cy="${f2(y+r*.5)}" rx="${f2(r*.2)}" ry="${f2(r*.12)}" fill="url(#tav-blush)"/>`;
 const roundEye=(ex,big)=>{const sc=big?1.2:1;return `<ellipse cx="${f2(ex)}" cy="${f2(ey)}" rx="${f2(r*.19*sc)}" ry="${f2(r*.21*sc)}" fill="#fff"/><ellipse cx="${f2(ex)}" cy="${f2(ey+r*.02)}" rx="${f2(r*.15*sc)}" ry="${f2(r*.18*sc)}" fill="${IR}"/><ellipse cx="${f2(ex)}" cy="${f2(ey+r*.03)}" rx="${f2(r*.07*sc)}" ry="${f2(r*.09*sc)}" fill="#2e2a6b"/>`+CN(ex-r*.05*sc,ey-r*.06*sc,r*.055*sc,'#fff')+CN(ex+r*.06*sc,ey+r*.09*sc,r*.025*sc,'#fff')+(big?CN(ex+r*.08,ey-r*.09,r*.03,'#fff'):'')+st(`M${p(ex-r*.2*sc,ey-r*.04)}Q${p(ex,ey-r*.3*sc)} ${p(ex+r*.2*sc,ey-r*.04)}`,.055);};
 for(const k of [-1,1]){const ex=x+k*r*.4,o=k;
  switch(es){
  case 'manga':{const w=r*.24;s+=`<path d="M${p(ex-o*w,ey+r*.03)}Q${p(ex,ey-r*.25)} ${p(ex+o*w,ey-r*.04)}Q${p(ex+o*w*.6,ey+r*.24)} ${p(ex-o*w,ey+r*.03)}Z" fill="#fff"/><ellipse cx="${f2(ex)}" cy="${f2(ey+r*.03)}" rx="${f2(r*.13)}" ry="${f2(r*.16)}" fill="${IR}"/><ellipse cx="${f2(ex)}" cy="${f2(ey+r*.04)}" rx="${f2(r*.06)}" ry="${f2(r*.08)}" fill="#2e2a6b"/>`+CN(ex-o*r*.04,ey-r*.04,r*.045,'#fff')+st(`M${p(ex-o*w*1.05,ey+r*.04)}Q${p(ex,ey-r*.27)} ${p(ex+o*w*1.08,ey-r*.06)}`,.07)+st(`M${p(ex+o*w,ey-r*.06)}l${p(o*r*.08,-r*.05)}`,.04)+`<path d="M${p(ex-o*w*.4,ey+r*.18)}Q${p(ex+o*w*.2,ey+r*.21)} ${p(ex+o*w*.7,ey+r*.12)}" fill="none" stroke="#e8a0a0" stroke-width="${f2(r*.025)}" stroke-linecap="round"/>`;break;}
  case 'smile':s+=st(`M${p(ex-r*.17,ey+r*.05)}Q${p(ex,ey-r*.18)} ${p(ex+r*.17,ey+r*.05)}`,.07);break;
  case 'wink':s+=k>0?st(`M${p(ex-r*.17,ey+r*.05)}Q${p(ex,ey-r*.18)} ${p(ex+r*.17,ey+r*.05)}`,.07):roundEye(ex);break;
  case 'big':s+=roundEye(ex,true);break;
  case 'droop':s+=roundEye(ex).replace(/<path[^>]*\/>$/,'')+st(`M${p(ex-o*r*.2,ey-r*.12)}Q${p(ex+o*r*.02,ey-r*.2)} ${p(ex+o*r*.22,ey+r*.02)}`,.06);break;
  case 'sleepy':s+=`<path d="M${p(ex-r*.19,ey)}A${f2(r*.19)} ${f2(r*.17)} 0 0 0 ${p(ex+r*.19,ey)}Z" fill="#fff"/><path d="M${p(ex-r*.14,ey)}A${f2(r*.14)} ${f2(r*.14)} 0 0 0 ${p(ex+r*.14,ey)}Z" fill="${IR}"/>`+CN(ex-r*.04,ey+r*.05,r*.035,'#fff')+st(`M${p(ex-r*.21,ey)}L${p(ex+r*.21,ey)}`,.06);break;
  case 'cat':{const w=r*.23;s+=`<path d="M${p(ex-o*w,ey+r*.06)}Q${p(ex-o*w*.2,ey-r*.2)} ${p(ex+o*w,ey-r*.12)}Q${p(ex+o*w*.4,ey+r*.2)} ${p(ex-o*w,ey+r*.06)}Z" fill="#fff"/><ellipse cx="${f2(ex)}" cy="${f2(ey)}" rx="${f2(r*.13)}" ry="${f2(r*.15)}" fill="${IR}"/><ellipse cx="${f2(ex)}" cy="${f2(ey)}" rx="${f2(r*.03)}" ry="${f2(r*.12)}" fill="#2e2a6b"/>`+CN(ex-o*r*.05,ey-r*.05,r*.035,'#fff')+st(`M${p(ex-o*w*1.05,ey+r*.06)}Q${p(ex-o*w*.2,ey-r*.22)} ${p(ex+o*w*1.15,ey-r*.15)}`,.065);break;}
  case 'cool':s+=`<path d="M${p(ex-r*.2,ey-r*.03)}L${p(ex+r*.2,ey-r*.03)}Q${p(ex+r*.12,ey+r*.17)} ${p(ex,ey+r*.17)}Q${p(ex-r*.12,ey+r*.17)} ${p(ex-r*.2,ey-r*.03)}Z" fill="#fff"/><path d="M${p(ex-r*.12,ey-r*.03)}A${f2(r*.12)} ${f2(r*.15)} 0 0 0 ${p(ex+r*.12,ey-r*.03)}Z" fill="${IR}"/>`+CN(ex-r*.04,ey+r*.04,r*.03,'#fff')+st(`M${p(ex-r*.22,ey-r*.04)}L${p(ex+r*.22,ey-r*.04)}`,.06);break;
  case 'star':s+=`<ellipse cx="${f2(ex)}" cy="${f2(ey)}" rx="${f2(r*.19)}" ry="${f2(r*.21)}" fill="#fff"/>`+star(ex,ey+r*.01,r*.17,IR)+CN(ex-r*.05,ey-r*.06,r*.04,'#fff')+st(`M${p(ex-r*.2,ey-r*.04)}Q${p(ex,ey-r*.3)} ${p(ex+r*.2,ey-r*.04)}`,.055);break;
  case 'heart':s+=heart(ex,ey+r*.02,r*.17,'#ff6b9a')+CN(ex-r*.06,ey-r*.04,r*.04,'#fff');break;
  case 'sparkle':s+=roundEye(ex,true)+twinkle(ex+r*.05,ey+r*.04,r*.07,'#fff')+twinkle(ex-r*.06,ey+r*.1,r*.04,'#fff');break;
  case 'galaxy':s+=`<ellipse cx="${f2(ex)}" cy="${f2(ey)}" rx="${f2(r*.2)}" ry="${f2(r*.22)}" fill="#fff"/><ellipse cx="${f2(ex)}" cy="${f2(ey+r*.02)}" rx="${f2(r*.16)}" ry="${f2(r*.19)}" fill="url(#tav-galaxy)"/>`+twinkle(ex-r*.05,ey-r*.06,r*.06,'#fff')+twinkle(ex+r*.06,ey+r*.07,r*.04,'#ffe066')+CN(ex+r*.02,ey-r*.1,r*.015,'#fff')+CN(ex-r*.08,ey+r*.08,r*.015,'#fff')+st(`M${p(ex-r*.21,ey-r*.04)}Q${p(ex,ey-r*.31)} ${p(ex+r*.21,ey-r*.04)}`,.055);break;
  default:s+=roundEye(ex);}}
 const my=y+r*.55,MC='#d9707f';
 switch(ms){
 case 'grin':s+=`<path d="M${p(x-r*.13,my-r*.03)}Q${p(x,my-r*.02)} ${p(x+r*.13,my-r*.03)}Q${p(x+r*.1,my+r*.16)} ${p(x,my+r*.16)}Q${p(x-r*.1,my+r*.16)} ${p(x-r*.13,my-r*.03)}Z" fill="#c2455a"/><ellipse cx="${f2(x)}" cy="${f2(my+r*.11)}" rx="${f2(r*.06)}" ry="${f2(r*.035)}" fill="#ff8fa3"/>`;break;
 case 'o':s+=`<ellipse cx="${f2(x)}" cy="${f2(my+r*.03)}" rx="${f2(r*.05)}" ry="${f2(r*.065)}" fill="#c2455a"/>`;break;
 case 'shy':s+=`<path d="M${p(x-r*.09,my+r*.02)}q${p(r*.045,-r*.04)} ${p(r*.09,0)}q${p(r*.045,r*.04)} ${p(r*.09,0)}" fill="none" stroke="${MC}" stroke-width="${f2(r*.04)}" stroke-linecap="round"/>`;break;
 case 'cat':s+=`<path d="M${p(x-r*.13,my-r*.01)}q${p(r*.065,r*.09)} ${p(r*.13,0)}q${p(r*.065,r*.09)} ${p(r*.13,0)}" fill="none" stroke="${MC}" stroke-width="${f2(r*.045)}" stroke-linecap="round"/>`;break;
 case 'tongue':s+=`<path d="M${p(x+r*.0,my+r*.04)}q${p(r*.03,r*.11)} ${p(r*.09,r*.02)}" fill="#ff8fa3" stroke="#e8667f" stroke-width="${f2(r*.02)}"/>`+`<path d="M${p(x-r*.1,my)}Q${p(x,my+r*.08)} ${p(x+r*.12,my)}" fill="none" stroke="${MC}" stroke-width="${f2(r*.045)}" stroke-linecap="round"/>`;break;
 case 'teeth':s+=`<path d="M${p(x-r*.14,my-r*.03)}L${p(x+r*.14,my-r*.03)}Q${p(x+r*.12,my+r*.15)} ${p(x,my+r*.15)}Q${p(x-r*.12,my+r*.15)} ${p(x-r*.14,my-r*.03)}Z" fill="#c2455a"/><path d="M${p(x-r*.13,my-r*.02)}L${p(x+r*.13,my-r*.02)}L${p(x+r*.12,my+r*.04)}L${p(x-r*.12,my+r*.04)}Z" fill="#fff"/>`;break;
 case 'kiss':s+=`<path d="M${p(x-r*.02,my-r*.05)}q${p(r*.08,r*.03)} ${p(0,r*.06)}q${p(r*.08,r*.03)} ${p(0,r*.06)}" fill="none" stroke="${MC}" stroke-width="${f2(r*.045)}" stroke-linecap="round"/>`+heart(x+r*.2,my-r*.08,r*.045,'#ff8fab');break;
 default:s+=`<path d="M${p(x-r*.1,my-r*.02)}Q${p(x,my+r*.06)} ${p(x+r*.1,my-r*.02)}" fill="none" stroke="${MC}" stroke-width="${f2(r*.045)}" stroke-linecap="round"/>`;}
 return s;}
function acc(M,it,uid,layer){const _o=OL;OL=SEAM;const raw=acc0(M,it,uid);OL=_o;const x=M.hx;
 if(['batwing','fairy','butterfly','angel','dragon'].includes(it.s))return `<g transform="translate(${x} ${M.ty1+6}) scale(1.35) translate(${-x} ${-M.ty1-6})">${raw}</g>`;
 if(it.slot==='pet'){const px=M.tx1,py=M.ty1-6;return `<g transform="translate(${px} ${py+5}) scale(1.75) translate(${-px} ${-py-5})">${raw}</g>`;}
 if(it.slot==='aura')return `<g opacity=".95">${raw}</g>`;return raw;}
function acc0(M,it,uid){const {hx:x,hy:y,hr:r}=M,c=it.c,c2=it.c2;const top=y-r;let s='';
 const [rhx,rhy]=M.hand[1];
 switch(it.s){
 // 모자
 case 'cap':return P(`M${x-r-1} ${y-r*.25}A${r+1} ${r*.95} 0 0 1 ${x+r+1} ${y-r*.25}Z`,c)+P(`M${x+r*.3} ${y-r*.3}Q${x+r+12} ${y-r*.35} ${x+r+10} ${y-r*.12}Q${x+r*.6} ${y-r*.1} ${x+r*.3} ${y-r*.3}Z`,c)+C(x,top-.5,1.8,c);
 case 'party':return P(`M${x-8} ${top+4}L${x+1} ${top-20}L${x+9} ${top+4}Z`,c)+P(`M${x-5} ${top-4}L${x+6} ${top-7}`,'none','stroke="'+c2+'" stroke-width="2.4"')+C(x+1,top-21,3,c2);
 case 'beanie':return P(`M${x-r-1} ${y-r*.15}Q${x-r-1} ${top-6} ${x} ${top-7}Q${x+r+1} ${top-6} ${x+r+1} ${y-r*.15}Z`,c)+`<rect x="${x-r-2}" y="${y-r*.3}" width="${2*r+4}" height="6" rx="3" fill="${c2}" stroke="${OL}" stroke-width="1.2"/>`+C(x,top-8,4,c2);
 case 'ribbon':return P(`M${x-r} ${y-r*.3}A${r} ${r} 0 0 1 ${x+r} ${y-r*.3}`,'none','stroke-width="1"')+`<path d="M${x-r} ${y-r*.3}A${r} ${r} 0 0 1 ${x+r} ${y-r*.3}" fill="none" stroke="${c}" stroke-width="3"/>`+P(`M${x+r*.35} ${top+2}L${x+r*.35-10} ${top-6}L${x+r*.35-10} ${top+8}Z`,c)+P(`M${x+r*.35} ${top+2}L${x+r*.35+10} ${top-6}L${x+r*.35+10} ${top+8}Z`,c)+C(x+r*.35,top+2,2.6,c);
 case 'straw':return E(x,y-r*.35,r+11,4.5,c)+P(`M${x-r*.8} ${y-r*.35}Q${x-r*.8} ${top-7} ${x} ${top-7}Q${x+r*.8} ${top-7} ${x+r*.8} ${y-r*.35}Z`,c)+`<rect x="${x-r*.8}" y="${y-r*.55}" width="${r*1.6}" height="3.5" fill="${c2}"/>`;
 case 'chef':return `<rect x="${x-r*.75}" y="${top-5}" width="${r*1.5}" height="9" fill="${c}" stroke="${OL}" stroke-width="1.3"/>`+C(x-r*.5,top-9,6,c)+C(x+r*.5,top-9,6,c)+C(x,top-12,7,c)+`<rect x="${x-r*.75+1}" y="${top-6}" width="${r*1.5-2}" height="6" fill="${c}"/>`;
 case 'catear':case 'fox':{for(const k of [-1,1]){s+=P(`M${x+k*r*.35} ${top+3}L${x+k*r*.85} ${top-(it.s==='fox'?13:10)}L${x+k*r*.95} ${top+8}Z`,c)+PN(`M${x+k*r*.5} ${top+3}L${x+k*r*.82} ${top-(it.s==='fox'?8:6)}L${x+k*r*.85} ${top+6}Z`,c2);}return s;}
 case 'bunny':{for(const k of [-1,1])s+=E(x+k*r*.4,top-9,4.5,12,c,`transform="rotate(${k*12} ${x+k*r*.4} ${top})"`)+`<ellipse cx="${x+k*r*.4}" cy="${top-9}" rx="2.2" ry="8.5" fill="${c2}" transform="rotate(${k*12} ${x+k*r*.4} ${top})"/>`;return s;}
 case 'bear':{for(const k of [-1,1])s+=C(x+k*r*.72,top+3,5.5,c)+CN(x+k*r*.72,top+3,3,c2);return s;}
 case 'flower':{const cols=['#ff8fab','#ffd43b','#b197fc','#ff8fab','#74c0fc','#ffd43b','#ff8fab'];for(let i=0;i<7;i++){const a=Math.PI*(1.05+i*.15),fx=x+Math.cos(a)*(r+1),fy=y-r*.15+Math.sin(a)*(r+1);s+=CN(fx-3,fy,3,c2)+[0,1,2,3,4].map(k=>CN(fx+Math.cos(k*1.256)*2.4,fy+Math.sin(k*1.256)*2.4,2,cols[i])).join('')+CN(fx,fy,1.4,'#fff3bf');}return s;}
 case 'phones':return `<path d="M${x-r-1} ${y}A${r+1} ${r+3} 0 0 1 ${x+r+1} ${y}" fill="none" stroke="${OL}" stroke-width="5"/><path d="M${x-r-1} ${y}A${r+1} ${r+3} 0 0 1 ${x+r+1} ${y}" fill="none" stroke="${c}" stroke-width="3"/>`+E(x-r-1,y+1,4,6.5,c)+E(x+r+1,y+1,4,6.5,c)+CN(x-r-1,y+1,2,c2)+CN(x+r+1,y+1,2,c2);
 case 'wizard':return E(x,y-r*.45,r+7,4,c)+P(`M${x-r*.8} ${y-r*.45}Q${x-2} ${top-14} ${x+8} ${top-24}Q${x+3} ${top-10} ${x+r*.8} ${y-r*.45}Z`,c)+star(x-2,top-5,3.4,c2)+star(x+6,top+2,2,c2);
 case 'halo':return `<ellipse cx="${x}" cy="${top-7}" rx="${r*.75}" ry="3.6" fill="none" stroke="${OL}" stroke-width="4.6"/><ellipse cx="${x}" cy="${top-7}" rx="${r*.75}" ry="3.6" fill="none" stroke="${c}" stroke-width="2.8"/>`+twinkle(x+r*.8,top-10,3);
 case 'unicorn':return P(`M${x-4} ${top+3}L${x} ${top-16}L${x+4} ${top+3}Z`,c)+P(`M${x-3} ${top-3}L${x+3} ${top-6}M${x-2} ${top-9}L${x+2} ${top-11}`,'none','opacity=".6"')+twinkle(x+7,top-12,3);
 case 'tiara':return P(`M${x-r*.7} ${top+5}L${x-r*.6} ${top-3}L${x-r*.3} ${top+1}L${x} ${top-7}L${x+r*.3} ${top+1}L${x+r*.6} ${top-3}L${x+r*.7} ${top+5}Z`,c)+C(x,top-1,2.2,c2)+CN(x-r*.45,top+2,1.3,'#f783ac')+CN(x+r*.45,top+2,1.3,'#f783ac')+twinkle(x-r*.9,top-5,2.6);
 case 'crown':return P(`M${x-r*.75} ${top+5}L${x-r*.8} ${top-9}L${x-r*.4} ${top-2}L${x} ${top-12}L${x+r*.4} ${top-2}L${x+r*.8} ${top-9}L${x+r*.75} ${top+5}Z`,c)+C(x,top,2.2,c2)+C(x-r*.48,top+1,1.6,'#4dabf7')+C(x+r*.48,top+1,1.6,'#51cf66')+twinkle(x+r,top-8,3);
 // 얼굴
 case 'blushheart':return heart(x-r*.62,y+r*.42,2.4,c)+heart(x+r*.62,y+r*.42,2.4,c);
 case 'whisker':{for(const k of [-1,1])for(const d of [-2,1])s+=`<path d="M${x+k*r*.45} ${y+r*.45}L${x+k*(r+3)} ${y+r*.45+d}" stroke="${c}" stroke-width="1" stroke-linecap="round"/>`;return s+CN(x,y+r*.33,1.6,'#ff8fab');}
 case 'glasses':return `<circle cx="${x-r*.38}" cy="${y+r*.14}" r="${r*.27}" fill="#fff" fill-opacity=".25" stroke="${c}" stroke-width="1.6"/><circle cx="${x+r*.38}" cy="${y+r*.14}" r="${r*.27}" fill="#fff" fill-opacity=".25" stroke="${c}" stroke-width="1.6"/><path d="M${x-r*.11} ${y+r*.12}L${x+r*.11} ${y+r*.12}" stroke="${c}" stroke-width="1.6"/>`;
 case 'starglass':return star(x-r*.38,y+r*.14,r*.36,c,1)+star(x+r*.38,y+r*.14,r*.36,c,1)+`<path d="M${x-r*.1} ${y+r*.1}L${x+r*.1} ${y+r*.1}" stroke="${OL}" stroke-width="1.5"/>`;
 case 'heartglass':return heart(x-r*.38,y+r*.14,r*.26,c,1)+heart(x+r*.38,y+r*.14,r*.26,c,1)+`<path d="M${x-r*.12} ${y+r*.1}L${x+r*.12} ${y+r*.1}" stroke="${OL}" stroke-width="1.5"/>`;
 case 'mono':return `<circle cx="${x+r*.38}" cy="${y+r*.14}" r="${r*.28}" fill="#fff" fill-opacity=".3" stroke="${c}" stroke-width="2"/><path d="M${x+r*.62} ${y+r*.28}Q${x+r*.75} ${y+r*.9} ${x+r*.5} ${y+r*1.3}" fill="none" stroke="${c}" stroke-width="1"/>`;
 // 목
 case 'scarf':return P(`M${x-r*.7} ${M.ty1-2}Q${x} ${M.ty1+5} ${x+r*.7} ${M.ty1-2}L${x+r*.7} ${M.ty1+3}Q${x} ${M.ty1+10} ${x-r*.7} ${M.ty1+3}Z`,c)+P(`M${x+4} ${M.ty1+4}L${x+9} ${M.ty1+18}L${x+3} ${M.ty1+18}L${x} ${M.ty1+5}Z`,c);
 case 'bowtie':return P(`M${x} ${M.ty1+2}L${x-7} ${M.ty1-2}L${x-7} ${M.ty1+6}Z`,c)+P(`M${x} ${M.ty1+2}L${x+7} ${M.ty1-2}L${x+7} ${M.ty1+6}Z`,c)+C(x,M.ty1+2,2,c);
 case 'heartneck':return `<path d="M${x-8} ${M.ty1}Q${x} ${M.ty1+8} ${x+8} ${M.ty1}" fill="none" stroke="${c2}" stroke-width="1.2"/>`+heart(x,M.ty1+8,3,c,1);
 case 'pearl':{for(let i=0;i<9;i++){const a=Math.PI*(.15+i*.0875);s+=C(x-Math.cos(a)*9,M.ty1-1+Math.sin(a)*7,1.5,c);}return s;}
 case 'medal':return P(`M${x-5} ${M.ty1-1}L${x} ${M.ty1+10}L${x+5} ${M.ty1-1}`,'none','stroke="'+c2+'" stroke-width="3"')+C(x,M.ty1+13,5,c)+star(x,M.ty1+13,2.8,'#fff3bf');
 // 등
 case 'bag':return `<rect x="${x-r*.85}" y="${M.ty1+2}" width="${r*1.7}" height="${M.ty2-M.ty1-4}" rx="5" fill="${c}" stroke="${OL}" stroke-width="1.3" transform="translate(${r*.6} 0)"/>`;
 case 'bearbag':return C(x+r*.7,M.ty1+14,r*.6,c)+C(x+r*.35,M.ty1+3,3.4,c)+C(x+r*1.05,M.ty1+3,3.4,c);
 case 'cape':return P(`M${M.tx1+3} ${M.ty1}L${M.tx2-3} ${M.ty1}L${M.tx2+10} ${M.ly1+18}Q${x} ${M.ly1+22} ${M.tx1-10} ${M.ly1+18}Z`,c);
 case 'batwing':{for(const k of [-1,1])s+=P(`M${x+k*6} ${M.ty1+8}Q${x+k*26} ${M.ty1-10} ${x+k*34} ${M.ty1+2}Q${x+k*28} ${M.ty1+6} ${x+k*29} ${M.ty1+13}Q${x+k*22} ${M.ty1+10} ${x+k*20} ${M.ty1+17}Q${x+k*14} ${M.ty1+12} ${x+k*6} ${M.ty1+16}Z`,c);return s;}
 case 'fairy':case 'butterfly':{for(const k of [-1,1])s+=E(x+k*17,M.ty1+3,13,9,c,`transform="rotate(${k*-25} ${x+k*17} ${M.ty1+3})" opacity="${it.s==='fairy'?.85:1}"`)+E(x+k*14,M.ty1+19,8,7,c2,`transform="rotate(${k*20} ${x+k*14} ${M.ty1+19})" opacity="${it.s==='fairy'?.85:1}"`)+(it.s==='butterfly'?CN(x+k*18,M.ty1+3,3,'#fff','opacity=".7"'):twinkle(x+k*22,M.ty1-2,2.5));return s;}
 case 'angel':{for(const k of [-1,1]){let d=`M${x+k*5} ${M.ty1+6}Q${x+k*20} ${M.ty1-14} ${x+k*36} ${M.ty1-6}`;d+=`Q${x+k*32} ${M.ty1} ${x+k*34} ${M.ty1+4}Q${x+k*28} ${M.ty1+6} ${x+k*29} ${M.ty1+11}Q${x+k*22} ${M.ty1+11} ${x+k*22} ${M.ty1+17}Q${x+k*14} ${M.ty1+16} ${x+k*5} ${M.ty1+18}Z`;s+=P(d,c);}return s;}
 case 'dragon':{for(const k of [-1,1])s+=P(`M${x+k*5} ${M.ty1+6}L${x+k*30} ${M.ty1-12}L${x+k*32} ${M.ty1+8}Q${x+k*26} ${M.ty1+6} ${x+k*25} ${M.ty1+14}Q${x+k*19} ${M.ty1+10} ${x+k*16} ${M.ty1+18}Q${x+k*11} ${M.ty1+13} ${x+k*5} ${M.ty1+18}Z`,c)+`<path d="M${x+k*7} ${M.ty1+10}L${x+k*29} ${M.ty1-9}" stroke="${c2}" stroke-width="1.5"/>`;return s;}
 case 'cattail':return `<path d="M${x+8} ${M.ty2-2}Q${x+28} ${M.ty2+4} ${x+26} ${M.ty2-16}Q${x+25} ${M.ty2-24} ${x+31} ${M.ty2-24}" fill="none" stroke="${OL}" stroke-width="6.4" stroke-linecap="round"/><path d="M${x+8} ${M.ty2-2}Q${x+28} ${M.ty2+4} ${x+26} ${M.ty2-16}Q${x+25} ${M.ty2-24} ${x+31} ${M.ty2-24}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
 case 'foxtail':return P(`M${x+8} ${M.ty2}Q${x+34} ${M.ty2+6} ${x+32} ${M.ty2-18}Q${x+31} ${M.ty2-28} ${x+24} ${M.ty2-24}Q${x+26} ${M.ty2-8} ${x+8} ${M.ty2-8}Z`,c)+P(`M${x+32} ${M.ty2-18}Q${x+31} ${M.ty2-28} ${x+24} ${M.ty2-24}Q${x+28} ${M.ty2-16} ${x+31} ${M.ty2-14}Z`,c2);
 // 손
 case 'lolli':return cap(rhx,rhy,rhx+2,rhy-16,1.2,'#fff')+C(rhx+2,rhy-20,6,c)+`<path d="M${rhx+2} ${rhy-20}m-3 0a3 3 0 1 1 3 3" fill="none" stroke="${c2}" stroke-width="1.6"/>`;
 case 'icecream':return P(`M${rhx-4} ${rhy-4}L${rhx+4} ${rhy-4}L${rhx} ${rhy+7}Z`,c2)+C(rhx,rhy-7,4.6,c)+CN(rhx+1,rhy-12,1.6,'#ff6b6b');
 case 'balloon':return `<path d="M${rhx} ${rhy}Q${rhx+6} ${rhy-20} ${rhx+4} ${rhy-34}" fill="none" stroke="${OL}" stroke-width=".8"/>`+E(rhx+4,rhy-42,8,10,c)+CN(rhx+1,rhy-46,2,'#fff','opacity=".6"');
 case 'heartballoon':return `<path d="M${rhx} ${rhy}Q${rhx+6} ${rhy-20} ${rhx+4} ${rhy-32}" fill="none" stroke="${OL}" stroke-width=".8"/>`+heart(rhx+4,rhy-41,8,c,1)+CN(rhx,rhy-45,1.8,'#fff','opacity=".6"');
 case 'umbrella':return cap(rhx,rhy+2,rhx,rhy-30,.9,OL)+P(`M${rhx-20} ${rhy-28}Q${rhx} ${rhy-50} ${rhx+20} ${rhy-28}Q${rhx+13} ${rhy-31} ${rhx+7} ${rhy-28}Q${rhx} ${rhy-31} ${rhx-7} ${rhy-28}Q${rhx-13} ${rhy-31} ${rhx-20} ${rhy-28}Z`,c)+PN(`M${rhx} ${rhy-45}Q${rhx-4} ${rhy-36} ${rhx-7} ${rhy-28}L${rhx+7} ${rhy-28}Q${rhx+4} ${rhy-36} ${rhx} ${rhy-45}Z`,c2,'opacity=".7"');
 case 'bouquet':return P(`M${rhx-4} ${rhy-3}L${rhx+4} ${rhy-3}L${rhx+1} ${rhy+6}L${rhx-1} ${rhy+6}Z`,c2)+C(rhx-4,rhy-7,3.4,c)+C(rhx+4,rhy-7,3.4,'#ffd43b')+C(rhx,rhy-11,3.4,'#b197fc');
 case 'wand':return cap(rhx,rhy+2,rhx+6,rhy-16,1.2,'#fff')+star(rhx+7,rhy-20,6,c,1)+twinkle(rhx+15,rhy-26,2.6,c2)+twinkle(rhx-1,rhy-25,2,c);
 // 오라 (뒤)
 case 'sparkle':{const pts=[[-34,10],[34,-4],[-28,-14],[30,40],[-32,62],[36,80],[-20,96],[24,104]];return pts.map(([a,b],i)=>twinkle(x+a,y+b,i%2?4:6,'#fcc419')+twinkle(x+a,y+b,i%2?2:3,'#fff9db')).join('');}
 case 'hearts':{const pts=[[-32,6],[33,-6],[-30,50],[34,44],[-26,96],[30,100]];return pts.map(([a,b],i)=>heart(x+a,y+b,i%2?3:4,c)).join('');}
 case 'rainbow':return `<path d="M${x-40} ${y+40}A40 46 0 0 1 ${x+40} ${y+40}" fill="none" stroke="${c}" stroke-width="9" opacity=".55"/>`+twinkle(x-34,y-6,3)+twinkle(x+36,y+2,3);
 case 'meteor':{let q='';[[-36,-10],[30,20],[-30,70]].forEach(([a,b])=>{q+=`<path d="M${x+a} ${y+b}l14 -9" stroke="${c2}" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`+star(x+a+15,y+b-10,4,c,1);});return q+twinkle(x+34,y+60,3,c)+twinkle(x-36,y+30,2.6,c);}
 // 펫
 case 'chick':{const px=M.tx1+1,py=M.ty1-5;return C(px,py,5.5,c)+CN(px+2,py-1,.9,'#2b2540')+P(`M${px+5} ${py}L${px+8} ${py+1}L${px+5} ${py+2}Z`,c2)+P(`M${px-1} ${py-5}Q${px} ${py-8} ${px+1} ${py-5}`,'none');}
 case 'kitty':{const px=M.tx1+1,py=M.ty1-6;return P(`M${px-5} ${py-3}L${px-4} ${py-9}L${px-1} ${py-5}Z`,c)+P(`M${px+5} ${py-3}L${px+4} ${py-9}L${px+1} ${py-5}Z`,c)+C(px,py,6,c)+CN(px-2,py,.9,'#2b2540')+CN(px+2,py,.9,'#2b2540')+CN(px,py+2,.8,'#ff8fab')+P(`M${px-3} ${py-5}L${px-2} ${py-3}M${px+3} ${py-5}L${px+2} ${py-3}`,'none','stroke="'+c2+'"');}
 case 'babydragon':{const px=M.tx1,py=M.ty1-7;return P(`M${px-3} ${py-2}L${px-11} ${py-9}L${px-9} ${py+1}Z`,c2)+P(`M${px+3} ${py-2}L${px+11} ${py-9}L${px+9} ${py+1}Z`,c2)+C(px,py,6.5,c)+P(`M${px-2} ${py-6}L${px-1} ${py-10}L${px} ${py-6}M${px+1} ${py-6}L${px+2} ${py-10}L${px+3} ${py-6}`,c2)+CN(px-2.2,py-.5,1,'#2b2540')+CN(px+2.2,py-.5,1,'#2b2540')+CN(px,py+3,1.6,'#d3f9d8')+twinkle(px+9,py-9,2.2,'#ffe066');}
 }return s;}
function fxSparkle(M,it,cat){const {hx:x,hy:y,hr:r}=M;const pos={hair:[[x-r-4,y-r],[x+r+5,y-r*.6],[x+r*.6,y-r-5]],top:[[M.tx1-2,M.ty1+8],[M.tx2+3,M.ty1+20]],bottom:[[M.legs[0][0]-5,M.ly1+6],[M.legs[1][1]+5,M.ly1+14]],shoes:[[M.legs[0][0]-5,M.ly2-3],[M.legs[1][1]+6,M.ly2]],acc:[]}[cat]||[];
 return pos.map(([a,b],i)=>twinkle(a,b,i%2?3.4:4.6,'#fcc419')+twinkle(a,b,i%2?1.8:2.6,'#fff9db')).join('');}

// ---------- 전체 그리기 ----------
function render(st,opts={}){const uid=++UID;OL='none';st=st||defaultState();const eq=st.eq||{};
 const M={...BODIES[st.body]||BODIES.round};const it=k=>BY[eq[k]]||null;
 const hair=it('hair'),top=it('top'),bot=it('bottom'),sh=it('shoes');const A_={};for(const sl in (eq.acc||{})){const a=BY[eq.acc[sl]];if(a)A_[sl]=a;}
 let s='';
 if(A_.aura)s+=acc(M,A_.aura,uid);
 if(A_.back)s+=acc(M,A_.back,uid);
 if(A_.tail)s+=acc(M,A_.tail,uid);
 if(hair)s+=hairBack(M,hair);
 s+=legs(M);
 OL=SEAM;if(bot&&bot.s!=='overall')s+=bottom(M,bot,uid);
 if(sh)s+=shoes(M,sh,bot);OL='none';
 OL='none';s+=armsSkin(M);OL=SEAM;s+=arms(M,top)+sleevesHanbok(M,top);
 if(!top)s+=P(torsoPath(M),SKIN);
 if(top)s+=torsoTop(M,top,uid);
 if(bot&&bot.s==='overall')s+=bottom(M,bot,uid);
 OL='none';s+=handsSkin(M);
 if(top&&(top.s==='dress'||top.s==='princess')&&sh)s+=''; // 신발은 이미 그려짐
 if(A_.neck)s+=acc(M,A_.neck,uid);
 // 머리
 s+=blk(M.hx-M.hr,M.hy-M.hh,2*M.hr,2*M.hh,SKIN,4);
 s+=face(M,eq);
 if(A_.face&&A_.face.s!=='glasses'&&A_.face.s!=='mono')s+=acc(M,A_.face,uid);
 if(hair)s+=hairFront(M,hair);
 if(A_.face&&(A_.face.s==='glasses'||A_.face.s==='mono'))s+=acc(M,A_.face,uid);
 if(A_.hat)s+=acc(M,A_.hat,uid);
 if(A_.hand)s+=acc(M,A_.hand,uid);
 if(A_.pet)s+=acc(M,A_.pet,uid);
 // 반짝이
 for(const [k,v] of [['hair',hair],['top',top],['bottom',bot],['shoes',sh]])if(v&&v.fx)s+=fxSparkle(M,v,k);
 const vb=opts.head?`${M.hx-M.hr-7} ${M.hy-M.hh-9} ${2*M.hr+14} ${2*M.hh+15}`:'8 -10 84 112';
 return `<svg viewBox="${vb}" ${opts.size?`width="${opts.size}" height="${opts.size}"`:''} class="tav" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;}

window.TAV={BODIES,ITEMS,BY,CATS,SLOTS,FREE,render,defaultState,rarity,defsSvg};
})();
