// Ruta: src/screens/HomeScreen.tsx

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importamos SafeAreaView
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as colors from '../theme/colors';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          colors.homeGradientStart,
          colors.homeGradientMiddle,
          colors.homeGradientEnd,
        ]}
        style={styles.container}
      >
        <StatusBar style="light" />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Bienvenido a Bancapp</Text>

          <Text style={styles.subtitle}>Información Relevante</Text>

          <Text style={styles.info}>
            Aquí puedes mostrar la información más relevante de la aplicación,
            noticias, estadísticas o cualquier dato importante que desees
            destacar para el usuario.
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,

    alignItems: 'center',

    justifyContent: 'center',
  },

  title: {
    fontSize: 32,

    fontWeight: 'bold',

    color: colors.white,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,

    color: colors.lightGray,
    marginBottom: 20,
  },

  info: {
    fontSize: 16,

    color: colors.white,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
