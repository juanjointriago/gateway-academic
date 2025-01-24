export interface IRespCountries {
    [key: string]: ICountryData;
}

export interface ICountryData {
    id_country: number;
    name: string;
    iso: string;
}


export interface IRespRegions {
    [key: string]: IRegionData;
}

export interface IRegionData {
    id_region: number;
    name: string;
    id_country: number;
}


export interface IRespCities {
    [key: string]: ICityData;
}

export interface ICityData {
    id_city: number;
    name: string;
    id_region: number;
}
