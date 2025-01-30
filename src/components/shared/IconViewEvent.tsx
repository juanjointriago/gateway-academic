import { FC, useEffect, useMemo, useState } from 'react'
import { IEvent, IUserData } from '@/src/interfaces'
import { useDisclosure } from '@/src/hook'
import { Avatar, IconButton, Surface, Text, useTheme } from 'react-native-paper'
import { ModalGeneral } from '../modal'
import { useEventStore } from '@/src/store/event/event.store'
import { LabelGeneral, LabelWithImg } from '../labels'
import { textStatusEvent, typeUser } from '@/src/constants/ConstantsErrors'
import { Linking, ScrollView, View } from 'react-native'
import { GenericTable } from '../table/TableGeneric'
import { URL_PROFILE_DEFAULT } from '@/src/constants/Constants'
import { format } from 'date-fns'
import { ButtonGeneral } from '../buttons'
import { toast } from '@/src/helpers/toast'

interface Props extends IEvent { }

export const IconViewEvent: FC<Props> = ({ ...rest }) => {
    const { colors } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const getEvent = useEventStore((state) => state.getEventsDetailById);
    const eventSelected = useEventStore((state) => state.eventSelected);

    const toogleOpenModal = () => {
        onOpen();
    }

    const toogleCloseModal = () => {
        onClose();
    }

    const toogleOpenLink = async () => {
        const supported = await Linking.canOpenURL(eventSelected?.meetLink ?? '');
        if (supported) {
            Linking.openURL(eventSelected?.meetLink ?? '');
        } else {
            toast({ description: 'No se pudo abrir la URL', type: 'danger' });
        }
    }

    const getData = async () => {
        setIsLoading(true);
        await getEvent(rest.id as string);
        setIsLoading(false);
    }

    const columns = useMemo(() => [
        { title: 'Perfil', key: 'photoUrl' as keyof IUserData, render: (_: any, row: IUserData) => <Avatar.Image size={40} source={{ uri: !row.photoUrl ? URL_PROFILE_DEFAULT : row.photoUrl }} /> },
        { title: 'Nombre', key: 'name' as keyof IUserData },
        { title: 'Estado', key: 'status' as keyof IUserData, render: (_: any, row: IUserData) => <LabelGeneral label={textStatusEvent[row.status as string]} variant='bodySmall' styleProps={{ fontSize: 12 }} /> },
    ], []);

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <IconButton icon='eye' size={24} onPress={toogleOpenModal} iconColor={colors.primary} loading={isLoading} disabled={isLoading} />
            <ModalGeneral visible={isOpen} onDismiss={toogleCloseModal} title={rest.name} snapPoint={0.8}>
                <ScrollView style={{ padding: 10 }} keyboardShouldPersistTaps="always" alwaysBounceVertical={false} showsVerticalScrollIndicator={false}>
                    <Surface style={{ padding: 10, marginBottom: 30, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <LabelGeneral label='Fecha Limite de inscripción: ' variant='labelMedium' styleProps={{ fontSize: 13 }} />
                            <LabelGeneral label={format(new Date(rest.limitDate ?? 0), 'dd/MM/yyyy')} variant='bodySmall' />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <LabelGeneral label='Fecha de la clase: ' variant='labelMedium' styleProps={{ fontSize: 13 }} />
                            <LabelGeneral label={format(new Date(rest.date), 'dd/MM/yyyy')} variant='bodySmall' />
                        </View>
                    </Surface>
                    <LabelGeneral label={'Estudiantes'} variant='titleSmall' styleProps={{ textAlign: 'center' }} />
                    <GenericTable
                        columns={columns}
                        data={eventSelected?.studentsData ?? []}
                        pageSize={5}
                    />
                </ScrollView>
                <ButtonGeneral text='Ir a la clase' icon='google-classroom' onPress={toogleOpenLink} styleBtn={{ marginBottom: 10, marginHorizontal: 12 }} mode='contained' />
            </ModalGeneral>
        </>
    )
}
