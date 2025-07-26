// src/api/countryAPI.ts
import axios from './axiosInstance';
import type { CountryListResponse } from '../types/Country';

// With query params:
export const getCountries = async (
  params: Record<string, string | number> = {}
): Promise<CountryListResponse> => {
  const response = await axios.get<CountryListResponse>('/countries', {
    params,
  });
  console.log('All countries:', response.data);
  return response.data;
};
