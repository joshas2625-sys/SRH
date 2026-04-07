// ===== Reveal on scroll =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('in'), i*60);
      io.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll('.count[data-to]');
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.to, dur = 1600, start = performance.now();
    const tick = (t)=>{
      const p = Math.min(1,(t-start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.floor(to*eased).toLocaleString();
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cio.unobserve(el);
  });
},{threshold:.4});
counters.forEach(c=>cio.observe(c));

// ===== Theme toggle =====
const savedTheme = localStorage.getItem('srh_theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('srh_theme', next);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}
window.toggleTheme = toggleTheme;

// ===== Language switcher =====
const I18N = {
  en: {
    home:'Home', how:'How It Works', features:'Features', rewards:'Rewards', partners:'Partners', about:'About', faq:'FAQ',
    open_dash:'Open Dashboard →',
    hero_title_a:'Recycle.', hero_title_b:'Earn.', hero_title_c:'Repeat.',
    hero_sub:'Smart bins in your community that reward you for every item you recycle. Turn waste into real value — cash, airtime, groceries and more.',
    cta_start:'Start Recycling →', cta_how:'See How It Works',
    welcome:'Welcome back',
  },
  zu: {
    home:'Ikhaya', how:'Kusebenza Kanjani', features:'Izici', rewards:'Imivuzo', partners:'Ozakwethu', about:'Mayelana', faq:'Imibuzo',
    open_dash:'Vula i-Dashboard →',
    hero_title_a:'Yenza Recycle.', hero_title_b:'Hola.', hero_title_c:'Phinda.',
    hero_sub:'Amabhini ahlakaniphile emphakathini wakho akuvuzayo ngempahla ngayinye oyirisayikhilayo. Phendula imfucuza ibe yimali, i-airtime, izinto zokudla nokunye.',
    cta_start:'Qala Manje →', cta_how:'Bona Ukuthi Kusebenza Kanjani',
    welcome:'Sawubona futhi',
  },
  af: {
    home:'Tuis', how:'Hoe Dit Werk', features:'Kenmerke', rewards:'Belonings', partners:'Vennote', about:'Oor Ons', faq:'Vrae',
    open_dash:'Open Dashboard →',
    hero_title_a:'Herwin.', hero_title_b:'Verdien.', hero_title_c:'Herhaal.',
    hero_sub:'Slim asblikke in jou gemeenskap wat jou beloon vir elke item wat jy herwin. Verander afval in regte waarde — kontant, lugtyd, kruideniersware en meer.',
    cta_start:'Begin Herwin →', cta_how:'Sien Hoe Dit Werk',
    welcome:'Welkom terug',
  },
  st: {
    home:'Lehae', how:'Ho Sebetsa', features:'Dikarolo', rewards:'Meputso', partners:'Balekane', about:'Ka Rona', faq:'Dipotso',
    open_dash:'Bula Dashboard →',
    hero_title_a:'Recycle.', hero_title_b:'Fumana.', hero_title_c:'Pheta.',
    hero_sub:'Diliboro tse bohlale sebakeng sa heno tse o putsang bakeng sa ntho ka nngwe eo o e recycle-ang. Fetola litšila ho ba boleng — chelete, airtime, lijo le tse ling.',
    cta_start:'Qala Joale →', cta_how:'Bona Hore na ho Sebetsa Joang',
    welcome:'Re a u amohela',
  },
};
function setLang(lang){
  localStorage.setItem('srh_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.dataset.i18n;
    if(I18N[lang] && I18N[lang][k]) el.textContent = I18N[lang][k];
  });
  const btn = document.getElementById('langBtn');
  if(btn) btn.textContent = lang.toUpperCase();
}
function cycleLang(){
  const langs = ['en','zu','af','st'];
  const cur = localStorage.getItem('srh_lang') || 'en';
  setLang(langs[(langs.indexOf(cur)+1) % langs.length]);
}
window.cycleLang = cycleLang;

// ===== Inject tools (theme + lang) into nav =====
function injectTools(){
  const nav = document.querySelector('.nav-links');
  if(!nav || document.getElementById('themeBtn')) return;
  const wrap = document.createElement('div');
  wrap.className = 'tools';
  const theme = localStorage.getItem('srh_theme') || 'light';
  const lang = localStorage.getItem('srh_lang') || 'en';
  wrap.innerHTML = `
    <button class="tool-btn lang-btn" id="langBtn" onclick="cycleLang()" title="Language">${lang.toUpperCase()}</button>
    <button class="tool-btn" id="themeBtn" onclick="toggleTheme()" title="Theme">${theme==='dark'?'☀️':'🌙'}</button>`;
  nav.insertBefore(wrap, nav.firstChild);
  setLang(lang);
}
injectTools();
