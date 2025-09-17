import React from 'react';
import { View, TextInput, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { sendPushToAdmins } from '../services/sendPushToAdmins';
import { useTheme } from '../theme';
import { spacing } from '../theme/spacing';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';

type FormData = { nombreApellido: string; dni: string; sector: string; telefono: string };

const schema = yup.object({
  nombreApellido: yup.string().required('Requerido').min(3, 'Mínimo 3 caracteres'),
  dni: yup.string().required('Requerido').matches(/^\d{7,8}$/, '7-8 dígitos'),
  sector: yup.string().required('Requerido'),
  telefono: yup.string().required('Requerido').matches(/^\d{8,15}$/, 'Teléfono inválido (solo dígitos, 8-15)'),
});

export default function AfiliateScreen() {
  const t = useTheme();
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) { Alert.alert('Error', 'Debes iniciar sesión'); return; }
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'affiliateRequests'), { ...data, status: 'pending', createdAt: serverTimestamp(), userId: currentUser.uid });
      await sendPushToAdmins({ title: 'Nueva solicitud de afiliación', body: `De ${data.nombreApellido}` });
      Alert.alert('Listo', 'Solicitud enviada');
      reset();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No pudimos enviar tu solicitud');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <Controller control={control} name="nombreApellido" render={({ field: { onChange, value } }) => (
        <View style={styles.fieldContainer}>
          <AppText>Nombre y apellido</AppText>
          <TextInput
            style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt }]}
            value={value}
            onChangeText={onChange}
            placeholder="Ejemplo: Juan Pérez"
            placeholderTextColor={t.colors.muted}
          />
          {errors.nombreApellido && <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.nombreApellido.message}</AppText>}
        </View>
      )} />

      <Controller control={control} name="dni" render={({ field: { onChange, value } }) => (
        <View style={styles.fieldContainer}>
          <AppText>DNI</AppText>
          <TextInput
            style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt }]}
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            placeholder="Solo dígitos"
            placeholderTextColor={t.colors.muted}
          />
          {errors.dni && <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.dni.message}</AppText>}
        </View>
      )} />

      <Controller control={control} name="sector" render={({ field: { onChange, value } }) => (
        <View style={styles.fieldContainer}>
          <AppText>Sector</AppText>
          <TextInput
            style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt }]}
            value={value}
            onChangeText={onChange}
            placeholder="Ejemplo: Ventas"
            placeholderTextColor={t.colors.muted}
          />
          {errors.sector && <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.sector.message}</AppText>}
        </View>
      )} />

      <Controller control={control} name="telefono" render={({ field: { onChange, value } }) => (
        <View style={styles.fieldContainer}>
          <AppText>Teléfono</AppText>
          <TextInput
            style={[styles.input, { borderColor: t.colors.border, color: t.colors.onBackground, backgroundColor: t.colors.surfaceAlt }]}
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            placeholder="Ejemplo: 11912345678"
            placeholderTextColor={t.colors.muted}
          />
          {errors.telefono && <AppText style={[styles.error, { color: t.colors.danger }]}>{errors.telefono.message}</AppText>}
        </View>
      )} />

      <View style={styles.buttonContainer}>
        <AppButton title="Enviar solicitud" onPress={handleSubmit(onSubmit)} variant="filled" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  fieldContainer: { marginBottom: spacing.md },
  input: { borderWidth: 1, borderRadius: 4, padding: spacing.sm, marginTop: spacing.xs },
  buttonContainer: { marginTop: spacing.md },
  error: { marginTop: spacing.xs },
});
