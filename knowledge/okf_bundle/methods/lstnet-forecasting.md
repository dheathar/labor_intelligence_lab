---
type: Method
title: LSTNet — Long and Short-Term Time-series Network
description: Multi-scale deep learning architecture combining convolutional layers
  (local
timestamp: '2026-06-05T13:45:42Z'
slug: lstnet-forecasting
category: labor-forecasting
subcategory: deep-learning
paper: lstnet-labor-forecasting-2025
---

## Description

Multi-scale deep learning architecture combining convolutional layers (local
temporal patterns) and recurrent layers (long-range dependencies) for labor
market time-series forecasting. Applied to BLS CPS+JOLTS data 2006–2024.
Outperforms autoregressive baselines at 1- and 6-month horizons.

## Strengths

- Captures multi-scale temporal patterns
- Handles multiple correlated series simultaneously
- Outperforms ARIMA/VAR at medium-term horizons

## Weaknesses

- Requires substantial historical data (10+ years)
- Sensitive to structural breaks (e.g. COVID)

# Related concepts

- Method of paper: [Forecasting Labor Markets with LSTNet: A Multi-Scale Deep Learning Approach](/papers/lstnet-labor-forecasting-2025.md)
