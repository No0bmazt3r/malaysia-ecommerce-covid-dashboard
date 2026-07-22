import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { rankByDimension, topN, bottomN } from '@/lib/insights/rankingEngine';
import { pearsonCorrelation, computeMean } from '@/lib/insights/statisticalEngine';
import { detectAnomalies } from '@/lib/insights/anomalyDetector';
import { prioritizeInsights } from '@/lib/insights/insightPrioritizer';
import { fillTemplate } from '@/lib/insights/templateEngine';
import { TEMPLATES } from '@/lib/insights/templates';
import { MIN_SAMPLE_SIZE } from '@/lib/insights/types';
import type { InsightCandidate, RenderedInsight } from '@/lib/insights/types';

export function useDynamicInsights(): RenderedInsight[] {
  const { filteredData } = useDashboard();

  return useMemo(() => {
    if (filteredData.length < MIN_SAMPLE_SIZE) return [];

    const candidates: InsightCandidate[] = [];

    // --- Top / bottom performer by state ---
    const byState = rankByDimension(filteredData, 'state', 'sales_revenue');
    const topState = topN(byState, 1)[0];
    const bottomState = bottomN(byState, 1)[0];

    if (topState && topState.count >= MIN_SAMPLE_SIZE && byState.length > 1) {
      candidates.push({
        category: 'top_performer',
        confidence: 0.9,
        sampleSize: topState.count,
        data: { topKey: topState.key, topTotal: topState.total },
      });
    }
    if (bottomState && bottomState.count >= MIN_SAMPLE_SIZE && bottomState.key !== topState?.key && byState.length > 1) {
      candidates.push({
        category: 'bottom_performer',
        confidence: 0.75,
        sampleSize: bottomState.count,
        data: { bottomKey: bottomState.key, bottomTotal: bottomState.total },
      });
    }
    
    // --- Top performer by category ---
    const byCategory = rankByDimension(filteredData, 'product_category', 'sales_revenue');
    const topCat = topN(byCategory, 1)[0];
    const bottomCat = bottomN(byCategory, 1)[0];

    if (topCat && topCat.count >= MIN_SAMPLE_SIZE && byCategory.length > 1) {
      candidates.push({
        category: 'top_performer',
        confidence: 0.85,
        sampleSize: topCat.count,
        data: { topKey: topCat.key, topTotal: topCat.total },
      });
    }

    if (bottomCat && bottomCat.count >= MIN_SAMPLE_SIZE && bottomCat.key !== topCat?.key && byCategory.length > 1) {
      candidates.push({
        category: 'bottom_performer',
        confidence: 0.7,
        sampleSize: bottomCat.count,
        data: { bottomKey: bottomCat.key, bottomTotal: bottomCat.total },
      });
    }

    // --- Correlation: delivery time vs rating ---
    const deliveryTimes = filteredData.map((r) => Number(r.delivery_time_days) || 0);
    const ratings = filteredData.map((r) => Number(r.customer_rating) || 0);
    const r = pearsonCorrelation(deliveryTimes, ratings);
    if (Math.abs(r) > 0.05) {
      candidates.push({
        category: 'correlation',
        confidence: Math.min(1, Math.abs(r) + 0.3),
        sampleSize: filteredData.length,
        data: { r: r.toFixed(2), strength: Math.abs(r) > 0.5 ? 'strong' : Math.abs(r) > 0.3 ? 'moderate' : 'weak' },
      });
    }
    
    // --- Delivery Bottleneck check ---
    const avgDays = computeMean(deliveryTimes);
    if (avgDays > 4.5) {
       candidates.push({
          category: 'delivery_bottleneck',
          confidence: 0.8,
          sampleSize: filteredData.length,
          data: { avgDays: avgDays, key: topState?.key || 'this cohort' }
       });
    }

    // --- Anomalies by covid_phase ---
    const anomalies = detectAnomalies(filteredData, 'sales_revenue', 'covid_phase');
    anomalies.forEach((a) => {
      candidates.push({
        category: 'anomaly',
        confidence: Math.min(1, Math.abs(a.z) / 3),
        sampleSize: a.n,
        data: { key: a.key, z: a.z.toFixed(2), n: a.n },
      });
    });

    // --- Prioritize and render ---
    const chosen = prioritizeInsights(candidates, 4);

    return chosen.map((c, i) => {
      const templateOptions = TEMPLATES[c.category as keyof typeof TEMPLATES] ?? [];
      const template = templateOptions[i % templateOptions.length] ?? '';
      return {
        id: `${c.category}-${i}`,
        headline: c.category.replace('_', ' ').toUpperCase(),
        body: fillTemplate(template, c.data),
        category: c.category,
        confidence: c.confidence,
      };
    });
  }, [filteredData]);
}
