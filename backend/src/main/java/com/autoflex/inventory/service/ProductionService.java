package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.ProductionSuggestionDTO;
import com.autoflex.inventory.entity.Product;
import com.autoflex.inventory.entity.ProductRawMaterial;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.repository.ProductRawMaterialRepository;
import com.autoflex.inventory.repository.ProductRepository;
import com.autoflex.inventory.repository.RawMaterialRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductionService {

    @Inject
    ProductRepository productRepository;

    @Inject
    RawMaterialRepository rawMaterialRepository;

    @Inject
    ProductRawMaterialRepository productRawMaterialRepository;

    public ProductionSuggestionDTO calculateProductionSuggestions() {
        List<Product> products = productRepository.findAll().stream()
                .sorted((p1, p2) -> p2.value.compareTo(p1.value))
                .collect(Collectors.toList());

        Map<Long, Integer> availableStock = new HashMap<>();
        List<RawMaterial> rawMaterials = rawMaterialRepository.findAll().list();
        rawMaterials.forEach(rm -> {
            availableStock.put(rm.id, rm.stockQuantity);
        });

        List<ProductionSuggestionDTO.ProductProductionDTO> suggestions = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (Product product : products) {
            List<ProductRawMaterial> requirements = productRawMaterialRepository.findByProductId(product.id);
            
            if (requirements.isEmpty()) {
                continue;
            }

            Integer maxProducible = calculateMaxProducibleQuantity(requirements, availableStock);

            if (maxProducible >= 1) {
                allocateRawMaterials(requirements, maxProducible, availableStock);

                BigDecimal productTotalValue = product.value.multiply(BigDecimal.valueOf(maxProducible))
                        .setScale(2, RoundingMode.HALF_UP);

                ProductionSuggestionDTO.ProductProductionDTO dto = 
                        new ProductionSuggestionDTO.ProductProductionDTO(
                                product.id,
                                product.code,
                                product.name,
                                product.value,
                                maxProducible,
                                productTotalValue
                        );
                suggestions.add(dto);
                totalValue = totalValue.add(productTotalValue);
            }
        }

        return new ProductionSuggestionDTO(suggestions, totalValue.setScale(2, RoundingMode.HALF_UP));
    }

    private Integer calculateMaxProducibleQuantity(
            List<ProductRawMaterial> requirements, 
            Map<Long, Integer> availableStock) {
        
        Integer maxProducible = null;

        for (ProductRawMaterial requirement : requirements) {
            Long rawMaterialId = requirement.rawMaterial.id;
            Integer requiredQty = requirement.requiredQuantity;
            Integer availableQty = availableStock.getOrDefault(rawMaterialId, 0);

            if (availableQty <= 0) {
                return 0;
            }

            Integer producibleWithThis = availableQty / requiredQty;

            if (maxProducible == null || producibleWithThis < maxProducible) {
                maxProducible = producibleWithThis;
            }
        }

        return maxProducible != null ? maxProducible : 0;
    }

    private void allocateRawMaterials(
            List<ProductRawMaterial> requirements,
            Integer quantity,
            Map<Long, Integer> availableStock) {
        
        for (ProductRawMaterial requirement : requirements) {
            Long rawMaterialId = requirement.rawMaterial.id;
            Integer requiredQty = requirement.requiredQuantity;
            Integer totalNeeded = requiredQty * quantity;
            
            Integer currentStock = availableStock.getOrDefault(rawMaterialId, 0);
            Integer remainingStock = currentStock - totalNeeded;
            
            availableStock.put(rawMaterialId, remainingStock);
        }
    }

}

