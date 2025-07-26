import {useCities} from '../hooks/useCity';
import CityItem from '../components/City/CityItem';


export default function CitiesList(){



    const {isLoading, error, data} = useCities();


    if(isLoading) return <p>Wait as we Fetch the Cities, Loading...</p>;
    
    if(error) return <p>Error loading cities</p>
    return(
        <div>
            <p>List of Cities:</p>
            <p>Total: {data?.pagination?.totalCount}</p>

            <p>Each city is represented by the following fields:</p>
            <p>Name - CountryCode - District - Population</p>
           {
            data?.cities?.map(city=>(
                    <CityItem key={city.ID} city={city} />
                ))
               }
               <br />
            
        </div>
    )
}