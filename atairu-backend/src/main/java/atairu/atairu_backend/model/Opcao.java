package atairu.atairu_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "opcoes")
public class Opcao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_opcao")
    private Long idOpcao;

    private String texto;

    private String imagem;

    private Boolean correto;

    @ManyToOne
    @JoinColumn(name = "fk_enigmas", nullable = false)
    private Enigma enigma;

    public Long getIdOpcao() { return idOpcao; }
    public void setIdOpcao(Long idOpcao) { this.idOpcao = idOpcao; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public Boolean getCorreto() { return correto; }
    public void setCorreto(Boolean correto) { this.correto = correto; }

    public Enigma getEnigma() { return enigma; }
    public void setEnigma(Enigma enigma) { this.enigma = enigma; }
}
