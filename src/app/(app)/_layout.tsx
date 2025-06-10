import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Início',
          drawerIcon: ({ color }: { color: string }) => (
            <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
              <ThemedText style={{ color, fontSize: 20 }}>🏠</ThemedText>
            </View>
          ),
        }}
      />
      {/* Adicione mais telas aqui conforme necessário */}
    </Drawer>
  );
}