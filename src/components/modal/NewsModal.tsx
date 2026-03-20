import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { INew } from "@/src/interfaces/news.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import MemoImage from "../image/MemoImage";
import { ModalGeneral } from "./ModalGeneral";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  news: INew;
}

const { width, height } = Dimensions.get("window");
const DOUBLE_TAP_DELAY = 300;

export const NewsModal: React.FC<Props> = ({ visible, onDismiss, news }) => {
  const [scale] = useState(new Animated.Value(1));
  const [translateX] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(0));
  const lastTap = useRef(0);
  const lastScale = useRef(1);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (e: GestureResponderEvent) => {
        const now = Date.now();

        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
          const newScale = lastScale.current === 1 ? 2 : 1;
          Animated.spring(scale, {
            toValue: newScale,
            useNativeDriver: true,
          }).start();

          if (newScale === 1) {
            Animated.parallel([
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
              }),
              Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
              }),
            ]).start();
          }

          lastScale.current = newScale;
        }

        lastTap.current = now;
        // Usar getValue() para obtener el valor actual
        lastX.current = (translateX as any)._value;
        lastY.current = (translateY as any)._value;
      },

      onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
        if (lastScale.current > 1) {
          // Solo permitir pan cuando está en zoom
          translateX.setValue(lastX.current + gestureState.dx);
          translateY.setValue(lastY.current + gestureState.dy);
        }
      },
    })
  ).current;

  return (
    <ModalGeneral visible={visible} onDismiss={onDismiss} snapPoint={0.85} title={news.title}>
      <View style={styles.modalContent}>
        <ScrollView
          scrollEnabled={lastScale.current === 1}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageContainer} {...panResponder.panHandlers}>
            <Animated.View
              style={[
                styles.imageWrapper,
                {
                  transform: [{ scale }, { translateX }, { translateY }],
                },
              ]}
            >
              <MemoImage imageUrl={news.imageUrl} style={styles.image} />
            </Animated.View>
          </View>

          <View style={styles.textContainer}>
            <Text variant="titleLarge" style={styles.title}>
              {news.title}
            </Text>

            <Text variant="bodySmall" style={styles.date}>
              {format(new Date(news.createdAt), "d 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
            </Text>

            <Text variant="bodyMedium" style={styles.description}>
              {news.description}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={styles.closeButton}
          >
            Cerrar
          </Button>
        </View>
      </View>
    </ModalGeneral>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width - 48,
    height: 300,
    resizeMode: "contain",
  },
  textContainer: {
    padding: 16,
    width: "100%",
    alignItems: "center",
    maxWidth: 600, // Limita el ancho máximo del texto
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  date: {
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  closeButton: {
    minWidth: 120,
  },
});
