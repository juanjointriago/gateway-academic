import { progressSheetInterface } from "@/src/interfaces/progress-sheet.interface";
import { ProgressSheetService } from "@/src/services/progress-sheet/progress-sheet.service";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProgressSheetStore {
  progressSheets: progressSheetInterface[];
  getAndSetProgressSheets: () => Promise<void>;
  getAllProgressSheets: () => progressSheetInterface[];
  getProgressSheetById: (id: string) => progressSheetInterface | undefined;
  getProgressSheetByStudentId: (
    id: string
  ) => progressSheetInterface | undefined;
}

const storeAPI: StateCreator<ProgressSheetStore> = (set, get) => ({
  progressSheets: [],
  getAndSetProgressSheets: async () => {
    try {
      const progressSheets = await ProgressSheetService.getProgressSheet();
      // console.debug("------- :) =>", { progressSheets });
      set({ progressSheets: progressSheets });
    } catch (error) {
      console.warn(error);
    }
  },
  getAllProgressSheets: () => get().progressSheets,

  getProgressSheetById: (id: string) =>
    get().progressSheets.find((progressSheet) => progressSheet.id === id),
  getProgressSheetByStudentId: (id: string) =>
    get().progressSheets.find(
      (progressSheet) => progressSheet.studentId === id
    ),
});

export const useProgressSheetStore = create<ProgressSheetStore>()(
  persist(storeAPI, {
    name: "progresssheet-store",
    storage: createJSONStorage(() => AsyncStorage),
  })
);
