(function () {
  function calculateBadges(questions, progress) {
    const completed = progress.completed || {};
    const byLevel = {};
    questions.forEach(q => {
      byLevel[q.level] = byLevel[q.level] || { total: 0, done: 0 };
      byLevel[q.level].total += 1;
      if (completed[q.id]) byLevel[q.level].done += 1;
    });
    return Object.keys(byLevel).map(level => {
      const row = byLevel[level];
      const pct = row.total ? Math.round((row.done / row.total) * 100) : 0;
      return {
        level: Number(level),
        title: ['','Little Muslim Starter','Daily Islam Explorer','Young Muslim Learner','Confident Muslim Kid','Islam Champion'][Number(level)],
        icon: pct >= 80 ? '🏆' : pct >= 40 ? '⭐' : '🔒',
        earned: pct >= 80,
        percent: pct,
        done: row.done,
        total: row.total
      };
    });
  }
  function nextRewardText(percent) {
    if (percent >= 80) return 'Badge earned!';
    if (percent >= 40) return 'Great progress — keep collecting stars.';
    return 'Start learning to unlock this badge.';
  }
  window.AlHayatRewards = { calculateBadges, nextRewardText };
})();
