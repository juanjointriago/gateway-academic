import { INew } from '@/src/interfaces/news.interface';
import { useState, useRef, FC } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import MemoImage from './MemoImage';

interface Props {
  data: INew[];
  onPress?: (item: INew) => void;
}

export const Carousel: FC<Props> = ({ data, onPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <Card
            key={item.id}
            style={[styles.card, { width: screenWidth - 32 }]}
            onPress={() => onPress?.(item)}
          >
            <MemoImage
              imageUrl={item.imageUrl}
              style={styles.image}
            />
            <Card.Content style={styles.content}>
              <Text variant="titleMedium" style={styles.title}>
                {item.title}
              </Text>
              <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                {item.description}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => onPress?.(item)}>
                Leer más
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? '#6200ee' : '#e0e0e0' }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  card: {
    marginHorizontal: 16,
    elevation: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    height: 200,
  },
  content: {
    paddingVertical: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
