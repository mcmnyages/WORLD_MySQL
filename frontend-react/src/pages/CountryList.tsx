import { useState } from 'react';
import { useCountries } from '../hooks/useCountries';
import CountryListItem from '../components/Country/CountryListItem';

const CountryList: React.FC = () => {

  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useCountries({ page, pageSize: 10 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading countries</p>;

  const goFirst=()=> setPage(1);
  const goLast = () => {
    if (data?.pagination?.totalPages) {
      setPage(data.pagination.totalPages);
    }
  }

  const goPrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goNext = () => {
    if (data?.pagination?.totalPages) {
    setPage((prev) => Math.min(prev + 1, data.pagination.totalPages));
  }
}

  return (
    <div>
      <p>List of Countries:</p>
      <p>Total: {data?.pagination.total}</p>

      <ul>
        {data?.countries?.map((country) => (
          <CountryListItem key={country.Code} country={country} />
        ))}
      </ul>

      <div>
        <button onClick={goFirst} disabled={page === 1}>
          First
        </button>
        <button
          onClick={goPrev }
          disabled={page === 1}
        >
          Prev
        </button>

        <span >
          Page {page} of {data?.pagination.totalPages}
        </span>

        <button
          onClick={goNext}
          disabled={page === data?.pagination.totalPages}
        >
          Next
        </button>
        <button onClick={goLast} disabled={page === data?.pagination.totalPages}>
          Last
        </button>

        {isFetching && <p>Updating...</p>}
      </div>
    </div>
  );
};

export default CountryList;
