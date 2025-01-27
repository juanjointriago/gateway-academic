import { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { PropsFiles } from "@/src/interfaces";
import { toast } from "@/src/helpers/toast";
import { useTheme } from "react-native-paper";

export interface IFiles {
  name: string,
  type: string,
  uri: string
}

interface Props {
  pickImage: () => Promise<PropsFiles>;
  uri?: (file: IFiles) => void;
  imageUrl?: any;
  styleImg?: ViewStyle;
  isValidate?: boolean;
}
export const ImagePicker = ({ pickImage, uri, styleImg, imageUrl, isValidate }: Props) => {

  const { colors } = useTheme();

  const [file, setFile] = useState({
    name: "",
    uri: "",
  });

  const selectImage = async () => {
    let result = await pickImage();
    if (result.error) return toast({ description: result.error, type: "danger" });

    setFile({
      name: `${result.fileName}`,
      uri: `${result.path}`,
    });
    uri &&
      uri(
        JSON.parse(
          JSON.stringify({
            uri: result.path,
            type: `image/${`${result.path}`.split(".").pop()}`,
            name: `${result.path}`.split("/").pop(),
          })
        )
      );

  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styleImg,
        { borderColor: !isValidate ? colors.primary : colors.error },
      ]}
      onPress={selectImage}
    >
      {file.uri === "" && !imageUrl ? (
        <Feather name="camera" size={40} color={!isValidate ? colors.primary : colors.error} />
      ) : (
        <Image
          source={{ uri: file.uri === "" ? imageUrl : file.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 150,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 20,
  },
});
