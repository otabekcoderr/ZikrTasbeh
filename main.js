const DUAS = [
  {label:'Subhanalloh',                             ar:'سُبْحَانَ اللَّهِ',         weight:1},
  {label:'Alhamdulillah',                            ar:'الْحَمْدُ لِلَّهِ',          weight:1},
  {label:'Allohu Akbar',                             ar:'اللَّهُ أَكْبَرُ',           weight:1},
  {label:'La ilaha illalloh',                        ar:'لَا إِلَٰهَ إِلَّا اللَّهُ', weight:5},
  {label:'Astaghfirulloh',                           ar:'أَسْتَغْفِرُ اللَّهَ',       weight:2},
  {label:'Subhanallohi va bihamdihi',                ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', weight:3},
  {label:'Subhanallohil azim',                       ar:'سُبْحَانَ اللَّهِ الْعَظِيمِ',   weight:3},
  {label:'La havla va la quvvata illa billah',        ar:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', weight:3},
  {label:'Allohumma solli ala Muhammad',             ar:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',  weight:4},
  {label:'Allohumma barik ala Muhammad',             ar:'اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ', weight:4},
  {label:'Subhanallohi wa bihamdihi subhanallohil azim', ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', weight:4},
  {label:'Allohu la ilaha illa huwal hayyul qayyum',  ar:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', weight:5},
  {label:"Hasbunalloh va ne'mal vakil",               ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', weight:3},
  {label:'Allohummaghfirli',                          ar:'اللَّهُمَّ اغْفِرْ لِي',    weight:2},
  {label:"La ilaha illalloh wahdahu la sharika lah",  ar:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', weight:5},
  {label:'Robbighfirli wa tub alayya',                ar:'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ', weight:3},
  {label:"Allohumma a'inni ala zikrika",              ar:'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ', weight:3},
  {label:'Subhana robbiyal azim',                     ar:'سُبْحَانَ رَبِّيَ الْعَظِيمِ',  weight:2},
  {label:'Subhana robbiyal a\'la',                    ar:'سُبْحَانَ رَبِّيَ الْأَعْلَى',   weight:2},
  {label:"O'zim kiritaman →",                         ar:'',                             weight:1, custom:true},
];

const LIMITS = [
  {label:'3',value:3},{label:'5',value:5},{label:'7',value:7},
  {label:'10',value:10},{label:'11',value:11},{label:'21',value:21},
  {label:'33',value:33},{label:'40',value:40},{label:'66',value:66},
  {label:'99',value:99},{label:'100',value:100},{label:'313',value:313},
  {label:'500',value:500},{label:'1000',value:1000},
];

const LEVELS=[
  {min:0,   name:'Yangi boshlagan',emoji:'🌱'},
  {min:50,  name:'Izlovchi',       emoji:'🌿'},
  {min:150, name:'Doimiy',         emoji:'🍃'},
  {min:400, name:'Mustahkam',      emoji:'✨'},
  {min:900, name:'Fozil',          emoji:'🌟'},
  {min:2000,name:'Komil',          emoji:'💎'},
];

const BUCKET_SIZES={
  3:[52,65],5:[54,68],7:[58,72],10:[62,78],11:[62,78],21:[70,88],
  33:[82,104],40:[86,108],66:[94,118],99:[108,136],100:[110,138],
  313:[118,146],500:[118,146],1000:[118,146]
};

let count=0, limit=33, duo=DUAS[0], isAnimating=false;
let totalPoints=parseInt(localStorage.getItem('tp')||'0');

/* ══ ONBOARDING ══ */
let obI=0;
function obNext(){
  if(++obI>=4){
    document.getElementById('onboard').style.display='none';
    showSelect();
    localStorage.setItem('tv','1');
    return;
  }
  document.querySelectorAll('.ob-slide').forEach((s,i)=>s.classList.toggle('active',i===obI));
  document.querySelectorAll('.ob-dot').forEach((d,i)=>d.classList.toggle('active',i===obI));
  if(obI===3)document.getElementById('obBtn').textContent='Boshlash ✓';
}
function showSelect(){
  document.getElementById('screen-select').style.display='flex';
  setTimeout(()=>{duoPicker.init();limitPicker.init();},80);
}
if(localStorage.getItem('tv')){
  document.getElementById('onboard').style.display='none';
  showSelect();
}

/* ══ PICKER — fixed ══
   Container h=156px. Item h=52px. 1 pad top + 1 pad bottom.
   Center item index i → scrollTop = i*52.
   Must call init() after element is visible.
*/
function makePicker(elId, items, defIdx){
  const IH=52;
  let sel=defIdx, isDrag=false, vel=0, lY=0, lT=0, raf=null;
  const el=document.getElementById(elId);

  // Build
  const pad=()=>{const d=document.createElement('div');d.className='picker-item';d.dataset.p='1';return d;};
  el.appendChild(pad());
  items.forEach((item,i)=>{
    const d=document.createElement('div');
    d.className='picker-item'+(i===defIdx?' selected':'');
    d.textContent=typeof item==='object'?item.label:item;
    el.appendChild(d);
  });
  el.appendChild(pad());

  function mark(){
    let k=0;
    el.querySelectorAll('.picker-item').forEach(d=>{
      if(d.dataset.p)return;
      d.classList.toggle('selected',k===sel);
      k++;
    });
  }
  function snap(){
    sel=Math.max(0,Math.min(Math.round(el.scrollTop/IH),items.length-1));
    mark();
    el.scrollTo({top:sel*IH,behavior:'smooth'});
  }
  function momentum(){
    cancelAnimationFrame(raf);
    function step(){
      if(Math.abs(vel)<0.6){snap();return;}
      el.scrollTop+=vel; vel*=0.91;
      sel=Math.max(0,Math.min(Math.round(el.scrollTop/IH),items.length-1));
      mark(); raf=requestAnimationFrame(step);
    }
    raf=requestAnimationFrame(step);
  }

  // touch
  el.addEventListener('touchstart',e=>{cancelAnimationFrame(raf);isDrag=true;vel=0;lY=e.touches[0].clientY;lT=Date.now();},{passive:true});
  el.addEventListener('touchmove',e=>{
    if(!isDrag)return;e.preventDefault();
    const now=Date.now(),y=e.touches[0].clientY;
    vel=(lY-y)/Math.max(now-lT,1)*16;
    el.scrollTop+=lY-y; lY=y; lT=now;
    sel=Math.max(0,Math.min(Math.round(el.scrollTop/IH),items.length-1)); mark();
  },{passive:false});
  el.addEventListener('touchend',()=>{isDrag=false;momentum();});
  // mouse
  el.addEventListener('mousedown',e=>{cancelAnimationFrame(raf);isDrag=true;vel=0;lY=e.clientY;lT=Date.now();e.preventDefault();});
  window.addEventListener('mousemove',e=>{
    if(!isDrag)return;
    const now=Date.now();
    vel=(lY-e.clientY)/Math.max(now-lT,1)*16;
    el.scrollTop+=lY-e.clientY; lY=e.clientY; lT=now;
    sel=Math.max(0,Math.min(Math.round(el.scrollTop/IH),items.length-1)); mark();
  });
  window.addEventListener('mouseup',()=>{if(isDrag){isDrag=false;momentum();}});

  return {
    getValue:()=>items[sel],
    getIndex:()=>sel,
    init(){el.scrollTop=sel*IH; mark();}
  };
}

const duoPicker  =makePicker('duoPicker',  DUAS,  0);
const limitPicker=makePicker('limitPicker',LIMITS,6); // default=33 (index 6)

/* ══ LEVEL ══ */
function getLevel(p){let v=0;for(let i=LEVELS.length-1;i>=0;i--){if(p>=LEVELS[i].min){v=i;break;}}return{index:v,...LEVELS[v]};}
function updateLevelUI(){const lv=getLevel(totalPoints);document.getElementById('levelText').textContent=(lv.index+1)+'-daraja';document.getElementById('levelBadge').querySelector('.star').textContent=lv.emoji;}
function addPoints(p){
  const o=getLevel(totalPoints).index;
  totalPoints+=p;localStorage.setItem('tp',totalPoints);
  const n=getLevel(totalPoints).index;
  updateLevelUI();if(n>o)showLevelUp(n);
}
function showLevelUp(idx){
  const lv=LEVELS[idx],el=document.createElement('div');
  el.className='level-up-popup';
  el.innerHTML=`<div class="big">${lv.emoji}</div><h2>Yangi daraja!</h2><p>${idx+1}-daraja — <b>${lv.name}</b></p>`;
  document.body.appendChild(el);
  navigator.vibrate&&navigator.vibrate([100,50,100,50,200]);
  setTimeout(()=>{el.style.transition='opacity .5s,transform .5s';el.style.opacity='0';el.style.transform='translate(-50%,-50%) scale(.85)';setTimeout(()=>el.remove(),500);},2200);
}
updateLevelUI();

/* ══ NAV ══ */
function startTasbeh(){
  const picked=duoPicker.getValue();
  const custom=document.getElementById('customDua').value.trim();

  if(picked.custom && !custom){
    document.getElementById('customDua').focus();
    document.getElementById('customDua').style.boxShadow='0 3px 12px var(--shadow),0 0 0 2px rgba(200,60,60,.3)';
    return;
  }
  document.getElementById('customDua').style.boxShadow='';

  duo = picked.custom
    ? {label:custom, ar:'', weight:2}
    : picked;

  const lObj=limitPicker.getValue();
  limit=lObj.value;

  document.getElementById('mainDuoName').textContent=duo.label;
  updateLevelUI();

  const sz=BUCKET_SIZES[limit]||[108,136];
  const b=document.getElementById('bucket');
  b.style.width=sz[0]+'px'; b.style.height=sz[1]+'px';
  b.style.transform='translateX(0)'; b.style.opacity='1';
  count=0; isAnimating=false;
  document.getElementById('count').textContent='0';
  document.getElementById('bucketFill').style.height='0%';
  document.getElementById('bucketLabel').textContent='0 / '+limit;

  document.getElementById('screen-select').style.display='none';
  document.getElementById('screen-main').style.display='flex';
}

function goBack(){
  document.getElementById('screen-main').style.display='none';
  showSelect();
  count=0; isAnimating=false;
}

/* ══ TASBEH ══ */
function increment(){
  if(isAnimating)return;
  count++;
  navigator.vibrate&&navigator.vibrate(35);
  const pct=(count/limit)*100;
  document.getElementById('bucketFill').style.height=pct+'%';
  document.getElementById('bucketLabel').textContent=count+' / '+limit;
  document.getElementById('count').textContent=count;
  spawnBubble(); // faqat 1 ta
  if(count>=limit){
    isAnimating=true;
    addPoints(limit*duo.weight);
    navigator.vibrate&&navigator.vibrate([80,50,80]);
    setTimeout(slideBucket,700);
  }
}

function slideBucket(){
  const b=document.getElementById('bucket');
  b.style.transition='transform .4s ease-in,opacity .4s ease';
  b.style.transform='translateX(240px)'; b.style.opacity='0';
  setTimeout(()=>{
    count=0;
    document.getElementById('count').textContent='0';
    document.getElementById('bucketFill').style.height='0%';
    document.getElementById('bucketLabel').textContent='0 / '+limit;
    b.style.transition='none'; b.style.transform='translateX(-240px)'; b.style.opacity='0';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      b.style.transition='transform .4s ease-out,opacity .4s ease';
      b.style.transform='translateX(0)'; b.style.opacity='1';
      setTimeout(()=>{isAnimating=false;},410);
    }));
  },410);
}

function reset(){
  count=0; isAnimating=false;
  document.getElementById('count').textContent='0';
  document.getElementById('bucketFill').style.height='0%';
  document.getElementById('bucketLabel').textContent='0 / '+limit;
  const b=document.getElementById('bucket');
  b.style.transition='none'; b.style.transform='translateX(0)'; b.style.opacity='1';
}

/* ══ 1 BUBBLE → BUCKET ══ */
function spawnBubble(){
  const btn=document.getElementById('mainBtn');
  const bucket=document.getElementById('bucket');
  const bR=btn.getBoundingClientRect();
  const buR=bucket.getBoundingClientRect();

  // Tugma ustida tasodifiy nuqtadan boshlanadi
  const angle=Math.random()*Math.PI*2;
  const r=Math.random()*bR.width*0.32;
  const sx=bR.left+bR.width/2 + Math.cos(angle)*r;
  const sy=bR.top+bR.height/2 + Math.sin(angle)*r;

  // Chelak markazi — maqsad
  const ex=buR.left+buR.width/2;
  const ey=buR.top+buR.height/2;

  const size=14+Math.random()*16; // 14–30px

  const el=document.createElement('div');
  el.className='bubble';
  el.style.cssText=`width:${size}px;height:${size}px;left:${sx-size/2}px;top:${sy-size/2}px;opacity:0;`;
  document.body.appendChild(el);

  const DUR=900+Math.random()*400; // 0.9–1.3s — sekin
  const t0=performance.now();

  // Arc: yuqoriga ko'tarilip keyin chelakka tushadi
  const midX=(sx+ex)/2 + (Math.random()-0.5)*60;
  const midY=Math.min(sy,ey) - 60 - Math.random()*50;

  (function frame(now){
    const t=Math.min((now-t0)/DUR,1);
    // ease in-out
    const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

    // Bezier-style: sx→midX→ex, sy→midY→ey
    const cx=quadBez(sx,midX,ex,e);
    const cy=quadBez(sy,midY,ey,e);
    const sc=t<.3?1+t*.4:1.12-(t-.3)*.35;
    let op;
    if(t<.12) op=t/.12;
    else if(t>.78) op=1-(t-.78)/.22;
    else op=1;

    el.style.left=(cx-size/2)+'px';
    el.style.top=(cy-size/2)+'px';
    el.style.opacity=Math.max(0,op);
    el.style.transform=`scale(${Math.max(.05,sc)})`;

    if(t<1) requestAnimationFrame(frame);
    else el.remove();
  })(performance.now());
}

function quadBez(a,b,c,t){
  return (1-t)*(1-t)*a + 2*(1-t)*t*b + t*t*c;
   }
