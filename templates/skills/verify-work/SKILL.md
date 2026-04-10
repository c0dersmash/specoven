---
name: verify-work
description: Verify correctness, completeness, and acceptance criteria
triggers:
  - /verify-work
  - "verify"
  - "check correctness"
  - "run tests"
---

# Skill: verify-work

## Purpose

Systematically verify that the implementation meets all acceptance criteria from the proposal, passes all tests, and is ready for review.

## Inputs

- `work-items/WI-ID/proposal.md` (acceptance criteria)
- `work-items/WI-ID/implementation.md`
- `work-items/WI-ID/design.md`
- `work-items/WI-ID/status.yaml`
- Implemented code

## Process

1. **Run All Tests**
   - Execute the full test suite
   - Confirm all tests pass
   - Note any flaky tests

2. **Acceptance Criteria Verification**
   - Go through each criterion in `proposal.md`
   - Mark each: ✅ PASS, ❌ FAIL, ⚠️ PARTIAL
   - For failures: document what is missing

3. **Code Quality Review**
   - Check for: dead code, unused imports, commented-out code
   - Verify naming follows project conventions
   - Check for obvious security issues (injection, auth bypass, etc.)
   - Verify error handling is complete

4. **Documentation Review**
   - Are public APIs documented?
   - Is README updated if needed?
   - Are complex sections commented?

5. **Edge Case Review**
   - Empty inputs
   - Maximum/minimum values
   - Concurrent operations (if applicable)
   - Network failures (if applicable)

6. **Performance Check**
   - If performance criteria exist, verify they are met
   - Run benchmarks if applicable

7. **Write Verification Report**
   - Use template from `.agents/templates/verification.md`
   - Document all criteria results

8. **Compute Score and Check Gate**
   - Gate: score ≥ 85 to proceed

## Outputs

- `work-items/WI-ID/verification.md`
- Updated `work-items/WI-ID/status.yaml`

## Scoring Rubric

| Category | Low | Medium | High |
|----------|-----|--------|------|
| clarity | Code needs cleanup | Mostly clean | Clean and clear |
| scope | Missing features | Near complete | All criteria met |
| completeness | Tests missing | Partial coverage | Full coverage |
| feasibility | Tests failing | Minor failures | All passing |
| testability | No evidence | Partial evidence | Full evidence |
| implementation_readiness | N/A | N/A | N/A |
| release_readiness | Not ready | Almost ready | Ready |

## Gates

- **Minimum score to proceed to submit**: 85
- If score < 85: Fix failures and re-verify

## Error Handling

- **Tests failing**: Return to code-work, fix, re-run
- **Acceptance criterion not met**: Return to code-work
- **Performance criteria failing**: Investigate bottleneck, optimize, re-verify
- **Security issue found**: Fix immediately, re-verify

## Examples

### Verification Report Summary

```
## Acceptance Criteria Results

✅ AC-1: Rate limiter returns 429 after 100 req/min — PASS
✅ AC-2: Retry-After header set correctly — PASS
✅ AC-3: Existing endpoints unaffected — PASS
✅ AC-4: Redis failure falls back gracefully — PASS

## Test Results

All 47 tests pass (0 failures, 0 skipped)
Coverage: 94%

## Verdict: PROCEED to submit
```
