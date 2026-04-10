import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom'
        }}
      >
        <Stack.Screen name="index" /> 
        <Stack.Screen name="login" options={{ animation: 'slide_from_bottom' }}/>
        <Stack.Screen name="cadastro" options={{ animation: 'slide_from_bottom' }}/>
        <Stack.Screen name="cadastro2" options={{ animation: 'simple_push' }}/>
        <Stack.Screen name="home" options={{ animation: 'slide_from_bottom' }}/>
        <Stack.Screen name="historias" options={{ animation: 'slide_from_bottom' }}/>
      </Stack>
    </AuthProvider>
  );
}
