package com.inveflux.controller;

import com.inveflux.dto.VendorDTO;
import com.inveflux.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/insights/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping("/total-payables")
    public VendorDTO.PayablesSummary getTotalPayables() {
        return vendorService.getTotalPayables();
    }

    @GetMapping("/average-payment-delay")
    public VendorDTO.PaymentDelaySummary getAveragePaymentDelay() {
        return vendorService.getAveragePaymentDelay();
    }

    @GetMapping("/late-payment-percent")
    public VendorDTO.LatePaymentSummary getLatePaymentPercentage() {
        return vendorService.getLatePaymentPercentage();
    }

    @GetMapping("/purchase-share")
    public List<VendorDTO.PurchaseShare> getPurchaseShare() {
        return vendorService.getPurchaseShare();
    }

    @GetMapping("/performance")
    public List<VendorDTO.Performance> getVendorPerformance() {
        return vendorService.getVendorPerformance();
    }

    @GetMapping("/vendor-profit")
    public List<VendorDTO.VendorProfitContribution> getVendorProfitContributions() {
        return vendorService.getVendorProfitContribution();
    }

    @GetMapping("/vendor-score")
    public List<VendorDTO.VendorScore> getVendorScore() {
        return vendorService.getTopVendorsByScore();
    }
}
