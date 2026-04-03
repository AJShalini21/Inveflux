package com.inveflux.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;

@Data
@Builder
public class FinancialDTO {

    @Data
    @Builder
    public static class RevenueSummary {
        private BigDecimal totalRevenue;
        private Integer totalOrders;
    }

    @Data
    @Builder
    public static class CogsSummary {
        private BigDecimal totalCOGS;
    }

    @Data
    @Builder
    public static class GrossMargin {
        private BigDecimal grossMargin;
        private Double grossMarginPercentage;
    }

    @Data
    @Builder
    public static class NetProfit {
        private BigDecimal netProfit;
    }

    @Data
    @Builder
    public static class AovSummary {
        private BigDecimal averageOrderValue;
    }

    @Data
    @Builder
    public static class PaymentMix {
        private Double cashPercentage;
        private Double digitalPercentage;
    }

    @Data
    @Builder
    public static class ProductProfitability {
        private Long productId;
        private String productName;
        private Double revenueContribution;
        private Double grossMarginPercentage;
        private BigDecimal revenueValue;
    }

    @Data
    @Builder
    public static class OrderSizeBucket {
        private String range;
        private Integer orderCount;
    }

    @Data
    @Builder
    public static class RevenueTrend {
        private String date;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    public static class ProfitabilityResponse {
        private List<ProductProfitability> data;
    }

    @Data
    @Builder
    public static class TopBottomRevenue {
        private List<ProductProfitability> topProducts;
        private List<ProductProfitability> bottomProducts;
    }
}
