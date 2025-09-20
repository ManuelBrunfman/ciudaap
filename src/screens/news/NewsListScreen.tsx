import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirebaseApp } from '../../config/firebaseApp';

type Nav = StackNavigationProp<RootStackParamList, 'NewsDetail'>;

const NewsListScreen: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<Nav>();
  const t = useTheme();
  const listStyles = useMemo(
    () => ({ surface: t.colors.surface, title: t.colors.onBackground, muted: t.colors.muted }),
    [t.colors.muted, t.colors.onBackground, t.colors.surface],
  );

  useEffect(() => {
    const db = getFirestore(getFirebaseApp());
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

  const openDetail = useCallback((item: NewsItem) => navigation.navigate('NewsDetail', { newsItem: item }), [navigation]);
  const renderItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <NewsListItem item={item} tColors={listStyles} onPress={openDetail} />
    ),
    [listStyles, openDetail],
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: 'transparent' }]}>
        <ActivityIndicator size="large" color={t.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <MaskedView
        style={styles.maskContainer}
        maskElement={
          <View style={styles.maskWrapper}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
              locations={[0, 0.4]}
              style={styles.maskGradient}
            />
            <View style={styles.maskFill} />
          </View>
        }
      >
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
        />
      </MaskedView>
    </SafeAreaView>
  );
};

export default NewsListScreen;

const NewsListItem = memo(function NewsListItem({
  item,
  tColors,
  onPress,
}: {
  item: NewsItem;
  tColors: { surface: string; title: string; muted: string };
  onPress: (item: NewsItem) => void;
}) {
  const handlePress = useCallback(() => onPress(item), [onPress, item]);
  return (
    <Pressable style={[styles.card, { backgroundColor: tColors.surface }]} onPress={handlePress}>
      {item.img && <Image source={{ uri: item.img }} style={styles.image} />}
      <View style={styles.textContainer}>
        <AppText style={[styles.title, { color: tColors.title }]}>{item.title}</AppText>
        <AppText style={[styles.date, { color: tColors.muted }]}>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleString()
            : new Date(item.createdAt).toLocaleString()}
        </AppText>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  maskContainer: { flex: 1 },
  maskWrapper: { flex: 1 },
  maskGradient: {
    width: '100%',
    height: spacing.xl * 2,
  },
  maskFill: { flex: 1, backgroundColor: '#000' },
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
