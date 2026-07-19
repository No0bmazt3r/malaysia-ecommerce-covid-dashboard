export function shortMoney(v: number) {
  if (v >= 1_000_000) return `RM ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `RM ${Math.round(v / 1_000)}K`;
  return `RM ${Math.round(v)}`;
}
