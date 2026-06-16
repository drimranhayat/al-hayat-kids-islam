
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
    document.querySelectorAll('.feature-card,.path-card,.level-card,.curriculum-card,.content-block,.screen-card,.trust-tile,.premium-card,.kid-course-card,.shortcut-grid a').forEach(el => el.classList.add('reveal'));
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


// Learning Dashboard V5: age + level filters and tiny no-audio games
(function(){
  const state = { age: 'all', level: 'all' };
  function applyKidFilters(){
    document.querySelectorAll('#kid-course-grid .kid-course-card').forEach(card => {
      const ages = (card.getAttribute('data-age') || '').split(/\s+/);
      const levels = (card.getAttribute('data-level') || '').split(/\s+/);
      const ageOK = state.age === 'all' || ages.includes(state.age);
      const levelOK = state.level === 'all' || levels.includes(state.level);
      card.hidden = !(ageOK && levelOK);
    });
  }
  document.querySelectorAll('[data-kid-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-kid-filter');
      state[group] = btn.getAttribute('data-filter-value') || 'all';
      document.querySelectorAll(`[data-kid-filter="${group}"]`).forEach(item => item.classList.remove('active'));
      btn.classList.add('active');
      applyKidFilters();
    });
  });

  document.querySelectorAll('.choice-game').forEach(game => {
    game.addEventListener('click', e => {
      const btn = e.target.closest('.choice-btn');
      if(!btn) return;
      game.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('correct','wrong'));
      const result = game.parentElement.querySelector('.game-result');
      const correct = btn.getAttribute('data-correct') === 'true';
      btn.classList.add(correct ? 'correct' : 'wrong');
      if(result) result.textContent = correct ? 'Excellent! You chose the right action. ⭐' : 'Good try. Choose the kind Islamic action. 🌱';
    });
  });

  document.querySelectorAll('[data-star-task]').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = btn.parentElement.querySelector('.task-result');
      btn.textContent = '⭐⭐⭐ Practice completed';
      if(result) result.textContent = 'MashaAllah! Now try using it in real life today.';
    });
  });
})();


// V6: practice reveal cards and activity checklist feedback
(function(){
  document.querySelectorAll('[data-reveal-text]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-reveal-text') || 'Great practice!';
      btn.classList.add('done');
      const result = btn.closest('section')?.querySelector('.practice-result') || btn.parentElement?.nextElementSibling;
      if(result) result.textContent = text + ' ⭐';
    });
  });
  document.querySelectorAll('[data-check-task]').forEach(box => {
    box.addEventListener('change', () => {
      const section = box.closest('section');
      if(!section) return;
      const total = section.querySelectorAll('[data-check-task]').length;
      const done = section.querySelectorAll('[data-check-task]:checked').length;
      const result = section.querySelector('.task-result');
      if(result) result.textContent = done === total ? 'MashaAllah! All activity steps are complete. ⭐⭐⭐' : `${done}/${total} steps complete. Keep going!`;
    });
  });
})();
