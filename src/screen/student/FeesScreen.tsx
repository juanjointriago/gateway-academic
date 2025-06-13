import  {  useMemo, useState } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import { GenericTable, LayoutGeneral } from "@/src/components";
import { fee, paymentMethod } from "@/src/interfaces/fees.interface";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useFeesStore } from "@/src/store/fees/fees.store";
import { format } from "date-fns";
import {
  Button, FAB, Modal, Portal, Text, TextInput,
 HelperText, TouchableRipple, useTheme, List
} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { UserService } from "@/src/services";
import { useForm, Controller } from "react-hook-form";
import { generateInvoiceNumber } from "@/src/helpers/invoice.helper";

// Opciones de métodos de pago
interface PaymentMethod {
  value: paymentMethod;
  label: string;
}
const PAYMENT_METHODS:PaymentMethod[] = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transference', label: 'Transferencia Bancaria' },
  { value: 'tc', label: 'Tarjeta de Crédito' },
  { value: 'deposit', label: 'Despósito' },
];

// Opciones de razones de pago
const PAYMENT_REASONS = [
  { value: 'Abono mensualidad', label: 'Abono mensualidad' },
  { value: 'Pago mensualidad', label: 'Pago mensualidad' },
  { value: 'Pago total programa de inglés', label: 'Pago total programa de inglés' },
  { value: 'Materiales', label: 'Materiales' }
];

export const FeesScreen = () => {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const fees = useFeesStore((state) => state.fees);
  const createFee = useFeesStore((state) => state.createFee);
  
  // Estados para UI
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethodMenuVisible, setPaymentMethodMenuVisible] = useState(false);
  const [reasonMenuVisible, setReasonMenuVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  // Generar código de recibo
  const receiptCode = useMemo(() => generateInvoiceNumber(), [modalVisible]);
  
  // Filtrar pagos del usuario actual
  const myFees = useMemo(
    () => fees.filter((fee) => fee.studentUid === user?.uid),
    [fees, user]
  );

  // Configuración de react-hook-form
  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    reset,
    setValue
  } = useForm<fee>({
    defaultValues: {
      studentUid: user?.uid || '',
      qty: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      code: receiptCode,
      isActive: true,
      isSigned: false,
      reason: '',
      paymentMethod: 'cash',
      customerName: user?.name || '',
      uid: user?.uid || '',
      cc: user?.cc || '',
    }
  });

  // Observar método de pago para mostrar/ocultar campos adicionales
  const paymentMethod = watch('paymentMethod');

  // Función para seleccionar imagen
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Modificar la función onSubmit para manejar los undefined
  const onSubmit = async (data: fee) => {
    try {
      setIsSubmitting(true);
      
      // Preparar objeto de datos limpio (sin undefined)
      const cleanData: any = { ...data };
      
      // Convertir todos los undefined a null
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === undefined) {
          cleanData[key] = null;
        }
      });
      
      let downloadURL = null;
      
      // Solo subir imagen si no es pago en efectivo
      if (data.paymentMethod !== 'cash' && image) {
        try {
          const imagePath = `fees/${user?.uid}_${Date.now()}`;
          downloadURL = await UserService.uploadFile(
            image.uri,
            imagePath,
            image.type || 'image/jpeg'
          );
        } catch (uploadError) {
          console.error('Error subiendo imagen:', uploadError);
          // Continuar sin imagen si falla la subida
        }
      }
      
      // Crear pago con todos los datos
      await createFee({
        ...cleanData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        code: receiptCode,
        imageUrl: downloadURL,
        // Si docNumber no existe y no es efectivo, asignar string vacío
        docNumber: data.paymentMethod !== 'cash' && !cleanData.docNumber ? '' : (cleanData.docNumber || null)
      });
      
      // Reiniciar formulario y cerrar modal
      resetForm();
      setModalVisible(false);
      
    } catch (error) {
      console.error('Error al registrar pago:', error);
      alert('Error al registrar el pago. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para reiniciar el formulario
  const resetForm = () => {
    reset();
    setImage(null);
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
      { title: "Razón", key: "reason" as keyof fee },
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
    <LayoutGeneral title="Mis pagos" withScrollView>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => {
              resetForm();
              setModalVisible(false);
            }}
            contentContainerStyle={styles.modalContainer}
          >
            <ScrollView>
              <Text style={styles.modalTitle}>Registrar nuevo pago</Text>
              
              {/* Número de recibo (no editable) */}
              <View style={styles.receiptContainer}>
                <Text style={styles.receiptLabel}>Número de recibo:</Text>
                <Text style={styles.receiptValue}>{receiptCode}</Text>
              </View>
              
              {/* Razón del pago - Dropdown */}
              <TouchableRipple
                onPress={() => setReasonMenuVisible(true)}
                style={styles.dropdownButton}
              >
                <View style={styles.dropdownContainer}>
                  <Text>Motivo del pago: </Text>
                  <Controller
                    control={control}
                    name="reason"
                    rules={{ required: 'El motivo del pago es requerido' }}
                    render={({ field: { value } }) => (
                      <Text style={styles.selectedValue}>
                        {value || 'Seleccionar motivo'}
                      </Text>
                    )}
                  />
                </View>
              </TouchableRipple>
              {errors.reason && (
                <HelperText type="error">{errors.reason.message}</HelperText>
              )}
              
              <Portal>
                <Modal
                  visible={reasonMenuVisible}
                  onDismiss={() => setReasonMenuVisible(false)}
                  contentContainerStyle={styles.menuModal}
                >
                  <List.Section>
                    <List.Subheader>Selecciona un motivo</List.Subheader>
                    {PAYMENT_REASONS.map((reason) => (
                      <List.Item
                        key={reason.value}
                        title={reason.label}
                        onPress={() => {
                          setValue('reason', reason.value);
                          setReasonMenuVisible(false);
                        }}
                        right={props => 
                          watch('reason') === reason.value ? 
                          <List.Icon {...props} icon="check" /> : null
                        }
                      />
                    ))}
                  </List.Section>
                </Modal>
              </Portal>
              
              {/* Cantidad */}
              <Controller
                control={control}
                rules={{
                  required: 'El monto es requerido',
                  validate: value => 
                    (!isNaN(Number(value)) && Number(value) > 0) || 
                    'Ingrese un valor numérico mayor a 0'
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Monto ($)"
                    value={value ? String(value) : ''}
                    onChangeText={(text) => onChange(parseFloat(text) || '')}
                    onBlur={onBlur}
                    keyboardType="decimal-pad"
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.qty}
                    left={<TextInput.Icon icon="currency-usd" />}
                  />
                )}
                name="qty"
              />
              {errors.qty && (
                <HelperText type="error">{errors.qty.message}</HelperText>
              )}
              
              {/* Método de pago - Dropdown */}
              <TouchableRipple
                onPress={() => setPaymentMethodMenuVisible(true)}
                style={styles.dropdownButton}
              >
                <View style={styles.dropdownContainer}>
                  <Text>Método de pago: </Text>
                  <Controller
                    control={control}
                    name="paymentMethod"
                    render={({ field: { value } }) => (
                      <Text style={styles.selectedValue}>
                        {PAYMENT_METHODS.find(m => m.value === value)?.label || 'Efectivo'}
                      </Text>
                    )}
                  />
                </View>
              </TouchableRipple>
              
              <Portal>
                <Modal
                  visible={paymentMethodMenuVisible}
                  onDismiss={() => setPaymentMethodMenuVisible(false)}
                  contentContainerStyle={styles.menuModal}
                >
                  <List.Section>
                    <List.Subheader>Selecciona un método de pago</List.Subheader>
                    {PAYMENT_METHODS.map((method) => (
                      <List.Item
                        key={method.value}
                        title={method.label}
                        onPress={() => {
                          setValue('paymentMethod', method.value );
                          setPaymentMethodMenuVisible(false);
                        }}
                        right={props => 
                          watch('paymentMethod') === method.value ? 
                          <List.Icon {...props} icon="check" /> : null
                        }
                      />
                    ))}
                  </List.Section>
                </Modal>
              </Portal>
              
              {/* Número de documento (para métodos que no son efectivo) */}
              {paymentMethod !== 'cash' && (
                <Controller
                  control={control}
                  rules={{
                    required: 'El número de comprobante es requerido'
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Número de comprobante"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      mode="outlined"
                      style={styles.input}
                      error={!!errors.docNumber}
                    />
                  )}
                  name="docNumber"
                />
              )}
              {errors.docNumber && (
                <HelperText type="error">{errors.docNumber.message}</HelperText>
              )}
              
              {/* Selector de imagen (para métodos que no son efectivo) */}
              {paymentMethod !== 'cash' && (
                <>
                  <TouchableRipple onPress={pickImage} style={styles.imagePickerContainer}>
                    <View style={styles.imagePickerContent}>
                      {image ? (
                        <Image source={{ uri: image.uri }} style={styles.previewImage} />
                      ) : (
                        <View style={styles.noImageContainer}>
                          <Text style={styles.noImageText}>Seleccionar comprobante</Text>
                          <Text style={styles.helperText}>Toca para elegir imagen</Text>
                        </View>
                      )}
                    </View>
                  </TouchableRipple>
                  {!image && (
                    <HelperText type="error">El comprobante es requerido para este método de pago</HelperText>
                  )}
                </>
              )}
              
              {/* Botones */}
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                  style={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  style={styles.submitButton}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Registrar
                </Button>
              </View>
            </ScrollView>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  receiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  receiptLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  receiptValue: {
    fontSize: 16,
    color: '#4338ca',
  },
  input: {
    marginVertical: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 15,
    marginVertical: 10,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedValue: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  menuModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 10,
  },
  imagePickerContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 15,
    overflow: 'hidden',
  },
  imagePickerContent: {
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  noImageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
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
