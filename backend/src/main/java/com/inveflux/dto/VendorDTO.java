package com.inveflux.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class VendorDTO {

    @Data
    @Builder
    public static class Performance {
        private Integer vendorId;
        private String vendorName;
        private BigDecimal totalPayables;
        private Double avgPaymentDelay;
        private Double latePaymentPercentage;
        private String status; // RED, YELLOW, GREEN
    }

    @Data
    @Builder
    public static class PurchaseShare {
        private Integer vendorId;
        private String vendorName;
        private BigDecimal purchaseAmount;
        private Double percentageOfTotal;
    }

    @Data
    @Builder
    public static class PayablesSummary {
        private BigDecimal totalPayables;
    }

    @Data
    @Builder
    public static class PaymentDelaySummary {
        private Double averageDelayDays;
    }

    @Data
    @Builder
    public static class LatePaymentSummary {
        private Double latePaymentPercentage;
    }

    @Data
    @Builder
    public static class VendorProfitContribution {

        private Integer vendorId;
        private String vendorName;
        private BigDecimal totalProfit;
        private BigDecimal totalRevenue;
        private Integer totalQuantity;

    }

    @Data
    @Builder
    public static class VendorScore {

        private Integer vendorId;
        private String vendorName;
        private BigDecimal totalProfit;
        private Integer productCount;
        private double vendorScore;

    }

}
