# Workflow Guide

## Overview

specoven implements a 9-phase spec-driven development workflow. Each phase produces artifacts and computes a confidence score. Phases are gated — you cannot proceed until your score meets the minimum threshold.

## Phase Cheat Sheet

| Phase | Command | Gate | Produces |
|-------|---------|------|----------|
| 1. Init | `/init-work` | ≥ 30 | brief.md, status.yaml |
| 2. Propose | `/propose-work` | ≥ 50 | proposal.md |
| 3. Validate | `/validate-work` | ≥ 60 | validation.md |
| 4. Design | `/design-work` | ≥ 70 | design.md |
| 5. Code | `/code-work` | ≥ 80 | implementation.md + code |
| 6. Verify | `/verify-work` | ≥ 85 | verification.md |
| 7. Submit | `/submit-work` | ≥ 90 | submission.md |
| 8. Feedback | `/feedback-work` | — | updated artifacts |
| 9. Close | `/close-work` | — | retrospective.md |

## Detailed Phase Descriptions

See `AGENTS.md` or individual skill files in `.agents/skills/` for detailed instructions for each phase.

## Work Item Lifecycle

```
                    ┌─────────────────────────────────┐
                    │                                 │
/init-work ──► /propose-work ──► /validate-work ──► /design-work
                                                       │
                                         /feedback-work ◄─┐
                                                       │   │
/close-work ◄── /submit-work ◄── /verify-work ◄── /code-work
```

## Tips

- **Never skip phases** — the workflow is designed to catch issues early
- **Improve before proceeding** — if a gate fails, improve artifacts before re-scoring
- **Use dry runs** — `specoven init --dry-run` to preview changes
- **Run analyze-workflow** periodically to improve your process
