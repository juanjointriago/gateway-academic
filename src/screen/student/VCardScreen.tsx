import { LayoutGeneral } from "@/src/components";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useProgressSheetStore } from "@/src/store/progress-sheet/progress-sheet.store";
import { Text, Avatar, useTheme, Button, IconButton } from "react-native-paper";
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Platform } from "react-native";
import { useRouter } from 'expo-router';
import { useRef, useState } from "react";

export const VCardScreen = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const getProgressSheetByStudentId = useProgressSheetStore((state) => state.getProgressSheetByStudentId);
    const theme = useTheme();
    const [flipped, setFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;

    if (!user) {
        return <Text>No user data available</Text>;
    }
    const progressSheet = getProgressSheetByStudentId(user.id);
    if (!progressSheet) {
        return <Text>No progress sheet found for this user</Text>;
    }

    // Animación flip
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });
    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const flipCard = () => {
        if (flipped) {
            Animated.spring(flipAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 10,
            }).start();
        } else {
            Animated.spring(flipAnim, {
                toValue: 180,
                useNativeDriver: true,
                friction: 8,
                tension: 10,
            }).start();
        }
        setFlipped(!flipped);
    };


    // Datos del usuario (ajustar a tus propiedades reales)
    const avatarUri = user.photoUrl || '';
    const fullName = user.name || user.email || '';
    const email = user.email || '';
    const id = user.cc || '';

    // Datos del progressSheet (ajustar a tus propiedades reales)
    const contract = progressSheet.contractNumber || '';
    const startDate = progressSheet.createdAt || '';
    const endDate = progressSheet.updatedAt || '';
    // Si tienes un estado, usa la propiedad real:
    const work = progressSheet.work || '';

    const isDark = theme.dark;
    // Tonos celestes/lilas
    const glowColor = isDark ? '#B3B8FF' : '#5B6EFF'; // lila claro en dark, azul en light
    const shadowColor = isDark ? '#B3B8FF' : '#5B6EFF';
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.background,
        },
        backBtn: {
            position: 'absolute',
            top: 24,
            left: 12,
            zIndex: 10,
        },
        cardContainer: {
            width: 280,
            height: 420,
            alignItems: 'center',
            justifyContent: 'center',
        },
        card: {
            width: 260,
            height: 400,
            borderRadius: 18,
            backgroundColor: theme.colors.surface,
            // Sombra y brillo
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7,
            shadowRadius: 18,
            elevation: 16,
            borderWidth: 2,
            borderColor: glowColor,
            // Efecto de brillo
            ...Platform.select({
                ios: {
                    shadowColor: shadowColor,
                },
                android: {
                    // El borderColor y elevation ya dan buen efecto en Android
                },
            }),
            position: 'absolute',
            backfaceVisibility: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
        },
        avatar: {
            marginBottom: 18,
            backgroundColor: theme.colors.primary,
        },
        name: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.onSurface,
            marginBottom: 6,
            textAlign: 'center',
        },
        email: {
            fontSize: 15,
            color: theme.colors.onSurfaceVariant,
            marginBottom: 12,
            textAlign: 'center',
        },
        id: {
            fontSize: 13,
            color: theme.colors.outline,
            marginBottom: 18,
            textAlign: 'center',
        },
        label: {
            fontSize: 15,
            color: theme.colors.primary,
            fontWeight: 'bold',
            marginTop: 10,
        },
        value: {
            fontSize: 15,
            color: theme.colors.onSurface,
            marginBottom: 6,
        },
        flipBtn: {
            marginTop: 18,
            alignSelf: 'center',
        },
    });

    return (
        <LayoutGeneral title="Credencial" onBackAction={() => router.back()}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={flipCard}>
                    <View style={styles.cardContainer}>
                        <Animated.View style={[styles.card, { 
                            transform: [
                                { perspective: 1000 },
                                { rotateY: frontInterpolate }
                            ]
                        }]}> 
                            <Avatar.Image
                                size={90}
                                source={avatarUri ? { uri: avatarUri } : require('@/assets/images/icon.png')}
                                style={styles.avatar}
                            />
                            <Text style={styles.name}>{fullName}</Text>
                            <Text style={styles.email}>{email}</Text>
                            <Text style={styles.id}>ID: {id}</Text>
                            <Text style={styles.label}>Toca para ver detalles del contrato</Text>
                        </Animated.View>
                        <Animated.View style={[styles.card, { 
                            transform: [
                                { perspective: 1000 },
                                { rotateY: backInterpolate }
                            ],
                            backgroundColor: theme.colors.secondaryContainer, 
                            position: 'absolute', 
                            top: 0 
                        }]}> 
                            <Text style={[styles.label, { color: theme.colors.primary }]}>Contrato</Text>
                            <Text style={styles.value}>N°: {contract}</Text>
                            <Text style={styles.value}>Inicio: {startDate}</Text>
                            <Text style={styles.value}>Fin: {endDate}</Text>
                            <Text style={styles.value}>Trabajo: {work}</Text>
                            <Text style={[styles.label, { marginTop: 24 }]}>Toca para volver</Text>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </LayoutGeneral>
    );
};
