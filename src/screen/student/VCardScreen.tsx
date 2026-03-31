import { LayoutGeneral, NoDataPlaceholder } from "@/src/components";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useProgressSheetStore } from "@/src/store/progress-sheet/progress-sheet.store";
import { Avatar } from "react-native-paper";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { CurvedBackground } from "@/src/components/svg";
import { QRWrapper } from "@/src/components/qr";
import { useAppInfoStore } from "@/src/store/appinfo/appinfo.store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH  = Math.min(SCREEN_WIDTH - 24, 380);  // más ancho, máximo 380
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.62);

const NAVY          = "#1C2E82";
const CARD_BACK_BG  = "#EEF2FF";
const GOLD          = "#E8C84A";

// ─── computed layout constants ────────────────────────────────────────────────
const AVATAR_SIZE   = 100;
const RING_EXTRA    = 22;                             // pad(6)*2 + border(5)*2
const RING_R        = (AVATAR_SIZE + RING_EXTRA) / 2; // 61

const AVATAR_CENTER_Y   = CARD_HEIGHT * 0.40;
const AVATAR_TOP_POS    = AVATAR_CENTER_Y - RING_R;
const SCHOOL_NAME_TOP   = CARD_HEIGHT * 0.07;
const BADGE_TOP         = SCHOOL_NAME_TOP + 40;
const WHITE_CONTENT_Y   = AVATAR_CENTER_Y + RING_R + 14;
const INFO_BLOCK_BOTTOM = CARD_HEIGHT * 0.09;

// Back card — header más pequeño para dar espacio al QR y la firma
const BACK_HEADER_H   = CARD_HEIGHT * 0.20;
const BACK_SIG_TOP    = CARD_HEIGHT * 0.28;   // bajo la curva SVG (pico en 0.26)
const BACK_QR_TOP     = BACK_SIG_TOP + 82;    // firma (~70px) + 12 gap
const BACK_DIR_BOTTOM = CARD_HEIGHT * 0.04;
// ──────────────────────────────────────────────────────────────────────────────

export const VCardScreen = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const getProgressSheetByStudentId = useProgressSheetStore(
        (state) => state.getProgressSheetByStudentId
    );
    const [flipped, setFlipped] = useState(false);
    const flipAnim = useRef(new Animated.Value(0)).current;
    const appInfo  = useAppInfoStore((state) => state.appInfo);

    if (!user) {
        return (
            <LayoutGeneral title="Credencial" onBackAction={() => router.back()}>
                <NoDataPlaceholder
                    title="Usuario no encontrado"
                    subtitle="No se pudieron cargar los datos del usuario. Por favor, inicia sesión nuevamente."
                />
            </LayoutGeneral>
        );
    }

    const progressSheet = getProgressSheetByStudentId(user.id);
    if (!progressSheet) {
        return (
            <LayoutGeneral title="Credencial" onBackAction={() => router.back()}>
                <NoDataPlaceholder
                    title="Información no disponible"
                    subtitle="El estudiante aún no tiene un contrato asignado"
                />
            </LayoutGeneral>
        );
    }

    // Flip animation
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });
    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "360deg"],
    });

    const flipCard = () => {
        Animated.spring(flipAnim, {
            toValue: flipped ? 0 : 180,
            useNativeDriver: true,
            friction: 8,
            tension: 10,
        }).start();
        setFlipped(!flipped);
    };

    const avatarUri  = user.photoUrl || "";
    const fullName   = user.name || user.email || "";
    const email      = user.email || "";
    const ccId       = user.cc || "";
    const sublevel   = user.subLevel || "";
    const qrValue    = appInfo.webSyte
        ? appInfo.webSyte.startsWith("http") ? appInfo.webSyte : `https://${appInfo.webSyte}`
        : email;

    const cardBase: object = {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 20,
        position: "absolute" as const,
        backfaceVisibility: "hidden" as const,
        overflow: "hidden" as const,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 22,
        elevation: 18,
    };

    return (
        <LayoutGeneral title="Credencial" onBackAction={() => router.back()}>
            <View style={styles.screen}>

                <TouchableWithoutFeedback onPress={flipCard}>
                    <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>

                        {/* ══════════════ FRONT ══════════════ */}
                        <Animated.View
                            style={[
                                cardBase,
                                { backgroundColor: NAVY },
                                { transform: [{ perspective: 1200 }, { rotateY: frontInterpolate }] },
                            ]}
                        >
                            <CurvedBackground variant="front" width={CARD_WIDTH} height={CARD_HEIGHT} />

                            {/* School name — navy header zone */}
                            <View style={[styles.frontHeader, { top: SCHOOL_NAME_TOP }]}>
                                <Text style={styles.frontSchoolName} numberOfLines={1}>
                                    {appInfo.appName || "Gateway Academic"}
                                </Text>
                            </View>

                            {/* Role badge */}
                            <View style={[styles.badgeRow, { top: BADGE_TOP }]}>
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleBadgeText}>CARNET ESTUDIANTIL</Text>
                                </View>
                            </View>

                            {/* Avatar — sits at the navy ↔ white boundary */}
                            <View style={[styles.avatarWrapper, { top: AVATAR_TOP_POS }]}>
                                <View style={styles.avatarRing}>
                                    <Avatar.Image
                                        size={AVATAR_SIZE}
                                        source={
                                            avatarUri
                                                ? { uri: avatarUri }
                                                : require("@/assets/images/icon.png")
                                        }
                                    />
                                </View>
                            </View>

                            {/* Name + sublevel — white zone */}
                            <View style={[styles.nameSection, { top: WHITE_CONTENT_Y }]}>
                                <Text style={styles.frontName} numberOfLines={2}>{fullName}</Text>
                                {sublevel ? (
                                    <View style={styles.sublevelPill}>
                                        <Text style={styles.sublevelText}>{sublevel}</Text>
                                    </View>
                                ) : null}
                            </View>

                            {/* Info block */}
                            <View style={[styles.infoBlock, { bottom: INFO_BLOCK_BOTTOM }]}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoIcon}>🪪</Text>
                                    <Text style={styles.infoLabel}>CC:</Text>
                                    <Text style={styles.infoValue} numberOfLines={1}>{ccId}</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoIcon}>✉️</Text>
                                    <Text style={styles.infoValue} numberOfLines={1}>{email}</Text>
                                </View>
                            </View>
                        </Animated.View>

                        {/* ══════════════ BACK ══════════════ */}
                        <Animated.View
                            style={[
                                cardBase,
                                { backgroundColor: CARD_BACK_BG },
                                { transform: [{ perspective: 1200 }, { rotateY: backInterpolate }] },
                            ]}
                        >
                            <CurvedBackground variant="back" width={CARD_WIDTH} height={CARD_HEIGHT} />

                            {/* School name — navy header */}
                            <View style={[styles.backHeader, { height: BACK_HEADER_H }]}>
                                <Text style={styles.backSchoolName} numberOfLines={1}>
                                    {appInfo.appName || "Gateway Academic"}
                                </Text>
                                <Text style={styles.backSchoolSub}>Carnet Estudiantil</Text>
                            </View>

                            {/* Signature */}
                            <View style={[styles.signatureSection, { top: BACK_SIG_TOP }]}>
                                <Text style={styles.signatureLabel}>Firma del estudiante</Text>
                                <View style={styles.signatureBox}>
                                    <Text style={styles.signatureText}>{fullName}</Text>
                                </View>
                            </View>

                            {/* QR Code */}
                            <View style={[styles.qrSection, { top: BACK_QR_TOP }]}>
                                <View style={styles.qrBox}>
                                    <QRWrapper
                                        value={qrValue}
                                        size={140}
                                        color={NAVY}
                                        backgroundColor="white"
                                    />
                                </View>
                                {appInfo.webSyte ? (
                                    <Text style={styles.qrCaption} numberOfLines={1}>
                                        {appInfo.webSyte}
                                    </Text>
                                ) : null}
                            </View>

                            {/* Director / contact */}
                            <View style={[styles.directorSection, { bottom: BACK_DIR_BOTTOM }]}>
                                <View style={styles.directorDivider} />
                                {appInfo.generalDirectorName ? (
                                    <>
                                        <Text style={styles.directorName}>
                                            {appInfo.generalDirectorName}
                                        </Text>
                                        <Text style={styles.directorTitle}>Director General</Text>
                                    </>
                                ) : null}
                                {appInfo.supportPhone ? (
                                    <Text style={styles.contactLine}>📞 {appInfo.supportPhone}</Text>
                                ) : null}
                                {appInfo.supportEmail ? (
                                    <Text style={styles.contactLine}>✉️ {appInfo.supportEmail}</Text>
                                ) : null}
                                {appInfo.address ? (
                                    <Text style={styles.addressLine} numberOfLines={2}>
                                        📍 {appInfo.address}
                                    </Text>
                                ) : null}
                            </View>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>

                {/* Flip hint */}
                <Text style={styles.hint}>
                    {flipped ? "↩  Ver frente" : "Ver dorso  ↪"}
                </Text>
            </View>
        </LayoutGeneral>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
    },

    // ── FRONT ───────────────────────────────────────────────────────────────
    frontHeader: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    frontSchoolName: {
        fontSize: 17,
        fontWeight: "900",
        color: "white",
        letterSpacing: 1,
        textAlign: "center",
        textTransform: "uppercase",
    },
    badgeRow: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2,
        alignItems: "center",
    },
    roleBadge: {
        backgroundColor: "rgba(255,255,255,0.18)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    roleBadgeText: {
        color: "white",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 2,
    },
    avatarWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 3,
        alignItems: "center",
    },
    avatarRing: {
        padding: 5,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: GOLD,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    nameSection: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2,
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 8,
    },
    frontName: {
        fontSize: 20,
        fontWeight: "800",
        color: NAVY,
        textAlign: "center",
        letterSpacing: 0.3,
    },
    sublevelPill: {
        backgroundColor: NAVY,
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 5,
    },
    sublevelText: {
        color: "white",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
    infoBlock: {
        position: "absolute",
        left: 18,
        right: 18,
        zIndex: 2,
        backgroundColor: "rgba(28,46,130,0.06)",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(28,46,130,0.15)",
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 6,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    infoIcon: {
        fontSize: 13,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: NAVY,
        minWidth: 24,
    },
    infoValue: {
        fontSize: 12,
        color: "#444",
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(28,46,130,0.12)",
        marginVertical: 2,
    },

    // ── BACK ────────────────────────────────────────────────────────────────
    backHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: 16,
    },
    backSchoolName: {
        fontSize: 16,
        fontWeight: "900",
        color: "white",
        letterSpacing: 1,
        textAlign: "center",
        textTransform: "uppercase",
    },
    backSchoolSub: {
        fontSize: 10,
        color: "rgba(255,255,255,0.70)",
        fontWeight: "600",
        letterSpacing: 2.5,
        textTransform: "uppercase",
    },
    signatureSection: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2,
        alignItems: "center",
        gap: 6,
    },
    signatureLabel: {
        fontSize: 10,
        color: "#999",
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    signatureBox: {
        backgroundColor: "white",
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: NAVY,
        paddingHorizontal: 32,
        paddingVertical: 10,
        minWidth: 210,
        alignItems: "center",
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    signatureText: {
        color: NAVY,
        fontSize: 18,
        fontStyle: "italic",
        fontWeight: "300",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    qrSection: {
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2,
        alignItems: "center",
        gap: 6,
    },
    qrBox: {
        backgroundColor: "white",
        padding: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(28,46,130,0.15)",
        shadowColor: NAVY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    qrCaption: {
        fontSize: 10,
        color: NAVY,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    directorSection: {
        position: "absolute",
        left: 20,
        right: 20,
        zIndex: 2,
        alignItems: "center",
        gap: 2,
    },
    directorDivider: {
        height: 1,
        width: "70%",
        backgroundColor: "rgba(28,46,130,0.18)",
        marginBottom: 8,
    },
    directorName: {
        fontSize: 14,
        fontWeight: "800",
        color: NAVY,
        textAlign: "center",
    },
    directorTitle: {
        fontSize: 11,
        color: "#666",
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 4,
    },
    contactLine: {
        fontSize: 11,
        color: NAVY,
        textAlign: "center",
    },
    addressLine: {
        fontSize: 10,
        color: "#666",
        textAlign: "center",
        marginTop: 2,
    },

    // ── HINT ────────────────────────────────────────────────────────────────
    hint: {
        fontSize: 12,
        color: "#aaa",
        letterSpacing: 0.5,
    },
});
