package controller

import (
	"log"
	"net/http"

	"project-se/config"
	"project-se/entity"

	"github.com/gin-gonic/gin"
)

// ดึงข้อมูล Room ทั้งหมด
func GetRooms(c *gin.Context) {
    var rooms []entity.Rooms
    db := config.DB()
    if err := db.Preload("Trainer").Find(&rooms).Error; err != nil {
        log.Printf("Error fetching rooms: %v\n", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch rooms"})
        return
    }
    log.Printf("Rooms fetched: %+v\n", rooms)
    c.JSON(http.StatusOK, rooms)
}

// ดึง Room ตาม ID
func GetRoomByID(c *gin.Context) {
	id := c.Param("id")
	var room entity.Rooms
	db := config.DB()

	// ใช้ Preload เพื่อดึงข้อมูลเทรนเนอร์
	if err := db.Preload("Trainer").First(&room, "id = ?", id).Error; err != nil {
		log.Printf("Error fetching room by ID (%s): %v\n", id, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": room})
}

// สร้าง Room ใหม่
func CreateRoom(c *gin.Context) {
	var room entity.Rooms
	if err := c.ShouldBindJSON(&room); err != nil {
		log.Printf("Invalid input data: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// ตรวจสอบว่า TrainerID มีอยู่จริงในฐานข้อมูล
	var trainer entity.Trainers
	if err := config.DB().First(&trainer, "id = ?", room.TrainerID).Error; err != nil {
		log.Printf("Invalid Trainer ID: %d\n", room.TrainerID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Trainer ID"})
		return
	}

	// บันทึกข้อมูลห้อง
	if err := config.DB().Create(&room).Error; err != nil {
		log.Printf("Error creating room: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create room"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Room created successfully", "data": room})
}

// อัปเดต Room
func UpdateRoom(c *gin.Context) {
    id := c.Param("id")
    var payload entity.Rooms

    // ตรวจสอบและแปลงข้อมูล JSON ที่รับมา
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
        return
    }

    // ตรวจสอบว่าห้องมีอยู่ในฐานข้อมูล
    var room entity.Rooms
    if err := config.DB().First(&room, "id = ?", id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
        return
    }

    // อัปเดตค่าจาก payload
    room.RoomName = payload.RoomName
    room.Capacity = payload.Capacity
    room.TrainerID = payload.TrainerID
    room.Detail = payload.Detail
    room.Title = payload.Title

    // บันทึกข้อมูลลงฐานข้อมูล
    if err := config.DB().Save(&room).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update room"})
        return
    }

    // ส่งข้อมูลกลับ
    c.JSON(http.StatusOK, gin.H{"message": "Room updated successfully", "data": room})
}

// ลบ Room
func DeleteRoom(c *gin.Context) {
	id := c.Param("id")
	var room entity.Rooms

	// ตรวจสอบว่า Room มีอยู่จริง
	if err := config.DB().First(&room, "id = ?", id).Error; err != nil {
		log.Printf("Room not found for delete: %s\n", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	// ลบ Room
	if err := config.DB().Delete(&room).Error; err != nil {
		log.Printf("Error deleting room: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete room"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room deleted successfully"})
}

// อัปเดตจำนวนการจอง
func UpdateRoomBookings(c *gin.Context) {
	id := c.Param("id")
	var room entity.Rooms

	// ตรวจสอบว่า Room มีอยู่จริง
	if err := config.DB().First(&room, "id = ?", id).Error; err != nil {
		log.Printf("Room not found for bookings update: %s\n", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	var input struct {
		CurrentBookings uint `json:"current_bookings"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("Invalid input data for bookings update: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	if input.CurrentBookings > uint(room.Capacity) {
		log.Printf("Bookings exceed room capacity: %d > %d\n", input.CurrentBookings, room.Capacity)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bookings exceed room capacity"})
		return
	}

	room.CurrentBookings = uint8(input.CurrentBookings)
	if err := config.DB().Save(&room).Error; err != nil {
		log.Printf("Error updating bookings: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room bookings updated successfully", "data": room})
}
