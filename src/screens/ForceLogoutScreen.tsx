// src/screens/ForceLogoutScreen.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native";
import { getAuth, signOut as firebaseSignOut } from "@react-native-firebase/auth";
import { useTheme } from "../theme";
import AppText from "../ui/AppText";
import { getFirebaseApp } from "@/config/firebaseApp";

export default function ForceLogoutScreen() {
  const navigation = useNavigation();
  const t = useTheme();

  useEffect(() => {
    const doLogout = async () => {
      try {
        const auth = getAuth(getFirebaseApp());
        await firebaseSignOut(auth);
        navigation.dispatch(StackActions.popToTop());
      } catch (error) {
        console.error("Error al cerrar sesiÃ³n", error);
      }
    };
    doLogout();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ActivityIndicator size="large" color={t.colors.primary} />
      <AppText style={styles.text}>Cerrando sesiÃ³n...</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { marginTop: 8, fontSize: 16 },
});

