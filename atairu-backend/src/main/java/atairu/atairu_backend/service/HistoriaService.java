package atairu.atairu_backend.service;

import atairu.atairu_backend.model.Historia;
import atairu.atairu_backend.repository.HistoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class HistoriaService {

    @Autowired
    private HistoriaRepository repository;

    // -------------------------
    // CREATE
    // -------------------------

    public Historia cadastrar(Historia historia) {
        if (historia.getTitulo() == null || historia.getTitulo().trim().isEmpty()) {
            throw new IllegalArgumentException("O título da história é obrigatório.");
        }
        if (historia.getTexto() == null || historia.getTexto().trim().isEmpty()) {
            throw new IllegalArgumentException("O texto da história é obrigatório.");
        }

        // Garante que nasce despublicada se vier nula
        if (historia.getPublicada() == null) {
            historia.setPublicada(false);
        }

        return repository.save(historia);
    }

    // -------------------------
    // READ
    // -------------------------

    public List<Historia> listarTodas() {
        return repository.findAll();
    }

    public Historia buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("História não encontrada."));
    }

    // -------------------------
    // UPDATE — campos individuais
    // -------------------------

    public Historia atualizarStatusPublicacao(Long id, Boolean publicada) {
        Historia historia = buscarPorId(id);
        historia.setPublicada(publicada != null ? publicada : false);
        return repository.save(historia);
    }

    public Historia atualizarKm(Long id, BigDecimal km) {
        if (km == null || km.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor de km inválido.");
        }
        Historia historia = buscarPorId(id);
        historia.setKm(km);
        return repository.save(historia);
    }

    // -------------------------
    // DELETE
    // -------------------------

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("História não encontrada.");
        }
        repository.deleteById(id);
    }
}