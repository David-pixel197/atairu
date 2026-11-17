package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Opcao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OpcaoRepository extends JpaRepository<Opcao, Long> {
    List<Opcao> findByEnigma_IdEnigma(Long enigmaId);
    Optional<Opcao> findByIdOpcaoAndEnigma_IdEnigma(Long idOpcao, Long enigmaId);
}
