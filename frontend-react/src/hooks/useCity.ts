import {useQuery} from '@tanstack/react-query';
import {getAllCities} from '../api/cityApi';
import type {City} from '../types/City';

export const useCities = () =>{
    return useQuery<City[]>({
        queryKey: ['AllCities'],
        queryFn: getAllCities,
    })
}