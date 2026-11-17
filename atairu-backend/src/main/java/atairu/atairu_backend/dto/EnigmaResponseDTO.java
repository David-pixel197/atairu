package atairu.atairu_backend.dto;

import java.util.List;

public record EnigmaResponseDTO(
        Long idEnigma,
        String pergunta,
        String dica,
        boolean dicaRevelada,
        boolean desvendado,
        List<OpcaoResponseDTO> opcoes
) {
    public record OpcaoResponseDTO(Long idOpcao, String texto, String imagem) {}
}
