---
name: validate-work
description: Validate requirements for completeness, consistency, and testability
triggers:
  - /validate-work
  - "validate requirements"
  - "check requirements"
---

# Skill: validate-work

## Purpose

Rigorously validate the proposal for completeness, consistency, and testability. Catch ambiguities, conflicts, and missing requirements before expensive design and coding work begins.

## Inputs

- `work-items/WI-ID/brief.md`
- `work-items/WI-ID/proposal.md`
- `work-items/WI-ID/status.yaml`

## Process

1. **Completeness Check**
   - Does every goal from the brief have at least one acceptance criterion?
   - Are all non-goals explicitly excluded in the proposal?
   - Are all constraints addressed?

2. **Consistency Check**
   - Do any acceptance criteria conflict with each other?
   - Do any requirements conflict with stated constraints?
   - Are there contradictions between brief goals and proposal scope?

3. **Testability Check**
   - Can each acceptance criterion be tested with a clear pass/fail?
   - Are performance criteria measurable (e.g., "< 200ms p99" not "fast")?
   - Are security requirements verifiable?

4. **Feasibility Review**
   - Are all dependencies available and accessible?
   - Is the scope achievable in the implied timeframe?
   - Are there technology choices that need validation?

5. **Risk Review**
   - Is each identified risk mitigated?
   - Are there unidentified risks based on the requirements?

6. **Write Validation Report**
   - Use template from `.agents/templates/validation.md`
   - List: Passed checks, Failed checks, Warnings, Recommendations

7. **Compute Score and Check Gate**
   - Gate: score ≥ 60 to proceed

## Outputs

- `work-items/WI-ID/validation.md`
- Updated `work-items/WI-ID/status.yaml`

## Scoring Rubric

| Category | Low | Medium | High |
|----------|-----|--------|------|
| clarity | Many ambiguities | Some ambiguities | No ambiguities |
| scope | Scope creep risks | Scope mostly clear | Scope locked |
| completeness | Missing requirements | Most complete | Fully complete |
| feasibility | Blockers found | Some risks | No blockers |
| testability | Untestable criteria | Partially testable | Fully testable |
| implementation_readiness | Cannot design yet | Can start design | Design ready |
| release_readiness | Major gaps | Some gaps | Minor gaps |

## Gates

- **Minimum score to proceed to design**: 60
- If score < 60: Fix identified issues and re-validate

## Error Handling

- **Contradictory requirements**: Flag both requirements, propose resolution options
- **Untestable criterion**: Rewrite as a testable criterion or escalate
- **Missing non-functional requirements**: Add performance, security, reliability defaults

## Examples

### Validation Report Summary

```
✅ PASSED (8/10 checks):
  - All goals have acceptance criteria
  - No contradictions found
  - Performance criteria are measurable

⚠️ WARNINGS (2):
  - AC-3 could be clearer about edge case behavior
  - No explicit error handling requirement for network failures

❌ FAILED (0):
  (none)

Overall: PROCEED to design
```
