import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useAuth } from '../context/AuthContext';
import { requestPushPermission } from '../services/notifications';

const AdminScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const registerToken = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await requestPushPermission();
      const db = getFirestore(getApp());
      await setDoc(
        doc(db, 'adminPushTokens', user.uid),
        { expoPushToken: token, updatedAt: serverTimestamp() },
        { merge: true }
      );
      Alert.alert('Éxito', 'Token guardado');
    } catch (err) {
      Alert.alert('Error', 'No se pudo registrar el token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={loading ? 'Guardando...' : 'Registrar mis notificaciones'} onPress={registerToken} disabled={loading} />
    </View>
  );
};

export default AdminScreen;
