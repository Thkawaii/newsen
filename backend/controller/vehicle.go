package controller

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"project-se/config"
	"project-se/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateVehicle - สร้าง Vehicle พร้อมแปลงข้อมูลและบันทึกรูปภาพโปรไฟล์
func CreateVehicle(c *gin.Context) {
	var vehicle entity.Vehicle

	// รับข้อมูลจาก form-data
	licensePlate := c.PostForm("license_plate")
	brand := c.PostForm("brand")
	vehicleModel := c.PostForm("vehicle_model")
	color := c.PostForm("color")
	dateOfPurchaseStr := c.PostForm("date_of_purchase")
	expirationDateStr := c.PostForm("expiration_date_of_vehicle_act")
	capacityStr := c.PostForm("capacity")
	vehicleTypeIDStr := c.PostForm("vehicle_type_id")
	employeeIDStr := c.PostForm("employee_id")
	statusIDStr := c.PostForm("status_id")

	// ตรวจสอบค่าที่จำเป็น
	if licensePlate == "" || brand == "" || vehicleModel == "" || dateOfPurchaseStr == "" || expirationDateStr == "" || capacityStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Required fields are missing"})
		return
	}

	// แปลงวันที่จาก string เป็น time.Time
	dateOfPurchase, err := time.Parse("2006-01-02", dateOfPurchaseStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date_of_purchase format, must be YYYY-MM-DD"})
		return
	}

	expirationDate, err := time.Parse("2006-01-02", expirationDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiration_date_of_vehicle_act format, must be YYYY-MM-DD"})
		return
	}

	// แปลง Capacity เป็น int
	capacity, err := strconv.Atoi(capacityStr)
	if err != nil || capacity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid capacity format"})
		return
	}

	// แปลง VehicleTypeID, EmployeeID, StatusID เป็น uint
	vehicleTypeID, _ := strconv.Atoi(vehicleTypeIDStr)
	employeeID, _ := strconv.Atoi(employeeIDStr)
	statusID, _ := strconv.Atoi(statusIDStr)

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

	// สร้าง Vehicle object
	vehicle = entity.Vehicle{
		LicensePlate:              licensePlate,
		Brand:                     brand,
		VehicleModel:              vehicleModel,
		Color:                     color,
		DateOfPurchase:            dateOfPurchase,
		ExpirationDateOfVehicleAct: expirationDate,
		Capacity:                  capacity,
		VehicleTypeID:             uint(vehicleTypeID),
		EmployeeID:                uint(employeeID),
		VehicleStatusID:                  uint(statusID),
	}

	// ใช้ Transaction สำหรับการบันทึกข้อมูล
	tx := config.DB().Begin()

	// บันทึกข้อมูล Vehicle
	if err := tx.Create(&vehicle).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save vehicle"})
		return
	}

	// ตั้งชื่อไฟล์รูปภาพ
	newFileName := fmt.Sprintf("vehicle_id%03d.png", vehicle.ID)
	uploadPath := filepath.Join("Images", "Vehicles", newFileName)

	// ตรวจสอบและสร้างโฟลเดอร์
	if err := os.MkdirAll(filepath.Dir(uploadPath), os.ModePerm); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot create directory"})
		return
	}

	// บันทึกไฟล์ในระบบ
	if err := c.SaveUploadedFile(file, uploadPath); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save file"})
		return
	}

	// Commit Transaction
	tx.Commit()

	// ส่ง Response กลับ
	c.JSON(http.StatusCreated, gin.H{
		"message": "Vehicle created successfully",
		"data":    vehicle,
	})
}

// GetVehicles - ดึงข้อมูล Vehicle ทั้งหมด
func GetVehicles(c *gin.Context) {
	var vehicles []entity.Vehicle

	if err := config.DB().Preload("VehicleType").Preload("Employee").Preload("Status").Find(&vehicles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vehicles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"vehicles": vehicles})
}

// GetVehicleDetail - ดึงข้อมูล Vehicle ตาม ID
func GetVehicleDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid vehicle ID"})
		return
	}

	var vehicle entity.Vehicle
	if err := config.DB().Preload("VehicleType").Preload("Employee").Preload("Status").Where("id = ?", id).First(&vehicle).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vehicle details"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"vehicle": vehicle})
}

// UpdateVehicle - อัปเดตข้อมูล Vehicle
func UpdateVehicle(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid vehicle ID"})
		return
	}

	var vehicle entity.Vehicle
	if err := config.DB().First(&vehicle, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
		return
	}

	if err := c.ShouldBind(&vehicle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	if err := config.DB().Save(&vehicle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update vehicle"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vehicle updated successfully", "data": vehicle})
}

// DeleteVehicle - ลบข้อมูล Vehicle
func DeleteVehicle(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid vehicle ID"})
		return
	}

	if err := config.DB().Delete(&entity.Vehicle{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vehicle"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vehicle deleted successfully"})
}
