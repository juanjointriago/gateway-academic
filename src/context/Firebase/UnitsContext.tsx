import { SUB_LEVEL_COLLECTION, UNIT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { subscribeToCollection } from "@/src/helpers/firesoteRealTime";
import { getDocumentById } from "@/src/helpers/firestoreHelper";
import { ISubLevel, IUnit, IUnitMutation } from "@/src/interfaces";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useUnitStore } from "@/src/store/unit/unit.store";
import { createContext, FC, ReactNode, useContext, useEffect } from "react";

interface UnitContextType {
    startListeningUnits: () => void;
    stopListeningUnits: () => void;
}

const UnitContext = createContext<UnitContextType | null>(null);

interface Props {
    children: ReactNode
}

export const UnitProvider: FC<Props> = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const setUnits = useUnitStore((state) => state.setUnits);
    let unsubscribe: (() => void) | null = null;

    const startListeningUnits = () => {
        if (!user) return;
        if (unsubscribe) {
            unsubscribe();
        }
        unsubscribe = subscribeToCollection<IUnit>(
            UNIT_COLLECTION,
            (ref) =>
                ref
                    .where("sublevel", "in", user.unitsForBooks)
                    .where("isActive", "==", true),
            async (updatedUnits) => {
                console.log('updatedUnits Context', updatedUnits.length);
                if (!updatedUnits.length) return;
                const uniqueSublevelIds = [...new Set(updatedUnits.map((unit) => unit.sublevel))];
                const sublevels = await Promise.all(uniqueSublevelIds.map((id) => getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, id)));
                const sublevelMap = new Map(uniqueSublevelIds.map((id, index) => [id, sublevels[index]]));

                const mappedUnits: IUnitMutation[] = updatedUnits.map((unit) => ({
                    ...unit,
                    sublevelInfo: sublevelMap.get(unit.sublevel) as ISubLevel,
                })).sort((a, b) => a.orderNumber - b.orderNumber); // Ordenar por número de orden

                setUnits(mappedUnits);
            }
        );
    }

    const stopListeningUnits = () => {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    }

    useEffect(() => {
        return () => {
            stopListeningUnits();
        };
    }, []);

    return (
        <UnitContext.Provider value={{ startListeningUnits, stopListeningUnits }}>
            {children}
        </UnitContext.Provider>
    )
}

export const useUnitContext = () => {
    const context = useContext(UnitContext);
    if (!context) throw new Error("useUnitContext debe usarse dentro de un UnitProvider");
    return context;
};