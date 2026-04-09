import path from 'path';
import { AgentAdapter } from './types.js';
import { writeFile } from '../utils/file-ops.js';

export const cursorAdapter: AgentAdapter = {
  name: 'cursor',
  description: 'Cursor — creates .cursorrules',
  async install(targetDir: string, dryRun: boolean): Promise<void> {
    const cursorRules = `# Cursor Rules

This project uses the **specoven** spec-driven development workflow.

## Universal Agent Instructions

See AGENTS.md for the complete workflow documentation, skill definitions, and development process.

## Core Principles

1. Always follow the staged workflow — do not skip phases
2. Compute confidence scores at each phase and honor gates
3. Create work item artifacts in work-items/{WI-ID}/ directory
4. Never proceed to the next phase if the score gate is not met
5. Document all decisions in the appropriate artifact file

## Work Item ID Format

WI-YYYY-MMDD-NNN (e.g., WI-2024-0115-001)

## Skills Directory

Skills are in .agents/skills/. Commands are in .agents/commands/.

## Scoring Gates

- validate → design requires score ≥ 60
- design → code requires score ≥ 70
- code → verify requires score ≥ 80
- verify → submit requires score ≥ 85
- submit → close requires score ≥ 90

## Configuration

See .agents/config.yaml for full scoring configuration.
`;

    await writeFile(path.join(targetDir, '.cursorrules'), cursorRules, dryRun);
  },
};
