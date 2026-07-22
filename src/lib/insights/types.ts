export type InsightCategory =
  | 'top_performer'
  | 'bottom_performer'
  | 'delivery_bottleneck'
  | 'correlation'
  | 'phase_impact'
  | 'anomaly';

export interface InsightCandidate {
  category: InsightCategory;
  confidence: number;        // 0-1, drives prioritization
  sampleSize: number;        // n rows behind this insight
  data: Record<string, number | string>; // raw values for template injection
  priority?: number;         // computed by insightPrioritizer
}

export interface RenderedInsight {
  id: string;
  headline: string;
  body: string;              // the causal + prescriptive sentence
  category: InsightCategory;
  confidence: number;
}

export const MIN_SAMPLE_SIZE = 15; // suppress insight if n below this
