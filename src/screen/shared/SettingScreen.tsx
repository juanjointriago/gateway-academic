import { LayoutGeneral } from '@/src/components';
import { useAlert } from '@/src/context/AlertContext';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/auth/auth.store';
import { useEventStore } from '@/src/store/event/event.store';
import { useLevelStore } from '@/src/store/level/level.store';
import { useSubLevelStore } from '@/src/store/level/sublevel.store';
import { useUnitStore } from '@/src/store/unit/unit.store';
import { useAppInfoStore } from '@/src/store/appinfo/appinfo.store';
import { useUIStore } from '@/src/store/ui/ui.store';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, Switch, useTheme } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const NAVY = '#1C2E82';

const ROLE_LABELS: Record<string, string> = {
    student: 'Estudiante',
    teacher: 'Docente',
    admin: 'Administrador',
};

export const SettingScreen = () => {
    const router      = useRouter();
    const theme       = useTheme();
    const themeMode   = useUIStore((state) => state.themeMode);
    const toggleTheme = useUIStore((state) => state.toggleTheme);

    const { customAlert, onToggle } = useAlert();
    const user               = useAuthStore((state) => state.user);
    const logout             = useAuthStore((state) => state.logoutUser);
    const clearStoreEvents   = useEventStore((state) => state.clearStoreEvents);
    const clearStoreLevels   = useLevelStore((state) => state.clearStoreLevels);
    const clearStoreSubLevels = useSubLevelStore((state) => state.clearStoreSubLevels);
    const clearStoreUnits    = useUnitStore((state) => state.clearStoreUnits);
    const appinfo            = useAppInfoStore((state) => state.appInfo);
    const setAppInfo         = useAppInfoStore((state) => state.setAppInfo);

    const appVersion = appinfo.version || '1.0.5';
    const initials   = user?.name
        ? user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
        : '?';

    const handleLogout = () => {
        customAlert({
            message: '¿Desea cerrar sesión?',
            accions: [
                { text: 'Cancelar', onPress: () => onToggle },
                {
                    text: 'Aceptar',
                    onPress: () => {
                        logout();
                        clearStoreEvents();
                        clearStoreLevels();
                        clearStoreSubLevels();
                        clearStoreUnits();
                        router.replace('/signIn');
                    },
                },
            ],
        });
    };

    // ── adaptive colors ────────────────────────────────────────────────────────
    const card       = theme.colors.surface;
    const textMain   = theme.colors.onSurface;
    const textMuted  = theme.colors.onSurfaceVariant;
    const separator  = theme.colors.outlineVariant;
    const isDark     = themeMode === 'dark';

    return (
        <LayoutGeneral title='Ajustes' withScrollView onRefresh={setAppInfo}>

            {/* ── PERFIL ──────────────────────────────────────────────────── */}
            <TouchableOpacity
                style={[styles.profileCard, { backgroundColor: card }]}
                onPress={() => router.push('/profile')}
                activeOpacity={0.75}
            >
                {user?.photoUrl ? (
                    <Avatar.Image size={56} source={{ uri: user.photoUrl }} />
                ) : (
                    <Avatar.Text
                        size={56}
                        label={initials}
                        style={{ backgroundColor: NAVY }}
                        labelStyle={{ color: 'white', fontSize: 20, fontWeight: '700' }}
                    />
                )}

                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: textMain }]} numberOfLines={1}>
                        {user?.name || '—'}
                    </Text>
                    <Text style={[styles.profileEmail, { color: textMuted }]} numberOfLines={1}>
                        {user?.email || '—'}
                    </Text>
                    <View style={[styles.rolePill, { borderColor: NAVY }]}>
                        <Text style={[styles.roleText, { color: NAVY }]}>
                            {ROLE_LABELS[user?.role ?? ''] ?? 'Usuario'}
                        </Text>
                    </View>
                </View>

                <MaterialIcons name="keyboard-arrow-right" size={22} color={textMuted} />
            </TouchableOpacity>

            {/* ── CUENTA ──────────────────────────────────────────────────── */}
            <Text style={[styles.sectionLabel, { color: textMuted }]}>CUENTA</Text>
            <View style={[styles.group, { backgroundColor: card, borderColor: separator }]}>
                <RowItem
                    icon="badge"
                    iconBg={NAVY}
                    label="Mi Credencial"
                    onPress={() => router.push('/vcard')}
                    textColor={textMain}
                    mutedColor={textMuted}
                />
            </View>

            {/* ── APARIENCIA ──────────────────────────────────────────────── */}
            <Text style={[styles.sectionLabel, { color: textMuted }]}>APARIENCIA</Text>
            <View style={[styles.group, { backgroundColor: card, borderColor: separator }]}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconBox, { backgroundColor: isDark ? '#3A3F7A' : NAVY }]}>
                        <MaterialIcons
                            name={isDark ? 'nights-stay' : 'wb-sunny'}
                            size={18}
                            color="white"
                        />
                    </View>
                    <Text style={[styles.rowLabel, { color: textMain }]}>
                        {isDark ? 'Modo oscuro' : 'Modo claro'}
                    </Text>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        color={NAVY}
                        style={styles.switch}
                    />
                </TouchableOpacity>
            </View>

            {/* ── SESIÓN ──────────────────────────────────────────────────── */}
            <Text style={[styles.sectionLabel, { color: textMuted }]}>SESIÓN</Text>
            <View style={[styles.group, { backgroundColor: card, borderColor: separator }]}>
                <RowItem
                    icon="logout"
                    iconBg="#B71C1C"
                    label="Cerrar sesión"
                    labelColor="#C62828"
                    onPress={handleLogout}
                    textColor={textMain}
                    mutedColor={textMuted}
                    hideChevron
                />
            </View>

            {/* ── PIE ─────────────────────────────────────────────────────── */}
            <View style={styles.footer}>
                <Text style={[styles.footerVersion, { color: textMuted }]}>
                    {appinfo.appName || 'Gateway Academic'}  ·  v{appVersion}
                </Text>
            </View>

        </LayoutGeneral>
    );
};

// ── Componente de fila reutilizable ────────────────────────────────────────────
interface RowItemProps {
    icon: string;
    iconBg: string;
    label: string;
    labelColor?: string;
    description?: string;
    onPress?: () => void;
    textColor: string;
    mutedColor: string;
    hideChevron?: boolean;
}

const RowItem = ({
    icon, iconBg, label, labelColor, description,
    onPress, textColor, mutedColor, hideChevron,
}: RowItemProps) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            <MaterialIcons name={icon as any} size={18} color="white" />
        </View>
        <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, { color: labelColor ?? textColor }]}>{label}</Text>
            {description ? (
                <Text style={[styles.rowDesc, { color: mutedColor }]}>{description}</Text>
            ) : null}
        </View>
        {!hideChevron && (
            <MaterialIcons name="keyboard-arrow-right" size={20} color={mutedColor} />
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    // ── Perfil ────────────────────────────────────────────────────────────────
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    profileInfo: {
        flex: 1,
        gap: 2,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
    },
    profileEmail: {
        fontSize: 13,
    },
    rolePill: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginTop: 4,
    },
    roleText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.3,
    },

    // ── Secciones ─────────────────────────────────────────────────────────────
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 6,
        marginLeft: 4,
    },
    group: {
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },

    // ── Fila ──────────────────────────────────────────────────────────────────
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 14,
        gap: 12,
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowContent: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    rowDesc: {
        fontSize: 12,
        marginTop: 1,
    },
    switch: {
        marginLeft: 4,
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 4,
    },
    footerVersion: {
        fontSize: 12,
        letterSpacing: 0.3,
    },
});
