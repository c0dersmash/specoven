import { describe, it, expect } from 'vitest';
import { claudeAdapter } from '../../src/adapters/claude.js';
import { copilotAdapter } from '../../src/adapters/copilot.js';
import { codexAdapter } from '../../src/adapters/codex.js';
import { cursorAdapter } from '../../src/adapters/cursor.js';
import type { AgentAdapter } from '../../src/adapters/types.js';
import fs from 'fs';
import path from 'path';

const TEST_DIR = path.join(process.cwd(), 'test-scratch-adapters');

async function setupTestDir() {
  await fs.promises.mkdir(TEST_DIR, { recursive: true });
  // Create .agents/commands for claude adapter
  await fs.promises.mkdir(path.join(TEST_DIR, '.agents', 'commands'), { recursive: true });
}

async function teardownTestDir() {
  await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
}

describe('Adapter contracts', () => {
  const adapters: AgentAdapter[] = [claudeAdapter, copilotAdapter, codexAdapter, cursorAdapter];

  it('each adapter has a name', () => {
    for (const adapter of adapters) {
      expect(typeof adapter.name).toBe('string');
      expect(adapter.name.length).toBeGreaterThan(0);
    }
  });

  it('each adapter has a description', () => {
    for (const adapter of adapters) {
      expect(typeof adapter.description).toBe('string');
      expect(adapter.description.length).toBeGreaterThan(0);
    }
  });

  it('each adapter has an install function', () => {
    for (const adapter of adapters) {
      expect(typeof adapter.install).toBe('function');
    }
  });

  it('adapter names are unique', () => {
    const names = adapters.map((a) => a.name);
    const unique = new Set(names);
    expect(unique.size).toBe(adapters.length);
  });
});

describe('claudeAdapter', () => {
  it('has name "claude"', () => {
    expect(claudeAdapter.name).toBe('claude');
  });

  it('creates CLAUDE.md and .claude/commands/ in dry-run mode', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    try {
      await claudeAdapter.install(TEST_DIR, true);
    } finally {
      console.log = originalLog;
    }
    expect(logs.some((l) => l.includes('CLAUDE.md'))).toBe(true);
  });

  it('creates CLAUDE.md with specoven content', async () => {
    await setupTestDir();
    try {
      await claudeAdapter.install(TEST_DIR, false);
      const content = fs.readFileSync(path.join(TEST_DIR, 'CLAUDE.md'), 'utf8');
      expect(content).toContain('specoven');
      expect(content).toContain('/init-work');
    } finally {
      await teardownTestDir();
    }
  });
});

describe('copilotAdapter', () => {
  it('has name "copilot"', () => {
    expect(copilotAdapter.name).toBe('copilot');
  });

  it('creates copilot-instructions.md in dry-run mode', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    try {
      await copilotAdapter.install(TEST_DIR, true);
    } finally {
      console.log = originalLog;
    }
    expect(logs.some((l) => l.includes('copilot-instructions.md'))).toBe(true);
  });

  it('creates .github/copilot-instructions.md with specoven content', async () => {
    await setupTestDir();
    try {
      await copilotAdapter.install(TEST_DIR, false);
      const content = fs.readFileSync(
        path.join(TEST_DIR, '.github', 'copilot-instructions.md'),
        'utf8'
      );
      expect(content).toContain('specoven');
    } finally {
      await teardownTestDir();
    }
  });
});

describe('codexAdapter', () => {
  it('has name "codex"', () => {
    expect(codexAdapter.name).toBe('codex');
  });

  it('creates CODEX.md in dry-run mode', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    try {
      await codexAdapter.install(TEST_DIR, true);
    } finally {
      console.log = originalLog;
    }
    expect(logs.some((l) => l.includes('CODEX.md'))).toBe(true);
  });

  it('creates CODEX.md with specoven content', async () => {
    await setupTestDir();
    try {
      await codexAdapter.install(TEST_DIR, false);
      const content = fs.readFileSync(path.join(TEST_DIR, 'CODEX.md'), 'utf8');
      expect(content).toContain('specoven');
    } finally {
      await teardownTestDir();
    }
  });
});

describe('cursorAdapter', () => {
  it('has name "cursor"', () => {
    expect(cursorAdapter.name).toBe('cursor');
  });

  it('creates .cursorrules in dry-run mode', async () => {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    try {
      await cursorAdapter.install(TEST_DIR, true);
    } finally {
      console.log = originalLog;
    }
    expect(logs.some((l) => l.includes('.cursorrules'))).toBe(true);
  });

  it('creates .cursorrules with specoven content', async () => {
    await setupTestDir();
    try {
      await cursorAdapter.install(TEST_DIR, false);
      const content = fs.readFileSync(path.join(TEST_DIR, '.cursorrules'), 'utf8');
      expect(content).toContain('specoven');
    } finally {
      await teardownTestDir();
    }
  });
});
