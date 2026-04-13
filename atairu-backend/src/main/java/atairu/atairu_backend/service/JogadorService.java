package atairu.atairu_backend.service;

import atairu.atairu_backend.model.Jogador;
import atairu.atairu_backend.repository.JogadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JogadorService {

    @Autowired
    private JogadorRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Jogador cadastrar(Jogador jogador) {
        if (repository.findByEmail(jogador.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }
        if (repository.findByNickname(jogador.getNickname()).isPresent()) {
            throw new IllegalArgumentException("Nickname já está em uso.");
        }

        // Criptografa a senha antes de salvar no banco
        jogador.setSenha(passwordEncoder.encode(jogador.getSenha()));

        return repository.save(jogador);
    }

    public Jogador login(String email, String senha) {
        Jogador jogador = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        // Verifica se a senha informada bate com o hash salvo no banco
        if (!passwordEncoder.matches(senha, jogador.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return jogador;
    }

    // O ID é usado como base para a operação, garantindo que o Nickname possa ser alterado com segurança
    public Jogador atualizarNickname(Long idUsuario, String novoNickname) {
        Jogador jogador = repository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Jogador não encontrado."));

        if (repository.findByNickname(novoNickname).isPresent()) {
            throw new IllegalArgumentException("Esse nickname já está em uso por outro jogador.");
        }

        jogador.setNickname(novoNickname);
        return repository.save(jogador);
    }
}