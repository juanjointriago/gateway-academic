import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4285F4', dark: '#4285F4' }}
      headerImage={
        <IconSymbol
          size={310}
          color="white"
          name="book.pages.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Gateway Corporation</ThemedText>
      </ThemedView>
      <ThemedText>You better Language option </ThemedText>
      <Collapsible title="Advantages ✅">
        <ThemedText>
          Gateway Corporation, has confortable rooms, professional native teachers, you learn with the better teachers in Ecuador
        </ThemedText>
        {/* <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink> */}
      </Collapsible>
      <Collapsible title="Disadvantages ❌">
        <ThemedText>
          None
        </ThemedText>
      </Collapsible>
      <Collapsible title="Prizes 🏆">
        <ThemedText>
          In the current year we gain the national prize for the best English school in Ecuador
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://gateway-english.com">
          <ThemedText type="link">Learn more...</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Our Class Rooms 🌅">
        <ThemedText>
          Visit <ThemedText type="defaultSemiBold">Our brief case</ThemedText> in {' '}
        </ThemedText>
        <ExternalLink href="https://gateway-english.com">
          <ThemedText type="link">Gateway english ... </ThemedText>
        </ExternalLink>
      </Collapsible>
      {/* <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user's current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible> */}
      {/* <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
