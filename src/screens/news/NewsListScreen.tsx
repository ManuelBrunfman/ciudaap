import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
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

type Nav = StackNavigationProp<RootStackParamList, 'NewsDetail'>;

const NewsListScreen: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<Nav>();

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
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#2E86C1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={news}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => openDetail(item)}>
            {item.img && <Image source={{ uri: item.img }} style={styles.image} />}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </Pressable>
        )}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default NewsListScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 160 },
  textContainer: { padding: 8 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  date: { fontSize: 12, color: '#666' },
});
