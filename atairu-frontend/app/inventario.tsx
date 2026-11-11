import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function InventarioScreen() {
  const router = useRouter();
  const { tempUserData, historiaId } = useAuth();

  const imagensItens: { [key: string]: any } = {
    'livro.png': require('../assets/images/itens/livro.png'),
    'carta.png': require('../assets/images/itens/carta.png'),
    'foto_familia.png': require('../assets/images/itens/foto_familia.png'),
    'antidepressivos.png': require('../assets/images/itens/antidepressivos.png'),
    'celular.png': require('../assets/images/itens/celular.png'),
    'dossie.png': require('../assets/images/itens/dossie.png'),
  };
  
  const [jogador, setJogador] = useState({
    nickname: 'Carregando...',
    km: 0,
    dataCadastro: '--/--/----',
  });

  const [itensInventario, setItensInventario] = useState<any[]>([]);
  const itensVisiveis = historiaId > 0 ? itensInventario : [];
  
  const [itemSelecionado, setItemSelecionado] = useState<any>(null);

  const fetchDadosJogador = async () => {
    try {
      const idUsuario = tempUserData?.jogadorId || -1;
      const response = await fetch(`http://192.168.1.26:8080/api/jogadores/${idUsuario}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do jogador');
      }

      const data = await response.json();
      
      setJogador({
        nickname: data.nickname || 'Sem Nome',
        km: data.km ?? 0,
        dataCadastro: data.dataCadastro ? formatarData(data.dataCadastro) : '--/--/----',
      });
    } catch (error) {
      console.log('Erro ao carregar perfil:', error);
      setJogador(prev => ({ ...prev, nickname: 'Erro ao carregar' }));
    }
  };

  const fetchInventario = async () => {
    if (historiaId <= 0) return;

    try {
      const idUsuario = tempUserData?.jogadorId || 1;
      
      const response = await fetch(`http://192.168.1.26:8080/api/inventario/${idUsuario}/historia/${historiaId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar inventário');
      }

      const data = await response.json();
      setItensInventario(data);
    } catch (error) {
      console.log('Erro ao carregar inventário:', error);
    }
  };

  const formatarData = (dataString: string) => {
    try {
      const dataParte = dataString.split('T')[0];
      const [ano, mes, dia] = dataParte.split('-');
      if (ano && mes && dia) return `${dia}/${mes}/${ano}`;
      return dataString;
    } catch {
      return dataString;
    }
  };

  useEffect(() => {
    fetchDadosJogador();
    fetchInventario();
  }, [historiaId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventário</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/images/avatar.png')}
              style={styles.avatarImage}
            />
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nicknameRow}>
              <Text style={styles.nickname}>{jogador.nickname}</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="pencil" size={16} color="#000000" style={styles.editIcon} />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileDetail}>Distância percorrida: {jogador.km}km</Text>
            <Text style={styles.profileDetail}>Entrou em: {jogador.dataCadastro}</Text>

            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>10 Nível</Text>
              <View style={styles.progressBarBackground}>
                <View style={styles.progressBarFill} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {itensVisiveis.length > 0 ? (
            itensVisiveis.map((inv) => (
              <TouchableOpacity
                key={inv.id}
                style={styles.inventorySlot}
                activeOpacity={0.7}
                onPress={() => inv.item && setItemSelecionado(inv.item)}
              >
                {inv.item?.imagens ? (
                  <Image
                    source={imagensItens[inv.item.imagens]}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Ionicons name="cube-outline" size={24} color="#6B7280" />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum item no inventário.</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={itemSelecionado !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setItemSelecionado(null)}
      >
        <View style={styles.inspectOverlay}>
          {itemSelecionado && (
            <View style={styles.inspectContainer}>
              {/* Botão de fechar */}
              <TouchableOpacity
                style={styles.inspectCloseButton}
                onPress={() => setItemSelecionado(null)}
              >
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              {itemSelecionado.imagens && imagensItens[itemSelecionado.imagens] && (
                <Image
                  source={imagensItens[itemSelecionado.imagens]}
                  style={styles.inspectImage}
                  resizeMode="contain"
                />
              )}

              <Text style={styles.inspectTitle}>{itemSelecionado.nome}</Text>

              <View style={styles.inspectDescriptionBox}>
                <ScrollView 
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styles.scrollTextContent}
                >
                  <Text style={styles.inspectDescriptionText}>
                    {itemSelecionado.descricao 
                      ? itemSelecionado.descricao
                          .replace(/\\n/g, '\n')
                          .replace(/\\\\n/g, '\n')
                          .replace(/\\r\\n/g, '\n')
                      : ''}
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
      </Modal>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.closeButton} activeOpacity={0.8}
        onPress={() => {
              router.push('/home');
            }}>
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileInfo: {
    flex: 1,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  editIcon: {
    marginLeft: 6,
  },
  profileDetail: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  levelContainer: {
    marginTop: 6,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#0E6280',
    borderRadius: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 16,
  },
  inventorySlot: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#D1D5DB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '80%',
    height: '80%',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
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
    elevation: 6,
  },
  inspectOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inspectContainer: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    alignItems: 'center',
  },
  inspectCloseButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    padding: 8,
    zIndex: 10,
  },
  inspectImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  inspectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  inspectDescriptionBox: {
    backgroundColor: 'rgba(25, 25, 25, 0.98)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444444',
    width: '100%',
    maxHeight: 320,
  },
  scrollTextContent: {
    paddingRight: 4,
  },
  inspectDescriptionText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 22,
    textAlign: 'left',
  },
});