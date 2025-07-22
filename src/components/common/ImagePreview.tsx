import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import { Text, IconButton, useTheme, Portal } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

interface ImagePreviewProps {
  imageUri: string;
  thumbnailStyle?: object;
  placeholder?: string;
  onError?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUri,
  thumbnailStyle,
  placeholder = "No disponible",
  onError
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const openModal = () => {
    console.log('OpenModal called:', { imageError, imageUri: !!imageUri });
    if (!imageError && imageUri) {
      console.log('Opening modal...');
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    console.log('Closing modal...');
    setModalVisible(false);
  };

  if (imageError || !imageUri) {
    console.log('Showing placeholder:', { imageError, imageUri });
    return (
      <View style={[styles.placeholder, thumbnailStyle]}>
        <Text style={[styles.placeholderText, { color: theme.colors.onSurfaceVariant }]}>
          {placeholder}
        </Text>
      </View>
    );
  }

  console.log('Rendering ImagePreview with image:', { imageUri: !!imageUri, modalVisible });

  return (
    <>
      <TouchableOpacity 
        onPress={openModal}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchableContainer}
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.thumbnailContainer,
            { transform: [{ scale: scaleValue }] }
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={[styles.thumbnail, thumbnailStyle]}
            onError={handleImageError}
            resizeMode="cover"
          />
          <View style={[styles.overlay, { backgroundColor: `${theme.colors.primary}80` }]}>
            <IconButton
              icon="magnify"
              size={14}
              iconColor={theme.colors.onPrimary}
              style={styles.magnifyIcon}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
          statusBarTranslucent={true}
          presentationStyle="overFullScreen"
        >
          <StatusBar style="light" />
          <TouchableOpacity 
            style={styles.modalContainer}
            onPress={closeModal}
            activeOpacity={1}
          >
            <TouchableOpacity 
              style={styles.modalContent}
              activeOpacity={1}
              onPress={() => {}} // Prevenir que se cierre cuando toques el contenido
            >
              <View style={[styles.modalHeader, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
                  Comprobante de pago
                </Text>
                <IconButton
                  icon="close"
                  size={24}
                  iconColor={theme.colors.onSurface}
                  onPress={closeModal}
                  style={styles.closeButton}
                />
              </View>
              
              <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                  onError={handleImageError}
                />
              </View>
              
              <View style={[styles.modalFooter, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
                  Toca fuera de la imagen para cerrar
                </Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  magnifyIcon: {
    margin: 0,
    width: 18,
    height: 18,
  },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 9,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  modalContent: {
    width: screenWidth * 0.99,
    maxWidth: 600,
    maxHeight: screenHeight * 0.98,
    backgroundColor: 'white',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 8,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    margin: 0,
  },
  imageContainer: {
    width: '100%',
    height: screenHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
  },
  fullImage: {
    width: '100%',
    height: '100%',
    maxWidth: 540,
    maxHeight: screenHeight * 0.6,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  modalFooter: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

// Estilos adicionales para la interacción hover en web
if (Platform.OS === 'web') {
  const webStyles = StyleSheet.create({
    thumbnailContainer: {
      cursor: 'pointer',
    },
  });
  
  Object.assign(styles.thumbnailContainer, webStyles.thumbnailContainer);
}
