package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    @Query("SELECT i FROM Inventario i WHERE i.usuario.id = :jogadorId AND i.item.historia.id = :historiaId")
    List<Inventario> findByUsuarioIdAndHistoriaId(@Param("jogadorId") Long jogadorId, @Param("historiaId") Long historiaId);
}