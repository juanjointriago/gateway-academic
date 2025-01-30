import { fileStorage } from "@/src/helpers/fileSystemZustand"
import { ILevel } from "@/src/interfaces"
import { LevelService } from "@/src/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create, StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface ILevelState {
    levels: ILevel[]
}

interface ILevelActions {
    getAllLevels: () => Promise<ILevel[]>
    getLevelByDocId: (docId: string) => ILevel | null

    clearStoreLevels: () => void
}

const storeApi: StateCreator<ILevelState & ILevelActions, [["zustand/immer", never]]> = (set, get) => ({
    levels: [],
    getAllLevels: async () => {
        const levels = await LevelService.getAllLevels();
        set({ levels: levels });
        return levels;
    },
    getLevelByDocId: (docId: string) => {
        const findLevel = get().levels.find((level) => level.id === docId);
        if (!findLevel) return null;
        return findLevel;
    },

    clearStoreLevels: () => {
        set({ levels: [] });
    }
});

export const useLevelStore = create<ILevelState & ILevelActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "level-store",
                storage: createJSONStorage(() => fileStorage),
            })
        )
    )
);