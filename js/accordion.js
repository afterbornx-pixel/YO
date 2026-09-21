/* ==========================================================================
   BLACKGRID — FAQ accordion
   One panel open at a time. aria-expanded + inert on closed panels.
   ========================================================================== */

export function initAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  function setOpen(item, open) {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;

    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));

    if (open) {
      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('inert');
    } else {
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('inert', '');
    }
  }

  items.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    // Initialise closed panels
    setOpen(item, item.classList.contains('is-open'));

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach((other) => setOpen(other, false));
      if (!isOpen) setOpen(item, true);
    });
  });
}
