const API_BASE_URL = '/api/v1/insights/financial';

export interface RevenueSummary {
  totalRevenue: number;
  totalOrders: number;
}

export interface CogsSummary {
  totalCOGS: number;
}

export interface GrossMargin {
  grossMargin: number;
  grossMarginPercentage: number;
}

export interface NetProfit {
  netProfit: number;
}

export interface AovSummary {
  averageOrderValue: number;
}

export interface PaymentMix {
  cashPercentage: number;
  digitalPercentage: number;
}

export interface ProductProfitability {
  productId: number;
  productName: string;
  revenueContribution: number;
  grossMarginPercentage: number;
  revenueValue: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
}

export interface OrderSizeBucket {
  range: string;
  orderCount: number;
}

export interface TopBottomRevenue {
  topProducts: ProductProfitability[];
  bottomProducts: ProductProfitability[];
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  let url = `${API_BASE_URL}/${path}`;
  if (params && Object.keys(params).length > 0) {
    url += `?${new URLSearchParams(params).toString()}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch financial/${path}: ${res.statusText}`);
  return res.json();
}

export const financialService = {
  getTotalRevenue: () => get<RevenueSummary>('total-revenue'),
  getGrossMargin: () => get<GrossMargin>('gross-margin'),
  getNetProfit: () => get<NetProfit>('net-profit'),
  getAverageOrderValue: () => get<AovSummary>('average-order-value'),
  getPaymentMix: () => get<PaymentMix>('payment-mix'),
  getProductProfitability: () => get<ProductProfitability[]>('product-profitability'),
  getRevenueTrends: () => get<RevenueTrend[]>('revenue-trends'),
  getOrderSizeDistribution: () => get<OrderSizeBucket[]>('order-size-distribution'),
  getTopBottomRevenue: () => get<TopBottomRevenue>('top-bottom-revenue'),
};
