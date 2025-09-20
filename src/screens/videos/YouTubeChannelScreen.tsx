// src/screens/videos/YouTubeChannelScreen.tsx

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

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

  const onPressItem = useCallback(
    (id: string) => navigation.navigate('YouTubeVideo', { videoId: id }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: VideoItem }) => (
      <VideoListItem item={item} styles={styles} onPressItem={onPressItem} titleColor={t.colors.onBackground} dateColor={t.colors.onSurfaceMuted} />
    ),
    [onPressItem, styles, t.colors.onBackground, t.colors.onSurfaceMuted],
  );

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
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={videos}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={fetchVideos}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
      />
    </MaskedView>
  );
}

// Item de lista memoizado para evitar re-renderizados innecesarios
const VideoListItem = memo(function VideoListItem({
  item,
  styles,
  onPressItem,
  titleColor,
  dateColor,
}: {
  item: VideoItem;
  styles: ReturnType<typeof createStyles>;
  onPressItem: (id: string) => void;
  titleColor: string;
  dateColor: string;
}) {
  const handlePress = useCallback(() => onPressItem(item.id), [onPressItem, item.id]);
  return (
    <TouchableOpacity style={styles.cardTouchable} onPress={handlePress}>
      <Card style={styles.card}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumb} resizeMode="cover" />
        <View style={styles.info}>
          <AppText variant="subtitle" color={titleColor}>
            {item.title}
          </AppText>
          <AppText variant="caption" color={dateColor} style={styles.date}>
            {new Date(item.published).toLocaleDateString()}
          </AppText>
        </View>
      </Card>
    </TouchableOpacity>
  );
});

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
    maskContainer: { flex: 1 },
    maskWrapper: { flex: 1 },
    maskGradient: {
      width: '100%',
      height: t.spacing.xl * 2,
    },
    maskFill: { flex: 1, backgroundColor: '#000' },
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
