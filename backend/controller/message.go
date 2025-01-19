package controller

import (
	"net/http"
	"project-se/entity"
	"project-se/config"
	"github.com/gin-gonic/gin"
	"strconv"
)

// 📥 CreateMessage - บันทึกข้อความลงฐานข้อมูล
func CreateMessage(c *gin.Context) {
	var message entity.Message

	// ตรวจสอบข้อมูลที่ส่งมา
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อความในฐานข้อมูล
	if err := config.DB().Create(&message).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": message})
}

// 📥 GetMessagesByBookingID - ดึงข้อความตาม BookingID
func GetMessagesByBookingID(c *gin.Context) {
	bookingIDParam := c.Param("bookingID")
	bookingID, err := strconv.Atoi(bookingIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Booking ID"})
		return
	}

	var messages []entity.Message
	result := config.DB().
		Where("booking_id = ?", bookingID).
		Order("send_time ASC").
		Find(&messages)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": messages})
}

// 📥 GetChatMessages - ดึงข้อความแชทตาม roomChatId
func GetChatMessages(c *gin.Context) {
	roomChatId := c.Param("roomChatId")
	if roomChatId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "roomChatId is required",
		})
		return
	}


	var messages []entity.Message
	if err := config.DB().Where("room_id = ?", roomChatId).Order("send_time ASC").Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to retrieve messages",
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"messages": messages,
	})

	
}
