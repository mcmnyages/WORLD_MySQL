import { useCountries } from '../hooks/useCountries';
import CountryListItem from '../components/Country/CountryListItem';

const CountryList: React.FC = () => {
  const { data, isLoading, error } = useCountries();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading countries</p>;

  return (
    <ul>
      <p>List of Countries:</p>
      <p>Total: {data?.pagination.total}</p>
      {data?.countries.map((country)=> (
        <CountryListItem key={country.Code} country={country} />
      ))}
    </ul>
  );
};

export default CountryList;
