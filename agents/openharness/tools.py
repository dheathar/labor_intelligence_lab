"""Tool registry — decorate plain functions with @tool to register them."""
import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

import httpx
import yaml

TOOL_REGISTRY: dict[str, dict] = {}
KNOWLEDGE_ROOT = Path(__file__).parent.parent.parent / "knowledge"
DATA_ROOT = Path(__file__).parent.parent.parent / "data"
VALID_KB_TYPES = {"papers", "datasets", "methods", "applications", "benchmarks"}


def tool(name: str, description: str, parameters: dict | None = None):
    """Decorator that registers a function as an agent tool."""
    def decorator(fn: Callable) -> Callable:
        import inspect
        sig = inspect.signature(fn)
        props = {}
        required = []
        for pname, param in sig.parameters.items():
            ann = param.annotation
            if ann == str or ann == inspect.Parameter.empty:
                props[pname] = {"type": "string"}
            elif ann == int:
                props[pname] = {"type": "integer"}
            elif ann == bool:
                props[pname] = {"type": "boolean"}
            elif ann == dict or ann == Any:
                props[pname] = {"type": "object"}
            elif ann == list:
                props[pname] = {"type": "array", "items": {"type": "string"}}
            else:
                props[pname] = {"type": "string"}
            if param.default is inspect.Parameter.empty:
                required.append(pname)

        TOOL_REGISTRY[name] = {
            "fn": fn,
            "description": description,
            "parameters": parameters or {
                "type": "object",
                "properties": props,
                "required": required,
            },
        }
        return fn
    return decorator


# ── Web ──────────────────────────────────────────────────────────────────────

@tool("fetch_url", "Fetch a URL and return up to 8000 chars of text content")
def fetch_url(url: str) -> str:
    resp = httpx.get(url, timeout=20, follow_redirects=True,
                     headers={"User-Agent": "LIVLAB-rat/1.0"})
    resp.raise_for_status()
    text = resp.text
    return text[:8000] if len(text) > 8000 else text


@tool("ping_url", "Check if a URL is reachable. Returns status code and latency_ms.")
def ping_url(url: str) -> dict:
    try:
        t0 = time.monotonic()
        resp = httpx.head(url, timeout=10, follow_redirects=True)
        latency_ms = round((time.monotonic() - t0) * 1000)
        return {"ok": resp.status_code < 400, "status": resp.status_code, "latency_ms": latency_ms}
    except Exception as exc:
        return {"ok": False, "status": 0, "latency_ms": 0, "error": str(exc)}


# ── Knowledge Base ────────────────────────────────────────────────────────────

@tool("list_knowledge", "List existing knowledge entry slugs for a given type (papers/datasets/methods/applications/benchmarks)")
def list_knowledge(type: str) -> list:
    if type not in VALID_KB_TYPES:
        return [f"ERROR: invalid type '{type}'. Valid: {sorted(VALID_KB_TYPES)}"]
    return [p.stem for p in (KNOWLEDGE_ROOT / type).glob("*.yml")]


@tool("read_knowledge_entry", "Read an existing knowledge YAML entry. type: papers/datasets/methods/applications/benchmarks")
def read_knowledge_entry(type: str, slug: str) -> dict:
    if type not in VALID_KB_TYPES:
        return {"error": f"invalid type '{type}'"}
    path = KNOWLEDGE_ROOT / type / f"{slug}.yml"
    if not path.exists():
        return {"error": f"not found: {path}"}
    with open(path) as f:
        return yaml.safe_load(f)


@tool("write_knowledge_entry", "Create or update a knowledge YAML entry. type: papers/datasets/methods/applications/benchmarks. content is a YAML-serialisable dict.")
def write_knowledge_entry(type: str, slug: str, content: dict) -> str:
    if type not in VALID_KB_TYPES:
        return f"ERROR: invalid type '{type}'"
    path = KNOWLEDGE_ROOT / type / f"{slug}.yml"
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        yaml.dump(content, f, allow_unicode=True, sort_keys=False, default_flow_style=False)
    return f"written: {path}"


# ── Raw Data ──────────────────────────────────────────────────────────────────

@tool("list_raw_data", "List files in data/raw/<source>/. source is a subfolder name.")
def list_raw_data(source: str) -> list:
    target = DATA_ROOT / "raw" / source
    if not target.exists():
        return []
    return [str(p.relative_to(DATA_ROOT)) for p in target.iterdir() if p.is_file()]


@tool("read_raw_data", "Read a file from data/raw/. path is relative to the data/ directory.")
def read_raw_data(path: str) -> str:
    target = DATA_ROOT / path
    if not target.exists():
        return f"ERROR: not found: {target}"
    text = target.read_text(errors="replace")
    return text[:12000] if len(text) > 12000 else text


@tool("write_raw_data", "Write content to data/raw/<source>/<filename>.")
def write_raw_data(source: str, filename: str, content: str) -> str:
    target = DATA_ROOT / "raw" / source
    target.mkdir(parents=True, exist_ok=True)
    (target / filename).write_text(content)
    return f"written: {target / filename}"


# ── Wiki ─────────────────────────────────────────────────────────────────────

WIKI_ROOT = KNOWLEDGE_ROOT / "wiki"


@tool("read_wiki", "Read a wiki article by slug (filename without .md). Use list_wiki first if unsure of the slug.")
def read_wiki(slug: str) -> str:
    path = WIKI_ROOT / f"{slug}.md"
    if not path.exists():
        available = [p.stem for p in WIKI_ROOT.glob("*.md")] if WIKI_ROOT.exists() else []
        return f"ERROR: wiki/{slug}.md not found. Available: {available}"
    text = path.read_text()
    return text[:12000] if len(text) > 12000 else text


@tool("list_wiki", "List all available wiki article slugs.")
def list_wiki() -> list:
    if not WIKI_ROOT.exists():
        return []
    return [p.stem for p in sorted(WIKI_ROOT.glob("*.md"))]


@tool("write_wiki", "Create or update a wiki article. slug is the filename without .md. content is the full markdown text. Follow the existing wiki style: first-principles explanation, code examples where useful, references at the end.")
def write_wiki(slug: str, content: str) -> str:
    WIKI_ROOT.mkdir(parents=True, exist_ok=True)
    path = WIKI_ROOT / f"{slug}.md"
    path.write_text(content)
    return f"written: {path}"


# ── Rat Memory ────────────────────────────────────────────────────────────────

MEMORY_ROOT = DATA_ROOT / "rat_memory"


@tool("read_rat_memory", "Read this rat's recent memory log. Returns last N lines of JSONL. rat_name: the rat's own name (e.g. rat_researcher).")
def read_rat_memory(rat_name: str, last_n: int = 20) -> list:
    path = MEMORY_ROOT / f"{rat_name}.jsonl"
    if not path.exists():
        return []
    lines = path.read_text().strip().split("\n") if path.stat().st_size > 0 else []
    entries = []
    for line in lines[-last_n:]:
        try:
            entries.append(json.loads(line))
        except json.JSONDecodeError:
            pass
    return entries


@tool("write_rat_memory", "Log a significant finding or decision to this rat's memory. rat_name: the rat's own name. entry_type: discovery|decision|warning|skip. summary: one sentence.")
def write_rat_memory(rat_name: str, entry_type: str, summary: str) -> str:
    MEMORY_ROOT.mkdir(parents=True, exist_ok=True)
    path = MEMORY_ROOT / f"{rat_name}.jsonl"
    record = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "type": entry_type,
        "summary": summary,
    }
    with open(path, "a") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    return f"memory logged: {entry_type} — {summary[:80]}"


# ── Source Status ─────────────────────────────────────────────────────────────

_STATUS_FILE = DATA_ROOT / "source_status.json"


@tool("read_sources_status", "Read the current source health status JSON.")
def read_sources_status() -> dict:
    if not _STATUS_FILE.exists():
        return {}
    with open(_STATUS_FILE) as f:
        return json.load(f)


@tool("write_sources_status", "Update one or more entries in the source health status JSON. updates is a dict of {source_name: {ok, latency_ms, checked_at}}.")
def write_sources_status(updates: dict) -> str:
    current = {}
    if _STATUS_FILE.exists():
        with open(_STATUS_FILE) as f:
            current = json.load(f)
    current.update(updates)
    _STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(_STATUS_FILE, "w") as f:
        json.dump(current, f, indent=2)
    return f"updated {len(updates)} source(s)"
