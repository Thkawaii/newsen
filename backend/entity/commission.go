package entity

import (
	"time"
	"gorm.io/gorm"
)

type Commission struct {
	gorm.Model

	CommissionAmount float64  `json:"commission_amount"`
	CommissionTotal float64    `json:"commission_total"`                // ยอดคอมมิชชั่นรวม (หัก 30)
	CommissionDate  time.Time    `json:"commission_date"`                 // วันที่คอมมิชชั่น

	WithdrawalID    uint   `json:"withdrawal_id"`                   // รหัสการถอนเงิน (FK)
	Withdrawal      *Withdrawal `gorm:"foreignKey:WithdrawalID" json:"withdrawal"` // การเชื่อมโยงกับ Withdrawal
}
