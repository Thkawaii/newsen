import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingById, acceptBooking, notifyPassenger } from '../../services/https/booking';
import { createRoomChat } from '../../services/https/Roomchat/roomchat';
import './DriverBooking.css'; // นำเข้าการจัดสไตล์จากไฟล์ CSS
// 🛠️ กำหนดประเภทข้อมูลสำหรับการจอง
interface Booking {
  bookingId: number;
  startLocation: string;
  destination: string;
  bookingStatus: string;
  bookingTime: string;
  passengerId: number;
  roomChatId: number, // ส่ง roomChatId ไปยัง Backend
}

// 🚗 DriverBooking Component
const DriverBooking: React.FC = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const driverID = 6; // จำลอง driverID (สมมติได้จาก Authentication)

  const navigate = useNavigate();

  useEffect(() => {
    let socket: WebSocket;

    const connectWebSocket = () => {
      socket = new WebSocket(`ws://localhost:8080/ws/driver/${driverID}`);

      socket.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
      };

      socket.onmessage = async (event) => {
        console.log('📩 Received message:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_booking' && data.bookingId) {
            setLoading(true);
            const bookingDetails = await getBookingById(String(data.bookingId));
            setBooking({
              bookingId: bookingDetails.id || bookingDetails.ID || 'Unknown',
              startLocation: bookingDetails.beginning || 'Unknown',
              destination: bookingDetails.terminus || 'Unknown',
              bookingStatus: bookingDetails.booking_status || 'Unknown',
              bookingTime: bookingDetails.start_time
                ? new Date(bookingDetails.start_time).toLocaleString()
                : 'Unknown',
              passengerId: bookingDetails.passenger_id,
              roomChatId: bookingDetails.room_chat_id, 
            });
            setLoading(false);
          }
        } catch (error) {
          console.error('❌ Error processing message:', error);
          setLoading(false);
        }
      };

      socket.onclose = () => {
        console.log('🔌 WebSocket disconnected, attempting to reconnect...');
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000);
      };

      socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  // ✅ ฟังก์ชัน Accept Booking
  const handleAcceptBooking = async () => {
    if (!booking || !booking.bookingId || !booking.passengerId) {
      console.error('❌ Booking ID or Passenger ID is missing');
      alert('❌ Booking ID or Passenger ID is missing');
      return;
    }

    try {
      setLoading(true);

      // 🚗 ยืนยันการรับงาน
      const response = await acceptBooking(String(booking.bookingId));

      if (response.success) {
        alert('✅ Booking accepted successfully');

        // ✅ สร้าง RoomChat
        console.log('📦 Creating RoomChat with the following details:');
        console.log('🆔 Booking ID:', booking.bookingId);
        console.log('🧑 Passenger ID:', booking.passengerId);
        console.log('🚗 Driver ID:', driverID);

        const roomChatResponse = await createRoomChat({
          booking_id: Number(booking.bookingId),
          passenger_id: Number(booking.passengerId),
          driver_id: Number(driverID),
        });

        console.log('🆔 RoomChat Response:', roomChatResponse); // เพิ่มบรรทัดนี้


        if (roomChatResponse && roomChatResponse.id) {
          console.log('✅ RoomChat created with ID:', roomChatResponse.id);
          alert('✅ RoomChat created successfully');
        
          // ✅ อัปเดต State ของ booking ด้วย roomChatId
          setBooking((prev) => ({
            ...prev!,
            roomChatId: roomChatResponse.id,
          }));
        
          console.log('🛠️ Updated Booking State:', booking); // ตรวจสอบ State อัปเดตหรือไม่
        
          // 📲 แจ้ง Passenger
          const notifyResponse = await notifyPassenger(
            String(booking.passengerId),
            String(driverID),
            String(booking.bookingId),
            `Your driver has accepted the booking (ID: ${booking.bookingId}) and a chat room is ready!`,
            String(roomChatResponse.id)
          );
        
          console.log('📤 NotifyPassenger API Request Payload:', {
            passengerId: String(booking.passengerId),
            driverId: String(driverID),
            bookingId: String(booking.bookingId),
            message: `Your driver has accepted the booking (ID: ${booking.bookingId}) and a chat room is ready!`,
            roomChatId: String(roomChatResponse.id),
          });
        
          if (notifyResponse.success) {
            alert('✅ Passenger notified successfully');
          } else {
            console.error('❌ Failed to notify passenger');
          }
        } else {
          console.error('❌ Failed to create RoomChat');
          alert('❌ Failed to create RoomChat');
        }

        navigate('/Driverontheway', {
          state: {
            bookingId: booking.bookingId,
          },
        }); 
        
      } else {
        alert(`❌ Failed to accept booking: ${response.message}`);
      }
    } catch (error: any) {
      console.error('❌ Error:', error.message || error);
      alert(`❌ Error: ${error.message || 'Failed to accept booking'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithPassenger = () => {
    console.log('🛠️ Navigating to Chat with:');
    console.log('📦 Booking ID:', booking?.bookingId);
    console.log('🧑 Passenger ID:', booking?.passengerId);
    console.log('💬 Room Chat ID:', booking?.roomChatId);
  
    if (!booking?.bookingId || !booking?.passengerId || !booking?.roomChatId) {
      console.error('❌ Missing Booking ID, Passenger ID, or RoomChat ID');
      alert('❌ Missing Booking ID, Passenger ID, or RoomChat ID');
      return;
    }
  
    navigate('/DriverChat', {
      state: {
        bookingId: booking.bookingId,
        passengerId: booking.passengerId,
        driverID,
        roomChatId: booking.roomChatId,
      },
    });
  };
  

  return (
    <div className="driverbooking">
      <h1>🚗 Driver Booking Page</h1>
      {isConnected ? (
        <p className="connected">🟢 WebSocket Connected</p>
      ) : (
        <p className="disconnected">🔴 WebSocket Disconnected</p>
      )}
  
      {loading ? (
        <p>⏳ Loading booking details...</p>
      ) : booking ? (
        <div className="bookingCard">
          <h2>📦 New Booking Received!</h2>
          <p><strong>Booking ID:</strong> {booking.bookingId}</p>
          <p><strong>Start Location:</strong> {booking.startLocation}</p>
          <p><strong>Destination:</strong> {booking.destination}</p>
          <p><strong>Status:</strong> {booking.bookingStatus}</p>
          <p><strong>Time:</strong> {booking.bookingTime}</p>
          <button className="acceptButton" onClick={handleAcceptBooking}>
            ✅ Accept Booking
          </button>
          <button className="chatButton" onClick={handleChatWithPassenger}>
            💬 Chat with Passenger
          </button>
        </div>
      ) : (
        <p>⏳ Waiting for new bookings...</p>
      )}
    </div>
  );
};



export default DriverBooking;
