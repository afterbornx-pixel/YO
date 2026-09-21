/* ==========================================================================
   BLACKGRID — scroll effects
   Subtle parallax, process rail progress, active nav section
   ========================================================================== */

/* --- Parallax: small shift on [data-parallax] media -----------------------
   Uses the independent `translate` property so it composes cleanly with the
   reveal/hover `transform` scale on the same element. */
export function initParallax(reducedMotion) {
  if (reducedMotion) return;

  const items = document.querySelectorAll('[data-parallax]');
  if (!items.length) return;

  let ticking = false;

  function update() {
    ticking = false;
    const vh = window.innerHeight;
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -0.5..0.5-ish
      const shift = Math.max(-14, Math.min(14, progress * -24));
      el.style.translate = `0 ${shift.toFixed(2)}px`;
    });
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* --- Process rail fills as the list scrolls through ---------------------- */
export function initProcessRail() {
  const list = document.getElementById('process-list');
  const rail = document.getElementById('process-rail-progress');
  if (!list || !rail) return;

  let ticking = false;

  function update() {
    ticking = false;
    const rect = list.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const passed = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
    const pct = total > 0 ? (passed / total) * 100 : 0;
    rail.style.height = `${pct.toFixed(1)}%`;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', update);
  update();
}

/* --- Active nav link tracking -------------------------------------------- */
export function initActiveSection() {
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const map = new Map();
  links.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id && document.getElementById(id);
    if (section) map.set(section, link);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  map.forEach((_, section) => io.observe(section));
}
