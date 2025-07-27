import axios from './axiosInstance';
import type { CountryLanguageResponse } from '../types/CountryLanguage';

export const getAllCountryLanguages = async (params:Record<string, string | number>): Promise<CountryLanguageResponse> =>{
    const response = await axios.get<CountryLanguageResponse>('/country-languages', {
        params,
    });
    console.log('All country languages:', response.data);
    return response.data;
}