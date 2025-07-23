import { useQuery } from '@tanstack/react-query';
import { getAllCountries } from '../api/countryAPI';
import type { Country } from '../types/Country';

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ['AllCountries'],
    queryFn: getAllCountries,
  });
};
