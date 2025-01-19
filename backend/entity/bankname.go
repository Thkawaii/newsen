package entity

import "gorm.io/gorm"

type BankName struct {

   gorm.Model

   BankName string  `json:"bank_name"` // ชื่อธนาคารต่างๆ

}