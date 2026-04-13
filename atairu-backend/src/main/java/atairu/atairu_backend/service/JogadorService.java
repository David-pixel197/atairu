package atairu.atairu_backend.service;

import atairu.atairu_backend.model.Jogador;
import atairu.atairu_backend.repository.JogadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class JogadorService {

    @Autowired
    private JogadorRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // -------------------------
    // CREATE
    // -------------------------

    public Jogador cadastrar(Jogador jogador) {
        if (repository.findByEmail(jogador.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }
        if (repository.findByNickname(jogador.getNickname()).isPresent()) {
            throw new IllegalArgumentException("Nickname já está em uso.");
        }
        if (jogador.getCpf() != null && repository.findByCpf(jogador.getCpf()).isPresent()) {
            throw new IllegalArgumentException("CPF já está em uso.");
        }

        jogador.setSenha(passwordEncoder.encode(jogador.getSenha()));
        return repository.save(jogador);
    }

    // -------------------------
    // READ
    // -------------------------

    public List<Jogador> listarTodos() {
        return repository.findAll();
    }

    public Jogador buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jogador não encontrado."));
    }

    // -------------------------
    // LOGIN
    // -------------------------

    public Jogador login(String email, String senha) {
        Jogador jogador = repository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        if (Boolean.TRUE.equals(jogador.getBanido())) {
            throw new IllegalArgumentException("Usuário banido. Entre em contato com o suporte.");
        }

        if (!passwordEncoder.matches(senha, jogador.getSenha())) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return jogador;
    }

    // -------------------------
    // UPDATE — campos individuais
    // -------------------------

    public Jogador atualizarNickname(Long id, String novoNickname) {
        Jogador jogador = buscarPorId(id);

        if (repository.findByNickname(novoNickname)
                .filter(j -> !j.getId().equals(id))
                .isPresent()) {
            throw new IllegalArgumentException("Esse nickname já está em uso por outro jogador.");
        }

        jogador.setNickname(novoNickname);
        return repository.save(jogador);
    }

    public Jogador atualizarCpf(Long id, String novoCpf) {
        Jogador jogador = buscarPorId(id);

        if (repository.findByCpf(novoCpf)
                .filter(j -> !j.getId().equals(id))
                .isPresent()) {
            throw new IllegalArgumentException("Esse CPF já está em uso por outro jogador.");
        }

        jogador.setCpf(novoCpf);
        return repository.save(jogador);
    }

    public Jogador atualizarAvatar(Long id, String urlAvatar) {
        Jogador jogador = buscarPorId(id);
        jogador.setAvatar(urlAvatar);
        return repository.save(jogador);
    }

    public Jogador atualizarKm(Long id, BigDecimal km) {
        if (km == null || km.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor de km inválido.");
        }
        Jogador jogador = buscarPorId(id);
        jogador.setKm(km);
        return repository.save(jogador);
    }

    // -------------------------
    // DELETE
    // -------------------------

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Jogador não encontrado.");
        }
        repository.deleteById(id);
    }
}