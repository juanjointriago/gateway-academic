import { SUB_LEVEL_COLLECTION, UNIT_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getDocumentById, getCollection } from "@/src/helpers/firestoreHelper";
import { ISubLevel, IUnit, IUnitMutation } from "@/src/interfaces";
import { useAuthStore } from "@/src/store/auth/auth.store";
import { useUnitStore } from "@/src/store/unit/unit.store";
import { createContext, FC, ReactNode, useContext, useState } from "react";
// import { QueryConstraint, where } from '@react-native-firebase/firestore';

interface UnitContextType {
    isLoading: boolean;
    error: string | null;
    refreshUnits: () => Promise<void>;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const setUnits = useUnitStore((state) => state.setUnits);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshUnits = async () => {
        if (!user?.unitsForBooks?.length) {
            setUnits([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const queryConstraints = [
                { field: "sublevel", operator: 'in' as const, value: user.unitsForBooks },
                { field: "isActive", operator: '==' as const, value: true }
            ];

            const units = await getCollection<IUnit>(UNIT_COLLECTION, queryConstraints);

            if (!units?.length) {
                setUnits([]);
                return;
            }

            const uniqueSublevelIds = [...new Set(units.map(unit => unit.sublevel))];
            const sublevelsPromises = uniqueSublevelIds.map((id) => 
                getDocumentById<ISubLevel>(SUB_LEVEL_COLLECTION, id)
            );

            const sublevels = await Promise.all(sublevelsPromises);
            const sublevelMap = new Map<string, ISubLevel | null>(
                uniqueSublevelIds.map((id, index) => [id, sublevels[index]])
            );

            const mappedUnits = units
                .map(unit => {
                    const sublevelInfo = sublevelMap.get(unit.sublevel);
                    return sublevelInfo ? {
                        ...unit,
                        sublevelInfo,
                    } : null;
                })
                .filter((unit): unit is IUnitMutation => unit !== null)
                .sort((a, b) => a.orderNumber - b.orderNumber);

            setUnits(mappedUnits);
        } catch (error) {
            console.error('Error al cargar unidades:', error);
            setError('Error al cargar las unidades');
            setUnits([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UnitContext.Provider 
            value={{ 
                isLoading,
                error,
                refreshUnits
            }}
        >
            {children}
        </UnitContext.Provider>
    );
};

export const useUnitContext = (): UnitContextType => {
    const context = useContext(UnitContext);
    if (!context) {
        throw new Error("useUnitContext debe usarse dentro de un UnitProvider");
    }
    return context;
};