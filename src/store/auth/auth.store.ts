import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IResLocalFirebase, IUser, LoginSchemaType, RegisterSchemaType } from "@/src/interfaces";
import { AuthService, UserService } from "@/src/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface IAuthState {
    status: "pending" | "unauthorized" | "authorized";
    user: IUser | null;
}

interface IAuthActions {
    loginUser: ({ email, password }: LoginSchemaType) => Promise<IResLocalFirebase<IUser>>;
    loginWithGoogle: () => Promise<boolean>;
    logoutUser: () => void;
    registerUser: (user: RegisterSchemaType) => Promise<IResLocalFirebase<FirebaseAuthTypes.User>>;
    updateUser: (user: IUser) => Promise<IUser | null>;
    setUser: (user: IUser | null) => void;
}

const storeApi: StateCreator<IAuthState & IAuthActions, [["zustand/immer", never]]> = (set, get) => ({
    status: 'pending',
    user: null,
    loginUser: async ({ email, password }) => {
        const resp = await AuthService.login({ email, password });
        if (resp.error) {
            set({ status: 'unauthorized', user: null });
            return resp;
        }
        set({ status: 'authorized', user: resp.data });
        return resp;
    },

    loginWithGoogle: async () => {
        try {
            const user = await AuthService.loginWithGoogle();
            set({ status: 'authorized', user: user });
            return true;
        } catch (error: any) {
            set({ status: 'unauthorized', user: null });
            return false;
        }
    },

    registerUser: async (user) => {
        const response = await AuthService.registerWithEmail(user);
        return response;
    },

    updateUser: async (user) => {
        const response = await UserService.updateUser(user);
        set({ user: { ...get().user, ...user } });
        return response;
    },
    logoutUser: async () => {
        await AuthService.logout();
        set({ status: 'unauthorized', user: null });
    },
    setUser: (user) => {
        if (!user) return set({ status: 'unauthorized', user: null });
        set({ status: 'authorized', user: user });
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