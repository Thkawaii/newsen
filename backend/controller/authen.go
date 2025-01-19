package controller

import (
	"net/http"
	"errors"
	"github.com/gin-gonic/gin"
	"fmt"
	"gorm.io/gorm"
	"project-se/config"
	"project-se/entity"
	"project-se/services"
	"golang.org/x/crypto/bcrypt"
)

type ( 
	Authen struct {
		Email string `json:"email"`

		Password string `json:"password"`
	}

	signUp struct {
		UserName string `json:"user_name"`
		FirstName string `json:"first_name"`
		LastName string `json:"last_name"`
		Email string `json:"email"`
		PhoneNumber string `json:"phone_number"`
		Password string `json:"password"`
		GenderID uint `json:"gender_id"`
	}
)

func SignUp(c *gin.Context) {

	var payload signUp
 
	// Bind JSON payload to the struct

	if err := c.ShouldBindJSON(&payload); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	db := config.DB()

	var userCheck entity.Passenger

	// Check if the user with the provided email already exists
	result := db.Where("email = ?", payload.Email).First(&userCheck)

	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {

		// If there's a database error other than "record not found"

		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})

		return

	}

	if userCheck.ID != 0 {

		// If the user with the provided email already exists

		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})

		return

	}

	// Hash the user's password

	hashedPassword, _ := config.HashPassword(payload.Password)

	// Create a new user

	user := entity.Passenger{
		UserName: payload.UserName,
		FirstName: payload.FirstName,
		LastName: payload.LastName,
		Email: payload.Email,
		Password: hashedPassword,
		GenderID: payload.GenderID,
	}

	// Save the user to the database

	if err := db.Create(&user).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return
 
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})

}

// UniversalSignin handles user sign-in requests
func SignIn(c *gin.Context) {

    var payload Authen
    var employee entity.Employee
	var driver entity.Driver
    var passenger entity.Passenger
    var found bool = false
    var role string
    var roleID uint

    // ตรวจสอบ Payload
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    fmt.Println("Payload Email/Username:", payload.Email)

    db := config.DB()

	// Search in Employee entity
    if err := db.Where("email = ?", payload.Email, payload.Email).First(&employee).Error; err == nil {
        found = true
        roleID = employee.RolesID // ดึง roleID
    } else {
        fmt.Println("Employee not found:", err)
    }


    if !found {
        if err := db.Where("email = ?", payload.Email, payload.Email).First(&driver).Error; err == nil {
            found = true
            roleID = driver.RoleID // ดึง roleID
        } else {
            fmt.Println("Driver not found:", err)
        }
    }

	if !found {
        if err := db.Where("email = ?", payload.Email, payload.Email).First(&passenger).Error; err == nil {
            found = true
            roleID = passenger.RoleID // ดึง roleID
        } else {
            fmt.Println("Passenger not found:", err)
        }
    }

    // หากไม่พบข้อมูลในทั้งสองตาราง
    if !found {
        c.JSON(http.StatusBadRequest, gin.H{"error": "email not found"})
        return
    }

	// ตรวจสอบรหัสผ่าน
    var hashedPassword string
    if employee.ID != 0 {
        hashedPassword = employee.Password
    } else if driver.ID != 0{
        hashedPassword = driver.Password
    } else{
        hashedPassword = passenger.Password
    }

    err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(payload.Password))
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "password is incorrect"})
        return
    }

	// ค้นหา Role โดยใช้ roleID
    var roleEntity entity.Roles
    if err := db.Where("id = ?", roleID).First(&roleEntity).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "role not found"})
        return
    }
    role = roleEntity.Role // ดึงชื่อ role

    // สร้าง JWT Token พร้อม Role
    jwtWrapper := services.JwtWrapper{
        SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    var email string
    var userID uint
    if employee.ID != 0 {
        email = employee.Email
        userID = employee.ID
    } else if driver.ID != 0 {
        email = driver.Email
        userID = driver.ID
    } else{
        email = passenger.Email
        userID = passenger.ID
    } 

    signedToken, err := jwtWrapper.GenerateToken(email, role)
if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "error signing token"})
    return
}

    // ส่ง Response กลับ
    c.JSON(http.StatusOK, gin.H{
        "token_type": "Bearer",
        "token":      signedToken,
        "id":         userID,
        "role":       role,
    })

}