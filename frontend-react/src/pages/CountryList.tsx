// src/pages/CountryList.tsx
import React from 'react';
import { useCountries } from '../hooks/useCountries';

const CountryList: React.FC = () => {
  const { data, isLoading, error } = useCountries();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading countries</p>;

  return (
    <ul>
      <p>List of Countries:</p>
      <p>Total: {data?.length}</p>
      <p>Each country is represented by the following fields:</p>
      <p>Code - Name - Continent - Region - Surface Area - Population - Life Expectancy - GNP - GNPOld - Local Name - Government Form - Head of State - Capital - Code2</p>
      {data?.map(country => (
        <li key={country.id}>
            <strong>{country.Code}</strong> -
            <b>{country.Name}</b>-
            {country.Continent} -
            {country.Region} -
            {country.SurfaceArea} -
            {country.Population} -
            {country.LifeExpectancy} -
            {country.GNP} -
            {country.GNPOld} -
            {country.LocalName} -
            {country.GovernmentForm} -
            {country.HeadOfState} -
            {country.Capital} -
            {country.Code2}
        </li>
      ))}
    </ul>
  );
};

export default CountryList;
