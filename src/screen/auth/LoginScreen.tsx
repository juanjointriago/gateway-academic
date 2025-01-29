import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ButtonGeneral, FadeInImage, InputControl, LabelGeneral, LayoutAuth, SocialButton, TitleWithLine } from '@/src/components'
import { LOGO_URL, LOGO_URL2, PASSTEST, USERTEST } from '@/src/constants/Constants'
import { LoginSchema, LoginSchemaType } from '@/src/interfaces'
import { Keyboard, useColorScheme } from 'react-native'
import { useAuthStore } from '@/src/store/auth/auth.store'
import { useRouter } from 'expo-router'
import { toast } from '@/src/helpers/toast'
import { environment } from '@/enviroment'

export const LoginScreen = () => {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const login = useAuthStore((state) => state.loginUser);
    // const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

    const [isLoad, setIsLoad] = useState(false);

    const { control, reset, handleSubmit } = useForm<LoginSchemaType>({
        defaultValues: {
            email: environment.production ? '' : USERTEST,
            password: environment.production ? '' : PASSTEST,
        },
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data: LoginSchemaType) => {
        setIsLoad(true);
        Keyboard.dismiss();
        const result = await login(data);
        if (result.error) {
            toast({ description: result.error, type: 'danger' });
            setIsLoad(false);
            return;
        }
        reset();
        setIsLoad(false);
        router.replace('/(tabs)/home');
    };

    // const onLoginWithGoogle = async () => {
    //     Keyboard.dismiss();
    //     setIsLoad(true);
    //     const result = await loginWithGoogle();
    //     if (!result) return setIsLoad(false);
    //     reset();
    //     setIsLoad(false);
    //     router.replace('/home');
    // }

    return (
        <LayoutAuth hasAppBar={false} containerStyle={{ justifyContent: 'center' }} >
            <FadeInImage uri={colorScheme === 'dark' ? LOGO_URL : LOGO_URL2} styleImg={{ width: 250, height: 250 }} />
            <InputControl control={control} name="email" label="Email" keyboardType='email-address' autoCapitalize='none' />
            <InputControl control={control} name="password" label="Contraseña" secureTextEntry autoCapitalize='none' />
            <ButtonGeneral text='Iniciar Sesión' mode='contained' onPress={handleSubmit(onSubmit)} loading={isLoad} disabled={isLoad} />
            <TitleWithLine title='O' />
            <SocialButton />
            <LabelGeneral label='¿No tienes cuenta? Regístrate' onPressText={() => router.replace('/register')} styleProps={{ textAlign: 'center', fontSize: 12 }} variant='titleSmall' />
        </LayoutAuth>
    )
}
