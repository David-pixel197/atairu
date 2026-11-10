package atairu.atairu_backend.controller;

import atairu.atairu_backend.model.Historia;
import atairu.atairu_backend.service.HistoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/historias")
public class HistoriaController {

    @Autowired
    private HistoriaService service;

    // -------------------------
    // POST /api/historias
    // Body: { titulo, autor, km, texto, imagem, publicada }
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
    // PATCH /api/historias/{id}/publicada
    // Body: { "publicada": true }
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
    // Body: { "km": 12.5 }
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
}