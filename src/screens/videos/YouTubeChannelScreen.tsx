// src/screens/videos/YouTubeChannelScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { XMLParser } from 'fast-xml-parser';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/RootStackParamList';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  published: string;
}

const CHANNEL_HANDLE_URL =
  'https://www.youtube.com/@labancariaprensaydifusion9027';

const extractChannelId = (html: string): string | null => {
  const match = html.match(/"channelId":"(UC[\w-]{22})"/);
  return match ? match[1] : null;
};

type Nav = NativeStackNavigationProp<RootStackParamList, 'YouTubeVideo'>;

export default function YouTubeChannelScreen() {
  const navigation = useNavigation<Nav>();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      setRefreshing(true);
      const htmlRes = await fetch(CHANNEL_HANDLE_URL);
      const html = await htmlRes.text();
      const channelId = extractChannelId(html);

      if (!channelId) {
        throw new Error('No se pudo obtener el channelId del canal.');
      }

      const rssRes = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
      );
      const xml = await rssRes.text();
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
      const json = parser.parse(xml);
      const items = (json.feed?.entry ?? []) as any[];

      const mapped = items.map(e => ({
        id: e['yt:videoId'],
        title: e.title,
        thumbnail: Array.isArray(e['media:group']['media:thumbnail'])
          ? e['media:group']['media:thumbnail'][0].url
          : e['media:group']['media:thumbnail'].url,
        published: e.published,
      }));

      setVideos(mapped);
    } catch (err) {
      console.error('Error al cargar videos', err);
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
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={v => v.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchVideos} />
      }
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('YouTubeVideo', { videoId: item.id })}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.date}>
              {new Date(item.published).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12 },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  thumb: { width: 130, height: 90 },
  info: { flex: 1, padding: 8, justifyContent: 'center' },
  title: { fontWeight: 'bold', fontSize: 15 },
  date: { marginTop: 4, color: '#666', fontSize: 12 },
});
