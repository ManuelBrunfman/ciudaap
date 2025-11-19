// src/screens/AdminScreen.tsx

import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { getFirestore, collection, onSnapshot, orderBy, query, where } from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import type { AffiliateRequest } from '../types/AffiliateRequest';
import { useTheme } from '../theme';
import { spacing } from '../theme/spacing';
import AppText from '../ui/AppText';
import { getFirebaseApp } from '@/config/firebaseApp';

interface RequestItem extends AffiliateRequest { id: string }

const AdminScreen: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const t = useTheme();
  const app = getFirebaseApp();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) { setLoading(false); return; }

    const db = getFirestore(app);
    const q = query(
      collection(db, 'affiliateRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: RequestItem[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AffiliateRequest, 'id'>) }));
        setRequests(data);
        setLoading(false);
      },
      (error) => {
        console.error('[AdminScreen] Firestore error:', error);
        Alert.alert('Error', 'Ocurrió un error al leer las solicitudes. ¿Tenés isAdmin: true?');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [app, user, isAdmin]);

  if (!isAdmin) {
    return (
      <View style={[styles.center, { backgroundColor: 'transparent' }]}>
        <AppText style={{ color: t.colors.muted }}>No tenés permisos para ver esta sección.</AppText>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: 'transparent' }]}>
        <ActivityIndicator size="large" color={t.colors.primary} />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: 'transparent' }]}>
        <AppText style={{ color: t.colors.muted }}>No hay solicitudes pendientes.</AppText>
      </View>
    );
  }

  const renderItem = ({ item }: { item: RequestItem }) => {
    const dateObj = (item as any).createdAt?.toDate ? (item as any).createdAt.toDate() : new Date((item as any).createdAt);
    return (
      <View style={[styles.card, { backgroundColor: t.colors.surface, shadowColor: t.colors.onBackground }]}>
        <AppText style={styles.name}>{item.nombreApellido}</AppText>
        <AppText style={[styles.meta, { color: t.colors.muted }]}>DNI: {item.dni}</AppText>
        <AppText style={[styles.meta, { color: t.colors.muted }]}>Sector: {item.sector}</AppText>
        <AppText style={[styles.meta, { color: t.colors.muted }]}>Teléfono: {item.telefono}</AppText>
        <AppText style={[styles.date, { color: t.colors.muted }]}>{dateObj.toLocaleString('es-AR')}</AppText>
      </View>
    );
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={[styles.list, { backgroundColor: 'transparent' }]}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  list: { padding: spacing.md },
  card: {
    padding: spacing.sm + spacing.xs,
    marginBottom: spacing.sm,
    borderRadius: 8,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  meta: { fontSize: 14 },
  date: { fontSize: 12, marginTop: spacing.xs },
});

export default AdminScreen;
