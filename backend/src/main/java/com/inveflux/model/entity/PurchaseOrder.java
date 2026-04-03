package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrder {

    @Id
    @Column(name = "purchase_order_id")
    private Integer purchaseOrderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount;

    @Column(name = "remaining_amount")
    private BigDecimal remainingAmount;

    @Column(name = "payment_status")
    private String paymentStatus;
}
