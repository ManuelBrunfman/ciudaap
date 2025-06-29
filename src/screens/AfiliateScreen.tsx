import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'Debes iniciar sesión antes de enviar la solicitud');
      return;
    }

    try {
      await firestore().collection('affiliateRequests').add({
        ...data,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: currentUser.uid,
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
          <View style={styles.fieldContainer}>
            <Text>Nombre y apellido</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="Ejemplo: Juan Pérez"
            />
            {errors.nombreApellido && (
              <Text style={styles.error}>{errors.nombreApellido.message}</Text>
            )}
          </View>
        )}
      />

      {/* DNI */}
      <Controller
        control={control}
        name="dni"
        render={({ field: { onChange, value } }) => (
          <View style={styles.fieldContainer}>
            <Text>DNI</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              placeholder="Solo dígitos"
            />
            {errors.dni && <Text style={styles.error}>{errors.dni.message}</Text>}
          </View>
        )}
      />

      {/* Sector */}
      <Controller
        control={control}
        name="sector"
        render={({ field: { onChange, value } }) => (
          <View style={styles.fieldContainer}>
            <Text>Sector</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="Ejemplo: Ventas"
            />
            {errors.sector && <Text style={styles.error}>{errors.sector.message}</Text>}
          </View>
        )}
      />

      {/* Teléfono */}
      <Controller
        control={control}
        name="telefono"
        render={({ field: { onChange, value } }) => (
          <View style={styles.fieldContainer}>
            <Text>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
              placeholder="Ejemplo: 11912345678"
            />
            {errors.telefono && (
              <Text style={styles.error}>{errors.telefono.message}</Text>
            )}
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="Enviar solicitud" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  fieldContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginTop: 4,
  },
});
