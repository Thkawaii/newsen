package entity

import (
	"time"
	"gorm.io/gorm"
)

// Message Entity
type Message struct {
	gorm.Model

	Content      string    `json:"content" valid:"required~Content is required."`
	MessageType  string    `json:"message_type" valid:"required~Message Type is required."` // เช่น text, image, video
	ReadStatus   bool      `json:"read_status" valid:"-"`
	SendTime     time.Time `json:"send_time" valid:"required~Send Time is required."`
	SenderID     uint      `json:"sender_id" valid:"required~Sender ID is required."`
	SenderType   string    `json:"sender_type" valid:"required~Sender Type is required."` // เช่น Passenger, Driver

	
	RoomID       uint      `json:"room_id" valid:"required~Room ID is required."`
	RoomChat     RoomChat  `gorm:"foreignKey:RoomID" json:"room_chat" valid:"-"`

	PassengerID  uint      `json:"passenger_id" valid:"-"`
	Passenger    Passenger `gorm:"foreignKey:PassengerID" json:"passenger" valid:"-"`


	BookingID    uint      `json:"booking_id" valid:"-"`
	Booking      Booking   `gorm:"foreignKey:BookingID" json:"booking" valid:"-"`


	DriverID     uint      `json:"driver_id" valid:"-"`
	Driver       Driver    `gorm:"foreignKey:DriverID" json:"driver" valid:"-"`
}
