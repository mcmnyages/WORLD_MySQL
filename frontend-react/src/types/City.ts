export interface City {
  ID: number;
  Name: string; // char(35)
  CountryCode:string;
  District: string; // char(20)
 Population: number; // int
}

export interface CityResponse {
  success: boolean;
  cities: City[];
  pagination?: {
    totalCount: number;
    page: number;
    limit: number;
  };
  message?: string;
  error?: string;
}