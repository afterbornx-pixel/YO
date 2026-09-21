/* ==========================================================================
   BLACKGRID — project inquiry form
   Client-side validation + success state.

   TO RECEIVE REAL INQUIRIES: set FORM_ENDPOINT to a form service URL
   (Formspree, Basin, Netlify Forms handler, or your own API). While it is
   empty the form validates and shows the success state locally so the
   experience can be reviewed and demoed.
   ========================================================================== */

const FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxxx'

export function initForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  // Dev note only matters while no endpoint is configured
  if (FORM_ENDPOINT) {
    success.querySelectorAll('.form-note').forEach((n) => n.remove());
  }

  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    service: form.querySelector('#service'),
    details: form.querySelector('#details'),
  };

  function setError(field, message) {
    const wrap = field.closest('.field');
    const errorEl = wrap ? wrap.querySelector('.field-error') : null;
    if (wrap) wrap.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (message) {
      if (errorEl && errorEl.id) field.setAttribute('aria-describedby', errorEl.id);
    } else {
      field.removeAttribute('aria-describedby');
    }
  }

  function validate() {
    let ok = true;

    if (!fields.name.value.trim()) {
      setError(fields.name, 'Please enter your name');
      ok = false;
    } else {
      setError(fields.name, '');
    }

    const email = fields.email.value.trim();
    if (!email) {
      setError(fields.email, 'Please enter your email');
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(fields.email, 'Please enter a valid email');
      ok = false;
    } else {
      setError(fields.email, '');
    }

    if (!fields.service.value) {
      setError(fields.service, 'Please select a service');
      ok = false;
    } else {
      setError(fields.service, '');
    }

    if (!fields.details.value.trim()) {
      setError(fields.details, 'Tell us a little about the project');
      ok = false;
    } else {
      setError(fields.details, '');
    }

    return ok;
  }

  // Clear individual errors while typing
  Object.values(fields).forEach((field) => {
    field.addEventListener('input', () => {
      if (field.closest('.field').classList.contains('has-error')) {
        setError(field, '');
      }
    });
    field.addEventListener('change', () => setError(field, ''));
  });

  async function submit() {
    const data = new FormData(form);

    // Honeypot — silently accept, deliver nothing
    if (data.get('website')) {
      showSuccess();
      return;
    }

    if (!FORM_ENDPOINT) {
      // No backend wired yet — demo success state
      showSuccess();
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showSuccess();
    } catch (err) {
      showError('Something went wrong sending your inquiry. Please try again.');
    }
  }

  function showSuccess() {
    form.classList.add('is-hidden');
    success.classList.add('is-visible');
    success.focus?.();
  }

  function showError(message) {
    let note = form.querySelector('.form-submit-error');
    if (!note) {
      note = document.createElement('p');
      note.className = 'form-note form-submit-error';
      note.style.color = '#ff5c5c';
      form.appendChild(note);
    }
    note.textContent = message;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstBad = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstBad) firstBad.focus();
      return;
    }
    submit();
  });
}
