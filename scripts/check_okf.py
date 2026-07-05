#!/usr/bin/env python3
"""check_okf.py - Validate OKF v0.1 section-9 conformance of knowledge/okf_bundle/.

Checks:
  1. Every non-reserved .md has parseable YAML frontmatter with non-empty `type`
  2. Reserved filenames (index.md, log.md) follow sections 6/7
  3. Cross-links point to existing concepts (section 5)

Usage:  python scripts/check_okf.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent / "knowledge" / "okf_bundle"
RESERVED = {"index.md", "log.md"}


def main() -> int:
    fails: list[str] = []
    checked = 0
    for md in sorted(ROOT.rglob("*.md")):
        checked += 1
        text = md.read_text(encoding="utf-8")
        rel = md.relative_to(ROOT).as_posix()

        if md.name in RESERVED:
            if text.startswith("---"):
                fails.append(f"{rel}: reserved file must not have frontmatter (section 6/7)")
            continue

        if not text.startswith("---"):
            fails.append(f"{rel}: missing frontmatter (section 9.1)")
            continue

        end = text.find("\n---", 3)
        if end == -1:
            fails.append(f"{rel}: unterminated frontmatter")
            continue

        try:
            fm = yaml.safe_load(text[3:end])
        except Exception as e:
            fails.append(f"{rel}: unparseable frontmatter ({e})")
            continue

        if not fm.get("type"):
            fails.append(f"{rel}: missing or empty `type` field (section 9.2)")

        for m in re.finditer(r"\]\((/[^)]+\.md)\)", text):
            target = ROOT / m.group(1).lstrip("/")
            if not target.exists():
                fails.append(f"{rel}: broken cross-link -> {m.group(1)}")

    print(f"Checked {checked} markdown files under {ROOT.relative_to(ROOT.parent.parent)}")
    if fails:
        print(f"FAILURES ({len(fails)}):")
        for f in fails:
            print(f"  X {f}")
        return 1
    print(f"PASS - OKF v0.1 conformant (section 9). {checked} files OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
