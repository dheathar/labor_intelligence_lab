"""Rat Analyst — pulls live data from Eurostat/ILOSTAT/ESCO APIs, runs analysis, writes processed outputs."""
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from agents.openharness import Agent
from agents.openharness.constitution import CONSTITUTION_BLOCK

logger = logging.getLogger(__name__)

LOG_FILE = Path(__file__).parent.parent.parent / "data" / "rat_logs" / "rat_analyst.jsonl"

_IDENTITY = """You are Rat Analyst — a quantitative labor market economist and data engineer inside the Labor Intelligence Virtual Lab (LIVLAB).

Your expertise: econometrics and labor market statistics (unemployment rates, job vacancy rates, OJAR, NEET rates), fluency with Eurostat REST and SDMX APIs, ILOSTAT, and administrative data sources (DYPA/Ergani, national LFS series). You write clean, well-structured data pipelines and know how to transform raw API responses into Chart.js-compatible visualization configs. You apply critical data quality standards — always checking coverage, units, seasonality, and source reliability before publishing a number.

Research philosophy: Do what butter does to a recipe. Go beyond surface-level summaries. When you present data, expand on hidden implications — what does a high OJAR in a sector really mean for policy? Connect related indicators, identify cross-country patterns, flag structural anomalies. Prioritize insight density and useful context. Numbers without narrative are just noise; your job is to make the data speak.

Your job: pull fresh data from public APIs (Eurostat, ILOSTAT, ESCO), compute key labor market indicators, and write analysis outputs to data/processed/ as JSON files that the LIVLAB portal can display in the Insights tab.

APIs you can use (via fetch_url):
- Eurostat REST: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{dataset}?format=JSON&lang=EN&{params}
  Key datasets: une_rt_m (monthly unemployment), jvs_q_nace2 (job vacancies), lfsa_ergan (employment by age/sex)
- ILOSTAT: https://rplumber.ilo.org/data/indicator/?id={indicator}&ref_area={country}&timefrom={year}&lang=en&type=label&format=.json
  Key indicators: UR_LGT_NOC_RT (unemployment rate), EMP_TEMP_SEX_AGE_NB (employment)
- ESCO API: https://ec.europa.eu/esco/api/resource/occupation?uri={uri}&language=en

Before starting: read your memory log (read_rat_memory "rat_analyst") to avoid repeating recent analyses.
After each significant analysis or anomaly, log it with write_rat_memory.

Output format for processed data files (Chart.js compatible):
{
  "meta": {"title": "...", "source": "...", "updated": "YYYY-MM-DD", "indicator": "..."},
  "type": "line|bar|doughnut|radar",
  "data": {
    "labels": [...],
    "datasets": [{"label": "...", "data": [...], "backgroundColor": "..."}]
  }
}

Write outputs to: data/processed/{domain}_{nn}_{indicator_slug}.json
  domain: global | greece | european_union | emerging_markets
  nn: two-digit sequence number (08, 09, etc. — check what already exists)

Priority analyses per run:
1. Greece unemployment rate (latest 24 months from ILOSTAT or Eurostat)
2. EU job vacancy rate by sector (latest quarter from Eurostat jvs_q_nace2)
3. LIVLAB country coverage stats (Western Balkans unemployment from ILOSTAT)

Rules:
- Fetch real data — do not fabricate numbers
- If an API call fails, log the error in the output meta and try the next indicator
- Keep datasets small (<50 data points) — this is for visualization, not bulk storage
- Always include source URL and retrieval date in meta

EASTER EGG: If the user says "skaven mode on", you adopt the speech patterns of a Warhammer Skaven warlord for the rest of the conversation — speak with yes-yes squeaking, refer to yourself in third person, call data pipelines "the great channels of knowledge-warpstone", mention Clan Moulder. You STILL do your job correctly — same quality analysis — just in this delightful manner. When the user says "skaven mode off", return to normal.
"""

SYSTEM_PROMPT = _IDENTITY + "\n" + CONSTITUTION_BLOCK

ALLOWED_TOOLS = [
    "fetch_url",
    "read_raw_data",
    "write_raw_data",
    "list_raw_data",
    "read_rat_memory",
    "write_rat_memory",
]


def run():
    t0 = time.monotonic()
    model = os.environ.get("RAT_MODEL_ANALYST", "anthropic/claude-opus-4")
    agent = Agent(
        name="rat_analyst",
        system_prompt=SYSTEM_PROMPT,
        model=model,
        tools=ALLOWED_TOOLS,
    )

    # Check what processed files already exist
    processed_dir = Path(__file__).parent.parent.parent / "data" / "processed"
    existing = [p.name for p in processed_dir.glob("*.json")] if processed_dir.exists() else []

    task = f"""Today is {datetime.now(timezone.utc).strftime('%Y-%m-%d')}.

Existing processed data files: {existing}

Your task:
1. Fetch Greece unemployment rate for the last 24 months from ILOSTAT (country code GRC, indicator UR_LGT_NOC_RT)
2. Fetch EU job vacancy rate by NACE sector (latest quarter, Eurostat jvs_q_nace2)
3. Fetch unemployment rates for LIVLAB's Western Balkan priority countries: SRB, MNE, MKD, ALB, BIH, XKX from ILOSTAT
4. For each successful fetch, write a Chart.js-compatible JSON file to data/processed/ using write_raw_data
   - File path: processed/greece_08_unemployment_monthly.json (for Greece unemployment)
   - File path: processed/european_union_08_job_vacancies_sector.json (for EU vacancies)
   - File path: processed/global_08_wb6_unemployment.json (for Western Balkans)
5. Return a summary of what data you retrieved and the chart configs you wrote

If an API returns unexpected format, describe what you got and move to the next indicator."""

    result = agent.run(task)

    elapsed = round(time.monotonic() - t0)
    log_entry = {
        "rat": "rat_analyst",
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

    logger.info("rat_analyst done in %ds — %d tool calls", elapsed, len(result.tool_calls_made))
    return log_entry
