package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductionSuggestionDTO;
import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.dto.RawMaterialDTO;
import com.autoflex.inventory.dto.ProductRawMaterialDTO;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ProductionServiceTest {

    @Inject
    ProductionService productionService;

    @Inject
    ProductService productService;

    @Inject
    RawMaterialService rawMaterialService;

    @Inject
    ProductRawMaterialService productRawMaterialService;

    @Test
    @Transactional
    void testProductionSuggestionsWithPrioritization() {
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);
        
        RawMaterialDTO rm1 = new RawMaterialDTO();
        rm1.code = "RM001_" + uniqueSuffix;
        rm1.name = "Raw Material 1";
        rm1.stockQuantity = 100;
        RawMaterialDTO createdRm1 = rawMaterialService.create(rm1);

        RawMaterialDTO rm2 = new RawMaterialDTO();
        rm2.code = "RM002_" + uniqueSuffix;
        rm2.name = "Raw Material 2";
        rm2.stockQuantity = 50;
        RawMaterialDTO createdRm2 = rawMaterialService.create(rm2);

        ProductDTO prod1 = new ProductDTO();
        prod1.code = "PROD001_" + uniqueSuffix;
        prod1.name = "Product 1";
        prod1.value = new BigDecimal("50.00");
        ProductDTO createdProd1 = productService.create(prod1);

        ProductDTO prod2 = new ProductDTO();
        prod2.code = "PROD002_" + uniqueSuffix;
        prod2.name = "Product 2";
        prod2.value = new BigDecimal("100.00");
        ProductDTO createdProd2 = productService.create(prod2);

        ProductRawMaterialDTO assoc1 = new ProductRawMaterialDTO();
        assoc1.rawMaterialId = createdRm1.id;
        assoc1.requiredQuantity = 10;
        productRawMaterialService.create(createdProd1.id, assoc1);

        ProductRawMaterialDTO assoc2 = new ProductRawMaterialDTO();
        assoc2.rawMaterialId = createdRm1.id;
        assoc2.requiredQuantity = 5;
        productRawMaterialService.create(createdProd2.id, assoc2);

        ProductionSuggestionDTO suggestions = productionService.calculateProductionSuggestions();

        assertNotNull(suggestions);
        assertNotNull(suggestions.products);
        assertTrue(suggestions.products.size() > 0);

        assertEquals(createdProd2.id, suggestions.products.get(0).productId);
        assertTrue(suggestions.totalValue.compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @Transactional
    void testProductionSuggestionsWithInsufficientStock() {
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);
        
        RawMaterialDTO rm = new RawMaterialDTO();
        rm.code = "RM001_" + uniqueSuffix;
        rm.name = "Raw Material 1";
        rm.stockQuantity = 5;
        RawMaterialDTO createdRm = rawMaterialService.create(rm);

        ProductDTO prod = new ProductDTO();
        prod.code = "PROD001_" + uniqueSuffix;
        prod.name = "Product 1";
        prod.value = new BigDecimal("100.00");
        ProductDTO createdProd = productService.create(prod);

        ProductRawMaterialDTO assoc = new ProductRawMaterialDTO();
        assoc.rawMaterialId = createdRm.id;
        assoc.requiredQuantity = 10;
        productRawMaterialService.create(createdProd.id, assoc);

        ProductionSuggestionDTO suggestions = productionService.calculateProductionSuggestions();

        assertNotNull(suggestions);
        assertNotNull(suggestions.products);
        assertTrue(suggestions.products.stream().noneMatch(p -> p.productId.equals(createdProd.id)),
                   "Product with insufficient stock should not be in suggestions");
    }
}

