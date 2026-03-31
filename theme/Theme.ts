import { configureFonts, MD3DarkTheme, MD3LightTheme } from "react-native-paper"
import { MD3Typescale, ThemeProp } from "react-native-paper/lib/typescript/types";

const fontConfig: MD3Typescale = {
    ...MD3LightTheme.fonts,
    bodyLarge: {
        ...MD3LightTheme.fonts.titleLarge,
        fontFamily: "Montserrat_400Regular",
        fontWeight: "400",
    },
    bodyMedium: {
        ...MD3LightTheme.fonts.titleMedium,
        fontFamily: "Montserrat_400Regular",
        fontWeight: "400",
    },
    bodySmall: {
        ...MD3LightTheme.fonts.titleSmall,
        fontFamily: "Montserrat_400Regular",
        fontWeight: "400",
    },
    default: {
        ...MD3LightTheme.fonts.default,
        fontFamily: "Montserrat_400Regular",
        fontWeight: "400",
    },
    displayLarge: {
        ...MD3LightTheme.fonts.displayLarge,
        fontFamily: "Montserrat_700Bold",
        fontWeight: "700",
    },
    displayMedium: {
        ...MD3LightTheme.fonts.displayMedium,
        fontFamily: "Montserrat_700Bold",
        fontWeight: "700",
    },
    displaySmall: {
        ...MD3LightTheme.fonts.displaySmall,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "500",
    },
    headlineLarge: {
        ...MD3LightTheme.fonts.headlineLarge,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "500",
    },
    headlineMedium: {
        ...MD3LightTheme.fonts.headlineMedium,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "500",
    },
    headlineSmall: {
        ...MD3LightTheme.fonts.headlineSmall,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "500",
    },
    labelLarge: {
        ...MD3LightTheme.fonts.labelLarge,
        fontFamily: "Montserrat_700Bold",
        fontWeight: "700",
    },
    labelMedium: {
        ...MD3LightTheme.fonts.labelMedium,
        fontFamily: "Montserrat_700Bold",
        fontWeight: "700",
    },
    labelSmall: {
        ...MD3LightTheme.fonts.labelSmall,
        fontFamily: "Montserrat_700Bold",
        fontWeight: "700",
    },
    titleLarge: {
        ...MD3LightTheme.fonts.titleLarge,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "500",
    },
    titleMedium: {
        ...MD3LightTheme.fonts.titleMedium,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "500",
    },
    titleSmall: {
        ...MD3LightTheme.fonts.titleSmall,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "500",
    },
};


const lightThemeColor = {
    ...MD3LightTheme.colors,
    primary: "rgb(28, 46, 130)",          // Gateway navy blue
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(210, 218, 255)",
    onPrimaryContainer: "rgb(0, 15, 75)",
    secondary: "rgb(20, 38, 110)",         // Darker navy accent
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(205, 215, 255)",
    onSecondaryContainer: "rgb(0, 20, 65)",
    tertiary: "rgb(40, 90, 180)",          // Brighter blue for highlights
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(215, 228, 255)",
    onTertiaryContainer: "rgb(0, 30, 80)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(250, 251, 255)",
    onBackground: "rgb(20, 22, 35)",
    surface: "rgb(250, 251, 255)",
    onSurface: "rgb(20, 22, 35)",
    surfaceVariant: "rgb(220, 223, 240)",
    onSurfaceVariant: "rgb(55, 58, 80)",
    outline: "rgb(110, 115, 140)",
    outlineVariant: "rgb(190, 194, 215)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(40, 42, 58)",
    inverseOnSurface: "rgb(238, 239, 248)",
    inversePrimary: "rgb(180, 196, 255)",
    elevation: {
        level0: "transparent",
        level1: "rgb(242, 244, 252)",
        level2: "rgb(235, 238, 250)",
        level3: "rgb(228, 233, 248)",
        level4: "rgb(226, 231, 247)",
        level5: "rgb(221, 227, 245)"
    },
    surfaceDisabled: "rgba(20, 22, 35, 0.12)",
    onSurfaceDisabled: "rgba(20, 22, 35, 0.38)",
    backdrop: "rgba(30, 36, 70, 0.4)"
}

const darkThemeColor = {
    ...MD3DarkTheme.colors,
    primary: "rgb(180, 196, 255)",        // Light navy for dark mode
    onPrimary: "rgb(0, 25, 100)",
    primaryContainer: "rgb(20, 38, 110)",  // Gateway navy
    onPrimaryContainer: "rgb(210, 218, 255)",
    secondary: "rgb(160, 195, 255)",
    onSecondary: "rgb(0, 32, 80)",
    secondaryContainer: "rgb(10, 30, 95)",
    onSecondaryContainer: "rgb(205, 215, 255)",
    tertiary: "rgb(170, 200, 255)",
    onTertiary: "rgb(0, 38, 95)",
    tertiaryContainer: "rgb(20, 65, 145)",
    onTertiaryContainer: "rgb(215, 228, 255)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(12, 14, 25)",         // Very dark navy background
    onBackground: "rgb(225, 227, 238)",
    surface: "rgb(12, 14, 25)",
    onSurface: "rgb(225, 227, 238)",
    surfaceVariant: "rgb(45, 50, 78)",
    onSurfaceVariant: "rgb(192, 196, 220)",
    outline: "rgb(138, 142, 170)",
    outlineVariant: "rgb(45, 50, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(225, 227, 238)",
    inverseOnSurface: "rgb(30, 32, 50)",
    inversePrimary: "rgb(28, 46, 130)",
    elevation: {
        level0: "transparent",
        level1: "rgb(20, 24, 45)",
        level2: "rgb(25, 30, 55)",
        level3: "rgb(28, 35, 65)",
        level4: "rgb(30, 38, 68)",
        level5: "rgb(33, 42, 72)"
    },
    surfaceDisabled: "rgba(225, 227, 238, 0.12)",
    onSurfaceDisabled: "rgba(225, 227, 238, 0.38)",
    backdrop: "rgba(10, 15, 50, 0.5)"
}

export const LightTheme: ThemeProp = {
    colors: lightThemeColor,
    fonts: configureFonts({ config: fontConfig }),
}

export const DarkTheme: ThemeProp = {
    colors: darkThemeColor,
    fonts: configureFonts({ config: fontConfig }),
}

const theme = {
    ...LightTheme,
    version: 3,
} as const;

export default theme;
