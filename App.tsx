import React from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components/native";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import theme from "./src/global/styles/theme";

import { AppProvider } from "./src/contexts";
import { Routes } from "./src/routes";

const App = gestureHandlerRootHOC(() => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="light" />
      <AppProvider>
        <Routes />
      </AppProvider>
    </ThemeProvider>
  );
});

export default App;
