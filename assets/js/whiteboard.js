(function () {
  function setupWhiteboard(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    function pos(e) {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    }
    function start(e) { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
    function move(e) { if (!drawing) return; const p = pos(e); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); }
    function end() { drawing = false; }
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive:false }); canvas.addEventListener('touchmove', move, { passive:false }); canvas.addEventListener('touchend', end);
  }
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('[data-whiteboard]').forEach(setupWhiteboard));
  window.AlHayatWhiteboard = { setupWhiteboard };
})();
