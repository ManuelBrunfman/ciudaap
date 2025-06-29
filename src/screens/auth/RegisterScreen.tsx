import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Modular API
import { updateProfile } from '@react-native-firebase/auth';
import authService from '../../services/authService';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [province, setProvince] = useState('');

  const handleRegister = async () => {
    try {
      const cred = await authService.signUp(email.trim(), password, {
        displayName,
        affiliationNumber,
        province,
        status: 'pending',
      });
      await updateProfile(cred.user, { displayName });

      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
      // @ts-ignore
      navigation.navigate('Login');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message ?? 'No se pudo registrar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      {/* …inputs… */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
