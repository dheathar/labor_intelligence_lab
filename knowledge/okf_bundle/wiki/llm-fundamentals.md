---
type: Wiki Article
title: LLM Fundamentals
description: 'A language model assigns a probability to a sequence of tokens:'
timestamp: '2026-06-05T16:50:04Z'
slug: llm-fundamentals
---

# LLM Fundamentals
*What language models actually are, from first principles*

---

## What a language model does

A language model assigns a probability to a sequence of tokens:

```
P(w₁, w₂, ..., wₙ) = P(w₁) × P(w₂|w₁) × P(w₃|w₁,w₂) × ...
```

An *autoregressive* LLM — GPT, Llama, Gemma, Claude — generates text by repeatedly sampling the next token given all previous tokens. The model is a function that maps a token sequence → a probability distribution over the vocabulary.

---

## Tokens, not words

A tokenizer splits text into subword units. GPT-4o uses ~100k vocabulary size (tiktoken BPE). "unemployment" might be one token or three, depending on the vocabulary. Greek text tokenizes more expensively than English — a Greek word might use 2–4x as many tokens as its English equivalent.

**Why this matters for LIVLAB:**
- API costs scale with tokens. A Greek OJA is ~2x more expensive to process than an equivalent English posting.
- Classification tasks on multilingual text should use models with strong multilingual vocabularies (XLM-R's 250k vocab; mBERT's 110k).
- Occupation titles that are rare in training data tokenize poorly → worse embeddings.

---

## The next-token prediction objective

Pretraining is simple: given tokens 1..N, predict token N+1. Cross-entropy loss:

```
L = -Σ log P(w_t | w_1, ..., w_{t-1})
```

That's it. Scale this up to trillions of tokens across web text and you get a model that has implicitly learned grammar, facts, reasoning patterns, and world knowledge — because all of it is latent in predicting the next word.

**Emergent abilities**: at scale, capabilities appear that weren't explicitly trained — in-context learning, chain-of-thought reasoning, instruction following. These emerge from the compression pressure of modeling language at scale.

---

## RLHF: making models useful

A raw pretrained model predicts text distributions, not useful responses. RLHF (Reinforcement Learning from Human Feedback) aligns behavior:

1. **SFT (Supervised Fine-Tuning)**: train on examples of helpful responses
2. **Reward model**: train a model to predict human preference between two outputs
3. **PPO**: optimize the LLM to maximize the reward model score, with a KL penalty to prevent drifting too far from the SFT model

Modern variants: GRPO (used in DeepSeek-R1), DPO (simpler than PPO — directly optimizes preference without a separate reward model).

---

## Inference modes

**Temperature**: divides logits before softmax. T=0 → argmax (greedy). T=1 → sample from the model distribution. T>1 → more random. For LIVLAB structured extraction, use T=0 or T=0.2 for determinism.

**Top-k / nucleus sampling**: restrict sampling to top-k tokens, or top tokens summing to probability p. Prevents sampling very low-probability garbage tokens.

**Structured outputs**: force the model to generate JSON/YAML via constrained decoding (logit masking). All OpenRouter models support this via `response_format: {type: "json_schema", ...}`. This is how rats should write knowledge entries — never free-text parsing.

---

## Context windows: what "length" means

Transformer attention is O(n²) in sequence length (naive). A 128k context window means the model can attend to 128,000 tokens simultaneously. Modern architectures (Flash Attention, RoPE position encodings, GQA) extend this practically.

**For LIVLAB agents:**
- A typical OJA is ~500 tokens. You can batch 200+ in one call.
- The full knowledge base (~65 entries × ~300 words each) is ~30,000 tokens — fits in most modern models.
- Long context ≠ perfect recall. Models are better at attending to the beginning and end of context ("lost in the middle" problem). For RAG, top-3 retrieved chunks beat stuffing 50 chunks.

---

## What models know and don't know

LLMs know what was in their training data, up to a cutoff date. They don't know:
- What happened after the cutoff
- Proprietary data (your DYPA/Ergani exports)
- Current URLs / whether a webpage still exists
- The actual content of a URL they haven't seen

For real-time labor market intelligence, RAG (Retrieval-Augmented Generation) is the architecture: retrieve relevant knowledge, pass it in context, generate grounded responses.

---

## Model families relevant to LIVLAB

| Family | Best use | Notes |
|--------|---------|-------|
| **Claude 3.5/4.x** | Long-context analysis, complex reasoning | 200k context; strong multilingual |
| **GPT-4o** | Function calling, structured output | Reliable JSON mode |
| **Gemma 3 27B** | Cost-effective backbone | Good multilingual; current rat default |
| **Llama 3.3 70B** | Self-hosted option | Comparable to GPT-4o on many tasks |
| **ESCOXLM-R** | ESCO skill/occupation classification | Purpose-built; not a generative LLM |
| **multilingual-e5-large** | Embeddings for cross-lingual retrieval | Best open multilingual embedder |

---

## What makes a good prompt for labor market tasks

1. **Be specific about the taxonomy**: "Classify this job title according to ISCO-08 at the 2-digit level" — not "What kind of job is this?"
2. **Show the valid output space**: list the 10 ISCO-08 major groups in the prompt
3. **Provide exemplars (few-shot)**: 3–5 examples covering ambiguous cases outperform zero-shot by a large margin
4. **Ask for reasoning before the answer**: Chain-of-thought improves classification accuracy, especially for ambiguous titles like "analyst" or "coordinator"
5. **Use structured output**: `response_format: {type: "json_schema"}` eliminates parsing errors

---

## References
- Karpathy (2023). "Let's build GPT from scratch." YouTube. (best introduction)
- Vaswani et al. (2017). "Attention Is All You Need." arXiv:1706.03762
- Brown et al. (2020). GPT-3. arXiv:2005.14165
- Ouyang et al. (2022). InstructGPT / RLHF. arXiv:2203.02155
- Rafailov et al. (2023). DPO. arXiv:2305.18290
- Lewis et al. (2020). RAG. arXiv:2005.11401
