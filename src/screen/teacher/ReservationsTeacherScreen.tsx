import { GenericTable, IconViewEvent, LabelGeneral, LayoutGeneral } from '@/src/components'
import { colorForTypeEvent, textStatusEvent, typeStatusEvent } from '@/src/constants/ConstantsErrors';
import { IEvent } from '@/src/interfaces';
import { useAuthStore } from '@/src/store/auth/auth.store';
import { useEventStore } from '@/src/store/event/event.store';
import { format } from 'date-fns';
import React, { useEffect, useMemo } from 'react'
import { View } from 'react-native';
import { Avatar, Icon, IconButton, Tooltip } from 'react-native-paper';

export const ReservationsTeacherScreen = () => {
  const user = useAuthStore((state) => state.user);
  const events = useEventStore((state) => state.events);

  const columns = useMemo(() => [
    { title: 'Fecha', key: 'date' as keyof IEvent, render: (_: any, row: IEvent) => <LabelGeneral label={format(new Date(row.date), 'dd/MM/yyyy HH:mm')} variant='bodySmall' styleProps={{ fontSize: 12, padding: 5 }} /> },
    { title: 'Clase', key: 'name' as keyof IEvent },
    {
      title: 'Estado',
      key: 'status' as keyof IEvent,
      render: (_: any, row: IEvent) => (
        <View style={{ marginLeft: 2 }}>
          <Tooltip title={textStatusEvent[row.status]}>
            <IconButton icon={typeStatusEvent[row.status]} selected size={24} iconColor={colorForTypeEvent[row.status]} />
          </Tooltip>
        </View>
      )
    },
    {
      title: 'Ver más',
      key: 'actions' as keyof IEvent,
      render: (_: any, row: IEvent) => (
        <IconViewEvent {...row} />
      )
    }
  ], []);

  return (
    <LayoutGeneral title='Reservaciones' withScrollView>
      <GenericTable
        columns={columns}
        data={events}
        pageSize={9}
      />
    </LayoutGeneral>
  )
}
