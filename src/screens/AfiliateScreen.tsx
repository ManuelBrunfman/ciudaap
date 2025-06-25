import React from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { sendPushToAdmins } from '../services/sendPushToAdmins';

interface FormData {
  nombreApellido: string;
  dni: string;
  sector: string;
  telefono: string;
}

const schema = yup.object({
  nombreApellido: yup.string().required().min(3),
  dni: yup.string().required().matches(/^\d{7,8}$/),
  sector: yup.string().required(),
  telefono: yup.string().required().matches(/^\+54 9 \d{2} \d{4}-\d{4}$/),
});

const AfiliateScreen: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'affiliateRequests'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      await sendPushToAdmins({
        title: 'Nueva solicitud',
        body: `De ${data.nombreApellido}`,
      });
      Alert.alert('Éxito', 'Solicitud enviada');
      reset();
    } catch (err) {
      Alert.alert('Error', 'No se pudo enviar la solicitud');
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="nombreApellido"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nombre y Apellido"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="dni"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="DNI"
            keyboardType="number-pad"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="sector"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Sector"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="telefono"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default AfiliateScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
});
