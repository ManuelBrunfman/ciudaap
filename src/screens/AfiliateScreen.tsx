import React from 'react';
import { View, TextInput, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { sendPushToAdmins } from '../services/sendPushToAdmins';
import { useTheme } from '../theme';
import { spacing } from '../theme/spacing';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import { getFirebaseApp } from '@/config/firebaseApp';

type FormData = { nombreApellido: string; dni: string; sector: string; telefono: string };

const schema = yup.object({
  nombreApellido: yup.string().required('Requerido').min(3, 'Mínimo 3 caracteres'),
  dni: yup.string().required('Requerido').matches(/^\d{7,8}$/, '7-8 dígitos'),
  sector: yup.string().required('Requerido'),
  telefono: yup.string().required('Requerido').matches(/^\d{8,15}$/, 'Teléfono inválido (solo dígitos, 8-15)'),
});

export default function AfiliateScreen() {
  const t = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const app = getFirebaseApp();
    const currentUser = getAuth(app).currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return;
    }
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'affiliateRequests'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      });
      await sendPushToAdmins({ title: 'Nueva solicitud de afiliación', body: `De ${data.nombreApellido}` });
      Alert.alert('Listo', 'Solicitud enviada');
      reset();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No pudimos enviar tu solicitud');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="nombreApellido"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <AppText>Nombre y apellido</AppText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt },
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ejemplo: Juan Pérez"
                  placeholderTextColor={t.colors.muted}
                />
                {errors.nombreApellido && (
                  <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.nombreApellido.message}</AppText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="dni"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <AppText>DNI</AppText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt },
                  ]}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  placeholder="Solo dígitos"
                  placeholderTextColor={t.colors.muted}
                />
                {errors.dni && <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.dni.message}</AppText>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="sector"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <AppText>Sector</AppText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt },
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Sucursal 63"
                  placeholderTextColor={t.colors.muted}
                />
                {errors.sector && (
                  <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.sector.message}</AppText>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="telefono"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <AppText>Teléfono</AppText>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt },
                  ]}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  placeholder="1151234561"
                  placeholderTextColor={t.colors.muted}
                />
                {errors.telefono && (
                  <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.telefono.message}</AppText>
                )}
              </View>
            )}
          />

          <View style={styles.buttonContainer}>
            <AppButton title="Enviar solicitud" onPress={handleSubmit(onSubmit)} variant="filled" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  formContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.sm,
    fontSize: 16,
    minHeight: 48,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: 14,
  },
});
