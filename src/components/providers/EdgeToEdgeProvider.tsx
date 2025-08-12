import React, { ReactNode } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveScreen } from '@/src/hook/useResponsiveScreen';

interface EdgeToEdgeProviderProps {
  children: ReactNode;
}

export const EdgeToEdgeProvider: React.FC<EdgeToEdgeProviderProps> = ({ children }) => {
  const { isTablet } = useResponsiveScreen();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={{ 
          flex: 1,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}>
          {children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
