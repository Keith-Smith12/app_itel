import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function Perfil() {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Dados do estudante
  const estudante = {
    nome: "Isabel Sapuile Solendo",
    matricula: "14333",
    dataNascimento: "22/01/2006",
    naturalidade: "VIANA",
    provincia: "Luanda",
    nomePai: "PINDALI EMÍDIO",
    nomeMae: "FERNANDA GAMOS SOLENDO",
    estadoCivil: "Solteiro(a)",
    genero: "Feminino",
    telefone: "923 619 194",
    email: "pindali.emidio@mtti.gov.ao",
    residencia: "KILAMBA",
    bi: "007939052LA046",
    curso: "Técnico de Informática",
    anoLectivo: "2024-2025",
    turma: "A 2",
    turno: "MANHÃ"
  };

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
          <ThemedText style={styles.name}>{estudante.nome}</ThemedText>
          <ThemedText style={styles.matricula}>Matrícula: {estudante.matricula}</ThemedText>
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
              <ThemedText style={styles.infoValue}>{estudante.dataNascimento}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Naturalidade</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.naturalidade}, {estudante.provincia}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Nome do Pai</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.nomePai}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Nome da Mãe</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.nomeMae}</ThemedText>
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
              <ThemedText style={styles.infoValue}>{estudante.curso}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Ano Lectivo</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.anoLectivo}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Turma</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.turma} - {estudante.turno}</ThemedText>
            </View>
          </View>

          <View style={styles.sectionTitle}>
            <MaterialCommunityIcons name="contact-mail" size={24} color="#007AFF" />
            <ThemedText style={styles.sectionTitleText}>Contacto</ThemedText>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="email" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.email}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="phone" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Telefone</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.telefone}</ThemedText>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="home" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Residência</ThemedText>
              <ThemedText style={styles.infoValue}>{estudante.residencia}</ThemedText>
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
});