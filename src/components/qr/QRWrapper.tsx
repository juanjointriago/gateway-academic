import React from 'react';
import { Platform, View, Text } from 'react-native';

// Conditional import for QR code
let QRCode: any;

if (Platform.OS !== 'web') {
  try {
    QRCode = require('react-native-qrcode-svg').default;
  } catch (error) {
    console.warn('react-native-qrcode-svg not available:', error);
  }
}

interface QRWrapperProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

export const QRWrapper: React.FC<QRWrapperProps> = ({ 
  value, 
  size = 50, 
  color = '#000000', 
  backgroundColor = 'white',
  style 
}) => {
  // Fallback for web or when QR is not available
  if (Platform.OS === 'web' || !QRCode) {
    return (
      <View 
        style={[
          {
            width: size,
            height: size,
            backgroundColor,
            borderWidth: 1,
            borderColor: color,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
          },
          style
        ]}
      >
        <Text style={{ fontSize: 8, color, textAlign: 'center' }}>QR</Text>
      </View>
    );
  }

  return (
    <QRCode
      value={value}
      size={size}
      color={color}
      backgroundColor={backgroundColor}
      style={style}
    />
  );
};

// Helper function to check if QR is available
export const isQRAvailable = () => {
  return Platform.OS !== 'web' && !!QRCode;
};