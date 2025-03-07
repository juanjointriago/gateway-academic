import { useAuthStore } from "@/src/store/auth/auth.store";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { BottomNavigation, Icon } from "react-native-paper";

export default function TabTLayout() {
    const user = useAuthStore((state) => state.user);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Platform.select({ ios: { position: 'absolute' } })
            }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    onTabPress={({ route }) => {
                        navigation.navigate(route.name);
                    }}
                    renderIcon={({ route, focused, color }) => {
                        const { options } = descriptors[route.key];
                        if (options.tabBarIcon) {
                            return options.tabBarIcon({ focused, color, size: 24 });
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
            )}
        >
            <Tabs.Screen
                name="homeTeacher"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="reservationsTeacher"
                options={{
                    title: 'Reservas',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="human-male-board-poll" color={color} />,
                }}
            />
            <Tabs.Screen
                name="booksTeacher"
                options={{
                    title: 'Libros',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="book-open" color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color, size }) => <Icon size={size} source="cog" color={color} />,
                }}
            />
        </Tabs>
    );
}