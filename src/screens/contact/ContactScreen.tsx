import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const numero = '5491158178508'; // Sin el +
const mensaje = 'Hola, me quiero contactar con alguien de la gremial.';

const abrirWhatsApp = () => {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  Linking.openURL(url);
};

const ContactScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Contacto Gremial</Text>
        <Text style={styles.subtitle}>
          Si necesitás ayuda o querés comunicarte con la gremial, presioná el botón de WhatsApp abajo.
        </Text>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.whatsappButton} onPress={abrirWhatsApp}>
          <FontAwesome name="whatsapp" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Contactar por WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  bottomBar: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappButton: {
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: { marginRight: 8 },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
