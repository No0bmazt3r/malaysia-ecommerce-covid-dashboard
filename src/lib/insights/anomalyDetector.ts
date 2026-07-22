import { zScore } from './statisticalEngine';
import type { Order } from '@/lib/types';

const ANOMALY_Z_THRESHOLD = 2.0; // flag if |z| > 2 std devs

export function detectAnomalies(
  rows: Order[],
  metric: keyof Order,
  dimension: keyof Order
) {
  const groups = new Map<string, number[]>();
  rows.forEach((r) => {
    const val = Number(r[metric]);
    if (isNaN(val)) return;
    const key = String(r[dimension]);
    const arr = groups.get(key) ?? [];
    arr.push(val);
    groups.set(key, arr);
  });

  const groupMeans = Array.from(groups.entries()).map(([key, vals]) => ({
    key,
    mean: vals.reduce((a, b) => a + b, 0) / vals.length,
    n: vals.length,
  }));

  const allMeans = groupMeans.map((g) => g.mean);

  return groupMeans
    .map((g) => ({ ...g, z: zScore(g.mean, allMeans) }))
    .filter((g) => Math.abs(g.z) > ANOMALY_Z_THRESHOLD && g.n >= 15);
}
