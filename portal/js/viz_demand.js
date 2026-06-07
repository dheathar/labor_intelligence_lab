/* viz_demand.js — demand (OJA), supply (LFS), combined, geo renderers */

// ════════════════════════════════════════════════════════ DEMAND (OJA) PANEL

RENDERERS.demand = function () {

  // d1 — OJA Volume by Sector (multi-line)
  const SECTORS = ['ICT','Healthcare','Construction','Finance','Hospitality','Retail'];
  const SECT_DATA = {
    ICT:          [280,295,312,325,340,358,375,392,410,428,448,468,492,518],
    Healthcare:   [180,185,192,198,205,212,220,228,235,242,250,258,268,278],
    Construction: [145,152,168,178,185,190,198,210,218,225,235,248,258,265],
    Finance:      [120,125,128,132,135,138,140,142,145,148,150,152,155,158],
    Hospitality:  [ 85, 95,115,125, 95,102,112,125, 92,100,118,128, 94,102],
    Retail:       [165,158,162,175,155,158,162,170,152,155,160,168,148,152],
  };
  const c1 = mk('d-sector');
  if (c1) c1.setOption({...B(),
    legend: leg(),
    xAxis: xCat(QTR22, {interval:3}),
    yAxis: yVal('Postings (000s)'),
    tooltip: {trigger:'axis', ...B().tooltip},
    series: SECTORS.map((s,i) => ({
      name:s, type:'line', data:SECT_DATA[s], smooth:true,
      lineStyle:{width:2,color:C[i]}, itemStyle:{color:C[i]}, showSymbol:false,
    })),
  });

  // d2 — Top Skills Frequency (horizontal bar, ranked)
  const TOP_SKILLS = ['Python','Communication','Teamwork','MS Office','English','SQL',
    'Customer Service','Problem Solving','Cloud (AWS/GCP)','Project Mgmt',
    'JavaScript','Excel','Machine Learning','Management','Data Analysis'];
  const TOP_PCT = [89,85,82,78,75,72,68,65,62,58,55,52,48,45,42];
  const c2 = mk('d-skills');
  if (c2) c2.setOption({...B(),
    grid: {...B().grid, left:20},
    tooltip: {trigger:'axis', ...B().tooltip, formatter: p => `${p[0].name}: ${p[0].value}% of postings`},
    xAxis: {type:'value', max:100, axisLabel:{formatter:'{value}%',fontSize:9}, axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:[...TOP_SKILLS].reverse(), axisLabel:{fontSize:9.5}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[{
      type:'bar', data:[...TOP_PCT].reverse(), barMaxWidth:14,
      itemStyle:{color: params => C[Math.floor(params.dataIndex / 5)]},
      label:{show:true, position:'right', formatter:'{c}%', fontSize:9, color:v('--fg-muted')},
    }],
  });

  // d3 — Postings by Country (bar, normalised per 1000 LF)
  const COUNTRIES = ['DK','SI','GR','ES','IT','MK','RS','BA','ME','AL','XK','CY'];
  const RAW_K     = [72.8,18.5,45.2,156.8,182.5,12.5,28.4,15.2,8.2,6.8,5.8,4.2];
  const RATE_1K   = [8.5,4.8,5.2,4.1,3.8,3.5,3.2,2.8,2.8,2.2,2.1,1.8];
  const c3 = mk('d-country');
  if (c3) c3.setOption({...B(),
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => `${p[0].name}<br>Rate: <b>${RATE_1K[COUNTRIES.indexOf(p[0].name)]}</b>/1000 LF<br>Total: ${RAW_K[COUNTRIES.indexOf(p[0].name)]}k postings`},
    xAxis: xCat(COUNTRIES),
    yAxis: yVal('Postings per 1 000 LF'),
    series:[{
      type:'bar', data: RATE_1K, barMaxWidth:28,
      itemStyle:{color: p => p.dataIndex < 3 ? C[0] : p.dataIndex < 6 ? C[1] : C[3]},
      label:{show:true, position:'top', fontSize:9, formatter:'{c}', color:v('--fg-muted')},
    }],
    markLine:{data:[{type:'average', name:'Avg', label:{color:v('--warn')}}]},
  });

  // d4 — Contract Type Distribution (donut)
  const CONTRACTS = [
    {name:'Full-time Permanent', value:52, itemStyle:{color:C[0]}},
    {name:'Fixed-term',          value:24, itemStyle:{color:C[2]}},
    {name:'Part-time',           value:14, itemStyle:{color:C[1]}},
    {name:'Self-employed/Freelance', value:8, itemStyle:{color:C[3]}},
    {name:'Apprenticeship',      value:2,  itemStyle:{color:C[4]}},
  ];
  const c4 = mk('d-contract');
  if (c4) c4.setOption({...B(),
    tooltip: {trigger:'item', ...B().tooltip, formatter:'{b}: {c}% ({d}%)'},
    legend: {...leg(), orient:'vertical', right:8, top:'middle', textStyle:{fontSize:10,color:v('--fg-muted')}},
    series:[{
      type:'pie', radius:['42%','68%'], center:['38%','50%'],
      data: CONTRACTS, label:{show:false}, emphasis:{scale:true, scaleSize:6},
    }],
  });

  // d5 — Seniority Required (stacked bar by quarter)
  const SEN_LEVELS  = ['Entry Level','Mid-level','Senior','Management'];
  const SEN_DATA = {
    'Entry Level': [35,34,32,30,28,27,26,25,24,23,22,21,20,19],
    'Mid-level':   [42,42,43,44,45,45,46,46,47,47,48,48,49,50],
    'Senior':      [18,19,20,21,22,23,23,24,24,25,25,26,26,27],
    'Management':  [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4],
  };
  const SEN_COLORS = [C[1],C[0],C[2],C[3]];
  const c5 = mk('d-seniority');
  if (c5) c5.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', axisPointer:{type:'shadow'}, ...B().tooltip},
    xAxis: xCat(QTR22, {interval:3}),
    yAxis: yVal('Share of postings (%)'),
    series: SEN_LEVELS.map((l,i) => ({
      name:l, type:'bar', stack:'total', data:SEN_DATA[l], barMaxWidth:32,
      itemStyle:{color:SEN_COLORS[i]},
      label:{show:i===1, position:'inside', fontSize:9, color:'#fff', formatter:p => p.value+'%'},
    })),
  });

  // d6 — Posting Duration Histogram
  const DUR_BUCKETS = ['< 7 days','7–14 days','14–21 days','21–30 days','30–60 days','60+ days'];
  const DUR_PCT     = [8, 22, 28, 25, 12, 5];
  const c6 = mk('d-duration');
  if (c6) c6.setOption({...B(),
    tooltip: {trigger:'axis', ...B().tooltip, formatter: p => `${p[0].name}<br>${p[0].value}% of postings`},
    xAxis: xCat(DUR_BUCKETS),
    yAxis: yVal('Share (%)'),
    series:[{
      type:'bar', data: DUR_PCT.map((val,i) => ({value:val, itemStyle:{color:i<=2 ? C[0] : i===3 ? C[1] : C[2]}})),
      barMaxWidth:48,
      label:{show:true, position:'top', formatter:'{c}%', fontSize:9.5, color:v('--fg-muted')},
    }],
  });
};

// ════════════════════════════════════════════════════════ SUPPLY (LFS) PANEL

RENDERERS.supply = function () {

  // s1 — Age-Gender Pyramid (Greece 2024, employed thousands)
  const AGE_GROUPS = ['15–24','25–34','35–44','45–54','55–64','65+'];
  const MALE_EMP   = [125, 285, 340, 320, 245, 62];
  const FEM_EMP    = [ 92, 248, 298, 278, 188, 35];
  const c1 = mk('s-pyramid');
  if (c1) c1.setOption({...B(),
    legend: leg({data:['Male','Female']}),
    grid: {...B().grid, left:20},
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => `${p[0].axisValue}<br>Male: ${Math.abs(p[0].value)}k<br>Female: ${p[1].value}k`},
    xAxis: {type:'value', axisLabel:{formatter: v => Math.abs(v)+'k', fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:AGE_GROUPS, axisLine:{lineStyle:{color:v('--border')}}, axisLabel:{fontSize:10}},
    series:[
      {name:'Male',   type:'bar', data:MALE_EMP.map(d => -d), barMaxWidth:18, itemStyle:{color:C[0]}, label:{show:false}},
      {name:'Female', type:'bar', data:FEM_EMP,               barMaxWidth:18, itemStyle:{color:'#f781b2'}},
    ],
  });

  // s2 — LFP Rate by Gender (Greece 1995–2025)
  const LFP_YRS  = ['1995','1998','2001','2004','2007','2010','2013','2016','2019','2022','2025'];
  const LFP_MALE = [77.2,76.8,76.5,75.2,74.8,72.5,69.8,68.2,67.5,65.8,67.4];
  const LFP_FEM  = [41.8,43.2,45.2,47.8,49.8,55.2,56.5,56.8,57.8,57.2,59.4];
  const c2 = mk('s-lfp');
  if (c2) c2.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: xCat(LFP_YRS),
    yAxis: yVal('LFP Rate (%)', {formatter: v => v+'%'}),
    series:[
      {name:'Male',   type:'line', data:LFP_MALE, smooth:true, lineStyle:{width:2.5,color:C[0]}, itemStyle:{color:C[0]}, showSymbol:false},
      {name:'Female', type:'line', data:LFP_FEM,  smooth:true, lineStyle:{width:2.5,color:'#f781b2'}, itemStyle:{color:'#f781b2'}, showSymbol:false,
        areaStyle:{color:'rgba(247,129,178,0.08)'}},
    ],
  });

  // s3 — Employment by Education Level (Greece 2010–2024, stacked %)
  const EDU_YRS = ['2010','2012','2014','2016','2018','2020','2022','2024'];
  const EDU_DATA = {
    'Low (ISCED 0–2)':    [42, 40, 37, 34, 31, 30, 26, 23],
    'Medium (ISCED 3–4)': [38, 38, 37, 37, 37, 37, 38, 38],
    'High (ISCED 5–8)':   [20, 22, 26, 29, 32, 33, 36, 39],
  };
  const c3 = mk('s-edu');
  if (c3) c3.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', axisPointer:{type:'shadow'}, ...B().tooltip},
    xAxis: xCat(EDU_YRS),
    yAxis: yVal('Share of employed (%)'),
    series: Object.entries(EDU_DATA).map(([name,data],i) => ({
      name, type:'bar', stack:'total', data, barMaxWidth:36,
      itemStyle:{color:[C[4],C[1],C[0]][i]},
    })),
  });

  // s4 — Unemployment Duration (Greece 2024)
  const DUR_CATS = ['< 1 month','1–3 months','3–6 months','6–12 months','1–2 years','2+ years'];
  const DUR_VALS = [8, 15, 18, 22, 16, 21];
  const c4 = mk('s-unemp-dur');
  if (c4) c4.setOption({...B(),
    tooltip: {trigger:'axis', ...B().tooltip, formatter: p => `${p[0].name}: ${p[0].value}%`},
    xAxis: xCat(DUR_CATS),
    yAxis: yVal('Share of unemployed (%)'),
    series:[{
      type:'bar', data: DUR_VALS.map((val,i) => ({value:val, itemStyle:{color: i < 3 ? C[1] : i < 5 ? C[2] : C[4]}})),
      barMaxWidth:42,
      label:{show:true, position:'top', formatter:'{c}%', fontSize:9.5, color:v('--fg-muted')},
      markLine:{data:[{type:'average', label:{color:v('--warn'), fontSize:9}, lineStyle:{color:v('--warn'),type:'dashed'}}]},
    }],
  });

  // s5 — Employment by Sector (donut, Greece Q2 2025)
  const EMP_SECTORS = [
    {name:'Services',     value:73, itemStyle:{color:C[0]}},
    {name:'Industry',     value:14, itemStyle:{color:C[2]}},
    {name:'Agriculture',  value:7,  itemStyle:{color:C[1]}},
    {name:'Construction', value:6,  itemStyle:{color:C[3]}},
  ];
  const c5 = mk('s-sector');
  if (c5) c5.setOption({...B(),
    tooltip: {trigger:'item', ...B().tooltip, formatter:'{b}: {c}%'},
    legend: {...leg(), orient:'vertical', right:8, top:'middle', textStyle:{fontSize:10,color:v('--fg-muted')}},
    series:[{
      type:'pie', radius:['42%','68%'], center:['38%','50%'],
      data:EMP_SECTORS, label:{show:false}, emphasis:{scale:true,scaleSize:6},
    }],
  });

  // s6 — Inactivity Reasons (horizontal bar, Greece 2024, % of inactive)
  const INACT_REASONS = ['Student/education','Care duties','Disability/illness','Early retirement','Discouraged','Other'];
  const INACT_MALE    = [30, 8, 22, 18, 10, 12];
  const INACT_FEM     = [25, 38, 14,  8,  5, 10];
  const c6 = mk('s-inactivity');
  if (c6) c6.setOption({...B(),
    legend: leg({data:['Male','Female']}),
    grid: {...B().grid, left:20},
    tooltip: {trigger:'axis', ...B().tooltip},
    xAxis: {type:'value', max:45, axisLabel:{formatter:'{value}%',fontSize:9}, axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:[...INACT_REASONS].reverse(), axisLabel:{fontSize:9.5}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[
      {name:'Male',   type:'bar', data:[...INACT_MALE].reverse(), barMaxWidth:12, itemStyle:{color:C[0]}},
      {name:'Female', type:'bar', data:[...INACT_FEM].reverse(),  barMaxWidth:12, itemStyle:{color:'#f781b2'}},
    ],
  });
};

// ════════════════════════════════════════════════════════ COMBINED PANEL

RENDERERS.combined = function () {

  // co1 — Beveridge Curve (Greece 2010–2025, quarterly scatter with year labels)
  const BEV_PTS = [
    {yr:'2010', u:12.7, v:0.9},{yr:'2011',u:17.9,v:0.7},{yr:'2012',u:24.5,v:0.5},
    {yr:'2013', u:27.5, v:0.4},{yr:'2014',u:26.5,v:0.4},{yr:'2015',u:24.9,v:0.5},
    {yr:'2016', u:23.6, v:0.6},{yr:'2017',u:21.5,v:0.7},{yr:'2018',u:19.3,v:0.8},
    {yr:'2019', u:17.3, v:0.9},{yr:'2020',u:16.3,v:0.8},{yr:'2021',u:14.7,v:1.1},
    {yr:'2022', u:12.4, v:1.4},{yr:'2023',u:11.1,v:1.6},{yr:'2024',u:10.5,v:1.7},
    {yr:'2025', u:10.2, v:1.8},
  ];
  const c1 = mk('c-beveridge');
  if (c1) c1.setOption({...B(),
    tooltip: {...B().tooltip, formatter: p => `${p.data.yr}<br>Unemployment: ${p.data.u}%<br>Vacancy rate: ${p.data.v}%`},
    grid: {...B().grid, bottom:30},
    xAxis: {type:'value', name:'Unemployment rate (%)', nameLocation:'middle', nameGap:22, nameTextStyle:{color:v('--fg-muted'),fontSize:10},
      min:8, max:30, axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'value', name:'Vacancy rate (%)', nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      min:0.3, max:2.2, axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    series:[{
      type:'scatter', data:BEV_PTS.map(p => ({...p, value:[p.u, p.v]})),
      symbolSize:8, itemStyle:{color:C[0]},
      label:{show:true, formatter:p=>p.data.yr, fontSize:8.5, color:v('--fg-muted'), position:'top'},
    },{
      type:'line', data:BEV_PTS.map(p=>[p.u,p.v]),
      lineStyle:{color:v('--fg-muted'),width:1,type:'dashed'}, symbol:'none', tooltip:{show:false},
    }],
  });

  // co2 — Labor Market Tightness by occupation (V/U ratio)
  const TGT_NAMES = OCC18.map(o => o.name);
  const TIGHTNESS = OCC18.map(o => {
    const base = o.gap < 0 ? 2.5 - (o.gap / -34) * 2.0 : 0.3 + (8 / o.gap) * 0.2;
    return +Math.max(0.1, Math.min(4, base)).toFixed(2);
  });
  const sorted = TGT_NAMES.map((n,i)=>({n, t:TIGHTNESS[i]})).sort((a,b)=>b.t-a.t);
  const c2 = mk('c-tightness');
  if (c2) c2.setOption({...B(),
    grid: {...B().grid, left:30, bottom:10},
    tooltip: {trigger:'axis', ...B().tooltip, formatter: p => `${p[0].name}<br>Tightness (V/U): ${p[0].value}`},
    xAxis: {type:'value', name:'Vacancy/Unemployment ratio', nameLocation:'middle', nameGap:20, nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}},
      markLine:{data:[{xAxis:1,label:{formatter:'Balanced',color:v('--warn'),fontSize:9},lineStyle:{color:v('--warn'),type:'dashed'}}]}},
    yAxis: {type:'category', data:sorted.map(d=>d.n), axisLabel:{fontSize:8.5}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[{
      type:'bar', data:sorted.map(d=>({value:d.t, itemStyle:{color:d.t>1?C[0]:d.t>0.5?C[2]:C[4]}})),
      barMaxWidth:14, label:{show:true, position:'right', formatter:'{c}', fontSize:9, color:v('--fg-muted')},
    }],
  });

  // co3 — OJA Postings vs Active Workforce (dual axis)
  const DUAL_YRS  = ['2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  const OJA_POSTS = [28,  32,  38,  45,  52,  44,  58,  72,  85,  98, 112]; // thousands, Greece
  const WORKFORCE = [3.82,3.89,3.95,4.02,4.08,3.95,4.05,4.15,4.22,4.28,4.35]; // millions
  const c3 = mk('c-dual');
  if (c3) c3.setOption({...B(),
    legend: leg(),
    tooltip: {trigger:'axis', ...B().tooltip},
    grid: {...B().grid, right:55},
    xAxis: xCat(DUAL_YRS),
    yAxis: [
      {type:'value', name:'OJA Postings (000s)', nameTextStyle:{color:C[0],fontSize:9}, axisLabel:{fontSize:9,color:C[0]}, axisLine:{lineStyle:{color:C[0]}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
      {type:'value', name:'Workforce (M)', nameTextStyle:{color:C[1],fontSize:9}, axisLabel:{fontSize:9,color:C[1]}, axisLine:{lineStyle:{color:C[1]}}, splitLine:{show:false}},
    ],
    series:[
      {name:'OJA Postings',    type:'bar',  data:OJA_POSTS, yAxisIndex:0, barMaxWidth:20, itemStyle:{color:C[0],opacity:0.8}},
      {name:'Active Workforce',type:'line', data:WORKFORCE,  yAxisIndex:1, smooth:true, lineStyle:{width:2.5,color:C[1]}, itemStyle:{color:C[1]}, showSymbol:false},
    ],
  });

  // co4 — Skills Gap Ranking (diverging bar: OJA demand - LFS supply)
  const GAP_SKILLS = ['LLMs / GenAI','Cloud Computing','Python','Deep Learning','Data Engineering',
    'NLP','Docker','Statistics','ML Ops','JavaScript','SQL','Project Mgmt','Excel','MS Office','Communication'];
  const OJA_D  = [48,62,89,52,38,42,58,65,32,55,72,58,52,78,85];
  const LFS_S  = [18,35,62,28,18,25,38,48,15,42,62,55,78,85,80];
  const GAPS   = OJA_D.map((d,i) => d - LFS_S[i]); // negative = shortage, positive = surplus
  const sortedGap = GAP_SKILLS.map((s,i)=>({s,g:GAPS[i]})).sort((a,b)=>a.g-b.g);
  const c4 = mk('c-skillgap');
  if (c4) c4.setOption({...B(),
    grid: {...B().grid, left:25},
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => `${p[0].name}<br>Gap: ${p[0].value > 0 ? '+' : ''}${p[0].value}pp (demand - supply)`},
    xAxis: {type:'value', name:'← Supply surplus  |  Demand shortage →', nameLocation:'middle', nameGap:22,
      nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLabel:{formatter: val => (val > 0 ? '+' : '') + val + 'pp', fontSize:9},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
    yAxis: {type:'category', data:sortedGap.map(d=>d.s), axisLabel:{fontSize:9}, axisLine:{lineStyle:{color:v('--border')}}},
    series:[{
      type:'bar', data:sortedGap.map(d => ({
        value:d.g, itemStyle:{color:d.g<0?C[4]:C[1], borderRadius:d.g<0?[3,0,0,3]:[0,3,3,0]},
      })),
      barMaxWidth:14,
      label:{show:true, position: p => p.data.value < 0 ? 'insideLeft' : 'insideRight',
        formatter: p => (p.value > 0 ? '+' : '') + p.value + 'pp', fontSize:9, color:'#fff'},
    }],
  });

  // co5 — Wage Convergence Scatter (OJA posted vs LFS reported salary)
  const WAGE_OJA = OCC18.map(o => o.wage * (0.85 + o.grow * 0.003));
  const WAGE_LFS = OCC18.map(o => o.wage);
  const c5 = mk('c-wage-conv');
  if (c5) {
    const mn = Math.min(...WAGE_LFS, ...WAGE_OJA) - 2;
    const mx = Math.max(...WAGE_LFS, ...WAGE_OJA) + 2;
    c5.setOption({...B(),
      tooltip: {...B().tooltip, formatter: p => p.seriesIndex === 0
        ? `<b>${OCC18[p.dataIndex].name}</b><br>OJA posted: €${p.data[0].toFixed(0)}k<br>LFS reported: €${p.data[1].toFixed(0)}k`
        : undefined},
      grid: {...B().grid, bottom:30},
      xAxis: {type:'value', name:'OJA posted salary (€k)', nameLocation:'middle', nameGap:22,
        nameTextStyle:{color:v('--fg-muted'),fontSize:10}, min:mn, max:mx,
        axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
      yAxis: {type:'value', name:'LFS reported wage (€k)', nameTextStyle:{color:v('--fg-muted'),fontSize:9},
        min:mn, max:mx, axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3')}}},
      series:[
        {type:'scatter', data:OCC18.map((o,i)=>[WAGE_OJA[i], WAGE_LFS[i]]),
          symbolSize:8, itemStyle:{color:C[0], opacity:0.85},
          label:{show:true, formatter:p=>OCC18[p.dataIndex].name.split(' ')[0], fontSize:8, color:v('--fg-muted'), position:'top'}},
        {type:'line', data:[[mn,mn],[mx,mx]], lineStyle:{color:v('--fg-muted'),type:'dashed',width:1}, symbol:'none',
          tooltip:{show:false}, name:'Parity'},
      ],
    });
  }
};

// ════════════════════════════════════════════════════════ GEO PANEL

RENDERERS.geo = function () {

  // g1 — Job Posting Intensity by Country (bar, normalised per 1000 LF, 12 countries)
  const GEO_CTRY   = ['Denmark','Slovenia','Greece','Spain','Italy','N. Macedonia','Serbia','Bosnia','Montenegro','Albania','Kosovo','Cyprus'];
  const GEO_ISO    = ['DK','SI','GR','ES','IT','MK','RS','BA','ME','AL','XK','CY'];
  const GEO_RATE   = [8.5, 4.8, 5.2, 4.1, 3.8, 3.5, 3.2, 2.8, 2.8, 2.2, 2.1, 1.8];
  const GEO_EMP_R  = [80.2,76.5,66.9,68.1,61.4,65.1,65.1,56.8,66.2,56.5,50.2,74.8]; // employment rate %
  const GEO_OJA_K  = [72.8,18.5,45.2,156.8,182.5,12.5,28.4,15.2,8.2,6.8,5.8,4.2];   // raw postings (000s)
  const sortedGeo = GEO_CTRY.map((c,i)=>({c,r:GEO_RATE[i],e:GEO_EMP_R[i],raw:GEO_OJA_K[i]}))
    .sort((a,b)=>b.r-a.r);
  const c1 = mk('g-country');
  if (c1) c1.setOption({...B(),
    tooltip: {trigger:'axis', ...B().tooltip,
      formatter: p => `${p[0].name}<br>Rate: <b>${p[0].value}</b>/1 000 LF<br>Employment rate: ${sortedGeo[p[0].dataIndex].e}%<br>Raw postings: ${sortedGeo[p[0].dataIndex].raw}k`},
    xAxis: {type:'category', data:sortedGeo.map(d=>d.c), axisLabel:{fontSize:9,interval:0,rotate:30},
      axisLine:{lineStyle:{color:v('--border')}}, axisTick:{show:false}},
    yAxis: yVal('OJA postings per 1 000 labour force'),
    grid: {...B().grid, bottom:55},
    series:[{
      type:'bar', data:sortedGeo.map((d,i) => ({
        value:d.r,
        itemStyle:{color: d.r >= 5 ? C[0] : d.r >= 3 ? C[1] : C[2]},
      })),
      barMaxWidth:32,
      label:{show:true, position:'top', formatter:'{c}', fontSize:9, color:v('--fg-muted')},
    }],
    markLine:{data:[{type:'average', label:{fontSize:9, color:v('--warn')}, lineStyle:{color:v('--warn'),type:'dashed'}}]},
  });

  // g2 — Pseudo-Map Scatter (lon/lat ≈ positions, bubble = OJA intensity, color = employment rate)
  const GEO_COORDS = {
    'Denmark':     [10.2, 56.3], 'Slovenia':    [14.9, 46.1], 'Greece':      [22.9, 39.1],
    'Spain':       [-3.7, 40.4], 'Italy':       [12.5, 42.5], 'N. Macedonia':[21.7, 41.6],
    'Serbia':      [21.0, 44.0], 'Bosnia':      [17.7, 44.0], 'Montenegro':  [19.3, 42.8],
    'Albania':     [20.2, 41.3], 'Kosovo':      [21.2, 42.6], 'Cyprus':      [33.4, 35.1],
  };
  const GEO_SCATTER = GEO_CTRY.map((c,i) => {
    const [lon, lat] = GEO_COORDS[c] || [15, 45];
    return {name:c, value:[lon, lat, GEO_RATE[i], GEO_EMP_R[i]]};
  });
  const c2 = mk('g-map');
  if (c2) c2.setOption({...B(),
    backgroundColor: 'transparent',
    tooltip: {...B().tooltip,
      formatter: p => `<b>${p.data.name}</b><br>OJA intensity: ${p.data.value[2]}/1k LF<br>Employment rate: ${p.data.value[3]}%`},
    xAxis: {type:'value', min:-12, max:40, name:'Longitude', nameLocation:'middle', nameGap:18,
      nameTextStyle:{color:v('--fg-muted'),fontSize:9}, axisLabel:{formatter:v=>v+'°', fontSize:8},
      axisLine:{lineStyle:{color:v('--border')}}, splitLine:{lineStyle:{color:v('--bg-3'),opacity:0.5}}},
    yAxis: {type:'value', min:33, max:60, name:'Latitude', nameTextStyle:{color:v('--fg-muted'),fontSize:9},
      axisLabel:{formatter:v=>v+'°', fontSize:8}, axisLine:{lineStyle:{color:v('--border')}},
      splitLine:{lineStyle:{color:v('--bg-3'),opacity:0.5}}},
    visualMap: {show:true, min:50, max:82, dimension:3, orient:'horizontal', bottom:4, left:'center',
      text:['High Employment','Low'], textStyle:{color:v('--fg-muted'),fontSize:9},
      inRange:{color:['#f85149','#d29922','#56d364']}},
    series:[{
      type:'scatter', data:GEO_SCATTER, coordinateSystem:'cartesian2d',
      symbolSize: d => Math.sqrt(d[2]) * 16,
      label:{show:true, formatter:p=>p.data.name, fontSize:8.5, color:v('--fg'), position:'right'},
      emphasis:{scale:true, scaleSize:6},
    }],
  });
};
