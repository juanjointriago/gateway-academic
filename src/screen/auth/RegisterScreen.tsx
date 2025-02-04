import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import { ButtonGeneral, DateControl, InputControl, LayoutAuth, SelectControl } from '@/src/components'
import { useForm } from 'react-hook-form';
import { RegisterSchema, RegisterSchemaType } from '@/src/interfaces';
import { useCountryStore } from '@/src/store/country/country.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/src/store/auth/auth.store';
import { toast } from '@/src/helpers/toast';

export const RegisterScreen = () => {
    const router = useRouter();
    const registerUser = useAuthStore((state) => state.registerUser);

    const getRegions = useCountryStore((state) => state.fetchRegions);
    const getCities = useCountryStore((state) => state.fetchCities);

    const regions = useCountryStore((state) => state.regions);
    const cities = useCountryStore((state) => state.cities);

    const [isLoading, setIsLoading] = useState(false);

    const { control, reset, handleSubmit, watch, setValue } = useForm<RegisterSchemaType>({
        defaultValues: {
            address: '',
            bornDate: new Date(),
            cc: '',
            city: { _id: '', value: '' },
            region: { _id: '', value: '' },
            country: { _id: '103', value: 'Ecuador' },
            email: '',
            isActive: true,
            name: '',
            password: '',
            confirmPassword: '',
            phone: '',
            role: 'student',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (data: RegisterSchemaType) => {
        setIsLoading(true);
        const resp = await registerUser(data);
        if (resp.error) {
            toast({ description: resp.error, type: 'danger' });
            setIsLoading(false);
            return;
        }
        reset();
        router.replace('/signIn');
        toast({ description: 'El usuario se ha registrado correctamente. Su cuenta se encuentra en proceso de activación', type: 'success' });
        setIsLoading(false);
    };

    useEffect(() => {
        getRegions();
    }, []);  
    
    useEffect(() => {
        if (!watch('region')._id) return;
        setValue('city', { _id: '', value: '' });
        getCities(watch('region').value);
    }, [watch('region')]);

    return (
        <>
            <LayoutAuth title="Registrarse" withScrollView={true} onBackAction={() => router.replace('/signIn')} >
                <InputControl control={control} name="cc" label="Identificación" keyboardType="number-pad" maxLength={13} />
                <InputControl control={control} name="name" label="Nombre" autoCapitalize='words' />
                {watch('country')._id && (
                    <SelectControl
                        control={control}
                        name="region"
                        arrayList={regions.map((region) => ({ value: region.name, _id: `${region.state_code}` }))}
                        label="Provincia"
                    />
                )}

                {watch('region')._id && (
                    <SelectControl
                        control={control}
                        name="city"
                        arrayList={cities.map((city, index) => ({ value: city, _id: `${index}` }))}
                        label="Ciudad"
                    />
                )}
                <DateControl control={control} name="bornDate" label="Fecha de Nacimiento" />
                <InputControl control={control} name="email" label="Email" keyboardType="email-address" autoCapitalize='none' />
                <InputControl control={control} name="address" label="Dirección" />
                <InputControl control={control} name="phone" label="Teléfono" keyboardType="phone-pad" maxLength={10} />
                <InputControl control={control} name="password" label="Contraseña" secureTextEntry autoCapitalize='none' />
                <InputControl control={control} name="confirmPassword" label="Confirmar contraseña" secureTextEntry autoCapitalize='none' />
                <ButtonGeneral onPress={handleSubmit(onSubmit)} text="Registrarse" mode='contained' styleBtn={{ marginBottom: 20 }} loading={isLoading} disabled={isLoading} />
            </LayoutAuth>
        </>
    )
}
