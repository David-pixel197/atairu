import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import BASE_URL from '@/config/api';

const imagensSuspeitos: Record<string, ImageSourcePropType> = {
  'detetive_perfil.png': require('../assets/images/suspeitos/detetive_perfil.png'),
  'mulher_perfil.png': require('../assets/images/suspeitos/mulher_perfil.png'),
  'amante_perfil.png': require('../assets/images/suspeitos/amante_perfil.png'),
};

interface OpcaoEnigma {
  idOpcao: number;
  texto: string;
  imagem: string | null;
}

interface Enigma {
  idEnigma: number;
  pergunta: string;
  dica: string | null;
  dicaRevelada: boolean;
  desvendado: boolean;
  opcoes: OpcaoEnigma[];
}

async function buscarEnigma(jogadorId: number): Promise<Enigma> {
  const response = await fetch(
    `${BASE_URL}/api/enigmas/1?jogadorId=${jogadorId}`
  );
  if (!response.ok) {
    const mensagem = await response.text();
    throw new Error(mensagem || 'Não foi possível carregar o enigma.');
  }

  return response.json();
}

export default function ResolverCasoScreen() {
  const router = useRouter();
  const { tempUserData } = useAuth();
  const jogadorId = tempUserData?.jogadorId;

  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);
  const [enigma, setEnigma] = useState<Enigma | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState('');

  const carregarEnigma = useCallback(async () => {
    if (!jogadorId) {
      setEnigma(null);
      setCarregando(false);
      setErroCarregamento('Não foi possível identificar o jogador.');
      return;
    }

    setCarregando(true);
    setErroCarregamento('');
    setEnigma(null);
    setOpcaoSelecionada(null);
    try {
      const dados = await buscarEnigma(jogadorId);
      setEnigma(dados);
      setOpcaoSelecionada(null);
    } catch (error) {
      setErroCarregamento(
        error instanceof Error ? error.message : 'Não foi possível conectar ao servidor.'
      );
    } finally {
      setCarregando(false);
    }
  }, [jogadorId]);

  useEffect(() => {
    if (!jogadorId) return;

    let ativo = true;
    const carregar = async () => {
      try {
        const dados = await buscarEnigma(jogadorId);
        if (ativo) {
          setEnigma(dados);
          setOpcaoSelecionada(null);
        }
      } catch (error) {
        if (ativo) {
          setErroCarregamento(
            error instanceof Error ? error.message : 'Não foi possível conectar ao servidor.'
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    void carregar();
    return () => {
      ativo = false;
    };
  }, [jogadorId]);

  const handleRevelarDica = () => {
    Alert.alert(
      'Revelar Dica',
      'Deseja revelar a pista extra deste caso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Revelar',
          onPress: revelarDica,
        },
      ]
    );
  };

  const revelarDica = async () => {
    if (!enigma || !jogadorId) return;

    setProcessando(true);
    try {
      const response = await fetch(`${BASE_URL}/api/enigmas/${enigma.idEnigma}/dica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jogadorId }),
      });
      if (!response.ok) {
        const mensagem = await response.text();
        throw new Error(mensagem || 'Não foi possível revelar a dica.');
      }

      const dados = await response.json();
      setEnigma((atual) =>
        atual
          ? {
              ...atual,
              dica: dados.dica,
              dicaRevelada: dados.dicaRevelada,
              desvendado: dados.desvendado,
            }
          : atual
      );
    } catch (error) {
      Alert.alert(
        'Erro ao revelar dica',
        error instanceof Error ? error.message : 'Não foi possível conectar ao servidor.'
      );
    } finally {
      setProcessando(false);
    }
  };

  const confirmarAcusacao = () => {
    if (!opcaoSelecionada || !enigma) return;

    const suspeito = enigma.opcoes.find((o) => o.idOpcao === opcaoSelecionada);

    Alert.alert(
      'Confirmar Acusação',
      `Tem certeza que deseja apontar "${suspeito?.texto}" como culpado(a)?`,
      [
        { text: 'Revisar Pistas', style: 'cancel' },
        {
          text: 'Acusar',
          style: 'destructive',
          onPress: validarPalpite,
        },
      ]
    );
  };

  const validarPalpite = async () => {
    if (!opcaoSelecionada || !enigma || !jogadorId) return;

    setProcessando(true);
    try {
      const response = await fetch(`${BASE_URL}/api/enigmas/${enigma.idEnigma}/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jogadorId, idOpcao: opcaoSelecionada }),
      });
      if (!response.ok) {
        const mensagem = await response.text();
        throw new Error(mensagem || 'Não foi possível validar a acusação.');
      }

      const resultado = await response.json();
      setEnigma((atual) =>
        atual ? { ...atual, desvendado: resultado.desvendado } : atual
      );
      Alert.alert(
        resultado.correto ? 'Caso Solucionado!' : 'Acusação Incorreta',
        resultado.mensagem
      );
      if (!resultado.correto) {
        setOpcaoSelecionada(null);
      }
    } catch (error) {
      Alert.alert(
        'Erro ao validar acusação',
        error instanceof Error ? error.message : 'Não foi possível conectar ao servidor.'
      );
    } finally {
      setProcessando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resolver Caso</Text>
        <TouchableOpacity
          onPress={carregarEnigma}
          disabled={carregando || processando}
        >
          <Ionicons name="refresh" size={22} color="#0E6280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {enigma?.desvendado && (
          <View style={styles.solvedBanner}>
            <Ionicons name="checkmark-circle" size={30} color="#0C9447" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.solvedTitle}>Mistério Desvendado!</Text>
              <Text style={styles.solvedSubtitle}>
                Você solucionou este caso com sucesso.
              </Text>
            </View>
          </View>
        )}

        {!jogadorId ? (
          <View style={styles.loadError}>
            <Text style={styles.loadErrorText}>Não foi possível identificar o jogador.</Text>
          </View>
        ) : carregando ? (
          <ActivityIndicator size="large" color="#0E6280" />
        ) : enigma ? (
          <>
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Ionicons name="search-circle" size={24} color="#0E6280" />
                <Text style={styles.questionLabel}>A PERGUNTA FINAL</Text>
              </View>
              <Text style={styles.questionText}>{enigma.pergunta}</Text>

              <View style={styles.hintContainer}>
                {enigma.dicaRevelada ? (
                  <View style={styles.hintBoxRevealed}>
                    <Ionicons name="bulb" size={18} color="#B45309" style={{ marginRight: 8 }} />
                    <Text style={styles.hintTextRevealed}>{enigma.dica}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.hintButton}
                    activeOpacity={0.8}
                    onPress={handleRevelarDica}
                    disabled={processando}
                  >
                    <Ionicons name="bulb-outline" size={18} color="#0E6280" style={{ marginRight: 6 }} />
                    <Text style={styles.hintButtonText}>Precisa de ajuda? Revelar Dica</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Selecione o Culpado</Text>

            <View style={styles.suspectsGrid}>
              {enigma.opcoes.map((opcao) => {
                const isSelected = opcaoSelecionada === opcao.idOpcao;
                const imagemLocal = opcao.imagem
                  ? imagensSuspeitos[opcao.imagem]
                  : undefined;

                return (
                  <TouchableOpacity
                    key={opcao.idOpcao}
                    style={[
                      styles.suspectCard,
                      isSelected && styles.suspectCardSelected,
                      enigma.desvendado && styles.suspectCardDisabled,
                    ]}
                    activeOpacity={0.85}
                    disabled={enigma.desvendado || processando}
                    onPress={() => setOpcaoSelecionada(opcao.idOpcao)}
                  >
                    <View style={styles.suspectAvatarContainer}>
                      {imagemLocal ? (
                        <Image source={imagemLocal} style={styles.suspectAvatar} />
                      ) : (
                        <View style={[styles.suspectAvatar, styles.suspectAvatarPlaceholder]}>
                          <Ionicons name="person-outline" size={34} color="#6B7280" />
                        </View>
                      )}

                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.suspectName,
                        isSelected && styles.suspectNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {opcao.texto}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <View style={styles.loadError}>
            <Text style={styles.loadErrorText}>
              {erroCarregamento || 'Não foi possível carregar o enigma.'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={carregarEnigma}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {enigma && !enigma.desvendado && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.accuseButton,
              (!opcaoSelecionada || processando) && styles.accuseButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!opcaoSelecionada || processando}
            onPress={confirmarAcusacao}
          >
            {processando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="finger-print" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.accuseButtonText}>Confirmar Acusação</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  solvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  solvedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
  },
  solvedSubtitle: {
    fontSize: 13,
    color: '#047857',
    marginTop: 2,
  },
  questionCard: {
    backgroundColor: '#F4F5F7',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0E6280',
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  questionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 24,
  },
  hintContainer: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
  },
  hintButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E6280',
  },
  hintBoxRevealed: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
  },
  hintTextRevealed: {
    flex: 1,
    fontSize: 13.5,
    color: '#92400E',
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  suspectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  suspectCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  suspectCardSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0E6280',
  },
  suspectCardDisabled: {
    opacity: 0.7,
  },
  suspectAvatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  suspectAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E5E7EB',
    resizeMode: 'cover',
  },
  suspectAvatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0E6280',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  suspectName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  suspectNameSelected: {
    color: '#0E6280',
  },
  loadError: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadErrorText: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
  },
  retryButtonText: {
    color: '#0E6280',
    fontWeight: '600',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  accuseButton: {
    flexDirection: 'row',
    backgroundColor: '#0E6280',
    paddingVertical: 15,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  accuseButtonDisabled: {
    backgroundColor: '#9CA3AF',
    elevation: 0,
  },
  accuseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});