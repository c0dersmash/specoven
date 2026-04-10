import { describe, it, expect } from 'vitest';
import {
  computeWeightedScore,
  checkGate,
  getRubricLabel,
  formatScore,
  DEFAULT_SCORING_CONFIG,
} from '../../src/utils/scoring.js';

describe('computeWeightedScore', () => {
  it('returns 0 for empty scores', () => {
    expect(computeWeightedScore({})).toBe(0);
  });

  it('returns 0 for unknown categories', () => {
    expect(computeWeightedScore({ unknown_cat: 80 })).toBe(0);
  });

  it('computes weighted score for a single category', () => {
    const scores = { clarity: 80 };
    const result = computeWeightedScore(scores);
    expect(result).toBe(80);
  });

  it('computes weighted average across equal-weight categories', () => {
    const scores = { clarity: 60, scope: 80 };
    const result = computeWeightedScore(scores);
    // Both have weight 0.15, so average = (60 + 80) / 2 = 70
    expect(result).toBe(70);
  });

  it('handles all default categories', () => {
    const scores: Record<string, number> = {};
    for (const cat of Object.keys(DEFAULT_SCORING_CONFIG.categories)) {
      scores[cat] = 100;
    }
    expect(computeWeightedScore(scores)).toBe(100);
  });

  it('rounds to 2 decimal places', () => {
    const scores = { clarity: 33, scope: 33, completeness: 34 };
    const result = computeWeightedScore(scores);
    expect(Number.isFinite(result)).toBe(true);
    expect(result.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2);
  });

  it('ignores unknown categories in mixed input', () => {
    const scores = { clarity: 80, unknown: 50 };
    const result = computeWeightedScore(scores);
    expect(result).toBe(80);
  });

  it('uses custom config when provided', () => {
    const customConfig = {
      categories: {
        quality: { weight: 1.0, description: 'Quality metric' },
      },
      thresholds: {},
    };
    expect(computeWeightedScore({ quality: 75 }, customConfig)).toBe(75);
  });
});

describe('checkGate', () => {
  it('passes when score meets threshold', () => {
    const result = checkGate(70, 'validate_to_design');
    expect(result.passed).toBe(true);
    expect(result.threshold).toBe(60);
  });

  it('passes when score equals threshold exactly', () => {
    const result = checkGate(60, 'validate_to_design');
    expect(result.passed).toBe(true);
  });

  it('fails when score is below threshold', () => {
    const result = checkGate(59, 'validate_to_design');
    expect(result.passed).toBe(false);
    expect(result.threshold).toBe(60);
    expect(result.message).toContain('Cannot proceed');
  });

  it('returns null threshold for unknown transition', () => {
    const result = checkGate(50, 'nonexistent_transition');
    expect(result.passed).toBe(true);
    expect(result.threshold).toBeNull();
    expect(result.message).toContain('No gate');
  });

  it('includes score and threshold in failure message', () => {
    const result = checkGate(55, 'design_to_code');
    expect(result.message).toContain('55');
    expect(result.message).toContain('70');
  });

  it('checks all standard transitions', () => {
    const transitions = [
      ['init_to_propose', 30],
      ['propose_to_validate', 50],
      ['validate_to_design', 60],
      ['design_to_code', 70],
      ['code_to_verify', 80],
      ['verify_to_submit', 85],
      ['submit_to_close', 90],
    ] as const;

    for (const [key, threshold] of transitions) {
      const belowResult = checkGate(threshold - 1, key);
      expect(belowResult.passed).toBe(false);
      const atResult = checkGate(threshold, key);
      expect(atResult.passed).toBe(true);
    }
  });
});

describe('getRubricLabel', () => {
  it('returns lowest label for score 0', () => {
    expect(getRubricLabel(0)).toBe('Vague, no clear goal');
  });

  it('returns lowest label for score 20', () => {
    expect(getRubricLabel(20)).toBe('Vague, no clear goal');
  });

  it('returns second label for score 21', () => {
    expect(getRubricLabel(21)).toBe('General direction known');
  });

  it('returns second label for score 40', () => {
    expect(getRubricLabel(40)).toBe('General direction known');
  });

  it('returns middle label for score 41–60', () => {
    expect(getRubricLabel(50)).toBe('Goal clear, details missing');
    expect(getRubricLabel(60)).toBe('Goal clear, details missing');
  });

  it('returns fourth label for score 61–80', () => {
    expect(getRubricLabel(70)).toBe('Well-defined with minor gaps');
    expect(getRubricLabel(80)).toBe('Well-defined with minor gaps');
  });

  it('returns highest label for score > 80', () => {
    expect(getRubricLabel(81)).toBe('Crystal clear, no ambiguity');
    expect(getRubricLabel(100)).toBe('Crystal clear, no ambiguity');
  });
});

describe('formatScore', () => {
  it('includes the score', () => {
    expect(formatScore(75)).toContain('75');
  });

  it('includes the max score', () => {
    expect(formatScore(75)).toContain('100');
  });

  it('includes a progress bar', () => {
    const result = formatScore(50);
    expect(result).toContain('█');
    expect(result).toContain('░');
  });

  it('includes the rubric label', () => {
    expect(formatScore(50)).toContain('Goal clear, details missing');
  });

  it('shows full bar for 100', () => {
    const result = formatScore(100);
    expect(result).toContain('██████████');
    expect(result).not.toContain('░');
  });

  it('shows empty bar for 0', () => {
    const result = formatScore(0);
    expect(result).toContain('░░░░░░░░░░');
  });

  it('clamps negative scores to 0', () => {
    const result = formatScore(-5);
    expect(result).toContain('0/100');
    expect(result).toContain('░░░░░░░░░░');
  });

  it('clamps scores above 100 to 100', () => {
    const result = formatScore(125);
    expect(result).toContain('100/100');
    expect(result).toContain('██████████');
  });
});
