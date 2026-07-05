---
type: Application
title: Wage Prediction and Gap Analysis Engine
description: Foundation model-based system for estimating wages and wage gaps across
timestamp: '2026-06-05T13:46:24Z'
slug: wage-prediction-engine
category: wage-analysis
status: research
data_sources:
- bls-cps
- onet
- nlx-job-postings
methods:
- foundation-model-wage
- regression-analysis
---

## Description

Foundation model-based system for estimating wages and wage gaps across
occupations, industries, and demographic groups. Uses embedding-based probing
to estimate compensation levels from job posting text at scale, enabling
analysis of wage disparities without traditional survey data.

## Example tools

Glassdoor Pay Data, LinkedIn Salary Insights

# Related concepts

- Uses dataset: [Current Population Survey (CPS)](/datasets/bls-cps.md)
- Uses dataset: [O*NET Occupational Information Network](/datasets/onet.md)
- Uses dataset: [National Labor Exchange (NLx) Research Hub](/datasets/nlx-job-postings.md)
- Uses method: [Foundation Model Wage Estimation](/methods/foundation-model-wage.md)
