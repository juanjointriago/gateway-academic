import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GenericTable, LayoutGeneral, ImagePreview } from "@/src/components";
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
        width: "25%" as const,
        render: (_: any, row: fee) => (
          <Text style={{ fontWeight: 'bold', fontSize: 12 }} numberOfLines={1}>
            {row.code}
          </Text>
        ),
      },
      {
        title: "Fecha",
        key: "date" as keyof fee,
        width: "20%" as const,
        render: (_: any, row: fee) => (
          <Text style={{ fontSize: 11 }}>
            {format(new Date(row.createdAt), "dd/MM/yy")}
          </Text>
        ),
      },
      { 
        title: "Monto", 
        key: "qty" as keyof fee, 
        width: "20%" as const,
        render: (_: any, row: fee) => (
          <Text style={{ fontSize: 12, fontWeight: '600' }}>
            ${row.qty}
          </Text>
        ),
      },
      {
        title: "Comprobante",
        key: "imageUrl" as keyof fee,
        width: "25%" as const,
        render: (_: any, row: fee) => (
          <ImagePreview
            imageUri={row.imageUrl || ''}
            thumbnailStyle={styles.tableImage}
            placeholder="No disponible"
            onError={() => console.log('Error loading image for receipt:', row.code)}
          />
        ),
      },
      {
        title: "Método",
        key: "paymentMethod" as keyof fee,
        width: "10%" as const,
        render: (_: any, row: fee) => (
          <Text style={{ fontSize: 10 }} numberOfLines={1}>
            {row.paymentMethod === 'transference' ? 'Transf.' : 
             row.paymentMethod === 'tc' ? 'TC' : 
             row.paymentMethod === 'deposit' ? 'Dep.' : 'Otro'}
          </Text>
        ),
      },
    ],
    []
  );

  return (
    <LayoutGeneral title="Mis comprobantes" withScrollView={false}>
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
          <GenericTable 
            data={myFees} 
            columns={columns} 
            pageSize={8}
          />
        </View>
        
        {/* Botón flotante */}
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="plus"
          onPress={() => setModalVisible(true)}
          label="Nuevo"
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
    paddingHorizontal: 16,
  },
  topSpace: {
    height: 20,
  },
  tableContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 80, // Espacio para el FAB
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 0,
    elevation: 8,
  },
  tableImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
});
