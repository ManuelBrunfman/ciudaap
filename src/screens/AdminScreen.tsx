import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Alert,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useAuth } from '../context/AuthContext';
import { requestPushPermission } from '../services/notifications';
import type { AffiliateRequest } from '../types/AffiliateRequest';

const AdminScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<AffiliateRequest[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(
      collection(db, 'affiliateRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt')
    );
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<AffiliateRequest, 'id'>),
      }));
      setRequests(data);
    });
    return unsub;
  }, []);

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

  const updateStatus = async (id: string, status: string) => {
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'affiliateRequests', id), { status });
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la solicitud');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title={loading ? 'Guardando...' : 'Registrar mis notificaciones'}
          onPress={registerToken}
          disabled={loading}
        />
      </View>
      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.nombreApellido}</Text>
              <Text>DNI: {item.dni}</Text>
              <Text>
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.approve]}
                onPress={() => updateStatus(item.id, 'approved')}
              >
                <Text style={styles.btnText}>Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.reject]}
                onPress={() => updateStatus(item.id, 'rejected')}
              >
                <Text style={styles.btnText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay solicitudes pendientes</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, alignItems: 'center' },
  list: { padding: 16 },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  info: { marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  approve: { backgroundColor: '#28a745', marginRight: 8 },
  reject: { backgroundColor: '#dc3545' },
  btnText: { color: '#fff' },
  name: { fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' },
});
