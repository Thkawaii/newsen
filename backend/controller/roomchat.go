package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"project-se/config"
	"project-se/entity"
)

// CreateRoomChat handles the creation of a RoomChat
func CreateRoomChat(c *gin.Context) {
	var roomChat entity.RoomChat

	// 🛡️ ตรวจสอบ JSON Input
	if err := c.ShouldBindJSON(&roomChat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid input data: " + err.Error(),
		})
		return
	}

	// 🛠️ บันทึก RoomChat ลงในฐานข้อมูล
	if err := config.DB().Create(&roomChat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create RoomChat: " + err.Error(),
		})
		return
	}

	// 🎯 ส่ง Response กลับไปยัง Client พร้อมกับ ID
	c.JSON(http.StatusOK, gin.H{
		"message": "RoomChat created successfully",
		"id":      roomChat.ID, // ส่ง ID กลับมาให้ Frontend โดยตรง
		"data":    roomChat,
	})
}
