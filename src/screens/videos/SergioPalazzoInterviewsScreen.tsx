import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../../theme/spacing';

// Channel ID correcto para @sergioomarpalazzo503
const CHANNEL_ID_SERGIO_PALAZZO = 'UCgb1ohZVSqOHGqe1kHi571g';
const API_KEY = process.env.EXPO_PUBLIC_YT_API_KEY;
const INITIAL_LOAD_COUNT = 20; // Cargar solo 20 videos inicialmente
const LOAD_MORE_COUNT = 20; // Cargar 20 más cada vez

interface VideoItem {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description?: string;
  channelId: string;
}

interface YouTubeApiItem {
  snippet: {
    title: string;
    description?: string;
    thumbnails?: {
      medium?: { url: string };
      default?: { url: string };
    };
    publishedAt: string;
    channelId: string;
    resourceId?: { videoId?: string };
  };
}

interface YouTubeApiResponse {
  items?: YouTubeApiItem[];
  nextPageToken?: string;
  error?: {
    message: string;
  };
}

const toVideoItem = (item: YouTubeApiItem, expectedChannelId: string): VideoItem | null => {
  if (item.snippet.channelId !== expectedChannelId) {
    console.log(`Descartando video de otro canal: ${item.snippet.channelId}`);
    return null;
  }

  const videoId = item.snippet.resourceId?.videoId;
  if (!videoId) {
    return null;
  }

  return {
    videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails?.medium?.url ||
      item.snippet.thumbnails?.default?.url ||
      '',
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
    channelId: item.snippet.channelId,
  };
};

// Ya no necesitamos ordenar porque la API devuelve los videos ordenados por fecha
// const sortByPublishedDateDesc = (videos: VideoItem[]): VideoItem[] => { ... }

export default function SergioPalazzoInterviewsScreen() {
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [historyVideos, setHistoryVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadsPlaylistId, setUploadsPlaylistId] = useState<string>('');
  const [nextPageToken, setNextPageToken] = useState<string>('');
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);

  // Función para obtener el ID de la playlist una sola vez
  const getUploadsPlaylistId = async (): Promise<string> => {
    if (uploadsPlaylistId) return uploadsPlaylistId; // Usar cache si ya lo tenemos

    if (!API_KEY) {
      throw new Error(
        'YouTube API key not found. Please check your environment variables.',
      );
    }

    const channelUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID_SERGIO_PALAZZO}&key=${API_KEY}`;
    
    console.log('Obteniendo información del canal...');
    const channelResponse = await fetch(channelUrl);

    if (!channelResponse.ok) {
      throw new Error(`Error HTTP: ${channelResponse.status}`);
    }

    const channelData = await channelResponse.json();

    if (channelData.error) {
      throw new Error(channelData.error.message);
    }

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Canal no encontrado. Verifica el CHANNEL_ID.');
    }

    const playlistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!playlistId) {
      throw new Error('No se pudo obtener la lista de videos del canal.');
    }

    setUploadsPlaylistId(playlistId); // Guardar en cache
    return playlistId;
  };

  // Cargar videos iniciales
  const loadInitialContent = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const playlistId = await getUploadsPlaylistId();
      console.log(`Playlist ID de uploads: ${playlistId}`);

      // Cargar solo la primera página de videos
      const playlistUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${INITIAL_LOAD_COUNT}&key=${API_KEY}`;
      
      console.log(`Cargando primeros ${INITIAL_LOAD_COUNT} videos...`);
      const response = await fetch(playlistUrl);

      if (!response.ok) {
        throw new Error(`Error obteniendo videos: ${response.status}`);
      }

      const data: YouTubeApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      // Convertir y validar videos
      const videos = data.items
        ?.map((item) => toVideoItem(item, CHANNEL_ID_SERGIO_PALAZZO))
        .filter((item): item is VideoItem => item !== null) ?? [];

      console.log(`${videos.length} videos cargados inicialmente`);

      if (videos.length === 0) {
        setCurrentVideo(null);
        setHistoryVideos([]);
        setError('No se encontraron videos en el canal.');
        return;
      }

      // El primer video es el más reciente (la API los devuelve ordenados)
      const [latest, ...rest] = videos;
      setCurrentVideo(latest);
      setHistoryVideos(rest);
      
      // Guardar token para cargar más videos después
      setNextPageToken(data.nextPageToken || '');
      setHasMoreVideos(!!data.nextPageToken);
      
      console.log(`Video más reciente: ${latest.title}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar entrevistas';
      setError(message);
      console.error('Error completo:', err);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar más videos cuando el usuario hace scroll
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMoreVideos || !nextPageToken) return;

    try {
      setLoadingMore(true);
      
      const playlistId = await getUploadsPlaylistId();
      const playlistUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${LOAD_MORE_COUNT}&pageToken=${nextPageToken}&key=${API_KEY}`;
      
      console.log(`Cargando ${LOAD_MORE_COUNT} videos más...`);
      const response = await fetch(playlistUrl);

      if (!response.ok) {
        console.error(`Error cargando más videos: ${response.status}`);
        return;
      }

      const data: YouTubeApiResponse = await response.json();

      if (data.error) {
        console.error(`Error en API: ${data.error.message}`);
        return;
      }

      const newVideos = data.items
        ?.map((item) => toVideoItem(item, CHANNEL_ID_SERGIO_PALAZZO))
        .filter((item): item is VideoItem => item !== null) ?? [];

      console.log(`${newVideos.length} videos adicionales cargados`);
      
      // Agregar nuevos videos al historial
      setHistoryVideos(prev => [...prev, ...newVideos]);
      
      // Actualizar token para siguiente página
      setNextPageToken(data.nextPageToken || '');
      setHasMoreVideos(!!data.nextPageToken);
      
    } catch (err) {
      console.error('Error cargando más videos:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageToken, loadingMore, hasMoreVideos, uploadsPlaylistId]);

  // Refrescar contenido (pull to refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setNextPageToken('');
    setHasMoreVideos(true);
    await loadInitialContent();
    setRefreshing(false);
  }, []);

  const handleVideoSelection = (video: VideoItem): void => {
    setHistoryVideos((prevHistory) => {
      const filtered = prevHistory.filter(
        (item) => item.videoId !== video.videoId,
      );
      return currentVideo ? [currentVideo, ...filtered] : filtered;
    });
    setCurrentVideo(video);
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#1976d2" />
        <Text style={styles.footerText}>Cargando más videos...</Text>
      </View>
    );
  };

  const wrapWithSafeArea = (content: React.ReactNode) => (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
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
        {content}
      </MaskedView>
    </SafeAreaView>
  );

  useEffect(() => {
    void loadInitialContent();
  }, []);

  if (loading) {
    return wrapWithSafeArea(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Cargando entrevistas de Sergio Palazzo...</Text>
      </View>
    );
  }

  if (error && !currentVideo) {
    return wrapWithSafeArea(
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar el contenido</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInitialContent}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  const playerHeight = Math.round((screenWidth * 9) / 16) + 50;

  return wrapWithSafeArea(
    <View style={styles.container}>
      <View style={[styles.playerContainer, { height: playerHeight }]}>
        {currentVideo ? (
          <>
            <YoutubeIframe
              height={playerHeight - 50}
              width={screenWidth}
              videoId={currentVideo.videoId}
              play={false}
            />
            <View style={styles.videoTitleContainer}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {currentVideo.title}
              </Text>
              <Text style={styles.videoDate}>
                {formatDate(currentVideo.publishedAt)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.noVideoContainer}>
            <Text style={styles.noVideoText}>No hay entrevista disponible</Text>
          </View>
        )}
      </View>

      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <View>
            <Text style={styles.historyTitle}>Entrevistas anteriores</Text>
            {historyVideos.length > 0 && (
              <Text style={styles.videoCount}>
                {historyVideos.length} videos cargados
                {hasMoreVideos && ' (desliza para ver más)'}
              </Text>
            )}
          </View>
        </View>
        {historyVideos.length > 0 ? (
          <FlatList
            data={historyVideos}
            keyExtractor={(item) => item.videoId}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#1976d2']}
                tintColor="#1976d2"
              />
            }
            onEndReached={loadMoreVideos}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoItem}
                onPress={() => handleVideoSelection(item)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.videoInfo}>
                  <Text numberOfLines={3} style={styles.videoItemTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.publishDate}>
                    {formatDate(item.publishedAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noHistoryContainer}>
            <Text style={styles.noHistoryText}>
              No hay entrevistas anteriores disponibles
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  maskContainer: {
    flex: 1,
  },
  maskWrapper: {
    flex: 1,
  },
  maskGradient: {
    width: '100%',
    height: spacing.xl * 2,
  },
  maskFill: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '80%',
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerContainer: {
    backgroundColor: '#000',
  },
  videoTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoDate: {
    color: '#ccc',
    fontSize: 12,
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoText: {
    color: '#fff',
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  videoCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  videoItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 1,
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
  videoItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18,
    marginBottom: 6,
  },
  publishDate: {
    fontSize: 12,
    color: '#666',
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noHistoryText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
});