package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sales_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesItem {

    @Id
    @Column(name = "sales_item_id")
    private Integer salesItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_id")
    private SalesHeader salesHeader;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "sales_date")
    private LocalDate salesDate;

    @Column(name = "selling_price")
    private BigDecimal sellingPrice;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "line_total")
    private BigDecimal lineTotal;
}
