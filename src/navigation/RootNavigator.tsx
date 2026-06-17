import React from "react";
import { View, ActivityIndicator } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  type Theme,
} from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";


export default function RootNavigator() {
  const { isAuthenticated, bootstrapping } = useAuth();
  const { isDark } = useTheme();

  const navTheme: Theme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: "#0A0A0A",
          card: "#1C1C1E",
          primary: "#6912E2",
          border: "#2C2C2E",
          text: "#F5F5F7",
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "#F5F5F7",
          card: "#FFFFFF",
          primary: "#6912E2",
          border: "#E5E5EA",
          text: "#0A0A0A",
        },
      };

  if (bootstrapping) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#0A0A0A" : "#F5F5F7",
        }}
      >
        <ActivityIndicator size="large" color="#6912E2" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
