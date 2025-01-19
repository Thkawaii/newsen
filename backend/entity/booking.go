package entity

import (
	"gorm.io/gorm"
)

// Booking Entity
type Booking struct {
	gorm.Model
	Beginning     string  `json:"beginning" valid:"required~Beginning is required."`
	Terminus      string  `json:"terminus" valid:"required~Terminus is required."`
	StartTime     string  `json:"start_time" valid:"required~Start time is required."`
	EndTime       string  `json:"end_time" valid:"required~End time is required."`
	Distance      float64 `json:"distance" valid:"float,required~Distance is required."`
	TotalPrice    float64 `json:"total_price" valid:"float,required~Total price is required."`
	BookingTime   string  `json:"booking_time" valid:"required~Booking time is required."`
	BookingStatus string  `json:"booking_status" valid:"required~Booking status is required."` // เช่น pending, confirmed, completed, canceled

	Vehicle       string  `json:"vehicle" valid:"required~Vehicle is required."`
	ReminderTime  string  `json:"reminder_time" valid:"-"` // Optional for pre-booking
	Notes         string  `json:"notes" valid:"-"`        // Optional for pre-booking

	PassengerID uint `json:"passenger_id" valid:"required~PassengerID is required."`
	Passenger   Passenger `gorm:"foreignKey:PassengerID" json:"passenger" valid:"-"`

	DriverID uint `json:"driver_id" valid:"-"` // Optional for pre-booking
	Driver   Driver `gorm:"foreignKey:DriverID" json:"driver" valid:"-"`

	Messages []Message `gorm:"foreignKey:BookingID" json:"messages" valid:"-"`

	StartLocationID uint `json:"start_location_id" valid:"required~Start Location is required."`
	StartLocation   StartLocation `gorm:"foreignKey:StartLocationID" json:"start_location" valid:"-"`

	DestinationID uint `json:"destination_id" valid:"required~Destination is required."`
	Destination   Destination `gorm:"foreignKey:DestinationID" json:"destination" valid:"-"`
}
