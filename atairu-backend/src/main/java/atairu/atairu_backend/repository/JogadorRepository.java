package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Jogador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JogadorRepository extends JpaRepository<Jogador, Long> {
    Optional<Jogador> findByEmail(String email);
    Optional<Jogador> findByNickname(String nickname);
    Optional<Jogador> findByCpf(String cpf);
}