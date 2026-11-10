package atairu.atairu_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "classificacao")
public class Classificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_classificacao")
    private Long id;

    @NotBlank(message = "O nome da classificação é obrigatório.")
    @Column(nullable = false)
    private String nome;

    private String descricao;

    @NotNull(message = "A idade mínima é obrigatória.")
    @Column(name = "idade_minima", nullable = false)
    private Integer idadeMinima = 0;

    public Classificacao() {}

    // -------------------------
    // Getters & Setters
    // -------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Integer getIdadeMinima() { return idadeMinima; }
    public void setIdadeMinima(Integer idadeMinima) { this.idadeMinima = idadeMinima; }
}