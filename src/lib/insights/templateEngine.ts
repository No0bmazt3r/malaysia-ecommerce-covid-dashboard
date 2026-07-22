export function fillTemplate(template: string, data: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = data[key];
    if (value === undefined) return `{${key}}`;
    return typeof value === 'number' ? formatNumber(value, key) : String(value);
  });
}

function formatNumber(value: number, key: string): string {
  if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('total')) {
    return `RM ${value.toLocaleString('en-MY', { maximumFractionDigits: 0 })}`;
  }
  if (key.toLowerCase().includes('percent') || key.toLowerCase().includes('pct')) {
    return `${value.toFixed(1)}%`;
  }
  return value.toLocaleString('en-MY', { maximumFractionDigits: 2 });
}
