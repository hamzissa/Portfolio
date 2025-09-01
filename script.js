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

  // --- Contact form guard (mailto) ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      const name = (document.getElementById('name')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const msg = (document.getElementById('message')?.value || '').trim();
      if (!name || !email || !msg) {
        e.preventDefault();
        alert('Please fill out all fields before sending.');
      }
    });
  }
})();
// Contact form -> mailto

