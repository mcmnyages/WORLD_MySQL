import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./components/layout/TopNav";
import LandingPage from "./pages/LandingPage";
import CountryList from "./pages/CountryList";
import CitiesList from "./pages/CitiesList";
import CoutryLanguagesList from "./pages/CountryLanguagesList";


function App() {
  return (
    <BrowserRouter>
    <TopNav />
      <div className="p-4 mt-16">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cities" element={<CitiesList />} />
          <Route path="countries" element={<CountryList />} />
          <Route path="/country-languages" element={<CoutryLanguagesList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
