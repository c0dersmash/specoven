---
name: propose-work
description: Create a structured proposal with acceptance criteria and requirements
triggers:
  - /propose-work
  - "create proposal"
  - "write requirements"
---

# Skill: propose-work

## Purpose

Transform the brief into a structured proposal with clear acceptance criteria, requirements, risks, and dependencies. The proposal is the contract between intent and implementation.

## Inputs

- `work-items/WI-ID/brief.md` — the work item brief
- `work-items/WI-ID/status.yaml` — current status

## Process

1. **Read and Analyze Brief**
   - Identify the core problem to solve
   - Extract implicit requirements from the problem statement
   - Identify constraints and non-goals

2. **Define Acceptance Criteria**
   - Write SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
   - Each criterion should have a clear pass/fail condition
   - Cover happy path, edge cases, and error cases

3. **Identify Requirements**
   - Functional requirements: What the system must do
   - Non-functional requirements: Performance, security, reliability, etc.
   - Technical requirements: Stack, dependencies, compatibility

4. **Risk Assessment**
   - List potential risks
   - For each risk: likelihood (L/M/H) × impact (L/M/H) = priority
   - Propose mitigations

5. **Dependencies**
   - External services or APIs
   - Internal components or services
   - Team dependencies

6. **Write Proposal**
   - Use template from `.agents/templates/proposal.md`
   - Fill in all sections

7. **Compute Score and Check Gate**
   - Score the proposal
   - Update `status.yaml`
   - Gate: score ≥ 50 to proceed

## Outputs

- `work-items/WI-ID/proposal.md`
- Updated `work-items/WI-ID/status.yaml`

## Scoring Rubric

| Category | Low | Medium | High |
|----------|-----|--------|------|
| clarity | Goals vague | Goals described | Goals precise |
| scope | No boundaries | Some bounds | Fully bounded |
| completeness | Few criteria | Most criteria | All criteria |
| feasibility | High risk | Some risk | Low risk |
| testability | No test criteria | Partial criteria | Full test criteria |
| implementation_readiness | Missing details | Mostly ready | Fully ready |
| release_readiness | N/A | N/A | N/A |

## Gates

- **Minimum score to proceed to validate**: 50
- If score < 50: Improve acceptance criteria or add missing requirements

## Error Handling

- **Brief is too vague**: Run `/init-work` improvements first
- **Too many unknowns**: Mark risks as blockers and flag for resolution
- **Conflicting requirements**: Resolve explicitly in the proposal

## Examples

### Good Acceptance Criterion

```
✅ Given a request rate of 101/min from IP 1.2.3.4,
   When the API processes the 101st request,
   Then it returns HTTP 429 with Retry-After header set to the reset time
```

### Bad Acceptance Criterion

```
❌ The API should handle rate limiting
```
