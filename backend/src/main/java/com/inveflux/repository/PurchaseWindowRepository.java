package com.inveflux.repository;

import com.inveflux.model.entity.PurchaseWindow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseWindowRepository extends JpaRepository<PurchaseWindow, String> {

    @Query("SELECT DISTINCT pw FROM PurchaseWindow pw " +
            "WHERE pw.categoryName IN (SELECT DISTINCT p.category FROM Product p WHERE p.vendor.vendorId = :vendorId)")
    List<PurchaseWindow> findByVendorId(@Param("vendorId") Integer vendorId);
}
