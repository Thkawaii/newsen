package entity

import "gorm.io/gorm"

// Passenger Entity
type Passenger struct {
	gorm.Model

	//ข้อมูลส่วนตัว
	UserName   string `gorm:"uniqueIndex" valid:"required~Username is required."`
	FirstName  string `valid:"required~FirstName is required"`
	LastName   string `valid:"required~LastName is required"`
	PhoneNumber string `valid:"required~PhoneNumber is required,stringlength(10|10)~PhoneNumber must be 10 digits"`
	Email       string `valid:"required~Email is required,email~Email is invalid"`
	Password    string `json:"password"`

	//ความสัมพันธ์กับตาราง Gender
	GenderID uint   `json:"gender_id"`
	Gender   Gender `gorm:"foreignKey:GenderID" json:"gender" valid:"-"` 

	// ความสัมพันธ์กับตาราง Booking
	Bookings []Booking `gorm:"foreignKey:PassengerID" json:"bookings" valid:"-"` 

	// ความสัมพันธ์กับตาราง Message
	Messages []Message `gorm:"foreignKey:PassengerID" json:"messages" valid:"-"` // ปิดการ Validate Nested Struct

	// ความสัมพันธ์กับตาราง Role
	RoleID uint `gorm:"not null"`
	Role   Roles `gorm:"foreignKey:RoleID" valid:"-"` // ปิดการ Validate Nested Struct

	RoomChats   []RoomChat `gorm:"foreignKey:PassengerID" json:"room_chats"`
}
