package atairu.atairu_backend.service;

import atairu.atairu_backend.dto.DicaEnigmaDTO;
import atairu.atairu_backend.dto.EnigmaResponseDTO;
import atairu.atairu_backend.dto.ResultadoEnigmaDTO;
import atairu.atairu_backend.model.Enigma;
import atairu.atairu_backend.model.JogadorEnigma;
import atairu.atairu_backend.model.JogadorEnigmaId;
import atairu.atairu_backend.model.Opcao;
import atairu.atairu_backend.repository.EnigmaRepository;
import atairu.atairu_backend.repository.JogadorEnigmaRepository;
import atairu.atairu_backend.repository.JogadorRepository;
import atairu.atairu_backend.repository.OpcaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnigmaService {

    private final EnigmaRepository enigmaRepository;
    private final OpcaoRepository opcaoRepository;
    private final JogadorEnigmaRepository jogadorEnigmaRepository;
    private final JogadorRepository jogadorRepository;

    public EnigmaService(
            EnigmaRepository enigmaRepository,
            OpcaoRepository opcaoRepository,
            JogadorEnigmaRepository jogadorEnigmaRepository,
            JogadorRepository jogadorRepository
    ) {
        this.enigmaRepository = enigmaRepository;
        this.opcaoRepository = opcaoRepository;
        this.jogadorEnigmaRepository = jogadorEnigmaRepository;
        this.jogadorRepository = jogadorRepository;
    }

    @Transactional(readOnly = true)
    public EnigmaResponseDTO buscar(Long enigmaId, Long jogadorId) {
        validarIds(enigmaId, jogadorId);
        Enigma enigma = buscarEnigma(enigmaId);
        validarJogador(jogadorId);
        JogadorEnigma estado = jogadorEnigmaRepository
                .findById(new JogadorEnigmaId(jogadorId, enigmaId))
                .orElse(null);
        boolean dicaRevelada = estado != null && Boolean.TRUE.equals(estado.getDicaRevelada());
        boolean desvendado = estado != null && Boolean.TRUE.equals(estado.getDesvendado());

        return new EnigmaResponseDTO(
                enigma.getIdEnigma(),
                enigma.getPergunta(),
                dicaRevelada ? enigma.getDica() : null,
                dicaRevelada,
                desvendado,
                opcaoRepository.findByEnigma_IdEnigma(enigmaId).stream()
                        .map(opcao -> new EnigmaResponseDTO.OpcaoResponseDTO(
                                opcao.getIdOpcao(), opcao.getTexto(), opcao.getImagem()))
                        .toList()
        );
    }

    @Transactional
    public ResultadoEnigmaDTO verificar(Long enigmaId, Long jogadorId, Long opcaoId) {
        validarIds(enigmaId, jogadorId);
        if (opcaoId == null) {
            throw new IllegalArgumentException("A opção escolhida é obrigatória.");
        }
        buscarEnigma(enigmaId);
        validarJogador(jogadorId);

        Opcao opcao = opcaoRepository.findByIdOpcaoAndEnigma_IdEnigma(opcaoId, enigmaId)
                .orElseThrow(() -> new IllegalArgumentException("A opção não pertence a este enigma."));
        JogadorEnigma estado = buscarOuCriarEstado(jogadorId, enigmaId);
        boolean correto = Boolean.TRUE.equals(opcao.getCorreto());

        if (correto) {
            estado.setDesvendado(true);
            jogadorEnigmaRepository.save(estado);
            return new ResultadoEnigmaDTO(true, true, "Enigma desvendado!");
        }

        return new ResultadoEnigmaDTO(
                false,
                Boolean.TRUE.equals(estado.getDesvendado()),
                "Resposta incorreta. Analise as pistas e tente novamente."
        );
    }

    @Transactional
    public DicaEnigmaDTO revelarDica(Long enigmaId, Long jogadorId) {
        validarIds(enigmaId, jogadorId);
        Enigma enigma = buscarEnigma(enigmaId);
        validarJogador(jogadorId);
        JogadorEnigma estado = buscarOuCriarEstado(jogadorId, enigmaId);
        estado.setDicaRevelada(true);
        jogadorEnigmaRepository.save(estado);

        return new DicaEnigmaDTO(
                enigma.getDica(),
                true,
                Boolean.TRUE.equals(estado.getDesvendado())
        );
    }

    private Enigma buscarEnigma(Long enigmaId) {
        return enigmaRepository.findById(enigmaId)
                .orElseThrow(() -> new IllegalArgumentException("Enigma não encontrado."));
    }

    private void validarJogador(Long jogadorId) {
        if (!jogadorRepository.existsById(jogadorId)) {
            throw new IllegalArgumentException("Jogador não encontrado.");
        }
    }

    private JogadorEnigma buscarOuCriarEstado(Long jogadorId, Long enigmaId) {
        return jogadorEnigmaRepository.findById(
                new JogadorEnigmaId(jogadorId, enigmaId)
        ).orElseGet(() -> new JogadorEnigma(jogadorId, enigmaId));
    }

    private void validarIds(Long enigmaId, Long jogadorId) {
        if (enigmaId == null || jogadorId == null) {
            throw new IllegalArgumentException("ID do enigma e do jogador são obrigatórios.");
        }
    }
}
