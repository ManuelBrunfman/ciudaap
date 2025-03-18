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
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../config/firebaseConfig';
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
  const [filteredBeneficios, setFilteredBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'BenefitsList'>>();

  const loadBeneficios = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando beneficios desde Firestore...');

      const querySnapshot = await getDocs(collection(firestore, 'beneficios'));
      const data = querySnapshot.docs.map(doc => doc.data() as Beneficio);

      console.log(`Cargados ${data.length} beneficios`);
      setBeneficios(data);

      const uniqueCategorias = Array.from(new Set(data.map(item => item.categoria).filter(Boolean) as string[])).sort();
      const uniqueProvincias = Array.from(new Set(data.map(item => item.provincia).filter(Boolean) as string[])).sort();

      setCategorias(uniqueCategorias);
      setProvincias(uniqueProvincias);
    } catch (err) {
      console.error('Error cargando beneficios:', err);
      setError('Error al cargar los beneficios. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficios();
  }, []);

  useEffect(() => {
    let result = [...beneficios];

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter(item => item.titulo.toLowerCase().includes(searchLower));
    }

    if (selectedCategoria) {
      result = result.filter(item => item.categoria === selectedCategoria);
    }

    if (selectedProvincia) {
      result = result.filter(item => item.provincia === selectedProvincia);
    }

    setFilteredBeneficios(result);
  }, [search, selectedCategoria, selectedProvincia, beneficios]);

  const renderBeneficio = ({ item }: { item: Beneficio }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BenefitDetail', { url: item.link })}
    >
      <Image source={{ uri: item.imagen_url }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        {item.categoria && <View style={styles.tagContainer}><Text style={styles.tag}>{item.categoria}</Text></View>}
        {item.provincia && <View style={styles.tagContainer}><Text style={styles.tag}>{item.provincia}</Text></View>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar beneficios..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {categorias.map(categoria => (
            <TouchableOpacity
              key={categoria}
              style={[styles.filterChip, selectedCategoria === categoria && styles.filterChipSelected]}
              onPress={() => setSelectedCategoria(selectedCategoria === categoria ? null : categoria)}
            >
              <Text style={[styles.filterChipText, selectedCategoria === categoria && styles.filterChipTextSelected]}>
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {provincias.map(provincia => (
            <TouchableOpacity
              key={provincia}
              style={[styles.filterChip, selectedProvincia === provincia && styles.filterChipSelected]}
              onPress={() => setSelectedProvincia(selectedProvincia === provincia ? null : provincia)}
            >
              <Text style={[styles.filterChipText, selectedProvincia === provincia && styles.filterChipTextSelected]}>
                {provincia}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={filteredBeneficios}
        renderItem={renderBeneficio}
        keyExtractor={(item, index) => `${item.titulo}-${index}`}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default BenefitsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  searchContainer: {
    height: 50,
    justifyContent: 'center',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  filtersWrapper: {
    height: 120, // 📌 Mantiene una altura fija para evitar que los filtros se muevan
    justifyContent: 'center',
  },
  filtersContainer: {
    height: 50, // 📌 Altura fija para los chips
    marginBottom: 10,
  },
  filterChip: {
    minWidth: 90,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  filterChipSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  filterChipText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  filterChipTextSelected: {
    color: 'white',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#EFEFEF',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    marginRight: 5,
    color: '#666',
  },
});
