import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistStorage, StorageValue } from "zustand/middleware";

export const zustandStorage = <T>(): PersistStorage<T> => ({
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ? (JSON.parse(value) as StorageValue<T>) : null;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: StorageValue<T>) => {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch {
      // AsyncStorage native module not ready — will persist on next state change
    }
  },
  removeItem: async (name: string) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // no-op
    }
  },
});
