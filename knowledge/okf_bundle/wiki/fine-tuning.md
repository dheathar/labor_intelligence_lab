---
type: Wiki Article
title: Fine-Tuning Language Models
description: 'Before fine-tuning, ask: can you get there with a good system prompt?'
timestamp: '2026-06-05T16:49:16Z'
slug: fine-tuning
---

# Fine-Tuning Language Models
*When to adapt, what methods exist, what it costs*

---

## The decision: fine-tune or prompt?

Before fine-tuning, ask: can you get there with a good system prompt?

| Scenario | Fine-tune? |
|----------|-----------|
| Generic labor market Q&A | No — good prompt + RAG is sufficient |
| ESCO skill extraction from Greek text | Maybe — if base model quality < 0.7 F1 |
| Custom ISCO classifier for WB6 languages | Yes — transfer learning needed |
| Adapting ESCOXLM-R to Albanian job postings | Yes — few-shot with SetFit |
| Generating YAML in LIVLAB's schema format | No — structured output / function calling |

Fine-tuning costs time, money, and expertise. The bar should be: "this task requires model behavior that cannot be achieved with prompting alone."

---

## Types of fine-tuning

### Full fine-tuning
Update all model weights. Maximum flexibility. Requires full GPU memory for the model + gradients + optimizer states. Practical only for small models (< 7B) or large GPU clusters.

### LoRA (Low-Rank Adaptation)
Freeze original weights. Add trainable low-rank matrices ΔW = BA to attention layers. Typical rank r=8–64. At rank 16, you're training ~0.1% of XLM-R's parameters — fits on a single consumer GPU.

```
W_new = W_original + α/r * B * A
```

`α` is a scaling factor (often set equal to `r`). The original weights are unchanged — you can load multiple LoRA adapters on one base model.

**For LIVLAB**: LoRA is the right choice for adapting ESCOXLM-R to specific country/language data.

### QLoRA
LoRA + quantize the base model to 4-bit (nf4 quantization). Lets you fine-tune a 7B model on a single 24GB GPU. Slight quality loss vs full LoRA, but often negligible for downstream task performance.

### SetFit (few-shot classification)
No LLM fine-tuning — fine-tunes a sentence transformer with contrastive loss. Works with 8–64 labeled examples per class. Uses:
1. Contrastive fine-tuning on synthetic pairs
2. Train a simple classifier head on embeddings

For LIVLAB WB6 occupation classification with minimal annotated data, SetFit is the right tool.

---

## Training data for labor market models

**Contrastive pairs for ESCO matching**:
- Positive: (job title, ESCO occupation label in same language)
- Negative: (job title, random ESCO occupation label)
- Hard negative: (job title, plausible but wrong ESCO occupation)

Hard negatives dramatically improve model quality. Mine them by taking the top-5 retrieval results excluding the true label.

**For Greek fine-tuning data**:
- ESCO v1.2 in Greek (official Cedefop release): ~13,000 occupation descriptions
- Manual annotation of 500–1000 Greek job postings (manageable project)
- Augmentation: generate paraphrases of occupation descriptions with GPT-4o

**Data format** (HuggingFace Datasets compatible):
```json
{"anchor": "Αναλυτής δεδομένων", "positive": "Data analyst", "negative": "Κοινωνικός λειτουργός"}
```

---

## Training setup for ESCOXLM-R fine-tuning

Reference setup used by Beauchemin et al. (2023):

```python
from sentence_transformers import SentenceTransformer, losses
from sentence_transformers.training_args import SentenceTransformerTrainingArguments

model = SentenceTransformer("intfloat/multilingual-e5-large")  # or xlm-roberta-large

training_args = SentenceTransformerTrainingArguments(
    output_dir="models/escoxlm-r-greek",
    num_train_epochs=3,
    per_device_train_batch_size=32,
    learning_rate=2e-5,
    warmup_ratio=0.1,
    fp16=True,  # mixed precision — halves memory, speeds training ~2x
)

loss = losses.MultipleNegativesRankingLoss(model)
```

With an A100 (40GB), training on 100k pairs takes ~2 hours. On a 3090 (24GB), expect 4–6 hours.

---

## Evaluation for labor market models

Never report a single number. Report:
- Performance by language (Greek vs Serbian vs Albanian)
- Performance by ISCO major group (some occupations are harder — e.g., "manager" roles are ambiguous)
- Performance on short vs long job titles
- Confidence calibration (ECE score — are high-confidence predictions actually accurate?)

Standard benchmark for ISCO classification: LIVLAB uses the Zervas et al. (2026) multilingual corpus (Greece + WB6 countries). Until that's available: use the SkillSpan + manually annotated Greek subset.

---

## When to update a fine-tuned model

- ESCO taxonomy version changes (v1.2 → v1.3): re-embed ESCO concepts, evaluate retrieval
- Significant distribution shift: new job portal with different writing style
- Performance degradation detected: F1 drops > 3% on held-out validation set
- New language added to scope: fine-tune on that language's data

**Do not** re-train without establishing a baseline and running the same eval benchmark before and after.

---

## Cost reference (2025 pricing)

| Task | GPU | Time | Cost estimate |
|------|-----|------|--------------|
| Fine-tune ESCOXLM-R (100k pairs) | A100 40GB | 2h | ~$3 (Lambda Labs) |
| Fine-tune 7B model with QLoRA | A100 40GB | 4h | ~$6 |
| Inference: 1M job titles → ISCO | CPU (4 core) | ~8h | $0 (self-hosted) |
| Inference: 1M job titles → ISCO | A10G | ~20min | ~$2 |

For LIVLAB research: Lambda Labs on-demand GPUs are cost-effective. For production: self-host the inference model.

---

## References
- Hu et al. (2021). LoRA. arXiv:2106.09685
- Dettmers et al. (2023). QLoRA. arXiv:2305.14314
- Tunstall et al. (2022). SetFit. arXiv:2209.11055
- Beauchemin et al. (2023). ESCOXLM-R. arXiv:2305.12092
- Reimers & Gurevych (2019). Sentence-BERT. arXiv:1908.10084

# Related concepts

- Cites: [ESCOXLM-R: Multilingual Taxonomy-driven Pre-training for the Job Market Domain](/papers/escoxlm-r-2023.md)
- Cites: [Multilingual Job Posting Mapping to ESCO Occupations](/papers/zervas-multilingual-oja-2026.md)
