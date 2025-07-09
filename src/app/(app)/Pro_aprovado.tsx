import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import propostaService from '../../services/propostaService';

export default function ProAprovado() {
  const navigation = useNavigation();
  const [projetos, setProjetos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');
  const [modalDetalheVisible, setModalDetalheVisible] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<any | null>(null);

  useEffect(() => {
    carregarProjetos();
  }, []);

  const carregarProjetos = async () => {
    try {
      setLoading(true);
      setError(null);
      const projetosData = await propostaService.listarPropostasAprovadas();
      setProjetos(projetosData);
    } catch (err) {
      setError('Erro ao carregar projetos aprovados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarProjetos();
  };

  const projetosFiltrados = projetos.filter((projeto) => {
    const texto = filter.toLowerCase();
    return (
      (projeto.vc_tema && projeto.vc_tema.toLowerCase().includes(texto)) ||
      (projeto.vc_nomeCurso && projeto.vc_nomeCurso.toLowerCase().includes(texto))
    );
  });

  const renderProjeto = (projeto: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.projetoCard}
      onPress={() => {
        setProjetoSelecionado(projeto);
        setModalDetalheVisible(true);
      }}
    >
      <ThemedText style={styles.projetoTitulo} numberOfLines={2}>
        {projeto.vc_tema || 'Título não disponível'}
      </ThemedText>
      <ThemedText style={styles.projetoStatus}>
        Status: {projeto.vc_status || 'Aprovado'}
      </ThemedText>
      {projeto.created_at && (
        <ThemedText style={styles.cardDataCriacao}>
          {new Date(projeto.created_at).toLocaleDateString('pt-AO')}
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Header
        title="Projetos Aprovados"
        showBackButton={false}
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      {/* Filtro de pesquisa */}
      <View style={styles.filterContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.filterInput}
          placeholder="Pesquisar por tema, curso..."
          value={filter}
          onChangeText={setFilter}
          placeholderTextColor="#aaa"
        />
      </View>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>Carregando projetos aprovados...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : projetosFiltrados.length > 0 ? (
          <View style={styles.projetosContainer}>
            {projetosFiltrados.map(renderProjeto)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Nenhum projeto aprovado encontrado
            </ThemedText>
          </View>
        )}
      </ScrollView>
      {/* Modal de detalhes do projeto */}
      <Modal
        visible={modalDetalheVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalDetalheVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardDetalhe}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalDetalheVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>
            <ScrollView style={{ maxHeight: '70%' }} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
              <ThemedText style={[styles.modalTitle, { color: '#111' }]}>{projetoSelecionado?.vc_tema || '-'}</ThemedText>
              <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>
                Curso: <ThemedText style={{ color: '#111', fontWeight: 'normal' }}>{projetoSelecionado?.vc_nomeCurso || '-'}</ThemedText>
              </ThemedText>
              <ThemedText style={{ color: '#111', marginBottom: 8 }}>
                Ano Lectivo: {projetoSelecionado?.ya_inicio || '-'} - {projetoSelecionado?.ya_fim || '-'}
              </ThemedText>
              <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>Objetivos:</ThemedText>
              <ThemedText style={{ color: '#111', marginBottom: 12 }}>{projetoSelecionado?.vc_objectivos || '-'}</ThemedText>
              <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>Descrição:</ThemedText>
              <ThemedText style={{ color: '#111', marginBottom: 12 }}>{projetoSelecionado?.vc_descricao || '-'}</ThemedText>
              <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>Proposto por:</ThemedText>
              <ThemedText style={{ color: '#111', marginBottom: 8 }}>{projetoSelecionado?.vc_proposto_por || '-'}</ThemedText>
              <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>Aluno:</ThemedText>
              <ThemedText style={{ color: '#111', marginBottom: 8 }}>
                {projetoSelecionado?.vc_primeiroNomeAluno || ''} {projetoSelecionado?.vc_nomedoMeioAluno || ''} {projetoSelecionado?.vc_ultimoaNomeAluno || ''}
              </ThemedText>
              {projetoSelecionado?.vc_primeiroNomeParceiro && (
                <>
                  <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>Parceiro:</ThemedText>
                  <ThemedText style={{ color: '#111', marginBottom: 8 }}>
                    {projetoSelecionado?.vc_primeiroNomeParceiro || ''} {projetoSelecionado?.vc_nomedoMeioParceiro || ''} {projetoSelecionado?.vc_ultimoaNomeParceiro || ''}
                  </ThemedText>
                </>
              )}
              <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>Criado em:</ThemedText>
              <ThemedText style={{ color: '#111', marginBottom: 4 }}>{projetoSelecionado?.created_at ? new Date(projetoSelecionado.created_at).toLocaleDateString('pt-BR') : '-'}</ThemedText>
              <ThemedText style={{ color: '#111', fontWeight: 'bold', marginBottom: 4 }}>Atualizado em:</ThemedText>
              <ThemedText style={{ color: '#111', marginBottom: 4 }}>{projetoSelecionado?.updated_at ? new Date(projetoSelecionado.updated_at).toLocaleDateString('pt-BR') : '-'}</ThemedText>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  projetosContainer: {
    gap: 6,
    paddingTop: 6,
  },
  projetoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 80,
    justifyContent: 'center',
  },
  projetoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  projetoStatus: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardDataCriacao: {
    position: 'absolute',
    right: 16,
    bottom: 10,
    fontSize: 11,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCardDetalhe: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignSelf: 'center',
    maxHeight: '80%',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    padding: 2,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
});