import { TrainbookInterface } from "../../interfaces/ITrainbook";

const apiUrl = "http://localhost:8080";

// ✅ ดึงข้อมูล TrainBooks ทั้งหมด
export async function GetTrainbooks() {
  try {
    const res = await fetch(`${apiUrl}/trainbook`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Error fetching trainbooks: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching trainbooks:", error);
    return null;
  }
}

// ✅ ดึง TrainBook ตาม ID
export async function GetTrainbookById(id: number) {
  if (!id || isNaN(id) || id <= 0) {
    console.error("❌ Invalid Trainbook ID:", id);
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/trainbook/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Error fetching trainbook by ID (${id}): ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching trainbook by ID:", error);
    return null;
  }
}

// ✅ ดึงข้อมูล TrainBooks ของ Driver ตาม DriverID
export async function GetTrainbooksByDriver(driverID: number, token: string) {
  if (!driverID || isNaN(driverID) || driverID <= 0) {
    console.error("❌ Invalid Driver ID:", driverID);
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/trainbook/${driverID}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!res.ok) throw new Error(`Error fetching trainbooks for driver ${driverID}: ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching trainbooks for driver:", error);
    return null;
  }
}

// ✅ สร้าง TrainBook ใหม่
export async function CreateTrainbook(roomId: number, data: TrainbookInterface, token: string) {
  console.log("📡 ตรวจสอบค่าก่อนส่ง API:", { roomId, data });

  if (!token) {
    console.error("❌ Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
    return null;
  }

  if (!roomId || isNaN(roomId) || roomId <= 0) {
    console.error("❌ Room ID ไม่ถูกต้อง:", roomId);
    return null;
  }

  if (!data.DriverID || isNaN(Number(data.DriverID)) || data.DriverID <= 0) {
    console.error("❌ DriverID ไม่ถูกต้อง หรือไม่ได้รับค่า:", data.DriverID);
    return null;
  }

  // สร้าง Request Body
  const requestBody = {
    room_id: roomId,
    driver_id: data.DriverID,
    status: data.Status || "Confirmed",
  };

  console.log("📡 JSON ที่จะส่งไป API:", JSON.stringify(requestBody, null, 2));

  try {
    const res = await fetch(`${apiUrl}/trainbook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody), // ✅ Ensure JSON.stringify is used
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Error creating trainbook: ${res.status} - ${errorData.error}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error creating trainbook:", error);
    return null;
  }
}


// ✅ PATCH (Update) an existing trainbook
export async function UpdateTrainbookById(data: TrainbookInterface, token: string) {
  if (!token) {
    console.error("❌ Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
    return null;
  }

  if (!data.ID || isNaN(data.ID) || data.ID <= 0) {
    console.error("❌ Missing or Invalid ID for updating trainbook:", data);
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/trainbook/${data.ID}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Error updating trainbook with ID (${data.ID}): ${res.status}`);

    return await res.json();
  } catch (error) {
    console.error("❌ Error updating trainbook:", error);
    return null;
  }
}

// ✅ DELETE a trainbook by ID
export async function DeleteTrainbookById(id: number, token: string) {
  if (!token) {
    console.error("❌ Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
    return null;
  }

  if (!id || isNaN(id) || id <= 0) {
    console.error("❌ Invalid Trainbook ID:", id);
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/trainbook/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!res.ok) throw new Error(`Error deleting trainbook with ID (${id}): ${res.status}`);

    return true;
  } catch (error) {
    console.error("❌ Error deleting trainbook:", error);
    return null;
  }
}

export async function UpdateTrainbookStatus(trainbookId: number, data: { status: string }) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/trainbook/${trainbookId}/status`, requestOptions);
    return await res.json();
  } catch (error) {
    console.error("❌ Error updating trainbook status:", error);
    return null;
  }
}
