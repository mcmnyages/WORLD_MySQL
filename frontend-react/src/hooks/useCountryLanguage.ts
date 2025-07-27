import {useQuery} from '@tanstack/react-query';
import { getAllCountryLanguages } from '../api/CountryLanguageApi';
import type { CountryLanguageResponse } from '../types/CountryLanguage';

export const useCountryLanguage = (params:Record<string, string|number>) =>{
    return useQuery<CountryLanguageResponse>({
        queryKey: ['AllCountries',params],
        queryFn: () => getAllCountryLanguages(params),
    });
}