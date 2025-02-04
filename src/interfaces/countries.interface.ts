export interface IResData<T> {
    error: boolean;
    msg: string;
    data: T;
}



export interface IResProvince {
    name: string;
    iso3: string;
    iso2: string;
    states: IState[];
}

export interface IState {
    name: string;
    state_code: string;
}