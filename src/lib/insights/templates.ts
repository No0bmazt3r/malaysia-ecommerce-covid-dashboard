export const TEMPLATES = {
  top_performer: [
    'Because {topKey} generated {topTotal}, it is the absolute highest revenue driver in this filtered view. <strong class=\"block mt-2 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Allocate additional digital marketing resources here before the next market shift.',
    '{topKey} is your strongest segment, driving {topTotal} right now. <strong class=\"block mt-2 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Prioritize inventory and targeted ad spend accordingly to protect this revenue stream.',
  ],
  bottom_performer: [
    '{bottomKey} severely underperforms at only {bottomTotal} in this specific cohort. <strong class=\"block mt-2 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Investigate fulfillment issues or localized demand drops before cutting the budget entirely.',
  ],
  delivery_bottleneck: [
    'Average delivery time reached {avgDays} days for {key}. <strong class=\"block mt-2 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Mandate a localized inventory buffer or audit last-mile logistics partners to protect customer satisfaction.',
  ],
  correlation: [
    'Delivery time and customer rating show a {strength} correlation (r = {r}) within these parameters. <strong class=\"block mt-2 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Aggressively optimize fulfillment workflows, because faster delivery directly dictates customer retention here.',
  ],
  anomaly: [
    '{key} deviates {z} standard deviations from the norm across {n} orders. <strong class=\"block mt-2 mb-1 text-[var(--foreground)]\">Recommendation:</strong> Trigger a manual operational review to find out if this is a systemic failure or just a one-off outlier.',
  ],
} as const;
