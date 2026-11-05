import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Tipagem exata dos dados temporários
export interface TempUserData {
  email?: string;
  senha?: string;
  cpf?: string;
  dataNasc?: string;
  nickname?: string;
  nomeCompleto?: string;
  CPF?: string;
  jogadorId?: number;
}

interface AuthContextData {
  tempUserData: TempUserData;
  updateTempUserData: (newData: TempUserData) => void;
  clearTempData: () => void;
}

const STORAGE_KEY = '@atairu:tempUserData';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tempUserData, setTempUserData] = useState<TempUserData>({});

  // 2. Carrega os dados salvos no AsyncStorage assim que o app inicia
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          setTempUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Erro ao carregar dados temporários do armazenamento:', error);
      }
    }

    loadStoredData();
  }, []);

  // 3. Atualiza o estado e persiste no AsyncStorage
  const updateTempUserData = async (newData: TempUserData) => {
    setTempUserData((prev) => {
      const updated = { ...prev, ...newData };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.error('Erro ao salvar no AsyncStorage:', err)
      );
      return updated;
    });
  };

  // 4. Limpa o estado e remove do AsyncStorage
  const clearTempData = async () => {
    setTempUserData({});
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados temporários do AsyncStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ tempUserData, updateTempUserData, clearTempData }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}