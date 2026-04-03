package com.inveflux.service;

import com.inveflux.dto.FinancialDTO;
import com.inveflux.repository.SalesHeaderRepository;
import com.inveflux.repository.SalesItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinancialService {

        private final SalesHeaderRepository salesHeaderRepository;
        private final SalesItemRepository salesItemRepository;

        private static final LocalDate DATASET_START_DATE = LocalDate.of(2020, 12, 01);
        private static final LocalDate DATASET_END_DATE = LocalDate.of(2020, 12, 29);

        // Revenue Summary
        public FinancialDTO.RevenueSummary getTotalRevenue(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                BigDecimal revenue = salesHeaderRepository.getTotalRevenueFromView(startDate, endDate);
                Long orders = salesHeaderRepository.getTotalOrdersFromView(startDate, endDate);

                return FinancialDTO.RevenueSummary.builder()
                                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                                .totalOrders(orders != null ? orders.intValue() : 0)
                                .build();
        }

        // COGS
        public FinancialDTO.CogsSummary getTotalCOGS(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                BigDecimal cogs = salesItemRepository.getTotalCOGSFromView(startDate, endDate);
                return FinancialDTO.CogsSummary.builder()
                                .totalCOGS(cogs != null ? cogs : BigDecimal.ZERO)
                                .build();
        }

        // Gross Margin
        public FinancialDTO.GrossMargin getGrossMargin(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                FinancialDTO.RevenueSummary rev = getTotalRevenue(startDate, endDate);
                FinancialDTO.CogsSummary cogs = getTotalCOGS(startDate, endDate);

                BigDecimal margin = rev.getTotalRevenue().subtract(cogs.getTotalCOGS());
                Double marginPercent = rev.getTotalRevenue().compareTo(BigDecimal.ZERO) > 0
                                ? margin.divide(rev.getTotalRevenue(), 4, RoundingMode.HALF_UP)
                                                .multiply(new BigDecimal(100)).doubleValue()
                                : 0.0;

                return FinancialDTO.GrossMargin.builder()
                                .grossMargin(margin)
                                .grossMarginPercentage(marginPercent)
                                .build();
        }

        // Net Profit (same as Gross Margin)
        public FinancialDTO.NetProfit getNetProfit(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                FinancialDTO.GrossMargin gm = getGrossMargin(startDate, endDate);
                return FinancialDTO.NetProfit.builder()
                                .netProfit(gm.getGrossMargin())
                                .build();
        }

        // Average Order Value
        public FinancialDTO.AovSummary getAverageOrderValue(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                FinancialDTO.RevenueSummary rev = getTotalRevenue(startDate, endDate);
                BigDecimal aov = rev.getTotalOrders() > 0
                                ? rev.getTotalRevenue().divide(new BigDecimal(rev.getTotalOrders()), 2,
                                                RoundingMode.HALF_UP)
                                : BigDecimal.ZERO;

                return FinancialDTO.AovSummary.builder()
                                .averageOrderValue(aov)
                                .build();
        }

        // Payment Mix
        public FinancialDTO.PaymentMix getPaymentMix(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                List<Object[]> results = salesHeaderRepository.getPaymentMixFromView(startDate, endDate);
                BigDecimal total = results.stream()
                                .map(r -> (BigDecimal) r[1])
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                double cash = 0.0;
                double digital = 0.0;

                for (Object[] row : results) {
                        String type = (String) row[0];
                        BigDecimal val = (BigDecimal) row[1];
                        double percent = total.compareTo(BigDecimal.ZERO) > 0
                                        ? val.divide(total, 4, RoundingMode.HALF_UP)
                                                        .multiply(new BigDecimal(100)).doubleValue()
                                        : 0.0;

                        if ("CASH".equalsIgnoreCase(type)) {
                                cash = percent;
                        } else {
                                digital += percent;
                        }
                }

                return FinancialDTO.PaymentMix.builder()
                                .cashPercentage(cash)
                                .digitalPercentage(digital)
                                .build();
        }

        // Product Profitability
        public List<FinancialDTO.ProductProfitability> getProductProfitability(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                // extract the month from the date and pass it to the repository
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
                String monthYear = startDate.format(formatter);
                List<Object[]> results = salesItemRepository.getProductProfitabilityFromView(monthYear);
                BigDecimal totalRevenue = results.stream().map(r -> (BigDecimal) r[3]).reduce(BigDecimal.ZERO,
                                BigDecimal::add);

                return results.stream().map(row -> {
                        BigDecimal revenue = (BigDecimal) row[3];
                        BigDecimal cogs = (BigDecimal) row[4];
                        BigDecimal margin = revenue.subtract(cogs);

                        double revContr = totalRevenue.compareTo(BigDecimal.ZERO) > 0
                                        ? revenue.divide(totalRevenue, 4, RoundingMode.HALF_UP)
                                                        .multiply(new BigDecimal(100)).doubleValue()
                                        : 0.0;
                        double marginPercent = revenue.compareTo(BigDecimal.ZERO) > 0
                                        ? margin.divide(revenue, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100))
                                                        .doubleValue()
                                        : 0.0;

                        return FinancialDTO.ProductProfitability.builder()
                                        .productId(((Number) row[0]).longValue())
                                        .productName((String) row[1])
                                        .revenueContribution(revContr)
                                        .grossMarginPercentage(marginPercent)
                                        .revenueValue(revenue)
                                        .build();
                }).collect(Collectors.toList());
        }

        // Revenue Trends
        public List<FinancialDTO.RevenueTrend> getRevenueTrends(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                List<Object[]> results = salesHeaderRepository.getRevenueTrendFromView(startDate, endDate);
                return results.stream()
                                .map(row -> FinancialDTO.RevenueTrend.builder()
                                                .date(((java.sql.Date) row[0]).toString())
                                                .revenue((BigDecimal) row[1])
                                                .build())
                                .collect(Collectors.toList());
        }

        // Top / Bottom Products
        public FinancialDTO.TopBottomRevenue getTopBottomRevenue(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
                String monthYear = startDate.format(formatter);
                List<Object[]> results = salesItemRepository.getProductProfitabilityFromView(monthYear);

                List<FinancialDTO.ProductProfitability> all = results.stream()
                                .map(row -> {
                                        BigDecimal revenue = (BigDecimal) row[3];
                                        BigDecimal cogs = (BigDecimal) row[4];
                                        BigDecimal margin = revenue.subtract(cogs);
                                        double revContr = revenue.compareTo(BigDecimal.ZERO) > 0
                                                        ? revenue.divide(revenue, 4, RoundingMode.HALF_UP)
                                                                        .multiply(new BigDecimal(100)).doubleValue()
                                                        : 0.0;
                                        double marginPercent = revenue.compareTo(BigDecimal.ZERO) > 0
                                                        ? margin.divide(revenue, 4, RoundingMode.HALF_UP)
                                                                        .multiply(new BigDecimal(100)).doubleValue()
                                                        : 0.0;

                                        return FinancialDTO.ProductProfitability.builder()
                                                        .productId(((Number) row[0]).longValue())
                                                        .productName((String) row[1])
                                                        .revenueContribution(revContr)
                                                        .grossMarginPercentage(marginPercent)
                                                        .revenueValue(revenue)
                                                        .build();
                                }).collect(Collectors.toList());

                List<FinancialDTO.ProductProfitability> top5 = all.stream().limit(5).collect(Collectors.toList());
                List<FinancialDTO.ProductProfitability> bottom5 = all.size() > 5
                                ? all.subList(Math.max(0, all.size() - 5), all.size())
                                : all;

                return FinancialDTO.TopBottomRevenue.builder()
                                .topProducts(top5)
                                .bottomProducts(bottom5)
                                .build();
        }

        public List<FinancialDTO.OrderSizeBucket> getOrderDistribution(LocalDate startDate, LocalDate endDate) {
                if (startDate == null) {
                        startDate = DATASET_START_DATE;
                }
                if (endDate == null) {
                        endDate = DATASET_END_DATE;
                }
                List<Object[]> results = salesHeaderRepository.getOrderDistribution(startDate, endDate);
                System.out.println(results.indexOf(0));
                return results.stream()
                                .map(row -> FinancialDTO.OrderSizeBucket.builder()
                                                .range((String) row[0])
                                                .orderCount(((Number) row[1]).intValue())
                                                .build())
                                .toList();
        }
}