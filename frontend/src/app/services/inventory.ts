export interface StockPulse {
  summary: {
    totalInventoryValue: number;
    totalProducts: number;
    healthyStockCount: number;
    lowStockCount: number;
    outOfStockCount: number;
    overstockedCount: number;
  };
  distribution: Record<string, number>;
  categoryValueContribution: CategoryContribution[];
}

export interface CategoryContribution {
  category: string;
  inventoryValue: number;
  percentage: number;
}

export interface HealthStatus {
  inventoryTurnover: number;
  dio: number;
  deadStockPercentage: number;
  overstockPercentage: number;
  healthStatus: string;
  cashRiskScore: number;
}

export interface Velocity {
  productId: number;
  productName: string;
  sellThroughRate: number;
  stockCoverageDays: number;
  velocityScore: number;
}

export interface Trend {
  period: string;
  inventoryTurnover: number;
  dio: number;
  velocityScore: number;
}

export interface RiskProduct {
  productId: number;
  productName: string;
  category: string;
  inventoryValue: number;
  currentStock: number;
  riskType: string;
}

export interface InventoryService {
  fetchStockPulse(): Promise<StockPulse>;
  fetchDioHealth(): Promise<HealthStatus>;
  fetchVelocity(): Promise<Velocity[]>;
  fetchRiskProducts(): Promise<RiskProduct[]>;
}

const API_BASE_URL = '/api/v1/insights/inventory';

export const inventoryService: InventoryService = {
  async fetchStockPulse(): Promise<StockPulse> {
    const response = await fetch(`${API_BASE_URL}/stock-pulse`);
    if (!response.ok) {
      throw new Error('Failed to fetch stock pulse');
    }
    return response.json();
  },
  async fetchDioHealth(): Promise<HealthStatus> {
    const response = await fetch(`${API_BASE_URL}/dio-health`);
    if (!response.ok) {
      throw new Error('Failed to fetch dio health');
    }
    return response.json();
  },
  async fetchVelocity(): Promise<Velocity[]> {
    const response = await fetch(`${API_BASE_URL}/velocity`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory velocity');
    }
    return response.json();
  },
  async fetchRiskProducts(): Promise<RiskProduct[]> {
    const response = await fetch(`${API_BASE_URL}/risk-products`);
    if (!response.ok) {
      throw new Error('Failed to fetch risk products');
    }
    return response.json();
  },
};
