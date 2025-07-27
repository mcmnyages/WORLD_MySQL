import  { useState } from 'react';
import {useCities} from '../hooks/useCity';
import CityItem from '../components/City/CityItem';
import { useSearch } from '../hooks/useSearch';
import SearchInput from '../components/SearchInput'


export default function CitiesList(){

    const [page, setPage] = useState(1);
    const { search, debouncedSearch, handleSearchChange } = useSearch();

    const goPrev = () => setPage((prev) => Math.max(prev - 1, 1));
            const goNext = () => {
                if (data?.pagination?.totalPages) {
                    setPage((next) => Math.min(next + 1, data?.pagination?.totalPages ?? 1));
                }
            };

    const goFirst = () => setPage(1);
    const goLast = () => {
        if (data?.pagination?.totalPages) {
            setPage(data.pagination.totalPages ?? 1);
        }
    }

    const {isLoading, error, data} = useCities({ page, pageSize: 10 ,name: debouncedSearch });


    if(isLoading) return <p>Wait as we Fetch the Cities, Loading...</p>;
    
    if(error) return <p>Error loading cities</p>
    return(
        <div>
            <p>List of Cities:</p>
            <p>Total: {data?.pagination?.total}</p>

            <p>Each city is represented by the following fields:</p>
             <SearchInput
               value={search}
               onChange={(e) => {
                 handleSearchChange(e);
                 setPage(1); // Reset page when searching
               }}
               placeholder="Search cities..."
             />
            <p>Name - CountryCode - District - Population</p>
           {
            data?.cities?.map(city=>(
                    <CityItem key={city.ID} city={city} />
                ))
               }
               <br />

            <div>
                <button onClick={goFirst} disabled={page === 1}>
                    First
                </button>
                <button onClick={goPrev} disabled={page === 1}>
                    Prev
                </button>

                <span>
                    Page {page} of {data?.pagination?.totalPages}
                </span>

                <button onClick={goNext} disabled={page === (data?.pagination?.totalPages ?? 1)}>
                    Next
                </button>
                <button onClick={goLast} disabled={page === (data?.pagination?.totalPages ?? 1)}>
                    Last
                </button>
                {isLoading && <p>Updating...</p>}
                <br />

            </div>
        </div>
    )
}