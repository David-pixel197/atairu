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
  Modal,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import BASE_URL from '@/config/api';

const imagesMap: { [key: string]: any } = {
  'sonhador.png': require('../assets/images/catalogo/sonhador.png'),
  'onde_voce_dormiu.png': require('../assets/images/catalogo/onde_voce_dormiu.png'),
};

export default function HistoriasScreen() {
  const router = useRouter();
  const { tempUserData, updateTempUserData } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'catalogo' | 'jornadas'>('jornadas');
  const [searchText, setSearchText] = useState('');
  
  const [catalogoHistorias, setCatalogoHistorias] = useState<any[]>([]);
  const [jornadasHistorias, setJornadasHistorias] = useState<any[]>([]);
  const [progressoJornadas, setProgressoJornadas] = useState<any[]>([]);
  
  const [historiaModal, setHistoriaModal] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const jogadorId = tempUserData?.jogadorId;
  const historiaIdAtiva = tempUserData?.historiaId ?? -1;

  async function carregarDados() {
    try {
      setLoading(true);

      const responseCatalogo = await fetch(`${BASE_URL}/api/historias`);
      if (!responseCatalogo.ok) throw new Error('Erro ao carregar o catálogo.');
      const dataCatalogo = await responseCatalogo.json();
      setCatalogoHistorias(dataCatalogo);

      if (jogadorId) {
        const responseJornadas = await fetch(`${BASE_URL}/api/historias/jogador/${jogadorId}`);
        if (!responseJornadas.ok) throw new Error('Erro ao carregar as jornadas.');
        const dataJornadas = await responseJornadas.json();
        setJornadasHistorias(dataJornadas);

        const responseProgresso = await fetch(`${BASE_URL}/api/historias/progresso/jogador/${jogadorId}`);
        if (responseProgresso.ok) {
          const dataProgresso = await responseProgresso.json();
          setProgressoJornadas(dataProgresso);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível conectar ao servidor.');
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [jogadorId]);

  const selecionarHistoriaAtiva = async (novaHistoriaId: number) => {
    try {
      if (jogadorId) {
        await fetch(`${BASE_URL}/api/historias/${novaHistoriaId}/jogador/${jogadorId}`, {
          method: 'POST',
        });
      }

      updateTempUserData({ historiaId: novaHistoriaId });
      setHistoriaModal(null);

      router.push('/home');
    } catch (error) {
      console.error('Erro ao iniciar jornada:', error);
    }
  };

  const alternarJornadaLocal = (idClicado: number) => {
    const novoId = historiaIdAtiva === idClicado ? -1 : idClicado;
    updateTempUserData({ historiaId: novoId });
  };

  const confirmarExclusaoJornada = (item: any) => {
    const itemId = item.idHistoria || item.id;

    Alert.alert(
      'Apagar Jornada',
      `Tem certeza que deseja apagar "${item.titulo}"? Todo o seu progresso e os itens coletados nesta história serão excluídos permanentemente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => executarExclusaoJornada(itemId),
        },
      ]
    );
  };

  const executarExclusaoJornada = async (itemId: number) => {
    if (!jogadorId) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/historias/${itemId}/jogador/${jogadorId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Falha ao apagar jornada no servidor.');

      setJornadasHistorias((prev) =>
        prev.filter((h) => (h.idHistoria || h.id) !== itemId)
      );

      setProgressoJornadas((prev) =>
        prev.filter((p) => p.idHistoria !== itemId)
      );

      if (historiaIdAtiva === itemId) {
        updateTempUserData({ historiaId: -1 });
      }
    } catch (error) {
      console.error('Erro ao apagar jornada:', error);
      Alert.alert('Erro', 'Não foi possível apagar a jornada. Tente novamente.');
    }
  };

  const compartilharHistoria = async (historia: any) => {
    try {
      await Share.share({
        message: `Confira a história "${historia.titulo}" por ${historia.autor}!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const listaAtual = activeTab === 'catalogo' ? catalogoHistorias : jornadasHistorias;

  const historiasFiltradas = listaAtual.filter((item) => {
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
              const itemId = item.idHistoria || item.id;

              return (
                <TouchableOpacity 
                  key={itemId} 
                  style={styles.coverCard} 
                  activeOpacity={0.8}
                  onPress={() => setHistoriaModal(item)}
                >
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
            {historiasFiltradas.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma jornada iniciada ainda.</Text>
            ) : (
              historiasFiltradas.map((item) => {
                const itemId = item.idHistoria || item.id;
                
                const progressoItem = progressoJornadas.find((p) => p.idHistoria === itemId);
                const percentual = Math.round(progressoItem?.percentual ?? 0);
                
                const isCompleto = progressoItem?.resolvido === true;
                const isJogando = historiaIdAtiva === itemId;

                return (
                  <TouchableOpacity 
                    key={itemId} 
                    style={styles.journeyCard}
                    activeOpacity={0.9}
                    onPress={() => alternarJornadaLocal(itemId)}
                    onLongPress={() => confirmarExclusaoJornada(item)}
                    delayLongPress={500}
                  >
                    <View style={styles.journeyHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.journeyTitle}>{item.titulo}</Text>
                        <Text style={styles.journeyAuthor}>{item.autor}</Text>
                      </View>

                      {isJogando && (
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
                        <View style={[styles.progressBarFill, { width: `${percentual}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{percentual}%</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={historiaModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setHistoriaModal(null)}
      >
        <View style={styles.modalOverlay}>
          {historiaModal && (() => {
            const idadeMinima = historiaModal.classificacoes?.[0]?.idadeMinima ?? 0;
            const isLivre = idadeMinima === 0;

            return (
              <View style={styles.modalCard}>
                <View style={styles.modalTopRow}>
                  <View style={styles.modalMetaRow}>
                    <View
                      style={[
                        styles.ageBadge,
                        { backgroundColor: isLivre ? '#0C9447' : '#F5B800' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.ageBadgeText,
                          { color: isLivre ? '#FFFFFF' : '#000000' },
                        ]}
                      >
                        {isLivre ? 'L' : `A${idadeMinima}`}
                      </Text>
                    </View>
                    <Text style={styles.modalMetaText}>2026</Text>
                    <Text style={styles.modalMetaText}>
                      {historiaModal.km != null ? `${historiaModal.km} Km` : ''}
                    </Text>
                    <TouchableOpacity onPress={() => compartilharHistoria(historiaModal)}>
                      <Ionicons name="share-social-outline" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => setHistoriaModal(null)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={32} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>{historiaModal.titulo}</Text>

                <ScrollView style={styles.modalSinopseScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalSinopse}>
                    {historiaModal.texto || 'Sem descrição disponível.'}
                  </Text>
                </ScrollView>

                <Text style={styles.modalAuthor}>{historiaModal.autor}</Text>

                <TouchableOpacity
                  style={styles.playButton}
                  activeOpacity={0.85}
                  onPress={() => selecionarHistoriaAtiva(historiaModal.id)}
                >
                  <Ionicons name="play" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.playButtonText}>Jogar</Text>
                </TouchableOpacity>
              </View>
            );
          })()}
        </View>
      </Modal>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.8}
          onPress={() => router.push('/home')}
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
    backgroundColor: '#FFFFFF' 
  },
  header: { 
    paddingVertical: 16, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000000' 
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 100 
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F2F2F2', 
    borderRadius: 24, 
    paddingHorizontal: 16, 
    height: 48, 
    marginBottom: 20 
  },
  searchIcon: { 
    marginRight: 8 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#000000' 
  },
  tabsContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F2F2F2', 
    borderRadius: 24, 
    padding: 4, 
    marginBottom: 24, 
    alignSelf: 'center', 
    width: '100%', 
    maxWidth: 280 
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 20 
  },
  tabButtonActive: { 
    backgroundColor: '#1A1A1A' 
  },
  tabText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#7F7F7F' 
  },
  tabTextActive: { 
    color: '#FFFFFF' 
  },
  coversGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12 },
  coverCard: { 
    width: '30%', 
    aspectRatio: 0.68, 
    backgroundColor: '#1A1A1A', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 3 
  },
  coverImageBackground: { 
    width: '100%', 
    height: '100%', 
    justifyContent: 'flex-end' 
  },
  coverImageStyle: { 
    borderRadius: 12 
  },
  journeyList: { 
    gap: 16 
  },
  journeyCard: { 
    backgroundColor: '#F4F5F7', 
    borderRadius: 16, 
    padding: 16 
  },
  journeyHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 8 
  },
  journeyTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000000', 
    marginBottom: 2 
  },
  journeyAuthor: { 
    fontSize: 13, 
    color: '#666666' 
  },
  badgeJogando: { 
    backgroundColor: '#0E6280', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8, 
    marginLeft: 8 
  },
  badgeJogandoText: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  journeyStatus: { 
    fontSize: 14, 
    color: '#333333', 
    marginBottom: 8 
  },
  progressContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
  },
  progressBarBackground: { 
    flex: 1, 
    height: 8, 
    backgroundColor: '#D1D5DB', 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#0E6280', 
    borderRadius: 4 
  },
  progressText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#333333', 
    width: 36, 
    textAlign: 'right' 
  },
  centerContainer: { 
    paddingVertical: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#666', 
    fontSize: 14 
  },
  errorText: { 
    color: '#D9534F', 
    fontSize: 14, 
    textAlign: 'center' 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#7F7F7F', 
    marginTop: 20, 
    fontSize: 15 
  },
  footerContainer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 0, 
    right: 0, 
    alignItems: 'center' 
  },
  closeButton: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ageBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  modalSinopseScroll: {
    maxHeight: 260,
    marginBottom: 12,
  },
  modalSinopse: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#333333',
    textAlign: 'left',
  },
  modalAuthor: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'right',
    marginBottom: 18,
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#0E6280',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});