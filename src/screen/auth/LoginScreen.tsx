import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ButtonGeneral, FadeInImage, InputControl, LabelGeneral, LayoutAuth, SocialButton, TitleWithLine } from '@/src/components'
import { LOGO_URL, LOGO_URL2, USERSTUDENTTEST, USERTEACHERTEST, PASSSTUDENTTEST, PASSTEACHERTEST } from '@/src/constants/Constants'
import { LoginSchema, LoginSchemaType } from '@/src/interfaces'
import { Keyboard, useColorScheme, Linking } from 'react-native'
import { useAuthStore } from '@/src/store/auth/auth.store'
import { useRouter } from 'expo-router'
import { toast } from '@/src/helpers/toast'
import { environment } from '@/enviroment'

export const LoginScreen = () => {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const login = useAuthStore((state) => state.loginUser);
    
    const [isLoad, setIsLoad] = useState(false);

    const { control, reset, handleSubmit } = useForm<LoginSchemaType>({
        defaultValues: {
            email: environment.production ? '' : environment.teacher ? USERTEACHERTEST : USERSTUDENTTEST,
            password: environment.production ? '' : environment.teacher ? PASSTEACHERTEST : PASSSTUDENTTEST,
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
        if(result.data?.role === 'teacher') return router.replace('/(tabsT)/homeTeacher');
        if(result.data?.role === 'student') return router.replace('/(tabs)/home');
    };

    const handleOpenEnglishWebsite = async () => {
        const url = 'https://gateway-english.com/auth/signup';
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                toast({ description: 'No se puede abrir el enlace', type: 'danger' });
            }
        } catch (error) {
            console.error('Error opening URL:', error);
            toast({ description: 'Error al abrir el enlace', type: 'danger' });
        }
    };

    return (
        <LayoutAuth hasAppBar={false} containerStyle={{ justifyContent: 'center' }} >
            <FadeInImage 
                uri={colorScheme === 'dark' ? LOGO_URL : LOGO_URL2} 
                styleImg={{ 
                    width: 250, 
                    height: 250,
                }} 
                styleContainer={{
                    marginBottom: 20,
                }}
            />
            <InputControl control={control} name="email" label="Email" keyboardType='email-address' autoCapitalize='none' />
            <InputControl control={control} name="password" label="Contraseña" secureTextEntry autoCapitalize='none' />
            <ButtonGeneral text='Iniciar Sesión' mode='contained' onPress={handleSubmit(onSubmit)} loading={isLoad} disabled={isLoad} />
            <TitleWithLine title='👨🏼‍💻' />
            <LabelGeneral 
                label='👉🏼 Eres nuevo? Empieza a aprender idiomas 😎 desde cualquier lugar 📍  ' 
                onPressText={handleOpenEnglishWebsite} 
                styleProps={{ textAlign: 'center', fontSize: 12 }} 
                variant='titleSmall' 
            />
        </LayoutAuth>
    )
}
