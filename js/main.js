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
const LANGS = [
  {code:'en', label:'English',  flag:'🇬🇧'},
  {code:'zu', label:'isiZulu',   flag:'🇿🇦'},
  {code:'xh', label:'isiXhosa',  flag:'🇿🇦'},
  {code:'af', label:'Afrikaans', flag:'🇿🇦'},
  {code:'st', label:'Sesotho',   flag:'🇱🇸'},
  {code:'tn', label:'Setswana',  flag:'🇧🇼'},
  {code:'ts', label:'Xitsonga',  flag:'🇿🇦'},
  {code:'ve', label:'Tshivenda', flag:'🇿🇦'},
  {code:'nr', label:'isiNdebele',flag:'🇿🇦'},
  {code:'ss', label:'siSwati',   flag:'🇸🇿'},
  {code:'nso',label:'Sepedi',    flag:'🇿🇦'},
  {code:'fr', label:'Français',  flag:'🇫🇷'},
  {code:'pt', label:'Português', flag:'🇵🇹'},
];

const I18N = {
  en: {
    home:'Home', how:'How It Works', features:'Features', rewards:'Rewards', partners:'Partners', about:'About', faq:'FAQ',
    open_dash:'Open Dashboard →',
    hero_title_a:'Recycle.', hero_title_b:'Earn.', hero_title_c:'Repeat.',
    hero_sub:'Smart bins in your community that reward you for every item you recycle. Turn waste into real value — cash, airtime, groceries and more.',
    cta_start:'Start Recycling →', cta_how:'See How It Works',
    welcome:'Welcome back', language:'Language',
  },
  zu: {
    home:'Ikhaya', how:'Kusebenza Kanjani', features:'Izici', rewards:'Imivuzo', partners:'Ozakwethu', about:'Mayelana', faq:'Imibuzo',
    open_dash:'Vula i-Dashboard →',
    hero_title_a:'Yenza Recycle.', hero_title_b:'Hola.', hero_title_c:'Phinda.',
    hero_sub:'Amabhini ahlakaniphile emphakathini wakho akuvuzayo ngempahla ngayinye oyirisayikhilayo. Phendula imfucuza ibe yimali, i-airtime, izinto zokudla nokunye.',
    cta_start:'Qala Manje →', cta_how:'Bona Ukuthi Kusebenza Kanjani',
    welcome:'Sawubona futhi', language:'Ulimi',
  },
  xh: {
    home:'Ikhaya', how:'Indlela Esebenza Ngayo', features:'Iimpawu', rewards:'Imivuzo', partners:'Amaqabane', about:'Malunga', faq:'Imibuzo',
    open_dash:'Vula i-Dashboard →',
    hero_title_a:'Phinda usebenzise.', hero_title_b:'Fumana.', hero_title_c:'Phinda.',
    hero_sub:'Iibhini ezikrelekrele kuluntu lwakho ezikuvuzayo ngento nganye oyiphinda usebenzise. Guqula inkunkuma ibe lixabiso — imali, i-airtime, ukutya nokunye.',
    cta_start:'Qala Ngoku →', cta_how:'Bona Indlela Esebenza Ngayo',
    welcome:'Wamkelekile kwakhona', language:'Ulwimi',
  },
  af: {
    home:'Tuis', how:'Hoe Dit Werk', features:'Kenmerke', rewards:'Belonings', partners:'Vennote', about:'Oor Ons', faq:'Vrae',
    open_dash:'Open Dashboard →',
    hero_title_a:'Herwin.', hero_title_b:'Verdien.', hero_title_c:'Herhaal.',
    hero_sub:'Slim asblikke in jou gemeenskap wat jou beloon vir elke item wat jy herwin. Verander afval in regte waarde — kontant, lugtyd, kruideniersware en meer.',
    cta_start:'Begin Herwin →', cta_how:'Sien Hoe Dit Werk',
    welcome:'Welkom terug', language:'Taal',
  },
  st: {
    home:'Lehae', how:'Ho Sebetsa', features:'Dikarolo', rewards:'Meputso', partners:'Balekane', about:'Ka Rona', faq:'Dipotso',
    open_dash:'Bula Dashboard →',
    hero_title_a:'Recycle.', hero_title_b:'Fumana.', hero_title_c:'Pheta.',
    hero_sub:'Diliboro tse bohlale sebakeng sa heno tse o putsang bakeng sa ntho ka nngwe eo o e recycle-ang. Fetola litšila ho ba boleng — chelete, airtime, lijo le tse ling.',
    cta_start:'Qala Joale →', cta_how:'Bona Hore na ho Sebetsa Joang',
    welcome:'Re a u amohela', language:'Puo',
  },
  tn: {
    home:'Legae', how:'Ka Moo E Berekang', features:'Dikarolo', rewards:'Diduelo', partners:'Balekane', about:'Ka Rona', faq:'Dipotso',
    open_dash:'Bula Dashboard →',
    hero_title_a:'Dirisa Sesha.', hero_title_b:'Bona Madi.', hero_title_c:'Boeletsa.',
    hero_sub:'Diborogo tse di botlhale mo baaging ba gago tse di go duelang ka selo sengwe le sengwe se o se dirisang sesha. Fetola matlakala go nna boleng — madi, airtime, dijo le tse dingwe.',
    cta_start:'Simolola Jaanong →', cta_how:'Bona Ka Moo E Berekang',
    welcome:'O amogetswe gape', language:'Puo',
  },
  ts: {
    home:'Kaya', how:'Ndlela Yi Tirhaka', features:'Swiyenge', rewards:'Tihakelo', partners:'Vatirhi-kulobye', about:'Hi Hina', faq:'Swivutiso',
    open_dash:'Pfula Dashboard →',
    hero_title_a:'Tirhisa Nakambe.', hero_title_b:'Kuma.', hero_title_c:'Phindha.',
    hero_sub:'Swibya swo tlhariha emugangeni wa wena leswi ku hakelaka eka xilo xin\'wana ni xin\'wana lexi u xi tirhisaka nakambe. Cinca thyaka ku va nkoka — mali, airtime, swakudya na swin\'wana.',
    cta_start:'Sungula Sweswi →', cta_how:'Vona Ndlela Yi Tirhaka',
    welcome:'U amukeriwile nakambe', language:'Ririmi',
  },
  ve: {
    home:'Hayani', how:'Nḓila Ine Ya Shuma', features:'Zwipiḓa', rewards:'Mbadelo', partners:'Vhakwashami', about:'Nga Riṋe', faq:'Mbudziso',
    open_dash:'Vula Dashboard →',
    hero_title_a:'Shumisa Hafhu.', hero_title_b:'Wana.', hero_title_c:'Dovha.',
    hero_sub:'Zwidzhena zwa vhuṱali tshitshavhani tshaṋu zwine zwa ni badela kha tshithu tshiṅwe na tshiṅwe tshine na tshi shumisa hafhu. Shandukisa marathwa a vhe na ndeme — tshelede, airtime, zwiḽiwa na zwiṅwe.',
    cta_start:'Thoma Zwino →', cta_how:'Vhona Nḓila Ine Ya Shuma',
    welcome:'No tanganedzwa hafhu', language:'Luambo',
  },
  nr: {
    home:'Ikhaya', how:'Indlela Esebenza Ngayo', features:'Iimpawu', rewards:'Imivuzo', partners:'Abalingani', about:'Ngathi', faq:'Imibuzo',
    open_dash:'Vula Dashboard →',
    hero_title_a:'Sebenzisa Godu.', hero_title_b:'Zuza.', hero_title_c:'Phinda.',
    hero_sub:'Amabhini ahlakaniphileko emphakathinakho akuvuzako ngento nganye oyisebenzisa godu. Tjhugulula imarari ibe livelu — imali, i-airtime, ukudla nokhunye.',
    cta_start:'Thoma Nje →', cta_how:'Bona Indlela Esebenza Ngayo',
    welcome:'Wamukelekile godu', language:'Ilimi',
  },
  ss: {
    home:'Ekhaya', how:'Indlela Lesebenta Ngayo', features:'Tici', rewards:'Imivuzo', partners:'Bahlanganyeli', about:'Ngatsi', faq:'Imibuto',
    open_dash:'Vula Dashboard →',
    hero_title_a:'Sebentisa Futsi.', hero_title_b:'Tfola.', hero_title_c:'Phindza.',
    hero_sub:'Emabhini lahlakaniphile emmangweni wakho lakukhokhelako ngentfo ngayinye loyisebentisa futsi. Gucula imfucuta ibe lusito — imali, i-airtime, kudla naletinye.',
    cta_start:'Cala Manje →', cta_how:'Bona Indlela Lesebenta Ngayo',
    welcome:'Wemukelekile futsi', language:'Lulwimi',
  },
  nso: {
    home:'Gae', how:'Ka Moo E Šomago', features:'Dikarolo', rewards:'Diputso', partners:'Bagwera', about:'Ka Rena', faq:'Dipotšišo',
    open_dash:'Bula Dashboard →',
    hero_title_a:'Šomiša Gape.', hero_title_b:'Hwetša.', hero_title_c:'Boeletša.',
    hero_sub:'Diborogo tše bohlale setšhabeng sa geno tšeo di go putsago ka selo se sengwe le se sengwe seo o se šomišago gape. Fetola dithoto go ba mohola — tšhelete, airtime, dijo le tše dingwe.',
    cta_start:'Thoma Bjale →', cta_how:'Bona Ka Moo E Šomago',
    welcome:'O amogetšwe gape', language:'Polelo',
  },
  fr: {
    home:'Accueil', how:'Comment Ça Marche', features:'Fonctionnalités', rewards:'Récompenses', partners:'Partenaires', about:'À Propos', faq:'FAQ',
    open_dash:'Ouvrir le Tableau de Bord →',
    hero_title_a:'Recyclez.', hero_title_b:'Gagnez.', hero_title_c:'Recommencez.',
    hero_sub:"Des poubelles intelligentes dans votre communauté qui vous récompensent pour chaque article recyclé. Transformez les déchets en valeur réelle — argent, temps d'antenne, courses et plus.",
    cta_start:'Commencer à Recycler →', cta_how:'Voir Comment Ça Marche',
    welcome:'Bon retour', language:'Langue',
  },
  pt: {
    home:'Início', how:'Como Funciona', features:'Recursos', rewards:'Recompensas', partners:'Parceiros', about:'Sobre', faq:'Perguntas',
    open_dash:'Abrir Painel →',
    hero_title_a:'Recicle.', hero_title_b:'Ganhe.', hero_title_c:'Repita.',
    hero_sub:'Lixeiras inteligentes na sua comunidade que recompensam você por cada item reciclado. Transforme resíduos em valor real — dinheiro, créditos, mantimentos e mais.',
    cta_start:'Começar a Reciclar →', cta_how:'Veja Como Funciona',
    welcome:'Bem-vindo de volta', language:'Idioma',
  },
};

function t(key, lang){
  const L = lang || localStorage.getItem('srh_lang') || 'en';
  return (I18N[L] && I18N[L][key]) || (I18N.en && I18N.en[key]) || key;
}

// Map our internal codes to Google Translate language codes.
// Languages without Google Translate support fall back to a closely related one.
const GOOGLE_LANG_MAP = {
  en:'en', zu:'zu', xh:'xh', af:'af', st:'st', tn:'tn',
  ts:'ts', ve:'en', nr:'zu', ss:'zu', nso:'st',
  fr:'fr', pt:'pt'
};

// Wait for the Google Translate widget's hidden <select> to appear, then resolve with it.
function whenGTComboReady(timeoutMs){
  return new Promise((resolve, reject)=>{
    const start = Date.now();
    (function poll(){
      const sel = document.querySelector('select.goog-te-combo');
      if(sel) return resolve(sel);
      if(Date.now() - start > (timeoutMs || 8000)) return reject(new Error('goog-te-combo not ready'));
      setTimeout(poll, 80);
    })();
  });
}

// Drive Google Translate by programmatically changing its combo <select>.
// No cookies, no reload — works on file://, localhost and any host.
function applyGoogleTranslate(targetLang){
  whenGTComboReady().then(sel=>{
    sel.value = targetLang || '';
    sel.dispatchEvent(new Event('change'));
  }).catch(()=>{});
}

function setLang(lang){
  if(!I18N[lang]) lang = 'en';
  const prev = localStorage.getItem('srh_lang') || 'en';
  localStorage.setItem('srh_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.dataset.i18n;
    const v = t(k, lang);
    if(v) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
    // format: "attr:key, attr2:key2"
    el.dataset.i18nAttr.split(',').forEach(pair=>{
      const [a,k] = pair.trim().split(':');
      if(a && k) el.setAttribute(a, t(k, lang));
    });
  });

  // Drive Google Translate so the ENTIRE page flips language (not only tagged strings).
  const gLang = GOOGLE_LANG_MAP[lang] || 'en';
  if(gLang === 'en'){
    // Restore original: calling the combo with '' and firing change puts the page back to English.
    applyGoogleTranslate('');
  } else {
    applyGoogleTranslate(gLang);
  }

  const btn = document.getElementById('langBtn');
  if(btn){
    const meta = LANGS.find(l=>l.code===lang) || LANGS[0];
    btn.textContent = `${meta.flag} ${lang.toUpperCase()}`;
  }
  document.querySelectorAll('#langMenu .lang-option').forEach(o=>{
    o.classList.toggle('active', o.dataset.lang === lang);
  });
}
window.setLang = setLang;

// ===== Google Translate loader =====
function loadGoogleTranslate(){
  if(document.getElementById('google_translate_element')) return;
  const host = document.createElement('div');
  host.id = 'google_translate_element';
  host.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;';
  document.body.appendChild(host);

  window.googleTranslateElementInit = function(){
    /* global google */
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'af,zu,xh,st,tn,ts,fr,pt,en',
      autoDisplay: false,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  };

  if(!document.querySelector('script[data-gt]')){
    const s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.setAttribute('data-gt','1');
    document.head.appendChild(s);
  }

  // Hide the Google Translate top banner / tooltip artifacts.
  if(!document.getElementById('gt-style-fix')){
    const st = document.createElement('style');
    st.id = 'gt-style-fix';
    st.textContent = `
      .goog-te-banner-frame.skiptranslate, .goog-tooltip, .goog-tooltip:hover { display:none !important; }
      body { top:0 !important; }
      .goog-text-highlight { background:none !important; box-shadow:none !important; }
    `;
    document.head.appendChild(st);
  }
}

// ===== Inject tools (theme + lang) into nav =====
function injectTools(){
  const nav = document.querySelector('.nav-links');
  if(!nav || document.getElementById('themeBtn')) return;
  const wrap = document.createElement('div');
  wrap.className = 'tools';
  const theme = localStorage.getItem('srh_theme') || 'light';
  const lang = localStorage.getItem('srh_lang') || 'en';
  const meta = LANGS.find(l=>l.code===lang) || LANGS[0];

  const options = LANGS.map(l=>(
    `<button type="button" class="lang-option" data-lang="${l.code}">
       <span class="lo-flag">${l.flag}</span>
       <span class="lo-label">${l.label}</span>
       <span class="lo-code">${l.code.toUpperCase()}</span>
     </button>`
  )).join('');

  wrap.innerHTML = `
    <div class="lang-wrap" id="langWrap">
      <button class="tool-btn lang-btn" id="langBtn" title="Language" aria-haspopup="listbox" aria-expanded="false">${meta.flag} ${lang.toUpperCase()}</button>
      <div class="lang-menu" id="langMenu" role="listbox">${options}</div>
    </div>
    <button class="tool-btn" id="themeBtn" onclick="toggleTheme()" title="Theme">${theme==='dark'?'☀️':'🌙'}</button>`;
  nav.insertBefore(wrap, nav.firstChild);

  const wrapEl = wrap.querySelector('#langWrap');
  const btn = wrap.querySelector('#langBtn');
  const menu = wrap.querySelector('#langMenu');
  const open = ()=>{ wrapEl.classList.add('open'); btn.setAttribute('aria-expanded','true'); };
  const close = ()=>{ wrapEl.classList.remove('open'); btn.setAttribute('aria-expanded','false'); };
  wrapEl.addEventListener('mouseenter', open);
  wrapEl.addEventListener('mouseleave', close);
  btn.addEventListener('click', (e)=>{ e.stopPropagation(); wrapEl.classList.toggle('open'); });
  document.addEventListener('click', (e)=>{ if(!wrapEl.contains(e.target)) close(); });
  menu.querySelectorAll('.lang-option').forEach(opt=>{
    opt.addEventListener('click', ()=>{ setLang(opt.dataset.lang); close(); });
  });

  loadGoogleTranslate();
  setLang(lang);
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', injectTools);
} else {
  injectTools();
}
