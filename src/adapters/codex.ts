import path from 'path';
import { AgentAdapter } from './types.js';
import { writeFile } from '../utils/file-ops.js';

export const codexAdapter: AgentAdapter = {
  name: 'codex',
  description: 'OpenAI Codex — creates CODEX.md',
  async install(targetDir: string, dryRun: boolean): Promise<void> {
    const codexMd = `# Codex Instructions

This project uses the **specoven** spec-driven development workflow.

## Universal Agent Instructions

See [AGENTS.md](./AGENTS.md) for the complete workflow documentation, skill definitions, and development process.

## Workflow Phases

| Phase | Command | Gate |
|-------|---------|------|
| Initialize | \`/init-work\` | — |
| Propose | \`/propose-work\` | score ≥ 30 |
| Validate | \`/validate-work\` | score ≥ 50 |
| Design | \`/design-work\` | score ≥ 60 |
| Code | \`/code-work\` | score ≥ 70 |
| Verify | \`/verify-work\` | score ≥ 80 |
| Submit | \`/submit-work\` | score ≥ 85 |
| Feedback | \`/feedback-work\` | — |
| Close | \`/close-work\` | score ≥ 90 |

## Skills

All skills are defined in \`.agents/skills/\`. Each skill file (\`SKILL.md\`) contains complete instructions, scoring rubrics, and error handling.

## Configuration

See \`.agents/config.yaml\` for scoring weights, thresholds, and rubrics.
`;

    await writeFile(path.join(targetDir, 'CODEX.md'), codexMd, dryRun);
  },
};
