import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SvgWrapper, Path, isSvgAvailable } from './SvgWrapper';

interface CurvedBackgroundProps {
  variant: 'front' | 'back';
  width?: number;
  height?: number;
}

export const CurvedBackground: React.FC<CurvedBackgroundProps> = ({ 
  variant, 
  width = 260, 
  height = 400 
}) => {
  // Colors based on design requirements
  const colors = {
    blue: '#1B365D',
    orange: '#FF7F3F', 
    gray: '#A8A8A8'
  };

  // If SVG is not available (web), render fallback decorative elements
  if (!isSvgAvailable()) {
    return (
      <View style={[styles.fallbackContainer, { width, height }]}>
        <View style={[styles.fallbackCurve, styles.topCurve, { backgroundColor: colors.blue }]} />
        <View style={[styles.fallbackCurve, styles.bottomCurve, { backgroundColor: colors.orange }]} />
      </View>
    );
  }

  if (variant === 'back') {
    return (
      <View style={[styles.container, { width, height }]}>
        {/* Top curved elements for back */}
        <SvgWrapper
          width={width}
          height={80}
          viewBox={`0 0 ${width} 80`}
          style={styles.topSvg}
        >
          <Path
            d={`M0,0 L${width},0 L${width},40 Q${width/2},70 0,40 Z`}
            fill={colors.blue}
          />
          <Path
            d={`M0,20 Q${width/2},50 ${width},20 L${width},60 Q${width/2},80 0,60 Z`}
            fill={colors.orange}
            opacity={0.8}
          />
          <Path
            d={`M20,10 Q${width/2},40 ${width-20},10 L${width-20},50 Q${width/2},70 20,50 Z`}
            fill={colors.gray}
            opacity={0.4}
          />
        </SvgWrapper>

        {/* Bottom curved elements for back */}
        <SvgWrapper
          width={width}
          height={80}
          viewBox={`0 0 ${width} 80`}
          style={styles.bottomSvg}
        >
          <Path
            d={`M0,40 Q${width/2},10 ${width},40 L${width},80 L0,80 Z`}
            fill={colors.orange}
          />
          <Path
            d={`M0,20 Q${width/2},0 ${width},20 Q${width/2},50 0,50 Z`}
            fill={colors.blue}
            opacity={0.6}
          />
          <Path
            d={`M20,30 Q${width/2},5 ${width-20},30 Q${width/2},60 20,60 Z`}
            fill={colors.gray}
            opacity={0.4}
          />
        </SvgWrapper>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Top curved elements for front */}
      <SvgWrapper
        width={width}
        height={80}
        viewBox={`0 0 ${width} 80`}
        style={styles.topSvg}
      >
        <Path
          d={`M0,0 L${width},0 L${width},40 Q${width/2},70 0,40 Z`}
          fill={colors.blue}
        />
        <Path
          d={`M0,20 Q${width/2},50 ${width},20 L${width},60 Q${width/2},80 0,60 Z`}
          fill={colors.orange}
          opacity={0.8}
        />
      </SvgWrapper>

      {/* Bottom curved elements for front */}
      <SvgWrapper
        width={width}
        height={80}
        viewBox={`0 0 ${width} 80`}
        style={styles.bottomSvg}
      >
        <Path
          d={`M0,40 Q${width/2},10 ${width},40 L${width},80 L0,80 Z`}
          fill={colors.gray}
        />
        <Path
          d={`M0,20 Q${width/2},0 ${width},20 Q${width/2},50 0,50 Z`}
          fill={colors.blue}
          opacity={0.6}
        />
      </SvgWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  topSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  // Fallback styles for web
  fallbackContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  fallbackCurve: {
    position: 'absolute',
    width: '100%',
    height: 60,
    borderRadius: 30,
  },
  topCurve: {
    top: -30,
    transform: [{ scaleY: 0.5 }],
  },
  bottomCurve: {
    bottom: -30,
    transform: [{ scaleY: 0.5 }],
  },
});