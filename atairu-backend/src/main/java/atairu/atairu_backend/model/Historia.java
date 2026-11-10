package atairu.atairu_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "historias")
public class Historia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historia")
    private Long id;

    @NotBlank(message = "O título é obrigatório.")
    @Column(nullable = false)
    private String titulo;

    private String autor;

    @Column(precision = 10, scale = 2)
    private BigDecimal km;

    @NotBlank(message = "O texto da história é obrigatório.")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    private String imagem;

    @Column(nullable = false)
    private Boolean publicada = false;

    // Relacionamento N:N com Classificacao via tabela associativa
    @ManyToMany
    @JoinTable(
        name = "historias_classificacao",
        joinColumns = @JoinColumn(name = "fk_historias"),
        inverseJoinColumns = @JoinColumn(name = "fk_classificacao")
    )
    private List<Classificacao> classificacoes = new ArrayList<>();

    public Historia() {}

    // -------------------------
    // Getters & Setters
    // -------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public BigDecimal getKm() { return km; }
    public void setKm(BigDecimal km) { this.km = km; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }

    public Boolean getPublicada() { return publicada; }
    public void setPublicada(Boolean publicada) { this.publicada = publicada; }

    public List<Classificacao> getClassificacoes() { return classificacoes; }
    public void setClassificacoes(List<Classificacao> classificacoes) { this.classificacoes = classificacoes; }
}