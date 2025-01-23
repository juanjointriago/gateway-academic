import "expo-dev-client";
import "react-native-reanimated";
import 'react-native-gesture-handler';
import * as Font from "expo-font";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Slot } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from 'react';
import { DarkTheme, LigthTheme } from "@/theme/Theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, StatusBarStyle, useColorScheme } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  const theme = colorScheme === "dark" ? DarkTheme : LigthTheme;
  const barStyle: StatusBarStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  useEffect(() => {
    prepare();
  }, []);

  const prepare = async () => {
    try {
      await Font.loadAsync({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_700Bold,
      })
    } catch (error) {
      console.error(error);
    } finally {
      setAppIsReady(true);
    }
  }

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={barStyle} backgroundColor={theme.colors?.background} />
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
