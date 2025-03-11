import { useState, useEffect } from "react";
import { updateVendor, getCountries, getStatesByCountry, getCitiesByState } from "../services/vendorService";
import { Vendor } from "../types/vendor";
import "bootstrap/dist/css/bootstrap.min.css";

interface UpdateVendorFormProps {
  vendor: Vendor | null;
  onClose: () => void;
  onUpdate: (vendor: Vendor) => void;
}

const UpdateVendorForm: React.FC<UpdateVendorFormProps> = ({ vendor, onClose, onUpdate }) => {
  const [updatedVendor, setUpdatedVendor] = useState<Vendor>(vendor || {} as Vendor);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (vendor) {
      setUpdatedVendor(vendor);
      if (vendor.country) fetchStates(vendor.country);
      if (vendor.state) fetchCities(vendor.state);
    }
  }, [vendor]);

  useEffect(() => {
    getCountries()
      .then((res) => setCountries(res.data || []))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const fetchStates = async (country: string) => {
    try {
      const response = await getStatesByCountry(country);
      setStates(response.data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (state: string) => {
    try {
      const response = await getCitiesByState(state);
      setCities(response.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.name === e.target.value);
    setUpdatedVendor(prev => ({ ...prev, country: selectedCountry?.name || "", state: "", city: "" }));
    setStates([]);
    setCities([]);
    await fetchStates(selectedCountry?.id);
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = states.find(s => s.name === e.target.value);
    setUpdatedVendor(prev => ({ ...prev, state: selectedState?.name || "", city: "" }));
    setCities([]);
    await fetchCities(selectedState?.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdatedVendor(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVendor(updatedVendor.id, updatedVendor);
      alert("Vendor updated successfully!");
      onUpdate(updatedVendor);  // ✅ Pass the updated vendor object
      onClose();
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor. Please try again.");
    }
  };

  return (
    <div className="container-sm">
      <form onSubmit={handleSubmit} className="border p-2 bg-light rounded shadow-sm" style={{ maxWidth: "600px", fontSize: "14px" }}>
        <h5 className="text-center">Update Vendor</h5>
        <div className="row g-1">
          {[{ label: "Vendor Number", name: "vendorNumber" },
            { label: "Company", name: "company" },
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Vendor Code", name: "vendorCode" },
            { label: "Site Address", name: "siteAddress" },
            { label: "Address 1", name: "address1" },
            { label: "Address 2", name: "address2" },
            { label: "Postal Code", name: "postalCode" },
            { label: "Contact Via", name: "contactVia" },
            { label: "Phone 1", name: "phone1" },
            { label: "Phone 2", name: "phone2" },
            { label: "Email", name: "email", type: "email" },
            { label: "Fax", name: "fax" },
          ].map((field) => (
            <div key={field.name} className="col-md-6">
              <label className="form-label mb-0">{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={updatedVendor[field.name as keyof Vendor] || ""}
                onChange={handleChange}
                className="form-control form-control-sm"
                style={{ height: "30px" }}
              />
            </div>
          ))}

          {/* Vendor Type Dropdown */}
          <div className="col-md-6">
            <label className="form-label mb-0">Vendor Type</label>
            <select name="vendorType" value={updatedVendor.vendorType || ""} onChange={handleChange} className="form-select form-select-sm">
              <option value="">Select Vendor Type</option>
              <option value="Supplier">Supplier</option>
              <option value="Distributor">Distributor</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Retailer">Retailer</option>
            </select>
          </div>

          {/* Country, State, City Dropdowns */}
          <div className="col-md-6">
            <label className="form-label mb-0">Country</label>
            <select name="country" value={updatedVendor.country || ""} onChange={handleCountryChange} className="form-select form-select-sm">
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label mb-0">State</label>
            <select name="state" value={updatedVendor.state || ""} onChange={handleStateChange} className="form-select form-select-sm" disabled={!states.length}>
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label mb-0">City</label>
            <select name="city" value={updatedVendor.city || ""} onChange={handleChange} className="form-select form-select-sm" disabled={!cities.length}>
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mt-2">
          <button type="submit" className="btn btn-success btn-sm">Update Vendor</button>
          <button type="button" className="btn btn-secondary btn-sm ms-2" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateVendorForm;
