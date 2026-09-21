/* ==========================================================================
   BLACKGRID — navigation
   Sticky compact state, mobile menu, keyboard support
   ========================================================================== */

export function initNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!header || !toggle || !menu) return;

  /* --- Compact header on scroll ------------------------------------------ */
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Mobile menu ------------------------------------------------------- */
  const menuLinks = menu.querySelectorAll('nav a, .btn');
  let open = false;

  const focusable = () =>
    menu.querySelectorAll('a[href], button:not([disabled])');

  function setMenu(state) {
    open = state;
    toggle.setAttribute('aria-expanded', String(state));
    toggle.setAttribute('aria-label', state ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!state));
    menu.classList.toggle('is-open', state);
    document.body.classList.toggle('menu-open', state);
    if (state) {
      menu.removeAttribute('inert');
    } else {
      menu.setAttribute('inert', '');
    }

    // Stagger link entrance
    menu.querySelectorAll('nav a').forEach((link, i) => {
      link.style.transitionDelay = state ? `${0.08 + i * 0.05}s` : '0s';
    });

    if (state) {
      const first = focusable()[0];
      if (first) first.focus({ preventScroll: true });
    } else {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', () => setMenu(!open));

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (open) setMenu(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      setMenu(false);
      return;
    }

    // Simple focus trap
    if (e.key === 'Tab') {
      const items = [toggle, ...focusable()];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Reset on resize to desktop
  const desktop = window.matchMedia('(min-width: 1025px)');
  desktop.addEventListener('change', (e) => {
    if (e.matches && open) setMenu(false);
  });
}
