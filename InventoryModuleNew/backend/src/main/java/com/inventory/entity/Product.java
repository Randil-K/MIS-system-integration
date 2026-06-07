package com.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @NotBlank(message = "Product name required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "SKU is required")
    @Column(unique = true)
    private String sku;

    private String category;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private Double unitPrice;

    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String image;
}