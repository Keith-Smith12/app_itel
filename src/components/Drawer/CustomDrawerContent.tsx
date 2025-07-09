import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { authService } from '../../services/authService';

import { ThemedText } from '../../components/ThemedText';

export default function CustomDrawerContent(props: any) {
  const [projetosOpen, setProjetosOpen] = React.useState(false);
  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      // Pode adicionar um alerta se quiser
      console.error('Erro ao terminar sessão:', error);
    }
  };

  const handleProjetosNavigate = (aba: string) => {
    router.push({ pathname: '/(app)/projetos', params: { aba } });
  };

  return (
    <LinearGradient
      colors={["#f8fafc", "#fff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, justifyContent: 'flex-start', paddingVertical: 0 }}>
        {/* Dashboard (Início) */}
        <DrawerItem
          label="Início"
          onPress={() => props.navigation.navigate('home')}
          icon={({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />}
          labelStyle={{ color: '#222', fontWeight: '500', fontSize: 16, paddingVertical: 1 }}
          style={{ paddingVertical: 0 }}
        />
        {/* Boletim de Notas */}
        <DrawerItem
          label="Boletim de Notas"
          onPress={() => props.navigation.navigate('boletim')}
          icon={({ color, size }) => <MaterialCommunityIcons name="school" size={size} color={color} />}
          labelStyle={{ color: '#222', fontWeight: '500', fontSize: 16, paddingVertical: 1 }}
          style={{ paddingVertical: 0 }}
        />
        {/* Pauta Final */}
        <DrawerItem
          label="Pauta Final"
          onPress={() => props.navigation.navigate('pauta')}
          icon={({ color, size }) => <MaterialCommunityIcons name="clipboard-check" size={size} color={color} />}
          labelStyle={{ color: '#222', fontWeight: '500', fontSize: 16, paddingVertical: 1 }}
          style={{ paddingVertical: 0 }}
        />
        {/* Projetos Dropdown */}
        <DrawerItem
          label={() => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color={'#222'} />
              <ThemedText style={{ fontSize: 16, color: '#222', marginLeft: 16, fontWeight: '500', letterSpacing: 0.5 }}>
                Projetos
              </ThemedText>
              <Ionicons
                name={projetosOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={'#222'}
                style={{ marginLeft: 'auto' }}
              />
            </View>
          )}
          onPress={() => setProjetosOpen((prev) => !prev)}
          style={{ paddingVertical: 0 }}
        />
        {projetosOpen && (
          <View style={{ marginLeft: 40, marginTop: 2 }}>
            <DrawerItem
              label="Propostos"
              onPress={() => props.navigation.navigate('projetos')}
              icon={({ color, size }) => <MaterialCommunityIcons name="lightbulb-on-outline" size={size} color={'#222'} />}
              labelStyle={{ color: '#222', fontWeight: '500', fontSize: 16, paddingVertical: 1 }}
              style={{ paddingVertical: 0 }}
            />
            <DrawerItem
              label="Aprovados"
              onPress={() => props.navigation.navigate('Pro_aprovado')}
              icon={({ color, size }) => <MaterialCommunityIcons name="check-circle-outline" size={size} color={'#222'} />}
              labelStyle={{ color: '#222', fontWeight: '500', fontSize: 16, paddingVertical: 1 }}
              style={{ paddingVertical: 0 }}
            />
            <DrawerItem
              label="Concluídos"
              onPress={() => props.navigation.navigate('Pro_concluidos')}
              icon={({ color, size }) => <MaterialCommunityIcons name="check-bold" size={size} color={'#222'} />}
              labelStyle={{ color: '#222', fontWeight: '500', fontSize: 16, paddingVertical: 1 }}
              style={{ paddingVertical: 0 }}
            />
          </View>
        )}
        {/* Perfil */}
        <DrawerItem
          label="Perfil"
          onPress={() => props.navigation.navigate('perfil')}
          icon={({ color, size }) => <MaterialCommunityIcons name="account" size={size} color={color} />}
          labelStyle={{ color: '#222', fontWeight: '500', fontSize: 16, paddingVertical: 1 }}
          style={{ paddingVertical: 0 }}
        />
      </DrawerContentScrollView>
      {/* Terminar sessão fixo no fundo */}
      <DrawerItem
        label="Terminar sessão"
        onPress={handleLogout}
        labelStyle={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}
        style={{ backgroundColor: 'red', marginBottom: 16, borderRadius: 8, marginHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 }}
        icon={() => null}
      />
    </LinearGradient>
  );
}
