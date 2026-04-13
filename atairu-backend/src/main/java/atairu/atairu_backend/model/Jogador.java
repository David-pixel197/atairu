package atairu.atairu_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jogador")
public class Jogador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuarioj")
    private Long id;

    @NotBlank(message = "Nickname é obrigatório.")
    @Column(nullable = false, unique = true)
    private String nickname;

    @NotBlank(message = "Email é obrigatório.")
    @Email(message = "Email inválido.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Senha é obrigatória.")
    @Column(nullable = false)
    private String senha;

    @NotBlank(message = "Nome é obrigatório.")
    @Column(nullable = false)
    private String nome;

    @Column(unique = true)
    private String cpf;

    private String avatar;

    @Column(precision = 10, scale = 2)
    private BigDecimal km = BigDecimal.ZERO;

    private Boolean banido = false;

    @Column(name = "datacadastro", updatable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @Column(name = "datanascimento")
    private LocalDate dataNascimento;

    public Jogador() {}

    // -------------------------
    // Getters & Setters
    // -------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public BigDecimal getKm() { return km; }
    public void setKm(BigDecimal km) { this.km = km; }

    public Boolean getBanido() { return banido; }
    public void setBanido(Boolean banido) { this.banido = banido; }

    public LocalDateTime getDataCadastro() { return dataCadastro; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
}