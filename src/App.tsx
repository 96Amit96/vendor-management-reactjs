import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import VendorForm from "./components/VendorForm";
import VendorSearch from "./components/VendorSearch";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mt-2">
        {/* ✅ Navbar */}
        <nav className="mb-3">
          <Link to="/create" className="btn btn-primary me-2">
            Create
          </Link>
          <Link to="/search" className="btn btn-secondary">
            Search
          </Link>
        </nav>

        {/* ✅ Page Routes */}
        <Routes>
          <Route path="/create" element={<VendorForm onVendorAdded={() => {}} />} />
          <Route path="/search" element={<VendorSearch/>} />
          <Route path="/" element={<h4>Select "Create" or "Search"</h4>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
