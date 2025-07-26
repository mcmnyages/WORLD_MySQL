import {useQuery} from '@tanstack/react-query';
import {getCities} from '../api/cityApi';
import type {CityResponse} from '../types/City';

export const useCities = () =>{
    return useQuery<CityResponse>({
        queryKey: ['AllCities'],
        queryFn: getCities,
    })
}