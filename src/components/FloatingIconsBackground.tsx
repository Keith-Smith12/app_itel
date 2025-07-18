import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const icons = [
  require('../../assets/images/3.png'),
  require('../../assets/images/4.png'),
  require('../../assets/images/5.png'),
  require('../../assets/images/7.png'),
  require('../../assets/images/8.png'),
  require('../../assets/images/9.png'),
  require('../../assets/images/10.png'),
  require('../../assets/images/11.png'),
  require('../../assets/images/12.png'),
  require('../../assets/images/13.png'),
  require('../../assets/images/14.png'),
  require('../../assets/images/15.png'),
  require('../../assets/images/16.png'),
  require('../../assets/images/17.png'),
];

export default function FloatingIconsBackground() {
  const animations = useRef(icons.map(() => new Animated.Value(0))).current;

  useEffect(() => {
     console.log('FloatingIconsBackground carregado');
  animations.forEach((anim, i) => {
    anim.setValue(height); // <-- posição inicial fora da tela, embaixo
    Animated.loop(
      Animated.timing(anim, {
        toValue: -50, // sai do topo
        duration: 10000 + i * 1500,
        useNativeDriver: true,
      })
    ).start();
  });
}, []);


  return (
    <View style={StyleSheet.absoluteFill}>
      {animations.map((anim, i) => {
        const left = Math.random() * width;
        const size = 30 + Math.random() * 5;

        return (
          <Animated.Image
            key={i}
            source={icons[i % icons.length]}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              opacity: 0.5,
              left,
             transform: [{ translateY: anim }],
              tintColor: '#fff',
               zIndex: 1, 
            }}
            resizeMode="contain"
          />
        );
      })}
    </View>
  );
}
