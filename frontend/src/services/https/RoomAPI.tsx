import { RoomInterface } from "../../interfaces/IRoom";

const apiUrl = "http://localhost:8080";

// ดึงข้อมูลห้องทั้งหมด
export async function GetRooms() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const res = await fetch(`${apiUrl}/rooms`, requestOptions);
    if (res.ok) {
      const data = await res.json();
      return { status: res.status, data };
    } else {
      const error = await res.json();
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลห้อง:", error.message);
      return { status: res.status, error: error.message };
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการเชื่อมต่อกับ API:", error);
    return { status: 500, error: "ข้อผิดพลาดในการเชื่อมต่อกับ API" };
  }
}

// ดึงข้อมูลห้องตาม ID
export async function GetRoomById(id: number | undefined) {
  if (!id) {
    console.error("กรุณาระบุ ID ของห้อง");
    return { status: 400, error: "กรุณาระบุ ID ของห้อง" };
  }

  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions);
    if (res.ok) {
      const data = await res.json();
      if (!data || Object.keys(data).length === 0) {
        console.error("ไม่มีข้อมูลห้อง");
        return { status: 404, error: "ไม่มีข้อมูลห้อง" };
      }
      return { status: res.status, data };
    } else {
      const error = await res.json();
      console.error("ไม่พบข้อมูลห้อง ID นี้:", error.message);
      return { status: res.status, error: error.message };
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการเชื่อมต่อกับ API:", error);
    return { status: 500, error: "ข้อผิดพลาดในการเชื่อมต่อกับ API" };
  }
}

// สร้างห้องใหม่
export async function CreateRoom(data: RoomInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/rooms`, requestOptions);
    const result = await res.json(); // แปลงผลลัพธ์เป็น JSON

    if (res.ok) {
      const result = await res.json();
      return {
        status: res.status,
        message: result.message,
        data: result.room,
      };
    } else {
      return {
        status: res.status,
        error: result.error || "Unknown error",
      };
    }
  } catch (error) {
    console.error("ข้อผิดพลาด:", error);
    return { status: 500, error: "Internal server error" };
  }
}

// อัปเดตข้อมูลห้อง
export async function UpdateRoomById(id: number, data: RoomInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions);
    if (res.ok) {
      const responseData = await res.json();
      if (!responseData || Object.keys(responseData).length === 0) {
        console.error("ไม่มีข้อมูลที่อัปเดต");
        return { status: 204, error: "ไม่มีข้อมูลที่อัปเดต" };
      }
      return { status: res.status, data: responseData };
    } else {
      const error = await res.json();
      console.error("ไม่สามารถอัปเดตข้อมูลห้องได้:", error.message);
      return { status: res.status, error: error.message };
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการเชื่อมต่อกับ API:", error);
    return { status: 500, error: "ข้อผิดพลาดในการเชื่อมต่อกับ API" };
  }
}

// ลบห้อง
export async function DeleteRoomById(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions);
    if (res.ok) {
      return { status: res.status, message: "ลบห้องสำเร็จ" };
    } else {
      const error = await res.json();
      console.error("ไม่สามารถลบห้องได้:", error.message);
      return { status: res.status, error: error.message };
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการเชื่อมต่อกับ API:", error);
    return { status: 500, error: "ข้อผิดพลาดในการเชื่อมต่อกับ API" };
  }
}