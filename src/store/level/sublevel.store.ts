import { ISubLevel } from "@/src/interfaces"
import { SubLevelService } from "@/src/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ISubLevelState {
    subLevels: ISubLevel[]
}

interface ISubLevelActions {
    getAllSubLevels: () => Promise<ISubLevel[]>
    getSubLevelByDocId: (docId: string) => ISubLevel | null
}

const storeApi: StateCreator<ISubLevelState & ISubLevelActions, [["zustand/immer", never]]> = (set, get) => ({
    subLevels: [],
    getAllSubLevels: async () => {
        const subLevels = await SubLevelService.getAllSubLevels();
        set({ subLevels: subLevels });
        return subLevels;
    },
    getSubLevelByDocId: (docId) => {
        const findSubLevel = get().subLevels.find((subLevel) => subLevel.id === docId);
        if (!findSubLevel) return null;
        return findSubLevel;
    }
});

export const useSubLevelStore = create<ISubLevelState & ISubLevelActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "sublevel-store",
                storage: createJSONStorage(() => AsyncStorage),
            })
        )
    )
);
