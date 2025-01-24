import { FC, useState } from 'react'
import { Control, Controller } from 'react-hook-form';
import { PaperSelect } from 'react-native-paper-select';
import { ViewStyle } from 'react-native';
import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface';
import { HelperText, Text, useTheme } from 'react-native-paper';

interface Props {
    control: Control<any>;
    name: string;
    label?: string;
    arrayList?: ListItem[];
}

export const SelectControl: FC<Props> = ({ control, name, arrayList = [], label = '' }) => {
    const { colors } = useTheme();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, formState: { errors } }) => (
                <>
                    <PaperSelect
                        label={label}
                        value={value.value}
                        onSelection={(value) => {
                            if (!value.selectedList.length) return;
                            onChange(value.selectedList[0]);
                        }}
                        arrayList={arrayList}
                        selectedArrayList={[value]}
                        multiEnable={false}
                        textInputMode="outlined"
                        searchText={`Buscar ${label}`}
                        searchStyle={{ fontSize: 12 }}
                        dialogTitleStyle={{ fontSize: 18 }}
                        selectAllText='Seleccionar todo'
                        dialogCloseButtonText='Cerrar'
                        dialogDoneButtonText='Aceptar'
                        checkboxProps={{
                            checkboxLabelStyle: { fontSize: 14 },
                        }}
                        textInputOutlineStyle={{
                            borderColor: errors[name] ? colors.error : 'gray',
                            borderWidth: errors[name] ? 2 : 1,
                            borderRadius: 5,
                        }}
                        textInputStyle={{
                            fontSize: 14,
                        }}
                    />
                    {errors[name] && (
                        <HelperText
                            type="error"
                            style={{
                                marginTop: -13,
                                fontSize: 11,
                            }}
                        >
                            {`${(errors[name] as any)?._id?.message}`}
                        </HelperText>
                    )}
                </>
            )}
        />
    )
}
