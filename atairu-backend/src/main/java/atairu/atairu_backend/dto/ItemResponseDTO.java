package atairu.atairu_backend.dto;

import atairu.atairu_backend.model.Item;

public class ItemResponseDTO {
    private Long idItem;
    private String nome;
    private String descricao;
    private String imagens;
    private Double latitude;
    private Double longitude;
    private Double raio;

    public ItemResponseDTO(Item item) {
        this.idItem = item.getIdItem();
        this.nome = item.getNome();
        this.descricao = item.getDescricao();
        this.imagens = item.getImagens();
        this.raio = item.getRaio();

        if (item.getLocalizacao() != null) {
            this.latitude = item.getLocalizacao().getY();
            this.longitude = item.getLocalizacao().getX();
        }
    }

    // Getters e Setters
    public Long getIdItem() { return idItem; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public String getImagens() { return imagens; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Double getRaio() { return raio; }
}