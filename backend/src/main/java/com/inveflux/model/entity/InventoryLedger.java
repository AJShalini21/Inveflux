package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryLedger {

    @Id
    @Column(name = "ledger_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "reference_id")
    private Integer referenceId;

    @Column(name = "quantity_in")
    private Integer quantityIn;

    @Column(name = "quantity_out")
    private Integer quantityOut;

    @Column(name = "unit_cost")
    private BigDecimal unitCost;

    @Column(name = "transaction_date")
    private LocalDate transactionDate;
}
