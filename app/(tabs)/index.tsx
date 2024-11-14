import { Image, StyleSheet, Platform, Button } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ExternalLink } from "@/components/ExternalLink";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router =  useRouter();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFF", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/gateway-english-iba.appspot.com/o/gateway-assets%2Flogo.png?alt=media&token=1402510d-7ad8-4831-a20e-727191800fcd",
          }}
          style={styles.logo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Sig-Up/In</ThemedText>
        <ThemedText>
          If you are signed student, you can continue with the login button, if
          you are not a student yet, you can register with the register button
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          When you have your credentials, you can explore the different options
          like classes, reservations, and more
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Button title="Sign Up ↑" onPress={() => {
          console.log("Register")}} />
        <Button title="Sign In →" onPress={() => {
          router.navigate('/sign_in');
          console.log("Sign In")}} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logo: {
    height: 178,
    width: 350,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
