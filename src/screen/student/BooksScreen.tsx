import { GenericTable, IconRenderPDF, IconRenderWeb, LabelGeneral, LayoutGeneral, SearchBarGeneral } from '@/src/components'
import { useUnitStore } from '@/src/store/unit/unit.store';
import { IUnit, IUnitMutation } from '@/src/interfaces';
import { View } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/src/store/auth/auth.store';
import { useSubLevelStore } from '@/src/store/level/sublevel.store';

export const BooksScreen = () => {

    const units = useUnitStore((state) => state.units);
    const user = useAuthStore((state) => state.user);
    const userUnits = user && user.unitsForBooks && user.unitsForBooks
    const myUnits = units.filter((unit) => user!.unitsForBooks.includes(unit.sublevel));
    const getAllUnits = useUnitStore((state) => state.getAllUnits);
    const getSubLevelById = useSubLevelStore((state) => state.getSubLevelById);
    const getAllSublevels = useSubLevelStore((state) => state.getAllSubLevels);
    // console.debug('user.unitsForBooks', userUnits);
    // console.debug('user.unitsForBooks', user?.unitsForBooks);
    useEffect(() => {
        getAllSublevels();
        if(userUnits ) {
            getAllUnits();
        }
    }, [getAllUnits])
    

    const [searchQuery, setSearchQuery] = useState('');

    const columns = useMemo(() => [
        { title: 'Nombre', key: 'name' as keyof IUnit },
        {
            title: 'Unidad',
            key: 'sublevelInfo' as keyof IUnit,
            render: (_: any, row: IUnit) => <LabelGeneral label={getSubLevelById(row.sublevel)?.name || ''} styleProps={{ marginLeft: 10 }} />
        },
        {
            title: 'Book',
            key: 'actions' as keyof IUnit,
            render: (_: any, row: IUnit) => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <IconRenderPDF url={row.supportMaterial || ''} titleModal={'Supp. Material ' + row.name} />
                </View>
            ),
        },
        {
            title: 'WorkSheet',
            key: 'actions' as keyof IUnit,
            render: (_: any, row: IUnit) => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <IconRenderWeb url={row.workSheetUrl || ''} />
                </View>
            ),
        },
    ], []);

    const filteredUnits = useMemo(() =>
        myUnits
            .filter(unit =>
                unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                unit.sublevel?.toLowerCase().includes(searchQuery.toLowerCase())
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
                pageSize={8}
            />
        </LayoutGeneral>
    )
}
