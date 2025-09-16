// Ruta: src/screens/auth/PasswordResetScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import AppText from '../../ui/AppText';
import AppButton from '../../ui/AppButton';
import { spacing } from '../../theme/spacing';

const PasswordResetScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleReset = () => {
    // Implementa la lógica para resetear la contraseña
    Alert.alert('Resetear Contraseña', 'Funcionalidad no implementada.');
  };

  const t = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <AppText variant="heading2" style={styles.title}>Resetear Contraseña</AppText>
      <TextInput
        style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground }]}
        placeholder="Correo electrónico"
        placeholderTextColor={t.colors.muted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppButton title="Resetear" onPress={handleReset} variant="filled" />
      <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
        <AppText style={[styles.link, { color: t.colors.primary }]}>Volver al inicio de sesión</AppText>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordResetScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  link: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
