import { useEffect, useMemo } from 'react'
import { useRouter } from 'expo-router';
import { ButtonGeneral, InputControl, LayoutAuth, SelectControl } from '@/src/components'
import { useForm } from 'react-hook-form';
import { RegisterSchema, RegisterSchemaType } from '@/src/interfaces';
import { useCountryStore } from '@/src/store/country/country.store';
import { zodResolver } from '@hookform/resolvers/zod';

export const RegisterScreen = () => {
    const router = useRouter();

    // const getCountries = useCountryStore((state) => state.fetchCountries);
    const getRegions = useCountryStore((state) => state.fetchRegions);
    const getCities = useCountryStore((state) => state.fetchCities);

    // const countries = useCountryStore((state) => state.countries);
    const regions = useCountryStore((state) => state.regions);
    const cities = useCountryStore((state) => state.cities);

    const { control, reset, handleSubmit, watch } = useForm<RegisterSchemaType>({
        defaultValues: {
            address: '',
            bornDate: '',
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

    // useEffect(() => {
    //     getCountries();
    // }, []);

    useEffect(() => {
        if (!watch('country')._id) return;
        getRegions(Number(watch('country')._id));
    }, [watch('country')]);

    useEffect(() => {
        if (!watch('region')._id) return;
        getCities(Number(watch('region')._id));
    }, [watch('region')]);


    return (
        <LayoutAuth title="Registrarse" withScrollView={true} onBackAction={() => router.replace('/signIn')}>
            <InputControl control={control} name="cc" label="Identificación" keyboardType="number-pad" maxLength={13} />
            <InputControl control={control} name="name" label="Nombre" autoCapitalize='words' />
            <InputControl control={control} name="country" label="Pais" defaultValue={watch('country').value} editable={false} />
            {watch('country')._id && (
                <SelectControl
                    control={control}
                    name="region"
                    arrayList={regions.map((region) => ({ value: region.name, _id: `${region.id_region}` }))}
                    label="Región"
                />
            )}

            {watch('region')._id && (
                <SelectControl
                    control={control}
                    name="city"
                    arrayList={cities.map((city) => ({ value: city.name, _id: `${city.id_city}` }))}
                    label="Ciudad"
                />
            )}
            <InputControl control={control} name="bornDate" label="Fecha de Nacimiento" keyboardType="number-pad" />
            <InputControl control={control} name="email" label="Email" keyboardType="email-address" autoCapitalize='none' />
            <InputControl control={control} name="address" label="Dirección" />
            <InputControl control={control} name="phone" label="Teléfono" keyboardType="phone-pad" />
            <InputControl control={control} name="password" label="Contraseña" secureTextEntry autoCapitalize='none' />
            <InputControl control={control} name="confirmPassword" label="Confirmar contraseña" secureTextEntry autoCapitalize='none' />
            <ButtonGeneral onPress={handleSubmit((data) => console.log(data))} text="Registrarse" mode='contained' styleBtn={{ marginBottom: 28 }} />
        </LayoutAuth>
    )
}
