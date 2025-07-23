// src/api/countryAPI.ts
import axios from './axiosInstance';
import type { Country } from '../types/Country';

export const getAllCountries = async (): Promise<Country[]> => {
  const response = await axios.get<Country[]>('/countries');
   console.log('All countries:',response.data);
  return response.data;
};
export const getCountryByCode = async (code: string): Promise<Country> => {
  const response = await axios.get<Country>(`/countries/${code}`);
   console.log('Countries by code',response.data);
  return response.data;
 
};