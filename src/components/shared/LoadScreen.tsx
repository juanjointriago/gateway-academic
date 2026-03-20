import { TextStyle, View, ViewStyle } from 'react-native';
import LottieView from "lottie-react-native";
import { stylesGlobal } from "@/theme/Styles";

import loading from '../../assets/lotties/loadInit.json';
import { FC } from 'react';
import { LabelGeneral } from '../labels';
import { useTheme } from 'react-native-paper';

interface Props {
  message?: string;
  contentStyle?: ViewStyle;
  textStyle?: TextStyle;
  size?: number;
  backgroundColor?: string;
}
export const LoadScreen: FC<Props> = ({ message = '', contentStyle, textStyle, size = 240, backgroundColor }) => {
  const { colors } = useTheme();
  return (
    <View style={{ ...stylesGlobal.spinnerView, backgroundColor: backgroundColor || colors.background, padding: 20, ...contentStyle }}>
      <LottieView
        source={loading}
        autoPlay
        loop
        style={{ height: size, width: size }}
      />
      <LabelGeneral label={message} styleProps={textStyle} variant='titleSmall' />
    </View>
  );
};
