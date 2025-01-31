import { GenericTable, IconRenderPDF, IconRenderWeb, LabelGeneral, LayoutGeneral, SearchBarGeneral } from '@/src/components'
import { useUnitStore } from '@/src/store/unit/unit.store';
import { IUnit, IUnitMutation } from '@/src/interfaces';
import { View } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { Searchbar } from 'react-native-paper';

export const BooksScreen = () => {

    const units = useUnitStore((state) => state.units);

    const [searchQuery, setSearchQuery] = useState('');

    const columns = useMemo(() => [
        { title: 'Nombre', key: 'name' as keyof IUnit },
        {
            title: 'Unidad',
            key: 'sublevelInfo' as keyof IUnitMutation,
            render: (_: any, row: IUnitMutation) => <LabelGeneral label={row.sublevelInfo?.name || ''} styleProps={{ marginLeft: 10 }} />
        },
        {
            title: 'Acciones',
            key: 'actions' as keyof IUnit,
            render: (_: any, row: IUnit) => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <IconRenderPDF url={row.supportMaterial || ''} titleModal={'Supp. Material ' + row.name} />
                    <IconRenderWeb url={row.workSheetUrl || ''} />
                </View>
            ),
        },
    ], []);

    const filteredUnits = useMemo(() =>
        units
            .filter(unit =>
                unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.sublevelInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => a.orderNumber - b.orderNumber),
        [searchQuery, units]
    );

    const handleSearch = useCallback((text: string) => {
        setSearchQuery(text);
    }, []);

    return (
        <LayoutGeneral title='Libros'>
            <SearchBarGeneral
                onChange={handleSearch}
                value={searchQuery}
                debounceTime={500}
                placeholder='Buscar...'
            />
            <GenericTable
                columns={columns}
                data={filteredUnits}
                pageSize={9}
            />
        </LayoutGeneral>
    )
}
