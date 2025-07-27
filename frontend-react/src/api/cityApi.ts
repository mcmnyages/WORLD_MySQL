import axios from './axiosInstance';
import type { CityResponse } from '../types/City';

export const getCities = async (
    params:Record<string, string | number>={}
    ): Promise<CityResponse> =>{
    const response =await axios.get<CityResponse>('/cities',{
        params,
    });
    console.log('All cities:', response.data);
    return response.data;
}