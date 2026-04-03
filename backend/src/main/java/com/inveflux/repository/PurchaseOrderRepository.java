package com.inveflux.repository;

import com.inveflux.model.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

        @Query("SELECT SUM(p.remainingAmount) FROM PurchaseOrder p")
        BigDecimal getTotalPayables();

        @Query("SELECT p.vendor.vendorId, p.vendor.vendorName, SUM(p.totalAmount) FROM PurchaseOrder p " +
                        "GROUP BY p.vendor.vendorId, p.vendor.vendorName")
        List<Object[]> getPurchaseShareByVendor();

        @Query("SELECT SUM(p.totalAmount) FROM PurchaseOrder p ")
        BigDecimal getTotalPurchaseAmount();

        @Query("SELECT p.vendor.vendorId, p.vendor.vendorName, SUM(p.remainingAmount) FROM PurchaseOrder p " +
                        "GROUP BY p.vendor.vendorId, p.vendor.vendorName")
        List<Object[]> getPayablesByVendor();

        // @Query("SELECT SUM(p.totalAmount) FROM PurchaseOrder p WHERE p.orderDate =
        // :startDate")
        // BigDecimal getInventoryValueAtStartDate(@Param("startDate") LocalDate
        // startDate);
}
