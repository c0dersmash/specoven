# Getting Started with specoven

## Prerequisites

- Node.js 18+
- npm or npx

## Installation

### Option 1: npx (recommended)

```bash
npx specoven init
```

### Option 2: Global install

```bash
npm install -g specoven
specoven init
```

## First-time Setup

### 1. Initialize specoven in your repo

```bash
cd your-project
npx specoven init --agent claude   # or copilot, codex, cursor
```

This creates:
- `.agents/` — workflow skills, commands, templates, config
- `AGENTS.md` — workflow guide
- `work-items/` — where work items will be stored
- Agent-specific files (e.g., `CLAUDE.md`, `.cursorrules`)

### 2. Start your first work item

Inside your agent session, run:

```
/init-work Add login with OAuth2
```

### 3. Follow the workflow

The workflow guides you through 9 phases:

```
/init-work → /propose-work → /validate-work → /design-work →
/code-work → /verify-work → /submit-work → [/feedback-work] → /close-work
```

### 4. Check status anytime

```bash
npx specoven status
```

## Next Steps

- [Workflow Guide](workflow-guide.md) — deep dive into all 9 phases
- [Scoring System](scoring-system.md) — how confidence scoring works
- [Customization](customization.md) — tune thresholds and scoring
- [Agent Compatibility](agent-compatibility.md) — setup for each agent
