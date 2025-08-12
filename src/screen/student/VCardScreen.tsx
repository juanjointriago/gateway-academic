import { LayoutGeneral } from "@/src/components";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useProgressSheetStore } from "@/src/store/progress-sheet/progress-sheet.store";
import { Text, Avatar, useTheme } from "react-native-paper";
import { View, StyleSheet, Animated, TouchableWithoutFeedback, Platform } from "react-native";
import { useRouter } from 'expo-router';
import { useRef, useState } from "react";
import { CurvedBackground } from "@/src/components/svg";
import { QRWrapper } from "@/src/components/qr";
import { useAppInfoStore } from "@/src/store/appinfo/appinfo.store";

export const VCardScreen = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const getProgressSheetByStudentId = useProgressSheetStore((state) => state.getProgressSheetByStudentId);
    const theme = useTheme();
    const [flipped, setFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;
    const appInfo = useAppInfoStore (state=>state.appInfo)

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
    // const contract = progressSheet.contractNumber || '';
    // const startDate = progressSheet.createdAt || '';
    // const endDate = progressSheet.updatedAt || '';
    // Si tienes un estado, usa la propiedad real:
    // const work = progressSheet.work || '';

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
            overflow: 'hidden', // Para mantener las esquinas redondeadas
        },
        cardBack: {
            width: 260,
            height: 400,
            borderRadius: 18,
            backgroundColor: '#F5F5F5',
            // Sombra y brillo igual que el frente
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
            overflow: 'hidden', // Para mantener las esquinas redondeadas
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
        // Back card styles
        signatureContainer: {
            position: 'absolute',
            top: 300,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 2,
        },
        signatureBox: {
            backgroundColor: '#1B365D',
            borderRadius: 25,
            paddingHorizontal: 30,
            paddingVertical: 12,
            marginBottom: 20,
        },
        signatureText: {
            color: 'white',
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: '300',
            textAlign: 'center',
            letterSpacing: 1,
            ...Platform.select({
                ios: {
                    fontFamily: 'Snell Roundhand', // iOS cursive font
                },
                android: {
                    fontFamily: 'cursive', // Android cursive font
                },
                web: {
                    fontFamily: 'cursive', // Web cursive font
                },
            }),
        },
        directorInfo: {
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 2,
            paddingHorizontal: 20,
        },
        directorName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1B365D',
            textAlign: 'center',
            marginBottom: 4,
        },
        directorTitle: {
            fontSize: 14,
            color: '#1B365D',
            textAlign: 'center',
            marginBottom: 10,
        },
        contactInfo: {
            fontSize: 12,
            color: '#1B365D',
            textAlign: 'center',
            marginBottom: 2,
        },
        addressInfo: {
            fontSize: 11,
            color: '#666666',
            textAlign: 'center',
            marginBottom: 1,
        },
        websiteContainer: {
            backgroundColor: '#1B365D',
            borderRadius: 15,
            paddingHorizontal: 20,
            paddingVertical: 6,
            marginTop: 3,
        },
        websiteText: {
            color: 'white',
            fontSize: 12,
            textAlign: 'center',
        },
        qrContainer: {
            alignItems: 'center',
            marginTop: 1,
            backgroundColor: 'white',
            padding: 6,
            borderRadius: 8,
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
                            <CurvedBackground variant="front" width={260} height={400} />
                            <Avatar.Image
                                size={90}
                                source={avatarUri ? { uri: avatarUri } : require('@/assets/images/icon.png')}
                                style={styles.avatar}
                            />
                            <Text style={styles.name}>{fullName}</Text>
                            <Text style={styles.email}>{email}</Text>
                            <Text style={styles.id}>ID: {id}</Text>
                            <Text style={styles.label}>Toca para ver mas detalles...</Text>
                        </Animated.View>
                        <Animated.View style={[styles.cardBack, { 
                            transform: [
                                { perspective: 1000 },
                                { rotateY: backInterpolate }
                            ]
 
                        }]}> 
                            <CurvedBackground variant="back" width={260} height={400} />
                            
                            {/* Signature section */}
                            <View style={styles.signatureContainer}>
                                <View style={styles.signatureBox}>
                                    <Text style={styles.signatureText}>{fullName}</Text>
                                </View>
                            </View>
                            
                            {/* Director information */}
                            <View style={styles.directorInfo}></View>
                                <Text style={styles.directorName}>{appInfo.generalDirectorName}</Text>
                                <Text style={styles.directorTitle}>Director General</Text>
                                
                                <Text style={styles.contactInfo}>{appInfo.supportPhone}</Text>
                                <Text style={styles.contactInfo}>{appInfo.supportEmail}</Text>
                                <Text style={styles.addressInfo}>{appInfo.address}</Text>
                                
                                <View style={styles.websiteContainer}>
                                    <Text style={styles.websiteText}>{appInfo.webSyte}</Text>
                                </View>
                                
                                {/* QR Code */}
                                {appInfo.webSyte && (
                                    <View style={styles.qrContainer}>
                                        <QRWrapper
                                            value={appInfo.webSyte.startsWith('http') ? appInfo.webSyte : `https://${appInfo.webSyte}`}
                                            size={40}
                                            color="#1B365D"
                                            backgroundColor="white"
                                        />
                                    </View>
                                )}                   
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </LayoutGeneral>
    );
};
