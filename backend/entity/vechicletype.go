package entity

import "gorm.io/gorm"

type VehicleType struct {
	gorm.Model   
    VehicleType 	string `json:"vehicle_type" valid:"required~VehicleType is required."`
    
    Vehicles      []Vehicle `gorm:"foreignKey:VehicleTypeID" json:"vehicles"` // ความสัมพันธ์ hasMany
}