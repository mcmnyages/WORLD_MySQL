import axios from 'axios';
import type{ WorldDataFilters, WorldDataResponse, FilterOptions } from '../types/worldData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class WorldDataApi {
  private api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  });

  async getWorldData(filters: WorldDataFilters): Promise<WorldDataResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await this.api.get(`/countries?${params.toString()}`);
    console.log('World data response:', response);
    return response.data;
  }

  async getFilterOptions(): Promise<FilterOptions> {
    const response = await this.api.get('/countries/filter-options');
    console.log('Filter options:', response);
    return response.data.options;
  }
}

export const worldDataApi = new WorldDataApi();
