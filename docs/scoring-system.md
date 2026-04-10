# Scoring System

## Overview

specoven uses a confidence scoring system to measure the quality and readiness of work at each phase. Scores range from 0 to 100 and are computed across multiple weighted categories.

## Scoring Categories

| Category | Weight | Description |
|----------|--------|-------------|
| clarity | 15% | How clear and unambiguous |
| scope | 15% | How well-bounded |
| completeness | 15% | How complete the artifacts are |
| feasibility | 10% | How technically achievable |
| testability | 15% | How verifiable the requirements are |
| implementation_readiness | 15% | How ready for coding |
| release_readiness | 15% | How ready for production |

## Score Rubric

| Score | Label |
|-------|-------|
| 0–20 | Vague, no clear goal |
| 21–40 | General direction known |
| 41–60 | Goal clear, details missing |
| 61–80 | Well-defined with minor gaps |
| 81–100 | Crystal clear, no ambiguity |

## Phase Gates

| Transition | Minimum Score |
|-----------|--------------|
| init → propose | 30 |
| propose → validate | 50 |
| validate → design | 60 |
| design → code | 70 |
| code → verify | 80 |
| verify → submit | 85 |
| submit → close | 90 |

## Customizing Thresholds

Edit `.agents/config.yaml` to change thresholds:

```yaml
scoring:
  thresholds:
    validate_to_design: 55  # relaxed from 60
    design_to_code: 75      # stricter than default 70
```

## Formula

The overall score is a weighted average:

```
overall = Σ(category_score × category_weight) / Σ(category_weight)
```

Only categories with non-zero weight in the config are included.
