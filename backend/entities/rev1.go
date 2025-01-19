package entities

import (
	"gorm.io/gorm"
)

type Rev1 struct {
	gorm.Model
	ReviewID    int    `json:"review_id" gorm:"primaryKey"`
	Rating      int    `json:"rating" valid:"range(1|5)"`
	Comment     string `json:"comment" valid:"required"`
	BookingID   int    `json:"booking_id"`
	Feedback    string `json:"feedback" valid:"required"`
}
