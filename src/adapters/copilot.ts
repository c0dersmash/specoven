import path from 'path';
import { AgentAdapter } from './types.js';
import { writeFile, ensureDir } from '../utils/file-ops.js';

export const copilotAdapter: AgentAdapter = {
  name: 'copilot',
  description: 'GitHub Copilot — creates .github/copilot-instructions.md',
  async install(targetDir: string, dryRun: boolean): Promise<void> {
    const githubDir = path.join(targetDir, '.github');
    await ensureDir(githubDir, dryRun);

    const copilotInstructions = `# GitHub Copilot Instructions

This project uses the **specoven** spec-driven development workflow.

## Universal Agent Instructions

See [AGENTS.md](../AGENTS.md) for the complete workflow documentation, skill definitions, and development process.

## Workflow Overview

Work items follow a staged, confidence-scored development process:

1. **init-work** — Initialize work item with brief.md
2. **propose-work** — Create proposal with requirements
3. **validate-work** — Validate requirements (gate: score ≥ 60)
4. **design-work** — Technical design with architecture (gate: score ≥ 70)
5. **code-work** — Implementation (gate: score ≥ 80)
6. **verify-work** — Verification and testing (gate: score ≥ 85)
7. **submit-work** — Submit for review
8. **feedback-work** — Process feedback
9. **close-work** — Close and archive

## Skills Location

All reusable skills are in \`.agents/skills/\`. All slash commands are in \`.agents/commands/\`.

## Work Items

Work items are stored in \`work-items/{WI-YYYY-MMDD-NNN}/\` with a status.yaml tracking progress.

## Scoring

Each phase computes confidence scores. Phases are gated — you cannot proceed without meeting minimum thresholds. See \`.agents/config.yaml\` for scoring configuration.
`;

    await writeFile(path.join(githubDir, 'copilot-instructions.md'), copilotInstructions, dryRun);
  },
};
