# Agent Compatibility

specoven works with any AI coding agent. Use the `--agent` flag to install agent-specific files.

## Claude Code

```bash
npx specoven init --agent claude
```

Creates:
- `CLAUDE.md` — instructions file Claude Code reads automatically
- `.claude/commands/` — slash command definitions

Usage: `/init-work`, `/propose-work`, etc.

## GitHub Copilot

```bash
npx specoven init --agent copilot
```

Creates:
- `.github/copilot-instructions.md` — instructions Copilot reads from the repo

Usage: Reference commands explicitly in your chat with Copilot.

## OpenAI Codex

```bash
npx specoven init --agent codex
```

Creates:
- `CODEX.md` — instructions file

## Cursor

```bash
npx specoven init --agent cursor
```

Creates:
- `.cursorrules` — rules file Cursor reads automatically

## Multiple Agents

You can install multiple adapters by running init multiple times with `--force`:

```bash
npx specoven init --agent claude
npx specoven init --agent copilot --force
```

Or install manually after the initial setup:

```bash
npx specoven init --force --agent cursor
```

## No Agent (Universal)

Running `npx specoven init` without `--agent` installs only the `.agents/` structure and `AGENTS.md`. You can reference the workflow manually in any agent session.
