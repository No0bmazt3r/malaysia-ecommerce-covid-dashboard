import { mean, deviation } from 'd3-array';

export function computeMean(values: number[]): number {
  return mean(values) ?? 0;
}

export function computeStdDev(values: number[]): number {
  return deviation(values) ?? 0;
}

/** Pearson correlation coefficient between two equal-length numeric arrays */
export function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n < 2) return 0;

  const meanX = computeMean(x);
  const meanY = computeMean(y);

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumSqX += dx * dx;
    sumSqY += dy * dy;
  }

  const denominator = Math.sqrt(sumSqX * sumSqY);
  return denominator === 0 ? 0 : numerator / denominator;
}

/** z-score of a single value against a distribution */
export function zScore(value: number, values: number[]): number {
  const m = computeMean(values);
  const sd = computeStdDev(values);
  return sd === 0 ? 0 : (value - m) / sd;
}
