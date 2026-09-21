/* ==========================================================================
   BLACKGRID — main bootstrap
   ========================================================================== */

import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initHeroGrid } from './hero-grid.js';
import { initMagnetic } from './magnetic.js';
import { initAccordion } from './accordion.js';
import { initForm } from './form.js';
import { initParallax, initProcessRail, initActiveSection } from './effects.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function boot() {
  initNav();
  initReveal(reducedMotion);
  initHeroGrid(reducedMotion);
  initMagnetic(reducedMotion);
  initAccordion();
  initForm();
  initParallax(reducedMotion);
  initProcessRail();
  initActiveSection();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
