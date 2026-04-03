package com.inveflux.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class InventoryDTO {

    @Data
    @Builder
    public static class StockPulse {
        private Summary summary;
        private Map<String, Integer> distribution;
        private List<CategoryContribution> categoryValueContribution;

        @Data
        @Builder
        public static class Summary {
            private BigDecimal totalInventoryValue;
            private Integer totalProducts;
            private Integer healthyStockCount;
            private Integer lowStockCount;
            private Integer outOfStockCount;
            private Integer overstockedCount;
        }

        @Data
        @Builder
        public static class CategoryContribution {
            private String category;
            private BigDecimal inventoryValue;
            private Double percentage;
        }

    }

    @Data
    @Builder
    public static class HealthStatus {
        private Double inventoryTurnover;
        private Double dio;
        private Double deadStockPercentage;
        private Double overstockPercentage;
        private String healthStatus;
        private BigDecimal cashRiskScore;
    }

    @Data
    @Builder
    public static class Velocity {
        private Integer productId;
        private String productName;
        private Double sellThroughRate;
        private Double stockCoverageDays;
        private Double velocityScore;
    }

    @Data
    @Builder
    public static class Trend {
        private String period;
        private Double inventoryTurnover;
        private Double dio;
        private Double velocityScore;
    }

    @Data
    @Builder
    public static class RiskProduct {
        private Integer productId;
        private String productName;
        private String category;
        private BigDecimal inventoryValue;
        private Integer currentStock;
        private String riskType;
    }
}
