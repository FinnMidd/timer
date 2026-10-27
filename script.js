const digits = [...document.querySelectorAll('.digit')];
const dateEl = document.getElementById('date');

digits.forEach(d => {
  d.innerHTML =
    '<div class="half top"><span></span></div>' +
    '<div class="half bottom"><span></span></div>' +
    '<div class="half flip-top"><span></span></div>' +
    '<div class="half flip-bottom"><span></span></div>';
});

const text = (d, sel) => d.querySelector(sel + ' span');

function setDigit(d, val) {
  const old = d.dataset.v;
  if (old === val) return;
  d.dataset.v = val;
  if (old === undefined) {
    ['.top', '.bottom', '.flip-top', '.flip-bottom'].forEach(s => text(d, s).textContent = val);
    return;
  }
  text(d, '.top').textContent = val;
  text(d, '.bottom').textContent = old;
  text(d, '.flip-top').textContent = old;
  text(d, '.flip-bottom').textContent = val;
  d.classList.remove('flipping');
  void d.offsetWidth; // restart animation
  d.classList.add('flipping');
  d.querySelector('.flip-bottom').onanimationend = () => {
    text(d, '.bottom').textContent = val;
    d.classList.remove('flipping');
  };
}

function tick() {
  const now = new Date();
  const t = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(n => String(n).padStart(2, '0')).join('');
  digits.forEach((d, i) => setDigit(d, t[i]));
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  setTimeout(tick, 1000 - now.getMilliseconds());
}
tick();

// Theme: follow the device unless the user has picked one
const root = document.documentElement;
const mq = matchMedia('(prefers-color-scheme: dark)');
const themeBtn = document.getElementById('theme');
const isDark = () => (root.dataset.theme || (mq.matches ? 'dark' : 'light')) === 'dark';
const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const ICONS = {
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: svg('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>'),
  expand: svg('<path d="M9 4H6a2 2 0 0 0-2 2v3M15 4h3a2 2 0 0 1 2 2v3M9 20H6a2 2 0 0 1-2-2v-3M15 20h3a2 2 0 0 0 2-2v-3"/>'),
  compress: svg('<path d="M4 9h3a2 2 0 0 0 2-2V4M20 9h-3a2 2 0 0 1-2-2V4M4 15h3a2 2 0 0 1 2 2v3M20 15h-3a2 2 0 0 0-2 2v3"/>')
};
const updateLabel = () => {
  themeBtn.innerHTML = (isDark() ? ICONS.sun : ICONS.moon) + `<span>${isDark() ? 'Light mode' : 'Dark mode'}</span>`;
};
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
} catch (e) {}
updateLabel();
mq.addEventListener('change', updateLabel);
themeBtn.onclick = () => {
  root.dataset.theme = isDark() ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  updateLabel();
};

// Fullscreen
const fsBtn = document.getElementById('fs');
fsBtn.onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
};
const updateFs = () => {
  const on = !!document.fullscreenElement;
  fsBtn.innerHTML = (on ? ICONS.compress : ICONS.expand) + `<span>${on ? 'Exit fullscreen' : 'Fullscreen'}</span>`;
};
document.addEventListener('fullscreenchange', updateFs);
updateFs();
