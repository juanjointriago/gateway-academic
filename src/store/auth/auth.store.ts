import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IUser, LoginSchemaType } from "@/src/interfaces";
import { AuthService } from "@/src/services";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IAuthState {
    status: "pending" | "unauthorized" | "authorized";
    user: IUser | null;
    errorMessage: string | null;
}

interface IAuthActions {
    loginUser: ({ email, password }: LoginSchemaType) => Promise<boolean>;
    loginWithGoogle: () => Promise<boolean>;
    logoutUser: () => void;
    setUser: (user: IUser | null) => void;
    clearError: () => void;
}

const storeApi: StateCreator<IAuthState & IAuthActions, [["zustand/immer", never]]> = (set, get) => ({
    status: 'pending',
    user: null,
    errorMessage: null,
    loginUser: async ({ email, password }) => {
        try {
            const user = await AuthService.login({ email, password });
            set({ status: 'authorized', user: user, errorMessage: null });
            return true;
        } catch (error: any) {
            set({ status: 'unauthorized', user: null, errorMessage: error.message });
            return false;
        }
    },

    loginWithGoogle: async () => {
        try {
            const user = await AuthService.loginWithGoogle();
            set({ status: 'authorized', user: user, errorMessage: null });
            return true;
        } catch (error: any) {
            set({ status: 'unauthorized', user: null, errorMessage: error.message });
            return false;
        }
    },
    
    logoutUser: async () => {
        try {
            await AuthService.logout();
            set({ status: 'unauthorized', user: null, errorMessage: null });
        } catch (error: any) {
            set({ status: 'unauthorized', user: null, errorMessage: error.message });
        }
    },
    setUser: (user) => {
        if (!user) return set({ status: 'unauthorized', user: null, errorMessage: null });
        set({ status: 'authorized', user: user, errorMessage: null });
    },
    clearError: () => {
        set({ errorMessage: null });
    },
});

export const useAuthStore = create<IAuthState & IAuthActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "auth-store",
                storage: createJSONStorage(() => AsyncStorage),
            })
        )
    )
);