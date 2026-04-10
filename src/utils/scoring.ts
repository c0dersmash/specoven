export interface ScoreCategory {
  weight: number;
  description: string;
}

export interface ScoringConfig {
  categories: Record<string, ScoreCategory>;
  thresholds: Record<string, number>;
}

export interface PhaseScore {
  scores: Record<string, number>;
  overall: number;
  passed: boolean;
  threshold: number | null;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  categories: {
    clarity: { weight: 0.15, description: 'How clear and unambiguous' },
    scope: { weight: 0.15, description: 'How well-bounded the work is' },
    completeness: { weight: 0.15, description: 'How complete the artifacts are' },
    feasibility: { weight: 0.10, description: 'How technically achievable' },
    testability: { weight: 0.15, description: 'How verifiable the requirements are' },
    implementation_readiness: { weight: 0.15, description: 'How ready for coding' },
    release_readiness: { weight: 0.15, description: 'How ready for production' },
  },
  thresholds: {
    init_to_propose: 30,
    propose_to_validate: 50,
    validate_to_design: 60,
    design_to_code: 70,
    code_to_verify: 80,
    verify_to_submit: 85,
    submit_to_close: 90,
  },
};

export function computeWeightedScore(
  scores: Record<string, number>,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [category, score] of Object.entries(scores)) {
    const categoryConfig = config.categories[category];
    if (categoryConfig) {
      weightedSum += score * categoryConfig.weight;
      totalWeight += categoryConfig.weight;
    }
  }

  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function checkGate(
  overallScore: number,
  transitionKey: string,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): { passed: boolean; threshold: number | null; message: string } {
  const threshold = config.thresholds[transitionKey];

  if (threshold === undefined) {
    return { passed: true, threshold: null, message: 'No gate for this transition' };
  }

  const passed = overallScore >= threshold;
  const message = passed
    ? `Score ${overallScore} meets threshold ${threshold} for ${transitionKey}`
    : `Score ${overallScore} does not meet threshold ${threshold} for ${transitionKey}. Cannot proceed.`;

  return { passed, threshold, message };
}

export function getRubricLabel(score: number): string {
  if (score <= 20) return 'Vague, no clear goal';
  if (score <= 40) return 'General direction known';
  if (score <= 60) return 'Goal clear, details missing';
  if (score <= 80) return 'Well-defined with minor gaps';
  return 'Crystal clear, no ambiguity';
}

export function formatScore(score: number): string {
  const clampedScore = Math.max(0, Math.min(100, score));
  const label = getRubricLabel(clampedScore);
  const filled = Math.floor(clampedScore / 10);
  const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
  return `${clampedScore}/100 [${bar}] — ${label}`;
}
