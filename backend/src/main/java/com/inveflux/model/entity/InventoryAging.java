package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_aging")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryAging {

    @Id
    @Column(name = "inventory_aging_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @Column(name = "buying_price")
    private BigDecimal buyingPrice;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "quantity_in")
    private Integer quantityIn;

    @Column(name = "remaining_qty")
    private Integer remainingQty;

    @Column(name = "stock_age_days")
    private Integer stockAgeDays;

    @Column(name = "is_dead_stock")
    private Boolean isDeadStock;
}
