# LIVLAB Concept Population Charter

> **What this is:** The definitive specification for every concept type in the LIVLAB knowledge graph. Defines what fields each entry must have, what edges it must form, and what constitution principles apply. Both humans and lab rats follow this when adding entries.
>
> **Where it lives:** `config/concept_charter.md`
> **Related:** `config/constitution.md` (principles), `agents/templates/` (YAML templates for KB types), `knowledge/okf_bundle/` (OKF v0.1 conformant export), `scripts/check_okf.py` (validator)

---

## 1. How to use this charter

1. **Adding a new entry?** Find your concept type below. Populate every REQUIRED field. Link to at least the minimum edges specified.
2. **Reviewing a rat's output?** Check the entry against its type spec. Reject entries missing REQUIRED fields or minimum edges.
3. **Validating the bundle?** Run `python scripts/check_okf.py` for OKF conformance. The rules in section 4 below define additional LIVLAB-specific validation.

---

## 2. Concept types at a glance

| Type | OKF type | Source location | Count | Template |
|---|---|---|---|---|
| Papers | `Paper` | `knowledge/papers/*.yml` | 21 | `agents/templates/paper.yml` |
| Datasets | `Dataset` | `knowledge/datasets/*.yml` | 17 | `agents/templates/dataset.yml` |
| Methods | `Method` | `knowledge/methods/*.yml` | 13 | `agents/templates/method.yml` |
| Applications | `Application` | `knowledge/applications/*.yml` | 9 | `agents/templates/application.yml` |
| Benchmarks | `Benchmark` | `knowledge/benchmarks/*.yml` | 5 | `agents/templates/benchmark.yml` |
| Wiki | `Wiki Article` | `knowledge/wiki/*.md` | 7 | (prose convention) |
| Projects | `Project` | `config/projects.yml` | 4 | (this charter) |
| Portals | `Data Portal` | `portal/app.js` PORTALS_DATA | 41 | (this charter) |
| Deliverables | `Deliverable` | `config/projects.yml` | 25 | (this charter) |
| Work Packages | `Work Package` | `config/projects.yml` | 9 | (this charter) |
| Roles | `User Role` | hardcoded in generator | 5 | (this charter) |
| Occupations | `Occupation` | `portal/js/viz_core.js` OCC18 | 18 | (this charter) |

---

## 3. Edge taxonomy

Edges express directed relationships between concepts. The knowledge graph and OKF bundle use these edge kinds:

| Edge kind | Source → Target | Meaning | Derived from |
|---|---|---|---|
| `uses-dataset` | Paper/Application → Dataset | Uses this dataset for training or analysis | `datasets_used` / `data_sources` field |
| `uses-method` | Paper/Application → Method | Applies this method | `methods_used` / `methods` field |
| `method-of` | Method → Paper | This method is described in this paper | `paper` field on method |
| `sota-on` | Method → Benchmark | Achieves state-of-the-art on this benchmark | `sota_benchmarks` field on method |
| `cites` | Wiki → Paper | Wiki article cites this paper | arXiv ID match or Author Year regex in wiki prose |
| `used-by-project` | Portal → Project | Portal is crawled for this project | `projects` array in PORTALS_DATA |
| `deliverable-of` | Deliverable → Project | Deliverable belongs to this project | `_project_slug` on deliverable |
| `belongs-to-wp` | Deliverable → Work Package | Deliverable is produced by this WP | `wp` field on deliverable |
| `wp-of-project` | Work Package → Project | WP is part of this project | `_project_slug` on WP |
| `produces` | Work Package → Deliverable | WP produces this deliverable | `deliverables` array on WP |
| `classified-by` | Occupation → Dataset (ESCO) | Occupation is classified in this taxonomy | implicit ISCO → ESCO link |

---

## 4. Detailed type specifications

### 4.1 Papers

**Constitution principles:** [1] Evidence First, [6] Methodological Currency, [9] Version your methods

**Source:** `knowledge/papers/<slug>.yml` using `agents/templates/paper.yml`

| Field | Required? | Description |
|---|---|---|
| `slug` | REQUIRED | lowercase-kebab, unique across `papers/` |
| `title` | REQUIRED | Full paper title as published |
| `authors` | REQUIRED | List of author names |
| `year` | REQUIRED | Publication year (integer) |
| `venue` | REQUIRED | Conference, journal, or `arXiv` |
| `url` | REQUIRED | Landing page or PDF link |
| `topics` | REQUIRED | lowercase-kebab keyword tags |
| `domain` | REQUIRED | `global` / `european_union` / `greece` / `emerging_markets` / `united_states` |
| `abstract` | REQUIRED | 2–4 sentence paraphrase (not copy-paste) |
| `key_findings` | REQUIRED | 3–6 bullet points with specific numbers |
| `livlab_relevance` | REQUIRED | Why this paper matters to LIVLAB specifically |
| `arxiv_id` | Recommended | `XXXX.XXXXX` format — enables wiki citation mining |
| `doi` | Optional | Digital Object Identifier |
| `methods_used` | Recommended | Slugs from `knowledge/methods/` |
| `datasets_used` | Recommended | Slugs from `knowledge/datasets/` |

**Minimum edges:** At least 1 (`datasets_used` or `methods_used`). A paper with zero edges is a red flag — every paper uses some data or method.

**Quality gate:** If `arxiv_id` is present, it must be unique across all papers. Duplicate arXiv IDs create false citation edges.

---

### 4.2 Datasets

**Constitution principles:** [2] Honest Data, [4] Multi-Source Coverage, [7] Open by Default, [10] Flag Data Quality

**Source:** `knowledge/datasets/<slug>.yml` using `agents/templates/dataset.yml`

| Field | Required? | Description |
|---|---|---|
| `slug` | REQUIRED | lowercase-kebab, unique across `datasets/` |
| `name` | REQUIRED | Full dataset name |
| `source` | REQUIRED | Publishing organisation |
| `geography` | REQUIRED | List of regions/countries (ISO codes or named regions) |
| `type` | REQUIRED | `survey` / `administrative` / `job-postings` / `official-statistics` / `taxonomy` / `projections` |
| `access` | REQUIRED | `free` / `free-download` / `registration-required` / `research-request` / `commercial` |
| `url` | REQUIRED | Direct link to dataset or portal |
| `description` | REQUIRED | 2–4 sentences: what it contains, unit of observation, coverage |
| `tags` | REQUIRED | lowercase-kebab keywords |
| `quality_notes` | REQUIRED | Known issues, biases, gaps. Never blank — write "No known quality issues as of YYYY-MM" if clean |
| `api_available` | Recommended | `true` / `false` |
| `update_frequency` | Recommended | `daily` / `monthly` / `quarterly` / `annual` / `irregular` / `discontinued` |
| `size` | Optional | Approximate volume |

**Minimum edges:** 0 required (datasets are referenced BY papers/applications). But a dataset with zero incoming edges after 30 days is stale — either link it or flag it.

**Quality gate:** `quality_notes` must never be empty. Constitution principle [2] requires honest documentation of gaps.

---

### 4.3 Methods

**Constitution principles:** [6] Methodological Currency, [9] Version your methods

**Source:** `knowledge/methods/<slug>.yml` using `agents/templates/method.yml`

| Field | Required? | Description |
|---|---|---|
| `slug` | REQUIRED | lowercase-kebab |
| `name` | REQUIRED | Human-readable method name |
| `category` | REQUIRED | `nlp` / `forecasting` / `taxonomy` / `econometrics` / `matching` / `classification` / `embedding` |
| `status` | REQUIRED | `active` / `experimental` / `archived` / `superseded` |
| `description` | REQUIRED | 2–4 sentences: what problem, how it works, key technique |
| `livlab_application` | REQUIRED | How LIVLAB uses or plans to use this method |
| `paper` | Recommended | Slug of the paper that introduced this method |
| `sota_benchmarks` | Recommended | Benchmark slugs where this method is SOTA |
| `strengths` | Recommended | List of advantages |
| `weaknesses` | Recommended | List of limitations |

**Minimum edges:** At least 1 (`paper` reference or `sota_benchmarks` link). A method disconnected from both its source paper and any benchmark is ungrounded.

---

### 4.4 Applications

**Constitution principles:** [1] Evidence First, [3] Reproducibility

**Source:** `knowledge/applications/<slug>.yml` using `agents/templates/application.yml`

| Field | Required? | Description |
|---|---|---|
| `slug` | REQUIRED | lowercase-kebab |
| `name` | REQUIRED | Application name |
| `category` | REQUIRED | `skills-gap` / `demand-forecasting` / `career-pathways` / `policy-analysis` / `wage-estimation` / `job-matching` / `oja-intelligence` / `regional-analysis` |
| `status` | REQUIRED | `research` / `prototype` / `production` |
| `description` | REQUIRED | What it does, who uses it, what decisions it informs |
| `data_sources` | REQUIRED | Dataset slugs — must resolve to existing datasets |
| `livlab_relevance` | REQUIRED | Connection to LIVLAB mission and active projects |
| `methods` | Recommended | Method slugs used in this application |
| `project` | Recommended | `eu-almpo` / `microidea` / `growth4blue` / `train4blue` / `internal` |

**Minimum edges:** At least 1 `data_sources` link. An application with no data source is aspirational, not real.

---

### 4.5 Benchmarks

**Constitution principles:** [1] Evidence First, [6] Methodological Currency

**Source:** `knowledge/benchmarks/<slug>.yml` using `agents/templates/benchmark.yml`

| Field | Required? | Description |
|---|---|---|
| `slug` | REQUIRED | lowercase-kebab |
| `name` | REQUIRED | Benchmark name |
| `task` | REQUIRED | `skill-extraction` / `occupation-classification` / `wage-prediction` / `ner` / `other` |
| `description` | REQUIRED | What capability it measures, how test set was built |
| `metrics` | REQUIRED | List of metric names (`f1-macro`, `precision`, `recall`, etc.) |
| `url` | REQUIRED | Benchmark page or paper |
| `year` | Recommended | Year of latest version |

**Minimum edges:** 0 required (benchmarks are referenced BY methods via `sota-on`).

---

### 4.6 Wiki

**Constitution principles:** [1] Evidence First, [6] Methodological Currency

**Source:** `knowledge/wiki/<slug>.md` (Karpathy-style first-principles articles)

| Element | Required? | Description |
|---|---|---|
| H1 title | REQUIRED | First line: `# Title` |
| Subtitle | Recommended | Italic line after H1 |
| Body | REQUIRED | Substantive prose with headings, code examples, tables |
| References section | REQUIRED | External sources listed at the end |

**Minimum edges:** At least 1 `cites` edge to a paper. A wiki article that cites no papers is editorial, not research. Citation mining works via:
- `arXiv:XXXX.XXXXX` in prose (high confidence)
- `Author et al. YEAR` pattern match (heuristic)

**Quality gate:** Wiki articles should be first-principles explanations, not blog posts. Every claim about model performance must cite a specific paper with arXiv ID or URL.

---

### 4.7 Projects

**Source:** `config/projects.yml`

| Field | Required? | Description |
|---|---|---|
| `slug` | REQUIRED | lowercase-kebab (`eu-almpo`, `microidea`, `growth4blue`, `train4blue`) |
| `name` | REQUIRED | Short project name |
| `full_name` | REQUIRED | Full project title |
| `period` | REQUIRED | Year range (`2025–2027`) |
| `status` | REQUIRED | `active` / `completed` / `planned` |
| `description` | REQUIRED | What the project does |
| `countries` | REQUIRED | List of countries involved |
| `work_packages` | Recommended | List of WP definitions |
| `deliverables` | Recommended | List of deliverable definitions |
| `data_sources` | Recommended | List of data source descriptions |
| `programme` | Optional | Funding programme |

**Minimum edges:** At least 1 deliverable or 1 work package. A project with no deliverables is a concept, not a commitment.

**Adding a new project:** Add to the `projects` list in `config/projects.yml`. Then add its portals (set `projects` array in PORTALS_DATA entries). Then re-run both generators.

---

### 4.8 Portals

**Source:** `portal/app.js` → `PORTALS_DATA` array

| Field | Required? | Description |
|---|---|---|
| `name` | REQUIRED | Portal display name |
| `url` | REQUIRED | Portal URL |
| `country` | REQUIRED | Country name |
| `status` | REQUIRED | `true` (active) / `false` (inactive/blocked) |
| `projects` | REQUIRED | Array of project names (`EU-ALMPO`, `MICROIDEA`, `GROWTH4BLUE`, `TRAIN4BLUE`) |
| `metadata` | Recommended | `true` if job metadata is extractable |
| `comment` | Optional | Notes on blocking, scraping issues |
| `start` | Optional | Crawling start date |

**Minimum edges:** At least 1 `projects` link. A portal not used by any project is not being crawled — it should either be linked or removed.

**Quality gate:** If `status: false`, the `comment` field must explain why (IP blocked, JS-rendered, discontinued, etc.). Constitution principle [10] requires honest quality flags.

**Adding a new portal:** Add an object to `PORTALS_DATA` in `portal/app.js`. Use the exact format of existing entries. Then re-run `python scripts/build_knowledge_graph.py`.

---

### 4.9 Deliverables

**Source:** `config/projects.yml` → `projects[].deliverables[]`

| Field | Required? | Description |
|---|---|---|
| `id` | REQUIRED | Deliverable ID (`D4.1`, `D2.2.1`) |
| `title` | REQUIRED | Deliverable title |
| `wp` | REQUIRED | Work package ID (`WP4`) |
| `lead` | REQUIRED | Partner short name leading this deliverable |
| `type` | REQUIRED | `Report` / `Software` / `Prototype` / `Dataset/Tool` / `Website/Media` / `DMP` |
| `access` | REQUIRED | `Public` / `Sensitive` / `Confidential` |
| `due_month` | REQUIRED | Month number from project start |
| `description` | Recommended | What the deliverable contains |

**Minimum edges:** Exactly 1 `deliverable-of` (to its project) and 1 `belongs-to-wp` (to its WP). A deliverable without both links is malformed.

**Adding a deliverable:** Add to the `deliverables` list inside the project's entry in `config/projects.yml`. The `wp` field must match an existing WP id.

---

### 4.10 Work Packages

**Source:** `config/projects.yml` → `projects[].work_packages[]`

| Field | Required? | Description |
|---|---|---|
| `id` | REQUIRED | WP ID (`WP1`–`WP9`) |
| `title` | REQUIRED | WP title |
| `lead` | REQUIRED | Partner short name leading this WP |
| `start_month` | REQUIRED | Start month from project start |
| `end_month` | REQUIRED | End month from project start |
| `person_months` | REQUIRED | Total effort in person-months |
| `objective` | REQUIRED | What the WP accomplishes |
| `tasks` | Recommended | List of task descriptions |
| `deliverables` | REQUIRED | List of deliverable IDs produced by this WP |

**Minimum edges:** At least 1 `wp-of-project` and at least 1 `produces` (to a deliverable). A WP with no deliverables is incomplete.

---

### 4.11 Roles

**Source:** Hardcoded in `scripts/build_knowledge_graph.py` → `ROLES_DATA`

| Field | Required? | Description |
|---|---|---|
| `slug` | REQUIRED | Role slug (`hiring`, `planner`, `researcher`, `policy-analyst`, `career-advisor`) |
| `name` | REQUIRED | Role display name |
| `description` | REQUIRED | What decisions this persona makes, what data they need |
| `charts` | REQUIRED | List of visualization names this role views |

**Minimum edges:** 0 (roles are leaf nodes — consumers of the knowledge graph, not producers).

**Adding a role:** Add to `ROLES_DATA` in `scripts/build_knowledge_graph.py`, then add the role's panel renderer in `portal/js/viz_roles.js`.

---

### 4.12 Occupations

**Source:** `portal/js/viz_core.js` → `OCC18` array

| Field | Required? | Description |
|---|---|---|
| `name` | REQUIRED | Occupation display name |
| `sector` | REQUIRED | Sector code (`ict`, `health`, `biz`, `eng`, `edu`, `srv`, `trn`, `adm`) |
| `isco` | REQUIRED | ISCO-08 4-digit code |

**Minimum edges:** 1 `classified-by` edge to the ESCO dataset (implicit).

**Adding an occupation:** Add to `OCC18` in `portal/js/viz_core.js`. Must include demand time-series data for visualizations.

---

## 5. Validation rules

### 5.1 OKF conformance (enforced by `scripts/check_okf.py`)

1. Every `.md` file in `okf_bundle/` has parseable YAML frontmatter
2. Every frontmatter has a non-empty `type` field
3. Reserved filenames (`index.md`, `log.md`) have no frontmatter
4. All cross-links point to existing concept files

### 5.2 LIVLAB structural rules (should be enforced by a future validator)

| Rule | Severity | Check |
|---|---|---|
| Every concept has a non-empty `title` | ERROR | No untitled nodes in graph |
| Every concept has a non-empty `description` | WARN | Orphan/empty descriptions reduce graph usefulness |
| Papers have at least 1 edge | WARN | Zero-edge papers are ungrounded |
| Methods link to their source paper | WARN | `paper` field should resolve to an existing paper |
| Applications have at least 1 data source | ERROR | `data_sources` must list at least 1 existing dataset slug |
| Portals link to at least 1 project | ERROR | `projects` array must be non-empty |
| Deliverables link to their WP and project | ERROR | Both `wp` and project must resolve |
| Datasets have `quality_notes` | ERROR | Constitution [2] — never blank |
| Portal `status: false` has a `comment` | ERROR | Constitution [10] — explain why blocked |
| No orphan concepts (zero-degree nodes) | WARN | After 30 days, orphans should be linked or flagged |

### 5.3 Regeneration

After any change to source files, re-run both generators:

```bash
python scripts/build_knowledge_graph.py    # updates bundle.json + knowledge_graph.html
python scripts/publish_okf.py              # updates knowledge/okf_bundle/
python scripts/check_okf.py                # validates OKF conformance
```

---

## 6. Relationship to the OKF bundle

The OKF bundle (`knowledge/okf_bundle/`) is generated from the same source files as the knowledge graph. It is the **exchange format** — portable, vendor-neutral, consumable by any OKF-aware tool. The relationship:

```
Source files (YAML/JS)
        │
        ├── build_knowledge_graph.py ──→ bundle.json + knowledge_graph.html
        │                                   (exchange + visualization)
        │
        └── publish_okf.py ──→ okf_bundle/*.md
                                    (OKF v0.1 conformant directory tree)
```

Every concept in the graph has a 1:1 mapping to a `.md` file in the OKF bundle. Edges become inline markdown cross-links (`[Title](/type/slug.md)`) in concept bodies. The OKF type field uses the OKF type names from section 2.

---

## 7. Constitution principle mapping

| Principle | Which types it governs | How to enforce |
|---|---|---|
| [1] Evidence First | Papers, Methods, Applications, Benchmarks, Wiki | Every claim cites a source; papers list `datasets_used`; wiki cites papers |
| [2] Honest Data | Datasets, Portals | `quality_notes` never blank; `status:false` portals have `comment` |
| [3] Reproducibility | Applications, Methods | Note code availability; version all dependencies |
| [4] Multi-Source Coverage | Datasets, Projects | No single-source analysis; document complementarity |
| [5] Geographic Breadth | Papers, Datasets, Projects | `geography`/`countries` field populated |
| [6] Methodological Currency | Methods, Benchmarks | `status` field current; superseded methods flagged |
| [7] Open by Default | Datasets | `access` field documented; prefer open |
| [9] Version your methods | Papers, Methods | Name exact versions (ESCO v1.2, not "ESCO") |
| [10] Flag Data Quality | Datasets, Portals | `quality_notes` on datasets; `comment` on blocked portals |

---

*This charter is maintained alongside the constitution. When a new concept type is added, it must be registered here before entries are created.*
