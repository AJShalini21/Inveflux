package com.inveflux.repository;

import com.inveflux.model.entity.CategoryMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryMasterRepository extends JpaRepository<CategoryMaster, String> {
}
