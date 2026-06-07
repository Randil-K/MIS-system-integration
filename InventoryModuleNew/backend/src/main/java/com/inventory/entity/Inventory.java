package com.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Entity
@Table(name = "inventory")
@Data
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    @Column(nullable = false)
    private Long productId;

    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantityOnHand = 0;
    
    @Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel = 10;
}