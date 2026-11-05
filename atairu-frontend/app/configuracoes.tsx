import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function configuracoes() {
  const [avisosSeguranca, setAvisosSeguranca] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/images/avatar.png')}
            style={styles.avatarImage}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Áudio</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderFill} />
              <View style={styles.sliderThumb} />
            </View>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Avisos de Segurança</Text>
          <Switch
            value={avisosSeguranca}
            onValueChange={setAvisosSeguranca}
            trackColor={{ false: '#D1D5DB', true: '#0E6280' }}
            thumbColor={'#FFFFFF'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Modo escuro</Text>
          <Switch
            value={modoEscuro}
            onValueChange={setModoEscuro}
            trackColor={{ false: '#D1D5DB', true: '#0E6280' }}
            thumbColor={'#FFFFFF'}
          />
        </View>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
          <Text style={styles.settingLabel}>Trocar senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
          <Text style={styles.settingLabel}>Privacidade e Segurança</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
          <Text style={styles.logoutLabel}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.closeButton} activeOpacity={0.8}>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 32,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  actionRow: {
    marginBottom: 28,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D93838',
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderFill: {
    width: '85%',
    height: '100%',
    backgroundColor: '#0E6280',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    right: '15%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0E6280',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
});