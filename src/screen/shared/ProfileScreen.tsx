import { } from 'react'
import { useRouter } from 'expo-router';
import { ButtonGeneral, ImageControl, ImagePicker, InputControl, LayoutGeneral } from '@/src/components'
import { pickImage } from '@/src/helpers/files';
import { useForm } from 'react-hook-form';

export const ProfileScreen = () => {
    const router = useRouter();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            imgProfile: { name: "", type: "", uri: "" },
            name: "",
            email: "",
            phone: "",
            cc: "",
            address: "",
            country: { _id: "", value: "" },
            region: { _id: "", value: "" },
            city: { _id: "", value: "" },
        }
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <LayoutGeneral title='Perfil' onBackAction={() => router.replace('/(tabs)/settings')}>
            <ImageControl control={control} name={'imgProfile'} />
            <InputControl control={control} name={'cc'} label={'Cedula/RUC'} />
            <InputControl control={control} name={'name'} label={'Nombre'} />
            <InputControl control={control} name={'email'} label={'Correo'} />
            <InputControl control={control} name={'address'} label={'Direccion'} />
            <InputControl control={control} name={'phone'} label={'Telefono'} />
            <ButtonGeneral text='Actualizar' onPress={handleSubmit(onSubmit)} mode='contained' />
        </LayoutGeneral>
    )
}
