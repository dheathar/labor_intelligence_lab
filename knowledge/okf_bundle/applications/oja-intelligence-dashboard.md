---
type: Application
title: OJA Skills Intelligence Dashboard
description: Online Job Advertisement (OJA)-based real-time dashboard for skills demand
timestamp: '2026-06-05T13:46:18Z'
slug: oja-intelligence-dashboard
category: labor-intelligence
status: production
data_sources:
- dypa-ergani
- nlx-job-postings
- eurostat-labour
- esco
methods:
- hybrid-semantic-normalization
- skill-extraction
- escoxlm-r
---

## Description

Online Job Advertisement (OJA)-based real-time dashboard for skills demand
intelligence. Processes job postings continuously using multilingual NLP
pipelines (hybrid semantic normalisation) to surface occupation-level skill
trends. The Cedefop/Eurostat Web Intelligence Hub is the EU-scale example.
First-priority experiment for this lab: replicate for Greek/EU job postings.

## Example tools

Cedefop Skills-OVATE, Lightcast

# Related concepts

- Uses dataset: [DYPA / Ergani Job Register](/datasets/dypa-ergani.md)
- Uses dataset: [National Labor Exchange (NLx) Research Hub](/datasets/nlx-job-postings.md)
- Uses dataset: [Eurostat Labour Market Statistics](/datasets/eurostat-labour.md)
- Uses dataset: [ESCO — European Skills, Competences, Qualifications and Occupations](/datasets/esco.md)
- Uses method: [Hybrid Semantic Normalization for OJAs](/methods/hybrid-semantic-normalization.md)
- Uses method: [ESCOXLM-R](/methods/escoxlm-r.md)
