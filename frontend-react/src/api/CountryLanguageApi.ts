import axios from './axiosInstance';
import type { CountryLanguage } from '../types/CountryLanguage';

export const getAllCountryLanguages = async (): Promise<CountryLanguage[]> =>{
    const response = await axios.get<CountryLanguage[]>('/country-languages');
    console.log('All country languages:', response.data);
    return response.data;
}