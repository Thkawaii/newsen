package controller

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// เก็บการเชื่อมต่อ WebSocket สำหรับแชท
var chatRooms = make(map[string]map[*websocket.Conn]string) // map[bookingID] -> map[conn]role


// อัปเกรด HTTP เป็น WebSocket
var chatupgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // อนุญาตทุก Origin (เฉพาะสำหรับการพัฒนา)
	},
}

// เพิ่มการเชื่อมต่อห้องแชท
func addChatConnection(bookingID string, conn *websocket.Conn, role string) {
	if _, exists := chatRooms[bookingID]; !exists {
		chatRooms[bookingID] = make(map[*websocket.Conn]string)
	}
	chatRooms[bookingID][conn] = role
	fmt.Printf("✅ %s connected to chat room %s\n", role, bookingID)
}

// ลบการเชื่อมต่อห้องแชท
func removeChatConnection(bookingID string, conn *websocket.Conn) {
	if _, exists := chatRooms[bookingID]; exists {
		delete(chatRooms[bookingID], conn)
		if len(chatRooms[bookingID]) == 0 {
			delete(chatRooms, bookingID)
		}
		fmt.Printf("❌ Connection removed from chat room %s\n", bookingID)
	}
}

// ส่งข้อความในห้องแชท
func broadcastChatMessage(bookingID string, message []byte, senderRole string) {
	if _, exists := chatRooms[bookingID]; !exists {
		log.Printf("❌ Chat room %s does not exist\n", bookingID)
		return
	}

	for conn, role := range chatRooms[bookingID] {
		if role != senderRole { // ส่งข้อความถึงฝ่ายตรงข้ามเท่านั้น
			err := conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				log.Println("❌ Error sending chat message:", err)
				removeChatConnection(bookingID, conn)
			}
		}
	}
}

// Handler สำหรับ Passenger
func PassengerWebSocketHandler(c *gin.Context) {
	bookingID := c.Param("bookingID")

	conn, err := chatupgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("❌ Failed to upgrade WebSocket connection:", err)
		return
	}
	defer conn.Close()

	addChatConnection(bookingID, conn, "passenger")
	log.Printf("✅ Passenger connected to chat room %s", bookingID)

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("❌ Error reading message from passenger:", err)
			removeChatConnection(bookingID, conn)
			break
		}
		log.Printf("📩 Passenger Message [%s]: %s", bookingID, string(msg))
		broadcastChatMessage(bookingID, msg, "passenger")
	}
}


// Handler สำหรับ Driver
func DriverChatWebSocketHandler(c *gin.Context) {
	bookingID := c.Param("bookingID")

	conn, err := chatupgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("❌ Failed to upgrade WebSocket connection:", err)
		return
	}
	defer conn.Close()

	addChatConnection(bookingID, conn, "driver")
	log.Printf("✅ Driver connected to chat room %s", bookingID)

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("❌ Error reading message from driver:", err)
			removeChatConnection(bookingID, conn)
			break
		}
		log.Printf("📩 Driver Message [%s]: %s", bookingID, string(msg))
		broadcastChatMessage(bookingID, msg, "driver")
	}
}
