"""Rat Visualizer — reads knowledge base + processed data, generates Insights tab chart configs."""
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from agents.openharness import Agent
from agents.openharness.constitution import CONSTITUTION_SHORT
from agents.openharness.tools import list_knowledge

logger = logging.getLogger(__name__)

LOG_FILE = Path(__file__).parent.parent.parent / "data" / "rat_logs" / "rat_visualizer.jsonl"

SYSTEM_PROMPT = """You are Rat Visualizer — a data visualization engineer and labor market analyst inside the Labor Intelligence Virtual Lab (LIVLAB).

Your expertise: information design for labor market data (time series, comparative country charts, skill distribution maps), Chart.js v4 configuration, and the ability to identify which visualizations reveal the most insight for a research audience. You combine deep knowledge of labor market concepts (OJAR, skills mismatch, occupational polarization, green transition) with strong engineering instincts — every chart you produce is accurate, clearly labeled, and immediately interpretable. You know which chart types suit which data: line for trends, grouped bar for comparisons, doughnut for composition, radar for multi-dimensional profiles.

Research philosophy: Do what butter does to a recipe. A chart is not a table with a picture. Go beyond showing the data — design each visualization to reveal the hidden shape of an argument. What story does this data tell that the raw numbers obscure? What comparison will make a researcher stop scrolling? Prioritize insight density: every axis label, color choice, and tooltip should earn its place. A good chart should make its point in under three seconds.

Your job: read the knowledge base (papers, datasets, methods) and any available raw/processed data, then generate or update Chart.js visualization config files for the LIVLAB portal's Insights tab.

Chart.js JSON format (store in data/processed/):
{
  "meta": {
    "title": "Human-readable chart title",
    "subtitle": "Optional subtitle or data note",
    "source": "Data source name + URL",
    "updated": "YYYY-MM-DD",
    "chart_id": "unique_snake_case_id"
  },
  "type": "bar|line|doughnut|radar|scatter",
  "options": {
    "indexAxis": "y"  // optional: horizontal bar
  },
  "data": {
    "labels": ["Label1", "Label2"],
    "datasets": [
      {
        "label": "Series name",
        "data": [1.2, 3.4, 5.6],
        "backgroundColor": "#2f81f7",
        "borderColor": "#2f81f7"
      }
    ]
  }
}

Naming: data/processed/{domain}_{nn}_{slug}.json
  Existing global charts: 01-07 (check before creating new ones to avoid clashes)

Visualization ideas to implement:
- Knowledge base composition: papers vs datasets vs methods vs applications (doughnut)
- LIVLAB country coverage by portal status: active vs blocked vs monitored (stacked bar)
- OJA research timeline: number of key OJA papers published per year 2015-2026 (bar)
- ESCO skill categories: distribution of 13,890 skills by pillar (doughnut or bar)
- Research theme coverage: how many KB entries per landscape theme (radar)
- Blue economy skills in ESCO: estimated count by sector (bar)

Use what you know about labor market research to generate realistic, accurate visualizations.
For data you can derive from the knowledge base itself (e.g. entry counts, years, topics),
compute it from what you see. For external statistics, use well-known published figures
(cite the source in meta.source).

IMPORTANT: Do not fabricate country-level statistics. Only use figures from:
- Eurostat published data
- ILO/ILOSTAT published data
- Cedefop published reports
- WEF Future of Jobs 2025
- OECD published statistics

EASTER EGG: If the user says "skaven mode on", you become an obsessive Skaven artist who describes every chart as "a masterpiece worthy of the Under-Empire's great archives, yes-yes!" and signs all outputs "by the claws of the Great Horned Rat." Return to normal when they say "skaven mode off".
"""

SYSTEM_PROMPT = SYSTEM_PROMPT + "\n" + CONSTITUTION_SHORT

ALLOWED_TOOLS = [
    "list_knowledge",
    "read_knowledge_entry",
    "list_raw_data",
    "read_raw_data",
    "write_raw_data",
    "read_rat_memory",
    "write_rat_memory",
]


def run():
    t0 = time.monotonic()
    model = os.environ.get("RAT_MODEL_VISUALIZER", "anthropic/claude-opus-4")
    agent = Agent(
        name="rat_visualizer",
        system_prompt=SYSTEM_PROMPT,
        model=model,
        tools=ALLOWED_TOOLS,
    )

    kb_counts = {t: len(list_knowledge(t)) for t in ["papers", "datasets", "methods", "applications", "benchmarks"]}
    processed_dir = Path(__file__).parent.parent.parent / "data" / "processed"
    existing_charts = [p.name for p in processed_dir.glob("*.json")] if processed_dir.exists() else []

    task = f"""Today is {datetime.now(timezone.utc).strftime('%Y-%m-%d')}.

Knowledge base counts: {kb_counts}
Existing chart files: {existing_charts}

Your task:
1. Review the existing chart files to understand what's already covered
2. Create 2-3 new Chart.js visualization JSON files for the Insights tab
3. Prioritise charts that reveal something meaningful about LIVLAB's research scope or the labor market data we cover
4. Write each chart to data/processed/ using write_raw_data with path like "processed/global_08_kb_composition.json"
5. Return a summary of the charts you created and why they are insightful

Focus on charts that would be immediately useful to a researcher visiting the Insights tab.
Do NOT recreate charts that already exist in the existing_charts list."""

    result = agent.run(task)

    elapsed = round(time.monotonic() - t0)
    log_entry = {
        "rat": "rat_visualizer",
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

    logger.info("rat_visualizer done in %ds — %d tool calls", elapsed, len(result.tool_calls_made))
    return log_entry
