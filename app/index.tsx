import { useAuthStore } from "@/src/store/auth/auth.store";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native-paper";

export default function Index() {
    const statusAuth = useAuthStore((state) => state.status);

    if (statusAuth === 'pending') {
        return <ActivityIndicator />;
    }

    if (statusAuth === 'authorized') {
        return (
            <Redirect href="/home" />
        )
    }

    return (
        <Redirect href="/signIn" />
    )
}