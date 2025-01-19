import axios from "axios";
import { IVehicle } from "../../../interfaces/IVehicle";

const apiUrl = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Create Vehicle
// export async function createVehicle(vehicle: IVehicle) {
//   const requestOptions = {
//     method: "POST",
//     headers: getAuthHeaders(),
//     body: JSON.stringify({
//       license_plate: vehicle.licensePlate,
//       brand: vehicle.brand,
//       vehicle_model: vehicle.vehicleModel,
//       color: vehicle.color,
//       date_of_purchase: vehicle.dateOfPurchase, // YYYY-MM-DD
//       expiration_date_of_vehicle_act: vehicle.expirationDateOfVehicleAct, // YYYY-MM-DD
//       capacity: vehicle.capacity,
//       vehicle_type_id: vehicle.vehicleTypeId,
//       employee_id: vehicle.employeeId,
//       status_id: vehicle.statusId,
//     }),
//   };

//   try {
//     const response = await fetch(`${apiUrl}/vehicles`, requestOptions);
//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error creating vehicle:", error);
//     return { status: 500, message: "Server Error" };
//   }
// }

// List Vehicles
export async function listVehicles() {
    const requestOptions = {
      method: "GET",
      headers: getAuthHeaders(),
    };
  
    try {
      const response = await fetch(`${apiUrl}/vehicles`, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data); // ตรวจสอบว่า VehicleType มีใน response
      return data.vehicles || [];
    } catch (error) {
      console.error("Error listing vehicles:", error);
      return [];
    }
  }
  

// Get Vehicle by ID
export async function getVehicle(id: number) {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/vehicles/${id}`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching vehicle with ID ${id}:`, error);
    throw error;
  }
}

// Update Vehicle
export async function updateVehicle(vehicle: IVehicle) {
  try {
    const response = await axios.put(
      `${apiUrl}/vehicles/${vehicle.VehicleID}`,
      vehicle,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
}

// Delete Vehicle
export async function deleteVehicle(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/vehicles/${id}`, requestOptions);
    return response.ok;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return false;
  }
}

// List Vehicle Types
export async function listVehicleTypes() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/vehicletypes`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error listing vehicle types:", error);
    return [];
  }
}
