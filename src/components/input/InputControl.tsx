import { FC, Fragment, useState } from 'react'
import { Control, Controller } from 'react-hook-form';
import { Keyboard, KeyboardTypeOptions, TextStyle, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

interface Props {
  label: string;
  name: string;
  defaultValue?: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  control: Control<any, any>;
  maxLength?: number;
  styleInput?: TextStyle;
  disabled?: boolean;
  onBlur?: () => void
}

export const InputControl: FC<Props> = ({ secureTextEntry = false, disabled = false, ...props }) => {
  const [hidePass, setHidePass] = useState(secureTextEntry);
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={{
        required: true,
      }}
      render={({
        field: { onChange, onBlur, value },
        formState: { errors },
      }) => (
        <Fragment>
          <TextInput
            label={props.label}
            value={value}
            onChangeText={onChange}
            mode="outlined"
            style={{
              ...props.styleInput,
              marginBottom: !!errors[props.name] ? 2 : 16,
              fontSize: 14,
              height: 45,
            }}
            contentStyle={{
              fontSize: 14,
            }}
            keyboardType={props.keyboardType}
            autoCapitalize={props.autoCapitalize}
            editable={props.editable}
            multiline={props.multiline}
            numberOfLines={props.numberOfLines}
            secureTextEntry={hidePass}
            disabled={disabled}
            defaultValue={props.defaultValue}
            maxLength={props.maxLength}
            autoComplete="off"
            onBlur={onBlur || props.onBlur}
            error={!!errors[props.name]}
            right={
              secureTextEntry && (
                <TextInput.Icon
                  icon={hidePass ? "eye-off" : "eye"}
                  onPress={() => { setHidePass(!hidePass) }}
                />
              )
            }
          />
          <View style={{ width: "100%" }}>
            {errors[props.name] && (
              <HelperText
                type="error"
                style={{
                  marginTop: -3,
                  fontSize: 11,
                }}
              >
                {`${errors[props.name]?.message}`}
              </HelperText>
            )}
          </View>
        </Fragment>
      )}
    />
  )
}
