import React, { useState } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import { Button, Text, TextInput, HelperText, TouchableRipple, List, Portal, Modal } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from "react-hook-form";
import { fee, paymentMethod } from "@/src/interfaces/fees.interface";
import { FirestoreUser, IUser } from "@/src/interfaces";
import { UserService } from "@/src/services";
import { generateInvoiceNumber } from "@/src/helpers/invoice.helper";

// Opciones de métodos de pago
interface PaymentMethod {
  value: paymentMethod;
  label: string;
}
const PAYMENT_METHODS : PaymentMethod[] = [
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

interface AddFeeFormProps {
  user: IUser | null;
  onSubmit: (data: fee) => Promise<void>;
  onCancel: () => void;
}

export const AddFeeForm: React.FC<AddFeeFormProps> = ({ user, onSubmit, onCancel }) => {
  // Estados para UI
  const [paymentMethodMenuVisible, setPaymentMethodMenuVisible] = useState(false);
  const [reasonMenuVisible, setReasonMenuVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  // Generar código de recibo
  const receiptCode = generateInvoiceNumber();
  
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

  // Función para enviar el formulario
  const handleFormSubmit = async (data: fee) => {
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
        }
      }
      
      // Llamar a la función onSubmit con los datos necesarios
      await onSubmit({
        ...cleanData,
        imageUrl: downloadURL,
        docNumber: data.paymentMethod !== 'cash' && !cleanData.docNumber ? '' : (cleanData.docNumber || null)
      });
      
      // Reiniciar formulario
      resetForm();
      
    } catch (error) {
      console.error('Error procesando el formulario:', error);
      alert('Error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para reiniciar el formulario
  const resetForm = () => {
    reset();
    setImage(null);
  };

  // Función para cancelar
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
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
                  setValue('paymentMethod', method.value);
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
          { !image && (
            <HelperText type="error">El comprobante es requerido para este método de pago</HelperText>
          )}
        </>
      )}
      
      {/* Botones */}
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleCancel}
          style={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          style={styles.submitButton}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Registrar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});