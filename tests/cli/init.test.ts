import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { initCommand, ADAPTERS } from '../../src/cli/init.js';

// Suppress console output in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Helper: create a temp directory for each test
async function makeTempDir(): Promise<string> {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), 'specoven-test-'));
}

describe('ADAPTERS registry', () => {
  it('contains all four adapters', () => {
    expect(ADAPTERS['claude'].name).toBe('claude');
    expect(ADAPTERS['copilot'].name).toBe('copilot');
    expect(ADAPTERS['codex'].name).toBe('codex');
    expect(ADAPTERS['cursor'].name).toBe('cursor');
  });

  it('does not contain unknown adapters', () => {
    expect(ADAPTERS['unknown']).toBeUndefined();
    expect(ADAPTERS['gpt']).toBeUndefined();
  });
});

describe('initCommand — basic installation', () => {
  it('creates .agents/ structure and AGENTS.md', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, '.agents'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.agents', 'config.yaml'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.agents', 'skills'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.agents', 'commands'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.agents', 'templates'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, 'AGENTS.md'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, 'work-items', '.gitkeep'))).toBe(true);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('installs all 10 skills', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ targetDir: tmpDir });
      const skills = fs.readdirSync(path.join(tmpDir, '.agents', 'skills'), { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);
      expect(skills.length).toBe(10);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('installs all 10 commands', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ targetDir: tmpDir });
      const cmds = fs.readdirSync(path.join(tmpDir, '.agents', 'commands'))
        .filter((f) => f.endsWith('.md'));
      expect(cmds.length).toBe(10);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('initCommand — --dry-run', () => {
  it('writes no files when --dry-run is set', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ dryRun: true, targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, '.agents'))).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, 'AGENTS.md'))).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, 'work-items'))).toBe(false);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('does not install adapter files when --dry-run is set', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ agent: 'cursor', dryRun: true, targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, '.cursorrules'))).toBe(false);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('initCommand — existing .agents/ handling', () => {
  it('throws when .agents/ already exists and --force is not set', async () => {
    const tmpDir = await makeTempDir();
    try {
      await fs.promises.mkdir(path.join(tmpDir, '.agents'), { recursive: true });
      await expect(initCommand({ targetDir: tmpDir })).rejects.toThrow('.agents');
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('throws when AGENTS.md already exists and --force is not set', async () => {
    const tmpDir = await makeTempDir();
    try {
      await fs.promises.writeFile(path.join(tmpDir, 'AGENTS.md'), 'preexisting', 'utf8');
      await expect(initCommand({ targetDir: tmpDir })).rejects.toThrow('AGENTS.md');
      expect(fs.existsSync(path.join(tmpDir, '.agents'))).toBe(false);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('removes stale files when --force is set', async () => {
    const tmpDir = await makeTempDir();
    try {
      // First init
      await initCommand({ targetDir: tmpDir });
      // Add a stale file that won't be in templates
      const staleFile = path.join(tmpDir, '.agents', 'stale-file.txt');
      await fs.promises.writeFile(staleFile, 'stale');
      expect(fs.existsSync(staleFile)).toBe(true);

      // Force re-init
      await initCommand({ force: true, targetDir: tmpDir });

      // Stale file should be gone
      expect(fs.existsSync(staleFile)).toBe(false);
      // But normal structure should still be present
      expect(fs.existsSync(path.join(tmpDir, '.agents', 'config.yaml'))).toBe(true);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('initCommand — invalid --agent', () => {
  it('throws for unknown agent name without writing files', async () => {
    const tmpDir = await makeTempDir();
    try {
      await expect(initCommand({ agent: 'unknown-agent', targetDir: tmpDir })).rejects.toThrow('Unknown agent');
      expect(fs.existsSync(path.join(tmpDir, '.agents'))).toBe(false);
      expect(fs.existsSync(path.join(tmpDir, 'AGENTS.md'))).toBe(false);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

describe('initCommand — agent adapters', () => {
  it('installs claude adapter files', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ agent: 'claude', targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, 'CLAUDE.md'))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, '.claude', 'commands'))).toBe(true);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('normalizes agent casing for install and next-step messaging', async () => {
    const tmpDir = await makeTempDir();
    try {
      const logSpy = vi.spyOn(console, 'log');
      await initCommand({ agent: 'Claude', targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, 'CLAUDE.md'))).toBe(true);
      expect(logSpy.mock.calls.flat().join('\n')).toContain('Claude Code: Use /command shortcuts');
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('installs copilot adapter files', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ agent: 'copilot', targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, '.github', 'copilot-instructions.md'))).toBe(true);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('installs codex adapter files', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ agent: 'codex', targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, 'CODEX.md'))).toBe(true);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('installs cursor adapter files', async () => {
    const tmpDir = await makeTempDir();
    try {
      await initCommand({ agent: 'cursor', targetDir: tmpDir });
      expect(fs.existsSync(path.join(tmpDir, '.cursorrules'))).toBe(true);
    } finally {
      await fs.promises.rm(tmpDir, { recursive: true, force: true });
    }
  });
});
