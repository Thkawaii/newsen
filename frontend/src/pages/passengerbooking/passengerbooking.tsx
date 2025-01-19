import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PassengerNotification.css'; // Import ไฟล์ CSS

const PassengerNotification: React.FC = () => {
  const [message, setMessage] = useState<string>('🔔 Waiting for notifications...');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [roomChatId, setRoomChatId] = useState<string | null>(null);

  const passengerId = '1';
  const navigate = useNavigate();

  // ✅ เชื่อมต่อ WebSocket
  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectInterval: ReturnType<typeof setTimeout>;

    const connectWebSocket = () => {
      socket = new WebSocket(`ws://localhost:8080/ws/passenger/${passengerId}`);

      socket.onopen = () => {
        console.log('✅ WebSocket connected (Passenger Notification)');
        setIsConnected(true);
        setMessage('✅ WebSocket connected');
      };

      socket.onmessage = (event) => {
        console.log('📩 Message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            setMessage(`🚨 ${data.message}`);

            if (data.bookingId) setBookingId(data.bookingId);
            if (data.driverId) setDriverId(data.driverId);
            if (data.roomChatId) setRoomChatId(data.roomChatId);
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error);
        }
      };

      socket.onerror = () => {
        console.error('❌ WebSocket error');
        setIsConnected(false);
      };

      socket.onclose = () => {
        console.warn('🔌 WebSocket disconnected');
        setIsConnected(false);

        reconnectInterval = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
    };

    connectWebSocket();

    return () => {
      if (socket) socket.close();
      if (reconnectInterval) clearTimeout(reconnectInterval);
    };
  }, [passengerId]);

  // ✅ ไปยังหน้าแชท
  const handleGoToChat = () => {
    if (bookingId && driverId && roomChatId) {
      navigate('/PassengerChat', {
        state: { bookingId, passengerId, driverId, roomChatId },
      });
    } else {
      alert('❌ Missing bookingId, driverId, or roomChatId to start chat');
    }
  };

  return (
    <div className="passengerbooking">
      <h1>🛎️ Passenger Notifications</h1>
      <div className="status">
        {isConnected ? (
          <p className="connected">🟢 WebSocket Connected</p>
        ) : (
          <p className="disconnected">🔴 WebSocket Disconnected</p>
        )}
      </div>
      <div className="notificationBox">
        <p>{message}</p>
      </div>
      <button
        className={`chatButton ${
            bookingId && driverId && roomChatId ? "enabled" : "disabled"
        }`}
          onClick={handleGoToChat}
          disabled={!bookingId || !driverId || !roomChatId}
      >
        💬 Go to Chat
      </button>

    </div>
  );
};

export default PassengerNotification;
