import { useEffect, useMemo, useState } from 'react'
import { LabelGeneral, LabelWithImg, LayoutGeneral, LoadScreen, Section } from '../components'
import { ISection } from '../interfaces'
import { useAuthStore } from '../store/auth/auth.store'
import { typeUser } from '../constants/ConstantsErrors'
import { Divider } from 'react-native-paper'
import { useLevelStore } from '../store/level/level.store'
import { useEventStore } from '../store/event/event.store'
import { useSubLevelStore } from '../store/level/sublevel.store'
import { useUnitStore } from '../store/unit/unit.store'

export const HomeScreen = () => {
  const user = useAuthStore((state) => state.user);

  const getAlllevels = useLevelStore((state) => state.getAllLevels);
  const getLevelByDocId = useLevelStore((state) => state.getLevelByDocId);

  const getAllEvents = useEventStore((state) => state.getAllEvents);
  const getEventStudent = useEventStore((state) => state.getEventStudent);

  const getAllSubLevels = useSubLevelStore((state) => state.getAllSubLevels);
  const getSubLevelByDocId = useSubLevelStore((state) => state.getSubLevelByDocId);

  const units = useUnitStore((state) => state.unitsAvailable);
  const getUnitsStudent = useUnitStore((state) => state.getUnitsStudent);



  const [isLoading, setIsLoading] = useState(false);

  const listInfo = useMemo(() => ([
    {
      title: 'Modalida',
      nameIcon: 'school',
      description: getLevelByDocId(user?.level as string)?.name || ''
    },
    {
      title: 'Clases Reservadas',
      nameIcon: 'calendar-month',
      description: `${getEventStudent(`${user?.id}`).length}`
    },
    {
      title: 'Unidad Actual',
      nameIcon: 'chart-bar',
      description: `${getSubLevelByDocId(`${user?.subLevel}`)?.name || ''}`
    },
    {
      title: 'Libros Disponibles',
      nameIcon: 'notebook',
      description: `${units}`
    }
  ]), [isLoading]);

  const loadInit = async () => {
    setIsLoading(true);
    await getAlllevels();
    await getAllEvents();
    await getAllSubLevels();
    await getUnitsStudent(user?.unitsForBooks as string[]);
    setIsLoading(false);
  }

  useEffect(() => {
    loadInit();
  }, []);

  // if (isLoading) return <LoadScreen message='Cargando información, por favor espere un momento' textStyle={{ textAlign: 'center', marginTop: 100 }} />

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
