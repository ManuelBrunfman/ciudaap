// src/screens/ForceLogoutScreen.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useTheme } from "../theme";
import AppText from "../ui/AppText";

export default function ForceLogoutScreen() {
  const navigation = useNavigation();
  const t = useTheme();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await getAuth().signOut();
        navigation.dispatch(StackActions.popToTop());
      } catch (error) {
        console.error("Error al cerrar sesión", error);
      }
    };
    doLogout();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: t.colors.background }]}>
      <ActivityIndicator size="large" color={t.colors.primary} />
      <AppText style={styles.text}>Cerrando sesión...</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { marginTop: 8, fontSize: 16 },
});

