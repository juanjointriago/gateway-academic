
import { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ImageErrorEventData,
  ImageStyle,
  NativeSyntheticEvent,
  View,
  ViewStyle,
} from "react-native";
import { useAnimation } from "@/src/hook";

interface Props {
  uri: string;
  styleImg?: ImageStyle;
  styleContainer?: ViewStyle;
}

export const FadeInImage = ({ uri, styleContainer, styleImg }: Props) => {
  const { opacity, fadeIn } = useAnimation();
  const [isLoading, setIsLoading] = useState(true);

  const finishLoading = () => {
    setIsLoading(false);
    fadeIn();
  };

  const onError = (_: NativeSyntheticEvent<ImageErrorEventData>) => {
    setIsLoading(false);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        ...styleContainer,
      }}
    >
      {isLoading && (
        <ActivityIndicator />
      )}

      <Animated.Image
        source={{ uri }}
        onError={onError}
        onLoad={finishLoading}
        style={{
          opacity,
          ...styleImg,
        }}
        resizeMode={'contain'}
      />
    </View>
  );
};
