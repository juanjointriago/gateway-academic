import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ScreenData {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  isLargeScreen: boolean;
}

export const useResponsiveScreen = (): ScreenData => {
  const [screenData, setScreenData] = useState<ScreenData>(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      isLandscape: width > height,
      isTablet: Math.min(width, height) >= 600,
      isLargeScreen: Math.min(width, height) >= 768,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      const { width, height } = window;
      setScreenData({
        width,
        height,
        isLandscape: width > height,
        isTablet: Math.min(width, height) >= 600,
        isLargeScreen: Math.min(width, height) >= 768,
      });
    });

    return () => subscription?.remove();
  }, []);

  return screenData;
};
