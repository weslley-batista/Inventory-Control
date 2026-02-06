package com.autoflex.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "product_raw_materials", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "raw_material_id"}))
public class ProductRawMaterial extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_raw_material_seq")
    @SequenceGenerator(name = "product_raw_material_seq", sequenceName = "product_raw_material_seq", allocationSize = 1)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @NotNull(message = "Product is required")
    public Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    @NotNull(message = "Raw material is required")
    public RawMaterial rawMaterial;

    @Column(name = "required_quantity", nullable = false)
    @NotNull(message = "Required quantity is required")
    @Positive(message = "Required quantity must be positive")
    public Integer requiredQuantity;

}

