import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const backgroundSource = require('../../assets/bg.webp');

export default function AppBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <ImageBackground source={backgroundSource} style={styles.image} resizeMode="cover">
        <View style={styles.overlay} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
