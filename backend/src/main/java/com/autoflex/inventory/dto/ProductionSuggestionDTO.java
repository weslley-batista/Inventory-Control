package com.autoflex.inventory.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductionSuggestionDTO {

    public List<ProductProductionDTO> products;
    public BigDecimal totalValue;

    public ProductionSuggestionDTO() {
    }

    public ProductionSuggestionDTO(List<ProductProductionDTO> products, BigDecimal totalValue) {
        this.products = products;
        this.totalValue = totalValue;
    }

    public static class ProductProductionDTO {
        public Long productId;
        public String productCode;
        public String productName;
        public BigDecimal productValue;
        public Integer producibleQuantity;
        public BigDecimal totalValue;

        public ProductProductionDTO() {
        }

        public ProductProductionDTO(Long productId, String productCode, String productName,
                                   BigDecimal productValue, Integer producibleQuantity,
                                   BigDecimal totalValue) {
            this.productId = productId;
            this.productCode = productCode;
            this.productName = productName;
            this.productValue = productValue;
            this.producibleQuantity = producibleQuantity;
            this.totalValue = totalValue;
        }
    }

}

