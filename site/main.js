// outfitspin landing · small interactions, no dependencies
document.documentElement.classList.add('js');

/* ---- hero demo: spin slots ◀ ▶ (mirrors src/components/today/SlotRow) ---- */
const closet = [
  [ // top
    { n: 'cream cable knit', g: 'g-sweater', c: '#F1E4CF' },
    { n: 'pink boxy tee', g: 'g-tee', c: '#FF4D8D' },
    { n: 'navy oxford shirt', g: 'g-jacket', c: '#34416B' },
  ],
  [ // bottom
    { n: 'wide-leg jeans', g: 'g-pants', c: '#5B7BB5' },
    { n: 'black tailored trousers', g: 'g-pants', c: '#311938' },
    { n: 'lilac midi skirt', g: 'g-skirt', c: '#B79CFF' },
  ],
  [ // shoes
    { n: 'white leather sneakers', g: 'g-shoe', c: '#F5F0E6' },
    { n: 'brown loafers', g: 'g-shoe', c: '#8A5A3C' },
    { n: 'mint runners', g: 'g-shoe', c: '#3FD9B0' },
  ],
  [ // outerwear
    { n: 'beige trench', g: 'g-coat', c: '#E8D9C0' },
    { n: 'grape bomber', g: 'g-jacket', c: '#7A4DFF' },
  ],
];
const whys = [
  '“smart up top for the call, the trench has you covered when it rains at 6.”',
  '“same energy, softer shoes. you’ll be on your feet at dinner.”',
  '“a bit bolder for the evening, still sharp enough for the call.”',
];
const idx = [0, 0, 0, 0];
const demo = document.getElementById('demo');

function renderSlot(i, dir) {
  const row = demo.querySelector(`.slot[data-slot="${i}"]`);
  const item = closet[i][idx[i]];
  row.querySelector('.thumb svg').innerHTML = `<use href="#${item.g}"/>`;
  row.querySelector('.thumb svg').style.color = item.c;
  row.querySelector('.slot-txt b').textContent = item.n;
  row.style.setProperty('--from', dir > 0 ? '30px' : '-30px');
  row.classList.remove('spinning'); void row.offsetWidth; row.classList.add('spinning');
  const match = document.getElementById('match');
  match.textContent = 86 + ((idx.reduce((a, b) => a + b, 0) * 3) % 12);
  document.getElementById('why').textContent = whys[(idx[0] + idx[1] + idx[2]) % whys.length];
}
function spin(i, dir) {
  const len = closet[i].length;
  idx[i] = (idx[i] + dir + len) % len;
  renderSlot(i, dir);
}
if (demo) {
  closet.forEach((_, i) => { const it = closet[i][0]; const s = demo.querySelector(`.slot[data-slot="${i}"] .thumb svg`); s.style.color = it.c; });
  let auto = true;
  demo.addEventListener('click', (e) => {
    const b = e.target.closest('.arrow');
    if (!b) return;
    auto = false;
    spin(Number(b.closest('.slot').dataset.slot), Number(b.dataset.dir));
  });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    let t = 0;
    setInterval(() => { if (!auto || document.hidden) return; spin(t % 3 === 2 ? 2 : t % 3, 1); t++; }, 2600);
  }
}

/* ---- pricing toggle ---- */
const notes = { monthly: 'billed monthly, cancel any time', yearly: 'that’s €3.33 a month, billed yearly' };
document.querySelectorAll('.bill-opt').forEach((b) => b.addEventListener('click', () => {
  const mode = b.dataset.bill;
  document.querySelectorAll('.bill-opt').forEach((o) => { const on = o === b; o.classList.toggle('on', on); o.setAttribute('aria-pressed', on); });
  ['plus-price', 'plus-per'].forEach((id) => { const el = document.getElementById(id); el.textContent = el.dataset[mode]; });
  document.getElementById('plus-note').textContent = notes[mode];
}));

/* ---- waitlist (frontend only, nothing is sent) ---- */
const form = document.getElementById('waitlist');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const msg = document.getElementById('form-msg');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = 'hmm, that email looks a bit off. try again?';
    msg.className = 'form-msg bad';
    form.classList.remove('error'); void form.offsetWidth; form.classList.add('error');
    return;
  }
  msg.textContent = 'you’re on the list ✨ we’ll email you when your invite is ready.';
  msg.className = 'form-msg ok';
  form.reset();
});

/* ---- reveal on scroll ---- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
document.querySelectorAll('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
