package com.autoflex.inventory.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "product_seq", allocationSize = 1)
    public Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Product code is required")
    public String code;

    @Column(nullable = false)
    @NotBlank(message = "Product name is required")
    public String name;

    @Column(name = "product_value", nullable = false, precision = 19, scale = 2)
    @NotNull(message = "Product value is required")
    @Positive(message = "Product value must be positive")
    public BigDecimal value;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ProductRawMaterial> rawMaterials;

}

