package atairu.atairu_backend.service;

import atairu.atairu_backend.model.Enigma;
import atairu.atairu_backend.model.JogadorEnigmaId;
import atairu.atairu_backend.repository.EnigmaRepository;
import atairu.atairu_backend.repository.HistoriaRepository;
import atairu.atairu_backend.repository.JogadorEnigmaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HistoriaServiceTest {

    @Mock
    private HistoriaRepository historiaRepository;

    @Mock
    private EnigmaRepository enigmaRepository;

    @Mock
    private JogadorEnigmaRepository jogadorEnigmaRepository;

    @InjectMocks
    private HistoriaService service;

    @Test
    void apagarJornadaRemoveEstadoDosEnigmasDaHistoriaParaOJogador() {
        Long jogadorId = 4L;
        Long historiaId = 1L;
        Enigma enigma = new Enigma();
        enigma.setIdEnigma(7L);
        when(enigmaRepository.findByHistoria_Id(historiaId)).thenReturn(List.of(enigma));

        service.apagarJornadaEItens(jogadorId, historiaId);

        verify(historiaRepository).deletarItensDoJogadorNaHistoria(jogadorId, historiaId);
        verify(jogadorEnigmaRepository).deleteById(new JogadorEnigmaId(jogadorId, 7L));
        verify(historiaRepository).deletarJogadorHistoria(jogadorId, historiaId);
    }
}
