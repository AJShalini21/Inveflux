package com.inveflux.controller;

import com.inveflux.dto.InventoryDTO;
import com.inveflux.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/insights/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/stock-pulse")
    public InventoryDTO.StockPulse getStockPulse() {
        return inventoryService.getStockPulse();
    }

    @GetMapping("/dio-health")
    public InventoryDTO.HealthStatus getDIOHealth() {
        return inventoryService.getDIOHealth();
    }

    @GetMapping("/velocity")
    public List<InventoryDTO.Velocity> getInventoryVelocity() {
        return inventoryService.getVelocity();
    }

    @GetMapping("/risk-products")
    public List<InventoryDTO.RiskProduct> getRiskProducts() {
        return inventoryService.getRiskProducts();
    }
}
