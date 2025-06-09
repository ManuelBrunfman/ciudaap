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
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

interface Beneficio {
  titulo: string;
  link: string;
  imagen_url: string;
  categoria?: string;
  provincia?: string;
}

type NavProp = NativeStackNavigationProp<RootStackParamList, 'BenefitDetail'>;

const BenefitsListScreen: React.FC = () => {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [filteredBeneficios, setFilteredBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);

  const navigation = useNavigation<NavProp>();

  useEffect(() => {
    const loadBeneficios = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const snap = await getDocs(collection(db, 'beneficios'));
        const data = snap.docs.map(d => d.data() as Beneficio);
        setBeneficios(data);

        setCategorias(
          Array.from(new Set(data.map(i => i.categoria).filter(Boolean) as string[])).sort()
        );
        setProvincias(
          Array.from(new Set(data.map(i => i.provincia).filter(Boolean) as string[])).sort()
        );
      } catch (e) {
        console.error('Error al cargar beneficios:', e);
        setError('No se pudieron cargar los beneficios. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };
    loadBeneficios();
  }, []);

  useEffect(() => {
    let result = [...beneficios];
    if (search.trim()) {
      const ql = search.toLowerCase();
      result = result.filter(i => i.titulo.toLowerCase().includes(ql));
    }
    if (selectedCategoria) result = result.filter(i => i.categoria === selectedCategoria);
    if (selectedProvincia) result = result.filter(i => i.provincia === selectedProvincia);
    setFilteredBeneficios(result);
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar beneficios por título..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtros por Categoría */}
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
              <Text style={[styles.filterText, selectedCategoria === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filtros por Provincia */}
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
              <Text style={[styles.filterText, selectedProvincia === prov && styles.filterTextActive]}>{prov}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mensaje si no hay resultados */}
      {filteredBeneficios.length === 0 && !loading && !error && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron beneficios con los filtros aplicados.</Text>
        </View>
      )}

      {/* Lista */}
      <FlatList
        data={filteredBeneficios}
        renderItem={renderItem}
        keyExtractor={(item, idx) => `${item.titulo}-${idx}-${item.link}`}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default BenefitsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  filterScroll: {
    paddingVertical: 4,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#fff',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
