import axios from './axiosInstance';
import type { CountryLanguageResponse } from '../types/CountryLanguage';

export const getAllCountryLanguages = async (): Promise<CountryLanguageResponse> =>{
    const response = await axios.get<CountryLanguageResponse>('/country-languages');
    console.log('All country languages:', response.data);
    return response.data;
}