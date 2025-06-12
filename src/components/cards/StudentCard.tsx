import { IUser } from "@/src/interfaces";
import { progressSheetInterface } from "@/src/interfaces/progress-sheet.interface";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { FC } from "react";
import { StyleSheet, View, Text, StyleProp, ViewStyle, SafeAreaView } from "react-native";
import { Card, Paragraph, Title, FAB } from "react-native-paper";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  student: progressSheetInterface;
}

const RegularContent = ({
  student,
  user,
}: {
  student: progressSheetInterface;
  user: any;
}) => {
  return (
    <View style={regularContentStyles.card}>
      <Card.Content>
        <Card.Cover source={{ uri: user?.photoUrl }} />
        <Title>HeadeLine: {user?.name}</Title>
        <Paragraph>Phone: {user?.phone}</Paragraph>
        <Paragraph>Registrado el: {student.createdAt}</Paragraph>
      </Card.Content>
    </View>
  );
};

const FlippedContent = ({ student, user }: { student: progressSheetInterface, user: IUser }) => {
  return (
    <View style={flippedContentStyles.card}>
      <Card.Content>
        <Title>Preferred Information</Title>
        <Paragraph>Preferred Name: {student.myPreferredName}</Paragraph>
        <Paragraph>Ocupation: {student.studentId}</Paragraph>
        <Paragraph>Phone: {user?.phone}</Paragraph>
      </Card.Content>
    </View>
  );
};
interface FlipCardProps {
  isFlipped: SharedValue<boolean>;
  cardStyle: StyleProp<ViewStyle>;
  direction?: "x" | "y";
  duration?: number;
  RegularContent: React.ReactNode;
  FlippedContent: React.ReactNode;
}
const FlipCard = ({
  isFlipped,
  cardStyle,
  direction = "y",
  duration = 500,
  RegularContent,
  FlippedContent,
}: FlipCardProps) => {
  const isDirectionX = direction === "x";

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View
        style={[
          flipCardStyles.regularCard,
          cardStyle,
          regularCardAnimatedStyle,
        ]}
      >
        {RegularContent}
      </Animated.View>
      <Animated.View
        style={[
          flipCardStyles.flippedCard,
          cardStyle,
          flippedCardAnimatedStyle,
        ]}
      >
        {FlippedContent}
      </Animated.View>
    </SafeAreaView>
  );
};

export const StudentCard: FC<Props> = ({ student }) => {
  const isFlipped = useSharedValue(false);
  const user = useAuthStore((state) => state.user);

  const handleFlip = () => {
    isFlipped.value = !isFlipped.value;
  };

  return (
    <>
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        {user && <FlipCard
          isFlipped={isFlipped}
          cardStyle={styles.flipCard}
          FlippedContent={<FlippedContent student={student} user={user} />}
          RegularContent={<RegularContent student={student} user={user} />}
        />}
      </View>
    </View>
      <FAB
        style={styles.fab}
        icon="swap-horizontal"
        onPress={handleFlip}
        label={isFlipped.value ? "Preferred" : "Student"}
      />
    </>

  );
};

const regularContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#b6cff7",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#001a72",
  },
});

const flippedContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#baeee5",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#001a72",
  },
});

const flipCardStyles = StyleSheet.create({
  regularCard: {
    position: "absolute",
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // Centra el wrapper de la tarjeta
    justifyContent: "center",
    paddingVertical: 24,
  },
  cardWrapper: {
    paddingTop: 20,
    width: '90%', // o usa '90%' para responsivo
    height: 380,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Para posicionar el FAB dentro del wrapper
  },
  flipCard: {
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 16,
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    right: 16,
    top: 0,
  },
});
