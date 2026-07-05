---
type: Wiki Article
title: OJA NLP Pipeline
description: 'An Online Job Advertisement (OJA) is a job posting scraped from a job
  portal (Kariera.gr, Skywalker, Infostud, LinkedIn, etc.). Raw OJAs are messy HTML
  blobs. The goal of the pipeline is to extract:'
timestamp: '2026-06-05T16:52:40Z'
slug: oja-nlp-pipeline
---

# OJA NLP Pipeline
*Processing Online Job Advertisements from raw HTML to ESCO-linked intelligence*

---

## What an OJA is

An Online Job Advertisement (OJA) is a job posting scraped from a job portal (Kariera.gr, Skywalker, Infostud, LinkedIn, etc.). Raw OJAs are messy HTML blobs. The goal of the pipeline is to extract:

- **Occupation**: what job is this? → map to ISCO-08 code
- **Skills**: what does the employer want? → map to ESCO skills
- **Location**: where? → NUTS3 region or municipality
- **Contract type**: full-time, part-time, temporary, seasonal
- **Salary**: if disclosed (often not, especially in SE Europe)
- **Employer sector**: NACE code or description
- **Experience/qualification requirements**: years, education level

This is the Cedefop Web Intelligence Hub's core pipeline. LIVLAB implements a version of it focused on Greece and WB6 countries.

---

## Pipeline stages

```
Raw HTML/JSON
    ↓
[1] Extraction & cleaning
    ↓
[2] Language detection
    ↓
[3] Deduplication
    ↓
[4] Occupation classification → ISCO
    ↓
[5] Skill extraction
    ↓
[6] Skill normalization → ESCO
    ↓
[7] Structuring & enrichment
    ↓
Structured OJA record (JSON/Parquet)
```

---

## Stage 1: Extraction & cleaning

**Fields to extract from raw posting HTML:**
- Title: typically in `<h1>` or job-specific CSS class
- Description body: strip HTML tags, remove boilerplate ("about us", "apply now" CTAs)
- Location string: normalize to standard geography later
- Posted date: ISO 8601

**Challenges for Greek/WB6 portals:**
- JavaScript-rendered pages (Kariera.gr uses React) — need Playwright/Selenium or API access
- Encoding issues: cp1253 (Windows Greek) misidentified as UTF-8 is common in older portals
- Copy-paste from Word documents: curly quotes, em-dashes, `â€™` artifacts

**Cleaning steps:**
1. Normalize whitespace (collapse multiple spaces/newlines)
2. Strip HTML entities (`&amp;` → `&`, `&nbsp;` → space)
3. Remove navigation/footer boilerplate (fuzzy match against known patterns)
4. Detect and fix encoding errors (ftfy library)

---

## Stage 2: Language detection

Greek job portals often mix Greek and English. A posting might be 80% Greek with English skill names. Use `langdetect` or `lingua-py` on the description body:

```python
from lingua import Language, LanguageDetectorBuilder
detector = LanguageDetectorBuilder.from_all_languages().build()
lang = detector.detect_language_of(text)  # Language.GREEK, Language.ENGLISH, etc.
```

For multilingual postings: detect at sentence level, not document level. "Απαιτείται γνώση Python." — the sentence is Greek even though "Python" is English.

---

## Stage 3: Deduplication

Job portals republish the same posting multiple times. Dedup strategies:

**Exact match**: hash the (title + employer + location + first 200 chars of description). Catches 70–80% of duplicates.

**Near-duplicate detection** (MinHash LSH): computationally heavier, catches paraphrased reposts. Use `datasketch` library. LSH bucket threshold: Jaccard similarity > 0.85.

**Temporal dedup**: same posting seen on two consecutive scrapes → keep the latest version, merge timestamps.

---

## Stage 4: Occupation classification → ISCO-08

Map the job title (and optionally the description) to an ISCO-08 occupation code.

**Two-stage retrieval + classification:**
1. Embed the title with ESCOXLM-R → cosine search over ESCO occupation descriptions → top-50 candidates
2. Cross-encoder re-ranks top-50 → pick top-1
3. Map ESCO occupation UUID → ISCO-08 unit group code (4-digit) → major group (1-digit)

**ISCO-08 major groups** (what to output at 1-digit level):
```
1 - Managers
2 - Professionals  
3 - Technicians/Associate Professionals
4 - Clerical Support Workers
5 - Service/Sales Workers
6 - Skilled Agricultural/Forestry/Fishery
7 - Craft/Related Trade Workers
8 - Plant/Machine Operators/Assemblers
9 - Elementary Occupations
0 - Armed Forces
```

**Known challenges for WB6 languages:** low-resource languages (Albanian, Macedonian) have sparse coverage in ESCO's official translations. Use ESCOXLM-R's multilingual transfer — trained on 44 languages including neighboring languages.

---

## Stage 5: Skill extraction

Identify skill mentions in the job description. Types:

- **Hard skills**: tools, technologies, methods ("Python", "AutoCAD", "budgeting", "HACCP")
- **Soft skills**: interpersonal traits ("teamwork", "communication", "υπευθυνότητα")
- **Qualification requirements**: "BSc in Computer Science", "5 years experience"
- **Language requirements**: "Fluency in English required"

**Method: NNOSE-style BIO tagging**
Train a token classifier on the description tokens:
- B-SKILL: beginning of a skill mention
- I-SKILL: inside a skill mention  
- O: not a skill

Use `intfloat/multilingual-e5-large` as the backbone encoder + a CRF or simple linear head.

**Alternative: LLM extraction with structured output**
```
Extract all skills mentioned in this job description as a JSON array.
For each skill, classify as: hard_skill | soft_skill | language | qualification.
```
With GPT-4o or Claude: F1 ≈ 0.87 on English SkillSpan. Slower and more expensive than a fine-tuned BIO tagger, but requires no training data for new languages.

---

## Stage 6: Skill normalization → ESCO

Map extracted skill strings to ESCO skill URIs.

**ESCO v1.2 has ~13,890 skills + ~3,000 knowledge concepts.**

Approach:
1. Embed extracted skill string with multilingual-e5-large
2. Cosine search over pre-embedded ESCO skill labels (all 44 languages)
3. Apply threshold (similarity > 0.75 → matched; below → "unmatched skill")
4. Log unmatched skills — they reveal gaps in ESCO coverage or domain-specific jargon

**Unmatched skill analysis for Greece:**
Skills like "γνώση εργατικής νομοθεσίας" (knowledge of labor law) or "τήρηση βιβλίων Γ' κατηγορίας" (third-category bookkeeping) frequently don't match ESCO — they're specific to the Greek regulatory/accounting context.

---

## Stage 7: Structuring & enrichment

Final output schema per OJA:

```json
{
  "id": "gr-kariera-20260601-abc123",
  "source": "kariera.gr",
  "country": "GRC",
  "nuts3": "GR300",  
  "posted_at": "2026-06-01",
  "scraped_at": "2026-06-01T08:00:00Z",
  "title_raw": "Στέλεχος Λογιστηρίου",
  "isco_4digit": "3313",
  "isco_major": "3",
  "esco_occupation": "http://data.europa.eu/esco/occupation/O-1.2.3.4",
  "skills_raw": ["Excel", "SAP", "υπολογιστικά φύλλα"],
  "skills_esco": ["http://data.europa.eu/esco/skill/S-1234"],
  "skills_unmatched": ["τήρηση βιβλίων Γ' κατηγορίας"],
  "contract_type": "full_time",
  "experience_years": 2,
  "education_level": "bachelor",
  "salary_eur": null,
  "language": "el",
  "is_duplicate": false
}
```

Store in Parquet (columnar → fast aggregation). One file per source per month: `data/processed/oja/gr/kariera/2026-06.parquet`.

---

## Aggregation: what to compute

From 100k+ structured OJAs per quarter (Greece alone):

| Metric | Aggregation | Output use |
|--------|------------|-----------|
| Skill demand index | count(esco_skill) / total_postings | Insights tab charts |
| Occupation demand | count(isco_4digit) | Regional heatmap |
| Top skills by occupation | conditional count | Skills tab, EU-ALMPO |
| Skill novelty | skill appearance rate over time | Trend detection |
| Geographic demand | count by NUTS3 | Map tab |
| Sector demand | count by NACE (if available) | Landscape analysis |

---

## References
- Cedefop (2023). "Skills-OVATE — Skills Online Vacancy Analysis Tool for Europe." Cedefop.europa.eu
- Carvalho et al. (2022). Occupational classification at Cedefop. arXiv:2206.xxxxx
- Decorte et al. (2023). NNOSE skill extraction. arXiv:2401.17092
- Beauchemin et al. (2023). ESCOXLM-R. arXiv:2305.12092
- Cedefop–Eurostat (2026). Conference proceedings, "Harnessing Web Data for Next-Generation Skills Intelligence," Thessaloniki.

# Related concepts

- Cites: [NNOSE: Nearest Neighbor Occupational Skill Extraction](/papers/nnose-2024.md)
- Cites: [ESCOXLM-R: Multilingual Taxonomy-driven Pre-training for the Job Market Domain](/papers/escoxlm-r-2023.md)
