package controller

import (
	"errors"
	"net/http"
	"strconv"
	"time"
	"project-se/config"
	"project-se/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateDriver - สร้าง Driver พร้อมแปลงวันที่และบันทึกรูปโปรไฟล์
func CreateDriver(c *gin.Context) {
	var input struct {
		Firstname                   string  `json:"firstname" binding:"required"`
		Lastname                    string  `json:"lastname" binding:"required"`
		PhoneNumber                 string  `json:"phone_number" binding:"required"`
		DateOfBirth                 string  `json:"date_of_birth" binding:"required"`
		IdentificationNumber        string  `json:"identification_number" binding:"required"`
		DriverLicensenumber         string  `json:"driver_license_number" binding:"required"`
		DriverLicenseExpirationDate string  `json:"driver_license_expiration_date" binding:"required"`
		Income                      float64 `json:"income" binding:"required"`
		Profile                     string  `json:"profile"`
		Email                       string  `json:"email" binding:"required,email"`
		Password                    string  `json:"password" binding:"required"`
		GenderID                    uint    `json:"gender_id" binding:"required"`
		EmployeeID                  uint    `json:"employee_id" binding:"required"`
	}

	// Bind JSON to the input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data: " + err.Error()})
		return
	}

	// Validate input using go-playground/validator
	if err := validate.Struct(input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Validation error: " + err.Error()})
		return
	}

	db := config.DB()

	// Check if email already exists
	var existingDriver entity.Driver
	if err := db.Where("email = ?", input.Email).First(&existingDriver).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	} else if err != nil && err.Error() != "record not found" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}

	// Parse date fields
	dateOfBirth, err := time.Parse("2006-01-02", input.DateOfBirth)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date_of_birth format"})
		return
	}

	driverLicenseExpirationDate, err := time.Parse("2006-01-02", input.DriverLicenseExpirationDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver_license_expiration_date format"})
		return
	}

	// Hash password
	hashedPassword, hashErr := config.HashPassword(input.Password)
	if hashErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	// Fetch related entities by ID
	var gender entity.Gender
	if err := db.First(&gender, input.GenderID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid GenderID"})
		return
	}

	var employee entity.Employee
	if err := db.First(&employee, input.EmployeeID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid EmployeeID"})
		return
	}

	// Assign RoleID
	roleID := uint(2) // Assuming 5 corresponds to the driver role.

	// Create Driver object
	driver := entity.Driver{
		Firstname:                   input.Firstname,
		Lastname:                    input.Lastname,
		PhoneNumber:                 input.PhoneNumber,
		DateOfBirth:                 dateOfBirth,
		IdentificationNumber:        input.IdentificationNumber,
		DriverLicensenumber:         input.DriverLicensenumber,
		DriverLicenseExpirationDate: driverLicenseExpirationDate,
		Income:                      input.Income,
		Profile:                     input.Profile,
		Email:                       input.Email,
		Password:                    hashedPassword,
		GenderID:                    input.GenderID,
		EmployeeID:                  input.EmployeeID,
		RoleID:                      roleID,
	}

	// Save to database
	if err := db.Create(&driver).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving driver: " + err.Error()})
		return
	}

	// Respond with the created driver
	c.JSON(http.StatusCreated, gin.H{
		"message": "Driver created successfully",
		"data":    driver,
	})
}


// GetDrivers - ดึงข้อมูล Driver ทั้งหมด
func GetDrivers(c *gin.Context) {
	var drivers []entity.Driver

	// ดึงข้อมูล Driver พร้อม Preload ข้อมูลที่เกี่ยวข้อง
	if err := config.DB().Preload("Gender").Preload("Status").Find(&drivers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch drivers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"drivers": drivers})
}

// GetDriverDetail - ดึงข้อมูล Driver รายบุคคล
func GetDriverDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver ID"})
		return
	}

	var driver entity.Driver
	if err := config.DB().Preload("Gender").Preload("Status").Where("id = ?", id).First(&driver).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Driver not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch driver details"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"driver": driver})
}

// UpdateDriver - อัปเดตข้อมูล Driver
func UpdateDriver(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver ID"})
		return
	}

	// ค้นหา Driver
	var driver entity.Driver
	if err := config.DB().First(&driver, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Driver not found"})
		return
	}

	// รับข้อมูลใหม่จาก FormData
	if err := c.ShouldBind(&driver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// บันทึกการเปลี่ยนแปลง
	if err := config.DB().Save(&driver).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update driver"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Driver updated successfully", "data": driver})
}

// DeleteDriver - ลบข้อมูล Driver
func DeleteDriver(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver ID"})
		return
	}

	if err := config.DB().Delete(&entity.Driver{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete driver"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Driver deleted successfully"})
}
