---
type: Wiki Article
title: Multilingual NLP for Labor Market Intelligence
description: 'English NLP is "solved" for most classification and extraction tasks.
  Greek and Western Balkans (WB6) languages present compounding challenges:'
timestamp: '2026-06-05T16:53:24Z'
slug: multilingual-nlp
---

# Multilingual NLP for Labor Market Intelligence
*Greek, Western Balkans, and cross-lingual challenges*

---

## Why multilingual NLP is hard

English NLP is "solved" for most classification and extraction tasks. Greek and Western Balkans (WB6) languages present compounding challenges:

1. **Low-resource**: fewer annotated datasets, less training data in LLM pretraining corpora
2. **Morphological complexity**: Greek is highly inflected — "εργαζόμενος", "εργαζόμενη", "εργαζομένους" are the same word in different forms. A naive bag-of-words model treats them as different tokens.
3. **Script diversity**: Greek (Greek script), Serbian/Macedonian (Cyrillic + Latin), Albanian/Bosnian/Slovenian (Latin). Script-aware tokenization matters.
4. **Domain-specific vocabulary**: labor market terms ("ΙΚΑ-ΕΤΑΜ", "ΔΥΠΑ", "ΚΕΠΕΑ") don't appear in general pretraining corpora.
5. **Code-switching**: Greek job postings often mix Greek and English ("Ψάχνουμε για Python developer με experience στο machine learning")

---

## Model coverage for LIVLAB target languages

| Language | ISO | Script | mBERT | XLM-R | ESCOXLM-R | Notes |
|----------|-----|--------|-------|-------|-----------|-------|
| Greek | el | Greek | ✓ | ✓ | ✓ | Good coverage; 3rd largest EU online job market |
| Serbian | sr | Cyrillic+Latin | ✓ | ✓ | ✓ | Both scripts in training data |
| Albanian | sq | Latin | ✓ | ✓ | ✓ | Lower resource; WB6 priority |
| Macedonian | mk | Cyrillic | ✓ | ✓ | ✓ | Close to Bulgarian; benefits from transfer |
| Montenegrin | cnr | Cyrillic+Latin | ~ | ~ | ~ | Often treated as Serbian variant |
| Bosnian | bs | Latin+Cyrillic | ~ | ~ | ~ | Very close to Croatian/Serbian |
| Slovenian | sl | Latin | ✓ | ✓ | ✓ | EU member; better coverage |
| Kosovo Albanian | sq | Latin | ✓ | ✓ | ✓ | Same as Albanian |

✓ = documented coverage; ~ = partial/indirect (benefits from close relative language)

---

## XLM-R: the backbone for WB6 NLP

XLM-R (Conneau et al. 2019) — Cross-lingual Language Model RoBERTa:
- Trained on 2.5TB of filtered CommonCrawl across 100 languages
- 250,002 token vocabulary (sentencepiece BPE trained on multilingual data)
- Two sizes: base (125M params) and large (355M params)
- Key property: **cross-lingual transfer** — fine-tuning on English annotated data improves performance on Greek/Serbian with zero target-language examples

**For LIVLAB**: XLM-R large is the base model for all custom fine-tuning projects (ESCO classification, skill extraction, OJA NER).

---

## Greek-specific considerations

### Tokenization
Greek text tokenizes at roughly 2–3 tokens per word in XLM-R vs ~1.3 tokens per English word. For API cost estimation: multiply English costs by 2x for Greek text.

### Morphological normalization
Greek verbs and nouns inflect heavily. For bag-of-words approaches, lemmatization is critical. Options:
- `spaCy` has a Greek model (`el_core_news_sm`): light, fast, adequate for tokenization + POS + lemmatization
- `STANZA` (Stanford NLP) has a Greek pipeline: higher accuracy, slower
- For transformer models (XLM-R, ESCOXLM-R): subword tokenization handles inflection implicitly — no lemmatization needed

### Greek transliteration
Job titles on Greek portals sometimes appear in Greeklish (Greek words written in Latin script): "programmatis" for "προγραμματιστής". Handle by: (1) detect Greeklish via heuristics, (2) transliterate to proper Greek, (3) then process.

---

## Cross-lingual transfer learning

The practical strategy for WB6 languages with no annotated data:

1. Start with ESCOXLM-R (already fine-tuned on 44 languages for occupation matching)
2. Evaluate zero-shot on your target language — often 0.65–0.75 F1 without any adaptation
3. Collect 100–500 manually annotated examples in the target language
4. Fine-tune with SetFit (contrastive, data-efficient) or LoRA on top of ESCOXLM-R
5. Expect 0.78–0.85 F1 with ~500 examples

**Cross-lingual evaluation trap**: don't evaluate a model trained only on Greek/English data by translating your test set to English and evaluating in English. Evaluate in the original language to catch real transfer failures.

---

## Language detection at scale

For 100k OJAs with mixed languages:

```python
from lingua import Language, LanguageDetectorBuilder

LIVLAB_LANGUAGES = [
    Language.GREEK, Language.ENGLISH, Language.SERBIAN,
    Language.ALBANIAN, Language.MACEDONIAN, Language.SLOVENIAN,
    Language.BOSNIAN, Language.CROATIAN, Language.ITALIAN, Language.SPANISH
]

detector = LanguageDetectorBuilder.from_languages(*LIVLAB_LANGUAGES).build()
```

`lingua-py` is more accurate than `langdetect` for short texts and is better at distinguishing Serbian/Croatian/Bosnian/Macedonian (which `langdetect` frequently confuses).

Performance note: detect language once per document and store it — detection on 100k texts takes ~30 seconds and should not be repeated.

---

## ESCO multilingual coverage

ESCO v1.2 provides labels and descriptions in **all 27 EU official languages** plus some candidate country languages. Coverage for LIVLAB target countries:

| Language | ESCO v1.2 status |
|----------|----------------|
| Greek (el) | Full official coverage |
| Serbian (sr) | Limited — not an official EU language; use Serbian manual translations |
| Albanian (sq) | Not in ESCO v1.2 |
| Macedonian (mk) | Not in ESCO v1.2 |
| Slovenian (sl) | Full official coverage |
| Italian (it) | Full official coverage |
| Spanish (es) | Full official coverage |

For languages without ESCO labels: use cross-lingual embeddings (multilingual-e5-large or LaBSE) to match against English ESCO labels. The semantic similarity still works across scripts.

---

## Known biases in OJA data for SE Europe

1. **Urban overrepresentation**: online job portals in Greece/WB6 skew toward Athens, Thessaloniki, Belgrade — rural vacancies are underrepresented
2. **Formal sector bias**: informal and agricultural employment (significant in WB6) rarely appears on portals
3. **Gender-coded language**: Greek postings often use masculine default forms (affects downstream gender analysis)
4. **Tourism seasonality**: Greek/Montenegrin/Albanian portals show extreme Q2/Q3 spikes for hospitality/tourism roles — seasonal pattern is real but must be documented, not naively aggregated as "demand growth"
5. **Salary non-disclosure**: >80% of Greek/WB6 postings don't disclose salary — wage inference from OJAs alone is highly unreliable; must be combined with ELSTAT/NSZ admin data

---

## Tools and libraries

| Tool | Use | Quality |
|------|-----|---------|
| `spaCy el_core_news_sm` | Greek tokenization, POS, NER | Good, fast |
| `stanza` Greek pipeline | Higher-accuracy Greek NLP | Better than spaCy for NER |
| `lingua-py` | Language detection | Best for short multilingual text |
| `sentence-transformers` | Embedding pipeline | Standard |
| `transformers` + XLM-R | Fine-tuning backbone | Standard |
| `ftfy` | Fix Unicode/encoding artifacts | Essential for crawled data |
| `langcodes` | Language code normalization | Useful utility |

---

## References
- Conneau et al. (2019). XLM-R. arXiv:1911.02116
- Beauchemin et al. (2023). ESCOXLM-R. arXiv:2305.12092
- Nozza et al. (2020). XLM-T multilingual Twitter NLP. arXiv:2104.12250
- Cedefop (2025). ESCO v1.2 multilingual taxonomy. data.europa.eu/esco
- Feng et al. (2020). LaBSE. arXiv:2007.01852

# Related concepts

- Cites: [ESCOXLM-R: Multilingual Taxonomy-driven Pre-training for the Job Market Domain](/papers/escoxlm-r-2023.md)
- Cites: [Cedefop Skills Forecast 2025: Projections to 2035](/papers/cedefop-skills-forecast-2025.md)
