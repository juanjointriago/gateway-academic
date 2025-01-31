import { USER_COLLECTION } from "@/src/constants/ContantsFirebase";
import { subscribeToDocument } from "@/src/helpers/firesoteRealTime";
import { IUser } from "@/src/interfaces";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { createContext, FC, ReactNode, useContext, useEffect } from "react";

interface UserContextType {
    startListeningUser: (docId: string) => void;
    stopListeningUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

interface Props {
    children: ReactNode
}

export const UserProvider: FC<Props> = ({ children }) => {

    const setUser = useAuthStore((state) => state.setUser);
    let unsubscribe: (() => void) | null = null;

    const startListeningUser = (docId: string) => {
        if (unsubscribe) {
            unsubscribe();
        }

        unsubscribe = subscribeToDocument<IUser>(
            USER_COLLECTION,
            docId,
            async (updateUser) => {
                if (!updateUser) return;
                console.log('Updated user info', updateUser?.id);
                setUser(updateUser);
            }
        );
    }

    const stopListeningUser = () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    }

    useEffect(() => {
        return () => {
            stopListeningUser();
        };
    }, []);

    return (
        <UserContext.Provider value={{ startListeningUser, stopListeningUser }}>
            {children}
        </UserContext.Provider>
    )
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUserContext debe usarse dentro de un UserProvider");
    return context;
};