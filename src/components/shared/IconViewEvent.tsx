import { FC, useMemo, useState } from 'react'
import { IEvent, IUserData, roles } from '@/src/interfaces'
import { useDisclosure } from '@/src/hook'
import { Avatar, IconButton, Surface, Text, useTheme } from 'react-native-paper'
import { ModalGeneral } from '../modal'
import { useEventStore } from '@/src/store/event/event.store'
import { LabelGeneral, LabelWithImg } from '../labels'
import { textStatusEvent } from '@/src/constants/ConstantsErrors'
import { Linking, ScrollView, View } from 'react-native'
import { GenericTable } from '../table/TableGeneric'
import { URL_PROFILE_DEFAULT } from '@/src/constants/Constants'
import { format } from 'date-fns'
import { ButtonGeneral } from '../buttons'
import { toast } from '@/src/helpers/toast'
import { showMessage } from 'react-native-flash-message'

interface Props extends IEvent {
    typeUser?: roles
}

export const IconViewEvent: FC<Props> = ({ typeUser = 'teacher', ...rest }) => {
    const { colors } = useTheme();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const getEvent = useEventStore((state) => state.getEventsDetailById);
    const eventSelected = useEventStore((state) => state.eventSelected);

    const toogleOpenModal = async () => {
        setIsLoading(true);
        await getEvent(rest.id as string);
        setIsLoading(false);
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

    const handleCancelEvent = async () => {
        if (!rest.limitDate) {
            return toast({ description: '¡Lo sentimos! No se ha asignado una fecha límite de reservación para esta clase', type: 'danger' });
        }
        const today = new Date();
        const limitDate = new Date(rest.limitDate);
        if (limitDate < today) {
            return toast({ description: '¡Lo sentimos! Esta clase ya se encuentra cerrada', type: 'danger' });
        }
        toast({ description: 'Falta logica para cancelar la clase', type: 'warning' });
    }

    const columns = useMemo(() => [
        { title: 'Perfil', key: 'photoUrl' as keyof IUserData, render: (_: any, row: IUserData) => <Avatar.Image size={40} source={{ uri: !row.photoUrl ? URL_PROFILE_DEFAULT : row.photoUrl }} /> },
        { title: 'Nombre', key: 'name' as keyof IUserData },
        { title: 'Estado', key: 'status' as keyof IUserData, render: (_: any, row: IUserData) => <LabelGeneral label={textStatusEvent[row.status as string]} variant='bodySmall' styleProps={{ fontSize: 12 }} /> },
    ], []);

    return (
        <>
            <IconButton icon='eye' size={24} onPress={toogleOpenModal} iconColor={colors.primary} loading={isLoading} disabled={isLoading} />
            <ModalGeneral visible={isOpen} onDismiss={toogleCloseModal} title={rest.name} snapPoint={typeUser === 'student' ? 0.5 : 0.8}>
                <ScrollView style={{ padding: 10 }} keyboardShouldPersistTaps="always" alwaysBounceVertical={false} showsVerticalScrollIndicator={false}>
                    <Surface style={{ padding: 10, marginBottom: 30, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <LabelGeneral label='Fecha Limite de inscripción: ' variant='labelMedium' styleProps={{ fontSize: 13 }} />
                            <LabelGeneral label={format(new Date(rest.limitDate ?? 0), 'dd/MM/yyyy HH:mm')} variant='bodySmall' />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <LabelGeneral label='Fecha de la clase: ' variant='labelMedium' styleProps={{ fontSize: 13 }} />
                            <LabelGeneral label={format(new Date(rest.date), 'dd/MM/yyyy HH:mm')} variant='bodySmall' />
                        </View>
                    </Surface>
                    {typeUser === 'teacher' && (
                        <>
                            <LabelGeneral label={'Estudiantes'} variant='titleSmall' styleProps={{ textAlign: 'center' }} />
                            <GenericTable
                                columns={columns}
                                data={eventSelected?.studentsData ?? []}
                                pageSize={5}
                            />
                        </>
                    )}
                    {typeUser === 'student' && (
                        <>
                            <LabelGeneral label={'Profesor'} variant='titleSmall' styleProps={{ textAlign: 'center' }} />
                            <LabelWithImg
                                title={eventSelected?.teacherData?.name ?? ''}
                                url={eventSelected?.teacherData?.photoUrl ?? URL_PROFILE_DEFAULT}
                                subtitle={eventSelected?.teacherData?.email ?? ''}
                                description={eventSelected?.teacherData?.phone ?? ''}
                                contentStyle={{ marginBottom: 10 }}
                            />
                        </>
                    )}
                </ScrollView>
                <View style={{ justifyContent: 'space-between', flexDirection: typeUser === 'student' ? 'row' : 'column' }}>
                    {typeUser === 'student' && (
                        <ButtonGeneral
                            text='Cancelar clase'
                            icon='cancel'
                            onPress={handleCancelEvent}
                            styleBtn={{ marginBottom: 10, marginHorizontal: 12, backgroundColor: colors.error }}
                            mode='contained'
                        />
                    )}
                    <ButtonGeneral
                        text='Ir a la clase'
                        icon='google-classroom'
                        onPress={toogleOpenLink}
                        styleBtn={{ marginBottom: 10, marginHorizontal: 12 }}
                        mode='contained'
                    />
                </View>
            </ModalGeneral>
        </>
    )
}
