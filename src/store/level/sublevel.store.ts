import { fileStorage } from "@/src/helpers/fileSystemZustand";
import { ISubLevel } from "@/src/interfaces"
import { SubLevelService } from "@/src/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ISubLevelState {
    subLevel: ISubLevel | null
}

interface ISubLevelActions {
    getSubLevelByDocId: (docId: string) => Promise<void>
    setSubLevel: (subLevel: ISubLevel) => void
    clearStoreSubLevels: () => void
}

const storeApi: StateCreator<ISubLevelState & ISubLevelActions, [["zustand/immer", never]]> = (set, get) => ({
    subLevel: null,
    getSubLevelByDocId: async (docId) => {
        try {
            const resp = await SubLevelService.getSubLevelByDocId(docId);
            set({ subLevel: resp });
        } catch (error) {
            console.log(error);
            set({ subLevel: null });
        }
    },
    setSubLevel: (subLevel) => {
        set({ subLevel: subLevel });
    },
    clearStoreSubLevels: () => {
        set({ subLevel: null });
    }
});

export const useSubLevelStore = create<ISubLevelState & ISubLevelActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "sublevel-store",
                storage: createJSONStorage(() => fileStorage),
            })
        )
    )
);
