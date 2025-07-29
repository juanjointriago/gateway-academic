import { IAppInfo } from "@/src/interfaces/appinfo.interface";
import { AppInfoService } from "@/src/services/appinfo/appinfo.service";
import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface AppInfoStore {
  appInfo: IAppInfo;
  setAppInfo: () => Promise<void>;
}

const storeAPI: StateCreator<AppInfoStore> = (set) => ({
  appInfo: {} as IAppInfo,
  setAppInfo: async () => {
    try {
      const appInfo = await AppInfoService.getAppInfo();
      if (!appInfo) {
        console.warn("No se pudo obtener la información de la aplicación");
      }
      set({ appInfo: appInfo[0] });
    } catch (error) {
      console.error("Error fetching app info:", error);
    }
  },
});

export const useAppInfoStore = create<AppInfoStore>()(
  persist(storeAPI, {
    name: "appinfo-store",
    storage: createJSONStorage(() => AsyncStorage),
  })
);