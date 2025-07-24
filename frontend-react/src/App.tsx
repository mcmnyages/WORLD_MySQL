import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./components/layout/TopNav";
import CountryList from "./pages/CountryList";
import CitiesList from "./pages/CitiesList";
import CoutryLanguagesList from "./pages/CountryLanguagesList";


function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <TopNav />
        <Routes>
          <Route path="/" element={<CountryList />} />
          <Route path="/cities" element={<CitiesList />} />
          <Route path="countries" element={<CountryList />} />
          <Route path="/country-languages" element={<CoutryLanguagesList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
