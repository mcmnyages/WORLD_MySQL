import { Link } from "react-router-dom";



export default function TopNav(){
    return (

        <div>
            <p>Start of  Top Nav</p>
            <nav>
                <ul>
                    <Link to="/">Home</Link> <br />
                    <Link to="/countries">Countries</Link> <br />
                    <Link to="/cities">Cities</Link><br />
                    <Link to="/country-languages">Country Languages</Link><br/>

                </ul>
            </nav>
            <p>End of Top Nav</p>
        </div>
    )

}
