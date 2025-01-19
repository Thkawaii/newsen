package entity

import "gorm.io/gorm"

type StartLocation struct {
    gorm.Model
    Latitude  float64 `json:"latitude" valid:"required~Latitude is required,float~Latitude must be a valid number"`
    Longitude float64 `json:"longitude" valid:"required~Longitude is required,float~Longitude must be a valid number"`
    Province  string  `json:"province" valid:"required~Province is required"`
    Place     string  `json:"place" valid:"required~Place is required"`
    Address   string  `json:"address"` // อาจไม่บังคับ
}
