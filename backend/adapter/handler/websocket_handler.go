package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var clients = make(map[string]*websocket.Conn)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // อนุญาตทุก Origin
	},
}

// WebSocketPaymentHandler เชื่อมต่อ WebSocket และเก็บ booking_id
func WebSocketPaymentHandler(c *gin.Context) {
	id := c.Param("id") // รับ booking_id จาก URL

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("Failed to upgrade:", err)
		return
	}
	defer conn.Close()

	clients[id] = conn // เก็บการเชื่อมต่อใน map
	fmt.Printf("Client %s connected\n", id)

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("Client %s disconnected\n", id)
			delete(clients, id) // ลบการเชื่อมต่อเมื่อ disconnect
			break
		}
	}
}

// NotifySpecificClient ส่งข้อความไปยังไคลเอนต์ที่ระบุ booking_id
func NotifyPaymentClient(c *gin.Context) {
	var request struct {
		ID      string `json:"id"`
		Message string `json:"message"`
	}

	//  JSON กับ struct
	if err := c.BindJSON(&request); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	fmt.Printf("Request: %+v\n", request)

	conn, exists := clients[request.ID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Client not connected"})
		return
	}

	err := conn.WriteMessage(websocket.TextMessage, []byte(request.Message))
	if err != nil {
		fmt.Printf("Error sending message to client %s: %v\n", request.ID, err)
		delete(clients, request.ID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Message sent"})
}

// WebSocketHandler เชื่อมต่อ WebSocket และเก็บ driver_id
func WebSocketReviewHandler(c *gin.Context) {
	id := c.Param("id") // รับ driver_id จาก URL

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("Failed to upgrade:", err)
		return
	}
	defer conn.Close()

	clients[id] = conn // เก็บการเชื่อมต่อใน map
	fmt.Printf("Client %s connected\n", id)

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			fmt.Printf("Client %s disconnected\n", id)
			delete(clients, id) // ลบการเชื่อมต่อเมื่อ disconnect
			break
		}
	}
}

func NotifyReviewClient(c *gin.Context) {
	var request struct {
		ID      string `json:"id"`
		Message string `json:"message"`
	}

	if err := c.BindJSON(&request); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	fmt.Printf("Request: %+v\n", request)

	conn, exists := clients[request.ID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Client not connected"})
		return
	}

	err := conn.WriteMessage(websocket.TextMessage, []byte(request.Message))
	if err != nil {
		fmt.Printf("Error sending message to client %s: %v\n", request.ID, err)
		delete(clients, request.ID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Message sent"})
}
