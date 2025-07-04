// src/screens/videos/YouTubeChannelScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

type Nav = NativeStackNavigationProp<RootStackParamList, 'YouTubeChannel'>;

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  published: string;
}

const CHANNEL_ID = 'UC-rMO27hUU1HoPK7rH4DFlw'; // Reemplazalo si tu canal es otro

export default function YouTubeChannelScreen() {
  const navigation = useNavigation<Nav>();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideos = useCallback(async () => {
    setRefreshing(true);
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
      const proxyUrl =
        'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);

      const response = await fetch(proxyUrl);
      console.log('YouTube RSS status:', response.status); // 👈 consola para debug

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { items } = await response.json();

      const parsed: VideoItem[] = items.map((e: any) => ({
        id: e.guid.split(':').pop(),
        title: e.title,
        thumbnail: e.thumbnail,
        published: e.pubDate,
      }));

      setVideos(parsed);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron cargar los videos.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  if (!loading && videos.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay videos disponibles.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchVideos} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('YouTubeVideo', { videoId: item.id })}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{new Date(item.published).toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumb: { width: 130, height: 90 },
  info: { flex: 1, padding: 8, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: 'bold' },
  date: { marginTop: 4, fontSize: 12, color: '#666' },
});
