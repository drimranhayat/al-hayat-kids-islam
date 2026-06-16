
(function(){
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  if(navToggle && navMenu){
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.addEventListener('click', (event) => {
      if(event.target.matches('a')){
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  }

  document.querySelectorAll('[data-filter-target]').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-filter-target');
      const filter = button.getAttribute('data-filter');
      const container = document.getElementById(targetId);
      if(!container) return;
      document.querySelectorAll(`[data-filter-target="${targetId}"]`).forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      container.querySelectorAll('.filter-item').forEach(item => {
        const category = item.getAttribute('data-category');
        item.hidden = !(filter === 'all' || category === filter);
      });
    });
  });

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      const icon = button.querySelector('[aria-hidden="true"]');
      if(icon) icon.textContent = open ? '−' : '+';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const id = anchor.getAttribute('href');
      if(id.length > 1){
        const target = document.querySelector(id);
        if(target){ event.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  document.querySelectorAll('[data-coming-soon]').forEach(button => {
    button.addEventListener('click', () => {
      alert('Coming soon on Google Play. This safe placeholder can be replaced with the official Play Store link later.');
    });
  });

  const back = document.querySelector('[data-back-to-top]');
  if(back){
    window.addEventListener('scroll', () => back.classList.toggle('show', window.scrollY > 500), {passive:true});
    back.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const form = document.querySelector('[data-contact-form]');
  if(form){
    form.addEventListener('submit', event => {
      event.preventDefault();
      const note = form.querySelector('[data-form-note]');
      if(note){ note.textContent = 'This static form has no backend. Please copy your message and send it to YOUR_EMAIL_HERE.'; }
    });
  }

  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(motionOK){
    document.querySelectorAll('.section,.feature-card,.path-card,.level-card,.curriculum-card,.content-block,.screen-card,.trust-tile,.premium-card').forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, {threshold:.12});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    document.querySelectorAll('.btn,.filter-btn,.nav-link').forEach(el => {
      el.addEventListener('pointerenter', () => {
        for(let i=0;i<3;i++){
          const star = document.createElement('span');
          star.className='sparkle';
          star.textContent = i % 2 ? '✦' : '★';
          star.style.left = `${20 + Math.random()*55}%`;
          star.style.top = `${35 + Math.random()*25}%`;
          star.style.setProperty('--x', `${(Math.random()-.5)*90}px`);
          star.style.setProperty('--y', `${-20 - Math.random()*45}px`);
          el.appendChild(star);
          setTimeout(() => star.remove(), 700);
        }
      });
    });
  }
})();
