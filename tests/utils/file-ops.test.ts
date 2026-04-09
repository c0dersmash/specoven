import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { applyPlaceholders, fileExists, ensureDir } from '../../src/utils/file-ops.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

const TEST_DIR = path.join(process.cwd(), 'test-scratch-file-ops');

beforeEach(async () => {
  await fs.promises.mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
  await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
});

describe('applyPlaceholders', () => {
  it('replaces a single placeholder', () => {
    const result = applyPlaceholders('Hello {{NAME}}!', { NAME: 'World' });
    expect(result).toBe('Hello World!');
  });

  it('replaces multiple placeholders', () => {
    const result = applyPlaceholders('{{A}} and {{B}}', { A: 'foo', B: 'bar' });
    expect(result).toBe('foo and bar');
  });

  it('replaces the same placeholder multiple times', () => {
    const result = applyPlaceholders('{{X}} {{X}} {{X}}', { X: 'hi' });
    expect(result).toBe('hi hi hi');
  });

  it('leaves unmatched placeholders unchanged', () => {
    const result = applyPlaceholders('Hello {{NAME}}!', {});
    expect(result).toBe('Hello {{NAME}}!');
  });

  it('returns unchanged string when no placeholders exist', () => {
    const result = applyPlaceholders('plain text', { NAME: 'World' });
    expect(result).toBe('plain text');
  });

  it('handles empty string', () => {
    expect(applyPlaceholders('', { NAME: 'World' })).toBe('');
  });

  it('handles empty vars', () => {
    expect(applyPlaceholders('{{NAME}}', {})).toBe('{{NAME}}');
  });
});

describe('fileExists', () => {
  it('returns true for an existing file', async () => {
    const filePath = path.join(TEST_DIR, 'exists.txt');
    await fs.promises.writeFile(filePath, 'hello');
    expect(await fileExists(filePath)).toBe(true);
  });

  it('returns false for a non-existent file', async () => {
    const filePath = path.join(TEST_DIR, 'does-not-exist.txt');
    expect(await fileExists(filePath)).toBe(false);
  });

  it('returns true for an existing directory', async () => {
    expect(await fileExists(TEST_DIR)).toBe(true);
  });

  it('returns false for a non-existent directory', async () => {
    expect(await fileExists(path.join(TEST_DIR, 'nope', 'subdir'))).toBe(false);
  });
});

describe('ensureDir', () => {
  it('creates a new directory', async () => {
    const newDir = path.join(TEST_DIR, 'new-dir');
    await ensureDir(newDir);
    expect(fs.existsSync(newDir)).toBe(true);
  });

  it('does not throw if directory already exists', async () => {
    await expect(ensureDir(TEST_DIR)).resolves.not.toThrow();
  });

  it('creates nested directories', async () => {
    const nested = path.join(TEST_DIR, 'a', 'b', 'c');
    await ensureDir(nested);
    expect(fs.existsSync(nested)).toBe(true);
  });

  it('logs and does not create directory in dry-run mode', async () => {
    const newDir = path.join(TEST_DIR, 'dry-run-dir');
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.join(' '));
    try {
      await ensureDir(newDir, true);
    } finally {
      console.log = originalLog;
    }
    expect(fs.existsSync(newDir)).toBe(false);
    expect(logs.some((l) => l.includes('dry-run'))).toBe(true);
  });
});
