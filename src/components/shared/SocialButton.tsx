import { LoginDataGoogle } from '@/src/interfaces';
import { useAuthStore } from '@/src/store/auth/auth.store';
import { useRouter } from 'expo-router';
import { FC, useEffect } from 'react'
import { Alert, Keyboard, View } from 'react-native'

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { ButtonGeneral } from '../buttons';

GoogleSignin.configure({
  webClientId: '495465137356-i3tse79nolj7iaai7l48m22jt2qkhft7.apps.googleusercontent.com', // Reemplaza con tu Web Client ID
});


interface Props {
    onPressBtnGoogle?: (data: LoginDataGoogle) => void;
    // onPressBtnApple?: (data: LoginDataApple) => void;
}

export const SocialButton: FC<Props> = ({ onPressBtnGoogle }) => {
    
    const handleGoogleSignIn = async () => {
        try {
          // Verifica si Google Play Services está disponible
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
          // Inicia el flujo de autenticación de Google
          const { data } = await GoogleSignin.signIn();
    
          if(!data) return;
          // Crea una credencial de Firebase con el token de Google
          const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
    
          // Inicia sesión en Firebase con la credencial de Google
          await auth().signInWithCredential(googleCredential);
    
          Alert.alert('Éxito', 'Inicio de sesión con Google exitoso');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Hubo un problema al iniciar sesión con Google');
        }
      };

    return (
        <View
            style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                marginBottom: 30
            }}
        >
            <ButtonGeneral text='Iniciar Sesión con Google' onPress={handleGoogleSignIn} icon={'google'} />
        </View>
    )
}
