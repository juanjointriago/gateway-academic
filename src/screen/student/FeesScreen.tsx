import { GenericTable, LabelGeneral, LayoutGeneral } from "@/src/components";
import { fee } from "@/src/interfaces/fees.interface";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useFeesStore } from "@/src/store/fees/fees.store";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Image, View } from "react-native";
import {
  Button,
  FAB,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

export const FeesScreen = () => {
  const user = useAuthStore((state) => state.user);
  const fees = useFeesStore((state) => state.fees);
  const createFee = useFeesStore((state) => state.createFee);
  const myFees = useMemo(
    () => fees.filter((fee) => fee.studentUid === user?.uid),
    [fees]
  );
  const columns = useMemo(
    () => [
      {
        title: "Fecha",
        key: "date" as keyof fee,
        render: (_: any, row: fee) => (
          <LabelGeneral
            label={format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")}
            variant="bodySmall"
            styleProps={{ fontSize: 12, padding: 5 }}
          />
        ),
      },
      { title: "Razon", key: "reason" as keyof fee },
      { title: "Método de pago", key: "paymentMethod" as keyof fee },
      { title: "Cantidad", key: "qty" as keyof fee },
      { title: "Razon", key: "reason" as keyof fee },
      {
        title: "Img",
        key: "imageUrl" as keyof fee,
        render: (_: any, row: fee) => (
          <Image
            source={{ uri: row.imageUrl }}
            style={{ width: 100, height: 100 }}
          />
        ),
      },
    ],
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [qty, setQty] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleRegisterFee = async () => {
    if (!user) return;
    await createFee({
      qty: Number(qty),
      reason,
      paymentMethod: paymentMethod as any,
      isSigned: false,
      cc: user.cc,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      customerName: user.name,
      uid: user.uid,
      studentUid: user.uid,
    });
    setModalVisible(false);
    setReason("");
    setQty("");
    setPaymentMethod("cash");
  };

  return (
    <LayoutGeneral title="Mis pagos" withScrollView>
      <View>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 20,
              margin: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
              Registrar nuevo pago
            </Text>
            <TextInput
              label="Razón"
              value={reason}
              onChangeText={setReason}
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Cantidad"
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Método de pago"
              value={paymentMethod}
              onChangeText={setPaymentMethod}
              style={{ marginBottom: 10 }}
            />
            <Button
              mode="contained"
              onPress={handleRegisterFee}
              style={{ marginTop: 10 }}
            >
              Registrar
            </Button>
            <Button
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 10 }}
            >
              Cancelar
            </Button>
          </Modal>
        </Portal>
        <View style={{ flex: 1, paddingTop: 70 }}>
          <GenericTable data={myFees} columns={columns} />
        </View>
        <FAB
          style={{ position: "absolute" }}
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </LayoutGeneral>
  );
};
