package com.inveflux.repository;

import com.inveflux.model.entity.ProductSummary;
// import com.inveflux.service.InventoryService.ProductRiskProjection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductSummaryRepository extends JpaRepository<ProductSummary, Integer> {

    @Query("SELECT SUM(ps.inventoryValue) FROM ProductSummary ps")
    BigDecimal getTotalInventoryValue();

    @Query("SELECT ps.productId, ps.currentStock, p.avgUnitCost " +
            "FROM ProductSummary ps join Product p on p.productId = ps.productId")
    List<Object[]> getProductInventoryDetails();

    @Query("""
            SELECT
            p.productId AS productId,
            p.productName AS productName,
            ps.currentStock AS currentStock,
            ps.usableStock AS usableStock,
            rl.reorderLevel AS reorderLevel,
            p.avgUnitCost AS avgUnitCost
            FROM ProductSummary ps
            JOIN Product p ON ps.productId = p.productId
            LEFT JOIN ReorderLevel rl ON p.productId = rl.productId
            """)
    List<ProductRiskProjection> getProductRiskData();

    @Query(value = """
            SELECT *
            FROM vw_inventory_health_metrics
            """, nativeQuery = true)
    List<Object[]> getInventoryHealthMetrics();

    @Query(value = """
            SELECT stock_status, COUNT(*) as count
            FROM vw_inventory_stock_status
            GROUP BY stock_status
            """, nativeQuery = true)
    List<Object[]> getStockDistribution();

    @Query(value = """
            SELECT category, inventory_value
            FROM vw_inventory_category_value
            """, nativeQuery = true)
    List<Object[]> getCategoryContribution();

    @Query(value = """
            SELECT *
            FROM vw_product_velocity
            """, nativeQuery = true)
    List<Object[]> getProductVelocity();

    @Query(value = """
            SELECT *
            FROM vw_inventory_risk_products
            """, nativeQuery = true)
    List<Object[]> getRiskProducts();

    public interface ProductRiskProjection {

        Long getProductId();

        String getProductName();

        Integer getCurrentStock();

        Integer getUsableStock();

        Integer getReorderLevel();

        BigDecimal getAvgUnitCost();

    }
}
