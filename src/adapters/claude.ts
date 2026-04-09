import path from 'path';
import { AgentAdapter } from './types.js';
import { copyDir, writeFile, ensureDir } from '../utils/file-ops.js';

export const claudeAdapter: AgentAdapter = {
  name: 'claude',
  description: 'Claude Code — copies commands to .claude/commands/ and creates CLAUDE.md',
  async install(targetDir: string, dryRun: boolean): Promise<void> {
    const claudeCommandsDir = path.join(targetDir, '.claude', 'commands');
    const agentsCommandsDir = path.join(targetDir, '.agents', 'commands');

    await ensureDir(claudeCommandsDir, dryRun);
    await copyDir(agentsCommandsDir, claudeCommandsDir, dryRun);

    const claudeMd = `# Claude Code Instructions

This project uses the **specoven** spec-driven development workflow.

## Universal Agent Instructions

See [AGENTS.md](./AGENTS.md) for the complete workflow documentation, skill definitions, and development process.

## Quick Reference

The workflow has 9 phases + 1 meta phase. Use slash commands in your Claude Code session:

| Command | Phase |
|---------|-------|
| \`/init-work\` | Initialize a new work item |
| \`/propose-work\` | Create a proposal |
| \`/validate-work\` | Validate requirements |
| \`/design-work\` | Technical design |
| \`/code-work\` | Implementation |
| \`/verify-work\` | Verification |
| \`/submit-work\` | Submit for review |
| \`/feedback-work\` | Process feedback |
| \`/close-work\` | Close work item |
| \`/analyze-workflow\` | Analyze workflow artifacts |

## Commands Directory

All slash commands are available in \`.claude/commands/\` and \`.agents/commands/\`.
`;

    await writeFile(path.join(targetDir, 'CLAUDE.md'), claudeMd, dryRun);
  },
};
