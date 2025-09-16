// hooks/useWorldData.ts
import { useQuery} from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import type { WorldDataFilters, WorldDataResponse, FilterOptions } from '../types/worldData';
import { worldDataApi } from '../api/worldDataApi';

const DEFAULT_FILTERS: WorldDataFilters = {
  page: 1,
  limit: 20,
  sort: 'country_name_asc'
};

export const useWorldData = () => {

  const [filters, setFilters] = useState<WorldDataFilters>(DEFAULT_FILTERS);

  // Fetch world data with filters
  const {
    data,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<WorldDataResponse, Error>({
    queryKey: ['worldData', filters],
    queryFn: () => worldDataApi.getWorldData(filters),
    placeholderData: (previousData) => previousData, // good for paginated UIs
  });

  // Fetch filter options (once)
  const {
    data: filterOptions,
  } = useQuery<FilterOptions, Error>({
    queryKey: ['worldDataFilterOptions'],
    queryFn: () => worldDataApi.getFilterOptions(),
    staleTime: Infinity,
  });

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<WorldDataFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    data,
    filterOptions,
    filters,
    loading: isLoading || isFetching,
    error: error?.message ?? null,
    updateFilters,
    changePage,
    resetFilters,
    refetch,
  };
};
