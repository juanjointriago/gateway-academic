import { IUnit } from "@/src/interfaces";
import { UnitService } from "@/src/services/units/unit.service";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "@/src/store/storage";

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
    storage: zustandStorage(),
  })
);
