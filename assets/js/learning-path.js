(function () {
  function daySeed() {
    const d = new Date();
    return Number(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`);
  }
  function dailyPath(questions, count = 10) {
    if (!questions || !questions.length) return [];
    const seed = daySeed();
    const picks = [];
    const topics = [...new Set(questions.map(q => q.topicId))];
    for (let i = 0; i < count; i++) {
      const topic = topics[(seed + i) % topics.length];
      const pool = questions.filter(q => q.topicId === topic);
      picks.push(pool[(seed + i * 7) % pool.length]);
    }
    return picks.filter(Boolean);
  }
  window.AlHayatLearningPath = { dailyPath };
})();
