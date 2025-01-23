import { } from 'react'
import { useRouter } from 'expo-router';
import { LayoutAuth } from '@/src/components'

export const RegisterScreen = () => {
    const router = useRouter();
    return (
        <LayoutAuth title="Registrarse" withScrollView={true} onBackAction={() => router.replace('/signIn')}>

        </LayoutAuth>
    )
}
