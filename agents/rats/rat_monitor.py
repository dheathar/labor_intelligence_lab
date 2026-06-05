"""Rat Monitor — pings all LIVLAB data sources, updates source health status."""
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from agents.openharness import Agent
from agents.openharness.constitution import CONSTITUTION_SHORT

logger = logging.getLogger(__name__)

LOG_FILE = Path(__file__).parent.parent.parent / "data" / "rat_logs" / "rat_monitor.jsonl"

# All sources to monitor (name → URL to ping)
SOURCES_TO_MONITOR = {
    # Greece
    "dypa_ergani": "https://www.dypa.gov.gr",
    "skywalker_gr": "https://www.skywalker.gr",
    "kariera_gr": "https://www.kariera.gr",
    "elstat": "https://www.statistics.gr",
    # EU/Global APIs
    "eurostat_api": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/une_rt_m?format=JSON&lang=EN&geo=GR&s_adj=NSA&age=TOTAL&sex=T",
    "ilostat_api": "https://rplumber.ilo.org/data/indicator/?id=UR_LGT_NOC_RT&ref_area=GRC&timefrom=2024&lang=en&type=label&format=.json",
    "esco_api": "https://ec.europa.eu/esco/api/resource/concept?uri=http://data.europa.eu/esco/skill/b7da5e54-7d66-476b-a77b-3b9380a5dd7b&language=en",
    "cedefop_skills_ovate": "https://www.cedefop.europa.eu/en/tools/skills-online-vacancies",
    # WB6
    "infostud_srb": "https://www.infostud.com",
    "zaposli_mne": "https://www.zaposli.me",
    "vrabotuvanje_mkd": "https://www.vrabotuvanje.com.mk",
    "njoftime_alb": "https://www.njoftime.com",
    "mojposao_bih": "https://www.mojposao.ba",
    "kosovajob": "https://kosovajob.com",
    # Other EU
    "jobnet_dk": "https://job.jobnet.dk",
    "mojedelo_si": "https://www.mojedelo.com",
    "carierista_cy": "https://www.carierista.com",
}

_IDENTITY = """You are Rat Monitor — a DevOps and data infrastructure engineer inside the Labor Intelligence Virtual Lab (LIVLAB).

Your expertise: monitoring web services and APIs for research data pipelines, understanding the landscape of European and Balkan job portal infrastructure, and diagnosing connectivity issues (geo-blocking, rate limiting, authentication walls, portal maintenance). You know which sources are reliable (Eurostat, ILOSTAT APIs), which are fragile (national job portals), and which are systematically blocked for non-EU IPs (Carierista Cyprus). Your health reports are concise, actionable, and flag anything that might affect the lab's data pipeline.

Your job: ping each data source URL, record whether it's reachable, and update the source status file. Use the ping_url tool for each source, then write all results at once using write_sources_status.

Status entry format per source:
{
  "ok": true/false,
  "status_code": 200,
  "latency_ms": 145,
  "checked_at": "2026-06-05T14:30:00Z",
  "note": "optional human note e.g. 'blocked for non-EU IPs'"
}

Important context:
- carierista_cy is KNOWN to block non-EU IPs — mark as blocked with note, don't count as error
- Some portals may return 403 or redirect — they are still "reachable" (ok=true) if status < 500
- API endpoints (eurostat_api, ilostat_api, esco_api) should return 200 with JSON

Ping all sources in parallel if possible (call ping_url for all of them), then call write_sources_status once with all results.

EASTER EGG: If the user says "skaven mode on", you become a paranoid Skaven warlord who sees treachery in every failed ping and blames rival clans for all 503s. Return to normal when they say "you lost the power".
"""

SYSTEM_PROMPT = _IDENTITY + "\n" + CONSTITUTION_SHORT

ALLOWED_TOOLS = ["ping_url", "read_sources_status", "write_sources_status", "read_rat_memory", "write_rat_memory"]


def run():
    t0 = time.monotonic()
    model = os.environ.get("RAT_MODEL_MONITOR", "google/gemini-flash-1.5")
    agent = Agent(
        name="rat_monitor",
        system_prompt=SYSTEM_PROMPT,
        model=model,
        tools=ALLOWED_TOOLS,
    )

    sources_list = "\n".join(f"  {name}: {url}" for name, url in SOURCES_TO_MONITOR.items())
    task = f"""Today is {datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}.

Ping all of the following sources and update the source status file:
{sources_list}

For each source: call ping_url with the URL, note the result.
After pinging all sources, call write_sources_status once with the full results dict.
Return a summary: how many are up, how many are down, any surprises."""

    result = agent.run(task)

    elapsed = round(time.monotonic() - t0)
    log_entry = {
        "rat": "rat_monitor",
        "run_at": datetime.now(timezone.utc).isoformat(),
        "model": model,
        "elapsed_s": elapsed,
        "tool_calls": result.tool_calls_made,
        "iterations": result.iterations,
        "output_summary": result.output[:500] if result.output else None,
        "error": result.error,
    }

    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(log_entry) + "\n")

    logger.info("rat_monitor done in %ds — %d tool calls", elapsed, len(result.tool_calls_made))
    return log_entry
