import { ButtonSelectable, LayoutGeneral } from '@/src/components'
import { useAlert } from '@/src/context/AlertContext';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/auth/auth.store';
import Constants from 'expo-constants';
import { useEventStore } from '@/src/store/event/event.store';
import { useLevelStore } from '@/src/store/level/level.store';
import { useSubLevelStore } from '@/src/store/level/sublevel.store';
import { useUnitStore } from '@/src/store/unit/unit.store';
import { useAppInfoStore } from '@/src/store/appinfo/appinfo.store';


export const SettingScreen = () => {
    const router = useRouter();

    const { customAlert, onToggle } = useAlert();

    const logout = useAuthStore((state) => state.logoutUser);
    const clearStoreEvents = useEventStore((state) => state.clearStoreEvents);
    const clearStoreLevels = useLevelStore((state) => state.clearStoreLevels);
    const clearStoreSubLevels = useSubLevelStore((state) => state.clearStoreSubLevels);
    const clearStoreUnits = useUnitStore((state) => state.clearStoreUnits);
    const appinfo = useAppInfoStore((state) => state.appInfo);
    const setAppInfo = useAppInfoStore((state) => state.setAppInfo);

    const appVersion = appinfo.version || '1.0.5';

    const loadData = () => {
        setAppInfo();
    }

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
                        clearStoreEvents();
                        clearStoreLevels();
                        clearStoreSubLevels();
                        clearStoreUnits();
                        router.replace('/signIn');
                    }
                }
            ]
        })
    }

    const handleProfile = () => {
        router.push('/profile');
    }
        const handleVCard = () => {
        router.push('/vcard');
    }


    return (
        <LayoutGeneral title='Ajustes' withScrollView onRefresh={loadData}>
            <ButtonSelectable
                avatarIcon='account'
                title='Mi perfil'
                onPress={handleProfile}
                size={35}
                color='#3e6eb7'
            />
            <ButtonSelectable
                avatarIcon='account'
                title='Mi Credencial'
                onPress={handleVCard}
                size={35}
                color='#3eb7'
            />

            <ButtonSelectable
                avatarIcon='logout'
                title='Cerrar Sesión'
                onPress={handleLogout}
                size={35}
                color='#b73e66'
            />

            <ButtonSelectable
                avatarIcon='information'
                title='Versión de la app'
                description={'v ' + appVersion}
                size={35}
                color='#3eb798'
            />
        </LayoutGeneral>
    )
}
