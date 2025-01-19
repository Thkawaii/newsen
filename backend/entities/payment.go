package entities

type Payment struct {
	PaymentID     int     `json:"payment_id" gorm:"primaryKey"`
	PaymentAmount float64 `json:"payment_amount"`
	PaymentMethod string  `json:"payment_method"`
	PaymentDate   string  `json:"payment_date"`
	BookingID     int     `json:"booking_id"`
	PromotionID   *int    `json:"promotion_id"`
}

type Paid struct {
	ID        int    `json:"id" gorm:"primaryKey"`
	CardType  string `json:"card_type"`
	PaymentID int    `json:"payment_id"`
}
