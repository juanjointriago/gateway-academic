import { create, StateCreator } from "zustand";
import { UserService } from "../../services";
import { createJSONStorage, persist } from "zustand/middleware";
import { FirestoreUser, role } from "@/src/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UsersStore {
  users: FirestoreUser[];
  getAllUsers: () => void;
  getUserById: (id: string) => FirestoreUser | undefined;
  getUserByRole: (id: role) => FirestoreUser[] | [];
}

const storeAPI: StateCreator<UsersStore> = (
  set,
  get
) => ({
  users: [],
  getAllUsers: async () => {
    try {
      const users = await UserService.getUsers();
      set({ users: [...users] });
    } catch (error) {
      console.warn(error);
    }
  },

  getUserById: (uid: string) => get().users.find((user) => user.uid === uid),
  getUserByRole: (role: role) =>
    get().users.filter((user) => user.role === role),
});

export const useUserStore = create<UsersStore>()(
  persist(storeAPI, {
    name: "user-store",
    storage: createJSONStorage(() => AsyncStorage),
  })
);
