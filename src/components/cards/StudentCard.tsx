import { theme } from "@/app/theme/theme";
import { LOGO_URL } from "@/src/constants/Constants";
import { IUser } from "@/src/interfaces";
import { progressSheetInterface } from "@/src/interfaces/progress-sheet.interface";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { FC } from "react";
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  SafeAreaView,
} from "react-native";
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
  user: IUser;
}) => {
  return (
    <View style={regularContentStyles.card}>
      <Card.Content style={{ gap: 0 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Card.Cover
            source={{ uri: LOGO_URL }}
            style={{
              top: 30,
              right: 10,
              width: 100,
              height: 50,
              objectFit: "cover",
              alignSelf: "flex-start",
            }}
          />
          <Card.Cover
            source={{ uri: user?.photoUrl }}
            style={{
              height: 100,
              width: 100,
              borderRadius: 100,
              alignSelf: "flex-end",
            }}
          />
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Title>HeadeLine: </Title>
          <Paragraph> {user?.name}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>Id: </Paragraph>
          <Paragraph> {user?.cc}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>Inscription Date: </Paragraph>
          <Paragraph> {student?.createdAt}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>Expiration Date: </Paragraph>
          <Paragraph> {student.updatedAt ?? "--/--/--"}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>My BornDate is: </Paragraph>
          <Paragraph> {user?.bornDate}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>My Age is: </Paragraph>
          <Paragraph> {user?.bornDate}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>Reg Number: </Paragraph>
          <Paragraph> {user?.cc}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>Other Contacts: </Paragraph>
          <Paragraph> {user?.phone}</Paragraph>
        </View>
        <View style={cardStudentStyles.titleContainer}>
          <Paragraph>Observations: </Paragraph>
          <Paragraph> {"-----------"}</Paragraph>
        </View>
      </Card.Content>
    </View>
  );
};
const cardStudentStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const FlippedContent = ({
  student,
  user,
}: {
  student: progressSheetInterface;
  user: IUser;
}) => {
  return (
    <View style={flippedContentStyles.card}>
      <Card.Content>
        <Card.Cover
          source={{ uri: LOGO_URL }}
          style={{ bottom: 50, width: 150, height: 75, alignSelf: "center" }}
        />
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
          {user && (
            <FlipCard
              isFlipped={isFlipped}
              cardStyle={styles.flipCard}
              FlippedContent={<FlippedContent student={student} user={user} />}
              RegularContent={<RegularContent student={student} user={user} />}
            />
          )}
        </View>
        <FAB style={styles.fab} icon="swap-horizontal" onPress={handleFlip} />
      </View>
    </>
  );
};

const regularContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    // backgroundColor: theme,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderColor: theme.colors.lightPrimary,
    borderWidth: 1,
  },
  text: {
    color: "#001a72",
  },
});

const flippedContentStyles = StyleSheet.create({
  card: {
    flex: 1,
    // backgroundColor: "#baeee5",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderColor: theme.colors.lightPrimary,
    borderWidth: 1,
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
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  cardWrapper: {
    width: "90%", // o usa '90%' para responsivo
    height: "100%",
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
    left: 5,
    top: 5,
  },
});
