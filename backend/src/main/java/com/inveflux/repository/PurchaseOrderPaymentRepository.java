package com.inveflux.repository;

import com.inveflux.model.entity.PurchaseOrderPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseOrderPaymentRepository extends
                JpaRepository<PurchaseOrderPayment, Integer> {

        @Query(value = "SELECT CAST(AVG(p.payment_date - p.due_date) AS DOUBLE PRECISION) FROM purchase_order_payment p ", nativeQuery = true)
        Double getAveragePaymentDelay();

        @Query("SELECT COUNT(p) FROM PurchaseOrderPayment p "
                        + "WHERE p.paymentDate IS NOT NULL AND p.paymentDate > p.dueDate ")
        Long countLatePayments();

        @Query("SELECT COUNT(p) FROM PurchaseOrderPayment p ")
        Long countTotalPayments();

        @Query(value = "SELECT p.vendor_id, AVG(p.payment_date - p.due_date), " +
                        "COUNT(CASE WHEN p.payment_date > p.due_date THEN 1 END) * 100.0 / COUNT(p.purchase_order_id) "
                        +
                        "FROM purchase_order_payment p " +
                        "GROUP BY p.vendor_id", nativeQuery = true)
        List<Object[]> getPaymentPerformanceByVendor();
}
