---
name: feedback-work
description: Process reviewer feedback and incorporate changes
triggers:
  - /feedback-work
  - "process feedback"
  - "address review comments"
  - "incorporate feedback"
---

# Skill: feedback-work

## Purpose

Process reviewer feedback, categorize requested changes, incorporate them systematically, and return to the appropriate phase for re-verification.

## Inputs

- Reviewer comments or feedback text
- `work-items/WI-ID/submission.md`
- `work-items/WI-ID/verification.md`
- `work-items/WI-ID/status.yaml`

## Process

1. **Collect Feedback**
   - Read all reviewer comments
   - List each piece of feedback

2. **Categorize Feedback**
   - **Must-fix (blocking)**: Must be addressed before merge
   - **Should-fix (non-blocking)**: Important but not blocking
   - **Nice-to-have**: Suggestions for improvement
   - **Question**: Needs clarification, not necessarily a change

3. **Plan Changes**
   - For each must-fix and should-fix: determine which phase to re-enter
   - Code changes → re-enter code-work
   - Design changes → re-enter design-work
   - Requirements clarification → re-enter validate-work

4. **Incorporate Changes**
   - Make all must-fix changes
   - Make should-fix changes (or document why deferred)
   - Address or respond to questions

5. **Update Artifacts**
   - Update implementation.md if implementation changed
   - Update design.md if design changed

6. **Re-verify**
   - Run tests again
   - Re-verify acceptance criteria
   - Update verification.md

7. **Re-submit**
   - Update submission.md with feedback response
   - Run `/submit-work` again

## Outputs

- Updated code and artifacts (varies by feedback)
- Updated `work-items/WI-ID/status.yaml`

## Scoring Rubric

This phase uses the same scoring as verify-work to re-gate after changes.

## Gates

- None for this phase itself
- After incorporating feedback, re-run verify-work and submit-work gates

## Error Handling

- **Conflicting feedback**: Flag the conflict, propose resolution, ask reviewer to clarify
- **Scope expansion requested**: Create a new work item for the expanded scope
- **Fundamental design change requested**: Re-enter design-work fully

## Examples

### Feedback Categorization

```
Reviewer: "The sliding window implementation leaks memory on long-running instances"
Category: Must-fix (blocking)
Action: Fix memory leak in code-work, re-verify

Reviewer: "Consider adding a config option for the time window duration"
Category: Nice-to-have
Action: Create follow-up work item WI-2024-0115-002

Reviewer: "What happens if Redis is unavailable?"
Category: Question
Response: "Falls back to in-memory limiter, documented in design.md ADR-002"
```
