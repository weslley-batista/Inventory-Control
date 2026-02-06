package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.repository.ProductRepository;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ProductServiceTest {

    @Inject
    ProductService productService;

    @Inject
    ProductRepository productRepository;

    @Test
    @Transactional
    void testCreateProduct() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        ProductDTO dto = new ProductDTO();
        dto.code = uniqueCode;
        dto.name = "Test Product";
        dto.value = new BigDecimal("100.00");

        ProductDTO created = productService.create(dto);

        assertNotNull(created.id);
        assertEquals(uniqueCode, created.code);
        assertEquals("Test Product", created.name);
        assertEquals(new BigDecimal("100.00"), created.value);
    }

    @Test
    @Transactional
    void testCreateProductWithDuplicateCode() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        ProductDTO dto1 = new ProductDTO();
        dto1.code = uniqueCode;
        dto1.name = "Product 1";
        dto1.value = new BigDecimal("100.00");
        productService.create(dto1);

        ProductDTO dto2 = new ProductDTO();
        dto2.code = uniqueCode;
        dto2.name = "Product 2";
        dto2.value = new BigDecimal("200.00");

        assertThrows(RuntimeException.class, () -> productService.create(dto2));
    }

    @Test
    @Transactional
    void testFindAllProducts() {
        String uniqueCode1 = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        String uniqueCode2 = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        
        ProductDTO dto1 = new ProductDTO();
        dto1.code = uniqueCode1;
        dto1.name = "Product 1";
        dto1.value = new BigDecimal("100.00");
        ProductDTO created1 = productService.create(dto1);

        ProductDTO dto2 = new ProductDTO();
        dto2.code = uniqueCode2;
        dto2.name = "Product 2";
        dto2.value = new BigDecimal("200.00");
        ProductDTO created2 = productService.create(dto2);

        List<ProductDTO> products = productService.findAll();
        assertTrue(products.size() >= 2, "Should have at least 2 products");
        
        assertTrue(products.stream().anyMatch(p -> p.id.equals(created1.id)), 
                   "Product 1 should be in the list");
        assertTrue(products.stream().anyMatch(p -> p.id.equals(created2.id)), 
                   "Product 2 should be in the list");
    }

    @Test
    @Transactional
    void testFindProductById() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        ProductDTO dto = new ProductDTO();
        dto.code = uniqueCode;
        dto.name = "Test Product";
        dto.value = new BigDecimal("100.00");
        ProductDTO created = productService.create(dto);

        ProductDTO found = productService.findById(created.id);
        assertNotNull(found);
        assertEquals(created.id, found.id);
        assertEquals(uniqueCode, found.code);
    }

    @Test
    @Transactional
    void testUpdateProduct() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        ProductDTO dto = new ProductDTO();
        dto.code = uniqueCode;
        dto.name = "Test Product";
        dto.value = new BigDecimal("100.00");
        ProductDTO created = productService.create(dto);

        ProductDTO updateDto = new ProductDTO();
        updateDto.code = uniqueCode;
        updateDto.name = "Updated Product";
        updateDto.value = new BigDecimal("150.00");

        ProductDTO updated = productService.update(created.id, updateDto);
        assertEquals("Updated Product", updated.name);
        assertEquals(new BigDecimal("150.00"), updated.value);
    }

    @Test
    @Transactional
    void testDeleteProduct() {
        String uniqueCode = "PROD_" + UUID.randomUUID().toString().substring(0, 8);
        ProductDTO dto = new ProductDTO();
        dto.code = uniqueCode;
        dto.name = "Test Product";
        dto.value = new BigDecimal("100.00");
        ProductDTO created = productService.create(dto);

        productService.delete(created.id);

        assertThrows(RuntimeException.class, () -> productService.findById(created.id));
    }
}

