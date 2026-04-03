package com.inveflux.repository;

import com.inveflux.model.entity.Vendor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Integer> {

    @Query(value = """
            SELECT
                vendor_id,
                vendor_name,
                total_profit,
                total_revenue,
                total_quantity,
                product_count
            FROM vw_vendor_profit_contribution
            ORDER BY total_profit DESC
            """, nativeQuery = true)
    List<Object[]> getVendorProfitContribution();

}
