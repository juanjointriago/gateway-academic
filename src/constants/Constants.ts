import { Platform } from "react-native";

export const COLOR_PRIMARY = '#06266D';
export const COLOR_SECONDARY = '#C4CCDD';
export const COLOR_TERTIARY = '#7B8CB3';
export const COLOR_QUATERNARY = '#7082AC';

export const NAME_APP = 'Gateway English'
export const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2FlogoInvert.png?alt=media&token=cb7fb5f2-6274-45c5-9087-d3fb94d473df'
export const LOGO_URL2 = 'https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd'
export const URL_PROFILE_DEFAULT = 'https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/profile%2FdefaultProfile.png?alt=media&token=c314af93-f40f-41f3-a406-92f5e4d0e7da'

export const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

// Credenciales de prueba: se inyectan vía EXPO_PUBLIC_ en .env.local (local)
// o en las secciones env de eas.json (builds development/preview).
// En producción no están definidas → el formulario aparece vacío.
export const USERTEACHERTEST = process.env.EXPO_PUBLIC_TEST_EMAIL_TEACHER ?? '';
export const PASSTEACHERTEST = process.env.EXPO_PUBLIC_TEST_PASS_TEACHER ?? '';
export const USERSTUDENTTEST = process.env.EXPO_PUBLIC_TEST_EMAIL_STUDENT ?? '';
export const PASSSTUDENTTEST = process.env.EXPO_PUBLIC_TEST_PASS_STUDENT ?? '';

export const URL_API = 'https://countriesnow.space/api/v0.1/';
export const COUNTRY = 'Ecuador';

export const SIZEFILEIMG = 10485760;
export const SIZEFILEDOC = 10485760;