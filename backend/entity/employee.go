package entity

import (
	"time"

	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	Firstname   string    `valid:"required~FirstName is required"`
	Lastname    string    `valid:"required~Lastname is required"`
	PhoneNumber string    `valid:"required~PhoneNumber is required, matches(^0[0-9]{9}$)~PhoneNumber must start with 0 and contain exactly 10 digits"`
	DateOfBirth time.Time `valid:"required~DateOfBirth is required"`
	StartDate   time.Time `valid:"required~StartDate is required"`
	Salary      float64   `valid:"required~Salary is required,float~Salary must be a valid number"`
	Profile     string    `valid:"-"`
	Email       string    `valid:"required~Email is required, email~Email is invalid"`
	Password    string    `json:"password" valid:"required~Password is required"`

	PositionID uint     `valid:"required~Position is required"`
	Position   Position `gorm:"foreignKey:PositionID"`

	GenderID uint   `valid:"required~Gender is required"`
	Gender   Gender `gorm:"foreignKey:GenderID"`

	RolesID uint  `valid:"required~Role is required"`
	Roles   Roles `gorm:"foreignKey:RolesID"`
}
