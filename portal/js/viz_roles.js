/* viz_roles.js — per-role panel renderers (hiring, planner, research, policy, career) */

// ════════════════════════════════════════════════════════ HIRING MANAGER

RENDERERS.hiring = function () {

  // h1 — Demand Trend (multi-line, all 18 occ or top-5 for readability)
  const TOP5 = OCC18.slice(0,5);
  const c1 = mk('h-trend');
  if (c1) c1.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: xCat(QTR20, {interval:3}),
    yAxis: yVal('Demand Index (Q1 2020=100)'),
    series: TOP5.map((o,i) => ({
      name:o.name, type:'line', data:o.demand, smooth:true,
      lineStyle:{width:2,color:C[i]}, itemStyle:{color:C[i]}, showSymbol:false,
    })),
  });

  // h2 — Skills Gap grouped bar (Software Developer)
  const SKILLS8   = ['Python','JavaScript','Cloud','Docker','SQL','Git','REST APIs','Agile'];
  const DEMAND8   = [89,82,74,68,65,62,58,52];
  const SUPPLY8   = [72,68,48,42,71,75,55,61];
  const c2 = mk('h-skillgap');
  if (c2) c2.setOption({...B(),
    legend: leg(),
    grid: {...B().grid, left:20},
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: {type:'value', max:100, axisLabel:{formatter:'{value}%',fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:[...SKILLS8].reverse(), axisLabel:{fontSize:10}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[
      {name:'Demand', type:'bar', data:[...DEMAND8].reverse(), barMaxWidth:12, itemStyle:{color:C[0], borderRadius:[0,3,3,0]}},
      {name:'Supply', type:'bar', data:[...SUPPLY8].reverse(), barMaxWidth:12, itemStyle:{color:C[1], borderRadius:[0,3,3,0]}},
    ],
  });

  // h3 — Hiring Difficulty Bubble (salary × growth × market size × gap)
  const c3 = mk('h-bubble');
  if (c3) c3.setOption({...B(),
    tooltip: {...B().tooltip, formatter: p => `<b>${p.data.name}</b><br>Salary: €${p.data.value[0]}k<br>Growth: ${p.data.value[1]}%<br>Gap: ${Math.round(p.data.value[3]*100)}%`},
    grid: {...B().grid, top:20, bottom:30},
    xAxis: {type:'value', name:'Median salary (€k)', nameLocation:'middle', nameGap:22,
      nameTextStyle:{color:v('--fg-muted'),fontSize:10},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'value', name:'Demand growth %', nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    series:[{
      type:'scatter',
      data: OCC18.slice(0,8).map((o,i) => ({name:o.name, value:[o.wage, o.grow, 1+Math.abs(o.gap)*0.08, Math.abs(o.gap)/34], itemStyle:{color:C[i%C.length], opacity:0.85}})),
      symbolSize: d => Math.sqrt(d[2]) * 30,
      label:{show:true, formatter:p=>p.data.name.split(' ')[0], fontSize:9, color:v('--fg'), position:'inside'},
    }],
  });

  // h4 — Skill Seasonality Heatmap
  const SKILL_NAMES = ['Python','JavaScript','Cloud','Docker','SQL','ML','LLMs/GenAI','TypeScript'];
  const BASE_INT    = [88,80,70,65,60,72,75,45];
  const SEASONAL    = [1.15,1.12,1.08,0.95,0.88,0.82,0.85,0.90,0.92,0.98,1.02,0.78];
  const hmData = [];
  SKILL_NAMES.forEach((s,si) => {
    MONTHS.forEach((m,mi) => {
      const seed = (si * 7 + mi * 3) % 17;
      hmData.push([mi, si, Math.round(BASE_INT[si] * SEASONAL[mi] * (0.92 + seed * 0.01))]);
    });
  });
  const c4 = mk('h-heatmap');
  if (c4) c4.setOption({...B(),
    tooltip: {...B().tooltip, formatter:p=>`${SKILL_NAMES[p.data[1]]} · ${MONTHS[p.data[0]]}<br>Intensity: ${p.data[2]}`},
    grid: {...B().grid, top:12, bottom:28},
    xAxis: xCat(MONTHS),
    yAxis: {type:'category', data:SKILL_NAMES, axisLabel:{fontSize:10}, axisLine:{lineStyle:{color:v('--border')}}},
    visualMap: {min:55, max:110, calculable:false, show:false, inRange:{color:[v('--bg-3'),'#1a3a5c',C[0],'#79c0ff']}},
    series:[{type:'heatmap', data:hmData, itemStyle:{borderWidth:2, borderColor:v('--bg')}}],
  });

  // h5 — Recruiting Funnel
  const FUNNEL_STAGES = [
    {name:'Sourced',      value:1000},
    {name:'Applied',      value:480},
    {name:'Screened',     value:210},
    {name:'Interviewed',  value:85},
    {name:'Offer Made',   value:32},
    {name:'Hired',        value:24},
  ];
  const c5 = mk('h-funnel');
  if (c5) c5.setOption({...B(),
    tooltip: {trigger:'item', ...B().tooltip,
      formatter: p => `${p.name}: ${p.value.toLocaleString()}<br>Conversion: ${((p.value/1000)*100).toFixed(1)}% of sourced`},
    series:[{
      type:'funnel', width:'60%', left:'20%', top:20, bottom:20,
      sort:'descending', gap:4,
      data: FUNNEL_STAGES.map((s,i)=>({...s, itemStyle:{color:C[i]}})),
      label:{position:'right', color:v('--fg'), fontSize:10},
      labelLine:{show:true, length:10, lineStyle:{color:v('--border')}},
    }],
  });

  // h6 — Time-to-Fill by Occupation (lollipop: thin bar + scatter dot)
  const TTF_OCC  = OCC18.slice(0,10).map(o => o.name);
  const TTF_DAYS = [62, 85, 28, 32, 35, 42, 22, 38, 25, 18];
  const sortedTTF = TTF_OCC.map((n,i)=>({n,d:TTF_DAYS[i]})).sort((a,b)=>b.d-a.d);
  const c6 = mk('h-ttf');
  if (c6) c6.setOption({...B(),
    grid: {...B().grid, left:25},
    tooltip: {trigger:'axis', ...B().tooltip, formatter:p=>`${p[0].name}<br>Median time-to-fill: <b>${p[0].value} days</b>`},
    xAxis: {type:'value', name:'Median days to fill', nameLocation:'middle', nameGap:20,
      nameTextStyle:{color:v('--fg-muted'),fontSize:9}, axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:sortedTTF.map(d=>d.n), axisLabel:{fontSize:9}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[
      {type:'bar',     data:sortedTTF.map(d=>d.d), barWidth:3, itemStyle:{color:C[0], borderRadius:2}, z:1},
      {type:'scatter', data:sortedTTF.map(d=>d.d), symbolSize:10, itemStyle:{color:C[0]}, z:2,
        label:{show:true, position:'right', formatter:'{c}d', fontSize:9, color:v('--fg-muted')}},
    ],
  });

  // h7 — Source of Hire (donut)
  const SOH_DATA = [
    {name:'Job Boards',  value:38, itemStyle:{color:C[0]}},
    {name:'Referrals',   value:22, itemStyle:{color:C[1]}},
    {name:'LinkedIn',    value:18, itemStyle:{color:C[2]}},
    {name:'Agency',      value:12, itemStyle:{color:C[3]}},
    {name:'Direct Apply',value:7,  itemStyle:{color:C[4]}},
    {name:'Other',       value:3,  itemStyle:{color:C[5]}},
  ];
  const c7 = mk('h-source');
  if (c7) c7.setOption({...B(),
    tooltip: {trigger:'item', ...B().tooltip, formatter:'{b}: {c}% ({d}%)'},
    legend: {...leg(), orient:'vertical', right:6, top:'middle', textStyle:{fontSize:10,color:v('--fg-muted')}},
    series:[{
      type:'pie', radius:['40%','66%'], center:['36%','50%'],
      data:SOH_DATA, label:{show:false}, emphasis:{scale:true, scaleSize:6},
    }],
  });
};

// ════════════════════════════════════════════════════════ WORKFORCE PLANNER

// Parameterised Supply-Demand Balance chart (also called from sector filter dropdown)
function renderBalanceChart(sector) {
  const data = sector === 'all' ? OCC18 : OCC18.filter(o => o.sector === sector);
  const sorted = [...data].sort((a,b) => a.gap - b.gap);
  const el = document.getElementById('p-balance');
  if (!el) return;
  el.style.height = Math.max(280, sorted.length * 34 + 50) + 'px';
  let chart = echarts.getInstanceByDom(el);
  if (chart) { chart.dispose(); INSTANCES.splice(INSTANCES.indexOf(chart), 1); }
  chart = echarts.init(el, null, {renderer:'canvas'});
  INSTANCES.push(chart);
  chart.setOption({...B(),
    grid: {...B().grid, left:25, right:60},
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => `${p[0].name}<br>${p[0].value > 0 ? 'Surplus' : 'Shortage'}: ${Math.abs(p[0].value)}%`},
    xAxis: {type:'value', name:'← Surplus   |   Shortage →', nameLocation:'middle', nameGap:22,
      nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLabel:{formatter: vl => Math.abs(vl) + '%', fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:sorted.map(d=>d.name), axisLabel:{fontSize:9.5}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[{
      type:'bar', data:sorted.map(d=>({
        value:d.gap,
        itemStyle:{color:d.gap<0?C[4]:C[1], borderRadius:d.gap<0?[3,0,0,3]:[0,3,3,0]},
      })),
      barMaxWidth:16,
      label:{show:true, position:p=>p.data.value<0?'insideLeft':'insideRight',
        formatter:p=>`${p.value}%`, fontSize:9, color:'#fff'},
    }],
  });
}

function filterBalance() {
  const sector = document.getElementById('balance-filter')?.value || 'all';
  renderBalanceChart(sector);
}

RENDERERS.planner = function () {

  // p1 — Supply-Demand Balance (parameterised)
  renderBalanceChart('all');

  // p2 — Skills Radar
  const RADAR_IND  = ['Python','ML','SQL','Stats','Deep Learning','NLP','Data Viz','LLMs/GenAI'];
  const RADAR_DEM  = [95,91,85,82,74,68,52,72];
  const RADAR_SUP  = [72,55,71,62,38,32,58,22];
  const c2 = mk('p-radar');
  if (c2) c2.setOption({...B(),
    legend: leg(),
    radar: {indicator:RADAR_IND.map(n=>({name:n,max:100})),
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}},
      splitArea:{show:false}, nameGap:4, axisName:{color:v('--fg-muted'),fontSize:9}},
    series:[{type:'radar', data:[
      {name:'Demand', value:RADAR_DEM, lineStyle:{color:C[0],width:2}, areaStyle:{color:C[0].replace(')',',0.15)').replace('rgb','rgba')}, itemStyle:{color:C[0]}},
      {name:'Supply', value:RADAR_SUP, lineStyle:{color:C[1],width:2}, areaStyle:{color:C[1].replace(')',',0.15)').replace('rgb','rgba')}, itemStyle:{color:C[1]}},
    ]}],
  });

  // p3 — Education → Occupation Sankey
  const c3 = mk('p-sankey');
  if (c3) c3.setOption({...B(),
    tooltip: {trigger:'item', ...B().tooltip},
    series:[{type:'sankey', nodeGap:12, nodeWidth:14, emphasis:{focus:'adjacency'},
      data:[
        {name:'Engineering',itemStyle:{color:C[0]}},{name:'Comp. Science',itemStyle:{color:C[1]}},
        {name:'Economics',itemStyle:{color:C[3]}},{name:'Biology/Health',itemStyle:{color:C[2]}},
        {name:'Business',itemStyle:{color:C[4]}},
        {name:'→ Software Dev.',itemStyle:{color:'#388bfd'}},{name:'→ Data Scientist',itemStyle:{color:'#3fb950'}},
        {name:'→ Nurse',itemStyle:{color:C[2]}},{name:'→ Logistics',itemStyle:{color:C[3]}},
        {name:'→ Marketing Mgr',itemStyle:{color:C[4]}},{name:'→ Other',itemStyle:{color:v('--fg-muted')}},
      ],
      links:[
        {source:'Engineering',target:'→ Software Dev.',value:38},{source:'Engineering',target:'→ Data Scientist',value:18},
        {source:'Engineering',target:'→ Logistics',value:12},{source:'Engineering',target:'→ Other',value:32},
        {source:'Comp. Science',target:'→ Software Dev.',value:52},{source:'Comp. Science',target:'→ Data Scientist',value:28},
        {source:'Comp. Science',target:'→ Other',value:20},
        {source:'Economics',target:'→ Data Scientist',value:22},{source:'Economics',target:'→ Marketing Mgr',value:18},
        {source:'Economics',target:'→ Other',value:60},
        {source:'Biology/Health',target:'→ Nurse',value:68},{source:'Biology/Health',target:'→ Other',value:32},
        {source:'Business',target:'→ Marketing Mgr',value:42},{source:'Business',target:'→ Logistics',value:22},
        {source:'Business',target:'→ Other',value:36},
      ],
      lineStyle:{color:'gradient', opacity:0.4},
      label:{color:v('--fg'), fontSize:10},
    }],
  });

  // p4 — Workforce Waterfall
  const WF_ITEMS = [
    {name:'2020 Baseline',value:100000,type:'total'},
    {name:'Graduates In',  value:24000,type:'pos'},
    {name:'Transitions In',value:18500,type:'pos'},
    {name:'Immigration',   value:8200, type:'pos'},
    {name:'Retirements',   value:-12400,type:'neg'},
    {name:'Transitions Out',value:-9800,type:'neg'},
    {name:'2025 Total',    value:128500,type:'total'},
  ];
  let cum = 0;
  const wfData = WF_ITEMS.map(item => {
    if (item.type==='total') { cum=item.value; return {value:[0,item.value],type:item.type}; }
    const start=cum; cum+=item.value; return {value:[start,cum],type:item.type};
  });
  const c4 = mk('p-waterfall');
  if (c4) c4.setOption({...B(),
    tooltip: {...B().tooltip, formatter:(p)=>{const d=WF_ITEMS[p.dataIndex];return `${d.name}<br>${d.value>0?'+':''}${d.value.toLocaleString()}`;}},
    grid: {...B().grid, bottom:38},
    xAxis: {type:'category', data:WF_ITEMS.map(d=>d.name), axisLabel:{fontSize:9,rotate:20}, axisLine:{lineStyle:{color:v('--border')}}},
    yAxis: yVal('', {formatter:vl=>`${(vl/1000).toFixed(0)}k`}),
    series:[{type:'bar', data:wfData.map((d,i)=>({
      value:d.value, itemStyle:{color:d.type==='total'?C[0]:d.type==='pos'?C[1]:C[4], borderRadius:[3,3,0,0]},
    })), barMaxWidth:38}],
  });

  // p5 — Workforce Age Pyramid (internal HR snapshot, 2024)
  const PYR_AGE  = ['20–29','30–39','40–49','50–59','60+'];
  const PYR_MALE = [180, 340, 390, 280, 95];
  const PYR_FEM  = [160, 310, 345, 240, 72];
  const c5 = mk('p-pyramid');
  if (c5) c5.setOption({...B(),
    legend: leg({data:['Male','Female']}),
    grid: {...B().grid, left:20},
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter:p=>`${p[0].axisValue}<br>Male: ${Math.abs(p[0].value)}<br>Female: ${p[1].value}`},
    xAxis: {type:'value', axisLabel:{formatter:vl=>Math.abs(vl),fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:PYR_AGE, axisLabel:{fontSize:10}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[
      {name:'Male',   type:'bar', data:PYR_MALE.map(d=>-d), barMaxWidth:22, itemStyle:{color:C[0]}},
      {name:'Female', type:'bar', data:PYR_FEM,             barMaxWidth:22, itemStyle:{color:'#f781b2'}},
    ],
  });

  // p6 — Headcount vs Target by department
  const DEPTS   = ['ICT','Finance','Marketing','Operations','HR','Legal','R&D','Customer Support'];
  const CURRENT = [124, 48, 62, 218, 34, 22, 88, 145];
  const TARGET  = [145, 52, 70, 210, 35, 22, 110, 160];
  const c6 = mk('p-headcount');
  if (c6) c6.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter:p=>`${p[0].name}<br>Current: ${p[0].value}<br>Target: ${p[1].value}<br>Gap: ${p[1].value-p[0].value}`},
    grid: {...B().grid, left:20},
    xAxis: {type:'value', axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:DEPTS, axisLabel:{fontSize:9.5}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[
      {name:'Current', type:'bar', data:CURRENT, barMaxWidth:12, itemStyle:{color:C[0]}},
      {name:'Target',  type:'bar', data:TARGET,  barMaxWidth:12, itemStyle:{color:v('--border'),borderColor:C[1],borderWidth:1.5}, barGap:'30%'},
    ],
  });

  // p7 — Department Headcount Trend (stream / stacked area)
  const STREAM_DEPTS = ['ICT','Operations','Customer Support','Finance','Marketing'];
  const STREAM_DATA  = {
    ICT:              [88, 92, 96, 100, 105, 108, 112, 116, 118, 120, 122, 124],
    Operations:       [195,198,202,206,210,212,214,215,215,216,217,218],
    'Customer Support':[125,126,128,130,132,134,136,138,140,141,142,145],
    Finance:          [44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 48, 48],
    Marketing:        [52, 54, 56, 58, 59, 60, 60, 61, 62, 62, 62, 62],
  };
  const STREAM_QTR = ['2022Q3','Q4','2023Q1','Q2','Q3','Q4','2024Q1','Q2','Q3','Q4','2025Q1','Q2'];
  const c7 = mk('p-stream');
  if (c7) c7.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', axisPointer:{type:'cross'}, ...B().tooltip},
    xAxis: xCat(STREAM_QTR, {interval:2}),
    yAxis: yVal('Headcount'),
    series: STREAM_DEPTS.map((d,i) => ({
      name:d, type:'line', data:STREAM_DATA[d], stack:'total', smooth:true,
      areaStyle:{}, lineStyle:{width:0}, itemStyle:{color:C[i]}, showSymbol:false,
    })),
  });
};

// ════════════════════════════════════════════════════════ SKILLS RESEARCHER

RENDERERS.research = function () {

  // r1 — Skills Co-occurrence Network
  const NODE_COLORS = {tech:C[0],ai:C[1],data:C[3],infra:C[2],soft:v('--fg-muted')};
  const NET_NODES = [
    {id:'Python',group:'tech',size:95},{id:'ML',group:'ai',size:82},{id:'SQL',group:'data',size:78},
    {id:'JavaScript',group:'tech',size:75},{id:'Deep Learning',group:'ai',size:68},{id:'Cloud',group:'infra',size:65},
    {id:'Docker',group:'infra',size:58},{id:'Statistics',group:'data',size:62},{id:'NLP',group:'ai',size:55},
    {id:'Data Viz',group:'data',size:52},{id:'Agile',group:'soft',size:48},{id:'Communication',group:'soft',size:65},
    {id:'LLMs/GenAI',group:'ai',size:72},{id:'APIs',group:'tech',size:55},
  ];
  const NET_LINKS = [
    ['Python','ML',88],['Python','Deep Learning',75],['Python','NLP',68],['Python','SQL',62],['Python','Statistics',72],
    ['ML','Deep Learning',82],['ML','Statistics',75],['ML','LLMs/GenAI',70],['Deep Learning','NLP',78],
    ['Deep Learning','LLMs/GenAI',82],['JavaScript','APIs',85],['Cloud','Docker',78],['Cloud','APIs',65],
    ['SQL','Data Viz',68],['Statistics','Data Viz',72],['Agile','Communication',62],['NLP','LLMs/GenAI',88],
  ].map(([s,t,val])=>({source:s,target:t,value:val}));
  const c1 = mk('r-network');
  if (c1) c1.setOption({...B(),
    tooltip: {...B().tooltip, formatter:p=>p.dataType==='node'?`<b>${p.data.id}</b><br>Demand freq: ${p.data.symbolSize?.toFixed(0)||''}`:undefined},
    series:[{type:'graph', layout:'force', roam:true,
      force:{repulsion:180, gravity:0.12, edgeLength:[40,120]},
      data:NET_NODES.map(n=>({id:n.id,name:n.id,symbolSize:n.size*0.28+8,itemStyle:{color:NODE_COLORS[n.group]},
        label:{show:n.size>60,fontSize:9,color:v('--fg')}})),
      links:NET_LINKS.map(l=>({...l,lineStyle:{width:Math.max(1,l.value*0.025),color:v('--fg-muted').replace(')',',0.35)').replace('rgb','rgba')}})),
      emphasis:{focus:'adjacency'},
    }],
  });

  // r2 — Bump chart (skill rank 2020–2025)
  const YEARS6 = ['2020','2021','2022','2023','2024','2025'];
  const RANK_DATA = {
    'Python':     [1,1,1,1,1,1], 'JavaScript':[2,2,2,2,3,3],
    'Cloud':      [4,3,3,3,2,2], 'SQL':       [3,4,4,5,5,5],
    'ML':         [5,5,5,4,4,4], 'LLMs/GenAI':[8,8,7,6,3,2],
    'Docker':     [6,6,6,7,6,6], 'TypeScript':[7,7,8,8,7,7],
  };
  const c2 = mk('r-bump');
  if (c2) c2.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: xCat(YEARS6),
    yAxis: {type:'value', inverse:true, min:1, max:8, name:'Rank',
      nameTextStyle:{color:v('--fg-muted'),fontSize:9}, axisLabel:{formatter:vl=>`#${vl}`,fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    series: Object.entries(RANK_DATA).map(([name,data],i) => ({
      name, type:'line', data, smooth:false, lineStyle:{width:2,color:C[i]}, itemStyle:{color:C[i]}, symbolSize:6,
      label:{show:true, position:'right', formatter:p=>p.dataIndex===YEARS6.length-1?`#${p.value} ${name}`:'', fontSize:9, color:C[i]},
    })),
  });

  // r3 — Treemap (ESCO skill taxonomy)
  const c3 = mk('r-treemap');
  if (c3) c3.setOption({...B(),
    tooltip: {...B().tooltip, formatter:p=>`<b>${p.name}</b><br>Demand share: ${p.value}%`},
    series:[{type:'treemap',
      data:[
        {name:'Digital & ICT',value:43,children:[
          {name:'Python',value:12,itemStyle:{color:'#2f81f7'}},{name:'JavaScript',value:9,itemStyle:{color:'#388bfd'}},
          {name:'Cloud',value:8,itemStyle:{color:'#1f6feb'}},{name:'Docker',value:7,itemStyle:{color:'#0d419d'}},
          {name:'APIs',value:7,itemStyle:{color:'#0550ae'}},
        ],itemStyle:{color:'#1a3a5c'}},
        {name:'AI & Data Science',value:28,children:[
          {name:'ML',value:9,itemStyle:{color:'#56d364'}},{name:'Deep Learning',value:7,itemStyle:{color:'#3fb950'}},
          {name:'LLMs/GenAI',value:8,itemStyle:{color:'#2ea043'}},{name:'NLP',value:4,itemStyle:{color:'#238636'}},
        ],itemStyle:{color:'#1a4a2e'}},
        {name:'Data & Analytics',value:18,children:[
          {name:'SQL',value:7,itemStyle:{color:'#d2a8ff'}},{name:'Statistics',value:5,itemStyle:{color:'#a371f7'}},
          {name:'Data Viz',value:6,itemStyle:{color:'#8957e5'}},
        ],itemStyle:{color:'#3a1f5c'}},
        {name:'Transversal',value:11,children:[
          {name:'Communication',value:5,itemStyle:{color:'#f0883e'}},{name:'Agile',value:4,itemStyle:{color:'#db6d28'}},
          {name:'Excel',value:2,itemStyle:{color:'#bd561d'}},
        ],itemStyle:{color:'#3a2a1a'}},
      ],
      label:{fontSize:10,color:'#e6edf3'}, roam:false, visibleMin:4,
    }],
  });

  // r4 — Scatter: Demand Growth vs Wage Premium
  const SCATTER_SKILLS = [
    {name:'Python',growth:22,premium:28,supply:95},{name:'LLMs/GenAI',growth:85,premium:42,supply:22},
    {name:'Cloud',growth:38,premium:32,supply:65},{name:'Deep Learning',growth:45,premium:38,supply:38},
    {name:'SQL',growth:5,premium:12,supply:78},{name:'JavaScript',growth:8,premium:15,supply:75},
    {name:'Docker',growth:28,premium:22,supply:58},{name:'Agile',growth:4,premium:8,supply:48},
    {name:'Excel',growth:-2,premium:10,supply:82},{name:'NLP',growth:52,premium:35,supply:32},
    {name:'Statistics',growth:18,premium:24,supply:62},{name:'Communication',growth:2,premium:6,supply:65},
  ];
  const xs=SCATTER_SKILLS.map(d=>d.growth), ys=SCATTER_SKILLS.map(d=>d.premium);
  const n=xs.length, sx=xs.reduce((a,b)=>a+b,0), sy=ys.reduce((a,b)=>a+b,0);
  const sxy=xs.reduce((s,x,i)=>s+x*ys[i],0), sx2=xs.reduce((s,x)=>s+x*x,0);
  const slope=(n*sxy-sx*sy)/(n*sx2-sx*sx), intercept=(sy-slope*sx)/n;
  const xMin=Math.min(...xs)-5, xMax=Math.max(...xs)+5;
  const c4 = mk('r-scatter');
  if (c4) c4.setOption({...B(),
    tooltip: {...B().tooltip, formatter:p=>p.seriesIndex===0?`<b>${p.data.name}</b><br>Demand growth: ${p.data.value[0]}%<br>Wage premium: ${p.data.value[1]}%<br>Supply volume: ${p.data.value[2]}`:undefined},
    grid: {...B().grid, bottom:30},
    xAxis: {type:'value', name:'Demand growth YoY (%)', nameLocation:'middle', nameGap:22,
      nameTextStyle:{color:v('--fg-muted'),fontSize:10}, axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'value', name:'Wage premium (%)', nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    series:[
      {type:'scatter', data:SCATTER_SKILLS.map(d=>({...d,value:[d.growth,d.premium,d.supply]})),
        symbolSize:d=>Math.sqrt(d[2])*1.8+6, itemStyle:{color:C[0],opacity:0.8},
        label:{show:true,formatter:p=>p.data.name,fontSize:8.5,color:v('--fg-muted'),position:'top'}},
      {type:'line', data:[[xMin,xMin*slope+intercept],[xMax,xMax*slope+intercept]],
        lineStyle:{color:C[2],type:'dashed',width:1.5}, symbol:'none', tooltip:{show:false}},
    ],
  });

  // r5 — Sunburst (ESCO skill hierarchy)
  const c5 = mk('r-sunburst');
  if (c5) c5.setOption({...B(),
    tooltip: {...B().tooltip, formatter:p=>`${p.name}: ${p.value}% of demand`},
    series:[{type:'sunburst', radius:['15%','90%'], sort:undefined,
      data:[
        {name:'Digital & ICT', value:43, itemStyle:{color:C[0]}, children:[
          {name:'Programming', value:21, children:[{name:'Python',value:12},{name:'JavaScript',value:9}]},
          {name:'Infrastructure',value:15,children:[{name:'Cloud',value:8},{name:'Docker',value:7}]},
          {name:'Integration',value:7,children:[{name:'APIs',value:7}]},
        ]},
        {name:'AI & Data', value:28, itemStyle:{color:C[1]}, children:[
          {name:'Machine Learning',value:16,children:[{name:'ML',value:9},{name:'Deep Learning',value:7}]},
          {name:'Language AI',value:12,children:[{name:'LLMs/GenAI',value:8},{name:'NLP',value:4}]},
        ]},
        {name:'Analytics', value:18, itemStyle:{color:C[3]}, children:[
          {name:'Databases',value:7,children:[{name:'SQL',value:7}]},
          {name:'Methods',value:11,children:[{name:'Statistics',value:5},{name:'Data Viz',value:6}]},
        ]},
        {name:'Transversal', value:11, itemStyle:{color:C[2]}, children:[
          {name:'Soft Skills',value:9,children:[{name:'Communication',value:5},{name:'Agile',value:4}]},
          {name:'Tools',value:2,children:[{name:'Excel',value:2}]},
        ]},
      ],
      label:{fontSize:9,color:v('--fg')},
      levels:[
        {},{itemStyle:{borderWidth:2,borderColor:v('--bg')}},
        {itemStyle:{borderWidth:1,borderColor:v('--bg')},label:{fontSize:9}},
        {label:{show:false}},
      ],
    }],
  });

  // r6 — Parallel Coordinates (multi-skill profiles by occupation)
  const PARA_OCCS   = ['Software Dev.','Data Scientist','Nurse','Logistics','Marketing Mgr'];
  const PARA_SKILLS = ['Python','SQL','Cloud','ML','Communication','Management'];
  const PARA_DATA   = [
    [89,62,74,55,52,38],
    [88,75,68,88,48,42],
    [5, 12,8, 5, 85,45],
    [8, 35,22,5, 72,62],
    [28,42,35,38,88,78],
  ];
  const c6 = mk('r-parallel');
  if (c6) c6.setOption({...B(),
    legend: leg(),
    parallelAxis: PARA_SKILLS.map((s,i) => ({dim:i,name:s,nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLabel:{fontSize:8},nameGap:18,axisLine:{lineStyle:{color:v('--border')}}})),
    parallel: {left:24, right:24, bottom:32, top:36},
    tooltip: {trigger:'item', ...B().tooltip, formatter:p=>`${p.seriesName}<br>${PARA_SKILLS.map((s,i)=>`${s}: ${p.data[i]}`).join('<br>')}`},
    series: PARA_OCCS.map((name,i) => ({
      name, type:'parallel',
      data:[PARA_DATA[i]],
      lineStyle:{width:2, color:C[i], opacity:0.75},
    })),
  });

  // r7 — Skill Adoption S-Curves (2015–2025)
  const ADOPT_YRS = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  const ADOPT_DATA = {
    'Cloud Computing': [5,8,12,18,26,35,46,58,68,76,82],
    'Machine Learning':[3,5,8,12,18,26,36,48,58,66,72],
    'LLMs / GenAI':    [0,0,0,1, 2, 4, 8,15,32,52,68],
    'Python':          [18,22,28,36,45,55,64,72,78,84,89],
    'Docker/K8s':      [4,7,11,16,23,32,42,52,60,67,72],
  };
  const c7 = mk('r-adoption');
  if (c7) c7.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: xCat(ADOPT_YRS),
    yAxis: yVal('% of job postings mentioning skill', {formatter:vl=>vl+'%'}),
    series: Object.entries(ADOPT_DATA).map(([name,data],i) => ({
      name, type:'line', data, smooth:true,
      lineStyle:{width:2.5,color:C[i]}, itemStyle:{color:C[i]}, showSymbol:false,
      areaStyle:{color:C[i].replace(')',',0.08)').replace('rgb','rgba')},
    })),
  });
};

// ════════════════════════════════════════════════════════ POLICY ANALYST

RENDERERS.policy = function () {

  // po1 — Small Multiples (6 countries, employment rate)
  const SMULT = [
    {name:'Greece',     data:[56.5,57.2,58.1,59.4,60.2,58.9,60.8,62.5,64.1,65.8,66.9]},
    {name:'Italy',      data:[57.2,57.8,58.0,58.5,58.9,57.8,58.5,59.2,60.1,60.8,61.4]},
    {name:'Spain',      data:[60.5,61.2,62.1,62.8,63.4,62.2,63.5,65.2,66.1,67.2,68.1]},
    {name:'Serbia',     data:[52.1,53.4,54.8,56.2,57.5,58.2,59.8,61.2,62.5,63.8,65.1]},
    {name:'Montenegro', data:[55.2,56.1,57.4,58.8,60.1,59.2,61.2,62.8,63.5,64.8,66.2]},
    {name:'EU-27 avg',  data:[66.6,67.1,67.4,68.1,68.4,67.2,68.5,69.2,70.1,70.8,71.2]},
  ];
  const c1 = mk('po-multiples');
  if (c1) c1.setOption({...B(),
    legend:{show:false},
    grid:SMULT.map((c,i)=>({left:`${(i%3)*34+2}%`,width:'30%',top:`${Math.floor(i/3)*50+14}%`,height:'35%',containLabel:false})),
    xAxis:SMULT.map((c,i)=>({gridIndex:i,type:'category',data:YRS15,
      axisLabel:{show:i>=3,interval:4,fontSize:8},axisLine:{lineStyle:{color:v('--border')}},axisTick:{show:false}})),
    yAxis:SMULT.map((c,i)=>({gridIndex:i,type:'value',min:50,max:75,
      axisLabel:{show:i%3===0,fontSize:7.5,formatter:vl=>`${vl}%`},
      axisLine:{lineStyle:{color:v('--border')}},splitLine:{lineStyle:{color:v('--bg-3'),type:'dashed'}}})),
    tooltip:{trigger:'axis',...B().tooltip},
    series:SMULT.map((c,i)=>({name:c.name,type:'line',data:c.data,xAxisIndex:i,yAxisIndex:i,smooth:true,
      lineStyle:{color:i<5?C[i]:C[2],width:i===5?1.5:2,type:i===5?'dashed':'solid'},
      itemStyle:{color:C[i]||C[2]},showSymbol:false,
      markArea:{itemStyle:{color:v('--accent-bg')},data:[[{xAxis:'2020'},{xAxis:'2021'}]]},
      label:{show:true,position:'insideTopLeft',formatter:c.name,fontSize:9,color:C[i]||C[2],offset:[2,2]},
    })),
  });

  // po2 — Automation Risk Bubble Matrix
  const c2 = mk('po-automation');
  if (c2) c2.setOption({...B(),
    tooltip: {...B().tooltip, formatter:p=>`<b>${p.data.name}</b><br>Auto risk: ${p.data.value[0]}/100<br>Empl. share: ${p.data.value[1]}%<br>Wage: €${p.data.value[2].toLocaleString()}<br>Growth: ${p.data.value[3]}%`},
    grid: {...B().grid, bottom:30},
    xAxis: {type:'value', name:'Automation Risk (0–100)', nameLocation:'middle', nameGap:22,
      nameTextStyle:{color:v('--fg-muted'),fontSize:10}, min:0, max:100,
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'value', name:'Employment Share (%)', nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    visualMap: {show:false, min:-15, max:35, dimension:3, inRange:{color:[C[4],v('--fg-muted'),C[1]]}},
    series:[{type:'scatter',
      data:OCC18.map(o=>({name:o.name, value:[o.auto, Math.abs(o.gap)*0.15+1, o.wage*1000, o.grow]})),
      symbolSize:d=>Math.sqrt(d[2])*0.012+12,
      label:{show:true,formatter:p=>p.data.name.split(' ')[0],fontSize:8.5,color:v('--fg'),position:'top'},
    }],
  });

  // po3 — Contract Types Stacked Area (Greece)
  const c3 = mk('po-contract');
  if (c3) c3.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', axisPointer:{type:'cross'}, ...B().tooltip},
    xAxis: {...xCat(YRS15), boundaryGap:false},
    yAxis: yVal('Employment (000s)'),
    series:[
      {name:'Full-time Perm.',type:'line',stack:'total',data:[2850,2920,3010,3120,3250,3100,3280,3450,3580,3680,3780],areaStyle:{color:C[0].replace(')',',0.6)').replace('rgb','rgba')},lineStyle:{width:0},itemStyle:{color:C[0]},showSymbol:false},
      {name:'Fixed-term',     type:'line',stack:'total',data:[380,405,430,460,490,440,510,560,590,610,630],areaStyle:{color:C[2].replace(')',',0.6)').replace('rgb','rgba')},lineStyle:{width:0},itemStyle:{color:C[2]},showSymbol:false},
      {name:'Part-time',      type:'line',stack:'total',data:[420,435,448,462,478,490,508,522,535,548,558],areaStyle:{color:C[1].replace(')',',0.5)').replace('rgb','rgba')},lineStyle:{width:0},itemStyle:{color:C[1]},showSymbol:false},
      {name:'Self-employed',  type:'line',stack:'total',data:[680,695,708,722,738,750,762,775,788,800,812],areaStyle:{color:C[3].replace(')',',0.5)').replace('rgb','rgba')},lineStyle:{width:0},itemStyle:{color:C[3]},showSymbol:false},
    ],
  });

  // po4 — NEET Annotated Line
  const NEET_YRS = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  const NEET_GR  = [22.4,24.8,27.1,28.2,26.5,23.8,21.2,19.5,17.8,16.9,18.2,17.1,15.8,15.0,14.2,13.8];
  const NEET_EU  = [15.2,15.8,16.1,16.2,16.0,15.5,14.9,14.2,13.5,12.8,13.5,13.0,12.2,11.8,11.2,10.8];
  const c4 = mk('po-neet');
  if (c4) c4.setOption({...B(),
    legend: leg(),
    grid: {...B().grid, bottom:20},
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: xCat(NEET_YRS),
    yAxis: yVal('NEET rate (%)', {formatter:vl=>vl+'%'}),
    series:[
      {name:'Greece',type:'line',data:NEET_GR,smooth:true,lineStyle:{color:C[0],width:2.5},itemStyle:{color:C[0]},showSymbol:false,
        markPoint:{data:[{coord:['2013',28.2],value:'Peak 28.2%',label:{fontSize:8,color:C[4]}}],symbol:'pin',symbolSize:28,itemStyle:{color:C[4]},label:{fontSize:7,color:'#fff'}},
        markLine:{data:[
          {xAxis:'2016',label:{formatter:'Youth\nGuarantee',fontSize:7.5,color:C[1]},lineStyle:{color:C[1],type:'dashed',width:1}},
          {xAxis:'2019',label:{formatter:'ESF\nApprentice',fontSize:7.5,color:C[1]},lineStyle:{color:C[1],type:'dashed',width:1}},
          {xAxis:'2022',label:{formatter:'Post-COVID',fontSize:7.5,color:C[1]},lineStyle:{color:C[1],type:'dashed',width:1}},
        ]}},
      {name:'EU-27',type:'line',data:NEET_EU,smooth:true,lineStyle:{color:v('--fg-muted'),width:1.5,type:'dashed'},itemStyle:{color:v('--fg-muted')},showSymbol:false},
    ],
  });

  // po5 — Policy Slope Chart (employment rate before / after, by country)
  const SLOPE_CTRY  = ['Greece','Italy','Spain','Serbia','Montenegro','N. Macedonia'];
  const SLOPE_2015  = [56.5, 57.2, 60.5, 52.1, 55.2, 48.8];
  const SLOPE_2024  = [65.8, 60.8, 67.2, 63.8, 64.8, 58.5];
  const c5 = mk('po-slope');
  if (c5) c5.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => SLOPE_CTRY.map((_,i) => `${SLOPE_CTRY[i]}: ${SLOPE_2015[i]}% → ${SLOPE_2024[i]}%`).join('<br>')},
    grid: {...B().grid, bottom:20},
    xAxis: xCat(['2015','2024']),
    yAxis: yVal('Employment rate (%)', {formatter:vl=>vl+'%', min:45, max:72}),
    series: SLOPE_CTRY.map((name,i) => ({
      name, type:'line', data:[SLOPE_2015[i], SLOPE_2024[i]],
      lineStyle:{width:2,color:C[i]}, itemStyle:{color:C[i]}, symbolSize:8,
      label:{show:true, formatter:p=>p.dataIndex===1?`${name}: ${p.value}%`:'', fontSize:9, color:C[i], position:'right'},
    })),
  });

  // po6 — Gender Employment Gap (grouped bar by country, 2024)
  const GAP_CTRY  = ['Denmark','Greece','Italy','Spain','Slovenia','Serbia','Montenegro'];
  const GAP_MALE  = [80.2, 72.5, 68.8, 73.5, 79.8, 68.2, 71.5];
  const GAP_FEM   = [79.8, 61.2, 54.1, 62.5, 73.2, 59.5, 60.8];
  const c6 = mk('po-gender');
  if (c6) c6.setOption({...B(),
    legend: leg({data:['Male','Female']}),
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => `${p[0].name}<br>Male: ${p[0].value}%<br>Female: ${p[1].value}%<br>Gap: ${(p[0].value-p[1].value).toFixed(1)}pp`},
    xAxis: xCat(GAP_CTRY),
    yAxis: yVal('Employment rate (%)', {formatter:vl=>vl+'%', min:45}),
    series:[
      {name:'Male',   type:'bar', data:GAP_MALE, barMaxWidth:18, itemStyle:{color:C[0]}},
      {name:'Female', type:'bar', data:GAP_FEM,  barMaxWidth:18, itemStyle:{color:'#f781b2'}},
    ],
  });

  // po7 — NUTS2 Regional Employment Rates (Greece 2024, sorted)
  const NUTS2 = ['Attica','Central Macedonia','Western Greece','Thessaly','Peloponnese','Crete','Eastern Macedonia','Western Macedonia','Epirus','Ionian Islands'];
  const NUTS2_EMP = [70.2, 64.5, 61.8, 60.2, 65.8, 68.5, 58.5, 55.2, 56.8, 67.2];
  const sortedNUTS = NUTS2.map((r,i)=>({r,e:NUTS2_EMP[i]})).sort((a,b)=>b.e-a.e);
  const c7 = mk('po-nuts2');
  if (c7) c7.setOption({...B(),
    grid: {...B().grid, left:30},
    tooltip: {trigger:'axis', ...B().tooltip, formatter:p=>`${p[0].name}: ${p[0].value}%`},
    xAxis: {type:'value', min:50, max:75, axisLabel:{formatter:vl=>vl+'%',fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:sortedNUTS.map(d=>d.r), axisLabel:{fontSize:9}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[{
      type:'bar', data:sortedNUTS.map(d=>({value:d.e, itemStyle:{color:d.e>=68?C[1]:d.e>=62?C[0]:C[2]}})),
      barMaxWidth:16,
      label:{show:true, position:'right', formatter:'{c}%', fontSize:9, color:v('--fg-muted')},
      markLine:{data:[{xAxis:66.9,label:{formatter:'GR avg 66.9%',color:v('--warn'),fontSize:9},lineStyle:{color:v('--warn'),type:'dashed'}}]},
    }],
  });
};

// ════════════════════════════════════════════════════════ CAREER ADVISOR

RENDERERS.career = function () {

  // ca1 — Box Plot / Salary Distribution
  const BOX_DATA = [
    {name:'Software Dev.',p10:28,p25:35,med:48,p75:65,p90:88},
    {name:'Data Scientist',p10:32,p25:42,med:58,p75:78,p90:105},
    {name:'Nurse',p10:22,p25:26,med:31,p75:38,p90:45},
    {name:'Logistics Coord.',p10:20,p25:25,med:30,p75:37,p90:44},
    {name:'Marketing Mgr',p10:25,p25:32,med:42,p75:58,p90:78},
  ];
  const c1 = mk('ca-boxplot');
  if (c1) c1.setOption({...B(),
    tooltip: {...B().tooltip, formatter:p=>{const d=BOX_DATA[p.dataIndex];return d?`<b>${d.name}</b><br>P90: €${d.p90}k | P75: €${d.p75}k<br>Median: €${d.med}k<br>P25: €${d.p25}k | P10: €${d.p10}k`:''}},
    grid: {...B().grid, bottom:30},
    xAxis: xCat(BOX_DATA.map(d=>d.name)),
    yAxis: yVal('Annual gross (€k)'),
    series:[
      {type:'candlestick', data:BOX_DATA.map(d=>[d.p25,d.p90,d.p10,d.p75]),
        itemStyle:{color:C[0],color0:C[0],borderColor:C[0],borderColor0:C[1]},barMaxWidth:28},
      {type:'scatter', data:BOX_DATA.map((d,i)=>[i,d.med]), symbolSize:8, itemStyle:{color:C[2]},
        tooltip:{show:false}, label:{show:true,formatter:p=>`€${p.value[1]}k`,fontSize:9,color:C[2],position:'right'}},
    ],
  });

  // ca2 — Career Transitions Sankey
  const c2 = mk('ca-transitions');
  if (c2) c2.setOption({...B(),
    tooltip: {trigger:'item', ...B().tooltip},
    series:[{type:'sankey', nodeGap:14, nodeWidth:14, emphasis:{focus:'adjacency'},
      data:[
        {name:'From: Software Dev.',itemStyle:{color:C[0]}},{name:'From: Data Scientist',itemStyle:{color:C[1]}},
        {name:'From: Marketing Mgr',itemStyle:{color:C[2]}},{name:'From: Logistics',itemStyle:{color:C[3]}},
        {name:'To: Software Dev.',itemStyle:{color:'#388bfd'}},{name:'To: Data Scientist',itemStyle:{color:'#3fb950'}},
        {name:'To: Marketing Mgr',itemStyle:{color:C[2]}},{name:'To: Other',itemStyle:{color:v('--fg-muted')}},
      ],
      links:[
        {source:'From: Software Dev.',target:'To: Data Scientist',value:45},
        {source:'From: Software Dev.',target:'To: Marketing Mgr',value:8},
        {source:'From: Software Dev.',target:'To: Other',value:12},
        {source:'From: Data Scientist',target:'To: Software Dev.',value:25},
        {source:'From: Data Scientist',target:'To: Marketing Mgr',value:12},
        {source:'From: Data Scientist',target:'To: Other',value:8},
        {source:'From: Marketing Mgr',target:'To: Data Scientist',value:18},
        {source:'From: Marketing Mgr',target:'To: Software Dev.',value:10},
        {source:'From: Marketing Mgr',target:'To: Other',value:14},
        {source:'From: Logistics',target:'To: Marketing Mgr',value:14},
        {source:'From: Logistics',target:'To: Data Scientist',value:8},
        {source:'From: Logistics',target:'To: Other',value:22},
      ],
      lineStyle:{color:'gradient', opacity:0.45}, label:{color:v('--fg'),fontSize:9},
    }],
  });

  // ca3 — Demand Forecast with CI band
  const F_YRS  = ['2020Q1','2021Q1','2022Q1','2023Q1','2024Q1','2025Q1','2026Q1','2027Q1','2028Q1'];
  const F_HIST = {'Software Dev.':[100,128,170,198,235,302,null,null,null],'Data Scientist':[100,125,218,282,352,445,null,null,null]};
  const F_FORE = {
    'Software Dev.':  {mid:[null,null,null,null,null,302,338,378,420],lo:[null,null,null,null,null,302,308,328,348],hi:[null,null,null,null,null,302,365,425,492]},
    'Data Scientist': {mid:[null,null,null,null,null,445,502,568,638],lo:[null,null,null,null,null,445,458,495,522],hi:[null,null,null,null,null,445,548,645,762]},
  };
  const bg = v('--bg');
  const c3 = mk('ca-forecast');
  if (c3) c3.setOption({...B(),
    legend: leg({data:['Software Dev.','Data Scientist','Forecast: SW Dev','Forecast: Data Sci']}),
    grid: {...B().grid, bottom:20},
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: {...xCat(F_YRS), boundaryGap:false},
    yAxis: yVal('Demand Index'),
    series:[
      {name:'Software Dev.',type:'line',data:F_HIST['Software Dev.'],smooth:true,lineStyle:{color:C[0],width:2.5},itemStyle:{color:C[0]},showSymbol:false},
      {name:'Data Scientist',type:'line',data:F_HIST['Data Scientist'],smooth:true,lineStyle:{color:C[1],width:2.5},itemStyle:{color:C[1]},showSymbol:false},
      {name:'CI:SW hi',type:'line',data:F_FORE['Software Dev.'].hi,lineStyle:{opacity:0},itemStyle:{color:'transparent'},areaStyle:{color:'rgba(47,129,247,0.15)'},showSymbol:false,stack:'sw',tooltip:{show:false},legendHoverLink:false},
      {name:'CI:SW lo',type:'line',data:F_FORE['Software Dev.'].lo,lineStyle:{opacity:0},itemStyle:{color:'transparent'},areaStyle:{color:bg+'ff'},showSymbol:false,stack:'sw',tooltip:{show:false},legendHoverLink:false},
      {name:'Forecast: SW Dev',type:'line',data:F_FORE['Software Dev.'].mid,smooth:true,lineStyle:{color:C[0],type:'dashed',width:1.5},itemStyle:{color:C[0]},showSymbol:false},
      {name:'CI:DS hi',type:'line',data:F_FORE['Data Scientist'].hi,lineStyle:{opacity:0},itemStyle:{color:'transparent'},areaStyle:{color:'rgba(86,211,100,0.15)'},showSymbol:false,stack:'ds',tooltip:{show:false},legendHoverLink:false},
      {name:'CI:DS lo',type:'line',data:F_FORE['Data Scientist'].lo,lineStyle:{opacity:0},itemStyle:{color:'transparent'},areaStyle:{color:bg+'ff'},showSymbol:false,stack:'ds',tooltip:{show:false},legendHoverLink:false},
      {name:'Forecast: Data Sci',type:'line',data:F_FORE['Data Scientist'].mid,smooth:true,lineStyle:{color:C[1],type:'dashed',width:1.5},itemStyle:{color:C[1]},showSymbol:false},
    ],
  });

  // ca4 — Personal Skills Radar
  const RADAR_IND = ['Python','ML','SQL','Statistics','Deep Learning','NLP','Data Viz','LLMs/GenAI'];
  const c4 = mk('ca-radar');
  if (c4) c4.setOption({...B(),
    legend: leg(),
    radar: {indicator:RADAR_IND.map(n=>({name:n,max:100})),
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}},
      splitArea:{show:false}, nameGap:4, axisName:{color:v('--fg-muted'),fontSize:9}},
    series:[{type:'radar', data:[
      {name:'Market Demand', value:[95,91,85,82,74,68,52,72], lineStyle:{color:C[0],width:2}, areaStyle:{color:'rgba(47,129,247,0.12)'}, itemStyle:{color:C[0]}},
      {name:'Your Skills',   value:[75,42,80,65,28,25,60,18], lineStyle:{color:C[2],width:2}, areaStyle:{color:'rgba(240,136,62,0.20)'}, itemStyle:{color:C[2]}},
    ]}],
  });

  // ca5 — Seniority Salary Progression (grouped bar)
  const SEN_OCCS   = ['Software Dev.','Data Scientist','Civil Engineer','Nurse','Marketing Mgr'];
  const SEN_LEVELS2 = ['Entry','Mid','Senior','Lead/Principal'];
  const SEN_SALARY = [
    [28,38,55,75],  // SW Dev
    [32,48,72,98],  // Data Sci
    [28,38,52,70],  // Civil Eng
    [22,28,35,42],  // Nurse
    [26,36,52,72],  // Marketing
  ];
  const c5 = mk('ca-seniority');
  if (c5) c5.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: xCat(SEN_OCCS),
    yAxis: yVal('Annual gross (€k)'),
    series: SEN_LEVELS2.map((lvl,i) => ({
      name:lvl, type:'bar', data:SEN_OCCS.map((_,j)=>SEN_SALARY[j][i]),
      barMaxWidth:14, itemStyle:{color:C[i]},
    })),
  });

  // ca6 — Career Readiness Gauge (composite score)
  const GAUGE_VAL = 68; // illustrative
  const c6 = mk('ca-gauge');
  if (c6) c6.setOption({...B(),
    series:[{
      type:'gauge',
      startAngle:200, endAngle:-20,
      min:0, max:100,
      radius:'85%',
      pointer:{itemStyle:{color:'auto'}, length:'65%', width:5},
      axisLine:{lineStyle:{width:18, color:[[0.4,C[4]],[0.7,C[2]],[1.0,C[1]]]}},
      axisTick:{show:false}, splitLine:{show:false},
      axisLabel:{fontSize:9, color:v('--fg-muted'), distance:22},
      detail:{valueAnimation:true, formatter:'{value}%\nReadiness', color:v('--fg'), fontSize:18, offsetCenter:[0,'55%']},
      title:{color:v('--fg-muted'), fontSize:10, offsetCenter:[0,'80%']},
      data:[{value:GAUGE_VAL, name:'Career Readiness Score'}],
    }],
  });

  // ca7 — Skills Dumbbell: current vs required (grouped bar)
  const DUMP_SKILLS = ['Python','ML','Cloud','Deep Learning','SQL','Data Viz','LLMs/GenAI','NLP'];
  const DUMP_CUR    = [75, 42, 55, 28, 80, 60, 18, 25];
  const DUMP_REQ    = [89, 88, 74, 68, 72, 52, 72, 55];
  const c7 = mk('ca-dumbbell');
  if (c7) c7.setOption({...B(),
    legend: leg({data:['Current Proficiency','Market Required']}),
    grid: {...B().grid, left:22},
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => `${p[0].name}<br>Current: ${p[0].value}%<br>Required: ${p[1].value}%<br>Gap: ${p[1].value-p[0].value}pp`},
    xAxis: {type:'value', max:100, axisLabel:{formatter:'{value}%',fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:[...DUMP_SKILLS].reverse(), axisLabel:{fontSize:10}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[
      {name:'Current Proficiency', type:'bar', data:[...DUMP_CUR].reverse(), barMaxWidth:10, itemStyle:{color:C[2]}},
      {name:'Market Required',     type:'bar', data:[...DUMP_REQ].reverse(), barMaxWidth:10, itemStyle:{color:C[0]}},
    ],
  });
};
