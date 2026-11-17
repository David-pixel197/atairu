package atairu.atairu_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "jogador_enigma")
public class JogadorEnigma {

    @EmbeddedId
    private JogadorEnigmaId id;

    @Column(name = "desvendado")
    private Boolean desvendado = false;

    @Column(name = "dica_revelada")
    private Boolean dicaRevelada = false;

    public JogadorEnigma() {}

    public JogadorEnigma(Long jogadorId, Long enigmaId) {
        this.id = new JogadorEnigmaId(jogadorId, enigmaId);
    }

    public JogadorEnigmaId getId() { return id; }
    public void setId(JogadorEnigmaId id) { this.id = id; }

    public Boolean getDesvendado() { return desvendado; }
    public void setDesvendado(Boolean desvendado) { this.desvendado = desvendado; }

    public Boolean getDicaRevelada() { return dicaRevelada; }
    public void setDicaRevelada(Boolean dicaRevelada) { this.dicaRevelada = dicaRevelada; }
}
