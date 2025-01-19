import axios from "axios";
import { IDriver } from "../../../interfaces/IDriver";

const apiUrl = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Create Driver
async function createDriver(data: IDriver) {
  const requestOptions = {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/drivers`, requestOptions);

    // Log response for debugging
    console.log("Response from API:", response);

    // Check if response status is not OK (2xx)
    if (!response.ok) {
      const errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
      console.error("Error in response:", errorMessage);

      // Attempt to extract error message from response body
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || errorMessage || "Unknown error occurred"
      );
    }

    // Return JSON response if successful
    return await response.json();
  } catch (error: any) {
    console.error("Error creating driver:", error);

    // Re-throw the error to be handled by caller
    throw error;
  }
}

// List Drivers
async function listDrivers() {
    const requestOptions = {
      method: "GET",
      headers: getAuthHeaders(),
    };
  
    try {
      const response = await fetch(`${apiUrl}/drivers`, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      return data.drivers || []; // ดึงเฉพาะฟิลด์ที่เป็นอาเรย์
    } catch (error) {
      console.error("Error listing drivers:", error);
      return [];
    }
  }
  
  

// List Genders
async function listGenders() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/gender`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error listing genders:", error);
    return [];
  }
}

// Delete Driver
async function deleteDriver(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/driver/${id}`, requestOptions);
    return response.ok;
  } catch (error) {
    console.error("Error deleting driver:", error);
    return false;
  }
}

// Update Driver
export const updateDriver = async (driver: IDriver) => {
  try {
    const response = await axios.put(`${apiUrl}/driver/${driver.ID}`, driver, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Error updating driver:", error);
    throw error;
  }
};

// Get Driver by ID
export const getDriver = async (id: string | number) => {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/driver/${id}`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching driver with ID ${id}:`, error);
    throw error;
  }
};

export {
  createDriver,
  listDrivers,
  listGenders,
  deleteDriver,
};
