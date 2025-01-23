import { } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ButtonGeneral, FadeInImage, InputControl, LayoutAuth } from '@/src/components'
import { LOGO_URL2 } from '@/src/constants/Contants'
import { LoginSchema, LoginSchemaType } from '@/src/interfaces'

export const LoginScreen = () => {

    const { control, reset, handleSubmit } = useForm<LoginSchemaType>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(LoginSchema),
    });

    return (
        <LayoutAuth hasAppBar={false} containerStyle={{ justifyContent: 'center' }} >
            <FadeInImage uri={LOGO_URL2} styleImg={{ width: 250, height: 250 }} />
            <InputControl control={control} name="email" label="Email" keyboardType='email-address' autoCapitalize='none' />
            <InputControl control={control} name="password" label="Contraseña" secureTextEntry autoCapitalize='none' />
            <ButtonGeneral text='Iniciar Sesión' mode='contained' />
        </LayoutAuth>
    )
}
