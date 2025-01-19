package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"project-se/config"
	"project-se/entity"
)

// GET /vehicletype/:id
func GetVehicleType(c *gin.Context) {
	ID := c.Param("id")
	var vehicleType entity.VehicleType

	// ดึงข้อมูล VehicleType ตาม ID
	db := config.DB()
	result := db.First(&vehicleType, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	if vehicleType.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, vehicleType)
}

// GET /vehicletypes
func ListVehicleTypes(c *gin.Context) {
	var vehicleTypes []entity.VehicleType

	// ดึงข้อมูล VehicleType ทั้งหมด
	db := config.DB()
	result := db.Find(&vehicleTypes)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, vehicleTypes)
}
