// ===== SRH Dashboard State =====
const DEFAULT_STATE = {
  points: 1240,
  itemsRecycled: 186,
  kgRecycled: 34,
  streak: 7,
  materials: {
    pet:    {name:'PET Bottles',  pct:38, color:'#3b8f3a'},
    glass:  {name:'Glass',        pct:22, color:'#52b03a'},
    paper:  {name:'Paper',        pct:18, color:'#7ed47a'},
    alu:    {name:'Aluminium',    pct:15, color:'#c0a062'},
    mixed:  {name:'Mixed Plastic',pct:7,  color:'#5d6b5f'},
  },
  deposits: [
    {date:'Today · 09:14',  mat:'PET Bottle',     pts:2, color:'#3b8f3a', icon:'PET'},
    {date:'Today · 08:02',  mat:'Aluminium Can',  pts:4, color:'#c0a062', icon:'AL'},
    {date:'Yesterday',      mat:'Glass Bottle',   pts:3, color:'#52b03a', icon:'GL'},
    {date:'Yesterday',      mat:'Newspaper',      pts:5, color:'#7ed47a', icon:'PA'},
    {date:'2 days ago',     mat:'PET Bottle',     pts:2, color:'#3b8f3a', icon:'PET'},
    {date:'2 days ago',     mat:'Mixed Plastic',  pts:1, color:'#5d6b5f', icon:'MX'},
    {date:'3 days ago',     mat:'Glass Jar',      pts:3, color:'#52b03a', icon:'GL'},
  ],
};

let state = loadState();
function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem('srh_state'));
    return s || structuredClone(DEFAULT_STATE);
  }catch(e){ return structuredClone(DEFAULT_STATE); }
}
function saveState(){ localStorage.setItem('srh_state', JSON.stringify(state)); }
function resetDemo(){ localStorage.removeItem('srh_state'); state = structuredClone(DEFAULT_STATE); renderAll(); toast('🔄','Demo reset'); }

// ===== Tiers =====
const TIERS = [
  {key:'starter', emoji:'🥉', name:'Green Starter',  min:0,  max:20, benefits:['Points to cash & vouchers','Digital recycling certificate','Leaderboard entry','Community newsletter']},
  {key:'champ',   emoji:'🥈', name:'Green Champion', min:20, max:75, benefits:['25% bonus points','Transport credits','Airtime & data rewards','Monthly challenges','Priority hub access'], popular:true},
  {key:'legend',  emoji:'🥇', name:'Green Legend',   min:75, max:Infinity, benefits:['50% bonus points','Direct cash withdrawals','Premium partner brand rewards','Tax benefit documentation','Community leadership role','Annual recognition award']},
];
function currentTier(){ return TIERS.find(t=>state.kgRecycled>=t.min && state.kgRecycled<t.max) || TIERS[0]; }
function nextTier(){ const i = TIERS.indexOf(currentTier()); return TIERS[i+1] || TIERS[i]; }

// ===== Rewards =====
const REWARDS = [
  {emoji:'💰', name:'R50 Cash',           cost:500},
  {emoji:'📱', name:'1GB Mobile Data',    cost:300},
  {emoji:'🛒', name:'R100 Grocery Voucher',cost:800},
  {emoji:'🚕', name:'R30 Transport Credit',cost:250},
  {emoji:'📞', name:'R25 Airtime',        cost:200},
  {emoji:'🎓', name:'School Stationery',  cost:600},
];

// ===== Simulator items =====
const SIM_ITEMS = [
  {id:'pet',   emoji:'🧴', label:'Plastic Bottle', pts:2, mat:'PET Bottle',    color:'#3b8f3a', kg:0.05, ico:'PET'},
  {id:'glass', emoji:'🍾', label:'Glass Bottle',   pts:3, mat:'Glass Bottle',  color:'#52b03a', kg:0.4,  ico:'GL'},
  {id:'paper', emoji:'📰', label:'Newspaper',      pts:5, mat:'Newspaper',     color:'#7ed47a', kg:0.3,  ico:'PA'},
  {id:'can',   emoji:'🥫', label:'Aluminium Can',  pts:4, mat:'Aluminium Can', color:'#c0a062', kg:0.02, ico:'AL'},
];

// ===== Hubs =====
const HUBS = [
  {name:'Bree Taxi Rank',     status:'active', fill:62, x:18, y:42, mats:'PET, Glass, Paper, Al'},
  {name:'Sandton City Mall',  status:'active', fill:34, x:42, y:22, mats:'All materials'},
  {name:'Soweto Market',      status:'full',   fill:96, x:30, y:68, mats:'PET, Paper'},
  {name:'Wits University',    status:'active', fill:48, x:58, y:36, mats:'All materials'},
  {name:'Cape Town Station',  status:'maint',  fill:12, x:78, y:58, mats:'Maintenance'},
  {name:'Pretoria CBD',       status:'active', fill:71, x:66, y:14, mats:'PET, Glass, Al'},
];

// ===== Renderers =====
let sessionBinPoints = 0;
function renderAll(){
  // tier
  const t = currentTier(), n = nextTier();
  document.getElementById('tierEmoji').textContent = t.emoji;
  document.getElementById('tierName').textContent = t.name;
  document.getElementById('nextTier').textContent = n.name;
  // ring
  const max = isFinite(t.max) ? t.max : t.min + 50;
  const target = isFinite(n.min) ? n.min : max;
  const kg = state.kgRecycled;
  document.getElementById('ringKg').textContent = kg.toFixed(0);
  document.getElementById('ringTarget').textContent = target;
  document.getElementById('kgRemaining').textContent = Math.max(0,(target-kg)).toFixed(0);
  const circ = 2*Math.PI*76;
  const pct = Math.min(1, kg/target);
  document.getElementById('ringFg').setAttribute('stroke-dashoffset', circ*(1-pct));

  // quick stats
  animateNum('pointsBig', state.points);
  document.querySelector('[data-target="points"]').textContent = state.points.toLocaleString();
  document.getElementById('itemsCount').textContent = state.itemsRecycled;
  document.getElementById('co2').textContent = (state.kgRecycled*1.5).toFixed(0);
  document.getElementById('streak').textContent = state.streak;
  document.getElementById('streakDays').textContent = state.streak;
  document.getElementById('zarVal').textContent = Math.floor(state.points/10);

  // materials
  const ml = document.getElementById('materialList');
  ml.innerHTML = Object.values(state.materials).map(m=>`
    <div class="mat">
      <div class="dot" style="background:${m.color}"></div>
      <div class="name">${m.name}</div>
      <div class="bar"><span style="width:${m.pct}%;background:${m.color}"></span></div>
      <div class="pct">${m.pct}%</div>
    </div>`).join('');

  // rewards
  const rg = document.getElementById('rewardsGrid');
  rg.innerHTML = REWARDS.map((r,i)=>`
    <button class="reward" data-i="${i}" ${state.points<r.cost?'disabled':''}>
      <div class="emoji">${r.emoji}</div>
      <div class="name">${r.name}</div>
      <div class="cost">${r.cost} pts</div>
    </button>`).join('');
  rg.querySelectorAll('.reward').forEach(b=>b.addEventListener('click',()=>redeem(+b.dataset.i)));

  // deposits
  const dl = document.getElementById('depositsList');
  dl.innerHTML = state.deposits.slice(0,12).map(d=>`
    <div class="deposit">
      <div class="dicon" style="background:${d.color}">${d.icon}</div>
      <div class="info"><div class="t">${d.mat}</div><div class="d">${d.date}</div></div>
      <div class="pts">+${d.pts}</div>
    </div>`).join('');

  // tiers
  document.getElementById('tiersContainer').innerHTML = TIERS.map(tt=>`
    <div class="tier-card ${tt.key===t.key?'current':''}">
      ${tt.popular?'<div class="tier-pop">MOST POPULAR</div>':''}
      <div class="tier-emoji">${tt.emoji}</div>
      <div class="tname">${tt.name}</div>
      <div class="trange">${tt.min}${isFinite(tt.max)?'–'+tt.max:'+'} kg recycled</div>
      <ul>${tt.benefits.map(b=>`<li>${b}</li>`).join('')}</ul>
    </div>`).join('');

  // leaderboard
  const lb = [
    {n:'Thandi M.',  kg:142, t:'🥇'},
    {n:'Sipho K.',   kg:118, t:'🥇'},
    {n:'Lerato D.',  kg:96,  t:'🥇'},
    {n:'Pieter v.W.',kg:81,  t:'🥇'},
    {n:'Joshua H.',  kg:state.kgRecycled, t:currentTier().emoji, you:true},
    {n:'Naledi P.',  kg:31,  t:'🥈'},
    {n:'Ahmed S.',   kg:28,  t:'🥈'},
    {n:'Zanele B.',  kg:22,  t:'🥈'},
    {n:'Karabo M.',  kg:14,  t:'🥉'},
    {n:'Riaan v.d.M.',kg:9,  t:'🥉'},
  ].sort((a,b)=>b.kg-a.kg);
  document.getElementById('leaderboard').innerHTML = lb.map((r,i)=>`
    <div class="lb-row ${r.you?'you':''}">
      <div class="lb-rank">#${i+1}</div>
      <div class="lb-name">${r.n}${r.you?' (You)':''}</div>
      <div class="lb-kg">${r.kg} kg</div>
      <div class="lb-tier">${r.t}</div>
    </div>`).join('');

  // map
  const map = document.getElementById('map');
  map.querySelectorAll('.pin').forEach(p=>p.remove());
  HUBS.forEach(h=>{
    const cls = h.status==='full'?'full':h.status==='maint'?'maint':'';
    const p = document.createElement('div');
    p.className = `pin ${cls}`;
    p.style.left = h.x+'%'; p.style.top = h.y+'%';
    p.innerHTML = `<div class="marker"><span>📍</span></div>
      <div class="pin-info">
        <div class="pname">${h.name}</div>
        <div class="pstatus">${h.status==='full'?'⚠ Full':h.status==='maint'?'🔧 Maintenance':'✅ Active'} · ${h.mats}</div>
        <div class="pbar"><span style="width:${h.fill}%"></span></div>
        <div style="font-size:.72rem;color:var(--muted)">${h.fill}% full</div>
      </div>`;
    map.appendChild(p);
  });

  // simulator items
  const si = document.getElementById('simItems');
  si.innerHTML = SIM_ITEMS.map(it=>`
    <div class="sim-item" draggable="true" data-id="${it.id}">
      <span class="emoji">${it.emoji}</span>
      <div class="label">${it.label}</div>
      <div class="pts">+${it.pts} pts</div>
    </div>`).join('');
  si.querySelectorAll('.sim-item').forEach(el=>{
    el.addEventListener('dragstart',e=>{ e.dataTransfer.setData('id',el.dataset.id); });
    el.addEventListener('click',()=>depositItem(el.dataset.id, el));
  });
  const bin = document.getElementById('bin');
  bin.ondragover = e=>{ e.preventDefault(); bin.classList.add('over'); };
  bin.ondragleave = ()=> bin.classList.remove('over');
  bin.ondrop = e=>{
    e.preventDefault(); bin.classList.remove('over');
    const id = e.dataTransfer.getData('id');
    const el = document.querySelector(`.sim-item[data-id="${id}"]`);
    depositItem(id, el);
  };

  saveState();
}

function depositItem(id, sourceEl){
  const it = SIM_ITEMS.find(x=>x.id===id);
  if(!it) return;
  // fly animation
  if(sourceEl){
    const r = sourceEl.getBoundingClientRect();
    const bin = document.getElementById('bin').getBoundingClientRect();
    const fly = document.createElement('div');
    fly.className = 'flying'; fly.textContent = it.emoji;
    fly.style.left = r.left+r.width/2-16+'px';
    fly.style.top  = r.top+r.height/2-16+'px';
    document.body.appendChild(fly);
    requestAnimationFrame(()=>{
      fly.style.left = bin.left+bin.width/2-16+'px';
      fly.style.top  = bin.top+bin.height/2-16+'px';
      fly.style.transform = 'scale(.2) rotate(360deg)';
      fly.style.opacity = '.2';
    });
    setTimeout(()=>fly.remove(),900);
  }
  setTimeout(()=>{
    state.points += it.pts;
    state.itemsRecycled += 1;
    state.kgRecycled = +(state.kgRecycled + it.kg).toFixed(2);
    sessionBinPoints += it.pts;
    document.getElementById('binPoints').textContent = sessionBinPoints;
    state.deposits.unshift({date:'Just now', mat:it.mat, pts:it.pts, color:it.color, icon:it.ico});
    renderAll();
    toast(it.emoji, `+${it.pts} points · ${it.mat}`);
  },650);
}

function redeem(i){
  const r = REWARDS[i];
  if(state.points < r.cost) return;
  state.points -= r.cost;
  renderAll();
  toast(r.emoji, `Redeemed: ${r.name}`);
}

// utility
function animateNum(id, to){
  const el = document.getElementById(id);
  const from = parseInt(el.textContent.replace(/,/g,''))||0;
  const dur = 900, start = performance.now();
  const tick = t=>{
    const p = Math.min(1,(t-start)/dur);
    const e = 1-Math.pow(1-p,3);
    el.textContent = Math.floor(from+(to-from)*e).toLocaleString();
    if(p<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

let toastTimer;
function toast(emoji, msg){
  const t = document.getElementById('toast');
  t.querySelector('.emoji').textContent = emoji;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'),2600);
}

renderAll();
