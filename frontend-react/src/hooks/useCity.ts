import {useQuery} from '@tanstack/react-query';
import {getCities} from '../api/cityApi';
import type {CityResponse} from '../types/City';

export const useCities = (params: Record<string, string | number>) =>{
    return useQuery<CityResponse>({
        queryKey: ['AllCities', params],
        queryFn: ()=>getCities(params),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000, // cache lasts 5 minutes
        // refetchOnWindowFocus: false, // Optional: disable refetching on window focus
    })
}