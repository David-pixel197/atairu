package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Historia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoriaRepository extends JpaRepository<Historia, Long> {
    
    Optional<Historia> findByTitulo(String titulo);

    List<Historia> findByPublicadaTrue();

    List<Historia> findByTituloContainingIgnoreCase(String termo);

    @Query(value = "SELECT h.* FROM historias h INNER JOIN jogador_historias jh ON h.id_historia = jh.fk_historias WHERE jh.fk_jogador = :jogadorId", nativeQuery = true)
    List<Historia> findHistoriasByJogadorId(@Param("jogadorId") Long jogadorId);
}