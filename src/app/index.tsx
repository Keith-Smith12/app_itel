import { Link, router } from 'expo-router'; 
import { StyleSheet, View, Image } from 'react-native';
import { useEffect } from 'react'; 
import {NoteCard} from '../components/card/NoteCard'

export default function WelcomePage() {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login'); // Redireciona para a página de login
    }, 1000000); 

    
    return () => clearTimeout(timer);
  }, []); // Array vazio significa que o useEffect só roda uma vez, ao montar o componente

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/ITEL_Logo.png')}
        style={styles.image} 
      />
     {/* <NoteCard subject="Matemática" p1={8.5} p2={7.0} mac={9.0} />*/} 

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