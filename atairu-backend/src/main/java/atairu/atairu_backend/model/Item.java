package atairu.atairu_backend.model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalTime;

@Entity
@Table(name = "itens")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Long idItem;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String imagens;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point localizacao;

    private Double raio;

    private LocalTime abertura;
    
    private LocalTime fechamento;

    @ManyToOne
    @JoinColumn(name = "fk_historia")
    private Historia historia;

    public Item() {}

    // -------------------------
    // Getters & Setters
    // -------------------------

    public Long getIdItem() { return idItem; }
    public void setIdItem(Long idItem) { this.idItem = idItem; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getImagens() { return imagens; }
    public void setImagens(String imagens) { this.imagens = imagens; }

    public Point getLocalizacao() { return localizacao; }
    public void setLocalizacao(Point localizacao) { this.localizacao = localizacao; }

    public Double getRaio() { return raio; }
    public void setRaio(Double raio) { this.raio = raio; }

    public LocalTime getAbertura() { return abertura; }
    public void setAbertura(LocalTime abertura) { this.abertura = abertura; }

    public LocalTime getFechamento() { return fechamento; }
    public void setFechamento(LocalTime fechamento) { this.fechamento = fechamento; }

    public Historia getHistoria() { return historia; }
    public void setHistoria(Historia historia) { this.historia = historia; }
}