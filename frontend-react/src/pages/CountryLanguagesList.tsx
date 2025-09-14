import { useState } from "react";
import CountryLanguageItem from "../components/CountryLanguage/CountryLanguageItem";
import { useCountryLanguage } from "../hooks/useCountryLanguage";
import {useSearch} from '../hooks/useSearch';
import SearchInput from "../components/SearchInput";
import Pagination from "../components/ui/Pagination/Pagination";


export default function CountryLanguagesList() {

  const [page, setPage] = useState(1);
  const { search, debouncedSearch, handleSearchChange } = useSearch();
  const { data, isLoading, error } = useCountryLanguage({
    page,
    pageSize: 10,
    language: debouncedSearch,
  });

  
  

  if (isLoading) return <p>Please wait as we fetch the Languages, Loading...</p>;
  if (error) return <p>There was an error loading the languages</p>;

  return (
    <div className="p-4 mt-16">
      <h1>List of Languages</h1>
        <SearchInput
            value={search}
            onChange={(e) => {
            handleSearchChange(e);
            setPage(1); // Reset page when searching
            }}
            placeholder="Search languages..."
        />

      <p>Total: {data?.pagination?.total}</p>
      <ul>
        {data?.languages?.map((countryLanguage) => (
          <CountryLanguageItem
            key={`${countryLanguage.CountryCode}-${countryLanguage.Language}`}
            countryLanguage={countryLanguage}
          />
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={data?.pagination?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
