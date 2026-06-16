
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


// ===============================
// V7 Rich Interactive Learning Engine
// Sound effects, English pronunciation, daily path, progress, global filters, whiteboard, typing board
// ===============================
(function(){
  const STORAGE_KEY = 'alhayatKidsProgressV7';
  const FILTER_KEY = 'alhayatKidsFilterV7';
  const SOUND_KEY = 'alhayatKidsSoundV7';
  let audioCtx = null;
  let soundEnabled = localStorage.getItem(SOUND_KEY) === 'on';

  function readProgress(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {stars:0, completed:{}, badges:[]}; }
    catch(e){ return {stars:0, completed:{}, badges:[]}; }
  }
  function saveProgress(p){ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); updateProgressUI(); }
  function badgeForStars(stars){
    const list=[];
    if(stars>=3) list.push('Starter Star');
    if(stars>=8) list.push('Practice Hero');
    if(stars>=15) list.push('Good Deed Champ');
    if(stars>=25) list.push('Learning Explorer');
    if(stars>=40) list.push('MashaAllah Master');
    return list;
  }
  function award(key, amount=1){
    const p = readProgress();
    if(key && p.completed[key]) return false;
    if(key) p.completed[key] = true;
    p.stars = (p.stars || 0) + amount;
    p.badges = Array.from(new Set([...(p.badges || []), ...badgeForStars(p.stars)]));
    saveProgress(p);
    return true;
  }
  function updateProgressUI(){
    const p = readProgress();
    document.querySelectorAll('[data-star-counter]').forEach(el => el.textContent = String(p.stars || 0));
    document.querySelectorAll('[data-badge-counter]').forEach(el => el.textContent = String((p.badges || []).length));
    document.querySelectorAll('[data-badge-shelf]').forEach(shelf => {
      const badges = p.badges && p.badges.length ? p.badges : ['Complete a task'];
      shelf.innerHTML = badges.map(b => `<span class="badge">🏅 ${b}</span>`).join('');
    });
  }
  updateProgressUI();

  function ensureAudio(){
    if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function playTone(type='hover'){
    if(!soundEnabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try{
      const ctx = ensureAudio();
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const freqs = type === 'success' ? [523.25,659.25,783.99] : type === 'click' ? [392,523.25] : [659.25,783.99];
      o.type = 'sine';
      o.frequency.setValueAtTime(freqs[0], now);
      freqs.slice(1).forEach((f,i)=>o.frequency.linearRampToValueAtTime(f, now + .06*(i+1)));
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(type === 'success' ? .075 : .04, now+.018);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'success' ? .28 : .16));
      o.connect(g).connect(ctx.destination);
      o.start(now); o.stop(now + (type === 'success' ? .30 : .18));
    }catch(e){}
  }
  function syncSoundButtons(){
    document.querySelectorAll('[data-enable-sound]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(soundEnabled));
      btn.textContent = soundEnabled ? '🔊 Fun Sounds ON' : '🔊 Enable Fun Sounds';
    });
  }
  syncSoundButtons();
  document.addEventListener('click', e => {
    const toggle = e.target.closest('[data-enable-sound]');
    if(toggle){
      soundEnabled = !soundEnabled;
      localStorage.setItem(SOUND_KEY, soundEnabled ? 'on' : 'off');
      if(soundEnabled) { ensureAudio(); playTone('success'); }
      syncSoundButtons();
    }
  });
  document.addEventListener('pointerenter', e => {
    if(e.target.closest && e.target.closest('button,a,.kid-course-card,.tap-card,.choice-btn')) playTone('hover');
  }, true);
  document.addEventListener('click', e => {
    if(e.target.closest && e.target.closest('button,a,.kid-course-card,.tap-card,.choice-btn')) playTone('click');
  }, true);

  function speakText(text){
    if(!('speechSynthesis' in window)) { alert('Speech is not available in this browser.'); return; }
    const clean = (text || '').replace(/[^A-Za-z0-9 .,!?'-]/g,' ').replace(/\s+/g,' ').trim();
    if(!clean) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'en-US'; utter.rate = 0.88; utter.pitch = 1.08; utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /Google US English|Microsoft Aria|Samantha|Jenny|Natural/i.test(v.name) && /en/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang));
    if(preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-speak]');
    if(!btn) return;
    e.preventDefault(); e.stopPropagation();
    speakText(btn.getAttribute('data-speak') || btn.textContent);
  });
  function addAutoSpeak(){
    document.querySelectorAll('.kid-course-card h3,.arabic-lesson-card h3,.mini-game-panel h2,.course-top + h3,.section-head h2').forEach(el => {
      if(el.dataset.speakReady) return;
      const txt = el.textContent.trim();
      if(!/[A-Za-z]/.test(txt) || txt.length > 70) return;
      const b = document.createElement('button');
      b.type='button'; b.className='speak-chip'; b.setAttribute('data-speak', txt); b.setAttribute('aria-label', 'Listen to '+txt); b.textContent='🔊';
      el.appendChild(b); el.dataset.speakReady='true';
    });
    document.querySelectorAll('.choice-btn').forEach(el => {
      if(el.dataset.speakReady) return;
      const txt = el.textContent.trim();
      if(!/[A-Za-z]/.test(txt) || txt.length > 60) return;
      const b = document.createElement('button');
      b.type='button'; b.className='speak-chip'; b.setAttribute('data-speak', txt); b.setAttribute('aria-label','Listen'); b.textContent='🔊';
      el.appendChild(b); el.dataset.speakReady='true';
    });
  }
  addAutoSpeak();
  if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = addAutoSpeak;

  // Auto-updating daily path
  const daily = [
    [{icon:'🤲',title:'Learn Bismillah',sub:'بِسْمِ اللهِ',href:'duas.html#lesson'},{icon:'✍️',title:'Type Bismillah',sub:'Typing board',href:'duas.html#practice-studio'},{icon:'🎮',title:'Dua Mini Game',sub:'Before eating',href:'duas.html#game'}],
    [{icon:'📖',title:'Short Surah',sub:'سورة الإخلاص',href:'surahs.html#lesson'},{icon:'🖍️',title:'Trace a word',sub:'Whiteboard',href:'surahs.html#practice-studio'},{icon:'⭐',title:'Surah Star',sub:'Complete a task',href:'surahs.html#activity'}],
    [{icon:'🌸',title:'Practice Salam',sub:'السَّلَامُ عَلَيْكُمْ',href:'islamic-manners.html#lesson'},{icon:'🎮',title:'Manners Game',sub:'Kind words',href:'islamic-manners.html#game'},{icon:'💚',title:'Good deed',sub:'Help at home',href:'islamic-manners.html#activity'}],
    [{icon:'⭐',title:'Prophet Story',sub:'Authentic moral lesson',href:'prophet-stories.html#lesson'},{icon:'⌨️',title:'Type Prophet',sub:'Typing board',href:'prophet-stories.html#practice-studio'},{icon:'🎮',title:'Story Game',sub:'Choose the lesson',href:'prophet-stories.html#game'}],
    [{icon:'ا',title:'Arabic Letter',sub:'ا ب ت ث',href:'arabic-letters.html#lesson'},{icon:'🖍️',title:'Trace Alif',sub:'Whiteboard',href:'arabic-letters.html#practice-studio'},{icon:'🎮',title:'Letter Game',sub:'Find the letter',href:'arabic-letters.html#game'}],
    [{icon:'🕌',title:'Five Prayers',sub:'الفجر • الظهر',href:'prayer-basics.html#lesson'},{icon:'🧩',title:'Wudu Steps',sub:'Checklist',href:'prayer-basics.html#activity'},{icon:'🎮',title:'Salah Game',sub:'Choose the prayer',href:'prayer-basics.html#game'}],
    [{icon:'🌙',title:'Ramadan Word',sub:'رَمَضَان',href:'ramadan-eid.html#lesson'},{icon:'💚',title:'Charity Task',sub:'Good deed',href:'ramadan-eid.html#activity'},{icon:'🎮',title:'Eid Game',sub:'Season match',href:'ramadan-eid.html#game'}]
  ];
  document.querySelectorAll('[data-daily-path]').forEach(holder => {
    const day = Math.floor(Date.now()/86400000) % daily.length;
    holder.innerHTML = daily[day].map(t => `<a class="today-task" href="${t.href}"><span>${t.icon}</span><b>${t.title}</b><small>${t.sub}</small></a>`).join('');
  });

  // Global filters applied to full content and link navigation
  const url = new URL(location.href);
  const saved = (()=>{ try{return JSON.parse(localStorage.getItem(FILTER_KEY))||{};}catch(e){return{};} })();
  const filterState = { age: url.searchParams.get('age') || saved.age || 'all', level: url.searchParams.get('level') || saved.level || 'all' };
  function saveFilter(){ localStorage.setItem(FILTER_KEY, JSON.stringify(filterState)); }
  function syncFilterButtons(){
    document.querySelectorAll('[data-kid-filter]').forEach(btn => {
      const group = btn.getAttribute('data-kid-filter');
      btn.classList.toggle('active', (btn.getAttribute('data-filter-value') || 'all') === filterState[group]);
    });
  }
  function tokenOK(el, attr, value){
    if(value === 'all') return true;
    const tokens = (el.getAttribute(attr)||'').split(/\s+/).filter(Boolean);
    if(!tokens.length) return true;
    return tokens.includes(value);
  }
  function applyGlobalFilters(){
    document.querySelectorAll('.filter-item,[data-age][data-level]').forEach(el => {
      if(el.matches('[data-kid-filter],.kid-control-bar,.kid-control-bar *')) return;
      const ok = tokenOK(el,'data-age',filterState.age) && tokenOK(el,'data-level',filterState.level);
      el.classList.toggle('global-hidden-by-filter', !ok);
      if(el.classList.contains('kid-course-card')) el.hidden = !ok;
    });
    document.querySelectorAll('a[href$=".html"],a[href*=".html#"]').forEach(a => {
      try{
        const href = a.getAttribute('href'); if(!href || href.startsWith('http') || href.startsWith('mailto:')) return;
        const [base, hash=''] = href.split('#');
        if(!base.endsWith('.html')) return;
        const u = new URL(base, location.href);
        if(filterState.age !== 'all') u.searchParams.set('age', filterState.age); else u.searchParams.delete('age');
        if(filterState.level !== 'all') u.searchParams.set('level', filterState.level); else u.searchParams.delete('level');
        a.setAttribute('href', u.pathname.split('/').pop() + u.search + (hash ? '#'+hash : ''));
      }catch(e){}
    });
    syncFilterButtons(); saveFilter();
  }
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-kid-filter]'); if(!btn) return;
    const group = btn.getAttribute('data-kid-filter');
    filterState[group] = btn.getAttribute('data-filter-value') || 'all';
    applyGlobalFilters();
  });
  applyGlobalFilters();

  // Whiteboard drawing
  function setupBoard(canvas){
    if(canvas.dataset.ready) return; canvas.dataset.ready='true';
    const ctx = canvas.getContext('2d');
    const scale = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(320, Math.floor(rect.width * ratio));
      canvas.height = Math.max(180, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio,0,0,ratio,0,0);
      ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=6; ctx.strokeStyle='#0f766e';
    };
    scale(); window.addEventListener('resize', scale, {passive:true});
    let drawing=false, last=null;
    function point(ev){
      const rect = canvas.getBoundingClientRect();
      const t = ev.touches ? ev.touches[0] : ev;
      return {x:t.clientX-rect.left, y:t.clientY-rect.top};
    }
    function start(ev){drawing=true; last=point(ev); ev.preventDefault();}
    function move(ev){ if(!drawing) return; const p=point(ev); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p; ev.preventDefault();}
    function end(){drawing=false; last=null;}
    canvas.addEventListener('pointerdown', start); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', end); canvas.addEventListener('pointerleave', end);
    canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', move, {passive:false}); canvas.addEventListener('touchend', end);
  }
  document.querySelectorAll('[data-whiteboard]').forEach(setupBoard);
  document.addEventListener('click', e => {
    const clear = e.target.closest('[data-clear-whiteboard]');
    if(clear){ const c = clear.closest('.studio-card')?.querySelector('[data-whiteboard]'); if(c){ c.getContext('2d').clearRect(0,0,c.width,c.height); } }
  });

  // Typing checks and next links
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-check-typing]');
    if(!btn) return;
    const card = btn.closest('.typing-card');
    const input = card?.querySelector('[data-typing-answer]');
    const result = card?.querySelector('.typing-result');
    const next = card?.querySelector('.next-task-link');
    if(!input) return;
    const expected = (input.getAttribute('data-typing-answer')||'').toLowerCase().trim();
    const value = input.value.toLowerCase().trim();
    const ok = value && (expected.includes(value) || value.includes(expected) || value.split(/\s+/).some(v => expected.includes(v)));
    if(ok){
      result.textContent = 'Excellent typing! You earned a star. ⭐';
      btn.classList.add('task-complete-glow');
      if(next) next.hidden = false;
      award(btn.getAttribute('data-progress') || 'typing-'+location.pathname, 1);
      playTone('success');
    } else {
      result.textContent = 'Good try. Look at the target word and try again. 🌱';
    }
  });
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-progress]:not([data-check-typing])');
    if(!btn) return;
    award(btn.getAttribute('data-progress'), 1);
    const nextHref = btn.getAttribute('data-next');
    const next = btn.parentElement?.querySelector('.next-task-link');
    if(next) next.hidden = false;
    btn.classList.add('task-complete-glow');
    playTone('success');
  });

  // Improve existing reveal/check/game progress
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-reveal-text]');
    if(btn){ award('reveal-'+location.pathname+'-'+(btn.textContent||'').trim().slice(0,20), 1); }
    const choice = e.target.closest('.choice-btn[data-correct="true"]');
    if(choice){ award('game-'+location.pathname+'-'+(choice.textContent||'').trim().slice(0,20), 2); playTone('success'); }
    const starTask = e.target.closest('[data-star-task]');
    if(starTask){ award(starTask.getAttribute('data-progress') || 'star-'+location.pathname, 2); }
  }, true);
})();
