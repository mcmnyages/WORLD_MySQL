import type {Country} from "../../types/Country"

type CountryListItemProps ={
    country: Country;
}

export  default function  CountryListItem ({country}: CountryListItemProps) {
    return(
        <div>
       <li>
  Country: <strong>{country.Name}</strong><br />
  Code: {country.Code} <br />
  Continent: {country.Continent} <br />
  Region: {country.Region} <br />
  Surface Area: {country.SurfaceArea} km² <br />
  Population: {country.Population} <br />
  Independence Year: {country.IndepYear ?? 'N/A'} <br />
  Life Expectancy: {country.LifeExpectancy ?? 'N/A'} <br />
  GNP: {country.GNP ?? 'N/A'} <br />
  GNP (Old): {country.GNPOld ?? 'N/A'} <br />
  Local Name: {country.LocalName} <br />
  Government Form: {country.GovernmentForm} <br />
  Head of State: {country.HeadOfState ?? 'N/A'} <br />
  Capital ID: {country.Capital ?? 'N/A'} <br />
  Code2: {country.Code2}
</li>
<br/>
</div>
    )
}