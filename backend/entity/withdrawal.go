package entity

import (
	"gorm.io/gorm"
	"time"
)

type Withdrawal struct {
	gorm.Model

	WithdrawalAmount     int       `json:"withdrawal_amount" valid:"required"`      // จำนวนเงินที่ถอน
	WithdrawalCommission float64   `json:"withdrawal_commission" valid:"required"`  // ค่าคอมมิชชั่นจากการถอน (หัก 30)
	WithdrawalNetAmount  float64   `json:"withdrawal_net_amount" valid:"required"`  // จำนวนเงินสุทธิหลังหักค่าคอมมิชชั่น
	WithdrawalBankNumber string    `json:"withdrawal_bank_number" valid:"required"` // หมายเลขบัญชีธนาคาร
	WithdrawalDate       time.Time `json:"withdrawal_date" valid:"required"`        // วันที่ทำการถอน

	BankNameID uint      `json:"bank_name_id" valid:"required"` // ชื่อธนาคารที่ถอนเงิน
	BankName   *BankName `gorm:"foreignKey: bank_name_id" json:"bank_name"`

	DriverID uint `json:"driver_id" valid:"required"` // เก็บ DriverID
	Driver   *Driver `gorm:"foreignKey:DriverID" json:"driver"`
}
