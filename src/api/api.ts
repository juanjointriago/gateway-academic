import axios, { InternalAxiosRequestConfig } from "axios";
import { URL_API, WASI_TOKEN, WASI_ID_COMPANY } from '../constants/Constants';

export const API = axios.create({ baseURL: URL_API });

API.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    config.params = config.params || {};
    config.params['wasi_token'] = WASI_TOKEN;
    config.params["id_company"] = WASI_ID_COMPANY;
    return config
}, (error) => {
    return Promise.reject(error);
});


export default API;