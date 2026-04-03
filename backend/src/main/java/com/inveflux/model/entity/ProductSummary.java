package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_summary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummary {

    @Id
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "total_purchased")
    private Integer totalPurchased;

    @Column(name = "total_sold")
    private Integer totalSold;

    @Column(name = "current_stock")
    private Integer currentStock;

    @Column(name = "usable_stock")
    private Integer usableStock;

    @Column(name = "dead_stock_qty")
    private Integer deadStockQty;

    @Column(name = "inventory_value")
    private BigDecimal inventoryValue;
}
