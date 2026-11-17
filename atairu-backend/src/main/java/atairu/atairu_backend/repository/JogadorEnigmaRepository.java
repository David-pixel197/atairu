package atairu.atairu_backend.repository;

import atairu.atairu_backend.model.JogadorEnigma;
import atairu.atairu_backend.model.JogadorEnigmaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JogadorEnigmaRepository extends JpaRepository<JogadorEnigma, JogadorEnigmaId> {
}
