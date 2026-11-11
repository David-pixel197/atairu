package atairu.atairu_backend.controller;

import atairu.atairu_backend.dto.ItemResponseDTO;
import atairu.atairu_backend.model.Historia;
import atairu.atairu_backend.model.Item;
import atairu.atairu_backend.repository.ItemRepository;
import atairu.atairu_backend.service.HistoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import atairu.atairu_backend.service.HistoriaService;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/historias")
public class HistoriaController {

    @Autowired
    private HistoriaService service;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private HistoriaService historiaService;

    // -------------------------
    // POST /api/historias
    // -------------------------
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Historia historia) {
        try {
            return ResponseEntity.ok(service.cadastrar(historia));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // GET /api/historias
    // -------------------------
    @GetMapping
    public ResponseEntity<List<Historia>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    // -------------------------
    // GET /api/historias/{id}
    // -------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.buscarPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // GET /api/historias/{idHistoria}/itens
    // -------------------------
    @GetMapping("/{idHistoria}/itens")
    public ResponseEntity<List<ItemResponseDTO>> listarItensPorHistoria(@PathVariable Long idHistoria) {
        List<Item> itens = itemRepository.findByHistoria_Id(idHistoria);
        
        // Mapeia para o DTO para evitar o loop infinito do JTS Point
        List<ItemResponseDTO> resposta = itens.stream()
                .map(ItemResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }

    // -------------------------
    // PATCH /api/historias/{id}/publicada
    // -------------------------
    @PatchMapping("/{id}/publicada")
    public ResponseEntity<?> atualizarStatusPublicacao(
            @PathVariable Long id,
            @RequestBody PublicadaRequest req) {
        try {
            return ResponseEntity.ok(service.atualizarStatusPublicacao(id, req.publicada()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // PATCH /api/historias/{id}/km
    // -------------------------
    @PatchMapping("/{id}/km")
    public ResponseEntity<?> atualizarKm(
            @PathVariable Long id,
            @RequestBody KmRequest req) {
        try {
            return ResponseEntity.ok(service.atualizarKm(id, req.km()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // DELETE /api/historias/{id}
    // -------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.ok("História deletada com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // Records (DTOs inline)
    // -------------------------
    public record PublicadaRequest(Boolean publicada) {}
    public record KmRequest(BigDecimal km) {}

    @GetMapping("/jogador/{jogadorId}")
    public ResponseEntity<List<Historia>> listarHistoriasPorJogador(@PathVariable Long jogadorId) {
        List<Historia> jornadas = historiaService.listarHistoriasPorJogador(jogadorId);
        return ResponseEntity.ok(jornadas);
    }
}