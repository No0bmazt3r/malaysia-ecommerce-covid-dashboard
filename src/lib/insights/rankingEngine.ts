import { rollup } from 'd3-array';
import type { Order } from '@/lib/types';

export interface RankedGroup {
  key: string;
  total: number;
  count: number;
  average: number;
}

/** Groups rows by a dimension (state, product_category, covid_phase) and ranks by a metric */
export function rankByDimension(
  rows: Order[],
  dimension: keyof Order,
  metric: keyof Order
): RankedGroup[] {
  const grouped = rollup(
    rows,
    (group: Order[]) => {
      const values = group.map((r: Order) => Number(r[metric]) || 0);
      const total = values.reduce((a: number, b: number) => a + b, 0);
      return {
        total,
        count: group.length,
        average: group.length > 0 ? total / group.length : 0,
      };
    },
    (r: Order) => String(r[dimension])
  );

  return Array.from(grouped, ([key, stats]) => ({ key, ...stats }))
    .sort((a, b) => b.total - a.total);
}

export function topN(ranked: RankedGroup[], n: number) {
  return ranked.slice(0, n);
}

export function bottomN(ranked: RankedGroup[], n: number) {
  return ranked.slice(-n).reverse();
}
