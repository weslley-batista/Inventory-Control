package com.autoflex.inventory.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProductRawMaterialDTO {

    public Long id;

    public Long productId;

    public String productName;

    @NotNull(message = "Raw material ID is required")
    public Long rawMaterialId;

    public String rawMaterialName;

    @NotNull(message = "Required quantity is required")
    @Positive(message = "Required quantity must be positive")
    public Integer requiredQuantity;

    public ProductRawMaterialDTO() {
    }

    public ProductRawMaterialDTO(Long id, Long productId, String productName, 
                                 Long rawMaterialId, String rawMaterialName, 
                                 Integer requiredQuantity) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.rawMaterialId = rawMaterialId;
        this.rawMaterialName = rawMaterialName;
        this.requiredQuantity = requiredQuantity;
    }

}

