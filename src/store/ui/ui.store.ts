import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "@/src/store/storage";

interface IUIState {
    themeMode: 'light' | 'dark';
}

interface IUIActions {
    toggleTheme: () => void;
    setTheme: (mode: 'light' | 'dark') => void;
}

const storeApi: StateCreator<IUIState & IUIActions> = (set, get) => ({
    themeMode: 'light',
    toggleTheme: () => set({ themeMode: get().themeMode === 'light' ? 'dark' : 'light' }),
    setTheme: (mode) => set({ themeMode: mode }),
});

export const useUIStore = create<IUIState & IUIActions>()(
    persist(storeApi, {
        name: 'ui-store',
        storage: zustandStorage(),
    })
);
