// src/screens/profile/ProfileScreen.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import AppButton from "../../ui/AppButton";
import { useTheme } from "../../theme";
import { spacing } from "../../theme/spacing";

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, "Profile">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const t = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <AppButton title="Cerrar sesión" onPress={() => navigation.navigate("ForceLogout")} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.md },
});

