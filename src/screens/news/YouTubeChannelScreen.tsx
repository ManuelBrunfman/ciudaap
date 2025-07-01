import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Parser from 'rss-parser';
import type { RootStackParamList } from '../../types/RootStackParamList';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
}

const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';

const YouTubeChannelScreen: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'YouTubeVideo'>>();

  useEffect(() => {
    const parser = new Parser();
    const fetchVideos = async () => {
      try {
        const feed = await parser.parseURL(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
        );
        const items =
          feed.items?.map(it => ({
            id: (it.id?.split(':').pop() ?? '').trim(),
            title: it.title ?? '',
            thumbnail:
              (it.enclosure as any)?.url || (it as any).media$thumbnail?.url || ''
          })) ?? [];
        setVideos(items);
      } catch (e) {
        console.warn('Error loading feed', e);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const openVideo = (id: string) => navigation.navigate('YouTubeVideo', { videoId: id });

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
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => openVideo(item.id)}>
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            ) : null}
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
    borderColor: '#ccc'
  },
  thumb: { width: 120, height: 90, marginRight: 8 },
  title: { flex: 1, fontSize: 14 }
});
