import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "../../theme";

import type { StackScreenProps } from "@react-navigation/stack";

import type { RootStackParamList } from "../../types/RootStackParamList";

type Props = StackScreenProps<RootStackParamList, "BenefitDetail">;

const BenefitDetailScreen: React.FC<Props> = ({ route }) => {
  const { url } = route.params;
  const t = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <WebView source={{ uri: url }} style={{ backgroundColor: t.colors.background }} />
    </View>
  );
};

export default BenefitDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
