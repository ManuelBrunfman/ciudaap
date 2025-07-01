import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YOUTUBE_API_KEY } from '@env';
import type { RootStackParamList } from '../../types/RootStackParamList';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
}

const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';
const MAX_RESULTS = 20;

const YouTubeChannelScreen: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'YouTubeVideo'>>();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;
        const response = await fetch(url);
        const data = await response.json();
        const items = (data.items || []).map((item: any) => ({
          id: item.id.videoId as string,
          title: item.snippet.title as string,
          thumbnail: item.snippet.thumbnails.medium.url as string,
        }));
        setVideos(items);
      } catch (error) {
        console.warn('Error fetching YouTube videos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const openVideo = (id: string) =>
    navigation.navigate('YouTubeVideo', { videoId: id });

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => openVideo(item.id)}>
            {item.thumbnail && (
              <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            )}
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default YouTubeChannelScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  thumb: { width: 120, height: 90, marginRight: 8 },
  title: { flex: 1, fontSize: 14 },
});
