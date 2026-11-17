import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  Image,
  Text,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/context/AuthContext';
import BASE_URL from '@/config/api';

const cleanMapStyle = [
  {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  }
];

let MapView: any = null;
let UrlTile: any = null;
let Marker: any = null;
let Circle: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  UrlTile = Maps.UrlTile;
  Marker = Maps.Marker;
  Circle = Maps.Circle;
}

interface ItemPista {
  idItem: number;
  nome: string;
  descricao: string;
  imagens: string;
  latitude: number;
  longitude: number;
  raio: number;
}

interface InventarioItem {
  item: { idItem: number } | null;
}

export default function home() {
  const router = useRouter();
  const { tempUserData } = useAuth();

  const historiaId = tempUserData?.historiaId ?? -1;
  const jogadorId = tempUserData?.jogadorId;

  const [region, setRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pontosDeInteresse, setPontosDeInteresse] = useState<ItemPista[]>([]);
  const [debugTeleportVisible, setDebugTeleportVisible] = useState(false);
  const debugLongPressRef = useRef(false);
  
  const [itemColetadoModal, setItemColetadoModal] = useState<ItemPista | null>(null);

  const imagensItens: { [key: string]: any } = {
    'livro.png': require('../assets/images/itens/livro.png'),
    'carta.png': require('../assets/images/itens/carta.png'),
    'foto_familia.png': require('../assets/images/itens/foto_familia.png'),
    'antidepressivos.png': require('../assets/images/itens/antidepressivos.png'),
    'celular.png': require('../assets/images/itens/celular.png'),
    'dossie.png': require('../assets/images/itens/dossie.png'),
  };

  const fetchItensHistoria = async () => {
    if (historiaId <= 0 || !jogadorId) {
      setPontosDeInteresse([]);
      return;
    }

    setPontosDeInteresse([]);
    try {
      const [responseItens, responseInventario] = await Promise.all([
        fetch(`${BASE_URL}/api/historias/${historiaId}/itens`),
        fetch(`${BASE_URL}/api/inventario/${jogadorId}/historia/${historiaId}`),
      ]);
      if (!responseItens.ok) throw new Error('Erro ao buscar itens da história');
      if (!responseInventario.ok) throw new Error('Erro ao verificar o inventário do jogador');

      const [itensHistoria, inventario]: [ItemPista[], InventarioItem[]] = await Promise.all([
        responseItens.json(),
        responseInventario.json(),
      ]);
      const itensColetados = new Set(
        inventario.flatMap((registro) => registro.item ? [registro.item.idItem] : [])
      );
      setPontosDeInteresse(
        itensHistoria.filter((ponto) => !itensColetados.has(ponto.idItem))
      );
    } catch (error) {
      console.log('Erro ao carregar pistas do backend:', error);
    }
  };

  const fetchCurrentLocation = async () => {
    setLoadingLocation(true);

    if (Platform.OS === 'web') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
            setLoadingLocation(false);
          },
          (error) => {
            console.log('Erro de geolocalização web:', error);
            setLoadingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      } else {
        setLoadingLocation(false);
      }
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos de permissão de acesso à localização para mostrar a sua posição real no mapa.'
        );
        setLoadingLocation(false);
        return;
      }

      let lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        setRegion({
          latitude: lastKnown.coords.latitude, 
          longitude: lastKnown.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      console.log('Erro ao obter localização mobile:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const calcularDistanciaEmMetros = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const abrirDebugTeleport = () => {
    setDebugTeleportVisible(true);
  };

  const teleportarParaPista = (ponto: ItemPista) => {
    setRegion((atual) => ({
      ...atual,
      latitude: ponto.latitude,
      longitude: ponto.longitude,
    }));
    setDebugTeleportVisible(false);
  };

  const handlePressionarPista = async (ponto: ItemPista) => {
    const distancia = calcularDistanciaEmMetros(
      region.latitude,
      region.longitude,
      ponto.latitude,
      ponto.longitude
    );

    const raioPermitido = ponto.raio || 30;

    if (distancia > raioPermitido) {
      Alert.alert(
        "Muito longe!",
        `Você está a ${Math.round(distancia)} metros deste item. Chegue mais perto (dentro de ${raioPermitido}m) para coletá-lo.`
      );
      return;
    }

    try {
      const idUsuario = tempUserData?.jogadorId || 1;
      
      const response = await fetch(`${BASE_URL}/api/inventario/coletar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jogadorId: idUsuario,
          itemId: ponto.idItem,
          latitudeJogador: region.latitude,
          longitudeJogador: region.longitude,
        }),
      });

      const respostaTexto = await response.text();

      if (!response.ok) {
        throw new Error(respostaTexto || 'Erro ao coletar item');
      }

      setItemColetadoModal(ponto);
      setPontosDeInteresse(prev => prev.filter(p => p.idItem !== ponto.idItem));

    } catch (error: any) {
      console.log('Erro detalhado:', error);
      Alert.alert("Motivo do Erro", error.message);
    }
  };

  const verificarItensIniciaisAutomaticos = async () => {
    if (historiaId <= 0) return;

    try {
      const idUsuario = tempUserData?.jogadorId || 1;
      
      const response = await fetch(`${BASE_URL}/api/inventario/verificar-iniciais?jogadorId=${idUsuario}&historiaId=${historiaId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const novosItens = await response.json();

        if (novosItens && novosItens.length > 0) {
          setItemColetadoModal(novosItens[0]);
        }

        fetchItensHistoria();
      }
    } catch (error) {
      console.log('Erro ao processar itens iniciais automáticos:', error);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
    fetchItensHistoria();
    verificarItensIniciaisAutomaticos();
  }, [tempUserData?.historiaId, tempUserData?.jogadorId]);

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.webMapContainer}>
          <iframe
            title="Mapa da Jornada"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${region.longitude - 0.01}%2C${region.latitude - 0.01}%2C${region.longitude + 0.01}%2C${region.latitude + 0.01}&layer=mapnik&marker=${region.latitude}%2C${region.longitude}`}
          />
        </View>
      ) : (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={false}
          showsMyLocationButton={false}
          loadingEnabled={true}
          showsPointsOfInterest={false}
          customMapStyle={cleanMapStyle}
        >
          <UrlTile
            urlTemplate="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
            maximumZ={19}
          />
          
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="Você está aqui"
          >
            <View style={styles.customMarkerContainer}>
              <Image
                source={require("../assets/images/pin.png")}
                style={styles.markerImage}
                resizeMode="contain"
              />
            </View>
          </Marker>

          {pontosDeInteresse.map((ponto) => (
            <React.Fragment key={ponto.idItem.toString()}>
              <Marker
                coordinate={{
                  latitude: ponto.latitude,
                  longitude: ponto.longitude,
                }}
                title={ponto.nome}
                onPress={() => handlePressionarPista(ponto)}
              >
                <View style={styles.customMarkerContainer}>
                  <Image
                    source={require("../assets/images/ponto_interesse.png")}
                    style={styles.markerImage}
                    resizeMode="contain"
                  />
                </View>
              </Marker>

              {ponto.raio && (
                <Circle
                  center={{
                    latitude: ponto.latitude,
                    longitude: ponto.longitude,
                  }}
                  radius={ponto.raio}
                  strokeColor="rgba(14, 98, 128, 0.5)"
                  fillContent="rgba(14, 98, 128, 0.15)"
                  fillColor="rgba(14, 98, 128, 0.15)"
                />
              )}
            </React.Fragment>
          ))}
        </MapView>
      )}

      <Modal
        visible={itemColetadoModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setItemColetadoModal(null)}
      >
        <TouchableOpacity 
          style={styles.rewardOverlay} 
          activeOpacity={1} 
          onPress={() => setItemColetadoModal(null)}
        >
          <View style={styles.rewardContent}>
            <Text style={styles.rewardHeaderTitle}>Novo Item{'\n'}desbloqueado!</Text>

            {itemColetadoModal && imagensItens[itemColetadoModal.imagens] && (
              <Image
                source={imagensItens[itemColetadoModal.imagens]}
                style={styles.rewardItemImage}
                resizeMode="contain"
              />
            )}

            <Text style={styles.rewardItemName}>
              {itemColetadoModal?.nome}
            </Text>

            <Text style={styles.rewardFooterText}>Clique para continuar</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={debugTeleportVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDebugTeleportVisible(false)}
      >
        <View style={styles.debugOverlay}>
          <View style={styles.debugDialog}>
            <Text style={styles.debugTitle}>Teleporte de debug</Text>
            <Text style={styles.debugDescription}>Selecione uma pista para teleportar até ela.</Text>

            {pontosDeInteresse.length > 0 ? (
              <ScrollView style={styles.debugPointList}>
                {pontosDeInteresse.map((ponto) => (
                  <TouchableOpacity
                    key={ponto.idItem}
                    style={styles.debugPointButton}
                    onPress={() => teleportarParaPista(ponto)}
                  >
                    <View style={styles.debugPointTextContainer}>
                      <Text style={styles.debugPointName}>{ponto.nome}</Text>
                      <Text style={styles.debugPointDescription} numberOfLines={2}>
                        {ponto.descricao}
                      </Text>
                    </View>
                    <Ionicons name="navigate" size={20} color="#0E6280" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.debugEmptyText}>Não há pistas disponíveis para esta história.</Text>
            )}

            <TouchableOpacity
              style={styles.debugCancelButton}
              onPress={() => setDebugTeleportVisible(false)}
            >
              <Text style={styles.debugCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loadingLocation && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#0E6280" />
            <Text style={styles.loadingText}>Obtendo sua localização...</Text>
          </View>
        </View>
      )}

      {menuOpen && (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      )}

      <View style={styles.topRightContainer}>
        <TouchableOpacity
          style={styles.compassButton}
          activeOpacity={0.8}
          delayLongPress={5000}
          onPressIn={() => {
            debugLongPressRef.current = false;
          }}
          onLongPress={() => {
            debugLongPressRef.current = true;
            abrirDebugTeleport();
          }}
          onPress={() => {
            if (debugLongPressRef.current) {
              debugLongPressRef.current = false;
              return;
            }
            fetchCurrentLocation();
          }}
        >
          <Ionicons name="compass" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRightContainer}>
        {menuOpen && (
          <View style={styles.menuOptionsWrapper}>
            {historiaId > 0 && (
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemHighlight]}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/resolver_caso');
                }}
              >
                <Text style={[styles.menuText, styles.menuTextHighlight]}>Resolver Caso</Text>
                <Ionicons name="finger-print" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push('/inventario');
              }}
            >
              <Text style={styles.menuText}>Inventário</Text>
              <Ionicons name="cube-outline" size={22} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push('/historias');
              }}
            >
              <Text style={styles.menuText}>Histórias</Text>
              <Ionicons name="book-outline" size={22} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push('/configuracoes');
              }}
            >
              <Text style={styles.menuText}>Configuração</Text>
              <Ionicons name="settings-outline" size={22} color="#000000" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.8}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Ionicons name={menuOpen ? "close" : "menu"} size={26} color="#000000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    flex: 1,
  },
  webMapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    zIndex: 20,
  },
  loadingBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  loadingText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 13,
    fontWeight: '600',
  },
  topRightContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  compassButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E6280',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomRightContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 10,
    alignItems: 'flex-end',
  },
  menuOptionsWrapper: {
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    width: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItemHighlight: {
    backgroundColor: '#0E6280',
  },
  menuText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  menuTextHighlight: {
    color: '#FFFFFF',
  },
  menuButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  rewardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rewardContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  rewardItemImage: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  rewardItemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 60,
  },
  rewardFooterText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    fontWeight: '500',
  },
  debugOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  debugDialog: {
    maxHeight: '75%',
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  debugTitle: {
    color: '#1A1A1A',
    fontSize: 20,
    fontWeight: 'bold',
  },
  debugDescription: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 14,
  },
  debugPointList: {
    flexGrow: 0,
  },
  debugPointButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  debugPointTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  debugPointName: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '600',
  },
  debugPointDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },
  debugEmptyText: {
    color: '#6B7280',
    paddingVertical: 16,
  },
  debugCancelButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  debugCancelText: {
    color: '#0E6280',
    fontSize: 15,
    fontWeight: '600',
  },
});