# AGENTS.md — specoven Universal AI Development Workflow

> **specoven** is a spec-driven development workflow toolkit that brings confidence scoring and structured phases to AI-assisted coding. It works with any coding agent: Claude Code, GitHub Copilot, OpenAI Codex, Cursor, and more.

---

## Table of Contents

1. [What is specoven?](#what-is-specoven)
2. [Quick Start](#quick-start)
3. [Work Item IDs](#work-item-ids)
4. [Directory Structure](#directory-structure)
5. [The 9-Phase Workflow](#the-9-phase-workflow)
6. [Confidence Scoring](#confidence-scoring)
7. [Phase Gates](#phase-gates)
8. [Slash Commands](#slash-commands)
9. [Skills Reference](#skills-reference)
10. [Configuration](#configuration)

---

## What is specoven?

specoven imposes a **structured, confidence-scored workflow** on AI coding sessions. Instead of jumping straight to code, you:

1. **Define** what you're building (brief)
2. **Propose** a solution with clear requirements
3. **Validate** those requirements against goals
4. **Design** the technical architecture
5. **Code** the implementation
6. **Verify** correctness and completeness
7. **Submit** for review
8. **Incorporate Feedback** if needed
9. **Close** and archive

At each phase the agent computes a **confidence score** (0–100). Phases are **gated**: you cannot proceed until the score meets a minimum threshold. This prevents half-baked work from advancing.

---

## Quick Start

```bash
# Install specoven in your repo
npx specoven init --agent claude   # or copilot, codex, cursor

# Start a work item (inside your agent session)
/init-work

# Check status of all work items
npx specoven status

# List installed skills and commands
npx specoven list
```

---

## Work Item IDs

Every work item gets a unique ID in the format:

```
WI-YYYY-MMDD-NNN
```

Examples:
- `WI-2024-0115-001` — first work item on January 15, 2024
- `WI-2024-0115-002` — second work item on the same day
- `WI-2024-0322-001` — first work item on March 22, 2024

Work items are stored in `work-items/WI-YYYY-MMDD-NNN/`.

---

## Directory Structure

After running `specoven init`, your repository will have:

```
.agents/
  config.yaml          # Scoring weights, thresholds, rubrics
  skills/
    init-work/SKILL.md
    propose-work/SKILL.md
    validate-work/SKILL.md
    design-work/SKILL.md
    code-work/SKILL.md
    verify-work/SKILL.md
    submit-work/SKILL.md
    feedback-work/SKILL.md
    close-work/SKILL.md
    analyze-workflow/SKILL.md
  commands/
    init-work.md
    propose-work.md
    validate-work.md
    design-work.md
    code-work.md
    verify-work.md
    submit-work.md
    feedback-work.md
    close-work.md
    analyze-workflow.md
  templates/
    brief.md
    proposal.md
    validation.md
    design.md
    implementation.md
    verification.md
    submission.md
    retrospective.md
    status.yaml

AGENTS.md              # This file (workflow guide)
work-items/            # Active work items
  WI-YYYY-MMDD-NNN/
    brief.md
    proposal.md
    validation.md
    design.md
    implementation.md
    verification.md
    submission.md
    retrospective.md
    status.yaml
  archive/             # Closed work items
```

---

## The 9-Phase Workflow

### Phase 1: init-work

**Purpose**: Create a new work item directory and brief.

**What happens**:
- Generate a unique `WI-YYYY-MMDD-NNN` ID
- Create `work-items/WI-ID/` directory
- Fill out `brief.md` with the problem statement, goals, and constraints
- Initialize `status.yaml` with phase=init

**Outputs**: `brief.md`, `status.yaml`

**Gate**: Score ≥ 30 to proceed to propose

---

### Phase 2: propose-work

**Purpose**: Create a structured proposal with requirements.

**What happens**:
- Read `brief.md`
- Decompose goals into acceptance criteria
- Identify risks and dependencies
- Write `proposal.md`

**Outputs**: `proposal.md`

**Gate**: Score ≥ 50 to proceed to validate

---

### Phase 3: validate-work

**Purpose**: Validate requirements for completeness and feasibility.

**What happens**:
- Review `brief.md` and `proposal.md`
- Check each acceptance criterion for testability
- Identify missing requirements or conflicts
- Write `validation.md`

**Outputs**: `validation.md`

**Gate**: Score ≥ 60 to proceed to design

---

### Phase 4: design-work

**Purpose**: Create technical architecture and design decisions.

**What happens**:
- Choose implementation approach
- Design data models, interfaces, APIs
- Document architectural decisions (ADRs)
- Identify technical risks
- Write `design.md`

**Outputs**: `design.md`

**Gate**: Score ≥ 70 to proceed to code

---

### Phase 5: code-work

**Purpose**: Implement the solution.

**What happens**:
- Write code according to `design.md`
- Follow project conventions
- Write unit tests alongside implementation
- Document public APIs
- Write `implementation.md`

**Outputs**: `implementation.md`, actual code changes

**Gate**: Score ≥ 80 to proceed to verify

---

### Phase 6: verify-work

**Purpose**: Verify correctness and completeness.

**What happens**:
- Run tests
- Check acceptance criteria from `proposal.md`
- Review code quality
- Verify documentation
- Write `verification.md`

**Outputs**: `verification.md`

**Gate**: Score ≥ 85 to proceed to submit

---

### Phase 7: submit-work

**Purpose**: Prepare for review and create submission package.

**What happens**:
- Write clear PR description
- Summarize changes
- Highlight key decisions
- Write `submission.md`

**Outputs**: `submission.md`

**Gate**: Score ≥ 90 to proceed to close (after review)

---

### Phase 8: feedback-work

**Purpose**: Process reviewer feedback.

**What happens**:
- Read feedback
- Categorize: must-fix, should-fix, nice-to-have
- Update relevant artifacts
- Iterate on code/tests as needed

**Outputs**: Updated artifacts

**Gate**: None (iterates back to verify/submit)

---

### Phase 9: close-work

**Purpose**: Close the work item and archive.

**What happens**:
- Write `retrospective.md`
- Update `status.yaml` to phase=close
- Move directory to `work-items/archive/`
- Clean up

**Outputs**: `retrospective.md`, archived directory

---

### Meta Phase: analyze-workflow

**Purpose**: Analyze workflow artifacts for insights.

**What happens**:
- Review all work items (active and archived)
- Identify patterns, bottlenecks, recurring issues
- Generate workflow health report

**Outputs**: Analysis report

---

## Confidence Scoring

Each phase computes a **confidence score** from 0 to 100. Scores are computed across multiple categories:

| Category | Weight | What it measures |
|----------|--------|-----------------|
| `clarity` | 15% | How clear and unambiguous the work is |
| `scope` | 15% | How well-bounded the work is |
| `completeness` | 15% | How complete the artifacts are |
| `feasibility` | 10% | How technically achievable |
| `testability` | 15% | How verifiable the requirements are |
| `implementation_readiness` | 15% | How ready for coding |
| `release_readiness` | 15% | How ready for production |

**Scoring rubric** (per category):

| Score | Meaning |
|-------|---------|
| 0–20 | Vague, no clear goal |
| 21–40 | General direction known |
| 41–60 | Goal clear, details missing |
| 61–80 | Well-defined with minor gaps |
| 81–100 | Crystal clear, no ambiguity |

---

## Phase Gates

Gates prevent advancing until minimum confidence is achieved:

| Transition | Minimum Score |
|-----------|--------------|
| init → propose | 30 |
| propose → validate | 50 |
| validate → design | 60 |
| design → code | 70 |
| code → verify | 80 |
| verify → submit | 85 |
| submit → close | 90 |

If a gate is not met, the agent must:
1. Identify what is missing
2. Improve the current phase artifacts
3. Re-score
4. Only proceed when the gate is met

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/init-work` | Initialize a new work item |
| `/propose-work` | Create a proposal for the current work item |
| `/validate-work` | Validate requirements |
| `/design-work` | Create technical design |
| `/code-work` | Implement the solution |
| `/verify-work` | Verify correctness |
| `/submit-work` | Prepare submission |
| `/feedback-work` | Process feedback |
| `/close-work` | Close and archive work item |
| `/analyze-workflow` | Analyze workflow health |

---

## Skills Reference

Skills are reusable instruction sets in `.agents/skills/`. Each skill defines:
- **Purpose**: What the skill does
- **Inputs**: Required context
- **Process**: Step-by-step instructions
- **Outputs**: What gets created
- **Scoring Rubric**: How to score this phase
- **Gates**: Minimum score to proceed
- **Error Handling**: What to do if something goes wrong

---

## Configuration

Edit `.agents/config.yaml` to customize:

```yaml
scoring:
  categories:
    clarity:
      weight: 0.15
    # ... other categories
  thresholds:
    validate_to_design: 60
    # ... other gates
```

See `.agents/config.yaml` for the full configuration reference.
