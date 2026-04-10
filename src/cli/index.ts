import chalk from 'chalk';
import { Command } from 'commander';
import { initCommand } from './init.js';
import { statusCommand } from './status.js';
import { listCommand } from './list.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getVersion(): string {
  try {
    const pkgPath = path.join(__dirname, '..', '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version: string };
    return pkg.version;
  } catch {
    return '0.0.0';
  }
}

const program = new Command();

program
  .name('specoven')
  .description('Universal AI Development Workflow Toolkit')
  .version(getVersion());

program
  .command('init')
  .description('Initialize specoven in the current repository')
  .option('--agent <agent>', 'Agent adapter to install (claude|copilot|codex|cursor)')
  .option('--force', 'Overwrite existing .agents/ directory')
  .option('--dry-run', 'Show what will be created without writing files')
  .action(async (options) => {
    try {
      await initCommand(options);
    } catch (err) {
      console.error(chalk.red('❌ ' + (err instanceof Error ? err.message : String(err))));
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show work item status dashboard')
  .action(statusCommand);

program
  .command('list')
  .description('Show installed skills and active adapters')
  .action(listCommand);

program.parse(process.argv);
