package atairu.atairu_backend.dto;

import atairu.atairu_backend.model.Inventario;

public class InventarioResponseDTO {
    private Long id;
    private ItemResponseDTO item;

    public InventarioResponseDTO(Inventario inventario) {
        this.id = inventario.getId();
        if (inventario.getItem() != null) {
            this.item = new ItemResponseDTO(inventario.getItem());
        }
    }

    public Long getId() {
        return id;
    }

    public ItemResponseDTO getItem() {
        return item;
    }
}