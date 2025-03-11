import { useState, useEffect } from "react";
import { addVendor, getCountries, getStatesByCountry, getCitiesByState } from "../services/vendorService";
import { Vendor } from "../types/vendor";
import "bootstrap/dist/css/bootstrap.min.css";

interface VendorFormProps {
  onVendorAdded: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ onVendorAdded }) => {
  const [vendor, setVendor] = useState<Vendor>({
    id: 0,
    vendorNumber: "",
    company: "",
    firstName: "",
    lastName: "",
    vendorType: "",
    vendorCode: "",
    siteAddress: "",
    category: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    contactVia: "",
    phone1: "",
    phone2: "",
    email: "",
    fax: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    getCountries()
      .then((res) => setCountries(res.data || []))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    setVendor({ ...vendor, country: countryId, state: "", city: "" });
    setStates([]);
    setCities([]);

    if (countryId) {
      getStatesByCountry(countryId)
        .then((res) => setStates(res.data || []))
        .catch((err) => console.error("Error fetching states:", err));
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    setVendor({ ...vendor, state: stateId, city: "" });
    setCities([]);

    if (stateId) {
      getCitiesByState(stateId)
        .then((res) => setCities(res.data || []))
        .catch((err) => console.error("Error fetching cities:", err));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let tempErrors: { [key: string]: string } = {};

    // Required Fields
    const requiredFields: (keyof Vendor)[] = [
      "vendorNumber",
      "company",
      "firstName",
      "address1",
      "phone1",
      "email",
      "country",
      "state",
      "city",
      "vendorType",
    ];

    requiredFields.forEach((field) => {
      const value = vendor[field];

      // Check if the value is a string and trim it, otherwise just check emptiness
      if (typeof value === "string" ? !value.trim() : !value) {
        tempErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    // Email Validation
    if (vendor.email && typeof vendor.email === "string" && !/^\S+@\S+\.\S+$/.test(vendor.email)) {
      tempErrors.email = "Invalid email format";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addVendor(vendor);
      onVendorAdded();
      alert("Vendor created successfully!");

      setVendor({
        id: 0,
        vendorNumber: "",
        company: "",
        firstName: "",
        lastName: "",
        vendorType: "",
        vendorCode: "",
        siteAddress: "",
        category: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        contactVia: "",
        phone1: "",
        phone2: "",
        email: "",
        fax: "",
      });

      setErrors({});
      setStates([]);
      setCities([]);
    } catch (error) {
      console.error("Error adding vendor:", error);
      alert("Failed to create vendor. Please try again.");
    }
  };

  return (
    <div className="container-sm">
      <form onSubmit={handleSubmit} className="border p-2 bg-light rounded shadow-sm" style={{ maxWidth: "600px", fontSize: "14px" }}>
        <div className="row g-1">
          {[
            { label: "Vendor Number", name: "vendorNumber", required: true },
            { label: "Company", name: "company", required: true },
            { label: "First Name", name: "firstName", required: true },
            { label: "Last Name", name: "lastName" },
            { label: "Vendor Code", name: "vendorCode" },
            { label: "Site Address", name: "siteAddress" },
            { label: "Address 1", name: "address1", required: true },
            { label: "Address 2", name: "address2" },
            { label: "Postal Code", name: "postalCode" },
            { label: "Contact Via", name: "contactVia" },
            { label: "Phone 1", name: "phone1", required: true },
            { label: "Phone 2", name: "phone2" },
            { label: "Email", name: "email", type: "email", required: true },
            { label: "Fax", name: "fax" },
          ].map((field) => (
            <div key={field.name} className="col-md-6">
              <label className="form-label mb-0">{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={vendor[field.name as keyof Vendor]}
                onChange={handleChange}
                className="form-control form-control-sm"
                style={{ height: "30px" }}
              />
              {errors[field.name] && <small className="text-danger">{errors[field.name]}</small>}
            </div>
          ))}

          {/* Vendor Type Dropdown */}
          <div className="col-md-6">
            <label className="form-label mb-0">Vendor Type</label>
            <select name="vendorType" value={vendor.vendorType} onChange={handleChange} className="form-select form-select-sm">
              <option value="">Select Vendor Type</option>
              <option value="Supplier">Supplier</option>
              <option value="Distributor">Distributor</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Retailer">Retailer</option>
            </select>
            {errors.vendorType && <small className="text-danger">{errors.vendorType}</small>}
          </div>

          {/* Country, State, City Dropdowns */}
          {[{ label: "Country", name: "country", options: countries, handler: handleCountryChange },
            { label: "State", name: "state", options: states, handler: handleStateChange },
            { label: "City", name: "city", options: cities, handler: handleChange }
          ].map(({ label, name, options, handler }) => (
            <div key={name} className="col-md-6">
              <label className="form-label mb-0">{label}</label>
              <select name={name} value={vendor[name as keyof Vendor]} onChange={handler} className="form-select form-select-sm" disabled={!options.length}>
                <option value="">Select {label}</option>
                {options.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
              </select>
              {errors[name] && <small className="text-danger">{errors[name]}</small>}
            </div>
          ))}
        </div>

        <div className="text-center mt-2">
          <button type="submit" className="btn btn-primary btn-sm">Add Vendor</button>
        </div>
      </form>
    </div>
  );
};

export default VendorForm;
