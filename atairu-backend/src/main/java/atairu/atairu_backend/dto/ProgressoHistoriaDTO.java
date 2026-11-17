package atairu.atairu_backend.dto;

public record ProgressoHistoriaDTO(
        Long idHistoria,
        Long fkJogador,
        int itensColetados,
        int totalItens,
        double percentual,
        boolean resolvido
) {}
