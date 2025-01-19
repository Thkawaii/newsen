package entity

import "gorm.io/gorm"

type DriverStatus struct {
	gorm.Model   
    Status string    `json:"status_name"`
	
    Drivers    []Driver  `gorm:"foreignKey:DriverStatusID" json:"drivers"` // ความสัมพันธ์ hasMany
}