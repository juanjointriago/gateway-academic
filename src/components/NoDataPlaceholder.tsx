import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface NoDataPlaceholderProps {
    title: string;
    subtitle?: string;
    iconSize?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const NoDataPlaceholder: React.FC<NoDataPlaceholderProps> = ({
    title,
    subtitle,
    iconSize = 120
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background,
            paddingHorizontal: 32,
            paddingVertical: 48,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 32,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        logo: {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
            backgroundColor: theme.colors.surface,
            padding: 16,
        },
        content: {
            alignItems: 'center',
            maxWidth: screenWidth * 0.8,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.onSurface,
            textAlign: 'center',
            marginBottom: 12,
            letterSpacing: 0.5,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 24,
            opacity: 0.8,
        },
        decorativeElement: {
            position: 'absolute',
            top: 100,
            right: 50,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.colors.primary,
            opacity: 0.1,
        },
        decorativeElement2: {
            position: 'absolute',
            bottom: 150,
            left: 30,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.secondary,
            opacity: 0.15,
        },
        gradientOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `${theme.colors.primary}10`,
            borderRadius: 20,
        },
    });

    return (
        <View style={styles.container}>
            {/* Elementos decorativos */}
            <View style={styles.decorativeElement} />
            <View style={styles.decorativeElement2} />
            
            {/* Logo container con sombra */}
            <View style={styles.logoContainer}>
                <View style={styles.gradientOverlay} />
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Contenido de texto */}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                )}
            </View>
        </View>
    );
};
