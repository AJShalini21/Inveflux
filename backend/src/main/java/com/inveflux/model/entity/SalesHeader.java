package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sales_header")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesHeader {

    @Id
    @Column(name = "sales_id")
    private Integer salesId;

    @Column(name = "sales_date")
    private LocalDate salesDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "payment_type")
    private String paymentType;
}
