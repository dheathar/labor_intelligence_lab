# Labor Intelligence Virtual Lab (LIVLAB)

A self-contained research environment for labor market demand and supply analysis — combining a curated knowledge base, live data connectors, autonomous AI agents, and an interactive portal.

---

## What this is

LIVLAB is a research platform for labor market intelligence, built around three pillars:

**Knowledge Base** — 65+ structured YAML entries covering papers, datasets, methods, applications, and benchmarks in labor market NLP, OJA intelligence, skills taxonomy, and ALMP evaluation. Covers Greece, the Western Balkans (WB6), EU, and global scope.

**Lab Rats** — four autonomous AI agents (powered by Claude Haiku via OpenRouter) that run on schedule: discovering new research, pulling live Eurostat/ILOSTAT data, generating visualizations, and monitoring data source health.

**Portal** — a vanilla JS + FastAPI SPA with 13 tabs: Overview, Landscape, Datasets, Papers, Methods, Applications, Benchmarks, Sources, Lab, Insights, Projects, Map, and Interaction (chat with the Lab Assistant or any rat directly).

---

## Quick start

```bash
# 1. Clone and set up
git clone https://github.com/dheathar/labor_intelligence_lab.git
cd labor_intelligence_lab
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements.agents.txt

# 2. Configure
cp .env.example .env
# Add your OPENROUTER_API_KEY to .env (get one at openrouter.ai)

# 3. Run
python main.py                    # Portal on http://localhost:8766
python -m agents.rat_server       # Agents on http://localhost:8767 (separate terminal)
```

Open **http://localhost:8766** in your browser.

---

## Docker (recommended for deployment)

```bash
cp .env.example .env   # add OPENROUTER_API_KEY
docker compose up --build
```

Two services start:
- `portal` — FastAPI + static portal on port 8766
- `agents` — Lab Rats agent server on port 8767 (proxied through portal)

---

## Architecture

```
labor_intelligence_lab/
├── portal/                    # Frontend SPA
│   ├── index.html             # 13-tab single-page app
│   ├── app.js                 # Domain state machine + tab renderers + agent chat
│   └── styles.css             # GitHub Primer dark/light/rat themes
│
├── scripts/
│   └── serve.py               # FastAPI backend — API routes + static serving
│
├── agents/
│   ├── openharness/           # Custom agent loop (no external framework)
│   │   ├── agent.py           # ReAct loop via OpenRouter OpenAI-compatible API
│   │   ├── tools.py           # 15 tools: KB CRUD, wiki, web, memory, source status
│   │   ├── scheduler.py       # APScheduler background jobs
│   │   └── constitution.py    # Lab constitution — 4 binding research principles
│   ├── rats/
│   │   ├── rat_researcher.py  # Discovers papers/datasets → writes KB entries
│   │   ├── rat_analyst.py     # Pulls Eurostat/ILOSTAT data → writes chart JSON
│   │   ├── rat_visualizer.py  # Reads KB + data → generates Insights tab charts
│   │   └── rat_monitor.py     # Pings all 16 data sources → updates health status
│   ├── templates/             # YAML schemas for each KB entry type
│   └── rat_server.py          # FastAPI server (port 8767) — agent API
│
├── knowledge/
│   ├── papers/                # ~30 research papers (YAML)
│   ├── datasets/              # ~20 datasets (YAML)
│   ├── methods/               # ~14 NLP/ML methods (YAML)
│   ├── applications/          # ~8 use-case applications (YAML)
│   ├── benchmarks/            # ~5 benchmarks (YAML)
│   └── wiki/                  # Karpathy-style first-principles articles (Markdown)
│       ├── llm-fundamentals.md
│       ├── transformers-attention.md
│       ├── embeddings-retrieval.md
│       ├── fine-tuning.md
│       ├── multilingual-nlp.md
│       ├── agent-architectures.md
│       └── oja-nlp-pipeline.md
│
├── config/
│   ├── constitution.md        # Lab Constitution (10 binding rules)
│   ├── projects.yml           # Active research projects
│   └── domains/               # Per-domain config + map data
│       ├── global/
│       ├── european_union/
│       ├── greece/
│       ├── united_states/
│       └── emerging_markets/
│
├── sources/                   # Python data connectors (BLS, ESCO, Eurostat, etc.)
├── data/                      # Raw + processed data (gitignored)
├── Dockerfile                 # Portal image
├── Dockerfile.agents          # Agents image
└── docker-compose.yml         # Full stack
```

---

## Lab Rats

Four autonomous agents run on a schedule and can also be triggered manually from the portal (Sources tab or Interaction tab).

| Rat | Role | Schedule | Model |
|-----|------|----------|-------|
| `rat_researcher` | Discovers new papers, datasets, methods from arXiv, Cedefop, ILO | Every 12h | Claude Haiku 4.5 |
| `rat_analyst` | Pulls live Eurostat/ILOSTAT data, writes chart JSON | Every 6h | Claude Haiku 4.5 |
| `rat_visualizer` | Reads KB + data, generates Insights tab charts | Every 6h | Claude Haiku 4.5 |
| `rat_monitor` | Pings all 16 data sources, updates health status | Every 30m | Claude Haiku 4.5 |

All rats have access to a shared tool registry:

- **KB tools**: `list_knowledge`, `read_knowledge_entry`, `write_knowledge_entry`
- **Wiki tools**: `list_wiki`, `read_wiki`, `write_wiki`
- **Web tools**: `fetch_url`, `ping_url`
- **Data tools**: `list_raw_data`, `read_raw_data`, `write_raw_data`
- **Memory tools**: `read_rat_memory`, `write_rat_memory`
- **Source tools**: `read_sources_status`, `write_sources_status`

The agent loop is `agents/openharness/agent.py` — a plain ReAct loop (~115 lines) using the `openai` package pointed at `https://openrouter.ai/api/v1`. No external agent framework.

---

## Interaction tab

The portal's Interaction tab (`🐀 Interaction`) lets you chat directly with the Lab Assistant or any rat:

- **Lab Assistant** — general labor market Q&A, powered by the full knowledge base
- **@mention routing** — type `@rat_researcher` in any message to route to that rat
- **Per-agent history** — each agent maintains its own conversation thread
- **Tool call display** — tool calls made during a run are shown as chips

**Easter egg**: type `skaven mode on` to any rat to activate Warhammer Skaven warlord speech mode. Full research quality maintained. `skaven mode off` to return to normal.

---

## Knowledge base

### Adding a new entry

Copy the relevant template from `agents/templates/`, fill in the required fields, and drop the file in the appropriate `knowledge/` subfolder. The server hot-reloads.

```bash
cp agents/templates/paper.yml knowledge/papers/myauthor-keyword-2026.yml
# edit the file
# server picks it up immediately — no restart needed
```

Templates available: `paper.yml`, `dataset.yml`, `method.yml`, `application.yml`, `benchmark.yml`

Each template has:
- Required vs optional fields clearly marked
- Inline notes about which Lab Constitution rules apply
- Example values for every field

### Schema overview

**Papers**: `slug`, `title`, `authors`, `year`, `venue`, `url`, `topics`, `domain`, `abstract`, `key_findings`, `livlab_relevance`

**Datasets**: `slug`, `name`, `source`, `geography`, `type`, `access`, `url`, `description`, `tags`, `quality_notes`

**Methods**: `slug`, `name`, `category`, `status`, `description`, `livlab_application`

**Applications**: `slug`, `name`, `category`, `status`, `description`, `data_sources`, `livlab_relevance`

**Benchmarks**: `slug`, `name`, `task`, `description`, `metrics`, `leaderboard`

---

## Wiki

`knowledge/wiki/` contains Karpathy-style first-principles articles that serve as the rats' internal knowledge base for AI/NLP concepts:

| Article | What it covers |
|---------|---------------|
| `llm-fundamentals.md` | Tokenization, pretraining, RLHF, context windows, prompt engineering |
| `transformers-attention.md` | Self-attention, multi-head attention, BERT vs GPT, Flash Attention |
| `embeddings-retrieval.md` | Sentence transformers, ESCOXLM-R, vector DBs, RAG, hybrid search |
| `fine-tuning.md` | LoRA, QLoRA, SetFit, training data for ESCO matching, evaluation |
| `multilingual-nlp.md` | XLM-R, Greek NLP, WB6 language coverage, ESCO multilingual gaps |
| `agent-architectures.md` | ReAct loop, tool design, memory, multi-agent patterns, prompt injection |
| `oja-nlp-pipeline.md` | OJA extraction → dedup → ISCO classification → skill normalization → ESCO |

Rats can read wiki articles via `read_wiki(slug)` and expand the wiki via `write_wiki(slug, content)`.

---

## Lab Constitution

Four binding principles for all agents and all knowledge entries:

1. **Ground your work** — claims need evidence; cite sources with URL/DOI/arXiv ID; flag gaps honestly
2. **Stay specific** — name the version (ESCO v1.2), name the model (ESCOXLM-R Beauchemin 2023)
3. **Know your geography** — be explicit about which countries your analysis covers; priority scope: Greece, WB6, Italy, Spain, Denmark
4. **Use the templates** — use `agents/templates/<type>.yml` for all knowledge entries; follow the schema

Full constitution: `config/constitution.md`

---

## API reference

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server status + catalog counts |
| GET | `/api/domains` | List all domains |
| GET | `/api/domain/<slug>` | Domain config |
| GET | `/api/domain/<slug>/map` | Map markers |
| GET | `/api/knowledge` | Full KB catalog (all types) |
| GET | `/api/knowledge/<type>` | `papers` \| `datasets` \| `methods` \| `applications` \| `benchmarks` |
| GET | `/api/projects` | All lab projects |
| POST | `/api/chat` | Lab Assistant chat (body: `{"message": "..."}`) |
| GET | `/api/insights/<domain>` | Chart.js data for Insights tab |
| GET | `/api/sources` | Source connector status |
| GET | `/api/rats` | All rats status (proxied to agent server) |
| POST | `/api/rats/<name>/run` | Trigger scheduled rat task |
| POST | `/api/rats/<name>/chat` | Chat with a specific rat (body: `{"message": "..."}`) |
| GET | `/api/rats/status/jobs` | Scheduler job list |

---

## Configuration

### `.env` file

```bash
# Required
OPENROUTER_API_KEY=sk-or-v1-...    # openrouter.ai — powers all AI (assistant + rats)

# Optional — defaults shown
LAB_HOST=0.0.0.0
LAB_PORT=8766
CHAT_MODEL=anthropic/claude-haiku-4-5

# Rat models (all default to claude-haiku-4-5 if not set)
RAT_MODEL_RESEARCHER=anthropic/claude-haiku-4-5
RAT_MODEL_ANALYST=anthropic/claude-haiku-4-5
RAT_MODEL_VISUALIZER=anthropic/claude-haiku-4-5
RAT_MODEL_MONITOR=anthropic/claude-haiku-4-5

# Optional API keys for data connectors
BLS_API_KEY=
ONET_USERNAME=
ONET_PASSWORD=
```

Get an OpenRouter API key at [openrouter.ai](https://openrouter.ai). The free tier works; adding a payment method increases rate limits significantly.

### Themes

The portal supports three themes, cycled via the theme button:
- **Light** (☀️) — GitHub Primer light
- **Dark** (🌙) — GitHub Primer dark
- **Rat** (🐀) — sewer noir with warpstone green accents

---

## Active projects

| Project | Period | Description |
|---------|--------|-------------|
| **EU-ALMPO** | 2025–2027 | Active Labour Market Policies Observatory, 12 countries |
| **MicroIdea** | 2024–2026 | Vocational training intelligence (Erasmus+) |
| **Growth4Blue** | 2024–2027 | Blue economy skills, Adriatic-Ionian region |
| **TRAIN4BLUE** | 2025–2027 | Training for the blue economy |

---

## Data sources

LIVLAB monitors 16 live data sources across Greece, Western Balkans, EU, and global:

| Country/Region | Sources |
|----------------|---------|
| Greece | DYPA/Ergani, Skywalker, Kariera, ELSTAT |
| EU/Global APIs | Eurostat REST, ILOSTAT, ESCO API, Cedefop Skills-OVATE |
| Western Balkans | Infostud (SRB), Zaposli.me (MNE), Vrabotuvanje (MKD), Njoftime (ALB), Mojposao (BiH), Kosovajob |
| Other EU | JobNet (DK), Mojedelo (SI), Carierista (CY ⚠ blocked) |

Source health is updated automatically every 30 minutes by `rat_monitor`.

---

## Development

### Adding a new domain

1. Create `config/domains/<slug>/domain.yml`
2. Create `config/domains/<slug>/map_data.json`
3. Optionally add `config/domains/<slug>/content/*.md` for tab content

### Adding a new rat tool

In `agents/openharness/tools.py`:

```python
@tool("my_tool", "Description of what this tool does")
def my_tool(param: str) -> str:
    # implementation
    return result
```

The decorator automatically registers the tool and infers the JSON Schema from the function signature. Add the tool name to the rat's `ALLOWED_TOOLS` list.

### Running tests

```bash
# Quick smoke test
curl http://localhost:8766/api/health
curl http://localhost:8766/api/knowledge | python3 -c "import sys,json; d=json.load(sys.stdin); print('entries:', sum(len(v) for v in d.values()))"

# Trigger a rat manually
curl -X POST http://localhost:8766/api/rats/rat_monitor/run
```

---

## License

Research code. See individual data source terms for data usage rights.

---

*Built with FastAPI, vanilla JS, Claude Haiku 4.5, and an unhealthy appreciation for Warhammer lore.*
