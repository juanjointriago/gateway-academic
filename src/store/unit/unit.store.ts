import { fileStorage } from "@/src/helpers/fileSystemZustand"
import { IUnitMutation } from "@/src/interfaces"
import {  UnitService } from "@/src/services/units/unit.service"
import { create, StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface IUnitState {
    units: IUnitMutation[]
    unitsAvailable: number
}

interface IUnitActions {
    getUnitsUser: (unitsUser: string[]) => Promise<IUnitMutation[]>
    setUnits: (units: IUnitMutation[]) => void
    clearStoreUnits: () => void
}

const storeApi: StateCreator<IUnitState & IUnitActions, [["zustand/immer", never]]> = (set, get) => ({
    units: [],
    unitsAvailable: 0,

    getUnitsUser: async (unitsUser) => {
        const units = await UnitService.getUnitByUser(unitsUser);
        set({ units: units, unitsAvailable: units.length });
        return units;
    },

    setUnits: (units) => {
        set({ units: units, unitsAvailable: units.length });
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