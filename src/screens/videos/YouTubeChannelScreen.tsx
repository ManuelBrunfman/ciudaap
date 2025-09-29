import React, { useEffect, useState } from "react";
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
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { spacing } from "../../theme/spacing";

const CHANNEL_ID_BANCARIA = "UC7H5j0h7NgTqCV4qnLHsqfg"; // La Bancaria Prensa y Difusión
const CHANNEL_ID_RADIOGRAFICA = "UCHJ-iCyE3kG7xcFkwbBT19A"; // Radio Gráfica
const API_KEY = process.env.EXPO_PUBLIC_YT_API_KEY;
const PROGRAM_NAME = "Intereses Colectivos";

interface VideoItem {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubeApiResponse {
  items?: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      thumbnails?: {
        medium?: { url: string };
        default?: { url: string };
      };
      publishedAt: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export default function YouTubeChannelScreen() {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("");
  const [historyVideos, setHistoryVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if current time is Tuesday at 15:00 in Argentina (GMT-3)
  const isTuesdayLiveTime = (): boolean => {
    const now = new Date();
    const argentinaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000)); // GMT-3
    const dayOfWeek = argentinaTime.getDay(); // 0 = Sunday, 2 = Tuesday
    const hour = argentinaTime.getHours();

    return dayOfWeek === 2 && hour === 15; // Tuesday at 15:00
  };

  // Fetch live stream from Radio Gráfica
  const fetchLiveStream = async (): Promise<string | null> => {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID_RADIOGRAFICA}&eventType=live&type=video&key=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: YouTubeApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.items && data.items.length > 0) {
        return data.items[0].id.videoId;
      }

      return null;
    } catch (err) {
      console.error("Error fetching live stream:", err);
      return null;
    }
  };

  // Fetch "Intereses Colectivos" videos from La Bancaria channel
  const fetchInteresesColectivosVideos = async (): Promise<void> => {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID_BANCARIA}&order=date&type=video&maxResults=20&q=${encodeURIComponent(PROGRAM_NAME)}&key=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: YouTubeApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.items) {
        // Filter videos that contain "Intereses Colectivos" in the title
        const interesesVideos = data.items
          .filter(item =>
            item.snippet.title.toLowerCase().includes(PROGRAM_NAME.toLowerCase())
          )
          .map((item): VideoItem => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url ||
                      item.snippet.thumbnails?.default?.url || "",
            publishedAt: item.snippet.publishedAt,
          }));

        if (interesesVideos.length > 0) {
          // Set the latest video as the current one
          const latest = interesesVideos[0];
          setCurrentVideoId(latest.videoId);
          setCurrentVideoTitle(latest.title);

          // Set the rest as history (excluding the latest one)
          setHistoryVideos(interesesVideos.slice(1));
        }
      }
    } catch (err) {
      console.error("Error fetching Intereses Colectivos videos:", err);
      throw err;
    }
  };

  // Load content based on time and availability
  const loadContent = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!API_KEY) {
        throw new Error("YouTube API key not found. Please check your environment variables.");
      }

      // Check if it's Tuesday at 15:00 for live stream
      if (isTuesdayLiveTime()) {
        const liveVideoId = await fetchLiveStream();
        if (liveVideoId) {
          setCurrentVideoId(liveVideoId);
          setCurrentVideoTitle("Transmisión en vivo - Radio Gráfica");
          // Still fetch history videos for the bottom list
          await fetchInteresesColectivosVideos();
          return;
        }
      }

      // If no live stream or not Tuesday 15:00, fetch latest Intereses Colectivos
      await fetchInteresesColectivosVideos();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar contenido";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle video selection from history list
  const handleVideoSelection = (video: VideoItem): void => {
    setCurrentVideoId(video.videoId);
    setCurrentVideoTitle(video.title);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  const wrapWithSafeArea = (content: React.ReactNode) => (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: "transparent" }]}>
      <MaskedView
        style={styles.maskContainer}
        maskElement={
          <View style={styles.maskWrapper}>
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
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
    loadContent();
  }, []);

  if (loading) {
    return wrapWithSafeArea(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  if (error && !currentVideoId) {
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

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  // Calculate player height based on 16:9 aspect ratio + space for title
  const playerHeight = Math.round((screenWidth * 9) / 16) + 50;

  return wrapWithSafeArea(
    <View style={styles.container}>
      {/* YouTube Player - Aspect Ratio Based */}
      <View style={[styles.playerContainer, { height: playerHeight }]}>
        {currentVideoId ? (
          <>
            <YoutubeIframe
              height={playerHeight - 50}
              width={screenWidth}
              videoId={currentVideoId}
              play={false}
            />
            <View style={styles.videoTitleContainer}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {currentVideoTitle}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.noVideoContainer}>
            <Text style={styles.noVideoText}>No hay video disponible</Text>
          </View>
        )}
      </View>

      {/* Bottom Half - Video History List */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Programas anteriores</Text>
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
              No hay programas anteriores disponibles
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
    width: "100%",
    height: spacing.xl * 2,
  },
  maskFill: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  playerContainer: {
    backgroundColor: "#000",
  },
  videoTitleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVideoText: {
    color: "#fff",
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  videoItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 1,
    alignItems: "flex-start",
  },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "flex-start",
  },
  videoItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    lineHeight: 18,
    marginBottom: 6,
  },
  publishDate: {
    fontSize: 12,
    color: "#666",
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noHistoryText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
