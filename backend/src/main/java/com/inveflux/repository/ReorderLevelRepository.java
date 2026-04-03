package com.inveflux.repository;

import com.inveflux.model.entity.ReorderLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReorderLevelRepository extends JpaRepository<ReorderLevel, Integer> {
}
