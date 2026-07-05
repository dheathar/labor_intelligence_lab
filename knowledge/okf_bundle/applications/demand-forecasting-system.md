---
type: Application
title: Labor Demand Forecasting System
description: Multi-horizon forecasting system for occupational employment demand.
timestamp: '2026-06-05T13:46:22Z'
slug: demand-forecasting-system
category: economic-forecasting
status: research
data_sources:
- bls-cps
- bls-jolts
- bls-employment-projections
- cedefop-skills-forecast
- ilostat
methods:
- lstnet-forecasting
- ml-labor-forecasting-pandemic-2024
---

## Description

Multi-horizon forecasting system for occupational employment demand.
Combines deep learning time-series models (LSTNet) with structural economic
models and AI exposure indices to project demand at occupation × sector ×
geography level.

## Example tools

Cedefop Skills Forecast, BLS Employment Projections

# Related concepts

- Uses dataset: [Current Population Survey (CPS)](/datasets/bls-cps.md)
- Uses dataset: [Job Openings and Labor Turnover Survey (JOLTS)](/datasets/bls-jolts.md)
- Uses dataset: [Cedefop Skills Forecast 2025](/datasets/cedefop-skills-forecast.md)
- Uses dataset: [ILOSTAT — ILO Labour Statistics Database](/datasets/ilostat.md)
- Uses method: [LSTNet — Long and Short-Term Time-series Network](/methods/lstnet-forecasting.md)
- Uses method: [Labor Market Forecasting in Unprecedented Times: A Machine Learning Approach](/papers/ml-labor-forecasting-pandemic-2024.md)
