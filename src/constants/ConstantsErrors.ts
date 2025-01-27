import { statusCodes } from "@react-native-google-signin/google-signin";

export const firebaseErrorMessages: { [key: string]: string } = {
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/user-not-found': 'No se encontró ningún usuario con este correo.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/email-already-in-use': 'El correo ya está en uso.',
    'auth/too-many-requests': 'Has intentado iniciar sesión demasiadas veces. Por favor, intenta de nuevo en unos minutos.',
    'auth/no-current-user': 'No se pudo encontrar el usuario actual.',

    [statusCodes.SIGN_IN_CANCELLED]: 'Inicio de sesión cancelado',
    [statusCodes.IN_PROGRESS]: 'El inicio de sesión ya está en progreso',
    [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: 'Google Play Services no está disponible o está desactualizado',

    'firestore/permission-denied': 'No tienes permiso para realizar esta acción.',
    'firestore/invalid-argument': 'Argumento inválido.',
    'firestore/failed-precondition': 'Precondición fallida.',
    'firestore/out-of-range': 'Fuera de rango.',
};

export const typeUser : { [key: string]: string } = {
    'admin': 'Administrador',
    'user': 'Usuario',
    'teacher': 'Profesor',
    'student': 'Estudiante'
}