import axios from './axiosInstance';
import type { CityResponse } from '../types/City';

export const getCities = async (): Promise<CityResponse> =>{
    const response =await axios.get<CityResponse>('/cities');
    console.log('All cities:', response.data);
    return response.data;
}