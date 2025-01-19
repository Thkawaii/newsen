package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"project-se/config"
	"project-se/entity"
)

// ดึงข้อมูล Gender ทั้งหมด
func GetAllGender(c *gin.Context) {
	var gender []entity.Gender
	db := config.DB()
	if err := db.Find(&gender).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถดึงข้อมูลเพศได้"})
		return
	}
	c.JSON(http.StatusOK, gender)
}

// ดึงข้อมูล Gender ตาม ID
func GetGenderByID(c *gin.Context) {
	id := c.Param("id")
	var gender entity.Gender
	db := config.DB()
	if err := db.First(&gender, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลเพศที่ต้องการ"})
		return
	}
	c.JSON(http.StatusOK, gender)
}
