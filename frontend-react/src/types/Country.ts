export interface Country {
  id: number; // auto-incremented primary key
  Code: string; // char(3)
  Name: string; // char(52)
  Continent:
    | 'Asia'
    | 'Europe'
    | 'North America'
    | 'Africa'
    | 'Oceania'
    | 'Antarctica'
    | 'South America'; // enum
  Region: string; // char(26)
  SurfaceArea: number; // decimal(10,2)
  IndepYear: number | null; // smallint (nullable)
  Population: number; // int
  LifeExpectancy: number | null; // decimal(3,1)
  GNP: number | null; // decimal(10,2)
  GNPOld: number | null; // decimal(10,2)
  LocalName: string; // char(45)
  GovernmentForm: string; // char(45)
  HeadOfState: string | null; // char(60)
  Capital: number | null; // int
  Code2: string; // char(2) — seems you forgot to include this field's full row, but I’m filling it in
}

export interface CountryListResponse {
  success: string;
  message: string;
  countries: Country[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
}