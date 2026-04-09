package atairu.atairu_backend.controller;

import atairu.atairu_backend.model.Jogador;
import atairu.atairu_backend.repository.JogadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/jogadores")
public class JogadorController {

    @Autowired
    private JogadorRepository repository;

    @GetMapping
    public List<Jogador> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Jogador salvar(@RequestBody Jogador jogador) {
        return repository.save(jogador);
    }
}