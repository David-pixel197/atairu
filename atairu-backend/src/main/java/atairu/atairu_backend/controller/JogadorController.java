package atairu.atairu_backend.controller;

import atairu.atairu_backend.model.Jogador;
import atairu.atairu_backend.service.JogadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/jogadores")
public class JogadorController {

    @Autowired
    private JogadorService service;

    // -------------------------
    // POST /api/jogadores/cadastro
    // Body: { nickname, email, senha, nome, cpf, dataNascimento }
    // -------------------------
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Jogador jogador) {
        try {
            return ResponseEntity.ok(service.cadastrar(jogador));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // POST /api/jogadores/login
    // Body: { email, senha }
    // -------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            return ResponseEntity.ok(service.login(req.email(), req.senha()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // GET /api/jogadores
    // -------------------------
    @GetMapping
    public ResponseEntity<List<Jogador>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // -------------------------
    // GET /api/jogadores/{id}
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
    // PATCH /api/jogadores/{id}/nickname?novoNickname=...
    // -------------------------
    @PatchMapping("/{id}/nickname")
    public ResponseEntity<?> alterarNickname(
            @PathVariable Long id,
            @RequestParam String novoNickname) {
        try {
            return ResponseEntity.ok(service.atualizarNickname(id, novoNickname));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // PATCH /api/jogadores/{id}/cpf?novoCpf=...
    // -------------------------
    @PatchMapping("/{id}/cpf")
    public ResponseEntity<?> alterarCpf(
            @PathVariable Long id,
            @RequestParam String novoCpf) {
        try {
            return ResponseEntity.ok(service.atualizarCpf(id, novoCpf));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // PATCH /api/jogadores/{id}/avatar
    // Body: { "url": "https://..." }
    // -------------------------
    @PatchMapping("/{id}/avatar")
    public ResponseEntity<?> alterarAvatar(
            @PathVariable Long id,
            @RequestBody AvatarRequest req) {
        try {
            return ResponseEntity.ok(service.atualizarAvatar(id, req.url()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // PATCH /api/jogadores/{id}/km
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
    // DELETE /api/jogadores/{id}
    // -------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.ok("Jogador deletado com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------------
    // Records (DTOs inline)
    // -------------------------
    public record LoginRequest(String email, String senha) {}
    public record AvatarRequest(String url) {}
    public record KmRequest(BigDecimal km) {}
}