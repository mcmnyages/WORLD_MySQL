import CountryLanguageItem from "../components/CountryLanguage/CountryLanguageItem"
import {useCountryLanguage} from "../hooks/useCountryLanguage";


export default function CoutryLanguagesList(){

    const {data, isLoading, error} = useCountryLanguage();

    if(isLoading) return <p>Please wait as we fetch the Languages, Loading...</p>;
    if(error) return <p>There was an error loading the languages</p>;

    return(
        <div>
            <h1>List of Languages</h1>
            <p>Total: {data?.length}</p>
            <ul>
                {data?.map((countryLanguage) => (
                    <CountryLanguageItem key={`${countryLanguage.CountryCode}-${countryLanguage.Language}`} countryLanguage={countryLanguage} />
                ))}
            </ul>
        </div>
    )
}