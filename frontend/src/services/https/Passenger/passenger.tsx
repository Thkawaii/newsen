
// ฟังก์ชัน fetchUserData
const apiUrl = "http://localhost:8080"; // กำหนด API URL

export const fetchUserData = async (
    id: string,
    role: string,
    setUserData: (data: any) => void
) => {
    const token = localStorage.getItem("token"); // ดึง Token จาก LocalStorage
  
    try {
        // ตรวจสอบว่า role ถูกต้อง
        if (role.toLowerCase() !== "passenger") {
            throw new Error("Only passengers are allowed to fetch data.");
        }

        const response = await fetch(`${apiUrl}/passenger/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error fetching user data");
        }

        const data = await response.json();
        setUserData(data); // อัปเดตข้อมูลผู้ใช้งาน
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

export const updateUserData = async (
    id: string,
    role: string,
    data: any // Data to update (e.g., first_name, last_name, etc.)
  ) => {
    const token = localStorage.getItem("token"); // Get Token from LocalStorage
  
    if (!token) {
      throw new Error("Token not found. Please log in.");
    }
  
    try {
      // Check that role is valid for updating user data
      if (role.toLowerCase() !== "passenger") {
        throw new Error("Only passengers are allowed to update data.");
      }
  
      const response = await fetch(`${apiUrl}/passenger/${id}`, {
        method: "PUT", // Use PUT method to update data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data), // Send the data in the body of the request
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating user data.");
      }
  
      const updatedData = await response.json(); // Get updated data from response
      return updatedData; // Return updated data
  
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error; // Optionally throw to be caught by the caller
    }
  };
  