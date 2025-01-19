package entity

import (
	"gorm.io/gorm"
)

type Rooms struct {
	gorm.Model
	RoomName        string    `json:"room_name" valid:"required~RoomName is required"`
	Capacity        uint8     `json:"capacity" valid:"required~Capacity is required"`
	CurrentBookings uint8     `json:"current_bookings"`
	TrainerID       uint      `json:"trainer_id" valid:"required~TrainerID is required"`
	Trainer         *Trainers `gorm:"foreignKey:TrainerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"trainer"`
	Detail          string    `json:"detail" valid:"required~Detail is required"`
	Title           string    `json:"title" valid:"required~title is required"`
}
