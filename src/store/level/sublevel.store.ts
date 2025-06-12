import { fileStorage } from "@/src/helpers/fileSystemZustand";
import { ISubLevel } from "@/src/interfaces"
import { SubLevelService } from "@/src/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ISubLevelState {
    subLevel: ISubLevel | null
    subLevels: ISubLevel[] 
}

interface ISubLevelActions {
    getSubLevelByDocId: (docId: string) => Promise<void>;
    getAllSubLevels: () => Promise<void>;
    getSubLevelById: (docId: string) => ISubLevel | undefined;
    setSubLevel: (subLevel: ISubLevel) => void;
    clearStoreSubLevels: () => void;
}

const storeApi: StateCreator<ISubLevelState & ISubLevelActions, [["zustand/immer", never]]> = (set, get) => ({
    subLevel: null,
    subLevels: [],
    getSubLevelByDocId: async (docId) => {
        try {
            const resp = await SubLevelService.getSubLevelByDocId(docId);
            set({ subLevel: resp });
        } catch (error) {
            console.debug(error);
            set({ subLevel: null });
        }
    },
    getAllSubLevels: async () => {
        try {
            const resp = await SubLevelService.getAllSubLevels();
            set({ subLevels: resp });
        } catch (error) {
            console.debug(error);
            set({ subLevel: null });
        }
    },
    getSubLevelById: (docId) => {
        try {
            const foundSublevel = get().subLevels.find((subLevel) => subLevel.id === docId);
            return foundSublevel
        } catch (error) {
            console.debug(error);
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
        immer(
            persist(storeApi, {
                name: "sublevel-store",
                storage: createJSONStorage(() => AsyncStorage),
            })
    )
);
