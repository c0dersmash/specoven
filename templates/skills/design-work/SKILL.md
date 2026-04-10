---
name: design-work
description: Create technical architecture, data models, and design decisions
triggers:
  - /design-work
  - "create design"
  - "technical design"
  - "architecture"
---

# Skill: design-work

## Purpose

Produce a technical design that translates validated requirements into a concrete implementation plan. The design document serves as a blueprint for coding.

## Inputs

- `work-items/WI-ID/brief.md`
- `work-items/WI-ID/proposal.md`
- `work-items/WI-ID/validation.md`
- `work-items/WI-ID/status.yaml`
- Existing codebase (explore relevant files)

## Process

1. **Explore Existing Codebase**
   - Identify relevant files, modules, and patterns
   - Understand current architecture
   - Note conventions to follow

2. **Choose Implementation Approach**
   - Evaluate 2–3 approaches if meaningful trade-offs exist
   - Select and justify the chosen approach

3. **Data Model Design**
   - Define new data structures, types, interfaces
   - Document schema changes if applicable

4. **API / Interface Design**
   - Define public interfaces, function signatures
   - Define REST endpoints, events, or other integration points
   - Follow existing patterns in the codebase

5. **Component Design**
   - Break implementation into components/modules
   - Define responsibilities and boundaries
   - Identify shared utilities to reuse or create

6. **Error Handling Strategy**
   - Define error types and hierarchy
   - Specify error propagation strategy
   - Define user-facing error messages

7. **Testing Strategy**
   - Unit test targets
   - Integration test targets
   - Performance test targets (if applicable)

8. **Architectural Decision Records (ADRs)**
   - Document significant decisions and their rationale

9. **Write Design Document**
   - Use template from `.agents/templates/design.md`

10. **Compute Score and Check Gate**
    - Gate: score ≥ 70 to proceed

## Outputs

- `work-items/WI-ID/design.md`
- Updated `work-items/WI-ID/status.yaml`

## Scoring Rubric

| Category | Low | Medium | High |
|----------|-----|--------|------|
| clarity | Design unclear | Design described | Design precise |
| scope | Design over/under scoped | Mostly scoped | Well scoped |
| completeness | Missing sections | Most sections | All sections |
| feasibility | Approach risky | Some concerns | Approach solid |
| testability | Hard to test | Partially testable | Easily testable |
| implementation_readiness | Cannot start coding | Can start with gaps | Ready to code |
| release_readiness | N/A | Deployment considered | Deployment planned |

## Gates

- **Minimum score to proceed to code**: 70
- If score < 70: Address design gaps before coding

## Error Handling

- **Ambiguous existing codebase**: Explore more, ask clarifying questions
- **Multiple valid approaches**: Document trade-offs, select with justification
- **Dependency not available**: Flag as blocker, propose alternatives

## Examples

### Good Design Decision

```
## ADR-001: Use middleware pattern for rate limiting

Status: Accepted

Context: Need to apply rate limiting across multiple endpoints.

Decision: Use Express middleware rather than per-handler logic.

Consequences:
+ Applied consistently to all matching routes
+ Easy to configure per-route
- Adds middleware stack overhead (~1ms)
```
