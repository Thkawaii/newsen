package controller

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"project-se/config"
	"project-se/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"sync"
	"github.com/gorilla/websocket"
	"log"
	
)

// CreatePassenger - สร้าง Passenger พร้อมจัดการข้อมูลและไฟล์โปรไฟล์
func CreatePassenger(c *gin.Context) {
	var passenger entity.Passenger

	// รับข้อมูลจาก form-data
	username := c.PostForm("username")
	firstname := c.PostForm("first_name")
	lastname := c.PostForm("last_name")
	phoneNumber := c.PostForm("phone_number")
	email := c.PostForm("email")
	password := c.PostForm("password")
	genderIDStr := c.PostForm("gender_id") // รับ Gender ID

	// ตรวจสอบค่าที่จำเป็น
	if username == "" || firstname == "" || lastname == "" || phoneNumber == "" || email == "" || password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Required fields are missing"})
		return
	}

	// แปลง GenderID เป็น uint
	genderID, err := strconv.Atoi(genderIDStr)
	if err != nil || genderID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid gender_id"})
		return
	}

	// รับไฟล์รูปภาพ
	file, err := c.FormFile("profile")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file upload"})
		return
	}

	// ตรวจสอบประเภทไฟล์
	if file.Header.Get("Content-Type") != "image/png" && file.Header.Get("Content-Type") != "image/jpeg" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only PNG and JPEG files are allowed"})
		return
	}

	// สร้าง Passenger object
	passenger = entity.Passenger{
		UserName:      username,
		FirstName:     firstname,
		LastName:      lastname,
		PhoneNumber:   phoneNumber,
		Email:         email,
		Password:      password,
		GenderID:      uint(genderID),
	}

	// ใช้ Transaction สำหรับการบันทึกข้อมูล
	tx := config.DB().Begin()

	// บันทึกข้อมูล Passenger
	if err := tx.Create(&passenger).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save passenger"})
		return
	}

	// ตั้งชื่อไฟล์รูปภาพ
	newFileName := fmt.Sprintf("passenger_id%03d.png", passenger.ID)
	uploadPath := filepath.Join("Images", "Passengers", newFileName)

	// ตรวจสอบและสร้างโฟลเดอร์
	if err := os.MkdirAll(filepath.Dir(uploadPath), os.ModePerm); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot create directory"})
		return
	}

	// Commit Transaction
	tx.Commit()

	// ส่ง Response กลับ
	c.JSON(http.StatusCreated, gin.H{
		"message": "Passenger created successfully",
		"data":    passenger,
	})
}

// GetPassengers - ดึงข้อมูล Passenger ทั้งหมด
func GetPassengers(c *gin.Context) {
	var passengers []entity.Passenger

	if err := config.DB().Preload("Gender").Find(&passengers).Error; err != nil {
		fmt.Println("Error retrieving passenger:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch passengers"})
		return
	}
	fmt.Println("passenger retrieved successfully:", passengers)
	c.JSON(http.StatusOK, gin.H{"passengers": passengers})
}

// GetPassengerDetail - ดึงข้อมูล Passenger รายบุคคล
func GetPassengerDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid passenger ID"})
		return
	}

	var passenger entity.Passenger
	if err := config.DB().Preload("Gender").Where("id = ?", id).First(&passenger).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Passenger not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch passenger details"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"passenger": passenger})
}

// ดึงข้อมูลผู้โดยสารตาม ID
func GetPassengerByID(c *gin.Context) {
    id := c.Param("id") // รับ ID จาก URL
    var passenger entity.Passenger

    db := config.DB()

    // ดึงข้อมูล Passenger พร้อมกับ Role
    if err := db.Preload("Role").Preload("Gender").First(&passenger, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Passenger not found"})
        return
    }

    // ส่งข้อมูลกลับไปยัง Frontend
    c.JSON(http.StatusOK, gin.H{
        "id":         passenger.ID,
        "username":   passenger.UserName,
        "first_name": passenger.FirstName,
        "last_name":  passenger.LastName,
        "phone":      passenger.PhoneNumber,
        "email":      passenger.Email,
        "role":       passenger.Role, // ส่ง Role ทั้ง Object หรือเฉพาะชื่อก็ได้
    })
}






// UpdatePassenger - อัปเดตข้อมูล Passenger
func UpdatePassenger(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid passenger ID"})
		return
	}

	// ค้นหา Passenger
	var passenger entity.Passenger
	if err := config.DB().First(&passenger, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Passenger not found"})
		return
	}

	// รับข้อมูลใหม่จาก FormData
	if err := c.ShouldBind(&passenger); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// บันทึกการเปลี่ยนแปลง
	if err := config.DB().Save(&passenger).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update passenger"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Passenger updated successfully", "data": passenger})
}

// DeletePassenger - ลบข้อมูล Passenger
func DeletePassenger(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid passenger ID"})
		return
	}

	if err := config.DB().Delete(&entity.Passenger{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete passenger"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Passenger deleted successfully"})
}


//เก็บการเชื่อมต่อ WebSocket ของ Passenger แต่ละคน
var passengerConnections = make(map[string]*websocket.Conn)
// ใช้ Mutex สำหรับป้องกันการเข้าถึง Map พร้อมกัน
var passengerMutex sync.Mutex

// Upgrade HTTP Request เป็น WebSocket
var passengerupgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// ConnectPassengerWebSocket
// ใช้สำหรับเชื่อมต่อ WebSocket ของ Passenger
func ConnectPassengerWebSocket(c *gin.Context) {
	passengerId := c.Param("passengerId")

	conn, err := passengerupgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("❌ WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	// บันทึก Passenger การเชื่อมต่อ
	passengerMutex.Lock()
	passengerConnections[passengerId] = conn
	log.Printf("✅ Passenger %s connected via WebSocket", passengerId)
	log.Printf("🛠️ Current passenger connections: %+v", passengerConnections)
	passengerMutex.Unlock()

	// รอรับข้อความจาก Passenger
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("❌ Error reading message from passenger %s: %v", passengerId, err)
			passengerMutex.Lock()
			delete(passengerConnections, passengerId)
			log.Printf("🛠️ Passenger %s removed from connections", passengerId)
			passengerMutex.Unlock()
			break
		}
		log.Printf("📩 Message from passenger %s: %s", passengerId, msg)
	}

	log.Printf("🔌 Passenger %s disconnected", passengerId)
}

// NotifyPassenger - ส่งข้อความแจ้งเตือน พร้อม driverId และ bookingId
// NotifyPassenger - ส่งข้อความแจ้งเตือน พร้อม driverId, bookingId และ roomChatId
func NotifyPassenger(passengerId string, driverId string, bookingId string, roomChatId string, message string) error {
	passengerMutex.Lock()
	defer passengerMutex.Unlock()

	log.Printf("🛠️ Checking connection for Passenger ID: %s", passengerId)
	conn, exists := passengerConnections[passengerId]
	if !exists {
		log.Printf("❌ Passenger %s is not connected", passengerId)
		return fmt.Errorf("❌ Passenger %s is not connected", passengerId)
	}

	// 📦 JSON Payload ที่จะส่งไปยัง WebSocket
	payload := fmt.Sprintf(
		`{"type": "notification", "message": "%s", "driverId": "%s", "bookingId": "%s", "roomChatId": "%s"}`,
		message, driverId, bookingId, roomChatId,
	)

	// 📤 ส่งข้อความไปยัง Passenger ผ่าน WebSocket
	err := conn.WriteMessage(websocket.TextMessage, []byte(payload))
	if err != nil {
		log.Printf("❌ Failed to send message to passenger %s: %v", passengerId, err)
		delete(passengerConnections, passengerId)
		return err
	}

	log.Printf("✅ Notification sent to passenger %s: %s", passengerId, message)
	return nil
}


// NotifyPassengerHandler - ส่งการแจ้งเตือนถึง Passenger

func NotifyPassengerHandler(c *gin.Context) {
	passengerId := c.Param("passengerId")

	// 📝 JSON Payload
	var requestBody struct {
		Message    string `json:"message"`
		DriverId   string `json:"driverId"`
		BookingId  string `json:"bookingId"`
		RoomChatId string `json:"roomChatId"` // ✅ เพิ่ม roomChatId
	}

	// 📥 ตรวจสอบ JSON Payload
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		log.Println("❌ Invalid JSON payload:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid JSON payload",
			"error":   err.Error(),
		})
		return
	}

	// ✅ ตรวจสอบฟิลด์ที่จำเป็น
	if requestBody.DriverId == "" || requestBody.BookingId == "" || requestBody.Message == "" || requestBody.RoomChatId == "" {
		log.Println("❌ Missing required fields: driverId, bookingId, message, or roomChatId")
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Missing required fields: driverId, bookingId, message, or roomChatId",
		})
		return
	}

	log.Printf(
		"🛠️ Sending notification to Passenger %s | DriverId: %s | BookingId: %s | RoomChatId: %s | Message: %s\n",
		passengerId, requestBody.DriverId, requestBody.BookingId, requestBody.RoomChatId, requestBody.Message,
	)

	// 🚀 ส่งการแจ้งเตือน
	if err := NotifyPassenger(passengerId, requestBody.DriverId, requestBody.BookingId, requestBody.RoomChatId, requestBody.Message); err != nil {
		log.Printf("❌ Failed to notify passenger %s: %v\n", passengerId, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to notify passenger",
			"error":   err.Error(),
		})
		return
	}

	// ✅ ส่ง Response กลับไปยัง Frontend
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Message sent to passenger %s with driverId %s, bookingId %s, and roomChatId %s", passengerId, requestBody.DriverId, requestBody.BookingId, requestBody.RoomChatId),
	})
}
