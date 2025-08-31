(function(){
  // Current year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mark active link
  const links = document.querySelectorAll('#primary-nav a[href]');
  const here = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });

  // Theme toggle with prefers-color-scheme + localStorage
  const key = 'hamzah-theme';
  const btn = document.getElementById('themeToggle');
  const getSys = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light';
  const applyTheme = (t) => { document.documentElement.dataset.theme = t; };
  const initial = localStorage.getItem(key) || getSys();
  applyTheme(initial);
  if (btn){
    btn.addEventListener('click', () => {
      const next = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark';
      applyTheme(next); localStorage.setItem(key, next);
    });
  }

  // Basic contact form guard (prevents empty mailto submissions)
  const form = document.getElementById('contactForm');
  if (form){
    form.addEventListener('submit', (e) => {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const msg = document.getElementById('message').value.trim();
      if (!name || !email || !msg){
        e.preventDefault();
        alert('Please fill out all fields before sending.');
      }
    });
  }
})();
