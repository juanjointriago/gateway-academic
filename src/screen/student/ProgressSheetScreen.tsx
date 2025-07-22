import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useEventStore } from "@/src/store/event/event.store";
import { useProgressSheetStore } from "@/src/store/progress-sheet/progress-sheet.store";
import { LayoutGeneral } from "@/src/components/layout";
import { ProgressEntry } from "@/src/interfaces/progress-sheet.interface";
import { useUserStore } from "@/src/store/users/users.store";

export const ProgressSheetScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const getEventById = useEventStore((state) => state.getEventById);
  const getUserById = useUserStore((state) => state.getUserById);
  const getAllUsers = useUserStore((state) => state.getAllUsers);
  const getProgressSheets = useProgressSheetStore((state) => state.getAllProgressSheets);

  const columns = useMemo(
    () => [
      { title: "Fecha", key: "date" as keyof ProgressEntry },
      { title: "Hora", key: "hour" as keyof ProgressEntry },
      { title: "Libro", key: "book" as keyof ProgressEntry },
      { title: "Progreso", key: "progress" as keyof ProgressEntry },
      { title: "Docente", key: "teacher" as keyof ProgressEntry },
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
  const studentProgressSheet = progressData.find(
    (sheet) => sheet.studentId === user.uid
  );

  if (!studentProgressSheet?.progressClasses?.length) {
    return (
      <LayoutGeneral title="Progreso">
        <View style={styles.centerContainer}>
          <Text>No hay registros de progreso disponibles</Text>
        </View>
      </LayoutGeneral>
    );
  }

  // Datos de contrato y estudiante
  const contractInfo = [
    { label: 'Nombre', value: studentProgressSheet.myPreferredName || user.name },
    { label: 'CI', value: user.cc || 'N/D' },
    { label: 'Contrato Nº', value: studentProgressSheet.contractNumber || 'N/D' },
    { label: 'Inscripción', value: studentProgressSheet.inscriptionDate ? new Date(studentProgressSheet.inscriptionDate).toLocaleDateString() : 'N/D' },
    { label: 'Expiración', value: studentProgressSheet.expirationDate ? new Date(studentProgressSheet.expirationDate).toLocaleDateString() : 'N/D' },
    { label: 'Teléfono', value: user.phone || 'N/D' },
    { label: 'Email', value: user.email || 'N/D' },
    { label: 'Total Pagado', value: `$${studentProgressSheet.totalPaid ?? 0}` },
    { label: 'Total Adeudado', value: `$${studentProgressSheet.totalDue ?? 0}` },
  ];

  const progressEntries: ProgressEntry[] = studentProgressSheet.studentId === user.uid
    ? studentProgressSheet.progressClasses
      .map((record) => {
        const event = getEventById(record.eventInfo.value!);
        // console.log({event})
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
      })
    : [];

  return (
    <LayoutGeneral title="Progreso" withScrollView containerStyle={styles.container}>
      {/* Tarjeta de información de contrato */}
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Información de Contrato</Text>
        <View style={styles.infoGrid}>
          {contractInfo.map((item, idx) => (
            <View key={idx} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{item.label}:</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tabla de progreso de clases */}
      <Text style={styles.sectionTitle}>Clases y Progreso</Text>
      <ScrollView style={styles.tableScroll} horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.thFixed]}>Fecha</Text>
            <Text style={[styles.th, styles.thFixed]}>Hora</Text>
            <Text style={[styles.th, styles.thWide]}>Libro</Text>
            <Text style={[styles.th, styles.thWide]}>Progreso</Text>
            <Text style={[styles.th, styles.thFixed]}>Parte</Text>
            <Text style={[styles.th, styles.thFixed]}>Test</Text>
            <Text style={[styles.th, styles.thWide]}>Docente</Text>
            <Text style={[styles.th, styles.thWider]}>Observación</Text>
          </View>
          {progressEntries.length === 0 ? (
            <Text style={{ textAlign: 'center', marginVertical: 16 }}>No hay clases registradas</Text>
          ) : (
            progressEntries.map((entry, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.td, styles.thFixed]}>{entry.date}</Text>
                <Text style={[styles.td, styles.thFixed]}>{entry.hour}</Text>
                <Text style={[styles.td, styles.thWide]}>{entry.book}</Text>
                <Text style={[styles.td, styles.thWide]}>{entry.progress}</Text>
                <Text style={[styles.td, styles.thFixed]}>{entry.part}</Text>
                <Text style={[styles.td, styles.thFixed]}>{entry.test}</Text>
                <Text style={[styles.td, styles.thWide]}>{entry.teacher}</Text>
                <Text style={[styles.td, styles.thWider]}>{entry.observation}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  cardContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4338ca',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '600',
    color: '#374151',
    fontSize: 14,
  },
  infoValue: {
    color: '#1e293b',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4338ca',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'center',
  },
  tableScroll: {
    marginBottom: 24,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableContainer: {
    minWidth: 900,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e7ff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 6,
  },
  th: {
    fontWeight: 'bold',
    color: '#3730a3',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  thFixed: {
    minWidth: 70,
    maxWidth: 90,
  },
  thWide: {
    minWidth: 120,
    maxWidth: 180,
  },
  thWider: {
    minWidth: 180,
    maxWidth: 300,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 4,
  },
  td: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});