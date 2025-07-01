import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import type { User } from '../../services/authService';
import { authService } from '../../services/authService';

export default function Perfil() {
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    }
    fetchUser();
  }, []);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <Header title="" showBackButton={false} onMenuPress={handleMenuPress} />
        <View style={styles.centerContent}>
          <ThemedText>Carregando...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header
        title=""
        showBackButton={false}
        onMenuPress={handleMenuPress}
      />

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account-circle" size={100} color="#007AFF" />
          </View>
          <ThemedText style={styles.name}>{user.nome}</ThemedText>
          <ThemedText style={styles.matricula}>Matrícula: {user.processo}</ThemedText>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionTitle}>
            <MaterialCommunityIcons name="account-details" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitleText}>Informações Pessoais</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="calendar" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Data de Nascimento</ThemedText>
              <ThemedText style={styles.infoValue}>{user.dataNascimento}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Naturalidade</ThemedText>
              <ThemedText style={styles.infoValue}>{user.naturalidade}, {user.provincia}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Nome do Pai</ThemedText>
              <ThemedText style={styles.infoValue}>{user.nomePai}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Nome da Mãe</ThemedText>
              <ThemedText style={styles.infoValue}>{user.nomeMae}</ThemedText>
            </View>
          </View>

          <View style={styles.sectionTitle}>
            <MaterialCommunityIcons name="school" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitleText}>Informações Académicas</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="book" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Curso</ThemedText>
              <ThemedText style={styles.infoValue}>{user.curso}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Ano Lectivo</ThemedText>
              <ThemedText style={styles.infoValue}>{user.anoLectivo}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Turma</ThemedText>
              <ThemedText style={styles.infoValue}>{user.turma} - {user.turno}</ThemedText>
            </View>
          </View>

          <View style={styles.sectionTitle}>
            <MaterialCommunityIcons name="email" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitleText}>Contacto</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="email" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="phone" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Telefone</ThemedText>
              <ThemedText style={styles.infoValue}>{user.telefone}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="home" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Residência</ThemedText>
              <ThemedText style={styles.infoValue}>{user.residencia}</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  matricula: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});