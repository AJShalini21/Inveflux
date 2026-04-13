export interface ReorderAlert {
  productId: number;
  productName: string;
  vendorName: string;
  usableStock: number;
  reorderLevel: number;
  alertLevel: string; // RED, YELLOW, GREEN, etc.
  avgDailySales: number;
  stockCoverageDays: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  category: string;
  totalRevenue: number;
  totalQuantity: number;
}

export interface CategoryPerformance {
  category: string;
  totalRevenue: number;
  percentageContribution: number;
}

export interface SalesTrend {
  month: string;
  totalRevenue: number;
}

const API_BASE_URL = '/api/v1/insights/operational';

export const operationalService = {
  fetchReorderAlerts: async (vendorId?: number): Promise<ReorderAlert[]> => {
    const url = vendorId
      ? `${API_BASE_URL}/reorder-alerts?vendorId=${vendorId}`
      : `${API_BASE_URL}/reorder-alerts`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch reorder alerts');
    return response.json();
  },

  fetchTopProducts: async (metric: string): Promise<TopProduct[]> => {
    let url = `${API_BASE_URL}/top-products?metric=${metric}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch top products');
    return response.json();
  },

  fetchCategoryPerformance: async (): Promise<CategoryPerformance[]> => {
    let url = `${API_BASE_URL}/category-performance`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch category performance');
    return response.json();
  },

  fetchMonthlySalesTrend: async (): Promise<SalesTrend[]> => {
    let url = `${API_BASE_URL}/monthly-sales-trend`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch monthly sales trend');
    return response.json();
  },

  fetchOperationalDetails: async (
    vendorId?: number,
    alertLevel?: string,
  ): Promise<ReorderAlert[]> => {
    let url = `${API_BASE_URL}/details`;
    const params = new URLSearchParams();
    if (vendorId) params.append('vendorId', vendorId.toString());
    if (alertLevel) params.append('alertLevel', alertLevel);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch operational details');
    return response.json();
  },
};
