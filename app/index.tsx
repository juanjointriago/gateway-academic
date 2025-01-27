import { LottiesGeneral } from "@/src/components";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { Redirect } from "expo-router";

export default function Index() {
    const statusAuth = useAuthStore((state) => state.status);

    if (statusAuth === 'pending') {
        return <LottiesGeneral animation="loading" description="Espere un momento..." />
    }

    if (statusAuth === 'authorized') {
        return (
            <Redirect href="/(tabs)/home" />
        )
    }

    return (
        <Redirect href="/signIn" />
    )
}