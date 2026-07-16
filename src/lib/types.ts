export interface Order {
  order_id: string; order_date: string; covid_phase: string; customer_id: string;
  state: string; warehouse_id: string; product_id: string; product_category: string;
  order_channel: string; order_quantity: number; unit_price: number; discount_pct: number;
  marketing_channel: string; ad_spend_myr: number; website_traffic_source: string;
  sales_revenue: number; customer_segment: string; customer_age_group: string;
  payment_method: string; delivery_time_days: number; delivery_status: string;
  shipping_cost_rm: number; inventory_level_pct: number; stockout_flag: number;
  return_flag: number; customer_rating: number;
}
export type UCMode = "analyst" | "elderly" | "kiosk";
export interface Filters {
  dateRange: [string, string]; covidPhase: string[]; state: string[];
  category: string[]; segment: string[]; searchQuery: string;
}
