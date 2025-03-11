import axios from "axios";
import { Vendor } from "../types/vendor";

const API_URL = "http://localhost:8080/api/vendors";
const LOCATION_API = "http://localhost:8080/api/location"; 

// ✅ Add Vendor API
export const addVendor = async (vendor: Vendor) => {
  try {
    const response = await axios.post(API_URL, vendor);
    return response.data;
  } catch (error) {
    console.error("Error adding vendor:", error);
    throw error;
  }
};

export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
};


export const searchVendors = async (query:String): Promise<Vendor[]> => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params:{ query }});
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
};


// ✅ Fetch all Countries
export const getCountries = async () => {
  try {
    const response = await axios.get(`${LOCATION_API}/countries`);
    return response;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

// ✅ Fetch States by Country ID
export const getStatesByCountry = async (countryId: string) => {
  try {
    const response = await axios.get(`${LOCATION_API}/states/${countryId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching states for country ${countryId}:`, error);
    throw error;
  }
};

// ✅ Fetch Cities by State ID
export const getCitiesByState = async (stateId: string) => {
  try {
    const response = await axios.get(`${LOCATION_API}/cities/${stateId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching cities for state ${stateId}:`, error);
    throw error;
  }
};


// 🔹 Update Vendor by ID
export const updateVendor = async (id: number, updatedVendor: Vendor): Promise<Vendor> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedVendor);
    return response.data;
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw error;
  }
};


export const deleteVendor = async (vendorId: number): Promise<string> => {
  try {
    const response = await axios.delete(`${API_URL}/${vendorId}`);
    return response.data; 
  } catch (error) {
    console.error("❌ Error deleting vendor:", error);
    throw error; 
  }
};

export const deleteVendorsBulk = async (vendorIds: number[]) => {
  return axios.delete(`${API_URL}/bulk-delete`, { data: vendorIds });
};
