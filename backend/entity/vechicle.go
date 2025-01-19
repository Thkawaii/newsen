package entity

import "gorm.io/gorm"
import "time"

type Vehicle struct {
	gorm.Model
	LicensePlate       				string
    Brand        					string      `valid:"required~Brand is required"`
    VehicleModel     				string      `valid:"required~VehicleModel is required"`
	Color     						string      `valid:"required~Color is required"`
    DateOfPurchase        			time.Time       `valid:"required~DateOfPurchase is required"`
    ExpirationDateOfVehicleAct      time.Time       `valid:"required~ExpirationDateOfVehicleAct is required"`
    Capacity        				int     `valid:"required~Capacity is required"`
    
    VehicleTypeID       uint        `valid:"required~VehicleType is required"`
    VehicleType         VehicleType `gorm:"foreignKey:VehicleTypeID"`

    EmployeeID         uint        `valid:"required~Employee is required"`
    Employee           Employee   `gorm:"foreignKey:EmployeeID"`

	VehicleStatusID         uint      `valid:"required~Status is required"`
    VehicleStatus           VehicleStatus   `gorm:"foreignKey:VehicleStatusID"`
	
    Drivers       []Driver  `gorm:"foreignKey:VehicleID" json:"drivers"` // ความสัมพันธ์ hasMany
}

