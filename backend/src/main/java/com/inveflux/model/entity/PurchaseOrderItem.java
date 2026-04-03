package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderItem {

    @Id
    @Column(name = "purchase_order_item_id")
    private Integer purchaseOrderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "quantity_ordered")
    private Integer quantityOrdered;

    @Column(name = "buying_price")
    private BigDecimal buyingPrice;

    @Column(name = "line_total")
    private BigDecimal lineTotal;
}
