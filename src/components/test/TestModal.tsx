import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Text, Button, Portal } from 'react-native-paper';

export const TestModal = () => {
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    console.log('Test Modal: Opening modal');
    setVisible(true);
  };

  const closeModal = () => {
    console.log('Test Modal: Closing modal');
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={openModal}>
        Test Modal
      </Button>
      
      <Portal>
        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Test Modal</Text>
              <Button mode="contained" onPress={closeModal}>
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
