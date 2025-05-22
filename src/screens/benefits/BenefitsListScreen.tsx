// src/screens/benefits/BenefitsListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootStackParamList';

interface Beneficio {
  titulo: string;
  link: string;
  imagen_url: string;
  categoria?: string;
  provincia?: string;
}

const BenefitsListScreen: React.FC = () => {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [filteredBeneficios, setFiltered] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'BenefitsList'>>();

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await firestore().collection('beneficios').get();
        const data = snap.docs.map(d => d.data() as Beneficio);
        setBeneficios(data);
        setCategorias(
          Array.from(new Set(data.map(i => i.categoria).filter(Boolean) as string[])).sort()
        );
        setProvincias(
          Array.from(new Set(data.map(i => i.provincia).filter(Boolean) as string[])).sort()
        );
      } catch (e) {
        setError('No se pudieron cargar los beneficios.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let res = [...beneficios];
    if (search.trim()) {
      const s = search.toLowerCase();
      res = res.filter(i => i.titulo.toLowerCase().includes(s));
    }
    if (selectedCategoria) res = res.filter(i => i.categoria === selectedCategoria);
    if (selectedProvincia) res = res.filter(i => i.provincia === selectedProvincia);
    setFiltered(res);
  }, [search, selectedCategoria, selectedProvincia, beneficios]);

  const renderItem = ({ item }: { item: Beneficio }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BenefitDetail', { url: item.link })}
    >
      <Image source={{ uri: item.imagen_url }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtros omitidos por brevedad */}

      <FlatList
        data={filteredBeneficios}
        renderItem={renderItem}
        keyExtractor={(i, idx) => `${i.titulo}-${idx}`}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default BenefitsListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  searchContainer: { marginBottom: 8 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  list: { paddingBottom: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: { width: 90, height: 90 },
  cardContent: { flex: 1, padding: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
});
