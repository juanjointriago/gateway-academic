import { progressSheetInterface } from "@/src/interfaces/progress-sheet.interface";
import { FC } from "react";
import { StyleSheet } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";
interface Props {
    student:progressSheetInterface
}

export const StudentCard:FC<Props> = ({ student }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{student.myPreferredName}</Title>
        <Paragraph>ID: {student.studentId}</Paragraph>
        <Paragraph>Registrado el: {student.createdAt}</Paragraph>
      </Card.Content>
    </Card>
  );


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    card: {
      marginBottom: 16,
      backgroundColor: "#f8f9fa",
    },
  });