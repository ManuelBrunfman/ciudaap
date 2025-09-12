// src/screens/ForceLogoutScreen.tsx
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";

export default function ForceLogoutScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await getAuth().signOut();
        console.log("✅ Sesión cerrada correctamente");
        // Resetear navegación: ir a la raíz (AuthNavigator → Login)
        navigation.dispatch(StackActions.popToTop());
      } catch (error) {
        console.error("❌ Error al cerrar sesión", error);
      }
    };

    doLogout();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Cerrando sesión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { marginTop: 10, fontSize: 16 },
});
