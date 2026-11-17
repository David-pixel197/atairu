package atairu.atairu_backend.controller;

import atairu.atairu_backend.dto.DicaEnigmaDTO;
import atairu.atairu_backend.dto.EnigmaResponseDTO;
import atairu.atairu_backend.dto.JogadorEnigmaRequest;
import atairu.atairu_backend.dto.ResultadoEnigmaDTO;
import atairu.atairu_backend.dto.VerificarEnigmaRequest;
import atairu.atairu_backend.service.EnigmaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/enigmas")
public class EnigmaController {

    private final EnigmaService enigmaService;

    public EnigmaController(EnigmaService enigmaService) {
        this.enigmaService = enigmaService;
    }

    @GetMapping("/{enigmaId}")
    public ResponseEntity<?> buscar(
            @PathVariable Long enigmaId,
            @RequestParam Long jogadorId
    ) {
        try {
            EnigmaResponseDTO resposta = enigmaService.buscar(enigmaId, jogadorId);
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{enigmaId}/verificar")
    public ResponseEntity<?> verificar(
            @PathVariable Long enigmaId,
            @RequestBody VerificarEnigmaRequest request
    ) {
        try {
            ResultadoEnigmaDTO resposta = enigmaService.verificar(
                    enigmaId, request.jogadorId(), request.idOpcao());
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{enigmaId}/dica")
    public ResponseEntity<?> revelarDica(
            @PathVariable Long enigmaId,
            @RequestBody JogadorEnigmaRequest request
    ) {
        try {
            DicaEnigmaDTO resposta = enigmaService.revelarDica(enigmaId, request.jogadorId());
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
