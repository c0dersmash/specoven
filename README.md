# specoven

> Universal AI Development Workflow Toolkit — spec-driven development with confidence scoring for any coding agent.

[![npm version](https://img.shields.io/npm/v/specoven.svg)](https://www.npmjs.com/package/specoven)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**specoven** brings structure, traceability, and confidence scoring to AI-assisted development. Works with Claude Code, GitHub Copilot, OpenAI Codex, Cursor, and any other coding agent.

---

## Quick Start

```bash
# Initialize specoven in your repo
npx specoven init --agent claude   # or: copilot | codex | cursor

# Check work item status
npx specoven status

# List installed skills and adapters
npx specoven list
```

Template-only install with `degit`:

```bash
npx degit c0dersmash/specoven/templates ./specoven-templates
```

Then copy `AGENTS.md` into your repo root, copy `config.yaml`, `skills/`, `commands/`, and `templates/` into `.agents/`, and create `work-items/.gitkeep`.

---

## The Workflow

specoven enforces a **9-phase, confidence-scored** development workflow:

| Phase | Command | Gate |
|-------|---------|------|
| 1. Initialize | `/init-work` | score ≥ 30 |
| 2. Propose | `/propose-work` | score ≥ 50 |
| 3. Validate | `/validate-work` | score ≥ 60 |
| 4. Design | `/design-work` | score ≥ 70 |
| 5. Code | `/code-work` | score ≥ 80 |
| 6. Verify | `/verify-work` | score ≥ 85 |
| 7. Submit | `/submit-work` | score ≥ 90 |
| 8. Feedback | `/feedback-work` | — |
| 9. Close | `/close-work` | — |

Each phase computes a **confidence score** (0–100) across categories like clarity, scope, completeness, feasibility, and testability. **Gates prevent you from proceeding until your score meets the minimum threshold.**

---

## Confidence Scoring

Scores are weighted averages across 7 categories:

| Category | Weight |
|----------|--------|
| clarity | 15% |
| scope | 15% |
| completeness | 15% |
| feasibility | 10% |
| testability | 15% |
| implementation_readiness | 15% |
| release_readiness | 15% |

---

## Work Item IDs

Every work item gets a unique ID: `WI-YYYY-MMDD-NNN`

```
work-items/
  WI-2024-0115-001/
    brief.md
    proposal.md
    design.md
    implementation.md
    verification.md
    submission.md
    retrospective.md
    status.yaml
  archive/
    WI-2024-0114-001/
```

---

## Agent Support

| Agent | Flag | Files Created |
|-------|------|---------------|
| Claude Code | `--agent claude` | `CLAUDE.md`, `.claude/commands/` |
| GitHub Copilot | `--agent copilot` | `.github/copilot-instructions.md` |
| OpenAI Codex | `--agent codex` | `CODEX.md` |
| Cursor | `--agent cursor` | `.cursorrules` |

---

## CLI Commands

```bash
specoven init [--agent <name>] [--force] [--dry-run]
specoven status
specoven list
```

---

## Documentation

- [Getting Started](https://github.com/c0dersmash/specoven/blob/main/docs/getting-started.md)
- [Workflow Guide](https://github.com/c0dersmash/specoven/blob/main/docs/workflow-guide.md)
- [Scoring System](https://github.com/c0dersmash/specoven/blob/main/docs/scoring-system.md)
- [Customization](https://github.com/c0dersmash/specoven/blob/main/docs/customization.md)
- [Agent Compatibility](https://github.com/c0dersmash/specoven/blob/main/docs/agent-compatibility.md)

---

## License

MIT © c0dersmash
