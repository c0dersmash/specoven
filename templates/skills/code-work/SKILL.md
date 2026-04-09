---
name: code-work
description: Implement the solution following the technical design
triggers:
  - /code-work
  - "implement"
  - "write code"
  - "start coding"
---

# Skill: code-work

## Purpose

Implement the solution according to the technical design, following project conventions, writing tests, and documenting the implementation.

## Inputs

- `work-items/WI-ID/design.md`
- `work-items/WI-ID/proposal.md` (acceptance criteria)
- `work-items/WI-ID/status.yaml`
- Existing codebase

## Process

1. **Review Design**
   - Re-read `design.md` fully before writing any code
   - Identify the implementation order (leaf nodes first)

2. **Set Up**
   - Create/identify relevant files and modules
   - Install any new dependencies (check for vulnerabilities)

3. **Implement Core Logic**
   - Follow the component design from `design.md`
   - Use existing patterns and conventions
   - Write clean, readable code with minimal comments
   - Comment only non-obvious logic

4. **Write Tests First (or alongside)**
   - Write tests for each acceptance criterion
   - Unit tests for core logic
   - Integration tests for interfaces
   - Edge case coverage

5. **Handle Errors**
   - Implement error handling per the design's error strategy
   - Ensure errors are meaningful and actionable

6. **Documentation**
   - Document public APIs (JSDoc, docstrings, etc.)
   - Update relevant README sections if behavior changes

7. **Self-Review**
   - Read your own code as if reviewing someone else's
   - Check for: logic errors, missing edge cases, security issues

8. **Write Implementation Log**
   - Use template from `.agents/templates/implementation.md`
   - Document: what was built, key decisions made during coding, known issues

9. **Compute Score and Check Gate**
   - Gate: score ≥ 80 to proceed

## Outputs

- Actual code changes (files created/modified)
- `work-items/WI-ID/implementation.md`
- Updated `work-items/WI-ID/status.yaml`

## Scoring Rubric

| Category | Low | Medium | High |
|----------|-----|--------|------|
| clarity | Code hard to follow | Readable | Clear and clean |
| scope | Over/under implemented | Mostly complete | Exactly right |
| completeness | Missing features | Most features | All features |
| feasibility | Bugs present | Minor issues | Works correctly |
| testability | No tests | Partial tests | Full test coverage |
| implementation_readiness | Cannot verify yet | Can verify | Ready for verify |
| release_readiness | Not deployable | Mostly ready | Ready |

## Gates

- **Minimum score to proceed to verify**: 80
- If score < 80: Fix identified issues before verification

## Error Handling

- **Unexpected complexity**: Update design.md with discoveries, re-score
- **Tests failing**: Fix implementation, not tests (unless test is wrong)
- **Dependency conflict**: Document, resolve, or escalate
- **Scope creep discovered**: Flag in implementation.md, defer to next work item

## Examples

### Implementation Log Entry

```
## What was built

Implemented rate limiter as Express middleware using sliding window algorithm
with Redis for distributed state.

## Key decisions during coding

- Used ioredis instead of node-redis for better TypeScript types
- Sliding window over fixed window to avoid boundary spikes

## Known issues

- None. All acceptance criteria verified locally.
```
