package atairu.atairu_backend.controller;

import atairu.atairu_backend.dto.InventarioResponseDTO;
import atairu.atairu_backend.dto.ItemResponseDTO;
import atairu.atairu_backend.model.Inventario;
import atairu.atairu_backend.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import atairu.atairu_backend.dto.ColetarItemRequest;
import atairu.atairu_backend.service.InventarioService;
import atairu.atairu_backend.model.Item;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private InventarioService inventarioService;

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

    @PostMapping("/coletar")
    public ResponseEntity<String> coletarItem(@RequestBody ColetarItemRequest request) {
        try {
            // 2. Chamar usando a instância (inventarioService com 'i' minúsculo)
            Inventario novoInventario = inventarioService.coletarItem(request);
            return ResponseEntity.ok("Item coletado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verificar-iniciais")
    public ResponseEntity<?> verificarIniciais(
            @RequestParam Long jogadorId, 
            @RequestParam Long historiaId) {
        try {
            List<ItemResponseDTO> novosItens = inventarioService.processarItensIniciaisAutomaticos(jogadorId, historiaId);
            return ResponseEntity.ok(novosItens);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}