package com.inveflux.repository;

import com.inveflux.model.entity.InventoryLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryLedgerRepository extends
                JpaRepository<InventoryLedger, Long> {

        @Query("SELECT SUM(i.quantityIn - i.quantityOut) * i.unitCost FROM InventoryLedger i WHERE i.transactionDate <= :date")

        BigDecimal getInventoryValueAtDate(@Param("date") LocalDate date);

        @Query("SELECT SUM(i.quantityIn - i.quantityOut) FROM InventoryLedger i WHERE i.product.productId = :productId AND i.transactionDate <= :date")

        Integer getStockAtDate(@Param("productId") Long productId, @Param("date") LocalDate date);

        @Query(value = "SELECT CAST(AVG(l.transaction_date - p.order_date) AS DOUBLE PRECISION) " +
                        "FROM inventory_ledger l JOIN purchase_orders p ON l.reference_id = p.purchase_order_id " +
                        "WHERE l.transaction_type = 'PURCHASE' AND p.order_date BETWEEN :startDate AND :endDate", nativeQuery = true)
        Double getAverageLeadTime(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

}
