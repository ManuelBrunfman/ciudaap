// src/screens/videos/YouTubeChannelScreen.tsx

/*
 * Pantalla lista para copiar/pegar.
 * Fallback usando endpoint `search.list` en vez de playlistItems.list
 * para evitar bloqueos de método específicos.
 * Requiere tu API key en .env: EXPO_PUBLIC_YT_API_KEY o YOUTUBE_API_KEY.
 */

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

// ID de canal; mantenelo correcto
const CHANNEL_ID = 'UC-rMO27hUU1HoPK7rH4DFlw';
// API Key: busca EXPO_PUBLIC_YT_API_KEY o YOUTUBE_API_KEY
const API_KEY =
  process.env.EXPO_PUBLIC_YT_API_KEY ||
  (process.env as any).YOUTUBE_API_KEY ||
  '';

type Nav = NativeStackNavigationProp<RootStackParamList, 'YouTubeChannel'>;
interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  published: string;
}

export default function YouTubeChannelScreen() {
  const navigation = useNavigation<Nav>();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideos = useCallback(async () => {
    if (!API_KEY) {
      Alert.alert(
        'Falta API Key',
        'Definí EXPO_PUBLIC_YT_API_KEY o YOUTUBE_API_KEY en tu .env',
      );
      setLoading(false);
      return;
    }
    setRefreshing(true);
    try {
      const url =
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&channelId=${CHANNEL_ID}&order=date&maxResults=25&key=${API_KEY}`;
      const response = await fetch(url);
      console.log('YT Search API status:', response.status);
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const apiMsg = errData?.error?.message || 'Network error';
        console.log('YT error body:', errData);
        throw new Error(apiMsg);
      }
      const { items } = await response.json();
      const parsed: VideoItem[] = (items || []).map((it: any) => ({
        id: it.id.videoId,
        title: it.snippet.title,
        thumbnail: it.snippet.thumbnails.medium.url,
        published: it.snippet.publishedAt,
      }));
      setVideos(parsed);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudieron cargar los videos.');
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
