export interface CountryLanguage{
    id:number,
    CountryCode:string;
    Language:string;
    IsOfficial:boolean; // boolean
    Percentage:number; // decimal(4,1)
}

export interface CountryLanguageResponse {
    success: string;
    languages: CountryLanguage[];
    pagination: {
        count: number;
        total: number;
        page: number;
        totalPages: number;
    };
    filters?:{
        countryCode?: string;
        language?: string;
        isOfficial?: boolean;
        minPercentage?: number;
        maxPercentage?: number;
        sort:string;
        fields:[];
    }
}