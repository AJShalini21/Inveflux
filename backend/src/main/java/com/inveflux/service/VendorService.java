package com.inveflux.service;

import com.inveflux.dto.VendorDTO;
import com.inveflux.model.entity.PurchaseWindow;
import com.inveflux.repository.InventoryLedgerRepository;
import com.inveflux.repository.PurchaseOrderPaymentRepository;
import com.inveflux.repository.PurchaseOrderRepository;
import com.inveflux.repository.PurchaseWindowRepository;
import com.inveflux.repository.VendorRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderPaymentRepository purchaseOrderPaymentRepository;
    private final InventoryLedgerRepository inventoryLedgerRepository;
    private final VendorRepository vendorRepository;
    private final PurchaseWindowRepository purchaseWindowRepository;

    // private static final LocalDate DATASET_END_DATE = LocalDate.of(2020, 12, 29);

    // private LocalDate[] resolveDates(LocalDate startDate, LocalDate endDate) {
    // if (startDate == null)
    // startDate = DATASET_END_DATE.minusYears(1);
    // if (endDate == null)
    // endDate = DATASET_END_DATE;
    // return new LocalDate[] { startDate, endDate };
    // }

    public VendorDTO.PayablesSummary getTotalPayables() {
        BigDecimal payables = purchaseOrderRepository.getTotalPayables();
        return VendorDTO.PayablesSummary.builder()
                .totalPayables(payables != null ? payables : BigDecimal.ZERO)
                .build();
    }

    public VendorDTO.PaymentDelaySummary getAveragePaymentDelay() {
        // LocalDate[] dates = resolveDates(startDate, endDate);
        // startDate = dates[0];
        // endDate = dates[1];

        Double delay = purchaseOrderPaymentRepository.getAveragePaymentDelay();
        return VendorDTO.PaymentDelaySummary.builder()
                .averageDelayDays(delay != null ? delay : 0.0)
                .build();
    }

    public VendorDTO.LatePaymentSummary getLatePaymentPercentage() {
        // LocalDate[] dates = resolveDates(startDate, endDate);
        // startDate = dates[0];
        // endDate = dates[1];

        Long total = purchaseOrderPaymentRepository.countTotalPayments();
        Long late = purchaseOrderPaymentRepository.countLatePayments();

        double percent = (total != null && total > 0) ? (late.doubleValue() /
                total.doubleValue()) * 100.0 : 0.0;
        return VendorDTO.LatePaymentSummary.builder()
                .latePaymentPercentage(percent)
                .build();
    }

    public List<VendorDTO.PurchaseShare> getPurchaseShare() {
        // LocalDate[] dates = resolveDates(startDate, endDate);
        // startDate = dates[0];
        // endDate = dates[1];

        BigDecimal totalAmount = purchaseOrderRepository.getTotalPurchaseAmount();
        List<Object[]> results = purchaseOrderRepository.getPurchaseShareByVendor();

        return results.stream().map(row -> {
            BigDecimal amount = (BigDecimal) row[2];
            double percent = (totalAmount != null &&
                    totalAmount.compareTo(BigDecimal.ZERO) > 0)
                            ? amount.divide(totalAmount, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100))
                                    .doubleValue()
                            : 0.0;

            return VendorDTO.PurchaseShare.builder()
                    .vendorId(((Number) row[0]).intValue())
                    .vendorName((String) row[1])
                    .purchaseAmount(amount)
                    .percentageOfTotal(percent)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<VendorDTO.Performance> getVendorPerformance() {
        // LocalDate[] dates = resolveDates(startDate, endDate);
        // startDate = dates[0];
        // endDate = dates[1];

        // Simplified: merging data from multiple queries
        List<Object[]> payables = purchaseOrderRepository.getPayablesByVendor();
        List<Object[]> performance = purchaseOrderPaymentRepository.getPaymentPerformanceByVendor();
        // List<Object[]> leadTimes =
        // inventoryLedgerRepository.getAverageLeadTimeByVendor(startDate, endDate);

        return payables.stream().map(pRow -> {
            Integer vId = ((Number) pRow[0]).intValue();
            String vName = (String) pRow[1];
            BigDecimal payable = (BigDecimal) pRow[2];

            Object[] perf = performance.stream().filter(r -> r[0].toString().equals(vId.toString())).findFirst()
                    .orElse(new Object[] { vId, 0.0, 0.0 });
            // Object[] lead = leadTimes.stream().filter(r ->
            // r[0].toString().equals(vId.toString())).findFirst()
            // .orElse(new Object[] { vId, 0.0 });

            double delay = (perf != null && perf[1] != null) ? ((Number) perf[1]).doubleValue() : 0.0;
            double latePercent = (perf != null && perf[2] != null) ? ((Number) perf[2]).doubleValue() : 0.0;
            // double leadVar = (lead != null && lead[1] != null) ? ((Number)
            // lead[1]).doubleValue() : 0.0;

            String status = "GREEN";
            if (latePercent > 30 || delay > 15)
                status = "RED";
            else if (latePercent > 10 || delay > 5)
                status = "YELLOW";

            return VendorDTO.Performance.builder()
                    .vendorId(vId)
                    .vendorName(vName)
                    .totalPayables(payable)
                    .avgPaymentDelay(delay)
                    .latePaymentPercentage(latePercent)
                    .status(status)
                    .build();
        }).collect(Collectors.toList());

    }

    public List<VendorDTO.VendorProfitContribution> getVendorProfitContribution() {

        List<Object[]> results = vendorRepository.getVendorProfitContribution();

        return results.stream().map(row -> VendorDTO.VendorProfitContribution.builder()
                .vendorId(((Number) row[0]).intValue())
                .vendorName((String) row[1])
                .totalProfit((BigDecimal) row[2])
                .totalRevenue((BigDecimal) row[3])
                .totalQuantity(((Number) row[4]).intValue())
                .build()).toList();
    }

    public List<VendorDTO.VendorScore> getTopVendorsByScore() {

        List<Object[]> results = vendorRepository.getVendorProfitContribution();

        return results.stream()
                .map(row -> {

                    Integer vendorId = ((Number) row[0]).intValue();
                    String vendorName = (String) row[1];
                    BigDecimal profit = (BigDecimal) row[2];
                    Integer productCount = ((Number) row[5]).intValue();

                    double score = profit.doubleValue() * Math.log(1 + productCount);

                    return VendorDTO.VendorScore.builder()
                            .vendorId(vendorId)
                            .vendorName(vendorName)
                            .totalProfit(profit)
                            .productCount(productCount)
                            .vendorScore(score)
                            .build();
                })
                .sorted((a, b) -> Double.compare(b.getVendorScore(), a.getVendorScore()))
                .toList();
    }

}
