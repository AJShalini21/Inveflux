package com.inveflux.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class OperationalDTO {

    @Data
    @Builder
    public static class ReorderAlert {
        private Integer productId;
        private String productName;
        private String vendorName;
        private Integer usableStock;
        private Integer reorderLevel;
        private String alertLevel; // RED, YELLOW, GREEN
        private Double avgDailySales;
        private Double stockCoverageDays;
    }

    @Data
    @Builder
    public static class TopProduct {
        private Integer productId;
        private String productName;
        private String category;
        private BigDecimal totalRevenue;
        private Integer totalQuantity;
    }

    @Data
    @Builder
    public static class CategoryPerformance {
        private String category;
        private BigDecimal totalRevenue;
        private Double percentageContribution;
    }

    @Data
    @Builder
    public static class SalesTrend {
        private String month;
        private BigDecimal totalRevenue;
    }

}
