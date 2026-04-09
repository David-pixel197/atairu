package atairu.atairu_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "jogador")
public class Jogador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuarioj")
    private Long id;

    @Column(nullable = false, unique = true)
    private String nickname;

    private BigDecimal km = BigDecimal.ZERO;

    private Boolean banido = false;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    private String cpf;

    private String avatar;

    @Column(name = "datacadastro")
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @Column(name = "datanascimento")
    private LocalDateTime dataNascimento;

    @Column(nullable = false)
    private String nome;

    public Jogador() {}

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
}