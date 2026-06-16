(function () {
  let enabled = localStorage.getItem('alhayat_sound_enabled') !== 'off';
  function beep(type = 'click') {
    if (!enabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = type === 'success' ? 660 : type === 'wrong' ? 220 : 440;
      osc.frequency.value = freq;
      gain.gain.value = 0.025;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }
  function toggle() { enabled = !enabled; localStorage.setItem('alhayat_sound_enabled', enabled ? 'on' : 'off'); return enabled; }
  document.addEventListener('click', e => { if (e.target.closest('button, .ak-card')) beep('click'); });
  window.AlHayatSound = { beep, toggle, isEnabled: () => enabled };
})();
