package servicesocket

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// ================================
// 🛠️ **WebSocket Hub**
// ================================

// เก็บห้อง WebSocket และการเชื่อมต่อ
var clients = make(map[string]map[*websocket.Conn]bool) // map[roomID] -> set of connections
var clientsMutex sync.Mutex

// อัปเกรด HTTP เป็น WebSocket
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // อนุญาตทุก Origin (สำหรับ Development เท่านั้น)
	},
}

// ================================
// 🚀 **WebSocket Functions**
// ================================

// เพิ่มการเชื่อมต่อในห้อง
func AddClientConnection(room string, conn *websocket.Conn) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	if _, exists := clients[room]; !exists {
		clients[room] = make(map[*websocket.Conn]bool)
		fmt.Printf("✅ Room created: %s\n", room)
	}
	clients[room][conn] = true
	fmt.Printf("✅ Connection added to room %s\n", room)
}

// เอาการเชื่อมต่อออกจากห้อง
func RemoveClientConnection(room string, conn *websocket.Conn) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	if _, exists := clients[room]; exists {
		delete(clients[room], conn)
		if len(clients[room]) == 0 {
			delete(clients, room)
			fmt.Printf("🗑️ Room removed: %s\n", room)
		}
	}
}

// ส่งข้อความไปยังทุกคนในห้อง
func BroadcastMessage(room string, message interface{}) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	if _, exists := clients[room]; exists {
		for conn := range clients[room] {
			err := conn.WriteJSON(message)
			if err != nil {
				log.Println("❌ Error broadcasting message:", err)
				conn.Close()
				delete(clients[room], conn)
			}
		}
	}
}

// อัปเกรด HTTP เป็น WebSocket
func UpgradeConnection(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	return upgrader.Upgrade(w, r, nil)
}

// ================================
// 💬 **WebSocket Handler**
// ================================

// HandleRoom: จัดการห้องแชทตาม roomID
func HandleRoom(roomID string, w http.ResponseWriter, r *http.Request) {
	// อัปเกรดเป็น WebSocket
	conn, err := UpgradeConnection(w, r)
	if err != nil {
		fmt.Println("❌ Error upgrading to WebSocket:", err)
		return
	}
	defer conn.Close()

	// เพิ่มการเชื่อมต่อในห้อง
	AddClientConnection(roomID, conn)

	// รอรับข้อความจากผู้ใช้
	for {
		var message map[string]interface{}
		err := conn.ReadJSON(&message)
		if err != nil {
			log.Println("❌ Error reading message:", err)
			RemoveClientConnection(roomID, conn)
			break
		}

		// ส่งข้อความไปยังทุกคนในห้อง
		BroadcastMessage(roomID, message)
	}
}
