import { ANIMALS, TIERS } from './animals.js';

// ---------- Constants ----------
const ATTR_KEYS = ['speed', 'agility', 'intelligence', 'power', 'reflexes'];
const MAX_ATTR = 100;
const BUDGET = 250;

// ---------- Persistent state ----------
const STORAGE_KEY = 'haka:v2';
const defaultState = () => ({
  loggedIn: false,
  username: 'Steve_Hick',
  email: '',
  password: '',
  bluetooth: false,
  wifi: false,
  location: false,
  selected: 'dragonfly',
  attrs: { speed: 50, agility: 50, intelligence: 50, power: 50, reflexes: 50 },
  points: 15,
  matches: 0,
  wins: 0,
  history: [],
  loginAnimal: 'eagle',
});

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch { return defaultState(); }
};
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
let state = load();

// ---------- DOM helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const h = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v === false || v == null) {}
    else el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
};
const svgWrap = (markup) => {
  const span = document.createElement('span');
  span.innerHTML = markup;
  return span.firstElementChild;
};

const toast = (msg) => {
  const t = h('div', { class: 'toast' }, msg);
  $('#phone').appendChild(t);
  setTimeout(() => t.remove(), 2200);
};

// ---------- Status bar clock ----------
const tickClock = () => {
  const d = new Date();
  $('.sb-clock').textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};
tickClock();
setInterval(tickClock, 30_000);

// ---------- Router ----------
const view = $('#view');
const dock = $('#dock');

const total = () => Object.values(state.attrs).reduce((a, b) => a + b, 0);
const isUnlocked = (key) => state.points >= ANIMALS[key].unlock;

const LOGIN_ANIMALS = ['eagle', 'dragonfly', 'frog', 'squid', 'mantaray', 'butterfly', 'bee', 'snake'];

const routes = {};

const navigate = (name) => {
  view.innerHTML = '';
  if (!state.loggedIn && name !== 'login') name = 'login';
  routes[name]?.();
  // Dock visibility
  const showDock = state.loggedIn && name !== 'login';
  dock.hidden = !showDock;
  if (showDock) {
    [...dock.querySelectorAll('button')].forEach(b => b.classList.toggle('active', b.dataset.go === name));
  }
  state._route = name;
};

dock.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-go]');
  if (b) navigate(b.dataset.go);
});

// ---------- LOGIN ----------
routes.login = () => {
  const animalKey = state.loginAnimal;
  const screen = h('section', { class: 'screen login' },
    h('div', { class: 'bg pink' }),
    h('div', { class: 'hero' },
      h('button', { class: 'arrow left', 'aria-label': 'previous animal',
        onclick: () => { cycleLoginAnimal(-1); navigate('login'); } }, '‹'),
      svgWrap(ANIMALS[animalKey].svg()),
      h('button', { class: 'arrow right', 'aria-label': 'next animal',
        onclick: () => { cycleLoginAnimal(1); navigate('login'); } }, '›'),
    ),
    h('form', { class: 'form', onsubmit: (e) => { e.preventDefault(); doLogin(false); } },
      h('label', { class: 'field' },
        svgWrap(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="white" stroke-width="1.5" d="M3 6h18v12H3z M3 6l9 7 9-7"/></svg>`),
        h('input', { type: 'email', name: 'email', placeholder: 'Email adress', required: true, value: state.email }),
      ),
      h('label', { class: 'field' },
        svgWrap(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="white" stroke-width="1.5" d="M6 11V8a6 6 0 1 1 12 0v3 M5 11h14v9H5z"/></svg>`),
        h('input', { type: 'password', name: 'password', placeholder: 'Password', required: true, value: state.password }),
      ),
      h('div', { class: 'actions' },
        h('button', { type: 'submit', class: 'btn-ghost' }, 'LOGIN'),
        h('button', { type: 'button', class: 'btn-ghost',
          onclick: () => doLogin(true) }, 'SIGN UP'),
      ),
      h('div', { class: 'connect' }, 'CONNECT WITH'),
      h('div', { class: 'socials' },
        h('button', { type: 'button', class: 'social', title: 'Facebook',
          onclick: () => doLogin(true, 'facebook@haka.app') }, 'f'),
        h('button', { type: 'button', class: 'social', title: 'Google',
          onclick: () => doLogin(true, 'google@haka.app') }, 'G+'),
      ),
    ),
  );
  // Sync inputs back to state on input
  screen.addEventListener('input', (e) => {
    const t = e.target;
    if (t.name === 'email') state.email = t.value;
    if (t.name === 'password') state.password = t.value;
    save();
  });
  view.appendChild(screen);
};

const cycleLoginAnimal = (dir) => {
  const i = LOGIN_ANIMALS.indexOf(state.loginAnimal);
  const next = LOGIN_ANIMALS[(i + dir + LOGIN_ANIMALS.length) % LOGIN_ANIMALS.length];
  state.loginAnimal = next;
  // If new login animal is unlocked, also pre-select it
  if (isUnlocked(next)) state.selected = next;
  save();
};

const doLogin = (isSignup, prefilledEmail = null) => {
  const form = view.querySelector('form');
  const email = prefilledEmail || form?.email?.value || state.email;
  const password = form?.password?.value || state.password;
  if (!email || !password) {
    if (!prefilledEmail) { toast('Enter email and password'); return; }
  }
  state.loggedIn = true;
  state.email = email;
  if (isSignup) {
    state.username = (email.split('@')[0] || 'Player').replace(/[^a-zA-Z0-9_]/g,'_');
  }
  // Pick whatever animal was on the carousel, if unlocked
  if (isUnlocked(state.loginAnimal)) state.selected = state.loginAnimal;
  save();
  navigate('home');
  toast(isSignup ? `Welcome, ${state.username}` : 'Logged in');
};

// ---------- HOME ----------
routes.home = () => {
  const screen = h('section', { class: 'screen home' },
    h('div', { class: 'bg teal' }),
    h('button', { class: 'gear', 'aria-label': 'settings', onclick: () => navigate('settings') },
      svgWrap(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="1.4"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 12a7.4 7.4 0 0 0-.1-1.4l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-2.4-1.4L14 2.5h-4l-.5 2.7a7.5 7.5 0 0 0-2.4 1.4l-2.4-1-2 3.5 2 1.5a7.4 7.4 0 0 0 0 2.8l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 2.4 1.4l.5 2.7h4l.5-2.7a7.5 7.5 0 0 0 2.4-1.4l2.4 1 2-3.5-2-1.5c.1-.5.1-.9.1-1.4z"/></svg>`)),
    h('h1', { class: 'title' }, 'Haka!'),
    h('div', { class: 'animal', onclick: () => navigate('battle') }, svgWrap(ANIMALS[state.selected].svg())),
    h('div', { class: 'score' }, String(total())),
    h('div', { class: 'swipe-hint' }, '⌄'),
  );
  view.appendChild(screen);
  attachSwipe(screen, {
    down: () => navigate('battle'),
    up:   () => navigate('stats'),
    left: () => navigate('attributes'),
    right:() => navigate('roster'),
  });
};

// ---------- SETTINGS ----------
routes.settings = () => {
  const tgl = (label, key) => h('div', { class: 'toggle-row' },
    h('span', { class: 'label' }, label),
    h('button', {
      class: 'tgl',
      'aria-checked': String(state[key]),
      onclick: (e) => {
        state[key] = !state[key];
        save();
        e.currentTarget.setAttribute('aria-checked', String(state[key]));
        toast(`${label}: ${state[key] ? 'on' : 'off'}`);
      }
    })
  );

  const screen = h('section', { class: 'screen settings' },
    h('div', { class: 'bg teal' }),
    h('button', { class: 'gear', 'aria-label': 'back', onclick: () => navigate('home') },
      svgWrap(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="1.6"><path d="M15 5l-7 7 7 7"/></svg>`)),
    h('div', { class: 'username-row' },
      h('input', { class: 'username', value: state.username, oninput: (e) => { state.username = e.target.value || 'Player'; save(); } }),
    ),
    h('button', { class: 'change-pw', onclick: openChangePassword }, 'change password'),
    h('div', { class: 'watermark' }, svgWrap(ANIMALS[state.selected].svg())),
    h('div', { class: 'toggles' },
      tgl('BLUETOOTH', 'bluetooth'),
      tgl('WIFI', 'wifi'),
      tgl('LOCATION', 'location'),
    ),
    h('div', { class: 'credit' }, '© by JUFL'),
  );
  view.appendChild(screen);
};

const openChangePassword = () => {
  const old = h('input', { type: 'password', placeholder: 'current' });
  const nw  = h('input', { type: 'password', placeholder: 'new' });
  const modal = h('div', { class: 'modal-backdrop' },
    h('div', { class: 'modal' },
      h('h3', {}, 'Change password'),
      h('div', { class: 'row' }, h('label', {}, 'Current password'), old),
      h('div', { class: 'row' }, h('label', {}, 'New password'), nw),
      h('div', { class: 'modal-actions' },
        h('button', { onclick: () => modal.remove() }, 'Cancel'),
        h('button', { class: 'primary', onclick: () => {
          if (old.value !== state.password) { toast('Wrong current password'); return; }
          if (!nw.value) { toast('Enter a new password'); return; }
          state.password = nw.value; save(); modal.remove(); toast('Password changed');
        }}, 'Save'),
      ),
    ),
  );
  $('#phone').appendChild(modal);
};

// ---------- STATS ----------
routes.stats = () => {
  const winPct = state.matches ? Math.round(100 * state.wins / state.matches) : 0;
  const seriesPoints = chartPoints(state.history);

  const screen = h('section', { class: 'screen stats' },
    h('div', { class: 'bg teal' }),
    h('button', { class: 'gear', 'aria-label': 'home', onclick: () => navigate('home') },
      svgWrap(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="1.6"><path d="M5 15l7-7 7 7"/></svg>`)),
    h('div', { class: 'up' }, '⌃'),
    h('div', { class: 'points' },
      h('span', { class: 'num' }, String(state.points)),
      h('span', { class: 'lbl' }, 'Points'),
    ),
    h('div', { class: 'kpis' },
      h('div', { class: 'kpi' }, h('div', { class: 'k-lbl' }, 'Win percentage'), h('div', { class: 'k-val' }, `${winPct}%`)),
      h('div', { class: 'kpi' }, h('div', { class: 'k-lbl' }, 'Matches played'), h('div', { class: 'k-val' }, String(state.matches))),
    ),
    h('div', { class: 'chart' },
      h('div', { class: 'watermark' }, svgWrap(ANIMALS[state.selected].svg())),
      svgWrap(`<svg viewBox="0 0 320 160" preserveAspectRatio="none"><polyline fill="none" stroke="white" stroke-width="1.6" stroke-linejoin="round" points="${seriesPoints}"/><line x1="0" y1="159" x2="320" y2="159" stroke="white" stroke-width="1.2"/><line x1="0.6" y1="0" x2="0.6" y2="159" stroke="white" stroke-width="1.2"/></svg>`),
    ),
    h('div', { class: 'ctas' },
      h('button', { class: 'cta invite', onclick: invite }, 'Invite a friend for 3 points'),
      h('div', { class: 'row' },
        h('button', { class: 'cta', onclick: morePoints }, 'more points'),
        h('button', { class: 'cta', onclick: () => toast('Ad-free (demo)') }, 'remove ads'),
      ),
    ),
    h('div', { class: 'credit' }, '© by JUFL'),
  );
  view.appendChild(screen);
  attachSwipe(screen, { down: () => navigate('home') });
};

const chartPoints = (history) => {
  const pts = history.slice(-12);
  if (pts.length < 2) return '0,140 60,120 120,130 180,90 240,110 300,40';
  const min = Math.min(...pts), max = Math.max(...pts);
  const span = Math.max(1, max - min);
  return pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * 320;
    const y = 150 - ((v - min) / span) * 130;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
};

const invite = () => {
  state.points += 3;
  state.history.push(state.points);
  save();
  toast('+3 points!');
  navigate('stats');
};

const morePoints = () => {
  state.points += 10;
  state.history.push(state.points);
  save();
  toast('+10 points (demo IAP)');
  navigate('stats');
};

// ---------- ATTRIBUTES ----------
// Drag one slider past the available budget and the rest of the sliders
// shrink simultaneously to keep total ≤ BUDGET.
const rebalanceAttrs = (changedKey, newValue) => {
  newValue = Math.max(0, Math.min(MAX_ATTR, newValue));
  const others = ATTR_KEYS.filter(k => k !== changedKey);
  const otherSum = others.reduce((a, k) => a + state.attrs[k], 0);
  let excess = newValue + otherSum - BUDGET;
  state.attrs[changedKey] = newValue;
  if (excess <= 0) return;

  // Each pass, take from non-zero others proportionally to their share.
  let guard = 0;
  while (excess > 0 && guard++ < 12) {
    const pool = others.reduce((a, k) => a + state.attrs[k], 0);
    if (pool === 0) break;
    let taken = 0;
    for (const k of others) {
      if (excess <= 0) break;
      const share = state.attrs[k] / pool;
      const grab = Math.min(state.attrs[k], Math.ceil(excess * share));
      state.attrs[k] -= grab;
      taken += grab;
      excess -= grab;
    }
    if (taken === 0) break;
  }
};

const syncSliderDom = () => {
  for (const k of ATTR_KEYS) {
    const el = document.querySelector(`.slider[data-key="${k}"]`);
    if (el && +el.value !== state.attrs[k]) el.value = String(state.attrs[k]);
    const v = document.querySelector(`.slider-row[data-key="${k}"] .val`);
    if (v) v.textContent = state.attrs[k];
  }
  const tot = total();
  const t = document.getElementById('attr-total');
  if (t) t.textContent = tot;
  const b = document.getElementById('attr-budget');
  if (b) b.textContent = `${tot} / ${BUDGET}`;
};

routes.attributes = () => {
  const row = (label, key) => h('div', { class: 'slider-row', 'data-key': key },
    h('div', { class: 'lbl' },
      h('span', {}, label),
      h('span', { class: 'val' }, String(state.attrs[key])),
    ),
    h('input', {
      class: 'slider', type: 'range', min: '0', max: String(MAX_ATTR), step: '1',
      value: String(state.attrs[key]),
      'data-key': key,
      oninput: (e) => {
        rebalanceAttrs(key, parseInt(e.target.value, 10));
        save();
        syncSliderDom();
      }
    }),
  );
  const screen = h('section', { class: 'screen attributes' },
    h('div', { class: 'bg teal' }),
    h('button', { class: 'gear', 'aria-label': 'home', onclick: () => navigate('home') },
      svgWrap(`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="1.6"><path d="M5 15l7-7 7 7"/></svg>`)),
    h('div', { class: 'attr-budget', id: 'attr-budget' }, `${total()} / ${BUDGET}`),
    h('div', { class: 'up', id: 'attr-total' }, String(total())),
    h('div', { class: 'watermark' }, svgWrap(ANIMALS[state.selected].svg())),
    h('div', { class: 'sliders' },
      row('SPEED', 'speed'),
      row('AGILITY', 'agility'),
      row('INTELLIGENCE', 'intelligence'),
      row('POWER', 'power'),
      row('REFLEXES', 'reflexes'),
    ),
  );
  view.appendChild(screen);
  attachSwipe(screen, { down: () => navigate('home') });
};

// ---------- BATTLE ----------
const OPPONENTS = [
  { name: 'FabioX14', key: 'dragonfly', attrs: null },
  { name: 'Reymondo', key: 'mantaray',  attrs: null },
  { name: 'Alice 98', key: 'squid',     attrs: null },
  { name: 'KaiBee',   key: 'bee',       attrs: null },
  { name: 'Vipera',   key: 'snake',     attrs: null },
  { name: 'Tane',     key: 'eagle',     attrs: null },
];

// Generate 5 attrs in [0..MAX_ATTR] summing close to `target` (default = BUDGET).
const randomAttrs = (target = BUDGET) => {
  // Dirichlet-style: pick 5 uniform reals, normalize, then round + repair.
  const r = ATTR_KEYS.map(() => Math.random() + 0.15); // +0.15 to avoid extremes
  const s = r.reduce((a, b) => a + b, 0);
  const vals = r.map(x => Math.max(0, Math.min(MAX_ATTR, Math.round(x / s * target))));
  let sum = vals.reduce((a, b) => a + b, 0);
  // Repair rounding so sum lands on target
  let safety = 50;
  while (sum !== target && safety-- > 0) {
    const dir = Math.sign(target - sum);
    const i = Math.floor(Math.random() * vals.length);
    const next = vals[i] + dir;
    if (next >= 0 && next <= MAX_ATTR) { vals[i] = next; sum += dir; }
  }
  const out = {};
  ATTR_KEYS.forEach((k, i) => { out[k] = vals[i]; });
  return out;
};

const reshuffleOpponents = () => {
  for (const o of OPPONENTS) {
    // Vary the budget slightly so some opponents feel stronger/weaker.
    o.attrs = randomAttrs(BUDGET + Math.floor((Math.random() - 0.5) * 40));
  }
};

let oppIndex = 1;
reshuffleOpponents();

routes.battle = () => {
  reshuffleOpponents();
  const track = h('div', { class: 'opp-track', id: 'opp-track' },
    ...OPPONENTS.map((o, i) =>
      h('div', { class: 'opp' + (i === oppIndex ? ' active' : ''), 'data-i': i,
                 onclick: () => setOpp(i) },
        svgWrap(ANIMALS[o.key].svg()),
        h('div', { class: 'name' }, o.name),
      )
    ),
  );
  track.style.setProperty('--idx', oppIndex);
  track.style.setProperty('--total', OPPONENTS.length);

  const counter = h('div', { class: 'counter' },
    h('button', { class: 'bump', onclick: () => bump(-1) }, '−'),
    h('div', { class: 'num', id: 'battle-counter' }, String(state.points)),
    h('button', { class: 'bump', onclick: () => bump(1) }, '+'),
  );

  const screen = h('section', { class: 'screen battle' },
    h('div', { class: 'bg slate' }),
    h('div', { class: 'opponents' }, track),
    h('div', { class: 'arena' },
      h('button', { class: 'fight', onclick: fight }, 'FIGHT'),
      counter,
      h('div', { class: 'my-animal' }, svgWrap(ANIMALS[state.selected].svg())),
      h('div', { class: 'swipe-hint' }, '⌄'),
    ),
  );
  view.appendChild(screen);

  attachSwipe(screen, {
    down: () => navigate('roster'),
    up:   () => navigate('home'),
    left: () => setOpp((oppIndex + 1) % OPPONENTS.length),
    right:() => setOpp((oppIndex - 1 + OPPONENTS.length) % OPPONENTS.length),
  });

  // Carousel swipe inside the opponents strip (separate from full-screen swipe)
  attachSwipe($('.opponents', screen), {
    left:  () => setOpp((oppIndex + 1) % OPPONENTS.length),
    right: () => setOpp((oppIndex - 1 + OPPONENTS.length) % OPPONENTS.length),
  });
};

const setOpp = (i) => {
  oppIndex = i;
  const track = document.getElementById('opp-track');
  if (!track) return;
  track.style.setProperty('--idx', oppIndex);
  for (const el of track.querySelectorAll('.opp')) {
    el.classList.toggle('active', +el.dataset.i === oppIndex);
  }
};

const bump = (d) => {
  const next = Math.max(0, state.points + d);
  state.points = next;
  state.history.push(state.points);
  save();
  $('#battle-counter').textContent = state.points;
};

let battling = false;

const fight = () => {
  if (battling) return;
  if (!state.bluetooth && !state.wifi) {
    toast('Enable Bluetooth or WiFi in Settings');
    return;
  }
  battling = true;
  const opp = OPPONENTS[oppIndex];
  opp.attrs = randomAttrs(BUDGET + Math.floor((Math.random() - 0.5) * 40));
  runCountdown(() => {
    battling = false;
    revealOutcome(opp);
  });
};

const runCountdown = (done) => {
  const overlay = h('div', { class: 'countdown' },
    h('div', { class: 'count' }, '3'),
  );
  $('#phone').appendChild(overlay);
  const seq = ['3', '2', '1', 'FIGHT!'];
  let i = 0;
  const slot = overlay.querySelector('.count');
  const tick = () => {
    slot.textContent = seq[i];
    slot.classList.remove('pulse');
    void slot.offsetWidth; // restart animation
    slot.classList.add('pulse');
    i++;
    if (i < seq.length) setTimeout(tick, 700);
    else setTimeout(() => { overlay.remove(); done(); }, 650);
  };
  tick();
};

const revealOutcome = (opp) => {
  const detail = ATTR_KEYS.map(k => {
    const mine = state.attrs[k], theirs = opp.attrs[k];
    return { k, mine, theirs, win: mine > theirs, tie: mine === theirs };
  });
  const wins = detail.filter(d => d.win).length;
  const losses = detail.filter(d => !d.win && !d.tie).length;
  const ties = detail.filter(d => d.tie).length;
  const won = wins > losses;

  state.matches += 1;
  if (won) { state.wins += 1; state.points += 5; }
  else if (wins === losses) { /* tie: no change */ }
  else { state.points = Math.max(0, state.points - 2); }
  state.history.push(state.points);
  save();
  $('#battle-counter') && ($('#battle-counter').textContent = state.points);

  showResult({ won, ties, oppName: opp.name, wins, losses, detail });
};

const labelFor = {
  speed: 'SPEED', agility: 'AGILITY', intelligence: 'INTELLIGENCE',
  power: 'POWER', reflexes: 'REFLEXES',
};

const showResult = ({ won, ties, oppName, wins, losses, detail }) => {
  const verdict = wins === losses ? 'Draw' : (won ? 'Victory' : 'Defeat');
  const summary = wins === losses
    ? `${wins} – ${losses} (${ties} tied)`
    : `You won ${wins} of ${ATTR_KEYS.length} sliders`;

  const rows = detail.map(({ k, mine, theirs, win, tie }) => {
    const mark = tie ? '–' : (win ? '▶' : '◀');
    return h('div', { class: 'rrow ' + (tie ? 'tie' : (win ? 'win' : 'loss')) },
      h('div', { class: 'rk' }, labelFor[k]),
      h('div', { class: 'rmine' }, String(mine)),
      h('div', { class: 'rsep' }, mark),
      h('div', { class: 'rtheir' }, String(theirs)),
    );
  });

  const card = h('div', { class: 'result', onclick: (e) => { if (e.target.classList.contains('result')) card.remove(); } },
    h('div', { class: 'card' },
      h('div', { class: 'verdict ' + verdict.toLowerCase() }, verdict),
      h('div', { class: 'opp-name' }, `vs ${oppName}`),
      h('div', { class: 'summary' }, summary),
      h('div', { class: 'rows' }, ...rows),
      h('button', { class: 'cta continue', onclick: () => { card.remove(); navigate('battle'); } }, 'Continue'),
    ),
  );
  $('#phone').appendChild(card);
};

// ---------- ROSTER ----------
routes.roster = () => {
  const tier = (t) => h('div', { class: 'tier' },
    ...t.keys.map((k) => {
      const unlocked = isUnlocked(k);
      return h('div', {
        class: 'cell ' + (unlocked ? 'unlocked' : 'locked'),
        onclick: () => {
          if (!unlocked) { toast(`Needs ${ANIMALS[k].unlock}+ points`); return; }
          state.selected = k; save(); toast(`${ANIMALS[k].name} selected`); navigate('home');
        }
      }, svgWrap(ANIMALS[k].svg()));
    }),
  );
  const screen = h('section', { class: 'screen roster' },
    h('div', { class: 'bg slate' }),
    h('button', { class: 'back', onclick: () => navigate('home'), 'aria-label': 'back' }, '‹'),
    h('div', { class: 'roster-title' }, 'ROSTER'),
    ...TIERS.flatMap((t, i) => [
      tier(t),
      i < TIERS.length - 1 ? h('div', { class: 'tier-label' }, `${TIERS[i+1].points}+ Points`) : null,
    ]).filter(Boolean),
  );
  view.appendChild(screen);
  attachSwipe(screen, { up: () => navigate('battle') });
};

// ---------- Swipe gestures ----------
function attachSwipe(el, handlers) {
  let sx = 0, sy = 0, t0 = 0;
  el.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    sx = t.clientX; sy = t.clientY; t0 = Date.now();
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Date.now() - t0 > 600) return;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 40) return;
    if (ay > ax) (dy > 0 ? handlers.down : handlers.up)?.();
    else (dx > 0 ? handlers.right : handlers.left)?.();
  });
  // Mouse drag for desktop
  let mx, my, md = false;
  el.addEventListener('mousedown', (e) => { md = true; mx = e.clientX; my = e.clientY; t0 = Date.now(); });
  el.addEventListener('mouseup', (e) => {
    if (!md) return; md = false;
    const dx = e.clientX - mx, dy = e.clientY - my;
    if (Date.now() - t0 > 800) return;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 60) return;
    if (ay > ax) (dy > 0 ? handlers.down : handlers.up)?.();
    else (dx > 0 ? handlers.right : handlers.left)?.();
  });
}

// ---------- Boot ----------
navigate(state.loggedIn ? 'home' : 'login');

// Hide splash once first screen is rendered, but hold it long enough to read.
const splash = document.getElementById('splash');
if (splash) {
  const minVisible = 900;
  const start = performance.timing?.navigationStart || performance.now();
  const elapsed = performance.now() - (typeof start === 'number' ? 0 : start);
  const wait = Math.max(0, minVisible - elapsed);
  setTimeout(() => {
    splash.classList.add('hide');
    splash.addEventListener('transitionend', () => splash.remove(), { once: true });
  }, wait);
}

// Expose for debugging
window.__haka = { state, save, reset: () => { localStorage.removeItem(STORAGE_KEY); location.reload(); } };
