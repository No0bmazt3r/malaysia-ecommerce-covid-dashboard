import { Filters, Order } from "./types";
export function applyFilters(data: Order[], filters: Filters): Order[] {
  return data.filter((row) => {
    const d = new Date(row.order_date);
    if (d < new Date(filters.dateRange[0]) || d > new Date(filters.dateRange[1])) return false;
    if (filters.covidPhase.length && !filters.covidPhase.includes(row.covid_phase)) return false;
    if (filters.state.length && !filters.state.includes(row.state)) return false;
    if (filters.category.length && !filters.category.includes(row.product_category)) return false;
    if (filters.segment.length && !filters.segment.includes(row.customer_segment)) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!row.order_id.toLowerCase().includes(q) && !row.product_id.toLowerCase().includes(q) && !row.customer_id.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}
export function computeKPIs(data: Order[]) {
  const totalOrders = data.length || 1;
  return {
    totalRevenue: data.reduce((s, r) => s + r.sales_revenue, 0),
    totalOrders,
    avgDelivery: data.reduce((s, r) => s + r.delivery_time_days, 0) / totalOrders,
    stockoutRate: (data.filter((r) => r.stockout_flag === 1).length / totalOrders) * 100,
    returnRate: (data.filter((r) => r.return_flag === 1).length / totalOrders) * 100,
  };
}
