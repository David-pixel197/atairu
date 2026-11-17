package atairu.atairu_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class JogadorEnigmaId implements Serializable {

    @Column(name = "fk_jogador")
    private Long fkJogador;

    @Column(name = "fk_enigma")
    private Long fkEnigma;

    public JogadorEnigmaId() {}

    public JogadorEnigmaId(Long fkJogador, Long fkEnigma) {
        this.fkJogador = fkJogador;
        this.fkEnigma = fkEnigma;
    }

    public Long getFkJogador() { return fkJogador; }
    public Long getFkEnigma() { return fkEnigma; }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof JogadorEnigmaId that)) return false;
        return Objects.equals(fkJogador, that.fkJogador)
                && Objects.equals(fkEnigma, that.fkEnigma);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fkJogador, fkEnigma);
    }
}
