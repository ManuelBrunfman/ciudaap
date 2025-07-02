import React from 'react';
import { WebView } from 'react-native-webview';

const YouTubeChannelScreen: React.FC = () => {
  return <WebView source={{ uri: 'https://www.youtube.com/' }} />;
};

export default YouTubeChannelScreen;

