---
name: submit-work
description: Prepare submission package for review
triggers:
  - /submit-work
  - "submit for review"
  - "create PR"
  - "prepare submission"
---

# Skill: submit-work

## Purpose

Prepare a complete, reviewable submission package including a PR description, change summary, and key decision highlights.

## Inputs

- `work-items/WI-ID/proposal.md`
- `work-items/WI-ID/design.md`
- `work-items/WI-ID/verification.md`
- `work-items/WI-ID/implementation.md`
- `work-items/WI-ID/status.yaml`

## Process

1. **Summary of Changes**
   - What files were created/modified?
   - What is the high-level summary of the change?

2. **PR Description**
   - Problem being solved
   - Approach taken (link to design.md)
   - Key implementation decisions
   - Testing approach
   - How to verify locally

3. **Checklist Verification**
   - All acceptance criteria met?
   - All tests passing?
   - Documentation updated?
   - No secrets committed?
   - No debug/todo code left?

4. **Highlight Key Decisions**
   - Non-obvious choices that reviewers should understand
   - Trade-offs made

5. **Identify Review Focus Areas**
   - Which parts need careful review?
   - Are there any risky areas?

6. **Write Submission Document**
   - Use template from `.agents/templates/submission.md`

7. **Compute Score and Check Gate**
   - Gate: score ≥ 90 to close after review

## Outputs

- `work-items/WI-ID/submission.md`
- Updated `work-items/WI-ID/status.yaml`

## Scoring Rubric

| Category | Low | Medium | High |
|----------|-----|--------|------|
| clarity | PR description vague | Clear description | Crystal clear |
| scope | Scope not summarized | Mostly summarized | Fully summarized |
| completeness | Checklist incomplete | Mostly complete | Fully complete |
| feasibility | Concerns remain | Minor concerns | No concerns |
| testability | Tests not described | Tests described | Tests exemplary |
| implementation_readiness | N/A | N/A | N/A |
| release_readiness | Not ready | Mostly ready | Merge-ready |

## Gates

- **Minimum score to proceed to close**: 90
- If score < 90: Improve PR description or address remaining gaps

## Error Handling

- **Checklist item fails**: Return to appropriate phase to fix
- **Reviewer requested changes**: Run `/feedback-work`
- **Merge conflicts**: Resolve, re-verify, re-submit

## Examples

### Good PR Description

```
## What

Add sliding-window rate limiting to all public API endpoints.

## Why

Unauthenticated endpoints were vulnerable to abuse. Limits to 100 req/min per IP.

## How

- Implemented as Express middleware (see ADR-001 in design.md)
- Uses Redis for distributed state
- Returns 429 with Retry-After header on limit exceeded

## Testing

- 47 unit and integration tests added
- Verified manually against acceptance criteria AC-1 through AC-4

## Review Notes

Pay close attention to the sliding window implementation in src/middleware/rateLimiter.ts.
```
