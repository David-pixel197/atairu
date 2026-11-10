package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Historia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoriaRepository extends JpaRepository<Historia, Long> {
    
    Optional<Historia> findByTitulo(String titulo);

    List<Historia> findByPublicadaTrue();

    List<Historia> findByTituloContainingIgnoreCase(String termo);
}