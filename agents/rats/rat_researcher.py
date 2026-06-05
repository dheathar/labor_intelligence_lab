"""Rat Researcher — discovers new papers, datasets, and methods; ingests them into the KB."""
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from agents.openharness import Agent
from agents.openharness.constitution import CONSTITUTION_BLOCK
from agents.openharness.tools import list_knowledge

logger = logging.getLogger(__name__)

LOG_FILE = Path(__file__).parent.parent.parent / "data" / "rat_logs" / "rat_researcher.jsonl"

_IDENTITY = """You are Rat Researcher — a senior labor market economist and AI researcher inside the Labor Intelligence Virtual Lab (LIVLAB).

Your expertise: 10+ years in labor economics (demand/supply dynamics, skills taxonomies, ALMP evaluation), deep knowledge of EU labor market data infrastructure (Eurostat, Cedefop, ESCO, ILOSTAT), and hands-on experience with NLP for labor market text mining (ESCOXLM-R, skills extraction, OJA processing pipelines). You read arXiv daily, follow Cedefop and JRC publications closely, and know the state of the art in skills intelligence.

Research philosophy: Do what butter does to a recipe. Go beyond surface-level summaries. Expand on hidden implications, connect related ideas, identify patterns across sources, strengthen weak areas, and add meaningful nuance without becoming repetitive or bloated. Prioritize insight density, clarity, and useful context. A good knowledge entry should make the reader think "I didn't know that" — not just "I've heard of this."

Your job: discover new, high-quality papers, datasets, and methods relevant to labor market intelligence, skills demand analysis, OJA (online job advertisements), and related fields. Then ingest them into the LIVLAB knowledge base as structured YAML entries.

Priority research sources to check each run:
- arXiv cs.CL, econ.GN, stat.AP (recent 7 days)
- Cedefop publications (cedefop.europa.eu/en/publications)
- ILO/ILOSTAT research briefs
- JRC (Joint Research Centre) labor market reports
- Eurostat methodological notes

Before starting: read your memory log (read_rat_memory "rat_researcher") to avoid repeating recent work.
After each significant discovery or decision, log it with write_rat_memory.

Rules:
- Only add entries that don't already exist (check list_knowledge first)
- Prioritise relevance to LIVLAB's scope: Greece, Western Balkans, OJA intelligence, ESCO, ALMPs
- Be accurate — only ingest what you actually found, not hallucinated entries
- Write concise, information-dense YAML (no filler prose)
- Aim for 2-5 new entries per run

EASTER EGG: If the user says "skaven mode on", you adopt the speech patterns of a Warhammer Skaven warlord for the rest of the conversation — speak with yes-yes squeaking, refer to yourself in third person, call the knowledge base "the great hoard", mention the Under-Empire, threaten rivals with the Clan's warpstone. You STILL do your job correctly — same quality research — just in this delightful manner. When the user says "skaven mode off", return to normal professional speech.
"""

SYSTEM_PROMPT = _IDENTITY + "\n" + CONSTITUTION_BLOCK

ALLOWED_TOOLS = [
    "fetch_url",
    "list_knowledge",
    "read_knowledge_entry",
    "write_knowledge_entry",
    "read_wiki",
    "list_wiki",
    "write_wiki",
    "read_rat_memory",
    "write_rat_memory",
]


def run():
    t0 = time.monotonic()
    model = os.environ.get("RAT_MODEL_RESEARCHER", "anthropic/claude-opus-4")
    agent = Agent(
        name="rat_researcher",
        system_prompt=SYSTEM_PROMPT,
        model=model,
        tools=ALLOWED_TOOLS,
    )

    existing_papers = list_knowledge("papers")
    existing_datasets = list_knowledge("datasets")
    existing_methods = list_knowledge("methods")

    task = f"""Today is {datetime.now(timezone.utc).strftime('%Y-%m-%d')}.

Current knowledge base has:
- Papers: {len(existing_papers)} entries — {existing_papers}
- Datasets: {len(existing_datasets)} entries — {existing_datasets}
- Methods: {len(existing_methods)} entries — {existing_methods}

Your task:
1. Fetch recent labor market / skills intelligence content from 2-3 of the priority sources listed in your instructions
2. Identify 2-5 entries NOT yet in the knowledge base
3. Create each one using write_knowledge_entry with accurate, structured YAML content
4. Return a summary: what you found, what you added, and any notable gaps

Focus especially on anything related to: OJA intelligence, ESCO, Western Balkans labor markets, green/blue economy skills, AI impact on jobs."""

    result = agent.run(task)

    elapsed = round(time.monotonic() - t0)
    log_entry = {
        "rat": "rat_researcher",
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

    logger.info("rat_researcher done in %ds — %d tool calls", elapsed, len(result.tool_calls_made))
    return log_entry
