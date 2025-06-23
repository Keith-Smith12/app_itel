import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { ActiveTab } from '../../components/activeTab';
import { useAuth } from '../../contexts/AuthContext';
import propostaService from '../../services/propostaService';

interface PropostaProjecto {
  [key: string]: any;
}

type AbaProjeto = 'propostos' | 'aprovados' | 'concluidos';

const tabs = [
  { id: 'propostos', label: 'Propostos' },
  { id: 'aprovados', label: 'Aprovados' },
  { id: 'concluidos', label: 'Concluídos' },
];

export default function Projetos() {
  const navigation = useNavigation();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AbaProjeto>('propostos');
  const [projetos, setProjetos] = useState<PropostaProjecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tema, setTema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string|null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      carregarProjetos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, authLoading, user]);

  const carregarProjetos = async () => {
    try {
      setLoading(true);
      setError(null);
      let projetosData: PropostaProjecto[] = [];
      if (activeTab === 'propostos') {
        projetosData = await propostaService.listarPropostasProjectos();
      } else if (activeTab === 'aprovados') {
        projetosData = await propostaService.listarPropostasAprovadas();
      } else if (activeTab === 'concluidos') {
        // Busca aprovados e filtra por status concluído
        const aprovados = await propostaService.listarPropostasAprovadas();
        projetosData = aprovados.filter(
          (projeto) =>
            projeto.vc_status === 'Concluído' ||
            projeto.vc_status === 'Finalizado' ||
            projeto.vc_status === 'Completo'
        );
      }
      setProjetos(projetosData);
    } catch (err) {
      setError('Erro ao carregar projetos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para reload manual (botão)
  const reloadProjetos = useCallback(() => {
    carregarProjetos();
  }, [activeTab, user]);

  // Função para pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarProjetos();
  }, [activeTab, user]);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleProporProjeto = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      if (!user) throw new Error('Usuário não autenticado');
      await propostaService.enviarProposta({
        it_idAluno: user.processo, // Usa o processo do usuário logado
        it_idParceiro: '', // Ajuste se houver parceiro
        vc_tema: tema,
        vc_descricao: descricao,
        vc_objectivos: '', // Pode adicionar campo se quiser
      });
      setSubmitSuccess(true);
      setTema('');
      setDescricao('');
      setTimeout(() => {
        setModalVisible(false);
        setSubmitSuccess(false);
        carregarProjetos();
      }, 1200);
    } catch (err) {
      setSubmitError('Erro ao propor projeto. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderProjeto = (projeto: PropostaProjecto, index: number) => (
    <TouchableOpacity key={index} style={styles.projetoCard}>
      <ThemedText style={styles.projetoTitulo}>
        {projeto.vc_tema || 'Título não disponível'}
      </ThemedText>
      <ThemedText style={styles.projetoDescricao} numberOfLines={3}>
        {projeto.vc_descricao || 'Descrição não disponível'}
      </ThemedText>
      <View style={styles.projetoFooter}>
        <ThemedText style={styles.projetoStatus}>
          Status: {projeto.vc_status || (activeTab === 'propostos' ? 'Proposto' : activeTab === 'aprovados' ? 'Aprovado' : 'Concluído')}
        </ThemedText>
        {projeto.vc_parceiro && (
          <ThemedText style={styles.projetoParceiro}>
            Parceiro: {projeto.vc_parceiro}
          </ThemedText>
        )}
      </View>
      {projeto.vc_objectivos && (
        <ThemedText style={styles.projetoObjectivos} numberOfLines={2}>
          Objetivos: {projeto.vc_objectivos}
        </ThemedText>
      )}
      {activeTab === 'concluidos' && projeto.dt_conclusao && (
        <ThemedText style={styles.projetoConclusao}>
          Concluído em: {new Date(projeto.dt_conclusao).toLocaleDateString('pt-BR')}
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Header
          title="Projetos"
          showBackButton={false}
          onMenuPress={handleMenuPress}
        />
        <TouchableOpacity onPress={reloadProjetos} style={styles.reloadButton}>
          <ThemedText style={styles.reloadButtonText}>⟳</ThemedText>
        </TouchableOpacity>
      </View>

      <ActiveTab
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={(tabId) => setActiveTab(tabId as AbaProjeto)}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {authLoading || loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>Carregando projetos...</ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={carregarProjetos}>
              <ThemedText style={styles.retryButtonText}>Tentar Novamente</ThemedText>
            </TouchableOpacity>
          </View>
        ) : projetos.length > 0 ? (
          <View style={styles.projetosContainer}>
            {projetos.map(renderProjeto)}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Nenhum projeto encontrado para esta aba
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {activeTab === 'propostos' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <ThemedText style={styles.fabText}>+ Propor Projeto</ThemedText>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Propor Novo Projeto</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Tema do Projeto"
              value={tema}
              onChangeText={setTema}
              editable={!submitting}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descrição do Projeto"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              editable={!submitting}
            />
            {submitError && <ThemedText style={styles.errorText}>{submitError}</ThemedText>}
            {submitSuccess && <ThemedText style={styles.successText}>Projeto proposto com sucesso!</ThemedText>}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#ccc', marginRight: 8 }]}
                onPress={() => setModalVisible(false)}
                disabled={submitting}
              >
                <ThemedText style={{ color: '#333' }}>Cancelar</ThemedText>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={handleProporProjeto}
                disabled={submitting || !tema || !descricao}
              >
                <ThemedText style={{ color: '#fff' }}>{submitting ? 'Enviando...' : 'Submeter'}</ThemedText>
              </Pressable>
            </View>
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
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  projetosContainer: {
    gap: 12,
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
    marginBottom: 12,
  },
  projetoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  projetoDescricao: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  projetoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projetoStatus: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  projetoParceiro: {
    fontSize: 12,
    color: '#666',
  },
  projetoObjectivos: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  projetoConclusao: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
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
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 6,
    zIndex: 10,
  },
  fabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#F2F2F7',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  successText: {
    color: '#34C759',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  reloadButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    width: 36,
  },
  reloadButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});