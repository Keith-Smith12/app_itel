import { Link, router } from 'expo-router'; 
import { StyleSheet, View, Image } from 'react-native';
import { useEffect } from 'react'; 

export default function WelcomePage() {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login'); // Redireciona para a página de login
    }, 2000); 

    
    return () => clearTimeout(timer);
  }, []); // Array vazio significa que o useEffect só roda uma vez, ao montar o componente

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/ITEL_Logo.png')}
        style={styles.image} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', 
  },
  image: {
    width: 200, 
    height: 200,
    resizeMode: 'contain', 
  },
});