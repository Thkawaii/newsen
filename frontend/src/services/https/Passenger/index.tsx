//import { Passenger} from "../../../interfaces/IPassenger";
//import axios from "axios";

const apiUrl = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function listPassenger() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/passengers`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error listing passengers:", error);
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

// Delete Employee
async function deletePassenger(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/passenger/${id}`, requestOptions);
    return response.ok;
  } catch (error) {
    console.error("Error deleting Passenger:", error);
    return false;
  }
}

export {
    listPassenger,
    listGenders,
    deletePassenger,
  };