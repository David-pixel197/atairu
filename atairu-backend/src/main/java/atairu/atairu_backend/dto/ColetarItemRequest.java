package atairu.atairu_backend.dto;

public class ColetarItemRequest {
    private Long jogadorId;
    private Long itemId;
    private Double latitudeJogador;
    private Double longitudeJogador;

    // Getters e Setters
    public Long getJogadorId() { return jogadorId; }
    public void setJogadorId(Long jogadorId) { this.jogadorId = jogadorId; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Double getLatitudeJogador() { return latitudeJogador; }
    public void setLatitudeJogador(Double latitudeJogador) { this.latitudeJogador = latitudeJogador; }

    public Double getLongitudeJogador() { return longitudeJogador; }
    public void setLongitudeJogador(Double longitudeJogador) { this.longitudeJogador = longitudeJogador; }
}