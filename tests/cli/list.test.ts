import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const TEST_DIR = path.join(process.cwd(), 'test-scratch-list');

beforeEach(async () => {
  await fs.promises.mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
  await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
});

describe('listCommand', () => {
  it('outputs message when .agents/ does not exist', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    const originalCwd = process.cwd;
    process.cwd = () => TEST_DIR;

    try {
      const { listCommand } = await import('../../src/cli/list.js');
      await listCommand();
    } finally {
      console.log = originalLog;
      process.cwd = originalCwd;
    }

    const output = logs.join('\n');
    expect(output).toMatch(/not initialized/i);
  });

  it('shows installed skills when .agents/skills/ exists', async () => {
    const skillsDir = path.join(TEST_DIR, '.agents', 'skills', 'init-work');
    await fs.promises.mkdir(skillsDir, { recursive: true });
    await fs.promises.writeFile(path.join(skillsDir, 'SKILL.md'), '# Skill');

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    const originalCwd = process.cwd;
    process.cwd = () => TEST_DIR;

    try {
      const { listCommand } = await import('../../src/cli/list.js');
      await listCommand();
    } finally {
      console.log = originalLog;
      process.cwd = originalCwd;
    }

    const output = logs.join('\n');
    expect(output).toMatch(/skills/i);
    expect(output).toMatch(/init-work/);
  });

  it('shows available commands when .agents/commands/ exists', async () => {
    const commandsDir = path.join(TEST_DIR, '.agents', 'commands');
    await fs.promises.mkdir(commandsDir, { recursive: true });
    await fs.promises.writeFile(path.join(commandsDir, 'init-work.md'), '# Command');

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    const originalCwd = process.cwd;
    process.cwd = () => TEST_DIR;

    try {
      const { listCommand } = await import('../../src/cli/list.js');
      await listCommand();
    } finally {
      console.log = originalLog;
      process.cwd = originalCwd;
    }

    const output = logs.join('\n');
    expect(output).toMatch(/commands/i);
    expect(output).toMatch(/\/init-work/);
  });

  it('detects active copilot adapter', async () => {
    await fs.promises.mkdir(path.join(TEST_DIR, '.agents'), { recursive: true });
    await fs.promises.mkdir(path.join(TEST_DIR, '.github'), { recursive: true });
    await fs.promises.writeFile(
      path.join(TEST_DIR, '.github', 'copilot-instructions.md'),
      '# instructions'
    );

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    const originalCwd = process.cwd;
    process.cwd = () => TEST_DIR;

    try {
      const { listCommand } = await import('../../src/cli/list.js');
      await listCommand();
    } finally {
      console.log = originalLog;
      process.cwd = originalCwd;
    }

    const output = logs.join('\n');
    expect(output).toMatch(/copilot/i);
  });
});
