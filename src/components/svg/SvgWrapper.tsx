import React from 'react';
import { Platform, View } from 'react-native';

// Conditional import for SVG components
let Svg: any, Circle: any, Path: any, Defs: any, LinearGradient: any, Stop: any;

if (Platform.OS !== 'web') {
  try {
    const SvgModule = require('react-native-svg');
    Svg = SvgModule.default || SvgModule.Svg;
    Circle = SvgModule.Circle;
    Path = SvgModule.Path;
    Defs = SvgModule.Defs;
    LinearGradient = SvgModule.LinearGradient;
    Stop = SvgModule.Stop;
  } catch (error) {
    console.warn('react-native-svg not available:', error);
  }
}

interface SvgWrapperProps {
  width: number;
  height: number;
  viewBox: string;
  children: React.ReactNode;
  style?: any;
}

export const SvgWrapper: React.FC<SvgWrapperProps> = ({ 
  width, 
  height, 
  viewBox, 
  children, 
  style 
}) => {
  // Fallback for web or when SVG is not available
  if (Platform.OS === 'web' || !Svg) {
    return (
      <View 
        style={[
          {
            width,
            height,
            backgroundColor: 'transparent',
          },
          style
        ]}
      />
    );
  }

  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox={viewBox}
      style={style}
    >
      {children}
    </Svg>
  );
};

// Export SVG components with fallbacks
export { 
  Svg, 
  Circle, 
  Path, 
  Defs, 
  LinearGradient, 
  Stop 
};

// Helper function to check if SVG is available
export const isSvgAvailable = () => {
  return Platform.OS !== 'web' && !!Svg;
};