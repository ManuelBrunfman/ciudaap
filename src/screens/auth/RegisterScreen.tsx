// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../config/firebaseConfig';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [province, setProvince] = useState('');

  const handleRegister = async () => {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar el perfil del usuario con el displayName
      if (user) {
        await updateProfile(user, { displayName });
      }

      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert('Error', 'No se pudo registrar el usuario.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de afiliación"
        value={affiliationNumber}
        onChangeText={setAffiliationNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Provincia"
        value={province}
        onChangeText={setProvince}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 6, borderRadius: 8 },
  button: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' }
});
