import { LottiesGeneral } from "@/src/components";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { Redirect } from "expo-router";

export default function Index() {
    const user = useAuthStore((state) => state.user);
    const statusAuth = useAuthStore((state) => state.status);

    if (statusAuth === 'pending') {
        return <LottiesGeneral animation="loading" description="Espere un momento..." />
    }

    if (statusAuth === 'authorized') {
        if(user?.role === 'student') return <Redirect href="/(tabs)/home" />
        if(user?.role === 'teacher') return <Redirect href="/(tabsT)/homeTeacher" />
    }

    return (
        <Redirect href="/signIn" />
    )
}