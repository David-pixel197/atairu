package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.ProgressoJogador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgressoJogadorRepository extends JpaRepository<ProgressoJogador, Long> {
    List<ProgressoJogador> findByFkJogador(Long fkJogador);
}