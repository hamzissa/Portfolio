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
  const key = 'hamzah-theme';
  const btn = document.getElementById('themeToggle');

  const getSys = () =>
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
          ? 'dark' : 'light';

  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    if (btn) btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
  };

  const stored = localStorage.getItem(key);
  applyTheme(stored || getSys());

  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || getSys();
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(key, next);
    });
  }

  // Follow system changes only if user hasn't chosen manually
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (mq) {
    mq.addEventListener('change', (e) => {
      if (!localStorage.getItem(key)) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  // --- Contact form handling ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = (document.getElementById('name')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const msg = (document.getElementById('message')?.value || '').trim();
      
      if (!name || !email || !msg) {
        alert('Please fill out all required fields.');
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
          alert('Thank you! Your message has been sent successfully. I\'ll get back to you soon.');
        } else {
          alert('Oops! Something went wrong. Please try again or email me directly.');
        }
      } catch {
        alert('Network error. Please check your connection and try again.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // --- Smooth scroll for internal links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Performance: Lazy load images ---
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  // --- Accessibility: Skip to main content ---
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = 'position:absolute;top:-40px;left:0;background:var(--brand);color:#fff;padding:8px;z-index:100;text-decoration:none';
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add id to main if not present
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
    main.setAttribute('tabindex', '-1');
  }

  // --- Analytics: Track CTA clicks ---
  document.querySelectorAll('a[href*="projects"], a[href*=".pdf"], a[href*="github"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const linkText = this.textContent.trim();
      const linkHref = this.getAttribute('href');
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'CTA',
          'event_label': linkText,
          'value': linkHref
        });
      }
    });
  });
})();

