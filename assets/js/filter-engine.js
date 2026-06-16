(function () {
  function renderFilters(container, data, onChange, initial = {}) {
    const topics = data.topics?.topics || [];
    const levels = data.levels?.levels || [];
    const types = data.topics?.filters?.questionTypes || [];
    const wrap = document.createElement('section');
    wrap.className = 'ak-filter-panel';
    wrap.innerHTML = `
      <h2>🔎 Powerful Learning Filter</h2>
      <div class="ak-filter-grid">
        <label>Level
          <select data-filter="level"><option value="">All Levels</option>${levels.map(l => `<option value="${l.levelNumber}">Level ${l.levelNumber}: ${l.title}</option>`).join('')}</select>
        </label>
        <label>Topic
          <select data-filter="topicId"><option value="">All Topics</option>${topics.map(t => `<option value="${t.id}">${t.icon} ${t.title}</option>`).join('')}</select>
        </label>
        <label>Type
          <select data-filter="type"><option value="">All Types</option>${types.map(t => `<option value="${t}">${String(t).replaceAll('_',' ')}</option>`).join('')}</select>
        </label>
        <label>Search
          <input data-filter="search" type="search" placeholder="Search: Bismillah, Salah, Qur’an..." />
        </label>
      </div>
      <div class="ak-quick-buttons">
        <button data-topic="daily_duas_adhkar">🤲 Duas</button>
        <button data-topic="salah">🕌 Salah</button>
        <button data-topic="quran_surahs">📖 Qur’an</button>
        <button data-topic="manners_character">🌸 Manners</button>
        <button data-topic="arabic_letters_words">🔤 Arabic</button>
        <button data-topic="prophet_seerah">ﷺ Seerah</button>
        <button data-clear="1">🔁 Clear</button>
      </div>`;
    const state = { level: initial.level || '', levels: initial.levels || [], topicId: initial.topicId || '', topicIds: initial.topicIds || [], type: initial.type || '', search: initial.search || '' };
    const levelEl = wrap.querySelector('[data-filter="level"]');
    const topicEl = wrap.querySelector('[data-filter="topicId"]');
    const typeEl = wrap.querySelector('[data-filter="type"]');
    const searchEl = wrap.querySelector('[data-filter="search"]');
    levelEl.value = state.level || '';
    topicEl.value = state.topicId || '';
    typeEl.value = state.type || '';
    searchEl.value = state.search || '';
    function emit() { onChange({ ...state }); }
    wrap.querySelectorAll('[data-filter]').forEach(el => {
      el.addEventListener('input', () => { updateState(el); emit(); });
      el.addEventListener('change', () => { updateState(el); emit(); });
    });
    function updateState(el){ const key = el.dataset.filter; state[key] = el.value; if (key === 'level') state.levels = []; if (key === 'topicId') state.topicIds = []; }
    wrap.querySelectorAll('[data-topic]').forEach(btn => btn.addEventListener('click', () => { state.topicId = btn.dataset.topic; state.topicIds = []; topicEl.value = state.topicId; emit(); }));
    wrap.querySelector('[data-clear]').addEventListener('click', () => { state.level = state.topicId = state.type = state.search = ''; state.levels = initial.levels || []; state.topicIds = initial.topicIds || []; wrap.querySelectorAll('[data-filter]').forEach(el => el.value = ''); emit(); });
    container.appendChild(wrap);
    return state;
  }
  function applyFilters(items, filter = {}) {
    const search = (filter.search || '').toLowerCase().trim();
    const levels = (filter.levels || []).map(String);
    const topicIds = filter.topicIds || [];
    return items.filter(q => {
      if (filter.level && String(q.level) !== String(filter.level)) return false;
      if (!filter.level && levels.length && !levels.includes(String(q.level))) return false;
      if (filter.topicId && q.topicId !== filter.topicId) return false;
      if (!filter.topicId && topicIds.length && !topicIds.includes(q.topicId)) return false;
      if (filter.type && q.type !== filter.type) return false;
      if (filter.difficulty && q.difficulty !== filter.difficulty) return false;
      if (search) {
        const blob = `${q.question} ${q.answer} ${q.topicTitle} ${q.subtopic} ${q.arabic || ''} ${q.simpleExplanation || ''}`.toLowerCase();
        if (!blob.includes(search)) return false;
      }
      return true;
    });
  }
  window.AlHayatFilters = { renderFilters, applyFilters };
})();
