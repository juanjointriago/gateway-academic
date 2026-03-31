import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { fee } from "@/src/interfaces/fees.interface";
import { FeesService } from "@/src/services/fees/fees.service";
import { zustandStorage } from "@/src/store/storage";

interface FeesStore {
  fees: fee[];
  getAndSetFees: () => Promise<void>;
  getFees: () => fee[];
  createFee: (fee: fee) => Promise<void>;
}

const storeAPI: StateCreator<FeesStore> = (
  set,
  get
) => ({
  fees: [],
  getAndSetFees: async () => {
    try {
      const fees = await FeesService.getFees();
      set({ fees: [...fees] });
      // console.debug('ALL FEES FOUNDED ===>', { fees })
    } catch (error) {
      console.warn(error);
    }
  },
  getFees: () => get().fees,
  createFee: async (fee: fee) => {
    await FeesService.createFee(fee);
    set({ fees: [...get().fees, fee] });
  },
});

export const useFeesStore = create<FeesStore>()(
    persist(storeAPI, {
      name: "fees-store",
      storage: zustandStorage(),
    })
);
