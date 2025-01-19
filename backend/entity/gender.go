package entity

import (
	
	"gorm.io/gorm"
)

type Gender struct {
    gorm.Model  
    Gender string      `json:"gender"`
    Passengers []Passenger `gorm:"foreignKey:GenderID" json:"passengers"` // ความสัมพันธ์ hasMany
	
    Drivers    []Driver    `gorm:"foreignKey:GenderID" json:"drivers"` // ความสัมพันธ์ hasMany

    Employees  []Employee `gorm:"foreignKey:GenderID"`
}
