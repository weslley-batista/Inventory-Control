package com.autoflex.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ProductDTO {

    public Long id;

    @NotBlank(message = "Product code is required")
    public String code;

    @NotBlank(message = "Product name is required")
    public String name;

    @NotNull(message = "Product value is required")
    @Positive(message = "Product value must be positive")
    public BigDecimal value;

    public ProductDTO() {
    }

    public ProductDTO(Long id, String code, String name, BigDecimal value) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.value = value;
    }

}

