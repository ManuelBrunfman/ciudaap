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

// Definición de la interfaz para un Beneficio
interface Beneficio {
  titulo: string;
  link: string;
  imagen_url: string;
  categoria?: string;
  provincia?: string;
}

const BenefitsListScreen: React.FC = () => {
  // Estados para los datos y el manejo de la UI
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]); // Todos los beneficios cargados
  const [filteredBeneficios, setFilteredBeneficios] = useState<Beneficio[]>([]); // Beneficios después de aplicar filtros
  const [loading, setLoading] = useState(true); // Indica si los datos están cargando
  const [error, setError] = useState<string | null>(null); // Mensaje de error si la carga falla

  // Estados para los criterios de búsqueda y filtro
  const [search, setSearch] = useState(''); // Texto de búsqueda
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null); // Categoría seleccionada para filtrar
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null); // Provincia seleccionada para filtrar

  // Estados para las listas únicas de categorías y provincias (para los botones de filtro)
  const [categorias, setCategorias] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);

  // Hook de navegación de React Navigation
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'BenefitsList'>>();

  // Efecto para cargar los beneficios desde Firestore al inicio
  useEffect(() => {
    const loadBeneficios = async () => {
      try {
        const snap = await firestore().collection('beneficios').get();
        const data = snap.docs.map(d => d.data() as Beneficio);
        setBeneficios(data);

        // Extrae categorías y provincias únicas y las ordena
        setCategorias(
          Array.from(new Set(data.map(i => i.categoria).filter(Boolean) as string[])).sort()
        );
        setProvincias(
          Array.from(new Set(data.map(i => i.provincia).filter(Boolean) as string[])).sort()
        );
      } catch (e) {
        // Manejo de errores en la carga
        console.error("Error al cargar beneficios:", e);
        setError('No se pudieron cargar los beneficios. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };
    loadBeneficios();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Efecto para aplicar los filtros cada vez que cambian los criterios de búsqueda o los beneficios originales
  useEffect(() => {
    let result = [...beneficios]; // Copia los beneficios originales para aplicar filtros

    // Aplica filtro por texto de búsqueda (sin distinción de mayúsculas/minúsculas)
    if (search.trim()) {
      const lowerCaseSearch = search.toLowerCase();
      result = result.filter(i => i.titulo.toLowerCase().includes(lowerCaseSearch));
    }

    // Aplica filtro por categoría seleccionada
    if (selectedCategoria) {
      result = result.filter(i => i.categoria === selectedCategoria);
    }

    // Aplica filtro por provincia seleccionada
    if (selectedProvincia) {
      result = result.filter(i => i.provincia === selectedProvincia);
    }

    setFilteredBeneficios(result); // Actualiza la lista de beneficios filtrados
  }, [search, selectedCategoria, selectedProvincia, beneficios]); // Dependencias del efecto

  // Función para renderizar cada elemento en la FlatList
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

  // Muestra un indicador de carga si los datos están cargando
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando beneficios...</Text>
      </SafeAreaView>
    );
  }

  // Muestra un mensaje de error si la carga falló
  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Renderiza la interfaz principal del componente
  return (
    <SafeAreaView style={styles.container}>
      {/* Sección de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar beneficios por título..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Sección de filtros por Categoría */}
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

      {/* Sección de filtros por Provincia */}
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

      {/* Mensaje si no hay beneficios filtrados */}
      {filteredBeneficios.length === 0 && !loading && !error && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No se encontraron beneficios con los filtros aplicados.</Text>
        </View>
      )}

      {/* Lista de beneficios filtrados */}
      <FlatList
        data={filteredBeneficios}
        renderItem={renderItem}
        // Se recomienda usar un ID único si está disponible, si no, el índice con el título puede servir
        keyExtractor={(item, idx) => `${item.titulo}-${idx}-${item.link}`}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default BenefitsListScreen;

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f2f5', // Un color de fondo suave
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
    paddingVertical: 4, // Espacio vertical para los botones
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
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardImage: {
    width: 100, // Ajustado ligeramente para mejor visualización
    height: 100, // Ajustado ligeramente para mejor visualización
    borderRadius: 10, // Bordes redondeados para la imagen
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center', // Centra el contenido verticalmente
  },
  cardTitle: {
    fontSize: 17, // Ligeramente más grande
    fontWeight: '700', // Más negrita
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