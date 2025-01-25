import { } from 'react'
import { LayoutGeneral } from '../components'
import { useAuthStore } from '../store/auth/auth.store';
import { useRouter } from 'expo-router';
import { useAlert } from '../context/AlertContext';

export const HomeScreen = () => {
  const router = useRouter();
  const { customAlert, onToggle } = useAlert();
  const logout = useAuthStore((state) => state.logoutUser);

  const handleLogout = () => {
    customAlert({
      message: '¿Desea cerrar sesión?',
      accions: [
        {
          text: 'Cancelar',
          onPress: () => onToggle,
        },
        {
          text: 'Aceptar',
          onPress: () => {
            logout();
            router.replace('/signIn');
          }
        }
      ]
    })
  }

  return (
    <LayoutGeneral title='Bienvenido' optionsHeader={[{ icon: 'logout', label: 'Cerrar sesión', onPress: handleLogout }]}>

    </LayoutGeneral>
  )
}
