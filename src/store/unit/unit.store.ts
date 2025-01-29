import { IUnitMutation } from "@/src/interfaces"
import {  UnitService } from "@/src/services/units/unit.service"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create, StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface IUnitState {
    units: IUnitMutation[]
    unitsAvailable: number
}

interface IUnitActions {
    getAllUnits: () => Promise<IUnitMutation[]>
    getUnitsStudent: (unitsStudent: string[]) => Promise<IUnitMutation[]>
    clearStoreUnits: () => void
}

const storeApi: StateCreator<IUnitState & IUnitActions, [["zustand/immer", never]]> = (set, get) => ({
    units: [],
    unitsAvailable: 0,

    getAllUnits: async () => {
        const units = await UnitService.getAllUnits();
        set({ units: units });
        return units;
    },

    getUnitsStudent: async (unitsStudent: string[]) => {
        const units = await UnitService.getUnitStudent(unitsStudent);
        set({ units: units, unitsAvailable: units.length });
        return units;
    },

    clearStoreUnits: () => {
        set({ units: [], unitsAvailable: 0 });
    }
});

export const useUnitStore = create<IUnitState & IUnitActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "unit-store",
                storage: createJSONStorage(() => AsyncStorage),
            })
        )
    )
);