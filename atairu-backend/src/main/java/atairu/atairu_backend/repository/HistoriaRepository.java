package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Historia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoriaRepository extends JpaRepository<Historia, Long> {
    
    Optional<Historia> findByTitulo(String titulo);

    List<Historia> findByPublicadaTrue();

    List<Historia> findByTituloContainingIgnoreCase(String termo);

    @Query(value = "SELECT h.* FROM historias h INNER JOIN jogador_historias jh ON h.id_historia = jh.fk_historias WHERE jh.fk_jogador = :jogadorId", nativeQuery = true)
    List<Historia> findHistoriasByJogadorId(@Param("jogadorId") Long jogadorId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO jogador_historias (fk_jogador, fk_historias) VALUES (:jogadorId, :historiaId) ON CONFLICT DO NOTHING", nativeQuery = true)
    void salvarJogadorHistoria(@Param("jogadorId") Long jogadorId, @Param("historiaId") Long historiaId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM inventario WHERE fk_usuario = :jogadorId AND fk_itens IN (SELECT id_item FROM itens WHERE fk_historia = :historiaId)", nativeQuery = true)
    void deletarItensDoJogadorNaHistoria(@Param("jogadorId") Long jogadorId, @Param("historiaId") Long historiaId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM jogador_historias WHERE fk_jogador = :jogadorId AND fk_historias = :historiaId", nativeQuery = true)
    void deletarJogadorHistoria(@Param("jogadorId") Long jogadorId, @Param("historiaId") Long historiaId);
}