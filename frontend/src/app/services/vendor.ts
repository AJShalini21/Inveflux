const API_BASE_URL = '/api/v1/insights/vendors';

export interface PayablesSummary {
    totalPayables: number;
}

export interface PaymentDelaySummary {
    averageDelayDays: number;
}

export interface LatePaymentSummary {
    latePaymentPercentage: number;
}

export interface PurchaseShare {
    vendorId: number;
    vendorName: string;
    purchaseAmount: number;
    percentageOfTotal: number;
}

export interface VendorPerformance {
    vendorId: number;
    vendorName: string;
    totalPayables: number;
    avgPaymentDelay: number;
    latePaymentPercentage: number;
    status: string; // RED, YELLOW, GREEN
}

export interface VendorProfitContribution {
    vendorId: number;
    vendorName: string;
    totalProfit: number;
    totalRevenue: number;
    totalQuantity: number;
}

export interface VendorScore {
    vendorId: number;
    vendorName: string;
    totalProfit: number;
    productCount: number;
    vendorScore: number;
}

class VendorService {
    private async fetchWithErrorHandling<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        try {
            let url = `${API_BASE_URL}/${endpoint}`;

            if (params) {
                const searchParams = new URLSearchParams(params);
                url += `?${searchParams.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch vendor ${endpoint} data: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error(`Error fetching vendor ${endpoint}:`, error);
            throw error;
        }
    }

    async getPayablesSummary(startDate?: string, endDate?: string): Promise<PayablesSummary> {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return this.fetchWithErrorHandling<PayablesSummary>('total-payables', params);
    }

    async getAveragePaymentDelay(startDate?: string, endDate?: string): Promise<PaymentDelaySummary> {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return this.fetchWithErrorHandling<PaymentDelaySummary>('average-payment-delay', params);
    }

    async getLatePaymentPercentage(startDate?: string, endDate?: string): Promise<LatePaymentSummary> {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return this.fetchWithErrorHandling<LatePaymentSummary>('late-payment-percent', params);
    }

    async getPurchaseShare(startDate?: string, endDate?: string): Promise<PurchaseShare[]> {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return this.fetchWithErrorHandling<PurchaseShare[]>('purchase-share', params);
    }

    async getVendorPerformance(startDate?: string, endDate?: string): Promise<VendorPerformance[]> {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        return this.fetchWithErrorHandling<VendorPerformance[]>('performance', params);
    }

    async getVendorProfitContributions(): Promise<VendorProfitContribution[]> {
        return this.fetchWithErrorHandling<VendorProfitContribution[]>('vendor-profit');
    }

    async getVendorScore(): Promise<VendorScore[]> {
        return this.fetchWithErrorHandling<VendorScore[]>('vendor-score');
    }
}

export const vendorService = new VendorService();

