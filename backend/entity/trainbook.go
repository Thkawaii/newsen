package entity

import (
	"gorm.io/gorm"
)

type TrainBook struct {
	gorm.Model
	RoomID   uint   `json:"room_id" valid:"required~RoomID is required"`
	Room     Rooms  `gorm:"foreignKey:RoomID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"room"`

	Status   string `json:"status" valid:"required~Status is required,matches(^(completed|in-progress|pending)$)~Status must be 'completed', 'in-progress' or 'pending'"`

	DriverID uint   `json:"driver_id" valid:"required~DriverID is required"`
	Driver   Driver `gorm:"foreignKey:DriverID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"driver"` // ✅ เปลี่ยน `SET NULL` เป็น `CASCADE`
}
