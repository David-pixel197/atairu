import React, { createContext, useState, useContext } from 'react';

interface AuthContextData {
  tempUserData: {
    email?: string;
    senha?: string;
    cpf?: string;
    dataNasc?: string;
    nickname?: string;
    nomeCompleto?: string;
    CPF?: string;
  };
  updateTempUserData: (newData: object) => void;
  clearTempData: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tempUserData, setTempUserData] = useState({});

  const updateTempUserData = (newData: object) => {
    setTempUserData((prev) => ({ ...prev, ...newData }));
  };

  const clearTempData = () => setTempUserData({});

  return (
    <AuthContext.Provider value={{ tempUserData, updateTempUserData, clearTempData }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}