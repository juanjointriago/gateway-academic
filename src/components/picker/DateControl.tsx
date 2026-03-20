import { useDisclosure } from '@/src/hook';
import { FC } from 'react'
import { Control, Controller } from 'react-hook-form';
import { TextStyle } from 'react-native';
import { HelperText } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

interface Props {
  control: Control<any>;
  name: string;
  label?: string;
  styleInput?: TextStyle;
}

export const DateControl: FC<Props> = ({ control, name, label, styleInput }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <>
          <DatePickerInput
            inputMode='start'
            locale='es'
            onChange={onChange}
            value={value}
            label={label}
            mode='outlined'
            disableFullscreenUI
            error={!!errors[name]}
            style={{
              ...styleInput,
              marginBottom: !!errors[name] ? 2 : 16,
              fontSize: 14,
              height: 45,
            }}
            contentStyle={{
              fontSize: 14,
            }}
            hasError={!!errors[name]}
          />
          {errors[name] && (
            <HelperText
              type="error"
              style={{
                marginTop: -3,
                fontSize: 11,
              }}
            >
              {`${errors[name]?.message}`}
            </HelperText>
          )}
        </>
      )}
    />
  )

}
