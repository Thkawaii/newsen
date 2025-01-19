package entity

import (
	"time"

	"gorm.io/gorm"
)

type Trainers struct {
	gorm.Model

	FirstName string    `json:"first_name" valid:"required~FirstName is required"`
	LastName  string    `json:"last_name" valid:"required~LastName is required"`
	Email     string    `json:"email" valid:"required~Email is required,email~Email is invalid"`
	BirthDay  time.Time `json:"birthday" valid:"required~DateOfBirth is required"`
	GenderID  uint      `json:"gender_id" valid:"required~GenderID is required"`
	Gender    *Gender   `gorm:"foreignKey:GenderID" json:"gender"`
	RoleID    uint      `gorm:"not null" valid:"required~RoleID is required"`
	Role      Roles     `gorm:"foreignKey:RoleID"`
}