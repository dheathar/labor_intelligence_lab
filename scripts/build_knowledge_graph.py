#!/usr/bin/env python3
"""build_knowledge_graph.py - Generate OKF-aligned knowledge graph for LIVLAB.

Reads knowledge/{papers,datasets,methods,applications,benchmarks,wiki}/ and emits:
  - knowledge/bundle.json          OKF v0.1 bundle (concepts + edges), portable
  - portal/knowledge_graph.html    self-contained ECharts viewer (themed)

Edges are derived from existing fields - no entry edits required:
  papers.methods_used / papers.datasets_used
  methods.paper / methods.sota_benchmarks
  applications.data_sources / applications.methods
  wiki prose: arXiv:ID and "Author et al. YEAR" citations

Usage:  python scripts/build_knowledge_graph.py
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
KB_ROOT = REPO_ROOT / "knowledge"
PORTAL_DIR = REPO_ROOT / "portal"

KB_TYPES = ["papers", "datasets", "methods", "applications", "benchmarks"]
TYPE_LABELS = {
    "papers": "Papers",
    "datasets": "Datasets",
    "methods": "Methods",
    "applications": "Applications",
    "benchmarks": "Benchmarks",
    "wiki": "Wiki",
    "projects": "Projects",
    "portals": "Portals",
    "deliverables": "Deliverables",
    "work_packages": "Work Packages",
    "roles": "Roles",
    "occupations": "Occupations",
}
TYPE_COLORS = {
    "papers": "#2f81f7",
    "datasets": "#56d364",
    "methods": "#f0883e",
    "applications": "#d2a8ff",
    "benchmarks": "#f85149",
    "wiki": "#79c0ff",
    "projects": "#e3b341",
    "portals": "#39d0d8",
    "deliverables": "#db61a2",
    "work_packages": "#8957e5",
    "roles": "#768390",
    "occupations": "#d4a44c",
}
TYPE_PREFIXES = tuple(t + "/" for t in TYPE_LABELS)

ARXIV_RE = re.compile(r"arXiv:?\s*(\d{4}\.\d{4,5})", re.IGNORECASE)
CITE_RE = re.compile(r"([A-Z][a-zA-Z'\-]+)\s+(?:et al\.?\s+)?[\(\s]?(\d{4})[\)\)]?")


def iso_mtime(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def yaml_body(entry: dict, kind: str) -> str:
    """Render a markdown body for a YAML entry (side-panel display)."""
    parts = []
    if kind == "papers":
        if entry.get("abstract"):
            parts.append("## Abstract\n\n" + str(entry["abstract"]).strip())
        if entry.get("key_findings"):
            parts.append("## Key findings\n\n" + "\n".join(f"- {f}" for f in entry["key_findings"]))
        if entry.get("livlab_relevance"):
            parts.append("## LIVLAB relevance\n\n" + str(entry["livlab_relevance"]).strip())
    elif kind == "datasets":
        if entry.get("description"):
            parts.append("## Description\n\n" + str(entry["description"]).strip())
        if entry.get("key_variables"):
            parts.append("## Key variables\n\n" + "\n".join(f"- {v}" for v in entry["key_variables"]))
    elif kind == "methods":
        if entry.get("description"):
            parts.append("## Description\n\n" + str(entry["description"]).strip())
        if entry.get("strengths"):
            parts.append("## Strengths\n\n" + "\n".join(f"- {s}" for s in entry["strengths"]))
        if entry.get("weaknesses"):
            parts.append("## Weaknesses\n\n" + "\n".join(f"- {w}" for w in entry["weaknesses"]))
    elif kind == "applications":
        if entry.get("description"):
            parts.append("## Description\n\n" + str(entry["description"]).strip())
        if entry.get("example_tools"):
            parts.append("## Example tools\n\n" + ", ".join(entry["example_tools"]))
    elif kind == "benchmarks":
        if entry.get("description"):
            parts.append("## Description\n\n" + str(entry["description"]).strip())
        if entry.get("metrics"):
            parts.append("## Metrics\n\n" + ", ".join(str(m) for m in entry["metrics"]))
    return "\n\n".join(parts) if parts else "_No description._"


def load_yaml_entries(slug_index: dict) -> list[dict]:
    concepts = []
    for kb_type in KB_TYPES:
        d = KB_ROOT / kb_type
        if not d.is_dir():
            continue
        for path in sorted(d.glob("*.yml")):
            with open(path, encoding="utf-8") as f:
                entry = yaml.safe_load(f) or {}
            slug = str(entry.get("slug") or path.stem)
            cid = f"{kb_type}/{slug}"
            title = str(entry.get("title") or entry.get("name") or slug)
            raw_desc = entry.get("abstract") or entry.get("description") or ""
            desc = str(raw_desc).strip().split("\n")[0][:300]
            resource = str(entry.get("url") or entry.get("api_url") or "")
            tags = entry.get("topics") or entry.get("tags") or []
            if isinstance(tags, str):
                tags = [tags]
            concepts.append({
                "id": cid, "type": kb_type, "slug": slug,
                "title": title, "description": desc, "resource": resource,
                "tags": [str(t) for t in tags], "timestamp": iso_mtime(path),
                "body": yaml_body(entry, kb_type), "fields": entry,
            })
            slug_index[slug] = cid
    return concepts


def load_wiki(slug_index: dict) -> list[dict]:
    concepts = []
    wdir = KB_ROOT / "wiki"
    if not wdir.is_dir():
        return concepts
    for path in sorted(wdir.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        slug = path.stem
        title = slug
        m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
        if m:
            title = m.group(1).strip()
        desc = ""
        for line in text.splitlines():
            s = line.strip()
            if s and not s.startswith(("#", "```", "---", "*")):
                desc = s
                break
        cid = f"wiki/{slug}"
        concepts.append({
            "id": cid, "type": "wiki", "slug": slug,
            "title": title, "description": desc[:300], "resource": "",
            "tags": [], "timestamp": iso_mtime(path),
            "body": text, "fields": {"slug": slug, "title": title},
        })
        slug_index[slug] = cid
    return concepts


# ── Extended concept loaders (projects, portals, deliverables, WPs, roles, occupations) ────

ROLES_DATA = [
    {"slug": "hiring", "name": "Hiring Manager", "description": "Talent acquisition: demand trends, skill gaps, recruiting funnel, time-to-fill, source of hire.", "charts": ["Demand trend", "Skills gap", "Hiring difficulty", "Skill seasonality", "Recruiting funnel", "Time-to-fill", "Source of hire"]},
    {"slug": "planner", "name": "Workforce Planner", "description": "Supply-demand balance, education-to-occupation flows, workforce demographics, headcount planning.", "charts": ["Supply-demand balance", "Skills radar", "Education Sankey", "Workforce waterfall", "Age pyramid", "Headcount vs target", "Headcount trend"]},
    {"slug": "researcher", "name": "Skills Researcher", "description": "Skills co-occurrence, ranking dynamics, ESCO taxonomy structure, adoption curves, wage-premium analysis.", "charts": ["Skills network", "Bump chart", "Treemap", "Demand vs wage", "Sunburst", "Parallel coords", "S-curves"]},
    {"slug": "policy-analyst", "name": "Policy Analyst", "description": "Employment rates by country, automation risk, NEET trends, gender gaps, regional disparities, contract types.", "charts": ["Small multiples", "Automation risk", "Contract types", "NEET trend", "Slope chart", "Gender gap", "NUTS2 regional"]},
    {"slug": "career-advisor", "name": "Career Advisor", "description": "Salary distributions, career transitions, demand forecasts, skills gap assessment, readiness scoring.", "charts": ["Salary box plot", "Career transitions", "Demand forecast", "Skills radar", "Seniority salary", "Readiness gauge", "Skills dumbbell"]},
]


def load_roles(slug_index: dict) -> list[dict]:
    concepts = []
    for r in ROLES_DATA:
        cid = f"roles/{r['slug']}"
        body = f"# {r['name']}\n\n{r['description']}\n\n## Charts\n\n" + "\n".join(f"- {c}" for c in r["charts"])
        concepts.append({
            "id": cid, "type": "roles", "slug": r["slug"],
            "title": r["name"], "description": r["description"], "resource": "",
            "tags": ["persona"], "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "body": body, "fields": r,
        })
        slug_index[r["slug"]] = cid
    return concepts


def load_projects(slug_index: dict) -> tuple[list[dict], dict]:
    """Load projects from config/projects.yml. Returns (concepts, name_index) where name_index maps uppercase project name -> slug."""
    path = REPO_ROOT / "config" / "projects.yml"
    if not path.exists():
        return [], {}
    with open(path, encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    concepts = []
    name_index = {}
    for proj in data.get("projects", []):
        slug = proj.get("slug") or proj.get("name", "").lower().replace(" ", "-")
        cid = f"projects/{slug}"
        desc = str(proj.get("description") or "").strip().split("\n")[0][:300]
        tags = [proj.get("theme", ""), proj.get("programme", "")]
        tags = [t for t in tags if t]
        countries = proj.get("countries") or []
        body_parts = [f"# {proj.get('name', slug)}\n"]
        if proj.get("full_name"):
            body_parts.append(f"_{proj['full_name']}_\n")
        if proj.get("description"):
            body_parts.append(str(proj["description"]).strip())
        if countries:
            body_parts.append("## Countries\n\n" + ", ".join(str(c) for c in countries))
        if proj.get("objectives"):
            body_parts.append("## Objectives\n\n" + "\n".join(f"- {o}" for o in proj["objectives"]))
        if proj.get("data_sources"):
            body_parts.append("## Data sources\n\n" + "\n".join(f"- {d}" for d in proj["data_sources"]))
        concepts.append({
            "id": cid, "type": "projects", "slug": slug,
            "title": proj.get("name", slug), "description": desc, "resource": "",
            "tags": tags, "timestamp": iso_mtime(path),
            "body": "\n\n".join(body_parts), "fields": proj,
        })
        slug_index[slug] = cid
        name_index[proj.get("name", "").upper()] = slug
        name_index[slug.upper()] = slug
    return concepts, name_index


def load_work_packages(project_data: list[dict], slug_index: dict) -> list[dict]:
    concepts = []
    for proj in project_data:
        proj_slug = proj["fields"].get("slug")
        proj_name = proj["fields"].get("name", proj_slug)
        for wp in proj["fields"].get("work_packages") or []:
            wp_id = wp.get("id", "")
            slug = f"{proj_slug}-{wp_id.lower()}"
            cid = f"work_packages/{slug}"
            title = f"{proj_name} · {wp_id}: {wp.get('title', '')}"
            desc = str(wp.get("objective") or "").strip().split("\n")[0][:300]
            body_parts = [f"# {wp_id}: {wp.get('title', '')}\n", f"**Project:** {proj_name}\n"]
            if wp.get("objective"):
                body_parts.append(str(wp["objective"]).strip())
            body_parts.append(f"**Lead:** {wp.get('lead', '—')}")
            body_parts.append(f"**Duration:** M{wp.get('start_month', '?')}–M{wp.get('end_month', '?')}")
            if wp.get("tasks"):
                body_parts.append("## Tasks\n\n" + "\n".join(f"- {t}" for t in wp["tasks"]))
            concepts.append({
                "id": cid, "type": "work_packages", "slug": slug,
                "title": title, "description": desc, "resource": "",
                "tags": [wp_id, proj_slug], "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "body": "\n\n".join(body_parts), "fields": {**wp, "_project_slug": proj_slug, "_project_name": proj_name},
            })
            slug_index[slug] = cid
            slug_index[wp_id.lower()] = cid
    return concepts


def load_deliverables(project_data: list[dict], slug_index: dict) -> list[dict]:
    concepts = []
    for proj in project_data:
        proj_slug = proj["fields"].get("slug")
        proj_name = proj["fields"].get("name", proj_slug)
        for d in proj["fields"].get("deliverables") or []:
            d_id = d.get("id", "")
            slug = f"{proj_slug}-{d_id.lower().replace('.', '-')}"
            cid = f"deliverables/{slug}"
            desc = str(d.get("description") or d.get("title") or "").strip()[:300]
            body_parts = [f"# {d_id}: {d.get('title', '')}\n", f"**Project:** {proj_name}\n"]
            body_parts.append(f"**WP:** {d.get('wp', '—')}")
            body_parts.append(f"**Lead:** {d.get('lead', '—')}")
            body_parts.append(f"**Type:** {d.get('type', '—')}")
            body_parts.append(f"**Access:** {d.get('access', '—')}")
            if d.get("description"):
                body_parts.append(f"\n{d['description']}")
            if d.get("livlab"):
                body_parts.append("\n> **LIVLAB deliverable** — this is a primary DMLab software output.")
            concepts.append({
                "id": cid, "type": "deliverables", "slug": slug,
                "title": f"{proj_name} · {d_id}", "description": desc, "resource": "",
                "tags": [d_id, proj_slug, d.get("type", "")], "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "body": "\n\n".join(str(p) for p in body_parts), "fields": {**d, "_project_slug": proj_slug, "_project_name": proj_name},
            })
            slug_index[slug] = cid
    return concepts


def load_portals(slug_index: dict, name_index: dict) -> list[dict]:
    path = REPO_ROOT / "portal" / "app.js"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    m = re.search(r"const PORTALS_DATA\s*=\s*\[(.*?)\];", text, re.DOTALL)
    if not m:
        return []
    raw = m.group(1)
    concepts = []
    for obj_m in re.finditer(r"\{([^}]+)\}", raw):
        obj = obj_m.group(1)
        def field(key, default=""):
            fm = re.search(rf"{key}:'([^']*)'", obj)
            return fm.group(1) if fm else default
        name = field("name")
        if not name:
            continue
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
        cid = f"portals/{slug}"
        country = field("country")
        url = field("url")
        status_m = re.search(r"status:(true|false)", obj)
        status = status_m and status_m.group(1) == "true"
        proj_m = re.search(r"projects:\[([^\]]*)\]", obj)
        projs = re.findall(r"'([^']*)'", proj_m.group(1)) if proj_m else []
        comment = field("comment")
        tags = [country.lower().replace(" ", "-")] if country else []
        desc = f"{country} job portal"
        if comment and comment != "null":
            desc += f" — {comment}"
        body_parts = [f"# {name}\n", f"**Country:** {country}\n**URL:** {url}\n**Status:** {'Active' if status else 'Inactive'}"]
        if comment and comment != "null":
            body_parts.append(f"**Note:** {comment}")
        if projs:
            body_parts.append("## Used by projects\n\n" + ", ".join(projs))
        concepts.append({
            "id": cid, "type": "portals", "slug": slug,
            "title": name, "description": desc, "resource": url,
            "tags": tags, "timestamp": iso_mtime(path),
            "body": "\n\n".join(body_parts), "fields": {"name": name, "country": country, "url": url, "status": status, "projects": projs, "comment": comment},
        })
        slug_index[slug] = cid
    return concepts


def load_occupations(slug_index: dict) -> list[dict]:
    path = REPO_ROOT / "portal" / "js" / "viz_core.js"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    m = re.search(r"const OCC18\s*=\s*\[(.*?)\];", text, re.DOTALL)
    if not m:
        return []
    raw = m.group(1)
    concepts = []
    for obj_m in re.finditer(r"\{name:'([^']+)',\s*sector:'([^']+)',\s*isco:'([^']+)'", raw):
        name, sector, isco = obj_m.group(1), obj_m.group(2), obj_m.group(3)
        slug = f"isco-{isco}"
        cid = f"occupations/{slug}"
        desc = f"{name} (ISCO-08 {isco}) — sector: {sector}"
        body = f"# {name}\n\n**ISCO-08 code:** {isco}\n**Sector:** {sector}\n\nReferenced in the ESCO taxonomy and OJA classification pipeline."
        concepts.append({
            "id": cid, "type": "occupations", "slug": slug,
            "title": name, "description": desc, "resource": f"https://esco.ec.europa.eu/en/classification/occupation_main",
            "tags": [sector, f"isco-{isco}"], "timestamp": iso_mtime(path),
            "body": body, "fields": {"name": name, "sector": sector, "isco": isco},
        })
        slug_index[slug] = cid
    return concepts


def build_edges(concepts: list[dict], slug_index: dict, name_index: dict | None = None) -> list[dict]:
    papers_by_arxiv = {}
    papers_by_author_year = {}
    for c in concepts:
        if c["type"] != "papers":
            continue
        f = c["fields"]
        aid = f.get("arxiv_id")
        if aid:
            papers_by_arxiv[str(aid).strip()] = c["id"]
        authors = f.get("authors") or []
        year = f.get("year")
        if authors and year:
            lastname = str(authors[0]).split()[-1].rstrip(".").lower()
            papers_by_author_year[(lastname, int(year))] = c["id"]

    edges = []
    seen = set()
    name_index = name_index or {}

    def add(src_cid: str, dst: str, kind: str) -> None:
        if not dst:
            return
        dst = str(dst).strip()
        target = slug_index.get(dst)
        if not target:
            target = slug_index.get(dst.lower())
        if not target and dst.upper() in name_index:
            target = slug_index.get(name_index[dst.upper()])
        if not target and "/" in dst and dst.startswith(tuple(t + "/" for t in TYPE_LABELS)):
            target = dst
        if not target or target == src_cid:
            return
        key = (src_cid, target, kind)
        if key in seen:
            return
        seen.add(key)
        edges.append({"source": src_cid, "target": target, "kind": kind})

    for c in concepts:
        cid, t, f = c["id"], c["type"], c["fields"]
        if t == "papers":
            for m in f.get("methods_used") or []:
                add(cid, m, "uses-method")
            for d in f.get("datasets_used") or []:
                add(cid, d, "uses-dataset")
        elif t == "methods":
            if f.get("paper"):
                add(cid, f["paper"], "method-of")
            for b in f.get("sota_benchmarks") or []:
                add(cid, b, "sota-on")
        elif t == "applications":
            for d in f.get("data_sources") or []:
                add(cid, d, "uses-dataset")
            for m in f.get("methods") or []:
                add(cid, m, "uses-method")
        elif t == "wiki":
            text = c["body"]
            for aid in ARXIV_RE.findall(text):
                pid = papers_by_arxiv.get(aid.strip())
                if pid:
                    add(cid, pid, "cites")
            for lastname, year in CITE_RE.findall(text):
                pid = papers_by_author_year.get((lastname.lower(), int(year)))
                if pid:
                    add(cid, pid, "cites")
        elif t == "portals":
            for proj_name in f.get("projects") or []:
                add(cid, proj_name, "used-by-project")
        elif t == "deliverables":
            proj_slug = f.get("_project_slug")
            if proj_slug:
                add(cid, proj_slug, "deliverable-of")
            wp = f.get("wp")
            if wp:
                proj_slug2 = f.get("_project_slug", "")
                add(cid, f"{proj_slug2}-{wp.lower()}", "belongs-to-wp")
        elif t == "work_packages":
            proj_slug = f.get("_project_slug")
            if proj_slug:
                add(cid, proj_slug, "wp-of-project")
            for d_id in f.get("deliverables") or []:
                proj_slug2 = f.get("_project_slug", "")
                add(cid, f"{proj_slug2}-{d_id.lower().replace('.', '-')}", "produces")
        elif t == "occupations":
            add(cid, "esco", "classified-by")
    return edges


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LIVLAB · Knowledge Graph</title>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js"></script>
<style>
:root[data-theme="dark"]{--bg:#0d1117;--bg-2:#161b22;--bg-3:#21262d;--bg-hover:#1f242c;--border:#30363d;--fg:#e6edf3;--fg-muted:#8b949e;--accent:#2f81f7;--accent-bg:rgba(56,139,253,.15);--green:#56d364;--orange:#f0883e;--red:#f85149;--purple:#bc8cff;--warn:#d29922}
:root[data-theme="light"]{--bg:#ffffff;--bg-2:#f6f8fa;--bg-3:#eaeef2;--bg-hover:#f3f4f6;--border:#d0d7de;--fg:#1f2328;--fg-muted:#59636e;--accent:#0969da;--accent-bg:#ddf4ff;--green:#1a7f37;--orange:#bc4c00;--red:#cf222e;--purple:#8250df;--warn:#9a6700}
:root[data-theme="rat"]{--bg:#141710;--bg-2:#1d2115;--bg-3:#272c1b;--bg-hover:#2a3020;--border:#3d4a2a;--fg:#e2dbbf;--fg-muted:#8a9560;--accent:#9acd32;--accent-bg:rgba(154,205,50,.12);--green:#7cb87c;--orange:#d4a44c;--red:#c94a4a;--purple:#b08080;--warn:#c8943a}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;line-height:1.5;height:100vh;display:flex;flex-direction:column;overflow:hidden}
.header{background:var(--bg-2);border-bottom:1px solid var(--border);padding:10px 20px;display:flex;align-items:center;gap:14px;flex-shrink:0}
.hdr-logo{font-size:20px}
.hdr-title{font-size:15px;font-weight:700}
.hdr-sub{font-size:11px;color:var(--fg-muted)}
.hdr-actions{margin-left:auto;display:flex;align-items:center;gap:8px}
.btn-sm{background:var(--bg-3);border:1px solid var(--border);border-radius:6px;padding:5px 11px;cursor:pointer;font-size:12px;color:var(--fg);text-decoration:none;display:inline-flex;align-items:center;gap:5px}
.btn-sm:hover{background:var(--bg-hover)}
.toolbar{background:var(--bg-2);border-bottom:1px solid var(--border);padding:8px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;flex-shrink:0}
.tb-search{flex:1;min-width:200px;max-width:380px;background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:6px 11px;color:var(--fg);font-size:12px}
.tb-search:focus{outline:none;border-color:var(--accent)}
.tb-group{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--fg-muted)}
.tb-select{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:4px 8px;color:var(--fg);font-size:12px}
.filter-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;border:1px solid var(--border);background:var(--bg);font-size:11px;cursor:pointer;user-select:none;color:var(--fg-muted);transition:.15s}
.filter-chip.active{color:var(--fg);border-color:var(--accent);background:var(--accent-bg)}
.filter-chip .dot{width:8px;height:8px;border-radius:50%;display:inline-block}
.main{flex:1;display:flex;min-height:0}
.graph-wrap{flex:1;min-width:0;position:relative}
#graph{width:100%;height:100%}
.legend{position:absolute;left:16px;bottom:16px;background:var(--bg-2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:11px;display:flex;flex-direction:column;gap:5px}
.legend-row{display:flex;align-items:center;gap:7px}
.legend .dot{width:10px;height:10px;border-radius:50%}
.stats{position:absolute;right:16px;bottom:16px;background:var(--bg-2);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:11px;color:var(--fg-muted)}
.sidebar{width:420px;flex-shrink:0;border-left:1px solid var(--border);background:var(--bg-2);display:flex;flex-direction:column;overflow:hidden}
.sb-empty{padding:40px 24px;text-align:center;color:var(--fg-muted);font-size:13px}
.sb-content{overflow-y:auto;padding:20px 22px;flex:1}
.sb-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);margin-bottom:4px}
.sb-title{font-size:17px;font-weight:700;margin-bottom:6px;line-height:1.3}
.sb-desc{font-size:12px;color:var(--fg-muted);margin-bottom:14px;line-height:1.6}
.sb-meta{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;font-size:11px;margin-bottom:16px;padding:10px;background:var(--bg-3);border-radius:6px;border:1px solid var(--border)}
.sb-meta k{color:var(--fg-muted);font-weight:600}
.sb-meta v{color:var(--fg);word-break:break-word}
.sb-section{margin-top:14px}
.sb-section-h{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--fg-muted);margin-bottom:6px}
.sb-body{font-size:12.5px;line-height:1.65;color:var(--fg)}
.sb-body h1,.sb-body h2,.sb-body h3{margin:14px 0 6px;color:var(--fg)}
.sb-body h1{font-size:16px}.sb-body h2{font-size:14px}.sb-body h3{font-size:13px}
.sb-body p{margin:6px 0}
.sb-body ul,.sb-body ol{margin:6px 0;padding-left:20px}
.sb-body li{margin:2px 0}
.sb-body code{background:var(--bg-3);padding:1px 5px;border-radius:3px;font-family:'SFMono-Regular',Consolas,monospace;font-size:11.5px}
.sb-body pre{background:var(--bg-3);padding:10px;border-radius:6px;overflow-x:auto;margin:8px 0;border:1px solid var(--border)}
.sb-body pre code{background:none;padding:0}
.sb-body table{border-collapse:collapse;margin:8px 0;font-size:11.5px;width:100%}
.sb-body th,.sb-body td{border:1px solid var(--border);padding:4px 7px;text-align:left}
.sb-body a{color:var(--accent)}
.back-item{display:flex;align-items:center;gap:8px;padding:6px 9px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--fg-muted);transition:.1s}
.back-item:hover{background:var(--bg-3);color:var(--fg)}
.back-item .bi-kind{font-size:9.5px;color:var(--accent);background:var(--accent-bg);padding:1px 6px;border-radius:999px;margin-left:auto}
@media(max-width:900px){.sidebar{width:340px}}
@media(max-width:700px){.main{flex-direction:column}.sidebar{width:100%;height:45%;border-left:none;border-top:1px solid var(--border)}}
</style>
</head>
<body>

<div class="header">
  <div class="hdr-logo">KG</div>
  <div>
    <div class="hdr-title">LIVLAB · Knowledge Graph</div>
    <div class="hdr-sub" id="hdr-sub">Loading…</div>
  </div>
  <div class="hdr-actions">
    <button class="btn-sm" id="theme-btn" onclick="cycleTheme()">theme</button>
    <a class="btn-sm" href="/">Lab</a>
  </div>
</div>

<div class="toolbar">
  <input type="text" class="tb-search" id="search" placeholder="Search by title, slug, or tag…" oninput="onSearch()">
  <div class="tb-group" id="filter-chips"></div>
  <div class="tb-group">
    <span>Layout</span>
    <select class="tb-select" id="layout" onchange="renderGraph()">
      <option value="force">Force</option>
      <option value="circular">Circular</option>
    </select>
  </div>
</div>

<div class="main">
  <div class="graph-wrap">
    <div id="graph"></div>
    <div class="legend" id="legend"></div>
    <div class="stats" id="stats"></div>
  </div>
  <div class="sidebar">
    <div class="sb-empty" id="sb-empty">Click a node to inspect the concept.<br><br>Tips: drag to rearrange, scroll to zoom, click a node to see its detail panel and backlinks.</div>
    <div class="sb-content" id="sb-content" style="display:none"></div>
  </div>
</div>

<script id="bundle-data" type="application/json">__BUNDLE_JSON__</script>
<script>
window.addEventListener('error', e => {
  const el = document.getElementById('hdr-sub');
  if (el) el.innerHTML = '<span style="color:var(--red)">ERROR: ' + (e.message||'unknown') + (e.lineno?' @'+e.lineno+':'+e.colno:'') + '</span>';
});
const BUNDLE = JSON.parse(document.getElementById('bundle-data').textContent);
const TYPE_COLORS = __TYPE_COLORS__;
const TYPE_LABELS = __TYPE_LABELS__;

let chart = null;
const activeTypes = new Set(Object.keys(TYPE_LABELS));
let searchTerm = '';

const THEMES = ['dark','light','rat'];
const THEME_ICON = {dark:'dark', light:'light', rat:'rat'};
function loadTheme(){ const t = localStorage.getItem('livlab-kg-theme') || 'dark'; setTheme(t); }
function setTheme(t){ document.documentElement.setAttribute('data-theme', t); localStorage.setItem('livlab-kg-theme', t); document.getElementById('theme-btn').textContent = THEME_ICON[t] || t; }
function cycleTheme(){ const cur = document.documentElement.getAttribute('data-theme'); const i = THEMES.indexOf(cur); setTheme(THEMES[(i+1)%THEMES.length]); if (chart) renderGraph(); }

const conceptMap = new Map(BUNDLE.concepts.map(c => [c.id, c]));
const backlinks = new Map(BUNDLE.concepts.map(c => [c.id, []]));
for (const e of BUNDLE.edges) {
  if (!backlinks.has(e.target)) backlinks.set(e.target, []);
  backlinks.get(e.target).push(e);
}
const degree = new Map();
for (const c of BUNDLE.concepts) degree.set(c.id, 0);
for (const e of BUNDLE.edges) {
  degree.set(e.source, (degree.get(e.source)||0)+1);
  degree.set(e.target, (degree.get(e.target)||0)+1);
}

document.getElementById('hdr-sub').textContent =
  BUNDLE.meta.concept_count + ' concepts · ' +
  BUNDLE.meta.edge_count + ' edges · generated ' + BUNDLE.generated_at.slice(0,10);

const counts = {};
BUNDLE.concepts.forEach(c => counts[c.type] = (counts[c.type]||0)+1);
document.getElementById('legend').innerHTML = Object.entries(TYPE_LABELS).map(([t,label]) =>
  `<div class="legend-row"><span class="dot" style="background:${TYPE_COLORS[t]}"></span><span>${label} · ${counts[t]||0}</span></div>`
).join('');

document.getElementById('filter-chips').innerHTML = Object.entries(TYPE_LABELS).map(([t,label]) =>
  `<span class="filter-chip active" data-type="${t}" onclick="toggleType('${t}')"><span class="dot" style="background:${TYPE_COLORS[t]}"></span>${label}</span>`
).join('');

function toggleType(t){
  if (activeTypes.has(t)) activeTypes.delete(t); else activeTypes.add(t);
  document.querySelector(`.filter-chip[data-type="${t}"]`).classList.toggle('active', activeTypes.has(t));
  renderGraph();
}

function onSearch(){ searchTerm = document.getElementById('search').value.trim().toLowerCase(); renderGraph(); }

function cssVar(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function shorten(u){ try { const u2=new URL(u); return u2.hostname+(u2.pathname.length>1?'…':''); } catch { return u; } }

function renderGraph(){
  const categories = Object.keys(TYPE_LABELS).map(name => ({name}));
  const catIdx = {}; Object.keys(TYPE_LABELS).forEach((t,i) => catIdx[t]=i);
  const nodes = [];
  for (const c of BUNDLE.concepts) {
    if (!activeTypes.has(c.type)) continue;
    let match = true;
    if (searchTerm) {
      const hay = (c.title+' '+c.id+' '+c.tags.join(' ')).toLowerCase();
      match = hay.includes(searchTerm);
    }
    const deg = degree.get(c.id) || 0;
    const size = Math.min(46, 14 + deg*3);
    nodes.push({
      id: c.id,
      name: c.title.length > 34 ? c.title.slice(0,32)+'…' : c.title,
      symbolSize: match ? size : Math.max(10, size*0.6),
      itemStyle: { color: TYPE_COLORS[c.type], opacity: match ? 1 : 0.22 },
      label: { show: match || deg >= 4, color: cssVar('--fg'), fontSize: 11 },
      category: catIdx[c.type],
      _cid: c.id,
    });
  }
  const visibleIds = new Set(nodes.map(n => n.id));
  const links = [];
  for (const e of BUNDLE.edges) {
    if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) continue;
    links.push({ source: e.source, target: e.target, lineStyle: { color: cssVar('--border'), opacity: 0.45, curveness: 0.18 }});
  }
  document.getElementById('stats').textContent = nodes.length + ' nodes · ' + links.length + ' edges';

  const layoutSel = document.getElementById('layout').value;
  chart.setOption({
    tooltip: { formatter: p => p.data && p.data._cid ? conceptMap.get(p.data._cid).title : (p.data ? p.data.name : '') },
    series: [{
      type: 'graph',
      layout: layoutSel,
      force: layoutSel === 'force' ? { repulsion: 240, gravity: 0.08, edgeLength: [55,150], layoutAnimation: true, friction: 0.6 } : undefined,
      circular: layoutSel === 'circular' ? { rotateLabel: false } : undefined,
      roam: true,
      draggable: true,
      categories,
      data: nodes,
      links,
      edgeSymbol: ['none','arrow'],
      edgeSymbolSize: 7,
      emphasis: { focus: 'adjacency', lineStyle: { width: 2, opacity: 1 }, label: { show: true, fontSize: 12 } },
      lineStyle: { color: cssVar('--border') },
      animationDuration: 800,
    }],
  }, true);
}

function showConcept(cid){
  const c = conceptMap.get(cid);
  if (!c) return;
  const f = c.fields || {};
  const metaRows = [
    ['type', c.type],
    ['slug', c.slug],
    ['tags', (c.tags||[]).join(', ') || '—'],
    ['resource', c.resource ? `<a href="${c.resource}" target="_blank" style="color:var(--accent)">${shorten(c.resource)}</a>` : '—'],
    ['updated', c.timestamp.slice(0,10)],
  ];
  const extras = {
    papers: [['authors',(f.authors||[]).join(', ')],['year',f.year||''],['venue',f.venue||''],['arXiv',f.arxiv_id||'']],
    datasets: [['source',f.source||''],['geography',[].concat(f.geography||[]).join(', ')],['access',f.access||''],['size',f.size||'']],
    methods: [['category',f.category||''],['paper',f.paper||'']],
    applications: [['status',f.status||''],['category',f.category||'']],
    benchmarks: [['task',f.task||''],['year',f.year||'']],
  }[c.type] || [];
  const back = (backlinks.get(cid)||[]).filter(b => conceptMap.has(b.source));
  const body = c.body || '_No body._';

  document.getElementById('sb-content').innerHTML =
    `<div class="sb-type">${TYPE_LABELS[c.type]}</div>` +
    `<div class="sb-title">${escapeHtml(c.title)}</div>` +
    (c.description ? `<div class="sb-desc">${escapeHtml(c.description)}</div>` : '') +
    `<div class="sb-meta">${metaRows.concat(extras).map(([k,v]) => `<k>${k}</k><v>${v}</v>`).join('')}</div>` +
    `<div class="sb-section"><div class="sb-section-h">Body</div><div class="sb-body">${marked.parse(body)}</div></div>` +
    (back.length ? `<div class="sb-section"><div class="sb-section-h">Cited by (${back.length})</div>${back.map(b => {
      const src = conceptMap.get(b.source);
      return `<div class="back-item" onclick="showConcept('${b.source}')"><span style="color:${TYPE_COLORS[src.type]}">●</span><span>${escapeHtml(src.title)}</span><span class="bi-kind">${b.kind}</span></div>`;
    }).join('')}</div>` : '');
  document.getElementById('sb-empty').style.display = 'none';
  document.getElementById('sb-content').style.display = 'block';
}

loadTheme();
chart = echarts.init(document.getElementById('graph'));
chart.on('click', p => { if (p.data && p.data._cid) showConcept(p.data._cid); });
window.addEventListener('resize', () => chart.resize());
renderGraph();
</script>
</body>
</html>
"""


def main():
    slug_index: dict[str, str] = {}
    concepts = load_yaml_entries(slug_index)
    concepts.extend(load_wiki(slug_index))

    project_concepts, name_index = load_projects(slug_index)
    concepts.extend(project_concepts)
    concepts.extend(load_work_packages(project_concepts, slug_index))
    concepts.extend(load_deliverables(project_concepts, slug_index))
    concepts.extend(load_portals(slug_index, name_index))
    concepts.extend(load_roles(slug_index))
    concepts.extend(load_occupations(slug_index))

    edges = build_edges(concepts, slug_index, name_index)

    bundle = {
        "okf_version": "0.1",
        "name": "livlab",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "meta": {
            "concept_count": len(concepts),
            "edge_count": len(edges),
            "by_type": {t: sum(1 for c in concepts if c["type"] == t) for t in TYPE_LABELS},
        },
        "concepts": concepts,
        "edges": edges,
    }

    bundle_json = json.dumps(bundle, ensure_ascii=False, indent=2)
    (KB_ROOT / "bundle.json").write_text(bundle_json, encoding="utf-8")

    safe_bundle = bundle_json.replace("<", "\\u003c")
    colors_js = "{" + ", ".join(f'"{k}":"{v}"' for k, v in TYPE_COLORS.items()) + "}"
    labels_js = "{" + ", ".join(f'"{k}":"{v}"' for k, v in TYPE_LABELS.items()) + "}"
    html = (HTML_TEMPLATE
            .replace("__BUNDLE_JSON__", safe_bundle)
            .replace("__TYPE_COLORS__", colors_js)
            .replace("__TYPE_LABELS__", labels_js))
    (PORTAL_DIR / "knowledge_graph.html").write_text(html, encoding="utf-8")

    print(f"OK  concepts={len(concepts)}  edges={len(edges)}")
    print(f"    by_type={bundle['meta']['by_type']}")
    print(f"    wrote {KB_ROOT / 'bundle.json'}")
    print(f"    wrote {PORTAL_DIR / 'knowledge_graph.html'}")


if __name__ == "__main__":
    main()
