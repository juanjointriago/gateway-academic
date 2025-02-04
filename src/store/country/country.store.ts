import { IResData, IResProvince, IState } from "@/src/interfaces";
import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/api/api";
import { COUNTRY } from "@/src/constants/Constants";

interface ICountryState {
    regions: IState[]
    cities: string[]
}

interface ICountryActions {
    fetchRegions: () => Promise<void>
    fetchCities: (state: string) => Promise<void>

    clearStoreCountries: () => void
}

const storeApi: StateCreator<ICountryState & ICountryActions, [["zustand/immer", never]]> = (set, get) => ({
    regions: [],
    cities: [],
    fetchRegions: async () => {
        const getRegions = await API.post<IResData<IResProvince>>(`/countries/states`, { country: COUNTRY });
        if (!getRegions.data) return;
        set({ regions: getRegions.data.data.states });
    },
    fetchCities: async (state) => {
        const getCities = await API.post<IResData<string[]>>(`/countries/state/cities`, { country: COUNTRY, state });
        if (!getCities.data) return;
        set({ cities: getCities.data.data });
    },

    clearStoreCountries: () => {
        set({ cities: [], regions: [] });
    }
});

export const useCountryStore = create<ICountryState & ICountryActions>()(
    devtools(
        immer(
            persist(storeApi, {
                name: "country-store",
                storage: createJSONStorage(() => AsyncStorage),
            })
        )
    )
);