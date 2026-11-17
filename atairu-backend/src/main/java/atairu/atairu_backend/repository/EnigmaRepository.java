package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Enigma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnigmaRepository extends JpaRepository<Enigma, Long> {
    List<Enigma> findByHistoria_Id(Long historiaId);
}
