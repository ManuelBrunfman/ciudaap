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
  category: string | null;
  province: string | null;
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

// ---------- Placeholder si no hay imagen ----------
const PLACEHOLDER =
  'https://dummyimage.com/300x300/eeeeee/888888&text=Beneficio';

// Normaliza un posible campo imagen y devuelve undefined si está vacío/inválido
const normalizeImageUrl = (raw: any): string | undefined => {
  const candidate = (raw?.imageUrl ?? raw?.imagen_url ?? '').toString().trim();
  if (!candidate) return undefined;
  // Evita pasar strings inválidas como "undefined", "null", etc.
  if (/^(undefined|null)$/i.test(candidate)) return undefined;
  // Requiere http/https válido
  if (!/^https?:\/\//i.test(candidate)) return undefined;
  return candidate;
};

// Mapea el doc crudo de Firestore (en ES o EN) a nuestro VM
const mapDocToVM = (raw: any): BenefitVM => {
  const title    = (raw?.title ?? raw?.titulo ?? '').toString();
  const url      = (raw?.url ?? raw?.link ?? '').toString();
  const imageUrl = normalizeImageUrl(raw);
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
    const app = getApp();
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async user => {
      try {
        const fs = getFirestore(app);
        const col = collection(fs, 'beneficios');
        const snap = await getDocs(col);

        const items: BenefitVM[] = [];
        const cats = new Set<string>();
        const provs = new Set<string>();

        snap.forEach(d => {
          const vm = mapDocToVM(d.data());
          if (!isNonEmptyString(vm.title) || !isNonEmptyString(vm.url)) return;
          items.push(vm);
          if (isNonEmptyString(vm.category ?? '')) cats.add(vm.category as string);
          if (isNonEmptyString(vm.province ?? '')) provs.add(vm.province as string);
        });

        const uniqueCats = Array.from(cats).sort(sortByCategoryOrder);
        const uniqueProvs = sortProvinces(Array.from(provs));

        setBeneficios(items);
        setFilteredBeneficios(items);
        setCategorias(uniqueCats);
        setProvincias(uniqueProvs);
        setError(null);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? 'Error al cargar beneficios');
      } finally {
        setLoading(false);
      }
    });
    return unsub;
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

  const renderItem = ({ item }: { item: BenefitVM }) => {
    // Siempre mostrar una imagen: real si existe, si no, placeholder
    const src = { uri: item.imageUrl ?? PLACEHOLDER };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BenefitDetail', { url: item.url })}
      >
        <Image source={src} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando beneficios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar beneficio..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Filtro por categoría */}
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

      {/* Filtro por provincia */}
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

      {/* Lista */}
      {filteredBeneficios.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No hay resultados con los filtros actuales.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBeneficios}
          keyExtractor={(item, idx) => `${item.url}-${idx}`}
          renderItem={renderItem}
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
  searchInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    paddingHorizontal: 12, height: 45, backgroundColor: '#fff',
    fontSize: 16, color: '#333'
  },
  filterSection: { marginBottom: 12 },
  filterTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  filterScroll: { paddingVertical: 4 },
  filterButton: {
    paddingVertical: 8, paddingHorizontal: 15, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 20, marginRight: 8, alignItems: 'center', justifyContent: 'center'
  },
  filterButtonActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  filterText: { color: '#007bff', fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  list: { paddingBottom: 16 },
  card: {
    flexDirection: 'row', backgroundColor: '#fff', marginVertical: 6, borderRadius: 12, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2
  },
  cardImage: { width: 100, height: 100, borderRadius: 10, overflow: 'hidden' },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noResultsText: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export default BenefitsListScreen;
