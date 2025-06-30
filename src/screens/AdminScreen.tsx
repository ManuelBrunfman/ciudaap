// src/screens/AdminScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useAuth } from '../context/AuthContext';
import type { AffiliateRequest } from '../types/AffiliateRequest';

interface RequestItem extends AffiliateRequest {
  id: string;
}

const AdminScreen: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    const db = getFirestore(getApp());
    const q = query(
      collection(db, 'affiliateRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: RequestItem[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AffiliateRequest, 'id'>),
        }));
        setRequests(data);
        setLoading(false);
      },
      (error) => {
        const code = (error as any)?.code as string | undefined;
        console.error('[AdminScreen] Firestore error:', error);
        let msg = 'Ocurrió un error inesperado.';
        if (code === 'permission-denied') {
          msg =
            'No tenés permisos para leer las solicitudes. Asegurate de que tu usuario tenga isAdmin: true.';
        }
        Alert.alert('Error', msg);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, isAdmin]);

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text>No tenés permisos para ver esta sección.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay solicitudes pendientes.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: RequestItem }) => {
    const dateObj = (item as any).createdAt?.toDate
      ? (item as any).createdAt.toDate()
      : new Date((item as any).createdAt);
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.nombreApellido}</Text>
        <Text style={styles.dni}>DNI: {item.dni}</Text>
        <Text style={styles.date}>{dateObj.toLocaleString('es-AR')}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dni: {
    fontSize: 14,
    opacity: 0.8,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
});

export default AdminScreen;
