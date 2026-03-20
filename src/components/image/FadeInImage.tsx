import { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ImageStyle,
  View,
  ViewStyle,
} from "react-native";
import { useAnimation } from "@/src/hook";

interface Props {
  uri?: string;
  styleImg?: ImageStyle;
  styleContainer?: ViewStyle;
}

export const FadeInImage = ({ 
  uri, 
  styleContainer, 
  styleImg,
}: Props) => {
  const { opacity, fadeIn } = useAnimation();
  const [isLoading, setIsLoading] = useState(true);

  const localLogo = require('../../assets/img/logo.png');

  const onLoad = () => {
    setIsLoading(false);
    fadeIn();
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
        <ActivityIndicator 
          size="large" 
          color="#4338ca"
          style={{ position: 'absolute' }} 
        />
      )}

      <Animated.Image
        source={uri ? { uri } : localLogo}
        onError={() => {
          setIsLoading(false);
          // Si falla la carga de la URL, usa el logo local
          return <Animated.Image 
            source={localLogo}
            style={{
              width: styleImg?.width || 200,
              height: styleImg?.height || 200,
              opacity,
              ...styleImg,
            }}
            resizeMode="contain"
            onLoad={onLoad}
          />;
        }}
        onLoad={onLoad}
        style={{
          width: styleImg?.width || 200,
          height: styleImg?.height || 200,
          opacity,
          ...styleImg,
        }}
        resizeMode="contain"
      />
    </View>
  );
};
