import { BrowserRouter, Routes, Route } from "react-router-dom";
import CountryList from "./pages/CountryList";


function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<CountryList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
