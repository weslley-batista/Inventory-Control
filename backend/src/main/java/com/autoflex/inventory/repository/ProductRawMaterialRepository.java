package com.autoflex.inventory.repository;

import com.autoflex.inventory.entity.ProductRawMaterial;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class ProductRawMaterialRepository implements PanacheRepository<ProductRawMaterial> {

    public List<ProductRawMaterial> findByProductId(Long productId) {
        return find("product.id", productId).list();
    }

    public List<ProductRawMaterial> findByRawMaterialId(Long rawMaterialId) {
        return find("rawMaterial.id", rawMaterialId).list();
    }

}

