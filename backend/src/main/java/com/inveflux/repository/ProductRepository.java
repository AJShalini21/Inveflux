package com.inveflux.repository;

import com.inveflux.model.entity.Product;
import com.inveflux.model.entity.ProductSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByVendor_VendorId(Integer vendorId);

    @Query(value = "SELECT COUNT(*) FROM products", nativeQuery = true)
    Integer getTotalProducts();
}
