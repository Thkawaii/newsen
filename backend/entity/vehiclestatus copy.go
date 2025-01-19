package entity

import "gorm.io/gorm"

type VehicleStatus struct {
	gorm.Model   
    Status string    `json:"status_name"`
	
    Vehicles      []Vehicle `gorm:"foreignKey:VehicleStatusID" json:"vehicles"` // ความสัมพันธ์ hasMany
}