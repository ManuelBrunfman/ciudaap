import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { sendPushToAdmins } from '../services/sendPushToAdmins';

/**
 * Tipo del formulario
 */
type FormData = {
  nombreApellido: string;
  dni: string;
  sector: string;
  telefono: string;
};

/**
 * Esquema de validación (yup)
 *  - Teléfono: acepta solo dígitos, entre 8 y 15
 */
const schema = yup.object({
  nombreApellido: yup.string().required('Requerido').min(3, 'Mínimo 3 caracteres'),
  dni: yup.string().required('Requerido').matches(/^\d{7,8}$/, '7-8 dígitos'),
  sector: yup.string().required('Requerido'),
  telefono: yup
    .string()
    .required('Requerido')
    .matches(/^\d{8,15}$/, 'Teléfono inválido (solo dígitos, 8-15)'),
});

export default function AfiliateScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  /**
   * Se ejecuta al tocar "Enviar"
   */
  const onSubmit = async (data: FormData) => {
    // Punto 1: verificar usuario autenticado
    const currentUser = auth().currentUser;
    console.log('Usuario actual:', currentUser?.uid);
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión antes de enviar la solicitud');
      return;
    }

    console.log('>>> handleSubmit dispara', data);
    try {
      await firestore().collection('affiliateRequests').add({
        ...data,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await sendPushToAdmins({
        title: 'Nueva solicitud de afiliación',
        body: `De ${data.nombreApellido}`,
      });

      Alert.alert('Listo', 'Solicitud enviada');
      reset();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No pudimos enviar tu solicitud');
    }
  };

  return (
    <View style={styles.container}>
      {/* Nombre y apellido */}
      <Controller
        control={control}
        name="nombreApellido"
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Nombre y apellido</Text>
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
            {errors.nombreApellido && (
              <Text style={styles.error}>{errors.nombreApellido.message}</Text>
            )}
          </>
        )}
      />

      {/* DNI */}
      <Controller
        control={control}
        name="dni"
        render={({ field: { onChange, value } }) => (
          <>
            <Text>DNI</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
            />
            {errors.dni && <Text style={styles.error}>{errors.dni.message}</Text>}
          </>
        )}
      />

      {/* Sector */}
      <Controller
        control={control}
        name="sector"
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Sector</Text>
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
            {errors.sector && <Text style={styles.error}>{errors.sector.message}</Text>}
          </>
        )}
      />

      {/* Teléfono */}
      <Controller
        control={control}
        name="telefono"
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Teléfono</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
            {errors.telefono && <Text style={styles.error}>{errors.telefono.message}</Text>}
          </>
        )}
      />

      <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
});
