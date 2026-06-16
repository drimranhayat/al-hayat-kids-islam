(function () {
  const Bank = {
    data: { levels: null, topics: null, questions: [] },
    loaded: false,
    basePath() {
      const path = location.pathname;
      return /\/(activities|games|practice|progress|badges|parents)\//.test(path) ? '../' : '';
    },
    async load() {
      if (this.loaded) return this.data;
      const base = this.basePath();
      const [levels, topics, ...questionFiles] = await Promise.all([
        fetch(base + 'assets/data/levels/levels.json').then(checkJson),
        fetch(base + 'assets/data/topics/topics.json').then(checkJson),
        ...[1, 2, 3, 4, 5].map(n => fetch(base + `assets/data/questions/questions-level-${n}.json`).then(checkJson))
      ]);
      this.data.levels = levels;
      this.data.topics = topics;
      this.data.questions = questionFiles.flatMap(f => f.items || []);
      this.loaded = true;
      return this.data;
    },
    initialFilter(root) {
      const topicIds = csv(root.dataset.topicIds);
      const levels = csv(root.dataset.levels).map(Number).filter(Boolean);
      return { topicIds, levels, topicId: topicIds.length === 1 ? topicIds[0] : '', level: levels.length === 1 ? String(levels[0]) : '', type: root.dataset.type || '', search: root.dataset.search || '' };
    },
    filter(filter) { return window.AlHayatFilters.applyFilters(this.data.questions, filter); },
    card(q, mode) {
      const done = window.AlHayatProgress?.isDone(q.id);
      const actionLabel = mode === 'games' ? 'Game' : mode === 'practice' ? 'Practice' : mode === 'activities' ? 'Activity' : 'Learning Task';
      const actionText = mode === 'games' ? q.game : mode === 'practice' ? q.practice : mode === 'activities' ? q.activity : `${q.activity}<br>${q.practice}<br>${q.game}`;
      const options = (q.options || []).map(o => `<button data-answer="${escapeAttr(o)}" data-correct="${String(o) === String(q.answer)}">${escapeHtml(o)}</button>`).join('');
      return `
        <article class="ak-card ${done ? 'is-done' : ''}" data-qid="${q.id}">
          <div class="ak-card-top"><span class="ak-icon">${q.symbol || '🌱'}</span><span>${escapeHtml(q.topicTitle || '')}</span><span>Level ${q.level} • Age ${q.ageRange}</span><span>${done ? '✅ Done' : '🌱 New'}</span></div>
          <h3>${escapeHtml(q.question)}</h3>
          ${q.arabic ? `<p class="ak-arabic" dir="auto">${escapeHtml(q.arabic)}</p>` : ''}
          <div class="ak-options">${options}</div>
          <p class="ak-explain"><strong>Answer:</strong> ${escapeHtml(q.answer)}</p>
          <p class="ak-action"><strong>Meaning:</strong> ${escapeHtml(q.simpleExplanation || '')}</p>
          <p class="ak-action"><strong>${actionLabel}:</strong> ${actionText}</p>
          <p class="ak-trail"><strong>Path:</strong> ${(q.childSymbolTrail || ['🌱','❓','👆','⭐','🔓']).join(' ')}</p>
          <button class="ak-complete" data-complete="${q.id}">⭐ Mark complete & unlock next</button>
          ${q.nextId ? `<small>🔓 Next: ${q.nextId}</small>` : `<small>🏆 Final card in this level.</small>`}
        </article>`;
    },
    renderCards(root, items, mode) {
      const list = root.querySelector('[data-card-list]');
      const count = root.querySelector('[data-result-count]');
      if (!list || !count) return;
      count.textContent = `${items.length} learning cards found`;
      list.innerHTML = items.slice(0, 90).map(q => this.card(q, mode)).join('');
      if (items.length > 90) list.insertAdjacentHTML('beforeend', `<p class="ak-more">Showing first 90 cards. Use filters to narrow ${items.length} results.</p>`);
    },
    renderDashboard(root, mode) {
      const total = this.data.questions.length;
      const progress = window.AlHayatProgress.read();
      const done = Object.keys(progress.completed || {}).length;
      const title = root.dataset.title || modeTitle(mode);
      const description = root.dataset.description || 'Structured Islamic learning for ages 3–8: question → activity → practice → game → star → next task.';
      const initial = this.initialFilter(root);
      const focusedItems = this.filter(initial);
      root.innerHTML = `
        <section class="ak-hero">
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(description)}</p>
          <div class="ak-stats"><span>❓ ${total} Questions</span><span>🎯 ${focusedItems.length} On this page</span><span>✅ ${done} Completed</span><span>⭐ ${progress.stars || 0} Stars</span></div>
        </section>
        <div data-filter-host></div>
        <section class="ak-daily"><h2>🌞 Today’s Learning Path</h2><p>Small connected tasks for today. Complete one card to unlock the next habit.</p><div class="ak-mini-list" data-daily-path></div></section>
        <section><div class="ak-count" data-result-count></div><div class="ak-card-list" data-card-list></div></section>`;
      const filterHost = root.querySelector('[data-filter-host]');
      let current = initial;
      window.AlHayatFilters.renderFilters(filterHost, this.data, filter => { current = { ...initial, ...filter }; this.renderCards(root, this.filter(current), mode); }, initial);
      const daily = window.AlHayatLearningPath.dailyPath(focusedItems.length ? focusedItems : this.data.questions, 8);
      root.querySelector('[data-daily-path]').innerHTML = daily.map(q => `<button data-jump-topic="${q.topicId}">${q.symbol || '🌱'} L${q.level}: ${escapeHtml(q.subtopic || q.topicTitle || 'Task')}</button>`).join('');
      this.renderCards(root, focusedItems, mode);
    },
    renderProgress(root) {
      const progress = window.AlHayatProgress.read();
      const badges = window.AlHayatRewards.calculateBadges(this.data.questions, progress);
      root.innerHTML = `
        <section class="ak-hero"><h1>${root.dataset.title || '⭐ Progress Tracker'}</h1><p>${root.dataset.description || 'Stars, completed cards, and level badges.'}</p><div class="ak-stats"><span>✅ ${Object.keys(progress.completed || {}).length} Completed</span><span>⭐ ${progress.stars || 0} Stars</span></div><button data-reset-progress>Reset progress</button></section>
        <div class="ak-badge-grid">${badges.map(b => `<article class="ak-badge"><div>${b.icon}</div><h3>Level ${b.level}: ${b.title}</h3><p>${b.done}/${b.total} completed • ${b.percent}%</p><progress value="${b.percent}" max="100"></progress><p>${window.AlHayatRewards.nextRewardText(b.percent)}</p></article>`).join('')}</div>`;
      root.querySelector('[data-reset-progress]').addEventListener('click', () => { if (confirm('Reset learning progress?')) { window.AlHayatProgress.reset(); this.renderProgress(root); } });
    },
    async init(root, mode) {
      try {
        await this.load();
        if (mode === 'progress' || mode === 'badges') this.renderProgress(root);
        else this.renderDashboard(root, mode);
        root.addEventListener('click', e => {
          const answer = e.target.closest('[data-answer]');
          if (answer) { answer.style.outline = answer.dataset.correct === 'true' ? '3px solid #42b883' : '3px solid #e76f51'; if (window.AlHayatSound) window.AlHayatSound.beep(answer.dataset.correct === 'true' ? 'success' : 'click'); }
          const btn = e.target.closest('[data-complete]');
          if (btn) { window.AlHayatProgress.complete(btn.dataset.complete); if (window.AlHayatSound) window.AlHayatSound.beep('success'); if (mode === 'progress' || mode === 'badges') this.renderProgress(root); else this.renderDashboard(root, mode); }
        });
      } catch (err) {
        root.innerHTML = `<div class="ak-error"><h2>Content could not load</h2><p>Please check that all JSON files are uploaded in /assets/data/ and are not empty.</p><pre>${escapeHtml(err.message)}</pre></div>`;
      }
    }
  };
  function csv(v) { return (v || '').split(',').map(s => s.trim()).filter(Boolean); }
  async function checkJson(r) { if (!r.ok) throw new Error(`${r.status} ${r.url}`); return r.json(); }
  function modeTitle(mode) { return ({ curriculum:'📚 Curriculum Dashboard', activities:'🎯 Activities', games:'🎮 Games', practice:'✍️ Practice Board', parents:'👨‍👩‍👧 Parent Guide', progress:'⭐ Progress', badges:'🏆 Badges' }[mode] || 'Al-Hayat Kids Islam'); }
  function escapeHtml(s) { return String(s ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])); }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, '&#39;'); }
  document.addEventListener('DOMContentLoaded', () => { const root = document.querySelector('[data-bank-page]'); if (root) Bank.init(root, root.dataset.bankPage || 'curriculum'); });
  window.AlHayatQuestionBank = Bank;
})();
