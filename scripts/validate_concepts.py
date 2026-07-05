#!/usr/bin/env python3
"""validate_concepts.py - LIVLAB structural validator.

Implements the validation rules from config/concept_charter.md section 5.2.
Reads knowledge/bundle.json and checks each concept against type-specific rules.

Severity levels:
  ERROR - entry violates a constitution principle or structural requirement
  WARN  - entry is suboptimal; should be fixed but not blocking

Usage:  python scripts/validate_concepts.py
        Exits 1 if any ERROR, 0 otherwise.
"""
from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

BUNDLE = Path(__file__).resolve().parent.parent / "knowledge" / "bundle.json"


def main() -> int:
    with open(BUNDLE, encoding="utf-8") as f:
        bundle = json.load(f)

    concepts = bundle["concepts"]
    cmap = {c["id"]: c for c in concepts}

    degree = defaultdict(int)
    outgoing: dict[str, list[dict]] = defaultdict(list)
    for e in bundle["edges"]:
        degree[e["source"]] += 1
        degree[e["target"]] += 1
        outgoing[e["source"]].append(e)

    errors: list[str] = []
    warnings: list[str] = []

    for c in concepts:
        cid, t, f = c["id"], c["type"], c.get("fields", {})

        # ── Universal rules ──────────────────────────────────────────────

        if not c.get("title", "").strip():
            errors.append(f"{cid}: empty title")

        if not c.get("description", "").strip():
            warnings.append(f"{cid}: empty description")

        # ── Type-specific rules ──────────────────────────────────────────

        if t == "papers":
            if degree[cid] == 0:
                warnings.append(f"{cid}: paper with zero edges (no datasets or methods linked)")

            aid = f.get("arxiv_id")
            if aid:
                dupes = [c2["id"] for c2 in concepts
                         if c2["type"] == "papers" and c2["fields"].get("arxiv_id") == aid
                         and c2["id"] != cid]
                if dupes:
                    errors.append(f"{cid}: duplicate arxiv_id '{aid}' also on {dupes}")

        elif t == "methods":
            paper_field = f.get("paper")
            has_paper_edge = any(e["kind"] == "method-of" for e in outgoing.get(cid, []))
            if paper_field and not has_paper_edge:
                warnings.append(f"{cid}: method has paper='{paper_field}' but edge did not resolve")
            if not paper_field and degree[cid] == 0:
                warnings.append(f"{cid}: method with zero edges and no paper reference")

        elif t == "applications":
            ds = f.get("data_sources") or []
            has_ds_edge = any(e["kind"] == "uses-dataset" for e in outgoing.get(cid, []))
            if not ds and not has_ds_edge:
                errors.append(f"{cid}: application with no data_sources")

        elif t == "datasets":
            qn = f.get("quality_notes")
            if qn is not None and not str(qn).strip():
                errors.append(f"{cid}: dataset with blank quality_notes (constitution [2])")
            elif qn is None:
                warnings.append(f"{cid}: dataset missing quality_notes field (template says REQUIRED)")

        elif t == "portals":
            projs = f.get("projects") or []
            if not projs:
                errors.append(f"{cid}: portal with no project links")
            if f.get("status") is False:
                comment = f.get("comment", "")
                if not comment or comment == "null":
                    errors.append(f"{cid}: inactive portal with no comment explaining why (constitution [10])")

        elif t == "deliverables":
            has_proj = any(e["kind"] == "deliverable-of" for e in outgoing.get(cid, []))
            has_wp = any(e["kind"] == "belongs-to-wp" for e in outgoing.get(cid, []))
            if not has_proj:
                errors.append(f"{cid}: deliverable with no project link")
            if not has_wp:
                errors.append(f"{cid}: deliverable with no WP link")

        elif t == "work_packages":
            has_proj = any(e["kind"] == "wp-of-project" for e in outgoing.get(cid, []))
            has_deliv = any(e["kind"] == "produces" for e in outgoing.get(cid, []))
            if not has_proj:
                errors.append(f"{cid}: work package with no project link")
            if not has_deliv:
                warnings.append(f"{cid}: work package produces no deliverables")

        elif t == "wiki":
            has_cite = any(e["kind"] == "cites" for e in outgoing.get(cid, []))
            if not has_cite:
                warnings.append(f"{cid}: wiki article cites no papers")

        # ── Orphan check (WARN) ──────────────────────────────────────────
        # Roles are leaf consumers — expected to have zero edges.
        if degree[cid] == 0 and t != "roles":
            warnings.append(f"{cid}: orphan concept (zero edges)")

    # ── Report ───────────────────────────────────────────────────────────
    total = len(concepts)
    edge_count = len(bundle["edges"])
    print(f"Validated {total} concepts, {edge_count} edges from {BUNDLE.name}")

    if errors:
        print(f"\nERRORS ({len(errors)}):")
        for e in errors:
            print(f"  X {e}")

    if warnings:
        print(f"\nWARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"  ! {w}")

    if not errors and not warnings:
        print("CLEAN - all structural rules pass.")
    elif not errors:
        print(f"\nPASS - {len(warnings)} warnings, 0 errors.")
    else:
        print(f"\nFAIL - {len(errors)} errors, {len(warnings)} warnings.")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
