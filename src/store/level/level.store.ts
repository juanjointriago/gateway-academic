import { ILevel } from "@/src/interfaces"
import { LevelService } from "@/src/services"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create, StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

interface ILevelState {
    level: ILevel | null
}

interface ILevelActions {
    getLevelByDocId: (docId: string) => Promise<void>
    setLevel: (level: ILevel) => void
    clearStoreLevels: () => void
}

const storeApi: StateCreator<ILevelState & ILevelActions, [["zustand/immer", never]]> = (set, get) => ({
    level: null,
    getLevelByDocId: async (docId) => {
        const level = await LevelService.getLevelByDocId(docId);
        set({ level: level });
    },
    setLevel: (level) => {
        set({ level: level });
    },
    clearStoreLevels: () => {
        set({ level: null });
    }
});

export const useLevelStore = create<ILevelState & ILevelActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "level-store",
                storage: createJSONStorage(() => AsyncStorage),
            })
        )
    )
);