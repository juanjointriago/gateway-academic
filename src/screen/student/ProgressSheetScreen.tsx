import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useEventStore } from "@/src/store/event/event.store";
import { useProgressSheetStore } from "@/src/store/progress-sheet/progress-sheet.store";
import { LayoutGeneral } from "@/src/components/layout";
import { ProgressEntry } from "@/src/interfaces/progress-sheet.interface";
import { useUserStore } from "@/src/store/users/users.store";
import { GenericTable } from "@/src/components";

export const ProgressSheetScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const getEventById = useEventStore((state) => state.getEventById);
  const getUserById = useUserStore((state) => state.getUserById);
  const getAllUsers = useUserStore((state) => state.getAllUsers);
  const getProgressSheets = useProgressSheetStore((state) => state.getAllProgressSheets);

  const columns = useMemo(
    () => [
      { title: "Nombre", key: "name" as keyof ProgressEntry },
      { title: "Fecha", key: "date" as keyof ProgressEntry },
      { title: "Hora", key: "hour" as keyof ProgressEntry },
      { title: "Libro", key: "book" as keyof ProgressEntry },
      { title: "Progreso", key: "progress" as keyof ProgressEntry },
      { title: "Parte", key: "part" as keyof ProgressEntry },
      { title: "Examen", key: "test" as keyof ProgressEntry },
      { title: "Docente", key: "teacher" as keyof ProgressEntry },
      { title: "Observación", key: "observation" as keyof ProgressEntry }
    ],
    []
  );
   const loadData = async () => {
      try {
        setIsLoading(true);
        console.debug('Loading data...');
        getAllUsers(); 
        getProgressSheets();
        console.debug('Data loaded successfully');
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };


  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4338ca" />
        <Text>Cargando información...</Text>
      </View>
    );
  }

  if (!user?.uid) {
    console.debug('No user found');
    return (
      <View style={styles.centerContainer}>
        <Text>Usuario no encontrado</Text>
      </View>
    );
  }

  const progressData = useProgressSheetStore.getState().progressSheets;
  console.debug('Progress data:', progressData);

  const studentProgressSheet = progressData.find(
    (sheet) => sheet.studentId === user.uid
  );

  if (!studentProgressSheet?.progressClasses?.length) {
    console.debug('No progress sheets found for student:', user.uid);
    return (
      <LayoutGeneral title="Progreso">
        <View style={styles.centerContainer}>
          <Text>No hay registros de progreso disponibles</Text>
        </View>
      </LayoutGeneral>
    );
  }

  const progressEntries: ProgressEntry[] = studentProgressSheet.studentId === user.uid
    ? studentProgressSheet.progressClasses
    .map((record) => {
      const event = getEventById(record.eventInfo?.value || '');
      // console.debug('Event:', event);
      const teacher = event && event.teacher && getUserById(event.teacher);
      return {
        ...record,
        name: record.book || 'Sin nombre',
        teacher: teacher ? teacher?.name : "Sin docente",
        date: new Date(record.createdAt || Date.now()).toLocaleDateString(),
        hour: new Date(record.createdAt || Date.now()).toLocaleTimeString(),
      };
    })
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }):[];

  return (
    <LayoutGeneral title="Progreso">
      <View style={styles.container}>
        <GenericTable 
          data={progressEntries} 
          columns={columns }
        />
      </View>
    </LayoutGeneral>
  );
};

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
});