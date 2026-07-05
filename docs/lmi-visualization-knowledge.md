# Labor Market Intelligence: Supply/Demand Data and Visualization — Expert Reference

**Compiled for the Labor Intelligence Virtual Lab (LIVLAB)**
**Date: 2026-06-05 | Scope: EU, Mediterranean, Western Balkans**

---

## Table of Contents

1. [Supply vs Demand: The Fundamental LMI Dichotomy](#1-supply-vs-demand-the-fundamental-lmi-dichotomy)
2. [Stock vs Flow: The Structural Distinction](#2-stock-vs-flow-the-structural-distinction)
3. [Real-Time vs Lagged Data](#3-real-time-vs-lagged-data)
4. [The Matching Function and Beveridge Curve](#4-the-matching-function-and-beveridge-curve)
5. [Key Quality Issues and Coverage Biases](#5-key-quality-issues-and-coverage-biases)
6. [Complete Visualization Taxonomy for LMI](#6-complete-visualization-taxonomy-for-lmi)
7. [Best Practices from Real LMO Portals](#7-best-practices-from-real-lmo-portals)
8. [Mediterranean and Balkan Specific Visualizations](#8-mediterranean-and-balkan-specific-visualizations)
9. [Technical Implementation Stack](#9-technical-implementation-stack)
10. [Cross-Cutting Insights and Hidden Connections](#10-cross-cutting-insights-and-hidden-connections)

---

## 1. Supply vs Demand: The Fundamental LMI Dichotomy

### 1.1 What is Labor Market DEMAND Data?

Labor demand data captures what employers want: the quantity of labor (number of positions), type of labor (occupations, skills), and conditions offered (wages, hours, location). It is inherently a **forward-looking signal** — a vacancy or job posting represents an unsatisfied demand, not yet filled.

**Primary demand data sources:**

**Online Job Advertisements (OJA)**
The most granular and highest-frequency demand signal available today. OJA scraping extracts structured information from job boards, company websites, and aggregators. Key characteristics:
- Frequency: daily/weekly refresh
- Coverage: biased toward formal, large-firm, white-collar employment
- Skill content: machine-readable when parsed with NLP (ESCO tagging, skill extraction)
- Geographic granularity: city/NUTS3 level possible
- Bias: over-represents IT, professional services, finance; under-represents hospitality, agriculture, care work
- Duplication problem: same vacancy posted across 5 portals = 5 records; deduplication is non-trivial
- Key players: Lightcast (formerly Burning Glass + EMSI), Cedefop Skills-OVATE (EU-wide), INDEED, LinkedIn Jobs, national portals (Kariera.gr, Infostud.rs, JobNet.dk)

**Vacancy Surveys**
Employer-reported, statistically designed surveys measuring unfilled positions at reference date.
- EU: Eurostat Job Vacancy Statistics (JVS) — quarterly, NACE sector breakdown, NUTS2, harmonized across EU27
- UK: ONS Vacancy Survey
- US: BLS JOLTS — gold standard; ~21,000 establishments/month since December 2000; measures not just vacancies but hires, quits, layoffs
- Greece: DYPA/Ergani vacancy register — administrative, covers registered employers; strong on flows (registrations/deregistrations of positions)
- Advantage over OJA: statistically representative, no duplication
- Disadvantage: 6–10 week publication lag, less occupational/skill granularity

**Administrative Registers**
Employment registers maintained by labor agencies and social insurance bodies:
- DYPA/Ergani (Greece): real-time flows of employment contracts — hires, terminations, type of contract. Extremely valuable for measuring labor market dynamics; includes sex, age, NACE sector, NUTS3 prefecture
- Bundesagentur für Arbeit (Germany): real-time employment statistics from social insurance contributions
- INSEE DARES (France): monthly employment declarations (DPAE)
- Key advantage: administrative completeness for formal sector; no survey response issues
- Key limitation: informal economy is invisible; self-employed often excluded

**Employer Surveys (Beyond Vacancy Surveys)**
- ManpowerGroup Talent Shortage Survey: annual, covers hiring difficulty by occupation; available for Greece, 40+ countries
- EIB Investment Survey (EIBIS): quarterly, EU, includes labor shortage as investment barrier
- IAB Employer Survey (Germany): detailed employer-side data including wage offers
- Cedefop European Employer Survey: skills needs, training provision

**LinkedIn Economic Graph**
Real-time signal from 900M+ member platform:
- Hiring rate index: hires as share of total members, smoothed, by country/industry/seniority
- Skills demand: aggregate skills from job postings on platform
- Internal mobility: share of hires from within same company
- Bias: strong toward professional/white-collar occupations; under-covers blue-collar, agriculture, care; low penetration in Western Balkans and southern Mediterranean
- Key insight: LinkedIn penetration in Greece ~35% of professional workforce; Serbia ~25%; Montenegro <15% — data is systematically thinner for the lab's priority countries

**Lightcast / Burning Glass**
Commercial platform aggregating OJA from 40,000+ sources:
- Coverage: 300M+ job postings historical; real-time feed
- Proprietary occupation taxonomy (Lightcast Open Skills Ontology — 32,000+ skills)
- Mapped to O*NET, ESCO, SOC, NAICS
- Unique features: salary benchmarking from postings, posting duration as proxy for fill time, employer-level granularity
- European coverage: strong UK, Germany, France; weaker for Balkans, Greece, emerging EU
- Access: subscription only; academic licenses available but expensive

---

### 1.2 What is Labor Market SUPPLY Data?

Labor supply data captures who is available to work: the quantity of workers (employed, unemployed, inactive), their characteristics (skills, education, experience, age, sex), and their reservation wages and preferences.

**Labour Force Surveys (LFS)**
The backbone of official labor supply measurement.

- **EU-LFS**: Harmonized quarterly survey across EU27 + EFTA. Covers employment status, sector (NACE Rev.2), occupation (ISCO-08 at 2-digit quarterly, 4-digit annually), education (ISCED 2011), hours, earnings. Microdata available via Eurostat (requires researcher agreement). Sample: ~700,000 individuals per quarter EU-wide.
- **ELSTAT LFS Greece**: Quarterly (SJO01, 2001–2026) and Annual (SJO03, 1981–2025). Most continuous Greek labor market series. Publishes NUTS2 regional breakdowns (13 regions). Micro-data available. Key limitation: sample size limits NUTS3 precision.
- **BLS Current Population Survey (CPS)**: monthly, 60,000 households, gold standard for US supply measurement
- **ILOSTAT**: global harmonized estimates using ILO models where national surveys unavailable; key for Balkans (North Macedonia SSO, Kosovo ASK, BHAS Bosnia)
- Lag: 6–8 weeks after reference quarter for preliminary estimates; full dataset 3–4 months

**Administrative Registries (Supply Side)**
- Unemployment registries: DYPA registered unemployed (Greece), NSZ (Serbia), ZZZCG (Montenegro), NAES (Albania). Coverage: only those who register; discouraged workers, students, and informal workers absent. But very high frequency (weekly/monthly) and granular by NUTS3.
- Social insurance records: pension fund databases contain every employed person contributing to social insurance — effectively a census of formal employment. Greece: EFKA (Ηλεκτρονικός Εθνικός Φορέας Κοινωνικής Ασφάλισης). Spain: SEPE (Servicio Público de Empleo Estatal) registration data.
- Education output data: graduates by field of study from Ministry of Education records. In Greece: Ministry of Education graduate statistics; Eurostat UOE (Education and Training) database for harmonized EU comparison. Critical for supply-side forecasting: today's graduating cohort enters the market in 3–5 years.

**CV / Resume Databases**
- LinkedIn profiles (not fully accessible): skills, experience, location, salary expectations in aggregate
- National job portal CV sections: Kariera.gr (Greece), Infostud.rs (Serbia) — not publicly accessible
- CEDEFOP European Skills and Jobs Survey (ESJS2): 50,000+ workers reporting skills, mismatches, training needs. Direct supply-side skill measurement.
- Key insight: CV databases reveal the supply-side skill vocabulary, which systematically differs from job posting vocabulary — a critical mismatch that requires ontology mapping (ESCO as bridge)

**Migration Statistics**
Critical for Greece and Western Balkans where labor markets are strongly shaped by in/out migration:
- Eurostat migration statistics: annual flows by country of origin/destination; NUTS2 regional breakdowns limited
- ILOSTAT labor migration estimates
- Greece-specific: large emigration wave 2010–2016 (brain drain); net positive migration since 2017; significant informal migrant agricultural labor (Epirus, Thessaly)
- Western Balkans: persistent emigration to Germany, Austria, Switzerland; measurable through Bundesagentur work permit statistics
- Brain drain metrics: share of tertiary graduates emigrating — Greece among EU's highest (25–35% of STEM graduates, 2010–2022)

---

### 1.3 Using Supply and Demand Together: The LMI Integration Challenge

The power of LMI comes from simultaneous analysis of both dimensions. Key integration frameworks:

**Skills Gap Analysis**
Core formula: **Gap = Demand(skill_s, occupation_o, region_r, time_t) - Supply(skill_s, qualification_q, region_r, time_t)**

Problems:
- Demand measured in job posting counts; supply measured in person-counts — non-commensurate units
- Skills in job postings use employer vocabulary; skills in CVs/LFS use worker vocabulary; ESCO bridges them imperfectly
- Geographic units rarely match: OJA often has city-level; LFS only NUTS2
- Time units differ: OJA is stock at point in time; LFS is reference week employment

**Occupational Balance**
Cedefop Skills Forecast approach: project both demand (employment by occupation from macro-economic model) and supply (education pipeline + demographic flows) through 2035, derive net surplus/shortage per occupation.

**Wage Signal Integration**
When demand > supply, wages should rise (in competitive markets). When wages are rising but employment is not growing, it may signal bottleneck supply rather than demand growth. Tracking wage and employment jointly disambiguates.

**Gaps When You Only Have One Dimension:**
- Only demand (OJA): Cannot assess whether stated skill requirements are realistic vs. aspirational ("degree inflation"). Cannot measure discouraged workers. Cannot assess whether vacancies are filled by internal mobility (not visible in OJA).
- Only supply (LFS): Cannot see emerging new occupations/skills before they enter official taxonomies. Cannot measure unfilled demand. Cannot distinguish skill mismatches from simple unemployment.

---

## 2. Stock vs Flow: The Structural Distinction

This is one of the most important conceptual distinctions in LMI, consistently confused in public reporting.

### 2.1 Stocks

A **stock** is a quantity measured at a point in time. Like a water level — how much is there right now?

| Stock Variable | Definition | Source |
|---|---|---|
| Total employment | Persons employed in reference week | LFS |
| Unemployment level | Persons without work, available, seeking | LFS |
| Vacancy stock | Open positions at reference date | JVS, OJA |
| Working-age population | Persons aged 15–74 (EU definition) | Census, LFS |
| Registered unemployed | Persons registered at PES at date | Admin register |

### 2.2 Flows

A **flow** is a quantity measured over a period. Like water volume over time — how much moved?

| Flow Variable | Definition | Source |
|---|---|---|
| Hires | New employment relationships started in month | JOLTS, Ergani |
| Separations | Employment relationships ended in month | JOLTS, Ergani |
| Quits | Voluntary separations | JOLTS |
| Layoffs | Involuntary separations | JOLTS |
| Inflows to unemployment | New entries to unemployment | Admin registers |
| Outflows from unemployment | Exits from unemployment (to employment or inactivity) | Admin registers |
| Job creation | New positions in expanding/entering firms | Business register |
| Job destruction | Positions lost in contracting/exiting firms | Business register |

### 2.3 The Stock-Flow Relationship

**Key accounting identity:**
```
Employment(t) = Employment(t-1) + Hires(t) - Separations(t)
Unemployment(t) = Unemployment(t-1) + Inflows(t) - Outflows(t)
```

**Why this matters for visualization:**
- The unemployment RATE can be stable while FLOWS are massive (high-churn labor market) or minimal (low-churn)
- Greece 2013–2019: unemployment rate falling slowly while ELSTAT/Ergani showed high flows — many exited unemployment into inactivity, not employment
- Denmark "flexicurity" model: high flows (easy hiring/firing) + high stocks of inactive with generous benefits + aggressive activation. The JOLTS-equivalent for Denmark shows churn 2× Greek rate.
- **Implication for visualization**: always pair stock trends with flow indicators; a declining unemployment rate alone is misleading

### 2.4 Vacancy-Unemployment Dynamics

The **vacancy stock** (JVS/JOLTS) and the **unemployment stock** (LFS) are the two most important stocks for understanding labor market tightness. Their ratio (v/u ratio) is the primary tightness indicator.

- v/u > 1: more vacancies than unemployed persons — "tight" market, employer competition for workers
- v/u < 1: more unemployed than vacancies — "slack" market, worker competition for jobs
- Greece 2023: v/u ≈ 0.15 (very slack) but improving from 0.05 in 2013
- EU average 2023: v/u ≈ 0.4
- Germany/Netherlands 2022: v/u > 1 (genuine labor shortage)

---

## 3. Real-Time vs Lagged Data

### 3.1 Publication Lag Taxonomy

| Source | Measurement Lag | Publication Lag | Notes |
|---|---|---|---|
| OJA (Cedefop OVATE) | ~1 day | ~2 weeks | Aggregated weekly |
| OJA (Lightcast) | Real-time | Near real-time | Commercial feed |
| DYPA/Ergani Greece | Same day | 3–5 days | Administrative |
| Eurostat JVS | End of quarter | 6–8 weeks | Q4 2025 → Feb 2026 |
| Eurostat LFS flash | Reference month | 30 days | Unemployment rate only |
| EU-LFS microdata | Reference quarter | 3–4 months | Full dataset |
| ELSTAT LFS Greece quarterly | Reference quarter | 10–12 weeks | Regional breakdown |
| ELSTAT LFS Greece annual | Reference year | 6–8 months | Occupational detail |
| BLS JOLTS | Reference month | ~35 days | |
| Cedefop Skills Forecast | Multi-year compilation | Every 2–3 years | Through 2035 |
| ILOSTAT (Balkans) | Reference year | 6–18 months | Highly variable |

### 3.2 The Vintage Problem

The "vintage problem" is critical for dashboards: when you show "the latest data," you are actually showing data from different reference periods depending on the indicator. A dashboard showing unemployment rate (most recent = March 2026) alongside job vacancies (most recent = Q4 2025) is implicitly comparing different labor market states.

**Best practices:**
- Always display a "data as of [date]" note per indicator
- Flag when indicators use different reference periods
- Consider "nowcasting" approaches: bridge estimates using high-frequency OJA to project forward from lagged survey data
- Cedefop OVATE approach: explicitly labels each country's latest data vintage in tooltip

### 3.3 Real-Time Signals and Their Limitations

High-frequency OJA data creates the illusion of real-time LMI, but several distortions apply:
- **Seasonal patterns**: hospitality postings spike March–May; retail spikes October–November
- **Pandemic tail effects**: 2020–2022 posting patterns are outliers that contaminate trend models
- **Economic sentiment effects**: firms post more vacancies when confident about future, even before actual hiring need — vacancies are partly a forward-looking signal
- **The posting duration effect**: a hard-to-fill vacancy appears in OJA stock for weeks/months; easier positions disappear quickly. OJA stock therefore over-represents hard-to-fill roles.
- **Duplicate postings**: same vacancy across multiple portals inflates count. LIVLAB's deduplication requirement is critical.

---

## 4. The Matching Function and Beveridge Curve

### 4.1 The Matching Function

The matching function M(u,v) describes how unemployed workers (u) and vacancies (v) are matched into new employment relationships. The standard Cobb-Douglas form:

**M = A × u^α × v^(1-α)**

Where:
- M = matches per period (= hires)
- A = matching efficiency (the "technology" of the labor market: public employment services, job search platforms, geographic mobility)
- α, (1-α) = elasticities (typically 0.4–0.6 each empirically)

**Policy implications for visualization:**
- If A falls (matching efficiency declines), you see more vacancies AND more unemployment simultaneously — the classic "mismatch" signature
- Greece 2015–2019: both OJA demand and unemployment elevated — evidence of skills mismatch and geographic mismatch (vacancies in Attica, unemployed in Thessaly)
- DYPA (former OAED) activation programs aimed explicitly at raising A: job fairs, counseling, retraining

### 4.2 The Beveridge Curve

**Definition**: Scatter plot of vacancy rate (y-axis) vs. unemployment rate (x-axis) over time, with each point representing one time period.

**Economic interpretation**:
- Points in top-left: tight market (many vacancies, low unemployment) — boom
- Points in bottom-right: slack market (few vacancies, high unemployment) — recession
- Movement along the curve: business cycle fluctuations
- Outward shift of the entire curve: structural worsening (skills mismatch, geographic mismatch, reservation wage effects, PES inefficiency)
- Inward shift: structural improvement (better matching technology, ALMP effectiveness)

**Greek Beveridge Curve:**
The Greek labor market traced a dramatic path:
- 2007–2010: Upper left (pre-crisis, tight)
- 2010–2013: Sharp movement to lower-right (massive rise in unemployment, collapse of vacancies)
- 2013–2019: Slow return along an OUTWARD-SHIFTED curve — unemployment fell but vacancies remained low, suggesting structural damage
- 2019–2023: Improving, but the curve appears shifted outward versus pre-2010 — evidence of persistent skills mismatch

**Visualization implementation**: The Beveridge Curve is specifically addressed in Section 6p.

---

## 5. Key Quality Issues and Coverage Biases

### 5.1 OJA Coverage Bias

OJA systematically over-represents:
- Large firms (SMEs under-post online)
- White-collar/professional occupations
- Urban locations
- Formal employment
- English-language postings (in multilingual markets)
- Sectors with high internet penetration (IT, finance, professional services)

OJA systematically under-represents:
- Agriculture, forestry, fishing (informal hiring through word-of-mouth)
- Construction (informal, ethnic network hiring)
- Domestic services (household employment)
- Public sector (different recruitment channels)
- Care/social work (often through agencies)
- Balkans-specific: family businesses hiring relatives — never posted

**Consequence for LIVLAB**: For Greece's agricultural sector (16% of employment in some regions), Montenegro's tourism sector (informal seasonal hiring), and Albania's construction sector, OJA captures perhaps 10–20% of true vacancy stock. Multi-source combination is mandatory.

### 5.2 Occupational Coding Inconsistency

The central challenge in cross-source, cross-country LMI:
- ISCO-08 is the international standard but national variants differ (Greek ΣΤΕΠ, German KldB 2010, US SOC)
- Crosswalks between taxonomies are imperfect and often many-to-many
- ESCO v1.2 (the EU standard with 3,000 occupations and 13,800 skills) provides a bridge but requires NLP-based mapping from free-text job titles
- OJA job titles are free-text and vary enormously: "Junior Python Developer," "Python Coder," "Software Engineer II," "Backend Dev" all may map to ISCO 2512 (Software developer)
- Lightcast claims 95% coverage via their classification engine; academic studies suggest 70–80% precision at 4-digit ISCO level
- **For LIVLAB**: ESCOXLM-R (arXiv:2307.07055) achieves 87% accuracy on ESCO mapping — significantly better than rule-based approaches

### 5.3 Geographic Granularity Gaps

- EU-LFS provides NUTS2 breakdowns (13 regions for Greece); NUTS3 precision requires administrative data
- OJA often provides municipality but geocoding errors are common (city name ambiguity, postal code errors)
- Balkans: NUTS-equivalent NUTS3 data is sparse; Kosovo ASK and Montenegro MONSTAT publish national figures only
- Solution: spatial interpolation models, satellite-based economic proxies (nighttime light intensity as economic activity proxy)

### 5.4 Temporal Comparability

- ISCO-08 replaced ISCO-88 in most EU countries 2011–2014 — pre/post comparison requires recoding
- NACE Rev.2 replaced NACE Rev.1.1 in 2008 — sector composition analysis must handle break
- Greece LFS reference week definition changed 2011 — creates a structural break in the 1981–2025 series
- Minimum wage increases create visible kinks in wage distribution data (Greece minimum wage increases 2019, 2022, 2023, 2024)

---

## 6. Complete Visualization Taxonomy for LMI

### 6a. Time-Series / Trend Lines

**Definition**: Line chart with time on x-axis, continuous metric on y-axis. Each series = one tracked indicator over time.

**Data structure needed**:
```json
{
  "labels": ["2010Q1", "2010Q2", ..., "2026Q1"],
  "datasets": [
    {"label": "Unemployment Rate (%)", "data": [11.2, 12.1, ...]},
    {"label": "Youth Unemployment Rate (%)", "data": [28.4, 31.2, ...]}
  ]
}
```

**LMI questions answered**:
- How has unemployment trended over economic cycles?
- When did skill demand for X occupation peak?
- How does Greece's unemployment rate compare to EU average over 15 years?
- Did ALMP interventions (2017 training programs) shift the trajectory?

**Real portal examples**:
- Eurostat Statistics Explained: unemployment rate charts with recession shading (grey bars for NBER/Eurostat recession periods) — excellent practice
- ELSTAT SJO01 quarterly charts: basic but consistent; lack interactive filtering
- OECD.Stat: multi-series with customizable country selection

**Implementation (Chart.js v4)**:
```javascript
new Chart(ctx, {
  type: 'line',
  data: { labels, datasets },
  options: {
    plugins: {
      annotation: {
        annotations: {
          crisisBox: {
            type: 'box',
            xMin: '2010Q1', xMax: '2013Q4',
            backgroundColor: 'rgba(255,99,132,0.1)',
            label: { content: 'Debt Crisis', display: true }
          }
        }
      }
    },
    scales: { y: { title: { display: true, text: 'Rate (%)' } } }
  }
});
```

**Gotchas**:
- Always mark structural breaks in the series (ISCO change, definition change) with a vertical dashed line
- Use `tension: 0` for survey data (no interpolation of discrete quarterly observations)
- Recessions and policy events as shaded bands provide essential context
- Logarithmic y-axis for ratio data; linear for rate data
- Dual y-axes when combining vacancy rate (0–3%) with unemployment rate (5–30%) — scales incompatible

**Greek/EU use cases**:
- Greek unemployment 1981–2026 using ELSTAT annual SJO03 — a 44-year narrative of industrialization, EU accession, crisis, recovery
- DYPA monthly vacancy flows — show seasonality clearly (hospitality spring surge)
- Cedefop Skills Forecast: historical + projected employment through 2035 — use different line style (dashed) for forecast portion

---

### 6b. Area Charts / Stacked Area

**Definition**: Time-series with area between line and axis filled. Stacked variant fills multiple series cumulatively, showing composition.

**Data structure**: Same as time-series, with `fill: true` and stacking config.

**LMI questions answered**:
- How has the sectoral composition of employment changed (deindustrialization, service growth)?
- What is the share of youth vs adult unemployment over time?
- How do employment statuses (full-time, part-time, temporary) shift in economic cycles?

**Best examples**:
- Cedefop Skills Forecast portal: stacked area of employment by broad occupation group through 2035 — shows managers/professionals growing, craft/elementary shrinking
- BLS "Beyond the Numbers" visualizations: employment by industry stacked area 2000–present
- ONS UK labour market: stacked area of economic inactivity reasons (caring, studying, sick)

**Implementation (ECharts v5 — preferred for stacked area)**:
```javascript
option = {
  series: sectors.map(s => ({
    name: s.label,
    type: 'line',
    stack: 'employment',
    areaStyle: {},
    data: s.values
  })),
  // ECharts handles stacking natively with smooth animation
};
```

**Gotchas**:
- 100% stacked area (normalized) better for composition; absolute stacked better for total magnitude
- More than 7–8 series: use color carefully or group small sectors into "Other"
- Stream graph variant (smooth baseline): aesthetically appealing but harder to read exact values — reserve for editorial/exploration use
- Order matters: put stable large series at bottom; volatile small series at top

**Greek/EU use cases**:
- ELSTAT annual employment by sector 1981–2025: shows tourism/services growth, manufacturing decline, agricultural persistence
- EU-LFS employment by employment status (permanent/temporary/self-employed): shows growth of temporary contracts 2013–2019 in Greece
- Western Balkans: stacked area of formal vs informal employment share — requires ILO informal economy estimates

---

### 6c. Bar Charts — Vertical and Horizontal

**Definition**: Bars proportional in length to value. Vertical (column) for time-based or categorical sequences; horizontal for ranked comparisons of many categories.

**Data structure**:
```json
{
  "labels": ["Machine Learning", "SQL", "Python", "Communication", "Project Management"],
  "datasets": [{"label": "Job Postings Mentioning Skill", "data": [12400, 11200, 10800, 9300, 8700]}]
}
```

**LMI questions answered**:
- What are the top 20 most demanded skills in Greece Q1 2026?
- Which occupations have the most job postings?
- Which regions have the highest unemployment?

**Best examples**:
- LinkedIn Economic Graph monthly "top skills" reports: sorted horizontal bar with percentage change YoY
- BLS Occupational Outlook Handbook: projected employment by occupation, horizontal bar
- OECD Skills for Jobs: skill surplus/shortage horizontal bar — negative values indicate surplus, positive = shortage (a powerful display for policy)

**Implementation (Chart.js v4)**:
```javascript
new Chart(ctx, {
  type: 'bar',
  data: { labels: topSkills, datasets: [{ data: counts, indexAxis: 'y' }] },
  options: {
    indexAxis: 'y', // horizontal bar in Chart.js v4
    plugins: { tooltip: { callbacks: { label: ctx => `${ctx.raw.toLocaleString()} postings` } } }
  }
});
```

**Gotchas**:
- Always sort: descending for top-N, ascending for bottom-N
- Horizontal orientation when labels are long (skill names, occupation titles)
- Truncate labels at 30 chars with tooltip showing full text
- Start y-axis at 0 always for bar charts (unlike line charts)
- Color coding: use single color for single dimension; save multi-color for categorical distinction

**Greek/EU use cases**:
- Top 25 skills from Greek OJA portals (Kariera, Skywalker) — language skills (English, German) prominent
- EU country comparison: NEET rate by country (horizontal, sorted) — Greece and Italy consistently elevated
- Western Balkans: registered unemployed by prefecture/municipality — horizontal sorted bar

---

### 6d. Grouped Bar

**Definition**: Multiple bars per category position, side by side. Compares multiple series across same categorical axis.

**LMI questions answered**:
- How does male vs female employment compare by sector?
- How does skill demand compare across 3 countries for the same occupation?
- How has top-skill demand changed: 2022 vs 2024 vs 2026?

**Best examples**:
- Eurostat Gender Equality in the EU dashboard: grouped bars male/female employment rates by country
- OECD Skills Outlook: grouped bars education level × employment rate by country group
- Cedefop Skills-OVATE: year-on-year comparison of top demanded skills

**Gotchas**:
- Maximum 3–4 groups before visual clutter becomes severe
- Consider small multiples (faceted charts) instead when groups > 4
- Ensure adequate bar spacing within group vs between groups
- Colorblind-safe palette essential: never use red/green together; use blue/orange/teal (OkabeIto palette)

**Greek/EU use cases**:
- Gender employment gap in Greece by sector — ELSTAT LFS data: particularly stark in construction (95% male) vs health/social work (80% female)
- Youth vs adult unemployment by country: Greece, Spain, Italy consistently show 2–3× youth premium
- Formal/informal employment by sector for Balkans (ILO estimates): agriculture is majority informal in Albania/North Macedonia

---

### 6e. Treemap

**Definition**: Hierarchical rectangles where area encodes one quantitative dimension (usually size) and color encodes a second dimension (usually growth rate or intensity). Nests categories within categories.

**Data structure**: Hierarchical — parent/child nodes with size values at leaf level.

**LMI questions answered**:
- What is the employment share of each sector, with sub-sectors visible?
- How large is each ISCO major group relative to others?
- Which skills cluster together in the ESCO taxonomy, proportional to demand?

**Best examples**:
- Lightcast/EMSI: treemap of skill groups by job postings — skills clustered by category, colored by growth
- Cedefop: occupation employment treemap EU-27
- LinkedIn Economic Graph: "fastest growing skills" treemap (though they favor bubble charts)

**Implementation (D3 v7 — best for treemaps)**:
```javascript
const treemap = d3.treemap().size([width, height]).padding(2);
const root = d3.hierarchy(data).sum(d => d.employment).sort((a,b) => b.value - a.value);
treemap(root);
// Enter pattern for SVG rects...
```

**ECharts v5 alternative**: `type: 'treemap'` — excellent built-in with drill-down.

**Gotchas**:
- Treemaps fail for > 50 nodes at same level — group small items
- Squarified algorithm (D3 default) minimizes aspect ratio of cells — use it
- Drill-down navigation essential for taxonomies (ISCO → ISCO2 → ISCO3 → ISCO4)
- Label readability: only show labels for cells > threshold size
- Avoid using treemaps for comparisons across time — they are snapshot visualizations

**Greek/EU use cases**:
- ESCO occupation tree for Greek labor market: 10 ISCO major groups → ISCO2 → ISCO3, sized by employment, colored by vacancy rate
- Blue economy skills treemap (Growth4Blue project): maritime skills taxonomy
- Vocational skills for TRAIN4BLUE: VET qualification treemap sized by enrolled students

---

### 6f. Sunburst / Radial Hierarchy

**Definition**: Concentric ring chart where each ring represents a level of a hierarchy. Arc length encodes proportion. Center = root; outer rings = children/grandchildren.

**Data structure**: Same as treemap — hierarchical with sizes at leaf.

**LMI questions answered**:
- Visualizing ESCO occupation hierarchy structure for user navigation
- Skill cluster composition: core vs transversal skills
- Education system levels → fields → sub-fields

**Best examples**:
- Cedefop's ESCO Navigator has an experimental radial view for occupations
- O*NET Explorer used a sunburst-style hierarchy navigator (since replaced)
- Skills Framework for the Future (Singapore): sunburst for job family → role → skill

**Implementation (D3 v7)**:
```javascript
const partition = d3.partition().size([2 * Math.PI, radius]);
// arc generator with d3.arc() using d.x0, d.x1, d.y0, d.y1
```

**Gotchas**:
- Only works well up to 3 levels deep — deeper hierarchies become illegible
- Click-to-zoom (breadcrumb pattern) essential for exploration
- Sunbursts are intuitive for hierarchies but poor for precise quantitative comparison — use treemap if values matter
- ESCO hierarchy: ISCO major group (10) → sub-major (43) → minor (130) → unit (436) — 4 levels, needs zoom

**Greek/EU use cases**:
- ESCO skill taxonomy: knowledge → skills → attitudes and values — sunburst for LIVLAB Methods tab
- EU employment by ISCO major group, colored by growth rate (Cedefop forecast)

---

### 6g. Chord Diagram / Sankey

**Chord diagram**: Circle with arcs connecting categories. Arc thickness = flow volume. Best for symmetric flows (A→B and B→A both visible).

**Sankey diagram**: Left-to-right flow diagram. Nodes are categories; links are flows. Non-symmetric, directional.

**Data structure (Sankey)**:
```json
{
  "nodes": [{"name": "Construction"}, {"name": "Manufacturing"}, {"name": "ICT"}],
  "links": [{"source": 0, "target": 2, "value": 4200}, ...]
}
```

**LMI questions answered (Chord)**:
- Which sectors exchange workers most with each other?
- Between-occupation transitions in a given country/period

**LMI questions answered (Sankey)**:
- Where do redundant workers flow (coal miners → what sectors)?
- Education → occupation pipeline: which degrees lead to which jobs?
- ALMP program → employment outcome flows
- Occupational transition pathways (especially relevant for AI automation risk analysis)

**Best examples**:
- ONS/UK "Labour Market Flows" interactive Sankey — shows flows between employment/unemployment/inactivity states quarterly
- IPPR "Jobs of the future" Sankey: education level → occupation group flows
- D3 Gallery: canonical Sankey implementation for energy flows (adaptable to labor)

**Implementation (D3 v7 + d3-sankey plugin)**:
```javascript
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
const sankeyGen = sankey().nodeWidth(15).nodePadding(10).extent([[1,1],[width-1,height-6]]);
```

**Gotchas**:
- Sankeys become unreadable with > 20 nodes — aggregate small flows into "Other"
- Chord diagrams: sort nodes to minimize crossing arcs
- Color consistency: same sector color throughout all visualizations
- For occupational transitions: only show flows above a threshold (e.g., 500 workers/year) to reduce clutter
- Animation on load (drawing flows from left to right) dramatically improves comprehension

**Greek/EU use cases**:
- EU-LFS occupational mobility: transitions between ISCO1-digit groups 2015–2023 (chord)
- Greek crisis adjustment: flows from construction and manufacturing into tourism/services 2010–2015 (Sankey)
- TRAIN4BLUE pathway Sankey: existing qualifications → upskilling programs → blue economy roles

---

### 6h. Choropleth Map

**Definition**: Map where geographic areas are filled with color proportional to a quantitative variable. The canonical regional statistics visualization.

**Data structure**: GeoJSON/TopoJSON geometry + attribute table with region ID + values.

**LMI questions answered**:
- Which regions have highest/lowest unemployment?
- Where is digital skills demand concentrated?
- How does minimum wage coverage vary by region?
- What is NEET rate by NUTS2?

**Best examples**:
- Eurostat Regional Yearbook interactive maps: unemployment by NUTS2, NUTS3; very clean; allows switching indicators
- OECD Regional Statistics: NUTS-equivalent choropleth
- DYPA regional statistics: though basic, shows Greek prefectural patterns
- Lightcast regional heatmaps: skill demand by US county/MSA

**Implementation (Leaflet + D3)**:
```javascript
// Leaflet GeoJSON layer with D3 color scale
const colorScale = d3.scaleQuantile()
  .domain(values).range(colorBrewerScheme);

L.geoJSON(greekNUTS2, {
  style: feature => ({
    fillColor: colorScale(feature.properties.unemployment_rate),
    weight: 1, opacity: 1, color: 'white', fillOpacity: 0.7
  }),
  onEachFeature: (feature, layer) => {
    layer.bindTooltip(`${feature.properties.name}: ${feature.properties.unemployment_rate}%`);
  }
}).addTo(map);
```

**Gotchas**:
- Projection choice: EPSG:3857 (Web Mercator) for web tiles; EPSG:3035 (ETRS89-LAEA) for equal-area EU maps — use LAEA for accurate visual area comparison
- Color scheme: ColorBrewer sequential (single hue) for one-variable; diverging (e.g., RdBu) for above/below average
- Classification method: quantile (equal count), equal interval, Jenks/natural breaks — quantile most common for unknown distributions; always label classification method
- MAUP (Modifiable Areal Unit Problem): same data aggregated to NUTS1 vs NUTS2 vs NUTS3 gives visually different patterns
- Greek NUTS2 = 13 planning regions; NUTS3 = 51 regional units (former prefectures)
- Western Balkans: use GADM administrative boundaries (free); NUTS3-equivalent data is limited

**Greek/EU use cases**:
- Greece unemployment by 13 NUTS2 regions (ELSTAT LFS): Attica lowest, Eastern Macedonia-Thrace and Western Macedonia historically highest
- EU-27 NEET rate by country choropleth: Bulgaria, Romania, Italy, Greece elevated
- LIVLAB Map tab: already uses Leaflet — extend with choropleth layer toggle

---

### 6i. Bubble Map / Proportional Symbol Map

**Definition**: Map with circles centered on locations; circle area encodes quantity. Unlike choropleth, doesn't require areal units — works at city/point level.

**Data structure**: Table of locations with lat/lon, one size variable, optionally one color variable.

**LMI questions answered**:
- Where are vacancies concentrated by city?
- Which cities have the most job postings in the IT sector?
- Where are largest clusters of NEET youth?

**Best examples**:
- LinkedIn Economic Graph: hiring rate by city (bubble map)
- Indeed Jobs Barometer: job posting density by city
- Cedefop OJA: skill demand concentration map

**Implementation (Leaflet + D3)**:
```javascript
const radiusScale = d3.scaleSqrt().domain([0, maxVacancies]).range([3, 40]);
data.forEach(city => {
  L.circleMarker([city.lat, city.lon], {
    radius: radiusScale(city.vacancies),
    fillColor: colorByGrowth(city.growthRate),
    fillOpacity: 0.7, weight: 1, color: '#fff'
  }).bindTooltip(city.tooltipHtml).addTo(map);
});
```

**Gotchas**:
- Use AREA-proportional circles (scale by sqrt of value), not radius-proportional — common error that exaggerates differences
- Overlap issue in dense urban areas: jitter or cluster at low zoom, expand at high zoom
- Bimodal size distributions (Athens/Thessaloniki vs small Greek towns) need careful scale range

---

### 6j. Heatmap

**Definition**: Matrix visualization where rows, columns, and cell color encode three variables. Essentially a 2D grid colored by intensity.

**Data structure**: Matrix with row labels (e.g., occupations), column labels (e.g., months/quarters), and values.

**LMI questions answered**:
- How does skill demand vary by month × occupation (seasonality patterns)?
- Which region × sector combinations show highest vacancy rates?
- How do job postings vary by day of week × hour (operational insight for recruiters)?
- Correlation matrix between economic indicators

**Best examples**:
- Cedefop Skills-OVATE: skill demand heatmap by month × occupation (though this exists in prototype form)
- ONS UK: labor market calendar heatmap of publication dates
- Financial/economic heatmaps for correlation matrices

**Implementation (D3 v7)**:
```javascript
const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, maxValue]);
svg.selectAll('rect')
  .data(matrix.flat())
  .join('rect')
  .attr('x', d => xScale(d.col)).attr('y', d => yScale(d.row))
  .attr('width', cellWidth).attr('height', cellHeight)
  .attr('fill', d => colorScale(d.value));
```

**ECharts v5**: `type: 'heatmap'` with calendar coordinate system — excellent for temporal heatmaps.

**Gotchas**:
- Color scale choice critical: sequential (light→dark) for positive values; diverging for above/below mean
- White for missing/zero data; distinguish from near-zero
- Label cells only if > 4px × 4px
- Clustering rows/columns (hierarchical clustering) before display reveals patterns not visible in alphabetical order
- For Greek seasonal labor market: DYPA monthly vacancy data × sector — shows clear hospitality peak March–June, retail peak October–December

**Greek/EU use cases**:
- Greek OJA posting volume by ISCO2 × month: confirms seasonal patterns
- EU country × indicator correlation heatmap: unemployment, NEET, long-term unemployment, vacancy rate
- Skill demand × region heatmap: which NUTS2 regions demand which skills

---

### 6k. Scatter Plot / Bubble Chart

**Definition**: Points plotted at (x,y) coordinates. Bubble variant adds a third dimension via point size. Optional fourth dimension via color.

**Data structure**: Table with x, y, and optionally size/color per observation.

**LMI questions answered**:
- What is the relationship between automation risk and wage level? (Frey & Osborne plot)
- Does higher skill demand correlate with faster wage growth?
- Which occupations combine high growth with high wage? (strategic quadrant)
- Wage vs employment size bubble chart (policy prioritization)

**Best examples**:
- OECD: automation risk vs median wage scatter by occupation (from Arntz et al. 2016, Nedelkoska & Quintini 2018)
- LinkedIn Economic Graph: skills "map" — bubble chart of skill demand vs growth rate
- Cedefop Skills-OVATE: scatter of online vacancy growth vs employment growth by occupation

**Implementation (D3 v7 / Observable Plot)**:
```javascript
// Observable Plot — highly recommended for scatter plots
Plot.plot({
  marks: [
    Plot.dot(occupations, {
      x: "automation_risk", y: "median_wage",
      r: d => Math.sqrt(d.employment / Math.PI),
      fill: "sector",
      title: d => `${d.name}\nRisk: ${d.automation_risk}\nWage: €${d.median_wage}`
    }),
    Plot.text(topLabeled, { x: "automation_risk", y: "median_wage", text: "name", dy: -10 })
  ]
});
```

**Gotchas**:
- Overplotting with many points: use transparency (alpha 0.4–0.6), jitter, or hexbin aggregation
- Reference lines essential: diagonal, quadrant dividers, mean lines
- Log scale for wage/employment data (skewed distributions)
- Label only notable outliers to avoid label collision
- Zoom/pan interaction essential when > 100 points

**Greek/EU use cases**:
- Greek occupations: automation risk (Frey-Osborne estimates adapted for Greek task structure) vs ELSTAT median wage
- EU country scatter: youth unemployment vs NEET rate (correlated but different — youth unemployed are actively seeking; NEET includes discouraged workers)
- Skill pairs: demand growth vs supply availability (skills gap quadrant: high demand, low supply = critical shortage)

---

### 6l. Box Plot / Violin Plot

**Definition**: Box plot shows median, IQR (25th–75th percentile), whiskers (1.5×IQR), and outliers. Violin plot adds kernel density estimate as mirrored shape alongside box.

**Data structure**: Distribution data per category — either raw values or pre-computed statistics.

**LMI questions answered**:
- How does wage distribution vary across occupation groups?
- How wide is the intra-sector wage inequality?
- How does wage distribution differ by contract type (permanent vs temporary)?
- Are wages more compressed in Greece vs Germany for same occupation?

**Best examples**:
- OECD Earnings Distribution visualizations: box plots by industry
- Eurofound: wage distribution by employment status
- Cedefop: qualification mismatch wage penalty — box plots for well-matched vs over-/under-qualified

**Implementation (D3 v7 with custom boxplot / Plotly.js)**:
```javascript
// Plotly.js is best for box/violin due to built-in distribution support
Plotly.newPlot('chart', [{
  type: 'violin',
  y: wageData,
  x: sectorLabels,
  box: { visible: true },
  meanline: { visible: true },
  points: 'outliers'
}]);
```

**Gotchas**:
- Violin plots require sufficient data for smooth KDE — needs n > 50 per category minimum
- Box plots for small n: show all points as strip plot overlay
- For Greek wage data: minimum wage (€880/month in 2026) creates left-censoring effect — many workers are exactly at minimum
- Log-scale for wages avoids squishing the visualization at the bottom

**Greek/EU use cases**:
- CEDEFOP ESJS2: skill match score distribution by occupation (box plot) — shows mismatch heterogeneity
- ELSTAT SES earnings by NACE sector: box plots reveal service sector compression vs manufacturing spread

---

### 6m. Radar / Spider Chart

**Definition**: Polar coordinate chart with axes radiating from center, one per variable. Shape formed by connecting values on each axis. Area fill optional.

**Data structure**: Multiple categories (axes) × one or more entities to compare.

**LMI questions answered**:
- Compare skill profiles of two occupations (e.g., current job vs target job for career change)
- Compare a candidate's skills vs an occupation's requirements
- Compare a country's labor market performance across 5–6 indicators simultaneously
- Visualize competency gap analysis

**Best examples**:
- OECD Better Life Index: radar/star chart for multi-dimensional country comparison
- Cedefop Skills Intelligence: skill profile comparison (though not standard radar — more bar-based)
- My Future (Australian careers portal): skill profile comparison tool — radar chart
- O*NET Skills Search: skills by domain for occupation comparison

**Implementation (Chart.js v4)**:
```javascript
new Chart(ctx, {
  type: 'radar',
  data: {
    labels: ['Technical Skills', 'Language', 'Management', 'Digital', 'Interpersonal', 'Sector Knowledge'],
    datasets: [
      { label: 'Current Profile', data: [70, 60, 40, 80, 65, 55], fill: true, backgroundColor: 'rgba(54,162,235,0.2)' },
      { label: 'Target Occupation', data: [85, 75, 60, 90, 70, 80], fill: true, backgroundColor: 'rgba(255,99,132,0.2)' }
    ]
  }
});
```

**Gotchas**:
- Maximum 8 axes before reading difficulty — group skills into meta-categories
- Radar charts are shape-sensitive to axis ordering — different orderings of same data look different. Alphabetical ordering is common but arbitrary; cluster related skills together.
- Area comparison bias: area grows quadratically with values, so small changes look larger than they are
- Better alternative for precise comparison: parallel coordinates plot or faceted bar charts
- Best use: intuitive overview comparison, not precise measurement

**Greek/EU use cases**:
- LIVLAB career recommender: current worker skill profile vs ESCO occupation requirement radar
- Country comparison: Greece vs EU average across unemployment rate, NEET, gender gap, long-term unemployment, youth unemployment, wage adequacy — six-axis radar
- Blue economy occupation profile: maritime skills × knowledge × attitudes (Growth4Blue use case)

---

### 6n. Word Cloud / Tag Cloud

**Definition**: Text visualization where word size encodes frequency/importance. Position is random or spiral-arranged.

**Data structure**: Array of (term, weight) pairs.

**LMI questions answered**:
- What words appear most in job postings for a given occupation?
- What skills are most mentioned in resumes for a sector?
- What topics dominate labor market policy documents?

**Best examples**:
- LinkedIn Skills pages: tag cloud of skills for occupation
- Indeed Career Explorer: skills cloud for occupation
- Cedefop OJA analysis visualizations

**Implementation (D3-cloud / Observable)**:
```javascript
import cloud from 'd3-cloud';
const layout = cloud().size([800, 400])
  .words(skills.map(d => ({ text: d.skill, size: fontScale(d.count) })))
  .padding(5).rotate(0).fontSize(d => d.size)
  .on('end', drawWords);
layout.start();
```

**Gotchas**:
- Word clouds have poor quantitative precision — size differences < 30% are not reliably perceived
- Prefer horizontal lollipop/bar chart for precise comparison; word cloud for at-a-glance gestalt
- Better alternative: bubble chart of skills, sorted by size — same information, more readable
- For LMI: useful for exploratory overview, not for policy analysis
- ESCO skill names can be long — truncate or use acronyms for display; full name in tooltip
- Position randomness makes reproduction non-deterministic — use fixed seed if reproducibility matters

---

### 6o. Network Graph / Force-Directed

**Definition**: Nodes (entities) connected by edges (relationships). Force-directed layout uses physics simulation to position nodes with related nodes close together.

**Data structure**:
```json
{
  "nodes": [{"id": "Python", "group": "Programming", "size": 4200}],
  "links": [{"source": "Python", "target": "Machine Learning", "value": 1800}]
}
```

**LMI questions answered**:
- Which skills co-occur most frequently in the same job posting (skill co-occurrence network)?
- How similar are different occupations based on shared skill requirements (occupational similarity network)?
- What are the "gateway skills" — skills that connect many other skills?
- Labor market transition network: which occupations are reachable from a given occupation?

**Best examples**:
- Cedefop Skills-OVATE: skill co-occurrence network visualization (beta feature)
- O*NET occupational network: occupational similarity based on shared work activities
- LinkedIn Economic Graph: "skills cloud" is actually a simplified network
- Atlas of Economic Complexity (Hidalgo): analogous for products — directly applicable to skills
- Jobs of the Future Observatory: transition network for blue-collar workers

**Implementation (D3 v7 — force simulation)**:
```javascript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).strength(d => d.value / maxValue))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width/2, height/2))
  .force('collision', d3.forceCollide().radius(d => radiusScale(d.size) + 5));
```

**Gotchas**:
- Force layout is non-deterministic — fix seed or use fixed layout for reproducibility
- More than 200 nodes: performance degrades; use WebGL renderer (sigma.js, Gephi WebGL) or aggregate
- Edge bundling for dense graphs reduces visual clutter
- Community detection (Louvain algorithm) before visualization — color nodes by community
- Skill co-occurrence networks: threshold edge weight (only show edges with > N co-occurrences) to avoid hairball
- Consider alternative: adjacency matrix (heatmap) for precise comparison of dense networks

**Greek/EU use cases**:
- Greek OJA skill co-occurrence: cluster analysis reveals "digital skills cluster," "language skills cluster," "management cluster"
- ESCO occupation transition network: edges weighted by probability of transition (graph-neural-networks-transitions method in LIVLAB)
- Blue economy skill network: maritime, environmental, digital, managerial skill clusters for Growth4Blue

---

### 6p. Beveridge Curve

**Definition**: Scatter plot of vacancy rate (y-axis) vs unemployment rate (x-axis) where each point = one time period (month/quarter/year), connected by a path showing temporal trajectory. Annotated with period labels.

**Data structure**: Time-ordered array of (unemployment_rate, vacancy_rate, period_label) tuples.

**LMI questions answered**:
- Is the economy in a boom or recession?
- Has structural unemployment increased (outward curve shift)?
- Are ALMP policies improving matching efficiency (inward curve shift)?
- How does Greece's position compare to EU average on the curve?

**Best examples**:
- Federal Reserve Bank of St. Louis FRED: interactive US Beveridge Curve with recession shading
- BLS Monthly Labor Review: Beveridge Curve analyses
- OECD Employment Outlook: Beveridge Curves by country — including visible shifts during 2008–2010 crisis and 2020–2022 COVID
- IMF WEO: cross-country Beveridge Curve comparison

**Implementation (D3 v7 / Observable Plot)**:
```javascript
// Path connecting points + points colored by time period
Plot.plot({
  marks: [
    Plot.line(beveridgeData, { x: "unemployment_rate", y: "vacancy_rate",
      stroke: "year", strokeWidth: 1.5, curve: "catmull-rom" }),
    Plot.dot(beveridgeData, { x: "unemployment_rate", y: "vacancy_rate",
      fill: "year", r: 4, title: d => `${d.period}: U=${d.unemployment_rate}%, V=${d.vacancy_rate}%` }),
    Plot.text(keyEvents, { x: "u", y: "v", text: "label", fontSize: 10 })
  ],
  color: { scheme: "viridis", legend: true, label: "Year" }
});
```

**Greek Beveridge Curve specifics**:
Data needed:
- Unemployment rate: ELSTAT LFS quarterly (SJO01) → `lfsi_emp_q` Eurostat
- Vacancy rate: Eurostat JVS → `jvs_q_nace2` (Greece: available 2009–present, small sample, high variance)
- Alternative vacancy proxy: DYPA monthly registered vacancies / labor force

**Gotchas**:
- The curve is only meaningful with BOTH unemployment AND vacancy data — vacancy data for Greece/Balkans is weak
- Annotate recession periods (2009–2013 Greek crisis, 2020 COVID) on the path
- Arrow direction on path shows direction of travel over time — essential for readability
- Multiple periods on same chart: use color gradient or sequence numbers
- OJA as vacancy proxy: convert posting volume to rate by dividing by labor force × proxy factor (with stated assumptions)

---

### 6q. Lollipop Chart

**Definition**: Bar chart variant where the bar is replaced by a thin line (stem) with a dot (lollipop head) at the value. Reduces ink, emphasizes the data point value.

**Data structure**: Same as bar chart — categories + values.

**LMI questions answered**:
- Ranking with precise values: top skills by demand with exact posting counts visible
- Country comparison: ranked unemployment rates with exact values
- Deviation from reference: which occupations are above/below average wage?

**Best examples**:
- OECD Better Life indicator comparison: lollipop charts for country rankings
- Pew Research Center: commonly uses lollipop for ranking comparisons
- Many labor market "top N" rankings in Bloomberg, FT data journalism

**Implementation (D3 v7)**:
```javascript
// Stems (lines from zero to value)
svg.selectAll('line.stem').data(skills)
  .join('line').attr('x1', d => xScale(0)).attr('x2', d => xScale(d.count))
  .attr('y1', d => yScale(d.skill) + yScale.bandwidth()/2)
  .attr('y2', d => yScale(d.skill) + yScale.bandwidth()/2)
  .attr('stroke', '#aaa').attr('stroke-width', 1.5);
// Heads (circles)
svg.selectAll('circle').data(skills)
  .join('circle').attr('cx', d => xScale(d.count))
  .attr('cy', d => yScale(d.skill) + yScale.bandwidth()/2)
  .attr('r', 5).attr('fill', d => colorScale(d.category));
```

**Gotchas**:
- Lollipop + diverging axis (negative = surplus, positive = shortage) is particularly powerful for skill gap visualization
- Sort order is critical: sort by value, not alphabetically
- Avoid when many items have identical or near-identical values (stems cluster unreadably)
- Good for 10–30 items; beyond 30 switch to scrollable bar chart or paginate

---

### 6r. Slope Chart / Bump Chart

**Definition**: Slope chart: two time points on x-axis, categories as lines between them — shows change in value. Bump chart: multiple time points, y-axis shows rank position rather than value.

**Data structure (bump chart)**: Rankings over time — (entity, period, rank) triples.

**LMI questions answered (slope)**:
- How has each country's skill demand changed between two periods?
- Which occupations gained/lost in relative employment share?
- Before/after effect of a training intervention

**LMI questions answered (bump)**:
- How have skill rankings shifted over 5 years?
- Which countries improved/worsened in labor market indicators over the decade?

**Best examples**:
- Our World in Data: bump charts for country rankings on development indicators
- NYT Upshot: slope charts for pre/post policy comparisons
- Financial Times: "streamgraph" variants for skill ranking shifts

**Implementation (D3 v7)**:
```javascript
// Bump chart: y-axis is rank (1 = top), x-axis is time
// Key: invert y-scale so rank 1 is at top
const yScale = d3.scaleLinear().domain([maxRank, 1]).range([height, 0]);
// Lines connect same skill across time periods
// Circles at each time point sized by posting count
```

**Gotchas**:
- Bump chart readability degrades with > 15 items — filter to top 10–15
- Highlight selected skill/country on hover to reduce clutter
- Label only endpoints (first and last time period) to avoid mid-chart clutter
- Color by category, not by rank, for consistency

**Greek/EU use cases**:
- Rank changes in top 20 demanded skills in Greece: 2020, 2022, 2024, 2026 (requires OJA historical data)
- Country rankings on NEET rate over 10 years: which Balkan countries improved?
- Slope chart: share of temporary contracts in employment — Greece 2014 vs 2024 — dramatic change

---

### 6s. Waffle Chart / Unit Chart

**Definition**: Grid of N equally-sized units (squares, circles, person icons) where each unit represents a fixed quantity (e.g., 1% of workforce). Colored units form the visualization.

**Data structure**: Simple percentages or proportions of total.

**LMI questions answered**:
- What share of the workforce is in automation-risk categories (low/medium/high)?
- What percentage of youth are NEET?
- What share of contracts are temporary?
- Education level composition of employment (icon array for maximum intuition)

**Best examples**:
- ONS UK: "People like you" tool uses unit chart for demographic comparisons
- Pew Research: frequently uses waffle/unit charts for workforce composition
- UN Data for Good: SDG progress waffle charts

**Gotchas**:
- 10×10 = 100 units grid is canonical — readers understand immediately
- Pixel-person icons (pictographs) are most engaging but accessible alternatives needed
- Good for 2–4 categories; more than 4 colors becomes difficult
- Not suitable for precise quantities — use for "about 1 in 4" type messages

**Greek/EU use cases**:
- Greece: "1 in 4 young people (15–29) is NEET" — waffle chart for Policy tab
- EU automation risk: "42 of 100 EU jobs face medium-high automation risk" (Cedefop analysis)
- Formal vs informal employment in Albania: "6 in 10 agricultural workers are in informal employment"

---

### 6t. Flow / Alluvial Diagram

**Definition**: Multi-stage Sankey variant where vertical categorical bands at each time period are connected by flows showing how entities moved between categories.

**Data structure**: Panel data at multiple time points — individuals or groups in different states at each time.

**LMI questions answered**:
- How did employment status transition across COVID waves (employed → unemployed → inactive → re-employed)?
- How do workers transition between sectors over a decade?
- How do students transition from education into different employment outcomes?

**Best examples**:
- ONS "From education to work" alluvial: shows complex ISCED → labor market outcome flows
- Eurostat Labour Market Flows quarterly publication
- OECD "Back to Work" analysis: alluvial of displacement and re-employment paths

**Implementation (D3 v7 / RAWGraphs)**:
- RAWGraphs (rawgraphs.io) has excellent built-in alluvial diagram tool — suitable for exploratory analysis
- For production: d3-alluvial or custom D3 implementation

**Gotchas**:
- Colors should follow the dominant category throughout — tracing a color visually
- Maximum 5–6 stages; 5–8 categories per stage
- Wide flows between distant stages should be highlighted (e.g., agriculture → ICT is surprising and policy-relevant)

---

### 6u. Dot Plot / Strip Plot

**Definition**: Each observation is a dot on a scale. Can be 1D (strip plot) or 2D. Shows full distribution without aggregation.

**Data structure**: Individual observations with value and optional group.

**LMI questions answered**:
- Full wage distribution per occupation without aggregation to box statistics
- Individual country data points on a common scale (replaces bar chart when showing spread matters)
- Skill coverage scores per job posting

**Best examples**:
- The Economist: dot plots for country comparison (classic "dumbell" variant shows two timepoints per country)
- Our World in Data: scatter with connected dots for before/after
- Quartz: wage distribution dot plots for salary equity stories

**Dumbbell variant**: Two connected dots per entity — before vs after comparison. Extremely effective for showing directional change.

**Implementation (D3 / Observable Plot)**:
```javascript
// Dumbbell: Greece 2015 vs 2024 unemployment by region
Plot.plot({
  marks: [
    Plot.link(regions, { x1: "rate_2015", x2: "rate_2024", y: "region",
      stroke: d => d.rate_2024 < d.rate_2015 ? "steelblue" : "tomato", strokeWidth: 2 }),
    Plot.dot(regions, { x: "rate_2015", y: "region", fill: "grey", r: 5 }),
    Plot.dot(regions, { x: "rate_2024", y: "region",
      fill: d => d.rate_2024 < d.rate_2015 ? "steelblue" : "tomato", r: 5 })
  ]
});
```

**Greek/EU use cases**:
- Greek regional unemployment: dumbbell chart 2013 (peak crisis) vs 2025 — shows dramatic decline everywhere but persistent regional disparities
- EU country comparison: each country as a dot, showing NEET rate range (strip plot) rather than just mean

---

### 6v. Forecasting Chart with Uncertainty Bands

**Definition**: Time-series chart extending into future with shaded confidence/prediction intervals. Historical data as solid line; forecast as dashed line; uncertainty as shaded bands (1σ, 2σ or 80%/95% CI).

**Data structure**:
```json
{
  "historical": [{"period": "2020Q1", "value": 17.2}, ...],
  "forecast": [
    {"period": "2026Q1", "median": 10.5, "ci80_lo": 9.2, "ci80_hi": 11.8, "ci95_lo": 8.0, "ci95_hi": 13.0},
    ...
  ]
}
```

**LMI questions answered**:
- What will Greek unemployment be in 2028?
- What is the forecast demand for data scientists in the EU through 2035?
- How uncertain is the Cedefop Skills Forecast for care occupations?

**Best examples**:
- Cedefop Skills Forecast portal: employment projections 2025–2035 with scenario bands (baseline, optimistic, pessimistic)
- IMF WEO charts: GDP growth forecast with fan charts
- Bank of England Inflation Report: fan chart — canonical example of uncertainty visualization
- OECD Economic Outlook: forecast tables and charts with confidence intervals

**Implementation (Chart.js v4 + chartjs-plugin-annotation)**:
```javascript
datasets: [
  { label: 'Historical', data: historical, borderColor: '#2f81f7', borderDash: [] },
  { label: 'Forecast median', data: forecast.map(d=>d.median), borderDash: [5,5], borderColor: '#2f81f7' },
  { label: '80% CI', data: forecast.map(d=>d.ci80_hi), fill: '+1',
    backgroundColor: 'rgba(47,129,247,0.15)', borderWidth: 0 },
  { label: '80% CI lower', data: forecast.map(d=>d.ci80_lo), fill: false, borderWidth: 0 },
  { label: '95% CI', data: forecast.map(d=>d.ci95_hi), fill: '+1',
    backgroundColor: 'rgba(47,129,247,0.07)', borderWidth: 0 },
  { label: '95% CI lower', data: forecast.map(d=>d.ci95_lo), fill: false, borderWidth: 0 }
]
```

**Gotchas**:
- Clearly distinguish historical from forecast with a vertical dashed separator line
- Multiple scenarios (optimistic/baseline/pessimistic) can replace probabilistic bands when scenario logic is explicit
- Forecast horizon length should be proportional to model confidence — beyond 2–3 years, widen bands substantially
- LSTNet paper (arXiv:2507.01979) from LIVLAB: provides RMSE/MAE metrics by forecast horizon — translate to uncertainty bands
- Cedefop Skills Forecast: three scenarios based on EU economic growth assumptions; show all three as distinct lines

**Greek/EU use cases**:
- ELSTAT LFS unemployment nowcast: extend most recent quarterly data with OJA-based nowcast
- Cedefop Skills Forecast: employment by ISCO1 group for Greece through 2035
- LIVLAB demand forecasting system: LSTNet model output with prediction intervals for Greek top occupations

---

## 7. Best Practices from Real LMO Portals

### 7.1 Greek LMO (DYPA/Ergani + ELSTAT)

**What exists:**
- SEPE (Σώμα Επιθεώρησης Εργασίας — Labour Inspectorate): enforcement data, not public-facing dashboards
- DYPA (former OAED): Ergani register provides real-time vacancy and employment contract data; public portal is rudimentary
- ELSTAT (Ελληνική Στατιστική Αρχή): LFS data published as Excel files and PDFs; no interactive visualization
- The Greek PES digital portal (dypa.gov.gr): recently revamped but primarily transactional (register for unemployment benefits), not analytical
- Diavgeia (gov.gr transparency portal): contains some labor-related administrative data but not structured for LMI

**What works:**
- Ergani is genuinely real-time — daily flow data of employment contracts since 2013, covering 3.5M+ employment events/year
- ELSTAT LFS methodology is fully EU-harmonized — EU-LFS microdata access possible
- Long historical series (1981–) allows genuine long-run trend analysis

**What's missing/weak:**
- No interactive visualization layer — all raw data
- No occupational decomposition in public Ergani output (NACE only, not ISCO)
- No integrated supply-demand dashboard
- No skills/occupational language in DYPA public outputs
- Vacancy survey sample is very small (large variance at NUTS3 level)
- No regional labor flow analysis (migration in/out of regions)

**LIVLAB opportunity**: Build the first integrated Greek LMI dashboard combining ELSTAT LFS + Ergani flows + OJA from 6 Greek portals (Kariera, Skywalker, Xe.gr jobs, Jobfind, Ergasia.gr, Workable). This is a genuine research contribution.

### 7.2 Cedefop Skills-OVATE

**URL**: https://www.cedefop.europa.eu/en/tools/skills-online-vacancies

**What it is**: EU-wide OJA collection and analysis platform. Scrapes ~10M+ job postings per quarter from 60+ online sources across EU27. Tags skills with ESCO. Provides:

**Structure:**
- Country profiles: posting volume, top skills, top occupations
- Skills analysis: ESCO skill demand rankings, trend analysis
- Occupation analysis: demand by ISCO/ESCO occupation
- Regional analysis: NUTS2 skill demand maps

**Visualizations used:**
- Bar charts (top skills, top occupations)
- Time-series lines (posting volume trends)
- Choropleth maps (NUTS2 skill demand)
- Bubble charts (occupation demand vs trend)
- Network graph (skill co-occurrence, in beta)

**What works:**
- Genuinely EU-wide harmonized OJA data — unique resource
- ESCO-tagged skills allow cross-country comparison
- Free access, regular updates (quarterly)
- Clear data vintage labeling

**What's missing:**
- No supply-side integration (pure demand tool)
- Western Balkans NOT included (outside EU)
- Skill coverage in Greece/Southern EU lower than Northern Europe
- Informal sector entirely invisible
- Limited historical depth (full series from 2018)
- No forecasting element
- API access is limited (bulk download only)

**Key design lesson**: OVATE's skill network visualization is one of the few real portal implementations of force-directed graphs for LMI. Worth studying their node sizing (by demand), edge thickness (co-occurrence weight), and community coloring (ESCO skill pillar: knowledge/skills/attitudes).

### 7.3 OECD Skills for Jobs

**URL**: https://www.oecdbetterlifeindex.org + https://stats.oecd.org/Index.aspx?DataSetCode=EAG_TVET

**What it is**: Multi-dimensional framework combining:
- O*NET task/skill intensity data
- LFS employment by occupation
- Wage data by occupation
- Employer survey data on skill needs
- Education participation data

**The Skills for Jobs Indicator (Grundke et al., 2017)**:
Quantifies skill surplus/shortage per country × skill by comparing:
- Cognitive/social/physical skills in employment (via O*NET mapped to ISCO)
- Skill requirements relative to average for employed workers

**Visualization approach:**
- Horizontal bar charts (surplus negative, shortage positive) — the "diverging bar" for skill gap
- Scatter plots (task intensity vs wage premium)
- Country profiles with multiple parallel small charts (small multiples)

**Key design lesson**: The diverging bar chart for skill gaps (negative = surplus, positive = shortage, zero line at center) is one of the most effective and widely copied LMI visualizations. Simple, interpretable, policy-actionable.

**Limitations:**
- OECD members only — no Western Balkans
- O*NET-based skills mapped to non-US occupations through crosswalk — significant noise
- Annual data, significant lag

### 7.4 Eurostat Statistics Explained

**What it is**: Narrative data journalism companion to Eurostat statistical database. Each article explains methodology, context, and findings with embedded charts.

**Best practices demonstrated:**
- **Recession shading**: grey bands for NBER/Eurostat recession periods on all time-series — standard, essential
- **Data vintage notation**: "Data until [date]" clearly labeled
- **Contextual annotations**: key events annotated on charts (2009 crisis, 2020 COVID)
- **Progressive detail**: summary statistic → trend line → country breakdown → regional breakdown
- **Consistent color palette**: Eurostat uses a consistent 8-color scheme across all publications
- **Small multiples**: often shows the same chart for 4–6 country groups as small multiples rather than cluttered multi-line chart

**Limitation**: Charts are static images (SVG/PNG) — no interaction. The newer Statistics Explained articles are adopting Highcharts for interactive versions, but coverage is patchy.

### 7.5 BLS Occupational Outlook Handbook (OOH)

**URL**: https://www.bls.gov/ooh/

**What it is**: The gold standard for occupation-level LMI. For each of 800+ occupations:
- Employment level and 10-year projection
- Median annual wage (May survey)
- Entry-level education requirement
- Work experience requirement
- On-the-job training needed
- Job outlook text explanation
- State-level employment maps
- Occupational information (tasks, skills, work environment)

**Visualization approach:**
- Embedded bar chart of employment (current) and projection
- State choropleth for geographic distribution
- Simple clean table for key statistics
- External links to OES (employment/wages) and O*NET (tasks/skills)

**Key design lessons:**
- Each occupation has a standard "card" layout — consistent across 800+ occupations
- Projection presented as "X% faster/slower than average" — normalizing to reference makes cross-occupation comparison intuitive
- The "Summary" tab vs "Details" tab pattern: overview first, drill-down available
- Wage percentile bar (showing 10th, 25th, median, 75th, 90th) — one of the most copied LMI visualizations

**Implication for LIVLAB**: The OOH occupational card pattern is directly implementable for Greek/Balkan occupations using ESCO + ELSTAT + DYPA data. Each ISCO4-level occupation could have: employment level, vacancy rate, wage distribution, top skills from OJA, Cedefop forecast.

### 7.6 Lightcast / Burning Glass LMI

**URL**: https://lightcast.io (commercial, no public demo)

**What makes it powerful:**
- **Source aggregation**: 40,000+ data sources, real-time, deduplicated
- **Proprietary skill taxonomy**: Lightcast Open Skills Ontology (32,000+ skills) — richer than ESCO for employer vocabulary; mappable to ESCO
- **Posting duration data**: measures how long a vacancy stays open — harder-to-fill positions have longer posting duration. This is a direct measure of "tightness" at skill/occupation level
- **Employer-level data**: identify specific employers driving demand — "Amazon opened a warehouse in X and is driving logistics skill demand spike"
- **Historical depth**: 15+ years of historical OJA data — allows genuine long-run skill trend analysis
- **Salary benchmarking**: advertised salaries from postings, validated against BLS survey data
- **Regional labor markets**: MSA-level (US) / LAD-level (UK) data

**Weaknesses:**
- No Balkans coverage
- Greece coverage is thin (primarily covers LinkedIn-sourced job postings, not local portals)
- Expensive (academic license ~$50K/year; enterprise much higher)
- Closed taxonomy requires mapping to open standards (ESCO, ISCO) for research

**Key methodology lesson**: Lightcast's "Regional Profile" approach — for each geography, they show a "labor market balance" indicator combining: job posting concentration (demand) vs workforce size (supply) vs wage levels. This trivariate approach is more informative than any single indicator.

### 7.7 LinkedIn Economic Graph

**URL**: https://economicgraph.linkedin.com/

**Structure:**
- Monthly "Jobs on the Rise" report: fastest-growing job titles
- "Skills in Demand" report: top emerging skills by industry
- "Hiring Rate" index: smoothed hiring activity
- "Talent Migration" report: net migration flows between cities/countries

**Key strength: Signal speed**
LinkedIn data is available within days of reference period. The "Hiring Rate" index was used to monitor COVID labor market collapse in real time (March 2020 — -40% in 3 weeks, fully visible before any official survey data).

**Visualization approach:**
- Simple bar charts for rankings (top skills, top jobs)
- Geographic maps for talent migration
- Time-series for hiring rate
- Deliberately simple — designed for C-suite/HR audiences, not researchers

**Key weakness for LIVLAB geographic focus:**
- LinkedIn penetration: Greece ~35% professionals, Italy ~45%, Serbia ~20%, Montenegro ~12%, Albania <10%. Data quality degrades dramatically for Western Balkans.
- Over-representation of professional/managerial occupations
- No hospitality, agriculture, construction coverage

**Emerging feature: Skills Graph**
LinkedIn's internal graph connecting skills → jobs → people → companies — the largest private LMI dataset. Some of this is now exposed via LinkedIn Talent Insights product (enterprise, very expensive).

### 7.8 European NSI Best Practices (Destatis, INSEE, CBS)

**Destatis (Germany)**
- Themenbereich Arbeitsmarkt: excellent time-series charts with download-as-CSV on each chart
- Gemeinde-level employment maps (NUTS3+) using interactive D3/Leaflet
- "Genesis" database: machine-readable statistical database with API
- Key innovation: "Publikations-Service" — every statistical publication auto-generates standardized charts

**INSEE (France — Institut national de la statistique et des études économiques)**
- "Tableaux de l'économie française" (TEF): annual summary with standardized indicators
- Emploi et chômage section: comprehensive with regional breakdowns (departement level = NUTS3)
- Recent move to interactive "Datavis" mini-applications embedded in publications
- Key strength: DADS (Déclarations Annuelles de Données Sociales) — linked employer-employee administrative data covering virtually all French workers; allows genuine wage distribution analysis

**CBS (Netherlands — Centraal Bureau voor de Statistiek)**
- OpenData CBS API: probably the most open NSI in Europe — all published statistics via REST API
- Interactive "StatLine" database: customizable table-to-chart in browser
- Recent "CBS Data Stories": narrative articles with embedded interactive D3 charts — excellent model
- Key strength: extensive micro-data access for researchers (remote access system)
- Relevant for LIVLAB: Dutch labor market has interesting flexicurity features — high "flexworkers" (ZZP self-employed) share; CBS data shows this clearly

**Common best practices across Northern European NSIs:**
1. API-first data dissemination
2. Embedded interactive charts in publications (not just static tables)
3. Clear methodology notes on every chart
4. Data as CSV download on every visualization
5. Consistent color palettes and chart templates
6. "Latest" badge with precise date on all statistics

---

## 8. Mediterranean and Balkan Specific Visualizations

### 8.1 Visualizing Large Informal Sectors

The Mediterranean and Balkan countries have informal economy shares of 20–45% of GDP (OECD/ILO estimates). Standard LMI visualizations are designed for formal economy data and implicitly exclude the informal sector.

**Problem**: If you show Greek agricultural employment from ELSTAT LFS, you see ~400,000 employed. But ILOSTAT and sector-specific estimates suggest 30–40% of agricultural workers are informal/undeclared. The LFS captures these workers if they self-report employment in the reference week (even if undeclared) — but under-counts workers who self-report as inactive.

**Visualization strategies:**

a) **Dual display with coverage indicators**: For each chart showing formal employment data, add a "coverage note" band showing estimated informal sector size from ILO/NOE (Non-Observed Economy) estimates. OECD NOE estimates available for Greece, Italy, Spain.

b) **Uncertainty band as informality proxy**: Show employment as a range: formal employment (lower bound) to formal + estimated informal employment (upper bound). The band width = informality estimate.

c) **Sector-specific informal rate heatmap**: Matrix of sector × country with informal employment rate encoded as color. ILO has estimates for NACE 1-digit × country.

d) **Formal/informal dumbbell**: For key sectors (agriculture, construction, hospitality), show formal count (dot) and estimated total count (dot) connected by line — the gap is informality.

**Data sources for informality estimates:**
- ILO informal economy statistics: country-level estimates
- ILOSTAT indicator EMP_NIFL_NOC_RT: informal employment rate by sector
- World Bank STEP survey: for Balkans (if available)
- ELSTAT productivity surveys: some sectoral informal estimation possible

### 8.2 Dual Labor Markets (Insiders/Outsiders)

Mediterranean labor markets (particularly Spain, Italy, Greece) have pronounced "dual" structure: strong employment protection for permanent ("insider") workers + high turnover/low protection for temporary/fixed-term ("outsider") workers. This is a central structural feature driving labor market outcomes.

**Key metrics to visualize:**
- Temporary employment rate: % of employees on fixed-term contracts (Eurostat, EU-LFS)
- Youth temporary rate vs adult temporary rate (the insider/outsider age gradient)
- Temporary-to-permanent transition probability: what share of temporary workers obtain permanent contracts within 2–3 years? (EU-LFS longitudinal module, or cohort analysis)
- Contract type wage gap: wage penalty/premium for temporary vs permanent at same occupation

**Recommended visualizations:**

a) **Stacked bar chart with dual overlay**: For each country, stack permanent + temporary employment shares. Overlay line showing youth temporary rate — always higher, showing entry barrier.

b) **Transition matrix heat-table**: Employment status at t × employment status at t+12 months. Shows probability of "escaping" temporary status. Available from EU-LFS longitudinal component.

c) **Age-contract type profile**: Line chart with age on x-axis, probability of being on temporary contract on y-axis. Greece: probability peaks at 25–29 (50%+) then falls as workers age into permanent positions.

d) **Sankey of labor market entry**: For young workers entering labor market, Sankey showing pathways: education → first job type (temporary/permanent/self-employed/inactive) over 3 years.

### 8.3 Missing/Poor Data: Western Balkans

**Country-specific data quality status:**

| Country | LFS | Admin | OJA | Key Issues |
|---------|-----|-------|-----|------------|
| North Macedonia | Annual only (SSO) | NSE register | Vrabotuvanje.com, Vraboti.mk | No quarterly LFS; limited NUTS breakdown |
| Montenegro | Quarterly (MONSTAT) | ZZZCG | Zaposli.me, Prekoveze.me | Small sample (very high variance); NUTS2 only |
| Kosovo | Annual (ASK) | KAAB | Kosovajob, Ofertapune | ILO "statistical capacity" concerns; different working-age definitions |
| Albania | Quarterly (INSTAT) | NAES register | Njoftime, Duapune | Coverage gaps; significant emigration affects labor supply data |
| Bosnia & Herzegovina | Quarterly + Annual (BHAS) | ZZZ entity registers | Mojposao, KlixPosao | Entity-level fragmentation (RS vs FBiH); definitions inconsistent |
| Serbia | Quarterly (SORS) | NSZ portal | Infostud, NSZ | Better quality; EU candidate harmonization ongoing |

**Visualization strategies for poor data:**

a) **Confidence-flagged displays**: Use visual encoding to show data quality. Traffic light system: green (high confidence, large sample, recent) → amber (small sample, older) → red (estimate, indirect proxy). Applied to each country's data point in comparative charts.

b) **ILO modeled estimates as baseline**: ILOSTAT provides modeled estimates for all countries including Kosovo, North Macedonia. Use these with explicit label "ILO estimate" vs direct survey data.

c) **Missing data as explicit visualization element**: Don't fill gaps — show them. D3 path generator can handle gaps with `.defined(d => d.value !== null)`. A visible gap in the line signals data absence honestly.

d) **Sparse-data-appropriate chart types**: For countries with only annual data points (no quarterly), use dot plots rather than lines (no interpolation implied). For countries with wide confidence intervals, show the interval (not just the point estimate).

e) **Regional aggregation**: When NUTS3 data is missing, show NUTS2 or national with note. Never show false precision.

**LIVLAB implementation guidance:**
The `sources` API endpoint and domain `map_data.json` already encode data source status (Active ✓ / Blocked ⚠). Extend this to drive visual quality indicators in charts — a small data quality icon per data series tooltip.

### 8.4 Seasonal Labor Markets

Greece, Croatia, Montenegro, and coastal Spain/Italy have strongly seasonal labor markets driven by tourism (May–September) and some agriculture (harvest periods).

**The seasonal visualization challenge**: Standard time-series show large oscillations that can be confused with trend. Seasonal adjustment removes the oscillation but hides information relevant to these economies.

**Best practices:**

a) **Show both raw and seasonally-adjusted in same chart**: Two lines, same chart. The raw line shows amplitude of seasonal swing; the smoothed line shows trend. Label both.

b) **Seasonal decomposition visualization**: Show the trend component, seasonal component, and residual component separately (STL decomposition). The seasonal component panel shows the typical seasonal pattern; residual shows genuine surprises.

c) **Year-over-year comparison**: Instead of level trends, plot month-over-month change compared to same month previous year (YoY%). This eliminates seasonality while preserving trend.

d) **Calendar heatmap for seasonality**: Job postings or employment registrations plotted as calendar heatmap (month × year). Immediately reveals seasonal pattern AND year-over-year trend. ECharts v5 has a `calendar` coordinate type specifically for this.

e) **Tourism intensity overlay**: Layer tourism arrivals (or hotel bed nights) data on top of hospitality employment/vacancy data. The strong correlation makes the seasonal mechanism explicit.

**Data sources:**
- ELSTAT accommodation statistics: monthly hotel bed nights, capacity utilization
- EUROSTAT tourism statistics: TOUR_OCC_NIM quarterly
- DYPA hospitality vacancies: peak March–May (recruiting for summer season)
- Greek Social Insurance Fund (ΕΦΚΑ): seasonal employment declarations have a distinct spike in tourism sectors

**Key insight for Greece**: The Greek hospitality labor market has a structural matching problem — workers for summer season are partly sourced from Eastern Europe/Balkans (Bulgaria, Romania, Albania) through seasonal migration. DYPA vacancies peak before this migration flow materializes. This creates an apparent vacancy-unemployment mismatch that is structurally explained by the migration mechanism.

### 8.5 NEET Rate Visualization

NEET (Not in Employment, Education, or Training) is a politically sensitive and analytically important indicator for all LIVLAB priority countries.

**Definition nuances:**
- Standard: 15–29 age group (EU-LFS); some analyses use 15–24 only; ILO uses 15–24
- NEET includes: unemployed youth + inactive youth not in education/training
- NOT NEET: employed youth; unemployed youth in training programs; students (even if not working)
- The "discouraged NEET": neither working nor seeking — often the policy concern

**Country-specific NEET rates (EU-LFS 2024 estimates):**
- Greece: ~17% (15–29) — among EU's highest; peaked at 28% in 2014
- Italy: ~17% — persistently high
- Spain: ~13% — improving
- North Macedonia: ~25%+ — very high; ILO estimates
- Albania: ~22%
- Montenegro: ~18%
- Kosovo: ~25%+
- EU27 average: ~11%

**Recommended NEET visualizations:**

a) **Decomposition waffle chart**: Show NEET rate as waffle (e.g., 17 out of 100 youth), then decompose the 17 into: unemployed-seeking (8) + inactive (9). The inactive component is the policy-hardest.

b) **Gender disaggregated NEET**: In Western Balkans, female NEET far exceeds male NEET (early marriage, care responsibilities). Always show separately. Grouped bar by gender × country is effective.

c) **NEET trend vs youth unemployment trend**: Diverging trends are possible and informative. Greece 2019–2023: youth unemployment fell faster than NEET — indicates some unemployed youth dropped out (became inactive NEET) rather than finding work.

d) **NEET by education level**: Tertiary graduates have much lower NEET in all countries; no-qualification youth have 2–3× average NEET. Horizontal grouped bar with education on y-axis.

e) **NEET regional map**: NUTS2 choropleth of NEET rate — shows urban/rural divide; in Greece, NEET highest in Ipeiros and Eastern Macedonia-Thrace.

### 8.6 Youth Unemployment Visualization

**Key distinctions:**
- Youth unemployment RATE = unemployed youth / labor force youth (includes only active youth). Mechanically high when youth are in education.
- Youth unemployment RATIO = unemployed youth / total youth population. More policy-relevant — shows absolute share of youth out of work.
- The Greek 57% youth unemployment rate in 2013 was the rate, not the ratio (ratio was ~28%) — this confusion is common in media reporting.

**Recommended visualizations:**

a) **Dual indicator display**: Always show BOTH rate AND ratio on same chart with clear labels. The divergence between them (driven by varying youth labor force participation) is itself informative.

b) **Age-profile unemployment curve**: x-axis = single-year age (15, 16, 17, ..., 34), y-axis = unemployment rate. Shows the "age gradient" — rapid decline from 15–24 to 25–34 in most countries. The slope of this gradient shows labor market entry difficulty.

c) **Youth premium visualization**: For each country, show ratio of youth unemployment rate to adult (25–54) unemployment rate. EU average ~2.5×; Greece/Italy ~3×; suggests particularly high entry barriers.

d) **Cohort analysis**: Track a graduating cohort over 3–5 years post-graduation. LFS cohort simulation: take 20-year-olds in 2020, track their employment status in 2021, 2022, 2023, 2024. Greece: particularly long unemployment duration for university graduates post-crisis.

---

## 9. Technical Implementation Stack

### 9.1 Library Decision Matrix

| Use Case | Primary Recommendation | Secondary | Avoid |
|---|---|---|---|
| Time-series, bar, area (standard) | Chart.js v4 | ECharts v5 | D3 (too verbose for standard charts) |
| Geographic maps (choropleth, bubble) | Leaflet 1.9 + D3 color | Maplibre GL JS | Google Maps (licensing) |
| Network graphs, force-directed | D3 v7 | Sigma.js (large graphs) | Cytoscape.js (too rigid) |
| Sankey, alluvial, chord | D3 v7 + d3-sankey | ECharts v5 | Chart.js (not supported) |
| Treemap, sunburst | ECharts v5 | D3 v7 | Chart.js |
| Scatter plot, bubble | Observable Plot | Plotly.js | Chart.js (limited) |
| Box plot, violin | Plotly.js | Observable Plot | Chart.js |
| Radar/spider | Chart.js v4 | ECharts v5 | |
| Large data (>100k points) | ECharts v5 (canvas) | Vega-Lite (WebGL marks) | D3 SVG (performance) |
| Interactive exploration | Observable Plot | Vega-Lite v5 | |
| Word cloud | d3-cloud | — | |
| Forecasting with bands | Chart.js v4 + annotation | Observable Plot | |

### 9.2 Chart.js v4 Deep Dive

**Current LIVLAB stack**: Chart.js v4.4.0 already imported. Best practices for LMI use:

```javascript
// Consistent Chart.js defaults for LIVLAB
Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
Chart.defaults.color = '#8b949e'; // matches --fg-muted in portal CSS
Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';

// Colorblind-safe Okabe-Ito palette
const LIVLAB_COLORS = [
  '#E69F00', '#56B4E9', '#009E73', '#F0E442',
  '#0072B2', '#D55E00', '#CC79A7', '#999999'
];

// Standard responsive config
const standardOptions = {
  responsive: true,
  maintainAspectRatio: false, // use CSS for container height
  plugins: {
    legend: { position: 'top', labels: { padding: 16, usePointStyle: true } },
    tooltip: {
      backgroundColor: 'rgba(22,27,34,0.95)', // dark theme
      titleColor: '#c9d1d9', bodyColor: '#8b949e',
      borderColor: '#30363d', borderWidth: 1,
      padding: 10, cornerRadius: 6
    }
  },
  animation: { duration: 600, easing: 'easeInOutQuart' }
};
```

**Performance for large datasets (100k+ job postings)**:
- Do NOT render 100k points in Chart.js — aggregate first to N time buckets
- Use `decimation` plugin for time-series: `plugins: { decimation: { enabled: true, algorithm: 'lttb', samples: 500 } }`
- LTTB (Largest Triangle Three Buckets) algorithm preserves visual shape while reducing points dramatically

**Accessibility**:
```javascript
// ARIA label on canvas
canvas.setAttribute('role', 'img');
canvas.setAttribute('aria-label', 'Line chart showing Greek unemployment rate 2000–2026');
// Chart.js v4 supports aria-label natively in config:
options: { plugins: { accessibility: { enabled: true } } }
// Consider chartjs-plugin-accessibility for screen reader table generation
```

### 9.3 D3 v7 Patterns for LMI

**Core patterns used throughout this document:**

```javascript
// D3 v7 module imports (ES module)
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

// Standard margin convention
const margin = { top: 20, right: 30, bottom: 40, left: 60 };
const width = container.clientWidth - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('role', 'img').attr('aria-label', 'Chart description')
  .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

// Responsive: use ResizeObserver to redraw on container resize
const ro = new ResizeObserver(() => { /* redraw */ });
ro.observe(container);
```

**D3 performance for large datasets**:
- Use Canvas (not SVG) for > 5,000 rendered elements: `d3.select('canvas').call(myCanvasRenderer)`
- For network graphs > 500 nodes: switch to WebGL via Three.js or sigma.js
- Use `requestAnimationFrame` for force simulation updates to avoid blocking UI

### 9.4 ECharts v5 for Complex Charts

Apache ECharts v5 is the strongest library for treemaps, sunbursts, Sankey, heatmaps, and any chart requiring smooth animation and large data:

```javascript
// Standard ECharts init
const chart = echarts.init(document.getElementById('chart'), 'dark', {
  renderer: 'canvas', // 'svg' also available; canvas faster for large data
  locale: 'EN'
});

// Example: Sankey for occupational transitions
const option = {
  series: [{
    type: 'sankey',
    layout: 'none',
    emphasis: { focus: 'adjacency' },
    data: nodes,
    links: flows.filter(f => f.value > threshold),
    lineStyle: { color: 'gradient', curveness: 0.5 },
    label: { position: 'right' },
    levels: [
      { depth: 0, itemStyle: { color: '#fbb4ae' } },
      { depth: 1, itemStyle: { color: '#b3cde3' } }
    ]
  }]
};
```

**ECharts theme alignment with LIVLAB dark theme**:
ECharts ships built-in 'dark' theme. Customize with `echarts.registerTheme('livlab', { ... })` to match portal CSS variables.

### 9.5 Vega-Lite v5 for Exploratory and Research Visualizations

Vega-Lite is declarative — specify WHAT to show, not HOW to draw it. Best for research portal "explore" tabs where flexibility matters:

```javascript
const spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "url": "/api/insights/greece" },
  "mark": { "type": "point", "filled": true },
  "encoding": {
    "x": { "field": "unemployment_rate", "type": "quantitative", "title": "Unemployment Rate (%)" },
    "y": { "field": "vacancy_rate", "type": "quantitative", "title": "Vacancy Rate (%)" },
    "color": { "field": "year", "type": "ordinal", "scheme": "viridis" },
    "tooltip": [
      { "field": "period" }, { "field": "unemployment_rate" }, { "field": "vacancy_rate" }
    ]
  },
  "title": "Greek Beveridge Curve"
};
vegaEmbed('#beveridge', spec, { theme: 'dark' });
```

**Vega-Lite strengths**:
- Automatic inference of scales, axes, legends
- Built-in interactive selections (`selection: { type: "interval" }`)
- Faceted small multiples with one line of config
- Direct API data binding (connects naturally to LIVLAB's `/api/insights/{domain}` endpoint)

### 9.6 Accessibility Standards

**WCAG 2.1 AA compliance for LMI visualizations:**

a) **Color independence**: Never use color as the ONLY encoding. Add patterns, shapes, or labels.

b) **Colorblind-safe palettes**:
   - Okabe-Ito palette (8 colors): #E69F00, #56B4E9, #009E73, #F0E442, #0072B2, #D55E00, #CC79A7, #999999
   - ColorBrewer: use their colorblind-safe flag subsets
   - Avoid: red/green together; similar hue variations without value contrast

c) **Keyboard navigation**: All interactive charts should support keyboard focus traversal. Chart.js v4 has basic keyboard support; D3 requires manual ARIA implementation.

d) **Screen reader table**: Provide a visually-hidden HTML `<table>` with the same data as each chart. Some libraries (chartjs-plugin-accessibility) do this automatically.

e) **Minimum text size**: 12px minimum for chart labels; 14px for axis titles. High contrast (4.5:1 minimum against background).

f) **Focus indicators**: When hovering/focusing on a data point, provide both visual highlight AND tooltip text.

### 9.7 Responsive Design Patterns

```css
/* Chart container pattern */
.chart-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 default */
}
.chart-wrapper canvas,
.chart-wrapper svg {
  position: absolute;
  top: 0; left: 0;
  width: 100% !important;
  height: 100% !important;
}

/* Breakpoint adaptations */
@media (max-width: 768px) {
  /* Switch horizontal bar to vertical; reduce label count */
  .chart-horizontal-bar { /* ... */ }
  /* Hide secondary series in multi-line charts */
  /* Increase touch target sizes */
}
```

**Mobile-specific chart adaptations:**
- Choropleth maps: reduce NUTS detail level (show NUTS1 only on mobile); larger tooltips for fat-finger interaction
- Network graphs: disable force simulation on mobile (static layout); reduce node count
- Sankey/chord: replace with simplified bar chart on mobile — complex flow diagrams are unusable on small screens
- Time-series: enable pinch-to-zoom (chartjs-plugin-zoom); show 2 years of data by default vs 10 years on desktop

---

## 10. Cross-Cutting Insights and Hidden Connections

### 10.1 The Signal Hierarchy in LMI

Not all LMI signals are created equal. A practical hierarchy for policy relevance:

**Tier 1 — Structural indicators** (change slowly, high confidence):
- Employment rate, unemployment rate (LFS)
- Sectoral composition (LFS, admin)
- Wage levels (administrative)
- Educational attainment of workforce (LFS)

**Tier 2 — Cyclical indicators** (change over months/quarters):
- Vacancy rate (JVS)
- Job opening flows (JOLTS-equivalent)
- New employment registrations (Ergani)
- OJA posting volume index

**Tier 3 — Leading/nowcast indicators** (real-time, noisier):
- OJA postings (daily/weekly)
- LinkedIn Hiring Rate Index (monthly)
- Google Trends for job search terms
- DYPA registration inflows (weekly)

**Visualization implication**: Layer these in dashboards with explicit tier labeling. A dashboard showing all three tiers together without differentiation misleads users about confidence and timing.

### 10.2 The Vocabulary Gap Problem

One of the most underappreciated LMI research problems: **employers and workers use different words for the same things.**

- Employer posts: "proficient in MS Excel, data visualization, stakeholder communication"
- Worker CV says: "Microsoft Office skills, data presentation, client relations"
- ESCO maps both to: "use spreadsheet software" + "communicate with stakeholders" + "data representation techniques"

This vocabulary gap means naive text matching between OJA and CV databases dramatically underestimates skill matches. LIVLAB's `hybrid-semantic-normalization` method directly addresses this.

**Visualization implication**: When showing "skill gaps" (demand exceeds supply), distinguish:
- **True gaps**: skill is demanded but genuinely rare in workforce
- **Vocabulary gaps**: skill exists in workforce but labeled differently
- **Measurement gaps**: skill exists but not captured by either OJA or LFS

### 10.3 The Aggregation Trap

LMI visualizations almost always aggregate — by sector, by occupation, by region. But the aggregates can hide critical variation:

- "Greek unemployment fell from 27% to 12% 2013–2023" — true, but masks: (a) long-term unemployment remains elevated at 4%; (b) youth unemployment still 25%; (c) regional disparities (Epirus 18% vs South Aegean 8%)
- "IT skill demand is growing" — true, but the specific skills within "IT" that are growing vs declining differ enormously (cloud skills up 40% YoY; database administration flat; legacy COBOL systems declining)
- "Blue economy employment growing" — true, but decomposition reveals: aquaculture growing (relevant for Greece/Mediterranean), maritime transport declining, coastal tourism stable but informal

**Visualization solution**: Hierarchical drill-down in all aggregated charts. Every summary statistic should have a "decompose" button revealing the underlying distribution. ECharts treemap with drill-down + Chart.js linked views implement this pattern.

### 10.4 Convergence Indicator for Balkan Integration

For EU-ALMPO project specifically: the key LMI question for Western Balkans is **convergence toward EU standards**. Custom visualization needed:

**Convergence dashboard pattern:**
- Show key LMI indicators for each Balkan country
- Overlay EU-27 average as a reference line
- Color-encode distance from EU average (red = far, green = converged)
- Add "years to convergence" annotation based on trend extrapolation
- Key indicators: unemployment rate, youth unemployment, NEET, employment rate, wage level (PPP-adjusted)

**Countries diverging vs converging** (rough 2024 assessment):
- Serbia: converging on employment rate, unemployment; diverging on wages (emigration keeps supply tight)
- North Macedonia: slow convergence; NEET persistently high
- Albania: strong growth but starting from very low base; informal economy structural
- Montenegro: tourism-driven, seasonal volatility masks structural improvement
- Kosovo: youngest population (median age 28); structural employment challenge; massive emigration

### 10.5 AI/Automation Risk Integration

The LIVLAB knowledge base includes automation risk papers (Frey-Osborne tradition) and AI-specific risk analysis (NBER GenAI paper, arXiv:2506.12345). Visualization recommendations for automation risk:

**The exposure × complement matrix:**
Plot occupations in a 2×2 matrix:
- X-axis: automation exposure risk (0–1)
- Y-axis: AI complementarity potential (0–1)
- Top-right: High exposure AND high complementarity = augmentation (data scientists, lawyers, content creators)
- Top-left: Low exposure, high complementarity = early adopters (managers, teachers)
- Bottom-right: High exposure, low complementarity = displacement risk (data entry, basic processing)
- Bottom-left: Low exposure, low complementarity = manual skilled work (plumbers, electricians — hard to automate + no benefit from AI)

**Greek/Balkan specific consideration:**
High tourism share means many jobs in the bottom-left quadrant (service jobs hard to automate, minimal AI complementarity). This is structurally different from Northern European countries with higher professional/digital workforce shares.

### 10.6 Connecting LIVLAB Projects to Specific Visualizations

**EU-ALMPO** (Active Labour Market Policies Observatory):
- ALMP expenditure per unemployed person: bar chart by country (Eurostat ALMP database LMP_IND_ACT)
- ALMP activation rate: share of unemployed in active measures → stacked bar by measure type (training, employment incentives, subsidized employment)
- Beveridge Curve BEFORE vs AFTER major ALMP reform: overlay two curves to show matching efficiency effect
- ALMP outcome Sankey: program → employment outcome pathway
- Country comparison radar: activation rate, expenditure, employment outcome, speed of activation

**MicroIdea** (VET intelligence):
- VET enrollment by field × country: grouped bar or treemap
- VET graduate employment rate vs non-VET: dumbbell chart per country
- Skill certification map: which ESCO skills are certifiable via VET in each country? Heatmap country × skill cluster
- Employer satisfaction with VET graduates: radar chart by skill cluster

**Growth4Blue / TRAIN4BLUE** (Blue economy):
- Blue economy employment by sector (maritime transport, fisheries, aquaculture, coastal tourism, marine biotech): treemap, sized by employment, colored by growth
- Blue skills co-occurrence network: skills demanded in blue economy job postings
- Geographic concentration: choropleth of blue economy employment share by NUTS2 coastal region
- Adriatic-Ionian skill demand map: bubble map of vacancies in coastal countries (Greece, Italy, Slovenia, Montenegro, Croatia, Albania)
- Upskilling pathway Sankey: existing qualifications (fishing, maritime) → TRAIN4BLUE programs → target occupations

---

## Appendix A: Data Pipeline Architecture for LIVLAB Visualizations

```
OJA Portals (daily)          Administrative (daily/weekly)     Official Stats (quarterly)
       ↓                              ↓                                  ↓
  Crawler ETL              DYPA/Ergani API             Eurostat REST API / ELSTAT Excel
       ↓                              ↓                                  ↓
  Deduplication            Contract flow table          LFS aggregates + microdata
       ↓                              ↓                                  ↓
  ESCO tagging (ESCOXLM-R)     NACE/NUTS3 coding          ISCO-08 occupational coding
       ↓                              ↓                                  ↓
                         ┌────────────┴────────────────────────┐
                         │      Unified Labor Market DB        │
                         │  (occupation × skill × region × t)  │
                         └────────────┬────────────────────────┘
                                      ↓
                         ┌────────────┴─────────────┐
                         │   data/processed/         │
                         │   {domain}_{chart}.json   │
                         └────────────┬─────────────┘
                                      ↓
                         /api/insights/{domain}  →  Portal Viz
```

### Appendix B: Key Data Sources Quick Reference

| Source | Type | Frequency | Coverage | Access | Key for LIVLAB |
|---|---|---|---|---|---|
| ELSTAT LFS SJO01 | Supply | Quarterly | Greece NUTS2 | Free Excel | Long series, regional |
| ELSTAT LFS SJO03 | Supply | Annual | Greece + occ | Free Excel | Occupational breakdown |
| DYPA/Ergani | Admin/Demand | Daily | Greece NUTS3 | API/Portal | Real-time flows |
| Eurostat JVS | Demand | Quarterly | EU27 NUTS2 | API | Harmonized vacancies |
| EU-LFS microdata | Supply | Quarterly | EU27 NUTS2 | Registered | Micro-level analysis |
| ILOSTAT | Supply | Annual+ | Global | API | Balkan estimates |
| Cedefop OVATE | Demand (OJA) | Weekly | EU27 | API/Download | Skills from job postings |
| Cedefop Skills Forecast | Projections | 2–3y | EU27 | Download | 2035 projections |
| BLS JOLTS | Demand | Monthly | US | API | Stock/flow benchmark |
| ESCOXLM-R | Model | — | EU27 | Open source | Occupation tagging |

### Appendix C: Colorblind-Safe Color Schemes for LMI

**Sequential (single variable intensity):**
- Blues (Colorbrewer): #f7fbff → #084594 (vacancy rate, skill demand)
- OrRd: #fff7ec → #7f0000 (unemployment, risk)

**Diverging (above/below average):**
- RdBu: #b2182b → #f7f7f7 → #2166ac (skill gap: shortage → balanced → surplus)
- PiYG: #8e0152 → #f7f7f7 → #276419 (labor market tightness)

**Qualitative (categories):**
- Okabe-Ito 8-color: fully colorblind safe; recommended for all categorical distinctions
- Set2 (Colorbrewer 8-color): acceptable; avoid red-green combinations

**Current LIVLAB portal accent**: `#2f81f7` (blue) — works well as primary series color; use Okabe-Ito for secondary colors.

---

*This document is a living reference for the LIVLAB portal visualization layer. It should be updated as new data sources are onboarded, new visualization libraries emerge, and regional data quality evolves. All quantitative claims should be traced to primary sources; estimates and approximations are labeled as such.*

*Primary sources: Eurostat LFS, ELSTAT SJO01/SJO03, Cedefop Skills-OVATE, BLS JOLTS, ILOSTAT, OOH (BLS), OECD Skills for Jobs, Lightcast methodology papers, LinkedIn Economic Graph reports, D3/Chart.js/ECharts documentation.*
