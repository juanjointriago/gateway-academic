import { createContext, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import { useAuthStore } from "../store/auth/auth.store";
import { UserService } from "../services";

export const AuthContext = createContext({});

interface Props {
    children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: Props) => {
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
            console.log('Context Sesion User ==>', { user });
            if (!user) {
                setUser(null);
                await auth().signOut();
                return;
            };
            const getInfoUser = await UserService.getUserByDocId(user.uid);
            if (!getInfoUser) {
                setUser(null);
                await auth().signOut();
                return;
            };
            setUser(getInfoUser);
        });
        return () => unsubscribe();
    }, [setUser]);

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}