import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const imagesMap: { [key: string]: any } = {
  'sonhador.png': require('../assets/images/catalogo/sonhador.png'),
  'onde_voce_dormiu.png': require('../assets/images/catalogo/onde_voce_dormiu.png'),
};

export default function HistoriasScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'catalogo' | 'jornadas'>('jornadas');
  const [searchText, setSearchText] = useState('');
  
  const [historias, setHistorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetch('http://192.168.1.26:8080/api/historias')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao carregar as histórias do servidor.');
        }
        return response.json();
      })
      .then((data) => {
        setHistorias(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErro('Não foi possível conectar ao servidor.');
        setLoading(false);
      });
  }, []);

  const historiasFiltradas = historias.filter((item) => {
    const termo = searchText.toLowerCase();
    const tituloMatch = item.titulo ? item.titulo.toLowerCase().includes(termo) : false;
    const autorMatch = item.autor ? item.autor.toLowerCase().includes(termo) : false;
    return tituloMatch || autorMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórias</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#7F7F7F" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#7F7F7F"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'catalogo' && styles.tabButtonActive]}
            onPress={() => setActiveTab('catalogo')}
          >
            <Text style={[styles.tabText, activeTab === 'catalogo' && styles.tabTextActive]}>
              Catálogo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'jornadas' && styles.tabButtonActive]}
            onPress={() => setActiveTab('jornadas')}
          >
            <Text style={[styles.tabText, activeTab === 'jornadas' && styles.tabTextActive]}>
              Jornadas
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0E6280" />
            <Text style={styles.loadingText}>Carregando histórias...</Text>
          </View>
        ) : erro ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{erro}</Text>
          </View>
        ) : activeTab === 'catalogo' ? (
          <View style={styles.coversGrid}>
            {historiasFiltradas.map((item) => {
              const imageSource = imagesMap[item.imagem] || { uri: item.imagem };

              return (
                <TouchableOpacity key={item.id} style={styles.coverCard} activeOpacity={0.8}>
                  <ImageBackground
                    source={imageSource}
                    style={styles.coverImageBackground}
                    imageStyle={styles.coverImageStyle}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.journeyList}>
            {historiasFiltradas.map((item) => {
              const progresso = item.progresso ?? (item.publicada ? 100 : 0);
              const isCompleto = progresso === 100;

              return (
                <View key={item.id} style={styles.journeyCard}>
                  <View style={styles.journeyHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.journeyTitle}>{item.titulo}</Text>
                      <Text style={styles.journeyAuthor}>{item.autor}</Text>
                    </View>

                    {item.jogando && (
                      <View style={styles.badgeJogando}>
                        <Text style={styles.badgeJogandoText}>Jogando</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.journeyStatus}>
                    {isCompleto ? 'Completo' : 'Incompleto'}
                  </Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBarFill, { width: `${progresso}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{progresso}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.8}
          onPress={() => {
            router.push('/home');
          }}
        >
          <Ionicons name="close" size={26} color="#000000" />
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
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 24,
    padding: 4,
    marginBottom: 24,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 280,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F7F7F',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  coversGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  coverCard: {
    width: '30%',
    aspectRatio: 0.68,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  coverImageStyle: {
    borderRadius: 12,
  },
  journeyList: {
    gap: 16,
  },
  journeyCard: {
    backgroundColor: '#F4F5F7',
    borderRadius: 16,
    padding: 16,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  journeyAuthor: {
    fontSize: 13,
    color: '#666666',
  },
  badgeJogando: {
    backgroundColor: '#0E6280',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  badgeJogandoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  journeyStatus: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0E6280',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    width: 36,
    textAlign: 'right',
  },
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: '#D9534F',
    fontSize: 14,
    textAlign: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});