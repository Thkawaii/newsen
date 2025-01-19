const apiUrl = "http://localhost:8080";

/*export async function createBookingStatus(
  statusBooking: string, // กำหนดชนิดข้อมูลเป็น string
  bookingID: number // กำหนดชนิดข้อมูลเป็น number
): Promise<any> {
  try {
    const response = await fetch(`${apiUrl}/bookingstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status_booking: statusBooking,
        booking_id: bookingID,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Booking status created:', data);
    return data;
  } catch (error) {
    console.error('Failed to create booking status:', error);
    throw error;
  }
}*/

export const sendBookingStatusToBackend = async (bookingStatusData: any): Promise<any> => {
    try {
      const response = await fetch(`${apiUrl}/bookingstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingStatusData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send booking status. Status: ${response.status}`);
      }
  
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error sending booking status:', error);
      const err = error as Error; // แปลงเป็น Error
      return { success: false, message: err.message };
    }
  };
  

  export async function patchBookingStatus(
    statusBooking: string,
    bookingID: number
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await fetch(`${apiUrl}/bookingstatus/${bookingID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status_booking: statusBooking,
        }),
      });
  
      if (!response.ok) {
        // จัดการข้อผิดพลาด HTTP
        const errorResponse = await response.json().catch(() => ({}));
        const errorMessage =
          errorResponse.message || `Failed to update booking status. HTTP status: ${response.status}`;
        console.error("HTTP Error:", errorMessage);
        return { success: false, message: errorMessage };
      }
  
      const data = await response.json();
  
      // ตรวจสอบว่าโครงสร้างข้อมูลที่ส่งกลับมาถูกต้อง
      if (!data || typeof data.success === "undefined") {
        console.error("Invalid API response format:", data);
        return { success: false, message: "Invalid response format from API." };
      }
  
      return {
        success: data.success,
        message: data.message || "Booking status updated successfully.",
        data: data.data || null,
      };
    } catch (error) {
      // จัดการข้อผิดพลาดเครือข่าย
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
      console.error("Network or unexpected error in patchBookingStatus:", errorMessage);
      return { success: false, message: errorMessage };
    }
  }
  