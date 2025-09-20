// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signOut } from '@react-native-firebase/auth';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppText from '../../ui/AppText';
import AppButton from '../../ui/AppButton';
import { getFirebaseApp } from '../../config/firebaseApp';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [province, setProvince] = useState('');

  const handleRegister = async () => {
    try {
      const auth = getAuth(getFirebaseApp());
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName });
      await signOut(auth);
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
      // @ts-ignore
      navigation.navigate('Login');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message ?? 'No se pudo registrar.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <AppText variant="heading2" style={styles.title}>Crear Cuenta</AppText>

      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={t.colors.muted}
      />

      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={t.colors.muted}
      />

      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Nombre completo"
        value={displayName}
        onChangeText={setDisplayName}
        placeholderTextColor={t.colors.muted}
      />

      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Número de afiliado"
        value={affiliationNumber}
        onChangeText={setAffiliationNumber}
        placeholderTextColor={t.colors.muted}
      />

      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Provincia"
        value={province}
        onChangeText={setProvince}
        placeholderTextColor={t.colors.muted}
      />

      <AppButton title="Registrarse" onPress={handleRegister} variant="filled" />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: spacing.lg },
  input: { borderWidth: 1, borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm },
});
