package com.autoflex.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.util.List;

@Entity
@Table(name = "raw_materials")
public class RawMaterial extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "raw_material_seq")
    @SequenceGenerator(name = "raw_material_seq", sequenceName = "raw_material_seq", allocationSize = 1)
    public Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Raw material code is required")
    public String code;

    @Column(nullable = false)
    @NotBlank(message = "Raw material name is required")
    public String name;

    @Column(name = "stock_quantity", nullable = false)
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    public Integer stockQuantity;

    @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ProductRawMaterial> products;

}

