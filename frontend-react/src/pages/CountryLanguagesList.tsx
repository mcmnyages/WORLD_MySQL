import {useState} from "react";
import CountryLanguageItem from "../components/CountryLanguage/CountryLanguageItem"
import {useCountryLanguage} from "../hooks/useCountryLanguage";


export default function CoutryLanguagesList(){
    const [page, setPage]= useState(1);
    const {data, isLoading, error} = useCountryLanguage({page,pageSze:10});

    const goPrev = () => setPage((prev) => Math.max(prev - 1, 1));

    const goNext = () => {
        if (data?.pagination?.totalPages) {
            setPage((next) => Math.min(next + 1, data.pagination.totalPages));
        }
    }; 

    const goFirst =()=>setPage(1);
    const goLast= () =>{
        if(data?.pagination?.totalPages){
            setPage(data.pagination.totalPages);
        }
    }

    if(isLoading) return <p>Please wait as we fetch the Languages, Loading...</p>;
    if(error) return <p>There was an error loading the languages</p>;

    return(
        <div>
            <h1>List of Languages</h1>
            <p>Total: {data?.pagination?.totalCount}</p>
            <ul>
                {data?.languages?.map((countryLanguage) => (
                    <CountryLanguageItem
                     key={`${countryLanguage.CountryCode}-${countryLanguage.Language}`}
                     countryLanguage={countryLanguage} />
                ))}
            </ul>
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
            </div>
        </div>
    )
}