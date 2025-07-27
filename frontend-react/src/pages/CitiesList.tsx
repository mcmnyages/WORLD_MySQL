import  { useState } from 'react';
import {useCities} from '../hooks/useCity';
import CityItem from '../components/City/CityItem';
import { useSearch } from '../hooks/useSearch';
import SearchInput from '../components/SearchInput'
import Pagination from '../components/ui/Pagination/Pagination';


export default function CitiesList(){

    const [page, setPage] = useState(1);
    const { search, debouncedSearch, handleSearchChange } = useSearch();

    
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

            <Pagination
                currentPage={page}
                totalPages={data?.pagination?.totalPages ?? 1}
                onPageChange={setPage}
                isLoading={isLoading}
                pageSize={10}
                onPageSizeChange={(size) => console.log(`Page size changed to: ${size}`)}
            />
            <br />
            
        </div>
    )
}