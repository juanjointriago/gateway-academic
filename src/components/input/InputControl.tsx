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
  isRequieredError?: boolean;
  disabled?: boolean;
  onBlur?: () => void
}

export const InputControl: FC<Props> = ({ secureTextEntry = false, isRequieredError = true, disabled = false, ...props }) => {
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
              width: "100%",
              marginBottom: !!errors[props.name] ? 0 : 16,
              fontFamily: "PoppinsRegular",
              fontSize: 14,
            }}
            theme={{
              fonts: {
                bodyLarge: {
                  fontFamily: "PoppinsRegular",
                  fontWeight: "400",
                },
                bodyMedium: {
                  fontFamily: "PoppinsRegular",
                  fontWeight: "400",
                },
                bodySmall: {
                  fontFamily: "PoppinsRegular",
                  fontWeight: "400",
                },
              }
            }}
            keyboardType={props.keyboardType}
            autoCapitalize={props.autoCapitalize}
            editable={props.editable}
            multiline={props.multiline}
            numberOfLines={props.numberOfLines}
            secureTextEntry={hidePass}
            contentStyle={{
              fontFamily: "PoppinsRegular",
              fontSize: 14,
            }}
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
                  onPress={() => { setHidePass(!hidePass); Keyboard.dismiss(); }}
                />
              )
            }
          />
          {isRequieredError && (
            <View style={{ width: "100%" }}>
              {errors[props.name] && (
                <HelperText
                  type="error"
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {`${errors[props.name]?.message}`}
                </HelperText>
              )}
            </View>
          )}
        </Fragment>
      )}
    />
  )
}
