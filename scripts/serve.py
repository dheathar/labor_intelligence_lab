"""FastAPI server for the Labor Intelligence Virtual Lab.

Run:
    python main.py
    # or
    .venv/bin/uvicorn scripts.serve:app --host 0.0.0.0 --port 8766 --reload
"""
from __future__ import annotations

import json
import logging
import os
import sys
from pathlib import Path

import yaml
from dotenv import load_dotenv
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

REPO_ROOT = Path(__file__).resolve().parent.parent
PORTAL_DIR = REPO_ROOT / "portal"
CONFIG_DIR = REPO_ROOT / "config"
DOMAINS_DIR = CONFIG_DIR / "domains"
KNOWLEDGE_DIR = REPO_ROOT / "knowledge"

sys.path.insert(0, str(REPO_ROOT))
load_dotenv(REPO_ROOT / ".env")
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("livlab")

app = FastAPI(title="Labor Intelligence Virtual Lab", version="0.1.0")


# ── In-memory catalog built at startup ──────────────────────────────────────

_catalog: dict = {}
_domains: list[dict] = []
_projects: list[dict] = []


def _load_yaml_dir(path: Path) -> list[dict]:
    items = []
    if not path.exists():
        return items
    for f in sorted(path.glob("*.yml")):
        try:
            data = yaml.safe_load(f.read_text(encoding="utf-8"))
            if data:
                items.append(data)
        except Exception as e:
            log.warning(f"could not parse {f}: {e}")
    return items


def _build_catalog() -> None:
    global _catalog, _domains, _projects
    _catalog = {
        "papers": _load_yaml_dir(KNOWLEDGE_DIR / "papers"),
        "datasets": _load_yaml_dir(KNOWLEDGE_DIR / "datasets"),
        "methods": _load_yaml_dir(KNOWLEDGE_DIR / "methods"),
        "applications": _load_yaml_dir(KNOWLEDGE_DIR / "applications"),
        "benchmarks": _load_yaml_dir(KNOWLEDGE_DIR / "benchmarks"),
    }
    # Write catalog.json for offline use
    (REPO_ROOT / "data" / "catalog.json").write_text(
        json.dumps(_catalog, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    # Load domains
    _domains = []
    if DOMAINS_DIR.exists():
        for d in sorted(DOMAINS_DIR.iterdir()):
            cfg = d / "domain.yml"
            if d.is_dir() and cfg.exists():
                try:
                    data = yaml.safe_load(cfg.read_text(encoding="utf-8")) or {}
                    data["slug"] = d.name
                    _domains.append(data)
                except Exception as e:
                    log.warning(f"could not load domain {d.name}: {e}")

    # Load projects
    projects_file = CONFIG_DIR / "projects.yml"
    if projects_file.exists():
        try:
            data = yaml.safe_load(projects_file.read_text(encoding="utf-8")) or {}
            _projects = data.get("projects", [])
        except Exception as e:
            log.warning(f"could not load projects.yml: {e}")

    total = sum(len(v) for v in _catalog.values())
    log.info(f"catalog loaded: {total} entries across {len(_catalog)} types, "
             f"{len(_domains)} domains, {len(_projects)} projects")


_build_catalog()

# ── Schemas ──────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    domain: str = "global"
    current_tab: str = ""
    history: list[dict] = []


# ── Health ───────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health() -> dict:
    return {
        "ok": True,
        "anthropic_key": bool(os.environ.get("ANTHROPIC_API_KEY")),
        "catalog_entries": sum(len(v) for v in _catalog.values()),
        "domains": len(_domains),
        "projects": len(_projects),
    }


# ── Domains ──────────────────────────────────────────────────────────────────

@app.get("/api/domains")
def domains() -> dict:
    return {"domains": _domains}


@app.get("/api/domain/{slug}")
def domain_detail(slug: str) -> dict:
    for d in _domains:
        if d["slug"] == slug:
            return d
    raise HTTPException(status_code=404, detail=f"domain {slug!r} not found")


@app.get("/api/domain/{slug}/map")
def domain_map(slug: str) -> dict:
    map_file = DOMAINS_DIR / slug / "map_data.json"
    if not map_file.exists():
        return {"slug": slug, "markers": []}
    try:
        markers = json.loads(map_file.read_text(encoding="utf-8"))
        return {"slug": slug, "markers": markers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Knowledge catalog ────────────────────────────────────────────────────────

@app.get("/api/knowledge")
def knowledge(domain: str | None = None) -> dict:
    if not domain:
        return _catalog
    filtered = {}
    for ktype, items in _catalog.items():
        filtered[ktype] = [
            i for i in items
            if not i.get("domains") or domain in i.get("domains", [])
        ]
    return filtered


@app.get("/api/knowledge/{ktype}")
def knowledge_type(ktype: str, domain: str | None = None) -> dict:
    if ktype not in _catalog:
        raise HTTPException(status_code=404, detail=f"unknown type {ktype!r}")
    items = _catalog[ktype]
    if domain:
        items = [i for i in items if not i.get("domains") or domain in i.get("domains", [])]
    return {ktype: items, "count": len(items)}


# ── Projects ─────────────────────────────────────────────────────────────────

@app.get("/api/projects")
def projects() -> dict:
    return {"projects": _projects}


@app.get("/api/projects/{slug}")
def project_detail(slug: str) -> dict:
    for p in _projects:
        if p["slug"] == slug:
            return p
    raise HTTPException(status_code=404, detail=f"project {slug!r} not found")


# ── Sources ──────────────────────────────────────────────────────────────────

CONNECTOR_REGISTRY = {
    "bls_api": {"name": "BLS API", "url": "https://api.bls.gov/publicAPI/v2/timeseries/data/", "status": "available"},
    "onet_api": {"name": "O*NET Web Services", "url": "https://services.onetcenter.org/ws/", "status": "available"},
    "esco_api": {"name": "ESCO API", "url": "https://ec.europa.eu/esco/api", "status": "available"},
    "eurostat_api": {"name": "Eurostat REST API", "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/", "status": "available"},
    "ilostat": {"name": "ILOSTAT SDMX", "url": "https://sdmx.ilo.org/rest/", "status": "available"},
    "elstat_scraper": {"name": "ELSTAT Excel Scraper", "url": "https://www.statistics.gr/en/statistics/-/publication/SJO01/", "status": "available"},
    "cedefop_api": {"name": "Cedefop Skills Forecast", "url": "https://www.cedefop.europa.eu/en/datasets", "status": "available"},
}

_source_status: dict[str, dict] = {}


@app.get("/api/sources")
def sources() -> dict:
    out = []
    for key, info in CONNECTOR_REGISTRY.items():
        st = _source_status.get(key, {})
        out.append({
            "id": key,
            "name": info["name"],
            "url": info["url"],
            "status": st.get("status", "idle"),
            "last_fetch": st.get("last_fetch"),
            "record_count": st.get("record_count"),
            "error": st.get("error"),
        })
    return {"sources": out}


@app.post("/api/sources/{connector_id}/fetch")
def fetch_source(connector_id: str) -> dict:
    if connector_id not in CONNECTOR_REGISTRY:
        raise HTTPException(status_code=404, detail=f"connector {connector_id!r} not found")
    _source_status[connector_id] = {"status": "pending", "last_fetch": None}
    return {"ok": True, "connector": connector_id, "message": "Fetch queued (stub — connector not yet implemented)"}


# ── Insights ─────────────────────────────────────────────────────────────────

@app.get("/api/insights/{domain}")
def insights(domain: str) -> dict:
    processed_dir = REPO_ROOT / "data" / "processed"
    charts = []
    if processed_dir.exists():
        for f in sorted(processed_dir.glob(f"{domain}_*.json")):
            try:
                charts.append(json.loads(f.read_text(encoding="utf-8")))
            except Exception:
                pass
    if not charts:
        charts = [_stub_chart(domain)]
    return {"domain": domain, "charts": charts}


def _stub_chart(domain: str) -> dict:
    return {
        "id": "stub",
        "title": f"Sample: Employment Trend — {domain.replace('_', ' ').title()}",
        "type": "line",
        "note": "Add real data to data/processed/<domain>_<name>.json to replace this stub.",
        "data": {
            "labels": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "datasets": [{
                "label": "Employment Index (100=2020)",
                "data": [100, 94, 98, 102, 105, 107],
                "borderColor": "#2f81f7",
                "backgroundColor": "rgba(47,129,247,0.1)",
                "tension": 0.3,
                "fill": True,
            }]
        },
        "options": {
            "responsive": True,
            "plugins": {"legend": {"position": "top"}},
            "scales": {"y": {"beginAtZero": False}},
        }
    }


# ── Chat (Playground) ────────────────────────────────────────────────────────

@app.get("/api/portals")
def portals_list() -> dict:
    f = REPO_ROOT / "data" / "impl" / "portals.json"
    if f.exists():
        return {"portals": json.loads(f.read_text(encoding="utf-8"))}
    return {"portals": []}


@app.get("/api/deliverables")
def deliverables_list() -> dict:
    f = REPO_ROOT / "data" / "impl" / "deliverables.json"
    if f.exists():
        return {"deliverables": json.loads(f.read_text(encoding="utf-8"))}
    return {"deliverables": []}


def _build_system_prompt(domain: str) -> str:
    """Build a rich system prompt that includes the full lab knowledge base."""
    domain_name = domain.replace("_", " ").title()

    # Catalog summary
    papers = _catalog.get("papers", [])
    datasets = _catalog.get("datasets", [])
    methods = _catalog.get("methods", [])
    applications = _catalog.get("applications", [])

    papers_summary = "\n".join(
        f"- [{p.get('year','')}] {p.get('title','')} ({p.get('venue','')}) — {p.get('arxiv_id') or p.get('doi','')}"
        for p in papers
    )
    datasets_summary = "\n".join(
        f"- {d.get('name','')} | {d.get('source','')} | {d.get('type','')} | access:{d.get('access','')} | geo:{d.get('geography','')}"
        for d in datasets
    )
    methods_summary = "\n".join(
        f"- {m.get('name','')} ({m.get('category','')})"
        for m in methods
    )

    # Projects
    projects_summary = "\n".join(
        f"- {p.get('name','')} ({p.get('period','')}) role:{p.get('role','')} — {p.get('short_description') or p.get('description','')[:100]}"
        for p in _projects
    )

    # Deliverables from JSON
    deliverables_summary = ""
    del_file = REPO_ROOT / "data" / "impl" / "deliverables.json"
    if del_file.exists():
        try:
            deliverables = json.loads(del_file.read_text())
            deliverables_summary = "\n".join(
                f"- [{d['project']}] {d['id']} due {d['due']}: {d['title']} | {d['notes']}"
                for d in deliverables
            )
        except Exception:
            pass

    # Portals summary
    portals_summary = ""
    portals_file = REPO_ROOT / "data" / "impl" / "portals.json"
    if portals_file.exists():
        try:
            portals = json.loads(portals_file.read_text())
            active = sum(1 for p in portals if p["status"])
            by_country: dict = {}
            for p in portals:
                by_country.setdefault(p["country"], []).append(p["name"])
            portals_summary = f"{len(portals)} portals total, {active} active. By country:\n"
            portals_summary += "\n".join(
                f"  {c}: {', '.join(names)}" for c, names in sorted(by_country.items())
            )
        except Exception:
            pass

    return f"""You are the **Labor Intelligence Lab (LIVLAB) assistant** — an expert on the DMLab research lab's labor market intelligence work.

You have complete knowledge of this lab's knowledge base. Answer questions about datasets, papers, methods, projects, deliverables, and crawling portals using the data below. Be specific and cite exact names, dates, and IDs.

Today's date: 2026-06-05. Current domain: {domain_name}.

## Projects
{projects_summary}

## Software Deliverables 2026
(Due dates and status for University of Patras software deliverables)
{deliverables_summary or "Not loaded."}

## Crawling Portals Infrastructure
{portals_summary or "Not loaded."}

## Research Papers ({len(papers)} indexed)
{papers_summary}

## Datasets ({len(datasets)} indexed)
{datasets_summary}

## Methods ({len(methods)} indexed)
{methods_summary}

## Instructions
- Answer questions about deliverable due dates, project status, portals by country, and research content using the data above.
- For deliverable timing questions (e.g. "summer 2026"): summer = July–August, so D4.1 (20/07) and D4.2 (30/07) are summer deliverables; D.2.2.1, D.2.3.1 (31/08) are late summer.
- Keep answers concise. Use bullet points for lists. Cite specific IDs, dates, and names.
- If something is not in the knowledge base, say so clearly.
"""


_TAB_LABELS = {
    "overview": "Overview", "landscape": "Landscape", "papers": "Papers",
    "datasets": "Datasets", "methods": "Methods", "applications": "Applications",
    "benchmarks": "Benchmarks", "sources": "Sources", "insights": "Insights",
    "lab_exp": "Lab Experiments", "projects": "Projects", "oja": "OJA Portals",
    "lmi_research": "LMI Research", "playground": "Playground", "map": "Map",
    "impl_portals": "Implementation Portals", "impl_deliverables": "Deliverables",
    "constitution": "Constitution",
}

def _inject_page_context(message: str, current_tab: str, domain: str) -> str:
    if not current_tab:
        return message
    label = _TAB_LABELS.get(current_tab, current_tab)
    return f"[User is on the {label} tab · domain: {domain}]\n\n{message}"


@app.post("/api/chat")
def chat(req: ChatRequest) -> dict:
    # Prefer OpenRouter (one key for everything); fall back to Anthropic direct
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    anthropic_key  = os.environ.get("ANTHROPIC_API_KEY")

    if openrouter_key and len(openrouter_key) > 20:
        # Use OpenRouter with Claude via OpenAI-compatible API
        from openai import OpenAI
        client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=openrouter_key)
        system_prompt = _build_system_prompt(req.domain)
        messages = [{"role": "system", "content": system_prompt}]
        for turn in req.history[-10:]:
            messages.append({"role": turn["role"], "content": turn["content"]})
        messages.append({"role": "user", "content": _inject_page_context(req.message, req.current_tab, req.domain)})
        try:
            model = os.environ.get("CHAT_MODEL", "google/gemma-3-27b-it")
            resp = client.chat.completions.create(
                model=model,
                max_tokens=1024,
                messages=messages,
            )
            reply = resp.choices[0].message.content
            return {"reply": reply, "model": model}
        except Exception as e:
            log.exception("chat via OpenRouter failed")
            raise HTTPException(status_code=500, detail=str(e))

    elif anthropic_key and len(anthropic_key) > 20:
        import anthropic
        client = anthropic.Anthropic(api_key=anthropic_key)
        system_prompt = _build_system_prompt(req.domain)
        messages = []
        for turn in req.history[-10:]:
            messages.append({"role": turn["role"], "content": turn["content"]})
        messages.append({"role": "user", "content": _inject_page_context(req.message, req.current_tab, req.domain)})
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                system=system_prompt,
                messages=messages,
            )
            reply = response.content[0].text
            return {"reply": reply, "model": "claude-sonnet-4-6"}
        except Exception as e:
            log.exception("chat via Anthropic failed")
            raise HTTPException(status_code=500, detail=str(e))

    else:
        raise HTTPException(
            status_code=503,
            detail="No API key configured. Add OPENROUTER_API_KEY or ANTHROPIC_API_KEY to .env"
        )


# ── Static portal mount ──────────────────────────────────────────────────────

# Serve config/ for domain.yml, map_data.json etc
if CONFIG_DIR.exists():
    app.mount("/config", StaticFiles(directory=str(CONFIG_DIR)), name="config")

# Serve knowledge/ for direct file access
if KNOWLEDGE_DIR.exists():
    app.mount("/knowledge", StaticFiles(directory=str(KNOWLEDGE_DIR)), name="knowledge")

# Serve portal at root
# ── Rat proxy — forwards /api/rats/* to the agents service (port 8767) ────────

RAT_SERVER = os.environ.get("RAT_SERVER_URL", "http://localhost:8767")
_rat_client = httpx.AsyncClient(base_url=RAT_SERVER, timeout=300.0)


@app.api_route("/api/rats", methods=["GET"])
@app.api_route("/api/rats/{path:path}", methods=["GET", "POST"])
async def rat_proxy(request: Request, path: str = ""):
    url = f"/api/rats/{path}".rstrip("/") if path else "/api/rats"
    try:
        body = await request.body()
        resp = await _rat_client.request(
            method=request.method,
            url=url,
            content=body,
            headers={"content-type": request.headers.get("content-type", "application/json")},
        )
        return Response(content=resp.content, status_code=resp.status_code,
                        media_type=resp.headers.get("content-type", "application/json"))
    except httpx.ConnectError:
        return Response(
            content='{"error":"agents_offline","detail":"Lab Rats service is not running. Start it with: docker compose up agents"}',
            status_code=503,
            media_type="application/json",
        )


if PORTAL_DIR.exists():
    app.mount("/portal", StaticFiles(directory=str(PORTAL_DIR), html=True), name="portal")


@app.get("/")
def root() -> RedirectResponse:
    return RedirectResponse(url="/portal/", status_code=307)
