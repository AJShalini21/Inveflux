package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reorder_level")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReorderLevel {

    @Id
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "safety_stock")
    private Integer safety_stock;
}
