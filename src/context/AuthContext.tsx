import { createContext, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import { useAuthStore } from "../store/auth/auth.store";
import { UserService } from "../services";

export const AlertContext = createContext({});

interface Props {
    children: JSX.Element | JSX.Element[];
}

export const AuthProvider = ({ children }: Props) => {
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
            console.log('Context Sesion User ==>',{ user });
            if(!user) {
                await auth().signOut();
                return setUser(null);
            };
            const getInfoUser = await UserService.getUserByDocId(user.uid);
            if(!getInfoUser) {
                await auth().signOut();
                return setUser(null);
            };
            setUser(getInfoUser);
        });
        return () => unsubscribe();
    }, [setUser]);

    return (
        <AlertContext.Provider value={{}}>
            {children}
        </AlertContext.Provider>
    )
}