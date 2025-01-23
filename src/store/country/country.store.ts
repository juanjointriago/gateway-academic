import { ICity, ICountry, IRegion, IRespCountries, IRespRegions } from "@/src/interfaces";
import { create, StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/src/api/api";

interface ICountryState {
    countries: ICountry[]
    regions: IRegion[]
    cities: ICity[]
}

interface ICountryActions {
    fetchCountries: () => Promise<void>
    fetchRegions: (idCountry: number) => Promise<void>
    fetchCities: (idRegion: number) => Promise<void>
}

const storeApi: StateCreator<ICountryState & ICountryActions, [["zustand/immer", never]]> = (set, get) => ({
    countries: [],
    regions: [],
    cities: [],
    fetchCountries: async () => {
        const getCountries = await API.get<IRespCountries>('/all-countries');
        if(!getCountries.data) return;
        set({ countries: Object.values(getCountries.data) });
    },
    fetchRegions: async (idCountry) => {
        const getRegions = await API.get<IRespRegions>(`regions-from-country/${idCountry}`);
        if(!getRegions.data) return;
        set({ regions: Object.values(getRegions.data) });
    },
    fetchCities: async (idRegion) => {
        const getCities = await API.get<IRespRegions>(`cities-from-region/${idRegion}`);
        if(!getCities.data) return;
        set({ cities: Object.values(getCities.data) });
    },
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