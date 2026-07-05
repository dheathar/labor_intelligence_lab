#!/usr/bin/env python3
"""publish_okf.py - Materialize an OKF v0.1-conformant bundle from LIVLAB sources.

Reads knowledge/{papers,datasets,methods,applications,benchmarks,wiki}/ and
writes knowledge/okf_bundle/ as a directory tree of markdown files with YAML
frontmatter, inline cross-links, per-directory index.md, and root log.md.

Source stays as YAML/MD (portal + rats untouched). The emitted okf_bundle/ is a
real OKF bundle any spec-conformant consumer can walk, diff in git, and consume.

Conformance (OKF v0.1 section 9):
  1. Every non-reserved .md file has parseable YAML frontmatter  -> yes
  2. Every frontmatter block has a non-empty `type` field         -> yes
  3. Reserved filenames (index.md, log.md) follow sections 6, 7   -> yes

Usage:  python scripts/publish_okf.py
"""
from __future__ import annotations

import shutil
from datetime import datetime, timezone
from pathlib import Path

import yaml

from build_knowledge_graph import (
    KB_ROOT, TYPE_LABELS,
    load_yaml_entries, load_wiki, load_projects, load_work_packages,
    load_deliverables, load_portals, load_roles, load_occupations,
    build_edges, yaml_body,
)

OUT_ROOT = KB_ROOT / "okf_bundle"

OKF_TYPE = {
    "papers": "Paper",
    "datasets": "Dataset",
    "methods": "Method",
    "applications": "Application",
    "benchmarks": "Benchmark",
    "wiki": "Wiki Article",
    "projects": "Project",
    "portals": "Data Portal",
    "deliverables": "Deliverable",
    "work_packages": "Work Package",
    "roles": "User Role",
    "occupations": "Occupation",
}

EDGE_LABEL = {
    "uses-method": "Uses method",
    "uses-dataset": "Uses dataset",
    "method-of": "Method of paper",
    "sota-on": "State of the art on",
    "cites": "Cites",
}

DIR_BLURB = {
    "papers": "Research papers on labor market NLP, online job advertisement intelligence, skills taxonomy, and ALMP evaluation.",
    "datasets": "Labor market datasets across Greece, the Western Balkans, EU, and global scope.",
    "methods": "NLP and ML methods applied to labor market intelligence.",
    "applications": "Use-case applications and dashboards built on LIVLAB data and methods.",
    "benchmarks": "Evaluation benchmarks for skill extraction, occupation classification, and labor forecasting.",
    "wiki": "Karpathy-style first-principles articles serving as the lab's internal AI/NLP knowledge base.",
    "projects": "Active research projects (EU-ALMPO, MicroIdea, Growth4Blue, TRAIN4BLUE).",
    "portals": "OJA crawling portals monitored across 9 countries.",
    "deliverables": "Formal project deliverables with due dates, leads, and access levels.",
    "work_packages": "Project work packages with tasks, leads, and deliverable mappings.",
    "roles": "User personas that consume LIVLAB visualizations and data.",
    "occupations": "ISCO-08 reference occupations used in demand/supply analysis.",
}

PRE_BUILT_TYPES = {"wiki", "projects", "portals", "deliverables", "work_packages", "roles", "occupations"}


def frontmatter(d: dict) -> str:
    """Render a YAML frontmatter block, dropping empty values."""
    fm = {k: v for k, v in d.items() if v not in (None, "", [], {})}
    return "---\n" + yaml.dump(fm, allow_unicode=True, sort_keys=False, default_flow_style=False).strip() + "\n---"


def md_link(label: str, target_cid: str) -> str:
    """Bundle-relative absolute markdown link, OKF section 5.1."""
    return f"[{label}](/{target_cid}.md)"


def edge_label(kind: str, target_type: str) -> str:
    """Target-type-aware label. Fixes e.g. uses-dataset edges that resolve to benchmarks."""
    if kind == "uses-dataset" and target_type == "benchmarks":
        return "Evaluated on"
    return EDGE_LABEL.get(kind, kind)


def concept_body(c: dict, outgoing: list[dict], concept_map: dict[str, dict]) -> str:
    """Build the markdown body: base content + Related section + Citations."""
    if c["type"] in PRE_BUILT_TYPES:
        parts = [c["body"].strip()]
    else:
        parts = [yaml_body(c["fields"], c["type"]).strip()]

    related = []
    for edge in outgoing:
        tgt = concept_map.get(edge["target"])
        if not tgt:
            continue
        label = edge_label(edge["kind"], tgt["type"])
        related.append(f"- {label}: {md_link(tgt['title'], tgt['id'])}")
    if related:
        parts.append("# Related concepts\n\n" + "\n".join(related))

    f = c["fields"]
    citations = []
    if c["type"] == "papers":
        if f.get("arxiv_id"):
            citations.append(f"[1] [arXiv:{f['arxiv_id']}](https://arxiv.org/abs/{f['arxiv_id']})")
        if f.get("doi"):
            citations.append(f"[2] [doi:{f['doi']}](https://doi.org/{f['doi']})")
        if f.get("url"):
            citations.append(f"[3] [Publisher landing page]({f['url']})")
    elif c["type"] == "datasets":
        if f.get("url"):
            citations.append(f"[1] [{f.get('source', 'Source')}]({f['url']})")
        if f.get("api_url"):
            citations.append(f"[2] [API documentation]({f['api_url']})")
    elif c["type"] == "benchmarks":
        if f.get("url"):
            citations.append(f"[1] [Benchmark repository]({f['url']})")
    if citations:
        parts.append("# Citations\n\n" + "\n".join(citations))

    return "\n\n".join(parts) + "\n"


def write_concept(c: dict, outgoing: list[dict], concept_map: dict) -> Path:
    type_dir = OUT_ROOT / c["type"]
    type_dir.mkdir(parents=True, exist_ok=True)
    f = c["fields"]
    fm = {
        "type": OKF_TYPE[c["type"]],
        "title": c["title"],
        "description": c["description"] or None,
        "resource": c["resource"] or None,
        "tags": c["tags"] or None,
        "timestamp": c["timestamp"],
        "slug": c["slug"],
    }
    if c["type"] == "papers":
        for k in ("authors", "year", "venue", "arxiv_id", "doi", "domains"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "datasets":
        for k in ("source", "geography", "access", "size", "temporal_coverage", "update_frequency", "api_available"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "methods":
        for k in ("category", "subcategory", "paper"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "applications":
        for k in ("category", "status", "data_sources", "methods"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "benchmarks":
        for k in ("task", "metrics", "year", "domains"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "projects":
        for k in ("full_name", "role", "period", "status", "theme", "programme", "countries"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "portals":
        for k in ("country", "status"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "deliverables":
        for k in ("wp", "lead", "type", "access", "due_month"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "work_packages":
        for k in ("lead", "start_month", "end_month", "person_months"):
            if f.get(k) is not None:
                fm[k] = f[k]
    elif c["type"] == "occupations":
        for k in ("sector", "isco"):
            if f.get(k) is not None:
                fm[k] = f[k]

    body = concept_body(c, outgoing, concept_map)
    path = type_dir / f"{c['slug']}.md"
    path.write_text(frontmatter(fm) + "\n\n" + body, encoding="utf-8")
    return path


def write_index(type_dir: str, concepts: list[dict]) -> Path:
    """Per-directory index.md (OKF section 6). No frontmatter."""
    d = OUT_ROOT / type_dir
    d.mkdir(parents=True, exist_ok=True)
    label = TYPE_LABELS[type_dir]
    lines = [f"# {label}\n", f"{DIR_BLURB[type_dir]}\n"]
    for c in sorted(concepts, key=lambda x: x["title"].lower()):
        desc = (c["description"] or "").split(". ")[0][:140]
        if desc and not desc.endswith("."):
            desc += "."
        lines.append(f"- [{c['title']}]({c['slug']}.md) - {desc}")
    path = d / "index.md"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def write_root_index(concepts: list[dict]) -> Path:
    """Root index.md listing all subdirectories (OKF section 6)."""
    by_type = {t: [c for c in concepts if c["type"] == t] for t in TYPE_LABELS}
    lines = [
        "# LIVLAB Knowledge Bundle\n",
        "An [Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf) v0.1 bundle.",
        f"Generated from `knowledge/` source files. {len(concepts)} concepts.\n",
    ]
    for t in TYPE_LABELS:
        lines.append(f"- [{TYPE_LABELS[t]}]({t}/) - {DIR_BLURB[t]} ({len(by_type[t])} concepts)")
    path = OUT_ROOT / "index.md"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def write_log(concepts: list[dict], edges: list[dict]) -> Path:
    """Root log.md (OKF section 7)."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    by_type = {t: sum(1 for c in concepts if c["type"] == t) for t in TYPE_LABELS}
    breakdown = ", ".join(f"{TYPE_LABELS[t]}: {n}" for t, n in by_type.items())
    body = (
        "# Bundle Update Log\n\n"
        f"## {today}\n\n"
        f"* **Initialization**: Generated OKF bundle from LIVLAB knowledge base.\n"
        f"* **Stats**: {len(concepts)} concepts, {len(edges)} edges ({breakdown}).\n"
        f"* **Source**: `knowledge/{{papers,datasets,methods,applications,benchmarks,wiki}}/` "
        f"(YAML + Markdown). Re-run `python scripts/publish_okf.py` to refresh.\n"
    )
    path = OUT_ROOT / "log.md"
    path.write_text(body, encoding="utf-8")
    return path


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

    concept_map = {c["id"]: c for c in concepts}
    outgoing = {c["id"]: [] for c in concepts}
    for e in edges:
        outgoing[e["source"]].append(e)

    if OUT_ROOT.exists():
        shutil.rmtree(OUT_ROOT)
    OUT_ROOT.mkdir(parents=True)

    for c in concepts:
        write_concept(c, outgoing[c["id"]], concept_map)

    by_type = {t: [c for c in concepts if c["type"] == t] for t in TYPE_LABELS}
    for t in TYPE_LABELS:
        if by_type[t]:
            write_index(t, by_type[t])

    write_root_index(concepts)
    write_log(concepts, edges)

    md_count = sum(1 for _ in OUT_ROOT.rglob("*.md"))
    print(f"OK  OKF bundle written to {OUT_ROOT}")
    print(f"    {md_count} markdown files ({len(concepts)} concepts + 6 indexes + root index + log)")
    print(f"    {len(edges)} cross-links inlined into concept bodies")


if __name__ == "__main__":
    main()
