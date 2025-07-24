import axios from './axiosInstance';
import type { City } from '../types/City';

export const getAllCities = async (): Promise<City[]> =>{
    const response =await axios.get<City[]>('/cities');
    console.log('All cities:', response.data);
    return response.data;
}