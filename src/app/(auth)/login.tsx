import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authService } from '../../services/authService';
import FloatingIconsBackground from '../../components/FloatingIconsBackground';
import React from 'react';

export default function LoginPage() {
  const [processo, setProcesso] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!processo.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    try {
      setLoading(true);
      const response = await authService.login({
        it_idAluno: Number(processo.trim()),
        passe: password.trim()
      });

      if (response.user) {
        router.replace('/(app)/home');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <FloatingIconsBackground />

    <LinearGradient
      colors={['#0c0d13ff','#001386']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.0, y: 0 }}
      style={styles.gradient}
       
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <View style={styles.formContainer}>
         
          <View style={styles.logoContainer}> 
          <Image source={require('../../../assets/images/ITEL_Logo1.png')} style={styles.logo} />
          <Text style={styles.subtitle}> Ambiente Virtual do ITEL</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Número do Processo"
            value={processo}
            onChangeText={setProcesso}
            keyboardType="numeric"
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor="#001386"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
              placeholderTextColor="#001386"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#001386
                
                "
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
    </View>

  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
      
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  logo: {
    width: 180,
    height: 50,
   // resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 22,
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  input: {
    width: 300,
    maxWidth: '100%',
    height: 48,
    borderWidth: 1.2,
    borderColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#171717',
    
  },
  passwordContainer: {
    width: 300,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  button: {
    backgroundColor: '#1B68FF',
    width: 300,
    maxWidth: '100%',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 2, 
  },
  buttonDisabled: {
    backgroundColor: '#e3eaf2',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,

  },

  logoContainer: {
  alignItems: 'center',
  marginBottom: 22, // controla o espaçamento geral abaixo
  zIndex: 2, 
},
subtitle: {
  marginTop: 6, // controla o espaçamento entre imagem e texto
  fontSize: 14,
  color: '#fff',
  textAlign: 'center',
},
});