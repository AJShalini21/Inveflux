package com.inveflux.service;

import com.inveflux.dto.OperationalDTO;
import com.inveflux.model.entity.Product;
import com.inveflux.model.entity.ProductSummary;
import com.inveflux.model.entity.ReorderLevel;
import com.inveflux.repository.ProductRepository;
import com.inveflux.repository.ProductSummaryRepository;
import com.inveflux.repository.ReorderLevelRepository;
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
public class OperationalService {

    private final ProductRepository productRepository;
    private final ProductSummaryRepository productSummaryRepository;
    private final ReorderLevelRepository reorderLevelRepository;
    private final SalesItemRepository salesItemRepository;

    private static final LocalDate DATASET_END_DATE = LocalDate.of(2020, 12, 29);
    private static final LocalDate DATASET_START_DATE = LocalDate.of(2020, 1, 1);

    public List<OperationalDTO.ReorderAlert> getReorderAlerts(Integer vendorId) {
        List<Product> products = vendorId != null
                ? productRepository.findByVendor_VendorId(vendorId)
                : productRepository.findAll();

        return products.stream().map(this::mapToReorderAlert)
                .filter(alert -> alert != null)
                .collect(Collectors.toList());
    }

    public OperationalDTO.ReorderAlert getReorderAlertByProduct(Integer productId) {
        Product product = productRepository.findById(productId).orElse(null);
        return product != null ? mapToReorderAlert(product) : null;
    }

    private OperationalDTO.ReorderAlert mapToReorderAlert(Product product) {
        ProductSummary summary = productSummaryRepository.findById(product.getProductId()).orElse(null);
        ReorderLevel reorder = reorderLevelRepository.findById(product.getProductId()).orElse(null);

        if (summary == null || reorder == null)
            return null;

        int usableStock = summary.getUsableStock() != null ? summary.getUsableStock() : 0;
        int reorderLevel = reorder.getReorderLevel() != null ? reorder.getReorderLevel() : 0;

        BigDecimal totalRevenue = salesItemRepository.getTotalRevenue(product.getProductId(), DATASET_START_DATE,
                DATASET_END_DATE);

        double avgDailySales = totalRevenue != null
                ? totalRevenue.divide(new BigDecimal(365), 4, RoundingMode.HALF_UP).doubleValue()
                : 0.0;

        String alertLevel = "GREEN";
        if (usableStock <= reorderLevel) {
            alertLevel = "RED";
        } else if (usableStock <= reorderLevel * 1.2) {
            alertLevel = "YELLOW";
        } else if (usableStock >= reorderLevel * 2.0) {
            alertLevel = "BLUE";
        }

        double stockCoverageDays = avgDailySales > 0 ? (double) usableStock / avgDailySales : 0.0;

        return OperationalDTO.ReorderAlert.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .vendorName(product.getVendor() != null ? product.getVendor().getVendorName() : "Unknown")
                .usableStock(usableStock)
                .reorderLevel(reorderLevel)
                .alertLevel(alertLevel)
                .avgDailySales(avgDailySales)
                .stockCoverageDays(stockCoverageDays)
                .build();
    }

    public List<OperationalDTO.TopProduct> getTopProducts(String metric) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        String monthYear = DATASET_END_DATE.format(formatter);
        List<Object[]> results = salesItemRepository.getProductProfitabilityFromView(monthYear);

        return results.stream().limit(10).map(row -> {
            Integer productId = (Integer) row[0];
            Product product = productRepository.findById(productId).orElse(null);
            return OperationalDTO.TopProduct.builder()
                    .productId(productId)
                    .productName(product != null ? product.getProductName() : "Unknown")
                    .category(product != null ? product.getCategory() : "Unknown")
                    .totalRevenue((BigDecimal) row[3])
                    .totalQuantity(((Long) row[2]).intValue())
                    .build();
        }).collect(Collectors.toList());
    }

    public List<OperationalDTO.CategoryPerformance> getCategoryPerformance() {
        List<Object[]> results = salesItemRepository.getCategoryPerformance(DATASET_START_DATE, DATASET_END_DATE);
        BigDecimal totalRevenueOverall = results.stream()
                .map(row -> (BigDecimal) row[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return results.stream().map(row -> {
            BigDecimal revenue = (BigDecimal) row[1];
            double percentage = totalRevenueOverall.compareTo(BigDecimal.ZERO) > 0 ? revenue
                    .divide(totalRevenueOverall, 4, RoundingMode.HALF_UP).multiply(new BigDecimal(100)).doubleValue()
                    : 0.0;
            return OperationalDTO.CategoryPerformance.builder()
                    .category((String) row[0])
                    .totalRevenue(revenue)
                    .percentageContribution(percentage)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<OperationalDTO.SalesTrend> getMonthlySalesTrend() {
        List<Object[]> results = salesItemRepository.getMonthlySalesTrend(DATASET_END_DATE.minusYears(1),
                DATASET_END_DATE);
        return results.stream().map(row -> OperationalDTO.SalesTrend.builder()
                .month((String) row[0])
                .totalRevenue((BigDecimal) row[1])
                .build()).collect(Collectors.toList());
    }

    public List<OperationalDTO.ReorderAlert> getOperationalDetails(Integer vendorId, String alertLevel) {
        // Similar to reorder alerts but with more filtering
        return getReorderAlerts(vendorId).stream()
                .filter(a -> alertLevel == null || a.getAlertLevel().equalsIgnoreCase(alertLevel))
                .collect(Collectors.toList());
    }
}
