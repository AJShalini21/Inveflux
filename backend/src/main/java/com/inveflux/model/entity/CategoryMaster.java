package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryMaster {

    @Id
    @Column(name = "category_name")
    private String categoryName;

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    @Column(name = "dead_stock_threshold_days")
    private Integer deadStockThresholdDays;
}
