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
  targetDir?: string;
}

const ADAPTERS: Record<string, AgentAdapter> = {
  claude: claudeAdapter,
  copilot: copilotAdapter,
  codex: codexAdapter,
  cursor: cursorAdapter,
};

export async function initCommand(options: InitOptions): Promise<void> {
  const targetDir = options.targetDir ?? process.cwd();
  const dryRun = options.dryRun ?? false;
  const force = options.force ?? false;
  const agent = options.agent?.toLowerCase();

  console.log(chalk.bold.cyan('\n🔥 specoven init\n'));

  if (dryRun) {
    console.log(chalk.yellow('⚠️  Dry run mode — no files will be written\n'));
  }

  const agentsDir = path.join(targetDir, '.agents');
  const generatedPaths = [
    agentsDir,
    path.join(targetDir, 'AGENTS.md'),
  ];

  if (options.agent && (!agent || !(agent in ADAPTERS))) {
    throw new Error(
      `Unknown agent: ${options.agent}. Valid agents: ${Object.keys(ADAPTERS).join(', ')}`
    );
  }

  const adapter = agent ? ADAPTERS[agent] : undefined;

  if (agent === 'claude') {
    generatedPaths.push(
      path.join(targetDir, 'CLAUDE.md'),
      path.join(targetDir, '.claude', 'commands')
    );
  } else if (agent === 'copilot') {
    generatedPaths.push(path.join(targetDir, '.github', 'copilot-instructions.md'));
  } else if (agent === 'codex') {
    generatedPaths.push(path.join(targetDir, 'CODEX.md'));
  } else if (agent === 'cursor') {
    generatedPaths.push(path.join(targetDir, '.cursorrules'));
  }

  const existingGeneratedPaths: string[] = [];
  for (const generatedPath of generatedPaths) {
    if (await fileExists(generatedPath)) {
      existingGeneratedPaths.push(generatedPath);
    }
  }

  if (existingGeneratedPaths.length > 0 && !force) {
    const existingLabels = existingGeneratedPaths.map((generatedPath) =>
      path.relative(targetDir, generatedPath)
    );
    throw new Error(
      `Generated path(s) already exist: ${existingLabels.join(', ')}. Use --force to overwrite.`
    );
  }

  if (existingGeneratedPaths.length > 0 && force) {
    console.log(chalk.yellow('⚠️  Overwriting existing generated files/directories (--force)\n'));
    for (const existingPath of existingGeneratedPaths) {
      const relativePath = path.relative(targetDir, existingPath);
      if (dryRun) {
        console.log(chalk.gray(`  [dry-run] rm -rf ${relativePath}`));
      } else {
        await fs.promises.rm(existingPath, { recursive: true, force: true });
      }
    }
  }

  let templatesDir: string;
  try {
    templatesDir = await findTemplatesDir();
  } catch (err) {
    throw new Error(
      'Could not find templates directory: ' + (err instanceof Error ? err.message : String(err))
    );
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

  if (adapter) {
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

    if (agent === 'claude') {
      console.log(chalk.gray('\n  Claude Code: Use /command shortcuts in .claude/commands/'));
    } else if (agent === 'copilot') {
      console.log(chalk.gray('\n  GitHub Copilot: Instructions loaded from .github/copilot-instructions.md'));
    } else if (agent === 'codex') {
      console.log(chalk.gray('\n  Codex: Instructions loaded from CODEX.md'));
    } else if (agent === 'cursor') {
      console.log(chalk.gray('\n  Cursor: Rules loaded from .cursorrules'));
    }
  }

  console.log('');
}

export { ADAPTERS };
