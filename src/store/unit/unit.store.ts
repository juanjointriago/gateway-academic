import { fileStorage } from "@/src/helpers/fileSystemZustand";
import { IUnit } from "@/src/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UnitService } from "@/src/services/units/unit.service";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IUnitState {
  units: IUnit[];
  unitsAvailable: number;
}

interface IUnitActions {
  getAllUnits: () => Promise<IUnit[]>;
  setUnits: (units: IUnit[]) => void;
  clearStoreUnits: () => void;
}

const storeApi: StateCreator<
  IUnitState & IUnitActions
> = (set, get) => ({
  units: [],
  unitsAvailable: 0,

  getAllUnits: async () => {
    const units = await UnitService.getAllUnits();
    set({ units: units, unitsAvailable: units.length });
    return units;
  },

  setUnits: (units) => {
    set({ units: units, unitsAvailable: units.length });
  },
  clearStoreUnits: () => {
    set({ units: [], unitsAvailable: 0 });
  },
});

export const useUnitStore = create<IUnitState & IUnitActions>()(
  persist(storeApi, {
    name: "unit-store",
    storage: createJSONStorage(() => AsyncStorage),
  })
);
