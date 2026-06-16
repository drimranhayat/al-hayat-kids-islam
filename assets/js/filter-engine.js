(function () {
  function renderFilters(container, data, onChange) {
    const topics = data.topics?.topics || [];
    const levels = data.levels?.levels || [];
    const types = data.topics?.filters?.questionTypes || [];
    const wrap = document.createElement('section');
    wrap.className = 'ak-filter-panel';
    wrap.innerHTML = `
      <div class="ak-filter-grid">
        <label>Level
          <select data-filter="level"><option value="">All Levels</option>${levels.map(l => `<option value="${l.levelNumber}">Level ${l.levelNumber}: ${l.title}</option>`).join('')}</select>
        </label>
        <label>Topic
          <select data-filter="topicId"><option value="">All Topics</option>${topics.map(t => `<option value="${t.id}">${t.icon} ${t.title}</option>`).join('')}</select>
        </label>
        <label>Type
          <select data-filter="type"><option value="">All Types</option>${types.map(t => `<option value="${t}">${t.replaceAll('_',' ')}</option>`).join('')}</select>
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
        <button data-clear="1">🔁 Clear</button>
      </div>
    `;
    const state = { level: '', topicId: '', type: '', search: '' };
    function emit() { onChange({ ...state }); }
    wrap.querySelectorAll('[data-filter]').forEach(el => {
      el.addEventListener('input', () => { state[el.dataset.filter] = el.value; emit(); });
      el.addEventListener('change', () => { state[el.dataset.filter] = el.value; emit(); });
    });
    wrap.querySelectorAll('[data-topic]').forEach(btn => btn.addEventListener('click', () => {
      state.topicId = btn.dataset.topic;
      wrap.querySelector('[data-filter="topicId"]').value = state.topicId;
      emit();
    }));
    wrap.querySelector('[data-clear]').addEventListener('click', () => {
      state.level = state.topicId = state.type = state.search = '';
      wrap.querySelectorAll('[data-filter]').forEach(el => el.value = '');
      emit();
    });
    container.appendChild(wrap);
    return state;
  }
  function applyFilters(items, filter) {
    const search = (filter.search || '').toLowerCase().trim();
    return items.filter(q => {
      if (filter.level && String(q.level) !== String(filter.level)) return false;
      if (filter.topicId && q.topicId !== filter.topicId) return false;
      if (filter.type && q.type !== filter.type) return false;
      if (search) {
        const blob = `${q.question} ${q.answer} ${q.topicTitle} ${q.subtopic} ${q.arabic || ''}`.toLowerCase();
        if (!blob.includes(search)) return false;
      }
      return true;
    });
  }
  window.AlHayatFilters = { renderFilters, applyFilters };
})();
