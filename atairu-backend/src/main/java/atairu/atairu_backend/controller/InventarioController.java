package atairu.atairu_backend.controller;

import atairu.atairu_backend.repository.InventarioResponseDTO;
import atairu.atairu_backend.model.Inventario;
import atairu.atairu_backend.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @GetMapping("/{jogadorId}/historia/{historiaId}")
    public ResponseEntity<List<InventarioResponseDTO>> listarInventario(
            @PathVariable Long jogadorId, 
            @PathVariable Long historiaId) {
        
        List<Inventario> inventarios = inventarioRepository.findByUsuarioIdAndHistoriaId(jogadorId, historiaId);
        
        List<InventarioResponseDTO> resposta = inventarios.stream()
                .map(InventarioResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }
}