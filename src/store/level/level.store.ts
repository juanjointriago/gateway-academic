import { ILevel } from "@/src/interfaces"
import { LevelService } from "@/src/services"
import { create, StateCreator } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { zustandStorage } from "@/src/store/storage"

interface ILevelState {
    level: ILevel | null
}

interface ILevelActions {
    getLevelByDocId: (docId: string) => Promise<void>
    setLevel: (level: ILevel) => void
    clearStoreLevels: () => void
}

const storeApi: StateCreator<ILevelState & ILevelActions> = (set, get) => ({
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
            persist(storeApi, {
                name: "level-store",
                storage: zustandStorage(),
            })
);