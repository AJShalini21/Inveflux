package com.inveflux.repository;

import com.inveflux.model.entity.VendorPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorPaymentRepository extends JpaRepository<VendorPayment, Integer> {
}
