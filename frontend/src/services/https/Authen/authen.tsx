import axios from "axios";
import { SignInInterface } from "../../../interfaces/Signln";

const apiUrl = "http://localhost:8080";

const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
});

async function SignIn(data: SignInInterface) {
  return await apiClient
    .post("/signin", data)
    .then((res) => res)
    .catch((e) => e.response);
}

async function authenticateUser(email: string, password: string) {
  try {
    const response = await axios.post(
      `${apiUrl}/auth/signin`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const { token, id, role } = response.data;

      // Store token in localStorage for future use
      localStorage.setItem("authToken", token);

      // Return user details and token
      return { id, email, role, token };
    }
  } catch (error: any) {
    // Handle errors and provide more descriptive messages
    if (error.response) {
      console.error(
        `Authentication failed with status: ${error.response.status}`,
        error.response.data
      );
      return { error: error.response.data.error || "Authentication failed" };
    } else {
      console.error("Error authenticating user:", error.message);
      return { error: "Network or server error occurred" };
    }
  }

  // Return null if authentication fails
  return null;
}

export { authenticateUser,SignIn};
