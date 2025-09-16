// PATH: BenefitsListScreen.tsx
// Lista de beneficios con:
// - Categorías canónicas (8): Alojamiento, Gastronomía, Excursiones y Actividades,
//   Transporte, Retail, Comercio, Servicios, Deportes
// - Filtros robustos (ignora mayúsculas/acentos)
// - De-dupe por URL canónica (colapsa sufijos -N y quita www, query, hash, barra final)
// - Excluye agregadores "Disfrutá ..."
// - Fix puntual: Bagú Ushuaia → Tierra del Fuego cuando venga como "Nacional"
// - keyExtractor estable sin índice

import React, { useState, useEffect } from 'react';
import {
  View, FlatList, ActivityIndicator, StyleSheet,
  Image, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/RootStackParamList';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../theme';
import AppText from '../../ui/AppText';
import Card from '../../ui/Card';

// --------- ViewModel local ---------
type BenefitVM = {
  title: string;
  url: string;
  imageUrl?: string | null;
  category: string | null;
  province: string | null;
};

// ---------- Utils ----------
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

const normalizeStr = (s: unknown) =>
  (typeof s === 'string' ? s : '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const eqNorm = (a: unknown, b: unknown) => normalizeStr(a) === normalizeStr(b);

// --- categorías canónicas y orden ---
const CATEGORY_ORDER: readonly string[] = [
  'Alojamiento',
  'Gastronomía',
  'Excursiones y Actividades',
  'Transporte',
  'Retail',
  'Comercio',
  'Servicios',
  'Deportes',
] as const;

const canonicalCategory = (raw?: string | null, title?: string | null): string => {
  const s = normalizeStr(raw);
  const t = normalizeStr(title);
  if (s.includes('aloj')) return 'Alojamiento';
  if (s.includes('gastro')) return 'Gastronomía';
  if (s.includes('excurs') || s.includes('actividad')) return 'Excursiones y Actividades';
  if (s.includes('transp')) return 'Transporte';
  if (s.includes('retail')) return 'Retail';
  if (s.includes('comerc')) return 'Comercio';
  if (s.includes('deporte') || s.includes('gimnas')) return 'Deportes';
  if (s.includes('salud') || s.includes('educac') || s.includes('serv')) return 'Servicios';
  // Heurísticas por título si la categoría no viene clara
  if (/(hotel|hosteri|hostería|apart|cabañ|departamento|hostel|resort|spa)/i.test(t)) return 'Alojamiento';
  if (/(resto|restaurant|parrilla|gastro|cervec|cocina|bar)/i.test(t)) return 'Gastronomía';
  if (/(termas|excurs|actividad|paseo|catamara|reserva|rafting|trekking|delta|ballena)/i.test(t)) return 'Excursiones y Actividades';
  if (/(micro|bus|chevalier|rutatl|crucero del norte|hertz|rent ?car|avion|a[eé]reo|cochera)/i.test(t)) return 'Transporte';
  if (/(megatlon|gimnas|gym|deporte)/i.test(t)) return 'Deportes';
  if (/(indumentaria|tienda|local|retail)/i.test(t)) return 'Retail';
  if (/(comercio)/i.test(t)) return 'Comercio';
  return 'Servicios';
};

const catIndex = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c);
  return i === -1 ? 999 : i;
};
const sortByCategoryOrder = (a: string, b: string) =>
  (catIndex(a) === catIndex(b) ? a.localeCompare(b) : catIndex(a) - catIndex(b));

const sortProvinces = (arr: string[]) =>
  arr.sort((a, b) => {
    if (a === 'Nacional' && b !== 'Nacional') return -1;
    if (b === 'Nacional' && a !== 'Nacional') return 1;
    return a.localeCompare(b);
  });

const DISFRUTA_RE = /^disfrut[aá]\b/i; // excluye agregadores

const canonicalPath = (u: string) => {
  try {
    const url = new URL(u);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    let path = url.pathname.toLowerCase().replace(/\/+$/, '');
    // Colapsa variantes "-N" al final (p. ej. -2, -3)
    path = path.replace(/-\d+(?=\/|$)/, '');
    return `${host}${path}` || u.toLowerCase();
  } catch {
    return (u || '').toLowerCase().replace(/\/+$/, '').replace(/-\d+(?=\/|$)/, '');
  }
};

const score = (it: BenefitVM) =>
  (it.imageUrl ? 1 : 0) +
  (it.province && it.province !== 'Nacional' ? 1 : 0) +
  (it.category ? 1 : 0);

// Fix puntual: Bagú Ushuaia → Tierra del Fuego cuando venga como Nacional
const fixProvinceIfBaguUshuaia = (it: BenefitVM): BenefitVM =>
  /bag[uú]\s+ushuaia/i.test(it.title)
    ? { ...it, province: it.province === 'Nacional' ? 'Tierra del Fuego' : it.province }
    : it;

const PLACEHOLDER = 'https://dummyimage.com/300x300/eeeeee/888888&text=Beneficio';

const mapDocToVM = (raw: any): BenefitVM => {
  const title    = (raw?.title ?? raw?.titulo ?? '').toString();
  const url      = (raw?.url ?? raw?.link ?? '').toString();
  const rawCat   = (raw?.category ?? raw?.categoria ?? null) as string | null;
  const category = canonicalCategory(rawCat, title);
  const province = (raw?.province ?? raw?.provincia ?? null) as string | null;
  const imageUrlRaw: string = (raw?.imageUrl ?? raw?.imagen_url ?? '')?.toString().trim();
  const imageUrl = imageUrlRaw && /^https?:\/\//i.test(imageUrlRaw) ? imageUrlRaw : null;
  return { title, url, imageUrl, category, province };
};

// --------- Componente ---------

type NavProp = StackNavigationProp<RootStackParamList, 'BenefitDetail'>;

const BenefitsListScreen: React.FC = () => {
  const t = useTheme();
  const [items, setItems] = useState<BenefitVM[]>([]);
  const [filtered, setFiltered] = useState<BenefitVM[]>([]);
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
    const unsub = onAuthStateChanged(auth, async () => {
      try {
        const fs = getFirestore(app);
        const colRef = collection(fs, 'beneficios'); // misma colección
        const snap = await getDocs(colRef);

        const mapped: BenefitVM[] = [];
        snap.forEach(d => {
          const vm = mapDocToVM(d.data());
          if (!isNonEmptyString(vm.title) || !isNonEmptyString(vm.url)) return;
          mapped.push(vm);
        });

        // Limpieza: saca "Disfrutá ...", de-dupe por URL canónica, fix Bagú
        const bestByKey = new Map<string, BenefitVM>();
        for (const raw of mapped) {
          if (DISFRUTA_RE.test(raw.title)) continue;
          const it = fixProvinceIfBaguUshuaia(raw);
          const key = canonicalPath(it.url) || it.title.toLowerCase();
          const prev = bestByKey.get(key);
          if (!prev || score(it) > score(prev)) bestByKey.set(key, it);
        }
        const cleaned = Array.from(bestByKey.values());

        // Colecta categorías/provincias únicas para los filtros
        const cats = new Set<string>();
        const provs = new Set<string>();
        for (const it of cleaned) {
          if (isNonEmptyString(it.category)) cats.add(it.category!);
          if (isNonEmptyString(it.province)) provs.add(it.province!);
        }

        const uniqueCats = Array.from(cats).sort(sortByCategoryOrder);
        const uniqueProvs = sortProvinces(Array.from(provs));

        setItems(cleaned);
        setFiltered(cleaned);
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
    let result = [...items];
    if (search.trim()) {
      const q = normalizeStr(search);
      result = result.filter(i => normalizeStr(i.title).includes(q));
    }
    if (selectedCategoria) result = result.filter(i => eqNorm(i.category, selectedCategoria));
    if (selectedProvincia) result = result.filter(i => eqNorm(i.province, selectedProvincia));
    setFiltered(result);
  }, [search, selectedCategoria, selectedProvincia, items]);

  const renderItem = ({ item }: { item: BenefitVM }) => (
    <TouchableOpacity onPress={() => (navigation as any)?.navigate?.('BenefitDetail', { url: item.url })}>
      <Card style={[styles.card, { backgroundColor: t.colors.surface, shadowColor: t.colors.onBackground }] }>
        <Image source={{ uri: item.imageUrl || PLACEHOLDER }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <AppText style={[styles.cardTitle, { color: t.colors.onBackground }]}>{item.title}</AppText>
          {item.category ? <AppText style={[styles.cardSubtitle, { color: t.colors.muted }]}>{item.category}</AppText> : null}
          {item.province ? (
            <AppText style={[styles.cardChip, { backgroundColor: t.colors.surface, color: t.colors.primary }]}>
              {item.province}
            </AppText>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: t.colors.background }]}>
        <ActivityIndicator size="large" />
        <AppText style={[styles.loadingText, { color: t.colors.muted }]}>Cargando beneficios...</AppText>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.colors.background }]}>
        <AppText style={{ color: t.colors.danger, textAlign: 'center' }}>{error}</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.colors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar beneficio..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={t.colors.muted}
          style={[
            styles.searchInput,
            { borderColor: t.colors.border, backgroundColor: t.colors.background, color: t.colors.onBackground },
          ]}
        />
      </View>

      {/* Filtro por categoría */}
      <View style={styles.filterSection}>
        <AppText style={[styles.filterTitle, { color: t.colors.onBackground }]}>Categoría:</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity style={[styles.filterButton, !selectedCategoria && { backgroundColor: t.colors.primary, borderColor: t.colors.primary }]} onPress={() => setSelectedCategoria(null)}>
            <AppText style={[styles.filterText, !selectedCategoria && { color: t.colors.onPrimary }]}>Todas</AppText>
          </TouchableOpacity>
          {categorias.map(cat => (
            <TouchableOpacity key={cat} style={[styles.filterButton, selectedCategoria === cat && { backgroundColor: t.colors.primary, borderColor: t.colors.primary }]} onPress={() => setSelectedCategoria(cat)}>
              <AppText style={[styles.filterText, selectedCategoria === cat && { color: t.colors.onPrimary }]}>{cat}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filtro por provincia */}
      <View style={styles.filterSection}>
        <AppText style={[styles.filterTitle, { color: t.colors.onBackground }]}>Provincia:</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity style={[styles.filterButton, !selectedProvincia && { backgroundColor: t.colors.primary, borderColor: t.colors.primary }]} onPress={() => setSelectedProvincia(null)}>
            <AppText style={[styles.filterText, !selectedProvincia && { color: t.colors.onPrimary }]}>Todas</AppText>
          </TouchableOpacity>
          {provincias.map(prov => (
            <TouchableOpacity key={prov} style={[styles.filterButton, selectedProvincia === prov && { backgroundColor: t.colors.primary, borderColor: t.colors.primary }]} onPress={() => setSelectedProvincia(prov)}>
              <AppText style={[styles.filterText, selectedProvincia === prov && { color: t.colors.onPrimary }]}>{prov}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista */}
      {filtered.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <AppText style={[styles.noResultsText, { color: t.colors.muted }]}>No hay resultados con los filtros actuales.</AppText>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => canonicalPath(item.url) || item.title}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: spacing.sm + spacing.xs / 2, fontSize: 16 },
  searchContainer: { marginBottom: spacing.md },
  searchInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: spacing.md, height: 45, fontSize: 16 },
  filterSection: { marginBottom: spacing.md },
  filterTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: spacing.sm },
  filterScroll: { paddingVertical: spacing.xs },
  filterButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md + spacing.xs, borderWidth: 1, borderRadius: 20, marginRight: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 14, fontWeight: '600' },
  list: { paddingBottom: spacing.md + spacing.xs },
  card: { flexDirection: 'row', marginVertical: spacing.sm - spacing.xs / 2, borderRadius: 12, padding: spacing.sm + spacing.xs / 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  cardImage: { width: 100, height: 100, borderRadius: 10, overflow: 'hidden' },
  cardContent: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  cardSubtitle: { fontSize: 13, marginTop: spacing.xs / 2 },
  cardChip: { alignSelf: 'flex-start', marginTop: spacing.sm - spacing.xs / 2, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs / 2, borderRadius: 6, overflow: 'hidden' },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  noResultsText: { fontSize: 16, textAlign: 'center' },
});

export default BenefitsListScreen;
