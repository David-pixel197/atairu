package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByHistoria_Id(Long idHistoria);
}