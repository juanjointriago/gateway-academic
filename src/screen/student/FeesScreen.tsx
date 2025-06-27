import { useMemo, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { GenericTable, LayoutGeneral } from "@/src/components";
import { fee } from "@/src/interfaces/fees.interface";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useFeesStore } from "@/src/store/fees/fees.store";
import { format } from "date-fns";
import { FAB, Modal, Portal, Text, useTheme } from "react-native-paper";
import { AddFeeForm } from "@/src/components/forms/AddFeeForm";

export const FeesScreen = () => {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const fees = useFeesStore((state) => state.fees);
  const createFee = useFeesStore((state) => state.createFee);
  
  // Estados para UI
  const [modalVisible, setModalVisible] = useState(false);
  
  // Filtrar pagos del usuario actual
  const myFees = useMemo(
    () => fees.filter((fee) => fee.studentUid === user?.uid),
    [fees, user]
  );

  // Función para crear un nuevo pago
  const handleCreateFee = async (feeData: fee) => {
    try {
      await createFee({
        ...feeData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setModalVisible(false);
    } catch (error) {
      console.error('Error al registrar pago:', error);
      throw error;
    }
  };

  // Columnas para la tabla
  const columns = useMemo(
    () => [
      {
        title: "Recibo",
        key: "code" as keyof fee,
        render: (_: any, row: fee) => (
          <Text style={{ fontWeight: 'bold' }}>{row.code}</Text>
        ),
      },
      {
        title: "Fecha",
        key: "date" as keyof fee,
        render: (_: any, row: fee) => (
          <Text>{format(new Date(row.createdAt), "dd/MM/yyyy")}</Text>
        ),
      },
      { title: "Cantidad", key: "qty" as keyof fee },
      {
        title: "Comprobante",
        key: "imageUrl" as keyof fee,
        render: (_: any, row: fee) => (
          row.imageUrl ? (
            <Image source={{ uri: row.imageUrl }} style={styles.tableImage} />
          ) : (
            <Text style={styles.noImage}>No disponible</Text>
          )
        ),
      },
    ],
    []
  );

  return (
    <LayoutGeneral title="Mis comprobantes" withScrollView>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <AddFeeForm 
              user={user}
              onSubmit={handleCreateFee}
              onCancel={() => setModalVisible(false)}
            />
          </Modal>
        </Portal>
        
        {/* Espacio superior para el FAB */}
        <View style={styles.topSpace} />
        
        {/* Tabla de pagos */}
        <View style={styles.tableContainer}>
          <GenericTable data={myFees} columns={columns} />
        </View>
        
        {/* Botón flotante */}
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </LayoutGeneral>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 70,
  },
  topSpace: {
    height: 20,
  },
  tableContainer: {
    flex: 1,
    paddingTop: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 0,
  },
  tableImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  noImage: {
    color: '#999',
    fontSize: 12,
  },
});
