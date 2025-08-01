// hooks/useWorldData.ts
import { useState, useEffect, useCallback } from 'react';
import type{ WorldDataFilters, WorldDataResponse, FilterOptions } from '../types/worldData';
import { worldDataApi } from '../api/worldDataApi';

export const useWorldData = () => {
  const [data, setData] = useState<WorldDataResponse | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<WorldDataFilters>({
    page: 1,
    limit: 20,
    sort: 'country_name_asc'
  });

  const fetchData = useCallback(async (newFilters?: Partial<WorldDataFilters>) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters ? { ...filters, ...newFilters } : filters;
      const response = await worldDataApi.getWorldData(currentFilters);
      setData(response);
      setFilters(currentFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const options = await worldDataApi.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<WorldDataFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }; // Reset to first page
    fetchData(updatedFilters);
  }, [fetchData, filters]);

  const changePage = useCallback((page: number) => {
    fetchData({ page });
  }, [fetchData]);

  const resetFilters = useCallback(() => {
    const defaultFilters: WorldDataFilters = {
      page: 1,
      limit: 20,
      sort: 'country_name_asc'
    };
    setFilters(defaultFilters);
    fetchData(defaultFilters);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    fetchFilterOptions();
  }, []);

  return {
    data,
    filterOptions,
    loading,
    error,
    filters,
    updateFilters,
    changePage,
    resetFilters,
    refetch: () => fetchData()
  };
};