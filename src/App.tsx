import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import VendorForm from "./components/VendorForm";
import VendorSearch from "./components/VendorSearch";
import ActivityLogComponent from "./components/activityLogs";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mt-2">
        {/* ✅ Navbar */}
        <nav className="mb-3">
          <Link to="/create" className="btn btn-primary me-2">
            Create
          </Link>
          <Link to="/search" className="btn btn-secondary me-2">
            Search
          </Link>
          <Link to="/activity" className="btn btn-secondary">
            ActivityLog
          </Link>
        </nav>

        {/* ✅ Page Routes */}
        <Routes>
          <Route path="/create" element={<VendorForm onVendorAdded={() => {}} />} />
          <Route path="/search" element={<VendorSearch/>} />
          <Route path="/activity" element={<ActivityLogComponent/>} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
