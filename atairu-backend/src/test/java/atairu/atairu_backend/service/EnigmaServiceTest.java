package atairu.atairu_backend.service;

import atairu.atairu_backend.dto.DicaEnigmaDTO;
import atairu.atairu_backend.dto.ResultadoEnigmaDTO;
import atairu.atairu_backend.model.Enigma;
import atairu.atairu_backend.model.JogadorEnigma;
import atairu.atairu_backend.model.Opcao;
import atairu.atairu_backend.repository.EnigmaRepository;
import atairu.atairu_backend.repository.JogadorEnigmaRepository;
import atairu.atairu_backend.repository.JogadorRepository;
import atairu.atairu_backend.repository.OpcaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnigmaServiceTest {

    @Mock
    private EnigmaRepository enigmaRepository;

    @Mock
    private OpcaoRepository opcaoRepository;

    @Mock
    private JogadorEnigmaRepository jogadorEnigmaRepository;

    @Mock
    private JogadorRepository jogadorRepository;

    private EnigmaService service;

    @BeforeEach
    void setUp() {
        service = new EnigmaService(
                enigmaRepository, opcaoRepository, jogadorEnigmaRepository, jogadorRepository);
    }

    @Test
    void verificarRespostaCorretaSalvaEnigmaComoDesvendado() {
        when(enigmaRepository.findById(10L)).thenReturn(Optional.of(enigma(10L)));
        when(jogadorRepository.existsById(20L)).thenReturn(true);
        when(opcaoRepository.findByIdOpcaoAndEnigma_IdEnigma(30L, 10L))
                .thenReturn(Optional.of(opcao(30L, true)));
        when(jogadorEnigmaRepository.findById(any())).thenReturn(Optional.empty());

        ResultadoEnigmaDTO resultado = service.verificar(10L, 20L, 30L);

        assertTrue(resultado.correto());
        assertTrue(resultado.desvendado());
        ArgumentCaptor<JogadorEnigma> estadoSalvo = ArgumentCaptor.forClass(JogadorEnigma.class);
        verify(jogadorEnigmaRepository).save(estadoSalvo.capture());
        assertTrue(estadoSalvo.getValue().getDesvendado());
    }

    @Test
    void verificarRespostaIncorretaNaoMarcaEnigmaComoDesvendado() {
        when(enigmaRepository.findById(10L)).thenReturn(Optional.of(enigma(10L)));
        when(jogadorRepository.existsById(20L)).thenReturn(true);
        when(opcaoRepository.findByIdOpcaoAndEnigma_IdEnigma(30L, 10L))
                .thenReturn(Optional.of(opcao(30L, false)));
        when(jogadorEnigmaRepository.findById(any())).thenReturn(Optional.empty());

        ResultadoEnigmaDTO resultado = service.verificar(10L, 20L, 30L);

        assertFalse(resultado.correto());
        assertFalse(resultado.desvendado());
        verify(jogadorEnigmaRepository, never()).save(any());
    }

    @Test
    void revelarDicaSalvaEstadoDoJogador() {
        Enigma enigma = enigma(10L);
        enigma.setDica("Observe a chave.");
        when(enigmaRepository.findById(10L)).thenReturn(Optional.of(enigma));
        when(jogadorRepository.existsById(20L)).thenReturn(true);
        when(jogadorEnigmaRepository.findById(any())).thenReturn(Optional.empty());

        DicaEnigmaDTO resultado = service.revelarDica(10L, 20L);

        assertEquals("Observe a chave.", resultado.dica());
        assertTrue(resultado.dicaRevelada());
        ArgumentCaptor<JogadorEnigma> estadoSalvo = ArgumentCaptor.forClass(JogadorEnigma.class);
        verify(jogadorEnigmaRepository).save(estadoSalvo.capture());
        assertTrue(estadoSalvo.getValue().getDicaRevelada());
    }

    @Test
    void rejeitaOpcaoQueNaoPertenceAoEnigma() {
        when(enigmaRepository.findById(10L)).thenReturn(Optional.of(enigma(10L)));
        when(jogadorRepository.existsById(20L)).thenReturn(true);
        when(opcaoRepository.findByIdOpcaoAndEnigma_IdEnigma(30L, 10L))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.verificar(10L, 20L, 30L));
        verify(jogadorEnigmaRepository, never()).save(any());
    }

    private Enigma enigma(Long id) {
        Enigma enigma = new Enigma();
        enigma.setIdEnigma(id);
        enigma.setPergunta("Quem foi?");
        return enigma;
    }

    private Opcao opcao(Long id, boolean correto) {
        Opcao opcao = new Opcao();
        opcao.setIdOpcao(id);
        opcao.setCorreto(correto);
        return opcao;
    }
}
