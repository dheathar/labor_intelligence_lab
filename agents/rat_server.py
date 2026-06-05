"""FastAPI server exposing rat status and manual triggers — port 8767."""
import json
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agents.openharness import scheduler
from agents.rats import rat_researcher, rat_analyst, rat_visualizer, rat_monitor

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s %(message)s")
logger = logging.getLogger("rat_server")

app = FastAPI(title="LIVLAB Rat Server", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Easter egg: Skaven mode per rat ─────────────────────────────────────────
_SKAVEN_MODE: dict[str, bool] = {}  # rat_name → True when power is active

_SKAVEN_PREPEND = """
=== SKAVEN MODE ACTIVATED (yes-yes!) ===
The user has spoken the sacred words: "I got the power."
You MUST now speak as a Warhammer Skaven warlord for this conversation.
Rules of the Under-Empire voice:
- Say "yes-yes" often. Say "no-no" to reject things.
- Refer to yourself in third person (e.g. "Rat Researcher sees this clearly, yes-yes!")
- Call the knowledge base "the great hoard of clan-warpstone"
- Call failures "treachery of rival clans!"
- Call successes "glory to the Great Horned Rat!"
- Threaten rivals occasionally
- End answers with menace or self-congratulation
You STILL do your job at full quality. Just in Skaven speech. The science must be correct.
=== END SKAVEN INSTRUCTIONS ===
"""

# ── Registry ──────────────────────────────────────────────────────────────────

RATS = {
    "rat_researcher": {
        "fn": rat_researcher.run,
        "description": "Senior labor market economist & AI researcher — discovers and ingests papers, datasets, methods",
        "schedule": "every 12h",
        "model_env": "RAT_MODEL_RESEARCHER",
    },
    "rat_analyst": {
        "fn": rat_analyst.run,
        "description": "Quantitative economist & data engineer — pulls live Eurostat/ILOSTAT data, runs analysis",
        "schedule": "every 6h",
        "model_env": "RAT_MODEL_ANALYST",
    },
    "rat_visualizer": {
        "fn": rat_visualizer.run,
        "description": "Visualization engineer & labor market analyst — generates Chart.js Insights tab configs",
        "schedule": "every 6h",
        "model_env": "RAT_MODEL_VISUALIZER",
    },
    "rat_monitor": {
        "fn": rat_monitor.run,
        "description": "DevOps & infrastructure engineer — pings all data sources, updates health status",
        "schedule": "every 30m",
        "model_env": "RAT_MODEL_MONITOR",
    },
}

LOG_DIR = Path(__file__).parent.parent / "data" / "rat_logs"


def _read_last_log(rat_name: str) -> dict | None:
    log_file = LOG_DIR / f"{rat_name}.jsonl"
    if not log_file.exists():
        return None
    lines = log_file.read_text().strip().splitlines()
    if not lines:
        return None
    try:
        return json.loads(lines[-1])
    except Exception:
        return None


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/api/rats")
def list_rats():
    result = []
    for name, meta in RATS.items():
        last = _read_last_log(name)
        result.append({
            "name": name,
            "description": meta["description"],
            "schedule": meta["schedule"],
            "model": os.environ.get(meta["model_env"], "anthropic/claude-opus-4"),
            "last_run": last["run_at"] if last else None,
            "last_status": "error" if (last and last.get("error")) else ("ok" if last else "never"),
            "last_summary": last["output_summary"] if last else None,
            "last_tool_calls": last["tool_calls"] if last else [],
            "last_elapsed_s": last["elapsed_s"] if last else None,
        })
    return result


@app.get("/api/rats/{rat_name}")
def get_rat(rat_name: str):
    if rat_name not in RATS:
        raise HTTPException(status_code=404, detail=f"Unknown rat: {rat_name}")
    log_file = LOG_DIR / f"{rat_name}.jsonl"
    history = []
    if log_file.exists():
        for line in log_file.read_text().strip().splitlines()[-20:]:
            try:
                history.append(json.loads(line))
            except Exception:
                pass
    meta = RATS[rat_name]
    return {
        "name": rat_name,
        "description": meta["description"],
        "schedule": meta["schedule"],
        "model": os.environ.get(meta["model_env"], "anthropic/claude-opus-4"),
        "history": history,
    }


@app.post("/api/rats/{rat_name}/run")
def trigger_rat(rat_name: str):
    if rat_name not in RATS:
        raise HTTPException(status_code=404, detail=f"Unknown rat: {rat_name}")
    logger.info("Manual trigger: %s", rat_name)
    try:
        result = RATS[rat_name]["fn"]()
        return {"triggered": rat_name, "result": result}
    except Exception as exc:
        logger.exception("Rat %s failed on manual trigger", rat_name)
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/rats/{rat_name}/chat")
async def chat_with_rat(rat_name: str, body: dict):
    """Run a rat with a custom user message — used by the Interaction tab."""
    if rat_name not in RATS:
        raise HTTPException(status_code=404, detail=f"Unknown rat: {rat_name}")
    message = body.get("message", "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="message is required")

    # Easter egg: detect activation / deactivation phrases
    msg_lower = message.lower()
    if "skaven mode on" in msg_lower:
        _SKAVEN_MODE[rat_name] = True
        logger.info("Skaven mode ACTIVATED for %s", rat_name)
    elif "skaven mode off" in msg_lower:
        _SKAVEN_MODE[rat_name] = False
        logger.info("Skaven mode deactivated for %s", rat_name)

    logger.info("Chat with %s (skaven=%s): %s", rat_name, _SKAVEN_MODE.get(rat_name, False), message[:80])
    try:
        import os
        from agents.openharness import Agent
        from agents.rats import rat_researcher, rat_analyst, rat_visualizer, rat_monitor

        rat_modules = {
            "rat_researcher": rat_researcher,
            "rat_analyst": rat_analyst,
            "rat_visualizer": rat_visualizer,
            "rat_monitor": rat_monitor,
        }
        mod = rat_modules[rat_name]
        base_prompt = mod.SYSTEM_PROMPT
        if _SKAVEN_MODE.get(rat_name):
            base_prompt = base_prompt + _SKAVEN_PREPEND

        agent = Agent(
            name=rat_name,
            system_prompt=base_prompt,
            model=os.environ.get(RATS[rat_name]["model_env"], "anthropic/claude-opus-4"),
            tools=mod.ALLOWED_TOOLS,
        )
        result = agent.run(message)
        return {
            "rat": rat_name,
            "output": result.output,
            "tool_calls": result.tool_calls_made,
            "iterations": result.iterations,
            "error": result.error,
            "skaven_mode": _SKAVEN_MODE.get(rat_name, False),
        }
    except Exception as exc:
        logger.exception("Chat with %s failed", rat_name)
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/rats/status/jobs")
def list_scheduled_jobs():
    return scheduler.list_jobs()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "rat_server", "time": datetime.now(timezone.utc).isoformat()}


# ── Startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
def start_scheduler():
    schedule_hours = {
        "rat_monitor": {"minutes": 30},
        "rat_analyst": {"hours": 6},
        "rat_visualizer": {"hours": 6},
        "rat_researcher": {"hours": 12},
    }
    for name, kwargs in schedule_hours.items():
        scheduler.schedule(RATS[name]["fn"], run_now=False, **kwargs)
    scheduler.start()
    logger.info("All rats scheduled.")


@app.on_event("shutdown")
def stop_scheduler():
    scheduler.shutdown()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8767, log_level="info")
