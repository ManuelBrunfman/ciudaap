// src/screens/videos/YouTubeChannelScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../types/RootStackParamList';
import { XMLParser } from 'fast-xml-parser';
import AppText from '../../ui/AppText';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';

// --------------------
// Types & constants
// --------------------
type Nav = StackNavigationProp<RootStackParamList, 'YouTubeChannel'>;

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  published: string;
}

/**
 * Mostrar videos de una lista de reproducción específica.
 * Copiá el ID después de `list=` en la URL.
 * Ej.: https://www.youtube.com/watch?v=abc&list=PL123 → PLAYLIST_ID = "PL123…".
 */
const PLAYLIST_ID = 'PL3LGmToYRxqu5XmBd9k0zUQNUeq7MaoNn'; // ← tu playlist

const parser = new XMLParser({ ignoreAttributes: false });

// --------------------
// Helpers
// --------------------
async function fetchPlaylistFeed(playlistId: string) {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Network response was not ok: ${resp.status}`);
  return resp;
}

// --------------------
// Component
// --------------------
export default function YouTubeChannelScreen() {
  const navigation = useNavigation<Nav>();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const t = useTheme();

  const fetchVideos = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetchPlaylistFeed(PLAYLIST_ID);
      const xmlText = await response.text();
      const json = parser.parse(xmlText);
      const entries = json.feed?.entry ?? [];

      const parsed: VideoItem[] = entries.map((e: any) => ({
        id: e['yt:videoId'],
        title: e.title,
        thumbnail: Array.isArray(e['media:group']['media:thumbnail'])
          ? e['media:group']['media:thumbnail'][0]['@_url']
          : e['media:group']['media:thumbnail']['@_url'],
        published: e.published,
      }));

      setVideos(parsed);
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        'No se pudieron cargar los videos. Verificá que PLAYLIST_ID sea correcto y que la lista sea pública.'
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) return <ActivityIndicator style={styles.loader} />;

  if (!loading && videos.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.background }]}>
        <AppText style={{ color: t.colors.muted }}>No hay videos disponibles.</AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.list, { backgroundColor: t.colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchVideos} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: t.colors.surface }]}
          onPress={() => navigation.navigate('YouTubeVideo', { videoId: item.id })}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
          <View style={styles.info}>
            <AppText style={[styles.title, { color: t.colors.onBackground }]}>{item.title}</AppText>
            <AppText style={[styles.date, { color: t.colors.muted }]}>{new Date(item.published).toLocaleDateString()}</AppText>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: spacing.md },
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    elevation: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  thumb: { width: 130, height: 90 },
  info: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: 'bold' },
  date: { marginTop: spacing.xs, fontSize: 12 },
});
