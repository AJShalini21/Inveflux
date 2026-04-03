package com.inveflux.repository;

import com.inveflux.model.entity.SalesItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Repository
public interface SalesItemRepository extends JpaRepository<SalesItem, Integer> {

        @Query("SELECT COALESCE(SUM(s.lineTotal), 0)" +
                        "FROM SalesItem s WHERE s.product.productId = :productId AND s.salesDate BETWEEN :startDate AND :endDate")
        BigDecimal getTotalRevenue(Integer productId, LocalDate startDate, LocalDate endDate);

        @Query("SELECT s.product.productId as productId, SUM(s.lineTotal) as totalRevenue, SUM(s.quantity) as totalQuantity "
                        +
                        "FROM SalesItem s WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.product.productId ORDER BY " +
                        "CASE WHEN :metric = 'revenue' THEN SUM(s.lineTotal) ELSE SUM(s.quantity) END DESC")
        List<Object[]> getTopProducts(@Param("metric") String metric, @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT p.category as category, SUM(s.lineTotal) as totalRevenue " +
                        "FROM SalesItem s JOIN s.product p WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY p.category")
        List<Object[]> getCategoryPerformance(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT FUNCTION('TO_CHAR', s.salesDate, 'YYYY-MM') as month, SUM(s.lineTotal) as totalRevenue " +
                        "FROM SalesItem s WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY FUNCTION('TO_CHAR', s.salesDate, 'YYYY-MM')")
        List<Object[]> getMonthlySalesTrend(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT SUM(s.quantity * p.avgUnitCost) FROM SalesItem s " +
                        "JOIN s.product p " +
                        "WHERE s.salesDate BETWEEN :startDate AND :endDate")
        BigDecimal getTotalCOGS(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT s.product.productId, p.productName, SUM(s.lineTotal), " +
                        "SUM(s.quantity * p.avgUnitCost) " +
                        "FROM SalesItem s " +
                        "JOIN s.product p " +
                        "WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.product.productId, p.productName")
        List<Object[]> getProductProfitability(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT s.product.productId, p.productName, SUM(s.lineTotal), " +
                        "SUM(s.quantity * p.avgUnitCost) " +
                        "FROM SalesItem s " +
                        "JOIN s.product p " +
                        "WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.product.productId, p.productName")
        List<Object[]> getTopBottomRevenue(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        @Query("SELECT s.product.productId, SUM(s.quantity), SUM(s.quantity * p.avgUnitCost) " +
                        "FROM SalesItem s " +
                        "JOIN s.product p " +
                        "WHERE s.salesDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY s.product.productId")
        List<Object[]> getVelocityMetrics(@Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        // Total COGS
        @Query(value = """
                                SELECT COALESCE(SUM(cogs),0)
                                FROM vw_sales_summary
                                WHERE sales_date BETWEEN :start AND :end
                        """, nativeQuery = true)
        BigDecimal getTotalCOGSFromView(@Param("start") LocalDate start,
                        @Param("end") LocalDate end);

        // Product Profitability
        @Query(value = """
                                SELECT product_id, product_name, quantity, revenue, cogs
                                FROM vw_product_performance
                                WHERE month = :month
                                ORDER BY revenue DESC
                        """, nativeQuery = true)
        List<Object[]> getProductProfitabilityFromView(@Param("month") String month);

        @Query(value = """
                        SELECT *
                        FROM vw_inventory_monthly_sales
                        ORDER BY period
                        """, nativeQuery = true)
        List<Object[]> getMonthlyTrends();

}
