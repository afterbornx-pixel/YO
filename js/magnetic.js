/* ==========================================================================
   BLACKGRID — magnetic CTA effect
   Fine pointers + no reduced motion only. Small, restrained offset.
   ========================================================================== */

export function initMagnetic(reducedMotion) {
  if (reducedMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const MAX = 7;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.style.transition = 'transform .5s cubic-bezier(0.22, 1, 0.36, 1)';

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const tx = (x / (rect.width / 2)) * MAX;
      const ty = (y / (rect.height / 2)) * MAX;
      el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}
