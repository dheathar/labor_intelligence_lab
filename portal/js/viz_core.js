/* viz_core.js — shared constants, helpers, theme, tab switching */

// ── Palette ───────────────────────────────────────────────────────────────────
const C = ['#2f81f7','#56d364','#f0883e','#d2a8ff','#f85149','#79c0ff','#ffa657','#ff7b72','#7ee787','#e3b341'];
const COLORS = C;

// ── Time axes ─────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const QTR22  = ['2022Q1','Q2','Q3','Q4','2023Q1','Q2','Q3','Q4','2024Q1','Q2','Q3','Q4','2025Q1','Q2'];
const QTR20  = ['2020Q1','Q2','Q3','Q4','2021Q1','Q2','Q3','Q4','2022Q1','Q2','Q3','Q4','2023Q1','Q2','Q3','Q4','2024Q1','Q2','Q3','Q4','2025Q1','Q2'];
const YRS15  = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
const YRS10  = ['2010','2012','2014','2016','2018','2020','2022','2024'];

// ── 18 occupations across ISCO spectrum ───────────────────────────────────────
// gap: supply-demand balance %; negative = shortage, positive = surplus
// auto: automation risk 0-100; wage: median annual €k; grow: YoY demand growth %
const OCC18 = [
  {name:'Software Developer',  sector:'ict',    isco:'2512', gap:-22, auto:25, wage:48, grow:18,
   demand:[100,72,98,115,128,142,155,163,170,178,185,191,198,205,218,226,235,248,262,275,289,302]},
  {name:'Data Scientist',      sector:'ict',    isco:'2411', gap:-34, auto:18, wage:58, grow:32,
   demand:[100,68,89,108,125,148,172,195,218,238,255,268,282,298,318,335,352,371,395,418,445,468]},
  {name:'Registered Nurse',    sector:'health', isco:'2221', gap:-28, auto:12, wage:31, grow:8,
   demand:[100,95,102,108,112,118,122,128,132,136,140,143,147,150,154,157,160,163,167,170,174,177]},
  {name:'Medical Technician',  sector:'health', isco:'3212', gap:-18, auto:20, wage:28, grow:12,
   demand:[100,92,98,104,108,114,118,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180]},
  {name:'Marketing Manager',   sector:'biz',    isco:'1221', gap:-12, auto:45, wage:42, grow:6,
   demand:[100,65,82,95,102,110,118,124,130,136,141,146,151,156,161,165,169,174,178,183,187,192]},
  {name:'Financial Analyst',   sector:'biz',    isco:'2413', gap:-8,  auto:62, wage:52, grow:4,
   demand:[100,78,88,96,102,108,112,116,120,124,128,131,134,137,140,143,146,149,152,155,158,161]},
  {name:'HR Specialist',       sector:'biz',    isco:'2423', gap:5,   auto:48, wage:38, grow:3,
   demand:[100,70,85,95,102,108,112,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144]},
  {name:'Civil Engineer',      sector:'eng',    isco:'2142', gap:-15, auto:22, wage:44, grow:10,
   demand:[100,82,92,102,110,118,124,130,136,142,148,153,158,163,168,172,176,180,184,188,192,196]},
  {name:'Electrician',         sector:'eng',    isco:'7411', gap:-20, auto:35, wage:32, grow:14,
   demand:[100,88,98,108,116,124,130,136,142,148,154,159,164,169,174,179,184,189,194,199,204,209]},
  {name:'Secondary Teacher',   sector:'edu',    isco:'2330', gap:-10, auto:15, wage:34, grow:5,
   demand:[100,85,92,98,102,106,110,113,116,119,122,124,126,128,130,132,134,136,138,140,142,144]},
  {name:'Social Worker',       sector:'edu',    isco:'2635', gap:-8,  auto:10, wage:30, grow:7,
   demand:[100,88,96,102,108,112,116,120,124,128,132,135,138,141,144,147,150,153,156,159,162,165]},
  {name:'Logistics Coord.',    sector:'srv',    isco:'3331', gap:8,   auto:62, wage:30, grow:-5,
   demand:[100,88,105,118,125,132,138,143,148,153,157,161,165,169,173,177,181,185,189,193,197,201]},
  {name:'Chef/Cook',           sector:'srv',    isco:'5120', gap:12,  auto:28, wage:22, grow:2,
   demand:[100,62,78,90,102,110,116,120,124,128,131,133,135,137,139,141,143,145,147,149,151,153]},
  {name:'Hotel Receptionist',  sector:'srv',    isco:'4226', gap:15,  auto:42, wage:18, grow:1,
   demand:[100,45,68,82,92,100,106,110,114,118,121,124,127,130,133,135,137,139,141,143,145,147]},
  {name:'Truck Driver',        sector:'trn',    isco:'8332', gap:18,  auto:72, wage:26, grow:-8,
   demand:[100,90,102,110,115,118,120,122,124,125,126,127,128,129,130,130,131,131,132,132,133,133]},
  {name:'Warehouse Operative', sector:'trn',    isco:'9333', gap:22,  auto:78, wage:20, grow:-12,
   demand:[100,105,115,120,122,124,125,126,127,127,128,128,128,128,129,129,129,129,129,129,130,130]},
  {name:'Admin Assistant',     sector:'adm',    isco:'4120', gap:25,  auto:82, wage:24, grow:-15,
   demand:[100,78,85,88,90,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75]},
  {name:'Retail Sales Worker', sector:'srv',    isco:'5223', gap:20,  auto:65, wage:19, grow:-10,
   demand:[100,58,72,82,88,92,94,95,96,96,96,95,94,93,92,91,90,89,88,87,86,85]},
];

const SECTOR_LABELS = {
  ict:'ICT & Digital', health:'Healthcare', biz:'Business & Finance',
  eng:'Engineering & Construction', edu:'Education & Social',
  srv:'Services & Hospitality', trn:'Transport & Logistics', adm:'Administrative',
};

// ── ECharts helpers ───────────────────────────────────────────────────────────
const INSTANCES = [];

function mk(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const inst = echarts.init(el, null, {renderer:'canvas'});
  INSTANCES.push(inst);
  return inst;
}

function v(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#888'; }

function B() {
  return {
    backgroundColor: 'transparent',
    textStyle: {color:v('--fg-muted'), fontSize:11, fontFamily:'-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'},
    tooltip: {backgroundColor:v('--bg-2'), borderColor:v('--border'), textStyle:{color:v('--fg'), fontSize:11}},
    grid: {left:10, right:16, top:28, bottom:8, containLabel:true},
  };
}

function xCat(data, opts={}) {
  return {type:'category', data, axisLabel:{fontSize:9,...opts},
    axisLine:{lineStyle:{color:v('--border')}}, axisTick:{show:false}};
}

function yVal(name='', opts={}) {
  return {type:'value', name, nameTextStyle:{color:v('--fg-muted'),fontSize:9},
    axisLabel:{fontSize:9,...opts}, axisLine:{lineStyle:{color:v('--border')}},
    splitLine:{lineStyle:{color:v('--bg-3')}}};
}

function leg(extra={}) {
  return {top:2, textStyle:{color:v('--fg-muted'),fontSize:10}, itemWidth:12, itemHeight:3, ...extra};
}

// ── Tab switching ─────────────────────────────────────────────────────────────
const rendered = new Set();
const RENDERERS = {};

function switchTab(panel, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panelEl = document.getElementById('panel-' + panel);
  if (panelEl) panelEl.classList.add('active');
  if (!rendered.has(panel)) {
    rendered.add(panel);
    setTimeout(() => RENDERERS[panel] && RENDERERS[panel](), 30);
  }
  setTimeout(() => INSTANCES.forEach(c => { try { c.resize(); } catch(e){} }), 80);
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const THEME_CYCLE = ['dark','light','rat'];
const THEME_ICONS = {dark:'🌙', light:'☀️', rat:'🐀'};

function cycleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = THEME_CYCLE[(THEME_CYCLE.indexOf(cur) + 1) % THEME_CYCLE.length];
  applyTheme(next);
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('livlab-theme', t);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = THEME_ICONS[t] || '🌙';
  // dispose + re-render all rendered panels
  const toRender = [...rendered];
  rendered.clear();
  INSTANCES.forEach(c => { try { c.dispose(); } catch(e){} });
  INSTANCES.length = 0;
  toRender.forEach(p => {
    rendered.add(p);
    setTimeout(() => RENDERERS[p] && RENDERERS[p](), 10);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('livlab-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = THEME_ICONS[saved] || '🌙';

  rendered.add('demand');
  setTimeout(() => RENDERERS.demand && RENDERERS.demand(), 50);

  window.addEventListener('resize', () =>
    INSTANCES.forEach(c => { try { c.resize(); } catch(e){} })
  );
});
