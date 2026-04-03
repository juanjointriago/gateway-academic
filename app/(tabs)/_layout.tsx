import { useAuthStore } from "@/src/store/auth/auth.store";
import { useResponsiveScreen } from "@/src/hook/useResponsiveScreen";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { BottomNavigation, Icon } from "react-native-paper";

export default function TabLayout() {
    const user = useAuthStore((state) => state.user);
    const { isTablet, isLandscape } = useResponsiveScreen();
    
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Platform.select({ 
                    ios: { 
                        position: 'absolute',
                        height: isTablet ? 80 : 60
                    },
                    android: {
                        height: isTablet ? 80 : 60
                    }
                })
            }}
            tabBar={({ navigation, state, descriptors, insets }) => {
                // Filtrar rutas ocultas (worksheet no debe aparecer en el tab bar)
                const HIDDEN = ['worksheet'];
                const visibleRoutes = state.routes.filter(r => !HIDDEN.includes(r.name));
                const activeKey = state.routes[state.index]?.key;
                const activeVisibleIndex = visibleRoutes.findIndex(r => r.key === activeKey);
                const filteredState = {
                    ...state,
                    routes: visibleRoutes,
                    index: activeVisibleIndex >= 0 ? activeVisibleIndex : 0,
                };
                return (
                <BottomNavigation.Bar
                    navigationState={filteredState}
                    safeAreaInsets={insets}
                    onTabPress={({ route }) => {
                        navigation.navigate(route.name);
                    }}
                    renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({ 
                                focused, 
                                color, 
                                size: isTablet ? 28 : 24 
                            });
                        }

                        return null;
                    }}
                    getLabelText={({ route }) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                    ? options.title
                                    : route.name;

                        return label as string;
                    }}
                />
                );
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="progress_sheet"
                options={{
                    title: 'Progress',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="book" color={color} />,
                }}
            />
            <Tabs.Screen
                name="classes"
                options={{
                    title: 'Clases',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="human-male-board-poll" color={color} />,
                }}
            />
            <Tabs.Screen
                name="books"
                options={{
                    title: 'Books',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="book-open" color={color} />,
                }}
            />
            <Tabs.Screen
                name="fees"
                options={{
                    title: 'Fees',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="cash" color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="cog" color={color} />,
                }}
            />
            {/* Grupo worksheet — oculto de la barra de tabs */}
            <Tabs.Screen
                name="worksheet"
                options={{ href: null, title: 'Worksheet' }}
            />
        </Tabs>
    );
}