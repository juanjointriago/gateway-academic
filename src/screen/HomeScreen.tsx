import { useEffect, useMemo, useState } from 'react'
import { LabelGeneral, LabelWithImg, LayoutGeneral, LoadScreen, Section } from '../components'
import { ISection } from '../interfaces'
import { useAuthStore } from '../store/auth/auth.store'
import { typeUser } from '../constants/ConstantsErrors'
import { Divider } from 'react-native-paper'
import { useLevelStore } from '../store/level/level.store'
import { useEventStore } from '../store/event/event.store'
import { useSubLevelStore } from '../store/level/sublevel.store'

export const HomeScreen = () => {
  const user = useAuthStore((state) => state.user);

  const levels = useLevelStore((state) => state.getAllLevels);
  const getLevelByDocId = useLevelStore((state) => state.getLevelByDocId);

  const events = useEventStore((state) => state.getAllEvents);
  const getEventStudent = useEventStore((state) => state.getEventStudent);

  const subLevels = useSubLevelStore((state) => state.getAllSubLevels);
  const getSubLevelByDocId = useSubLevelStore((state) => state.getSubLevelByDocId);

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
  ]), [isLoading]);

  // const listInfo: ISection[] = [
  //   {
  //     title: 'Modalida',
  //     nameIcon: 'school',
  //     description: 'Modalidad online'
  //   },
  //   {
  //     title: 'Clases Reservadas',
  //     nameIcon: 'calendar-month',
  //     description: '0'
  //   },
  //   {
  //     title: 'Unidad Actual',
  //     nameIcon: 'chart-bar',
  //     description: 'Unidad 1'
  //   },
  //   {
  //     title: 'Libros Disponibles',
  //     nameIcon: 'notebook',
  //     description: '25'
  //   }
  // ];

  const loadInit = async () => {
    setIsLoading(true);
    await levels();
    await events();
    await subLevels();
    setIsLoading(false);
  }

  useEffect(() => {
    loadInit();
  }, []);

  if (isLoading) return <LoadScreen message='Cargando información, por favor espere un momento' textStyle={{ textAlign: 'center', marginTop: 100 }} />

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
