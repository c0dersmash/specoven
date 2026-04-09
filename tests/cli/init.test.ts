import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ADAPTERS } from '../../src/cli/init.js';

const TEST_DIR = path.join(process.cwd(), 'test-scratch-init');

beforeEach(async () => {
  await fs.promises.mkdir(TEST_DIR, { recursive: true });
});

afterEach(async () => {
  await fs.promises.rm(TEST_DIR, { recursive: true, force: true });
});

describe('ADAPTERS registry', () => {
  it('contains claude adapter', () => {
    expect(ADAPTERS['claude']).toBeDefined();
    expect(ADAPTERS['claude'].name).toBe('claude');
  });

  it('contains copilot adapter', () => {
    expect(ADAPTERS['copilot']).toBeDefined();
    expect(ADAPTERS['copilot'].name).toBe('copilot');
  });

  it('contains codex adapter', () => {
    expect(ADAPTERS['codex']).toBeDefined();
    expect(ADAPTERS['codex'].name).toBe('codex');
  });

  it('contains cursor adapter', () => {
    expect(ADAPTERS['cursor']).toBeDefined();
    expect(ADAPTERS['cursor'].name).toBe('cursor');
  });

  it('does not contain unknown adapters', () => {
    expect(ADAPTERS['unknown']).toBeUndefined();
    expect(ADAPTERS['gpt']).toBeUndefined();
  });
});
