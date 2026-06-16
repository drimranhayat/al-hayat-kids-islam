(function () {
  const KEY = 'alhayat_kids_islam_progress_v1';
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { completed: {}, stars: 0, badges: {}, lastPlayed: null }; }
    catch (e) { return { completed: {}, stars: 0, badges: {}, lastPlayed: null }; }
  }
  function write(data) { localStorage.setItem(KEY, JSON.stringify(data)); return data; }
  function complete(questionId) {
    const data = read();
    if (!data.completed[questionId]) {
      data.completed[questionId] = { at: new Date().toISOString(), stars: 1 };
      data.stars = (data.stars || 0) + 1;
    }
    data.lastPlayed = questionId;
    return write(data);
  }
  function uncomplete(questionId) {
    const data = read();
    if (data.completed[questionId]) {
      delete data.completed[questionId];
      data.stars = Math.max(0, (data.stars || 0) - 1);
    }
    return write(data);
  }
  function reset() { localStorage.removeItem(KEY); return read(); }
  function isDone(id) { return Boolean(read().completed[id]); }
  window.AlHayatProgress = { read, write, complete, uncomplete, reset, isDone, KEY };
})();
