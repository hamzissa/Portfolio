(function () {
  // --- Footer year ---
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // --- Mark active link ---
  const links = document.querySelectorAll('#primary-nav a[href]');
  const here = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  // --- Theme toggle (with system preference + persistence) ---
  // The initial theme is set by an inline script in <head> to avoid a flash.
  const key = 'hamzah-theme';
  const btn = document.getElementById('themeToggle');

  const getStored = () => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const setStored = (t) => {
    try { localStorage.setItem(key, t); } catch { /* storage unavailable */ }
  };
  const getSys = () =>
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
          ? 'light' : 'dark';

  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    if (btn) btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
  };

  applyTheme(document.documentElement.dataset.theme || getStored() || getSys());

  if (btn) {
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStored(next);
    });
  }

  // Follow system changes only if user hasn't chosen manually
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
  if (mq) {
    mq.addEventListener('change', (e) => {
      if (!getStored()) applyTheme(e.matches ? 'light' : 'dark');
    });
  }

  // --- Contact form handling ---
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    const showStatus = (text, kind) => {
      if (!status) return;
      status.textContent = text;
      status.className = 'form-status ' + kind;
      status.hidden = false;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fields = ['name', 'email', 'message'].map(id => document.getElementById(id));
      let firstInvalid = null;
      fields.forEach(field => {
        const valid = field.value.trim() !== '' && field.checkValidity();
        field.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        const emailField = document.getElementById('email');
        showStatus(
          firstInvalid === emailField && emailField.value.trim()
            ? 'Please enter a valid email address.'
            : 'Please fill out all required fields.',
          'error'
        );
        firstInvalid.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          fields.forEach(field => field.removeAttribute('aria-invalid'));
          showStatus('Thank you! Your message has been sent. I\'ll get back to you soon.', 'success');
        } else {
          showStatus('Oops! Something went wrong. Please try again or email me directly.', 'error');
        }
      } catch {
        showStatus('Network error. Please check your connection and try again.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // --- Analytics: Track CTA clicks ---
  document.querySelectorAll('main a[href*="projects"], a[href$=".pdf"], a[href*="github.com"]').forEach(link => {
    link.addEventListener('click', function () {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          link_text: this.textContent.trim(),
          link_url: this.href
        });
      }
    });
  });
})();
