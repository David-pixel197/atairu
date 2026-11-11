package atairu.atairu_backend.service;

import atairu.atairu_backend.dto.ColetarItemRequest;
import atairu.atairu_backend.dto.ItemResponseDTO;
import atairu.atairu_backend.model.Inventario;
import atairu.atairu_backend.model.Jogador;
import atairu.atairu_backend.model.Item;
import atairu.atairu_backend.repository.InventarioRepository;
import atairu.atairu_backend.repository.JogadorRepository;
import atairu.atairu_backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private JogadorRepository jogadorRepository;

    @Autowired
    private ItemRepository itemRepository;

    private double calcularDistanciaEmMetros(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371e3; // Raio da Terra em metros
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public Inventario coletarItem(ColetarItemRequest request) {
        Jogador jogador = jogadorRepository.findById(request.getJogadorId())
                .orElseThrow(() -> new RuntimeException("Jogador não encontrado"));

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        boolean jaPossui = inventarioRepository.existsByUsuarioAndItem(jogador, item);
        if (jaPossui) {
            throw new RuntimeException("Este item já foi coletado!");
        }

        if (item.getLocalizacao() == null) {
            throw new RuntimeException("Este item não possui localização geográfica cadastrada.");
        }

        double itemLat = item.getLocalizacao().getY();
        double itemLon = item.getLocalizacao().getX();

        double distancia = calcularDistanciaEmMetros(
                request.getLatitudeJogador(), 
                request.getLongitudeJogador(),
                itemLat, 
                itemLon
        );

        double raioPermitido = item.getRaio() != null ? item.getRaio() : 30.0;

        if (distancia > raioPermitido) {
            throw new RuntimeException("Você está muito longe do item! Distância: " + Math.round(distancia) + "m (Necessário: " + raioPermitido + "m)");
        }

        Inventario inventario = new Inventario();
        inventario.setUsuario(jogador);
        inventario.setItem(item);

        return inventarioRepository.save(inventario);
    }

    public List<ItemResponseDTO> processarItensIniciaisAutomaticos(Long jogadorId, Long historiaId) {
        Jogador jogador = jogadorRepository.findById(jogadorId)
                .orElseThrow(() -> new RuntimeException("Jogador não encontrado"));

        List<ItemResponseDTO> novosItensDto = new ArrayList<>();
        List<Item> itensDaHistoria = itemRepository.findByHistoria_Id(historiaId);

        for (Item item : itensDaHistoria) {
            if (item.getLocalizacao() != null) {
                double lat = item.getLocalizacao().getY();
                double lon = item.getLocalizacao().getX();

                if (lat == 0.0 && lon == 0.0) {
                    boolean jaPossui = inventarioRepository.existsByUsuarioAndItem(jogador, item);
                    
                    if (!jaPossui) {
                        Inventario inventario = new Inventario();
                        inventario.setUsuario(jogador);
                        inventario.setItem(item);
                        inventarioRepository.save(inventario);

                        novosItensDto.add(new ItemResponseDTO(item));
                    }
                }
            }
        }
        return novosItensDto;
    }
}