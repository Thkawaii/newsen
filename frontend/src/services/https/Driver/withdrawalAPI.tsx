import { WithdrawalInterface } from "../../../interfaces/IWithdrawal";
import axios from "axios";

const apiUrl = "http://localhost:8080";

// Withdrawal Service Functions
async function GetCommission() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get(`${apiUrl}/commission`, requestOptions);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetWithdrawal() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get(`${apiUrl}/withdrawal/statement`, requestOptions);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetWithdrawalById(id: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get(`${apiUrl}/withdrawal/statement/${id}`, requestOptions);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

async function CreateWithdrawal(data: WithdrawalInterface) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };

  try {
    const res = await axios.post(`${apiUrl}/withdrawal/money`, data, requestOptions);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

async function GetBankName() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get(`${apiUrl}/bankname`, requestOptions);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error: any) {
  // Handle the error, logging or showing a message to the user
  console.error("API Error: ", error);
  return false;
}

// Exporting all functions together
export {
  GetCommission,
  GetWithdrawal,
  GetWithdrawalById,
  CreateWithdrawal,
  GetBankName,
};
