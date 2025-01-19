package controller

import (
	"fmt"
	"log"
	"net/http"

	"project-se/config"
	"project-se/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ดึงข้อมูลการจองทั้งหมด แต่ให้ดึงเฉพาะห้องที่ถูกเลือกเท่านั้น
func GetTrainBookings(c *gin.Context) {
	var bookings []entity.TrainBook
	db := config.DB()

	// รับค่า room_id จาก Query Parameter
	roomID := c.Query("room_id")

	query := db.Preload("Driver").Preload("Room.Trainer") // ✅ เพิ่ม Preload Trainer

	if roomID != "" {
		query = query.Where("room_id = ?", roomID)
	}

	if err := query.Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลการจองได้"})
		return
	}

	c.JSON(http.StatusOK, bookings)
}

// ✅ ดึงข้อมูลการจองตาม ID
func GetTrainBookingByID(c *gin.Context) {
	id := c.Param("id")
	var booking entity.TrainBook
	db := config.DB()
	if err := db.Preload("Driver").Preload("Room").First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการจอง"})
		return
	}
	c.JSON(http.StatusOK, booking)
}

// ✅ สร้างการจองใหม่ (อัปเดต)
func CreateTrainBookingByRoom(c *gin.Context) {
	var input entity.TrainBook

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON Binding Error: ข้อมูล JSON ไม่ถูกต้อง"})
		return
	}

	fmt.Println("📡 JSON ที่ได้รับจาก Frontend:", input)

	db := config.DB()

	// ตรวจสอบว่า Driver มีอยู่จริง
	var driver entity.Driver
	if err := db.First(&driver, input.DriverID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบ Driver ที่ระบุ"})
		return
	}

	// ตรวจสอบว่า Room มีอยู่จริง
	var room entity.Rooms
	if err := db.First(&room, input.RoomID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบห้องที่ระบุ"})
		return
	}

	// ✅ ตรวจสอบว่าห้องเต็มหรือไม่
	if room.CurrentBookings >= room.Capacity {
		fmt.Println("❌ ห้องนี้เต็มแล้ว ไม่สามารถจองได้")
		c.JSON(http.StatusConflict, gin.H{"error": "ห้องนี้เต็มแล้ว ไม่สามารถจองได้"})
		return
	}

	// ✅ ตรวจสอบว่ามีการจองที่สถานะ in-progress อยู่แล้วหรือไม่
	var existingBooking entity.TrainBook
	if err := db.Where("driver_id = ? AND status = ?", input.DriverID, "in-progress").First(&existingBooking).Error; err == nil {
		// หาก Driver มีการจองในสถานะ in-progress อยู่
		c.JSON(http.StatusConflict, gin.H{"error": "คุณมีการจองที่กำลังดำเนินการอยู่ ไม่สามารถจองห้องใหม่ได้"})
		return
	} else if err != gorm.ErrRecordNotFound {
		// หากเกิดข้อผิดพลาดที่ไม่ใช่การไม่พบข้อมูล
		fmt.Println("❌ เกิดข้อผิดพลาดในการตรวจสอบสถานะการจอง:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการตรวจสอบสถานะการจอง"})
		return
	}

	// ✅ ตรวจสอบว่ามีการจองซ้ำในห้องเดียวกันหรือไม่
	if err := db.Where("driver_id = ? AND room_id = ?", input.DriverID, input.RoomID).First(&existingBooking).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "คุณได้จองห้องนี้ไปแล้ว"})
		return
	} else if err != gorm.ErrRecordNotFound {
		// หากเกิดข้อผิดพลาดที่ไม่ใช่การไม่พบข้อมูล
		fmt.Println("❌ เกิดข้อผิดพลาดในการตรวจสอบการจองห้องซ้ำ:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดในการตรวจสอบการจองห้องซ้ำ"})
		return
	}

	// สร้างการจอง
	trainBooking := entity.TrainBook{
		DriverID: input.DriverID,
		RoomID:   input.RoomID,
		Status:   "in-progress",
	}

	if err := db.Create(&trainBooking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถบันทึกการจองได้"})
		return
	}

	// อัปเดตจำนวน CurrentBookings ของห้อง
	if err := db.Model(&room).Update("current_bookings", room.CurrentBookings+1).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตจำนวนการจองของห้องได้"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "สร้างการจองสำเร็จ", "trainbook": trainBooking})
}

// ✅ อัปเดตข้อมูลการจอง (อัปเดต)
func UpdateTrainBooking(c *gin.Context) {
	id := c.Param("id")
	var trainbook entity.TrainBook

	db := config.DB()
	if err := db.First(&trainbook, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการจอง"})
		return
	}

	var input entity.TrainBook
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	// ✅ ตรวจสอบว่า RoomID และ DriverID ใหม่มีอยู่จริง
	var room entity.Rooms
	if err := db.First(&room, input.RoomID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบห้องที่ระบุ"})
		return
	}

	var driver entity.Driver
	if err := db.First(&driver, input.DriverID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบผู้ขับที่ระบุ"})
		return
	}

	// ✅ อัปเดตข้อมูลการจอง
	trainbook.Status = input.Status
	trainbook.RoomID = input.RoomID
	trainbook.DriverID = input.DriverID

	if err := db.Save(&trainbook).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตข้อมูลได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "อัปเดตการจองสำเร็จ", "trainbook": trainbook})
}

// ✅ ลบการจอง (อัปเดต)
func DeleteTrainBooking(c *gin.Context) {
	id := c.Param("id")
	var booking entity.TrainBook
	db := config.DB()
	if err := db.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการจอง"})
		return
	}

	// ✅ ลดจำนวนการจองของห้อง
	var room entity.Rooms
	if err := db.First(&room, booking.RoomID).Error; err == nil {
		if room.CurrentBookings > 0 {
			room.CurrentBookings--
			db.Save(&room)
		}
	}

	// ✅ ใช้ Transaction ป้องกันปัญหา Integrity
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&booking).Error; err != nil {
			return err
		}
		log.Println("✅ ลบการจองสำเร็จ:", booking)
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูลการจองได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบการจองสำเร็จ"})
}

// ✅ อัปเดตสถานะของการจอง
func UpdateTrainBookingStatus(c *gin.Context) {
	id := c.Param("id")
	var trainbook entity.TrainBook
	db := config.DB()

	// ดึงข้อมูลการจองจาก ID
	if err := db.First(&trainbook, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลการจอง"})
		return
	}

	// ตรวจสอบ JSON ที่ได้รับ
	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูล JSON ไม่ถูกต้อง"})
		return
	}

	// อัปเดตสถานะ
	previousStatus := trainbook.Status
	trainbook.Status = input.Status
	
	if err := db.Save(&trainbook).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตสถานะได้"})
		return
	}

	if previousStatus != "completed" && input.Status == "completed" {
        var room entity.Rooms
        if err := db.First(&room, trainbook.RoomID).Error; err == nil {
            if room.CurrentBookings > 0 {
                room.CurrentBookings--
                if err := db.Save(&room).Error; err != nil {
                    fmt.Println("❌ ไม่สามารถลดจำนวน CurrentBookings:", err)
                } else {
                    fmt.Println("✅ ลดจำนวน CurrentBookings สำเร็จ:", room.CurrentBookings)
                }
            }
        } else {
            fmt.Println("❌ ไม่พบห้องสำหรับอัปเดต CurrentBookings:", err)
        }
    }

	c.JSON(http.StatusOK, gin.H{"message": "อัปเดตสถานะสำเร็จ", "trainbook": trainbook})
}
