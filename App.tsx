import { ExpoRoot } from 'expo-router';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore specific warnings if needed
  }, []);

  return <ExpoRoot context={require.context('./src/app')} />;
} 