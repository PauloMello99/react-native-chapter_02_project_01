import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components/native";
import { MaterialIcons } from "@expo/vector-icons";

import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import Resume from "../pages/Resume";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          paddingVertical: Platform.select({ ios: 20, android: 0 }),
        },
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons name="format-list-bulleted" {...props} />
          ),
        }}
      />
      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: (props) => (
            <MaterialIcons name="attach-money" {...props} />
          ),
        }}
      />
      <Screen
        name="Resumo"
        component={Resume}
        options={{
          tabBarIcon: (props) => <MaterialIcons name="pie-chart" {...props} />,
        }}
      />
    </Navigator>
  );
}
