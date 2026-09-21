/* ==========================================================================
   BLACKGRID — reveal system
   Text lines, blocks, and media. Everything visible when JS/reduced motion
   is unavailable (initial hidden states live under .js in base.css).
   ========================================================================== */

export function initReveal(reducedMotion) {
  const targets = document.querySelectorAll('[data-reveal], [data-reveal-lines], [data-reveal-media]');

  const showAll = () => targets.forEach((el) => el.classList.add('is-in'));

  if (reducedMotion || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => io.observe(el));

  // Hero animates immediately on load (it is above the fold)
  requestAnimationFrame(() => {
    document
      .querySelectorAll('.hero [data-reveal], .hero [data-reveal-lines]')
      .forEach((el) => el.classList.add('is-in'));
  });
}
