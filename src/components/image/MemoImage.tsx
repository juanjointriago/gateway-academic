import React, { useState, useCallback, memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

interface Props {
  imageUrl: string;
  style?: any;
}

const imageCache: { [key: string]: boolean } = {};

const MemoImage: React.FC<Props> = ({ imageUrl, style }) => {
  const [loading, setLoading] = useState(!imageCache[imageUrl]);

  const onLoadComplete = useCallback(() => {
    imageCache[imageUrl] = true;
    setLoading(false);
  }, [imageUrl]);

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      )}
      <Card.Cover
        source={{ uri: imageUrl }}
        style={[styles.image, style]}
        onLoad={onLoadComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 1,
  },
  image: {
    height: 200,
  },
});

export default memo(MemoImage);