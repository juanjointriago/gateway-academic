import { LEVEL_COLLECTION } from "@/src/constants/ContantsFirebase";
import { subscribeToDocument } from "@/src/helpers/firesoteRealTime";
import { ILevel } from "@/src/interfaces";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useLevelStore } from "@/src/store/level/level.store";
import { createContext, FC, ReactNode, useContext, useEffect } from "react";

interface LevelContextType {
    startListeningLevel: () => void;
    stopListeningLevel: () => void;
}

const LevelContext = createContext<LevelContextType | null>(null);

interface Props {
    children: ReactNode
}

export const LevelProvider: FC<Props> = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const setLevel = useLevelStore((state) => state.setLevel);

    let unsubscribe: (() => void) | null = null;

    const startListeningLevel = () => {
        if (unsubscribe) {
            unsubscribe();
        }
        if (!user) return;
        unsubscribe = subscribeToDocument<ILevel>(
            LEVEL_COLLECTION,
            user.level,
            async (updateLevel) => {
                if (!updateLevel) return;
                console.debug('Updated level info', updateLevel?.id);
                setLevel(updateLevel);
            }
        );
    }

    const stopListeningLevel = () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    }

    useEffect(() => {
        return () => {
            stopListeningLevel();
        };
    }, []);

    return (
        <LevelContext.Provider value={{ startListeningLevel, stopListeningLevel }}>
            {children}
        </LevelContext.Provider>
    )
};

export const useLevelContext = () => {
    const context = useContext(LevelContext);
    if (!context) throw new Error("useUserContext debe usarse dentro de un UserProvider");
    return context;
};