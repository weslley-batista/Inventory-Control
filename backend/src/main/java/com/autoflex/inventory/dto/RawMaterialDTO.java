package com.autoflex.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RawMaterialDTO {

    public Long id;

    @NotBlank(message = "Raw material code is required")
    public String code;

    @NotBlank(message = "Raw material name is required")
    public String name;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    public Integer stockQuantity;

    public RawMaterialDTO() {
    }

    public RawMaterialDTO(Long id, String code, String name, Integer stockQuantity) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.stockQuantity = stockQuantity;
    }

}

