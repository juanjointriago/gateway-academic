import { } from 'react'
import { LabelGeneral, LayoutGeneral, Section } from '../components'
import { ISection } from '../interfaces'
import { useAuthStore } from '../store/auth/auth.store'

export const HomeScreen = () => {
  const user = useAuthStore((state) => state.user);

  const listInfo: ISection[] = [
    {
      title: 'Modalida',
      nameIcon: 'school',
      description: 'Modalidad online'
    },
    {
      title: 'Clases Reservadas',
      nameIcon: 'calendar-month',
      description: '0'
    },
    {
      title: 'Unidad Actual',
      nameIcon: 'chart-bar',
      description: 'Unidad 1'
    },
    {
      title: 'Libros Disponibles',
      nameIcon: 'notebook',
      description: '25'
    }
  ]

  return (
    <LayoutGeneral title='Bienvenido'>
      <LabelGeneral label={`Hola ${user?.name}`} variant='titleMedium' styleProps={{ marginBottom: 20 }} />
      <Section
        title='Información colectiva de todas las entidades de Gateway'
        setionsList={listInfo}
      />
    </LayoutGeneral>
  )
}
