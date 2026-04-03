package com.inveflux.controller;

import com.inveflux.dto.OperationalDTO;
import com.inveflux.service.OperationalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/insights/operational")
@RequiredArgsConstructor
public class OperationalController {

    private final OperationalService operationalService;

    @GetMapping("/reorder-alerts")
    public List<OperationalDTO.ReorderAlert> getReorderAlerts(
            @RequestParam(required = false) Integer vendorId) {
        return operationalService.getReorderAlerts(vendorId);
    }

    @GetMapping("/reorder-alerts/{productId}")
    public OperationalDTO.ReorderAlert getReorderAlertByProduct(@PathVariable Integer productId) {
        return operationalService.getReorderAlertByProduct(productId);
    }

    @GetMapping("/top-products")
    public List<OperationalDTO.TopProduct> getTopProducts(
            @RequestParam(defaultValue = "revenue") String metric) {
        return operationalService.getTopProducts(metric);
    }

    @GetMapping("/category-performance")
    public List<OperationalDTO.CategoryPerformance> getCategoryPerformance() {
        return operationalService.getCategoryPerformance();
    }

    @GetMapping("/monthly-sales-trend")
    public List<OperationalDTO.SalesTrend> getMonthlySalesTrend() {
        return operationalService.getMonthlySalesTrend();
    }

    @GetMapping("/details")
    public List<OperationalDTO.ReorderAlert> getOperationalDetails(
            @RequestParam(required = false) Integer vendorId,
            @RequestParam(required = false) String alertLevel) {
        return operationalService.getOperationalDetails(vendorId, alertLevel);
    }
}
