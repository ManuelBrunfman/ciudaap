// src/navigation/TabNavigator.tsx

import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import BenefitsListScreen from "../screens/benefits/BenefitsListScreen";
import CredentialScreen from "../screens/credential/DigitalCredentialScreen";
import NewsListScreen from "../screens/news/NewsListScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ContactScreen from "../screens/contact/ContactScreen";
import AfiliateScreen from "../screens/AfiliateScreen";
import AdminScreen from "../screens/AdminScreen";
import YouTubeChannelScreen from "../screens/videos/YouTubeChannelScreen";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { isAdmin } = useAuth();
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
          if (route.name === "Contact") iconName = "logo-whatsapp";
          if (route.name === "Afiliate") iconName = "person-add-outline";
          if (route.name === "YouTubeChannel") iconName = "logo-youtube";
          if (route.name === "Admin") iconName = "settings-outline";

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
        name="YouTubeChannel"
        component={YouTubeChannelScreen}
        options={{ title: "Videos" }}
      />

      <Tab.Screen
        name="Afiliate"
        component={AfiliateScreen}
        options={{ title: "Afíliate" }}
      />

      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: "Contacto" }}
      />

      {isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: "Admin" }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;