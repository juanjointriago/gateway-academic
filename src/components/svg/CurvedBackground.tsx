import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgWrapper, Path, Circle, isSvgAvailable } from './SvgWrapper';

interface CurvedBackgroundProps {
  variant: 'front' | 'back';
  width?: number;
  height?: number;
}

const NAVY = '#1C2E82';
const NAVY_MID = '#2438A0';

export const CurvedBackground: React.FC<CurvedBackgroundProps> = ({
  variant,
  width = 260,
  height = 400,
}) => {
  const W = width;
  const H = height;

  if (!isSvgAvailable()) {
    return (
      <View style={[styles.container, { width: W, height: H }]}>
        {variant === 'front' ? (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40 }} />
        ) : (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '32%', backgroundColor: NAVY, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }} />
        )}
      </View>
    );
  }

  if (variant === 'front') {
    // White curved bottom section painted over navy card background
    const curveCenter = H * 0.37;  // white starts here at x-center
    const curveEdge   = H * 0.44;  // white starts here at x-edges

    return (
      <View style={[styles.container, { width: W, height: H }]}>
        <SvgWrapper width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Watermark concentric circles — top-right corner */}
          <Circle cx={W * 0.85} cy={H * 0.13} r={W * 0.32}
            fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.06} />
          <Circle cx={W * 0.85} cy={H * 0.13} r={W * 0.20}
            fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.07} />
          <Circle cx={W * 0.85} cy={H * 0.13} r={W * 0.09}
            fill="#fff" opacity={0.05} />

          {/* Small accent dot — bottom-left navy zone */}
          <Circle cx={W * 0.11} cy={H * 0.28} r={W * 0.055}
            fill="#fff" opacity={0.04} />

          {/* White curved bottom section (convex top edge) */}
          <Path
            d={`M 0,${curveEdge} Q ${W / 2},${curveCenter} ${W},${curveEdge} L ${W},${H} L 0,${H} Z`}
            fill="#fff"
          />

          {/* Very thin navy accent strip at bottom */}
          <Path
            d={`M 0,${H - 7} L ${W},${H - 7} L ${W},${H} L 0,${H} Z`}
            fill={NAVY_MID}
            opacity={0.35}
          />
        </SvgWrapper>
      </View>
    );
  }

  // Back variant: navy curved header on light card background
  const headerEdge   = H * 0.20;  // navy ends at edges  (matches BACK_HEADER_H)
  const headerCenter = H * 0.26;  // navy dips further at center (concave bottom)

  return (
    <View style={[styles.container, { width: W, height: H }]}>
      <SvgWrapper width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Navy curved header (concave bottom edge) */}
        <Path
          d={`M 0,0 L ${W},0 L ${W},${headerEdge} Q ${W / 2},${headerCenter} 0,${headerEdge} Z`}
          fill={NAVY}
        />

        {/* Subtle lighter stripe in header for depth */}
        <Path
          d={`M 0,0 L ${W * 0.38},0 Q ${W * 0.46},${H * 0.10} ${W * 0.14},${H * 0.22} L 0,${H * 0.18} Z`}
          fill="#fff"
          opacity={0.05}
        />

        {/* Watermark circles — top-right of header */}
        <Circle cx={W * 0.82} cy={H * 0.08} r={W * 0.22}
          fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.08} />
        <Circle cx={W * 0.82} cy={H * 0.08} r={W * 0.13}
          fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.08} />

        {/* Very thin navy accent at bottom */}
        <Path
          d={`M 0,${H - 7} L ${W},${H - 7} L ${W},${H} L 0,${H} Z`}
          fill={NAVY}
          opacity={0.10}
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
    borderRadius: 20,
    overflow: 'hidden',
  },
});
