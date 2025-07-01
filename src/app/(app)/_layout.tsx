import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React, { useState } from 'react';
import { Switch, useColorScheme, View } from 'react-native';
import CustomDrawerContent from '../../components/Drawer/CustomDrawerContent';
import { ThemedText } from '../../components/ThemedText';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: isDarkMode ? '#fff' : '#333',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Início',
          drawerIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="boletim"
        options={{
          drawerLabel: 'Boletim de Notas',
          drawerIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="school" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="pauta"
        options={{
          drawerLabel: 'Pauta Final',
          drawerIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="clipboard-check" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="projetos"
        options={{
          drawerLabel: 'Projetos',
          drawerIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="perfil"
        options={{
          drawerLabel: 'Perfil',
          drawerIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="theme"
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ThemedText style={{ color: isDarkMode ? '#fff' : '#333' }}>
                {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              </ThemedText>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isDarkMode ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          ),
          drawerIcon: ({ color }: { color: string }) => (
            <MaterialCommunityIcons
              name={isDarkMode ? 'weather-sunny' : 'weather-night'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
}