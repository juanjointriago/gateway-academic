import { useRouter } from 'expo-router';
import { ButtonGeneral, ImageControl, InputControl, LayoutGeneral } from '@/src/components'
import { useForm } from 'react-hook-form';
import { IUser, ProfileSchema, ProfileSchemaType } from '@/src/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/src/store/auth/auth.store';
import { UserService } from '@/src/services';
import { toast } from '@/src/helpers/toast';

export const ProfileScreen = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    const { control, handleSubmit } = useForm<ProfileSchemaType>({
        defaultValues: {
            photo: { name: "", type: "", uri: user?.photoUrl },
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            cc: user?.cc,
            address: user?.address,
        },
        resolver: zodResolver(ProfileSchema),
    });

    
    const onSubmit = async (data: ProfileSchemaType) => {
        try {
            const resp = await UserService.updateFile(user?.uid || '', data.photo);
            // const memoizedPhotoUri = useMemo(() => resp, [resp]);
            if (!resp) return;
            const dataUser: IUser = {
                address: data.address,
                cc: data.cc,
                email: data.email,
                name: data.name,
                phone: data.phone,
                photoUrl: resp,
                bornDate: user?.bornDate || '',
                unitsForBooks: user?.unitsForBooks || [],
                city: user?.city || '',
                country: user?.country || '',
                uid: user?.uid || '',
                isActive: user?.isActive || false,
                id: user?.id || '',
                level: user?.level || '',
                role: user?.role || 'student',
                subLevel: user?.subLevel || '',
                teacherLink: user?.teacherLink || '',
            }
            const respUser = await updateUser(dataUser);
            if (!respUser) throw new Error('Ha ocurrido un error al actualizar el usuario');
            toast({ description: 'El usuario se ha actualizado correctamente', type: 'success' });
        } catch (error: any) {
            console.debug('error', error);
            toast({ description: error.message || 'Ha ocurrido un error al actualizar el usuario', type: 'danger' });
        }
    };

    return (
        <LayoutGeneral title='Perfil' onBackAction={() => router.back()}>
            <ImageControl control={control} name={'photo'}  />
            <InputControl control={control} name={'cc'} label={'Cedula/RUC'} keyboardType='numeric' />
            <InputControl control={control} name={'name'} label={'Nombre'} autoCapitalize='words' />
            <InputControl control={control} name={'email'} label={'Correo'} keyboardType='email-address' />
            <InputControl control={control} name={'address'} label={'Direccion'} />
            <InputControl control={control} name={'phone'} label={'Telefono'} keyboardType='phone-pad' maxLength={10} />
            <ButtonGeneral text='Actualizar' onPress={handleSubmit(onSubmit)} mode='contained' />
        </LayoutGeneral>
    )
}
