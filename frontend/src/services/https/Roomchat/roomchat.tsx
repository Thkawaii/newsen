const apiUrl = "http://localhost:8080";


// 📝 Interface สำหรับ RoomChat
interface RoomChat {
    booking_id: number;    // รหัสการจอง
    passenger_id: number;  // รหัสผู้โดยสาร
    driver_id: number;     // รหัสคนขับ
  }
  
  export async function createRoomChat(data: RoomChat) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    try {
      const res = await fetch(`${apiUrl}/roomchat`, requestOptions);
  
      if (res.ok) {
        const result = await res.json();
        console.log("✅ RoomChat created successfully:", result);
        return result; // ตรวจสอบว่ามี room_chat_id ใน response
      } else {
        console.error("❌ Failed to create RoomChat:", res.statusText);
        return null;
      }
    } catch (error) {
      console.error("❌ Error creating RoomChat:", error);
      return null;
    }
  }
  