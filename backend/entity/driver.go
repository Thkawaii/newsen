package entity

import (
	"time"

	"gorm.io/gorm"
)

// Driver Entity
type Driver struct {
	gorm.Model

	//ข้อมูลส่วนตัว
	Firstname                   string    `valid:"required~Firstname is required"`
	Lastname                    string    `valid:"required~Lastname is required"`
	PhoneNumber                 string    `valid:"required~PhoneNumber is required, matches(^0[0-9]{9}$)~PhoneNumber must start with 0 and contain exactly 10 digits"`
	DateOfBirth                 time.Time `valid:"required~DateOfBirth is required"`
	IdentificationNumber        string    `valid:"required~IdentificationNumber is required, matches(^\\d{13}$)~IdentificationNumber must contain exactly 13 digits"`
	DriverLicensenumber         string    `valid:"required~DriverLicensenumber is required, matches(^\\d{8}$)~DriverLicensenumber must contain exactly 8 digits"`
	DriverLicenseExpirationDate time.Time `valid:"required~DriverLicenseExpirationDate is required"`
	Income                      float64   `valid:"required~Income is required,float~Income must be a valid number"`
	Profile                     string    `valid:"-"`
	Email                       string    `valid:"required~Email is required,email~Email is invalid"`
	Password                    string    `json:"password" valid:"required~Password is required"`

	//  ความสัมพันธ์กับตาราง Gender
	GenderID uint   `json:"gender_id"`
	Gender   Gender `gorm:"foreignKey:GenderID" json:"gender" valid:"-"`

	//  ความสัมพันธ์กับตาราง Location
	LocationID uint     `json:"location_id"`
	Location   Location `gorm:"foreignKey:LocationID" json:"location" valid:"-"`

	//  ความสัมพันธ์กับตาราง Vehicle
	VehicleID uint    `json:"vehicle_id"`
	Vehicle   Vehicle `gorm:"foreignKey:VehicleID" json:"vehicle" valid:"-"`

	//  ความสัมพันธ์กับตาราง Employee
	EmployeeID uint     `json:"employee_id"`
	Employee   Employee `gorm:"foreignKey:EmployeeID" json:"employee" valid:"-"`

	//  ความสัมพันธ์กับตาราง Status
	DriverStatusID uint   `json:"driverstatus_id"`
	DriverStatus   DriverStatus `gorm:"foreignKey:DriverStatusID" json:"driverstatus" valid:"-"`

	//  ความสัมพันธ์กับตาราง Booking
	Bookings []Booking `gorm:"foreignKey:DriverID" json:"bookings" valid:"-"`

	//  ความสัมพันธ์กับตาราง Message
	Messages []Message `gorm:"foreignKey:DriverID" json:"messages" valid:"-"`

	RoomChats   []RoomChat `gorm:"foreignKey:PassengerID" json:"room_chats"`

	//  ความสัมพันธ์กับตาราง Role
	RoleID uint  `gorm:"not null"`
	Role   Roles `gorm:"foreignKey:RoleID" valid:"-"`
}
