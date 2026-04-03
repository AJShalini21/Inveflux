package com.inveflux.repository;

import com.inveflux.model.entity.SalesHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesHeaderRepository extends JpaRepository<SalesHeader, Integer> {

        // SalesHeaderRepository.java
        @Query(value = """
                        SELECT SUM(v.revenue) FROM vw_sales_summary v
                        WHERE v.sales_date BETWEEN :start AND :end
                        """, nativeQuery = true)
        BigDecimal getTotalRevenueFromView(@Param("start") LocalDate start, @Param("end") LocalDate end);

        @Query(value = """
                        SELECT COUNT(v.sales_id) FROM vw_sales_summary v
                        WHERE v.sales_date BETWEEN :start AND :end
                        """, nativeQuery = true)
        Long getTotalOrdersFromView(@Param("start") LocalDate start, @Param("end") LocalDate end);

        // Similar queries for getPaymentMixFromView(), getRevenueTrendFromView()
        // Revenue Trend (Daily) // date cast issue from sql date to java date
        @Query(value = """
                        SELECT sales_date, revenue FROM vw_revenue_trends_daily
                        WHERE sales_date BETWEEN :start AND :end
                        ORDER BY sales_date
                        """, nativeQuery = true)
        List<Object[]> getRevenueTrendFromView(@Param("start") LocalDate start, @Param("end") LocalDate end);

        // Payment Mix
        @Query(value = """
                        SELECT payment_type, SUM(total_amount) FROM vw_payment_mix
                        WHERE sales_date BETWEEN :start AND :end
                        GROUP BY payment_type
                        """, nativeQuery = true)
        List<Object[]> getPaymentMixFromView(@Param("start") LocalDate start, @Param("end") LocalDate end);

        @Query(value = """
                        SELECT
                                CASE
                                WHEN total_amount < 50 THEN '0-50'
                                WHEN total_amount < 100 THEN '50-100'
                                WHEN total_amount < 200 THEN '100-200'
                                WHEN total_amount < 500 THEN '200-500'
                                ELSE '500+'
                                END AS range,
                                COUNT(*) AS orderCount
                        FROM sales_header
                        WHERE sales_date BETWEEN :startDate AND :endDate
                        GROUP BY range
                        ORDER BY range
                        """, nativeQuery = true)
        List<Object[]> getOrderDistribution(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT SUM(s.totalAmount) FROM SalesHeader s WHERE s.salesDate BETWEEN :startDate AND :endDate")
        BigDecimal getTotalRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

        @Query("SELECT COUNT(s.salesId) FROM SalesHeader s WHERE s.salesDate BETWEEN :startDate AND :endDate")
        Long getTotalOrders(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

        @Query("SELECT s.paymentType, SUM(s.totalAmount) FROM SalesHeader s " +
                        "WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.paymentType")
        List<Object[]> getPaymentMix(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

        @Query("SELECT s.salesDate, SUM(s.totalAmount) FROM SalesHeader s " +
                        "WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.salesDate ORDER BY s.salesDate")
        List<Object[]> getRevenueTrend(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
