// app_itel/App.tsx
import { ExpoRoot } from 'expo-router';
import { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']);
    setTimeout(() => setIsReady(true), 100);
  }, []);

  if (!isReady) return null;

  return (
    <AuthProvider>
      <ExpoRoot context={require.context('./src/app')} />
    </AuthProvider>
  );
}