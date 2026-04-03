package com.inveflux.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "purchase_window")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseWindow {

    @Id
    @Column(name = "category_name")
    private String categoryName;

    @Column(name = "week_days")
    private String weekDays; // e.g., "MON,WED,FRI"

    @Column(name = "monthly_occurrences")
    private String monthlyOccurrences;

    @Column(name = "notes")
    private String notes;

    // Expected Lead Time is derived from these fields:
    // Simplified as (30 / monthlyOccurrences) for now.
}
