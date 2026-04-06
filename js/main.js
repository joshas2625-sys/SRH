// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('in'), i*60);
      io.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Animated counters
const counters = document.querySelectorAll('.count');
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target;
    const to = +el.dataset.to;
    const dur = 1600;
    const start = performance.now();
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
