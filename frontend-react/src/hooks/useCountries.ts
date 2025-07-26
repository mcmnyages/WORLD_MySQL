import { useQuery } from '@tanstack/react-query';
import { getAllCountries } from '../api/countryAPI';
import type { CountryListResponse } from '../types/Country';

export const useCountries = () => {
  return useQuery<CountryListResponse>({
    queryKey: ['AllCountries'],
    queryFn: getAllCountries,
  });
};
