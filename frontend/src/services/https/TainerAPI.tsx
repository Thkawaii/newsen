import { TrainersInterface } from "../../interfaces/ITrainer";

const apiUrl = "http://localhost:8080";

// GET all trainers
export async function GetTrainers(): Promise<{ status: number; data?: TrainersInterface[]; error?: string }> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${apiUrl}/trainers`, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      return { status: 200, data };
    } else {
      const errorData = await response.json();
      return { status: response.status, error: errorData.error || "Failed to fetch trainers" };
    }
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return { status: 500, error: "Internal server error" };
  }
}

// GET trainer by ID
export async function GetTrainerById(id: string | undefined): Promise<{ status: number; data?: TrainersInterface; error?: string }> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (!id) {
    return { status: 400, error: "Trainer ID is required" };
  }

  try {
    const response = await fetch(`${apiUrl}/trainers/${id}`, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      return { status: 200, data };
    } else {
      const errorData = await response.json();
      return { status: response.status, error: errorData.error || "Trainer not found" };
    }
  } catch (error) {
    console.error("Error fetching trainer by ID:", error);
    return { status: 500, error: "Internal server error" };
  }
}

// POST (Create) a new trainer
export async function CreateTrainer(data: TrainersInterface): Promise<{ status: number; data?: TrainersInterface; error?: string }> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/trainers`, requestOptions);

    // ตรวจสอบสถานะ HTTP
    if (response.ok) {
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } else {
      const errorData = await response.json();
      return { status: response.status, error: errorData?.error || "Failed to create trainer" };
    }
  } catch (error: any) {
    console.error("Error creating trainer:", error);
    return { status: 500, error: "Internal server error" };
  }
}

// PATCH (Update) an existing trainer
export async function UpdateTrainerById(
  id: string | number,
  data: TrainersInterface
): Promise<{ status: number; data?: TrainersInterface; error?: string }> {
  const parsedId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(parsedId)) {
    return { status: 400, error: "Invalid trainer ID" };
  }

  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/trainers/${parsedId}`, requestOptions);
    if (response.ok) {
      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } else {
      const errorData = await response.json();
      return { status: response.status, error: errorData.error || "Error updating trainer" };
    }
  } catch (error) {
    console.error("Error updating trainer:", error);
    return { status: 500, error: "Internal server error" };
  }
}

// DELETE a trainer by ID
// DELETE a trainer by ID
export async function DeleteTrainerById(id: number): Promise<{ status: number; data?: { message: string }; error?: string }> {
  try {
      const requestOptions = {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
          },
      };
      const response = await fetch(`${apiUrl}/trainers/${id}`, requestOptions);

      if (response.status === 200) {
          const data = await response.json(); // ต้องแน่ใจว่า API คืนค่า message
          return { status: 200, data };
      }
      return { status: response.status, error: "ไม่สามารถลบข้อมูลได้" };
  } catch (error) {
      console.error("Error deleting trainer:", error);
      return { status: 500, error: "เกิดข้อผิดพลาดในการลบข้อมูล" };
  }
}