package controller

import (
	"fmt"
	"net/http"
	"time"

	"project-se/config"
	"project-se/entity"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

// CreateEmployee handles creating a new employee
func CreateEmployee(c *gin.Context) {
	var input struct {
		Firstname   string  `json:"firstname" binding:"required"`
		Lastname    string  `json:"lastname" binding:"required"`
		PhoneNumber string  `json:"phone_number" binding:"required"`
		DateOfBirth string  `json:"date_of_birth" binding:"required"`
		StartDate   string  `json:"start_date" binding:"required"`
		Salary      float64 `json:"salary" binding:"required"`
		Profile     string  `json:"profile" binding:"required"`
		Email       string  `json:"email" binding:"required,email"`
		Password    string  `json:"password" binding:"required"`
		PositionID  uint    `json:"position_id" binding:"required"`
		GenderID    uint    `json:"gender_id" binding:"required"`
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
	var existingEmployee entity.Employee
	if err := db.Where("email = ?", input.Email).First(&existingEmployee).Error; err == nil {
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

	startDate, err := time.Parse("2006-01-02", input.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format"})
		return
	}

	// Hash password
	hashedPassword, hashErr := config.HashPassword(input.Password)
	if hashErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	// Fetch the Position by ID
	var position entity.Position
	if err := db.First(&position, input.PositionID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid PositionID"})
		return
	}

	// Fetch the Gender by ID
	var gender entity.Gender
	if err := db.First(&gender, input.GenderID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid GenderID"})
		return
	}

	// Determine RolesID based on PositionID
	var rolesID uint
	switch input.PositionID {
	case 2: // Employee
		rolesID = 3
	case 1, 3: // Owner or Admin
		rolesID = 4
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid PositionID"})
		return
	}

	// Create Employee object
	employee := entity.Employee{
		Firstname:   input.Firstname,
		Lastname:    input.Lastname,
		PhoneNumber: input.PhoneNumber,
		DateOfBirth: dateOfBirth,
		StartDate:   startDate,
		Salary:      input.Salary,
		Profile:     input.Profile,
		Email:       input.Email,
		Password:    hashedPassword,
		PositionID:  input.PositionID,
		GenderID:    input.GenderID,
		RolesID:     rolesID,
	}

	// Save to database
	if err := db.Create(&employee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving employee: " + err.Error()})
		return
	}

	// Respond with the created employee
	c.JSON(http.StatusCreated, gin.H{
		"message": "Employee created successfully",
		"data":    employee,
	})
}



// GetEmployee handles fetching a single employee by ID
func GetEmployee(c *gin.Context) {
	id := c.Param("id")
	var employee entity.Employee

	db := config.DB()
	if err := db.Preload("Position").Preload("Gender").Preload("Roles").First(&employee, id).Error; err != nil {
		fmt.Println("Employee not found, ID:", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	fmt.Println("Employee retrieved successfully:", employee)
	c.JSON(http.StatusOK, employee)
}

// ListEmployees handles fetching all employees
func ListEmployees(c *gin.Context) {
	var employees []entity.Employee

	db := config.DB()
	if err := db.Preload("Position").Preload("Gender").Preload("Roles").Find(&employees).Error; err != nil {
		fmt.Println("Error retrieving employees:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Employees retrieved successfully:", employees)
	c.JSON(http.StatusOK, employees)
}

// DeleteEmployee handles deleting an employee by ID
func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Delete(&entity.Employee{}, id); tx.RowsAffected == 0 {
		fmt.Println("Employee not found, ID:", id)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Employee not found"})
		return
	}

	fmt.Println("Employee deleted successfully, ID:", id)
	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}

// UpdateEmployee handles updating an existing employee by ID
func UpdateEmployee(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Firstname   string  `json:"firstname"`
		Lastname    string  `json:"lastname"`
		PhoneNumber string  `json:"phone_number"`
		DateOfBirth string  `json:"date_of_birth"`
		StartDate   string  `json:"start_date"`
		Salary      float64 `json:"salary"`
		Profile     string  `json:"profile"`
		Email       string  `json:"email"`
		Password    string  `json:"password"`
		PositionID  uint    `json:"position_id"`
		GenderID    uint    `json:"gender_id"`
	}

	// Bind JSON to the input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// Fetch the existing employee by ID
	var employee entity.Employee
	if err := db.First(&employee, id).Error; err != nil {
		fmt.Println("Employee not found, ID:", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// Update fields based on input
	if input.Firstname != "" {
		employee.Firstname = input.Firstname
	}
	if input.Lastname != "" {
		employee.Lastname = input.Lastname
	}
	if input.PhoneNumber != "" {
		employee.PhoneNumber = input.PhoneNumber
	}
	if input.DateOfBirth != "" {
		dateOfBirth, err := time.Parse("2006-01-02", input.DateOfBirth)
		if err == nil {
			employee.DateOfBirth = dateOfBirth
		} else {
			fmt.Println("Invalid date_of_birth format:", input.DateOfBirth)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date_of_birth format"})
			return
		}
	}
	if input.StartDate != "" {
		startDate, err := time.Parse("2006-01-02", input.StartDate)
		if err == nil {
			employee.StartDate = startDate
		} else {
			fmt.Println("Invalid start_date format:", input.StartDate)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start_date format"})
			return
		}
	}
	if input.Salary != 0 {
		employee.Salary = input.Salary
	}
	if input.Profile != "" {
		employee.Profile = input.Profile
	}
	if input.Email != "" {
		employee.Email = input.Email
	}
	if input.Password != "" {
		hashedPassword, hashErr := config.HashPassword(input.Password)
		if hashErr != nil {
			fmt.Println("Error hashing password:", hashErr)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
			return
		}
		employee.Password = hashedPassword
	}
	if input.PositionID != 0 {
		employee.PositionID = input.PositionID
	}
	if input.GenderID != 0 {
		employee.GenderID = input.GenderID
	}

	// Save the updated employee data
	if err := db.Save(&employee).Error; err != nil {
		fmt.Println("Error updating employee:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Employee updated successfully:", employee)

	// Respond with the updated employee
	c.JSON(http.StatusOK, gin.H{
		"message": "Employee updated successfully",
		"data":    employee,
	})
}
