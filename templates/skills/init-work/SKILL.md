---
name: init-work
description: Initialize a new work item with a brief and status tracking
triggers:
  - /init-work
  - "start new work item"
  - "create work item"
---

# Skill: init-work

## Purpose

Create a new work item directory with a unique ID, initialize the brief document, and set up status tracking. This is the entry point for all work in the specoven workflow.

## Inputs

- User's description of what they want to build or fix (can be brief)
- Current date (for generating the work item ID)

## Process

1. **Generate Work Item ID**
   - Format: `WI-YYYY-MMDD-NNN`
   - Check existing work items to determine the next sequential number (NNN)
   - NNN starts at 001 for the first work item of the day

2. **Create Directory**
   - Create `work-items/WI-YYYY-MMDD-NNN/`
   - If `work-items/` does not exist, create it

3. **Fill Out Brief**
   - Use the template in `.agents/templates/brief.md`
   - Fill in:
     - `title`: Short title for the work item
     - `problem_statement`: What problem are we solving?
     - `goals`: What does success look like? (bullet list)
     - `non_goals`: What are we explicitly NOT doing?
     - `constraints`: Technical, business, or time constraints
     - `context`: Background information
     - `stakeholders`: Who cares about this?

4. **Initialize Status**
   - Create `status.yaml` in the work item directory
   - Set `phase: init`
   - Set `created_at` to current timestamp
   - Set `overall_score: 0`

5. **Compute Initial Score**
   - Score the brief across all categories
   - Update `status.yaml` with scores

6. **Gate Check**
   - If score < 30: Prompt for more information to improve the brief
   - If score ≥ 30: Announce ready to proceed to propose

## Outputs

- `work-items/WI-YYYY-MMDD-NNN/brief.md`
- `work-items/WI-YYYY-MMDD-NNN/status.yaml`

## Scoring Rubric

Score each category 0–100:

| Category | Low (0-40) | Medium (41-70) | High (71-100) |
|----------|-----------|----------------|---------------|
| clarity | Problem unclear | Problem described | Problem crisp |
| scope | No bounds | Some bounds | Well-bounded |
| completeness | Missing sections | Key sections present | All sections filled |
| feasibility | Unknown | Seems feasible | Clearly feasible |
| testability | No success criteria | Vague criteria | Clear criteria |
| implementation_readiness | Cannot start | Need more info | Can proceed |
| release_readiness | N/A at this stage | N/A | N/A |

## Gates

- **Minimum score to proceed**: 30
- If score < 30: Improve the brief before proceeding
- If score ≥ 30: Proceed to `/propose-work`

## Error Handling

- **Work items directory missing**: Create it automatically
- **ID conflict**: Increment NNN until unique
- **Brief template missing**: Use inline template
- **Insufficient information**: Ask targeted questions to fill gaps

## Examples

### Example ID Generation

```
Today: 2024-01-15
Existing: WI-2024-0115-001
New ID: WI-2024-0115-002
```

### Example Brief Summary

```
Work Item: WI-2024-0115-001
Title: Add rate limiting to API endpoints
Problem: Unauthenticated endpoints can be abused
Goals: Limit to 100 req/min per IP, return 429 on exceed
Non-goals: Per-user rate limits (future scope)
Constraints: Must not break existing tests
```
