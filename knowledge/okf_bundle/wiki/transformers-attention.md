---
type: Wiki Article
title: Transformers & Attention
description: 'RNNs (LSTMs, GRUs) process tokens sequentially — token N depends on
  a hidden state summarizing tokens 1..N-1. The problem: long-range dependencies decay.
  "The unemployment rate in Greece, which has historically shown cyclical sensitivity
  to tourism and construction demand, ..." — by the time you rea'
timestamp: '2026-06-05T16:50:34Z'
slug: transformers-attention
---

# Transformers & Attention
*The architecture that powers every model in LIVLAB*

---

## Why attention replaced RNNs

RNNs (LSTMs, GRUs) process tokens sequentially — token N depends on a hidden state summarizing tokens 1..N-1. The problem: long-range dependencies decay. "The unemployment rate in Greece, which has historically shown cyclical sensitivity to tourism and construction demand, ..." — by the time you reach the predicate, the subject is compressed into a low-dimensional vector.

Transformers solve this with **direct attention**: every token can directly attend to every other token. "Greece" and "cyclical sensitivity" are connected by a single matrix multiply, not a chain of RNN steps.

---

## Self-attention, step by step

For each token in the sequence:

1. Project it into three vectors: Query (Q), Key (K), Value (V) — each dimension `d_k`
2. Compute dot products of this token's Q against all other tokens' K
3. Scale by √d_k (prevents dot products from growing too large)
4. Softmax → attention weights (sum to 1)
5. Weighted sum of all Value vectors → new representation for this token

```
Attention(Q, K, V) = softmax(QKᵀ / √d_k) V
```

The output is a new representation of each token that blends information from all tokens it "attended to."

---

## Multi-head attention

Run h parallel attention heads, each with different Q/K/V projection matrices. Each head can specialize — one might track syntactic dependencies, another semantic similarity, another coreference.

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W_O
```

XLM-R base: 12 heads, hidden dim 768. XLM-R large: 16 heads, hidden dim 1024.

---

## The Transformer block

Each block is: Multi-Head Attention → Add & LayerNorm → Feed-Forward Network → Add & LayerNorm

**Feed-Forward Network** is a two-layer MLP applied independently to each token position:
```
FFN(x) = max(0, xW₁ + b₁)W₂ + b₂
```

The FFN width is typically 4× the hidden dim. This is where most of a model's "knowledge" is stored — the attention layers route information, the FFN layers transform it.

**Residual connections** (Add & Norm): the input is added to the output of each sublayer. This makes gradients flow stably through 96+ layers (GPT-4 scale).

---

## BERT vs GPT: encoder vs decoder

**BERT (encoder-only)**: bidirectional — can attend to all tokens in both directions. Trained with masked language modeling (MLM: predict randomly masked tokens). Best for classification, embedding, extraction tasks. Base of XLM-R, ESCOXLM-R.

**GPT (decoder-only)**: causal masking — can only attend to previous tokens (can't look ahead). Trained with next-token prediction. Best for generation. Base of Claude, Llama, Gemma, GPT-4.

**For LIVLAB:**
- Use encoder models (XLM-R family) for: ESCO classification, skill extraction, semantic similarity
- Use decoder models (Claude, Gemma) for: agent reasoning, knowledge synthesis, report generation

---

## Position encodings

Attention has no inherent notion of order — "Greece unemployment" and "unemployment Greece" produce the same attention pattern without position information.

**Absolute sinusoidal** (original Transformer): fixed sine/cosine functions at each position. Works but doesn't generalize to longer sequences than seen in training.

**Learned absolute** (BERT, GPT-2): embeddings for positions 0..N. Same limitation.

**RoPE (Rotary Position Embeddings)** (Llama, Gemma, Mistral): encodes relative position by rotating Q and K vectors. Generalizes better to longer contexts. Current standard for large LLMs.

**ALiBi**: adds a position-dependent bias to attention scores. Simple and effective.

---

## Key-Value cache (KV cache)

During inference, when generating token N, you've already computed K and V for tokens 1..N-1. Caching them avoids recomputing. This is why first-token latency (TTFT) is higher than subsequent tokens (TBT).

For LIVLAB agents with long system prompts: OpenRouter caches the system prompt prefix after the first call. Repeat calls with the same system prompt are cheaper and faster.

---

## Flash Attention

Naive attention is O(n²) in memory — a 128k context would require 128k² = 16 billion attention weights in memory. Flash Attention (Dao et al. 2022) computes attention in tiles that fit in SRAM, never materializing the full attention matrix. Makes 100k+ context windows practical.

---

## Model sizes and what they mean

| Scale | Parameters | Example | Typical use |
|-------|-----------|---------|------------|
| Small | 100M–1B | BERT-large, ESCOXLM-R | Embeddings, classification |
| Medium | 3B–13B | Gemma 3 12B | Efficient reasoning |
| Large | 27B–70B | Gemma 3 27B, Llama 3.3 70B | Complex analysis |
| Frontier | 200B+ | Claude 4, GPT-4o | Best quality, expensive |

For LIVLAB rats: Gemma 3 27B hits a good cost-quality tradeoff for complex reasoning tasks. For classification and embedding, use dedicated small models.

---

## References
- Vaswani et al. (2017). Attention Is All You Need. arXiv:1706.03762
- Devlin et al. (2018). BERT. arXiv:1810.04805
- Dao et al. (2022). Flash Attention. arXiv:2205.14135
- Su et al. (2021). RoPE. arXiv:2104.09864
- Karpathy (2022). "The Annotated Transformer." nanoGPT GitHub.
