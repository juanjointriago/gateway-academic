import { fileStorage } from "@/src/helpers/fileSystemZustand"
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
    getUnitsUser: (unitsUser: string[]) => Promise<IUnitMutation[]>
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

    getUnitsUser: async (unitsUser) => {
        const units = await UnitService.getUnitByUser(unitsUser);
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
                storage: createJSONStorage(() => fileStorage),
            })
        )
    )
);