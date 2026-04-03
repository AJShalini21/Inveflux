package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @Column(name = "vendor_id")
    private Integer vendorId;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

    @Column(name = "address")
    private String address;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "email")
    private String email;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "payment_terms")
    private String paymentTerms;
}
