import type{ CountryLanguage } from "../../types/CountryLanguage";

type CountryLanguageItemProps = {
    countryLanguage: CountryLanguage;
}

export  default function CountryLanguageItem ({countryLanguage}: CountryLanguageItemProps) {
    return (
        <li>
           Country Code: <strong>{countryLanguage.CountryCode}</strong><br />
           Language: <em>{countryLanguage.Language}</em><br />
            Official: {countryLanguage.IsOfficial ? 'Yes' : 'No'} <br />
            Percentage: {countryLanguage.Percentage}% <br />
            <br />            
        </li>
    );
}
