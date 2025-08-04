import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';

interface Props {
  progress: number; // 0 a 100
  label?: string;
}

const { width } = Dimensions.get('window');

export const ImageUploadProgress: React.FC<Props> = ({ progress, label }) => {
  // El ProgressBar espera un valor entre 0 y 1
  const normalized = Math.max(0, Math.min(progress / 100, 1));
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label || 'Subiendo imagen...'}</Text>
      <ProgressBar progress={normalized} style={styles.progress} color="#1976d2" />
      <Text style={styles.percent}>{progress.toFixed(0)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  progress: {
    width: '100%',
    height: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  percent: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
