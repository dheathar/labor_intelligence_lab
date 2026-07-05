---
type: Application
title: Career Path Recommender
description: Recommends feasible career transitions based on skill adjacency in occupation
timestamp: '2026-06-05T13:46:12Z'
slug: career-path-recommender
category: job-recommendation
status: research
data_sources:
- onet
- esco
- bls-employment-projections
methods:
- graph-neural-networks-transitions
- skill-extraction
- esco-mapping
---

## Description

Recommends feasible career transitions based on skill adjacency in occupation
graph. Identifies which workers can most easily transition into growing roles
given their current skill profile. Combines GNN-based transition modelling
with ESCO skill taxonomy.

## Example tools

O*NET Career Exploration, LinkedIn Career Explorer

# Related concepts

- Uses dataset: [O*NET Occupational Information Network](/datasets/onet.md)
- Uses dataset: [ESCO — European Skills, Competences, Qualifications and Occupations](/datasets/esco.md)
- Uses method: [Graph Neural Networks for Occupational Transitions](/methods/graph-neural-networks-transitions.md)
