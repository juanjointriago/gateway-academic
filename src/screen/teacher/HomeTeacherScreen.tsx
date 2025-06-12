import {  useMemo } from 'react'
import { Divider } from 'react-native-paper'
import { LabelWithImg, LayoutGeneral, Section } from '@/src/components'
import { typeUser } from '@/src/constants/ConstantsErrors'
import { useAuthStore } from '@/src/store/auth/auth.store'
import { useEventStore } from '@/src/store/event/event.store'
import { useUnitStore } from '@/src/store/unit/unit.store'

export const HomeTeacherScreen = () => {

    const user = useAuthStore((state) => state.user);

    const events = useEventStore((state) => state.eventsAvailable);

    const units = useUnitStore((state) => state.unitsAvailable);

    const listInfo = useMemo(() => ([
        {
            title: 'Clases Reservadas',
            nameIcon: 'calendar-month',
            description: `${events}`
        },
        {
            title: 'Libros',
            nameIcon: 'book-open',
            description: `${units}`
        }
    ]), [events, units]);

    // useEffect(() => {
    //     if (!user) return;
    //     startListeningUser(user.id);
    //     return () => {
    //         stopListeningUser();
    //     }
    // }, []);

    // useEffect(() => {
    //     if (!user) return;
    //     // startListeningUnits();
    //     startListeningEvents({ isTeacher: true });
    //     return () => {
    //         stopListeningEvents();
    //         // stopListeningUnits();
    //     }
    // }, [user]);

    return (
        <LayoutGeneral title='Bienvenido'>
            <LabelWithImg
                title={user?.name}
                url={user?.photoUrl}
                subtitle={user?.email}
                description={typeUser[user?.role as string]}
                contentStyle={{ marginBottom: 10 }}
            />
            <Divider style={{ marginVertical: 10 }} />
            <Section
                title='Información colectiva de todas las entidades de Gateway'
                setionsList={listInfo}
            />
        </LayoutGeneral>
    )
}
