// types/worldData.ts
export interface WorldDataFilters {
  // Country filters
  region?: string;
  continent?: string;
  countryName?: string;
  countryCode?: string;
  localName?: string;
  governmentForm?: string;
  headOfState?: string;
  minPopulation?: number;
  maxPopulation?: number;
  minSurfaceArea?: number;
  maxSurfaceArea?: number;
  minLifeExpectancy?: number;
  maxLifeExpectancy?: number;
  minGNP?: number;
  maxGNP?: number;
  minIndepYear?: number;
  maxIndepYear?: number;
  
  // City filters
  cityName?: string;
  district?: string;
  minCityPopulation?: number;
  maxCityPopulation?: number;
  
  // Language filters
  language?: string;
  isOfficial?: boolean;
  minLanguagePercentage?: number;
  maxLanguagePercentage?: number;
  
  // Options
  includeCapitalOnly?: boolean;
  includeOfficialLanguagesOnly?: boolean;
  groupBy?: 'country' | 'city' | 'language';
  
  // Meta
  sort?: string;
  fields?: string;
  page?: number;
  limit?: number;
}

export interface WorldDataItem {
  country_code: string;
  country_name: string;
  continent: string;
  region: string;
  surface_area: number;
  independence_year: number;
  country_population: number;
  life_expectancy: number;
  gnp: number;
  gnp_old: number;
  local_name: string;
  government_form: string;
  head_of_state: string;
  capital_id: number;
  country_code2: string;
  city_id: number;
  city_name: string;
  city_country_code: string;
  district: string;
  city_population: number;
  capital_name: string;
  capital_population: number;
  language_name: string;
  is_official: string;
  language_percentage: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  count: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface WorldDataStatistics {
  countries_count: number;
  cities_count: number;
  languages_count: number;
  avg_country_population: number;
  total_population: number;
  avg_life_expectancy: number;
  continents_count: number;
  avg_city_population: number;
  avg_language_percentage: number;
  totalCount: number;
}

export interface WorldDataResponse {
  success: boolean;
  filters: WorldDataFilters;
  pagination: PaginationInfo;
  statistics: WorldDataStatistics;
  countries: WorldDataItem[];
}

export interface FilterOptions {
  continents: string[];
  regions: string[];
  languages: string[];
  governmentForms: string[];
  sortOptions: { value: string; label: string }[];
  fieldCategories: string[];
}