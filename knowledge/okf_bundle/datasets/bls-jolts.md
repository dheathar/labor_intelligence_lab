---
type: Dataset
title: Job Openings and Labor Turnover Survey (JOLTS)
description: Monthly establishment survey measuring unmet labor demand (job openings),
resource: https://www.bls.gov/jlt/
tags:
- job-openings
- hires
- separations
- quits
- layoffs
- labor-demand
timestamp: '2026-06-05T13:43:06Z'
slug: bls-jolts
source: U.S. Bureau of Labor Statistics
geography:
- united_states
access: free
size: ~21,000 business establishments/month
temporal_coverage: December 2000–present
update_frequency: monthly
api_available: true
---

## Description

Monthly establishment survey measuring unmet labor demand (job openings),
hiring rates, and labor turnover (separations = quits + layoffs + discharges).
Critical signal for labor market tightness. Used in LSTNet forecasting paper
(arXiv:2507.01979) as primary training data.

## Key variables

- job openings (level and rate)
- hires (level and rate)
- total separations
- quits (voluntary)
- layoffs and discharges
- other separations

# Citations

[1] [U.S. Bureau of Labor Statistics](https://www.bls.gov/jlt/)
[2] [API documentation](https://api.bls.gov/publicAPI/v2/timeseries/data/)
