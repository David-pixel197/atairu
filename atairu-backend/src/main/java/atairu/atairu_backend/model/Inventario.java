package atairu.atairu_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "inventario")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_usuario", nullable = false)
    private Jogador usuario;

    @ManyToOne
    @JoinColumn(name = "fk_itens", nullable = false)
    private Item item;

    public Inventario() {}

    // -------------------------
    // Getters & Setters
    // -------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Jogador getUsuario() { return usuario; }
    public void setUsuario(Jogador usuario) { this.usuario = usuario; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
}