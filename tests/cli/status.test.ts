import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const TEST_DIR = path.join(process.cwd(), 'test-scratch-status');

beforeEach(async () => {
  await fs.promises.mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
  await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
});

describe('statusCommand', () => {
  it('outputs message when work-items/ does not exist', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    const originalCwd = process.cwd;
    process.cwd = () => TEST_DIR;

    try {
      const { statusCommand } = await import('../../src/cli/status.js');
      await statusCommand();
    } finally {
      console.log = originalLog;
      process.cwd = originalCwd;
    }

    const output = logs.join('\n');
    expect(output).toMatch(/work-items/i);
  });

  it('outputs message when work-items/ is empty', async () => {
    await fs.promises.mkdir(path.join(TEST_DIR, 'work-items'), { recursive: true });

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    const originalCwd = process.cwd;
    process.cwd = () => TEST_DIR;

    try {
      const { statusCommand } = await import('../../src/cli/status.js');
      await statusCommand();
    } finally {
      console.log = originalLog;
      process.cwd = originalCwd;
    }

    const output = logs.join('\n');
    expect(output).toMatch(/no active work items/i);
  });

  it('shows work item details when status.yaml exists', async () => {
    const workItemDir = path.join(TEST_DIR, 'work-items', 'WI-2024-0115-001');
    await fs.promises.mkdir(workItemDir, { recursive: true });

    const statusYaml = `id: "WI-2024-0115-001"
title: "Test work item"
phase: "design"
overall_score: 72
blocked: false
`;
    await fs.promises.writeFile(path.join(workItemDir, 'status.yaml'), statusYaml);

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));

    const originalCwd = process.cwd;
    process.cwd = () => TEST_DIR;

    try {
      // Re-import to get fresh module (bypasses module cache issue in test)
      const mod = await import('../../src/cli/status.js?t=' + Date.now());
      await mod.statusCommand();
    } catch {
      // Module may be cached — use the cached version
      const { statusCommand } = await import('../../src/cli/status.js');
      await statusCommand();
    } finally {
      console.log = originalLog;
      process.cwd = originalCwd;
    }

    const output = logs.join('\n');
    expect(output).toMatch(/WI-2024-0115-001/);
  });
});
