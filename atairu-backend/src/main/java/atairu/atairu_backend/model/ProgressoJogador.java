package atairu.atairu_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "progresso_jogador")
public class ProgressoJogador {

    @Id
    @Column(name = "fk_historias")
    private Long idHistoria;

    @Column(name = "fk_jogador")
    private Long fkJogador;

    @Column(name = "itens_coletados")
    private int itensColetados;

    @Column(name = "total_itens")
    private int totalItens;

    private double percentual;

    // Getters e Setters
    public Long getIdHistoria() { return idHistoria; }
    public void setIdHistoria(Long idHistoria) { this.idHistoria = idHistoria; }

    public Long getFkJogador() { return fkJogador; }
    public void setFkJogador(Long fkJogador) { this.fkJogador = fkJogador; }

    public int getItensColetados() { return itensColetados; }
    public void setItensColetados(int itensColetados) { this.itensColetados = itensColetados; }

    public int getTotalItens() { return totalItens; }
    public void setTotalItens(int totalItens) { this.totalItens = totalItens; }

    public double getPercentual() { return percentual; }
    public void setPercentual(double percentual) { this.percentual = percentual; }
}