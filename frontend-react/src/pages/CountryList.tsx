import { useState } from 'react';
import { useCountries } from '../hooks/useCountries';
import CountryListItem from '../components/Country/CountryListItem';
import {useSearch} from '../hooks/useSearch';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/ui/Pagination/Pagination';

const CountryList: React.FC = () => {

  const [page, setPage] = useState(1);
 const { search, debouncedSearch, handleSearchChange } = useSearch();
  const { data, isLoading, error } = useCountries({ page, pageSize: 10, name: debouncedSearch });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading countries</p>;

 

  

  return (
    <div>
      <p>List of Countries:</p>

      <SearchInput
        value={search}
        onChange={(e) => {
          handleSearchChange(e);
          setPage(1); // Reset page when searching
        }}
        placeholder="Search countries..."
      />

      <p>Total: {data?.pagination.total}</p>
      <div> 
      </div>
      <ul>
        {data?.countries?.map((country) => (
          <CountryListItem key={country.Code} country={country} />
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={data?.pagination.totalPages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        pageSize={10}
        onPageSizeChange={(size) => console.log(`Page size changed to: ${size}`)}
      />
      <br />
    </div>
  );
};

export default CountryList;
