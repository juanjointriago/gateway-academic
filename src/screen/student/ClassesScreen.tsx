import { useCallback, useMemo, useState } from 'react'
import { GenericTable, IconViewEvent, LabelGeneral, LayoutGeneral, SearchBarGeneral } from '@/src/components'
import { useEventStore } from '@/src/store/event/event.store';
import { IEvent } from '@/src/interfaces';
import { format } from 'date-fns';
import { View } from 'react-native';
import { IconButton, Tooltip } from 'react-native-paper';
import { colorForTypeEvent, textStatusEvent, typeStatusEvent } from '@/src/constants/ConstantsErrors';

export const ClassesScreen = () => {
    const events = useEventStore((state) => state.events);

    const [searchQuery, setSearchQuery] = useState('');

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
                <IconViewEvent typeUser='student' {...row} />
            )
        }
    ], []);

    const filteredEvents = useMemo(() =>
        events
            .filter(event =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.date.toString().includes(searchQuery)
            )
            .sort((a, b) => a.date - b.date),
        [searchQuery, events],
    );

    const handleSearch = useCallback((text: string) => {
        setSearchQuery(text);
    }, []);

    return (
        <LayoutGeneral title='Clases'>
            <SearchBarGeneral
                onChange={handleSearch}
                value={searchQuery}
                debounceTime={500}
                placeholder='Buscar...'
            />
            <GenericTable
                columns={columns}
                data={filteredEvents}
                pageSize={9}
            />
        </LayoutGeneral>
    )
}
