---
name: close-work
description: Close and archive a completed work item
triggers:
  - /close-work
  - "close work item"
  - "archive work item"
  - "complete work item"
---

# Skill: close-work

## Purpose

Formally close a work item after successful merge/deployment. Write a retrospective, update final status, and archive the work item directory.

## Inputs

- All work item artifacts in `work-items/WI-ID/`
- `work-items/WI-ID/status.yaml`
- Post-merge outcome (was it successful?)

## Process

1. **Confirm Completion**
   - Has the PR been merged (or the work deployed)?
   - Are all acceptance criteria confirmed in production?

2. **Write Retrospective**
   - What went well?
   - What was harder than expected?
   - What would be done differently?
   - What follow-up work items should be created?
   - Use template from `.agents/templates/retrospective.md`

3. **Final Score**
   - Compute final overall score
   - This represents the quality of the entire work item

4. **Update Status**
   - Set `phase: close`
   - Set `closed_at` timestamp
   - Set final `overall_score`

5. **Archive**
   - Move `work-items/WI-ID/` to `work-items/archive/WI-ID/`
   - Create `work-items/archive/` if it doesn't exist

6. **Confirm Archive**
   - Announce: "WI-ID archived to work-items/archive/WI-ID/"

## Outputs

- `work-items/WI-ID/retrospective.md`
- Final `work-items/WI-ID/status.yaml`
- Archived directory at `work-items/archive/WI-ID/`

## Scoring Rubric

Final score is weighted across all phases:

| Category | Low | Medium | High |
|----------|-----|--------|------|
| clarity | Ambiguity throughout | Some clarity | Always clear |
| scope | Scope changed frequently | Mostly stable | Scope stable |
| completeness | Gaps found late | Minor gaps | Complete |
| feasibility | Surprises encountered | Some surprises | As planned |
| testability | Tests added late | Partial coverage | Full coverage |
| implementation_readiness | Slow start | Some rework | Smooth execution |
| release_readiness | Issues in prod | Minor issues | Smooth release |

## Gates

- **Minimum overall score**: 90
- If score < 90: Identify what dragged scores down, document learnings

## Error Handling

- **PR not yet merged**: Do not close; wait for merge
- **Post-deployment issues found**: Create a new hotfix work item
- **Archive directory missing**: Create it

## Examples

### Retrospective Summary

```
## What went well
- Rate limiting algorithm worked first try
- Comprehensive test coverage caught edge cases early

## What was harder than expected
- Redis connection pooling setup
- Getting Retry-After header format exactly right

## What to do differently next time
- Test Redis failure scenarios earlier in development

## Follow-up work items
- [ ] Add per-user rate limits (new work item)
- [ ] Add rate limit metrics dashboard (new work item)
```
