// src/navigation/TabNavigator.tsx

import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import BenefitsListScreen from "../screens/benefits/BenefitsListScreen";

import CredentialScreen from "../screens/credential/DigitalCredentialScreen";

import NewsListScreen from "../screens/news/NewsListScreen";

import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          // Por defecto, elegimos un icono “ellipse”

          let iconName: string = "ellipse";

          if (route.name === "NewsList") iconName = "newspaper-outline";

          if (route.name === "Benefits") iconName = "gift-outline";

          if (route.name === "Credential") iconName = "card-outline";

          if (route.name === "Profile") iconName = "person-outline";

          // Fix 1: Forzar cast del iconName si TS no lo reconoce:

          return (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={size}
              color={color}
            />
          );
        },

        headerShown: false,
      })}
    >
      <Tab.Screen
        name="NewsList"
        component={NewsListScreen}
        options={{ title: "Noticias" }}
      />

      <Tab.Screen
        name="Benefits"
        component={BenefitsListScreen}
        options={{ title: "Beneficios" }}
      />

      <Tab.Screen
        name="Credential"
        component={CredentialScreen}
        options={{ title: "Credencial" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
