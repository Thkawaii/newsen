//import { Message } from "../../interfaces/IMessage"; // ปรับ path ให้ตรงกับตำแหน่งจริงของ interface

const apiUrl = "http://localhost:8080";

// แก้ไขประเภท Message
export interface Message {
  
  message_id: number; // เปลี่ยนให้เป็น optional
  content: string;
  message_type: string;
  read_status: boolean;
  send_time: string;
  passenger_id: number;
  booking_id: number;
  driver_id: number;
  sender_id: number; // เพิ่ม SenderID
  sender_type: string; // เพิ่ม SenderType
  room_id: number;
}


export async function sendMessageToBackend(data: Message) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/message`, requestOptions);

    if (res.status === 201) {
      const result = await res.json();
      console.log("✅ Message saved to backend:", result);
      return result;
    } else {
      console.error("❌ Failed to save message to backend:", res.statusText);
      return false;
    }
  } catch (error) {
    console.error("❌ Error saving message to backend:", error);
    return false;
  }
}
export interface Message {
  message_id: number;
  content: string;
  message_type: string;
  read_status: boolean;
  send_time: string;
  passenger_id: number;
  driver_id: number;
  booking_id: number;
}

// ✅ ดึงข้อความทั้งหมดตาม Booking ID
export const fetchMessagesByBookingID = async (bookingId: number): Promise<Message[]> => {
  try {
    const response = await fetch(`${apiUrl}/message/${bookingId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages, status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return [];
  }
};

 

  export const sendDataStartlocationToBackend = async (pickupLocation: { lat: number; lng: number; name: string }) => {
    try {
      const response = await fetch(`${apiUrl}/startlocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: pickupLocation.lat,  // ส่งข้อมูลตามชื่อฟิลด์ใน backend
          longitude: pickupLocation.lng,
          province: 'Your Province',    // กำหนดค่า province ตามที่ต้องการ
          place: pickupLocation.name,   // ชื่อสถานที่
          address: 'Your Address',      // ที่อยู่ (ใส่ข้อมูลจริง)
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error sending data to backend:', errorData);
        throw new Error(errorData.message || 'Unknown error occurred');
      }
  
      const data = await response.json();
      console.log('Data sent to backend:', data);

      // Return the ID of the created start location
      return data.data.id; // Assume the backend returns the ID in data.data.id
    } catch (error) {
      console.error('Error sending data to backend:', error);
      throw error; // Throw the error for further handling
    }
};


export const sendDataDestinationToBackend = async (destinationLocation: { lat: number; lng: number; name: string }) => {
  try {
    const response = await fetch(`${apiUrl}/destination`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: destinationLocation.lat,
        longitude: destinationLocation.lng,
        province: 'Your Province',
        place: destinationLocation.name,
        address: 'Your Address',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unknown error occurred');
    }

    const data = await response.json();
    console.log('Destination Data sent to backend:', data);
    return data.data.id; // Return only the destination_id
  } catch (error) {
    console.error('Error sending destination data to backend:', error);
    throw error;
  }
};

export const sendBookingToBackend = async (bookingData: {
  beginning: string;
  terminus: string;
  start_time: string;
  end_time: string;
  distance: number;
  total_price: number;
  booking_time: string;
  booking_status: string;
  vehicle: string;
  start_location_id: number;
  destination_id: number;
  passenger_id: number;
}) => {
  try {
    const response = await fetch(`${apiUrl}/bookings`, {
      method: "POST", // ใช้ POST method
      headers: {
        "Content-Type": "application/json", // กำหนด Content-Type เป็น JSON
      },
      body: JSON.stringify(bookingData), // แปลงข้อมูล bookingData เป็น JSON
    });

    // ตรวจสอบว่า response สำเร็จหรือไม่
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create booking");
    }

    const data = await response.json(); // แปลง response เป็น JSON
    console.log("Booking response from backend:", data); // Log ข้อมูลที่ได้จาก backend
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating booking:", error.message);
      return { success: false, message: error.message };
    } else {
      console.error("Unknown error:", error);
      return { success: false, message: "An unknown error occurred" };
    }
  }
  
};


// ฟังก์ชันสำหรับดึง booking ทั้งหมด
export const getBookings = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${apiUrl}/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching bookings: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.data; // คืนค่าข้อมูลการจองทั้งหมด
    } else {
      throw new Error(`API Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// ฟังก์ชันสำหรับดึง booking ตาม bookingId
export const getBookingById = async (bookingId: string): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching booking by ID: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.data; // คืนค่าข้อมูล booking เดี่ยว
    } else {
      throw new Error(`API Error: ${data.message}`);
    }
  } catch (error) {
    console.error(`Error fetching booking by ID: ${bookingId}`, error);
    throw error;
  }
};

// ฟังก์ชันสำหรับการรับงานจากคนขับ
export const acceptBooking = async (bookingId: string) => {
  try {
    const response = await fetch(`${apiUrl}/bookings/${bookingId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // ตรวจสอบ Response Status
      const errorText = await response.text();
      throw new Error(`Failed to accept booking. Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data; // คืนค่าผลลัพธ์จากการรับงาน
    } else {
      throw new Error(`Failed to accept booking: ${data.message}`);
    }
  } catch (error: any) {
    console.error('❌ Error accepting booking:', error.message || error);
    throw new Error(error.message || 'Unknown error occurred while accepting booking');
  }
};

export const finishBooking = async (bookingId: string) => {
  try {
    const response = await fetch(`${apiUrl}/bookings/${bookingId}/finish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // ตรวจสอบ Response Status
      const errorText = await response.text();
      throw new Error(`Failed to finish booking. Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    if (data.success) {
      return data; 
    } else {
      throw new Error(`Failed to finish booking: ${data.message}`);
    }
  } catch (error: any) {
    console.error('❌ Error finishing booking:', error.message || error);
    throw new Error(error.message || 'Unknown error occurred while finishing booking');
  }
};


// services/https.ts
export const notifyPassenger = async (
  passengerId: string,
  driverId: string,
  bookingId: string,
  message: string,
  roomChatId: string
) => {
  console.log('📤 Sending Notification with Payload:', {
    passengerId,
    driverId,
    bookingId,
    message,
    roomChatId,
  });

  const response = await fetch(`${apiUrl}/passenger/${passengerId}/notify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // ✅ ตรวจสอบว่า Content-Type ถูกตั้งค่าเป็น JSON
    },
    body: JSON.stringify({
      driverId,
      bookingId,
      message,
      roomChatId,
    }),
  });

  console.log('📥 Raw API Response:', response);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};


// services/https.ts

export const getNotifications = async () => {
  try {
    const response = await fetch('/api/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      notifications: data.notifications || [],
    };
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    throw error;
  }
};

// Get Chat Messages by RoomChatId
export const getMessagesByRoomChatId = async (roomChatId: string) => {
  console.log('📥 Fetching messages by Room Chat ID:', roomChatId);

  try {
    const response = await fetch(`${apiUrl}/message/chat/${roomChatId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('❌ Error fetching chat messages:', data.error);
      throw new Error(data.error || 'Failed to fetch chat messages');
    }

    console.log('✅ Chat messages fetched successfully:', data);
    return data.messages;
  } catch (error) {
    console.error('❌ Failed to fetch chat messages:', error);
    return [];
  }
};


export const fetchHistoryPlacesFromBackend = async (): Promise<{ data: any[]; status: string }> => {
  try {
    const response = await fetch(`${apiUrl}/history-places`);
    if (!response.ok) throw new Error('Failed to fetch history places');
    return await response.json(); // คาดว่าจะมีโครงสร้าง { data: [], status: "success" }
  } catch (error) {
    console.error(error);
    return { data: [], status: 'error' }; // คืนค่าโครงสร้างที่ตรงกัน
  }
};





