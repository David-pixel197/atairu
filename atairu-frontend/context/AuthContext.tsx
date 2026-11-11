import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Tipagem exata dos dados temporários
export interface TempUserData {
  email?: string;
  senha?: string;
  cpf?: string;
  dataNasc?: string;
  nickname?: string;
  nomeCompleto?: string;
  jogadorId?: number;
}

interface AuthContextData {
  tempUserData: TempUserData;
  updateTempUserData: (newData: TempUserData) => void;
  clearTempData: () => void;
  historiaId: number;
  updateHistoriaId: (historiaId: number) => Promise<void>;
}

const STORAGE_KEY = '@atairu:tempUserData';
const HISTORIA_STORAGE_KEY = '@idHistoriaAtiva';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tempUserData, setTempUserData] = useState<TempUserData>({});
  const [historiaId, setHistoriaId] = useState(-1);
  const historiaFoiAtualizada = useRef(false);

  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          setTempUserData(JSON.parse(storedData));
        }

        const storedHistoriaId = await AsyncStorage.getItem(HISTORIA_STORAGE_KEY);
        const parsedHistoriaId = storedHistoriaId === null ? -1 : Number(storedHistoriaId);
        if (!historiaFoiAtualizada.current && Number.isInteger(parsedHistoriaId)) {
          setHistoriaId(parsedHistoriaId);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do armazenamento:', error);
      }
    }

    loadStoredData();
  }, []);

  const updateTempUserData = async (newData: TempUserData) => {
    setTempUserData((prev) => {
      const updated = { ...prev, ...newData };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.error('Erro ao salvar no AsyncStorage:', err)
      );
      return updated;
    });
  };

  const clearTempData = async () => {
    setTempUserData({});
    setHistoriaId(-1);
    historiaFoiAtualizada.current = true;
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, HISTORIA_STORAGE_KEY]);
    } catch (error) {
      console.error('Erro ao limpar dados temporários do AsyncStorage:', error);
    }
  };

  const updateHistoriaId = async (newHistoriaId: number) => {
    historiaFoiAtualizada.current = true;
    setHistoriaId(newHistoriaId);
    try {
      await AsyncStorage.setItem(HISTORIA_STORAGE_KEY, String(newHistoriaId));
    } catch (error) {
      console.error('Erro ao salvar a história ativa:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ tempUserData, updateTempUserData, clearTempData, historiaId, updateHistoriaId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}