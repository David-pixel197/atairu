package atairu.atairu_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "enigma")
public class Enigma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_enigma")
    private Long idEnigma;

    private String pergunta;

    private String dica;

    @ManyToOne
    @JoinColumn(name = "fk_historia", nullable = false)
    private Historia historia;

    public Long getIdEnigma() { return idEnigma; }
    public void setIdEnigma(Long idEnigma) { this.idEnigma = idEnigma; }

    public String getPergunta() { return pergunta; }
    public void setPergunta(String pergunta) { this.pergunta = pergunta; }

    public String getDica() { return dica; }
    public void setDica(String dica) { this.dica = dica; }

    public Historia getHistoria() { return historia; }
    public void setHistoria(Historia historia) { this.historia = historia; }
}
