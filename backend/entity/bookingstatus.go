package entity

import (
	"gorm.io/gorm"
)

// BookingStatus Entity
type BookingStatus struct {
	gorm.Model
	StatusBooking string `json:"status_booking" valid:"required~StatusBooking is required."` // เช่น pending, confirmed, completed, canceled
	BookingID uint    `json:"booking_id" valid:"required~Booking ID is required."`
	Booking   Booking `gorm:"foreignKey:BookingID" json:"booking" valid:"-"`
}
