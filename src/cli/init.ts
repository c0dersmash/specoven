import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { copyDir, copyFile, writeFile, ensureDir, fileExists, findTemplatesDir } from '../utils/file-ops.js';
import { claudeAdapter } from '../adapters/claude.js';
import { copilotAdapter } from '../adapters/copilot.js';
import { codexAdapter } from '../adapters/codex.js';
import { cursorAdapter } from '../adapters/cursor.js';
import type { AgentAdapter } from '../adapters/types.js';

interface InitOptions {
  agent?: string;
  force?: boolean;
  dryRun?: boolean;
}

const ADAPTERS: Record<string, AgentAdapter> = {
  claude: claudeAdapter,
  copilot: copilotAdapter,
  codex: codexAdapter,
  cursor: cursorAdapter,
};

export async function initCommand(options: InitOptions): Promise<void> {
  const targetDir = process.cwd();
  const dryRun = options.dryRun ?? false;
  const force = options.force ?? false;

  console.log(chalk.bold.cyan('\n🔥 specoven init\n'));

  if (dryRun) {
    console.log(chalk.yellow('⚠️  Dry run mode — no files will be written\n'));
  }

  const agentsDir = path.join(targetDir, '.agents');
  const agentsExists = await fileExists(agentsDir);

  if (agentsExists && !force) {
    console.log(chalk.red('❌ .agents/ directory already exists.'));
    console.log(chalk.gray('   Use --force to overwrite.\n'));
    process.exit(1);
  }

  if (agentsExists && force) {
    console.log(chalk.yellow('⚠️  Overwriting existing .agents/ directory (--force)\n'));
  }

  let templatesDir: string;
  try {
    templatesDir = await findTemplatesDir();
  } catch (err) {
    console.error(chalk.red('❌ ' + (err instanceof Error ? err.message : String(err))));
    process.exit(1);
  }

  console.log(chalk.gray(`Using templates from: ${templatesDir}\n`));

  console.log(chalk.bold('📦 Installing .agents/ structure...'));
  await ensureDir(agentsDir, dryRun);

  await copyFile(
    path.join(templatesDir, 'config.yaml'),
    path.join(agentsDir, 'config.yaml'),
    dryRun
  );
  console.log(chalk.green('  ✓ .agents/config.yaml'));

  await copyDir(
    path.join(templatesDir, 'skills'),
    path.join(agentsDir, 'skills'),
    dryRun
  );
  console.log(chalk.green('  ✓ .agents/skills/ (10 skills)'));

  await copyDir(
    path.join(templatesDir, 'commands'),
    path.join(agentsDir, 'commands'),
    dryRun
  );
  console.log(chalk.green('  ✓ .agents/commands/ (10 commands)'));

  await copyDir(
    path.join(templatesDir, 'templates'),
    path.join(agentsDir, 'templates'),
    dryRun
  );
  console.log(chalk.green('  ✓ .agents/templates/ (9 templates)'));

  await copyFile(
    path.join(templatesDir, 'AGENTS.md'),
    path.join(targetDir, 'AGENTS.md'),
    dryRun
  );
  console.log(chalk.green('  ✓ AGENTS.md'));

  const workItemsDir = path.join(targetDir, 'work-items');
  await ensureDir(workItemsDir, dryRun);
  await writeFile(path.join(workItemsDir, '.gitkeep'), '', dryRun);
  console.log(chalk.green('  ✓ work-items/.gitkeep'));

  if (options.agent) {
    const adapter = ADAPTERS[options.agent.toLowerCase()];
    if (!adapter) {
      console.log(chalk.red(`\n❌ Unknown agent: ${options.agent}`));
      console.log(chalk.gray(`   Valid agents: ${Object.keys(ADAPTERS).join(', ')}\n`));
      process.exit(1);
    }

    console.log(chalk.bold(`\n🤖 Installing ${adapter.name} adapter...`));
    await adapter.install(targetDir, dryRun);
    console.log(chalk.green(`  ✓ ${adapter.description}`));
  }

  console.log(chalk.bold.green('\n✅ specoven initialized successfully!\n'));

  if (!dryRun) {
    console.log(chalk.bold('Next steps:'));
    console.log(chalk.gray('  1. Review AGENTS.md for the complete workflow guide'));
    console.log(chalk.gray('  2. Adjust .agents/config.yaml to tune scoring thresholds'));
    console.log(chalk.gray('  3. Start your first work item: /init-work'));

    if (options.agent === 'claude') {
      console.log(chalk.gray('\n  Claude Code: Use /command shortcuts in .claude/commands/'));
    } else if (options.agent === 'copilot') {
      console.log(chalk.gray('\n  GitHub Copilot: Instructions loaded from .github/copilot-instructions.md'));
    } else if (options.agent === 'codex') {
      console.log(chalk.gray('\n  Codex: Instructions loaded from CODEX.md'));
    } else if (options.agent === 'cursor') {
      console.log(chalk.gray('\n  Cursor: Rules loaded from .cursorrules'));
    }
  }

  console.log('');
}

export { ADAPTERS };
