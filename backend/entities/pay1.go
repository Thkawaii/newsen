package entities

import (
	"gorm.io/gorm"
)

type Pay1 struct {
	gorm.Model
	TotalAmount   float64 `valid:"required~TotalAmount is required,range(0|1000)~TotalAmount must be a positive number between 0 and 1000"`
	PaymentMethod string  `valid:"required~PaymentMethod is required,in(card|cash)~PaymentMethod must be 'card' or 'cash'"`
	BookingID     uint    `valid:"required~BookingID is required"`
	CardNumber    string  `valid:"required~Card Number is required, matches(^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$)~Card Number must be in the format '1234-5678-9012-3456'"`
	ExpiryMonth   int     `valid:"required~Expiry Month is required,range(1|12)~Expiry Month must be between 1 and 12"`
	ExpiryYear    int     `valid:"required~Expiry Year is required,range(2022|2030)~Expiry Year must be between 2022 and 2030"`
	CVV           int     `valid:"required~CVV is required,range(100|999)~CVV must be between 100 and 999"`
}
