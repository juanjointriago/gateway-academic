import { SUB_LEVEL_COLLECTION } from "@/src/constants/ContantsFirebase";
import { subscribeToDocument } from "@/src/helpers/firesoteRealTime";
import { ISubLevel } from "@/src/interfaces";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useLevelStore } from "@/src/store/level/level.store";
import { useSubLevelStore } from "@/src/store/level/sublevel.store";
import { createContext, FC, ReactNode, useContext, useEffect } from "react";

interface SubLevelContextType {
    startListeningSubLevel: () => void;
    stopListeningSubLevel: () => void;
}

const SubLevelContext = createContext<SubLevelContextType | null>(null);

interface Props {
    children: ReactNode
}


export const SubLevelProvider: FC<Props> = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const setSubLevel = useSubLevelStore((state) => state.setSubLevel);

    let unsubscribe: (() => void) | null = null;

    const startListeningSubLevel = () => {
        if (unsubscribe) {
            unsubscribe();
        }
        if (!user) return;
        unsubscribe = subscribeToDocument<ISubLevel>(
            SUB_LEVEL_COLLECTION,
            user.subLevel,
            async (updateLevel) => {
                if (!updateLevel) return;
                console.log('Updated sublevel info', updateLevel?.id);
                setSubLevel(updateLevel);
            }
        );
    }

    const stopListeningSubLevel = () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    }

    useEffect(() => {
        return () => {
            stopListeningSubLevel();
        };
    }, []);

    return (
        <SubLevelContext.Provider value={{ startListeningSubLevel, stopListeningSubLevel }}>
            {children}
        </SubLevelContext.Provider>
    )
};

export const useSubLevelContext = () => {
    const context = useContext(SubLevelContext);
    if (!context) throw new Error("useUserContext debe usarse dentro de un UserProvider");
    return context;
};