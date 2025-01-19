package entity

import "gorm.io/gorm"

type RoomChat struct {
	gorm.Model

	BookingID   uint       `json:"booking_id"`
	Booking     Booking    `gorm:"foreignKey:BookingID" json:"booking"`

	PassengerID uint       `json:"passenger_id"`
	Passenger   Passenger  `gorm:"foreignKey:PassengerID" json:"passenger"`

	DriverID    uint       `json:"driver_id"`
	Driver      Driver     `gorm:"foreignKey:DriverID" json:"driver"`

	Messages    []Message  `gorm:"foreignKey:RoomID;constraint:OnDelete:CASCADE" json:"messages"`
}
