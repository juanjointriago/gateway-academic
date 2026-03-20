import { FC, useState } from 'react';  
import { Control } from 'react-hook-form';
import { KeyboardTypeOptions, TextStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
// import { IPropsInput } from '@/src/interfaces';

export interface IPropsInput {
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
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
}

export const InputGeneric: FC<IPropsInput> = ({ secureTextEntry = false, isRequieredError = true, disabled = false, ...props }) => {
  const [hidePass, setHidePass] = useState(secureTextEntry);
  return (
    <TextInput
      label={props.label}
      value={props.value}
      onChangeText={props.onChange}
      mode="flat"
      style={props.styleInput}
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
      error={props.error}
      right={
        secureTextEntry && (
          <TextInput.Icon
            icon={hidePass ? "eye-off" : "eye"}
            onPress={() => { setHidePass(!hidePass); }}
          />
        )
      }
    />
  )
}
