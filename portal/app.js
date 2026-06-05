/* Labor Intelligence Virtual Lab — app.js

   IMPLEMENTATION DATA (from Excel files, June 2026)
*/

// ─── Implementation: Crawling Portals data ───────────────────────────────────
// Source: DMLab-Project-Implementation-portals_4projects.xlsx

const PORTALS_DATA = [
  { name:'Skywalker',       status:true,  url:'https://skywalker.gr/',       start:'06/01/2023', country:'Greece',        metadata:true,  comment:null,                                   projects:['MICROIDEA','EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Careerjet',       status:true,  url:'https://www.careerjet.gr/',    start:'06/01/2023', country:'Greece',        metadata:true,  comment:null,                                   projects:['MICROIDEA','EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Careernet',       status:true,  url:'https://www.careernet.gr/',    start:'06/01/2023', country:'Greece',        metadata:true,  comment:null,                                   projects:['MICROIDEA','EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Jobseeker',       status:true,  url:'https://www.jobseeker.gr/',    start:'06/01/2023', country:'Greece',        metadata:true,  comment:null,                                   projects:['MICROIDEA','EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Jobfind',         status:true,  url:'https://www.jobfind.gr/',      start:'06/01/2023', country:'Greece',        metadata:true,  comment:null,                                   projects:['MICROIDEA','EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Kariera.gr',      status:true,  url:'https://www.kariera.gr/',      start:'06/01/2023', country:'Greece',        metadata:true,  comment:null,                                   projects:['MICROIDEA','EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Infojobs',        status:false, url:'https://www.infojobs.net',     start:null,         country:'Spain',         metadata:false, comment:'Unable to scrape',                     projects:['MICROIDEA'] },
  { name:'Turijobs',        status:true,  url:'https://www.turijobs.com',     start:'18/11/2024', country:'Spain',         metadata:true,  comment:null,                                   projects:['MICROIDEA'] },
  { name:'Infoempleo',      status:true,  url:'https://www.infoempleo.com',   start:'20/11/2024', country:'Spain',         metadata:true,  comment:null,                                   projects:['MICROIDEA'] },
  { name:'Carierista',      status:false, url:'https://www.carierista.com/en',start:'17/11/2024', country:'Cyprus',        metadata:false, comment:'IP blocked — works from home IP, not server IP', projects:['MICROIDEA'] },
  { name:'Kariera.com.cy',  status:false, url:'https://kariera.com.cy/',      start:null,         country:'Cyprus',        metadata:false, comment:'Unable to scrape',                     projects:['MICROIDEA'] },
  { name:'Adecco',          status:true,  url:'https://www.adecco.it/',       start:'06/10/2025', country:'Italy',         metadata:true,  comment:null,                                   projects:['EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Randstad Italia',  status:true, url:'https://www.randstad.it/',     start:'06/10/2025', country:'Italy',         metadata:true,  comment:null,                                   projects:['EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'Gi Group',        status:true,  url:'https://www.gigroup.it/',      start:'06/10/2025', country:'Italy',         metadata:true,  comment:null,                                   projects:['EU-ALMPO','GROWTH4BLUE','TRAIN4BLUE'] },
  { name:'LavoroPerTe Calabria', status:true, url:'https://lavoroperte.arpalcalabria.it/offerte-lavoro/vacancy/cerca', start:'02/10/2026', country:'Italy', metadata:false, comment:'Regional portal', projects:['TRAIN4BLUE'] },
  { name:'LavoroPerTe Puglia',   status:true, url:'https://lavoroperte.regione.puglia.it/offerte-lavoro/', start:'02/10/2026', country:'Italy', metadata:false, comment:'Regional portal', projects:['TRAIN4BLUE'] },
  { name:'Jobleads',        status:true,  url:'https://www.jobleads.com',     start:'02/10/2026', country:'Italy',         metadata:false, comment:null,                                   projects:['TRAIN4BLUE'] },
  { name:'Marineria',       status:true,  url:'https://www.marineria.it/It/default.aspx', start:'02/10/2026', country:'Italy', metadata:false, comment:'Crawling stopped 27/02/2026', projects:['TRAIN4BLUE'] },
  { name:'Adzuna Italy',    status:true,  url:'https://www.adzuna.it/search', start:'02/09/2026', country:'Italy',         metadata:false, comment:'Job aggregator (Puglia). Redirects to source portals.', projects:['TRAIN4BLUE'] },
  { name:'WhatJobs Italy',  status:true,  url:'https://it.whatjobs.com/jobs', start:'02/09/2026', country:'Italy',         metadata:false, comment:null,                                   projects:['TRAIN4BLUE'] },
  { name:'Talent Italy',    status:false, url:'https://it.talent.com/jobs',   start:'02/09/2026', country:'Italy',         metadata:false, comment:'Inconsistent job results',             projects:[] },
  { name:'Manpower Italy',  status:false, url:'https://www.manpower.it',      start:null,         country:'Italy',         metadata:false, comment:'Private Employment Agency',            projects:['EU-ALMPO'] },
  { name:'Mojedelo.com',    status:true,  url:'https://www.mojedelo.com/',    start:'06/10/2025', country:'Slovenia',      metadata:true,  comment:'Migrated to JS — fixed',               projects:['GROWTH4BLUE'] },
  { name:'Optius.com',      status:true,  url:'https://www.optius.com/',      start:'06/10/2025', country:'Slovenia',      metadata:true,  comment:null,                                   projects:['GROWTH4BLUE'] },
  { name:'Infostud',        status:true,  url:'https://poslovi.infostud.com/oglasi-za-posao', start:'06/10/2025', country:'Serbia', metadata:true, comment:'Dedup issue fixed — ~3.5K postings/day with URL changes', projects:['GROWTH4BLUE'] },
  { name:'NSZ Portal',      status:true,  url:'https://www.nsz.gov.rs/',      start:'06/10/2025', country:'Serbia',        metadata:true,  comment:null,                                   projects:['GROWTH4BLUE'] },
  { name:'Zaposli.me',      status:true,  url:'https://www.zaposli.me/',      start:'06/10/2025', country:'Montenegro',    metadata:true,  comment:null,                                   projects:['GROWTH4BLUE'] },
  { name:'Prekoveze.me',    status:true,  url:'https://www.prekoveze.me/',    start:'06/10/2025', country:'Montenegro',    metadata:true,  comment:null,                                   projects:['GROWTH4BLUE'] },
  { name:'ZZZCG Portal',    status:true,  url:'https://www.zzzcg.me/me/srm',  start:'06/10/2025', country:'Montenegro',    metadata:true,  comment:null,                                   projects:['GROWTH4BLUE'] },
  { name:'Careerjet Montenegro', status:true, url:'https://www.careerjet.me/', start:'11/05/2025', country:'Montenegro',  metadata:true,  comment:null,                                   projects:['GROWTH4BLUE'] },
  { name:'Radnik.me',       status:true,  url:'https://radnik.me/',           start:'11/05/2025', country:'Montenegro',   metadata:true,  comment:null,                                   projects:['GROWTH4BLUE'] },
  { name:'Vrabotuvanje.mk', status:true,  url:'https://www.vrabotuvanje.com.mk/en', start:'01/11/2024', country:'North Macedonia', metadata:true, comment:null,                          projects:['GROWTH4BLUE'] },
  { name:'Vraboti.se',      status:true,  url:'https://vraboti.se/?lang=en',  start:'01/11/2024', country:'North Macedonia', metadata:true, comment:null,                                 projects:['GROWTH4BLUE'] },
  { name:'av.gov.mk',       status:true,  url:'http://av.gov.mk/',            start:'01/11/2024', country:'North Macedonia', metadata:true, comment:'Redirects to e-rabota. No job description in listings.', projects:['GROWTH4BLUE'] },
  { name:'Apliciraj.mk',    status:true,  url:'https://apliciraj.mk/',        start:'06/09/2025', country:'North Macedonia', metadata:true, comment:null,                                 projects:['GROWTH4BLUE'] },
  { name:'OglasizaRabota',  status:true,  url:'https://www.oglasizarabota.mk/', start:'01/11/2024', country:'North Macedonia', metadata:true, comment:null,                               projects:['GROWTH4BLUE'] },
  { name:'JobNet.dk',       status:true,  url:'https://job.jobnet.dk/CV/FindWork', start:'26/11/2025', country:'Denmark',  metadata:false, comment:null,                                   projects:['EU-ALMPO'] },
  { name:'WorkinDenmark',   status:false, url:'https://www.workindenmark.dk/FindVacancies', start:null, country:'Denmark', metadata:false, comment:null,                                  projects:['EU-ALMPO'] },
  { name:'Ofir.dk',         status:false, url:'https://www.ofir.dk/jobsoegning/', start:null,      country:'Denmark',       metadata:false, comment:null,                                   projects:['EU-ALMPO'] },
  { name:'IT-Jobbank',      status:true,  url:'https://www.it-jobbank.dk/jobs', start:'26/11/2025', country:'Denmark',     metadata:false, comment:null,                                   projects:['EU-ALMPO'] },
  { name:'StepStone DK',    status:true,  url:'https://www.stepstone.dk/jobsoegning/', start:'26/11/2025', country:'Denmark', metadata:false, comment:null,                               projects:['EU-ALMPO'] },
];

// ─── Implementation: Deliverables 2026 ───────────────────────────────────────
// Source: UoP_Software Deliverables_2026.xlsx

const DELIVERABLES_DATA = [
  { project:'EU-ALMPO',    id:'D4.1',        due:'20/07/2026', title:'User-Friendly Labor Market Analysis Tool',                        notes:'Job Postings Analysis & Dashboards' },
  { project:'TRAIN4BLUE',  id:'D4.2',        due:'30/07/2026', title:'AI Platform: Central Knowledge Hub',                              notes:'Waiting for partner inputs — will be delivered later.' },
  { project:'GROWTH4BLUE', id:'D.2.2.1',     due:'31/08/2026', title:'Software for Information Extraction from OJA (Blue Economy)',     notes:'Prepare datasets per partner region (NACE codes); human-in-the-loop metadata extraction with partners (12/2026).' },
  { project:'GROWTH4BLUE', id:'D.2.3.1',     due:'31/08/2026', title:'Online Reporting Tool for OJA in Blue Economy',                   notes:'Visualisations & Reporting dashboards.' },
  { project:'EU-ALMPO',    id:'D5.1',        due:'07/09/2026', title:'Comprehensive Platform for Labor Market Insights & ALMP Analytics',notes:'Admin Data & Recommender.' },
  { project:'TRAIN4BLUE',  id:'D4.3',        due:'15/09/2026', title:'Personalized Recommender System',                                 notes:'Depends on WP3 (halfway). Partners deliver material in September for implementation by year-end.' },
  { project:'EU-ALMPO',    id:'D3.2',        due:'30/11/2026', title:'Interactive ALMP Design Wizard & UI',                             notes:'The ALMP Design Wizard.' },
  { project:'TRAIN4BLUE',  id:'D4.4',        due:'15/12/2026', title:'Platform Activation (Go-Live)',                                   notes:'Public launch for third-party users.' },
  { project:'MICROIDEA',   id:'D7.1 & D7.3', due:'31/12/2026', title:'Final Project Report & External Evaluation Report',              notes:'Final deliverable for the project.' },
];

/* Labor Intelligence Virtual Lab — app.js
 * Vanilla JS SPA: domain state machine + tab renderers
 */

// ─── State ───────────────────────────────────────────────────────────────────

const State = {
  domain: 'global',
  activeTab: 'overview',
  catalog: {},
  domains: [],
  projects: [],
  sources: [],
  mapInstance: null,
  mapMarkers: [],
  chatHistory: [],
  chartInstances: {},
  health: {},
};

const TAB_GROUP = {
  overview: 'lab', landscape: 'lab', constitution: 'lab',
  papers: 'knowledge', datasets: 'knowledge', methods: 'knowledge',
  applications: 'knowledge', benchmarks: 'knowledge',
  sources: 'data', insights: 'data', lab_exp: 'data',
  projects: 'research', oja: 'research', lmi_research: 'research',
  playground: 'explore', map: 'explore',
  impl_portals: 'implementation', impl_deliverables: 'implementation',
};

// ─── Init ─────────────────────────────────────────────────────────────────────

function setTopnavHeight() {
  const nav = document.querySelector('.topnav');
  if (nav) document.documentElement.style.setProperty('--topnav-h', nav.offsetHeight + 'px');
}

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  setTopnavHeight();
  window.addEventListener('resize', setTopnavHeight);
  document.getElementById('domainSelect').addEventListener('change', onDomainChange);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.addEventListener('click', closeDropdownsOnOutsideClick);
  await boot();
});

async function boot() {
  try {
    const [healthData, catalogData, projectsData, portalsData, delivsData] = await Promise.all([
      api('/api/health'),
      api('/api/knowledge'),
      api('/api/projects'),
      api('/api/portals').catch(() => ({ portals: [] })),
      api('/api/deliverables').catch(() => ({ deliverables: [] })),
    ]);
    State.health = healthData;
    State.catalog = catalogData;
    State.projects = projectsData.projects || [];
    // Merge server portals/deliverables over hardcoded (server is authoritative if populated)
    if (portalsData.portals?.length) State.portals = portalsData.portals;
    if (delivsData.deliverables?.length) State.deliverables = delivsData.deliverables;
    updateCounters();
    await loadDomain('global');
    // Restore last active tab from localStorage (persist across refreshes)
    const savedTab = localStorage.getItem('livlab-tab') || 'overview';
    activateTab(savedTab);
    fetchRatStatuses();
  } catch (e) {
    console.error('Boot failed:', e);
    document.querySelector('.container').innerHTML =
      `<div class="callout callout-error"><strong>⚠ Server not running.</strong><br>
       Start the lab: <code>python main.py</code> then refresh.</div>`;
  }
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function api(path, opts = {}) {
  const r = await fetch(path, opts);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${path}`);
  return r.json();
}

async function postApi(path, body) {
  return api(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ─── Domain switching ────────────────────────────────────────────────────────

async function loadDomain(slug) {
  State.domain = slug;
  try {
    const d = await api(`/api/domain/${slug}`);
    State.currentDomain = d;
  } catch (_) {
    State.currentDomain = { slug, name: slug };
  }
  const sel = document.getElementById('domainSelect');
  if (sel.value !== slug) sel.value = slug;
  updateDomainLabels();
  refreshActiveTab();
}

function onDomainChange(e) {
  loadDomain(e.target.value);
}

function updateDomainLabels() {
  const d = State.currentDomain;
  const label = d ? d.display_name || d.name || d.slug : '';
  document.querySelectorAll('.section-domain-label').forEach(el => {
    el.textContent = label ? `— ${label}` : '';
  });
}

// ─── Grouped Tab Navigation ───────────────────────────────────────────────────

function toggleGroup(group, event) {
  if (event) event.stopPropagation();
  const btn = document.querySelector(`.tab-group-btn[data-group="${group}"]`);
  if (!btn) return;
  const isOpen = btn.classList.contains('open');
  closeAllGroups();
  if (!isOpen) btn.classList.add('open');
}

function closeAllGroups() {
  document.querySelectorAll('.tab-group-btn.open').forEach(b => b.classList.remove('open'));
}

function closeDropdownsOnOutsideClick(e) {
  if (!e.target.closest('.tab-group-btn')) closeAllGroups();
}

function activateTab(tabId) {
  State.activeTab = tabId;
  localStorage.setItem('livlab-tab', tabId);

  // Hide all panes, show target
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById(`pane-${tabId}`);
  if (pane) pane.classList.add('active');

  // Update dropdown item active states
  document.querySelectorAll('.dropdown-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabId);
  });

  // Update group trigger active states
  const activeGroup = TAB_GROUP[tabId];
  document.querySelectorAll('.tab-group-trigger').forEach(el => {
    const btn = el.parentElement;
    el.classList.toggle('group-active', btn.dataset.group === activeGroup);
  });

  refreshActiveTab();
}

function refreshActiveTab() {
  const t = State.activeTab;
  if (t === 'overview') renderOverview();
  else if (t === 'landscape') renderLandscape();
  else if (t === 'papers') renderKnowledgeTab('papers');
  else if (t === 'datasets') renderKnowledgeTab('datasets');
  else if (t === 'methods') renderKnowledgeTab('methods');
  else if (t === 'applications') renderApplications();
  else if (t === 'benchmarks') renderBenchmarks();
  else if (t === 'sources') renderSources();
  else if (t === 'insights') renderInsights();
  else if (t === 'projects') renderProjects();
  else if (t === 'oja') renderOJAFromPortals();
  else if (t === 'map') renderMap();
  else if (t === 'constitution') renderConstitution();
  else if (t === 'impl_portals') renderImplPortals();
  else if (t === 'impl_deliverables') renderImplDeliverables();
  else if (t === 'lmi_research') renderLmiResearch();
  else if (t === 'playground') openChatDrawer();
}

function openChatDrawer(agent) {
  const drawer = document.getElementById('chat-drawer');
  const fab = document.getElementById('chat-fab');
  if (!drawer) return;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  fab.classList.add('open');
  if (agent) {
    const el = document.querySelector(`.interact-agent[data-agent="${agent}"]`);
    if (el) selectAgent(agent, el);
  } else {
    const active = document.querySelector('.interact-agent.active');
    if (!active) {
      const first = document.querySelector('.interact-agent[data-agent="assistant"]');
      if (first) selectAgent('assistant', first);
    }
  }
  renderInteractHistory();
  fetchRatStatuses();
  setTimeout(() => document.getElementById('interact-input')?.focus(), 260);
}

function closeChatDrawer() {
  const drawer = document.getElementById('chat-drawer');
  const fab = document.getElementById('chat-fab');
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  fab.classList.remove('open');
}

function toggleChatDrawer() {
  const drawer = document.getElementById('chat-drawer');
  if (drawer && drawer.classList.contains('open')) closeChatDrawer();
  else openChatDrawer();
}

function initInteraction() {
  openChatDrawer();
}

async function fetchRatStatuses() {
  try {
    const rats = await (await fetch('/api/rats')).json();
    if (!Array.isArray(rats)) return;
    rats.forEach(r => {
      const dot = document.getElementById('rat-status-' + r.name);
      if (!dot) return;
      dot.style.background = r.last_status === 'ok' ? '#56d364' : r.last_status === 'error' ? '#f85149' : '#888';
      dot.title = r.last_status + (r.last_run ? ' · ' + new Date(r.last_run).toLocaleString() : '');
    });
  } catch (_) {}
}

// ─── Counter badges ───────────────────────────────────────────────────────────

function updateCounters() {
  const c = State.catalog;
  const types = ['papers', 'datasets', 'methods', 'applications', 'benchmarks'];
  let total = 0;
  types.forEach(t => {
    const n = (c[t] || []).length;
    total += n;
    const dc = document.getElementById(`dc-${t}`);
    if (dc) dc.textContent = n;
    const s = document.getElementById(`stat-${t}`);
    if (s) s.textContent = n;
  });
  const gc = document.getElementById('gc-knowledge');
  if (gc) gc.textContent = total;

  const dc_proj = document.getElementById('dc-projects');
  if (dc_proj) dc_proj.textContent = State.projects.length;
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function renderOverview() {
  const d = State.currentDomain || {};

  // Domain highlights
  const highlights = d.highlights || d.research_angles || [];
  const hl = document.getElementById('domain-highlights');
  if (hl) hl.innerHTML = highlights.length
    ? highlights.map(h => `<li>${esc(h)}</li>`).join('')
    : '<li>Select a domain to see specific highlights.</li>';

  // Topics
  const topics = d.tags || d.topics || [];
  const tl = document.getElementById('domain-topics');
  if (tl) tl.innerHTML = topics.length
    ? topics.map(t => `<span class="badge">${esc(t)}</span>`).join(' ')
    : '<span class="text-muted">All topics</span>';

  // Mini project list
  const pl = document.getElementById('overview-projects-list');
  if (pl) pl.innerHTML = State.projects.map(p => `
    <div style="margin-bottom:8px;">
      <strong>${esc(p.name)}</strong>
      <span class="badge badge-${badgeColor(p.role)}">${esc(p.role || '')}</span>
      <span style="color:var(--fg-muted);font-size:12px;margin-left:6px;">${esc(p.period || '')}</span>
      <p style="margin:2px 0 0;font-size:12px;color:var(--fg-muted);">${esc(p.short_description || p.description || '')}</p>
    </div>`).join('') || 'No projects loaded.';
}

// ─── Landscape ───────────────────────────────────────────────────────────────

const LANDSCAPE_THEMES = [
  { icon: '📡', title: 'Online Job Advertisements (OJA)', color: '#39d353',
    desc: 'Real-time labor demand signals via job postings scraped from portals across 12+ countries. Key infrastructure: Cedefop/Eurostat Web Intelligence Hub, DMLab crawler.',
    tags: ['skill-extraction', 'demand-signal', 'NLP', 'ESCO'] },
  { icon: '🎓', title: 'Skills Intelligence & Taxonomies', color: '#2f81f7',
    desc: 'Structured classification of skills, occupations, and qualifications. ESCO (3,008 occupations, 13,890 skills, 27 languages) is the EU gold standard.',
    tags: ['ESCO', 'O*NET', 'skill-extraction', 'classification'] },
  { icon: '🔮', title: 'Labor Demand Forecasting', color: '#d2a8ff',
    desc: 'Temporal ML models (LSTNet, transformers) for short/medium-term demand forecasting. BLS Employment Projections covers US to 2033; Cedefop Forecast covers EU to 2035.',
    tags: ['forecasting', 'LSTM', 'time-series', 'BLS', 'Cedefop'] },
  { icon: '🤖', title: 'AI & Labor Market Transformation', color: '#ff7b72',
    desc: 'Foundation models estimating wage impacts (PNAS 2025), graph neural networks modeling AI-driven occupational transitions (arXiv:2601.06129), and early GenAI effects (NBER w33777).',
    tags: ['AI-impact', 'wage-gap', 'transitions', 'GenAI'] },
  { icon: '💶', title: 'Wage Dynamics & Gaps', color: '#ffa657',
    desc: 'Foundation model-based wage estimation outperforms traditional regression (PNAS 2025). Wage disparities correlate with AI exposure. IMF 2026 focuses on skill-gap-driven wage divergence.',
    tags: ['wages', 'equity', 'ML', 'IMF'] },
  { icon: '🗺️', title: 'Geographic Coverage & Regional Intelligence', color: '#56d364',
    desc: 'Priority: Greece, Western Balkans (9 countries), Adriatic-Ionian region. Active OJA crawling in 12 countries. ELSTAT LFS back to 1981 for deep Greek time series.',
    tags: ['Greece', 'Balkans', 'regional', 'ELSTAT'] },
  { icon: '📊', title: 'Supply-Side Data (LFS & Microdata)', color: '#79c0ff',
    desc: 'EU-LFS microdata (1.1M+ respondents/quarter), ELSTAT quarterly (SJO01 2001-2026) and annual (SJO03 1981-2025), ILOSTAT SDMX for 200+ countries.',
    tags: ['LFS', 'surveys', 'microdata', 'ILOSTAT'] },
  { icon: '🏛️', title: 'Active Labour Market Policies (ALMPs)', color: '#e6c419',
    desc: 'EU-ALMPO project (2025-2027) builds multi-country ALMP observatory. DYPA (Greece\'s PES) Ergani register provides real-time administrative vacancy data.',
    tags: ['ALMP', 'policy', 'DYPA', 'EU-ALMPO'] },
  { icon: '🌊', title: 'Blue & Green Economy Skills', color: '#1a9e72',
    desc: 'Growth4Blue and TRAIN4BLUE map skills demand in maritime, coastal, and aquaculture sectors across the Adriatic-Ionian region. 591 ESCO green-labelled skills enable greenness index tracking. Offshore renewable energy OJA analysis (Sdoukopoulos, Thessaloniki 2026) shows fast-growing demand.',
    tags: ['blue-economy', 'green-skills', 'ESCO', 'Growth4Blue', 'TRAIN4BLUE'] },
  { icon: '🗺️', title: 'Regional Skills Ecosystems', color: '#f0883e',
    desc: 'Combining OJA demand (NUTS-2) with LFS supply and VET training provision maps regional skills gaps. Cedefop 2026 Session 4a (Pages, Porciatti) defines the ecosystem framework. Priority regions: Attica/Peloponnese, Puglia/Calabria, Belgrade, Adriatic coastal zones.',
    tags: ['NUTS-2', 'regional', 'skills-gap', 'VET', 'ecosystem'] },
  { icon: '🎯', title: 'Career Pathways & Transition Analysis', color: '#d2a8ff',
    desc: 'OJA text mining reveals employer-inferred career progressions (Condon, Thessaloniki 2026). LFS transition matrices track worker mobility between occupations. Critical for ALMPs targeting re-skilling into high-demand roles.',
    tags: ['career-pathways', 'transitions', 'OJA-mining', 'ALMP', 'guidance'] },
  { icon: '⚖️', title: 'Gender & Equity in Labour Markets', color: '#f78166',
    desc: 'Lexicometric analysis of job posting language detects gender bias (Curci, Dimitrova, Thessaloniki 2026). Greece: 11/13 NUTS-2 regions with gender employment gap ≥17.5pp. Kosovo: female employment rate only 14.2% — lowest in scope.',
    tags: ['gender', 'equity', 'lexicometry', 'NEETs', 'inclusion'] },
  { icon: '🤖', title: 'GenAI & Emerging Technology Skills', color: '#79c0ff',
    desc: 'Generative AI is reshaping occupation-level skill demand faster than any prior technology wave (Marconi, Thessaloniki 2026). AI-complementary skills (Python + communication + critical thinking) detectable via OJA co-occurrence networks (Lampis, 2026). WEF estimates 39% of skills will change by 2030.',
    tags: ['GenAI', 'AI-skills', 'Industry4.0', 'digital-transition', 'WEF'] },
  { icon: '🎓', title: 'VET Alignment & Training-Vacancy Gap', color: '#56d364',
    desc: 'Serbia and North Macedonia: OJA demand vs. VET graduate output reveals systematic misalignment (Oruc & Kostadinov, Thessaloniki 2026). MicroIdea project addresses VET curriculum design using LMI evidence. Cedefop Skills Forecast 2035 projects qualification-level demand shifts.',
    tags: ['VET', 'training', 'MicroIdea', 'skills-mismatch', 'Cedefop'] },
];

function renderLandscape() {
  const grid = document.getElementById('landscape-grid');
  if (!grid) return;
  grid.innerHTML = LANDSCAPE_THEMES.map(t => `
    <div class="approach-card" style="border-top-color:${t.color};">
      <div class="approach-icon">${t.icon}</div>
      <div class="approach-title">${esc(t.title)}</div>
      <div class="approach-desc">${esc(t.desc)}</div>
      <div class="approach-tags">${t.tags.map(tag => `<span class="badge">${esc(tag)}</span>`).join('')}</div>
    </div>`).join('');
}

// ─── Generic Knowledge Tab (papers, datasets, methods) ───────────────────────

function renderKnowledgeTab(type) {
  const items = getFilteredItems(type);
  const grid = document.getElementById(`${type}-grid`);
  const countEl = document.getElementById(`${type}-count`);
  if (!grid) return;

  if (countEl) countEl.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

  if (!items.length) {
    grid.innerHTML = '<div class="detail-empty">No results match your filters.</div>';
    return;
  }

  grid.innerHTML = items.map(item => {
    if (type === 'papers') return paperCard(item);
    if (type === 'datasets') return datasetCard(item);
    if (type === 'methods') return methodCard(item);
    return genericCard(type, item);
  }).join('');
}

// ─── Rich card builders ───────────────────────────────────────────────────────

function paperCard(p) {
  const id = p.slug || slugify(p.title || '');
  const arxivUrl = p.arxiv_id ? `https://arxiv.org/abs/${p.arxiv_id}` : null;
  const doiUrl = p.doi ? `https://doi.org/${p.doi}` : null;
  const extUrl = arxivUrl || doiUrl || p.url || null;
  const authors = Array.isArray(p.authors) ? p.authors.slice(0,3).join(', ') + (p.authors.length > 3 ? ' et al.' : '') : (p.authors || '');
  const finding = p.key_findings?.[0] || '';
  return `<div class="item-card rich-card" data-id="${esc(id)}" onclick="showDetail('papers','${esc(id)}')">
    <div class="rich-card-top">
      <div class="rich-card-badges">
        ${p.year ? `<span class="badge">${p.year}</span>` : ''}
        ${p.venue ? `<span class="badge badge-venue">${esc(p.venue)}</span>` : ''}
      </div>
      ${extUrl ? `<a href="${esc(extUrl)}" target="_blank" rel="noopener" class="card-ext-link" onclick="event.stopPropagation()" title="Open paper">↗</a>` : ''}
    </div>
    <div class="rich-card-title">${esc(p.title)}</div>
    ${authors ? `<div class="rich-card-authors">${esc(authors)}</div>` : ''}
    ${finding ? `<div class="rich-card-finding">"${esc(truncate(finding, 90))}"</div>` : `<div class="rich-card-desc">${esc(truncate(p.abstract || '', 110))}</div>`}
    <div class="rich-card-footer">
      ${(p.topics || []).slice(0,4).map(t => `<span class="badge">${esc(t)}</span>`).join('')}
      ${extUrl ? `<a href="${esc(extUrl)}" target="_blank" rel="noopener" class="card-link-btn" onclick="event.stopPropagation()">${p.arxiv_id ? 'arXiv' : 'DOI'} ↗</a>` : ''}
    </div>
  </div>`;
}

function datasetCard(d) {
  const id = d.slug || slugify(d.name || '');
  const geos = [d.geography].flat().filter(Boolean);
  return `<div class="item-card rich-card" data-id="${esc(id)}" onclick="showDetail('datasets','${esc(id)}')">
    <div class="rich-card-top">
      <div class="rich-card-badges">
        ${d.type ? `<span class="badge">${esc(d.type)}</span>` : ''}
        ${d.access ? `<span class="badge badge-${accessColor(d.access)}">${esc(d.access)}</span>` : ''}
      </div>
      ${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener" class="card-ext-link" onclick="event.stopPropagation()" title="Access dataset">↗</a>` : ''}
    </div>
    <div class="rich-card-title">${esc(d.name)}</div>
    <div class="rich-card-authors">${esc(d.source || '')}</div>
    <div class="rich-card-desc">${esc(truncate(d.description || '', 100))}</div>
    <div class="rich-card-footer">
      ${geos.map(g => `<span class="badge">🌐 ${esc(g)}</span>`).join('')}
      ${d.update_frequency ? `<span class="badge" style="opacity:0.7">${esc(d.update_frequency)}</span>` : ''}
      ${d.api_available ? `<span class="badge badge-success">API ✓</span>` : ''}
      ${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener" class="card-link-btn" onclick="event.stopPropagation()">Access ↗</a>` : ''}
    </div>
  </div>`;
}

function methodCard(m) {
  const id = m.slug || slugify(m.name || '');
  // Resolve paper link
  const papers = State.catalog.papers || [];
  const linkedPaper = m.paper ? papers.find(p => p.slug === m.paper) : null;
  const arxivId = m.arxiv_id || linkedPaper?.arxiv_id;
  const paperUrl = arxivId ? `https://arxiv.org/abs/${arxivId}` : (m.paper_link || null);
  return `<div class="item-card rich-card" data-id="${esc(id)}" onclick="showDetail('methods','${esc(id)}')">
    <div class="rich-card-top">
      <div class="rich-card-badges">
        ${m.category ? `<span class="badge">${esc(m.category)}</span>` : ''}
        ${m.subcategory ? `<span class="badge" style="opacity:0.7">${esc(m.subcategory)}</span>` : ''}
      </div>
      ${paperUrl ? `<a href="${esc(paperUrl)}" target="_blank" rel="noopener" class="card-ext-link" onclick="event.stopPropagation()" title="View paper">↗</a>` : ''}
    </div>
    <div class="rich-card-title">${esc(m.name)}</div>
    <div class="rich-card-desc">${esc(truncate(m.description || '', 110))}</div>
    <div class="rich-card-footer">
      ${(m.sota_benchmarks || []).map(b => `<span class="badge" style="color:var(--teal)">📊 ${esc(b)}</span>`).join('')}
      ${paperUrl ? `<a href="${esc(paperUrl)}" target="_blank" rel="noopener" class="card-link-btn" onclick="event.stopPropagation()">Paper ↗</a>` : ''}
    </div>
  </div>`;
}

function genericCard(type, item) {
  const id = item.slug || item.id || slugify(item.title || item.name || '');
  return `<div class="item-card rich-card" data-id="${esc(id)}" onclick="showDetail('${type}','${esc(id)}')">
    <div class="rich-card-top">
      <div class="rich-card-badges">
        ${item.year ? `<span class="badge">${item.year}</span>` : ''}
        ${item.category ? `<span class="badge">${esc(item.category)}</span>` : ''}
        ${item.type ? `<span class="badge">${esc(item.type)}</span>` : ''}
      </div>
    </div>
    <div class="rich-card-title">${esc(item.title || item.name || id)}</div>
    <div class="rich-card-desc">${esc(truncate(item.abstract || item.description || '', 110))}</div>
    <div class="rich-card-footer">${(item.topics || item.tags || []).slice(0,4).map(t => `<span class="badge">${esc(t)}</span>`).join('')}</div>
  </div>`;
}

function getFilteredItems(type) {
  let items = (State.catalog[type] || []).slice();

  // Domain filter: keep items that match or have no domain restriction
  items = items.filter(i => !i.domains || i.domains.includes(State.domain) || State.domain === 'global');

  const searchEl = document.getElementById(`${type}-search`);
  const q = (searchEl?.value || '').toLowerCase().trim();

  if (q) {
    items = items.filter(i => {
      const text = [i.title, i.name, i.abstract, i.description, i.summary,
        ...(i.topics || []), ...(i.tags || []), i.venue, i.source].filter(Boolean).join(' ').toLowerCase();
      return text.includes(q);
    });
  }

  // Type-specific filters
  if (type === 'papers') {
    const yr = document.getElementById('papers-year')?.value;
    const tp = document.getElementById('papers-topic')?.value;
    if (yr) items = items.filter(i => String(i.year) === yr);
    if (tp) items = items.filter(i => (i.topics || []).includes(tp));
  } else if (type === 'datasets') {
    const ty = document.getElementById('datasets-type')?.value;
    const ac = document.getElementById('datasets-access')?.value;
    if (ty) items = items.filter(i => i.type === ty);
    if (ac) items = items.filter(i => i.access === ac);
  } else if (type === 'methods') {
    const cat = document.getElementById('methods-cat')?.value;
    if (cat) items = items.filter(i => i.category === cat);
  }

  return items;
}

function filterCards(type) {
  renderKnowledgeTab(type);
  // Clear detail panel
  const panel = document.getElementById(`${type}-detail`);
  if (panel) panel.innerHTML = '<div class="detail-empty">← Select an item to see details</div>';
}

function showDetail(type, id) {
  const items = State.catalog[type] || [];
  const item = items.find(i => (i.slug || i.id || slugify(i.title || '')) === id);
  if (!item) return;

  // Highlight active card
  document.querySelectorAll(`#${type}-grid .item-card`).forEach(c => {
    c.classList.toggle('active', c.dataset.id === id);
  });

  const panel = document.getElementById(`${type}-detail`);
  if (!panel) return;

  if (type === 'papers') panel.innerHTML = paperDetail(item);
  else if (type === 'datasets') panel.innerHTML = datasetDetail(item);
  else if (type === 'methods') panel.innerHTML = methodDetail(item);
  else panel.innerHTML = genericDetail(item);
}

function paperDetail(p) {
  return `
    <div class="detail-header">
      <div class="detail-title">${esc(p.title)}</div>
      <div class="detail-meta">
        ${p.authors ? `<span>${esc(Array.isArray(p.authors) ? p.authors.join(', ') : p.authors)}</span>` : ''}
        ${p.year ? `<span class="badge">${p.year}</span>` : ''}
        ${p.venue ? `<span class="badge">${esc(p.venue)}</span>` : ''}
      </div>
    </div>
    ${p.arxiv_id ? `<div class="detail-section"><a href="https://arxiv.org/abs/${p.arxiv_id}" target="_blank" class="btn btn-sm">📄 arXiv:${p.arxiv_id}</a></div>` : ''}
    ${p.doi ? `<div class="detail-section"><a href="https://doi.org/${p.doi}" target="_blank" class="btn btn-sm">🔗 DOI</a></div>` : ''}
    ${p.abstract ? `<div class="detail-section"><div class="detail-section-label">Abstract</div><div class="detail-text">${esc(p.abstract)}</div></div>` : ''}
    ${p.key_findings?.length ? `<div class="detail-section"><div class="detail-section-label">Key Findings</div><ul>${p.key_findings.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
    ${p.methods_used?.length ? `<div class="detail-section"><div class="detail-section-label">Methods Used</div>${p.methods_used.map(m => `<span class="badge">${esc(m)}</span>`).join(' ')}</div>` : ''}
    ${p.datasets_used?.length ? `<div class="detail-section"><div class="detail-section-label">Datasets Used</div>${p.datasets_used.map(d => `<span class="badge">${esc(d)}</span>`).join(' ')}</div>` : ''}
    ${p.topics?.length ? `<div class="detail-section">${p.topics.map(t => `<span class="badge">${esc(t)}</span>`).join(' ')}</div>` : ''}
  `;
}

function datasetDetail(d) {
  return `
    <div class="detail-header">
      <div class="detail-title">${esc(d.name || d.title)}</div>
      <div class="detail-meta">
        ${d.source ? `<span>${esc(d.source)}</span>` : ''}
        ${d.type ? `<span class="badge">${esc(d.type)}</span>` : ''}
        ${d.access ? `<span class="badge badge-${accessColor(d.access)}">${esc(d.access)}</span>` : ''}
      </div>
    </div>
    ${d.url ? `<div class="detail-section"><a href="${esc(d.url)}" target="_blank" class="btn btn-sm">🔗 Access Dataset</a></div>` : ''}
    ${d.description ? `<div class="detail-section"><div class="detail-section-label">Description</div><div class="detail-text">${esc(d.description)}</div></div>` : ''}
    <div class="detail-section detail-grid-2">
      ${d.geography ? `<div><div class="detail-section-label">Geography</div>${[d.geography].flat().map(g => `<span class="badge">${esc(g)}</span>`).join(' ')}</div>` : ''}
      ${d.update_frequency ? `<div><div class="detail-section-label">Updated</div><span>${esc(d.update_frequency)}</span></div>` : ''}
      ${d.size ? `<div><div class="detail-section-label">Size</div><span>${esc(d.size)}</span></div>` : ''}
      ${d.api_available !== undefined ? `<div><div class="detail-section-label">API</div><span>${d.api_available ? '✅ Yes' : '❌ No'}</span></div>` : ''}
      ${d.time_period ? `<div><div class="detail-section-label">Period</div><span>${esc(d.time_period)}</span></div>` : ''}
      ${d.languages ? `<div><div class="detail-section-label">Languages</div>${[d.languages].flat().map(l => `<span class="badge">${esc(l)}</span>`).join(' ')}</div>` : ''}
    </div>
    ${d.variables?.length ? `<div class="detail-section"><div class="detail-section-label">Key Variables</div><div>${d.variables.map(v => `<span class="badge">${esc(v)}</span>`).join(' ')}</div></div>` : ''}
    ${d.access_instructions ? `<div class="detail-section"><div class="detail-section-label">Access Instructions</div><div class="detail-text">${esc(d.access_instructions)}</div></div>` : ''}
    ${d.tags?.length ? `<div class="detail-section">${d.tags.map(t => `<span class="badge">${esc(t)}</span>`).join(' ')}</div>` : ''}
  `;
}

function methodDetail(m) {
  return `
    <div class="detail-header">
      <div class="detail-title">${esc(m.name || m.title)}</div>
      <div class="detail-meta">
        ${m.category ? `<span class="badge">${esc(m.category)}</span>` : ''}
        ${m.year ? `<span class="badge">${m.year}</span>` : ''}
      </div>
    </div>
    ${m.paper_link ? `<div class="detail-section"><a href="${esc(m.paper_link)}" target="_blank" class="btn btn-sm">📄 Paper</a></div>` : ''}
    ${m.description ? `<div class="detail-section"><div class="detail-section-label">Description</div><div class="detail-text">${esc(m.description)}</div></div>` : ''}
    ${m.how_it_works ? `<div class="detail-section"><div class="detail-section-label">How It Works</div><div class="detail-text">${esc(m.how_it_works)}</div></div>` : ''}
    ${m.inputs?.length ? `<div class="detail-section"><div class="detail-section-label">Inputs</div>${m.inputs.map(i => `<span class="badge">${esc(i)}</span>`).join(' ')}</div>` : ''}
    ${m.outputs?.length ? `<div class="detail-section"><div class="detail-section-label">Outputs</div>${m.outputs.map(o => `<span class="badge">${esc(o)}</span>`).join(' ')}</div>` : ''}
    ${m.performance ? `<div class="detail-section"><div class="detail-section-label">Performance</div><div class="detail-text">${esc(m.performance)}</div></div>` : ''}
    ${m.strengths?.length ? `<div class="detail-section"><div class="detail-section-label">Strengths</div><ul>${m.strengths.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
    ${m.limitations?.length ? `<div class="detail-section"><div class="detail-section-label">Limitations</div><ul>${m.limitations.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>` : ''}
    ${m.use_cases?.length ? `<div class="detail-section"><div class="detail-section-label">Use Cases</div><ul>${m.use_cases.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>` : ''}
    ${m.tags?.length ? `<div class="detail-section">${m.tags.map(t => `<span class="badge">${esc(t)}</span>`).join(' ')}</div>` : ''}
  `;
}

function genericDetail(item) {
  return `<div class="detail-header"><div class="detail-title">${esc(item.title || item.name || item.slug)}</div></div>
    <div class="detail-section"><pre style="font-size:12px;overflow:auto;">${esc(JSON.stringify(item, null, 2))}</pre></div>`;
}

// ─── Applications ─────────────────────────────────────────────────────────────

function renderApplications() {
  const items = (State.catalog.applications || []).filter(
    i => !i.domains || i.domains.includes(State.domain) || State.domain === 'global'
  );
  const q = document.getElementById('applications-search')?.value?.toLowerCase() || '';
  const cat = document.getElementById('applications-cat')?.value || '';
  const filtered = items.filter(i => {
    const text = [i.title, i.name, i.description, ...(i.tags || [])].filter(Boolean).join(' ').toLowerCase();
    return (!q || text.includes(q)) && (!cat || i.category === cat);
  });
  const count = document.getElementById('applications-count');
  if (count) count.textContent = `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`;
  const grid = document.getElementById('applications-grid');
  if (!grid) return;
  grid.innerHTML = filtered.map(app => {
    const tools = app.example_tools || [];
    const toolLinks = {
      'Cedefop Skills-OVATE': 'https://www.cedefop.europa.eu/en/tools/skills-online-vacancies',
      'Lightcast': 'https://lightcast.io',
      'LinkedIn Talent Insights': 'https://business.linkedin.com/talent-solutions/talent-insights',
      'OECD Skills for Jobs': 'https://www.oecdskillsforjobs.org',
      'MDAAE': 'https://mdaae.gr/en/',
      'DYPA': 'https://www.dypa.gov.gr/',
    };
    return `<div class="item-card rich-card app-card">
      <div class="rich-card-top">
        <div class="rich-card-badges">
          <span>${appIcon(app.category)}</span>
          ${app.status ? `<span class="badge badge-${statusColor(app.status)}">${esc(app.status)}</span>` : ''}
          ${app.maturity ? `<span class="badge">${esc(app.maturity)}</span>` : ''}
        </div>
        ${app.url ? `<a href="${esc(app.url)}" target="_blank" rel="noopener" class="card-ext-link" onclick="event.stopPropagation()">↗</a>` : ''}
      </div>
      <div class="rich-card-title">${esc(app.title || app.name)}</div>
      <div class="rich-card-desc">${esc(truncate(app.description || '', 110))}</div>
      <div class="rich-card-footer">
        ${app.data_sources?.slice(0,2).map(s => `<span class="badge">${esc(s)}</span>`).join('') || ''}
        ${tools.map(t => toolLinks[t]
          ? `<a href="${esc(toolLinks[t])}" target="_blank" rel="noopener" class="card-link-btn" onclick="event.stopPropagation()">${esc(t)} ↗</a>`
          : `<span class="badge">${esc(t)}</span>`
        ).join('')}
      </div>
    </div>`;
  }).join('') || '<div class="detail-empty">No applications found.</div>';
}

// ─── Benchmarks ───────────────────────────────────────────────────────────────

function renderBenchmarks() {
  const benchmarks = State.catalog.benchmarks || [];
  const el = document.getElementById('benchmarks-list');
  if (!el) return;
  if (!benchmarks.length) { el.innerHTML = '<div class="detail-empty">No benchmarks loaded.</div>'; return; }

  el.innerHTML = benchmarks.map(b => `
    <div class="benchmark-card">
      <div class="benchmark-header">
        <div class="benchmark-title">${esc(b.name || b.title)}</div>
        <div class="benchmark-meta">
          ${b.task ? `<span class="badge">${esc(b.task)}</span>` : ''}
          ${b.year ? `<span class="badge">${b.year}</span>` : ''}
          ${b.url ? `<a href="${esc(b.url)}" target="_blank" class="btn btn-sm">🔗 Link</a>` : ''}
        </div>
      </div>
      ${b.description ? `<div class="benchmark-desc">${esc(b.description)}</div>` : ''}
      ${b.metrics ? `
        <div class="benchmark-metrics">
          <div class="detail-section-label">Metrics</div>
          <div>${[b.metrics].flat().map(m => `<span class="badge">${esc(m)}</span>`).join(' ')}</div>
        </div>` : ''}
      ${b.leaderboard?.length ? `
        <table class="leaderboard-table">
          <thead><tr><th>Method</th><th>Score</th><th>Year</th></tr></thead>
          <tbody>${b.leaderboard.map(row => `
            <tr>
              <td>${esc(row.method || row.name)}</td>
              <td>${esc(String(row.score || row.f1 || ''))}</td>
              <td>${esc(String(row.year || ''))}</td>
            </tr>`).join('')}
          </tbody>
        </table>` : ''}
    </div>`).join('');
}

// ─── Data Library ─────────────────────────────────────────────────────────────

function switchLibTab(paneId, btn) {
  document.querySelectorAll('.lib-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.lib-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(paneId)?.classList.add('active');
  btn.classList.add('active');
  // Lazy-render each sub-pane
  if (paneId === 'lib-datasets') renderLibDatasets();
  else if (paneId === 'lib-portals') renderLibPortals();
  else if (paneId === 'lib-connectors') renderLibConnectors();
  else if (paneId === 'lib-countries') renderLibCountries();
}

function renderSources() {
  // Update dataset count badge
  const ltc = document.getElementById('ltc-datasets');
  if (ltc) ltc.textContent = (State.catalog.datasets || []).length;
  renderLibDatasets();
  renderLibCountries();
  renderLabRats();
}

const RAT_ICONS = {
  rat_researcher: '🔬',
  rat_analyst: '📊',
  rat_visualizer: '📈',
  rat_monitor: '🛰️',
};
const RAT_COLORS = {
  rat_researcher: '#2f81f7',
  rat_analyst: '#56d364',
  rat_visualizer: '#d2a8ff',
  rat_monitor: '#ffa657',
};

async function renderLabRats() {
  const container = document.getElementById('lab-rats-grid');
  if (!container) return;
  container.innerHTML = '<div style="color:var(--fg-muted);font-size:12px;padding:8px;">Loading rats…</div>';
  try {
    const resp = await fetch('/api/rats');
    if (!resp.ok) throw new Error('rats offline');
    const rats = await resp.json();
    container.innerHTML = rats.map(r => {
      const icon = RAT_ICONS[r.name] || '🐀';
      const color = RAT_COLORS[r.name] || '#888';
      const statusColor = r.last_status === 'ok' ? '#56d364' : r.last_status === 'error' ? '#f85149' : '#888';
      const lastRun = r.last_run ? new Date(r.last_run).toLocaleString() : 'Never';
      const tools = r.last_tool_calls || [];
      return '<div class="rat-card" style="border-top:3px solid ' + color + '">' +
        '<div class="rat-card-header">' +
          '<span class="rat-icon">' + icon + '</span>' +
          '<span class="rat-name">' + esc(r.name.replace('rat_', '').toUpperCase()) + '</span>' +
          '<span class="rat-status-dot" style="background:' + statusColor + '" title="' + esc(r.last_status) + '"></span>' +
        '</div>' +
        '<div class="rat-desc">' + esc(r.description) + '</div>' +
        '<div class="rat-meta">' +
          '<span>⏱ ' + esc(r.schedule) + '</span>' +
          '<span style="color:var(--fg-muted);font-size:10px;">Last: ' + esc(lastRun) + '</span>' +
        '</div>' +
        (r.last_summary ? '<div class="rat-summary">' + esc(r.last_summary.substring(0, 160)) + (r.last_summary.length > 160 ? '…' : '') + '</div>' : '') +
        (tools.length ? '<div class="rat-tools">' + tools.slice(-6).map(t => '<span class="rat-tool-chip">' + esc(t) + '</span>').join('') + '</div>' : '') +
        '<button class="rat-run-btn" onclick="triggerRat(\'' + esc(r.name) + '\',this)">▶ Run now</button>' +
      '</div>';
    }).join('');
  } catch (e) {
    container.innerHTML = '<div class="rat-offline"><span>🐀</span> Lab Rats service offline — start the agents container to activate.<br><code>docker compose up agents</code></div>';
  }
}

async function triggerRat(name, btn) {
  btn.disabled = true;
  btn.textContent = '⏳ Running…';
  try {
    await fetch('/api/rats/' + name + '/run', {method: 'POST'});
    setTimeout(() => { btn.disabled = false; btn.textContent = '▶ Run now'; renderLabRats(); }, 2000);
  } catch(e) {
    btn.disabled = false; btn.textContent = '▶ Run now';
  }
}

function renderLibDatasets() {
  const q = (document.getElementById('lib-datasets-search')?.value || '').toLowerCase();
  const type = document.getElementById('lib-datasets-type')?.value || '';
  const access = document.getElementById('lib-datasets-access')?.value || '';

  let items = (State.catalog.datasets || []).filter(d => {
    if (type && d.type !== type) return false;
    if (access && d.access !== access) return false;
    if (q) {
      const txt = [d.name, d.source, d.description, ...(d.tags || [])].filter(Boolean).join(' ').toLowerCase();
      if (!txt.includes(q)) return false;
    }
    return true;
  });

  const countEl = document.getElementById('lib-datasets-count');
  if (countEl) countEl.textContent = `${items.length} sources`;

  const grid = document.getElementById('lib-datasets-grid');
  if (!grid) return;

  grid.innerHTML = items.map(d => {
    const id = d.slug || slugify(d.name || '');
    return `<div class="item-card" data-id="${esc(id)}" onclick="showLibDatasetDetail('${esc(id)}')">
      <div class="item-card-title">${esc(d.name)}</div>
      <div class="item-card-meta">
        ${d.type ? `<span class="badge">${esc(d.type)}</span>` : ''}
        ${d.access ? `<span class="badge badge-${accessColor(d.access)}">${esc(d.access)}</span>` : ''}
      </div>
      <div class="item-card-desc">${esc(truncate(d.description || '', 90))}</div>
      <div style="margin-top:6px;font-size:11px;color:var(--fg-muted)">
        ${[d.geography].flat().filter(Boolean).map(g => `🌐 ${esc(g)}`).join(' · ')}
      </div>
    </div>`;
  }).join('') || '<div class="detail-empty">No datasets match.</div>';
}

function showLibDatasetDetail(id) {
  const items = State.catalog.datasets || [];
  const d = items.find(i => (i.slug || slugify(i.name || '')) === id);
  if (!d) return;
  document.querySelectorAll('#lib-datasets-grid .item-card').forEach(c => c.classList.toggle('active', c.dataset.id === id));
  const panel = document.getElementById('lib-datasets-detail');
  if (panel) panel.innerHTML = datasetDetail(d);
}

function renderLibPortals() {
  const q = (document.getElementById('lib-portals-search')?.value || '').toLowerCase();
  const country = document.getElementById('lib-portals-country')?.value || '';
  const statusF = document.getElementById('lib-portals-status')?.value || '';

  let rows = PORTALS_DATA.filter(p => {
    if (country && p.country !== country) return false;
    if (statusF === 'active' && !p.status) return false;
    if (statusF === 'inactive' && p.status) return false;
    if (q && !`${p.name} ${p.country} ${p.url}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const countEl = document.getElementById('lib-portals-count');
  if (countEl) countEl.textContent = `${rows.length} portals`;

  const el = document.getElementById('lib-portals-body');
  if (!el) return;

  // Group by country
  const byCountry = {};
  rows.forEach(p => { (byCountry[p.country] = byCountry[p.country] || []).push(p); });

  el.innerHTML = Object.entries(byCountry).sort(([a],[b]) => a.localeCompare(b)).map(([c, portals]) => `
    <div class="lib-country-section">
      <div class="lib-country-header">${COUNTRY_FLAGS[c] || ''} ${esc(c)} <span class="lib-country-count">${portals.length}</span></div>
      <div class="lib-portals-grid">
        ${portals.map(p => `
          <div class="lib-portal-card ${p.status ? '' : 'lib-portal-inactive'}">
            <div class="lib-portal-name">
              <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>
              <span class="lib-portal-status ${p.status ? 'status-ok' : 'status-off'}"></span>
            </div>
            <div class="lib-portal-meta">
              ${p.metadata ? '<span class="badge badge-success" title="Metadata extracted">meta ✓</span>' : ''}
              ${p.projects.map(pr => `<span class="impl-project-chip" style="background:${PROJECT_COLORS[pr]}22;color:${PROJECT_COLORS[pr]};border-color:${PROJECT_COLORS[pr]}44">${esc(pr)}</span>`).join('')}
            </div>
            ${p.comment ? `<div class="lib-portal-note">⚠ ${esc(p.comment.slice(0,80))}${p.comment.length>80?'…':''}</div>` : ''}
          </div>`).join('')}
      </div>
    </div>`).join('') || '<div class="detail-empty">No portals match.</div>';
}

async function renderLibConnectors() {
  const el = document.getElementById('lib-connectors-body');
  if (!el) return;
  el.innerHTML = '<div class="text-muted">Loading connectors…</div>';
  try {
    const data = await api('/api/sources');
    State.sources = data.sources || [];
    el.innerHTML = `<p style="color:var(--fg-muted);font-size:13px;margin:0 0 16px;">API connectors for live data fetching. Click Fetch to trigger a pull.</p>
    <div class="source-grid">${State.sources.map(s => `
      <div class="source-card" id="src-${esc(s.id)}">
        <div class="source-card-header">
          <span class="source-dot ${s.status === 'idle' ? 'dot-idle' : s.status === 'pending' ? 'dot-pending' : s.status === 'error' ? 'dot-error' : 'dot-ok'}"></span>
          <span class="source-name">${esc(s.name)}</span>
        </div>
        <div class="source-url">${esc(s.url || '')}</div>
        <div class="source-meta">
          ${s.last_fetch ? `<span>Last: ${esc(s.last_fetch)}</span>` : '<span>Never fetched</span>'}
          ${s.record_count != null ? `<span>${s.record_count} records</span>` : ''}
        </div>
        ${s.error ? `<div class="source-error">${esc(s.error)}</div>` : ''}
        <button class="btn btn-sm" onclick="fetchSource('${esc(s.id)}')">⬇ Fetch</button>
      </div>`).join('')}
    </div>`;
  } catch (e) {
    el.innerHTML = `<div class="callout callout-error">${esc(e.message)}</div>`;
  }
}

function renderLibCountries() {
  const el = document.getElementById('lib-countries-body');
  if (!el) return;

  const COUNTRIES = [
    { name:'Greece', flag:'🇬🇷', tier:'primary' },
    { name:'Italy', flag:'🇮🇹', tier:'primary' },
    { name:'Spain', flag:'🇪🇸', tier:'primary' },
    { name:'Serbia', flag:'🇷🇸', tier:'primary' },
    { name:'Montenegro', flag:'🇲🇪', tier:'primary' },
    { name:'North Macedonia', flag:'🇲🇰', tier:'primary' },
    { name:'Slovenia', flag:'🇸🇮', tier:'primary' },
    { name:'Denmark', flag:'🇩🇰', tier:'primary' },
    { name:'Cyprus', flag:'🇨🇾', tier:'secondary', note:'Portals IP-blocked' },
    { name:'Albania', flag:'🇦🇱', tier:'secondary' },
    { name:'Bosnia & Herzegovina', flag:'🇧🇦', tier:'secondary' },
    { name:'Kosovo', flag:'🇽🇰', tier:'secondary' },
    { name:'Egypt', flag:'🇪🇬', tier:'reference', note:'Reference country' },
  ];

  el.innerHTML = `<p style="color:var(--fg-muted);font-size:13px;margin:0 0 16px;">Coverage by country — showing OJA portals and available datasets per geography.</p>
  <div class="lib-countries-grid">
    ${COUNTRIES.map(c => {
      const portals = PORTALS_DATA.filter(p => p.country === c.name);
      const activeP = portals.filter(p => p.status).length;
      const datasets = (State.catalog.datasets || []).filter(d =>
        [d.geography].flat().some(g => g && g.toLowerCase().includes(c.name.toLowerCase()))
      );
      return `<div class="lib-country-card lib-country-${c.tier}">
        <div class="lib-country-card-header">${c.flag} ${esc(c.name)} <span class="badge">${c.tier}</span></div>
        ${c.note ? `<div style="font-size:11px;color:var(--warn);margin:4px 0">⚠ ${esc(c.note)}</div>` : ''}
        <div class="lib-country-stats">
          <span>🕷 ${portals.length} portals (${activeP} active)</span>
          <span>🗄️ ${datasets.length} datasets</span>
        </div>
        ${portals.length ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:3px;">
          ${portals.map(p => `<span class="badge badge-${p.status?'success':'warning'}" title="${esc(p.url)}">${esc(p.name)}</span>`).join('')}
        </div>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}

// ─── Sources (old route kept for backward compat) ─────────────────────────────

async function renderSourcesOld() {
  const el = document.getElementById('sources-list');
  if (!el) return;
  el.innerHTML = '<div class="text-muted">Loading connectors…</div>';
  try {
    const data = await api('/api/sources');
    State.sources = data.sources || [];
    el.innerHTML = `<div class="source-grid">${State.sources.map(s => `
      <div class="source-card" id="src-${esc(s.id)}">
        <div class="source-card-header">
          <span class="source-dot ${s.status === 'idle' ? 'dot-idle' : s.status === 'pending' ? 'dot-pending' : s.status === 'error' ? 'dot-error' : 'dot-ok'}"></span>
          <span class="source-name">${esc(s.name)}</span>
        </div>
        <div class="source-url">${esc(s.url || '')}</div>
        <div class="source-meta">
          ${s.last_fetch ? `<span>Last: ${esc(s.last_fetch)}</span>` : '<span style="color:var(--fg-muted)">Never fetched</span>'}
          ${s.record_count != null ? `<span>${s.record_count} records</span>` : ''}
        </div>
        ${s.error ? `<div class="source-error">${esc(s.error)}</div>` : ''}
        <button class="btn btn-sm" onclick="fetchSource('${esc(s.id)}')">⬇ Fetch</button>
      </div>`).join('')}
    </div>`;
  } catch (e) {
    el.innerHTML = `<div class="callout callout-error">${esc(e.message)}</div>`;
  }
}

async function fetchSource(id) {
  const btn = document.querySelector(`#src-${id} button`);
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Fetching…'; }
  try {
    const r = await postApi(`/api/sources/${id}/fetch`, {});
    showToast(`${r.connector}: ${r.message}`);
  } catch (e) {
    showToast(`Error: ${e.message}`, 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '⬇ Fetch'; }
  }
}

// ─── Insights ─────────────────────────────────────────────────────────────────

async function renderInsights() {
  const el = document.getElementById('insights-charts');
  if (!el) return;
  try {
    const data = await api(`/api/insights/${State.domain}`);
    const charts = (data.charts || []).filter(c => !c.note?.startsWith('Add real data'));

    if (!charts.length) {
      el.innerHTML = `<div class="lab-placeholder">
        <div class="placeholder-icon">📈</div>
        <div>
          <h4>No insights data yet for this domain</h4>
          <p>Add Chart.js-ready JSON files to <code>data/processed/${State.domain}_*.json</code> to populate this tab.
          Each file becomes a chart. See <a href="#" onclick="activateTab('constitution');return false">Constitution</a> for the format.</p>
        </div>
      </div>`;
      return;
    }

    el.innerHTML = charts.map((c, i) => `
      <div class="chart-wrap">
        <div class="chart-title">${esc(c.title || 'Chart')}</div>
        ${c.note ? `<div class="chart-note">${esc(c.note)}</div>` : ''}
        <canvas id="chart-${i}" height="200"></canvas>
      </div>`).join('');

    charts.forEach((c, i) => {
      const canvas = document.getElementById(`chart-${i}`);
      if (!canvas || !c.data) return;
      const existing = State.chartInstances[i];
      if (existing) existing.destroy();
      State.chartInstances[i] = new Chart(canvas, {
        type: c.type || 'line',
        data: c.data,
        options: { ...(c.options || {}), responsive: true, plugins: { legend: { position: 'top' } } },
      });
    });
  } catch (e) {
    el.innerHTML = `<div class="callout callout-error">${esc(e.message)}</div>`;
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function renderProjects() {
  if (!State.projects.length) return;
  // default to first project
  const saved = localStorage.getItem('livlab-project') || (State.projects[0] && State.projects[0].slug);
  switchProject(saved);
}

function switchProject(slug, navEl) {
  // update sidebar active state
  document.querySelectorAll('.proj-nav-item').forEach(el => el.classList.remove('active'));
  const target = navEl || document.querySelector('[data-proj="' + slug + '"]');
  if (target) target.classList.add('active');
  localStorage.setItem('livlab-project', slug);

  const p = State.projects.find(x => x.slug === slug);
  const el = document.getElementById('proj-content');
  if (!el) return;
  if (!p) { el.innerHTML = '<div class="detail-empty">Project not found.</div>'; return; }

  const projColors = { 'eu-almpo':'#2f81f7', 'microidea':'#39d353', 'growth4blue':'#bc8cff', 'train4blue':'#f78166' };
  const color = projColors[slug] || '#8b949e';

  // Month helper: start Jan 2025 for EU-ALMPO
  const startYear = p.start_date ? parseInt(p.start_date.split('-')[0]) : 2025;
  const startMon  = p.start_date ? parseInt(p.start_date.split('-')[1]) : 1;
  function monthToDate(m) {
    if (!m) return '—';
    const d = new Date(startYear, startMon - 1 + m - 1);
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  let html = '';

  // ── Hero ──────────────────────────────────────────────────────────────────
  html += '<div class="proj-hero" style="--proj-color:' + color + '">';
  html += '<div class="proj-hero-left">';
  html += '<div class="proj-hero-name">' + esc(p.name) + '</div>';
  html += '<div class="proj-hero-full">' + esc(p.full_name || '') + '</div>';
  if (p.programme) html += '<div class="proj-hero-prog">' + esc(p.programme) + '</div>';
  html += '</div>';
  html += '<div class="proj-hero-stats">';
  if (p.total_budget) html += '<div class="proj-stat"><div class="proj-stat-val">€' + (p.total_budget/1e6).toFixed(2) + 'M</div><div class="proj-stat-label">Total Budget</div></div>';
  if (p.uop_budget)   html += '<div class="proj-stat"><div class="proj-stat-val">€' + (p.uop_budget/1e3).toFixed(0) + 'K</div><div class="proj-stat-label">UOP Share</div></div>';
  if (p.period)        html += '<div class="proj-stat"><div class="proj-stat-val">' + esc(p.period) + '</div><div class="proj-stat-label">Period</div></div>';
  if (p.duration_months) html += '<div class="proj-stat"><div class="proj-stat-val">' + p.duration_months + ' mo</div><div class="proj-stat-label">Duration</div></div>';
  if (p.grant_number)  html += '<div class="proj-stat"><div class="proj-stat-val">' + esc(p.grant_number) + '</div><div class="proj-stat-label">Grant No.</div></div>';
  if (p.funding_rate)  html += '<div class="proj-stat"><div class="proj-stat-val">' + p.funding_rate + '%</div><div class="proj-stat-label">EU Funding</div></div>';
  html += '</div></div>';

  // ── Description ───────────────────────────────────────────────────────────
  html += '<div class="proj-section">';
  html += '<div class="proj-description">' + esc(p.description || '').replace(/\n/g, '<br>') + '</div>';
  if (p.dmlab_role) {
    html += '<div class="proj-dmlab-role"><strong>🏛️ DMLab / UOP Role:</strong> ' + esc(p.dmlab_role).replace(/\n/g,'<br>') + '</div>';
  }
  html += '</div>';

  // ── Objectives ────────────────────────────────────────────────────────────
  if (p.objectives && p.objectives.length) {
    html += '<div class="proj-section">';
    html += '<div class="proj-section-title">Objectives</div>';
    html += '<ul class="proj-objectives">';
    p.objectives.forEach(function(o) { html += '<li>' + esc(o) + '</li>'; });
    html += '</ul></div>';
  }

  // ── Partners ──────────────────────────────────────────────────────────────
  if (p.partners && p.partners.length) {
    html += '<div class="proj-section">';
    html += '<div class="proj-section-title">Consortium (' + p.partners.length + ' participants)</div>';
    html += '<table class="proj-table">';
    html += '<thead><tr><th>Short</th><th>Organisation</th><th>Country</th><th>Role</th><th>Budget</th><th>Person-Months</th><th>WPs Led</th></tr></thead><tbody>';
    p.partners.forEach(function(partner) {
      const isUOP = partner.short === 'UOP';
      html += '<tr' + (isUOP ? ' class="proj-row-uop"' : '') + '>';
      html += '<td><strong>' + esc(partner.short || '') + '</strong></td>';
      html += '<td>' + esc(partner.name || '') + '</td>';
      html += '<td>' + esc(partner.country || '') + '</td>';
      const roleBadge = partner.role === 'Coordinator' ? 'proj-badge-coord' : partner.role === 'Associated Partner' ? 'proj-badge-ap' : 'proj-badge-ben';
      html += '<td><span class="proj-badge ' + roleBadge + '">' + esc(partner.role || '') + '</span></td>';
      html += '<td>' + (partner.budget ? '€' + partner.budget.toLocaleString() : '—') + '</td>';
      html += '<td>' + (partner.person_months || '—') + '</td>';
      html += '<td>' + ((partner.wps_lead && partner.wps_lead.length) ? partner.wps_lead.map(function(w){return '<span class="proj-wp-chip">' + esc(w) + '</span>';}).join(' ') : '—') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  }

  // ── Work Packages ─────────────────────────────────────────────────────────
  if (p.work_packages && p.work_packages.length) {
    html += '<div class="proj-section">';
    html += '<div class="proj-section-title">Work Packages</div>';
    html += '<div class="proj-wp-grid">';
    p.work_packages.forEach(function(wp) {
      html += '<div class="proj-wp-card">';
      html += '<div class="proj-wp-header" style="border-left:3px solid ' + color + '">';
      html += '<span class="proj-wp-id">' + esc(wp.id) + '</span>';
      html += '<span class="proj-wp-title">' + esc(wp.title) + '</span>';
      html += '</div>';
      html += '<div class="proj-wp-meta">';
      html += '<span>Lead: <strong>' + esc(wp.lead || '—') + '</strong></span>';
      html += '<span>' + (wp.start_month ? 'M' + wp.start_month + '–M' + wp.end_month : '') + '</span>';
      html += '<span>' + (wp.person_months || '') + ' PM</span>';
      html += '</div>';
      if (wp.objective) {
        html += '<div class="proj-wp-obj">' + esc(wp.objective.trim()) + '</div>';
      }
      if (wp.tasks && wp.tasks.length) {
        html += '<ul class="proj-wp-tasks">';
        wp.tasks.forEach(function(t) { html += '<li>' + esc(t) + '</li>'; });
        html += '</ul>';
      }
      if (wp.livlab_note) {
        html += '<div class="proj-wp-note">📌 ' + esc(wp.livlab_note) + '</div>';
      }
      if (wp.deliverables && wp.deliverables.length) {
        html += '<div class="proj-wp-dels">';
        wp.deliverables.forEach(function(d) { html += '<span class="proj-del-chip">' + esc(d) + '</span>'; });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div></div>';
  }

  // ── Deliverables ──────────────────────────────────────────────────────────
  if (p.deliverables && p.deliverables.length) {
    html += '<div class="proj-section">';
    html += '<div class="proj-section-title">Deliverables (' + p.deliverables.length + ')</div>';
    html += '<table class="proj-table proj-del-table">';
    html += '<thead><tr><th>ID</th><th>Title</th><th>WP</th><th>Lead</th><th>Type</th><th>Access</th><th>Due</th></tr></thead><tbody>';
    p.deliverables.forEach(function(d) {
      const livlab = d.livlab ? ' class="proj-row-livlab"' : '';
      html += '<tr' + livlab + '>';
      html += '<td><strong>' + esc(d.id) + '</strong></td>';
      html += '<td>' + esc(d.title) + (d.livlab ? ' <span class="proj-badge proj-badge-livlab">LIVLAB</span>' : '') + '</td>';
      html += '<td><span class="proj-wp-chip">' + esc(d.wp || '') + '</span></td>';
      html += '<td>' + esc(d.lead || '') + '</td>';
      html += '<td>' + esc(d.type || '') + '</td>';
      const accessClass = d.access === 'Public' ? 'proj-badge-pub' : 'proj-badge-sen';
      html += '<td><span class="proj-badge ' + accessClass + '">' + esc(d.access || '') + '</span></td>';
      html += '<td>' + (d.due_month ? 'M' + d.due_month + ' <span class="proj-due-date">(' + monthToDate(d.due_month) + ')</span>' : '—') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  }

  // ── Data Sources ──────────────────────────────────────────────────────────
  if (p.data_sources && p.data_sources.length) {
    html += '<div class="proj-section">';
    html += '<div class="proj-section-title">Data Infrastructure</div>';
    html += '<div class="proj-ds-grid">';
    p.data_sources.forEach(function(ds) {
      html += '<div class="proj-ds-chip">📦 ' + esc(ds) + '</div>';
    });
    html += '</div></div>';
  }

  // ── Countries ─────────────────────────────────────────────────────────────
  if (p.countries && p.countries.length) {
    html += '<div class="proj-section">';
    html += '<div class="proj-section-title">Country Coverage</div>';
    html += '<div class="proj-countries">';
    p.countries.forEach(function(c) { html += '<span class="badge">' + esc(c) + '</span> '; });
    html += '</div></div>';
  }

  el.innerHTML = html;
}

// ─── OJA Portals ─────────────────────────────────────────────────────────────

function renderOJA() {
  const items = State.catalog.applications || [];
  const ojaItem = items.find(i => i.slug === 'oja-portals-catalog' || (i.portals_by_country));
  const el = document.getElementById('oja-table-wrap');
  if (!el) return;

  if (!ojaItem || !ojaItem.portals_by_country) {
    el.innerHTML = '<div class="callout callout-info">OJA portals catalog not loaded. Check <code>knowledge/applications/oja-portals-catalog.yml</code></div>';
    return;
  }

  renderOJATable(ojaItem.portals_by_country);
}

function renderOJATable(portals_by_country, filter = '') {
  const el = document.getElementById('oja-table-wrap');
  if (!el) return;
  const statusFilter = document.getElementById('oja-status')?.value || '';

  const rows = [];
  for (const [country, portals] of Object.entries(portals_by_country)) {
    const pts = Array.isArray(portals) ? portals : [portals];
    pts.forEach(p => {
      if (statusFilter && p.status !== statusFilter) return;
      const text = `${country} ${p.name || ''} ${p.url || ''}`.toLowerCase();
      if (filter && !text.includes(filter)) return;
      rows.push({ country, ...p });
    });
  }

  const count = document.getElementById('oja-count');
  if (count) count.textContent = `${rows.length} portal${rows.length !== 1 ? 's' : ''}`;

  el.innerHTML = `
    <table class="data-table">
      <thead>
        <tr><th>Country</th><th>Portal</th><th>Type</th><th>Status</th><th>Notes</th></tr>
      </thead>
      <tbody>${rows.map(r => `
        <tr>
          <td>${esc(r.country)}</td>
          <td>${r.url ? `<a href="${esc(r.url)}" target="_blank">${esc(r.name || r.url)}</a>` : esc(r.name || '')}</td>
          <td>${r.type ? `<span class="badge">${esc(r.type)}</span>` : ''}</td>
          <td><span class="badge badge-${r.status === 'active' ? 'success' : r.status === 'blocked' ? 'warning' : ''}">${esc(r.status || '')}</span></td>
          <td style="font-size:12px;color:var(--fg-muted);">${esc(r.note || r.notes || '')}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function filterOJA() {
  renderOJAFromPortals();
}

// ─── Map ─────────────────────────────────────────────────────────────────────

async function renderMap() {
  const el = document.getElementById('lab-map');
  if (!el) return;

  // Initialize Leaflet map once
  if (!State.mapInstance) {
    State.mapInstance = L.map('lab-map', { center: [30, 15], zoom: 2 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(State.mapInstance);
  }

  // Clear existing markers
  State.mapMarkers.forEach(m => m.remove());
  State.mapMarkers = [];

  try {
    const data = await api(`/api/domain/${State.domain}/map`);
    const markers = data.markers || [];

    markers.forEach(m => {
      if (!m.lat || !m.lng) return;
      const tier = m.tier || 'reference';
      const color = { primary: '#39d353', secondary: '#2f81f7', reference: '#8b949e', research: '#d2a8ff' }[tier] || '#8b949e';
      const radius = { primary: 10, secondary: 7, reference: 5, research: 6 }[tier] || 5;

      const circle = L.circleMarker([m.lat, m.lng], {
        radius, color, fillColor: color, fillOpacity: 0.6, weight: 2,
      }).addTo(State.mapInstance);

      circle.bindPopup(buildMapPopup(m), {
        maxWidth: 340,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(10, 80),
        autoPanPaddingBottomRight: L.point(10, 20),
      });
      State.mapMarkers.push(circle);
    });

    // Fit bounds
    if (markers.length) {
      const validMarkers = markers.filter(m => m.lat && m.lng);
      if (validMarkers.length > 1) {
        State.mapInstance.fitBounds(
          L.latLngBounds(validMarkers.map(m => [m.lat, m.lng])),
          { padding: [30, 30] }
        );
      } else if (validMarkers.length === 1) {
        State.mapInstance.setView([validMarkers[0].lat, validMarkers[0].lng], 6);
      }
    }
  } catch (e) {
    console.error('Map load error:', e);
  }

  // Force Leaflet to recalculate after tab becomes visible
  setTimeout(() => State.mapInstance?.invalidateSize(), 100);
}

function mapFlyTo(countryName, lat, lng) {
  if (!State.mapInstance) return;
  State.mapInstance.flyTo([lat, lng], 6, { duration: 1.2 });
  // Highlight the country item in sidebar
  document.querySelectorAll('.map-cl-item').forEach(el => {
    el.classList.toggle('map-cl-active', el.dataset.country === countryName);
  });
  // Open the marker popup for this country if found
  State.mapMarkers.forEach(marker => {
    const ll = marker.getLatLng();
    if (Math.abs(ll.lat - lat) < 1.5 && Math.abs(ll.lng - lng) < 3) {
      marker.openPopup();
    }
  });
}

function buildMapPopup(m) {
  const src = m.sources || {};
  let html = `<div class="country-popup">
    <div class="popup-country">${esc(m.country || m.name || '')} ${m.flag || ''}</div>
    <div class="popup-tier">${({'primary':'🟢 Active crawling + full data collection','secondary':'🔵 Monitored, partial coverage','reference':'⚫ Reference only — not actively crawled','research':'🟣 Research studies only'})[m.tier||'reference'] || esc(m.tier||'reference')}</div>`;

  const sections = [
    { key: 'demand', label: '📡 Demand Sources' },
    { key: 'supply', label: '👥 Supply Sources' },
    { key: 'skills', label: '🎓 Skills Data' },
    { key: 'institutional', label: '🏛️ Institutional' },
  ];
  sections.forEach(s => {
    const items = src[s.key] || [];
    if (!items.length) return;
    html += `<div class="popup-section"><div class="popup-section-label">${s.label}</div>`;
    items.forEach(item => {
      html += `<div class="popup-source-row">
        <span class="popup-source-type">${esc(item.type || '')}</span>
        ${item.url ? `<a href="${esc(item.url)}" target="_blank">${esc(item.name)}</a>` : esc(item.name)}
        ${item.note ? `<span class="popup-note">${esc(item.note)}</span>` : ''}
      </div>`;
    });
    html += '</div>';
  });

  if (m.projects?.length) {
    html += `<div class="popup-section"><div class="popup-section-label">🔬 Projects</div>
      ${m.projects.map(p => `<span class="project-chip">${esc(p)}</span>`).join('')}
    </div>`;
  }

  if (m.crawler_status) {
    html += `<div class="popup-section"><div class="popup-section-label">🕷 Crawler</div>
      <span class="badge badge-${m.crawler_status === 'active' ? 'success' : 'warning'}">${esc(m.crawler_status)}</span>
      ${m.portals_count ? `<span style="margin-left:6px;">${m.portals_count} portals</span>` : ''}
    </div>`;
  }

  html += '</div>';
  return html;
}

// ─── Constitution ─────────────────────────────────────────────────────────────

async function renderConstitution() {
  const el = document.getElementById('constitution-content');
  if (!el || el.dataset.loaded) return;
  try {
    const r = await fetch('/config/constitution.md');
    const text = await r.text();
    el.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : `<pre>${esc(text)}</pre>`;
    el.dataset.loaded = '1';
  } catch (e) {
    el.innerHTML = `<div class="callout callout-error">Could not load constitution: ${esc(e.message)}</div>`;
  }
}

// ─── Playground ───────────────────────────────────────────────────────────────

// ─── Interaction Tab ─────────────────────────────────────────────────────────

const INTERACT_AGENTS = {
  assistant:       { icon: '🧠', color: '#2f81f7', label: 'Lab Assistant',   role: 'General Q&A · Claude' },
  rat_researcher:  { icon: '🔬', color: '#2f81f7', label: 'rat_researcher',  role: 'Labor economist · AI researcher' },
  rat_analyst:     { icon: '📊', color: '#56d364', label: 'rat_analyst',     role: 'Quantitative economist · Data eng.' },
  rat_visualizer:  { icon: '📈', color: '#d2a8ff', label: 'rat_visualizer',  role: 'Viz engineer · LMI analyst' },
  rat_monitor:     { icon: '🛰️', color: '#ffa657', label: 'rat_monitor',     role: 'DevOps · Infrastructure' },
};

const InteractState = {
  agent: 'assistant',
  histories: {},   // per-agent message arrays
  mentionOpen: false,
  mentionFilter: '',
};

function selectAgent(name, el) {
  InteractState.agent = name;
  document.querySelectorAll('.interact-agent').forEach(e => e.classList.remove('active'));
  if (el) el.classList.add('active');
  const a = INTERACT_AGENTS[name] || INTERACT_AGENTS.assistant;
  const hdr = document.getElementById('interact-header-avatar');
  const hdrName = document.getElementById('interact-header-name');
  const hdrDesc = document.getElementById('interact-header-desc');
  const pillIcon = document.getElementById('interact-pill-icon');
  const pillName = document.getElementById('interact-pill-name');
  if (hdr) hdr.textContent = a.icon;
  if (hdrName) hdrName.textContent = a.label;
  if (hdrDesc) hdrDesc.textContent = a.role;
  if (pillIcon) pillIcon.textContent = a.icon;
  if (pillName) pillName.textContent = name;
  renderInteractHistory();
  const inp = document.getElementById('interact-input');
  if (inp) inp.focus();
}

function renderInteractHistory() {
  const container = document.getElementById('interact-history');
  if (!container) return;
  const msgs = InteractState.histories[InteractState.agent] || [];
  if (!msgs.length) {
    const a = INTERACT_AGENTS[InteractState.agent] || INTERACT_AGENTS.assistant;
    container.innerHTML = '<div class="interact-msg assistant"><div class="interact-msg-body">' +
      a.icon + ' <strong>' + esc(a.label) + '</strong> ready. ' + esc(a.role) + '. Type your task below.' +
      '</div></div>';
    return;
  }
  container.innerHTML = msgs.map(m => {
    const body = m.role === 'assistant' && typeof marked !== 'undefined'
      ? marked.parse(m.content)
      : esc(m.content);
    let extra = '';
    if (m.tools && m.tools.length) {
      extra = '<div class="interact-tools">' +
        m.tools.map(t => '<span class="interact-tool-chip">🔧 ' + esc(t) + '</span>').join('') +
        '</div>';
    }
    return '<div class="interact-msg ' + m.role + '">' +
      (m.role === 'assistant' ? '<span class="interact-msg-avatar">' + esc(m.icon || '🧠') + '</span>' : '') +
      '<div class="interact-msg-body">' + body + extra + '</div>' +
      '</div>';
  }).join('');
  container.scrollTop = container.scrollHeight;
}

function interactKeydown(e) {
  const dd = document.getElementById('interact-mention-dropdown');
  if (dd && !dd.classList.contains('hidden')) {
    if (e.key === 'Escape') { hideMentionDropdown(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); navigateMention(e.key); return; }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const active = dd.querySelector('.interact-mention-item.focused');
      if (active) { active.dispatchEvent(new MouseEvent('mousedown')); return; }
    }
  }
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); interactSend(); }
}

function interactInput(e) {
  const val = e.target.value;
  const pos = e.target.selectionStart;
  // find last @ before cursor
  const before = val.slice(0, pos);
  const atIdx = before.lastIndexOf('@');
  if (atIdx !== -1) {
    const fragment = before.slice(atIdx + 1);
    if (!/\s/.test(fragment)) {
      showMentionDropdown(fragment);
      return;
    }
  }
  hideMentionDropdown();
}

function showMentionDropdown(filter) {
  const dd = document.getElementById('interact-mention-dropdown');
  if (!dd) return;
  const items = dd.querySelectorAll('.interact-mention-item');
  let anyVisible = false;
  items.forEach(item => {
    const name = item.dataset.agent || '';
    const visible = name.includes(filter.toLowerCase());
    item.style.display = visible ? '' : 'none';
    if (visible) anyVisible = true;
  });
  dd.classList.toggle('hidden', !anyVisible);
  InteractState.mentionOpen = anyVisible;
}

function hideMentionDropdown() {
  const dd = document.getElementById('interact-mention-dropdown');
  if (dd) dd.classList.add('hidden');
  InteractState.mentionOpen = false;
}

function navigateMention(key) {
  const dd = document.getElementById('interact-mention-dropdown');
  if (!dd) return;
  const visible = Array.from(dd.querySelectorAll('.interact-mention-item')).filter(i => i.style.display !== 'none');
  const cur = visible.findIndex(i => i.classList.contains('focused'));
  visible.forEach(i => i.classList.remove('focused'));
  const next = key === 'ArrowDown' ? Math.min(cur + 1, visible.length - 1) : Math.max(cur - 1, 0);
  if (visible[next]) visible[next].classList.add('focused');
}

function pickMention(agentName) {
  const inp = document.getElementById('interact-input');
  if (!inp) return;
  const val = inp.value;
  const pos = inp.selectionStart;
  const before = val.slice(0, pos);
  const atIdx = before.lastIndexOf('@');
  const after = val.slice(pos);
  inp.value = before.slice(0, atIdx) + '@' + agentName + ' ' + after;
  inp.focus();
  hideMentionDropdown();
  // Also switch active agent in sidebar
  const sidebarEl = document.querySelector('.interact-agent[data-agent="' + agentName + '"]');
  selectAgent(agentName, sidebarEl);
}

async function interactSend() {
  const inp = document.getElementById('interact-input');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  hideMentionDropdown();

  // detect @mention override
  const mentionMatch = msg.match(/@(rat_researcher|rat_analyst|rat_visualizer|rat_monitor)/);
  let targetAgent = InteractState.agent;
  let taskMsg = msg;
  if (mentionMatch) {
    targetAgent = mentionMatch[1];
    taskMsg = msg.replace('@' + targetAgent, '').trim();
    const sidebarEl = document.querySelector('.interact-agent[data-agent="' + targetAgent + '"]');
    selectAgent(targetAgent, sidebarEl);
  }

  const a = INTERACT_AGENTS[targetAgent] || INTERACT_AGENTS.assistant;
  if (!InteractState.histories[targetAgent]) InteractState.histories[targetAgent] = [];
  InteractState.histories[targetAgent].push({ role: 'user', content: msg });
  renderInteractHistory();

  const btn = document.getElementById('interact-send-btn');
  const btnOrigText = btn ? btn.textContent : 'Send';
  if (btn) { btn.disabled = true; btn.textContent = '⏳'; btn.style.opacity = '0.6'; }
  if (inp) inp.disabled = true;

  // thinking placeholder
  const thinkingMsg = { role: 'assistant', icon: a.icon, content: '…', _thinking: true };
  InteractState.histories[targetAgent].push(thinkingMsg);
  renderInteractHistory();

  try {
    let reply, tools = [];

    if (targetAgent === 'assistant') {
      // route to Claude via existing /api/chat
      const data = await postApi('/api/chat', {
        message: taskMsg,
        domain: State.domain,
        current_tab: State.activeTab,
        history: (InteractState.histories.assistant || []).slice(-10)
          .filter(m => !m._thinking)
          .map(m => ({ role: m.role, content: m.content })),
      });
      reply = data.reply;
    } else {
      // route to rat via /api/rats/{name}/chat
      const resp = await fetch('/api/rats/' + targetAgent + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: taskMsg, current_tab: State.activeTab, domain: State.domain }),
      });
      if (!resp.ok) throw new Error('Rats service offline — run: docker compose up agents');
      const data = await resp.json();
      if (data.error && !data.output) {
        // Surface upstream errors (rate limits, API failures) clearly
        const errMsg = data.error.includes('429') || data.error.includes('rate')
          ? '⏳ Model rate-limited upstream — wait a moment and try again.\n\n`' + data.error.substring(0, 200) + '`'
          : '⚠ Agent error: ' + data.error.substring(0, 300);
        throw new Error(errMsg);
      }
      reply = data.output || data.result?.output_summary || 'Done.';
      tools = data.tool_calls || data.result?.tool_calls || [];
      // Easter egg: toggle skaven visual mode
      if (data.skaven_mode !== undefined) {
        const agentEl = document.querySelector(`.interact-agent[data-agent="${targetAgent}"]`);
        if (agentEl) {
          agentEl.classList.toggle('skaven-active', data.skaven_mode);
          const nameEl = agentEl.querySelector('.interact-agent-name');
          if (nameEl) nameEl.textContent = data.skaven_mode ? targetAgent + ' [yes-yes!]' : targetAgent;
        }
        // Banner + sewer background on the whole chat pane
        const chatPane = document.getElementById('interact-chat-pane');
        const banner = document.getElementById('skaven-banner');
        if (chatPane) chatPane.classList.toggle('skaven-mode', data.skaven_mode);
        if (banner) banner.classList.toggle('visible', data.skaven_mode);
      }
    }

    // replace thinking with real reply
    const idx = InteractState.histories[targetAgent].indexOf(thinkingMsg);
    if (idx !== -1) InteractState.histories[targetAgent][idx] = { role: 'assistant', icon: a.icon, content: reply, tools };
    renderInteractHistory();

  } catch (err) {
    const idx = InteractState.histories[targetAgent].indexOf(thinkingMsg);
    if (idx !== -1) InteractState.histories[targetAgent][idx] = { role: 'assistant', icon: '⚠', content: '⚠ ' + err.message };
    renderInteractHistory();
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = btnOrigText; btn.style.opacity = ''; }
    if (inp) inp.disabled = false;
  }
}

// Legacy stubs (keep old play-* functions working if anything references them)
function playKeydown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); interactSend(); } }
function sendMessage() { interactSend(); }
function clearChat() { InteractState.histories = {}; renderInteractHistory(); }
function setQuestion(q) { const i = document.getElementById('interact-input'); if (i) { i.value = q; i.focus(); } }

// ─── Theme ────────────────────────────────────────────────────────────────────

function initTheme() {
  const saved = localStorage.getItem('livlab-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const cycle = { light: 'dark', dark: 'rat', rat: 'light' };
  const next = cycle[cur] || 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('livlab-theme', next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const icons = { dark: '☀️', light: '🌙', rat: '🐀' };
  btn.textContent = icons[theme] || '🌙';
  btn.title = theme === 'rat' ? 'Yes-yes, the glorious rat theme!' : 'Toggle theme';
}

// ─── Implementation: Portals ──────────────────────────────────────────────────

const COUNTRY_FLAGS = {
  Greece:'🇬🇷', Italy:'🇮🇹', Spain:'🇪🇸', Cyprus:'🇨🇾', Slovenia:'🇸🇮',
  Serbia:'🇷🇸', Montenegro:'🇲🇪', 'North Macedonia':'🇲🇰', Denmark:'🇩🇰',
};
const PROJECT_COLORS = {
  'EU-ALMPO':'#2f81f7', 'MICROIDEA':'#39d353', 'GROWTH4BLUE':'#1a9e72', 'TRAIN4BLUE':'#bc8cff',
};

function renderImplPortals() {
  const q = (document.getElementById('impl-portals-search')?.value || '').toLowerCase();
  const country = document.getElementById('impl-portals-country')?.value || '';
  const project = document.getElementById('impl-portals-project')?.value || '';
  const statusF = document.getElementById('impl-portals-status')?.value || '';

  let rows = PORTALS_DATA.filter(p => {
    if (country && p.country !== country) return false;
    if (project && !p.projects.includes(project)) return false;
    if (statusF === 'active' && !p.status) return false;
    if (statusF === 'inactive' && p.status) return false;
    if (q) {
      const text = `${p.name} ${p.country} ${p.url} ${p.comment || ''}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  const countEl = document.getElementById('impl-portals-count');
  if (countEl) countEl.textContent = `${rows.length} of ${PORTALS_DATA.length} portals`;

  // Summary stats
  const active = rows.filter(r => r.status).length;
  const withMeta = rows.filter(r => r.metadata).length;

  const el = document.getElementById('impl-portals-table');
  if (!el) return;

  el.innerHTML = `
    <div class="impl-stats-row">
      <div class="impl-stat"><span class="impl-stat-num">${rows.length}</span><span class="impl-stat-lbl">Portals</span></div>
      <div class="impl-stat"><span class="impl-stat-num" style="color:var(--success)">${active}</span><span class="impl-stat-lbl">Active</span></div>
      <div class="impl-stat"><span class="impl-stat-num" style="color:var(--warn)">${rows.length - active}</span><span class="impl-stat-lbl">Inactive</span></div>
      <div class="impl-stat"><span class="impl-stat-num">${withMeta}</span><span class="impl-stat-lbl">With Metadata</span></div>
    </div>
    <table class="data-table impl-portals-table">
      <thead>
        <tr>
          <th>Portal</th>
          <th>Country</th>
          <th>Status</th>
          <th>Metadata</th>
          <th>Start Date</th>
          <th>Projects</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(p => `
          <tr>
            <td><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a></td>
            <td>${COUNTRY_FLAGS[p.country] || ''} ${esc(p.country)}</td>
            <td><span class="badge badge-${p.status ? 'success' : 'warning'}">${p.status ? '✓ Active' : '✗ Inactive'}</span></td>
            <td>${p.metadata ? '<span class="badge badge-success">✓</span>' : '<span style="color:var(--fg-muted)">—</span>'}</td>
            <td style="font-size:12px;color:var(--fg-muted)">${esc(p.start || '—')}</td>
            <td>${p.projects.map(pr => `<span class="impl-project-chip" style="background:${PROJECT_COLORS[pr]}22;color:${PROJECT_COLORS[pr]};border-color:${PROJECT_COLORS[pr]}44">${esc(pr)}</span>`).join('')}</td>
            <td style="font-size:11px;color:var(--fg-muted);max-width:200px">${p.comment ? `<span title="${esc(p.comment)}">⚠ ${esc(p.comment.slice(0, 60))}${p.comment.length > 60 ? '…' : ''}</span>` : ''}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

// ─── Implementation: Deliverables 2026 ───────────────────────────────────────

function renderImplDeliverables() {
  const PC = { 'EU-ALMPO':'#2f81f7','MICROIDEA':'#39d353','GROWTH4BLUE':'#1a9e72','TRAIN4BLUE':'#bc8cff' };
  const projectF = document.getElementById('impl-del-project')?.value || '';
  const rows = projectF ? DELIVERABLES_DATA.filter(d => d.project === projectF) : [...DELIVERABLES_DATA];

  const countEl = document.getElementById('impl-del-count');
  if (countEl) countEl.textContent = `${rows.length} deliverable${rows.length !== 1 ? 's' : ''}`;

  // ── Timeline strip ──────────────────────────────────────────────────────────
  const timelineEl = document.getElementById('impl-deliverables-timeline');
  if (timelineEl) {
    const months = [
      { key:'Jul 2026', label:'July', num:'07' },
      { key:'Aug 2026', label:'Aug',  num:'08' },
      { key:'Sep 2026', label:'Sep',  num:'09' },
      { key:'Oct 2026', label:'Oct',  num:'10' },
      { key:'Nov 2026', label:'Nov',  num:'11' },
      { key:'Dec 2026', label:'Dec',  num:'12' },
    ];
    const buckets = {};
    months.forEach(m => buckets[m.key] = []);
    rows.forEach(d => {
      const mm = d.due.split('/')[1];
      const found = months.find(m => m.num === mm);
      const key = found ? found.key : 'Dec 2026';
      buckets[key].push(d);
    });
    timelineEl.innerHTML = `
      <div class="del-timeline">
        ${months.map(m => `
          <div class="del-timeline-col ${buckets[m.key].length ? '' : 'del-col-empty'}">
            <div class="del-timeline-month">${m.label}</div>
            ${buckets[m.key].map(d => `
              <div class="del-chip" style="--proj-color:${PC[d.project] || '#8b949e'}">
                <div class="del-chip-id">${esc(d.id)}</div>
                <div class="del-chip-proj">${esc(d.project)}</div>
              </div>`).join('') || '<div class="del-chip-empty">·</div>'}
          </div>`).join('')}
      </div>`;
  }

  // ── Deliverable cards ───────────────────────────────────────────────────────
  const tableEl = document.getElementById('impl-deliverables-table');
  if (!tableEl) return;
  tableEl.innerHTML = `<div class="del-cards">
    ${rows.map(d => `
      <div class="del-card" style="--proj-color:${PC[d.project] || '#8b949e'}">
        <div class="del-card-side"></div>
        <div class="del-card-body">
          <div class="del-card-header">
            <span class="del-card-id">${esc(d.id)}</span>
            <span class="del-card-proj" style="color:${PC[d.project]}">${esc(d.project)}</span>
            <span class="del-card-due">📅 ${esc(d.due)}</span>
          </div>
          <div class="del-card-title">${esc(d.title)}</div>
          <div class="del-card-notes">${esc(d.notes)}</div>
        </div>
      </div>`).join('')}
  </div>`;
}

// ─── OJA tab now uses PORTALS_DATA directly ──────────────────────────────────

function renderOJAFromPortals() {
  const q = (document.getElementById('oja-search')?.value || '').toLowerCase();
  const statusF = document.getElementById('oja-status')?.value || '';

  const rows = PORTALS_DATA.filter(p => {
    if (statusF === 'active' && !p.status) return false;
    if (statusF === 'blocked' && p.status) return false;
    if (q) {
      const text = `${p.name} ${p.country} ${p.url}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });

  const countEl = document.getElementById('oja-count');
  if (countEl) countEl.textContent = `${rows.length} portals`;

  const el = document.getElementById('oja-table-wrap');
  if (!el) return;
  el.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Country</th><th>Portal</th><th>Type</th><th>Status</th><th>Notes</th></tr></thead>
      <tbody>${rows.map(p => `
        <tr>
          <td>${COUNTRY_FLAGS[p.country] || ''} ${esc(p.country)}</td>
          <td><a href="${esc(p.url)}" target="_blank">${esc(p.name)}</a></td>
          <td><span class="badge">${p.url.includes('gov') || p.url.includes('nsz') || p.url.includes('zzzcg') || p.url.includes('jobnet') ? 'official' : 'private'}</span></td>
          <td><span class="badge badge-${p.status ? 'success' : 'warning'}">${p.status ? 'active' : 'inactive'}</span></td>
          <td style="font-size:12px;color:var(--fg-muted)">${esc(p.comment || '')}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function itemTags(item) {
  const tags = item.topics || item.tags || [];
  if (!tags.length) return '';
  return `<div class="item-tags">${tags.slice(0, 5).map(t => `<span class="badge">${esc(t)}</span>`).join('')}</div>`;
}

function accessColor(access) {
  if (!access) return '';
  if (access.includes('free') || access === 'open') return 'success';
  if (access.includes('registration') || access.includes('website')) return 'warning';
  if (access.includes('research') || access.includes('licensed') || access.includes('commercial')) return 'error';
  return '';
}

function statusColor(status) {
  if (!status) return '';
  if (status === 'production' || status === 'active') return 'success';
  if (status === 'prototype' || status === 'beta') return 'warning';
  if (status === 'research' || status === 'concept') return '';
  return '';
}

function badgeColor(role) {
  if (!role) return '';
  if (role === 'lead' || role === 'coordinator') return 'success';
  if (role === 'partner') return 'warning';
  return '';
}

function appIcon(category) {
  const icons = {
    'labor-intelligence': '🧠', 'workforce-planning': '📋',
    'job-recommendation': '🎯', 'economic-forecasting': '📈',
    'wage-analysis': '💶', 'data-sources': '📡',
    'skill-intelligence': '🎓', 'policy': '🏛️',
  };
  return icons[category] || '🚀';
}

// ─── LMI Research Tab ─────────────────────────────────────────────────────────
// Practical lab notebook: what data we have, how to visualize it, portal benchmarks

const LMI_VIZ_DATA = [
  {
    id: 'timeseries', name: 'Time-Series / Trend Line', category: 'temporal',
    icon: '📈',
    definition: 'Line chart with time on x-axis and a quantitative variable on y-axis. Multiple series possible but limit to 5–7 before spaghetti effect.',
    question: 'How has unemployment/vacancy/employment changed over time?',
    libraries: ['Chart.js v4','D3 v7','ECharts v5'],
    bestFor: 'Unemployment rate, vacancy rate, hiring rate, NEET rate over time',
    gotcha: 'Always show axis break if Y-axis doesn\'t start at zero. Recession/crisis shading adds critical interpretive context. Too many series → use small multiples instead.',
    useCase: 'Quarterly unemployment rate 2000–2026 for Greece/Italy/Spain/Western Balkans, with crisis periods shaded (2008–2010 recession, 2010–2015 Greek debt crisis, 2020 COVID).',
    refs: ['FRED interactive time series','Eurostat Key Indicators','ELSTAT quarterly LFS releases'],
  },
  {
    id: 'area', name: 'Area Chart / Stacked Area', category: 'temporal',
    icon: '📊',
    definition: 'Line chart with area below filled. Stacked area shows multiple series cumulatively — series sit on top of each other. 100% stacked shows proportions.',
    question: 'What is the composition of employment over time? How have sector shares changed?',
    libraries: ['D3 v7','Chart.js v4','ECharts v5'],
    bestFor: 'Employment by sector over decades; composition of inactive population; skill category shares',
    gotcha: '100% stacked hides absolute changes — choose based on question. More than 6–8 series becomes unreadable; group minor categories into "Other". Color order matters: most stable series at bottom.',
    useCase: 'Employment structure Greece 1990–2026 by sector (agriculture, manufacturing, tourism/hospitality, public sector, services). Shows the shift from agriculture to services and growth of tourism dependence.',
    refs: ['Cedefop Skills Forecast sector projections','BLS Occupational Outlook employment projections'],
  },
  {
    id: 'hbar', name: 'Horizontal Bar Chart (Ranked)', category: 'comparison',
    icon: '📊',
    definition: 'Bars extending horizontally from a categorical y-axis. Always sorted descending for ranked lists. Superior to vertical bars for long category labels.',
    question: 'What are the top skills/occupations/countries by a precise value?',
    libraries: ['Chart.js v4','D3 v7','ECharts v5','Observable Plot'],
    bestFor: 'Top 20 demanded skills; ranked occupation list; country comparisons with long names',
    gotcha: 'Always sort descending for rankings. Annotation of specific bars (EU average reference line) adds value. Truncated axis exaggerates differences — label clearly.',
    useCase: 'Top 25 ESCO skills demanded in Greek OJA data; Most common occupations posted by sector; Country ranking of NEET rates.',
    refs: ['Lightcast Top Skills','BLS OOH employment size'],
  },
  {
    id: 'groupedbar', name: 'Grouped Bar Chart', category: 'comparison',
    icon: '📊',
    definition: 'Multiple bars side-by-side for each category, enabling simultaneous comparison across subgroups (e.g., gender, age, education level).',
    question: 'How does the indicator differ by gender, age group, or education level?',
    libraries: ['Chart.js v4','ECharts v5','Vega-Lite'],
    bestFor: 'Gender employment gap by country; youth vs. adult unemployment; employment by education level',
    gotcha: 'More than 3–4 groups per category becomes cluttered — consider small multiples. Use colorblind-safe palette (blue/orange rather than blue/pink for gender). Keep group ordering consistent.',
    useCase: 'Male/female employment rates all 12 lab countries; Youth (15–24) vs. adult (25–54) unemployment by Western Balkan country.',
    refs: ['Eurostat employment by gender','OECD employment by educational attainment'],
  },
  {
    id: 'heatmap', name: 'Heatmap / Calendar Heatmap', category: 'comparison',
    icon: '🔥',
    definition: 'Matrix where rows and columns represent two categorical variables; color encodes value. Calendar variant uses week×day or month×year grid.',
    question: 'How does skill demand vary by month and occupation? What is the seasonality pattern of hiring?',
    libraries: ['D3 v7','ECharts v5','Cal-Heatmap'],
    bestFor: 'OJA posting patterns by month×sector; skill demand by occupation×region; seasonal tourism hiring spikes in Greece',
    gotcha: 'Color scale choice is critical: sequential (single hue) for one direction; diverging (two hues) for above/below average. Always include a legend. ColorBrewer palettes are colorblind-safer.',
    useCase: 'Monthly hiring patterns in Greek hospitality sector (Ergani flow data) — reveals June–September spike at 3–4× winter baseline; OJA skill demand by ISCO group × NUTS2 region.',
    refs: ['Cal-Heatmap','Highcharts Calendar Heatmap'],
  },
  {
    id: 'choropleth', name: 'Choropleth Map', category: 'geographic',
    icon: '🗺️',
    definition: 'Geographic map where regions are colored according to a statistical value. Always normalize by population (rate, not count).',
    question: 'Where is unemployment highest? Which NUTS2 regions have the tightest labor markets?',
    libraries: ['D3 v7','Leaflet.js','ECharts v5','MapLibre GL'],
    bestFor: 'NUTS2 unemployment rates; regional NEET rates; OJA vacancy density by region',
    gotcha: 'ALWAYS normalize — map unemployment rate, not absolute count. Classification method matters: Jenks natural breaks reveals clusters; quantile ensures equal-sized classes. Use ColorBrewer palettes (YlOrRd, Blues). Western Balkans: not in NUTS — use ISO 3166 with hatching for these.',
    useCase: 'NUTS2 unemployment rate map of EU + Western Balkans; Regional NEET rate comparison; OJA vacancy density by NUTS2. Requires Eurostat NUTS2 GeoJSON (nuts2json package).',
    refs: ['Eurostat regional maps','Skills-OVATE regional dashboards','nuts2json package'],
  },
  {
    id: 'bubble', name: 'Bubble Map / Proportional Symbol Map', category: 'geographic',
    icon: '🗺️',
    definition: 'Map overlaid with circles where circle area (not radius) encodes a quantitative value. Use d3.scaleSqrt() for correct area encoding.',
    question: 'Where are job vacancies concentrated by city? Which cities have the most OJA activity?',
    libraries: ['Leaflet.js + D3','ECharts v5'],
    bestFor: 'City-level OJA concentration; portal coverage by city; employment center sizes',
    gotcha: 'Use d3.scaleSqrt() — area (not radius) must be proportional to value. Overlapping circles in dense areas need transparency. Leaflet for tile base; D3 SVG overlay for circles.',
    useCase: 'OJA portal activity concentration by city across 12 lab countries; Ergani-registered employer density by NUTS3 prefecture (Greece).',
    refs: ['Leaflet.js documentation','D3 symbol map examples'],
  },
  {
    id: 'treemap', name: 'Treemap', category: 'hierarchy',
    icon: '📦',
    definition: 'Hierarchical rectangular partitioning where area encodes quantitative value and nested rectangles encode hierarchy levels. squarify algorithm minimizes wasted space.',
    question: 'What is the employment share of each sector and subsector simultaneously?',
    libraries: ['D3 v7','ECharts v5'],
    bestFor: 'NACE sector + subsector employment; ESCO skill taxonomy with demand frequency; GDP × employment share',
    gotcha: 'Very small rectangles become unreadable — apply minimum size threshold or "Other" aggregation. ECharts drill-down capability is particularly valuable for ESCO\'s multi-level occupation tree.',
    useCase: 'Employment by NACE sector/subsector in Greece; ESCO skill taxonomy hierarchy with OJA skill demand frequency encoded as area.',
    refs: ['D3 treemap documentation','BLS Jobs Visualizer (Karpathy)'],
  },
  {
    id: 'sunburst', name: 'Sunburst / Radial Hierarchy', category: 'hierarchy',
    icon: '☀️',
    definition: 'Hierarchical pie chart radiating outward, with each ring representing a level of hierarchy. Zoomable/drillable version essential for deep taxonomies.',
    question: 'How does the ESCO occupation tree relate to its sub-groups?',
    libraries: ['D3 v7','ECharts v5'],
    bestFor: 'ESCO occupation hierarchy (10 broad → 43 sub → 436 unit groups → 3,000+ occupations); ESCO skills taxonomy',
    gotcha: 'Angle perception problem for outer rings — areas at large radii are hard to compare. Maximum practical depth: 4 levels. Label only largest segments.',
    useCase: 'ESCO occupation hierarchy with vacancy count or employment as value; ESCO skills taxonomy (transversal vs. technical vs. knowledge).',
    refs: ['D3 Observable sunburst example','ECharts sunburst series'],
  },
  {
    id: 'sankey', name: 'Sankey / Alluvial Diagram', category: 'flow',
    icon: '🔀',
    definition: 'Left-to-right flow diagram where nodes=categories, links=flows, link width=flow volume. Alluvial variant shows group composition changes across discrete time points.',
    question: 'How do workers flow from one industry/sector to another? What are upskilling pathways?',
    libraries: ['D3 v7 (d3-sankey)','ECharts v5','Plotly'],
    bestFor: 'Worker transitions between sectors; labor status flows (employed→unemployed→NEET); industry-to-industry mobility; career pathways',
    gotcha: 'Alluvial (stepped) is better for comparing composition changes over discrete time columns. Sankey for continuous flows. Overlapping links at wide nodes are hard to read — use vertical layout for long chains.',
    useCase: 'Worker transitions informal→formal employment (before/after policy intervention); Labor status flows during COVID; Industry-to-industry transitions in Western Balkans 2008–2015.',
    refs: ['d3-sankey plugin','Crunchr HR analytics','rawgraphs.io'],
  },
  {
    id: 'chord', name: 'Chord Diagram', category: 'flow',
    icon: '🎵',
    definition: 'Circular visualization showing flows between entities arranged around a circle. Width of chord = volume of bidirectional flow between two entities.',
    question: 'Which occupations do workers transition between? How do skills co-occur across job postings?',
    libraries: ['D3 v7','ECharts v6+'],
    bestFor: 'Occupational transition matrices; skill co-occurrence networks; bilateral worker mobility',
    gotcha: 'Limit to 10–15 entities max — more creates hairball. Arc crossing minimization is NP-hard; manually order by sector for cleaner layout. Weight by probability not raw count to normalize for occupation size.',
    useCase: 'Occupational transitions in Greece/Western Balkans; Skill flow between sectors (which skills appear in both declining and growing sectors).',
    refs: ['D3 chord diagram','ECharts chord series (v6.0+)'],
  },
  {
    id: 'scatter', name: 'Scatter Plot / Connected Scatter', category: 'comparison',
    icon: '⚪',
    definition: 'Two-dimensional plot where each observation is a dot at (x,y) coordinates. Connected scatter connects points chronologically — key for Beveridge Curve.',
    question: 'What is the relationship between two labor market variables? Where is the economy in the business cycle?',
    libraries: ['D3 v7','Chart.js v4','Observable Plot'],
    bestFor: 'Beveridge Curve (unemployment vs. vacancy rate); NEET vs. youth unemployment; wage growth vs. productivity',
    gotcha: 'For connected scatter (Beveridge Curve): color gradient for time is ESSENTIAL — otherwise path is confusing. Annotate key events (COVID, peak vacancies). Arrow on most recent segment shows direction.',
    useCase: 'Beveridge Curve for Greece (Ergani vacancies + ELSTAT unemployment, 2010–2026); Multi-country panel Beveridge curves showing different matching efficiency levels.',
    refs: ['FRED Blog Beveridge Curve','St. Louis Fed interactive'],
  },
  {
    id: 'boxplot', name: 'Box Plot / Violin Plot', category: 'distribution',
    icon: '📦',
    definition: 'Box plot shows median, quartiles, and outliers. Violin plot shows full distribution shape (kernel density). Violin is better for multi-modal distributions.',
    question: 'How does the wage/employment distribution vary across occupations or regions?',
    libraries: ['ECharts v5 (native)','D3 v7 (custom)','Chart.js v4 (plugin)'],
    bestFor: 'Wage distribution by occupation group (ISCO major group); Regional employment rate distribution; OJA-reported salary range by skill category',
    gotcha: 'Box plots hide sample size and distribution shape — always show n. Violin plots are better for multi-modal distributions (common in wages: low/high-wage bimodal in dual labor markets). For Greece\'s dual labor market: wage distributions by sector will show bimodality in sheltered sectors.',
    useCase: 'Wage distribution by ISCO major group; Regional employment rate distribution showing convergence/divergence across 13 Greek NUTS2 regions.',
    refs: ['ECharts boxplot','data-to-viz.com'],
  },
  {
    id: 'radar', name: 'Radar / Spider Chart', category: 'comparison',
    icon: '🕷️',
    definition: 'Multi-axis chart where each axis = different variable; values form a polygon. Multiple entities form overlapping polygons. All axes must use same scale.',
    question: 'How does an occupation\'s competency profile compare to job requirement profile?',
    libraries: ['Chart.js v4','D3 v7','ECharts v5'],
    bestFor: 'ESCO competency profiles (supply) vs. OJA skill demand (demand) — gap = mismatch area; Country labor market health index across all 12 lab countries',
    gotcha: 'Do not display more than ~5 groups on the same plot — more creates visual tangle. All axes MUST use the same scale. Axis ordering dramatically affects polygon shape — group semantically related variables together.',
    useCase: 'ESCO occupation skill profile (supply) vs. OJA skill demand profile (demand) — gap area = skill mismatch. Country comparison of 5 labor market dimensions (employment rate, NEET, gender gap, youth unemployment, informality).',
    refs: ['Cedefop country skill profiles','OECD Skills for Jobs'],
  },
  {
    id: 'wordcloud', name: 'Word Cloud / Tag Cloud', category: 'special',
    icon: '☁️',
    definition: 'Text visualization where words are sized by frequency/TF-IDF and arranged spatially. Visually appealing but analytically weak — use sparingly.',
    question: 'What are the most commonly mentioned skills in job postings? (introductory only)',
    libraries: ['d3-cloud','wordcloud2.js'],
    bestFor: 'Introductory/overview skill thumbnail on landing page only',
    gotcha: 'Word clouds are VISUALLY APPEALING BUT ANALYTICALLY WEAK. Multi-word terms get split. Long words are disproportionately large. Frequency ≠ importance. Better alternative: horizontal sorted bar chart with exact counts. Use only for overview, never as primary quantitative display.',
    useCase: 'Introductory skill "thumbnail" on landing page only — replace with ranked bar chart for analytical use.',
    refs: ['data-to-viz.com word cloud critique'],
  },
  {
    id: 'network', name: 'Network Graph / Force-Directed', category: 'network',
    icon: '🕸️',
    definition: 'Nodes = entities (skills, occupations); edges = relationships (co-occurrence, similarity, transition probability). Force simulation positions connected nodes closer.',
    question: 'Which skills frequently appear together? What occupations are most similar in skill requirements? What are "gateway" occupations?',
    libraries: ['D3 v7 (d3-force)','Cytoscape.js','vis.js Network'],
    bestFor: 'Skill co-occurrence networks from OJA; ESCO occupation similarity network; career transition pathways; upskilling pathway network',
    gotcha: '"Hairball" is the main enemy — apply minimum edge weight threshold. Node size should encode importance (betweenness centrality). Color nodes by ISCO major group. Use community detection (Louvain algorithm) for cluster coloring. Force layouts are non-deterministic — fix alpha decay for stability.',
    useCase: 'Top 100 ESCO skills co-occurrence network from Greek OJA data; Occupation similarity network for Western Balkans (O*NET task distances); Upskilling pathway network showing closest occupations to declining jobs.',
    refs: ['University of Southern Denmark occupation space','Cedefop skill co-occurrence networks','LinkedIn Economic Graph career pathways'],
  },
  {
    id: 'beveridge', name: 'Beveridge Curve', category: 'special',
    icon: '🍌',
    definition: 'Connected scatter plot: unemployment rate (x) vs. vacancy rate (y). Each point = one time period. Movement ALONG the curve = business cycle. Shift OF the curve = structural change in matching efficiency.',
    question: 'Where is the economy in the business cycle? Has labor market matching efficiency changed structurally?',
    libraries: ['D3 v7','Chart.js v4 (custom)'],
    bestFor: 'Monitoring matching efficiency; detecting structural labor market changes; post-crisis recovery analysis',
    gotcha: 'Color gradient for time is ESSENTIAL (older=blue, newer=red). Annotate key events: COVID-19 shock, peak vacancies, current. Arrow on most recent segment shows direction. Post-2020 US curve shows unprecedented "banana shape" with persistent outward shift suggesting reduced matching efficiency.',
    useCase: 'Beveridge Curve for Greece (Ergani vacancies + ELSTAT unemployment rate, 2010–2026); Multi-country panel Beveridge curves. Eurostat Job Vacancy Survey + LFS unemployment constructs EU national curves.',
    refs: ['FRED Blog Beveridge Curve 2025','St. Louis Fed interactive','Ergani + ELSTAT data'],
  },
  {
    id: 'lollipop', name: 'Lollipop Chart', category: 'comparison',
    icon: '🍭',
    definition: 'Bar chart variant where bar is replaced by thin line topped with a circle. Visually cleaner than bars for ranked lists; can encode two variables (stick length + circle color/size).',
    question: 'What are the top skills, occupations, or countries by a precise value?',
    libraries: ['D3 v7','Observable Plot (Plot.ruleX + Plot.dot)'],
    bestFor: 'Top 25 skills demanded in OJA data; most common occupations posted by sector; country ranking of NEET rates',
    gotcha: 'Superior to bar chart when many items have similar heights. Always sort descending for rankings. Can encode two variables: stick length = one metric, circle color/size = another.',
    useCase: 'Top 25 skills demanded in Greek OJA by count; Most common occupations posted by sector; Country ranking of NEET rates across Western Balkans.',
    refs: ['D3 Gallery lollipop chart','Observable Plot documentation'],
  },
  {
    id: 'slope', name: 'Slope Chart / Bump Chart', category: 'temporal',
    icon: '📉',
    definition: 'Slope chart: shows change between exactly two time points. Bump chart: shows rank change over many periods (y=rank position). Lines show trajectory.',
    question: 'Which skills gained/lost importance from 2020 to 2025? Which countries improved/declined in employment ranking?',
    libraries: ['D3 v7','Observable Plot','Nivo (React)'],
    bestFor: 'Skill demand rank changes 2020–2025; country ranking trajectories in employment/NEET rate; before/after policy comparisons',
    gotcha: 'Bump charts work best for 4–10 entities. Use WCAG contrast + line styles (solid/dashed/dotted) for colorblind accessibility. Direct labels (entity name at start and end) are better than legends.',
    useCase: 'Skill demand rank changes 2020–2025 (top 10 skills, which rose/fell); Country ranking in employment rate or youth unemployment over 5-year period in Western Balkans.',
    refs: ['Observable Canvas bump chart','D3 Observable slope chart'],
  },
  {
    id: 'waffle', name: 'Waffle Chart / Unit Chart', category: 'comparison',
    icon: '🧇',
    definition: '10×10 grid (or icon grid) where each unit represents a percentage or count. More readable than pie/donut for proportions because human perception of rectangular areas is better than angles.',
    question: 'What fraction of the workforce faces automation risk? What percentage of youth are NEET?',
    libraries: ['D3 v7 (custom rect grid)','Waffle.js'],
    bestFor: 'Automation risk fractions; NEET composition (unemployed vs. inactive); gender employment gap; insider/outsider split',
    gotcha: 'Keep to 2–3 segments. ISOTYPE variants (person icons instead of squares) are effective for communicating workforce shares to general audiences. More readable than pie for proportions.',
    useCase: 'Share of Greek workforce in high/medium/low automation risk categories; NEET composition by gender; Gender employment gap visualization.',
    refs: ['Waffle.js','ISOTYPE visualization history'],
  },
  {
    id: 'dotplot', name: 'Dot Plot / Strip Plot', category: 'distribution',
    icon: '⚫',
    definition: 'Each individual observation plotted as a dot along a scale, without aggregation. Shows bimodality, outliers, and gaps that box plots hide.',
    question: 'What is the full distribution of wages or employment rates across individual observations?',
    libraries: ['D3 v7 (with jitter)','Observable Plot (native beeswarm)','Vega-Lite'],
    bestFor: 'Distribution of NUTS2 employment rates (all 240 EU regions as dots); firm-level employment changes; OJA salary range observations',
    gotcha: 'For large samples (1000+ points), transparency is essential to avoid overplotting. Beeswarm layout (d3-beeswarm) stacks points to avoid overlap but only works for N<200. For larger samples, violin or density plot is better.',
    useCase: 'Distribution of NUTS2 employment rates (all 240 EU regions as dots); Firm-level employment changes distribution; OJA salary range observations for top occupations.',
    refs: ['Observable Plot dot with jitter','D3 beeswarm'],
  },
  {
    id: 'forecast', name: 'Forecasting Chart with Uncertainty Bands', category: 'temporal',
    icon: '🔮',
    definition: 'Time-series extension into future: historical solid line + projected dashed line + shaded confidence interval bands (typically 80% and 95% prediction intervals).',
    question: 'What does Cedefop\'s Skills Forecast project for employment by 2035? What is the range of outcomes under different scenarios?',
    libraries: ['D3 v7 (d3.area for bands)','ECharts v5 (markArea)','Chart.js v4 (fill between)'],
    bestFor: 'Cedefop Skills Forecast 2035 employment by sector; unemployment rate projections under policy scenarios; OJA growth trajectory',
    gotcha: 'Use two opacity levels: lighter for 95% band, darker for 80% band. Always dashed vs. solid line to distinguish forecast from historical. Research finds "U-shaped relation between uncertainty visualization and forecasting performance" — some is good, too much degrades performance. Add Cedefop disclaimer: estimates are subject to "possibly large and uncertain margins of error."',
    useCase: 'Cedefop Skills Forecast 2035 employment by sector (Greece/EU); Unemployment rate projections under different policy scenarios; OJA growth trajectory with uncertainty bounds.',
    refs: ['Cedefop Skills Forecast 2035','IMF/OECD economic outlook forecasts','FRED forecast dashboards'],
  },
  // ─── OJA Intelligence Visualizations (from Cedefop 2026 conference) ────────
  {
    id: 'ojar', name: 'OJAR — Online Job Advertisement Rate', category: 'oja-intelligence',
    icon: '📡',
    definition: 'Normalised OJA demand indicator: OJAR = OJA flow count ÷ LFS employment count. Computed at 3-digit ISCO occupation level per country/quarter. Makes raw OJA volumes comparable across countries and occupations of different sizes.',
    question: 'Which occupations have the highest relative online demand? How has employer demand shifted across occupations?',
    libraries: ['Chart.js v4 (grouped/stacked bar)','D3 v7 (lollipop / dot plot)','ECharts v5'],
    bestFor: 'Occupation demand ranking; country benchmarking; demand shift detection across quarters',
    gotcha: 'OJAR ≠ vacancy rate. Craft trades, agriculture, public sector are systematically under-represented in OJAs. Always disclose coverage bias. For Western Balkans (no WIH coverage), LIVLAB computes own OJAR using crawler counts ÷ national LFS employment.',
    useCase: 'Ranked horizontal bar: top 20 occupations by OJAR in Greece Q1 2026 vs Q1 2025. Lollipop chart: OJAR change by 2-digit ISCO, highlighting winners/losers. Country comparison bar for ICT specialist OJAR across EU + WB6.',
    refs: ['Eurostat OJAR experimental statistics (jvs_oja_eu)','Cedefop Skills-OVATE','Eurostat Top & Trending Skills App'],
  },
  {
    id: 'skills-heatmap', name: 'Skills × Occupation Heatmap', category: 'oja-intelligence',
    icon: '🟩',
    definition: 'Matrix heatmap where rows = occupation groups (ISCO-08 2-digit or 3-digit) and columns = ESCO skill categories (level 1–3). Cell colour = frequency of skill mentions in OJAs for that occupation. Reveals the skill profile of each occupation at a glance.',
    question: 'Which skills define each occupation? Where do occupations overlap in skill requirements?',
    libraries: ['D3 v7 (d3.scaleDivergingLog + rect)','ECharts v5 (heatmap)','Observable Plot'],
    bestFor: 'ESCO skill profiling per occupation; curriculum gap analysis; transferable skills identification',
    gotcha: 'Normalise per-occupation (row-wise % of OJAs) NOT absolute counts — otherwise high-volume occupations dominate. Use logarithmic scale or quantile binning for skewed distributions. Colour: sequential single-hue (light→dark) beats diverging unless showing vs. baseline.',
    useCase: 'ESCO skill heatmap for top 20 occupations in Greece and Serbia — directly compareable to Cedefop Skills-OVATE. Curriculum alignment: VET qualification skill profile (y) vs. OJA employer skill demand (x) — off-diagonal cells = training mismatch.',
    refs: ['Cedefop Skills-OVATE occupations/skills view','ESCO Skill-Occupation Matrix Tables','JRC-Eurofound Task Database'],
  },
  {
    id: 'green-index', name: 'Green & Blue Skills Demand Index', category: 'oja-intelligence',
    icon: '🌿',
    definition: 'Time series and cross-sectional bar/choropleth showing the greenness index (share of OJAs mentioning ≥1 ESCO green-labelled skill) and equivalent blue economy index. Based on 591 ESCO green-labelled concepts + NLP lexicon expansion.',
    question: 'Which sectors and regions show the fastest growth in green/blue skill demand? Where is the green transition creating new labour demand?',
    libraries: ['Chart.js v4 (stacked area)','D3 v7 (choropleth NUTS-2)','ECharts v5'],
    bestFor: 'Green transition monitoring; TRAIN4BLUE/Growth4Blue blue economy skill tracking; policy evaluation of green jobs programmes',
    gotcha: 'Green skills are increasingly "mainstreamed" into non-green job titles — a software developer role may mention carbon footprint tracking. Do not equate greenness index with "green jobs." Distinguish explicit green occupations from green-skill-augmented general roles.',
    useCase: 'Greenness index trend 2020–2026 for Construction, Energy, Transport sectors in Italy and Greece. NUTS-2 choropleth of blue economy skill demand in Adriatic coastal regions. Bubble chart: occupation × greenness index × OJA volume.',
    refs: ['Green Skills Labelling in ESCO (591 concepts)','Cedefop Tracking Green Trends (Skills-OVATE)','Sdoukopoulos et al. — offshore renewable energy OJA analysis (Thessaloniki 2026)'],
  },
  {
    id: 'skill-cooccurrence', name: 'Skill Co-occurrence Network', category: 'network',
    icon: '🕸️',
    definition: 'Force-directed graph where nodes = skills (sized by frequency) and edges = co-mention in same OJA (thickness = co-occurrence strength). Reveals which skills cluster together and are "bundled" by employers.',
    question: 'Which skills appear together? What is the core skill bundle for a given occupation? Which skills are bridges between clusters?',
    libraries: ['D3 v7 (force simulation)','Sigma.js','Gephi (offline analysis)','Cytoscape.js'],
    bestFor: 'Skill ecosystem analysis; identifying transferable bridge skills; curriculum bundling decisions; AI-complementary skills detection',
    gotcha: 'Network hairballs are useless. Apply minimum edge weight threshold, community detection (Louvain), and render only top 50–100 nodes. Label only hub nodes. Use modularity colouring to show skill clusters (technical, soft, domain-specific).',
    useCase: 'Co-occurrence network for AI/ML-related OJAs in Greece and Serbia — shows how Python, cloud, statistics, communication cluster together. Compare 2020 vs. 2026 networks to detect emerging skill bundles around GenAI. Directly replicates Lampis et al. AI-complementary skills analysis (Thessaloniki 2026).',
    refs: ['Lampis — AI-complementary skills analysis from OJAs (Thessaloniki 2026)','Cedefop Skills-OVATE skill co-occurrence view','ESCO Skill-Occupation Matrix Tables'],
  },
  {
    id: 'career-pathway', name: 'Career Pathway Sankey / Alluvial', category: 'flow',
    icon: '🔀',
    definition: 'Alluvial or Sankey diagram showing how workers transition between occupations, sectors, or employment statuses. Each flow = a cohort of workers. Width = number/share of transitions. Directly replicates Nora Condon\'s "Career pathway identification from job adverts" (Thessaloniki 2026 Session 3b).',
    question: 'What career progressions do employers signal in job adverts? What are the common pathways into high-demand occupations?',
    libraries: ['D3 v7 (d3-sankey plugin)','ECharts v5 (sankey)','Plotly.js'],
    bestFor: 'Career guidance tool inputs; VET pathway design; adjacent occupation identification; ALMP programme targeting',
    gotcha: 'Directionality matters: OJA-inferred pathways reflect employer logic, not worker choices. Validate against LFS transition data where available. Too many nodes = unreadable. Limit to 8–12 nodes on each side; group rare occupations into "Other".',
    useCase: 'Career pathways into top 10 most-demanded occupations in Greece (from OJA required-experience text). Common pathways out of agricultural/seasonal work into year-round employment — input for EU-ALMPO ALMP design. Entry-level → senior progression chains mined from "experience required" fields.',
    refs: ['Condon — Career pathway identification from job adverts (Cedefop 2026)','Eurostat LFS transition probabilities','wiiw SEE Jobs Gateway occupation transition data'],
  },
  {
    id: 'training-vacancy-gap', name: 'Training–Vacancy Gap Chart', category: 'oja-intelligence',
    icon: '🎓',
    definition: 'Side-by-side or mirror bar chart comparing (left) VET/HE graduate output by field of study and (right) OJA demand by required qualification/field. Gap between bars = training-vacancy mismatch. Directly replicates Oruc & Kostadinov job vacancy–training provision matching work (Thessaloniki 2026 Session 4a).',
    question: 'Is training provision aligned with labour market demand? Where are the biggest over/under-supply gaps?',
    libraries: ['Chart.js v4 (horizontal grouped bar)','D3 v7 (diverging bar)','ECharts v5'],
    bestFor: 'VET policy; ALMP programme design; Cedefop-style skills forecast validation; WB6 training system reform evidence',
    gotcha: 'Graduate output data lags 2–3 years (academic year reporting). OJA demand is near real-time. Comparing them requires acknowledging the temporal mismatch — annotate on chart. "Training field" and "OJA required qualification" use different taxonomies (ISCED vs. free text). Reconciliation mapping required.',
    useCase: 'Serbia and North Macedonia: VET graduate output (CEDEFOP profiles) vs. OJA demand by qualification — identifies which training programmes are producing over- or under-supply. Inputs for EU-ALMPO WP2 case studies and MicroIdea VET alignment work.',
    refs: ['Oruc & Kostadinov — Job vacancy–training provision matching (Thessaloniki 2026 Session 4a)','Cedefop VET-in-Europe country profiles','Cedefop Skills Forecast 2035 qualification projections'],
  },
  {
    id: 'gender-lexicometry', name: 'Gender Bias in Job Postings (Lexicometric Analysis)', category: 'special',
    icon: '⚖️',
    definition: 'Textual analysis technique that quantifies gender-coded language in job postings. Measures frequency of masculine/feminine-coded terms, identifies occupational gender bias, and tracks change over time. From Curci & Dimitrova presentations at Thessaloniki 2026 Session 4b.',
    question: 'Do job postings discriminate by gender through language? Which occupations show the most gendered language patterns?',
    libraries: ['Python (spaCy, NLTK)','D3 v7 (diverging bar, word cloud)','Seaborn (Python)'],
    bestFor: 'Equity analysis; compliance monitoring; ALMP targeting for under-represented groups; academic research on labour market discrimination',
    gotcha: 'Lexicometric lists must be validated against the specific language corpus — translation of gendered terms is non-trivial in Romance languages (Greek, Italian, Spanish all have grammatical gender). Control for occupation structure before inferring discrimination. Method is descriptive, not causal.',
    useCase: 'Analysis of Greek and Italian OJA corpora for gender-coded language by sector — tourism sector in Greece has distinctive gendered patterns. Track change pre/post equal pay legislation. Input for EU-ALMPO inclusivity reporting.',
    refs: ['Curci — Gender discrimination in French job postings, lexicometry (Thessaloniki 2026)','Dimitrova — Gender gaps in skills intelligence (Thessaloniki 2026)','Cedefop gender and skills analysis'],
  },
];

const LMI_PORTAL_DATA = [
  {
    name: 'Cedefop Skills-OVATE',
    url: 'https://www.cedefop.europa.eu/en/tools/skills-online-vacancies',
    icon: '🇪🇺',
    scope: '32 European countries | Quarterly OJA data | ISCO-08 3-digit, NACE rev.2, NUTS-2, ESCO v1 / O*NET',
    strengths: [
      'Occupation × skill × sector × region × contract type — 5 dimensions in one tool',
      'Quarterly updates (last 4 quarters shown); near real-time via Eurostat WIH',
      'Dual skill framework (ESCO v1 or O*NET selectable per user)',
      'Green/digital skills dedicated indexes — powered by 591 ESCO green-labelled concepts',
      'NUTS-2 regional breakdown for sub-national demand analysis',
      'Skill co-occurrence view reveals employer-bundled skill requirements',
      'Microdata access via Eurostat Microdata Portal for researchers',
      'Primary benchmark for LIVLAB OJA analytics — replication target for WB6 countries',
    ],
    weaknesses: [
      'Tableau Public dependency limits customization and external data integration',
      'No API access to underlying aggregated data',
      'Supply-side (LFS) not integrated — pure demand-side view; no skills gap calculation',
      'Western Balkan countries not covered — the core LIVLAB gap',
      'Data collection methods (scraping vs. API vs. crawling) vary by country — quality uneven',
      'OJA representativeness bias: IT/professional roles overrepresented; craft trades absent',
    ],
    lessons: 'Gold standard for EU OJA analytics. NUTS-2 regional breakdown is the right geographic granularity. ESCO v1.2 as primary taxonomy; O*NET crosswalk for global comparisons. Green/digital twin transition framing is the policy-relevant angle for EU-ALMPO, Growth4Blue, TRAIN4BLUE. LIVLAB must build equivalent analytics for WB6 — that is the unique contribution. Source: Cedefop/Eurostat joint work; Thessaloniki conference May 2026.',
  },
  {
    name: 'OECD Skills for Jobs',
    url: 'https://www.oecd.org/skills/jobs/',
    icon: '🌍',
    scope: '44 countries | Integrated supply-demand analysis | Annual updates',
    strengths: ['Genuine supply-demand integration using 5 indicator sub-indices (wage/employment/hours growth + unemployment + under-qualification)', 'Country coverage: 44 countries with consistent methodology', 'Shortage/surplus framing is intuitive for policymakers', 'Available as interactive tool AND downloadable database'],
    weaknesses: ['Occupation-level aggregates only — no skill granularity', 'Infrequent update cycle vs. quarterly OJA tools', 'Small countries with thin data receive unreliable estimates'],
    lessons: 'The shortage/surplus framing (demand > supply = shortage) is the most policy-actionable representation — should be a core LIVLAB metric. Five-index composite approach can be replicated for lab countries using Ergani + LFS + OJA.',
  },
  {
    name: 'BLS Occupational Outlook Handbook',
    url: 'https://www.bls.gov/ooh/',
    icon: '🇺🇸',
    scope: '~600 US occupations | 10-year employment projections | Annual publication',
    strengths: ['Per-occupation profile pages with consistent structure: duties, environment, education, pay, outlook', '10-year employment projections with explicit methodology', 'Free public access with permalink structure', 'Occupation Finder: filter by salary, education, work experience'],
    weaknesses: ['Limited geographic disaggregation (national + state-level separate)', 'No real-time or quarterly updates — annual publication cycle', 'No skills taxonomy integration (O*NET is separate)', 'Static layouts; limited interactivity'],
    lessons: 'Per-occupation "profile pages" are the right model for any LMI portal. Projection + outlook + wage + education on a single page satisfies most user journeys.',
  },
  {
    name: 'LinkedIn Economic Graph',
    url: 'https://economicgraph.linkedin.com/',
    icon: '💼',
    scope: '165 countries | 1B+ members | Monthly updates',
    strengths: ['Near-real-time: monthly hiring rate, biweekly Workforce Confidence Index', '41,000+ tracked skills; monthly changelog; 25% skills change since 2015', 'Skills-first methodology: maps workers to jobs via skills, not titles', 'AI skills tracking: first to document the AI skill demand shift'],
    weaknesses: ['Severe coverage bias: knowledge workers, formal employment, professional occupations only', 'Invisible sectors: agriculture, construction, informal economy, rural', 'Greece/Western Balkans: LinkedIn penetration is low — data unreliable for these markets', 'Individual career path data not accessible to researchers'],
    lessons: 'Use for directional signals about skill trend direction, not absolute statistics, for Mediterranean/Balkan markets. The "25% skill change since 2015 / will double by 2027" framing is powerful for communicating upskilling urgency.',
  },
  {
    name: 'Lightcast / Burning Glass',
    url: 'https://lightcast.io/',
    icon: '🔥',
    scope: '18B+ data points | 40,000+ daily OJA sources | 25+ years history',
    strengths: ['Three-taxonomy architecture: Skills Library (33,000+ skills) + Lightcast Occupation Taxonomy + Titles (75,000+ normalized)', 'Dual-sided: job postings (demand) + resume/profile data (supply) → genuine gap analysis', 'Open Skills framework freely accessible (adopted by 6,000+ organizations)', 'API access for third-party integration'],
    weaknesses: ['Commercial product — limited free access', 'US/English-language bias', 'Skills taxonomy optimized for North American labor market', 'Less granular for Southern European/Balkan markets'],
    lessons: 'The three-taxonomy architecture (skills + occupations + titles) is the right model — LIVLAB can mirror using ESCO v1.2 (occupations), ESCO skills pillar, and free-text OJA titles. Supply-demand skill gap analysis (demand skills from OJA vs. supply skills from CV/profile data) is the highest-value LMI product.',
  },
  {
    name: 'Greek LMO — DYPA Diagnostic Mechanism',
    url: 'https://mdaae.gr/en/',
    icon: '🇬🇷',
    scope: 'Greece | Ergani + ELSTAT + ESCO | 2024 upgraded system',
    strengths: ['Integrates Ergani (real-time flows), ELSTAT (LFS supply), and ESCO (skill classification)', 'Interactive interface with demographic and regional filtering', 'Skills demand by sector, demographic group, and region', 'Recognized by European Network of PES as model practice'],
    weaknesses: ['No public-facing portal equivalent to Cedefop Skills-OVATE', 'No OJA integration (portal scraping of Skywalker, Kariera, etc.)', 'Limited occupational transition analysis', 'No forecasting/projection capability', 'No API for external access'],
    lessons: 'LIVLAB can genuinely fill the public-facing gap in Greek LMI. Ergani integration is the critical differentiator — real-time flow data unavailable from LFS. Gender employment gap visualization is high-priority use case: Greece has 11/13 NUTS2 regions with gender gaps ≥17.5pp; Sterea Elláda is the worst in the EU at 31.2pp.',
  },
  {
    name: 'Eurostat Statistics Explained',
    url: 'https://ec.europa.eu/eurostat/statistics-explained/',
    icon: '🇪🇺',
    scope: 'EU + EEA | Regional + national data | Quarterly updates',
    strengths: ['Hybrid text-and-visualization approach — interpretive text alongside charts', 'Population-weighted coefficient of variation (CV) for inter-regional disparities', 'Geographic narratives (north-south splits, capital regions vs. national averages)', 'January 2026: 30+ new interactive tools launched (Digitalisation dashboard, SDGs tool, My region)'],
    weaknesses: ['Text-heavy format may not suit all audiences', 'Eurostat "vis tool" charts have limited customization'],
    lessons: 'Text-plus-chart approach (not chart-only) produces better user comprehension — a paragraph explaining what a chart shows is not wasted space. Capital region vs. national average comparison is always valuable in centralized Mediterranean countries. Superlative annotations ("highest/lowest") act as immediate hooks.',
  },
];

const LMI_REGIONAL_DATA = [
  {
    id: 'informal', title: 'Large Informal Sectors', icon: '👤',
    context: 'Western Balkans: 20–50%+ informal employment depending on country and definition. Greece: ~20% shadow economy. Italy: ~10–15% informal employment rate (highest EU estimate).',
    challenge: 'Standard LFS-based charts systematically undercount informal employment. A bar chart of employment rate for Kosovo (40% formal employed) implies 60% unemployed/inactive — but a large fraction are informally employed.',
    solutions: ['Dual-bar visualization: show formal (admin registers) alongside estimated total employment (LFS + shadow economy adjustment) — the gap = estimated informal sector', 'Confidence interval approach: show range (low/high bound) for countries with known informality issues', 'ILOSTAT informality indicator: ILO provides harmonized informal employment rates for many countries', 'Explicit footnotes: every chart for WB6 should include "Formal employment only" or "Includes estimated informal employment"'],
    key_stat: 'Kosovo employment rate appears as ~40% formal but true economic participation is substantially higher when informal work is included.',
  },
  {
    id: 'dual', title: 'Dual Labor Markets: Insiders & Outsiders', icon: '⚖️',
    context: 'EU-wide: Insiders = 66% of workforce; Outsiders = 24% (atypical 17% + unemployed 7%). Greece: Insiders only 48% — lowest in Europe. 50% of WB6 young workers are on temporary contracts; 80% in Kosovo and Montenegro.',
    challenge: 'Standard employment rate comparisons hide the quality difference — a permanent public sector job in Finland is categorically different from a seasonal tourism contract in Crete. Employment quality indicators (contract type, wage level, benefit coverage) must accompany employment rate visualizations.',
    solutions: ['Segmented employment bar: stack permanent + temporary + self-employed + informal — reveals contractual structure hidden in aggregate employment', 'Transition matrix heatmap: transition probabilities between statuses — dark diagonal = low mobility (insider-outsider trap)', 'Risk dimension spider chart: four insider-outsider risk dimensions (income insecurity, employment insecurity, social protection access, family dependency)', 'Scatter of welfare access: atypical workers\' benefit access vs. employment rate — Mediterranean cluster with low access, high precarity'],
    key_stat: 'Greece insiders = 48% — lowest in Europe. Atypical workers face 75% probability of unemployment history.',
  },
  {
    id: 'seasonal', title: 'Seasonal Labor Markets', icon: '☀️',
    context: 'Greece: 15 tourist nights per inhabitant/year (6th in EU). Summer hiring spike in NACE I (Accommodation/Food) is 3–4× winter baseline in Ergani flow data.',
    challenge: 'Seasonal adjustment methods differ across countries and data sources. Always label SA vs. NSA. Never compare SA data from one source with NSA from another on the same chart.',
    solutions: ['Calendar heatmap: OJA posting volume or Ergani hirings by month×year — immediately reveals seasonal pattern as bright colors in summer months', 'Seasonally adjusted vs. raw line chart: two series — the gap shows seasonal effect magnitude', 'Horizon chart: compact multi-year seasonal view; value deviation from annual average shown as color intensity', 'Dual-axis chart: tourism arrivals overlaid on employment in accommodation sector — visual correlation of tourism demand and employment response', 'Animated monthly maps: month-by-month NUTS2 employment rate changes using slider — shows seasonal spread from coastal to interior'],
    key_stat: 'Greek hospitality sector new hirings in June–July are 3–4× the winter baseline (Ergani data).',
  },
  {
    id: 'missing', title: 'Missing / Poor Quality Data (Western Balkans)', icon: '❓',
    context: 'Data quality hierarchy: Serbia (best, SORS LFS quarterly) > Montenegro (MONSTAT LFS) > North Macedonia (SSO LFS) > Albania (INSTAT, emigration makes supply estimates unreliable) > Bosnia (federal structure, two entities) > Kosovo (most gaps, disputed status limits Eurostat integration).',
    challenge: 'wiiw SEE Jobs Gateway harmonizes national-level data with consistent definitions across WB6 + 4 EU comparators since 2010 — use as primary source for comparative Western Balkans visualizations.',
    solutions: ['Explicit NA encoding: gray hatching for missing cells — never interpolate across missing data without disclosure', 'Confidence intervals proportional to uncertainty: wider bands for less reliable observations', 'Data quality metadata layer: mouseover tooltip showing source, sample size, last update, known quality issues', 'Graded opacity: lower opacity for less reliable observations (e.g., 2020 COVID data collection interruptions)', 'Alternative sourcing disclosure: "Source: SORS LFS (national definition); may not be comparable to EU-LFS"'],
    key_stat: 'wiiw SEE Jobs Gateway: harmonized data across WB6 + 4 EU comparators with explicit metadata on breaks in series.',
  },
  {
    id: 'neet', title: 'NEET Rate Visualization', icon: '📚',
    context: 'WB6 NEET average = 23.7% (2023), ranging from 15.9% (Serbia) to 37.4% (Kosovo). EU NEET = 11.1%. Italy (within EU) = ~18% — highest EU member.',
    challenge: 'NEET conflates two distinct groups: (1) Unemployed NEETs — want work, actively seeking (cyclical, policy-responsive); (2) Inactive NEETs — discouraged, caring responsibilities, health issues (structural, harder to reach). Most policies address (1) but (2) is often larger in WB6.',
    solutions: ['Stacked bar decomposition: NEET rate split into unemployed NEET + inactive NEET — reveals structural vs. cyclical composition by country', 'Age-group gradient: NEET rate by age (15–17, 18–19, 20–24, 25–29) — early school leaving peaks youngest; discouraged workers peak older', 'Gender-disaggregated: Male NEET = primarily unemployed; Female NEET = primarily inactive (caregiving) — grouped bar reveals structural difference', 'Trend with policy event annotation: NEET rate time series with Youth Guarantee launch (2013 EU) marked — policy impact evaluation', 'Scatter: NEET vs. youth unemployment — southern Europe clusters high/high vs. Nordic low/low'],
    key_stat: 'Kosovo NEET = 37.4%. WB6 average = 23.7% vs. EU average = 11.1%. MicroIdea and TRAIN4BLUE projects directly address this population.',
  },
  {
    id: 'nuts', title: 'NUTS Level Trade-offs for Regional Analysis', icon: '🗺️',
    context: 'NUTS1: ~100 EU regions (reliable quarterly). NUTS2: ~240 EU regions (reliable annual). NUTS3: ~1,500 EU regions (unreliable; needs small-area estimation). Eurostat recommends NUTS2 for most regional LMI work.',
    challenge: 'Greece: 13 NUTS2 regions; Attica (~40% of national employment) is always an outlier. Italy: 21 NUTS2 regions with massive north-south divide. Western Balkans: No NUTS classification — use national-level with sub-national breakdowns where available.',
    solutions: ['Use NUTS2 as default for EU country regional analysis', 'Always show capital region separately or note its weight (Attica for Greece, Île-de-France for France)', 'For WB6 countries: use ISO 3166 codes + wiiw SEE Jobs Gateway for harmonized national data', 'Small area estimation methods needed for NUTS3 analysis in most countries', 'wiiw SEE Jobs Gateway provides the most reliable harmonized WB6 + EU comparative data'],
    key_stat: 'Greece NUTS2: Attica region has ~40% of national employment — always an outlier that can distort national averages.',
  },
  {
    id: 'oja-coverage', title: 'OJA Data Coverage Gap: Western Balkans vs. EU', icon: '📡',
    context: 'Eurostat Web Intelligence Hub (WIH) covers 32 countries (EU27 + UK + EFTA). Skills-OVATE delivers quarterly OJA analytics for all EU countries. The 6 Western Balkan countries in LIVLAB scope (Serbia, Montenegro, North Macedonia, Albania, Bosnia, Kosovo) have ZERO WIH coverage — they are structurally absent from all official European OJA statistics. Cyprus supply-side is well-covered via Eurostat; Carierista (demand-side) is blocked.',
    challenge: 'Any LIVLAB chart comparing skills demand across EU + WB6 countries is comparing apples to oranges: EU countries use the Cedefop/Eurostat WIH pipeline (hundreds of millions of OJAs, standardised dedup, ESCO classification) while WB6 uses LIVLAB\'s own crawler infrastructure. Volume, coverage, and classification quality differ substantially. This gap must be disclosed and managed, not hidden.',
    solutions: [
      'Always use explicit source labels: "EU countries: Cedefop Skills-OVATE (WIH pipeline)" vs. "WB6: LIVLAB OJA Crawler (DMLab/UOP)" — never mix on same axis without disclosure',
      'Compute LIVLAB-OJAR for WB6: LIVLAB crawler OJA count ÷ national LFS employment (ILOSTAT/national source) — enables within-WB6 benchmarking even without WIH',
      'Coverage metadata layer: every OJA chart should show portal coverage score (N portals monitored, last crawl date, % OJAs deduplicated)',
      'Develop bilateral validation: for countries with both LIVLAB + WIH coverage (does not currently exist for WB6), cross-validate OJA volumes to calibrate LIVLAB counts',
      'Contribute WB6 data to WIH: EU-ALMPO WP4 goal should include formalising LIVLAB OJA data contribution to WIH as a pilot for Western Balkan accession countries',
    ],
    key_stat: 'WIH landscaping exercises: 2017 (EU27+UK) and 2021 (EFTA expansion). Next expansion could include WB6 accession candidates under EU-ALMPO/IPA funding — LIVLAB OJA infrastructure is the enabler.',
  },
];

function renderLmiResearch() {
  _renderLmirData();
  _renderLmirRoles();
  _renderLmirViz();
  _renderLmirPortals();
  _renderLmirRegional();
  lmirSection('data');
}

function lmirSection(section) {
  document.querySelectorAll('.lmir-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.lmir-nav-item').forEach(el => el.classList.remove('active'));
  const s = document.getElementById(`lmir-section-${section}`);
  if (s) s.classList.add('active');
  const n = document.getElementById(`lmir-nav-${section}`);
  if (n) n.classList.add('active');
}

function filterLmirViz() {
  const q = (document.getElementById('lmir-viz-search')?.value || '').toLowerCase();
  const cat = document.getElementById('lmir-viz-filter')?.value || '';
  let visible = 0;
  document.querySelectorAll('.lmir-viz-card').forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const desc = (card.dataset.desc || '').toLowerCase();
    const cardCat = card.dataset.category || '';
    const show = (!q || name.includes(q) || desc.includes(q)) && (!cat || cardCat === cat);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const countEl = document.getElementById('lmir-viz-count');
  const total = LMI_VIZ_DATA.length;
  if (countEl) countEl.textContent = (q || cat) ? 'Showing ' + visible + ' of ' + total + ' types' : 'Showing all ' + total + ' visualization types — use filters above to narrow down';
}

function _renderLmirData() {
  const el = document.getElementById('lmir-section-data');
  if (!el) return;
  const datasets = (State.catalog && State.catalog.datasets) || [];
  const demandDS = datasets.filter(d => ['job-postings','oja','vacancy','admin'].includes(d.type) || (d.tags||[]).some(t=>['demand','vacancy','oja','job-postings'].includes(t)));
  const supplyDS = datasets.filter(d => ['survey','lfs','register','census','administrative'].includes(d.type) || (d.tags||[]).some(t=>['supply','lfs','survey','workforce'].includes(t)));

  const countryRows = [
    {flag:'🇬🇷', c:'Greece', demand:['DYPA/Ergani Job Register','Skywalker','Kariera','OJA portals (6)'], supply:['ELSTAT LFS 1981–2026 (SJO01/SJO03)','ILOSTAT Greece'], status:'✓'},
    {flag:'🇮🇹', c:'Italy', demand:['Adecco','Randstad','GiGroup','Adzuna'], supply:['ISTAT LFS','Eurostat (EU-LFS)'], status:'✓'},
    {flag:'🇪🇸', c:'Spain', demand:['Turijobs','Infoempleo'], supply:['INE EPA','Eurostat (EU-LFS)'], status:'✓'},
    {flag:'🇷🇸', c:'Serbia', demand:['Infostud','NSZ Portal'], supply:['SORS LFS','wiiw SEE Jobs'], status:'✓'},
    {flag:'🇲🇪', c:'Montenegro', demand:['Zaposli.me','Prekoveze.me','ZZZCG'], supply:['MONSTAT LFS','wiiw SEE Jobs'], status:'✓'},
    {flag:'🇲🇰', c:'N. Macedonia', demand:['Vrabotuvanje','Vraboti','Apliciraj'], supply:['SSO LFS','wiiw SEE Jobs'], status:'✓'},
    {flag:'🇦🇱', c:'Albania', demand:['Njoftime','Duapune','NAES'], supply:['INSTAT LFS','wiiw SEE Jobs'], status:'✓'},
    {flag:'🇧🇦', c:'Bosnia', demand:['Mojposao','KlixPosao','ZZZRS'], supply:['BHAS LFS','wiiw SEE Jobs'], status:'✓'},
    {flag:'🇽🇰', c:'Kosovo', demand:['Kosovajob','Ofertapune','Superpune'], supply:['ASK LFS','wiiw SEE Jobs'], status:'✓'},
    {flag:'🇸🇮', c:'Slovenia', demand:['Mojedelo','Optius'], supply:['SURS LFS','Eurostat'], status:'✓'},
    {flag:'🇨🇾', c:'Cyprus', demand:['Carierista ⚠ blocked'], supply:['Eurostat (EU-LFS)'], status:'⚠'},
    {flag:'🇩🇰', c:'Denmark', demand:['JobNet','IT-Jobbank','StepStone'], supply:['DST (register-based)','Eurostat'], status:'✓'},
  ];

  const rows = countryRows.map(r =>
    '<tr>' +
    '<td>' + r.flag + ' ' + esc(r.c) + '</td>' +
    '<td class="lmir-ds-list">' + r.demand.map(d => '<span class="lmir-ds-chip lmir-chip-demand">' + esc(d) + '</span>').join('') + '</td>' +
    '<td class="lmir-ds-list">' + r.supply.map(s => '<span class="lmir-ds-chip lmir-chip-supply">' + esc(s) + '</span>').join('') + '</td>' +
    '<td style="text-align:center">' + r.status + '</td>' +
    '</tr>'
  ).join('');

  const catalogHtml = datasets.length ? (
    '<div class="lmir-catalog-counts">' +
    '<div class="lmir-cnt"><span class="lmir-cnt-n">' + datasets.length + '</span><span class="lmir-cnt-l">Total Datasets</span></div>' +
    '<div class="lmir-cnt"><span class="lmir-cnt-n">' + demandDS.length + '</span><span class="lmir-cnt-l">Demand Sources</span></div>' +
    '<div class="lmir-cnt"><span class="lmir-cnt-n">' + supplyDS.length + '</span><span class="lmir-cnt-l">Supply Sources</span></div>' +
    '<div class="lmir-cnt"><span class="lmir-cnt-n">12</span><span class="lmir-cnt-l">Countries Covered</span></div>' +
    '</div>'
  ) : '';

  el.innerHTML =
    '<div class="lmir-hero">' +
    '<h3>📦 What Data Do We Have?</h3>' +
    '<p>Inventory of supply and demand data sources indexed in this lab, organized by country and type. Demand data = what employers want (job postings, vacancies, OJA). Supply data = the available workforce (LFS, registers, surveys).</p>' +
    '</div>' +
    catalogHtml +
    '<h3 class="lmir-subtitle">Data Availability by Country</h3>' +
    '<table class="lmir-country-table">' +
    '<thead><tr><th>Country</th><th>📢 Demand Sources</th><th>👥 Supply Sources</th><th>Status</th></tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table>' +
    '<div class="lmir-concept-cards">' +
    '<div class="lmir-concept-card">' +
    '<div class="lmir-concept-title">📢 Demand vs. 👥 Supply — The Core Distinction</div>' +
    '<div class="lmir-concept-body">' +
    '<strong>Demand data</strong> answers: What are employers looking for? Job postings (OJA), vacancy surveys, administrative registers like Ergani. Near-real-time but biased toward formal, white-collar jobs.<br><br>' +
    '<strong>Supply data</strong> answers: Who is available to work? Labour Force Surveys (LFS), administrative unemployment registers, education output data. Covers all workers but published with 3–12 month lag.<br><br>' +
    '<em>The gap between demand and supply = skill mismatch, geographic mismatch, or structural unemployment. Both dimensions are needed for complete LMI.</em>' +
    '</div>' +
    '</div>' +
    '<div class="lmir-concept-card">' +
    '<div class="lmir-concept-title">📦 Stock vs. Flow</div>' +
    '<div class="lmir-concept-body">' +
    '<strong>Stock</strong>: count at a point in time — total employed today, total job openings on the last business day.<br>' +
    '<strong>Flow</strong>: count over a period — new hires this month, dismissals this quarter.<br><br>' +
    'Ergani captures both: daily hirings and dismissals (flows) + total employed at any date (stock). Most LFS data is stock-only.<br><br>' +
    '<em>High unemployment + low flows = structural blockage. High unemployment + high flows = temporary mismatch — very different policy responses.</em>' +
    '</div>' +
    '</div>' +
    '<div class="lmir-concept-card">' +
    '<div class="lmir-concept-title">⏱️ Real-Time vs. Lagged Data</div>' +
    '<div class="lmir-concept-body">' +
    '<table class="lmir-mini-table">' +
    '<tr><th>Source</th><th>Lag</th><th>Freq.</th></tr>' +
    '<tr><td>Ergani (Greece)</td><td>Same day</td><td>Daily</td></tr>' +
    '<tr><td>OJA / Cedefop OVATE</td><td>~1 quarter</td><td>Quarterly</td></tr>' +
    '<tr><td>JOLTS / Eurostat JVS</td><td>1–2 months</td><td>Monthly</td></tr>' +
    '<tr><td>EU-LFS (national)</td><td>3–6 months</td><td>Quarterly</td></tr>' +
    '<tr><td>EU-LFS (NUTS2)</td><td>12 months</td><td>Annual</td></tr>' +
    '<tr><td>Nordic register stats</td><td>12–18 months</td><td>Annual</td></tr>' +
    '</table>' +
    '<em>Always show data vintage labels on charts — presenting sources with different lags together without disclosure is misleading.</em>' +
    '</div>' +
    '</div>' +
    '<div class="lmir-concept-card">' +
    '<div class="lmir-concept-title">🔍 OJA Coverage Bias</div>' +
    '<div class="lmir-concept-body">' +
    'OJA data dramatically overrepresents white-collar, formal sector work. JRC research on 60M OJAs found vacancy posting probability is "hundreds of times larger for managers than for plant operatives."<br><br>' +
    '<strong>Over-represented</strong>: IT, management, professional services.<br>' +
    '<strong>Under-represented</strong>: Healthcare/education (use own portals), agriculture, construction, informal sector.<br><br>' +
    '<em>OJA data alone cannot represent the full labor market — always combine with LFS supply data for complete picture.</em>' +
    '</div>' +
    '</div>' +
    '</div>';
}
function _renderLmirRoles() {
  const el = document.getElementById('lmir-section-roles');
  if (!el) return;
  const roles = [
    {
      icon: '🏛️', title: 'Policy Analyst / ALMP Officer',
      desc: 'Monitors labor market health, designs active labor market policies, evaluates program impact.',
      vizTypes: ['Choropleth map — regional unemployment rates at NUTS2', 'NEET decomposition — stacked bar (unemployed vs. inactive)', 'Beveridge Curve — macro matching efficiency over time', 'Forecasting chart — Cedefop Skills Forecast 2035 projections', 'Slope/bump chart — policy intervention impact (before/after NEET rate)', 'Waffle chart — automation risk fraction of workforce'],
      keySources: ['EU-LFS (regional breakdowns)', 'Eurostat Job Vacancy Survey', 'DYPA/Ergani (Greece)', 'wiiw SEE Jobs Gateway (Balkans)', 'Cedefop Skills Forecast'],
      color: '#2f81f7',
    },
    {
      icon: '🔬', title: 'Labor Market Researcher',
      desc: 'Conducts empirical analysis, develops methods, publishes findings. Needs precision, reproducibility, and methodological depth.',
      vizTypes: ['Network graph — skill co-occurrence from OJA corpus', 'Sankey / alluvial — worker transition flows between sectors', 'Scatter / Beveridge Curve — connected scatter with time gradient', 'Box/violin plot — wage distribution by occupation group (ISCO major group)', 'Dot plot — NUTS2 employment rate distribution (all 240 EU regions)', 'Parallel coordinates — multi-dimensional occupation profile comparison'],
      keySources: ['NLx Research Hub (155M+ US postings)', 'EU-LFS Microdata (registration required)', 'Cedefop ESJS2 Microdata', 'ESCO v1.2 API', 'ILOSTAT SDMX'],
      color: '#bc8cff',
    },
    {
      icon: '🎓', title: 'VET / Career Counselor',
      desc: 'Advises students and jobseekers on career paths, training choices, and skill development. Needs occupation-level demand and skill gap data.',
      vizTypes: ['Horizontal bar — top 25 demanded skills in OJA data (ranked)', 'Radar/spider — ESCO occupation skill profile vs. OJA demand profile (gap = mismatch)', 'Treemap — employment share by sector/occupation (ISCO/NACE)', 'Lollipop chart — occupation employment outlook (BLS OOH style)', 'Slope chart — skill demand rank changes 2020–2025 (which skills rose/fell)', 'Bump chart — occupation ranking trajectory over time'],
      keySources: ['ESCO v1.2 (occupations + skills)', 'O*NET Web Services', 'Cedefop Skills-OVATE (skill demand)', 'BLS Occupational Outlook Handbook', 'DYPA jobseeker registry (supply)'],
      color: '#39d353',
    },
    {
      icon: '📊', title: 'Employer / HR Analyst',
      desc: 'Monitors talent availability, benchmarks compensation, plans workforce needs. Needs real-time demand signals and regional talent pools.',
      vizTypes: ['Calendar heatmap — hiring seasonality by sector (Ergani flows)', 'Grouped bar — employment by contract type (permanent vs. temporary vs. self-employed)', 'Area chart — sector employment composition over time', 'Choropleth — talent availability by NUTS2 region', 'Time-series — vacancy rate trend (tight market = upward pressure on wages)', 'Stacked bar — education level composition of workforce by occupation'],
      keySources: ['Lightcast / Burning Glass (commercial)', 'LinkedIn Economic Graph', 'DYPA/Ergani (Greece)', 'Eurostat SES (Structure of Earnings Survey)', 'National PES job registers'],
      color: '#e3b341',
    },
    {
      icon: '🌊', title: 'Blue Economy / Green Skills Researcher',
      desc: 'Analyzes labor demand in maritime, fisheries, aquaculture, renewable energy, and green transition sectors. Relevant to Growth4Blue and TRAIN4BLUE projects.',
      vizTypes: ['Treemap — employment by maritime sub-sector (NACE breakdown)', 'Heatmap — green skill demand by country and sector', 'Time-series — OJA postings for blue economy occupations over time', 'Radar — green skill competency profiles vs. workforce supply profiles', 'Area chart — share of green/blue economy jobs in total employment', 'Choropleth — Adriatic-Ionian coastal employment density'],
      keySources: ['Cedefop Skills-OVATE (green/digital dashboards)', 'EMSA (European Maritime Safety Agency)', 'Eurostat fisheries + aquaculture statistics', 'ESCO green occupations (35 new in v1.2)', 'Growth4Blue project portals'],
      color: '#1a9e72',
    },
    {
      icon: '📡', title: 'Portal Developer / Data Engineer',
      desc: 'Builds crawlers, data pipelines, and visualization systems. Needs technical specifications for scraping, normalization, and rendering.',
      vizTypes: ['Calendar heatmap — portal scraping activity and success rates', 'Time-series — OJA posting volume trends by portal', 'Bar chart — data coverage gaps by country and portal', 'Network graph — portal relationship and redirect chains', 'Stacked area — data quality score over time (completeness, freshness, dedup rate)'],
      keySources: ['41 OJA portals (lab catalog)', 'Cedefop/Eurostat Web Intelligence Hub methodology', 'ESCO normalization API', 'Scrapy / Playwright pipeline docs', 'Implementation tab — crawling portals catalog'],
      color: '#f78166',
    },
  ];

  const cards = roles.map(r =>
    '<div class="lmir-role-card" style="--role-color:' + r.color + '">' +
    '<div class="lmir-role-header">' +
    '<span class="lmir-role-icon">' + r.icon + '</span>' +
    '<div><div class="lmir-role-title">' + esc(r.title) + '</div>' +
    '<div class="lmir-role-desc">' + esc(r.desc) + '</div></div>' +
    '</div>' +
    '<div class="lmir-role-body">' +
    '<div class="lmir-role-col">' +
    '<div class="lmir-role-colhead">📈 Key Visualizations</div>' +
    '<ul>' + r.vizTypes.map(v => '<li>' + esc(v) + '</li>').join('') + '</ul>' +
    '</div>' +
    '<div class="lmir-role-col">' +
    '<div class="lmir-role-colhead">🗄️ Key Data Sources</div>' +
    '<ul>' + r.keySources.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>' +
    '</div>' +
    '</div>' +
    '</div>'
  ).join('');

  el.innerHTML =
    '<div class="lmir-hero">' +
    '<h3>👥 Visualizations by Role</h3>' +
    '<p>Different stakeholders in the labor market ecosystem need different data views and chart types. This section maps each role to the most useful visualizations and data sources available in the lab.</p>' +
    '</div>' +
    '<div class="lmir-roles-grid">' + cards + '</div>';
}

function _renderLmirViz() {
  const grid = document.getElementById('lmir-viz-grid');
  if (!grid) return;
  grid.innerHTML = LMI_VIZ_DATA.map(function(v) {
    const libs = v.libraries.map(function(l) { return '<span class="lmir-lib-badge">' + esc(l) + '</span>'; }).join('');
    return '<div class="lmir-viz-card" data-name="' + esc(v.name.toLowerCase()) + '" data-category="' + esc(v.category) + '" data-desc="' + esc((v.bestFor||'').toLowerCase()) + '">' +
      '<div class="lmir-viz-card-top">' +
      '<span class="lmir-viz-icon">' + v.icon + '</span>' +
      '<div class="lmir-viz-name">' + esc(v.name) + '</div>' +
      '<span class="lmir-cat-badge lmir-cat-' + esc(v.category) + '">' + ({'temporal':'Temporal','comparison':'Comparison','hierarchy':'Hierarchy','flow':'Flow','geographic':'Geographic','distribution':'Distribution','network':'Network','special':'Special / LMI','oja-intelligence':'OJA Intelligence'}[v.category] || esc(v.category)) + '</span>' +
      '</div>' +
      '<div class="lmir-viz-definition">' + esc(v.definition) + '</div>' +
      '<div class="lmir-viz-question">❓ <em>' + esc(v.question) + '</em></div>' +
      '<div class="lmir-viz-libs">' + libs + '</div>' +
      '<div class="lmir-viz-gotcha">⚠️ ' + esc(v.gotcha) + '</div>' +
      '<div class="lmir-viz-usecase">🔬 <strong>LIVLAB:</strong> ' + esc(v.useCase) + '</div>' +
      '</div>';
  }).join('');
}

function _renderLmirPortals() {
  const el = document.getElementById('lmir-section-portals');
  if (!el) return;
  const cards = LMI_PORTAL_DATA.map(function(p) {
    const strLi = p.strengths.map(function(s) { return '<li>' + esc(s) + '</li>'; }).join('');
    const wkLi = p.weaknesses.map(function(w) { return '<li>' + esc(w) + '</li>'; }).join('');
    return '<div class="lmir-portal-card">' +
      '<div class="lmir-portal-header">' +
      '<span class="lmir-portal-icon">' + p.icon + '</span>' +
      '<div><div class="lmir-portal-name">' + esc(p.name) + '</div>' +
      '<div class="lmir-portal-scope">' + esc(p.scope) + '</div></div>' +
      '</div>' +
      '<div class="lmir-strengths-weaknesses">' +
      '<div class="lmir-sw-col"><div class="lmir-sw-header lmir-sw-strength">✅ Strengths</div><ul>' + strLi + '</ul></div>' +
      '<div class="lmir-sw-col"><div class="lmir-sw-header lmir-sw-weakness">⚠️ Gaps</div><ul>' + wkLi + '</ul></div>' +
      '</div>' +
      '<div class="lmir-portal-lessons"><strong>📌 Key Lessons for LIVLAB:</strong> ' + esc(p.lessons) + '</div>' +
      '</div>';
  }).join('');
  el.innerHTML =
    '<div class="lmir-hero"><h3>🌐 Portal Benchmarks</h3>' +
    '<p>Best practices from 7 leading labor market observatory portals worldwide, synthesized for LIVLAB design.</p></div>' +
    '<div class="lmir-portal-grid">' + cards + '</div>';
}

function _renderLmirRegional() {
  const el = document.getElementById('lmir-section-regional');
  if (!el) return;
  const cards = LMI_REGIONAL_DATA.map(function(r) {
    const solLi = r.solutions.map(function(s) { return '<li>' + esc(s) + '</li>'; }).join('');
    return '<div class="lmir-regional-card">' +
      '<div class="lmir-regional-header"><span class="lmir-regional-icon">' + r.icon + '</span>' +
      '<div class="lmir-regional-title">' + esc(r.title) + '</div></div>' +
      '<div class="lmir-regional-context">' + esc(r.context) + '</div>' +
      '<div class="lmir-regional-stat">📊 ' + esc(r.key_stat) + '</div>' +
      '<div class="lmir-regional-challenge"><strong>⚡ Challenge:</strong> ' + esc(r.challenge) + '</div>' +
      '<div class="lmir-regional-solutions"><strong>✅ Visualization Solutions:</strong><ul>' + solLi + '</ul></div>' +
      '</div>';
  }).join('');
  el.innerHTML =
    '<div class="lmir-hero"><h3>🏔️ Regional Challenges: Mediterranean &amp; Western Balkans</h3>' +
    '<p>Standard LMI techniques require adaptation for the specific structural realities of these regions — large informal sectors, dual labor markets, seasonal economies, and fragmented statistical systems.</p></div>' +
    '<div class="lmir-regional-grid">' + cards + '</div>';
}
