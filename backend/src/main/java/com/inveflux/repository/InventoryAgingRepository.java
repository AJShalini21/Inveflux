package com.inveflux.repository;

import com.inveflux.model.entity.InventoryAging;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryAgingRepository extends JpaRepository<InventoryAging, Integer> {
}
