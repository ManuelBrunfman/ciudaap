import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, orderBy, onSnapshot } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList, NewsItem } from '../../types/RootStackParamList';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppText from '../../ui/AppText';

type Nav = StackNavigationProp<RootStackParamList, 'NewsDetail'>;

const NewsListScreen: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<Nav>();
  const t = useTheme();

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<NewsItem, 'id'>) }));
        setNews(data as NewsItem[]);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const openDetail = (item: NewsItem) => navigation.navigate('NewsDetail', { newsItem: item });

  if (loading) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: t.colors.background }]}>
        <ActivityIndicator size="large" color={t.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.colors.background }]}>
      <FlatList
        data={news}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, { backgroundColor: t.colors.surface }]} onPress={() => openDetail(item)}>
            {item.img && <Image source={{ uri: item.img }} style={styles.image} />}
            <View style={styles.textContainer}>
              <AppText style={[styles.title, { color: t.colors.onBackground }]}>{item.title}</AppText>
              <AppText style={[styles.date, { color: t.colors.muted }]}>
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : new Date(item.createdAt).toLocaleString()}
              </AppText>
            </View>
          </Pressable>
        )}
        keyExtractor={i => i.id}
        contentContainerStyle={[styles.list]}
      />
    </SafeAreaView>
  );
};

export default NewsListScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.md },
  card: {
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 160 },
  textContainer: { padding: spacing.sm },
  title: { fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
  date: { fontSize: 12 },
});
