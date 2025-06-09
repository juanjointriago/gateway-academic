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
    primary: "rgb(64, 90, 169)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(219, 225, 255)",
    onPrimaryContainer: "rgb(0, 22, 77)",
    secondary: "rgb(30, 95, 166)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(212, 227, 255)",
    onSecondaryContainer: "rgb(0, 28, 58)",
    tertiary: "rgb(51, 92, 168)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(216, 226, 255)",
    onTertiaryContainer: "rgb(0, 26, 67)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(254, 251, 255)",
    onBackground: "rgb(27, 27, 31)",
    surface: "rgb(254, 251, 255)",
    onSurface: "rgb(27, 27, 31)",
    surfaceVariant: "rgb(226, 225, 236)",
    onSurfaceVariant: "rgb(69, 70, 79)",
    outline: "rgb(118, 118, 128)",
    outlineVariant: "rgb(198, 198, 208)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(48, 48, 52)",
    inverseOnSurface: "rgb(242, 240, 244)",
    inversePrimary: "rgb(181, 196, 255)",
    elevation: {
        level0: "transparent",
        level1: "rgb(245, 243, 251)",
        level2: "rgb(239, 238, 248)",
        level3: "rgb(233, 233, 246)",
        level4: "rgb(231, 232, 245)",
        level5: "rgb(227, 229, 243)"
    },
    surfaceDisabled: "rgba(27, 27, 31, 0.12)",
    onSurfaceDisabled: "rgba(27, 27, 31, 0.38)",
    backdrop: "rgba(46, 48, 56, 0.4)"
}

const darkThemeColor = {
    ...MD3DarkTheme.colors,
    primary: "rgb(181, 196, 255)",
    onPrimary: "rgb(4, 41, 120)",
    primaryContainer: "rgb(37, 65, 144)",
    onPrimaryContainer: "rgb(219, 225, 255)",
    secondary: "rgb(165, 200, 255)",
    onSecondary: "rgb(0, 49, 94)",
    secondaryContainer: "rgb(0, 71, 133)",
    onSecondaryContainer: "rgb(212, 227, 255)",
    tertiary: "rgb(174, 198, 255)",
    onTertiary: "rgb(0, 46, 107)",
    tertiaryContainer: "rgb(19, 68, 143)",
    onTertiaryContainer: "rgb(216, 226, 255)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(27, 27, 31)",
    onBackground: "rgb(228, 226, 230)",
    surface: "rgb(27, 27, 31)",
    onSurface: "rgb(228, 226, 230)",
    surfaceVariant: "rgb(69, 70, 79)",
    onSurfaceVariant: "rgb(198, 198, 208)",
    outline: "rgb(143, 144, 154)",
    outlineVariant: "rgb(69, 70, 79)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(228, 226, 230)",
    inverseOnSurface: "rgb(48, 48, 52)",
    inversePrimary: "rgb(64, 90, 169)",
    elevation: {
        level0: "transparent",
        level1: "rgb(35, 35, 42)",
        level2: "rgb(39, 41, 49)",
        level3: "rgb(44, 46, 56)",
        level4: "rgb(46, 47, 58)",
        level5: "rgb(49, 51, 62)"
    },
    surfaceDisabled: "rgba(228, 226, 230, 0.12)",
    onSurfaceDisabled: "rgba(228, 226, 230, 0.38)",
    backdrop: "rgba(47, 48, 56, 0.4)"
}

export const LightTheme: ThemeProp = {
    colors: lightThemeColor,
    fonts: configureFonts({ config: fontConfig }),
}

export const DarkTheme: ThemeProp = {
    colors: darkThemeColor,
    fonts: configureFonts({ config: fontConfig }),
}

const DefaultTheme = {
    ...LightTheme,
    version: 3,
};

export default DefaultTheme;