import {useQuery} from '@tanstack/react-query';
import { getAllCountryLanguages } from '../api/CountryLanguageApi';
import type { CountryLanguage } from '../types/CountryLanguage';

export const useCountryLanguage = () =>{
    return useQuery<CountryLanguage[]>({
        queryKey: ['AllCountries'],
        queryFn: getAllCountryLanguages,
    });
}