import type { City } from "../../types/City";

type CityItemProps = {
  city: City;
};

export default function CityItem({ city }: CityItemProps) {
  return (
    <li>
  City: <strong>{city.Name}</strong><br />
  Country Code: {city.CountryCode} <br />
  District: {city.District} <br />
  Population: {city.Population.toLocaleString()}
</li>

  );
}