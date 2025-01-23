import { FC } from 'react'
import { Control, Controller } from 'react-hook-form';
import { PaperSelect } from 'react-native-paper-select';
import { ViewStyle } from 'react-native';
import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface';
import { HelperText } from 'react-native-paper';

interface Props {
    control: Control<any>;
    name: string;
    label?: string;
    arrayList?: ListItem[];
    style?: ViewStyle
}

export const SelectControl: FC<Props> = ({ control, name, arrayList = [], label = '', style }) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, formState: { errors } }) => (
                <>
                    <PaperSelect
                        label={label}
                        value={value.value}
                        onSelection={(value) => {
                            onChange(value.selectedList);
                        }}
                        arrayList={arrayList}
                        selectedArrayList={value}
                        multiEnable={true}
                        textInputMode="flat"
                    />
                </>
            )}
        />
    )
}
