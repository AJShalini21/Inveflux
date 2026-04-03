package com.inveflux.controller;

import com.inveflux.dto.FinancialDTO;
import com.inveflux.service.FinancialService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/insights/financial")
@RequiredArgsConstructor
public class FinancialController {

    private final FinancialService financialService;

    @GetMapping("/total-revenue")
    public FinancialDTO.RevenueSummary getTotalRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getTotalRevenue(startDate, endDate);
    }

    @GetMapping("/cogs")
    public FinancialDTO.CogsSummary getTotalCOGS(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getTotalCOGS(startDate, endDate);
    }

    @GetMapping("/gross-margin")
    public FinancialDTO.GrossMargin getGrossMargin(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getGrossMargin(startDate, endDate);
    }

    @GetMapping("/net-profit")
    public FinancialDTO.NetProfit getNetProfit(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getNetProfit(startDate, endDate);
    }

    @GetMapping("/average-order-value")
    public FinancialDTO.AovSummary getAverageOrderValue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getAverageOrderValue(startDate, endDate);
    }

    @GetMapping("/payment-mix")
    public FinancialDTO.PaymentMix getPaymentMix(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getPaymentMix(startDate, endDate);
    }

    @GetMapping("/product-profitability")
    public List<FinancialDTO.ProductProfitability> getProductProfitability(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getProductProfitability(startDate, endDate);
    }

    @GetMapping("/revenue-trends")
    public List<FinancialDTO.RevenueTrend> getRevenueTrends(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getRevenueTrends(startDate, endDate);
    }

    @GetMapping("/top-bottom-revenue")
    public FinancialDTO.TopBottomRevenue getTopBottomRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getTopBottomRevenue(startDate, endDate);
    }

    @GetMapping("/order-size-distribution")
    public List<FinancialDTO.OrderSizeBucket> getOrderSizeBucket(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return financialService.getOrderDistribution(startDate, endDate);
    }
}
