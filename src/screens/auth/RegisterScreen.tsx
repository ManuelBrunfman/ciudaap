import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppText from '../../ui/AppText';
import AppButton from '../../ui/AppButton';
import { getFirebaseApp } from '@/config/firebaseApp';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const t = useTheme();
  const app = getFirebaseApp();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return false;
    }
    if (email.trim() !== confirmEmail.trim()) {
      Alert.alert('Error', 'Los correos electrónicos no coinciden.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return false;
    }
    if (!firstName.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      const authInstance = getAuth(app);
      const cred = await createUserWithEmailAndPassword(authInstance, email.trim(), password);
      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const fullName = `${trimmedFirst} ${trimmedLast}`.replace(/\s+/g, ' ').trim();

      await updateProfile(cred.user, { displayName: fullName });

      const db = getFirestore(app);
      const userDocRef = doc(db, 'users', cred.user.uid);
      const normalizedEmail = email.trim().toLowerCase();
      const sanitizedLocalidad = localidad.trim();
      const sanitizedTelefono = telefono.trim();

      await setDoc(
        userDocRef,
        {
          firstName: trimmedFirst,
          lastName: trimmedLast,
          fullName,
          email: normalizedEmail,
          localidad: sanitizedLocalidad || null,
          telefono: sanitizedTelefono || null,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
      await firebaseSignOut(authInstance);
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message ?? 'No se pudo registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <AppText variant="heading2" style={styles.title}>Crear Cuenta</AppText>

      {/* Email */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        placeholderTextColor={t.colors.muted}
      />

      {/* Confirmar Email */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Confirmar correo electrónico"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        placeholderTextColor={t.colors.muted}
      />

      {/* Password */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="next"
        placeholderTextColor={t.colors.muted}
      />

      {/* Confirmar Password */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="next"
        placeholderTextColor={t.colors.muted}
      />

      {/* Nombre */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
        returnKeyType="next"
        placeholderTextColor={t.colors.muted}
      />

      {/* Apellido */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        returnKeyType="next"
        placeholderTextColor={t.colors.muted}
      />

      {/* Localidad */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Localidad"
        value={localidad}
        onChangeText={setLocalidad}
        autoCapitalize="words"
        returnKeyType="next"
        placeholderTextColor={t.colors.muted}
      />

      {/* Teléfono */}
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
        returnKeyType="done"
        placeholderTextColor={t.colors.muted}
      />

      {loading ? (
        <ActivityIndicator size="large" color={t.colors.primary} style={styles.loader} />
      ) : (
        <AppButton title="Registrarse" onPress={handleRegister} variant="filled" />
      )}
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: spacing.lg },
  input: { borderWidth: 1, borderRadius: 8, padding: spacing.md, marginBottom: spacing.sm },
  loader: { marginTop: spacing.md },
});
