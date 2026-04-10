import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

export async function listCommand(): Promise<void> {
  const targetDir = process.cwd();
  const agentsDir = path.join(targetDir, '.agents');

  console.log(chalk.bold.cyan('\n🔥 specoven list\n'));

  if (!fs.existsSync(agentsDir)) {
    console.log(chalk.yellow('specoven is not initialized in this directory.'));
    console.log(chalk.gray('Run `specoven init` to set up specoven.\n'));
    return;
  }

  const skillsDir = path.join(agentsDir, 'skills');
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    console.log(chalk.bold(`📚 Installed Skills (${skills.length}):`));
    for (const skill of skills) {
      console.log(`  ${chalk.green('✓')} ${skill}`);
    }
    console.log('');
  }

  const commandsDir = path.join(agentsDir, 'commands');
  if (fs.existsSync(commandsDir)) {
    const commands = fs.readdirSync(commandsDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => '/' + f.replace('.md', ''));

    console.log(chalk.bold(`⚡ Available Commands (${commands.length}):`));
    for (const cmd of commands) {
      console.log(`  ${chalk.cyan(cmd)}`);
    }
    console.log('');
  }

  const adapters: string[] = [];

  if (fs.existsSync(path.join(targetDir, '.claude', 'commands'))) {
    adapters.push('claude (CLAUDE.md + .claude/commands/)');
  }
  if (fs.existsSync(path.join(targetDir, '.github', 'copilot-instructions.md'))) {
    adapters.push('copilot (.github/copilot-instructions.md)');
  }
  if (fs.existsSync(path.join(targetDir, 'CODEX.md'))) {
    adapters.push('codex (CODEX.md)');
  }
  if (fs.existsSync(path.join(targetDir, '.cursorrules'))) {
    adapters.push('cursor (.cursorrules)');
  }

  if (adapters.length > 0) {
    console.log(chalk.bold(`🤖 Active Agent Adapters (${adapters.length}):`));
    for (const adapter of adapters) {
      console.log(`  ${chalk.green('✓')} ${adapter}`);
    }
  } else {
    console.log(chalk.bold('🤖 Active Agent Adapters:'));
    console.log(chalk.gray('  None — run `specoven init --agent <name>` to add one'));
  }

  console.log('');
}
