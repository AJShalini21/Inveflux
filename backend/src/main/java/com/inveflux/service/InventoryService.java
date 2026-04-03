package com.inveflux.service;

import com.inveflux.dto.InventoryDTO;
import com.inveflux.repository.ProductRepository;
import com.inveflux.repository.ProductSummaryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

        private final ProductSummaryRepository productSummaryRepository;
        private final ProductRepository productRepository;

        /*
         * ---------------------------------------------------------
         * STOCK PULSE
         * ---------------------------------------------------------
         */

        public InventoryDTO.StockPulse getStockPulse() {

                BigDecimal totalInventoryValue = productSummaryRepository.getTotalInventoryValue();

                Integer totalProducts = productRepository.getTotalProducts();

                Map<String, Integer> distribution = productSummaryRepository.getStockDistribution()
                                .stream()
                                .collect(Collectors.toMap(
                                                row -> row[0].toString(),
                                                row -> Integer.parseInt(row[1].toString())));

                Integer healthy = distribution.getOrDefault("HEALTHY", 0);
                Integer low = distribution.getOrDefault("LOW_STOCK", 0);
                Integer out = distribution.getOrDefault("OUT_OF_STOCK", 0);
                Integer over = distribution.getOrDefault("OVERSTOCK", 0);

                InventoryDTO.StockPulse.Summary summary = InventoryDTO.StockPulse.Summary.builder()
                                .totalInventoryValue(totalInventoryValue)
                                .totalProducts(totalProducts)
                                .healthyStockCount(healthy)
                                .lowStockCount(low)
                                .outOfStockCount(out)
                                .overstockedCount(over)
                                .build();

                List<Object[]> rows = productSummaryRepository.getCategoryContribution();

                List<InventoryDTO.StockPulse.CategoryContribution> categoryContributions = rows.stream()
                                .map(row -> {

                                        String category = row[0].toString();
                                        BigDecimal inventoryValue = new BigDecimal(row[1].toString());

                                        Double percentage = inventoryValue
                                                        .divide(totalInventoryValue, 4, RoundingMode.HALF_UP)
                                                        .multiply(BigDecimal.valueOf(100))
                                                        .doubleValue();

                                        return InventoryDTO.StockPulse.CategoryContribution.builder()
                                                        .category(category)
                                                        .inventoryValue(inventoryValue)
                                                        .percentage(percentage)
                                                        .build();
                                })
                                .toList();
                return InventoryDTO.StockPulse.builder()
                                .summary(summary)
                                .distribution(distribution)
                                .categoryValueContribution(categoryContributions)
                                .build();
        }

        /*
         * ---------------------------------------------------------
         * HEALTH STATUS (DIO GAUGE)
         * ---------------------------------------------------------
         */

        public InventoryDTO.HealthStatus getDIOHealth() {

                List<Object[]> metrics = productSummaryRepository.getInventoryHealthMetrics();

                BigDecimal totalInventory = (BigDecimal) metrics.get(0)[0];
                BigDecimal overStockValue = (BigDecimal) metrics.get(0)[1];
                BigDecimal deadStockValue = (BigDecimal) metrics.get(0)[2];
                BigDecimal totalCOGS = (BigDecimal) metrics.get(0)[3];

                double deadStockPercentage = deadStockValue.divide(totalInventory, 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100))
                                .doubleValue();

                double overstockPercentage = overStockValue.divide(totalInventory, 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100))
                                .doubleValue();

                BigDecimal averageInventory = (BigDecimal.valueOf(200000000).add(totalInventory))
                                .divide(BigDecimal.valueOf(2));
                BigDecimal inventoryTurnover = totalCOGS.divide(averageInventory, 4, RoundingMode.HALF_UP);
                BigDecimal dio = BigDecimal.valueOf(365).divide(inventoryTurnover, 4, RoundingMode.HALF_UP);
                BigDecimal cashRiskScore = overStockValue.add(deadStockValue);

                String healthStatus = calculateHealthStatus(dio.doubleValue());

                return InventoryDTO.HealthStatus.builder()
                                .inventoryTurnover(inventoryTurnover.doubleValue())
                                .dio(dio.doubleValue())
                                .deadStockPercentage(deadStockPercentage)
                                .overstockPercentage(overstockPercentage)
                                .healthStatus(healthStatus)
                                .cashRiskScore(cashRiskScore)
                                .build();
        }

        private String calculateHealthStatus(double dio) {

                if (dio < 60) {
                        return "GREEN";
                } else if (dio <= 90) {
                        return "YELLOW";
                } else {
                        return "RED";
                }
        }

        /*
         * ---------------------------------------------------------
         * PRODUCT VELOCITY
         * ---------------------------------------------------------
         */

        public List<InventoryDTO.Velocity> getVelocity() {

                List<Object[]> productVelocity = productSummaryRepository.getProductVelocity();

                return productVelocity.stream()
                                .map(v -> {

                                        int productId = ((Number) v[0]).intValue();
                                        String productName = (String) v[1];

                                        double totalSold = v[2] != null ? ((Number) v[2]).doubleValue() : 0.0;
                                        double currentStock = v[3] != null ? ((Number) v[3]).doubleValue() : 0.0;
                                        double totalRevenue = v[4] != null ? ((Number) v[4]).doubleValue() : 0.0;

                                        double avgDailySales = totalRevenue / 365;
                                        double stockCoverageDays = avgDailySales > 0
                                                        ? (double) currentStock / avgDailySales
                                                        : 0.0;
                                        double turnover = currentStock > 0 ? totalSold / currentStock : 0.0;
                                        double sellThroughRate = (totalSold + currentStock) > 0
                                                        ? totalSold / (totalSold + currentStock)
                                                        : 0.0;

                                        return InventoryDTO.Velocity.builder()
                                                        .productId(productId)
                                                        .productName(productName)
                                                        .sellThroughRate(sellThroughRate)
                                                        .stockCoverageDays(stockCoverageDays)
                                                        .velocityScore(calculateVelocityScore(turnover))
                                                        .build();
                                })
                                .toList();
        }

        private double calculateVelocityScore(double turnover) {

                if (turnover >= 8)
                        return 5;
                if (turnover >= 5)
                        return 4;
                if (turnover >= 3)
                        return 3;
                if (turnover >= 1)
                        return 2;
                return 1;
        }

        /*
         * ---------------------------------------------------------
         * RISK PRODUCTS
         * ---------------------------------------------------------
         */

        public List<InventoryDTO.RiskProduct> getRiskProducts() {

                return productSummaryRepository.getRiskProducts()
                                .stream()
                                .map(p -> InventoryDTO.RiskProduct.builder()
                                                .productId((Integer) p[0])
                                                .productName((String) p[1])
                                                .category((String) p[2])
                                                .currentStock((Integer) p[3])
                                                .inventoryValue((BigDecimal) p[4])
                                                .riskType((String) p[5])
                                                .build())
                                .toList();
        }

}