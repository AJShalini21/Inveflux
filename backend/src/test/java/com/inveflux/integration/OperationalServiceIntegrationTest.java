package com.inveflux.integration;

import com.inveflux.dto.OperationalDTO;
import com.inveflux.model.entity.Product;
import com.inveflux.model.entity.SalesHeader;
import com.inveflux.model.entity.SalesItem;
import com.inveflux.repository.ProductRepository;
import com.inveflux.repository.SalesItemRepository;
import com.inveflux.service.OperationalService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class OperationalServiceIntegrationTest {

    @Autowired
    private OperationalService operationalService;

    @Autowired
    private SalesItemRepository salesItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void testGetMonthlySalesTrend() {
        // Given: Sample data
        Product product = Product.builder()
                .productName("Test Product")
                .sku("TEST-SKU")
                .category("Test Category")
                .build();
        product = productRepository.save(product);

        SalesItem salesItem = SalesItem.builder()
                .product(product)
                .salesDate(LocalDate.of(2020, 10, 15))
                .sellingPrice(new BigDecimal("100.00"))
                .quantity(2)
                .lineTotal(new BigDecimal("200.00"))
                .build();
        salesItemRepository.save(salesItem);

        // When
        List<OperationalDTO.SalesTrend> trend = operationalService.getMonthlySalesTrend();

        // Then
        assertNotNull(trend);
        // We expect at least the test item if the date range includes 2020-10-15
        boolean found = trend.stream()
                .anyMatch(t -> t.getMonth().equals("2020-10") && t.getTotalRevenue().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(found, "Trend should contain data for 2020-10");
    }
}
