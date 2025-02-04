import axios from "axios";
import { URL_API } from '../constants/Constants';

export const API = axios.create({ baseURL: URL_API });

export default API;