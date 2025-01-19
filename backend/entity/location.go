package entity

import "gorm.io/gorm"

// Location Entity
type Location struct {
	gorm.Model

	Latitude  float64 `json:"latitude" valid:"required~Latitude is required,float~Latitude must be a valid number"`
	Longitude float64 `json:"longitude" valid:"required~Longitude is required,float~Longitude must be a valid number"`
	Address   string  `json:"address" valid:"required~Address is required"`
	Province  string  `json:"province" valid:"required~Province is required"`
	Place     string  `json:"place" valid:"required~Place is required"`
	Timestamp string  `json:"timestamp" valid:"required~Timestamp is required"`
	DriverID  int     `json:"driver_id" valid:"required~DriverID is required,int~DriverID must be an integer"`

	Drivers []Driver `gorm:"foreignKey:LocationID" json:"drivers"`
}
