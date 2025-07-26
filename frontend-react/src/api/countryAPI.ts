// src/api/countryAPI.ts
import axios from './axiosInstance';
import type { CountryListResponse } from '../types/Country';

export const getAllCountries = async (): Promise<CountryListResponse> => {
  const response = await axios.get<CountryListResponse>('/countries');
   console.log('All countries:',response.data);
  return response.data;
};
