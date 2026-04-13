package atairu.atairu_backend.controller;

import atairu.atairu_backend.model.Jogador;
import atairu.atairu_backend.service.JogadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/jogadores")
public class JogadorController {

    @Autowired
    private JogadorService service;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Jogador jogador) {
        try {
            Jogador novoJogador = service.cadastrar(jogador);
            return ResponseEntity.ok(novoJogador);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Jogador jogador = service.login(loginRequest.email(), loginRequest.senha());
            return ResponseEntity.ok(jogador);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/nickname")
    public ResponseEntity<?> alterarNickname(@PathVariable Long id, @RequestParam String novoNickname) {
        try {
            Jogador atualizado = service.atualizarNickname(id, novoNickname);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Record utilizado para receber o JSON de login de forma simples
    public record LoginRequest(String email, String senha) {}
}