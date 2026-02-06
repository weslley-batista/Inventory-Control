package com.autoflex.inventory.service;

import com.autoflex.inventory.dto.RawMaterialDTO;
import com.autoflex.inventory.entity.RawMaterial;
import com.autoflex.inventory.repository.RawMaterialRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class RawMaterialService {

    @Inject
    RawMaterialRepository rawMaterialRepository;

    public List<RawMaterialDTO> findAll() {
        return rawMaterialRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RawMaterialDTO findById(Long id) {
        RawMaterial rawMaterial = rawMaterialRepository.findById(id);
        if (rawMaterial == null) {
            throw new RuntimeException("Raw material not found with id: " + id);
        }
        return toDTO(rawMaterial);
    }

    @Transactional
    public RawMaterialDTO create(@Valid RawMaterialDTO dto) {
        if (rawMaterialRepository.findByCode(dto.code).isPresent()) {
            throw new RuntimeException("Raw material with code " + dto.code + " already exists");
        }

        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.code = dto.code;
        rawMaterial.name = dto.name;
        rawMaterial.stockQuantity = dto.stockQuantity;
        rawMaterialRepository.persist(rawMaterial);
        return toDTO(rawMaterial);
    }

    @Transactional
    public RawMaterialDTO update(Long id, @Valid RawMaterialDTO dto) {
        RawMaterial rawMaterial = rawMaterialRepository.findById(id);
        if (rawMaterial == null) {
            throw new RuntimeException("Raw material not found with id: " + id);
        }

        if (!rawMaterial.code.equals(dto.code)) {
            if (rawMaterialRepository.findByCode(dto.code).isPresent()) {
                throw new RuntimeException("Raw material with code " + dto.code + " already exists");
            }
        }

        rawMaterial.code = dto.code;
        rawMaterial.name = dto.name;
        rawMaterial.stockQuantity = dto.stockQuantity;
        rawMaterialRepository.persist(rawMaterial);
        return toDTO(rawMaterial);
    }

    @Transactional
    public void delete(Long id) {
        RawMaterial rawMaterial = rawMaterialRepository.findById(id);
        if (rawMaterial == null) {
            throw new RuntimeException("Raw material not found with id: " + id);
        }
        rawMaterialRepository.delete(rawMaterial);
    }

    private RawMaterialDTO toDTO(RawMaterial rawMaterial) {
        return new RawMaterialDTO(rawMaterial.id, rawMaterial.code, rawMaterial.name, rawMaterial.stockQuantity);
    }

}

