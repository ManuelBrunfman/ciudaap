import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet,
  Image, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

// --------- ViewModel local que la UI realmente usa ---------
type BenefitVM = {
  title: string;
  url: string;
  imageUrl?: string;
  category?: string | null;
  province?: string | null;
};

// guard para strings
const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

// orden fijo de categorías
const CATEGORY_ORDER = [
  'Alojamiento',
  'Gastronomía',
  'Excursiones y Actividades',
  'Transporte',
  'Salud',
  'Deportes y Gimnasios',
  'Retail / Comercios',
  'Educación',
  'Otros',
];
const catIndex = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c);
  return i === -1 ? 999 : i;
};
const sortByCategoryOrder = (a: string, b: string) =>
  (catIndex(a) === catIndex(b) ? a.localeCompare(b) : catIndex(a) - catIndex(b));

// provincias: “Nacional” primero
const sortProvinces = (arr: string[]) =>
  arr.sort((a, b) => {
    if (a === 'Nacional' && b !== 'Nacional') return -1;
    if (b === 'Nacional' && a !== 'Nacional') return 1;
    return a.localeCompare(b);
  });

// Mapea el doc crudo de Firestore (en ES o EN) a nuestro VM
const mapDocToVM = (raw: any): BenefitVM => {
  const title    = (raw?.title ?? raw?.titulo ?? '').toString();
  const url      = (raw?.url ?? raw?.link ?? '').toString();
  const imageUrl = (raw?.imageUrl ?? raw?.imagen_url ?? '') || undefined;
  const category = (raw?.category ?? raw?.categoria ?? null) as string | null;
  const province = (raw?.province ?? raw?.provincia ?? null) as string | null;
  return { title, url, imageUrl, category, province };
};

type NavProp = NativeStackNavigationProp<RootStackParamList, 'BenefitDetail'>;

const BenefitsListScreen: React.FC = () => {
  const [beneficios, setBeneficios] = useState<BenefitVM[]>([]);
  const [filteredBeneficios, setFilteredBeneficios] = useState<BenefitVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);

  const navigation = useNavigation<NavProp>();

  useEffect(() => {
    setLoading(true);
    const auth = getAuth(getApp());
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) {
        setError('Debe iniciar sesión para ver los beneficios.');
        setLoading(false);
        return;
      }
      try {
        const db = getFirestore(getApp());
        const snap = await getDocs(collection(db, 'beneficios'));

        const data: BenefitVM[] = snap.docs.map(d => mapDocToVM(d.data()));
        setBeneficios(data);

        // Categorías únicas con orden fijo
        const rawCats: string[] = data.map(i => (i.category ?? '').trim());
        const cats: string[] = Array.from(new Set<string>(rawCats.filter(isNonEmptyString)))
          .sort(sortByCategoryOrder);
        setCategorias(cats);

        // Provincias únicas, “Nacional” primero
        const rawProvs: string[] = data.map(i => (i.province ?? '').trim());
        const provs: string[] = Array.from(new Set<string>(rawProvs.filter(isNonEmptyString)));
        setProvincias(sortProvinces([...provs]));
      } catch (e) {
        console.error('Error al cargar beneficios:', e);
        setError('No se pudieron cargar los beneficios. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let result = [...beneficios];
    if (search.trim()) {
      const ql = search.toLowerCase();
      result = result.filter(i => i.title.toLowerCase().includes(ql));
    }
    if (selectedCategoria) result = result.filter(i => (i.category ?? '').trim() === selectedCategoria);
    if (selectedProvincia) result = result.filter(i => (i.province ?? '').trim() === selectedProvincia);
    setFilteredBeneficios(result);
  }, [search, selectedCategoria, selectedProvincia, beneficios]);

  const renderItem = ({ item }: { item: BenefitVM }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BenefitDetail', { url: item.url })}
    >
      {!!item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando beneficios...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar beneficios..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterButton, !selectedCategoria && styles.filterButtonActive]}
            onPress={() => setSelectedCategoria(null)}
          >
            <Text style={[styles.filterText, !selectedCategoria && styles.filterTextActive]}>Todas</Text>
          </TouchableOpacity>
          {categorias.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterButton, selectedCategoria === cat && styles.filterButtonActive]}
              onPress={() => setSelectedCategoria(cat)}
            >
              <Text style={[styles.filterText, selectedCategoria === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Provincia:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterButton, !selectedProvincia && styles.filterButtonActive]}
            onPress={() => setSelectedProvincia(null)}
          >
            <Text style={[styles.filterText, !selectedProvincia && styles.filterTextActive]}>Todas</Text>
          </TouchableOpacity>
          {provincias.map(prov => (
            <TouchableOpacity
              key={prov}
              style={[styles.filterButton, selectedProvincia === prov && styles.filterButtonActive]}
              onPress={() => setSelectedProvincia(prov)}
            >
              <Text style={[styles.filterText, selectedProvincia === prov && styles.filterTextActive]}>
                {prov}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredBeneficios.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron beneficios.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBeneficios}
          renderItem={renderItem}
          keyExtractor={(item, idx) => `${item.title}-${idx}`}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f0f2f5' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  searchContainer: { marginBottom: 12 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 15, height: 45, backgroundColor: '#fff', fontSize: 16, color: '#333' },
  filterSection: { marginBottom: 12 },
  filterTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  filterScroll: { paddingVertical: 4 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#007bff', backgroundColor: '#fff', marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  filterButtonActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  filterText: { color: '#007bff', fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  list: { paddingBottom: 16 },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginVertical: 6, borderRadius: 10, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  cardImage: { width: 100, height: 100, borderRadius: 10, overflow: 'hidden' },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noResultsText: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default BenefitsListScreen;
