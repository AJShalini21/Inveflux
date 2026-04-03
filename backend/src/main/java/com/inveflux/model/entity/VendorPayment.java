package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "vendor_payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorPayment {

    @Id
    @Column(name = "payment_id")
    private Integer paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_total")
    private BigDecimal paymentTotal;

    @Column(name = "payment_type")
    private String paymentType;
}
