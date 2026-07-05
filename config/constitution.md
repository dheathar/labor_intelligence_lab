# Labor Intelligence Virtual Lab — Constitution

## Mission

The **Labor Intelligence Virtual Lab (LIVLAB)** is an open research environment for studying, analyzing, and building on labor market demand and supply data. Our mission is to advance evidence-based understanding of how labor markets work, how they are changing, and how they can be better served by intelligent systems.

## Principles

### 1. Evidence First
Every claim about labor markets must be traceable to a dataset, paper, or primary source. We do not accept anecdote or convention as evidence. All findings reference their source explicitly.

### 2. Honest Data
We document what data exists, what it covers, its quality, and its limitations. A dataset card that says "access: registration-required" or "⚠ scraping blocked" is as valuable as one with open API access. Honest gaps prevent false confidence.

### 3. Reproducibility
All analyses should be reproducible. Data pipelines are code. Experiments are logged with their data version, method, and parameters. A result that cannot be reproduced is a hypothesis, not a finding.

### 4. Multi-Source Coverage
No single portal, survey, or taxonomy captures the full labor market. We systematically combine:
- **Demand signals**: job postings (OJA), administrative registers, employer surveys
- **Supply signals**: household surveys (LFS), administrative records, education data
- **Structural context**: taxonomies (ESCO, O*NET), forecasts (Cedefop, BLS), policy reports

### 5. Geographic Breadth with Local Depth
The lab maintains awareness of global patterns while going deep on specific geographies. Priority countries reflect active research: Greece, Italy, Spain, Western Balkans (Serbia, Montenegro, North Macedonia, Albania, Bosnia, Kosovo), Slovenia, Cyprus, Denmark, and emerging market comparators.

### 6. Methodological Currency
We track the state of the art. Lab methods are updated when better approaches emerge. We index papers and implement methods — not just cite them.

### 7. Open by Default
Data, code, and findings are shared to the extent permitted by data licenses. We prefer open datasets (BLS, O*NET, ESCO, ILOSTAT) and document access barriers for proprietary sources.

## Research Scope

The lab studies:
- **Labor demand**: what skills and roles employers are seeking, via OJA analysis
- **Labor supply**: who is available, with what skills, at what wage, via survey and admin data
- **Skills intelligence**: extraction, classification, and forecasting of skill requirements
- **Occupational transitions**: how workers move between roles, driven by AI and structural change
- **Wage dynamics**: wage levels, gaps, and their determinants
- **Policy impact**: how ALMPs and education systems affect labor market outcomes
- **Forecasting**: short- and medium-term labor demand prediction using ML methods

## Lab Projects

The lab participates in four active projects:
- **EU-ALMPO** (2025–2027) — Active Labour Market Policies Observatory, 12+ countries
- **MicroIdea** (2024–2026) — Vocational training intelligence, Erasmus+
- **Growth4Blue** (2024–2027) — Blue economy skills, Adriatic-Ionian region
- **TRAIN4BLUE** (2025–2027) — Training for the blue economy

## Code of Practice

1. **Cite your sources** — every dataset used, every paper referenced
2. **Document your data** — size, coverage, access method, last updated
3. **Log your experiments** — what you ran, what you found, what failed
4. **Version your methods** — ESCO v1.2, not just "ESCO"
5. **Flag data quality issues** — portal blocking, discontinued series, known biases
6. **Respect data licenses** — EUPL 1.2 (ESCO), CC for public datasets, privacy for microdata

## Lab Members and Roles

- **Principal Investigator**: DMLab, University of Western Macedonia
- **Data Engineering**: crawler and ETL pipeline development
- **Research**: skill extraction, forecasting, and analysis
- **Infrastructure**: portal development, data storage, API integrations

---

## Concept Population

Every entry in the LIVLAB knowledge graph — papers, datasets, methods, applications, benchmarks, wiki, projects, portals, deliverables, work packages, roles, and occupations — must conform to the **Concept Population Charter** (`config/concept_charter.md`). The charter defines required fields, minimum edges, and quality gates per type. New concept types must be registered in the charter before entries are created.

Validate with:
```bash
python scripts/check_okf.py           # OKF v0.1 conformance
python scripts/validate_concepts.py   # LIVLAB structural rules
```

---

*This constitution is a living document. It evolves as the lab's scope and methods evolve.*
