import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/Header';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { useAuth } from '../../contexts/AuthContext';
import propostaService from '../../services/propostaService';
import { useRouter } from 'expo-router';

interface PropostaProjecto {
  [key: string]: any;
}

// Componente de filtro
function Filter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.filterContainer}>
      <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
      <TextInput
        style={styles.filterInput}
        placeholder="Pesquisar por tema, curso..."
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

export default function Projetos() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [propostas, setPropostas] = useState<PropostaProjecto[]>([]);
  const [projetosDisponiveis, setProjetosDisponiveis] = useState<PropostaProjecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tema, setTema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string|null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalDetalheVisible, setModalDetalheVisible] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<PropostaProjecto | null>(null);
  const [filter, setFilter] = useState('');
  const [candidatarLoading, setCandidatarLoading] = useState(false);
  const [candidatarSuccess, setCandidatarSuccess] = useState(false);
  const [candidatarError, setCandidatarError] = useState<string|null>(null);
  const [jaCandidatou, setJaCandidatou] = useState(false);
  const [podeCandidatar, setPodeCandidatar] = useState(true);
  const [jaCarregou, setJaCarregou] = useState(false);

  // Carregar projetos e propostas ao abrir a tela
  useEffect(() => {
    carregarProjetos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authLoading && user && user.it_classeConclusao === null) {
      alert('Meu amigo, voce ainda não chegou la');
      router.replace('/(app)/home');
    }
  }, [authLoading, user]);

  const carregarProjetos = async () => {
    try {
      if (!jaCarregou) setLoading(true);
      setError(null);
      const [propostasList, projetosList] = await Promise.all([
        propostaService.listarPropostasProjectos(),
        propostaService.listarProjectos()
      ]);
      setPropostas(propostasList);
      setProjetosDisponiveis(projetosList);
      setJaCarregou(true);
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
  }, []);

  // Função para pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarProjetos();
  }, []);

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
        it_idAluno: user.processo,
        it_idParceiro: '',
        vc_tema: tema,
        vc_descricao: descricao,
        vc_objectivos: '',
      });
      setSubmitSuccess(true);
      setTema('');
      setDescricao('');
      carregarProjetos();
      setModalVisible(false);
      setSubmitSuccess(false);
    } catch (err) {
      setSubmitError('Erro ao propor projeto. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Unir propostas e projetos em uma lista única filtrada
  const listaUnica = [...propostas, ...projetosDisponiveis];
  const listaFiltrada = listaUnica.filter((item) => {
    const texto = filter.toLowerCase();
    return (
      (item.vc_tema && item.vc_tema.toLowerCase().includes(texto)) ||
      (item.vc_nomeCurso && item.vc_nomeCurso.toLowerCase().includes(texto))
    );
  });

  const renderProjeto = (projeto: PropostaProjecto, index: number) => (
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
        Status: {projeto.vc_status || 'Proposto'}
      </ThemedText>
      {/* Data de criação no canto inferior direito */}
      {projeto.created_at && (
        <ThemedText style={styles.cardDataCriacao}>
          {new Date(projeto.created_at).toLocaleDateString('pt-AO')}
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  // Verifica se o usuário já se candidatou e se pode se candidatar ao abrir o modal de detalhes
  useEffect(() => {
    if (modalDetalheVisible && projetoSelecionado && user) {
      setCandidatarSuccess(false);
      setCandidatarError(null);
      setCandidatarLoading(false);
      setPodeCandidatar(true);
      propostaService.jaSeCandidatou(user.processo)
        .then((res) => {
          setJaCandidatou(!!res && res[projetoSelecionado.id]);
        })
        .catch(() => setJaCandidatou(false));
      propostaService.permissaoCandidatar()
        .then((res) => setPodeCandidatar(res))
        .catch(() => setPodeCandidatar(false));
    }
  }, [modalDetalheVisible, projetoSelecionado, user]);

  const handleCandidatar = async () => {
    if (!user || !projetoSelecionado) return;
    setCandidatarLoading(true);
    setCandidatarError(null);
    setCandidatarSuccess(false);
    try {
      await propostaService.candidatar({
        it_idAluno: user.processo,
        it_idParceiro: '', // Ajuste se houver parceiro
        it_idPropostaProjecto: projetoSelecionado.id?.toString() || '',
      });
      setCandidatarSuccess(true);
      setJaCandidatou(true);
    } catch (err) {
      setCandidatarError('Erro ao candidatar-se. Tente novamente.');
    } finally {
      setCandidatarLoading(false);
    }
  };

  // Função auxiliar para garantir apenas elementos React válidos no Fragment
  function renderCandidatarOptions() {
    if (!podeCandidatar) {
      return <ThemedText style={styles.errorText}>Você não tem permissão para se candidatar a este projeto.</ThemedText>;
    }
    if (jaCandidatou) {
      return <ThemedText style={styles.successText}>Você já se candidatou a este projeto.</ThemedText>;
    }
    if (projetoSelecionado?.it_estado_candidatura === 0) {
      return <ThemedText style={styles.errorText}>Candidatura indisponível para este projeto.</ThemedText>;
    }
    return (
      <Pressable
        style={[styles.modalButton, { marginTop: 8, alignSelf: 'flex-end', backgroundColor: '#007AFF' }]}
        onPress={handleCandidatar}
        disabled={candidatarLoading}
      >
        <ThemedText style={{ color: '#fff' }}>{candidatarLoading ? 'Enviando...' : 'Candidatar-se'}</ThemedText>
      </Pressable>
    );
  }

  // Debug log para saber o motivo do botão não aparecer
  if (projetoSelecionado?.id && user) {
    console.log('[DEBUG] Candidatar:', {
      podeCandidatar,
      jaCandidatou,
      it_estado_candidatura: projetoSelecionado?.it_estado_candidatura,
      user: user.processo,
      projetoId: projetoSelecionado?.id
    });
  }

  if (!user || user.it_classeConclusao === null) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Header
          title="Projetos"
          showBackButton={false}
          onMenuPress={handleMenuPress}
        />
      </View>

      {/* Filtro de pesquisa */}
      <Filter value={filter} onChange={setFilter} />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={carregarProjetos}>
              <ThemedText style={styles.retryButtonText}>Tentar Novamente</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {listaFiltrada.length > 0 ? (
              <View style={styles.projetosContainer}>
                {listaFiltrada.map(renderProjeto)}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>Nenhum projeto encontrado.</ThemedText>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {(
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

      {/* Modal de detalhes do projeto */}
      <Modal
        visible={modalDetalheVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalDetalheVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardDetalhe}>
            {/* Botão X de fechar no canto superior direito */}
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
              {/* Campos extras para aprovados */}
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
            {/* Opções de candidatura apenas para projetos propostos */}
            {projetoSelecionado?.id && user && (
              <>
                {renderCandidatarOptions()}
                {candidatarSuccess && (
                  <ThemedText style={styles.successText}>Candidatura enviada com sucesso!</ThemedText>
                )}
                {candidatarError && (
                  <ThemedText style={styles.errorText}>{candidatarError}</ThemedText>
                )}
              </>
            )}
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
  cardDataCriacao: {
    position: 'absolute',
    right: 16,
    bottom: 10,
    fontSize: 11,
    color: '#888',
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
});