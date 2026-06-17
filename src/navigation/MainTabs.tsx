import React from "react";
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import PlannerScreen from "../screens/journey/PlannerScreen";
import StopPickerScreen from "../screens/journey/StopPickerScreen";
import JourneyResultsScreen from "../screens/journey/JourneyResultsScreen";
import VehiclesScreen from "../screens/vehicles/VehiclesScreen";
import VehicleDetailScreen from "../screens/vehicles/VehicleDetailScreen";
import StopsScreen from "../screens/stops/StopsScreen";
import StopDetailScreen from "../screens/stops/StopDetailScreen";
import LineDetailScreen from "../screens/stops/LineDetailScreen";
import ProfileScreen from "../screens/account/ProfileScreen";
import { AccountStackParamList } from "../utils/types/StackParamList/accountStackParamList";
import { JourneyStackParamList } from "../utils/types/StackParamList/journeyStackParamList";
import { MainTabParamList } from "../utils/types/StackParamList/mainTabParamList";
import { StopsStackParamList } from "../utils/types/StackParamList/stopsStackParamList";
import { VehiclesStackParamList } from "../utils/types/StackParamList/vahiclesStackParamList";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const Tab = createBottomTabNavigator<MainTabParamList>();
const JourneyStack = createNativeStackNavigator<JourneyStackParamList>();
const VehiclesStack = createNativeStackNavigator<VehiclesStackParamList>();
const StopsStack = createNativeStackNavigator<StopsStackParamList>();
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

function useStackScreenOptions(): NativeStackNavigationOptions {
  const { isDark } = useTheme();
  return {
    headerStyle: { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
    headerTitleStyle: {
      color: isDark ? "#F5F5F7" : "#0A0A0A",
      fontFamily: "Outfit_600SemiBold",
    },
    headerTintColor: "#6912E2",
    headerShadowVisible: false,
    contentStyle: { backgroundColor: isDark ? "#0A0A0A" : "#F5F5F7" },
  };
}

function JourneyNavigator() {
  const opts = useStackScreenOptions();
  return (
    <JourneyStack.Navigator screenOptions={opts}>
      <JourneyStack.Screen
        name="Planner"
        component={PlannerScreen}
        options={{ title: "Planifier un trajet" }}
      />
      <JourneyStack.Screen
        name="StopPicker"
        component={StopPickerScreen}
        options={{ title: "Choisir un arrêt", presentation: "modal" }}
      />
      <JourneyStack.Screen
        name="JourneyResults"
        component={JourneyResultsScreen}
        options={{ title: "Itinéraires" }}
      />
    </JourneyStack.Navigator>
  );
}

function VehiclesNavigator() {
  const opts = useStackScreenOptions();
  return (
    <VehiclesStack.Navigator screenOptions={opts}>
      <VehiclesStack.Screen
        name="Vehicles"
        component={VehiclesScreen}
        options={{ title: "Suivi temps réel" }}
      />
      <VehiclesStack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
        options={{ title: "Véhicule" }}
      />
    </VehiclesStack.Navigator>
  );
}

function StopsNavigator() {
  const opts = useStackScreenOptions();
  return (
    <StopsStack.Navigator screenOptions={opts}>
      <StopsStack.Screen
        name="Stops"
        component={StopsScreen}
        options={{ title: "Arrêts & lignes" }}
      />
      <StopsStack.Screen
        name="StopDetail"
        component={StopDetailScreen}
        options={{ title: "Arrêt" }}
      />
      <StopsStack.Screen
        name="LineDetail"
        component={LineDetailScreen}
        options={{ title: "Ligne" }}
      />
    </StopsStack.Navigator>
  );
}

function AccountNavigator() {
  const opts = useStackScreenOptions();
  return (
    <AccountStack.Navigator screenOptions={opts}>
      <AccountStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Mon compte" }}
      />
    </AccountStack.Navigator>
  );
}

const TAB_ICONS: Record<keyof MainTabParamList, IconName> = {
  JourneyTab: "map-search-outline",
  VehiclesTab: "radar",
  StopsTab: "bus-stop-covered",
  AccountTab: "account-circle-outline",
};

export default function MainTabs() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        headerShown: false,
        tabBarActiveTintColor: "#6912E2",
        tabBarInactiveTintColor: isDark ? "#8E8E93" : "#AEAEB2",
        tabBarLabelStyle: { fontFamily: "Outfit_500Medium", fontSize: 11 },
        tabBarStyle: {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderTopColor: isDark ? "#2C2C2E" : "#E5E5EA",
        },
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name={TAB_ICONS[route.name as keyof MainTabParamList]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="JourneyTab" component={JourneyNavigator} options={{ title: "Trajets" }} />
      <Tab.Screen name="VehiclesTab" component={VehiclesNavigator} options={{ title: "Temps réel" }} />
      <Tab.Screen name="StopsTab" component={StopsNavigator} options={{ title: "Arrêts" }} />
      <Tab.Screen name="AccountTab" component={AccountNavigator} options={{ title: "Compte" }} />
    </Tab.Navigator>
  );
}
