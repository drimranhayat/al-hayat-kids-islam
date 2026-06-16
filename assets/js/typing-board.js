(function () {
  function setupTypingBoard(root) {
    if (!root) return;
    const input = root.querySelector('[data-typing-input]');
    const target = root.querySelector('[data-typing-target]');
    const result = root.querySelector('[data-typing-result]');
    if (!input || !target || !result) return;
    input.addEventListener('input', () => {
      const ok = input.value.trim() === target.textContent.trim();
      result.textContent = ok ? '✅ Excellent!' : '✍️ Keep trying';
      if (ok && window.AlHayatSound) window.AlHayatSound.beep('success');
    });
  }
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('[data-typing-board]').forEach(setupTypingBoard));
  window.AlHayatTypingBoard = { setupTypingBoard };
})();
