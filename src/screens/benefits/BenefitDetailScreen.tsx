import React from "react";

import { View, StyleSheet } from "react-native";

import { WebView } from "react-native-webview";

import type { StackScreenProps } from "@react-navigation/stack";

import type { RootStackParamList } from "../../types/RootStackParamList";

type Props = StackScreenProps<RootStackParamList, "BenefitDetail">;

const BenefitDetailScreen: React.FC<Props> = ({ route }) => {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

export default BenefitDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
