import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  Image,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

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

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  UrlTile = Maps.UrlTile;
  Marker = Maps.Marker;
}

export default function home() {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const pontosDeInteresse = [
    { id: '1', latitude: -23.493149, longitude: -46.853933, title: 'Pista 1', description: 'Primeira Pista do Caso' },
    { id: '2', latitude: -23.516416, longitude: -46.856607, title: 'Monumento 1', description: 'Primeiro Local de Interesse' },
  ];

  const fetchCurrentLocation = async () => {
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
          },
          (error) => {
            console.log('Erro de geolocalização web:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
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
        return;
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
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

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
            <Marker
              key={ponto.id}
              coordinate={{
                latitude: ponto.latitude,
                longitude: ponto.longitude,
              }}
              title={ponto.title}
              description={ponto.description}
            >
              <View style={styles.customMarkerContainer}>
                <Image
                  source={require("../assets/images/ponto_interesse.png")}
                  style={styles.markerImage}
                  resizeMode="contain"
                />
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {menuOpen && (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      )}

      <View style={styles.topRightContainer}>
        <TouchableOpacity
          style={styles.compassButton}
          activeOpacity={0.8}
          onPress={fetchCurrentLocation}
        >
          <Ionicons name="compass" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRightContainer}>
        {menuOpen && (
          <View style={styles.menuOptionsWrapper}>
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
  menuText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
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
});