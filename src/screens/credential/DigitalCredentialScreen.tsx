// src/screens/credential/DigitalCredentialScreen.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importamos SafeAreaView
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const DigitalCredentialScreen: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No hay usuario autenticado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/credencial-bg.png')}
        style={styles.cardBackground}
        resizeMode="contain"
      >
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.infoText}>Email: {user.email}</Text>
            <Text style={styles.infoText}>Nombre: {user.name}</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default DigitalCredentialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardBackground: {
    width: width - 32, // Ocupa casi todo el ancho con margen de 16px en cada lado
    height: 300,       // Altura fija para mostrar la imagen completa
    borderRadius: 12,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Capa semitransparente para resaltar el texto
    justifyContent: 'center', // Centra verticalmente el contenido
    alignItems: 'center',     // Centra horizontalmente el contenido
  },
  textContainer: {},
  infoText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
});