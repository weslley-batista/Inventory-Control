package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductRawMaterialDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.entity.ProductRawMaterial;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.repository.ProductRawMaterialRepository;
import com.autoflex.inventory.repository.ProductRepository;
import com.autoflex.inventory.repository.RawMaterialRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductRawMaterialService {

    @Inject
    ProductRawMaterialRepository productRawMaterialRepository;

    @Inject
    ProductRepository productRepository;

    @Inject
    RawMaterialRepository rawMaterialRepository;

    public List<ProductRawMaterialDTO> findByProductId(Long productId) {
        Product product = productRepository.findById(productId);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        return productRawMaterialRepository.findByProductId(productId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductRawMaterialDTO findById(Long id) {
        ProductRawMaterial association = productRawMaterialRepository.findById(id);
        if (association == null) {
            throw new RuntimeException("Product-RawMaterial association not found with id: " + id);
        }
        return toDTO(association);
    }

    @Transactional
    public ProductRawMaterialDTO create(Long productId, @Valid ProductRawMaterialDTO dto) {
        Product product = productRepository.findById(productId);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.rawMaterialId);
        if (rawMaterial == null) {
            throw new RuntimeException("Raw material not found with id: " + dto.rawMaterialId);
        }

        List<ProductRawMaterial> existing = productRawMaterialRepository.findByProductId(productId);
        boolean alreadyExists = existing.stream()
                .anyMatch(prm -> prm.rawMaterial.id.equals(dto.rawMaterialId));
        if (alreadyExists) {
            throw new RuntimeException("Association between product " + productId + 
                    " and raw material " + dto.rawMaterialId + " already exists");
        }

        ProductRawMaterial association = new ProductRawMaterial();
        association.product = product;
        association.rawMaterial = rawMaterial;
        association.requiredQuantity = dto.requiredQuantity;
        productRawMaterialRepository.persist(association);
        return toDTO(association);
    }

    @Transactional
    public ProductRawMaterialDTO update(Long id, @Valid ProductRawMaterialDTO dto) {
        ProductRawMaterial association = productRawMaterialRepository.findById(id);
        if (association == null) {
            throw new RuntimeException("Product-RawMaterial association not found with id: " + id);
        }

        association.requiredQuantity = dto.requiredQuantity;
        productRawMaterialRepository.persist(association);
        return toDTO(association);
    }

    @Transactional
    public void delete(Long id) {
        ProductRawMaterial association = productRawMaterialRepository.findById(id);
        if (association == null) {
            throw new RuntimeException("Product-RawMaterial association not found with id: " + id);
        }
        productRawMaterialRepository.delete(association);
    }

    private ProductRawMaterialDTO toDTO(ProductRawMaterial association) {
        return new ProductRawMaterialDTO(
                association.id,
                association.product.id,
                association.product.name,
                association.rawMaterial.id,
                association.rawMaterial.name,
                association.requiredQuantity
        );
    }

}

