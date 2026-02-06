package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.repository.ProductRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    @Inject
    ProductRepository productRepository;

    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        return toDTO(product);
    }

    @Transactional
    public ProductDTO create(@Valid ProductDTO dto) {
        if (productRepository.findByCode(dto.code).isPresent()) {
            throw new RuntimeException("Product with code " + dto.code + " already exists");
        }

        Product product = new Product();
        product.code = dto.code;
        product.name = dto.name;
        product.value = dto.value;
        productRepository.persist(product);
        return toDTO(product);
    }

    @Transactional
    public ProductDTO update(Long id, @Valid ProductDTO dto) {
        Product product = productRepository.findById(id);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + id);
        }

        if (!product.code.equals(dto.code)) {
            if (productRepository.findByCode(dto.code).isPresent()) {
                throw new RuntimeException("Product with code " + dto.code + " already exists");
            }
        }

        product.code = dto.code;
        product.name = dto.name;
        product.value = dto.value;
        productRepository.persist(product);
        return toDTO(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.delete(product);
    }

    private ProductDTO toDTO(Product product) {
        return new ProductDTO(product.id, product.code, product.name, product.value);
    }

}

