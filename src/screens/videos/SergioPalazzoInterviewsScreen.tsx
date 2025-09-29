import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../../theme/spacing';

// Channel ID correcto para @sergioomarpalazzo503
const CHANNEL_ID_SERGIO_PALAZZO = 'UCgb1ohZVSqOHGqe1kHi571g';
const API_KEY = process.env.EXPO_PUBLIC_YT_API_KEY;
const MAX_RESULTS = 50;

interface VideoItem {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description?: string;
  channelId: string; // Agregado para validación
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
    channelId: string; // Importante para validar
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
  // Validar que el video pertenece al canal correcto
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

const sortByPublishedDateDesc = (videos: VideoItem[]): VideoItem[] =>
  [...videos].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();

    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateB - dateA;
  });

export default function SergioPalazzoInterviewsScreen() {
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [historyVideos, setHistoryVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVideosFound, setTotalVideosFound] = useState<number>(0);

  const loadContent = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!API_KEY) {
        throw new Error(
          'YouTube API key not found. Please check your environment variables.',
        );
      }

      // Primero, obtener el uploads playlist ID del canal
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

      const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        throw new Error('No se pudo obtener la lista de videos del canal.');
      }

      console.log(`Playlist ID de uploads: ${uploadsPlaylistId}`);

      // Obtener TODOS los videos de la playlist de uploads
      let allVideos: VideoItem[] = [];
      let nextPageToken = '';
      let pageCount = 0;
      const maxPages = 10; // Limitar a 10 páginas (500 videos máximo)

      while (pageCount < maxPages) {
        const playlistUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${MAX_RESULTS}&pageToken=${nextPageToken}&key=${API_KEY}`;
        
        console.log(`Obteniendo página ${pageCount + 1} de videos...`);
        const response = await fetch(playlistUrl);

        if (!response.ok) {
          console.error(`Error obteniendo página ${pageCount + 1}: ${response.status}`);
          break;
        }

        const data: YouTubeApiResponse = await response.json();

        if (data.error) {
          console.error(`Error en API: ${data.error.message}`);
          break;
        }

        // Convertir y validar que los videos son del canal correcto
        const pageVideos = data.items
          ?.map((item) => toVideoItem(item, CHANNEL_ID_SERGIO_PALAZZO))
          .filter((item): item is VideoItem => item !== null) ?? [];

        console.log(`Página ${pageCount + 1}: ${pageVideos.length} videos válidos encontrados`);
        
        allVideos = [...allVideos, ...pageVideos];
        
        nextPageToken = data.nextPageToken || '';
        pageCount++;
        
        // Si no hay más páginas, salir del loop
        if (!nextPageToken) {
          console.log('No hay más páginas de videos');
          break;
        }
      }

      console.log(`Total de videos encontrados: ${allVideos.length}`);
      setTotalVideosFound(allVideos.length);

      // Ordenar videos por fecha (más reciente primero)
      const sortedVideos = sortByPublishedDateDesc(allVideos);

      if (sortedVideos.length === 0) {
        setCurrentVideo(null);
        setHistoryVideos([]);
        setError('No se encontraron videos en el canal.');
        return;
      }

      // Establecer el video más reciente como actual y el resto como historial
      const [latest, ...rest] = sortedVideos;
      setCurrentVideo(latest);
      setHistoryVideos(rest);
      
      console.log(`Video más reciente: ${latest.title} (${latest.publishedAt})`);
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

  const handleVideoSelection = (video: VideoItem): void => {
    // Mover el video actual al historial y establecer el nuevo video como actual
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
    void loadContent();
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
        <TouchableOpacity style={styles.retryButton} onPress={loadContent}>
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
            {totalVideosFound > 0 && (
              <Text style={styles.videoCount}>
                {totalVideosFound} videos encontrados
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadContent}
            disabled={loading}
          >
            <Text style={styles.refreshButtonText}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </Text>
          </TouchableOpacity>
        </View>
        {historyVideos.length > 0 ? (
          <FlatList
            data={historyVideos}
            keyExtractor={(item) => item.videoId}
            showsVerticalScrollIndicator={false}
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
  refreshButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
});