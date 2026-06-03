export interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  quantity_in_stock: number;
}

export interface DashboardSummary {
  total_products: number;
  total_customers: number;
  total_orders: number;
  low_stock_products: LowStockProduct[];
}
