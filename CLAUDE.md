# Labor Intelligence Virtual Lab — Claude Code Context

## What this project is

This is the **Labor Intelligence Virtual Lab (LIVLAB)** — a research environment for labor market demand and supply analysis. It has:
- A FastAPI backend (`scripts/serve.py`) serving a JSON API over the knowledge base
- A vanilla JS + CSS portal (`portal/`) with 13 tabs (Overview, Landscape, Datasets, Papers, Methods, Applications, Benchmarks, Sources, Lab, Insights, Projects, Playground, Map)
- A structured knowledge base (`knowledge/`) of YAML entries for papers, datasets, methods, applications, benchmarks
- Domain configs (`config/domains/`) for 5 domains: global, united_states, european_union, greece, emerging_markets
- Project configs (`config/projects.yml`) for EU-ALMPO, MicroIdea, Growth4Blue, TRAIN4BLUE
- Map data (`config/domains/*/map_data.json`) with country markers + data source popups

## Lab Constitution (binding rules for all agents)

1. **Evidence first** — every claim traces to a dataset, paper, or primary source
2. **Honest data** — document coverage gaps and quality issues; never hide limitations
3. **Reproducibility** — analyses are logged; pipelines are code
4. **Multi-source** — combine demand (OJA, admin), supply (LFS, surveys), structural (taxonomies, forecasts)
5. **Geographic scope** — priority countries: Greece, Italy, Spain, Serbia, Montenegro, North Macedonia, Albania, Bosnia, Kosovo, Slovenia, Cyprus, Denmark, Egypt (ref)
6. **Methodological currency** — track SOTA; index and implement, not just cite
7. **Open by default** — prefer open datasets; document proprietary access barriers
8. **Cite your sources** — every dataset used, every paper referenced (arXiv ID, DOI, report URL)
9. **Version your methods** — ESCO v1.2, not just "ESCO"
10. **Flag data quality issues** — portal blocking, discontinued series, known biases

## Key data sources by country

| Country | Demand | Supply | Status |
|---------|--------|--------|--------|
| Greece | DYPA/Ergani, 6 portals (Skywalker, Kariera etc) | ELSTAT LFS 1981–2026, ILOSTAT | Active ✓ |
| Italy | Adecco, Randstad, GiGroup, Adzuna, regional portals | ISTAT LFS | Active ✓ |
| Spain | Turijobs, Infoempleo | INE EPA | Active ✓ |
| Serbia | Infostud, NSZ Portal | SORS LFS | Active ✓ |
| Montenegro | Zaposli.me, Prekoveze.me, ZZZCG | MONSTAT | Active ✓ |
| North Macedonia | Vrabotuvanje, Vraboti, Apliciraj | SSO | Active ✓ |
| Albania | Njoftime, Duapune, NAES | INSTAT | Active ✓ |
| Bosnia & Herzegovina | Mojposao, KlixPosao, ZZZRS | BHAS | Active ✓ |
| Kosovo | Kosovajob, Ofertapune, Superpune | ASK | Active ✓ |
| Slovenia | Mojedelo, Optius | SURS | Active ✓ |
| Cyprus | Carierista ⚠ blocked | Eurostat | Blocked ⚠ |
| Denmark | JobNet, IT-Jobbank, StepStone | DST | Active ✓ |

## Dev setup

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add ANTHROPIC_API_KEY
python main.py         # starts at http://localhost:8766
```

## Adding new knowledge entries

- Papers: add `knowledge/papers/<slug>.yml` (see existing files for schema)
- Datasets: add `knowledge/datasets/<slug>.yml`
- Methods: `knowledge/methods/<slug>.yml`
- Applications: `knowledge/applications/<slug>.yml`
- Benchmarks: `knowledge/benchmarks/<slug>.yml`

The server hot-reloads and will pick up new files automatically.

## Adding a new domain

1. Create `config/domains/<slug>/domain.yml`
2. Create `config/domains/<slug>/map_data.json`
3. Optionally add `config/domains/<slug>/content/*.md` for tab content

## API routes

- `GET /api/health` — status check
- `GET /api/domains` — list all domains
- `GET /api/domain/<slug>` — domain config
- `GET /api/domain/<slug>/map` — map markers
- `GET /api/knowledge` — full catalog
- `GET /api/knowledge/<type>` — papers | datasets | methods | applications | benchmarks
- `GET /api/projects` — all projects
- `POST /api/chat` — Claude-powered assistant
- `GET /api/insights/<domain>` — Chart.js data
- `GET /api/sources` — connector status

## Lab projects

- **EU-ALMPO** (2025–2027): Active Labour Market Policies Observatory, 12 countries
- **MicroIdea** (2024–2026): Vocational training intelligence (Erasmus+)
- **Growth4Blue** (2024–2027): Blue economy skills, Adriatic-Ionian
- **TRAIN4BLUE** (2025–2027): Training for the blue economy

Full constitution: `config/constitution.md`
