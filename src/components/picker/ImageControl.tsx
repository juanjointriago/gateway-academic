import { FC } from "react";
import { View } from "react-native";
import { PropsFiles } from "@/src/interfaces";
import { HelperText } from "react-native-paper";
import { Control, Controller } from "react-hook-form";
import { ImagePicker } from "./ImagePicker";
import { useAlert } from "@/src/context/AlertContext";
import { pickCamera, pickImage } from "@/src/helpers/files";
interface Props {
  name: string;
  control: Control<any>;
}
export const ImageControl: FC<Props> = ({ control, name }) => {
  const { customAlert } = useAlert();

  const pickerFile = (): Promise<PropsFiles> => {
    return new Promise((resolve) => {
      customAlert({
        title: 'Seleccionar Archivo',
        message: 'Selecciona cómo deseas subir tu archivo: puedes tomar una foto directamente con la cámara o elegir un archivo desde tu galería.',
        accions: [
          {
            text: 'Cancelar',
            onPress: () => {
              resolve({ error: '', path: '', fileName: '', type: '' });
            },
          },
          {
            text: 'Abrir Camara',
            onPress: async () => {
              const photo = await pickCamera();
              resolve(photo);
            },
          },
          {
            text: 'Abrir Galeria',
            onPress: async () => {
              const image = await pickImage();
              resolve(image);
            },
          },
        ],
      });
    });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <ImagePicker
            imageUrl={value?.uri}
            pickImage={pickerFile}
            uri={(file) => { onChange(file) }}
            isValidate={Boolean((errors[name] as any)?.name?.message)}
          />
          {errors[name] && (
            <HelperText
              type="error"
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {`${(errors[name] as any).name.message}`}
            </HelperText>
          )}
        </View>
      )}
    />
  );
};
