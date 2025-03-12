  import React, { useState } from "react";
  import { searchVendors, deleteVendor, updateVendor, deleteVendorsBulk, downloadXml, downloadCsv } from "../services/vendorService";
  import { Vendor } from "../types/vendor";
  import "bootstrap/dist/css/bootstrap.min.css";
import UpdateVendorForm from "./updateVendorForm";

  const VendorSearch: React.FC = () => {
    const [searchData, setSearchData] = useState({
      vendorNumber: "",
      company: "",
      type: "",
      locationType: "",
    });

    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);



    // Sorting and Pagination States
    const [sortConfig, setSortConfig] = useState<{ key: keyof Vendor | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const [vendorsPerPage, setVendorsPerPage] = useState(5);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setSearchData({ ...searchData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccessMessage("");

      try {
        const query = Object.values(searchData).filter(Boolean).join(" ");
        const result = await searchVendors(query);

        if (result.length === 0) {
          setError("No vendors found.");
        } else {
          setVendors(result);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to fetch vendors. Try again.");
      } finally {
        setLoading(false);
        setCurrentPage(1);
      }
    };

    // Handle Vendor Deletion
    const handleDelete = async (vendorId: number) => {
      if (!window.confirm("Are you sure you want to delete this vendor?")) return;

      try {
        await deleteVendor(vendorId);
        setVendors((prevVendors) => prevVendors.filter((vendor) => vendor.id !== vendorId));
        setSuccessMessage("✅ Vendor deleted successfully!");
      } catch (err) {
        console.error("Error deleting vendor:", err);
        setError("Failed to delete vendor. Please try again.");
      }
    };


    const handleDeleteMultiple = async (vendorIds: number[]) => {
      if (!window.confirm(`Are you sure you want to delete ${vendorIds.length} vendors?`)) return;
    
      try {
        await Promise.all(vendorIds.map((id) => deleteVendor(id)));
        setVendors((prevVendors) => prevVendors.filter((vendor) => !vendorIds.includes(vendor.id)));
        setSuccessMessage(`✅ Deleted ${vendorIds.length} vendors successfully!`);
      } catch (err) {
        console.error("Error deleting multiple vendors:", err);
        setError("Failed to delete vendors. Please try again.");
      }
    };

     // Open Update Form
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowUpdateForm(true);
  };

  // Close Update Form
  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setSelectedVendor(null);
  };

  // Handle Vendor Update
  const handleUpdate = async (updatedVendor: Vendor) => {
    try {
      const result = await updateVendor(updatedVendor.id, updatedVendor);
      setVendors((prevVendors) => prevVendors.map((vendor) => (vendor.id === result.id ? result : vendor)));
      setSuccessMessage("✅ Vendor updated successfully!");
      setShowUpdateForm(false); // Close form after update
    } catch (err) {
      console.error("Error updating vendor:", err);
      setError("Failed to update vendor. Please try again.");
    }
  };


    // Sorting Logic
    const handleSort = (key: keyof Vendor) => {
      setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
    };

    const sortedVendors = [...vendors].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const valA = a[sortConfig.key] as string;
      const valB = b[sortConfig.key] as string;
      return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    // Pagination Logic
    const indexOfLastVendor = currentPage * vendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
    const currentVendors = sortedVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    const totalPages = Math.ceil(vendors.length / vendorsPerPage);
    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    const goToPage = (page: number) => setCurrentPage(page);

    return (
      <div className="container mt-2">
        <h5 className="mb-2 text-center">Search Vendor</h5>

        {/* ✅ Search Form */}
        <form onSubmit={handleSubmit} className="border p-1 rounded bg-light">
          <div className="row">
            <div className="col-md-3 mb-1">
              <label className="form-label">Vendor Number</label>
              <input type="text" name="vendorNumber" value={searchData.vendorNumber} onChange={handleChange} className="form-control form-control-sm" />
            </div>
            <div className="col-md-3 mb-1">
              <label className="form-label">Company</label>
              <input type="text" name="company" value={searchData.company} onChange={handleChange} className="form-control form-control-sm" />
            </div>
            <div className="col-md-3 mb-1">
              <label className="form-label">Type</label>
              <select name="type" value={searchData.type} onChange={handleChange} className="form-select form-select-sm">
                <option value="">Select</option>
                <option value="Supplier">Supplier</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>
            <div className="col-md-3 mb-1">
              <label className="form-label">Location Type</label>
              <select name="locationType" value={searchData.locationType} onChange={handleChange} className="form-select form-select-sm">
                <option value="">Select</option>
                <option value="Air Carrier">Air Carrier</option>
                <option value="Bus Carrier">Bus Carrier</option>
                <option value="Pickup/Delivery">Pickup/Delivery</option>
                <option value="Third Party Carrier">Third Party Carrier</option>
              </select>
            </div>
          </div>

          <div className="text-center mt-2">
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* ✅ Show Messages */}
        {successMessage && <p className="text-success mt-2">{successMessage}</p>}
        {error && <p className="text-danger mt-2">{error}</p>}

        {/* ✅ Vendor Table */}
        <VendorTable vendors={currentVendors} handleSort={handleSort} sortConfig={sortConfig} handleDelete={handleDelete} handleDeleteMultiple={handleDeleteMultiple} handleEdit={handleEdit} />

  {/* ✅ Page Size Selection */}
  <div className="d-flex justify-content-end mt-2">
          <label className="me-2">Page Size:</label>
          <select
            className="form-select form-select-sm w-auto"
            value={vendorsPerPage}
            onChange={(e) => {
              setVendorsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* ✅ Pagination */}
        {vendors.length > vendorsPerPage && (
          <div className="d-flex justify-content-between align-items-center mt-2">
            <button className="btn btn-secondary btn-sm" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            <div>{Array.from({ length: totalPages }, (_, i) => <button key={i + 1} className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`} onClick={() => goToPage(i + 1)}>{i + 1}</button>)}</div>
            <button className="btn btn-secondary btn-sm" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}

 {/* ✅ Update Vendor Modal */}
 {showUpdateForm && selectedVendor && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Vendor</h5>
                <button type="button" className="btn-close" onClick={handleCloseUpdateForm}></button>
              </div>
              <div className="modal-body">
                <UpdateVendorForm vendor={selectedVendor} onClose={handleCloseUpdateForm} onUpdate={handleUpdate} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


  // ✅ Vendor Table Component with Edit & Delete Buttons
  const VendorTable: React.FC<{ 
    vendors: Vendor[]; 
    handleSort: (key: keyof Vendor) => void; 
    sortConfig: { key: keyof Vendor | null; direction: "asc" | "desc" }; 
    handleDelete: (id: number) => void; 
    handleDeleteMultiple: (ids: number[]) => void;
    handleEdit: (vendor: Vendor) => void; 
  }> = ({ vendors, handleSort, sortConfig, handleDelete, handleDeleteMultiple, handleEdit }) => {
    if (vendors.length === 0) return null;

    const [selectedVendors, setSelectedVendors] = useState<number[]>([]);

  // ✅ Handle Checkbox Selection
  const toggleSelectVendor = (id: number) => {
    setSelectedVendors((prev) =>
      prev.includes(id) ? prev.filter((vendorId) => vendorId !== id) : [...prev, id]
    );
  };

  // ✅ Handle "Select All" Checkbox
  const toggleSelectAll = () => {
    if (selectedVendors.length === vendors.length) {
      setSelectedVendors([]); // Deselect all
    } else {
      setSelectedVendors(vendors.map((vendor) => vendor.id)); // Select all
    }
  };

  const handleDownloadXml = async () => {
    const xmlBlob = await downloadXml();
    if (xmlBlob) {
      const url = window.URL.createObjectURL(xmlBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vendors.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };


  const handleDownloadCsv = async () => {
    const csvBlob = await downloadCsv();
    if (csvBlob) {
      const url = window.URL.createObjectURL(csvBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vendors.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Failed to download Csv")
    }
  };


  return (
    <div className="mt-2">
      <h5 className="text-center">Vendor List</h5>

        {/* ✅ Download Buttons */}
      <button className="btn btn-success btn-sm me-2" onClick={handleDownloadCsv}>Download CSV</button>
      <button className="btn btn-success btn-sm" onClick={handleDownloadXml}>Download XML</button>

      
      
      {/* ✅ Multi-Delete Button */}
      {selectedVendors.length > 0 && (
        <button className="btn btn-danger btn-sm mb-2" onClick={() => handleDeleteMultiple(selectedVendors)}>
          Delete Selected ({selectedVendors.length})
        </button>
      )}

      <table className="table table-bordered table-sm">
        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selectedVendors.length === vendors.length}
              />
            </th>
            <th onClick={() => handleSort("vendorNumber")} style={{ cursor: "pointer" }}>
              Vendor Number 
              {sortConfig.key === "vendorNumber" && (
                <span className="ms-1">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th>Vendor Name</th>
            <th>Company</th>
            <th>Type</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => toggleSelectVendor(vendor.id)}
                />
              </td>
              <td>
                <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(vendor); }} className="text-primary text-decoration-none">
                  {vendor.vendorNumber}
                </a>
              </td>
              <td>{vendor.firstName} {vendor.lastName}</td>    
              <td>{vendor.company}</td>
              <td>{vendor.vendorType}</td>
              <td>{vendor.city}, {vendor.state}</td>
              <td>  
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(vendor.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default VendorSearch;
