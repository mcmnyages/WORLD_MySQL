import {useQuery} from '@tanstack/react-query';
import { getAllCountryLanguages } from '../api/CountryLanguageApi';
import type { CountryLanguageResponse } from '../types/CountryLanguage';

export const useCountryLanguage = () =>{
    return useQuery<CountryLanguageResponse>({
        queryKey: ['AllCountries'],
        queryFn: getAllCountryLanguages,
    });
}