(function () {
  const Bank = {
    data: { levels: null, topics: null, questions: [] },
    basePath() {
      const path = location.pathname;
      return /\/(activities|games|practice|progress|badges|parents)\//.test(path) ? '../' : '';
    },
    async load() {
      const base = this.basePath();
      const [levels, topics, ...questionFiles] = await Promise.all([
        fetch(base + 'assets/data/levels/levels.json').then(r => r.json()),
        fetch(base + 'assets/data/topics/topics.json').then(r => r.json()),
        ...[1,2,3,4,5].map(n => fetch(base + `assets/data/questions/questions-level-${n}.json`).then(r => r.json()))
      ]);
      this.data.levels = levels;
      this.data.topics = topics;
      this.data.questions = questionFiles.flatMap(f => f.items || []);
      return this.data;
    },
    filter(filter) { return window.AlHayatFilters.applyFilters(this.data.questions, filter); },
    card(q, mode) {
      const done = window.AlHayatProgress?.isDone(q.id);
      const actionText = mode === 'games' ? q.game : mode === 'practice' ? q.practice : mode === 'activities' ? q.activity : q.simpleExplanation;
      return `
        <article class="ak-card ${done ? 'is-done' : ''}" data-qid="${q.id}">
          <div class="ak-card-top"><span class="ak-icon">${q.symbol}</span><span>Level ${q.level} • ${q.ageRange}</span><span>${done ? '✅ Done' : '🌱 New'}</span></div>
          <h3>${q.question}</h3>
          ${q.arabic ? `<p class="ak-arabic" dir="rtl">${q.arabic}</p>` : ''}
          <div class="ak-options">${(q.options || []).map(o => `<button data-answer="${String(o).replace(/"/g,'&quot;')}" data-correct="${String(o) === String(q.answer)}">${o}</button>`).join('')}</div>
          <p class="ak-explain"><strong>Answer:</strong> ${q.answer}</p>
          <p class="ak-action"><strong>${mode === 'games' ? 'Game' : mode === 'practice' ? 'Practice' : 'Activity'}:</strong> ${actionText}</p>
          <button class="ak-complete" data-complete="${q.id}">⭐ Mark complete & unlock next</button>
          ${q.nextId ? `<small>Next: ${q.nextId}</small>` : `<small>Final card in this level.</small>`}
        </article>`;
    },
    renderCards(root, items, mode) {
      const list = root.querySelector('[data-card-list]');
      const count = root.querySelector('[data-result-count]');
      count.textContent = `${items.length} cards found`;
      list.innerHTML = items.slice(0, 60).map(q => this.card(q, mode)).join('');
      if (items.length > 60) list.insertAdjacentHTML('beforeend', `<p class="ak-more">Showing first 60 cards. Use filters to narrow ${items.length} results.</p>`);
    },
    renderDashboard(root, mode) {
      const total = this.data.questions.length;
      const progress = window.AlHayatProgress.read();
      const done = Object.keys(progress.completed || {}).length;
      root.innerHTML = `
        <section class="ak-hero">
          <h1>${modeTitle(mode)}</h1>
          <p>Structured Islamic learning for ages 3–8: question → activity → practice → game → star → next task.</p>
          <div class="ak-stats"><span>❓ ${total} Questions</span><span>✅ ${done} Completed</span><span>⭐ ${progress.stars || 0} Stars</span></div>
        </section>
        <div data-filter-host></div>
        <section class="ak-daily"><h2>🌞 Today’s Learning Path</h2><div class="ak-mini-list" data-daily-path></div></section>
        <section><div class="ak-count" data-result-count></div><div class="ak-card-list" data-card-list></div></section>
      `;
      const filterHost = root.querySelector('[data-filter-host]');
      let current = {};
      window.AlHayatFilters.renderFilters(filterHost, this.data, filter => { current = filter; this.renderCards(root, this.filter(filter), mode); });
      const daily = window.AlHayatLearningPath.dailyPath(this.data.questions, 8);
      root.querySelector('[data-daily-path]').innerHTML = daily.map(q => `<button data-jump-topic="${q.topicId}">${q.symbol} L${q.level}: ${q.subtopic}</button>`).join('');
      this.renderCards(root, this.data.questions, mode);
    },
    renderProgress(root) {
      const progress = window.AlHayatProgress.read();
      const badges = window.AlHayatRewards.calculateBadges(this.data.questions, progress);
      root.innerHTML = `
        <section class="ak-hero"><h1>⭐ Progress Tracker</h1><p>Stars, completed cards, and level badges.</p><div class="ak-stats"><span>✅ ${Object.keys(progress.completed || {}).length} Completed</span><span>⭐ ${progress.stars || 0} Stars</span></div><button data-reset-progress>Reset progress</button></section>
        <div class="ak-badge-grid">${badges.map(b => `<article class="ak-badge"><div>${b.icon}</div><h3>Level ${b.level}: ${b.title}</h3><p>${b.done}/${b.total} completed • ${b.percent}%</p><progress value="${b.percent}" max="100"></progress><p>${window.AlHayatRewards.nextRewardText(b.percent)}</p></article>`).join('')}</div>`;
      root.querySelector('[data-reset-progress]').addEventListener('click', () => { if (confirm('Reset learning progress?')) { window.AlHayatProgress.reset(); this.renderProgress(root); } });
    },
    async init(root, mode) {
      try {
        await this.load();
        if (mode === 'progress' || mode === 'badges') this.renderProgress(root);
        else this.renderDashboard(root, mode);
        root.addEventListener('click', e => {
          const btn = e.target.closest('[data-complete]');
          if (btn) { window.AlHayatProgress.complete(btn.dataset.complete); if (window.AlHayatSound) window.AlHayatSound.beep('success'); this.renderDashboard(root, mode); }
        });
      } catch (err) {
        root.innerHTML = `<div class="ak-error"><h2>Content could not load</h2><p>Please check that all JSON files are uploaded in /assets/data/.</p><pre>${err.message}</pre></div>`;
      }
    }
  };
  function modeTitle(mode) {
    return ({ activities:'🎯 Activities', games:'🎮 Games', practice:'✍️ Practice Board', parents:'👨‍👩‍👧 Parent Guide', progress:'⭐ Progress', badges:'🏆 Badges' }[mode] || 'Al-Hayat Kids Islam');
  }
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-bank-page]');
    if (root) Bank.init(root, root.dataset.bankPage);
  });
  window.AlHayatQuestionBank = Bank;
})();
