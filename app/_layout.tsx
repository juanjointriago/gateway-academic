import "react-native-reanimated";
import 'react-native-gesture-handler';
import "expo-dev-client";
import * as Font from "expo-font";
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, StatusBarStyle } from "react-native";
import { AppProvider } from "@/src/context/AppProvider";
import FlashMessage from "react-native-flash-message";
import { es, registerTranslation } from 'react-native-paper-dates'
import { LottiesGeneral } from "@/src/components";
import { DarkTheme, LightTheme } from "@/theme/Theme";
import { useUIStore } from "@/src/store/ui/ui.store";

registerTranslation('es', es);

export default function RootLayout() {
  const themeMode = useUIStore((state) => state.themeMode);
  const [appIsReady, setAppIsReady] = useState(false);

  const theme = themeMode === "dark" ? DarkTheme : LightTheme;
  const barStyle: StatusBarStyle = themeMode === "dark" ? "light-content" : "dark-content";

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
    return <LottiesGeneral animation="loading" description="Espere un momento..." height={200} width={200} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={barStyle} backgroundColor={theme.colors?.background} />
      <PaperProvider theme={theme}>
        <AppProvider>
          <FlashMessage animated position="top" />
          <Stack screenOptions={{ headerShown: false }} />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
