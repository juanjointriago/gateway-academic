import { useEffect, useMemo, useState } from 'react'
import { Divider } from 'react-native-paper'
import { LabelWithImg, LayoutGeneral, Section } from '@/src/components'
import { BannerSimple } from '@/src/components/banner/BannerSimple'
import { typeUser } from '@/src/constants/ConstantsErrors'
import { useDisclosure } from '@/src/hook'
import { useAuthStore } from '@/src/store/auth/auth.store'
import { useEventStore } from '@/src/store/event/event.store'
import { useUnitStore } from '@/src/store/unit/unit.store'

export const HomeTeacherScreen = () => {
    const user = useAuthStore((state) => state.user);

    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, onOpen } = useDisclosure();

    const events = useEventStore((state) => state.eventsAvailable);
    const getAllEvents = useEventStore((state) => state.getAllEvents);

    const units = useUnitStore((state) => state.unitsAvailable);
    const getUnitsTeacher = useUnitStore((state) => state.getUnitsUser);

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
    ]), [isLoading]);

    const loadInit = async () => {
        onOpen();
        setIsLoading(true);
        await getAllEvents({ isTeacher: true, userId: user?.id as string });
        await getUnitsTeacher(user?.unitsForBooks as string[]);
        onClose();
        setIsLoading(false);
    }

    useEffect(() => {
        loadInit();
    }, []);

    return (
        <LayoutGeneral title='Bienvenido'>
            <BannerSimple isOpen={isOpen} description='Bienvenido a Gateway, estamos cargando la información y los recursos necesarios para tu entorno, por favor espere...' />
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
