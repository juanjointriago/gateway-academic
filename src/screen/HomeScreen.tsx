import {} from 'react'
import { LayoutGeneral } from '../components'
import { useAuthStore } from '../store/auth/auth.store';
import { useRouter } from 'expo-router';

export const HomeScreen = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logoutUser);

  const handleLogout = () => {
    logout();
    router.replace('/signIn');
  }

  return (
    <LayoutGeneral title='Bienvenido' optionsHeader={[ { icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout } ]}>

    </LayoutGeneral>
  )
}
