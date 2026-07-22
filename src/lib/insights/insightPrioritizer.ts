import type { InsightCandidate } from './types';

/**
 * Ranks candidate insights so the UI only surfaces the top 3-4.
 * Priority = confidence weighted by sample size, with a category
 * diversity bonus so we don't show four "top performer" insights.
 */
export function prioritizeInsights(
  candidates: InsightCandidate[],
  maxResults = 4
): InsightCandidate[] {
  const scored = candidates.map((c) => ({
    ...c,
    priority: c.confidence * Math.min(1, c.sampleSize / 100),
  }));

  const seenCategories = new Set<string>();
  const result: InsightCandidate[] = [];

  for (const candidate of scored.sort((a, b) => b.priority - a.priority)) {
    if (result.length >= maxResults) break;
    // diversity guard: max 2 of the same category
    const countSameCategory = result.filter((r) => r.category === candidate.category).length;
    if (countSameCategory >= 2) continue;
    result.push(candidate);
    seenCategories.add(candidate.category);
  }

  return result;
}
