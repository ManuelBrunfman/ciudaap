// src/screens/videos/YouTubeChannelScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import Card from '../../ui/Card';
import { useTheme, type AppTheme } from '../../theme';

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

const PLAYLIST_ID = 'PL3LGmToYRxqu5XmBd9k0zUQNUeq7MaoNn';

const parser = new XMLParser({ ignoreAttributes: false });

async function fetchPlaylistFeed(playlistId: string) {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Network response was not ok: ${resp.status}`);
  return resp;
}

export default function YouTubeChannelScreen() {
  const navigation = useNavigation<Nav>();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const t = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);

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
        'No se pudieron cargar los videos. Verificá que PLAYLIST_ID sea correcto y que la lista sea pública.',
      );
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={t.colors.primary} size="large" />
      </View>
    );
  }

  if (!loading && videos.length === 0) {
    return (
      <View style={styles.emptyState}>
        <AppText variant="body" color={t.colors.onSurfaceMuted}>
          No hay videos disponibles.
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={videos}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchVideos}
          colors={[t.colors.primary]}
          tintColor={t.colors.primary}
        />
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => navigation.navigate('YouTubeVideo', { videoId: item.id })}
        >
          <Card style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} resizeMode="cover" />
            <View style={styles.info}>
              <AppText variant="subtitle" color={t.colors.onBackground}>
                {item.title}
              </AppText>
              <AppText variant="caption" color={t.colors.onSurfaceMuted} style={styles.date}>
                {new Date(item.published).toLocaleDateString()}
              </AppText>
            </View>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: t.spacing.lg,
      backgroundColor: 'transparent',
    },
    list: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    listContent: {
      padding: t.spacing.md,
    },
    cardTouchable: {
      marginBottom: t.spacing.md,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: t.spacing.sm,
    },
    thumb: {
      width: 130,
      height: 90,
      borderRadius: t.radius.m,
      marginRight: t.spacing.md,
    },
    info: {
      flex: 1,
    },
    date: {
      marginTop: t.spacing.xs,
    },
  });
