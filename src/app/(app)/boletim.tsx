import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { ActiveTab } from "../../components/activeTab";
import { NoteCard } from "../../components/card/NoteCard";
import { Header } from "../../components/Header";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { NotasResponse, notasService } from "../../services/notasService";

export default function Boletim() {
  const navigation = useNavigation();
  const [activeTrimmester, setActiveTrimmester] = useState<"I" | "II" | "III">("I");
  const [loading, setLoading] = useState(true);
  const [notasData, setNotasData] = useState<NotasResponse | null>(null);
  const [error, setError] = useState<string>("");

  const trimestreTabs = [
    { id: "I", label: "I Trimestre" },
    { id: "II", label: "II Trimestre" },
    { id: "III", label: "III Trimestre" },
  ];

  useEffect(() => {
    carregarNotas();
  }, []);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const carregarNotas = async () => {
    try {
      setLoading(true);
      const response = await notasService.getNotas();
      setNotasData(response);
      setError("");
    } catch (err) {
      setError("Erro ao carregar notas. Tente novamente mais tarde.");
      console.error("Erro ao carregar notas:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      );
    }

    if (!notasData || !notasData.dados.quartos[activeTrimmester] || notasData.dados.quartos[activeTrimmester].length === 0) {
      return (
        <View style={styles.centerContent}>
          <ThemedText style={styles.emptyText}>
            Notas indisponíveis para o trimestre selecionado
          </ThemedText>
        </View>
      );
    }

    const notasTrimestreAtual = notasData.dados.quartos[activeTrimmester];

    return (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {notasTrimestreAtual.map((disciplina, index) => (
          <NoteCard
            key={`${disciplina.assunto}-${index}`}
            subject={disciplina.assunto}
            p1={disciplina.notas.p1}
            p2={disciplina.notas.p2}
            mac={disciplina.notas.mac}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Header
        title=""
        showBackButton={false}
        onMenuPress={handleMenuPress}
        rightAction={{
          icon: "arrow.clockwise",
          onPress: carregarNotas
        }}
      />

      <ActiveTab
        tabs={trimestreTabs}
        activeTab={activeTrimmester}
        onChangeTab={(tabId) => setActiveTrimmester(tabId as "I" | "II" | "III")}
      />

      {renderContent()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
