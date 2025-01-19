import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMessageToBackend, getMessagesByRoomChatId, Message } from '../../services/https/booking';

// 🛠️ ประเภทของข้อความในแชท
interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}



// 🛎️ PassengerChat Component
const PassengerChat: React.FC = () => {
  const location = useLocation();
  const { bookingId, driverId, passengerId, roomChatId, } = location.state || {};

  
  console.log('🛠️ Booking ID:', bookingId);
  console.log('🛠️ Driver ID:', driverId);
  console.log('🛠️ Passenger ID:', passengerId);
  console.log('🛠️ RoomChat ID:', roomChatId);



  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // ✅ ตั้งค่า WebSocket
  useEffect(() => {
    if (!bookingId || socketRef.current) return;

    const ws = new WebSocket(`ws://localhost:8080/ws/chat/passenger/${bookingId}`);

    ws.onopen = () => {
      console.log('✅ Connected to Chat Room:', bookingId);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.sender !== 'You') {
          setMessages((prev) => {
            const isDuplicate = prev.some(
              (msg) =>
                msg.timestamp === data.timestamp &&
                msg.message === data.message &&
                msg.sender === data.sender
            );

            if (isDuplicate) {
              console.warn('⚠️ Duplicate message detected');
              return prev;
            }

            return [
              ...prev,
              {
                sender: data.sender || 'Unknown',
                message: data.message,
                timestamp: data.timestamp || new Date().toLocaleTimeString(),
              },
            ];
          });
        }
      } catch (error) {
        console.error('❌ Error parsing message:', error);
      }
    };

    ws.onclose = () => {
      console.warn('🔌 WebSocket disconnected. Reconnecting in 5 seconds...');
      setIsConnected(false);
      socketRef.current = null;
      setTimeout(() => {
        if (!socketRef.current) {
          socketRef.current = new WebSocket(`ws://localhost:8080/ws/chat/passenger/${bookingId}`);
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    socketRef.current = ws;

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [bookingId]);

  // ✅ ดึงข้อความจาก Backend ตาม roomChatId
  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomChatId) {
        console.warn('❌ Missing RoomChatId for fetching messages');
        return;
      }

      try {
        const fetchedMessages = await getMessagesByRoomChatId(String(roomChatId));
        console.log('✅ Fetched Messages:', fetchedMessages);
        setMessages(
          fetchedMessages.map((msg: any) => ({
            sender: msg.sender_type,
            message: msg.content,
            timestamp: msg.send_time,
          }))
        );
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [roomChatId]);


  // ✅ Scroll ไปยังข้อความล่าสุด
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages.length]);

  // ✅ ส่งข้อความ
  const handleSendMessage = async () => {
    if (!socketRef.current || !newMessage.trim()) {
      console.warn('❌ Cannot send empty message');
      return;
    }
  
    const timestamp = new Date().toLocaleTimeString();
  
    // ✉️ ส่งข้อความไปยัง WebSocket
    const messagePayload = {
      type: 'chat_message',
      bookingId,
      sender: 'Passenger',
      message: newMessage,
      timestamp,
      roomChatId, // ✅ เพิ่ม chatroomId ไปยัง WebSocket payload
    };
  
    console.log('📤 Sending message:', messagePayload);
  
    socketRef.current.send(JSON.stringify(messagePayload));
    setMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        message: newMessage,
        timestamp,
      },
    ]);
  
    // 💾 ส่งข้อความไปยัง Backend
    const backendMessage: Message = {
      
      content: newMessage,
      message_type: 'text',
      read_status: false,
      send_time: new Date().toISOString(),
      passenger_id: Number(passengerId),
      booking_id: Number(bookingId),
      driver_id: Number(driverId),
      sender_id: Number(passengerId),
      sender_type: 'Passenger',
      room_id: Number(roomChatId), // ✅ เพิ่ม chatroomId สำหรับ Backend
    };
  
    console.log('📤 Sending message to backend:', backendMessage);
  
    const res = await sendMessageToBackend(backendMessage);
    if (!res) {
      console.error('❌ Failed to save message to backend');
    }
  
    setNewMessage('');
  };
  
  return (
    <div style={styles.container}>
      <h1>💬 Chat with Driver</h1>
      <p><strong>Booking ID:</strong> {bookingId}</p>
      <p><strong>Driver ID:</strong> {driverId}</p>
      {isConnected ? (
        <p style={styles.connected}>🟢 Connected to Chat Room</p>
      ) : (
        <p style={styles.disconnected}>🔴 Disconnected from Chat Room</p>
      )}

      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'You' ? '#d1e7dd' : '#f8d7da',
            }}
          >
            <p><strong>{msg.sender}:</strong> {msg.message}</p>
            <p style={styles.timestamp}>{msg.timestamp}</p>
          </div>
        ))}
      </div>

      <div style={styles.inputSection}>
        <input
          style={styles.input}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="พิมพ์ข้อความที่นี่..."
        />
        <button style={styles.sendButton} onClick={handleSendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
};


// 🎨 CSS Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    //padding: '20px',
    textAlign: 'center' as const,
    maxWidth: '100%',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    //marginTop: '50px',
    backgroundColor: '#fff',
    color: '#000', // สีตัวอักษรเป็นสีดำ
  },
  connected: {
    color: 'green',
    fontWeight: 'bold',
  },
  disconnected: {
    color: 'red',
    fontWeight: 'bold',
  },
  chatBox: {
    marginTop: '20px',
    height: '400px',
    overflowY: 'scroll' as const,
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    color: '#000', // สีตัวอักษรเป็นสีดำ
  },
  message: {
    padding: '8px 12px',
    borderRadius: '8px',
    maxWidth: '70%',
    wordWrap: 'break-word' as const,
    color: '#000', // สีข้อความเป็นสีดำ
  },
  timestamp: {
    fontSize: '10px',
    color: '#666', // สีเวลาเป็นสีเทาเข้มเพื่อความแตกต่าง
    marginTop: '4px',
  },
  inputSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#D1C4E9',
    borderRadius: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#000', // สีข้อความใน input เป็นสีดำ
  },
  sendButton: {
    padding: '10px 15px',
    backgroundColor: '#9575CD',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
  },
};


export default PassengerChat;