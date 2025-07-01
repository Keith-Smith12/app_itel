import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { authService } from '../../services/authService';

export default function CustomDrawerContent(props: any) {
  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/login');
    } catch (error) {
      // Pode adicionar um alerta se quiser
      console.error('Erro ao terminar sessão:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
      <View>
        <DrawerItemList {...props} />
      </View>
      <DrawerItem
        label="Terminar sessão"
        onPress={handleLogout}
        labelStyle={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}
        style={{ backgroundColor: 'red', marginBottom: 16, borderRadius: 8, marginTop: 16, marginHorizontal: 16 }}
        icon={() => null}
      />
    </DrawerContentScrollView>
  );
}
