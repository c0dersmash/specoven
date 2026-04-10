import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { parse as parseYaml } from 'yaml';

interface WorkItemStatus {
  id?: string;
  title?: string;
  phase?: string;
  overall_score?: number;
  created_at?: string;
  updated_at?: string;
  blocked?: boolean;
  blocked_reason?: string;
}

export async function statusCommand(): Promise<void> {
  const workItemsDir = path.join(process.cwd(), 'work-items');

  console.log(chalk.bold.cyan('\n🔥 specoven status\n'));

  if (!fs.existsSync(workItemsDir)) {
    console.log(chalk.yellow('No work-items/ directory found.'));
    console.log(chalk.gray('Run `specoven init` to set up specoven, then /init-work to start a work item.\n'));
    return;
  }

  const entries = fs.readdirSync(workItemsDir, { withFileTypes: true });
  const workItemDirs = entries.filter(
    (e) => e.isDirectory() && e.name !== 'archive' && e.name !== 'meta'
  );

  if (workItemDirs.length === 0) {
    console.log(chalk.yellow('No active work items found.'));
    console.log(chalk.gray('Use /init-work to start a new work item.\n'));
    return;
  }

  console.log(chalk.bold(`Found ${workItemDirs.length} active work item(s):\n`));

  const phaseOrder = [
    'init', 'propose', 'validate', 'design', 'code', 'verify', 'submit', 'feedback', 'close',
  ];

  for (const dir of workItemDirs) {
    const statusPath = path.join(workItemsDir, dir.name, 'status.yaml');

    let status: WorkItemStatus = { id: dir.name };

    if (fs.existsSync(statusPath)) {
      try {
        const raw = fs.readFileSync(statusPath, 'utf8');
        status = { ...status, ...(parseYaml(raw) as WorkItemStatus) };
      } catch {
        // Use defaults
      }
    }

    const phase = status.phase ?? 'unknown';
    const score = status.overall_score ?? 0;
    const phaseIndex = phaseOrder.indexOf(phase);
    const progress = phaseIndex >= 0 ? phaseIndex + 1 : 0;
    const progressBar = '█'.repeat(progress) + '░'.repeat(9 - Math.max(0, progress));

    const scoreColor = score >= 85 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red;
    const blocked = status.blocked ? chalk.red(' [BLOCKED]') : '';

    console.log(chalk.bold(`  ${status.id ?? dir.name}`));
    console.log(`    Title:    ${chalk.white(status.title ?? '(no title)')}`);
    console.log(`    Phase:    ${chalk.cyan(phase)} [${progressBar}] (${progress}/9)`);
    console.log(`    Score:    ${scoreColor(score + '/100')}${blocked}`);

    if (status.blocked_reason) {
      console.log(`    Blocked:  ${chalk.red(status.blocked_reason)}`);
    }

    if (status.updated_at) {
      console.log(`    Updated:  ${chalk.gray(status.updated_at)}`);
    }

    console.log('');
  }

  const archiveDir = path.join(workItemsDir, 'archive');
  if (fs.existsSync(archiveDir)) {
    const archived = fs.readdirSync(archiveDir, { withFileTypes: true }).filter((e) => e.isDirectory());
    if (archived.length > 0) {
      console.log(chalk.gray(`  ${archived.length} archived work item(s) in work-items/archive/\n`));
    }
  }
}
