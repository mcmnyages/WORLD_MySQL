import { useQuery } from '@tanstack/react-query';
import { getCountries } from '../api/countryAPI';
import type { CountryListResponse } from '../types/Country';

export const useCountries = (params: Record<string, string | number>) => {
  return useQuery<CountryListResponse>({
    queryKey: ['AllCountries', params],
    queryFn: () => getCountries(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // cache lasts 5 minutes
  });
};
