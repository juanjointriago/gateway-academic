# SVG Components

This directory contains SVG components for the VCard redesign project.

## Components

### SvgWrapper
A wrapper component that handles platform-specific SVG rendering:
- **Native (iOS/Android)**: Uses react-native-svg
- **Web**: Renders fallback View components

### CurvedBackground
Creates curved decorative elements for the VCard design:
- Uses SVG paths for smooth curves on native platforms
- Provides CSS-based fallbacks for web platform
- Supports front/back card variants

## Usage

```tsx
import { CurvedBackground, isSvgAvailable } from '@/src/components/svg';

// Check if SVG is available
if (isSvgAvailable()) {
  // SVG is supported
}

// Use curved background
<CurvedBackground variant="front" width={260} height={400} />
```

## Platform Support

- ✅ iOS: Full SVG support via react-native-svg
- ✅ Android: Full SVG support via react-native-svg  
- ⚠️ Web: Fallback to CSS-based decorative elements

## Colors

The components use the design system colors:
- Primary Blue: `#1B365D`
- Secondary Orange: `#FF7F3F`
- Tertiary Gray: `#A8A8A8`