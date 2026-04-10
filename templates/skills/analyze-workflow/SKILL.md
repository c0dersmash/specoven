---
name: analyze-workflow
description: Analyze workflow artifacts for patterns, bottlenecks, and insights
triggers:
  - /analyze-workflow
  - "analyze workflow"
  - "workflow health"
  - "workflow report"
---

# Skill: analyze-workflow

## Purpose

Analyze all work items (active and archived) to identify patterns, bottlenecks, recurring issues, and improvement opportunities in the workflow.

## Inputs

- All `work-items/**` directories (active and archive)
- All `status.yaml` files
- All phase artifacts

## Process

1. **Inventory Work Items**
   - List all active work items with current phase and score
   - List all archived work items with final scores

2. **Phase Distribution Analysis**
   - Which phases have the most work items stuck?
   - Average time spent per phase (if timestamps available)
   - Phase completion rates

3. **Scoring Analysis**
   - Average score per phase
   - Which categories consistently score low?
   - Which categories score high?

4. **Bottleneck Identification**
   - Which gates are most often failed?
   - Which phases require the most iterations?

5. **Pattern Recognition**
   - Common reasons for gate failures
   - Common feedback themes
   - Recurring risks

6. **Recommendations**
   - Should any scoring thresholds be adjusted?
   - Should any workflow steps be added/removed?
   - Team-level improvements

7. **Generate Report**
   - Summary statistics
   - Key findings
   - Actionable recommendations

## Outputs

- Analysis report (printed to console or written to file)
- No work-item artifacts modified

## Scoring Rubric

This is a meta-phase and does not produce a confidence score.

## Gates

None.

## Error Handling

- **No work items found**: Report that no data is available yet
- **Corrupted status.yaml**: Skip and note in report
- **Empty archive**: Report only active items

## Examples

### Analysis Report

```
## specoven Workflow Health Report
Generated: 2024-01-15

### Summary
- Active work items: 3
- Archived work items: 12
- Average final score: 87/100

### Phase Bottlenecks
- validate-work: 4 of 15 items required multiple attempts
- code-work: Most time spent here (expected)

### Category Scores (average)
- clarity: 82/100
- scope: 78/100 ← Below target
- testability: 85/100

### Recommendations
1. Improve scope definition in init-work — consistently low scores
2. Consider lowering validate_to_design threshold from 60 to 55 (many items
   just barely pass)
3. Add more examples to propose-work SKILL.md
```
