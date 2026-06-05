"""Core agentic loop — OpenRouter via OpenAI-compatible API."""
import json
import logging
import os
from dataclasses import dataclass, field
from typing import Any

from openai import OpenAI

from .tools import TOOL_REGISTRY

logger = logging.getLogger(__name__)

MAX_ITERATIONS = 20


@dataclass
class AgentResult:
    output: str
    tool_calls_made: list[str] = field(default_factory=list)
    iterations: int = 0
    error: str | None = None


class Agent:
    def __init__(
        self,
        name: str,
        system_prompt: str,
        model: str | None = None,
        tools: list[str] | None = None,
    ):
        self.name = name
        self.system_prompt = system_prompt
        self.model = model or os.environ.get("RAT_MODEL_DEFAULT", "anthropic/claude-opus-4")
        # subset of tools this agent is allowed to use; None = all registered
        self.allowed_tools = set(tools) if tools else None

        self._client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.environ["OPENROUTER_API_KEY"],
        )

    @property
    def _tool_schemas(self) -> list[dict]:
        schemas = []
        for name, entry in TOOL_REGISTRY.items():
            if self.allowed_tools and name not in self.allowed_tools:
                continue
            schemas.append({
                "type": "function",
                "function": {
                    "name": name,
                    "description": entry["description"],
                    "parameters": entry["parameters"],
                },
            })
        return schemas

    def run(self, task: str) -> AgentResult:
        messages = [{"role": "user", "content": task}]
        tool_calls_made = []
        iterations = 0

        try:
            while iterations < MAX_ITERATIONS:
                iterations += 1
                resp = self._client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "system", "content": self.system_prompt}] + messages,
                    tools=self._tool_schemas or None,
                )
                choice = resp.choices[0]

                if choice.finish_reason == "stop" or not choice.message.tool_calls:
                    return AgentResult(
                        output=choice.message.content or "",
                        tool_calls_made=tool_calls_made,
                        iterations=iterations,
                    )

                # append assistant message with tool calls
                messages.append(choice.message.model_dump())

                # execute each tool call and append results
                for tc in choice.message.tool_calls:
                    fn_name = tc.function.name
                    tool_calls_made.append(fn_name)
                    logger.info("[%s] tool_call: %s", self.name, fn_name)

                    try:
                        args = json.loads(tc.function.arguments)
                        result = TOOL_REGISTRY[fn_name]["fn"](**args)
                        content = json.dumps(result) if not isinstance(result, str) else result
                    except Exception as exc:
                        content = f"ERROR: {exc}"
                        logger.warning("[%s] tool %s failed: %s", self.name, fn_name, exc)

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": content,
                    })

            return AgentResult(
                output="Max iterations reached.",
                tool_calls_made=tool_calls_made,
                iterations=iterations,
                error="max_iterations",
            )

        except Exception as exc:
            logger.exception("[%s] agent loop error", self.name)
            return AgentResult(output="", error=str(exc), iterations=iterations)
